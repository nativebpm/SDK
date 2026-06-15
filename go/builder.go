package nativebpm

import (
	"archive/zip"
	"bytes"
	"compress/gzip"
	"context"
	_ "embed"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"

	"github.com/andybalholm/brotli"
	"github.com/tetratelabs/wazero"
	"github.com/tetratelabs/wazero/imports/wasi_snapshot_preview1"
)

//go:embed core.wasm
var coreWasm []byte

type Workflow struct {
	ID             string                   `json:"id"`
	Name           string                   `json:"name"`
	Nodes          []map[string]interface{} `json:"nodes"`
	Flows          []map[string]interface{} `json:"flows"`
	err            error
	runtime        wazero.Runtime
	compiledModule wazero.CompiledModule
	currentNodeID  string
	pendingMerges  []string
}

func (w *Workflow) MarshalJSON() ([]byte, error) {
	sourceIDs := make(map[string]bool)
	for _, f := range w.Flows {
		if src, ok := f["source"].(string); ok {
			sourceIDs[src] = true
		}
	}

	nodes := make([]map[string]interface{}, len(w.Nodes))
	copy(nodes, w.Nodes)

	flows := make([]map[string]interface{}, len(w.Flows))
	copy(flows, w.Flows)

	for _, node := range w.Nodes {
		nodeType, _ := node["type"].(string)
		nodeID, _ := node["id"].(string)
		if nodeType == "endEvent" || nodeType == "startEvent" {
			continue
		}
		if !sourceIDs[nodeID] {
			endID := fmt.Sprintf("end_%s", nodeID)
			nodes = append(nodes, map[string]interface{}{
				"type": "endEvent",
				"id":   endID,
				"name": "Process Finished",
			})
			flows = append(flows, map[string]interface{}{
				"id":        fmt.Sprintf("flow-%s-%s", nodeID, endID),
				"source":    nodeID,
				"target":    endID,
				"condition": "",
			})
		}
	}

	type Alias Workflow
	return json.Marshal(&struct {
		Nodes []map[string]interface{} `json:"nodes"`
		Flows []map[string]interface{} `json:"flows"`
		*Alias
	}{
		Nodes: nodes,
		Flows: flows,
		Alias: (*Alias)(w),
	})
}

func NewWorkflow(id, name string, wasmInput ...interface{}) *Workflow {
	w := &Workflow{
		ID:    id,
		Name:  name,
		Nodes: make([]map[string]interface{}, 0),
		Flows: make([]map[string]interface{}, 0),
	}
	if len(wasmInput) > 0 {
		ctx := context.Background()
		var decompressedBytes []byte
		var err error

		switch v := wasmInput[0].(type) {
		case []byte:
			decompressedBytes, err = decompressWasmIfNeeded(v)
		case string:
			var data []byte
			data, err = os.ReadFile(v)
			if err == nil {
				decompressedBytes, err = decompressWasmIfNeeded(data)
			}
		default:
			w.err = fmt.Errorf("unsupported wasm input type: %T", wasmInput[0])
			return w
		}

		if err != nil {
			w.err = err
			return w
		}

		r := wazero.NewRuntime(ctx)
		wasiBuilder := r.NewHostModuleBuilder("wasi_snapshot_preview1")
		wasi_snapshot_preview1.NewFunctionExporter().ExportFunctions(wasiBuilder)
		wasiBuilder.NewFunctionBuilder().
			WithFunc(func(exitCode uint32) {
				panic(fmt.Sprintf("exit_%d", exitCode))
			}).
			Export("proc_exit")

		if _, err := wasiBuilder.Instantiate(ctx); err != nil {
			_ = r.Close(ctx)
			w.err = fmt.Errorf("failed to instantiate WASI: %w", err)
			return w
		}

		compiled, err := r.CompileModule(ctx, decompressedBytes)
		if err != nil {
			_ = r.Close(ctx)
			w.err = err
			return w
		}
		w.runtime = r
		w.compiledModule = compiled
	}
	return w
}

func (w *Workflow) Builder() *Workflow {
	return w
}

func (w *Workflow) StartEvent(id ...string) *StartEventBuilder {
	startID := "start"
	if len(id) > 0 {
		startID = id[0]
	}
	w.Nodes = append(w.Nodes, map[string]interface{}{
		"type": "startEvent",
		"id":   startID,
		"name": "Start",
	})
	return &StartEventBuilder{w: w, id: startID}
}

func (w *Workflow) EndEvent(id string, name string) *Workflow {
	w.Nodes = append(w.Nodes, map[string]interface{}{
		"type": "endEvent",
		"id":   id,
		"name": name,
	})
	return w
}

func (w *Workflow) ServiceTask(id string, name string, topic string) *ServiceTaskBuilder {
	w.Nodes = append(w.Nodes, map[string]interface{}{
		"type":  "serviceTask",
		"id":    id,
		"name":  name,
		"topic": topic,
	})
	return &ServiceTaskBuilder{w: w, id: id}
}

