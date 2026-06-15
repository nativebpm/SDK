<?php

namespace NativeBPM\Client\Builder;

class Workflow {
    private string $id;
    private string $name;
    private array $nodes = [];
    private array $flows = [];
    private ?\Throwable $err = null;
    private ?string $decompressedWasmBytes = null;
    private string $currentNodeID = '';
    public array $pendingMerges = [];

    public function __construct(string $id, string $name, $wasmInput = null) {
        $this->id = $id;
        $this->name = $name;
        if ($wasmInput !== null) {
            try {
                if (is_string($wasmInput) && strlen($wasmInput) < 1000 && file_exists($wasmInput)) {
                    $data = file_get_contents($wasmInput);
                    $this->decompressedWasmBytes = self::decompressWasmIfNeeded($data);
                } else if (is_string($wasmInput) || (is_object($wasmInput) && method_exists($wasmInput, '__toString')) || is_scalar($wasmInput)) {
                    // String/binary input
                    $this->decompressedWasmBytes = self::decompressWasmIfNeeded((string)$wasmInput);
                } else {
                    throw new \InvalidArgumentException("Unsupported wasm input type");
                }
            } catch (\Throwable $t) {
                $this->err = $t;
            }
        }
    }

    public static function decompressWasmIfNeeded(string $data): string {
        if (strlen($data) >= 4 && substr($data, 0, 4) === "\x00asm") {
            return $data;
        }
        // Gzip check
        if (strlen($data) >= 2 && ord($data[0]) === 0x1f && ord($data[1]) === 0x8b) {
            $decompressed = @gzdecode($data);
            if ($decompressed !== false) {
                return $decompressed;
            }
            throw new \Exception("Failed to decompress gzip wasm");
        }
        // Zip check
        if (strlen($data) >= 4 && substr($data, 0, 4) === "PK\x03\x04") {
            $tempFile = tempnam(sys_get_temp_dir(), 'wasm_zip');
            file_put_contents($tempFile, $data);
            try {
                $zip = new \ZipArchive();
                if ($zip->open($tempFile) === true) {
                    try {
                        for ($i = 0; $i < $zip->numFiles; $i++) {
                            $name = $zip->getNameIndex($i);
                            if (str_ends_with($name, '.wasm')) {
                                return $zip->getFromIndex($i);
                            }
                        }
                    } finally {
                        $zip->close();
                    }
                }
                throw new \Exception("no .wasm file found inside zip archive");
            } finally {
                if (file_exists($tempFile)) {
                    unlink($tempFile);
                }
            }
        }
        // Brotli check
        if (function_exists('brotli_uncompress')) {
            try {
                $decompressed = @brotli_uncompress($data);
                if ($decompressed !== false && strlen($decompressed) >= 4 && substr($decompressed, 0, 4) === "\x00asm") {
                    return $decompressed;
                }
            } catch (\Throwable $t) {
                // ignore
            }
        }
        throw new \Exception("unsupported or invalid WebAssembly binary format (failed to decompress or identify magic header)");
    }

    public function builder(): Workflow {
        return $this;
    }

    public function startEvent(string $id): StartEventBuilder {
        $this->nodes[] = [
            'type' => 'startEvent',
            'id' => $id,
            'name' => 'Start'
        ];
        return new StartEventBuilder($this, $id);
    }

    public function endEvent(string $id, string $name): Workflow {
        $this->nodes[] = [
            'type' => 'endEvent',
            'id' => $id,
            'name' => $name
        ];
        return $this;
    }

    public function serviceTask(string $id, string $name, string $topic): ServiceTaskBuilder {
        $this->nodes[] = [
            'type' => 'serviceTask',
            'id' => $id,
            'name' => $name,
            'topic' => $topic
        ];
        return new ServiceTaskBuilder($this, $id);
    }

    public function aiTask(string $id, string $name): AITaskBuilder {
        $this->nodes[] = [
            'type' => 'aiServiceTask',
            'id' => $id,
            'name' => $name
        ];
        return new AITaskBuilder($this, $id);
    }

    public function userTask(string $id, string $name): UserTaskBuilder {
        $this->nodes[] = [
            'type' => 'userTask',
            'id' => $id,
            'name' => $name
        ];
        return new UserTaskBuilder($this, $id);
    }

