import sys
import os

# Set PYTHONPATH to current directory so nativebpm can be imported
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from examples import workflow_wasm, workflow_with_wasm_plugins

def main():
    print("==================================================")
    print("🚀 RUNNING NATIVEBPM PYTHON SDK EXAMPLES")
    print("==================================================")
    
    # 1. Run WASM-based Workflow example
    workflow_wasm.main()
    
    print("\n--------------------------------------------------\n")
    
    # 2. Run Workflow with WASM plugins example
    workflow_with_wasm_plugins.main()
    
    print("==================================================")
    print("🎉 ALL EXAMPLES FINISHED")
    print("==================================================")

if __name__ == '__main__':
    main()
