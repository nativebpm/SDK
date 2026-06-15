using System;
using System.IO;
using System.IO.Compression;
using System.Reflection;
using System.Text;
using Xunit;
using NativeBPM.Client.Builder;

namespace NativeBPM.Client.Test.Builder
{
    public class WorkflowTest
    {
        private byte[] GetWasmBytes()
        {
            var assembly = typeof(Workflow).Assembly;
            string? foundResource = null;
            foreach (var name in assembly.GetManifestResourceNames())
            {
                if (name.EndsWith("core.wasm"))
                {
                    foundResource = name;
                    break;
                }
            }

            if (foundResource == null)
            {
                throw new InvalidOperationException("Embedded core.wasm not found");
            }

            using var stream = assembly.GetManifestResourceStream(foundResource);
            if (stream == null)
            {
                throw new InvalidOperationException("Failed to open stream");
            }
            using var ms = new MemoryStream();
            stream.CopyTo(ms);
            return ms.ToArray();
        }

        [Fact]
        public void TestWorkflowXmlGeneration()
        {
            Console.WriteLine("Running .NET SDK workflow compilation test...");
            using var workflow = new Workflow("test-process", "Test Process Schema");

            workflow.StartEvent("start");

            workflow.ServiceTask("task1", "Service Task 1", "service-topic")
                .Wasm("./my_task.wasm");

            workflow.ExclusiveGateway("gateway", "Join/Split");

            workflow.UserTask("userTask", "User Task Approve")
                .Assignee("boss");

            workflow.EndEvent("end", "Process Completed");

            // Connect them
            workflow.SequenceFlow("start", "task1");
            workflow.SequenceFlow("task1", "gateway");
            workflow.SequenceFlowWithCondition("gateway", "userTask", "${isApproved == true}");
            workflow.SequenceFlowWithCondition("gateway", "end", "${isApproved == false}");
            workflow.SequenceFlow("userTask", "end");

            string xml = workflow.BuildXml();
            Assert.NotNull(xml);
            Assert.Contains("id=\"test-process\"", xml);
            Assert.Contains("name=\"Test Process Schema\"", xml);
            Assert.Contains("<startEvent id=\"start\"", xml);
            Assert.Contains("<serviceTask id=\"task1\" name=\"Service Task 1\"", xml);
            Assert.Contains("topic=\"service-topic\"", xml);
            Assert.Contains("wasmPath=\"./my_task.wasm\"", xml);
            Assert.Contains("<userTask id=\"userTask\" name=\"User Task Approve\"", xml);
            Assert.Contains("assignee=\"boss\"", xml);
            Assert.Contains("<exclusiveGateway id=\"gateway\" name=\"Join/Split\"", xml);
            Assert.Contains("isApproved == true", xml);
            Assert.Contains("isApproved == false", xml);
            Assert.Contains("<endEvent id=\"end\" name=\"Process Completed\"", xml);
            Console.WriteLine("✓ .NET SDK assertions passed successfully!");
        }

        [Fact]
        public void TestCompressedFormats()
        {
            Console.WriteLine("Running .NET SDK compressed formats test...");
            byte[] rawBytes = GetWasmBytes();

            // 1. Brotli
            byte[] brBytes;
            using (var outMs = new MemoryStream())
            {
                using (var brotli = new BrotliStream(outMs, CompressionLevel.Optimal))
                {
                    brotli.Write(rawBytes, 0, rawBytes.Length);
                }
                brBytes = outMs.ToArray();
            }

            // 2. Gzip
            byte[] gzBytes;
            using (var outMs = new MemoryStream())
            {
                using (var gzip = new GZipStream(outMs, CompressionLevel.Optimal))
                {
                    gzip.Write(rawBytes, 0, rawBytes.Length);
                }
                gzBytes = outMs.ToArray();
            }

            // 3. Zip
            byte[] zipBytes;
            using (var outMs = new MemoryStream())
            {
                using (var archive = new ZipArchive(outMs, ZipArchiveMode.Create, true))
                {
                    var entry = archive.CreateEntry("core.wasm");
                    using var entryStream = entry.Open();
                    entryStream.Write(rawBytes, 0, rawBytes.Length);
                }
                zipBytes = outMs.ToArray();
            }

            using var workflow = new Workflow("compressed-test", "Compressed Test");
            workflow.StartEvent("start").Next("end");
            workflow.EndEvent("end", "End");

            string xmlBr = workflow.BuildXml(brBytes);
            Assert.Contains("id=\"compressed-test\"", xmlBr);
            Console.WriteLine("✓ .NET SDK successfully compiled process using Brotli compressed bytes.");

            string xmlGz = workflow.BuildXml(gzBytes);
            Assert.Contains("id=\"compressed-test\"", xmlGz);
            Console.WriteLine("✓ .NET SDK successfully compiled process using Gzip compressed bytes.");

            string xmlZip = workflow.BuildXml(zipBytes);
            Assert.Contains("id=\"compressed-test\"", xmlZip);
            Console.WriteLine("✓ .NET SDK successfully compiled process using Zip compressed bytes.");
        }