    public function exclusiveGateway(string $id, string $name): ExclusiveGatewayBuilder {
        $this->nodes[] = [
            'type' => 'exclusiveGateway',
            'id' => $id,
            'name' => $name
        ];
        return new ExclusiveGatewayBuilder($this, $id);
    }

    public function parallelGateway(string $id, string $name): ParallelGatewayBuilder {
        $this->nodes[] = [
            'type' => 'parallelGateway',
            'id' => $id,
            'name' => $name
        ];
        return new ParallelGatewayBuilder($this, $id);
    }

    public function eventBasedGateway(string $id, string $name): EventBasedGatewayBuilder {
        $this->nodes[] = [
            'type' => 'eventBasedGateway',
            'id' => $id,
            'name' => $name
        ];
        return new EventBasedGatewayBuilder($this, $id);
    }

    public function callActivity(string $id, string $name, string $calledElement): CallActivityBuilder {
        $this->nodes[] = [
            'type' => 'callActivity',
            'id' => $id,
            'name' => $name,
            'calledElement' => $calledElement
        ];
        return new CallActivityBuilder($this, $id);
    }

    public function businessRuleTask(string $id, string $name, string $decisionRef): BusinessRuleTaskBuilder {
        $this->nodes[] = [
            'type' => 'businessRuleTask',
            'id' => $id,
            'name' => $name,
            'decisionRef' => $decisionRef
        ];
        return new BusinessRuleTaskBuilder($this, $id);
    }

    public function sequenceFlow(string $source, string $target): Workflow {
        $this->flows[] = [
            'id' => "flow-$source-$target",
            'source' => $source,
            'target' => $target,
            'condition' => ''
        ];
        return $this;
    }

    public function sequenceFlowWithCondition(string $source, string $target, string $condition): Workflow {
        $this->flows[] = [
            'id' => "flow-$source-$target",
            'source' => $source,
            'target' => $target,
            'condition' => $condition
        ];
        return $this;
    }

    public function findNode(string $id): ?array {
        foreach ($this->nodes as $key => $node) {
            if ($node['id'] === $id) {
                return $node;
            }
        }
        return null;
    }

    public function updateNode(string $id, array $updatedNode): void {
        foreach ($this->nodes as $key => $node) {
            if ($node['id'] === $id) {
                $this->nodes[$key] = $updatedNode;
                return;
            }
        }
    }

    public function toAST(): array {
        $nodesCopy = $this->nodes;
        $flowsCopy = $this->flows;

        $sourceIds = [];
        foreach ($this->flows as $f) {
            if (isset($f['source'])) {
                $sourceIds[$f['source']] = true;
            }
        }

        foreach ($this->nodes as $node) {
            $nodeType = $node['type'] ?? '';
            $nodeId = $node['id'] ?? '';
            if ($nodeType === 'endEvent' || $nodeType === 'startEvent') {
                continue;
            }
            if (!isset($sourceIds[$nodeId])) {
                $endId = "end_" . $nodeId;
                $nodesCopy[] = [
                    'type' => 'endEvent',
                    'id' => $endId,
                    'name' => 'Process Finished'
                ];
                $flowsCopy[] = [
                    'id' => "flow-" . $nodeId . "-" . $endId,
                    'source' => $nodeId,
                    'target' => $endId,
                    'condition' => ''
                ];
            }
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'nodes' => $nodesCopy,
            'flows' => $flowsCopy
        ];
    }

