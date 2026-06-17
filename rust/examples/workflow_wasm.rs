use nativebpm_client::{Workflow, v};
use nativebpm_client::apis::{configuration, default_api};

#[tokio::main]
async fn main() {
    println!("=== NativeBPM Rust SDK: Workflow as Code ===");

    // 1. Build workflow as code using Fluent API method chaining
    let mut workflow = Workflow::new("native-demo", "Workflow as Code");

    // Chain starting from the start event
    workflow
        .start()
        .when(v("isUrgent").eq(true))
        .then(|b| {
            b.user("reviewOrder", "Review Order Details", serde_json::json!({ "assignee": "sales_representative" }));
        })
        .Else(|b| {
            b.service("notifyCustomer", "Send Confirmation Email", "email_topic", serde_json::json!({}));
        });

    // 2. Deploy and start process definition using the REST API client
    let mut config = configuration::Configuration::new();
    config.base_path = "http://localhost:8080".to_string();
    config.bearer_access_token = Some("test-bearer-token".to_string());

    println!("\nDeploying to NativeBPM engine (JSON AST compiled server-side)...");
    
    match default_api::deploy_workflow(&config, &workflow).await {
        Ok(definition) => {
            println!("✓ Deployed process definition (hash: {:?})", definition.hash);

            // Start a process instance
            let mut variables = std::collections::HashMap::new();
            variables.insert("customerEmail".to_string(), serde_json::json!("customer@example.com"));
            variables.insert("isUrgent".to_string(), serde_json::json!(true));

            let start_request = nativebpm_client::models::StartInstanceRequest {
                instance_id: None,
                business_key: Some("order-5541".to_string()),
                variables: Some(variables),
            };

            match default_api::start_instance(&config, "native-demo", Some(start_request)).await {
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
