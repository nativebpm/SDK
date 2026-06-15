use std::io::Read;
use serde::{Deserialize, Serialize};
use wasmtime::*;
use wasmtime_wasi::{WasiCtxBuilder, preview1::WasiP1Ctx};



const DEFAULT_WASM_BYTES: &[u8] = include_bytes!("core.wasm");


pub fn decompress_wasm_if_needed(data: &[u8]) -> Result<Vec<u8>, String> {
    if data.len() >= 4 && &data[0..4] == b"\x00asm" {
        return Ok(data.to_vec());
    }

    // Gzip check: 0x1f 0x8b
    if data.len() >= 2 && data[0] == 0x1f && data[1] == 0x8b {
        let mut decoder = flate2::read::GzDecoder::new(data);
        let mut decompressed = Vec::new();
        decoder.read_to_end(&mut decompressed)
            .map_err(|e| format!("failed to decompress gzip wasm: {}", e))?;
        return Ok(decompressed);
    }

    // Zip check: PK\x03\x04
    if data.len() >= 4 && &data[0..4] == b"PK\x03\x04" {
        let reader = std::io::Cursor::new(data);
        let mut archive = zip::ZipArchive::new(reader)
            .map_err(|e| format!("failed to open zip archive: {}", e))?;
        for i in 0..archive.len() {
            let mut file = archive.by_index(i)
                .map_err(|e| format!("failed to read zip file entry: {}", e))?;
            if file.name().ends_with(".wasm") {
                let mut decompressed = Vec::new();
                file.read_to_end(&mut decompressed)
                    .map_err(|e| format!("failed to read wasm file from zip: {}", e))?;
                return Ok(decompressed);
            }
        }
        return Err("no .wasm file found inside zip archive".to_string());
    }

    // Brotli check
    let mut decompressed = Vec::new();
    let mut reader = brotli::Decompressor::new(data, 4096);
    if reader.read_to_end(&mut decompressed).is_ok() {
        if decompressed.len() >= 4 && &decompressed[0..4] == b"\x00asm" {
            return Ok(decompressed);
        }
    }

    Err("unsupported or invalid WebAssembly binary format".to_string())
}

#[derive(Deserialize, Clone, Debug)]
pub struct Workflow {
    pub id: String,
    pub name: String,
    pub nodes: Vec<serde_json::Value>,
    pub flows: Vec<serde_json::Value>,
    #[serde(skip)]
    pub current_node_id: String,
    #[serde(skip)]
    pub pending_merges: Vec<String>,
}

impl serde::Serialize for Workflow {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;

        let mut nodes = self.nodes.clone();
        let mut flows = self.flows.clone();

        let mut source_ids = std::collections::HashSet::new();
        for f in &self.flows {
            if let Some(src) = f.get("source").and_then(|v| v.as_str()) {
                source_ids.insert(src.to_string());
            }
        }

        for node in &self.nodes {
            let node_type = node.get("type").and_then(|v| v.as_str()).unwrap_or("");
            let node_id = node.get("id").and_then(|v| v.as_str()).unwrap_or("");
            if node_type == "endEvent" || node_type == "startEvent" {
                continue;
            }
            if !source_ids.contains(node_id) {
                let end_id = format!("end_{}", node_id);
                nodes.push(serde_json::json!({
                    "type": "endEvent",
                    "id": end_id,
                    "name": "Process Finished"
                }));
                flows.push(serde_json::json!({
                    "id": format!("flow-{}-{}", node_id, end_id),
                    "source": node_id,
                    "target": end_id,
                    "condition": ""
                }));
            }
        }

        let mut state = serializer.serialize_struct("Workflow", 4)?;
        state.serialize_field("id", &self.id)?;
        state.serialize_field("name", &self.name)?;
        state.serialize_field("nodes", &nodes)?;
        state.serialize_field("flows", &flows)?;
        state.end()
    }
}

impl Workflow {
    pub fn new(id: &str, name: &str) -> Self {
        Workflow {
            id: id.to_string(),
            name: name.to_string(),
            nodes: vec![],
            flows: vec![],
            current_node_id: "".to_string(),
            pending_merges: vec![],
        }
    }

    pub fn builder(&mut self) -> &mut Self {
        self
    }