    public function buildXML($wasmInput = null): string {
        if ($this->err !== null) {
            throw $this->err;
        }

        $wasmBytes = $this->decompressedWasmBytes;
        if ($wasmBytes === null) {
            if ($wasmInput !== null) {
                if (is_string($wasmInput)) {
                    if (file_exists($wasmInput)) {
                        $data = file_get_contents($wasmInput);
                        $wasmBytes = self::decompressWasmIfNeeded($data);
                    } else {
                        $wasmBytes = self::decompressWasmIfNeeded($wasmInput);
                    }
                } else {
                    $wasmBytes = self::decompressWasmIfNeeded((string)$wasmInput);
                }
            } else {
                // Fallback to core.wasm inside php library lib/ directory
                $fallbackPath = __DIR__ . '/../core.wasm';
                if (!file_exists($fallbackPath)) {
                    throw new \Exception("Embedded core.wasm not found. Please specify wasmInput.");
                }
                $wasmBytes = self::decompressWasmIfNeeded(file_get_contents($fallbackPath));
            }
        }

        // Write decompressed wasm bytes to temporary file for executing via CLI
        $tempWasmFile = tempnam(sys_get_temp_dir(), 'core_wasm');
        file_put_contents($tempWasmFile, $wasmBytes);

        try {
            $astJson = json_encode($this->toAST());

            $descriptorspec = [
                0 => ["pipe", "r"], // stdin
                1 => ["pipe", "w"], // stdout
                2 => ["pipe", "w"]  // stderr
            ];

            // Execute wasmtime run tempWasmFile --cli
            $cmd = "wasmtime run " . escapeshellarg($tempWasmFile) . " --cli";
            $process = proc_open($cmd, $descriptorspec, $pipes);

            if (!is_resource($process)) {
                throw new \Exception("Failed to execute wasmtime command: $cmd. Ensure wasmtime CLI is installed.");
            }

            // Write AST JSON to stdin
            fwrite($pipes[0], $astJson);
            fclose($pipes[0]);

            // Read stdout and stderr
            $stdout = stream_get_contents($pipes[1]);
            fclose($pipes[1]);

            $stderr = stream_get_contents($pipes[2]);
            fclose($pipes[2]);

            $status = proc_close($process);
            if ($status !== 0) {
                throw new \Exception("wasmtime compilation process exited with code $status. Stderr: $stderr");
            }

            $result = json_decode($stdout, true);
            if ($result === null) {
                throw new \Exception("Failed to decode JSON output from wasm compiler: $stdout");
            }

            if (isset($result['error']) && $result['error'] !== '') {
                throw new \Exception("Wasm workflow compilation failed: " . $result['error']);
            }

            return $result['xml'];
        } finally {
            if (file_exists($tempWasmFile)) {
                unlink($tempWasmFile);
            }
        }
    }

    private function connectNode(string $nodeId): void {
        $node = $this->findNode($nodeId);
        $hasStart = false;
        foreach ($this->nodes as $n) {
            if (($n['type'] ?? '') === 'startEvent') {
                $hasStart = true;
                break;
            }
        }
        if (!$hasStart && $node !== null && ($node['type'] ?? '') !== 'startEvent') {
            $this->startEvent('start');
            $this->sequenceFlow('start', $nodeId);
            $this->currentNodeID = $nodeId;
            return;
        }

        if (count($this->pendingMerges) > 0) {
            foreach ($this->pendingMerges as $sourceId) {
                $this->sequenceFlow($sourceId, $nodeId);
            }
            $this->pendingMerges = [];
        } else if ($this->currentNodeID !== '' && $this->currentNodeID !== $nodeId) {
            $this->sequenceFlow($this->currentNodeID, $nodeId);
        }
        $this->currentNodeID = $nodeId;
    }

    public function start(string $id = 'start'): Workflow {
        $this->startEvent($id);
        $this->connectNode($id);
        return $this;
    }

    public function end(string $id, string $name): Workflow {
        $this->endEvent($id, $name);
        $this->connectNode($id);
        $this->currentNodeID = '';
        return $this;
    }

    public function user(string $id, string $name, ?callable $config = null): Workflow {
        $builder = $this->userTask($id, $name);
        if ($config !== null) {
            $config($builder);
        }
        $this->connectNode($id);
        return $this;
    }

    public function service(string $id, string $name, string $topic, ?callable $config = null): Workflow {
        $builder = $this->serviceTask($id, $name, $topic);
        if ($config !== null) {
            $config($builder);
        }
        $this->connectNode($id);
        return $this;
    }

    public function ai(string $id, string $name, ?callable $config = null): Workflow {
        $builder = $this->aiTask($id, $name);
        if ($config !== null) {
            $config($builder);
        }
        $this->connectNode($id);
        return $this;
    }

    public function when($condition): WhenBuilder {
        $gwID = "gw_" . $this->currentNodeID . "_decision";
        $this->exclusiveGateway($gwID, "Decision Gateway");
        $this->connectNode($gwID);
        return new WhenBuilder($this, $gwID, (string)$condition);
    }

    public static function V(string $name): Variable {
        return new Variable($name);
    }

    public static function v(string $name): Variable {
        return new Variable($name);
    }

    public static function var(string $name): Variable {
        return new Variable($name);
    }
}

class StartEventBuilder {
    private Workflow $workflow;
    private string $id;

    public function __construct(Workflow $workflow, string $id) {
        $this->workflow = $workflow;
        $this->id = $id;
    }

    public function next(string $targetID): Workflow {
        return $this->workflow->sequenceFlow($this->id, $targetID);
    }

