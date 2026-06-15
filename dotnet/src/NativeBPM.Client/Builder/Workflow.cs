using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Reflection;
using System.Text;
using System.Text.Json;
using Wasmtime;

namespace NativeBPM.Client.Builder
{
    public class Workflow : IDisposable
    {
        private readonly string id;
        private readonly string name;
        private readonly List<Dictionary<string, object>> nodes = new();
        private readonly List<Dictionary<string, object>> flows = new();
        private string currentNodeID = "";
        internal List<string> PendingMerges { get; } = new();

        private Exception? err;
        private Engine? engine;
        private Wasmtime.Module? compiledModule;

        public Workflow(string id, string name, object? wasmInput = null)
        {
            this.id = id;
            this.name = name;
            if (wasmInput != null)
            {
                try
                {
                    byte[] decompressedBytes;
                    if (wasmInput is byte[] bytes)
                    {
                        decompressedBytes = DecompressWasmIfNeeded(bytes);
                    }
                    else if (wasmInput is string path)
                    {
                        byte[] data = File.ReadAllBytes(path);
                        decompressedBytes = DecompressWasmIfNeeded(data);
                    }
                    else
                    {
                        throw new ArgumentException($"Unsupported wasm input type: {wasmInput.GetType().FullName}");
                    }

                    this.engine = new Engine();
                    this.compiledModule = Wasmtime.Module.FromBytes(this.engine, "core", decompressedBytes);
                }
                catch (Exception ex)
                {
                    this.err = ex;
                }
            }
        }

        public static byte[] DecompressWasmIfNeeded(byte[] data)
        {
            if (data.Length >= 4 && data[0] == 0x00 && data[1] == 0x61 && data[2] == 0x73 && data[3] == 0x6d)
            {
                return data;
            }
            // Gzip
            if (data.Length >= 2 && data[0] == 0x1f && data[1] == 0x8b)
            {
                using var ms = new MemoryStream(data);
                using var gzip = new GZipStream(ms, CompressionMode.Decompress);
                using var outMs = new MemoryStream();
                gzip.CopyTo(outMs);
                return outMs.ToArray();
            }
            // Zip
            if (data.Length >= 4 && data[0] == 0x50 && data[1] == 0x4b && data[2] == 0x03 && data[3] == 0x04)
            {
                using var ms = new MemoryStream(data);
                using var archive = new ZipArchive(ms, ZipArchiveMode.Read);
                foreach (var entry in archive.Entries)
                {
                    if (entry.FullName.EndsWith(".wasm", StringComparison.OrdinalIgnoreCase))
                    {
                        using var entryStream = entry.Open();
                        using var outMs = new MemoryStream();
                        entryStream.CopyTo(outMs);
                        return outMs.ToArray();
                    }
                }
                throw new InvalidOperationException("No .wasm file found inside zip archive");
            }
            // Brotli
            try
            {
                using var ms = new MemoryStream(data);
                using var brotli = new BrotliStream(ms, CompressionMode.Decompress);
                using var outMs = new MemoryStream();
                brotli.CopyTo(outMs);
                var decompressed = outMs.ToArray();
                if (decompressed.Length >= 4 && decompressed[0] == 0x00 && decompressed[1] == 0x61 && decompressed[2] == 0x73 && decompressed[3] == 0x6d)
                {
                    return decompressed;
                }
            }
            catch
            {
                // ignore and fall through
            }
            throw new ArgumentException("Unsupported or invalid WebAssembly binary format (failed to decompress or identify magic header)");
        }

        public Workflow Builder() => this;

        public StartEventBuilder StartEvent(string nodeId)
        {
            nodes.Add(new Dictionary<string, object>
            {
                { "type", "startEvent" },
                { "id", nodeId },
                { "name", "Start" }
            });
            return new StartEventBuilder(this, nodeId);
        }

        public Workflow EndEvent(string nodeId, string nodeName)
        {
            nodes.Add(new Dictionary<string, object>
            {
                { "type", "endEvent" },
                { "id", nodeId },
                { "name", nodeName }
            });
            return this;
        }

        public ServiceTaskBuilder ServiceTask(string nodeId, string nodeName, string topic)
        {
            nodes.Add(new Dictionary<string, object>
            {
                { "type", "serviceTask" },
                { "id", nodeId },
                { "name", nodeName },
                { "topic", topic }
            });
            return new ServiceTaskBuilder(this, nodeId);
        }

