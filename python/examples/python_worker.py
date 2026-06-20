import time
import os
import sys
import random

# Add parent directory to sys.path to enable nativebpm imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from nativebpm import Client

def main():
    print("==================================================")
    print("🐍 NATIVEBPM PYTHON SDK: EXTERNAL WORKER DEMO")
    print("==================================================")

    # 1. Initialize the NativeBPM API Client
    base_url = os.getenv("NATIVEBPM_API_URL", "http://localhost:8080")
    api_token = os.getenv("NATIVEBPM_API_TOKEN", "test-bearer-token")
    
    print(f"Connecting to NativeBPM Engine at: {base_url}")
    client = Client(base_url, api_token)

    # Define the worker target queue (corresponds to userTask assignee in BPMN)
    worker_id = "python_worker"
    
    print(f"Starting worker execution loop. Polling tasks for assignee: '{worker_id}'...")
    print("Press Ctrl+C to stop.")
    
    try:
        while True:
            # 2. Poll for pending tasks assigned to this worker
            tasks = client.tasks().list()\
                .with_assignee(worker_id)\
                .with_status("CREATED")\
                .send()
            
            if tasks:
                print(f"\nFound {len(tasks)} pending task(s). Processing...")
                for task in tasks:
                    task_id_str = str(task.id)
                    print(f"\n[Task {task_id_str}] Processing step: '{task.name}'")
                    print(f"Instance ID: {task.instance_id}")
                    
                    # 3. Claim the task to prevent other workers from picking it up
                    print(f"Claiming task {task_id_str}...")
                    client.tasks().claim(task_id_str)\
                        .with_assignee(worker_id)\
                        .send()
                    
                    # Extract input variables (if any) from draft state
                    variables = task.draft_variables or {}
                    print(f"Input variables: {variables}")
                    
                    # 4. Perform simulated business/AI calculations
                    print("Executing computations (AI perturbation noise simulation)...")
                    time.sleep(1.5)  # Simulate CPU delay
                    
                    # Generate a true random perturbation value (mocking quantum randomness)
                    noise_value = random.uniform(-1.0, 1.0)
                    print(f"Generated perturbation noise value: {noise_value:.6f}")
                    
                    # 5. Complete the task and submit output variables back to the engine
                    output_vars = {
                        "perturbation_noise": noise_value,
                        "processed_by": "python_sdk_worker",
                        "processed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                    }
                    
                    print(f"Completing task {task_id_str} with output variables...")
                    client.tasks().complete(task_id_str)\
                        .with_variables(output_vars)\
                        .send()
                    print(f"✓ Task {task_id_str} completed successfully and token advanced!")
            
            # Wait for 3 seconds before next poll
            time.sleep(3)
            
    except KeyboardInterrupt:
        print("\nStopping worker gracefully...")
    except Exception as e:
        print(f"\n❌ Error in worker execution loop: {e}")
        print("Please ensure the NativeBPM Engine is running and accessible.")

if __name__ == '__main__':
    main()