    pub fn start_event(&mut self, node_id: &str) -> StartEventBuilder<'_> {
        self.nodes.push(serde_json::json!({
            "type": "startEvent",
            "id": node_id,
            "name": "Start"
        }));
        StartEventBuilder { workflow: self, id: node_id.to_string() }
    }

    pub fn end_event(&mut self, node_id: &str, name: &str) -> &mut Self {
        self.nodes.push(serde_json::json!({
            "type": "endEvent",
            "id": node_id,
            "name": name
        }));
        self
    }

    pub fn service_task(&mut self, node_id: &str, name: &str, topic: &str) -> ServiceTaskBuilder<'_> {
        self.nodes.push(serde_json::json!({
            "type": "serviceTask",
            "id": node_id,
            "name": name,
            "topic": topic
        }));
        ServiceTaskBuilder { workflow: self, id: node_id.to_string() }
    }

    pub fn ai_task(&mut self, node_id: &str, name: &str) -> AITaskBuilder<'_> {
        self.nodes.push(serde_json::json!({
            "type": "aiServiceTask",
            "id": node_id,
            "name": name
        }));
        AITaskBuilder { workflow: self, id: node_id.to_string() }
    }

    pub fn user_task(&mut self, node_id: &str, name: &str) -> UserTaskBuilder<'_> {
        self.nodes.push(serde_json::json!({
            "type": "userTask",
            "id": node_id,
            "name": name
        }));
        UserTaskBuilder { workflow: self, id: node_id.to_string() }
    }

    pub fn exclusive_gateway(&mut self, node_id: &str, name: &str) -> ExclusiveGatewayBuilder<'_> {
        self.nodes.push(serde_json::json!({
            "type": "exclusiveGateway",
            "id": node_id,
            "name": name
        }));
        ExclusiveGatewayBuilder { workflow: self, id: node_id.to_string() }
    }

    pub fn parallel_gateway(&mut self, node_id: &str, name: &str) -> ParallelGatewayBuilder<'_> {
        self.nodes.push(serde_json::json!({
            "type": "parallelGateway",
            "id": node_id,
            "name": name
        }));
        ParallelGatewayBuilder { workflow: self, id: node_id.to_string() }
    }

    pub fn event_based_gateway(&mut self, node_id: &str, name: &str) -> EventBasedGatewayBuilder<'_> {
        self.nodes.push(serde_json::json!({
            "type": "eventBasedGateway",
            "id": node_id,
            "name": name
        }));
        EventBasedGatewayBuilder { workflow: self, id: node_id.to_string() }
    }

    pub fn call_activity(&mut self, node_id: &str, name: &str, called_element: &str) -> CallActivityBuilder<'_> {
        self.nodes.push(serde_json::json!({
            "type": "callActivity",
            "id": node_id,
            "name": name,
            "calledElement": called_element
        }));
        CallActivityBuilder { workflow: self, id: node_id.to_string() }
    }

    pub fn business_rule_task(&mut self, node_id: &str, name: &str, decision_ref: &str) -> BusinessRuleTaskBuilder<'_> {
        self.nodes.push(serde_json::json!({
            "type": "businessRuleTask",
            "id": node_id,
            "name": name,
            "decisionRef": decision_ref
        }));
        BusinessRuleTaskBuilder { workflow: self, id: node_id.to_string() }
    }

    pub fn sequence_flow(&mut self, source: &str, target: &str) -> &mut Self {
        self.flows.push(serde_json::json!({
            "id": format!("flow-{}-{}", source, target),
            "source": source,
            "target": target,
            "condition": ""
        }));
        self
    }

    pub fn sequence_flow_with_condition(&mut self, source: &str, target: &str, condition: &str) -> &mut Self {
        self.flows.push(serde_json::json!({
            "id": format!("flow-{}-{}", source, target),
            "source": source,
            "target": target,
            "condition": condition
        }));
        self
    }

    pub fn find_node_mut(&mut self, node_id: &str) -> Option<&mut serde_json::Map<String, serde_json::Value>> {
        for n in &mut self.nodes {
            if let Some(obj) = n.as_object_mut() {
                if obj.get("id").and_then(|v| v.as_str()) == Some(node_id) {
                    return Some(obj);
                }
            }
        }
        None
    }

    pub fn build_xml(&self) -> Result<String, String> {
        self.build_xml_with_bytes(DEFAULT_WASM_BYTES)
    }

    pub fn build_xml_with_path(&self, path: &str) -> Result<String, String> {
        let data = std::fs::read(path)
            .map_err(|e| format!("failed to read wasm path {}: {}", path, e))?;
        self.build_xml_with_bytes(&data)
    }

    pub fn build_xml_with_bytes(&self, wasm_bytes: &[u8]) -> Result<String, String> {
        let decompressed_bytes = decompress_wasm_if_needed(wasm_bytes)?;

        let config = Config::new();
        let engine = Engine::new(&config).map_err(|e| e.to_string())?;


        let mut linker = Linker::new(&engine);
        wasmtime_wasi::preview1::add_to_linker_sync(&mut linker, |state: &mut WasiP1Ctx| state)
            .map_err(|e| e.to_string())?;

        let wasi = WasiCtxBuilder::new()
            .inherit_stdout()
            .inherit_stderr()
            .build_p1();

        let mut store = Store::new(&engine, wasi);
        let module = Module::new(&engine, &decompressed_bytes).map_err(|e| e.to_string())?;
        let instance = linker.instantiate(&mut store, &module).map_err(|e| e.to_string())?;

        if let Some(start_func) = instance.get_typed_func::<(), ()>(&mut store, "_start").ok() {
            let _ = start_func.call(&mut store, ());
        }

        let allocate = instance.get_typed_func::<i32, i32>(&mut store, "allocate")
            .map_err(|e| format!("missing allocate export: {}", e))?;
        let deallocate = instance.get_typed_func::<(i32, i32), ()>(&mut store, "deallocate")
            .map_err(|e| format!("missing deallocate export: {}", e))?;
        let compile_workflow = instance.get_typed_func::<(i32, i32), i64>(&mut store, "compileWorkflow")
            .map_err(|e| format!("missing compileWorkflow export: {}", e))?;

        let memory = instance.get_memory(&mut store, "memory")
            .ok_or_else(|| "missing memory export".to_string())?;

        let ast_json = serde_json::to_string(self).map_err(|e| e.to_string())?;
        let ast_bytes = ast_json.as_bytes();

        let input_ptr = allocate.call(&mut store, ast_bytes.len() as i32)
            .map_err(|e| format!("failed to allocate wasm memory: {}", e))?;

        memory.write(&mut store, input_ptr as usize, ast_bytes)
            .map_err(|e| format!("failed to write to wasm memory: {}", e))?;

        let packed_result = compile_workflow.call(&mut store, (input_ptr, ast_bytes.len() as i32))
            .map_err(|e| format!("failed to run compileWorkflow: {}", e))?;

        let result_ptr = ((packed_result >> 32) & 0xFFFFFFFF) as usize;
        let result_size = (packed_result & 0xFFFFFFFF) as usize;

        let mut result_bytes = vec![0u8; result_size];
        memory.read(&store, result_ptr, &mut result_bytes)
            .map_err(|e| format!("failed to read from wasm memory: {}", e))?;

        let _ = deallocate.call(&mut store, (input_ptr, ast_bytes.len() as i32));
        let _ = deallocate.call(&mut store, (result_ptr as i32, result_size as i32));

        let result_str = String::from_utf8(result_bytes)
            .map_err(|e| format!("invalid utf-8 compile result: {}", e))?;

        let result_json: serde_json::Value = serde_json::from_str(&result_str)
            .map_err(|e| format!("invalid json compile result: {}", e))?;

        if let Some(err_val) = result_json.get("error").and_then(|v| v.as_str()) {
            if !err_val.is_empty() {
                return Err(format!("wasm compilation error: {}", err_val));
            }
        }

        let xml = result_json.get("xml").and_then(|v| v.as_str())
            .ok_or_else(|| "missing xml in compile result".to_string())?;

        Ok(xml.to_string())
    }
}