func (w *Workflow) AITask(id string, name string) *AITaskBuilder {
	w.Nodes = append(w.Nodes, map[string]interface{}{
		"type": "aiServiceTask",
		"id":   id,
		"name": name,
	})
	return &AITaskBuilder{w: w, id: id}
}

func (w *Workflow) UserTask(id string, name string) *UserTaskBuilder {
	w.Nodes = append(w.Nodes, map[string]interface{}{
		"type": "userTask",
		"id":   id,
		"name": name,
	})
	return &UserTaskBuilder{w: w, id: id}
}

func (w *Workflow) ExclusiveGateway(id string, name string) *ExclusiveGatewayBuilder {
	w.Nodes = append(w.Nodes, map[string]interface{}{
		"type": "exclusiveGateway",
		"id":   id,
		"name": name,
	})
	return &ExclusiveGatewayBuilder{w: w, id: id}
}

func (w *Workflow) ParallelGateway(id string, name string) *ParallelGatewayBuilder {
	w.Nodes = append(w.Nodes, map[string]interface{}{
		"type": "parallelGateway",
		"id":   id,
		"name": name,
	})
	return &ParallelGatewayBuilder{w: w, id: id}
}

func (w *Workflow) EventBasedGateway(id string, name string) *EventBasedGatewayBuilder {
	w.Nodes = append(w.Nodes, map[string]interface{}{
		"type": "eventBasedGateway",
		"id":   id,
		"name": name,
	})
	return &EventBasedGatewayBuilder{w: w, id: id}
}

func (w *Workflow) CallActivity(id string, name string, calledElement string) *CallActivityBuilder {
	w.Nodes = append(w.Nodes, map[string]interface{}{
		"type":          "callActivity",
		"id":            id,
		"name":          name,
		"calledElement": calledElement,
	})
	return &CallActivityBuilder{w: w, id: id}
}

func (w *Workflow) BusinessRuleTask(id string, name string, decisionRef string) *BusinessRuleTaskBuilder {
	w.Nodes = append(w.Nodes, map[string]interface{}{
		"type":        "businessRuleTask",
		"id":          id,
		"name":        name,
		"decisionRef": decisionRef,
	})
	return &BusinessRuleTaskBuilder{w: w, id: id}
}

func (w *Workflow) SequenceFlow(source, target string) *Workflow {
	w.Flows = append(w.Flows, map[string]interface{}{
		"id":        fmt.Sprintf("flow-%s-%s", source, target),
		"source":    source,
		"target":    target,
		"condition": "",
	})
	return w
}

func (w *Workflow) SequenceFlowWithCondition(source, target string, condition string) *Workflow {
	w.Flows = append(w.Flows, map[string]interface{}{
		"id":        fmt.Sprintf("flow-%s-%s", source, target),
		"source":    source,
		"target":    target,
		"condition": condition,
	})
	return w
}

func (w *Workflow) findNode(id string) map[string]interface{} {
	for _, n := range w.Nodes {
		if n["id"] == id {
			return n
		}
	}
	return nil
}

// Branch is a local scope context for conditional branches.
type Branch struct {
	workflow      *Workflow
	gatewayID     string
	currentNodeID string
	isConditional bool
	condition     string
	hasEnded      bool
}

// WhenBuilder facilitates chaining Then() after When() at the workflow level.
type WhenBuilder struct {
	workflow  *Workflow
	gatewayID string
	condition string
}

// ThenBuilder facilitates chaining Otherwise() after Then() at the workflow level.
type ThenBuilder struct {
	workflow  *Workflow
	gatewayID string
}

// WhenBranchBuilder facilitates chaining Then() after When() at the branch level.
type WhenBranchBuilder struct {
	branch    *Branch
	gatewayID string
	condition string
}

// ThenBranchBuilder facilitates chaining Otherwise() after Then() at the branch level.
type ThenBranchBuilder struct {
	branch    *Branch
	gatewayID string
}

func (w *Workflow) connectNode(id string) {
	node := w.findNode(id)
	hasStart := false
	for _, n := range w.Nodes {
		if n["type"] == "startEvent" {
			hasStart = true
			break
		}
	}
	if !hasStart && node != nil && node["type"] != "startEvent" {
		w.StartEvent("start")
		w.SequenceFlow("start", id)
		w.currentNodeID = id
		return
	}

	if len(w.pendingMerges) > 0 {
		for _, sourceID := range w.pendingMerges {
			w.SequenceFlow(sourceID, id)
		}
		w.pendingMerges = nil
	} else if w.currentNodeID != "" && w.currentNodeID != id {
		w.SequenceFlow(w.currentNodeID, id)
	}
	w.currentNodeID = id
}

// Start initiates the workflow sequential path.
func (w *Workflow) Start(id ...string) *Workflow {
	startID := "start"
	if len(id) > 0 {
		startID = id[0]
	}
	w.StartEvent(startID)
	w.connectNode(startID)
	return w
}

// End terminates the main workflow sequential path.
func (w *Workflow) End(id, name string) *Workflow {
	w.EndEvent(id, name)
	w.connectNode(id)
	w.currentNodeID = "" // terminate main path
	return w
}