    public function connectTo(string $targetID): Workflow {
        return $this->next($targetID);
    }

    public function builder(): Workflow {
        return $this->workflow;
    }
}

class ServiceTaskBuilder {
    private Workflow $workflow;
    private string $id;

    public function __construct(Workflow $workflow, string $id) {
        $this->workflow = $workflow;
        $this->id = $id;
    }

    public function wasmPath(string $path): ServiceTaskBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            $node['wasmPath'] = $path;
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function wasm(string $alias): ServiceTaskBuilder {
        return $this->wasmPath($alias);
    }

    public function next(string $targetID): Workflow {
        return $this->workflow->sequenceFlow($this->id, $targetID);
    }

    public function connectTo(string $targetID): Workflow {
        return $this->next($targetID);
    }

    public function builder(): Workflow {
        return $this->workflow;
    }
}

class AITaskBuilder {
    private Workflow $workflow;
    private string $id;

    public function __construct(Workflow $workflow, string $id) {
        $this->workflow = $workflow;
        $this->id = $id;
    }

    public function provider(string $provider): AITaskBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            $node['provider'] = $provider;
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function model(string $model): AITaskBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            $node['model'] = $model;
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function prompt(string $prompt): AITaskBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            $node['prompt'] = $prompt;
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function systemInstruction(string $systemInstruction): AITaskBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            $node['systemInstruction'] = $systemInstruction;
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function responseSchema(string $responseSchema): AITaskBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            $node['responseSchema'] = $responseSchema;
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function temperature(float $temperature): AITaskBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            $node['temperature'] = $temperature;
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function resultVar(string $resultVar): AITaskBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            $node['resultVar'] = $resultVar;
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function next(string $targetID): Workflow {
        return $this->workflow->sequenceFlow($this->id, $targetID);
    }

    public function connectTo(string $targetID): Workflow {
        return $this->next($targetID);
    }

    public function builder(): Workflow {
        return $this->workflow;
    }
}

class UserTaskBuilder {
    private Workflow $workflow;
    private string $id;

    public function __construct(Workflow $workflow, string $id) {
        $this->workflow = $workflow;
        $this->id = $id;
    }

    public function assignee(string $assignee): UserTaskBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            $node['assignee'] = $assignee;
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function candidateGroups(string $candidateGroups): UserTaskBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            $node['candidateGroups'] = $candidateGroups;
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function dueDate(string $dueDate): UserTaskBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            $node['dueDate'] = $dueDate;
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function next(string $targetID): Workflow {
        return $this->workflow->sequenceFlow($this->id, $targetID);
    }

    public function connectTo(string $targetID): Workflow {
        return $this->next($targetID);
    }

    public function builder(): Workflow {
        return $this->workflow;
    }
}

class ExclusiveGatewayBuilder {
    private Workflow $workflow;
    private string $id;

    public function __construct(Workflow $workflow, string $id) {
        $this->workflow = $workflow;
        $this->id = $id;
    }

    public function next(string $targetID): Workflow {
        return $this->workflow->sequenceFlow($this->id, $targetID);
    }

    public function nextWithCondition(string $targetID, string $condition): Workflow {
        return $this->workflow->sequenceFlowWithCondition($this->id, $targetID, $condition);
    }

    public function condition(string $targetID, string $condition): ExclusiveGatewayBuilder {
        $this->workflow->sequenceFlowWithCondition($this->id, $targetID, $condition);
        return $this;
    }

    public function defaultValue(string $targetID): ExclusiveGatewayBuilder {
        $this->workflow->sequenceFlow($this->id, $targetID);
        return $this;
    }

    public function connectTo(string $targetID): Workflow {
        return $this->next($targetID);
    }

    public function builder(): Workflow {
        return $this->workflow;
    }
}

class ParallelGatewayBuilder {
    private Workflow $workflow;
    private string $id;

    public function __construct(Workflow $workflow, string $id) {
        $this->workflow = $workflow;
        $this->id = $id;
    }

    public function next(string $targetID): Workflow {
        return $this->workflow->sequenceFlow($this->id, $targetID);
    }

    public function connectTo(string $targetID): Workflow {
        return $this->next($targetID);
    }

    public function builder(): Workflow {
        return $this->workflow;
    }
}

class EventBasedGatewayBuilder {
    private Workflow $workflow;
    private string $id;

