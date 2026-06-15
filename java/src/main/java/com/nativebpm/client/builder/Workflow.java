package com.nativebpm.client.builder;

import com.google.gson.Gson;
import com.dylibso.chicory.runtime.ExportFunction;
import com.dylibso.chicory.runtime.Instance;
import com.dylibso.chicory.runtime.Memory;
import com.dylibso.chicory.runtime.Store;
import com.dylibso.chicory.wasm.Parser;
import com.dylibso.chicory.wasm.WasmModule;
import com.dylibso.chicory.wasi.WasiOptions;
import com.dylibso.chicory.wasi.WasiPreview1;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.zip.GZIPInputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.function.Consumer;

public class Workflow {
    private final String id;
    private final String name;
    private final List<Map<String, Object>> nodes = new ArrayList<>();
    private final List<Map<String, Object>> flows = new ArrayList<>();

    private Throwable err;
    private WasmModule compiledModule;
    private String currentNodeID = "";
    private final List<String> pendingMerges = new ArrayList<>();

    public Workflow(String id, String name, Object... wasmInput) {
        this.id = id;
        this.name = name;
        if (wasmInput.length > 0) {
            try {
                byte[] decompressedBytes;
                Object input = wasmInput[0];
                if (input instanceof byte[]) {
                    decompressedBytes = decompressWasmIfNeeded((byte[]) input);
                } else if (input instanceof String) {
                    byte[] data = Files.readAllBytes(Paths.get((String) input));
                    decompressedBytes = decompressWasmIfNeeded(data);
                } else {
                    throw new IllegalArgumentException("Unsupported wasm input type: " + input.getClass().getName());
                }

                try (ByteArrayInputStream bais = new ByteArrayInputStream(decompressedBytes)) {
                    this.compiledModule = Parser.parse(bais);
                }
            } catch (Throwable t) {
                this.err = t;
            }
        }
    }

    public static byte[] decompressWasmIfNeeded(byte[] data) throws Exception {
        if (data.length >= 4 && data[0] == 0x00 && data[1] == 0x61 && data[2] == 0x73 && data[3] == 0x6d) {
            return data;
        }
        // Gzip
        if (data.length >= 2 && (data[0] & 0xFF) == 0x1f && (data[1] & 0xFF) == 0x8b) {
            try (ByteArrayInputStream bais = new ByteArrayInputStream(data);
                 GZIPInputStream gzis = new GZIPInputStream(bais);
                 ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                byte[] buf = new byte[4096];
                int n;
                while ((n = gzis.read(buf)) != -1) {
                    baos.write(buf, 0, n);
                }
                return baos.toByteArray();
            }
        }
        // Zip
        if (data.length >= 4 && data[0] == 0x50 && data[1] == 0x4b && data[2] == 0x03 && data[3] == 0x04) {
            try (ByteArrayInputStream bais = new ByteArrayInputStream(data);
                 ZipInputStream zis = new ZipInputStream(bais)) {
                ZipEntry entry;
                while ((entry = zis.getNextEntry()) != null) {
                    if (entry.getName().endsWith(".wasm")) {
                        ByteArrayOutputStream baos = new ByteArrayOutputStream();
                        byte[] buf = new byte[4096];
                        int n;
                        while ((n = zis.read(buf)) != -1) {
                            baos.write(buf, 0, n);
                        }
                        return baos.toByteArray();
                    }
                }
            }
            throw new IllegalArgumentException("No .wasm file found inside zip archive");
        }
        // Brotli
        try (ByteArrayInputStream bais = new ByteArrayInputStream(data);
             org.brotli.dec.BrotliInputStream bis = new org.brotli.dec.BrotliInputStream(bais);
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            byte[] buf = new byte[4096];
            int n;
            while ((n = bis.read(buf)) != -1) {
                baos.write(buf, 0, n);
            }
            byte[] decompressed = baos.toByteArray();
            if (decompressed.length >= 4 && decompressed[0] == 0x00 && decompressed[1] == 0x61 && decompressed[2] == 0x73 && decompressed[3] == 0x6d) {
                return decompressed;
            }
        } catch (Exception e) {
            // ignore and fall through
        }
        throw new IllegalArgumentException("Unsupported or invalid WebAssembly binary format (failed to decompress or identify magic header)");
    }

    public Workflow builder() {
        return this;
    }

    public static class Branch {
        private final Workflow workflow;
        private final String gatewayID;
        private String currentNodeID;
        private final boolean isConditional;
        private final String condition;
        private boolean hasEnded = false;