        public AITaskBuilder AITask(string nodeId, string nodeName)
        {
            nodes.Add(new Dictionary<string, object>
            {
                { "type", "aiServiceTask" },
                { "id", nodeId },
                { "name", nodeName }
            });
            return new AITaskBuilder(this, nodeId);
        }

        public UserTaskBuilder UserTask(string nodeId, string nodeName)
        {
            nodes.Add(new Dictionary<string, object>
            {
                { "type", "userTask" },
                { "id", nodeId },
                { "name", nodeName }
            });
            return new UserTaskBuilder(this, nodeId);
        }

        public ExclusiveGatewayBuilder ExclusiveGateway(string nodeId, string nodeName)
        {
            nodes.Add(new Dictionary<string, object>
            {
                { "type", "exclusiveGateway" },
                { "id", nodeId },
                { "name", nodeName }
            });
            return new ExclusiveGatewayBuilder(this, nodeId);
        }

        public ParallelGatewayBuilder ParallelGateway(string nodeId, string nodeName)
        {
            nodes.Add(new Dictionary<string, object>
            {
                { "type", "parallelGateway" },
                { "id", nodeId },
                { "name", nodeName }
            });
            return new ParallelGatewayBuilder(this, nodeId);
        }

        public EventBasedGatewayBuilder EventBasedGateway(string nodeId, string nodeName)
        {
            nodes.Add(new Dictionary<string, object>
            {
                { "type", "eventBasedGateway" },
                { "id", nodeId },
                { "name", nodeName }
            });
            return new EventBasedGatewayBuilder(this, nodeId);
        }

        public CallActivityBuilder CallActivity(string nodeId, string nodeName, string calledElement)
        {
            nodes.Add(new Dictionary<string, object>
            {
                { "type", "callActivity" },
                { "id", nodeId },
                { "name", nodeName },
                { "calledElement", calledElement }
            });
            return new CallActivityBuilder(this, nodeId);
        }

        public BusinessRuleTaskBuilder BusinessRuleTask(string nodeId, string nodeName, string decisionRef)
        {
            nodes.Add(new Dictionary<string, object>
            {
                { "type", "businessRuleTask" },
                { "id", nodeId },
                { "name", nodeName },
                { "decisionRef", decisionRef }
            });
            return new BusinessRuleTaskBuilder(this, nodeId);
        }

        public Workflow SequenceFlow(string source, string target)
        {
            flows.Add(new Dictionary<string, object>
            {
                { "id", $"flow-{source}-{target}" },
                { "source", source },
                { "target", target },
                { "condition", "" }
            });
            return this;
        }

        public Workflow SequenceFlowWithCondition(string source, string target, string condition)
        {
            flows.Add(new Dictionary<string, object>
            {
                { "id", $"flow-{source}-{target}" },
                { "source", source },
                { "target", target },
                { "condition", condition }
            });
            return this;
        }

        public Dictionary<string, object>? FindNode(string nodeId)
        {
            foreach (var node in nodes)
            {
                if (nodeId.Equals(node["id"]))
                {
                    return node;
                }
            }
            return null;
        }

        public Dictionary<string, object> ToAST()
        {
            var nodesCopy = new List<Dictionary<string, object>>(this.nodes);
            var flowsCopy = new List<Dictionary<string, object>>(this.flows);

            var sourceIds = new HashSet<string>();
            foreach (var f in this.flows)
            {
                if (f.TryGetValue("source", out var srcObj) && srcObj is string src)
                {
                    sourceIds.Add(src);
                }
            }

            foreach (var node in this.nodes)
            {
                string nodeType = node.TryGetValue("type", out var typeObj) ? typeObj.ToString() ?? "" : "";
                string nodeId = node.TryGetValue("id", out var idObj) ? idObj.ToString() ?? "" : "";
                if (nodeType == "endEvent" || nodeType == "startEvent")
                {
                    continue;
                }
                if (!sourceIds.Contains(nodeId))
                {
                    string endId = "end_" + nodeId;
                    nodesCopy.Add(new Dictionary<string, object>
                    {
                        { "type", "endEvent" },
                        { "id", endId },
                        { "name", "Process Finished" }
                    });
                    flowsCopy.Add(new Dictionary<string, object>
                    {
                        { "id", $"flow-{nodeId}-{endId}" },
                        { "source", nodeId },
                        { "target", endId },
                        { "condition", "" }
                    });
                }
            }

            return new Dictionary<string, object>
            {
                { "id", id },
                { "name", name },
                { "nodes", nodesCopy },
                { "flows", flowsCopy }
            };
        }

