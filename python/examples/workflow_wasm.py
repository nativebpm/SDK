import os
from nativebpm import Client, Workflow, v

def main():
    print("=== NativeBPM Python SDK: Workflow as Code ===")

    # 1. Build workflow as code using Fluent API method chaining
    workflow = Workflow('native-demo', 'Workflow as Code')
    
    # Chain starting from the start event
    workflow.when(v('isUrgent').eq(True)).then(lambda b: (
        b.user('reviewOrder', 'Review Order Details', assignee='sales_representative')
    )).Else(lambda b: (
        b.service('notifyCustomer', 'Send Confirmation Email', 'email_topic')
    ))
        
    # 2. Deploy and start process definition using the Fluent Client API
    client = Client("http://localhost:8080", "test-bearer-token")
    
    try:
        print("\nDeploying to NativeBPM engine (JSON AST compiled server-side)...")
        # Deploy process definition directly via Workflow object
        definition = client.deploy(workflow)
        print(f"✓ Deployed process definition (hash: {definition.hash})")
        
        # Start a process instance with input variables
        instance = client.instances().start(definition.id)\
            .with_business_key("order-5541")\
            .with_variable("customerEmail", "customer@example.com")\
            .with_variable("isUrgent", True)\
            .send()
        print(f"✓ Started process instance ID: {instance.id} (completed: {instance.completed})")
        
    except Exception as e:
        print(f"Note: Local API Engine deployment skipped (ensure local server is running on :8080). Details: {e}")

if __name__ == '__main__':
    main()