    public function __construct(Workflow $workflow, string $id) {
        $this->workflow = $workflow;
        $this->id = $id;
    }

    public function next(string $targetID): Workflow {
        return $this->workflow->sequenceFlow($this->id, $targetID);
    }

    public function connectTo(string $targetID): Workflow {
        return $this->next($targetID);
    }

    public function builder(): Workflow {
        return $this->workflow;
    }
}

class CallActivityBuilder {
    private Workflow $workflow;
    private string $id;

    public function __construct(Workflow $workflow, string $id) {
        $this->workflow = $workflow;
        $this->id = $id;
    }

    public function in(string $source, string $target): CallActivityBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            if (!isset($node['inVariables'])) {
                $node['inVariables'] = [];
            }
            $node['inVariables'][] = [
                'source' => $source,
                'target' => $target,
                'variables' => '',
                'local' => false
            ];
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function inAll(): CallActivityBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            if (!isset($node['inVariables'])) {
                $node['inVariables'] = [];
            }
            $node['inVariables'][] = [
                'source' => '',
                'target' => '',
                'variables' => 'all',
                'local' => false
            ];
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function out(string $source, string $target): CallActivityBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            if (!isset($node['outVariables'])) {
                $node['outVariables'] = [];
            }
            $node['outVariables'][] = [
                'source' => $source,
                'target' => $target,
                'variables' => ''
            ];
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function outAll(): CallActivityBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            if (!isset($node['outVariables'])) {
                $node['outVariables'] = [];
            }
            $node['outVariables'][] = [
                'source' => '',
                'target' => '',
                'variables' => 'all'
            ];
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function next(string $targetID): Workflow {
        return $this->workflow->sequenceFlow($this->id, $targetID);
    }

    public function connectTo(string $targetID): Workflow {
        return $this->next($targetID);
    }

    public function builder(): Workflow {
        return $this->workflow;
    }
}

class BusinessRuleTaskBuilder {
    public Workflow $workflow;
    public string $id;

    public function __construct(Workflow $workflow, string $id) {
        $this->workflow = $workflow;
        $this->id = $id;
    }

    public function mapDecisionResult(string $mapDecisionResult): BusinessRuleTaskBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            $node['mapDecisionResult'] = $mapDecisionResult;
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function resultVariable(string $resultVar): BusinessRuleTaskBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            $node['resultVar'] = $resultVar;
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function hitPolicy(string $hitPolicy): BusinessRuleTaskBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            $node['hitPolicy'] = $hitPolicy;
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function input(string $expression, string $type): BusinessRuleTaskBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            if (!isset($node['inputs'])) {
                $node['inputs'] = [];
            }
            $node['inputs'][] = [
                'expression' => $expression,
                'type' => $type
            ];
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function output(string $name, string $type): BusinessRuleTaskBuilder {
        $node = $this->workflow->findNode($this->id);
        if ($node !== null) {
            if (!isset($node['outputs'])) {
                $node['outputs'] = [];
            }
            $node['outputs'][] = [
                'name' => $name,
                'type' => $type
            ];
            $this->workflow->updateNode($this->id, $node);
        }
        return $this;
    }

    public function rule(): DMNRuleBuilder {
        return new DMNRuleBuilder($this);
    }

    public function next(string $targetID): Workflow {
        return $this->workflow->sequenceFlow($this->id, $targetID);
    }

    public function connectTo(string $targetID): Workflow {
        return $this->next($targetID);
    }

    public function builder(): Workflow {
        return $this->workflow;
    }
}

class DMNRuleBuilder {
    private BusinessRuleTaskBuilder $taskBuilder;
    private array $inputs = [];
    private array $outputs = [];

    public function __construct(BusinessRuleTaskBuilder $taskBuilder) {
        $this->taskBuilder = $taskBuilder;
    }

    public function when(string $expression, $val): DMNRuleBuilder {
        $this->inputs[$expression] = $this->formatDMNValue($val);
        return $this;
    }

    public function then(string $name, $val): DMNRuleBuilder {
        $this->outputs[$name] = $this->formatDMNValue($val);
        return $this;
    }

