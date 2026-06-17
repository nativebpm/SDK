import Foundation

#if canImport(AnyCodable)
import AnyCodable
#endif

public class Expression {
    public let expr: String
    public init(expr: String) {
        self.expr = expr
    }
}

public class Variable {
    public let name: String
    public init(name: String) {
        self.name = name
    }
    
    public func eq(_ val: Any) -> Expression {
        let valStr: String
        if let b = val as? Bool {
            valStr = b ? "true" : "false"
        } else {
            valStr = "\(val)"
        }
        return Expression(expr: "\(name) == \(valStr)")
    }
    
    public func neq(_ val: Any) -> Expression {
        let valStr: String
        if let b = val as? Bool {
            valStr = b ? "true" : "false"
        } else {
            valStr = "\(val)"
        }
        return Expression(expr: "\(name) != \(valStr)")
    }
    
    public func gt(_ val: Any) -> Expression {
        return Expression(expr: "\(name) > \(val)")
    }
    
    public func gte(_ val: Any) -> Expression {
        return Expression(expr: "\(name) >= \(val)")
    }
    
    public func lt(_ val: Any) -> Expression {
        return Expression(expr: "\(name) < \(val)")
    }
    
    public func lte(_ val: Any) -> Expression {
        return Expression(expr: "\(name) <= \(val)")
    }
}

public func V(_ name: String) -> Variable {
    return Variable(name: name)
}

public func Var(_ name: String) -> Variable {
    return Variable(name: name)
}

public class Branch {
    public let workflow: Workflow
    public let gatewayID: String
    public var currentNodeID: String
    public let isConditional: Bool
    public let condition: String
    public var hasEnded: Bool = false
    
    public init(workflow: Workflow, gatewayID: String, currentNodeID: String, isConditional: Bool, condition: String) {
        self.workflow = workflow
        self.gatewayID = gatewayID
        self.currentNodeID = currentNodeID
        self.isConditional = isConditional
        self.condition = condition
    }
    
    private func connectNode(_ id: String) {
        if hasEnded { return }
        
        if !workflow.pendingMerges.isEmpty {
            for sourceID in workflow.pendingMerges {
                workflow.sequenceFlow(source: sourceID, target: id)
            }
            workflow.pendingMerges.removeAll()
            currentNodeID = id
            return
        }
        
        if currentNodeID == gatewayID {
            if isConditional {
                workflow.sequenceFlowWithCondition(source: gatewayID, target: id, condition: condition)
            } else {
                workflow.sequenceFlow(source: gatewayID, target: id)
            }
        } else if !currentNodeID.isEmpty && currentNodeID != id {
            workflow.sequenceFlow(source: currentNodeID, target: id)
        }
        currentNodeID = id
    }
    
    @discardableResult
    public func user(_ id: String, name: String, options: [String: Any] = [:]) -> Self {
        var node: [String: Any] = [
            "type": "userTask",
            "id": id,
            "name": name
        ]
        for (k, v) in options {
            node[k] = v
        }
        workflow.nodes.append(node)
        connectNode(id)
        return self
    }
    
    @discardableResult
    public func service(_ id: String, name: String, topic: String, options: [String: Any] = [:]) -> Self {
        var node: [String: Any] = [
            "type": "serviceTask",
            "id": id,
            "name": name,
            "topic": topic
        ]
        for (k, v) in options {
            node[k] = v
        }
        workflow.nodes.append(node)
        connectNode(id)
        return self
    }
    
    @discardableResult
    public func ai(_ id: String, name: String, options: [String: Any] = [:]) -> Self {
        var node: [String: Any] = [
            "type": "aiServiceTask",
            "id": id,
            "name": name
        ]
        for (k, v) in options {
            node[k] = v
        }
        workflow.nodes.append(node)
        connectNode(id)
        return self
    }
    
    @discardableResult
    public func end(_ id: String, name: String) -> Self {
        workflow.endEvent(id: id, name: name)
        connectNode(id)
        hasEnded = true
        return self
    }
}

public class WhenBuilder {
    public let workflow: Workflow
    public let gatewayID: String
    public let condition: String
    
    public init(workflow: Workflow, gatewayID: String, condition: String) {
        self.workflow = workflow
        self.gatewayID = gatewayID
        self.condition = condition
    }
    
    public func then(_ thenFn: (Branch) -> Void) -> ThenBuilder {
        let thenBranch = Branch(workflow: workflow, gatewayID: gatewayID, currentNodeID: gatewayID, isConditional: true, condition: condition)
        thenFn(thenBranch)
        if !thenBranch.hasEnded && thenBranch.currentNodeID != gatewayID {
            workflow.pendingMerges.append(thenBranch.currentNodeID)
        }
        return ThenBuilder(workflow: workflow, gatewayID: gatewayID)
    }
}

public class ThenBuilder {
    public let workflow: Workflow
    public let gatewayID: String
    
    public init(workflow: Workflow, gatewayID: String) {
        self.workflow = workflow
        self.gatewayID = gatewayID
    }
    
