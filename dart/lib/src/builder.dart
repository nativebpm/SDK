class Expression {
  final String expr;
  Expression(this.expr);

  @override
  String toString() => expr;
}

class Variable {
  final String name;
  Variable(this.name);

  Expression eq(dynamic val) {
    final valStr = val is bool ? (val ? 'true' : 'false') : '$val';
    return Expression('$name == $valStr');
  }

  Expression neq(dynamic val) {
    final valStr = val is bool ? (val ? 'true' : 'false') : '$val';
    return Expression('$name != $valStr');
  }

  Expression gt(dynamic val) => Expression('$name > $val');
  Expression gte(dynamic val) => Expression('$name >= $val');
  Expression lt(dynamic val) => Expression('$name < $val');
  Expression lte(dynamic val) => Expression('$name <= $val');
}

Variable V(String name) => Variable(name);
Variable Var(String name) => Variable(name);

class Branch {
  final Workflow workflow;
  final String gatewayID;
  String currentNodeID;
  final bool isConditional;
  final String condition;
  bool hasEnded = false;

  Branch({
    required this.workflow,
    required this.gatewayID,
    required this.currentNodeID,
    required this.isConditional,
    required this.condition,
  });

  void _connectNode(String id, bool isBackEdge) {
    if (hasEnded) return;

    if (workflow.pendingMerges.isNotEmpty) {
      for (final sourceID in workflow.pendingMerges) {
        workflow._sequenceFlow(sourceID, id);
      }
      workflow.pendingMerges.clear();
      currentNodeID = id;
      if (isBackEdge) {
        hasEnded = true;
      }
      return;
    }

    if (currentNodeID == gatewayID) {
      if (isConditional) {
        workflow._sequenceFlowWithCondition(gatewayID, id, condition);
      } else {
        workflow._sequenceFlow(gatewayID, id);
      }
    } else if (currentNodeID.isNotEmpty && currentNodeID != id) {
      workflow._sequenceFlow(currentNodeID, id);
    }
    currentNodeID = id;
    if (isBackEdge) {
      hasEnded = true;
    }
  }

  Branch user(String id, String name, [Map<String, dynamic>? options]) {
    final isBackEdge = workflow._hasNode(id);
    if (!isBackEdge) {
      final node = <String, dynamic>{
        'type': 'userTask',
        'id': id,
        'name': name,
      };
      if (options != null) {
        node.addAll(options);
      }
      workflow.nodes.add(node);
    }
    _connectNode(id, isBackEdge);
    return this;
  }

  Branch service(String id, String name, String topic, [Map<String, dynamic>? options]) {
    final isBackEdge = workflow._hasNode(id);
    if (!isBackEdge) {
      final node = <String, dynamic>{
        'type': 'serviceTask',
        'id': id,
        'name': name,
        'topic': topic,
      };
      if (options != null) {
        node.addAll(options);
      }
      workflow.nodes.add(node);
    }
    _connectNode(id, isBackEdge);
    return this;
  }

  Branch ai(String id, String name, [Map<String, dynamic>? options]) {
    final isBackEdge = workflow._hasNode(id);
    if (!isBackEdge) {
      final node = <String, dynamic>{
        'type': 'aiServiceTask',
        'id': id,
        'name': name,
      };
      if (options != null) {
        node.addAll(options);
      }
      workflow.nodes.add(node);
    }
    _connectNode(id, isBackEdge);
    return this;
  }

  Branch end(String id, String name) {
    final isBackEdge = workflow._hasNode(id);
    if (!isBackEdge) {
      workflow._endEvent(id, name);
    }
    _connectNode(id, isBackEdge);
    hasEnded = true;
    return this;
  }
}

class WhenBuilder {
  final Workflow workflow;
  final String gatewayID;
  final String condition;

  WhenBuilder({
    required this.workflow,
    required this.gatewayID,
    required this.condition,
  });

  ThenBuilder then(void Function(Branch flow) thenFn) {
    final thenBranch = Branch(
      workflow: workflow,
      gatewayID: gatewayID,
      currentNodeID: gatewayID,
      isConditional: true,
      condition: condition,
    );
    thenFn(thenBranch);
    if (!thenBranch.hasEnded && thenBranch.currentNodeID != gatewayID) {
      workflow.pendingMerges.add(thenBranch.currentNodeID);
    }
    return ThenBuilder(workflow: workflow, gatewayID: gatewayID);
  }
}

class ThenBuilder {
  final Workflow workflow;
  final String gatewayID;

  ThenBuilder({
    required this.workflow,
    required this.gatewayID,
  });

  Workflow Else(void Function(Branch flow) elseFn) {
    final elseBranch = Branch(
      workflow: workflow,
      gatewayID: gatewayID,
      currentNodeID: gatewayID,
      isConditional: false,
      condition: '',
    );
    elseFn(elseBranch);
    if (!elseBranch.hasEnded && elseBranch.currentNodeID != gatewayID) {
      workflow.pendingMerges.add(elseBranch.currentNodeID);
    }
    return workflow;
  }
}

