import os
from nativebpm import Client, Workflow, v

def main():
    print("=== NativeBPM Python SDK: Workflow as Code ===")

    # 1. Build workflow as code (without WASM tasks) using Fluent API method chaining
    workflow = Workflow('native-demo', 'Workflow as Code')
    
    # Chain starting from the start event
    workflow.if_branch(v('isUrgent').eq(True), lambda b: (
        b.user('reviewOrder', 'Review Order Details', lambda ut: (
            ut.assignee('sales_representative')
        ))
    )).else_branch(lambda b: (
        b.service('notifyCustomer', 'Send Confirmation Email', 'email_topic')
    ))
        
    # Compile the workflow AST to standard BPMN 2.0 XML using the embedded Go engine
    bpmn_xml = workflow.build_xml()
    print("✓ Successfully compiled native workflow AST to BPMN 2.0 XML.")
    
    # 2. Deploy and start process definition using the Fluent Client API
    client = Client("http://localhost:8080", "test-bearer-token")
    
    print("\nDeploying to NativeBPM engine...")
    try:
        # Deploy process definition
        definition = client.definitions().deploy()\
            .with_id("native-demo")\
            .with_name("Workflow as Code")\
            .with_bpmn(bpmn_xml.encode('utf-8'))\
            .send()
        print(f"✓ Deployed process definition (hash: {definition.hash})")
        
        # Start a process instance with input variables
        instance = client.instances().start("native-demo")\
            .with_business_key("order-5541")\
            .with_variable("customerEmail", "customer@example.com")\
            .with_variable("isUrgent", True)\
            .send()
        print(f"✓ Started process instance ID: {instance.id} (completed: {instance.completed})")
        
    except Exception as e:
        print(f"Note: Local API Engine deployment skipped (ensure local server is running on :8080). Details: {e}")

if __name__ == '__main__':
    main()
