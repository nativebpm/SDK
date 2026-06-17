from nativebpm import Client, Workflow, v

def main():
    print("=== NativeBPM Python SDK: Workflow with Guest WASM Plugins ===")

    # 1. Build workflow as code using Fluent API method chaining
    workflow = Workflow('wasm-demo', 'Workflow with Guest WASM Plugins')
    
    # Chain starting from the start event
    workflow\
        .service('calculate', 'Calculate Totals', 'payment_topic', wasm='./calculate_total.wasm')\
        .ai('aiCheck', 'AI Fraud Guard',
            provider='google',
            model='gemini-2.5-flash',
            prompt='Analyze transaction for fraud: ${orderAmount}',
            result_var='isFraudulent')\
        .when(v('isFraudulent').eq(True)).then(lambda b: (
            b.user('userTask', 'Manual Fraud Approval', assignee='security_officer')
        ))\
        .Else(lambda b: (
            None
        ))
    
    # 2. Deploy and start process definition using the Fluent Client API
    client = Client("http://localhost:8080", "test-bearer-token")
    
    print("\nDeploying to NativeBPM engine (JSON AST compiled server-side)...")
    try:
        # Deploy process definition directly via Workflow object
        definition = client.deploy(workflow)
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