pub struct StartEventBuilder<'a> {
    workflow: &'a mut Workflow,
    id: String,
}

impl<'a> StartEventBuilder<'a> {
    pub fn next(self, target_id: &str) -> &'a mut Workflow {
        self.workflow.sequence_flow(&self.id, target_id);
        self.workflow
    }

    pub fn connect_to(self, target_id: &str) -> &'a mut Workflow {
        self.next(target_id)
    }

    pub fn builder(self) -> &'a mut Workflow {
        self.workflow
    }
}

pub struct ServiceTaskBuilder<'a> {
    workflow: &'a mut Workflow,
    id: String,
}

impl<'a> ServiceTaskBuilder<'a> {
    pub fn wasm_path(self, path: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            node.insert("wasmPath".to_string(), serde_json::json!(path));
        }
        self
    }

    pub fn wasm(self, path: &str) -> Self {
        self.wasm_path(path)
    }

    pub fn next(self, target_id: &str) -> &'a mut Workflow {
        self.workflow.sequence_flow(&self.id, target_id);
        self.workflow
    }

    pub fn connect_to(self, target_id: &str) -> &'a mut Workflow {
        self.next(target_id)
    }

    pub fn builder(self) -> &'a mut Workflow {
        self.workflow
    }
}

pub struct AITaskBuilder<'a> {
    workflow: &'a mut Workflow,
    id: String,
}

impl<'a> AITaskBuilder<'a> {
    pub fn provider(self, p: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            node.insert("provider".to_string(), serde_json::json!(p));
        }
        self
    }

    pub fn model(self, m: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            node.insert("model".to_string(), serde_json::json!(m));
        }
        self
    }

    pub fn prompt(self, p: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            node.insert("prompt".to_string(), serde_json::json!(p));
        }
        self
    }

    pub fn system_instruction(self, si: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            node.insert("systemInstruction".to_string(), serde_json::json!(si));
        }
        self
    }

    pub fn response_schema(self, rs: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            node.insert("responseSchema".to_string(), serde_json::json!(rs));
        }
        self
    }

    pub fn temperature(self, t: f64) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            node.insert("temperature".to_string(), serde_json::json!(t));
        }
        self
    }

    pub fn result_var(self, rv: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            node.insert("resultVar".to_string(), serde_json::json!(rv));
        }
        self
    }

    pub fn next(self, target_id: &str) -> &'a mut Workflow {
        self.workflow.sequence_flow(&self.id, target_id);
        self.workflow
    }

    pub fn connect_to(self, target_id: &str) -> &'a mut Workflow {
        self.next(target_id)
    }

    pub fn builder(self) -> &'a mut Workflow {
        self.workflow
    }
}

