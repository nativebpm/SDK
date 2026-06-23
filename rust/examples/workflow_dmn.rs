use nativebpm_client::{Workflow, deploy_workflow};
use nativebpm_client::apis::{configuration, default_api};

#[tokio::main]
async fn main() {
    println!("=== NativeBPM Rust SDK: Workflow with DMN Decision Table ===");

    // 1. Build workflow as code using Fluent API method chaining & inline DMN table definition
    let mut workflow = Workflow::new("dmn-demo", "Workflow with DMN Table");

    // Chain starting from first business rule task (auto-start will prepend start event)
    workflow
        .business_rule("calculate-discount", "Determine Discount", "discount-decision", serde_json::json!({
            "hitPolicy": "UNIQUE",
            "resultVar": "discountResult",
            "inputs": [
                { "name": "customerType", "type": "string" },
                { "name": "orderAmount", "type": "double" }
            ],
            "outputs": [
                { "name": "discountPercent", "type": "double" }
            ],
            "rules": [
                {
                    "inputs": ["VIP", ">= 1000"],
                    "outputs": [0.2]
                },
                {
                    "inputs": ["VIP", "< 1000"],
                    "outputs": [0.15]
                },
                {
                    "inputs": ["Regular", ">= 500"],
                    "outputs": [0.1]
                },
                {
                    "inputs": [null, null],
                    "outputs": [0.05]
                }
            ]
        }))
        .end("end", "Process Finished");

    // 2. Deploy and start process definition using the REST API client
    let mut config = configuration::Configuration::new();
    config.base_path = "http://localhost:8080".to_string();
    config.bearer_access_token = Some("test-bearer-token".to_string());

    println!("\nDeploying to NativeBPM engine (JSON AST compiled server-side)...");
    
    match deploy_workflow(&config, &workflow).await {
        Ok(definition) => {
            println!("✓ Deployed process definition (hash: {:?})", definition.hash);

            // Start a process instance
            let mut variables = std::collections::HashMap::new();
            variables.insert("customerType".to_string(), serde_json::json!("VIP"));
            variables.insert("orderAmount".to_string(), serde_json::json!(1250.0));

            let start_request = nativebpm_client::models::StartInstanceRequest {
                instance_id: None,
                business_key: Some("order-9981".to_string()),
                variables: Some(variables),
            };

            match default_api::start_instance(&config, "dmn-demo", Some(start_request)).await {
                Ok(instance) => {
                    println!("✓ Started process instance ID: {} (completed: {})", instance.id, instance.completed);
                }
                Err(e) => {
                    println!("Note: Failed to start process instance: {:?}", e);
                }
            }
        }
        Err(e) => {
            println!("Note: Local API Engine deployment skipped (ensure local server is running on :8080). Details: {:?}", e);
        }
    }
}