        [Fact]
        public void TestConstructorCompilation()
        {
            Console.WriteLine("Running .NET SDK constructor compilation test...");
            byte[] rawBytes = GetWasmBytes();
            using var workflow = new Workflow("init-test", "Init Test", rawBytes);
            workflow.StartEvent("start").Next("end");
            workflow.EndEvent("end", "End");

            string xml = workflow.BuildXml();
            Assert.Contains("id=\"init-test\"", xml);
            Console.WriteLine("✓ .NET SDK constructor compilation verified successfully.");
        }

        [Fact]
        public void TestLoadAndProfiling()
        {
            Console.WriteLine("Running .NET SDK load and profiling test...");
            GC.Collect();
            long baseline = GC.GetTotalMemory(true);
            Console.WriteLine($"Baseline Memory: {baseline / (1024.0 * 1024.0):F2} MB");

            byte[] rawBytes = GetWasmBytes();

            for (int i = 0; i < 200; i++)
            {
                using var workflow = new Workflow($"load-test-{i}", $"Load Test {i}", rawBytes);
                workflow.StartEvent("start").Next("end");
                workflow.EndEvent("end", "End");
                string xml = workflow.BuildXml();
                Assert.NotNull(xml);

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
            byte[] rawBytes = GetWasmBytes();
            using var workflow = new Workflow("dmn-test", "DMN Test Process", rawBytes);

            workflow.StartEvent("start")
                .Next("ruleTask");

            workflow.BusinessRuleTask("ruleTask", "Determine Discount", "determine_discount")
                .HitPolicy("UNIQUE")
                .Input("membership", "string")
                .Input("age", "number")
                .Output("discount", "number")
                .Rule()
                    .When("membership", "gold")
                    .When("age", ">= 18")
                    .Then("discount", 20.0)
                .Rule()
                    .When("membership", "silver")
                    .Then("discount", 10.0)
                .ResultVariable("discountVar")
                .MapDecisionResult("singleEntry")
                .Next("end");

            workflow.EndEvent("end", "End");

            string xml = workflow.BuildXml();
            Assert.NotNull(xml);
            Assert.Contains("businessRuleTask id=\"ruleTask\"", xml);
            Assert.Contains("decisionRef=\"determine_discount\"", xml);
            Assert.Contains("resultVariable=\"discountVar\"", xml);
            Assert.Contains("mapDecisionResult=\"singleEntry\"", xml);
            Console.WriteLine("✓ .NET SDK business rule task verified successfully!");
        }

        [Fact]
        public void TestClosureDsl()
        {
            Console.WriteLine("Running .NET SDK closure block DSL test...");
            byte[] rawBytes = GetWasmBytes();
            using var workflow = new Workflow("closure-process", "Closure Process", rawBytes);

            workflow.User("task1", "User Approval")
                .If(Workflow.V("approved").Eq(true), b => {
                    b.Service("publish", "Publish Page", "publish-topic", st => {
                        st.Wasm("./publish.wasm");
                    });
                })
                .Else(b => {
                    b.Service("reject", "Notify Reject", "reject-topic");
                });

            string xml = workflow.BuildXml();
            Assert.NotNull(xml);
            Assert.Contains("id=\"closure-process\"", xml);
            Assert.Contains("exclusiveGateway id=\"gw_task1_decision\"", xml);
            Assert.Contains("serviceTask id=\"publish\"", xml);
            Assert.Contains("wasmPath=\"./publish.wasm\"", xml);
            Assert.Contains("serviceTask id=\"reject\"", xml);
            Console.WriteLine("✓ .NET SDK closure block DSL test passed!");
        }
    }
}
