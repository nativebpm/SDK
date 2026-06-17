package com.nativebpm.example;

import com.nativebpm.client.Client;
import com.nativebpm.client.api.DefaultApi;
import com.nativebpm.client.ApiException;
import com.nativebpm.client.model.ProcessDefinition;
import com.nativebpm.client.model.ProcessInstance;
import com.nativebpm.client.model.StartInstanceRequest;
import com.nativebpm.client.builder.Workflow;

import java.util.List;
import java.util.UUID;

public class ClientExample {

    public static void main(String[] args) {
        System.out.println("🚀 NativeBPM Java SDK Example Starting...");

        // 1. Initialize client facade
        Client client = new Client("http://localhost:8080", "test-bearer-token");
        DefaultApi api = client.getDefaultApi();

        try {
            // SCENARIO 1: Workflow as Code (Without custom Guest WASM tasks)
            System.out.println("--------------------------------------------------");
            Workflow workflow1 = WorkflowWasmExample.buildWorkflow();

            System.out.println("📦 Deploying native process definition directly via JSON AST...");
            ProcessDefinition def1 = client.deploy(workflow1);
            System.out.println("✅ Deployed! ID: " + def1.getId() + ", Hash: " + def1.getHash());

            System.out.println("⚡ Starting native process instance...");
            StartInstanceRequest startRequest1 = new StartInstanceRequest();
            startRequest1.setInstanceId(UUID.randomUUID());
            startRequest1.setBusinessKey("bk-java-native-" + System.currentTimeMillis());
            startRequest1.putVariablesItem("isUrgent", true);

            ProcessInstance inst1 = api.startInstance(def1.getId(), startRequest1);
            System.out.println("✅ Instance started! ID: " + inst1.getId() + ", Completed: " + inst1.getCompleted());

            // SCENARIO 2: Workflow with Guest WASM Plugins
            System.out.println("--------------------------------------------------");
            Workflow workflow2 = WorkflowWithWasmPluginsExample.buildWorkflow();

            System.out.println("📦 Deploying WASM process definition directly via JSON AST...");
            ProcessDefinition def2 = client.deploy(workflow2);
            System.out.println("✅ Deployed! ID: " + def2.getId() + ", Hash: " + def2.getHash());

            System.out.println("⚡ Starting WASM process instance...");
            StartInstanceRequest startRequest2 = new StartInstanceRequest();
            startRequest2.setInstanceId(UUID.randomUUID());
            startRequest2.setBusinessKey("bk-java-wasm-" + System.currentTimeMillis());
            startRequest2.putVariablesItem("orderAmount", 2500);

            ProcessInstance inst2 = api.startInstance(def2.getId(), startRequest2);
            System.out.println("✅ Instance started! ID: " + inst2.getId() + ", Completed: " + inst2.getCompleted());

            System.out.println("--------------------------------------------------");

            // 4. List Active Definitions
            System.out.println("📋 Listing deployed definitions...");
            List<ProcessDefinition> definitions = api.listDefinitions();
            for (ProcessDefinition def : definitions) {
                System.out.println(" - Definition: " + def.getId() + " (name: " + def.getName() + ")");
            }

            // 5. List Instances
            System.out.println("📋 Listing process instances...");
            List<ProcessInstance> instances = api.listInstances();
            for (ProcessInstance inst : instances) {
                System.out.println(" - Instance: " + inst.getId() + ", Process: " + inst.getProcessId() + ", Completed: " + inst.getCompleted());
            }

            System.out.println("🎉 Java SDK usage example finished successfully!");

        } catch (ApiException e) {
            System.err.println("❌ API Request failed! Response code: " + e.getCode());
            System.err.println("Response body: " + e.getResponseBody());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("❌ Error occurred!");
            e.printStackTrace();
        }
    }
}
