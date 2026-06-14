package com.nativebpm.example;

import com.nativebpm.client.builder.Workflow;

public class WorkflowWithWasmPluginsExample {
    public static String buildWorkflow() throws Exception {
        System.out.println("=== NativeBPM Java SDK: Workflow with Guest WASM Plugins ===");

        // 1. Build workflow dynamically using Workflow as Code Fluent API
        System.out.println("🔨 Building workflow dynamically using Fluent API...");
        Workflow workflow = new Workflow("wasm-demo", "Workflow with Guest WASM Plugins");

        // Chain starting from start event
        workflow.start("start")
                .service("calculate", "Calculate Totals", "payment_topic", st -> {
                    st.wasm("./calculate_total.wasm");
                })
                .ai("aiCheck", "AI Fraud Guard", ait -> {
                    ait.provider("google")
                       .model("gemini-2.5-flash")
                       .prompt("Analyze transaction for fraud: ${orderAmount}")
                       .resultVar("isFraudulent");
                })
                .ifBranch("${isFraudulent == true}", b -> {
                    b.user("userTask", "Manual Fraud Approval", ut -> {
                        ut.assignee("security_officer");
                    }).end("end_fraud", "Process Finished");
                })
                .elseBranch(b -> {
                    b.end("end_ok", "Process Finished");
                });

        String bpmnXml = workflow.buildXML();
        System.out.println("✓ Successfully compiled WASM workflow AST to BPMN 2.0 XML.");
        return bpmnXml;
    }
}