// User appends a user task and links it sequentially.
func (w *Workflow) User(id, name string, config ...func(t *UserTaskBuilder)) *Workflow {
	builder := w.UserTask(id, name)
	if len(config) > 0 {
		config[0](builder)
	}
	w.connectNode(id)
	return w
}

// Service appends a service task and links it sequentially.
func (w *Workflow) Service(id, name, topic string, config ...func(t *ServiceTaskBuilder)) *Workflow {
	builder := w.ServiceTask(id, name, topic)
	if len(config) > 0 {
		config[0](builder)
	}
	w.connectNode(id)
	return w
}

// AI appends an AI orchestration task and links it sequentially.
func (w *Workflow) AI(id, name string, config ...func(t *AITaskBuilder)) *Workflow {
	builder := w.AITask(id, name)
	if len(config) > 0 {
		config[0](builder)
	}
	w.connectNode(id)
	return w
}

// When defines a conditional branch path starting condition on the main workflow.
func (w *Workflow) When(condition interface{}) *WhenBuilder {
	gwID := fmt.Sprintf("gw_%s_decision", w.currentNodeID)
	w.ExclusiveGateway(gwID, "Decision Gateway")
	w.connectNode(gwID)

	var condStr string
	switch c := condition.(type) {
	case string:
		condStr = c
	case fmt.Stringer:
		condStr = c.String()
	default:
		condStr = fmt.Sprintf("%v", c)
	}

	return &WhenBuilder{
		workflow:  w,
		gatewayID: gwID,
		condition: condStr,
	}
}

// Then defines the branch steps when the condition is met.
func (wb *WhenBuilder) Then(thenFn func(flow *Branch)) *ThenBuilder {
	thenBranch := &Branch{
		workflow:      wb.workflow,
		gatewayID:     wb.gatewayID,
		currentNodeID: wb.gatewayID,
		isConditional: true,
		condition:     wb.condition,
	}

	thenFn(thenBranch)

	if !thenBranch.hasEnded && thenBranch.currentNodeID != wb.gatewayID {
		wb.workflow.pendingMerges = append(wb.workflow.pendingMerges, thenBranch.currentNodeID)
	}

	return &ThenBuilder{
		workflow:  wb.workflow,
		gatewayID: wb.gatewayID,
	}
}

// Otherwise defines the default path on the main workflow when the condition evaluates to false.
func (tb *ThenBuilder) Otherwise(elseFn func(flow *Branch)) *Workflow {
	elseBranch := &Branch{
		workflow:      tb.workflow,
		gatewayID:     tb.gatewayID,
		currentNodeID: tb.gatewayID,
		isConditional: false,
	}

	elseFn(elseBranch)

	if !elseBranch.hasEnded && elseBranch.currentNodeID != tb.gatewayID {
		tb.workflow.pendingMerges = append(tb.workflow.pendingMerges, elseBranch.currentNodeID)
	}

	return tb.workflow
}

func (b *Branch) connectNode(id string) {
	if b.hasEnded {
		return
	}
	if len(b.workflow.pendingMerges) > 0 {
		for _, sourceID := range b.workflow.pendingMerges {
			b.workflow.SequenceFlow(sourceID, id)
		}
		b.workflow.pendingMerges = nil
		b.currentNodeID = id
		return
	}
	if b.currentNodeID == b.gatewayID {
		if b.isConditional {
			b.workflow.SequenceFlowWithCondition(b.gatewayID, id, b.condition)
		} else {
			b.workflow.ExclusiveGateway(b.gatewayID, "Decision Gateway").Default(id)
		}
	} else if b.currentNodeID != "" && b.currentNodeID != id {
		b.workflow.SequenceFlow(b.currentNodeID, id)
	}
	b.currentNodeID = id
}

// User appends a user task inside a branch.
func (b *Branch) User(id, name string, config ...func(t *UserTaskBuilder)) *Branch {
	builder := b.workflow.UserTask(id, name)
	if len(config) > 0 {
		config[0](builder)
	}
	b.connectNode(id)
	return b
}

// Service appends a service task inside a branch.
func (b *Branch) Service(id, name, topic string, config ...func(t *ServiceTaskBuilder)) *Branch {
	builder := b.workflow.ServiceTask(id, name, topic)
	if len(config) > 0 {
		config[0](builder)
	}
	b.connectNode(id)
	return b
}

// AI appends an AI orchestration task inside a branch.
func (b *Branch) AI(id, name string, config ...func(t *AITaskBuilder)) *Branch {
	builder := b.workflow.AITask(id, name)
	if len(config) > 0 {
		config[0](builder)
	}
	b.connectNode(id)
	return b
}

// End terminates the branch.
func (b *Branch) End(id, name string) *Branch {
	b.workflow.EndEvent(id, name)
	b.connectNode(id)
	b.hasEnded = true
	return b
}