    private function commit(): void {
        $wf = $this->taskBuilder->builder();
        $node = $wf->findNode($this->taskBuilder->id);
        if ($node !== null) {
            if (!isset($node['rules'])) {
                $node['rules'] = [];
            }

            $inputsList = $node['inputs'] ?? [];
            $outputsList = $node['outputs'] ?? [];

            $ruleInputs = [];
            foreach ($inputsList as $inVal) {
                $expr = $inVal['expression'];
                if (array_key_exists($expr, $this->inputs)) {
                    $ruleInputs[] = $this->inputs[$expr];
                } else {
                    $ruleInputs[] = "-";
                }
            }

            $ruleOutputs = [];
            foreach ($outputsList as $outVal) {
                $name = $outVal['name'];
                if (array_key_exists($name, $this->outputs)) {
                    $ruleOutputs[] = $this->outputs[$name];
                } else {
                    $ruleOutputs[] = "-";
                }
            }

            $node['rules'][] = [
                'inputs' => $ruleInputs,
                'outputs' => $ruleOutputs
            ];
            $wf->updateNode($this->taskBuilder->id, $node);
        }
    }

    public function rule(): DMNRuleBuilder {
        $this->commit();
        return $this->taskBuilder->rule();
    }

    public function next(string $targetID): Workflow {
        $this->commit();
        return $this->taskBuilder->next($targetID);
    }

    public function connectTo(string $targetID): Workflow {
        return $this->next($targetID);
    }

    public function builder(): Workflow {
        $this->commit();
        return $this->taskBuilder->builder();
    }

    public function mapDecisionResult(string $mapDecisionResult): BusinessRuleTaskBuilder {
        $this->commit();
        return $this->taskBuilder->mapDecisionResult($mapDecisionResult);
    }

    public function resultVariable(string $resultVar): BusinessRuleTaskBuilder {
        $this->commit();
        return $this->taskBuilder->resultVariable($resultVar);
    }

    private function formatDMNValue($val): string {
        if ($val === null) {
            return "-";
        }
        if (is_string($val)) {
            $s = trim($val);
            foreach (["<=", ">=", "!=", "<>", "<", ">"] as $op) {
                if (str_starts_with($s, $op)) {
                    return $s;
                }
            }
            if ($s === "true" || $s === "false") {
                return $s;
            }
            if (is_numeric($s)) {
                return $s;
            }
            return '"' . $s . '"';
        }
        if (is_bool($val)) {
            return $val ? "true" : "false";
        }
        return (string)$val;
    }
}

class Branch {
    public Workflow $workflow;
    private string $gatewayID;
    public string $currentNodeID;
    private bool $isConditional;
    private string $condition;
    public bool $hasEnded = false;

    public function __construct(Workflow $workflow, string $gatewayID, string $currentNodeID, bool $isConditional, string $condition) {
        $this->workflow = $workflow;
        $this->gatewayID = $gatewayID;
        $this->currentNodeID = $currentNodeID;
        $this->isConditional = $isConditional;
        $this->condition = $condition;
    }

    private function connectNode(string $nodeId): void {
        if ($this->hasEnded) return;

        $merges = $this->workflow->pendingMerges;
        if (count($merges) > 0) {
            foreach ($merges as $sourceId) {
                $this->workflow->sequenceFlow($sourceId, $nodeId);
            }
            $this->workflow->pendingMerges = [];
            $this->currentNodeID = $nodeId;
            return;
        }

        if ($this->currentNodeID === $this->gatewayID) {
            if ($this->isConditional) {
                $this->workflow->sequenceFlowWithCondition($this->gatewayID, $nodeId, $this->condition);
            } else {
                $this->workflow->sequenceFlow($this->gatewayID, $nodeId);
            }
        } else if ($this->currentNodeID !== '' && $this->currentNodeID !== $nodeId) {
            $this->workflow->sequenceFlow($this->currentNodeID, $nodeId);
        }
        $this->currentNodeID = $nodeId;
    }

    public function user(string $id, string $name, ?callable $config = null): Branch {
        $builder = $this->workflow->userTask($id, $name);
        if ($config !== null) {
            $config($builder);
        }
        $this->connectNode($id);
        return $this;
    }

    public function service(string $id, string $name, string $topic, ?callable $config = null): Branch {
        $builder = $this->workflow->serviceTask($id, $name, $topic);
        if ($config !== null) {
            $config($builder);
        }
        $this->connectNode($id);
        return $this;
    }

    public function ai(string $id, string $name, ?callable $config = null): Branch {
        $builder = $this->workflow->aiTask($id, $name);
        if ($config !== null) {
            $config($builder);
        }
        $this->connectNode($id);
        return $this;
    }

