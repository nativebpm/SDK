package nativebpm

import (
	"encoding/json"
	"fmt"
	"strings"
)

type M map[string]interface{}

type Workflow struct {
	ID             string                   `json:"id"`
	Name           string                   `json:"name"`
	Nodes          []map[string]interface{} `json:"nodes"`
	Flows          []map[string]interface{} `json:"flows"`
	err            error
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

func NewWorkflow(id, name string) *Workflow {
	w := &Workflow{
		ID:    id,
		Name:  name,
		Nodes: make([]map[string]interface{}, 0),
		Flows: make([]map[string]interface{}, 0),
	}
	return w
}

func (w *Workflow) Builder() *Workflow {
	return w
}

func (w *Workflow) StartEvent(id ...string) *Workflow {
	startID := "start"
	if len(id) > 0 {
		startID = id[0]
	}
	w.Nodes = append(w.Nodes, map[string]interface{}{
		"type": "startEvent",
		"id":   startID,
		"name": "Start",
	})
	w.currentNodeID = startID
	return w
}

func (w *Workflow) EndEvent(id string, name string) *Workflow {
	w.Nodes = append(w.Nodes, map[string]interface{}{
		"type": "endEvent",
		"id":   id,
		"name": name,
	})
	return w
}

func capitalize(s string) string {
	if len(s) == 0 {
		return s
	}
	return strings.ToUpper(s[:1]) + s[1:]
}

func toCamelCase(s string) string {
	if s == "wasm" {
		return "wasmPath"
	}
	if s == "result_variable" {
		return "resultVar"
	}
	if !strings.Contains(s, "_") {
		return s
	}
	parts := strings.Split(s, "_")
	for i := 1; i < len(parts); i++ {
		parts[i] = capitalize(parts[i])
	}
	return strings.Join(parts, "")
}

func populateNodeProperties(node map[string]interface{}, opts []map[string]interface{}) {
	for _, opt := range opts {
		for k, v := range opt {
			key := toCamelCase(k)
			node[key] = v
		}
	}
}

func (w *Workflow) ServiceTask(id string, name string, topic string, options ...map[string]interface{}) *Workflow {
	node := map[string]interface{}{
		"type":  "serviceTask",
		"id":    id,
		"name":  name,
		"topic": topic,
	}
	populateNodeProperties(node, options)
	w.Nodes = append(w.Nodes, node)
	return w
}

func (w *Workflow) AITask(id string, name string, options ...map[string]interface{}) *Workflow {
	node := map[string]interface{}{
		"type": "aiServiceTask",
		"id":   id,
		"name": name,
	}
	populateNodeProperties(node, options)
	w.Nodes = append(w.Nodes, node)
	return w
}

func (w *Workflow) UserTask(id string, name string, options ...map[string]interface{}) *Workflow {
	node := map[string]interface{}{
		"type": "userTask",
		"id":   id,
		"name": name,
	}
	populateNodeProperties(node, options)
	w.Nodes = append(w.Nodes, node)
	return w
}

func (w *Workflow) ExclusiveGateway(id string, name string) *Workflow {
	w.Nodes = append(w.Nodes, map[string]interface{}{
		"type": "exclusiveGateway",
		"id":   id,
		"name": name,
	})
	return w
}

func (w *Workflow) ParallelGateway(id string, name string) *Workflow {
	w.Nodes = append(w.Nodes, map[string]interface{}{
		"type": "parallelGateway",
		"id":   id,
		"name": name,
	})
	return w
}

func (w *Workflow) EventBasedGateway(id string, name string) *Workflow {
	w.Nodes = append(w.Nodes, map[string]interface{}{
		"type": "eventBasedGateway",
		"id":   id,
		"name": name,
	})
	return w
}

func (w *Workflow) CallActivity(id string, name string, calledElement string, options ...map[string]interface{}) *Workflow {
	node := map[string]interface{}{
		"type":          "callActivity",
		"id":            id,
		"name":          name,
		"calledElement": calledElement,
	}
	populateNodeProperties(node, options)
	w.Nodes = append(w.Nodes, node)
	return w
}

func (w *Workflow) BusinessRuleTask(id string, name string, decisionRef string, options ...map[string]interface{}) *Workflow {
	node := map[string]interface{}{
		"type":        "businessRuleTask",
		"id":          id,
		"name":        name,
		"decisionRef": decisionRef,
	}
	populateNodeProperties(node, options)
	w.Nodes = append(w.Nodes, node)
	return w
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
func (w *Workflow) User(id, name string, options ...map[string]interface{}) *Workflow {
	w.UserTask(id, name, options...)
	w.connectNode(id)
	return w
}

// Service appends a service task and links it sequentially.
func (w *Workflow) Service(id, name, topic string, options ...map[string]interface{}) *Workflow {
	w.ServiceTask(id, name, topic, options...)
	w.connectNode(id)
	return w
}

// AI appends an AI orchestration task and links it sequentially.
func (w *Workflow) AI(id, name string, options ...map[string]interface{}) *Workflow {
	w.AITask(id, name, options...)
	w.connectNode(id)
	return w
}

func (w *Workflow) Call(id, name, calledElement string, options ...map[string]interface{}) *Workflow {
	w.CallActivity(id, name, calledElement, options...)
	w.connectNode(id)
	return w
}

func (w *Workflow) BusinessRule(id, name, decisionRef string, options ...map[string]interface{}) *Workflow {
	w.BusinessRuleTask(id, name, decisionRef, options...)
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

// Else defines the default path on the main workflow when the condition evaluates to false.
func (tb *ThenBuilder) Else(elseFn func(flow *Branch)) *Workflow {
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

// Otherwise defines the default path on the main workflow when the condition evaluates to false.
func (tb *ThenBuilder) Otherwise(elseFn func(flow *Branch)) *Workflow {
	return tb.Else(elseFn)
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
			// Connect default sequence flow
			b.workflow.SequenceFlow(b.gatewayID, id)
		}
	} else if b.currentNodeID != "" && b.currentNodeID != id {
		b.workflow.SequenceFlow(b.currentNodeID, id)
	}
	b.currentNodeID = id
}

// User appends a user task inside a branch.
func (b *Branch) User(id, name string, options ...map[string]interface{}) *Branch {
	b.workflow.UserTask(id, name, options...)
	b.connectNode(id)
	return b
}

// Service appends a service task inside a branch.
func (b *Branch) Service(id, name, topic string, options ...map[string]interface{}) *Branch {
	b.workflow.ServiceTask(id, name, topic, options...)
	b.connectNode(id)
	return b
}

// AI appends an AI orchestration task inside a branch.
func (b *Branch) AI(id, name string, options ...map[string]interface{}) *Branch {
	b.workflow.AITask(id, name, options...)
	b.connectNode(id)
	return b
}

func (b *Branch) Call(id, name, calledElement string, options ...map[string]interface{}) *Branch {
	b.workflow.CallActivity(id, name, calledElement, options...)
	b.connectNode(id)
	return b
}

func (b *Branch) BusinessRule(id, name, decisionRef string, options ...map[string]interface{}) *Branch {
	b.workflow.BusinessRuleTask(id, name, decisionRef, options...)
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

// Else defines the nested default path when the condition evaluates to false.
func (tbb *ThenBranchBuilder) Else(elseFn func(sub *Branch)) *Branch {
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

// Otherwise defines the nested default path when the condition evaluates to false.
func (tbb *ThenBranchBuilder) Otherwise(elseFn func(sub *Branch)) *Branch {
	return tbb.Else(elseFn)
}



type Expression struct {
	expr string
}

func (e Expression) String() string {
	return e.expr
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

func (w *Workflow) ToJSON() ([]byte, error) {
	return json.Marshal(w)
}

