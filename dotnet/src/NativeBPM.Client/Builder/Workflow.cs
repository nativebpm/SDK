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

        public Workflow StartEvent(string nodeId)
        {
            nodes.Add(new Dictionary<string, object>
            {
                { "type", "startEvent" },
                { "id", nodeId },
                { "name", "Start" }
            });
            this.currentNodeID = nodeId;
            return this;
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

        private static string Capitalize(string s)
        {
            if (string.IsNullOrEmpty(s)) return s;
            return char.ToUpper(s[0]) + s.Substring(1);
        }

        private static string ToCamelCase(string s)
        {
            if (s == "wasm") return "wasmPath";
            if (s == "result_variable") return "resultVar";
            if (!s.Contains("_")) return s;
            string[] parts = s.Split('_');
            for (int i = 1; i < parts.Length; i++)
            {
                parts[i] = Capitalize(parts[i]);
            }
            string res = string.Concat(parts);
            if (res == "wasm") return "wasmPath";
            if (res == "resultVariable") return "resultVar";
            return res;
        }

        private static void PopulateNodeProperties(Dictionary<string, object> node, Dictionary<string, object>? opts)
        {
            if (opts == null) return;
            foreach (var kvp in opts)
            {
                string key = ToCamelCase(kvp.Key);
                node[key] = kvp.Value;
            }
        }

        public Workflow ServiceTask(string nodeId, string nodeName, string topic, Dictionary<string, object>? options = null)
        {
            var node = new Dictionary<string, object>
            {
                { "type", "serviceTask" },
                { "id", nodeId },
                { "name", nodeName },
                { "topic", topic }
            };
            PopulateNodeProperties(node, options);
            nodes.Add(node);
            return this;
        }

        public Workflow AITask(string nodeId, string nodeName, Dictionary<string, object>? options = null)
        {
            var node = new Dictionary<string, object>
            {
                { "type", "aiServiceTask" },
                { "id", nodeId },
                { "name", nodeName }
            };
            PopulateNodeProperties(node, options);
            nodes.Add(node);
            return this;
        }

        public Workflow UserTask(string nodeId, string nodeName, Dictionary<string, object>? options = null)
        {
            var node = new Dictionary<string, object>
            {
                { "type", "userTask" },
                { "id", nodeId },
                { "name", nodeName }
            };
            PopulateNodeProperties(node, options);
            nodes.Add(node);
            return this;
        }

        public Workflow ExclusiveGateway(string nodeId, string nodeName)
        {
            nodes.Add(new Dictionary<string, object>
            {
                { "type", "exclusiveGateway" },
                { "id", nodeId },
                { "name", nodeName }
            });
            return this;
        }

        public Workflow ParallelGateway(string nodeId, string nodeName)
        {
            nodes.Add(new Dictionary<string, object>
            {
                { "type", "parallelGateway" },
                { "id", nodeId },
                { "name", nodeName }
            });
            return this;
        }

        public Workflow EventBasedGateway(string nodeId, string nodeName)
        {
            nodes.Add(new Dictionary<string, object>
            {
                { "type", "eventBasedGateway" },
                { "id", nodeId },
                { "name", nodeName }
            });
            return this;
        }

        public Workflow CallActivity(string nodeId, string nodeName, string calledElement, Dictionary<string, object>? options = null)
        {
            var node = new Dictionary<string, object>
            {
                { "type", "callActivity" },
                { "id", nodeId },
                { "name", nodeName },
                { "calledElement", calledElement }
            };
            PopulateNodeProperties(node, options);
            nodes.Add(node);
            return this;
        }

        public Workflow BusinessRuleTask(string nodeId, string nodeName, string decisionRef, Dictionary<string, object>? options = null)
        {
            var node = new Dictionary<string, object>
            {
                { "type", "businessRuleTask" },
                { "id", nodeId },
                { "name", nodeName },
                { "decisionRef", decisionRef }
            };
            PopulateNodeProperties(node, options);
            nodes.Add(node);
            return this;
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

        public Workflow User(string id, string name, Dictionary<string, object>? options = null)
        {
            this.UserTask(id, name, options);
            ConnectNode(id);
            return this;
        }

        public Workflow Service(string id, string name, string topic, Dictionary<string, object>? options = null)
        {
            this.ServiceTask(id, name, topic, options);
            ConnectNode(id);
            return this;
        }

        public Workflow Ai(string id, string name, Dictionary<string, object>? options = null)
        {
            this.AITask(id, name, options);
            ConnectNode(id);
            return this;
        }

        public Workflow Call(string id, string name, string calledElement, Dictionary<string, object>? options = null)
        {
            this.CallActivity(id, name, calledElement, options);
            ConnectNode(id);
            return this;
        }

        public Workflow BusinessRule(string id, string name, string decisionRef, Dictionary<string, object>? options = null)
        {
            this.BusinessRuleTask(id, name, decisionRef, options);
            ConnectNode(id);
            return this;
        }

        public WhenBuilder When(string condition)
        {
            string gwID = "gw_" + this.currentNodeID + "_decision";
            this.ExclusiveGateway(gwID, "Decision Gateway");
            this.ConnectNode(gwID);
            return new WhenBuilder(this, gwID, condition);
        }

        public WhenBuilder When(Expression condition)
        {
            return When(condition.ToString());
        }

        public void Dispose()
        {
            compiledModule?.Dispose();
            engine?.Dispose();
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

        public Branch User(string id, string name, Dictionary<string, object>? options = null)
        {
            Workflow.UserTask(id, name, options);
            ConnectNode(id);
            return this;
        }

        public Branch Service(string id, string name, string topic, Dictionary<string, object>? options = null)
        {
            Workflow.ServiceTask(id, name, topic, options);
            ConnectNode(id);
            return this;
        }

        public Branch Ai(string id, string name, Dictionary<string, object>? options = null)
        {
            Workflow.AITask(id, name, options);
            ConnectNode(id);
            return this;
        }

        public Branch Call(string id, string name, string calledElement, Dictionary<string, object>? options = null)
        {
            Workflow.CallActivity(id, name, calledElement, options);
            ConnectNode(id);
            return this;
        }

        public Branch BusinessRule(string id, string name, string decisionRef, Dictionary<string, object>? options = null)
        {
            Workflow.BusinessRuleTask(id, name, decisionRef, options);
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

        public WhenBranchBuilder When(string condition)
        {
            string gwID = "gw_" + this.currentNodeID + "_decision";
            Workflow.ExclusiveGateway(gwID, "Decision Gateway");
            ConnectNode(gwID);
            return new WhenBranchBuilder(this, gwID, condition);
        }

        public WhenBranchBuilder When(Expression condition)
        {
            return When(condition.ToString());
        }
    }

    public class WhenBuilder
    {
        private readonly Workflow workflow;
        private readonly string gatewayID;
        private readonly string condition;

        public WhenBuilder(Workflow workflow, string gatewayID, string condition)
        {
            this.workflow = workflow;
            this.gatewayID = gatewayID;
            this.condition = condition;
        }

        public ThenBuilder Then(Action<Branch> thenFn)
        {
            Branch thenBranch = new Branch(workflow, gatewayID, gatewayID, true, condition);
            thenFn(thenBranch);

            if (!thenBranch.HasEnded && thenBranch.currentNodeID != gatewayID)
            {
                workflow.PendingMerges.Add(thenBranch.currentNodeID);
            }

            return new ThenBuilder(workflow, gatewayID);
        }
    }

    public class ThenBuilder
    {
        private readonly Workflow workflow;
        private readonly string gatewayID;

        public ThenBuilder(Workflow workflow, string gatewayID)
        {
            this.workflow = workflow;
            this.gatewayID = gatewayID;
        }

        public Workflow Otherwise(Action<Branch> elseFn)
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

    public class WhenBranchBuilder
    {
        private readonly Branch branch;
        private readonly string gatewayID;
        private readonly string condition;

        public WhenBranchBuilder(Branch branch, string gatewayID, string condition)
        {
            this.branch = branch;
            this.gatewayID = gatewayID;
            this.condition = condition;
        }

        public ThenBranchBuilder Then(Action<Branch> thenFn)
        {
            Branch thenBranch = new Branch(branch.Workflow, gatewayID, gatewayID, true, condition);
            thenFn(thenBranch);

            if (!thenBranch.HasEnded && thenBranch.currentNodeID != gatewayID)
            {
                branch.Workflow.PendingMerges.Add(thenBranch.currentNodeID);
            }

            return new ThenBranchBuilder(branch, gatewayID);
        }
    }

    public class ThenBranchBuilder
    {
        private readonly Branch branch;
        private readonly string gatewayID;

        public ThenBranchBuilder(Branch branch, string gatewayID)
        {
            this.branch = branch;
            this.gatewayID = gatewayID;
        }

        public Branch Otherwise(Action<Branch> elseFn)
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
            return expr;
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
