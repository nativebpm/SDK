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

    private static function toCamelCase(string $s): string {
        if ($s === "wasm") {
            return "wasmPath";
        }
        if ($s === "result_variable") {
            return "resultVar";
        }
        if (!str_contains($s, "_")) {
            return $s;
        }
        $parts = explode('_', $s);
        $camel = $parts[0];
        for ($i = 1; $i < count($parts); $i++) {
            $camel .= ucfirst($parts[$i]);
        }
        if ($camel === "wasm") {
            return "wasmPath";
        }
        if ($camel === "resultVariable") {
            return "resultVar";
        }
        return $camel;
    }

    private static function populateNodeProperties(array &$node, array $opts): void {
        foreach ($opts as $k => $v) {
            $key = self::toCamelCase($k);
            $node[$key] = $v;
        }
    }

    public function startEvent(string $id): Workflow {
        $this->nodes[] = [
            'type' => 'startEvent',
            'id' => $id,
            'name' => 'Start'
        ];
        $this->currentNodeID = $id;
        return $this;
    }

    public function endEvent(string $id, string $name): Workflow {
        $this->nodes[] = [
            'type' => 'endEvent',
            'id' => $id,
            'name' => $name
        ];
        return $this;
    }

    public function serviceTask(string $id, string $name, string $topic, array $options = []): Workflow {
        $node = [
            'type' => 'serviceTask',
            'id' => $id,
            'name' => $name,
            'topic' => $topic
        ];
        self::populateNodeProperties($node, $options);
        $this->nodes[] = $node;
        return $this;
    }

    public function aiTask(string $id, string $name, array $options = []): Workflow {
        $node = [
            'type' => 'aiServiceTask',
            'id' => $id,
            'name' => $name
        ];
        self::populateNodeProperties($node, $options);
        $this->nodes[] = $node;
        return $this;
    }

    public function userTask(string $id, string $name, array $options = []): Workflow {
        $node = [
            'type' => 'userTask',
            'id' => $id,
            'name' => $name
        ];
        self::populateNodeProperties($node, $options);
        $this->nodes[] = $node;
        return $this;
    }

    public function exclusiveGateway(string $id, string $name): Workflow {
        $this->nodes[] = [
            'type' => 'exclusiveGateway',
            'id' => $id,
            'name' => $name
        ];
        return $this;
    }

    public function parallelGateway(string $id, string $name): Workflow {
        $this->nodes[] = [
            'type' => 'parallelGateway',
            'id' => $id,
            'name' => $name
        ];
        return $this;
    }

    public function eventBasedGateway(string $id, string $name): Workflow {
        $this->nodes[] = [
            'type' => 'eventBasedGateway',
            'id' => $id,
            'name' => $name
        ];
        return $this;
    }

    public function callActivity(string $id, string $name, string $calledElement, array $options = []): Workflow {
        $node = [
            'type' => 'callActivity',
            'id' => $id,
            'name' => $name,
            'calledElement' => $calledElement
        ];
        self::populateNodeProperties($node, $options);
        $this->nodes[] = $node;
        return $this;
    }

    public function businessRuleTask(string $id, string $name, string $decisionRef, array $options = []): Workflow {
        $node = [
            'type' => 'businessRuleTask',
            'id' => $id,
            'name' => $name,
            'decisionRef' => $decisionRef
        ];
        self::populateNodeProperties($node, $options);
        $this->nodes[] = $node;
        return $this;
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
                $fallbackPath = __DIR__ . '/../core.wasm';
                if (!file_exists($fallbackPath)) {
                    throw new \Exception("Embedded core.wasm not found. Please specify wasmInput.");
                }
                $wasmBytes = self::decompressWasmIfNeeded(file_get_contents($fallbackPath));
            }
        }

        $tempWasmFile = tempnam(sys_get_temp_dir(), 'core_wasm');
        file_put_contents($tempWasmFile, $wasmBytes);

        try {
            $astJson = json_encode($this->toAST());

            $descriptorspec = [
                0 => ["pipe", "r"],
                1 => ["pipe", "w"],
                2 => ["pipe", "w"]
            ];

            $cmd = "wasmtime run " . escapeshellarg($tempWasmFile) . " --cli";
            $process = proc_open($cmd, $descriptorspec, $pipes);

            if (!is_resource($process)) {
                throw new \Exception("Failed to execute wasmtime command: $cmd. Ensure wasmtime CLI is installed.");
            }

            fwrite($pipes[0], $astJson);
            fclose($pipes[0]);

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
                $break;
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

    public function user(string $id, string $name, array $options = []): Workflow {
        $this->userTask($id, $name, $options);
        $this->connectNode($id);
        return $this;
    }

    public function service(string $id, string $name, string $topic, array $options = []): Workflow {
        $this->serviceTask($id, $name, $topic, $options);
        $this->connectNode($id);
        return $this;
    }

    public function ai(string $id, string $name, array $options = []): Workflow {
        $this->aiTask($id, $name, $options);
        $this->connectNode($id);
        return $this;
    }

    public function call(string $id, string $name, string $calledElement, array $options = []): Workflow {
        $this->callActivity($id, $name, $calledElement, $options);
        $this->connectNode($id);
        return $this;
    }

    public function businessRule(string $id, string $name, string $decisionRef, array $options = []): Workflow {
        $this->businessRuleTask($id, $name, $decisionRef, $options);
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

    public function user(string $id, string $name, array $options = []): Branch {
        $this->workflow->userTask($id, $name, $options);
        $this->connectNode($id);
        return $this;
    }

    public function service(string $id, string $name, string $topic, array $options = []): Branch {
        $this->workflow->serviceTask($id, $name, $topic, $options);
        $this->connectNode($id);
        return $this;
    }

    public function ai(string $id, string $name, array $options = []): Branch {
        $this->workflow->aiTask($id, $name, $options);
        $this->connectNode($id);
        return $this;
    }

    public function call(string $id, string $name, string $calledElement, array $options = []): Branch {
        $this->workflow->callActivity($id, $name, $calledElement, $options);
        $this->connectNode($id);
        return $this;
    }

    public function businessRule(string $id, string $name, string $decisionRef, array $options = []): Branch {
        $this->workflow->businessRuleTask($id, $name, $decisionRef, $options);
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
        return $this->expr;
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