        public string BuildXml(object? wasmInput = null)
        {
            if (this.err != null)
            {
                throw this.err;
            }

            if (this.compiledModule == null)
            {
                byte[] decompressedBytes;
                if (wasmInput != null)
                {
                    if (wasmInput is byte[] bytes)
                    {
                        decompressedBytes = DecompressWasmIfNeeded(bytes);
                    }
                    else if (wasmInput is string path)
                    {
                        byte[] data = File.ReadAllBytes(path);
                        decompressedBytes = DecompressWasmIfNeeded(data);
                    }
                    else
                    {
                        throw new ArgumentException($"Unsupported wasm input type: {wasmInput.GetType().FullName}");
                    }
                }
                else
                {
                    // Embedded fallback
                    var assembly = Assembly.GetExecutingAssembly();
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
                        throw new InvalidOperationException("Embedded core.wasm resource not found. Please specify wasmInput.");
                    }

                    using var resStream = assembly.GetManifestResourceStream(foundResource);
                    if (resStream == null)
                    {
                        throw new InvalidOperationException("Failed to load embedded core.wasm resource stream.");
                    }
                    using var ms = new MemoryStream();
                    resStream.CopyTo(ms);
                    decompressedBytes = DecompressWasmIfNeeded(ms.ToArray());
                }

                this.engine = new Engine();
                this.compiledModule = Wasmtime.Module.FromBytes(this.engine, "core", decompressedBytes);
            }

            using var store = new Store(this.engine);
            var wasiConfig = new WasiConfiguration();
            store.SetWasiConfiguration(wasiConfig);

            using var linker = new Linker(this.engine);
            linker.DefineWasi();

            var instance = linker.Instantiate(store, this.compiledModule);

            var start = instance.GetFunction("_start");
            if (start != null)
            {
                try
                {
                    start.Invoke();
                }
                catch (Exception ex) when (ex.Message.Contains("exit status 0") || ex.Message.Contains("status 0"))
                {
                    // Ignore successful normal exit from Go WASI command module
                }
            }

            var memory = instance.GetMemory("memory");
            var allocate = instance.GetFunction("allocate");
            var deallocate = instance.GetFunction("deallocate");
            var compileWorkflow = instance.GetFunction("compileWorkflow");

            if (memory == null || allocate == null || deallocate == null || compileWorkflow == null)
            {
                throw new InvalidOperationException("Failed to locate required WebAssembly exports.");
            }

            string astJson = JsonSerializer.Serialize(ToAST());
            byte[] astBytes = Encoding.UTF8.GetBytes(astJson);

            int inputPtr = (int)allocate.Invoke(astBytes.Length);
            memory.WriteString(inputPtr, astJson, Encoding.UTF8);

            long resultPacked = (long)compileWorkflow.Invoke(inputPtr, astBytes.Length);

            int resultPtr = (int)(resultPacked >> 32);
            int resultSize = (int)(resultPacked & 0xFFFFFFFF);

            string resultJson = memory.ReadString(resultPtr, resultSize, Encoding.UTF8);

            deallocate.Invoke(inputPtr, astBytes.Length);
            deallocate.Invoke(resultPtr, resultSize);

            using var doc = JsonDocument.Parse(resultJson);
            var root = doc.RootElement;
            if (root.TryGetProperty("error", out var errProp) && errProp.ValueKind == JsonValueKind.String)
            {
                string errMsg = errProp.GetString()!;
                if (!string.IsNullOrEmpty(errMsg))
                {
                    throw new InvalidOperationException($"Wasm workflow compilation failed: {errMsg}");
                }
            }

            return root.GetProperty("xml").GetString()!;
        }

