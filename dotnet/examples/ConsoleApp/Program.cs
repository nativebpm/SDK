using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using NativeBPM.Client.Api;
using NativeBPM.Client.Client;
using NativeBPM.Client.Extensions;
using NativeBPM.Client.Model;
using NativeBPM.Client.Builder;
using static NativeBPM.Client.Builder.Workflow;

namespace ConsoleApp
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("🚀 NativeBPM .NET SDK Example Starting...");

            var services = new ServiceCollection();

            string hostUrl = "http://localhost:8080";
            string apiToken = "test-bearer-token";

            // Configure NativeBPM client API with Base Address and Bearer Token
            services.AddApi(options =>
            {
                options.AddApiHttpClients(client =>
                {
                    client.BaseAddress = new Uri(hostUrl);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiToken);
                });
            });

            var serviceProvider = services.BuildServiceProvider();
            var api = serviceProvider.GetRequiredService<IDefaultApi>();

            try
            {
                await RunWorkflowWasmAsync(api);
                await RunWorkflowWithWasmPluginsAsync(api);

                // List deployed process definitions
                Console.WriteLine("--------------------------------------------------");
                Console.WriteLine("📋 Listing deployed definitions...");
                var definitionsResponse = await api.ListDefinitionsAsync();
                if (definitionsResponse.IsSuccessStatusCode && definitionsResponse.TryOk(out var definitions) && definitions != null)
                {
                    foreach (var def in definitions)
                    {
                        Console.WriteLine($" - Definition: {def.Id} (name: {def.Name})");
                    }
                }

                // List process instances
                Console.WriteLine("📋 Listing process instances...");
                var instancesResponse = await api.ListInstancesAsync();
                if (instancesResponse.IsSuccessStatusCode && instancesResponse.TryOk(out var instances) && instances != null)
                {
                    foreach (var inst in instances)
                    {
                        Console.WriteLine($" - Instance: {inst.Id}, Process: {inst.ProcessId}, Completed: {inst.Completed}");
                    }
                }

                Console.WriteLine("🎉 .NET SDK usage example finished successfully!");
            }
            catch (ApiException e)
            {
                Console.WriteLine($"❌ API Request failed! Response code: {e.ErrorCode}");
                Console.WriteLine($"Response headers: {e.Headers}");
                Console.WriteLine($"Response content: {e.ErrorContent}");
            }
            catch (Exception e)
            {
                Console.WriteLine($"❌ Error occurred: {e.Message}");
                Console.WriteLine(e.StackTrace);
            }
        }

        static async Task RunWorkflowWasmAsync(IDefaultApi api)
        {
            Console.WriteLine("--------------------------------------------------");
            Console.WriteLine("=== NativeBPM .NET SDK: Workflow as Code ===");
            Console.WriteLine("🔨 Building workflow dynamically using Fluent API...");
            using var workflow = new Workflow("native-demo", "Workflow as Code");

            // Chain starting with dynamic if statement (auto-start will prepend start event)
            workflow.When(V("isUrgent").Eq(true)).Then(b => {
                    b.User("reviewOrder", "Review Order Details", ut => {
                        ut.Assignee("sales_representative");
                    });
                })
                .Otherwise(b => {
                    b.Service("notifyCustomer", "Send Confirmation Email", "email_topic");
                });

            string bpmnXml = workflow.BuildXml();
            Console.WriteLine("✓ Successfully compiled native workflow AST to BPMN 2.0 XML.");

            string tempFilePath = Path.GetTempFileName() + ".bpmn";
            try
            {
                await File.WriteAllTextAsync(tempFilePath, bpmnXml, Encoding.UTF8);

                Console.WriteLine("📦 Deploying native process definition...");
                using var fileStream = File.OpenRead(tempFilePath);
                var fileParam = new FileParameter(fileStream, "nativeProcess.bpmn", "application/octet-stream");
                var definitionResponse = await api.DeployDefinitionAsync(fileParam);

                if (definitionResponse.IsSuccessStatusCode && definitionResponse.TryOk(out var definition) && definition != null)
                {
                    Console.WriteLine($"✅ Deployed! ID: {definition.Id}, Hash: {definition.Hash}");

                    Console.WriteLine("⚡ Starting native process instance...");
                    var startRequest = new StartInstanceRequest(
                        instanceId: Guid.NewGuid(),
                        businessKey: "bk-dotnet-native-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                        variables: new Dictionary<string, object>
                        {
                            { "isUrgent", true }
                        }
                    );

                    var startResponse = await api.StartInstanceAsync(definition.Id, startRequest);
                    if (startResponse.IsSuccessStatusCode && startResponse.TryOk(out var instance) && instance != null)
                    {
                        Console.WriteLine($"✅ Instance started! ID: {instance.Id}, Completed: {instance.Completed}");
                    }
                    else
                    {
                        Console.WriteLine("❌ Failed to start native process instance.");
                    }
                }
                else
                {
                    Console.WriteLine($"❌ Failed to deploy native process. Status: {definitionResponse.StatusCode}");
                }
            }
            finally
            {
                if (File.Exists(tempFilePath))
                {
                    File.Delete(tempFilePath);
                }
            }
        }

        static async Task RunWorkflowWithWasmPluginsAsync(IDefaultApi api)
        {
            Console.WriteLine("--------------------------------------------------");
            Console.WriteLine("=== NativeBPM .NET SDK: Workflow with Guest WASM Plugins ===");
            Console.WriteLine("🔨 Building workflow dynamically using Fluent API...");
            using var workflow = new Workflow("wasm-demo", "Workflow with Guest WASM Plugins");

            // Chain starting from first service task (auto-start will prepend start event)
            workflow.Service("calculate", "Calculate Totals", "payment_topic", st => {
                    st.Wasm("./calculate_total.wasm");
                })
                .Ai("aiCheck", "AI Fraud Guard", ait => {
                    ait.Provider("google")
                       .Model("gemini-2.5-flash")
                       .Prompt("Analyze transaction for fraud: ${orderAmount}")
                       .ResultVar("isFraudulent");
                })
                .When(V("isFraudulent").Eq(true)).Then(b => {
                    b.User("userTask", "Manual Fraud Approval", ut => {
                        ut.Assignee("security_officer");
                    });
                })
                .Otherwise(b => {
                    // empty branch (will auto-route to end event)
                });

            string bpmnXml = workflow.BuildXml();
            Console.WriteLine("✓ Successfully compiled WASM workflow AST to BPMN 2.0 XML.");

            string tempFilePath = Path.GetTempFileName() + ".bpmn";
            try
            {
                await File.WriteAllTextAsync(tempFilePath, bpmnXml, Encoding.UTF8);

                Console.WriteLine("📦 Deploying WASM process definition...");
                using var fileStream = File.OpenRead(tempFilePath);
                var fileParam = new FileParameter(fileStream, "wasmProcess.bpmn", "application/octet-stream");
                var definitionResponse = await api.DeployDefinitionAsync(fileParam);

                if (definitionResponse.IsSuccessStatusCode && definitionResponse.TryOk(out var definition) && definition != null)
                {
                    Console.WriteLine($"✅ Deployed! ID: {definition.Id}, Hash: {definition.Hash}");

                    Console.WriteLine("⚡ Starting WASM process instance...");
                    var startRequest = new StartInstanceRequest(
                        instanceId: Guid.NewGuid(),
                        businessKey: "bk-dotnet-wasm-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                        variables: new Dictionary<string, object>
                        {
                            { "orderAmount", 2500 }
                        }
                    );

                    var startResponse = await api.StartInstanceAsync(definition.Id, startRequest);
                    if (startResponse.IsSuccessStatusCode && startResponse.TryOk(out var instance) && instance != null)
                    {
                        Console.WriteLine($"✅ Instance started! ID: {instance.Id}, Completed: {instance.Completed}");
                    }
                    else
                    {
                        Console.WriteLine("❌ Failed to start WASM process instance.");
                    }
                }
                else
                {
                    Console.WriteLine($"❌ Failed to deploy WASM process. Status: {definitionResponse.StatusCode}");
                }
            }
            finally
            {
                if (File.Exists(tempFilePath))
                {
                    File.Delete(tempFilePath);
                }
            }
        }
    }
}
