use nativebpm_client::{Workflow, v};
use nativebpm_client::apis::{configuration, default_api};

#[tokio::main]
async fn main() {
    println!("=== NativeBPM Rust SDK: Workflow as Code ===");

    // 1. Build workflow as code using Fluent API method chaining
    let mut workflow = Workflow::new("native-demo", "Workflow as Code");

    // Chain starting from the start event
    workflow
        .when(v("isUrgent").eq(true))
        .then(|b| {
            b.user("reviewOrder", "Review Order Details", |ut| {
                ut.assignee("sales_representative")
            });
        })
        .otherwise(|b| {
            b.service("notifyCustomer", "Send Confirmation Email", "email_topic", |st| st);
        });

    // Compile the workflow AST to standard BPMN 2.0 XML using the embedded Go engine
    let bpmn_xml = match tokio::task::spawn_blocking(move || workflow.build_xml()).await.unwrap() {
        Ok(xml) => {
            println!("✓ Successfully compiled native workflow AST to BPMN 2.0 XML.");
            xml
        }
        Err(e) => {
            eprintln!("✗ Failed to compile workflow: {}", e);
            return;
        }
    };

    // 2. Deploy and start process definition using the REST API client
    let mut config = configuration::Configuration::new();
    config.base_path = "http://localhost:8080".to_string();
    config.bearer_access_token = Some("test-bearer-token".to_string());

    println!("\nDeploying to NativeBPM engine...");
    
    // In actual usage, you would write the XML to a file to deploy via multipart/form-data
    let bpmn_path = std::env::temp_dir().join("native-demo.bpmn");
    if std::fs::write(&bpmn_path, bpmn_xml).is_ok() {
        match default_api::deploy_definition(&config, Some(bpmn_path)).await {
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
}