// When defines a nested conditional branch path starting condition inside a branch.
func (b *Branch) When(condition interface{}) *WhenBranchBuilder {
	gwID := fmt.Sprintf("gw_%s_decision", b.currentNodeID)
	b.workflow.ExclusiveGateway(gwID, "Decision Gateway")
	b.connectNode(gwID)

	var condStr string
	switch c := condition.(type) {
	case string:
		condStr = c
	case fmt.Stringer:
		condStr = c.String()
	default:
		condStr = fmt.Sprintf("%v", c)
	}

	return &WhenBranchBuilder{
		branch:    b,
		gatewayID: gwID,
		condition: condStr,
	}
}

// Then defines the nested branch steps when the condition is met.
func (wbb *WhenBranchBuilder) Then(thenFn func(sub *Branch)) *ThenBranchBuilder {
	thenBranch := &Branch{
		workflow:      wbb.branch.workflow,
		gatewayID:     wbb.gatewayID,
		currentNodeID: wbb.gatewayID,
		isConditional: true,
		condition:     wbb.condition,
	}

	thenFn(thenBranch)

	if !thenBranch.hasEnded && thenBranch.currentNodeID != wbb.gatewayID {
		wbb.branch.workflow.pendingMerges = append(wbb.branch.workflow.pendingMerges, thenBranch.currentNodeID)
	}

	return &ThenBranchBuilder{
		branch:    wbb.branch,
		gatewayID: wbb.gatewayID,
	}
}

// Otherwise defines the nested default path when the condition evaluates to false.
func (tbb *ThenBranchBuilder) Otherwise(elseFn func(sub *Branch)) *Branch {
	elseBranch := &Branch{
		workflow:      tbb.branch.workflow,
		gatewayID:     tbb.gatewayID,
		currentNodeID: tbb.gatewayID,
		isConditional: false,
	}

	elseFn(elseBranch)

	if !elseBranch.hasEnded && elseBranch.currentNodeID != tbb.gatewayID {
		tbb.branch.workflow.pendingMerges = append(tbb.branch.workflow.pendingMerges, elseBranch.currentNodeID)
	}

	return tbb.branch
}

func decompressWasmIfNeeded(data []byte) ([]byte, error) {
	if len(data) >= 4 && string(data[:4]) == "\x00asm" {
		return data, nil
	}
	// Gzip check: 0x1f 0x8b
	if len(data) >= 2 && data[0] == 0x1f && data[1] == 0x8b {
		zr, err := gzip.NewReader(bytes.NewReader(data))
		if err != nil {
			return nil, fmt.Errorf("failed to initialize gzip reader: %w", err)
		}
		defer zr.Close()
		decompressed, err := io.ReadAll(zr)
		if err != nil {
			return nil, fmt.Errorf("failed to read gzip content: %w", err)
		}
		return decompressed, nil
	}
	// Zip check: 0x50 0x4b 0x03 0x04 ("PK\x03\x04")
	if len(data) >= 4 && data[0] == 0x50 && data[1] == 0x4b && data[2] == 0x03 && data[3] == 0x04 {
		zr, err := zip.NewReader(bytes.NewReader(data), int64(len(data)))
		if err != nil {
			return nil, fmt.Errorf("failed to initialize zip reader: %w", err)
		}
		for _, f := range zr.File {
			if strings.HasSuffix(f.Name, ".wasm") {
				rc, err := f.Open()
				if err != nil {
					return nil, fmt.Errorf("failed to open zip file entry %s: %w", f.Name, err)
				}
				defer rc.Close()
				decompressed, err := io.ReadAll(rc)
				if err != nil {
					return nil, fmt.Errorf("failed to read zip file entry %s: %w", f.Name, err)
				}
				return decompressed, nil
			}
		}
		return nil, errors.New("no .wasm file found inside zip archive")
	}
	// Fallback/Brotli check
	br := brotli.NewReader(bytes.NewReader(data))
	decompressed, err := io.ReadAll(br)
	if err == nil && len(decompressed) >= 4 && string(decompressed[:4]) == "\x00asm" {
		return decompressed, nil
	}
	return nil, errors.New("unsupported or invalid WebAssembly binary format (failed to decompress or identify magic header)")
}

type Expression struct {
	expr string
}

func (e Expression) String() string {
	return fmt.Sprintf("${%s}", e.expr)
}

type Variable struct {
	name string
}

func V(name string) Variable {
	return Variable{name: name}
}

func Var(name string) Variable {
	return Variable{name: name}
}

func (v Variable) Eq(val interface{}) Expression {
	valStr := fmt.Sprintf("%v", val)
	if b, ok := val.(bool); ok {
		if b {
			valStr = "true"
		} else {
			valStr = "false"
		}
	}
	return Expression{expr: fmt.Sprintf("%s == %s", v.name, valStr)}
}

func (v Variable) Neq(val interface{}) Expression {
	valStr := fmt.Sprintf("%v", val)
	if b, ok := val.(bool); ok {
		if b {
			valStr = "true"
		} else {
			valStr = "false"
		}
	}
	return Expression{expr: fmt.Sprintf("%s != %s", v.name, valStr)}
}

func (v Variable) Gt(val interface{}) Expression {
	return Expression{expr: fmt.Sprintf("%s > %v", v.name, val)}
}

