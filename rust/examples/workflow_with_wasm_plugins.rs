use nativebpm_client::{Workflow, v};
use nativebpm_client::apis::{configuration, default_api};

#[tokio::main]
async fn main() {
    println!("=== NativeBPM Rust SDK: Workflow with Guest WASM Plugins ===");

    // 1. Build workflow as code using Fluent API method chaining
    let mut workflow = Workflow::new("wasm-demo", "Workflow with Guest WASM Plugins");

    // Chain starting from the start event
    workflow
        .service("calculate", "Calculate Totals", "payment_topic", |st| {
            st.wasm("./calculate_total.wasm")
        })
        .ai("aiCheck", "AI Fraud Guard", |ait| {
            ait.provider("google")
                .model("gemini-2.5-flash")
                .prompt("Analyze transaction for fraud: ${orderAmount}")
                .result_var("isFraudulent")
        })
        .when(v("isFraudulent").eq(true))
        .then(|b| {
            b.user("userTask", "Manual Fraud Approval", |ut| {
                ut.assignee("security_officer")
            });
        })
        .Else(|_b| {
            // empty default else
        });

    // Compile the workflow AST to standard BPMN 2.0 XML using the embedded Go engine
    let bpmn_xml = match tokio::task::spawn_blocking(move || workflow.build_xml()).await.unwrap() {
        Ok(xml) => {
            println!("✓ Successfully compiled WASM workflow AST to BPMN 2.0 XML.");
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
    
    let bpmn_path = std::env::temp_dir().join("wasm-demo.bpmn");
    if std::fs::write(&bpmn_path, bpmn_xml).is_ok() {
        match default_api::deploy_definition(&config, Some(bpmn_path)).await {
            Ok(definition) => {
                println!("✓ Deployed process definition (hash: {:?})", definition.hash);

                // Start a process instance
                let mut variables = std::collections::HashMap::new();
                variables.insert("orderAmount".to_string(), serde_json::json!(2500));

                let start_request = nativebpm_client::models::StartInstanceRequest {
                    instance_id: None,
                    business_key: Some("tx-8837".to_string()),
                    variables: Some(variables),
                };

                match default_api::start_instance(&config, "wasm-demo", Some(start_request)).await {
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