class Workflow {
  final String id;
  final String name;
  final List<Map<String, dynamic>> nodes = [];
  final List<Map<String, dynamic>> flows = [];

  String currentNodeID = '';
  final List<String> pendingMerges = [];

  Workflow(this.id, this.name);

  bool _hasNode(String id) {
    for (final node in nodes) {
      if (node['id'] == id) {
        return true;
      }
    }
    return false;
  }

  void _startEvent({String id = 'start'}) {
    if (!_hasNode(id)) {
      nodes.add({
        'type': 'startEvent',
        'id': id,
        'name': 'Start',
      });
    }
    currentNodeID = id;
  }

  void _endEvent(String id, String name) {
    if (!_hasNode(id)) {
      nodes.add({
        'type': 'endEvent',
        'id': id,
        'name': name,
      });
    }
  }

  void _sequenceFlow(String source, String target) {
    flows.add({
      'id': 'flow-$source-$target',
      'source': source,
      'target': target,
      'condition': '',
    });
  }

  void _sequenceFlowWithCondition(String source, String target, String condition) {
    flows.add({
      'id': 'flow-$source-$target',
      'source': source,
      'target': target,
      'condition': condition,
    });
  }

  void _connectNode(String id) {
    final hasStart = nodes.any((node) => node['type'] == 'startEvent');
    if (!hasStart && id != 'start') {
      _startEvent(id: 'start');
      _sequenceFlow('start', id);
      currentNodeID = id;
      return;
    }

    if (pendingMerges.isNotEmpty) {
      for (final sourceID in pendingMerges) {
        _sequenceFlow(sourceID, id);
      }
      pendingMerges.clear();
    } else if (currentNodeID.isNotEmpty && currentNodeID != id) {
      _sequenceFlow(currentNodeID, id);
    }
    currentNodeID = id;
  }

  Workflow start({String id = 'start'}) {
    _startEvent(id: id);
    _connectNode(id);
    return this;
  }

  Workflow user(String id, String name, [Map<String, dynamic>? options]) {
    final exists = _hasNode(id);
    if (!exists) {
      final node = <String, dynamic>{
        'type': 'userTask',
        'id': id,
        'name': name,
      };
      if (options != null) {
        node.addAll(options);
      }
      nodes.add(node);
    }
    _connectNode(id);
    return this;
  }

  Workflow service(String id, String name, String topic, [Map<String, dynamic>? options]) {
    final exists = _hasNode(id);
    if (!exists) {
      final node = <String, dynamic>{
        'type': 'serviceTask',
        'id': id,
        'name': name,
        'topic': topic,
      };
      if (options != null) {
        node.addAll(options);
      }
      nodes.add(node);
    }
    _connectNode(id);
    return this;
  }

  Workflow ai(String id, String name, [Map<String, dynamic>? options]) {
    final exists = _hasNode(id);
    if (!exists) {
      final node = <String, dynamic>{
        'type': 'aiServiceTask',
        'id': id,
        'name': name,
      };
      if (options != null) {
        node.addAll(options);
      }
      nodes.add(node);
    }
    _connectNode(id);
    return this;
  }

  Workflow end(String id, String name) {
    final exists = _hasNode(id);
    if (!exists) {
      _endEvent(id, name);
    }
    _connectNode(id);
    currentNodeID = '';
    return this;
  }

  WhenBuilder when(dynamic condition) {
    final gwID = 'gw_${currentNodeID}_decision';
    nodes.add({
      'type': 'exclusiveGateway',
      'id': gwID,
      'name': 'Decision Gateway',
    });
    _connectNode(gwID);

    final condStr = condition is Expression ? condition.expr : '$condition';
    return WhenBuilder(workflow: this, gatewayID: gwID, condition: condStr);
  }

  Map<String, dynamic> toJSON() {
    final finalNodes = List<Map<String, dynamic>>.from(nodes);
    final finalFlows = List<Map<String, dynamic>>.from(flows);

    final sourceIDs = flows.map((f) => f['source'] as String).toSet();

    for (final node in nodes) {
      final type = node['type'] as String;
      final nodeID = node['id'] as String;
      if (type == 'endEvent' || type == 'startEvent') continue;

      if (!sourceIDs.contains(nodeID)) {
        final endID = 'end_$nodeID';
        finalNodes.add({
          'type': 'endEvent',
          'id': endID,
          'name': 'Process Finished',
        });
        finalFlows.add({
          'id': 'flow-$nodeID-$endID',
          'source': nodeID,
          'target': endID,
          'condition': '',
        });
      }
    }

    return {
      'id': id,
      'name': name,
      'nodes': finalNodes,
      'flows': finalFlows,
    };
  }
}