        private void ConnectNode(string nodeId)
        {
            var node = FindNode(nodeId);
            bool hasStart = false;
            foreach (var n in this.nodes)
            {
                if (n.TryGetValue("type", out var typeObj) && typeObj.ToString() == "startEvent")
                {
                    hasStart = true;
                    break;
                }
            }
            if (!hasStart && node != null && node.TryGetValue("type", out var tObj) && tObj.ToString() != "startEvent")
            {
                this.StartEvent("start");
                this.SequenceFlow("start", nodeId);
                currentNodeID = nodeId;
                return;
            }

            if (PendingMerges.Count > 0)
            {
                foreach (var sourceId in PendingMerges)
                {
                    this.SequenceFlow(sourceId, nodeId);
                }
                PendingMerges.Clear();
            }
            else if (!string.IsNullOrEmpty(currentNodeID) && currentNodeID != nodeId)
            {
                this.SequenceFlow(currentNodeID, nodeId);
            }
            currentNodeID = nodeId;
        }

        public Workflow Start(string id = "start")
        {
            this.StartEvent(id);
            ConnectNode(id);
            return this;
        }

        public static Variable V(string name) => new Variable(name);
        public static Variable Var(string name) => new Variable(name);
        public static Variable v(string name) => new Variable(name);

        public Workflow End(string id, string name)
        {
            this.EndEvent(id, name);
            ConnectNode(id);
            this.currentNodeID = "";
            return this;
        }

        public Workflow User(string id, string name, Action<UserTaskBuilder>? config = null)
        {
            var builder = this.UserTask(id, name);
            config?.Invoke(builder);
            ConnectNode(id);
            return this;
        }

        public Workflow Service(string id, string name, string topic, Action<ServiceTaskBuilder>? config = null)
        {
            var builder = this.ServiceTask(id, name, topic);
            config?.Invoke(builder);
            ConnectNode(id);
            return this;
        }

        public Workflow Ai(string id, string name, Action<AITaskBuilder>? config = null)
        {
            var builder = this.AITask(id, name);
            config?.Invoke(builder);
            ConnectNode(id);
            return this;
        }

        public IfElseBuilder If(string condition, Action<Branch> thenFn)
        {
            string gwID = "gw_" + this.currentNodeID + "_decision";
            this.ExclusiveGateway(gwID, "Decision Gateway");

            this.ConnectNode(gwID);

            Branch thenBranch = new Branch(this, gwID, gwID, true, condition);
            thenFn(thenBranch);

            if (!thenBranch.HasEnded && thenBranch.currentNodeID != gwID)
            {
                this.PendingMerges.Add(thenBranch.currentNodeID);
            }

            return new IfElseBuilder(this, gwID);
        }

        public IfElseBuilder If(Expression condition, Action<Branch> thenFn)
        {
            return If(condition.ToString(), thenFn);
        }