        public Branch(Workflow workflow, String gatewayID, String currentNodeID, boolean isConditional, String condition) {
            this.workflow = workflow;
            this.gatewayID = gatewayID;
            this.currentNodeID = currentNodeID;
            this.isConditional = isConditional;
            this.condition = condition;
        }

        private void connectNode(String nodeId) {
            if (hasEnded) return;

            if (!workflow.pendingMerges.isEmpty()) {
                for (String sourceId : workflow.pendingMerges) {
                    workflow.sequenceFlow(sourceId, nodeId);
                }
                workflow.pendingMerges.clear();
                this.currentNodeID = nodeId;
                return;
            }

            if (this.currentNodeID.equals(this.gatewayID)) {
                if (isConditional) {
                    workflow.sequenceFlowWithCondition(this.gatewayID, nodeId, this.condition);
                } else {
                    workflow.sequenceFlow(this.gatewayID, nodeId);
                }
            } else if (!this.currentNodeID.isEmpty() && !this.currentNodeID.equals(nodeId)) {
                workflow.sequenceFlow(this.currentNodeID, nodeId);
            }
            this.currentNodeID = nodeId;
        }

        public Branch user(String id, String name) {
            return user(id, name, null);
        }

        public Branch user(String id, String name, Consumer<UserTaskBuilder> config) {
            UserTaskBuilder builder = workflow.userTask(id, name);
            if (config != null) {
                config.accept(builder);
            }
            connectNode(id);
            return this;
        }

        public Branch service(String id, String name, String topic) {
            return service(id, name, topic, null);
        }

        public Branch service(String id, String name, String topic, Consumer<ServiceTaskBuilder> config) {
            ServiceTaskBuilder builder = workflow.serviceTask(id, name, topic);
            if (config != null) {
                config.accept(builder);
            }
            connectNode(id);
            return this;
        }

        public Branch ai(String id, String name) {
            return ai(id, name, null);
        }

        public Branch ai(String id, String name, Consumer<AITaskBuilder> config) {
            AITaskBuilder builder = workflow.aiTask(id, name);
            if (config != null) {
                config.accept(builder);
            }
            connectNode(id);
            return this;
        }

        public Branch end(String id, String name) {
            workflow.endEvent(id, name);
            connectNode(id);
            this.hasEnded = true;
            return this;
        }

        public WhenBranchBuilder when(String condition) {
            String gwID = "gw_" + this.currentNodeID + "_decision";
            workflow.exclusiveGateway(gwID, "Decision Gateway");
            connectNode(gwID);

            Branch thenBranch = new Branch(workflow, gwID, gwID, true, condition);
            return new WhenBranchBuilder(this, gwID, condition);
        }

        public WhenBranchBuilder when(Expression condition) {
            return when(condition.toString());
        }
    }

    public static class WhenBuilder {
        private final Workflow workflow;
        private final String gatewayID;
        private final String condition;

        public WhenBuilder(Workflow workflow, String gatewayID, String condition) {
            this.workflow = workflow;
            this.gatewayID = gatewayID;
            this.condition = condition;
        }

        public ThenBuilder then(Consumer<Branch> thenFn) {
            Branch thenBranch = new Branch(workflow, gatewayID, gatewayID, true, condition);
            thenFn.accept(thenBranch);

            if (!thenBranch.hasEnded && !thenBranch.currentNodeID.equals(gatewayID)) {
                workflow.pendingMerges.add(thenBranch.currentNodeID);
            }

            return new ThenBuilder(workflow, gatewayID);
        }
    }

    public static class ThenBuilder {
        private final Workflow workflow;
        private final String gatewayID;

        public ThenBuilder(Workflow workflow, String gatewayID) {
            this.workflow = workflow;
            this.gatewayID = gatewayID;
        }

        public Workflow otherwise(Consumer<Branch> elseFn) {
            Branch elseBranch = new Branch(workflow, gatewayID, gatewayID, false, "");
            elseFn.accept(elseBranch);

            if (!elseBranch.hasEnded && !elseBranch.currentNodeID.equals(gatewayID)) {
                workflow.pendingMerges.add(elseBranch.currentNodeID);
            }

            return workflow;
        }
    }

    public static class WhenBranchBuilder {
        private final Branch branch;
        private final String gatewayID;
        private final String condition;

        public WhenBranchBuilder(Branch branch, String gatewayID, String condition) {
            this.branch = branch;
            this.gatewayID = gatewayID;
            this.condition = condition;
        }

