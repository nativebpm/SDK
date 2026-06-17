import unittest
from nativebpm import Workflow, v

class TestPythonSDK(unittest.TestCase):
    def test_workflow_generation(self):
        print("Running Python SDK workflow AST test...")
        
        workflow = Workflow('test-process', 'Test Process Schema')
        
        workflow.service('task1', 'Service Task 1', 'service-topic', wasm='./my_task.wasm')
            
        workflow.exclusive_gateway('gateway', 'Join/Split')
        
        workflow.user('userTask', 'User Task Approve', assignee='boss')
            
        workflow.end('end', 'Process Completed')

        # Connect them
        workflow.sequence_flow('start', 'task1')
        workflow.sequence_flow('task1', 'gateway')
        workflow.sequence_flow_with_condition('gateway', 'userTask', 'isApproved == true')
        workflow.sequence_flow_with_condition('gateway', 'end', 'isApproved == false')
        workflow.sequence_flow('userTask', 'end')

        ast = workflow.to_ast()
        print("AST structure generated successfully.")

        self.assertEqual(ast['id'], 'test-process')
        self.assertEqual(ast['name'], 'Test Process Schema')
        
        # Check start node
        start_node = next(n for n in ast['nodes'] if n['id'] == 'start')
        self.assertEqual(start_node['type'], 'startEvent')

        # Check service task
        task1 = next(n for n in ast['nodes'] if n['id'] == 'task1')
        self.assertEqual(task1['type'], 'serviceTask')
        self.assertEqual(task1['name'], 'Service Task 1')
        self.assertEqual(task1['topic'], 'service-topic')
        self.assertEqual(task1['wasmPath'], './my_task.wasm')

        # Check user task
        user_task = next(n for n in ast['nodes'] if n['id'] == 'userTask')
        self.assertEqual(user_task['type'], 'userTask')
        self.assertEqual(user_task['assignee'], 'boss')

        # Check flows
        self.assertTrue(any(f['source'] == 'gateway' and f['target'] == 'userTask' and f['condition'] == 'isApproved == true' for f in ast['flows']))
        self.assertTrue(any(f['source'] == 'gateway' and f['target'] == 'end' and f['condition'] == 'isApproved == false' for f in ast['flows']))
        print("All basic AST assertions passed!")

    def test_business_rule_task(self):
        print("Running Python SDK business rule task AST test...")
        workflow = Workflow('dmn-test', 'DMN Test Process')

        workflow.business_rule(
            'ruleTask', 'Determine Discount', 'determine_discount',
            hit_policy='UNIQUE',
            inputs=[
                {'expression': 'membership', 'type': 'string'},
                {'expression': 'age', 'type': 'number'}
            ],
            outputs=[
                {'name': 'discount', 'type': 'number'}
            ],
            rules=[
                {'inputs': ['"gold"', '>= 18'], 'outputs': ['20.0']},
                {'inputs': ['"silver"', '-'], 'outputs': ['10.0']}
            ],
            result_var='discountVar',
            map_decision_result='singleEntry'
        )

        workflow.end('end', 'End')

        ast = workflow.to_ast()
        rule_node = next(n for n in ast['nodes'] if n['id'] == 'ruleTask')
        self.assertEqual(rule_node['type'], 'businessRuleTask')
        self.assertEqual(rule_node['decisionRef'], 'determine_discount')
        self.assertEqual(rule_node['hitPolicy'], 'UNIQUE')
        self.assertEqual(rule_node['resultVar'], 'discountVar')
        self.assertEqual(rule_node['mapDecisionResult'], 'singleEntry')
        print("✓ Python SDK business rule task AST verified successfully!")

    def test_closure_dsl(self):
        print("Running Python SDK closure block DSL AST test...")
        workflow = Workflow('closure-process', 'Closure Process')
        
        workflow.user('task1', 'User Approval').when(v('approved').eq(True)).then(lambda b: (
            b.service('publish', 'Publish Page', 'publish-topic', wasm='./publish.wasm')
        )).otherwise(lambda b: (
            b.service('reject', 'Notify Reject', 'reject-topic')
        ))

        ast = workflow.to_ast()
        
        self.assertEqual(ast['id'], 'closure-process')
        self.assertTrue(any(n['id'] == 'gw_task1_decision' and n['type'] == 'exclusiveGateway' for n in ast['nodes']))
        self.assertTrue(any(n['id'] == 'publish' and n['type'] == 'serviceTask' and n['wasmPath'] == './publish.wasm' for n in ast['nodes']))
        self.assertTrue(any(n['id'] == 'reject' and n['type'] == 'serviceTask' for n in ast['nodes']))
        print("✓ Python SDK closure block DSL AST test passed!")

    def test_closure_dsl_decorator(self):
        print("Running Python SDK closure block DSL decorator AST test...")
        workflow = Workflow('closure-decorator', 'Closure Decorator Process')
        
        workflow.user('task1', 'User Approval')
        
        @workflow.when(v('approved').eq(True))
        def then_branch(b):
            b.service('publish', 'Publish Page', 'publish-topic', wasm='./publish.wasm')
            
        @then_branch.otherwise()
        def else_branch(b):
            b.service('reject', 'Notify Reject', 'reject-topic')

        ast = workflow.to_ast()
        
        self.assertEqual(ast['id'], 'closure-decorator')
        self.assertTrue(any(n['id'] == 'gw_task1_decision' and n['type'] == 'exclusiveGateway' for n in ast['nodes']))
        self.assertTrue(any(n['id'] == 'publish' and n['type'] == 'serviceTask' and n['wasmPath'] == './publish.wasm' for n in ast['nodes']))
        self.assertTrue(any(n['id'] == 'reject' and n['type'] == 'serviceTask' for n in ast['nodes']))
        print("✓ Python SDK closure block DSL decorator AST test passed!")

    def test_implicit_back_edges(self):
        print("Running Python SDK implicit back-edges AST test...")
        workflow = Workflow('back-edge-process', 'Back Edge Process')

        workflow.user('step1', 'User Step 1')\
                .user('step2', 'User Step 2')\
                .when(v('approved').eq(False))\
                .then(lambda b: (
                    b.user('step1', 'User Step 1')
                ))\
                .otherwise(lambda b: (
                    b.end('end', 'End Process')
                ))

        ast = workflow.to_ast()
        self.assertEqual(ast['id'], 'back-edge-process')
        
        # Verify only 1 declaration of userTask id="step1" exists
        decl_count = sum(1 for n in ast['nodes'] if n['id'] == 'step1')
        self.assertEqual(decl_count, 1)

        # Check for sequence flow targeting step1 (back-edge)
        self.assertTrue(any(f['target'] == 'step1' for f in ast['flows']))
        print("✓ Python SDK implicit back-edges AST test passed!")

if __name__ == '__main__':
    unittest.main()

if __name__ == '__main__':
    unittest.main()
