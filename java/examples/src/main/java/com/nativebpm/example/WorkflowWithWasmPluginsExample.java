package com.nativebpm.example;

import com.nativebpm.client.builder.Workflow;
import static com.nativebpm.client.builder.Workflow.V;

public class WorkflowWithWasmPluginsExample {
    public static String buildWorkflow() throws Exception {
        System.out.println("=== NativeBPM Java SDK: Workflow with Guest WASM Plugins ===");

        // 1. Build workflow dynamically using Workflow as Code Fluent API
        System.out.println("🔨 Building workflow dynamically using Fluent API...");
        Workflow workflow = new Workflow("wasm-demo", "Workflow with Guest WASM Plugins");

        // Chain starting from the first activity (auto-start will prepend start event)
        workflow.service("calculate", "Calculate Totals", "payment_topic", st -> {
                    st.wasm("./calculate_total.wasm");
                })
                .ai("aiCheck", "AI Fraud Guard", ait -> {
                    ait.provider("google")
                       .model("gemini-2.5-flash")
                       .prompt("Analyze transaction for fraud: ${orderAmount}")
                       .resultVar("isFraudulent");
                })
                .ifBranch(V("isFraudulent").eq(true), b -> {
                    b.user("userTask", "Manual Fraud Approval", ut -> {
                        ut.assignee("security_officer");
                    });
                })
                .elseBranch(b -> {
                    // empty branch (will auto-route to end event)
                });

        String bpmnXml = workflow.buildXML();
        System.out.println("✓ Successfully compiled WASM workflow AST to BPMN 2.0 XML.");
        return bpmnXml;
    }
}