func (v Variable) Gte(val interface{}) Expression {
	return Expression{expr: fmt.Sprintf("%s >= %v", v.name, val)}
}

func (v Variable) Lt(val interface{}) Expression {
	return Expression{expr: fmt.Sprintf("%s < %v", v.name, val)}
}

func (v Variable) Lte(val interface{}) Expression {
	return Expression{expr: fmt.Sprintf("%s <= %v", v.name, val)}
}

func (w *Workflow) Close(ctx context.Context) error {
	if w.runtime != nil {
		return w.runtime.Close(ctx)
	}
	return nil
}

func (w *Workflow) WithCompilerBytes(ctx context.Context, wasmBytes []byte) (*Workflow, error) {
	decompressedBytes, err := decompressWasmIfNeeded(wasmBytes)
	if err != nil {
		return nil, err
	}
	r := wazero.NewRuntime(ctx)
	wasiBuilder := r.NewHostModuleBuilder("wasi_snapshot_preview1")
	wasi_snapshot_preview1.NewFunctionExporter().ExportFunctions(wasiBuilder)
	wasiBuilder.NewFunctionBuilder().
		WithFunc(func(exitCode uint32) {
			panic(fmt.Sprintf("exit_%d", exitCode))
		}).
		Export("proc_exit")

	if _, err := wasiBuilder.Instantiate(ctx); err != nil {
		_ = r.Close(ctx)
		return nil, fmt.Errorf("failed to instantiate WASI: %w", err)
	}

	compiled, err := r.CompileModule(ctx, decompressedBytes)
	if err != nil {
		_ = r.Close(ctx)
		return nil, err
	}
	w.runtime = r
	w.compiledModule = compiled
	return w, nil
}

func (w *Workflow) WithCompilerPath(ctx context.Context, path string) (*Workflow, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	return w.WithCompilerBytes(ctx, data)
}

func (w *Workflow) BuildXML(ctx context.Context) (string, error) {
	var r wazero.Runtime
	var compiled wazero.CompiledModule

	if w.runtime != nil && w.compiledModule != nil {
		r = w.runtime
		compiled = w.compiledModule
	} else {
		// Lazy compile default embedded compiler
		decompressedBytes, err := decompressWasmIfNeeded(coreWasm)
		if err != nil {
			return "", err
		}
		r = wazero.NewRuntime(ctx)
		defer r.Close(ctx)

		wasiBuilder := r.NewHostModuleBuilder("wasi_snapshot_preview1")
		wasi_snapshot_preview1.NewFunctionExporter().ExportFunctions(wasiBuilder)
		wasiBuilder.NewFunctionBuilder().
			WithFunc(func(exitCode uint32) {
				panic(fmt.Sprintf("exit_%d", exitCode))
			}).
			Export("proc_exit")

		if _, err := wasiBuilder.Instantiate(ctx); err != nil {
			return "", fmt.Errorf("failed to instantiate WASI: %w", err)
		}

		comp, err := r.CompileModule(ctx, decompressedBytes)
		if err != nil {
			return "", err
		}
		compiled = comp
	}

	config := wazero.NewModuleConfig().WithName("core").WithStartFunctions()
	mod, err := r.InstantiateModule(ctx, compiled, config)
	if err != nil {
		return "", err
	}
	defer mod.Close(ctx)

	_start := mod.ExportedFunction("_start")
	if _start != nil {
		_, startErr := _start.Call(ctx)
		if startErr != nil && !strings.Contains(startErr.Error(), "exit_0") {
			return "", startErr
		}
	}

	allocate := mod.ExportedFunction("allocate")
	deallocate := mod.ExportedFunction("deallocate")
	compileWorkflow := mod.ExportedFunction("compileWorkflow")
	memory := mod.Memory()

	if allocate == nil || deallocate == nil || compileWorkflow == nil || memory == nil {
		return "", errors.New("missing expected wasm exports")
	}

	astBytes, err := json.Marshal(w)
	if err != nil {
		return "", err
	}

	results, err := allocate.Call(ctx, uint64(len(astBytes)))
	if err != nil {
		return "", err
	}
	inputPtr := results[0]

	if !memory.Write(uint32(inputPtr), astBytes) {
		return "", errors.New("failed to write AST to wasm memory")
	}

	res, err := compileWorkflow.Call(ctx, inputPtr, uint64(len(astBytes)))
	if err != nil {
		return "", err
	}
	packedResult := res[0]

	resultPtr := uint32(packedResult >> 32)
	resultSize := uint32(packedResult & 0xffffffff)

	resultBytes, ok := memory.Read(resultPtr, resultSize)
	if !ok {
		return "", errors.New("failed to read compile result from wasm memory")
	}

	_, _ = deallocate.Call(ctx, inputPtr, uint64(len(astBytes)))
	_, _ = deallocate.Call(ctx, uint64(resultPtr), uint64(resultSize))

	var output struct {
		XML   string `json:"xml"`
		Error string `json:"error"`
	}
	if err := json.Unmarshal(resultBytes, &output); err != nil {
		return "", err
	}

	if output.Error != "" {
		return "", fmt.Errorf("wasm compilation error: %s", output.Error)
	}

	return output.XML, nil
}