        public void Dispose()
        {
            compiledModule?.Dispose();
            engine?.Dispose();
        }
    }

    public class StartEventBuilder
    {
        private readonly Workflow workflow;
        private readonly string id;

        public StartEventBuilder(Workflow workflow, string id)
        {
            this.workflow = workflow;
            this.id = id;
        }

        public Workflow Next(string targetId) => workflow.SequenceFlow(id, targetId);
        public Workflow ConnectTo(string targetId) => Next(targetId);
        public Workflow Builder() => workflow;
    }

    public class ServiceTaskBuilder
    {
        private readonly Workflow workflow;
        private readonly string id;

        public ServiceTaskBuilder(Workflow workflow, string id)
        {
            this.workflow = workflow;
            this.id = id;
        }

        public ServiceTaskBuilder WasmPath(string path)
        {
            var node = workflow.FindNode(id);
            if (node != null) node["wasmPath"] = path;
            return this;
        }

        public ServiceTaskBuilder Wasm(string alias) => WasmPath(alias);
        public Workflow Next(string targetId) => workflow.SequenceFlow(id, targetId);
        public Workflow ConnectTo(string targetId) => Next(targetId);
        public Workflow Builder() => workflow;
    }

    public class AITaskBuilder
    {
        private readonly Workflow workflow;
        private readonly string id;

        public AITaskBuilder(Workflow workflow, string id)
        {
            this.workflow = workflow;
            this.id = id;
        }

        public AITaskBuilder Provider(string provider)
        {
            var node = workflow.FindNode(id);
            if (node != null) node["provider"] = provider;
            return this;
        }

        public AITaskBuilder Model(string model)
        {
            var node = workflow.FindNode(id);
            if (node != null) node["model"] = model;
            return this;
        }

        public AITaskBuilder Prompt(string prompt)
        {
            var node = workflow.FindNode(id);
            if (node != null) node["prompt"] = prompt;
            return this;
        }

        public AITaskBuilder SystemInstruction(string systemInstruction)
        {
            var node = workflow.FindNode(id);
            if (node != null) node["systemInstruction"] = systemInstruction;
            return this;
        }

        public AITaskBuilder ResponseSchema(string responseSchema)
        {
            var node = workflow.FindNode(id);
            if (node != null) node["responseSchema"] = responseSchema;
            return this;
        }

        public AITaskBuilder Temperature(double temperature)
        {
            var node = workflow.FindNode(id);
            if (node != null) node["temperature"] = temperature;
            return this;
        }

        public AITaskBuilder ResultVar(string resultVar)
        {
            var node = workflow.FindNode(id);
            if (node != null) node["resultVar"] = resultVar;
            return this;
        }

        public Workflow Next(string targetId) => workflow.SequenceFlow(id, targetId);
        public Workflow ConnectTo(string targetId) => Next(targetId);
        public Workflow Builder() => workflow;
    }

    public class UserTaskBuilder
    {
        private readonly Workflow workflow;
        private readonly string id;

        public UserTaskBuilder(Workflow workflow, string id)
        {
            this.workflow = workflow;
            this.id = id;
        }

        public UserTaskBuilder Assignee(string assignee)
        {
            var node = workflow.FindNode(id);
            if (node != null) node["assignee"] = assignee;
            return this;
        }

        public UserTaskBuilder CandidateGroups(string candidateGroups)
        {
            var node = workflow.FindNode(id);
            if (node != null) node["candidateGroups"] = candidateGroups;
            return this;
        }

        public UserTaskBuilder DueDate(string dueDate)
        {
            var node = workflow.FindNode(id);
            if (node != null) node["dueDate"] = dueDate;
            return this;
        }

        public Workflow Next(string targetId) => workflow.SequenceFlow(id, targetId);
        public Workflow ConnectTo(string targetId) => Next(targetId);
        public Workflow Builder() => workflow;
    }

    public class ExclusiveGatewayBuilder
    {
        private readonly Workflow workflow;
        private readonly string id;

        public ExclusiveGatewayBuilder(Workflow workflow, string id)
        {
            this.workflow = workflow;
            this.id = id;
        }

        public Workflow Next(string targetId) => workflow.SequenceFlow(id, targetId);
        public Workflow NextWithCondition(string targetId, string condition) => workflow.SequenceFlowWithCondition(id, targetId, condition);
        public ExclusiveGatewayBuilder Condition(string targetId, string condition)
        {
            workflow.SequenceFlowWithCondition(id, targetId, condition);
            return this;
        }
        public ExclusiveGatewayBuilder DefaultValue(string targetId)
        {
            workflow.SequenceFlow(id, targetId);
            return this;
        }
        public Workflow ConnectTo(string targetId) => Next(targetId);
        public Workflow Builder() => workflow;
    }

    public class ParallelGatewayBuilder
    {
        private readonly Workflow workflow;
        private readonly string id;

        public ParallelGatewayBuilder(Workflow workflow, string id)
        {
            this.workflow = workflow;
            this.id = id;
        }

        public Workflow Next(string targetId) => workflow.SequenceFlow(id, targetId);
        public Workflow ConnectTo(string targetId) => Next(targetId);
        public Workflow Builder() => workflow;
    }

    public class EventBasedGatewayBuilder
    {
        private readonly Workflow workflow;
        private readonly string id;

        public EventBasedGatewayBuilder(Workflow workflow, string id)
        {
            this.workflow = workflow;
            this.id = id;
        }

        public Workflow Next(string targetId) => workflow.SequenceFlow(id, targetId);
        public Workflow ConnectTo(string targetId) => Next(targetId);
        public Workflow Builder() => workflow;
    }

    public class CallActivityBuilder
    {
        private readonly Workflow workflow;
        private readonly string id;

        public CallActivityBuilder(Workflow workflow, string id)
        {
            this.workflow = workflow;
            this.id = id;
        }

        public CallActivityBuilder In(string source, string target)
        {
            var node = workflow.FindNode(id);
            if (node != null)
            {
                if (!node.TryGetValue("inVariables", out var listObj) || listObj is not List<Dictionary<string, object>> list)
                {
                    list = new List<Dictionary<string, object>>();
                    node["inVariables"] = list;
                }
                list.Add(new Dictionary<string, object>
                {
                    { "source", source },
                    { "target", target },
                    { "variables", "" },
                    { "local", false }
                });
            }
            return this;
        }

        public CallActivityBuilder InAll()
        {
            var node = workflow.FindNode(id);
            if (node != null)
            {
                if (!node.TryGetValue("inVariables", out var listObj) || listObj is not List<Dictionary<string, object>> list)
                {
                    list = new List<Dictionary<string, object>>();
                    node["inVariables"] = list;
                }
                list.Add(new Dictionary<string, object>
                {
                    { "source", "" },
                    { "target", "" },
                    { "variables", "all" },
                    { "local", false }
                });
            }
            return this;
        }

        public CallActivityBuilder Out(string source, string target)
        {
            var node = workflow.FindNode(id);
            if (node != null)
            {
                if (!node.TryGetValue("outVariables", out var listObj) || listObj is not List<Dictionary<string, object>> list)
                {
                    list = new List<Dictionary<string, object>>();
                    node["outVariables"] = list;
                }
                list.Add(new Dictionary<string, object>
                {
                    { "source", source },
                    { "target", target },
                    { "variables", "" }
                });
            }
            return this;
        }

        public CallActivityBuilder OutAll()
        {
            var node = workflow.FindNode(id);
            if (node != null)
            {
                if (!node.TryGetValue("outVariables", out var listObj) || listObj is not List<Dictionary<string, object>> list)
                {
                    list = new List<Dictionary<string, object>>();
                    node["outVariables"] = list;
                }
                list.Add(new Dictionary<string, object>
                {
                    { "source", "" },
                    { "target", "" },
                    { "variables", "all" }
                });
            }
            return this;
        }

        public Workflow Next(string targetId) => workflow.SequenceFlow(id, targetId);
        public Workflow ConnectTo(string targetId) => Next(targetId);
        public Workflow Builder() => workflow;
    }

    public class BusinessRuleTaskBuilder
    {
        internal readonly Workflow workflow;
        internal readonly string id;

        public BusinessRuleTaskBuilder(Workflow workflow, string id)
        {
            this.workflow = workflow;
            this.id = id;
        }

        public BusinessRuleTaskBuilder MapDecisionResult(string mapDecisionResult)
        {
            var node = workflow.FindNode(id);
            if (node != null) node["mapDecisionResult"] = mapDecisionResult;
            return this;
        }

        public BusinessRuleTaskBuilder ResultVariable(string resultVar)
        {
            var node = workflow.FindNode(id);
            if (node != null) node["resultVar"] = resultVar;
            return this;
        }

        public BusinessRuleTaskBuilder HitPolicy(string hitPolicy)
        {
            var node = workflow.FindNode(id);
            if (node != null) node["hitPolicy"] = hitPolicy;
            return this;
        }

        public BusinessRuleTaskBuilder Input(string expression, string type)
        {
            var node = workflow.FindNode(id);
            if (node != null)
            {
                if (!node.TryGetValue("inputs", out var listObj) || listObj is not List<Dictionary<string, object>> list)
                {
                    list = new List<Dictionary<string, object>>();
                    node["inputs"] = list;
                }
                list.Add(new Dictionary<string, object>
                {
                    { "expression", expression },
                    { "type", type }
                });
            }
            return this;
        }

        public BusinessRuleTaskBuilder Output(string name, string type)
        {
            var node = workflow.FindNode(id);
            if (node != null)
            {
                if (!node.TryGetValue("outputs", out var listObj) || listObj is not List<Dictionary<string, object>> list)
                {
                    list = new List<Dictionary<string, object>>();
                    node["outputs"] = list;
                }
                list.Add(new Dictionary<string, object>
                {
                    { "name", name },
                    { "type", type }
                });
            }
            return this;
        }

        public DMNRuleBuilder Rule()
        {
            return new DMNRuleBuilder(this);
        }

        public Workflow Next(string targetId) => workflow.SequenceFlow(id, targetId);
        public Workflow ConnectTo(string targetId) => Next(targetId);
        public Workflow Builder() => workflow;
    }

    public class DMNRuleBuilder
    {
        private readonly BusinessRuleTaskBuilder taskBuilder;
        private readonly Dictionary<string, string> inputs = new();
        private readonly Dictionary<string, string> outputs = new();

        public DMNRuleBuilder(BusinessRuleTaskBuilder taskBuilder)
        {
            this.taskBuilder = taskBuilder;
        }

        public DMNRuleBuilder When(string expression, object val)
        {
            inputs[expression] = FormatDMNValue(val);
            return this;
        }

        public DMNRuleBuilder Then(string name, object val)
        {
            outputs[name] = FormatDMNValue(val);
            return this;
        }

        private void Commit()
        {
            var node = taskBuilder.workflow.FindNode(taskBuilder.id);
            if (node == null) return;

            if (!node.TryGetValue("rules", out var listObj) || listObj is not List<Dictionary<string, object>> rulesList)
            {
                rulesList = new List<Dictionary<string, object>>();
                node["rules"] = rulesList;
            }

            node.TryGetValue("inputs", out var inputsObj);
            var inputsList = inputsObj as List<Dictionary<string, object>> ?? new List<Dictionary<string, object>>();

            node.TryGetValue("outputs", out var outputsObj);
            var outputsList = outputsObj as List<Dictionary<string, object>> ?? new List<Dictionary<string, object>>();

            var ruleInputs = new List<string>();
            foreach (var inVal in inputsList)
            {
                string expr = (string)inVal["expression"];
                if (inputs.TryGetValue(expr, out var dmnVal))
                {
                    ruleInputs.Add(dmnVal);
                }
                else
                {
                    ruleInputs.Add("-");
                }
            }

            var ruleOutputs = new List<string>();
            foreach (var outVal in outputsList)
            {
                string name = (string)outVal["name"];
                if (outputs.TryGetValue(name, out var dmnVal))
                {
                    ruleOutputs.Add(dmnVal);
                }
                else
                {
                    ruleOutputs.Add("-");
                }
            }

            rulesList.Add(new Dictionary<string, object>
            {
                { "inputs", ruleInputs },
                { "outputs", ruleOutputs }
            });
        }

        public DMNRuleBuilder Rule()
        {
            Commit();
            return taskBuilder.Rule();
        }

        public Workflow Next(string targetId)
        {
            Commit();
            return taskBuilder.Next(targetId);
        }

        public Workflow ConnectTo(string targetId) => Next(targetId);

        public Workflow Builder()
        {
            Commit();
            return taskBuilder.Builder();
        }

        public BusinessRuleTaskBuilder MapDecisionResult(string mapDecisionResult)
        {
            Commit();
            return taskBuilder.MapDecisionResult(mapDecisionResult);
        }

        public BusinessRuleTaskBuilder ResultVariable(string resultVar)
        {
            Commit();
            return taskBuilder.ResultVariable(resultVar);
        }

        private string FormatDMNValue(object val)
        {
            if (val == null) return "-";
            if (val is string s)
            {
                string trimmed = s.Trim();
                foreach (var op in new[] { "<=", ">=", "!=", "<>", "<", ">" })
                {
                    if (trimmed.StartsWith(op)) return trimmed;
                }
                if (trimmed == "true" || trimmed == "false") return trimmed;
                if (double.TryParse(trimmed, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out _))
                {
                    return trimmed;
                }
                return $"\"{trimmed}\"";
            }
            if (val is bool b)
            {
                return b ? "true" : "false";
            }
            if (val is double || val is float || val is int || val is long)
            {
                return Convert.ToString(val, System.Globalization.CultureInfo.InvariantCulture);
            }
            return val.ToString() ?? "-";
        }
    }

    public class Branch
    {
        public Workflow Workflow { get; }
        private readonly string gatewayID;
        public string currentNodeID { get; set; }
        private readonly bool isConditional;
        private readonly string condition;
        public bool HasEnded { get; set; } = false;

        public Branch(Workflow workflow, string gatewayID, string currentNodeID, bool isConditional, string condition)
        {
            this.Workflow = workflow;
            this.gatewayID = gatewayID;
            this.currentNodeID = currentNodeID;
            this.isConditional = isConditional;
            this.condition = condition;
        }

        private void ConnectNode(string nodeId)
        {
            if (HasEnded) return;

            var merges = Workflow.PendingMerges;
            if (merges.Count > 0)
            {
                foreach (var sourceId in merges)
                {
                    Workflow.SequenceFlow(sourceId, nodeId);
                }
                merges.Clear();
                this.currentNodeID = nodeId;
                return;
            }

            if (this.currentNodeID == this.gatewayID)
            {
                if (isConditional)
                {
                    Workflow.SequenceFlowWithCondition(this.gatewayID, nodeId, this.condition);
                }
                else
                {
                    Workflow.SequenceFlow(this.gatewayID, nodeId);
                }
            }
            else if (!string.IsNullOrEmpty(this.currentNodeID) && this.currentNodeID != nodeId)
            {
                Workflow.SequenceFlow(this.currentNodeID, nodeId);
            }
            this.currentNodeID = nodeId;
        }

        public Branch User(string id, string name, Action<UserTaskBuilder>? config = null)
        {
            var builder = Workflow.UserTask(id, name);
            config?.Invoke(builder);
            ConnectNode(id);
            return this;
        }

        public Branch Service(string id, string name, string topic, Action<ServiceTaskBuilder>? config = null)
        {
            var builder = Workflow.ServiceTask(id, name, topic);
            config?.Invoke(builder);
            ConnectNode(id);
            return this;
        }

        public Branch Ai(string id, string name, Action<AITaskBuilder>? config = null)
        {
            var builder = Workflow.AITask(id, name);
            config?.Invoke(builder);
            ConnectNode(id);
            return this;
        }

        public Branch End(string id, string name)
        {
            Workflow.EndEvent(id, name);
            ConnectNode(id);
            this.HasEnded = true;
            return this;
        }

        public IfElseBranchBuilder If(string condition, Action<Branch> thenFn)
        {
            string gwID = "gw_" + this.currentNodeID + "_decision";
            Workflow.ExclusiveGateway(gwID, "Decision Gateway");
            ConnectNode(gwID);

            Branch thenBranch = new Branch(Workflow, gwID, gwID, true, condition);
            thenFn(thenBranch);

            if (!thenBranch.HasEnded && thenBranch.currentNodeID != gwID)
            {
                Workflow.PendingMerges.Add(thenBranch.currentNodeID);
            }

            return new IfElseBranchBuilder(this, gwID);
        }

        public IfElseBranchBuilder If(Expression condition, Action<Branch> thenFn)
        {
            return If(condition.ToString(), thenFn);
        }
    }

    public class IfElseBuilder
    {
        private readonly Workflow workflow;
        private readonly string gatewayID;

        public IfElseBuilder(Workflow workflow, string gatewayID)
        {
            this.workflow = workflow;
            this.gatewayID = gatewayID;
        }

        public Workflow Else(Action<Branch> elseFn)
        {
            Branch elseBranch = new Branch(workflow, gatewayID, gatewayID, false, "");
            elseFn(elseBranch);

            if (!elseBranch.HasEnded && elseBranch.currentNodeID != gatewayID)
            {
                workflow.PendingMerges.Add(elseBranch.currentNodeID);
            }

            return workflow;
        }
    }

    public class IfElseBranchBuilder
    {
        private readonly Branch branch;
        private readonly string gatewayID;

        public IfElseBranchBuilder(Branch branch, string gatewayID)
        {
            this.branch = branch;
            this.gatewayID = gatewayID;
        }

        public Branch Else(Action<Branch> elseFn)
        {
            Branch elseBranch = new Branch(branch.Workflow, gatewayID, gatewayID, false, "");
            elseFn(elseBranch);

            if (!elseBranch.HasEnded && elseBranch.currentNodeID != gatewayID)
            {
                branch.Workflow.PendingMerges.Add(elseBranch.currentNodeID);
            }

            return branch;
        }
    }

    public class Expression
    {
        private readonly string expr;
        public Expression(string expr)
        {
            this.expr = expr;
        }
        public override string ToString()
        {
            return $"${{{expr}}}";
        }
    }

    public class Variable
    {
        private readonly string name;
        public Variable(string name)
        {
            this.name = name;
        }
        public Expression Eq(object val)
        {
            string valStr = val is bool b ? (b ? "true" : "false") : val.ToString() ?? "";
            return new Expression($"{name} == {valStr}");
        }
        public Expression Ne(object val)
        {
            string valStr = val is bool b ? (b ? "true" : "false") : val.ToString() ?? "";
            return new Expression($"{name} != {valStr}");
        }
        public Expression Gt(object val)
        {
            return new Expression($"{name} > {val}");
        }
        public Expression Gte(object val)
        {
            return new Expression($"{name} >= {val}");
        }
        public Expression Lt(object val)
        {
            return new Expression($"{name} < {val}");
        }
        public Expression Lte(object val)
        {
            return new Expression($"{name} <= {val}");
        }
    }
}
