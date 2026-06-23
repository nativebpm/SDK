using System;
using System.Collections.Generic;
using System.IO;
using Xunit;
using NativeBPM.Client.Builder;

namespace NativeBPM.Client.Test.Builder
{
    public class WorkflowTest
    {
        [Fact]
        public void TestWorkflowGeneration()
        {
            Console.WriteLine("Running .NET SDK workflow AST test...");
            using var workflow = new Workflow("test-process", "Test Process Schema");

            workflow.StartEvent("start");

            workflow.ServiceTask("task1", "Service Task 1", "service-topic", new Dictionary<string, object> { { "wasm", "./my_task.wasm" } });

            workflow.ExclusiveGateway("gateway", "Join/Split");

            workflow.UserTask("userTask", "User Task Approve", new Dictionary<string, object> { { "assignee", "boss" } });

            workflow.EndEvent("end", "Process Completed");

            // Connect them
            workflow.SequenceFlow("start", "task1");
            workflow.SequenceFlow("task1", "gateway");
            workflow.SequenceFlowWithCondition("gateway", "userTask", "isApproved == true");
            workflow.SequenceFlowWithCondition("gateway", "end", "isApproved == false");
            workflow.SequenceFlow("userTask", "end");

            var ast = workflow.ToAST();
            Assert.NotNull(ast);
            Assert.Equal("test-process", ast["id"]);
            Assert.Equal("Test Process Schema", ast["name"]);

            string json = workflow.toJSON();
            Console.WriteLine("JSON OUTPUT: " + json);
            Assert.Contains("\"id\":\"test-process\"", json);
            Assert.Contains("\"name\":\"Test Process Schema\"", json);
            Assert.Contains("\"type\":\"startEvent\"", json);
            Assert.Contains("\"type\":\"serviceTask\"", json);
            Assert.Contains("\"topic\":\"service-topic\"", json);
            Assert.Contains("\"wasmPath\":\"./my_task.wasm\"", json);
            Assert.Contains("\"type\":\"userTask\"", json);
            Assert.Contains("\"assignee\":\"boss\"", json);
            Assert.Contains("\"type\":\"exclusiveGateway\"", json);
            Assert.Contains("\"condition\":\"isApproved == true\"", json);
            Assert.Contains("\"condition\":\"isApproved == false\"", json);
            Assert.Contains("\"type\":\"endEvent\"", json);
            Console.WriteLine("✓ .NET SDK assertions passed successfully!");
        }

        [Fact]
        public void TestLoadAndProfiling()
        {
            Console.WriteLine("Running .NET SDK load and profiling test...");
            GC.Collect();
            long baseline = GC.GetTotalMemory(true);
            Console.WriteLine($"Baseline Memory: {baseline / (1024.0 * 1024.0):F2} MB");

            for (int i = 0; i < 200; i++)
            {
                using var workflow = new Workflow($"load-test-{i}", $"Load Test {i}");
                workflow.EndEvent("end", "End");
                string json = workflow.toJSON();
                Assert.NotNull(json);

                if ((i + 1) % 50 == 0)
                {
                    GC.Collect();
                    long current = GC.GetTotalMemory(true);
                    Console.WriteLine($"Iteration {i + 1}/200 - Memory: {current / (1024.0 * 1024.0):F2} MB");
                }
            }

            GC.Collect();
            long finalMem = GC.GetTotalMemory(true);
            Console.WriteLine($"Final Memory: {finalMem / (1024.0 * 1024.0):F2} MB (Delta: {(finalMem - baseline) / (1024.0 * 1024.0):F2} MB)");
            Assert.True((finalMem - baseline) / (1024.0 * 1024.0) < 50.0, ".NET SDK memory delta is too high!");
        }

        [Fact]
        public void TestBusinessRuleTask()
        {
            Console.WriteLine("Running .NET SDK business rule task test...");
            using var workflow = new Workflow("dmn-test", "DMN Test Process");

            workflow.BusinessRuleTask("ruleTask", "Determine Discount", "determine_discount", new Dictionary<string, object>
            {
                { "hitPolicy", "UNIQUE" },
                { "inputs", new List<Dictionary<string, object>>
                    {
                        new Dictionary<string, object> { { "expression", "membership" }, { "type", "string" } },
                        new Dictionary<string, object> { { "expression", "age" }, { "type", "number" } }
                    }
                },
                { "outputs", new List<Dictionary<string, object>>
                    {
                        new Dictionary<string, object> { { "name", "discount" }, { "type", "number" } }
                    }
                },
                { "rules", new List<Dictionary<string, object>>
                    {
                        new Dictionary<string, object>
                        {
                            { "inputs", new List<string> { "\"gold\"", ">= 18" } },
                            { "outputs", new List<string> { "20.0" } }
                        },
                        new Dictionary<string, object>
                        {
                            { "inputs", new List<string> { "\"silver\"", "-" } },
                            { "outputs", new List<string> { "10.0" } }
                        }
                    }
                },
                { "resultVar", "discountVar" },
                { "mapDecisionResult", "singleEntry" }
            });

            string json = workflow.toJSON();
            Assert.NotNull(json);
            Assert.Contains("\"type\":\"businessRuleTask\"", json);
            Assert.Contains("\"decisionRef\":\"determine_discount\"", json);
            Assert.Contains("\"resultVar\":\"discountVar\"", json);
            Assert.Contains("\"mapDecisionResult\":\"singleEntry\"", json);
            Console.WriteLine("✓ .NET SDK business rule task verified successfully!");
        }

        [Fact]
        public void TestClosureDsl()
        {
            Console.WriteLine("Running .NET SDK closure block DSL test...");
            using var workflow = new Workflow("closure-process", "Closure Process");

            workflow.User("task1", "User Approval")
                .When(Workflow.V("approved").Eq(true)).Then(b => {
                    b.Service("publish", "Publish Page", "publish-topic", new Dictionary<string, object> { { "wasm", "./publish.wasm" } });
                })
                .Else(b => {
                    b.Service("reject", "Notify Reject", "reject-topic");
                });

            string json = workflow.toJSON();
            Assert.NotNull(json);
            Assert.Contains("\"id\":\"closure-process\"", json);
            Assert.Contains("\"type\":\"exclusiveGateway\"", json);
            Assert.Contains("\"id\":\"gw_task1_decision\"", json);
            Assert.Contains("\"type\":\"serviceTask\"", json);
            Assert.Contains("\"id\":\"publish\"", json);
            Assert.Contains("\"wasmPath\":\"./publish.wasm\"", json);
            Assert.Contains("\"id\":\"reject\"", json);
            Console.WriteLine("✓ .NET SDK closure block DSL test passed!");
        }
    }
}
