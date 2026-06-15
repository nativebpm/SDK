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

    private static String toCamelCase(String s) {
        if ("wasm".equals(s)) {
            return "wasmPath";
        }
        if ("result_variable".equals(s)) {
            return "resultVar";
        }
        if (!s.contains("_")) {
            return s;
        }
        String[] parts = s.split("_");
        StringBuilder camel = new StringBuilder(parts[0]);
        for (int i = 1; i < parts.length; i++) {
            if (parts[i].length() > 0) {
                camel.append(Character.toUpperCase(parts[i].charAt(0)))
                     .append(parts[i].substring(1));
            }
        }
        String res = camel.toString();
        if ("wasm".equals(res)) {
            return "wasmPath";
        }
        if ("resultVariable".equals(res)) {
            return "resultVar";
        }
        return res;
    }

    private static void populateNodeProperties(Map<String, Object> node, Map<String, Object> opts) {
        if (opts == null) return;
        for (Map.Entry<String, Object> entry : opts.entrySet()) {
            String key = toCamelCase(entry.getKey());
            node.put(key, entry.getValue());
        }
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

        public Branch user(String id, String name, Map<String, Object> options) {
            workflow.userTask(id, name, options);
            connectNode(id);
            return this;
        }

        public Branch service(String id, String name, String topic) {
            return service(id, name, topic, null);
        }

        public Branch service(String id, String name, String topic, Map<String, Object> options) {
            workflow.serviceTask(id, name, topic, options);
            connectNode(id);
            return this;
        }

        public Branch ai(String id, String name) {
            return ai(id, name, null);
        }

        public Branch ai(String id, String name, Map<String, Object> options) {
            workflow.aiTask(id, name, options);
            connectNode(id);
            return this;
        }

        public Branch call(String id, String name, String calledElement) {
            return call(id, name, calledElement, null);
        }

        public Branch call(String id, String name, String calledElement, Map<String, Object> options) {
            workflow.callActivity(id, name, calledElement, options);
            connectNode(id);
            return this;
        }

        public Branch businessRule(String id, String name, String decisionRef) {
            return businessRule(id, name, decisionRef, null);
        }

        public Branch businessRule(String id, String name, String decisionRef, Map<String, Object> options) {
            workflow.businessRuleTask(id, name, decisionRef, options);
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

    public Workflow user(String id, String name, Map<String, Object> options) {
        this.userTask(id, name, options);
        connectNode(id);
        return this;
    }

    public Workflow service(String id, String name, String topic) {
        return service(id, name, topic, null);
    }

    public Workflow service(String id, String name, String topic, Map<String, Object> options) {
        this.serviceTask(id, name, topic, options);
        connectNode(id);
        return this;
    }

    public Workflow ai(String id, String name) {
        return ai(id, name, null);
    }

    public Workflow ai(String id, String name, Map<String, Object> options) {
        this.aiTask(id, name, options);
        connectNode(id);
        return this;
    }

    public Workflow call(String id, String name, String calledElement) {
        return call(id, name, calledElement, null);
    }

    public Workflow call(String id, String name, String calledElement, Map<String, Object> options) {
        this.callActivity(id, name, calledElement, options);
        connectNode(id);
        return this;
    }

    public Workflow businessRule(String id, String name, String decisionRef) {
        return businessRule(id, name, decisionRef, null);
    }

    public Workflow businessRule(String id, String name, String decisionRef, Map<String, Object> options) {
        this.businessRuleTask(id, name, decisionRef, options);
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

    public Workflow startEvent(String id) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "startEvent");
        node.put("id", id);
        node.put("name", "Start");
        nodes.add(node);
        this.currentNodeID = id;
        return this;
    }

    public Workflow endEvent(String id, String name) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "endEvent");
        node.put("id", id);
        node.put("name", name);
        nodes.add(node);
        return this;
    }

    public Workflow serviceTask(String id, String name, String topic, Map<String, Object> options) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "serviceTask");
        node.put("id", id);
        node.put("name", name);
        node.put("topic", topic);
        populateNodeProperties(node, options);
        nodes.add(node);
        return this;
    }

    public Workflow aiTask(String id, String name, Map<String, Object> options) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "aiServiceTask");
        node.put("id", id);
        node.put("name", name);
        populateNodeProperties(node, options);
        nodes.add(node);
        return this;
    }

    public Workflow userTask(String id, String name, Map<String, Object> options) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "userTask");
        node.put("id", id);
        node.put("name", name);
        populateNodeProperties(node, options);
        nodes.add(node);
        return this;
    }

    public Workflow exclusiveGateway(String id, String name) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "exclusiveGateway");
        node.put("id", id);
        node.put("name", name);
        nodes.add(node);
        return this;
    }

    public Workflow parallelGateway(String id, String name) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "parallelGateway");
        node.put("id", id);
        node.put("name", name);
        nodes.add(node);
        return this;
    }

    public Workflow eventBasedGateway(String id, String name) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "eventBasedGateway");
        node.put("id", id);
        node.put("name", name);
        nodes.add(node);
        return this;
    }

    public Workflow callActivity(String id, String name, String calledElement, Map<String, Object> options) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "callActivity");
        node.put("id", id);
        node.put("name", name);
        node.put("calledElement", calledElement);
        populateNodeProperties(node, options);
        nodes.add(node);
        return this;
    }

    public Workflow businessRuleTask(String id, String name, String decisionRef, Map<String, Object> options) {
        Map<String, Object> node = new HashMap<>();
        node.put("type", "businessRuleTask");
        node.put("id", id);
        node.put("name", name);
        node.put("decisionRef", decisionRef);
        populateNodeProperties(node, options);
        nodes.add(node);
        return this;
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

    public static class Expression {
        private final String expr;
        public Expression(String expr) {
            this.expr = expr;
        }
        @Override
        public String toString() {
            return expr;
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
