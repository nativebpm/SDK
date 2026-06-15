package com.nativebpm.client.builder;

import org.junit.jupiter.api.Test;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.zip.GZIPOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class WorkflowTest {

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
    public void testWorkflowGeneration() throws Exception {
        System.out.println("Running Java SDK workflow compilation test...");
        Workflow workflow = new Workflow("test-process", "Test Process Schema");

        workflow.start();

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

        String xml = workflow.buildXML();
        assertNotNull(xml);
        assertTrue(xml.contains("id=\"test-process\""));
        assertTrue(xml.contains("name=\"Test Process Schema\""));
        assertTrue(xml.contains("<startEvent id=\"start\""));
        assertTrue(xml.contains("<serviceTask id=\"task1\" name=\"Service Task 1\""));
        assertTrue(xml.contains("topic=\"service-topic\""));
        assertTrue(xml.contains("wasmPath=\"./my_task.wasm\""));
        assertTrue(xml.contains("<userTask id=\"userTask\" name=\"User Task Approve\""));
        assertTrue(xml.contains("assignee=\"boss\""));
        assertTrue(xml.contains("<exclusiveGateway id=\"gateway\" name=\"Join/Split\""));
        assertTrue(xml.contains("isApproved == true"));
        assertTrue(xml.contains("isApproved == false"));
        assertTrue(xml.contains("<endEvent id=\"end\" name=\"Process Completed\""));
        System.out.println("✓ Java SDK assertions passed successfully!");
    }

    private byte[] getBrotliCompressedWasmBytes() throws IOException {
        try (InputStream is = WorkflowTest.class.getResourceAsStream("/core.wasm.br")) {
            if (is == null) {
                throw new IllegalStateException("core.wasm.br not found in resources");
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
    public void testCompressedFormats() throws Exception {
        System.out.println("Running Java SDK compressed formats test...");
        byte[] rawBytes = getWasmBytes();

        // 1. Brotli
        byte[] brBytes = getBrotliCompressedWasmBytes();

        // 2. Gzip
        ByteArrayOutputStream gzOut = new ByteArrayOutputStream();
        try (GZIPOutputStream gzos = new GZIPOutputStream(gzOut)) {
            gzos.write(rawBytes);
        }
        byte[] gzBytes = gzOut.toByteArray();

        // 3. Zip
        ByteArrayOutputStream zipOut = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(zipOut)) {
            zos.putNextEntry(new ZipEntry("core.wasm"));
            zos.write(rawBytes);
            zos.closeEntry();
        }
        byte[] zipBytes = zipOut.toByteArray();

        Workflow workflow = new Workflow("compressed-test", "Compressed Test");
        workflow.start().end("end", "End");

        String xmlBr = workflow.buildXML(brBytes);
        assertTrue(xmlBr.contains("id=\"compressed-test\""));
        System.out.println("✓ Java SDK successfully compiled process using Brotli compressed bytes.");

        String xmlGz = workflow.buildXML(gzBytes);
        assertTrue(xmlGz.contains("id=\"compressed-test\""));
        System.out.println("✓ Java SDK successfully compiled process using Gzip compressed bytes.");

        String xmlZip = workflow.buildXML(zipBytes);
        assertTrue(xmlZip.contains("id=\"compressed-test\""));
        System.out.println("✓ Java SDK successfully compiled process using Zip compressed bytes.");
    }

    @Test
    public void testConstructorCompilation() throws Exception {
        System.out.println("Running Java SDK constructor compilation test...");
        byte[] rawBytes = getWasmBytes();
        Workflow workflow = new Workflow("init-test", "Init Test", rawBytes);
        workflow.start().end("end", "End");

        String xml = workflow.buildXML();
        assertTrue(xml.contains("id=\"init-test\""));
        System.out.println("✓ Java SDK constructor compilation verified successfully.");
     }

    @Test
    public void testLoadAndProfiling() throws Exception {
        System.out.println("Running Java SDK load and profiling test...");
        Runtime runtime = Runtime.getRuntime();
        runtime.gc();
        long baseline = runtime.totalMemory() - runtime.freeMemory();
        System.out.println(String.format("Baseline Memory: %.2f MB", baseline / (1024.0 * 1024.0)));

        byte[] rawBytes = getWasmBytes();

        for (int i = 0; i < 200; i++) {
            Workflow workflow = new Workflow("load-test-" + i, "Load Test " + i, rawBytes);
            workflow.start().end("end", "End");
            String xml = workflow.buildXML();
            assertNotNull(xml);
            
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
         byte[] rawBytes = getWasmBytes();
         Workflow workflow = new Workflow("dmn-test", "DMN Test Process", rawBytes);

         workflow.start().businessRule("ruleTask", "Determine Discount", "determine_discount", Map.of(
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

         String xml = workflow.buildXML();
         assertNotNull(xml);
         assertTrue(xml.contains("businessRuleTask id=\"ruleTask\""));
         assertTrue(xml.contains("decisionRef=\"determine_discount\""));
         assertTrue(xml.contains("resultVariable=\"discountVar\""));
         assertTrue(xml.contains("mapDecisionResult=\"singleEntry\""));
         System.out.println("✓ Java SDK business rule task verified successfully!");
     }
}