pub struct UserTaskBuilder<'a> {
    workflow: &'a mut Workflow,
    id: String,
}

impl<'a> UserTaskBuilder<'a> {
    pub fn assignee(self, a: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            node.insert("assignee".to_string(), serde_json::json!(a));
        }
        self
    }

    pub fn candidate_groups(self, cg: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            node.insert("candidateGroups".to_string(), serde_json::json!(cg));
        }
        self
    }

    pub fn due_date(self, d: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            node.insert("dueDate".to_string(), serde_json::json!(d));
        }
        self
    }

    pub fn next(self, target_id: &str) -> &'a mut Workflow {
        self.workflow.sequence_flow(&self.id, target_id);
        self.workflow
    }

    pub fn connect_to(self, target_id: &str) -> &'a mut Workflow {
        self.next(target_id)
    }

    pub fn builder(self) -> &'a mut Workflow {
        self.workflow
    }
}

pub struct ExclusiveGatewayBuilder<'a> {
    workflow: &'a mut Workflow,
    id: String,
}

impl<'a> ExclusiveGatewayBuilder<'a> {
    pub fn next(self, target_id: &str) -> &'a mut Workflow {
        self.workflow.sequence_flow(&self.id, target_id);
        self.workflow
    }

    pub fn next_with_condition(self, target_id: &str, condition: &str) -> &'a mut Workflow {
        self.workflow.sequence_flow_with_condition(&self.id, target_id, condition);
        self.workflow
    }

    pub fn condition(self, target_id: &str, cond: &str) -> Self {
        self.workflow.sequence_flow_with_condition(&self.id, target_id, cond);
        self
    }

    pub fn default(self, target_id: &str) -> Self {
        self.workflow.sequence_flow(&self.id, target_id);
        self
    }

    pub fn connect_to(self, target_id: &str) -> &'a mut Workflow {
        self.next(target_id)
    }

    pub fn builder(self) -> &'a mut Workflow {
        self.workflow
    }
}

pub struct ParallelGatewayBuilder<'a> {
    workflow: &'a mut Workflow,
    id: String,
}

impl<'a> ParallelGatewayBuilder<'a> {
    pub fn next(self, target_id: &str) -> &'a mut Workflow {
        self.workflow.sequence_flow(&self.id, target_id);
        self.workflow
    }

    pub fn connect_to(self, target_id: &str) -> &'a mut Workflow {
        self.next(target_id)
    }

    pub fn builder(self) -> &'a mut Workflow {
        self.workflow
    }
}

pub struct EventBasedGatewayBuilder<'a> {
    workflow: &'a mut Workflow,
    id: String,
}

impl<'a> EventBasedGatewayBuilder<'a> {
    pub fn next(self, target_id: &str) -> &'a mut Workflow {
        self.workflow.sequence_flow(&self.id, target_id);
        self.workflow
    }

    pub fn connect_to(self, target_id: &str) -> &'a mut Workflow {
        self.next(target_id)
    }

    pub fn builder(self) -> &'a mut Workflow {
        self.workflow
    }
}

pub struct CallActivityBuilder<'a> {
    workflow: &'a mut Workflow,
    id: String,
}

impl<'a> CallActivityBuilder<'a> {
    pub fn in_val(self, source: &str, target: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            let in_vars = node.entry("inVariables".to_string()).or_insert_with(|| serde_json::Value::Array(vec![]));
            if let Some(arr) = in_vars.as_array_mut() {
                arr.push(serde_json::json!({
                    "source": source,
                    "target": target,
                    "variables": "",
                    "local": false
                }));
            }
        }
        self
    }

    pub fn in_all(self) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            let in_vars = node.entry("inVariables".to_string()).or_insert_with(|| serde_json::Value::Array(vec![]));
            if let Some(arr) = in_vars.as_array_mut() {
                arr.push(serde_json::json!({
                    "source": "",
                    "target": "",
                    "variables": "all",
                    "local": false
                }));
            }
        }
        self
    }

    pub fn out_val(self, source: &str, target: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            let out_vars = node.entry("outVariables".to_string()).or_insert_with(|| serde_json::Value::Array(vec![]));
            if let Some(arr) = out_vars.as_array_mut() {
                arr.push(serde_json::json!({
                    "source": source,
                    "target": target,
                    "variables": ""
                }));
            }
        }
        self
    }

    pub fn out_all(self) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            let out_vars = node.entry("outVariables".to_string()).or_insert_with(|| serde_json::Value::Array(vec![]));
            if let Some(arr) = out_vars.as_array_mut() {
                arr.push(serde_json::json!({
                    "source": "",
                    "target": "",
                    "variables": "all"
                }));
            }
        }
        self
    }

    pub fn next(self, target_id: &str) -> &'a mut Workflow {
        self.workflow.sequence_flow(&self.id, target_id);
        self.workflow
    }

    pub fn connect_to(self, target_id: &str) -> &'a mut Workflow {
        self.next(target_id)
    }

    pub fn builder(self) -> &'a mut Workflow {
        self.workflow
    }
}

