import gzip
import io
import zipfile
import brotli
import unittest
from pathlib import Path
from nativebpm import Workflow
from nativebpm.builder import DEFAULT_WASM_PATH

class TestPythonSDK(unittest.TestCase):
    def test_workflow_generation(self):
        print("Running Python SDK workflow compilation test...")
        
        workflow = Workflow('test-process', 'Test Process Schema')
        
        workflow.start_event('start')
        
        workflow.service_task('task1', 'Service Task 1', 'service-topic')\
            .wasm('./my_task.wasm')
            
        workflow.exclusive_gateway('gateway', 'Join/Split')
        
        workflow.user_task('userTask', 'User Task Approve')\
            .assignee('boss')
            
        workflow.end_event('end', 'Process Completed')

        # Connect them
        workflow.sequence_flow('start', 'task1')
        workflow.sequence_flow('task1', 'gateway')
        workflow.sequence_flow_with_condition('gateway', 'userTask', '${isApproved == true}')
        workflow.sequence_flow_with_condition('gateway', 'end', '${isApproved == false}')
        workflow.sequence_flow('userTask', 'end')

        xml = workflow.build_xml()
        print("Compilation successful! XML content:\n", xml[:200] + "...")

        self.assertTrue('id="test-process"' in xml)
        self.assertTrue('name="Test Process Schema"' in xml)
        self.assertTrue('<startEvent id="start"' in xml)
        self.assertTrue('<serviceTask id="task1" name="Service Task 1"' in xml)
        self.assertTrue('topic="service-topic"' in xml)
        self.assertTrue('wasmPath="./my_task.wasm"' in xml)
        self.assertTrue('<userTask id="userTask" name="User Task Approve"' in xml)
        self.assertTrue('assignee="boss"' in xml)
        self.assertTrue('<exclusiveGateway id="gateway" name="Join/Split"' in xml)
        self.assertTrue('isApproved == true' in xml)
        self.assertTrue('isApproved == false' in xml)
        self.assertTrue('<endEvent id="end" name="Process Completed"' in xml)
        print("All Python SDK assertions passed successfully!")

    def test_compressed_formats(self):
        print("Running Python SDK compressed formats test...")
        raw_bytes = DEFAULT_WASM_PATH.read_bytes()

        # Brotli
        br_bytes = brotli.compress(raw_bytes)
        # Gzip
        gz_io = io.BytesIO()
        with gzip.GzipFile(fileobj=gz_io, mode='wb') as f:
            f.write(raw_bytes)
        gz_bytes = gz_io.getvalue()
        # Zip
        zip_io = io.BytesIO()
        with zipfile.ZipFile(zip_io, 'w') as z:
            z.writestr("core.wasm", raw_bytes)
        zip_bytes = zip_io.getvalue()

        # Compile with each
        workflow = Workflow('compressed-test', 'Compressed Test')
        workflow.start_event('start').next('end')
        workflow.end_event('end', 'End')

        for name, data in [("Brotli", br_bytes), ("Gzip", gz_bytes), ("Zip", zip_bytes)]:
            xml = workflow.build_xml(data)
            self.assertTrue('id="compressed-test"' in xml)
            print(f"✓ Python SDK successfully compiled process using {name} compressed bytes.")

    def test_constructor_compilation(self):
        print("Running Python SDK constructor compilation test...")
        workflow = Workflow('init-test', 'Init Test', DEFAULT_WASM_PATH)
        workflow.start_event('start').next('end')
        workflow.end_event('end', 'End')

        xml = workflow.build_xml()
        self.assertTrue('id="init-test"' in xml)
        print("✓ Python SDK constructor compilation verified successfully.")

    def test_business_rule_task(self):
        print("Running Python SDK business rule task test...")
        workflow = Workflow('dmn-test', 'DMN Test Process')

        workflow.start_event('start')\
            .next('ruleTask')

        workflow.business_rule_task('ruleTask', 'Determine Discount', 'determine_discount')\
            .hit_policy('UNIQUE')\
            .input('membership', 'string')\
            .input('age', 'number')\
            .output('discount', 'number')\
            .rule()\
                .when('membership', 'gold')\
                .when('age', '>= 18')\
                .then('discount', 20.0)\
            .rule()\
                .when('membership', 'silver')\
                .then('discount', 10.0)\
            .result_variable('discountVar')\
            .map_decision_result('singleEntry')\
            .next('end')

        workflow.end_event('end', 'End')

        xml = workflow.build_xml()
        self.assertIsNotNone(xml)
        self.assertTrue('businessRuleTask id="ruleTask"' in xml)
        self.assertTrue('decisionRef="determine_discount"' in xml)
        self.assertTrue('resultVariable="discountVar"' in xml)
        self.assertTrue('mapDecisionResult="singleEntry"' in xml)
        print("✓ Python SDK business rule task verified successfully!")

    def test_closure_dsl(self):
        print("Running Python SDK closure block DSL test...")
        workflow = Workflow('closure-process', 'Closure Process')
        
        workflow.start('start').user('task1', 'User Approval').if_branch('approved == True', lambda b: (
            b.service('publish', 'Publish Page', 'publish-topic', lambda st: (
                st.wasm('./publish.wasm')
            )).end('end_approved', 'Approved End')
        )).else_branch(lambda b: (
            b.service('reject', 'Notify Reject', 'reject-topic').end('end_rejected', 'Rejected End')
        ))

        xml = workflow.build_xml()
        
        self.assertTrue('id="closure-process"' in xml)
        self.assertTrue('exclusiveGateway id="gw_task1_decision"' in xml)
        self.assertTrue('serviceTask id="publish"' in xml)
        self.assertTrue('wasmPath="./publish.wasm"' in xml)
        self.assertTrue('serviceTask id="reject"' in xml)
        print("✓ Python SDK closure block DSL test passed!")

    def test_closure_dsl_decorator(self):
        print("Running Python SDK closure block DSL decorator test...")
        workflow = Workflow('closure-decorator', 'Closure Decorator Process')
        
        workflow.start('start').user('task1', 'User Approval')
        
        @workflow.if_branch('approved == True')
        def then_branch(b):
            b.service('publish', 'Publish Page', 'publish-topic', lambda st: st.wasm('./publish.wasm'))
            b.end('end_approved', 'Approved End')
            
        @then_branch.else_branch()
        def else_branch(b):
            b.service('reject', 'Notify Reject', 'reject-topic')
            b.end('end_rejected', 'Rejected End')

        xml = workflow.build_xml()
        
        self.assertTrue('id="closure-decorator"' in xml)
        self.assertTrue('exclusiveGateway id="gw_task1_decision"' in xml)
        self.assertTrue('serviceTask id="publish"' in xml)
        self.assertTrue('wasmPath="./publish.wasm"' in xml)
        self.assertTrue('serviceTask id="reject"' in xml)
        print("✓ Python SDK closure block DSL decorator test passed!")

if __name__ == '__main__':
    unittest.main()