func (w *Workflow) BuildXMLWithBytes(ctx context.Context, wasmBytes []byte) (string, error) {
	tempWf := &Workflow{
		ID:    w.ID,
		Name:  w.Name,
		Nodes: w.Nodes,
		Flows: w.Flows,
	}
	_, err := tempWf.WithCompilerBytes(ctx, wasmBytes)
	if err != nil {
		return "", err
	}
	defer tempWf.Close(ctx)
	return tempWf.BuildXML(ctx)
}

func (w *Workflow) BuildXMLWithPath(ctx context.Context, path string) (string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	return w.BuildXMLWithBytes(ctx, data)
}

// Builders

type StartEventBuilder struct {
	w  *Workflow
	id string
}

func (b *StartEventBuilder) Next(targetID string) *Workflow {
	b.w.SequenceFlow(b.id, targetID)
	return b.w
}

func (b *StartEventBuilder) ConnectTo(targetID string) *Workflow {
	return b.Next(targetID)
}

func (b *StartEventBuilder) Builder() *Workflow {
	return b.w
}

type ServiceTaskBuilder struct {
	w  *Workflow
	id string
}

func (b *ServiceTaskBuilder) WasmPath(path string) *ServiceTaskBuilder {
	if n := b.w.findNode(b.id); n != nil {
		n["wasmPath"] = path
	}
	return b
}

func (b *ServiceTaskBuilder) Wasm(path string) *ServiceTaskBuilder {
	return b.WasmPath(path)
}

func (b *ServiceTaskBuilder) Next(targetID string) *Workflow {
	b.w.SequenceFlow(b.id, targetID)
	return b.w
}

func (b *ServiceTaskBuilder) ConnectTo(targetID string) *Workflow {
	return b.Next(targetID)
}

func (b *ServiceTaskBuilder) Builder() *Workflow {
	return b.w
}

type AITaskBuilder struct {
	w  *Workflow
	id string
}

func (b *AITaskBuilder) Provider(p string) *AITaskBuilder {
	if n := b.w.findNode(b.id); n != nil {
		n["provider"] = p
	}
	return b
}

func (b *AITaskBuilder) Model(m string) *AITaskBuilder {
	if n := b.w.findNode(b.id); n != nil {
		n["model"] = m
	}
	return b
}

func (b *AITaskBuilder) Prompt(p string) *AITaskBuilder {
	if n := b.w.findNode(b.id); n != nil {
		n["prompt"] = p
	}
	return b
}

func (b *AITaskBuilder) SystemInstruction(si string) *AITaskBuilder {
	if n := b.w.findNode(b.id); n != nil {
		n["systemInstruction"] = si
	}
	return b
}

func (b *AITaskBuilder) ResponseSchema(rs string) *AITaskBuilder {
	if n := b.w.findNode(b.id); n != nil {
		n["responseSchema"] = rs
	}
	return b
}

func (b *AITaskBuilder) Temperature(t float64) *AITaskBuilder {
	if n := b.w.findNode(b.id); n != nil {
		n["temperature"] = t
	}
	return b
}

func (b *AITaskBuilder) ResultVar(rv string) *AITaskBuilder {
	if n := b.w.findNode(b.id); n != nil {
		n["resultVar"] = rv
	}
	return b
}

func (b *AITaskBuilder) Next(targetID string) *Workflow {
	b.w.SequenceFlow(b.id, targetID)
	return b.w
}

func (b *AITaskBuilder) ConnectTo(targetID string) *Workflow {
	return b.Next(targetID)
}

func (b *AITaskBuilder) Builder() *Workflow {
	return b.w
}

type UserTaskBuilder struct {
	w  *Workflow
	id string
}

func (b *UserTaskBuilder) Assignee(a string) *UserTaskBuilder {
	if n := b.w.findNode(b.id); n != nil {
		n["assignee"] = a
	}
	return b
}

func (b *UserTaskBuilder) CandidateGroups(cg string) *UserTaskBuilder {
	if n := b.w.findNode(b.id); n != nil {
		n["candidateGroups"] = cg
	}
	return b
}

func (b *UserTaskBuilder) DueDate(d string) *UserTaskBuilder {
	if n := b.w.findNode(b.id); n != nil {
		n["dueDate"] = d
	}
	return b
}

func (b *UserTaskBuilder) Next(targetID string) *Workflow {
	b.w.SequenceFlow(b.id, targetID)
	return b.w
}

func (b *UserTaskBuilder) ConnectTo(targetID string) *Workflow {
	return b.Next(targetID)
}

func (b *UserTaskBuilder) Builder() *Workflow {
	return b.w
}

type ExclusiveGatewayBuilder struct {
	w  *Workflow
	id string
}

func (b *ExclusiveGatewayBuilder) Next(targetID string) *Workflow {
	b.w.SequenceFlow(b.id, targetID)
	return b.w
}

func (b *ExclusiveGatewayBuilder) NextWithCondition(targetID string, condition string) *Workflow {
	b.w.SequenceFlowWithCondition(b.id, targetID, condition)
	return b.w
}

