package com.nativebpm.example;

import com.nativebpm.client.builder.Workflow;

public class WorkflowWasmExample {
    public static String buildWorkflow() throws Exception {
        System.out.println("=== NativeBPM Java SDK: Workflow as Code ===");

        // 1. Build workflow dynamically using Workflow as Code Fluent API
        System.out.println("🔨 Building workflow dynamically using Fluent API...");
        Workflow workflow = new Workflow("native-demo", "Workflow as Code");

        // Chain starting from the start event
        workflow.start("start")
                .ifBranch("${isUrgent == true}", b -> {
                    b.user("reviewOrder", "Review Order Details", ut -> {
                        ut.assignee("sales_representative");
                    }).end("end_review", "Process Finished");
                })
                .elseBranch(b -> {
                    b.service("notifyCustomer", "Send Confirmation Email", "email_topic")
                     .end("end_default", "Process Finished");
                });

        String bpmnXml = workflow.buildXML();
        System.out.println("✓ Successfully compiled native workflow AST to BPMN 2.0 XML.");
        return bpmnXml;
    }
}
