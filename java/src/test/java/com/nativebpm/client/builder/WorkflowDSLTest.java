package com.nativebpm.client.builder;

import org.junit.jupiter.api.Test;
import java.util.Map;
import static com.nativebpm.client.builder.Workflow.V;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class WorkflowDSLTest {

    @Test
    public void testClosureDSL() throws Exception {
        System.out.println("Running Java SDK closure block DSL test...");
        Workflow workflow = new Workflow("closure-process", "Closure Process");

        workflow.user("task1", "User Approval")
                .when(V("approved").eq(true)).then(b -> {
                    b.service("publish", "Publish Page", "publish-topic", Map.of("wasm", "./publish.wasm"));
                })
                .otherwise(b -> {
                    b.service("reject", "Notify Reject", "reject-topic");
                });

        Map<String, Object> ast = workflow.toAST();
        assertNotNull(ast);
        assertEquals("closure-process", ast.get("id"));
        
        String json = workflow.toJSON();
        assertTrue(json.contains("\"id\":\"closure-process\""));
        assertTrue(json.contains("\"id\":\"gw_task1_decision\""));
        assertTrue(json.contains("\"id\":\"publish\""));
        assertTrue(json.contains("\"wasmPath\":\"./publish.wasm\""));
        assertTrue(json.contains("\"id\":\"reject\""));
        System.out.println("✓ Java SDK closure block DSL test passed!");
    }
}