    public function end(string $id, string $name): Branch {
        $this->workflow->endEvent($id, $name);
        $this->connectNode($id);
        $this->hasEnded = true;
        return $this;
    }

    public function when($condition): WhenBranchBuilder {
        $gwID = "gw_" . $this->currentNodeID . "_decision";
        $this->workflow->exclusiveGateway($gwID, "Decision Gateway");
        $this->connectNode($gwID);
        return new WhenBranchBuilder($this, $gwID, (string)$condition);
    }
}

class WhenBuilder {
    private Workflow $workflow;
    private string $gatewayID;
    private string $condition;

    public function __construct(Workflow $workflow, string $gatewayID, string $condition) {
        $this->workflow = $workflow;
        $this->gatewayID = $gatewayID;
        $this->condition = $condition;
    }

    public function then(callable $thenFn): ThenBuilder {
        $thenBranch = new Branch($this->workflow, $this->gatewayID, $this->gatewayID, true, $this->condition);
        $thenFn($thenBranch);

        if (!$thenBranch->hasEnded && $thenBranch->currentNodeID !== $this->gatewayID) {
            $this->workflow->pendingMerges[] = $thenBranch->currentNodeID;
        }

        return new ThenBuilder($this->workflow, $this->gatewayID);
    }
}

class ThenBuilder {
    private Workflow $workflow;
    private string $gatewayID;

    public function __construct(Workflow $workflow, string $gatewayID) {
        $this->workflow = $workflow;
        $this->gatewayID = $gatewayID;
    }

    public function otherwise(callable $elseFn): Workflow {
        $elseBranch = new Branch($this->workflow, $this->gatewayID, $this->gatewayID, false, "");
        $elseFn($elseBranch);

        if (!$elseBranch->hasEnded && $elseBranch->currentNodeID !== $this->gatewayID) {
            $this->workflow->pendingMerges[] = $elseBranch->currentNodeID;
        }

        return $this->workflow;
    }
}

class WhenBranchBuilder {
    private Branch $branch;
    private string $gatewayID;
    private string $condition;

    public function __construct(Branch $branch, string $gatewayID, string $condition) {
        $this->branch = $branch;
        $this->gatewayID = $gatewayID;
        $this->condition = $condition;
    }

    public function then(callable $thenFn): ThenBranchBuilder {
        $thenBranch = new Branch($this->branch->workflow, $this->gatewayID, $this->gatewayID, true, $this->condition);
        $thenFn($thenBranch);

        if (!$thenBranch->hasEnded && $thenBranch->currentNodeID !== $this->gatewayID) {
            $this->branch->workflow->pendingMerges[] = $thenBranch->currentNodeID;
        }

        return new ThenBranchBuilder($this->branch, $this->gatewayID);
    }
}

class ThenBranchBuilder {
    private Branch $branch;
    private string $gatewayID;

    public function __construct(Branch $branch, string $gatewayID) {
        $this->branch = $branch;
        $this->gatewayID = $gatewayID;
    }

    public function otherwise(callable $elseFn): Branch {
        $elseBranch = new Branch($this->branch->workflow, $this->gatewayID, $this->gatewayID, false, "");
        $elseFn($elseBranch);

        if (!$elseBranch->hasEnded && $elseBranch->currentNodeID !== $this->gatewayID) {
            $this->branch->workflow->pendingMerges[] = $elseBranch->currentNodeID;
        }

        return $this->branch;
    }
}

class Expression {
    private string $expr;
    public function __construct(string $expr) {
        $this->expr = $expr;
    }
    public function __toString(): string {
        return "\${" . $this->expr . "}";
    }
}

class Variable {
    private string $name;
    public function __construct(string $name) {
        $this->name = $name;
    }
    public function eq($val): Expression {
        $valStr = is_bool($val) ? ($val ? 'true' : 'false') : (string)$val;
        return new Expression("{$this->name} == {$valStr}");
    }
    public function ne($val): Expression {
        $valStr = is_bool($val) ? ($val ? 'true' : 'false') : (string)$val;
        return new Expression("{$this->name} != {$valStr}");
    }
    public function gt($val): Expression {
        return new Expression("{$this->name} > {$val}");
    }
    public function gte($val): Expression {
        return new Expression("{$this->name} >= {$val}");
    }
    public function lt($val): Expression {
        return new Expression("{$this->name} < {$val}");
    }
    public function lte($val): Expression {
        return new Expression("{$this->name} <= {$val}");
    }
}