        public ThenBranchBuilder then(Consumer<Branch> thenFn) {
            Branch thenBranch = new Branch(branch.workflow, gatewayID, gatewayID, true, condition);
            thenFn.accept(thenBranch);

            if (!thenBranch.hasEnded && !thenBranch.currentNodeID.equals(gatewayID)) {
                branch.workflow.pendingMerges.add(thenBranch.currentNodeID);
            }

            return new ThenBranchBuilder(branch, gatewayID);
        }
    }

    public static class ThenBranchBuilder {
        private final Branch branch;
        private final String gatewayID;

        public ThenBranchBuilder(Branch branch, String gatewayID) {
            this.branch = branch;
            this.gatewayID = gatewayID;
        }

        public Branch otherwise(Consumer<Branch> elseFn) {
            Branch elseBranch = new Branch(branch.workflow, gatewayID, gatewayID, false, "");
            elseFn.accept(elseBranch);

            if (!elseBranch.hasEnded && !elseBranch.currentNodeID.equals(gatewayID)) {
                branch.workflow.pendingMerges.add(elseBranch.currentNodeID);
            }

            return branch;
        }
    }

    private void connectNode(String nodeId) {
        Map<String, Object> node = findNode(nodeId);
        boolean hasStart = false;
        for (Map<String, Object> n : this.nodes) {
            if ("startEvent".equals(n.get("type"))) {
                hasStart = true;
                break;
            }
        }
        if (!hasStart && node != null && !"startEvent".equals(node.get("type"))) {
            this.startEvent("start");
            this.sequenceFlow("start", nodeId);
            currentNodeID = nodeId;
            return;
        }

        if (!pendingMerges.isEmpty()) {
            for (String sourceId : pendingMerges) {
                this.sequenceFlow(sourceId, nodeId);
            }
            pendingMerges.clear();
        } else if (!currentNodeID.isEmpty() && !currentNodeID.equals(nodeId)) {
            this.sequenceFlow(currentNodeID, nodeId);
        }
        currentNodeID = nodeId;
    }

    public Workflow start() {
        return start("start");
    }

    public Workflow start(String id) {
        this.startEvent(id);
        connectNode(id);
        return this;
    }

    public Workflow end(String id, String name) {
        this.endEvent(id, name);
        connectNode(id);
        this.currentNodeID = "";
        return this;
    }

    public Workflow user(String id, String name) {
        return user(id, name, null);
    }

    public Workflow user(String id, String name, Consumer<UserTaskBuilder> config) {
        UserTaskBuilder builder = this.userTask(id, name);
        if (config != null) {
            config.accept(builder);
        }
        connectNode(id);
        return this;
    }

    public Workflow service(String id, String name, String topic) {
        return service(id, name, topic, null);
    }

    public Workflow service(String id, String name, String topic, Consumer<ServiceTaskBuilder> config) {
        ServiceTaskBuilder builder = this.serviceTask(id, name, topic);
        if (config != null) {
            config.accept(builder);
        }
        connectNode(id);
        return this;
    }

    public Workflow ai(String id, String name) {
        return ai(id, name, null);
    }

    public Workflow ai(String id, String name, Consumer<AITaskBuilder> config) {
        AITaskBuilder builder = this.aiTask(id, name);
        if (config != null) {
            config.accept(builder);
        }
        connectNode(id);
        return this;
    }

    public WhenBuilder when(String condition) {
        String gwID = "gw_" + this.currentNodeID + "_decision";
        this.exclusiveGateway(gwID, "Decision Gateway");
        connectNode(gwID);
        return new WhenBuilder(this, gwID, condition);
    }

    public WhenBuilder when(Expression condition) {
        return when(condition.toString());
    }

