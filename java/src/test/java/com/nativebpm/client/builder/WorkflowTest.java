package com.nativebpm.client.builder;

import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class WorkflowTest {

    @Test
    public void testWorkflowGeneration() throws Exception {
        System.out.println("Running Java SDK workflow AST test...");
        Workflow workflow = new Workflow("test-process", "Test Process Schema");

        workflow.service("task1", "Service Task 1", "service-topic", Map.of("wasm", "./my_task.wasm"));

        workflow.exclusiveGateway("gateway", "Join/Split");

        workflow.user("userTask", "User Task Approve", Map.of("assignee", "boss"));

        workflow.end("end", "Process Completed");

        // Connect them
        workflow.sequenceFlow("start", "task1");
        workflow.sequenceFlow("task1", "gateway");
        workflow.sequenceFlowWithCondition("gateway", "userTask", "isApproved == true");
        workflow.sequenceFlowWithCondition("gateway", "end", "isApproved == false");
        workflow.sequenceFlow("userTask", "end");

        Map<String, Object> ast = workflow.toAST();
        assertNotNull(ast);
        assertEquals("test-process", ast.get("id"));
        assertEquals("Test Process Schema", ast.get("name"));
        
        String json = workflow.toJSON();
        System.out.println("JSON OUTPUT: " + json);
        assertTrue(json.contains("\"id\":\"test-process\""));
        assertTrue(json.contains("\"name\":\"Test Process Schema\""));
        assertTrue(json.contains("\"type\":\"startEvent\""));
        assertTrue(json.contains("\"type\":\"serviceTask\""));
        assertTrue(json.contains("\"topic\":\"service-topic\""));
        assertTrue(json.contains("\"wasmPath\":\"./my_task.wasm\""));
        assertTrue(json.contains("\"type\":\"userTask\""));
        assertTrue(json.contains("\"assignee\":\"boss\""));
        assertTrue(json.contains("\"type\":\"exclusiveGateway\""));
        assertTrue(json.contains("\"condition\":\"isApproved == true\""));
        assertTrue(json.contains("\"condition\":\"isApproved == false\""));
        assertTrue(json.contains("\"type\":\"endEvent\""));
        System.out.println("✓ Java SDK assertions passed successfully!");
    }

    @Test
    public void testLoadAndProfiling() throws Exception {
        System.out.println("Running Java SDK load and profiling test...");
        Runtime runtime = Runtime.getRuntime();
        runtime.gc();
        long baseline = runtime.totalMemory() - runtime.freeMemory();
        System.out.println(String.format("Baseline Memory: %.2f MB", baseline / (1024.0 * 1024.0)));

        for (int i = 0; i < 200; i++) {
            Workflow workflow = new Workflow("load-test-" + i, "Load Test " + i);
            workflow.end("end", "End");
            String json = workflow.toJSON();
            assertNotNull(json);
            
            if ((i + 1) % 50 == 0) {
                runtime.gc();
                long current = runtime.totalMemory() - runtime.freeMemory();
                System.out.println(String.format("Iteration %d/200 - Memory: %.2f MB", (i + 1), current / (1024.0 * 1024.0)));
            }
        }
         runtime.gc();
         long finalMem = runtime.totalMemory() - runtime.freeMemory();
         System.out.println(String.format("Final Memory: %.2f MB (Delta: %.2f MB)", finalMem / (1024.0 * 1024.0), (finalMem - baseline) / (1024.0 * 1024.0)));
         assertTrue((finalMem - baseline) / (1024.0 * 1024.0) < 50.0, "Java SDK memory delta is too high!");
     }

     @Test
     public void testBusinessRuleTask() throws Exception {
         System.out.println("Running Java SDK business rule task test...");
         Workflow workflow = new Workflow("dmn-test", "DMN Test Process");

         workflow.businessRule("ruleTask", "Determine Discount", "determine_discount", Map.of(
             "hitPolicy", "UNIQUE",
             "inputs", List.of(
                 Map.of("expression", "membership", "type", "string"),
                 Map.of("expression", "age", "type", "number")
             ),
             "outputs", List.of(
                 Map.of("name", "discount", "type", "number")
             ),
             "rules", List.of(
                 Map.of("inputs", List.of("\"gold\"", ">= 18"), "outputs", List.of("20.0")),
                 Map.of("inputs", List.of("\"silver\"", "-"), "outputs", List.of("10.0"))
             ),
             "resultVar", "discountVar",
             "mapDecisionResult", "singleEntry"
         )).end("end", "End");

         String json = workflow.toJSON();
         assertNotNull(json);
         assertTrue(json.contains("\"type\":\"businessRuleTask\""));
         assertTrue(json.contains("\"decisionRef\":\"determine_discount\""));
         assertTrue(json.contains("\"resultVar\":\"discountVar\""));
         assertTrue(json.contains("\"mapDecisionResult\":\"singleEntry\""));
         System.out.println("✓ Java SDK business rule task verified successfully!");
     }
}