pub struct BusinessRuleTaskBuilder<'a> {
    workflow: &'a mut Workflow,
    id: String,
}

impl<'a> BusinessRuleTaskBuilder<'a> {
    pub fn map_decision_result(self, map_decision_result: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            node.insert("mapDecisionResult".to_string(), serde_json::json!(map_decision_result));
        }
        self
    }

    pub fn result_variable(self, result_var: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            node.insert("resultVar".to_string(), serde_json::json!(result_var));
        }
        self
    }

    pub fn hit_policy(self, hit_policy: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            node.insert("hitPolicy".to_string(), serde_json::json!(hit_policy));
        }
        self
    }

    pub fn input(self, expression: &str, type_str: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            let inputs = node.entry("inputs".to_string()).or_insert_with(|| serde_json::Value::Array(vec![]));
            if let Some(arr) = inputs.as_array_mut() {
                arr.push(serde_json::json!({
                    "expression": expression,
                    "type": type_str
                }));
            }
        }
        self
    }

    pub fn output(self, name: &str, type_str: &str) -> Self {
        if let Some(node) = self.workflow.find_node_mut(&self.id) {
            let outputs = node.entry("outputs".to_string()).or_insert_with(|| serde_json::Value::Array(vec![]));
            if let Some(arr) = outputs.as_array_mut() {
                arr.push(serde_json::json!({
                    "name": name,
                    "type": type_str
                }));
            }
        }
        self
    }

    pub fn rule(self) -> DMNRuleBuilder<'a> {
        DMNRuleBuilder {
            task_builder: self,
            inputs: std::collections::HashMap::new(),
            outputs: std::collections::HashMap::new(),
        }
    }

    pub fn next(self, target_id: &str) -> &'a mut Workflow {
        self.workflow.sequence_flow(&self.id, target_id);
        self.workflow
    }

    pub fn connect_to(self, target_id: &str) -> &'a mut Workflow {
        self.next(target_id)
    }

    pub fn builder(self) -> &'a mut Workflow {
        self.workflow
    }
}

pub struct DMNRuleBuilder<'a> {
    task_builder: BusinessRuleTaskBuilder<'a>,
    inputs: std::collections::HashMap<String, String>,
    outputs: std::collections::HashMap<String, String>,
}

impl<'a> DMNRuleBuilder<'a> {
    pub fn when(mut self, expression: &str, val: serde_json::Value) -> Self {
        self.inputs.insert(expression.to_string(), format_dmn_value(val));
        self
    }

    pub fn then(mut self, name: &str, val: serde_json::Value) -> Self {
        self.outputs.insert(name.to_string(), format_dmn_value(val));
        self
    }

    fn commit(&mut self) {
        let node = match self.task_builder.workflow.find_node_mut(&self.task_builder.id) {
            Some(n) => n,
            None => return,
        };

        let inputs_list = node.get("inputs").and_then(|v| v.as_array()).cloned().unwrap_or_default();
        let outputs_list = node.get("outputs").and_then(|v| v.as_array()).cloned().unwrap_or_default();

        let rules = node.entry("rules".to_string()).or_insert_with(|| serde_json::Value::Array(vec![]));
        let rules_array = rules.as_array_mut().unwrap();


        let mut rule_inputs = vec![];
        for in_val in &inputs_list {
            let expr = in_val.get("expression").and_then(|v| v.as_str()).unwrap_or("");
            if let Some(val) = self.inputs.get(expr) {
                rule_inputs.push(serde_json::Value::String(val.clone()));
            } else {
                rule_inputs.push(serde_json::Value::String("-".to_string()));
            }
        }

        let mut rule_outputs = vec![];
        for out_val in &outputs_list {
            let name = out_val.get("name").and_then(|v| v.as_str()).unwrap_or("");
            if let Some(val) = self.outputs.get(name) {
                rule_outputs.push(serde_json::Value::String(val.clone()));
            } else {
                rule_outputs.push(serde_json::Value::String("-".to_string()));
            }
        }

        rules_array.push(serde_json::json!({
            "inputs": rule_inputs,
            "outputs": rule_outputs
        }));
    }

    pub fn rule(mut self) -> Self {
        self.commit();
        let task_builder = self.task_builder;
        DMNRuleBuilder {
            task_builder,
            inputs: std::collections::HashMap::new(),
            outputs: std::collections::HashMap::new(),
        }
    }

    pub fn next(mut self, target_id: &str) -> &'a mut Workflow {
        self.commit();
        self.task_builder.next(target_id)
    }

    pub fn connect_to(self, target_id: &str) -> &'a mut Workflow {
        self.next(target_id)
    }

    pub fn builder(mut self) -> &'a mut Workflow {
        self.commit();
        self.task_builder.builder()
    }
}