    @discardableResult
    public func `else`(_ elseFn: (Branch) -> Void) -> Workflow {
        let elseBranch = Branch(workflow: workflow, gatewayID: gatewayID, currentNodeID: gatewayID, isConditional: false, condition: "")
        elseFn(elseBranch)
        if !elseBranch.hasEnded && elseBranch.currentNodeID != gatewayID {
            workflow.pendingMerges.append(elseBranch.currentNodeID)
        }
        return workflow
    }
}

public class Workflow {
    public let id: String
    public let name: String
    public var nodes: [[String: Any]] = []
    public var flows: [[String: Any]] = []
    
    public var currentNodeID: String = ""
    public var pendingMerges: [String] = []
    
    public init(id: String, name: String) {
        self.id = id
        self.name = name
    }
    
    public func startEvent(id: String = "start") {
        nodes.append([
            "type": "startEvent",
            "id": id,
            "name": "Start"
        ])
        currentNodeID = id
    }
    
    public func endEvent(id: String, name: String) {
        nodes.append([
            "type": "endEvent",
            "id": id,
            "name": name
        ])
    }
    
    public func sequenceFlow(source: String, target: String) {
        flows.append([
            "id": "flow-\(source)-\(target)",
            "source": source,
            "target": target,
            "condition": ""
        ])
    }
    
    public func sequenceFlowWithCondition(source: String, target: String, condition: String) {
        flows.append([
            "id": "flow-\(source)-\(target)",
            "source": source,
            "target": target,
            "condition": condition
        ])
    }
    
    private func connectNode(_ id: String) {
        let hasStart = nodes.contains { ($0["type"] as? String) == "startEvent" }
        if !hasStart && id != "start" {
            startEvent(id: "start")
            sequenceFlow(source: "start", target: id)
            currentNodeID = id
            return
        }
        
        if !pendingMerges.isEmpty {
            for sourceID in pendingMerges {
                sequenceFlow(source: sourceID, target: id)
            }
            pendingMerges.removeAll()
        } else if !currentNodeID.isEmpty && currentNodeID != id {
            sequenceFlow(source: currentNodeID, target: id)
        }
        currentNodeID = id
    }
    
    @discardableResult
    public func start(id: String = "start") -> Self {
        startEvent(id: id)
        connectNode(id)
        return self
    }
    
    @discardableResult
    public func user(_ id: String, name: String, options: [String: Any] = [:]) -> Self {
        var node: [String: Any] = [
            "type": "userTask",
            "id": id,
            "name": name
        ]
        for (k, v) in options {
            node[k] = v
        }
        nodes.append(node)
        connectNode(id)
        return self
    }
    
    @discardableResult
    public func service(_ id: String, name: String, topic: String, options: [String: Any] = [:]) -> Self {
        var node: [String: Any] = [
            "type": "serviceTask",
            "id": id,
            "name": name,
            "topic": topic
        ]
        for (k, v) in options {
            node[k] = v
        }
        nodes.append(node)
        connectNode(id)
        return self
    }
    
    @discardableResult
    public func ai(_ id: String, name: String, options: [String: Any] = [:]) -> Self {
        var node: [String: Any] = [
            "type": "aiServiceTask",
            "id": id,
            "name": name
        ]
        for (k, v) in options {
            node[k] = v
        }
        nodes.append(node)
        connectNode(id)
        return self
    }
    
    @discardableResult
    public func end(_ id: String, name: String) -> Self {
        endEvent(id: id, name: name)
        connectNode(id)
        currentNodeID = ""
        return self
    }
    
    public func when(_ condition: Any) -> WhenBuilder {
        let gwID = "gw_\(currentNodeID)_decision"
        nodes.append([
            "type": "exclusiveGateway",
            "id": gwID,
            "name": "Decision Gateway"
        ])
        connectNode(gwID)
        
        let condStr: String
        if let expr = condition as? Expression {
            condStr = expr.expr
        } else {
            condStr = "\(condition)"
        }
        return WhenBuilder(workflow: self, gatewayID: gwID, condition: condStr)
    }
    
    public func toJSONData() -> Data? {
        var finalNodes = nodes
        var finalFlows = flows
        
        var sourceIDs = Set<String>()
        for flow in flows {
            if let src = flow["source"] as? String {
                sourceIDs.insert(src)
            }
        }
        
        for node in nodes {
            guard let type = node["type"] as? String, let nodeID = node["id"] as? String else { continue }
            if type == "endEvent" || type == "startEvent" { continue }
            
            if !sourceIDs.contains(nodeID) {
                let endID = "end_\(nodeID)"
                finalNodes.append([
                    "type": "endEvent",
                    "id": endID,
                    "name": "Process Finished"
                ])
                finalFlows.append([
                    "id": "flow-\(nodeID)-\(endID)",
                    "source": nodeID,
                    "target": endID,
                    "condition": ""
                ])
            }
        }
        
        let dict: [String: Any] = [
            "id": id,
            "name": name,
            "nodes": finalNodes,
            "flows": finalFlows
        ]
        
        return try? JSONSerialization.data(withJSONObject: dict, options: [])
    }
}
