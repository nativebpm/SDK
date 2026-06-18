import 'dart:convert';
import 'package:http/http.dart' as http;
import '../api.dart';
import 'builder.dart';

class Client {
  final String baseUrl;
  final String apiToken;
  late final ApiClient _apiClient;
  late final DefaultApi _defaultApi;

  Client(String baseUrl, this.apiToken)
      : baseUrl = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl {
    _apiClient = ApiClient(basePath: this.baseUrl);
    if (apiToken.isNotEmpty) {
      _apiClient.addDefaultHeader('Authorization', 'Bearer $apiToken');
    }
    _defaultApi = DefaultApi(_apiClient);
  }

  Map<String, String> getHeaders() {
    return {
      'Authorization': 'Bearer $apiToken',
    };
  }

  Future<ProcessDefinition> deploy(Workflow workflow) {
    return definitions().deploy().withWorkflow(workflow).send();
  }

  DefinitionsService definitions() => DefinitionsService(this);
  InstancesService instances() => InstancesService(this);
  TasksService tasks() => TasksService(this);
  IncidentsService incidents() => IncidentsService(this);
  WebhooksService webhooks() => WebhooksService(this);
}

class DefinitionsService {
  final Client client;
  DefinitionsService(this.client);

  ListDefinitionsBuilder list() => ListDefinitionsBuilder(client);
  DeployDefinitionBuilder deploy() => DeployDefinitionBuilder(client);
}

class ListDefinitionsBuilder {
  final Client client;
  ListDefinitionsBuilder(this.client);

  Future<List<ProcessDefinition>> send() async {
    final response = await client._defaultApi.listDefinitions();
    return response ?? [];
  }
}

class DeployDefinitionBuilder {
  final Client client;
  String? _id;
  String? _name;
  List<int>? _bpmnXML;
  Workflow? _workflow;

  DeployDefinitionBuilder(this.client);

  DeployDefinitionBuilder withID(String id) {
    _id = id;
    return this;
  }

  DeployDefinitionBuilder withName(String name) {
    _name = name;
    return this;
  }

  DeployDefinitionBuilder withBPMNXML(List<int> bpmnXML) {
    _bpmnXML = bpmnXML;
    return this;
  }

  DeployDefinitionBuilder withWorkflow(Workflow workflow) {
    _workflow = workflow;
    return this;
  }

  Future<ProcessDefinition> send() async {
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('${client.baseUrl}/api/deploy'),
    );
    request.headers.addAll(client.getHeaders());

    if (_workflow != null) {
      final jsonAst = jsonEncode(_workflow!.toJSON());
      request.files.add(
        http.MultipartFile.fromString(
          'workflow',
          jsonAst,
          filename: 'workflow.json',
        ),
      );
    } else if (_bpmnXML != null) {
      request.files.add(
        http.MultipartFile.fromBytes(
          'file',
          _bpmnXML!,
          filename: 'workflow.bpmn',
        ),
      );
    } else {
      throw Exception('Either workflow or bpmnXML must be provided');
    }

    if (_id != null) request.fields['id'] = _id!;
    if (_name != null) request.fields['name'] = _name!;

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode != 200) {
      throw Exception('Failed to deploy workflow: ${response.body}');
    }

    return client._apiClient.deserialize(response.body, 'ProcessDefinition') as ProcessDefinition;
  }
}

class InstancesService {
  final Client client;
  InstancesService(this.client);

  StartInstanceBuilder start(String definitionId) => StartInstanceBuilder(client, definitionId);
  CompleteInstanceTaskBuilder completeTask(String instanceId, String nodeId) => CompleteInstanceTaskBuilder(client, instanceId, nodeId);
}

class StartInstanceBuilder {
  final Client client;
  final String _definitionId;
  String? _businessKey;
  final Map<String, dynamic> _variables = {};

  StartInstanceBuilder(this.client, this._definitionId);

  StartInstanceBuilder withBusinessKey(String businessKey) {
    _businessKey = businessKey;
    return this;
  }

  StartInstanceBuilder withVariable(String name, dynamic value) {
    _variables[name] = value;
    return this;
  }

  StartInstanceBuilder withVariables(Map<String, dynamic> variables) {
    _variables.addAll(variables);
    return this;
  }

  Future<ProcessInstance> send() async {
    final request = StartInstanceRequest(
      businessKey: _businessKey,
      variables: Map<String, Object>.from(_variables),
    );
    final response = await client._defaultApi.startInstance(_definitionId, startInstanceRequest: request);
    if (response == null) {
      throw Exception('Failed to start instance');
    }
    return response;
  }
}

class CompleteInstanceTaskBuilder {
  final Client client;
  final String _instanceId;
  final String _nodeId;
  final Map<String, dynamic> _variables = {};

  CompleteInstanceTaskBuilder(this.client, this._instanceId, this._nodeId);

  CompleteInstanceTaskBuilder withVariable(String name, dynamic value) {
    _variables[name] = value;
    return this;
  }

  CompleteInstanceTaskBuilder withVariables(Map<String, dynamic> variables) {
    _variables.addAll(variables);
    return this;
  }

  Future<ProcessInstance> send() async {
    final request = CompleteInstanceTaskRequest(
      nodeId: _nodeId,
      variables: Map<String, Object>.from(_variables),
    );
    final response = await client._defaultApi.completeInstanceTask(_instanceId, request);
    if (response == null) {
      throw Exception('Failed to complete instance task');
    }
    return response;
  }
}

class TasksService {
  final Client client;
  TasksService(this.client);