    public StartEventBuilder startEvent(String id) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "startEvent");
        node.put("id", id);
        node.put("name", "Start");
        nodes.add(node);
        return new StartEventBuilder(this, id);
    }

    public Workflow endEvent(String id, String name) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "endEvent");
        node.put("id", id);
        node.put("name", name);
        nodes.add(node);
        return this;
    }

    public ServiceTaskBuilder serviceTask(String id, String name, String topic) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "serviceTask");
        node.put("id", id);
        node.put("name", name);
        node.put("topic", topic);
        nodes.add(node);
        return new ServiceTaskBuilder(this, id);
    }

    public AITaskBuilder aiTask(String id, String name) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "aiServiceTask");
        node.put("id", id);
        node.put("name", name);
        nodes.add(node);
        return new AITaskBuilder(this, id);
    }

    public UserTaskBuilder userTask(String id, String name) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "userTask");
        node.put("id", id);
        node.put("name", name);
        nodes.add(node);
        return new UserTaskBuilder(this, id);
    }

    public ExclusiveGatewayBuilder exclusiveGateway(String id, String name) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "exclusiveGateway");
        node.put("id", id);
        node.put("name", name);
        nodes.add(node);
        return new ExclusiveGatewayBuilder(this, id);
    }

    public ParallelGatewayBuilder parallelGateway(String id, String name) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "parallelGateway");
        node.put("id", id);
        node.put("name", name);
        nodes.add(node);
        return new ParallelGatewayBuilder(this, id);
    }

    public EventBasedGatewayBuilder eventBasedGateway(String id, String name) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "eventBasedGateway");
        node.put("id", id);
        node.put("name", name);
        nodes.add(node);
        return new EventBasedGatewayBuilder(this, id);
    }

    public CallActivityBuilder callActivity(String id, String name, String calledElement) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "callActivity");
        node.put("id", id);
        node.put("name", name);
        node.put("calledElement", calledElement);
        nodes.add(node);
        return new CallActivityBuilder(this, id);
    }

    /**
     * Creates a new Business Rule Task node in the workflow that evaluates a DMN decision table.
     *
     * @param id The unique identifier of the task.
     * @param name The human-readable name of the task.
     * @param decisionRef The ID reference of the DMN decision to execute.
     * @return A {@link BusinessRuleTaskBuilder} to configure the task parameters and rules.
     */
    public BusinessRuleTaskBuilder businessRuleTask(String id, String name, String decisionRef) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "businessRuleTask");
        node.put("id", id);
        node.put("name", name);
        node.put("decisionRef", decisionRef);
        nodes.add(node);
        return new BusinessRuleTaskBuilder(this, id);
    }

    public Workflow sequenceFlow(String source, String target) {
        Map<String, Object> flow = new HashMap<>();
        flow.put("id", "flow-" + source + "-" + target);
        flow.put("source", source);
        flow.put("target", target);
        flow.put("condition", "");
        flows.add(flow);
        return this;
    }

    public Workflow sequenceFlowWithCondition(String source, String target, String condition) {
        Map<String, Object> flow = new HashMap<>();
        flow.put("id", "flow-" + source + "-" + target);
        flow.put("source", source);
        flow.put("target", target);
        flow.put("condition", condition);
        flows.add(flow);
        return this;
    }

    public Map<String, Object> findNode(String id) {
        for (Map<String, Object> node : nodes) {
            if (id.equals(node.get("id"))) {
                return node;
            }
        }
        return null;
    }

    public Map<String, Object> toAST() {
        List<Map<String, Object>> nodesCopy = new ArrayList<>(this.nodes);
        List<Map<String, Object>> flowsCopy = new ArrayList<>(this.flows);

        Set<String> sourceIds = new HashSet<>();
        for (Map<String, Object> f : this.flows) {
            String src = (String) f.get("source");
            if (src != null) {
                sourceIds.add(src);
            }
        }

        for (Map<String, Object> node : this.nodes) {
            String nodeType = (String) node.get("type");
            String nodeId = (String) node.get("id");
            if ("endEvent".equals(nodeType) || "startEvent".equals(nodeType)) {
                continue;
            }
            if (!sourceIds.contains(nodeId)) {
                String endId = "end_" + nodeId;
                
                Map<String, Object> endNode = new HashMap<>();
                endNode.put("type", "endEvent");
                endNode.put("id", endId);
                endNode.put("name", "Process Finished");
                nodesCopy.add(endNode);

                Map<String, Object> flow = new HashMap<>();
                flow.put("id", "flow-" + nodeId + "-" + endId);
                flow.put("source", nodeId);
                flow.put("target", endId);
                flow.put("condition", "");
                flowsCopy.add(flow);
            }
        }

        Map<String, Object> ast = new HashMap<>();
        ast.put("id", this.id);
        ast.put("name", this.name);
        ast.put("nodes", nodesCopy);
        ast.put("flows", flowsCopy);
        return ast;
    }

    public String buildXML(Object... wasmInput) throws Exception {
        if (this.err != null) {
            if (this.err instanceof Exception) {
                throw (Exception) this.err;
            }
            throw new RuntimeException(this.err);
        }

        if (this.compiledModule == null) {
            byte[] decompressedBytes;
            if (wasmInput.length > 0) {
                Object input = wasmInput[0];
                if (input instanceof byte[]) {
                    decompressedBytes = decompressWasmIfNeeded((byte[]) input);
                } else if (input instanceof String) {
                    byte[] data = Files.readAllBytes(Paths.get((String) input));
                    decompressedBytes = decompressWasmIfNeeded(data);
                } else {
                    throw new IllegalArgumentException("Unsupported wasm input type: " + input.getClass().getName());
                }
            } else {
                // Default fallback: load core.wasm from resources/classpath
                try (InputStream is = Workflow.class.getResourceAsStream("/core.wasm")) {
                    if (is == null) {
                        throw new IllegalStateException("Embedded core.wasm not found in resources/classpath. Please specify a path.");
                    }
                    ByteArrayOutputStream baos = new ByteArrayOutputStream();
                    byte[] buf = new byte[4096];
                    int n;
                    while ((n = is.read(buf)) != -1) {
                        baos.write(buf, 0, n);
                    }
                    decompressedBytes = decompressWasmIfNeeded(baos.toByteArray());
                }
            }
            try (ByteArrayInputStream bais = new ByteArrayInputStream(decompressedBytes)) {
                this.compiledModule = Parser.parse(bais);
            }
        }

        WasiOptions wasiOptions = WasiOptions.builder()
                .withThrowOnExit0(false)
                .withArguments(List.of("core.wasm"))
                .withStderr(System.err)
                .build();
        WasiPreview1 wasi = WasiPreview1.builder()
                .withOptions(wasiOptions)
                .build();
        Store store = new Store().addFunction(wasi.toHostFunctions());
        Instance instance = Instance.builder(this.compiledModule)
                .withImportValues(store.toImportValues())
                .build();

        Memory memory = instance.memory();
        ExportFunction allocate = instance.export("allocate");
        ExportFunction deallocate = instance.export("deallocate");
        ExportFunction compileWorkflow = instance.export("compileWorkflow");

        String astJson = new Gson().toJson(toAST());
        byte[] astBytes = astJson.getBytes(StandardCharsets.UTF_8);

        int inputPtr = (int) allocate.apply(astBytes.length)[0];
        memory.write(inputPtr, astBytes);

        long resultPacked = compileWorkflow.apply(inputPtr, astBytes.length)[0];

        int resultPtr = (int) (resultPacked >>> 32);
        int resultSize = (int) (resultPacked & 0xFFFFFFFFL);

        byte[] resultBytes = memory.readBytes(resultPtr, resultSize);
        String resultJson = new String(resultBytes, StandardCharsets.UTF_8);

        deallocate.apply(inputPtr, astBytes.length);
        deallocate.apply(resultPtr, resultSize);

        Map<?, ?> result = new Gson().fromJson(resultJson, Map.class);
        String error = (String) result.get("error");
        if (error != null && !error.isEmpty()) {
            throw new RuntimeException("Wasm workflow compilation failed: " + error);
        }
        return (String) result.get("xml");
    }

    public static class StartEventBuilder {
        private final Workflow workflow;
        private final String id;

        public StartEventBuilder(Workflow workflow, String id) {
            this.workflow = workflow;
            this.id = id;
        }

        public Workflow next(String targetID) {
            return this.workflow.sequenceFlow(this.id, targetID);
        }

        public Workflow connectTo(String targetID) {
            return next(targetID);
        }

        public Workflow builder() {
            return this.workflow;
        }
    }

    public static class ServiceTaskBuilder {
        private final Workflow workflow;
        private final String id;

        public ServiceTaskBuilder(Workflow workflow, String id) {
            this.workflow = workflow;
            this.id = id;
        }

        public ServiceTaskBuilder wasmPath(String path) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) {
                node.put("wasmPath", path);
            }
            return this;
        }

        public ServiceTaskBuilder wasm(String alias) {
            return wasmPath(alias);
        }

        public Workflow next(String targetID) {
            return this.workflow.sequenceFlow(this.id, targetID);
        }

        public Workflow connectTo(String targetID) {
            return next(targetID);
        }

        public Workflow builder() {
            return this.workflow;
        }
    }

    public static class AITaskBuilder {
        private final Workflow workflow;
        private final String id;

        public AITaskBuilder(Workflow workflow, String id) {
            this.workflow = workflow;
            this.id = id;
        }

        public AITaskBuilder provider(String provider) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) node.put("provider", provider);
            return this;
        }

        public AITaskBuilder model(String model) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) node.put("model", model);
            return this;
        }

        public AITaskBuilder prompt(String prompt) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) node.put("prompt", prompt);
            return this;
        }

        public AITaskBuilder systemInstruction(String systemInstruction) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) node.put("systemInstruction", systemInstruction);
            return this;
        }

        public AITaskBuilder responseSchema(String responseSchema) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) node.put("responseSchema", responseSchema);
            return this;
        }

        public AITaskBuilder temperature(double temperature) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) node.put("temperature", temperature);
            return this;
        }

        public AITaskBuilder resultVar(String resultVar) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) node.put("resultVar", resultVar);
            return this;
        }

        public Workflow next(String targetID) {
            return this.workflow.sequenceFlow(this.id, targetID);
        }

        public Workflow connectTo(String targetID) {
            return next(targetID);
        }

        public Workflow builder() {
            return this.workflow;
        }
    }

    public static class UserTaskBuilder {
        private final Workflow workflow;
        private final String id;

        public UserTaskBuilder(Workflow workflow, String id) {
            this.workflow = workflow;
            this.id = id;
        }

        public UserTaskBuilder assignee(String assignee) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) node.put("assignee", assignee);
            return this;
        }

        public UserTaskBuilder candidateGroups(String candidateGroups) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) node.put("candidateGroups", candidateGroups);
            return this;
        }

        public UserTaskBuilder dueDate(String dueDate) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) node.put("dueDate", dueDate);
            return this;
        }

        public Workflow next(String targetID) {
            return this.workflow.sequenceFlow(this.id, targetID);
        }

        public Workflow connectTo(String targetID) {
            return next(targetID);
        }

        public Workflow builder() {
            return this.workflow;
        }
    }

    public static class ExclusiveGatewayBuilder {
        private final Workflow workflow;
        private final String id;

        public ExclusiveGatewayBuilder(Workflow workflow, String id) {
            this.workflow = workflow;
            this.id = id;
        }

        public Workflow next(String targetID) {
            return this.workflow.sequenceFlow(this.id, targetID);
        }

        public Workflow nextWithCondition(String targetID, String condition) {
            return this.workflow.sequenceFlowWithCondition(this.id, targetID, condition);
        }

        public ExclusiveGatewayBuilder condition(String targetID, String condition) {
            this.workflow.sequenceFlowWithCondition(this.id, targetID, condition);
            return this;
        }

        public ExclusiveGatewayBuilder defaultValue(String targetID) {
            this.workflow.sequenceFlow(this.id, targetID);
            return this;
        }

        public Workflow connectTo(String targetID) {
            return next(targetID);
        }

        public Workflow builder() {
            return this.workflow;
        }
    }

    public static class ParallelGatewayBuilder {
        private final Workflow workflow;
        private final String id;

        public ParallelGatewayBuilder(Workflow workflow, String id) {
            this.workflow = workflow;
            this.id = id;
        }

        public Workflow next(String targetID) {
            return this.workflow.sequenceFlow(this.id, targetID);
        }

        public Workflow connectTo(String targetID) {
            return next(targetID);
        }

        public Workflow builder() {
            return this.workflow;
        }
    }

    public static class EventBasedGatewayBuilder {
        private final Workflow workflow;
        private final String id;

        public EventBasedGatewayBuilder(Workflow workflow, String id) {
            this.workflow = workflow;
            this.id = id;
        }

        public Workflow next(String targetID) {
            return this.workflow.sequenceFlow(this.id, targetID);
        }

        public Workflow connectTo(String targetID) {
            return next(targetID);
        }

        public Workflow builder() {
            return this.workflow;
        }
    }

    public static class CallActivityBuilder {
        private final Workflow workflow;
        private final String id;

        public CallActivityBuilder(Workflow workflow, String id) {
            this.workflow = workflow;
            this.id = id;
        }

        @SuppressWarnings("unchecked")
        public CallActivityBuilder in(String source, String target) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) {
                List<Map<String, Object>> inVars = (List<Map<String, Object>>) node.get("inVariables");
                if (inVars == null) {
                    inVars = new ArrayList<>();
                    node.put("inVariables", inVars);
                }
                Map<String, Object> var = new HashMap<>();
                var.put("source", source);
                var.put("target", target);
                var.put("variables", "");
                var.put("local", false);
                inVars.add(var);
            }
            return this;
        }

        @SuppressWarnings("unchecked")
        public CallActivityBuilder inAll() {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) {
                List<Map<String, Object>> inVars = (List<Map<String, Object>>) node.get("inVariables");
                if (inVars == null) {
                    inVars = new ArrayList<>();
                    node.put("inVariables", inVars);
                }
                Map<String, Object> var = new HashMap<>();
                var.put("source", "");
                var.put("target", "");
                var.put("variables", "all");
                var.put("local", false);
                inVars.add(var);
            }
            return this;
        }

        @SuppressWarnings("unchecked")
        public CallActivityBuilder out(String source, String target) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) {
                List<Map<String, Object>> outVars = (List<Map<String, Object>>) node.get("outVariables");
                if (outVars == null) {
                    outVars = new ArrayList<>();
                    node.put("outVariables", outVars);
                }
                Map<String, Object> var = new HashMap<>();
                var.put("source", source);
                var.put("target", target);
                var.put("variables", "");
                outVars.add(var);
            }
            return this;
        }

        @SuppressWarnings("unchecked")
        public CallActivityBuilder outAll() {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) {
                List<Map<String, Object>> outVars = (List<Map<String, Object>>) node.get("outVariables");
                if (outVars == null) {
                    outVars = new ArrayList<>();
                    node.put("outVariables", outVars);
                }
                Map<String, Object> var = new HashMap<>();
                var.put("source", "");
                var.put("target", "");
                var.put("variables", "all");
                outVars.add(var);
            }
            return this;
        }

        public Workflow next(String targetID) {
            return this.workflow.sequenceFlow(this.id, targetID);
        }

        public Workflow connectTo(String targetID) {
            return next(targetID);
        }

        public Workflow builder() {
            return this.workflow;
        }
    }

    public static class BusinessRuleTaskBuilder {
        private final Workflow workflow;
        private final String id;

        public BusinessRuleTaskBuilder(Workflow workflow, String id) {
            this.workflow = workflow;
            this.id = id;
        }

        public BusinessRuleTaskBuilder mapDecisionResult(String mapDecisionResult) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) node.put("mapDecisionResult", mapDecisionResult);
            return this;
        }

        public BusinessRuleTaskBuilder resultVariable(String resultVar) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) node.put("resultVar", resultVar);
            return this;
        }

        /**
         * Sets the hit policy for the inline DMN decision table.
         *
         * @param hitPolicy The DMN hit policy string (e.g., "UNIQUE", "FIRST", "ANY", "COLLECT").
         * @return This builder instance for method chaining.
         */
        public BusinessRuleTaskBuilder hitPolicy(String hitPolicy) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) node.put("hitPolicy", hitPolicy);
            return this;
        }

        /**
         * Adds an input column configuration to the inline DMN table.
         *
         * @param expression The variable name or expression to evaluate as input (e.g., "membership").
         * @param type The type of the input variable (e.g., "string", "number", "boolean").
         * @return This builder instance for method chaining.
         */
        @SuppressWarnings("unchecked")
        public BusinessRuleTaskBuilder input(String expression, String type) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) {
                List<Map<String, Object>> inputs = (List<Map<String, Object>>) node.get("inputs");
                if (inputs == null) {
                    inputs = new ArrayList<>();
                    node.put("inputs", inputs);
                }
                Map<String, Object> in = new HashMap<>();
                in.put("expression", expression);
                in.put("type", type);
                inputs.add(in);
            }
            return this;
        }

        /**
         * Adds an output column configuration to the inline DMN table.
         *
         * @param name The name of the output variable where the rule result will be written.
         * @param type The type of the output variable (e.g., "string", "number", "boolean").
         * @return This builder instance for method chaining.
         */
        @SuppressWarnings("unchecked")
        public BusinessRuleTaskBuilder output(String name, String type) {
            Map<String, Object> node = this.workflow.findNode(this.id);
            if (node != null) {
                List<Map<String, Object>> outputs = (List<Map<String, Object>>) node.get("outputs");
                if (outputs == null) {
                    outputs = new ArrayList<>();
                    node.put("outputs", outputs);
                }
                Map<String, Object> out = new HashMap<>();
                out.put("name", name);
                out.put("type", type);
                outputs.add(out);
            }
            return this;
        }

        /**
         * Starts the definition of a new DMN rule inside this business rule task.
         *
         * @return A {@link DMNRuleBuilder} to specify the rule's conditions and outcomes.
         */
        public DMNRuleBuilder rule() {
            return new DMNRuleBuilder(this);
        }

        public Workflow next(String targetID) {
            return this.workflow.sequenceFlow(this.id, targetID);
        }

        public Workflow connectTo(String targetID) {
            return next(targetID);
        }

        public Workflow builder() {
            return this.workflow;
        }
    }

    public static class DMNRuleBuilder {
        private final BusinessRuleTaskBuilder taskBuilder;
        private final Map<String, String> inputs = new HashMap<>();
        private final Map<String, String> outputs = new HashMap<>();

        public DMNRuleBuilder(BusinessRuleTaskBuilder taskBuilder) {
            this.taskBuilder = taskBuilder;
        }

        /**
         * Adds a condition ("When" clause) to the rule for a specific input column.
         *
         * @param expression The expression identifier corresponding to one of the defined input expressions.
         * @param val The value constraint (e.g., "gold", ">= 18").
         * @return This DMNRuleBuilder for method chaining.
         */
        public DMNRuleBuilder when(String expression, Object val) {
            inputs.put(expression, formatDMNValue(val));
            return this;
        }

        /**
         * Adds an outcome ("Then" clause) to the rule for a specific output column.
         *
         * @param name The output variable name corresponding to one of the defined output columns.
         * @param val The value to return if all conditions in this rule match (e.g., 20.0).
         * @return This DMNRuleBuilder for method chaining.
         */
        public DMNRuleBuilder then(String name, Object val) {
            outputs.put(name, formatDMNValue(val));
            return this;
        }

        @SuppressWarnings("unchecked")
        private void commit() {
            Map<String, Object> node = this.taskBuilder.workflow.findNode(this.taskBuilder.id);
            if (node != null) {
                List<Map<String, Object>> rules = (List<Map<String, Object>>) node.get("rules");
                if (rules == null) {
                    rules = new ArrayList<>();
                    node.put("rules", rules);
                }

                List<Map<String, Object>> inputsList = (List<Map<String, Object>>) node.get("inputs");
                List<Map<String, Object>> outputsList = (List<Map<String, Object>>) node.get("outputs");

                List<String> ruleInputs = new ArrayList<>();
                if (inputsList != null) {
                    for (Map<String, Object> in : inputsList) {
                        String expr = (String) in.get("expression");
                        if (inputs.containsKey(expr)) {
                            ruleInputs.add(inputs.get(expr));
                        } else {
                            ruleInputs.add("-");
                        }
                    }
                }

                List<String> ruleOutputs = new ArrayList<>();
                if (outputsList != null) {
                    for (Map<String, Object> out : outputsList) {
                        String name = (String) out.get("name");
                        if (outputs.containsKey(name)) {
                            ruleOutputs.add(outputs.get(name));
                        } else {
                            ruleOutputs.add("-");
                        }
                    }
                }

                Map<String, Object> r = new HashMap<>();
                r.put("inputs", ruleInputs);
                r.put("outputs", ruleOutputs);
                rules.add(r);
            }
        }

        /**
         * Commits the current rule and starts defining the next DMN rule in this table.
         *
         * @return A new {@link DMNRuleBuilder} associated with the same business rule task.
         */
        public DMNRuleBuilder rule() {
            commit();
            return this.taskBuilder.rule();
        }

        public Workflow next(String targetID) {
            commit();
            return this.taskBuilder.next(targetID);
        }

        public Workflow connectTo(String targetID) {
            return next(targetID);
        }

        public Workflow builder() {
            commit();
            return this.taskBuilder.builder();
        }

        public BusinessRuleTaskBuilder mapDecisionResult(String mapDecisionResult) {
            commit();
            return this.taskBuilder.mapDecisionResult(mapDecisionResult);
        }

        public BusinessRuleTaskBuilder resultVariable(String resultVar) {
            commit();
            return this.taskBuilder.resultVariable(resultVar);
        }

        private String formatDMNValue(Object val) {
            if (val == null) {
                return "-";
            }
            if (val instanceof String) {
                String s = ((String) val).trim();
                for (String op : new String[]{"<=", ">=", "!=", "<>", "<", ">"}) {
                    if (s.startsWith(op)) {
                        return s;
                    }
                }
                if (s.equals("true") || s.equals("false")) {
                    return s;
                }
                try {
                    Double.parseDouble(s);
                    return s;
                } catch (NumberFormatException e) {
                    // ignore
                }
                return "\"" + s + "\"";
            }
            return String.valueOf(val);
        }
    }

    public static class Expression {
        private final String expr;
        public Expression(String expr) {
            this.expr = expr;
        }
        @Override
        public String toString() {
            return "${" + expr + "}";
        }
    }

    public static class Variable {
        private final String name;
        public Variable(String name) {
            this.name = name;
        }
        public Expression eq(Object val) {
            String valStr = (val instanceof Boolean) ? (((Boolean) val) ? "true" : "false") : String.valueOf(val);
            return new Expression(name + " == " + valStr);
        }
        public Expression ne(Object val) {
            String valStr = (val instanceof Boolean) ? (((Boolean) val) ? "true" : "false") : String.valueOf(val);
            return new Expression(name + " != " + valStr);
        }
        public Expression gt(Object val) {
            return new Expression(name + " > " + val);
        }
        public Expression gte(Object val) {
            return new Expression(name + " >= " + val);
        }
        public Expression lt(Object val) {
            return new Expression(name + " < " + val);
        }
        public Expression lte(Object val) {
            return new Expression(name + " <= " + val);
        }
    }

    public static Variable v(String name) {
        return new Variable(name);
    }

    public static Variable V(String name) {
        return new Variable(name);
    }

    public static Variable var(String name) {
        return new Variable(name);
    }
}