func (b *ExclusiveGatewayBuilder) Condition(targetID string, cond string) *ExclusiveGatewayBuilder {
	b.w.SequenceFlowWithCondition(b.id, targetID, cond)
	return b
}

func (b *ExclusiveGatewayBuilder) Default(targetID string) *ExclusiveGatewayBuilder {
	b.w.SequenceFlow(b.id, targetID)
	return b
}

func (b *ExclusiveGatewayBuilder) ConnectTo(targetID string) *Workflow {
	return b.Next(targetID)
}

func (b *ExclusiveGatewayBuilder) Builder() *Workflow {
	return b.w
}

type ParallelGatewayBuilder struct {
	w  *Workflow
	id string
}

func (b *ParallelGatewayBuilder) Next(targetID string) *Workflow {
	b.w.SequenceFlow(b.id, targetID)
	return b.w
}

func (b *ParallelGatewayBuilder) ConnectTo(targetID string) *Workflow {
	return b.Next(targetID)
}

func (b *ParallelGatewayBuilder) Builder() *Workflow {
	return b.w
}

type EventBasedGatewayBuilder struct {
	w  *Workflow
	id string
}

func (b *EventBasedGatewayBuilder) Next(targetID string) *Workflow {
	b.w.SequenceFlow(b.id, targetID)
	return b.w
}

func (b *EventBasedGatewayBuilder) ConnectTo(targetID string) *Workflow {
	return b.Next(targetID)
}

func (b *EventBasedGatewayBuilder) Builder() *Workflow {
	return b.w
}

type CallActivityBuilder struct {
	w  *Workflow
	id string
}

func (b *CallActivityBuilder) InVal(source, target string) *CallActivityBuilder {
	if n := b.w.findNode(b.id); n != nil {
		var inVars []interface{}
		if val, exists := n["inVariables"]; exists {
			if list, ok := val.([]interface{}); ok {
				inVars = list
			}
		}
		inVars = append(inVars, map[string]interface{}{
			"source":    source,
			"target":    target,
			"variables": "",
			"local":     false,
		})
		n["inVariables"] = inVars
	}
	return b
}

func (b *CallActivityBuilder) InAll() *CallActivityBuilder {
	if n := b.w.findNode(b.id); n != nil {
		var inVars []interface{}
		if val, exists := n["inVariables"]; exists {
			if list, ok := val.([]interface{}); ok {
				inVars = list
			}
		}
		inVars = append(inVars, map[string]interface{}{
			"source":    "",
			"target":    "",
			"variables": "all",
			"local":     false,
		})
		n["inVariables"] = inVars
	}
	return b
}

func (b *CallActivityBuilder) OutVal(source, target string) *CallActivityBuilder {
	if n := b.w.findNode(b.id); n != nil {
		var outVars []interface{}
		if val, exists := n["outVariables"]; exists {
			if list, ok := val.([]interface{}); ok {
				outVars = list
			}
		}
		outVars = append(outVars, map[string]interface{}{
			"source":    source,
			"target":    target,
			"variables": "",
		})
		n["outVariables"] = outVars
	}
	return b
}

func (b *CallActivityBuilder) OutAll() *CallActivityBuilder {
	if n := b.w.findNode(b.id); n != nil {
		var outVars []interface{}
		if val, exists := n["outVariables"]; exists {
			if list, ok := val.([]interface{}); ok {
				outVars = list
			}
		}
		outVars = append(outVars, map[string]interface{}{
			"source":    "",
			"target":    "",
			"variables": "all",
		})
		n["outVariables"] = outVars
	}
	return b
}

func (b *CallActivityBuilder) Next(targetID string) *Workflow {
	b.w.SequenceFlow(b.id, targetID)
	return b.w
}

func (b *CallActivityBuilder) ConnectTo(targetID string) *Workflow {
	return b.Next(targetID)
}

func (b *CallActivityBuilder) Builder() *Workflow {
	return b.w
}

type BusinessRuleTaskBuilder struct {
	w  *Workflow
	id string
}

func (b *BusinessRuleTaskBuilder) MapDecisionResult(mapDecisionResult string) *BusinessRuleTaskBuilder {
	if n := b.w.findNode(b.id); n != nil {
		n["mapDecisionResult"] = mapDecisionResult
	}
	return b
}

func (b *BusinessRuleTaskBuilder) ResultVariable(resultVar string) *BusinessRuleTaskBuilder {
	if n := b.w.findNode(b.id); n != nil {
		n["resultVar"] = resultVar
	}
	return b
}

func (b *BusinessRuleTaskBuilder) HitPolicy(hitPolicy string) *BusinessRuleTaskBuilder {
	if n := b.w.findNode(b.id); n != nil {
		n["hitPolicy"] = hitPolicy
	}
	return b
}