fn format_dmn_value(val: serde_json::Value) -> String {
    match val {
        serde_json::Value::Null => "-".to_string(),
        serde_json::Value::Bool(b) => if b { "true".to_string() } else { "false".to_string() },
        serde_json::Value::Number(n) => n.to_string(),
        serde_json::Value::String(s) => {
            let trimmed = s.trim();
            for op in &["<=", ">=", "!=", "<>", "<", ">"] {
                if trimmed.starts_with(op) {
                    return trimmed.to_string();
                }
            }
            if trimmed == "true" || trimmed == "false" {
                return trimmed.to_string();
            }
            if trimmed.parse::<f64>().is_ok() {
                return trimmed.to_string();
            }
            format!("\"{}\"", trimmed)
        }
        _ => val.to_string(),
    }
}

// Closure-based DSL extensions for Workflow
impl Workflow {
    fn connect_node(&mut self, node_id: &str) {
        let has_start = self.nodes.iter().any(|n| {
            n.get("type").and_then(|v| v.as_str()) == Some("startEvent")
        });
        let mut node_type = "";
        for n in &self.nodes {
            if n.get("id").and_then(|v| v.as_str()) == Some(node_id) {
                node_type = n.get("type").and_then(|v| v.as_str()).unwrap_or("");
                break;
            }
        }
        if !has_start && node_type != "startEvent" && !node_type.is_empty() {
            self.start_event("start");
            self.sequence_flow("start", node_id);
            self.current_node_id = node_id.to_string();
            return;
        }

        if !self.pending_merges.is_empty() {
            let merges = self.pending_merges.clone();
            for source_id in &merges {
                self.sequence_flow(source_id, node_id);
            }
            self.pending_merges.clear();
        } else if !self.current_node_id.is_empty() && self.current_node_id != node_id {
            let current = self.current_node_id.clone();
            self.sequence_flow(&current, node_id);
        }
        self.current_node_id = node_id.to_string();
    }

    pub fn start(&mut self) -> &mut Self {
        self.start_event("start");
        self.connect_node("start");
        self
    }

    pub fn end(&mut self, node_id: &str, name: &str) -> &mut Self {
        self.end_event(node_id, name);
        self.connect_node(node_id);
        self.current_node_id = "".to_string();
        self
    }

