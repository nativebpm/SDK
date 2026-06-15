from nativebpm import Client, Workflow, v

def main():
    print("=== NativeBPM Python SDK: Workflow with Guest WASM Plugins ===")

    # 1. Build workflow as code using Fluent API method chaining
    workflow = Workflow('wasm-demo', 'Workflow with Guest WASM Plugins', './nativebpm/core.wasm')
    
    # Chain starting from the start event
    workflow\
        .service('calculate', 'Calculate Totals', 'payment_topic', lambda st: (
            st.wasm('./calculate_total.wasm')
        ))\
        .ai('aiCheck', 'AI Fraud Guard', lambda ait: (
            ait.provider('google')
               .model('gemini-2.5-flash')
               .prompt('Analyze transaction for fraud: ${orderAmount}')
               .result_var('isFraudulent')
        ))\
        .if_branch(v('isFraudulent').eq(True), lambda b: (
            b.user('userTask', 'Manual Fraud Approval', lambda ut: (
                ut.assignee('security_officer')
            ))
        ))\
        .else_branch(lambda b: (
            None
        ))
    
    # Compile the workflow AST to standard BPMN 2.0 XML using the embedded Go engine
    bpmn_xml = workflow.build_xml()
    print("✓ Successfully compiled WASM workflow AST to BPMN 2.0 XML.")
    
    # 2. Deploy and start process definition using the Fluent Client API
    client = Client("http://localhost:8080", "test-bearer-token")
    
    print("\nDeploying to NativeBPM engine...")
    try:
        # Deploy process definition
        definition = client.definitions().deploy()\
            .with_id("wasm-demo")\
            .with_name("Workflow with Guest WASM Plugins")\
            .with_bpmn(bpmn_xml.encode('utf-8'))\
            .send()
        print(f"✓ Deployed process definition (hash: {definition.hash})")
        
        # Start a process instance with input variables
        instance = client.instances().start("wasm-demo")\
            .with_business_key("tx-8837")\
            .with_variable("orderAmount", 2500)\
            .send()
        print(f"✓ Started process instance ID: {instance.id} (completed: {instance.completed})")
        
    except Exception as e:
        print(f"Note: Local API Engine deployment skipped (ensure local server is running on :8080). Details: {e}")

if __name__ == '__main__':
    main()