func (b *BusinessRuleTaskBuilder) Input(expression string, typeStr string) *BusinessRuleTaskBuilder {
	if n := b.w.findNode(b.id); n != nil {
		var inputs []interface{}
		if val, exists := n["inputs"]; exists {
			if list, ok := val.([]interface{}); ok {
				inputs = list
			}
		}
		inputs = append(inputs, map[string]interface{}{
			"expression": expression,
			"type":       typeStr,
		})
		n["inputs"] = inputs
	}
	return b
}

func (b *BusinessRuleTaskBuilder) Output(name string, typeStr string) *BusinessRuleTaskBuilder {
	if n := b.w.findNode(b.id); n != nil {
		var outputs []interface{}
		if val, exists := n["outputs"]; exists {
			if list, ok := val.([]interface{}); ok {
				outputs = list
			}
		}
		outputs = append(outputs, map[string]interface{}{
			"name": name,
			"type": typeStr,
		})
		n["outputs"] = outputs
	}
	return b
}

func (b *BusinessRuleTaskBuilder) Rule() *DMNRuleBuilder {
	return &DMNRuleBuilder{
		taskBuilder: b,
		inputs:      make(map[string]string),
		outputs:     make(map[string]string),
	}
}

func (b *BusinessRuleTaskBuilder) Next(targetID string) *Workflow {
	b.w.SequenceFlow(b.id, targetID)
	return b.w
}

func (b *BusinessRuleTaskBuilder) ConnectTo(targetID string) *Workflow {
	return b.Next(targetID)
}

func (b *BusinessRuleTaskBuilder) Builder() *Workflow {
	return b.w
}

type DMNRuleBuilder struct {
	taskBuilder *BusinessRuleTaskBuilder
	inputs      map[string]string
	outputs     map[string]string
}

func (b *DMNRuleBuilder) When(expression string, val interface{}) *DMNRuleBuilder {
	b.inputs[expression] = formatDMNValue(val)
	return b
}

func (b *DMNRuleBuilder) Then(name string, val interface{}) *DMNRuleBuilder {
	b.outputs[name] = formatDMNValue(val)
	return b
}

func (b *DMNRuleBuilder) commit() {
	node := b.taskBuilder.w.findNode(b.taskBuilder.id)
	if node == nil {
		return
	}

	var rules []interface{}
	if val, exists := node["rules"]; exists {
		if list, ok := val.([]interface{}); ok {
			rules = list
		}
	}

	var inputsList []interface{}
	if val, exists := node["inputs"]; exists {
		if list, ok := val.([]interface{}); ok {
			inputsList = list
		}
	}

	var outputsList []interface{}
	if val, exists := node["outputs"]; exists {
		if list, ok := val.([]interface{}); ok {
			outputsList = list
		}
	}

	var ruleInputs []string
	for _, inVal := range inputsList {
		if inMap, ok := inVal.(map[string]interface{}); ok {
			expr, _ := inMap["expression"].(string)
			if dmnVal, ok := b.inputs[expr]; ok {
				ruleInputs = append(ruleInputs, dmnVal)
			} else {
				ruleInputs = append(ruleInputs, "-")
			}
		}
	}

	var ruleOutputs []string
	for _, outVal := range outputsList {
		if outMap, ok := outVal.(map[string]interface{}); ok {
			name, _ := outMap["name"].(string)
			if dmnVal, ok := b.outputs[name]; ok {
				ruleOutputs = append(ruleOutputs, dmnVal)
			} else {
				ruleOutputs = append(ruleOutputs, "-")
			}
		}
	}

	r := map[string]interface{}{
		"inputs":  ruleInputs,
		"outputs": ruleOutputs,
	}
	rules = append(rules, r)
	node["rules"] = rules
}

func (b *DMNRuleBuilder) Rule() *DMNRuleBuilder {
	b.commit()
	return b.taskBuilder.Rule()
}

func (b *DMNRuleBuilder) Next(targetID string) *Workflow {
	b.commit()
	return b.taskBuilder.Next(targetID)
}

func (b *DMNRuleBuilder) ConnectTo(targetID string) *Workflow {
	return b.Next(targetID)
}

func (b *DMNRuleBuilder) Builder() *Workflow {
	b.commit()
	return b.taskBuilder.Builder()
}

func (b *DMNRuleBuilder) MapDecisionResult(mapDecisionResult string) *BusinessRuleTaskBuilder {
	b.commit()
	return b.taskBuilder.MapDecisionResult(mapDecisionResult)
}

func (b *DMNRuleBuilder) ResultVariable(resultVar string) *BusinessRuleTaskBuilder {
	b.commit()
	return b.taskBuilder.ResultVariable(resultVar)
}

func formatDMNValue(val interface{}) string {
	if val == nil {
		return "-"
	}
	switch v := val.(type) {
	case string:
		s := strings.TrimSpace(v)
		for _, op := range []string{"<=", ">=", "!=", "<>", "<", ">"} {
			if strings.HasPrefix(s, op) {
				return s
			}
		}
		if s == "true" || s == "false" {
			return s
		}
		if _, err := strconv.ParseFloat(s, 64); err == nil {
			return s
		}
		return fmt.Sprintf(`"%s"`, s)
	default:
		return fmt.Sprintf("%v", v)
	}
}