  ListTasksBuilder list() => ListTasksBuilder(client);
  ClaimTaskBuilder claim(String taskId) => ClaimTaskBuilder(client, taskId);
  CompleteTaskBuilder complete(String taskId) => CompleteTaskBuilder(client, taskId);
}

class ListTasksBuilder {
  final Client client;
  String? _assignee;
  String? _candidateGroup;
  String? _status;

  ListTasksBuilder(this.client);

  ListTasksBuilder withAssignee(String assignee) {
    _assignee = assignee;
    return this;
  }

  ListTasksBuilder withCandidateGroup(String candidateGroup) {
    _candidateGroup = candidateGroup;
    return this;
  }

  ListTasksBuilder withStatus(String status) {
    _status = status;
    return this;
  }

  Future<List<TaskRecord>> send() async {
    final response = await client._defaultApi.listTasks(
      assignee: _assignee,
      candidateGroup: _candidateGroup,
      status: _status,
    );
    return response ?? [];
  }
}

class ClaimTaskBuilder {
  final Client client;
  final String _taskId;
  String? _assignee;

  ClaimTaskBuilder(this.client, this._taskId);

  ClaimTaskBuilder withAssignee(String assignee) {
    _assignee = assignee;
    return this;
  }

  Future<TaskRecord> send() async {
    if (_assignee == null) {
      throw Exception('Assignee is required to claim a task');
    }
    final request = ClaimTaskRequest(
      assignee: _assignee!,
    );
    final response = await client._defaultApi.claimTask(_taskId, request);
    if (response == null) {
      throw Exception('Failed to claim task');
    }
    return response;
  }
}

class CompleteTaskBuilder {
  final Client client;
  final String _taskId;
  final Map<String, dynamic> _variables = {};

  CompleteTaskBuilder(this.client, this._taskId);

  CompleteTaskBuilder withVariable(String name, dynamic value) {
    _variables[name] = value;
    return this;
  }

  CompleteTaskBuilder withVariables(Map<String, dynamic> variables) {
    _variables.addAll(variables);
    return this;
  }

  Future<ProcessInstance> send() async {
    final request = CompleteTaskRequest(
      variables: Map<String, Object>.from(_variables),
    );
    final response = await client._defaultApi.completeTask(_taskId, completeTaskRequest: request);
    if (response == null) {
      throw Exception('Failed to complete task');
    }
    return response;
  }
}

class IncidentsService {
  final Client client;
  IncidentsService(this.client);

  ListIncidentsBuilder list(String instanceId) => ListIncidentsBuilder(client, instanceId);
  ResolveIncidentBuilder resolve(String instanceId, String incidentId) => ResolveIncidentBuilder(client, instanceId, incidentId);
}

class ListIncidentsBuilder {
  final Client client;
  final String _instanceId;

  ListIncidentsBuilder(this.client, this._instanceId);

  Future<List<IncidentRecord>> send() async {
    final response = await client._defaultApi.listIncidents(_instanceId);
    return response ?? [];
  }
}

class ResolveIncidentBuilder {
  final Client client;
  final String _instanceId;
  final String _incidentId;

  ResolveIncidentBuilder(this.client, this._instanceId, this._incidentId);

  Future<ResolveIncident200Response> send() async {
    final response = await client._defaultApi.resolveIncident(_instanceId, _incidentId);
    if (response == null) {
      throw Exception('Failed to resolve incident');
    }
    return response;
  }
}

class WebhooksService {
  final Client client;
  WebhooksService(this.client);

  ListWebhooksBuilder list() => ListWebhooksBuilder(client);
  CreateWebhookBuilder create() => CreateWebhookBuilder(client);
  DeleteWebhookBuilder delete(String webhookId) => DeleteWebhookBuilder(client, webhookId);
  ListWebhookDeliveriesBuilder deliveries(String webhookId) => ListWebhookDeliveriesBuilder(client, webhookId);
}

class ListWebhooksBuilder {
  final Client client;
  ListWebhooksBuilder(this.client);

  Future<List<WebhookRecord>> send() async {
    final response = await client._defaultApi.listWebhooks();
    return response ?? [];
  }
}

class CreateWebhookBuilder {
  final Client client;
  String? _url;
  String? _secret;
  final List<String> _events = [];

  CreateWebhookBuilder(this.client);

  CreateWebhookBuilder withUrl(String url) {
    _url = url;
    return this;
  }

  CreateWebhookBuilder withSecret(String secret) {
    _secret = secret;
    return this;
  }

  CreateWebhookBuilder withEvent(String event) {
    _events.add(event);
    return this;
  }

  CreateWebhookBuilder withEvents(List<String> events) {
    _events.addAll(events);
    return this;
  }

  Future<WebhookRecord> send() async {
    if (_url == null) {
      throw Exception('URL is required to create a webhook');
    }
    final request = CreateWebhookRequest(
      url: _url!,
      secret: _secret,
      events: _events,
    );
    final response = await client._defaultApi.createWebhook(request);
    if (response == null) {
      throw Exception('Failed to create webhook');
    }
    return response;
  }
}

class DeleteWebhookBuilder {
  final Client client;
  final String _webhookId;

  DeleteWebhookBuilder(this.client, this._webhookId);

  Future<ResolveIncident200Response> send() async {
    final response = await client._defaultApi.deleteWebhook(_webhookId);
    if (response == null) {
      throw Exception('Failed to delete webhook');
    }
    return response;
  }
}

class ListWebhookDeliveriesBuilder {
  final Client client;
  final String _webhookId;

  ListWebhookDeliveriesBuilder(this.client, this._webhookId);

  Future<List<WebhookDeliveryRecord>> send() async {
    final response = await client._defaultApi.listWebhookDeliveries(_webhookId);
    return response ?? [];
  }
}