    pub fn user<F>(&mut self, node_id: &str, name: &str, config: F) -> &mut Self
    where
        F: FnOnce(UserTaskBuilder<'_>) -> UserTaskBuilder<'_>
    {
        let builder = self.user_task(node_id, name);
        let _ = config(builder);
        self.connect_node(node_id);
        self
    }

    pub fn service<F>(&mut self, node_id: &str, name: &str, topic: &str, config: F) -> &mut Self
    where
        F: FnOnce(ServiceTaskBuilder<'_>) -> ServiceTaskBuilder<'_>
    {
        let builder = self.service_task(node_id, name, topic);
        let _ = config(builder);
        self.connect_node(node_id);
        self
    }

    pub fn ai<F>(&mut self, node_id: &str, name: &str, config: F) -> &mut Self
    where
        F: FnOnce(AITaskBuilder<'_>) -> AITaskBuilder<'_>
    {
        let builder = self.ai_task(node_id, name);
        let _ = config(builder);
        self.connect_node(node_id);
        self
    }

    pub fn when<C>(&mut self, condition: C) -> WhenBuilder<'_>
    where
        C: ToCondition,
    {
        let gw_id = format!("gw_{}_decision", self.current_node_id);
        self.exclusive_gateway(&gw_id, "Decision Gateway");
        self.connect_node(&gw_id);

        WhenBuilder {
            workflow: self,
            gateway_id: gw_id,
            condition: condition.to_condition(),
        }
    }
}

pub struct Branch<'a> {
    pub workflow: &'a mut Workflow,
    pub gateway_id: String,
    pub current_node_id: String,
    pub is_conditional: bool,
    pub condition: Option<String>,
    pub has_ended: bool,
}

impl<'a> Branch<'a> {
    fn connect_node(&mut self, node_id: &str) {
        if self.has_ended {
            return;
        }

        let merges = self.workflow.pending_merges.clone();
        if !merges.is_empty() {
            for source_id in &merges {
                self.workflow.sequence_flow(source_id, node_id);
            }
            self.workflow.pending_merges.clear();
            self.current_node_id = node_id.to_string();
            return;
        }

        if self.current_node_id == self.gateway_id {
            let gateway_id = self.gateway_id.clone();
            if self.is_conditional {
                let cond = self.condition.as_deref().unwrap_or("");
                self.workflow.sequence_flow_with_condition(&gateway_id, node_id, cond);
            } else {
                self.workflow.sequence_flow(&gateway_id, node_id);
            }
        } else if !self.current_node_id.is_empty() && self.current_node_id != node_id {
            let current = self.current_node_id.clone();
            self.workflow.sequence_flow(&current, node_id);
        }

        self.current_node_id = node_id.to_string();
    }

    pub fn user<F>(&mut self, node_id: &str, name: &str, config: F) -> &mut Self
    where
        F: FnOnce(UserTaskBuilder<'_>) -> UserTaskBuilder<'_>
    {
        let builder = self.workflow.user_task(node_id, name);
        let _ = config(builder);
        self.connect_node(node_id);
        self
    }

    pub fn service<F>(&mut self, node_id: &str, name: &str, topic: &str, config: F) -> &mut Self
    where
        F: FnOnce(ServiceTaskBuilder<'_>) -> ServiceTaskBuilder<'_>
    {
        let builder = self.workflow.service_task(node_id, name, topic);
        let _ = config(builder);
        self.connect_node(node_id);
        self
    }

    pub fn ai<F>(&mut self, node_id: &str, name: &str, config: F) -> &mut Self
    where
        F: FnOnce(AITaskBuilder<'_>) -> AITaskBuilder<'_>
    {
        let builder = self.workflow.ai_task(node_id, name);
        let _ = config(builder);
        self.connect_node(node_id);
        self
    }

    pub fn end(&mut self, node_id: &str, name: &str) -> &mut Self {
        self.workflow.end_event(node_id, name);
        self.connect_node(node_id);
        self.has_ended = true;
        self
    }

    pub fn when<C>(&mut self, condition: C) -> WhenBranchBuilder<'_, 'a>
    where
        C: ToCondition,
    {
        let gw_id = format!("gw_{}_decision", self.current_node_id);
        self.workflow.exclusive_gateway(&gw_id, "Decision Gateway");
        self.connect_node(&gw_id);

        WhenBranchBuilder {
            branch: self,
            gateway_id: gw_id,
            condition: condition.to_condition(),
        }
    }
}

pub struct WhenBuilder<'a> {
    pub workflow: &'a mut Workflow,
    pub gateway_id: String,
    pub condition: String,
}

impl<'a> WhenBuilder<'a> {
    pub fn then<F>(self, then_fn: F) -> ThenBuilder<'a>
    where
        F: FnOnce(&mut Branch<'_>)
    {
        let mut then_b = Branch {
            workflow: self.workflow,
            gateway_id: self.gateway_id.clone(),
            current_node_id: self.gateway_id.clone(),
            is_conditional: true,
            condition: Some(self.condition),
            has_ended: false,
        };
        then_fn(&mut then_b);

        if !then_b.has_ended && then_b.current_node_id != self.gateway_id {
            then_b.workflow.pending_merges.push(then_b.current_node_id);
        }

        ThenBuilder {
            workflow: then_b.workflow,
            gateway_id: self.gateway_id,
        }
    }
}

pub struct ThenBuilder<'a> {
    pub workflow: &'a mut Workflow,
    pub gateway_id: String,
}

impl<'a> ThenBuilder<'a> {
    pub fn otherwise<F>(self, else_fn: F) -> &'a mut Workflow
    where
        F: FnOnce(&mut Branch<'_>)
    {
        let mut else_b = Branch {
            workflow: self.workflow,
            gateway_id: self.gateway_id.clone(),
            current_node_id: self.gateway_id.clone(),
            is_conditional: false,
            condition: None,
            has_ended: false,
        };
        else_fn(&mut else_b);

        if !else_b.has_ended && else_b.current_node_id != self.gateway_id {
            else_b.workflow.pending_merges.push(else_b.current_node_id);
        }

        else_b.workflow
    }
}

pub struct WhenBranchBuilder<'b, 'a> {
    pub branch: &'b mut Branch<'a>,
    pub gateway_id: String,
    pub condition: String,
}

impl<'b, 'a> WhenBranchBuilder<'b, 'a> {
    pub fn then<F>(self, then_fn: F) -> ThenBranchBuilder<'b, 'a>
    where
        F: FnOnce(&mut Branch<'_>)
    {
        let mut then_b = Branch {
            workflow: &mut *self.branch.workflow,
            gateway_id: self.gateway_id.clone(),
            current_node_id: self.gateway_id.clone(),
            is_conditional: true,
            condition: Some(self.condition),
            has_ended: false,
        };
        then_fn(&mut then_b);

        if !then_b.has_ended && then_b.current_node_id != self.gateway_id {
            then_b.workflow.pending_merges.push(then_b.current_node_id);
        }

        ThenBranchBuilder {
            branch: self.branch,
            gateway_id: self.gateway_id,
        }
    }
}

pub struct ThenBranchBuilder<'b, 'a> {
    pub branch: &'b mut Branch<'a>,
    pub gateway_id: String,
}

impl<'b, 'a> ThenBranchBuilder<'b, 'a> {
    pub fn otherwise<F>(self, else_fn: F) -> &'b mut Branch<'a>
    where
        F: FnOnce(&mut Branch<'_>)
    {
        let mut else_b = Branch {
            workflow: &mut *self.branch.workflow,
            gateway_id: self.gateway_id.clone(),
            current_node_id: self.gateway_id.clone(),
            is_conditional: false,
            condition: None,
            has_ended: false,
        };
        else_fn(&mut else_b);

        if !else_b.has_ended && else_b.current_node_id != self.gateway_id {
            else_b.workflow.pending_merges.push(else_b.current_node_id);
        }

        self.branch
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_workflow_builder() {
        let mut w = Workflow::new("test-process", "Test Process");
        w.start_event("start")
            .connect_to("task1")
            .service_task("task1", "Service Task", "my-topic")
            .wasm("core.wasm")
            .connect_to("end")
            .end_event("end", "End");

        let xml = w.build_xml();
        assert!(xml.is_ok(), "failed to build xml: {:?}", xml.err());
        let xml_str = xml.unwrap();
        assert!(xml_str.contains("id=\"test-process\""));
        assert!(xml_str.contains("id=\"start\""));
        assert!(xml_str.contains("id=\"task1\""));
        assert!(xml_str.contains("id=\"end\""));
    }

    #[test]
    fn test_workflow_builder_closure_dsl() {
        let mut w = Workflow::new("test-process-dsl", "Test Process DSL");
        w.start("start")
            .user("task1", "User Task 1", |t| t.assignee("admin"))
            .when("${is_urgent == true}")
            .then(|b| {
                b.service("task2", "Urgent Task", "urgent_topic", |s| s)
                    .end("end_urgent", "Urgent Finished");
            })
            .otherwise(|b| {
                b.service("task3", "Normal Task", "normal_topic", |s| s)
                    .end("end_normal", "Normal Finished");
            });

        let xml = w.build_xml();
        assert!(xml.is_ok(), "failed to build xml: {:?}", xml.err());
        let xml_str = xml.unwrap();
        assert!(xml_str.contains("id=\"test-process-dsl\""));
        assert!(xml_str.contains("id=\"start\""));
        assert!(xml_str.contains("id=\"task1\""));
        assert!(xml_str.contains("id=\"task2\""));
        assert!(xml_str.contains("id=\"task3\""));
        assert!(xml_str.contains("id=\"end_urgent\""));
        assert!(xml_str.contains("id=\"end_normal\""));
    }

    #[test]
    #[ignore]
    fn test_workflow_builder_benchmark() {
        let mut w = Workflow::new("benchmark-process", "Benchmark Process");
        w.start_event("start")
            .connect_to("task1")
            .service_task("task1", "Service Task", "my-topic")
            .wasm("core.wasm")
            .connect_to("end")
            .end_event("end", "End");

        let iterations = 5; // Let's run 5 iterations to check the speed of WASM loading and compilation
        let start = std::time::Instant::now();
        for _ in 0..iterations {
            let xml = w.build_xml().unwrap();
            assert!(xml.contains("id=\"benchmark-process\""));
        }
        let duration = start.elapsed();
        println!("Compiled {} workflows in {:?}", iterations, duration);
        println!("Average compilation time per workflow: {:?}", duration / iterations);
    }
}

pub trait ToCondition {
    fn to_condition(&self) -> String;
}

impl ToCondition for &str {
    fn to_condition(&self) -> String {
        self.to_string()
    }
}

impl ToCondition for String {
    fn to_condition(&self) -> String {
        self.clone()
    }
}

impl ToCondition for Expression {
    fn to_condition(&self) -> String {
        self.to_string()
    }
}

#[derive(Clone, Debug)]
pub struct Expression {
    pub expr: String,
}

impl std::fmt::Display for Expression {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "${{{}}}", self.expr)
    }
}

#[derive(Clone, Debug)]
pub struct Variable {
    pub name: String,
}

pub fn v(name: &str) -> Variable {
    Variable { name: name.to_string() }
}

pub fn var(name: &str) -> Variable {
    Variable { name: name.to_string() }
}

impl Variable {
    pub fn eq<T: std::fmt::Display>(&self, val: T) -> Expression {
        Expression { expr: format!("{} == {}", self.name, val) }
    }
    pub fn ne<T: std::fmt::Display>(&self, val: T) -> Expression {
        Expression { expr: format!("{} != {}", self.name, val) }
    }
    pub fn gt<T: std::fmt::Display>(&self, val: T) -> Expression {
        Expression { expr: format!("{} > {}", self.name, val) }
    }
    pub fn gte<T: std::fmt::Display>(&self, val: T) -> Expression {
        Expression { expr: format!("{} >= {}", self.name, val) }
    }
    pub fn lt<T: std::fmt::Display>(&self, val: T) -> Expression {
        Expression { expr: format!("{} < {}", self.name, val) }
    }
    pub fn lte<T: std::fmt::Display>(&self, val: T) -> Expression {
        Expression { expr: format!("{} <= {}", self.name, val) }
    }
}

