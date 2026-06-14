package com.nativebpm.client.builder;

import org.junit.jupiter.api.Test;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class WorkflowDSLTest {

    private byte[] getWasmBytes() throws IOException {
        try (InputStream is = Workflow.class.getResourceAsStream("/core.wasm")) {
            if (is == null) {
                throw new IllegalStateException("core.wasm not found in resources");
            }
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[] buf = new byte[4096];
            int n;
            while ((n = is.read(buf)) != -1) {
                baos.write(buf, 0, n);
            }
            return baos.toByteArray();
        }
    }

    @Test
    public void testClosureDSL() throws Exception {
        System.out.println("Running Java SDK closure block DSL test...");
        byte[] rawBytes = getWasmBytes();
        Workflow workflow = new Workflow("closure-process", "Closure Process", rawBytes);

        workflow.start("start")
                .user("task1", "User Approval")
                .ifBranch("approved == true", b -> {
                    b.service("publish", "Publish Page", "publish-topic", st -> {
                        st.wasm("./publish.wasm");
                    }).end("end_approved", "Approved End");
                })
                .elseBranch(b -> {
                    b.service("reject", "Notify Reject", "reject-topic")
                     .end("end_rejected", "Rejected End");
                });

        String xml = workflow.buildXML();
        assertNotNull(xml);
        assertTrue(xml.contains("id=\"closure-process\""));
        assertTrue(xml.contains("exclusiveGateway id=\"gw_task1_decision\""));
        assertTrue(xml.contains("serviceTask id=\"publish\""));
        assertTrue(xml.contains("wasmPath=\"./publish.wasm\""));
        assertTrue(xml.contains("serviceTask id=\"reject\""));
        System.out.println("✓ Java SDK closure block DSL test passed!");
    }
}
