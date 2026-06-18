//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;


class DefaultApi {
  DefaultApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  final ApiClient apiClient;

  /// Claim human task
  ///
  /// Claim a task for a specific user assignee.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///
  /// * [ClaimTaskRequest] claimTaskRequest (required):
  Future<Response> claimTaskWithHttpInfo(String id, ClaimTaskRequest claimTaskRequest, { Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/tasks/{id}/claim'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody = claimTaskRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// Claim human task
  ///
  /// Claim a task for a specific user assignee.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///
  /// * [ClaimTaskRequest] claimTaskRequest (required):
  Future<TaskRecord?> claimTask(String id, ClaimTaskRequest claimTaskRequest, { Future<void>? abortTrigger, }) async {
    final response = await claimTaskWithHttpInfo(id, claimTaskRequest, abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'TaskRecord',) as TaskRecord;
    
    }
    return null;
  }

  /// Complete a wait state / task activity in process instance
  ///
  /// Complete a specific active node/wait state within a process instance.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///
  /// * [CompleteInstanceTaskRequest] completeInstanceTaskRequest (required):
  Future<Response> completeInstanceTaskWithHttpInfo(String id, CompleteInstanceTaskRequest completeInstanceTaskRequest, { Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/instances/{id}/complete'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody = completeInstanceTaskRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// Complete a wait state / task activity in process instance
  ///
  /// Complete a specific active node/wait state within a process instance.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///
  /// * [CompleteInstanceTaskRequest] completeInstanceTaskRequest (required):
  Future<ProcessInstance?> completeInstanceTask(String id, CompleteInstanceTaskRequest completeInstanceTaskRequest, { Future<void>? abortTrigger, }) async {
    final response = await completeInstanceTaskWithHttpInfo(id, completeInstanceTaskRequest, abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ProcessInstance',) as ProcessInstance;
    
    }
    return null;
  }

  /// Complete human task
  ///
  /// Complete a claimed human task, providing results variables.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///
  /// * [CompleteTaskRequest] completeTaskRequest:
  Future<Response> completeTaskWithHttpInfo(String id, { CompleteTaskRequest? completeTaskRequest, Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/tasks/{id}/complete'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody = completeTaskRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// Complete human task
  ///
  /// Complete a claimed human task, providing results variables.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///
  /// * [CompleteTaskRequest] completeTaskRequest:
  Future<ProcessInstance?> completeTask(String id, { CompleteTaskRequest? completeTaskRequest, Future<void>? abortTrigger, }) async {
    final response = await completeTaskWithHttpInfo(id, completeTaskRequest: completeTaskRequest, abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ProcessInstance',) as ProcessInstance;
    
    }
    return null;
  }

  /// Create webhook target
  ///
  /// Register a new webhook target.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [CreateWebhookRequest] createWebhookRequest (required):
  Future<Response> createWebhookWithHttpInfo(CreateWebhookRequest createWebhookRequest, { Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/webhooks';

    // ignore: prefer_final_locals
    Object? postBody = createWebhookRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// Create webhook target
  ///
  /// Register a new webhook target.
  ///
  /// Parameters:
  ///
  /// * [CreateWebhookRequest] createWebhookRequest (required):
  Future<WebhookRecord?> createWebhook(CreateWebhookRequest createWebhookRequest, { Future<void>? abortTrigger, }) async {
    final response = await createWebhookWithHttpInfo(createWebhookRequest, abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'WebhookRecord',) as WebhookRecord;
    
    }
    return null;
  }

  /// Delete webhook target
  ///
  /// Delete a webhook configuration.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<Response> deleteWebhookWithHttpInfo(String id, { Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/webhooks/{id}'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'DELETE',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// Delete webhook target
  ///
  /// Delete a webhook configuration.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<ResolveIncident200Response?> deleteWebhook(String id, { Future<void>? abortTrigger, }) async {
    final response = await deleteWebhookWithHttpInfo(id, abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ResolveIncident200Response',) as ResolveIncident200Response;
    
    }
    return null;
  }

  /// Deploy process definition
  ///
  /// Deploy a new BPMN 2.0 XML process definition.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [MultipartFile] file:
  ///   BPMN 2.0 XML file content to deploy
  Future<Response> deployDefinitionWithHttpInfo({ MultipartFile? file, Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/deploy';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['multipart/form-data'];

    bool hasFields = false;
    final mp = MultipartRequest('POST', Uri.parse(path));
    if (file != null) {
      hasFields = true;
      mp.fields[r'file'] = file.field;
      mp.files.add(file);
    }
    if (hasFields) {
      postBody = mp;
    }

    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// Deploy process definition
  ///
  /// Deploy a new BPMN 2.0 XML process definition.
  ///
  /// Parameters:
  ///
  /// * [MultipartFile] file:
  ///   BPMN 2.0 XML file content to deploy
  Future<ProcessDefinition?> deployDefinition({ MultipartFile? file, Future<void>? abortTrigger, }) async {
    final response = await deployDefinitionWithHttpInfo(file: file, abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ProcessDefinition',) as ProcessDefinition;
    
    }
    return null;
  }

  /// Get process instance
  ///
  /// Fetch a single process instance state by instance ID.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<Response> getInstanceWithHttpInfo(String id, { Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/instances/{id}'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// Get process instance
  ///
  /// Fetch a single process instance state by instance ID.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<ProcessInstance?> getInstance(String id, { Future<void>? abortTrigger, }) async {
    final response = await getInstanceWithHttpInfo(id, abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ProcessInstance',) as ProcessInstance;
    
    }
    return null;
  }

  /// Get process instance execution history
  ///
  /// Fetch the audit trail / execution history log for a process instance.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<Response> getInstanceHistoryWithHttpInfo(String id, { Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/instances/{id}/history'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// Get process instance execution history
  ///
  /// Fetch the audit trail / execution history log for a process instance.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<List<HistoryRecord>?> getInstanceHistory(String id, { Future<void>? abortTrigger, }) async {
    final response = await getInstanceHistoryWithHttpInfo(id, abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      final responseBody = await _decodeBodyBytes(response);
      return (await apiClient.deserializeAsync(responseBody, 'List<HistoryRecord>') as List)
        .cast<HistoryRecord>()
        .toList(growable: false);

    }
    return null;
  }

  /// List process definitions
  ///
  /// Retrieve a list of all deployed process definitions.
  ///
  /// Note: This method returns the HTTP [Response].
  Future<Response> listDefinitionsWithHttpInfo({ Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/definitions';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// List process definitions
  ///
  /// Retrieve a list of all deployed process definitions.
  Future<List<ProcessDefinition>?> listDefinitions({ Future<void>? abortTrigger, }) async {
    final response = await listDefinitionsWithHttpInfo(abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      final responseBody = await _decodeBodyBytes(response);
      return (await apiClient.deserializeAsync(responseBody, 'List<ProcessDefinition>') as List)
        .cast<ProcessDefinition>()
        .toList(growable: false);

    }
    return null;
  }

  /// List incidents for process instance
  ///
  /// Get active execution incidents (failures) for a specific process instance.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<Response> listIncidentsWithHttpInfo(String id, { Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/instances/{id}/incidents'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// List incidents for process instance
  ///
  /// Get active execution incidents (failures) for a specific process instance.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<List<IncidentRecord>?> listIncidents(String id, { Future<void>? abortTrigger, }) async {
    final response = await listIncidentsWithHttpInfo(id, abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      final responseBody = await _decodeBodyBytes(response);
      return (await apiClient.deserializeAsync(responseBody, 'List<IncidentRecord>') as List)
        .cast<IncidentRecord>()
        .toList(growable: false);

    }
    return null;
  }

  /// List process instances
  ///
  /// Retrieve a list of active and completed process instances.
  ///
  /// Note: This method returns the HTTP [Response].
  Future<Response> listInstancesWithHttpInfo({ Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/instances';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// List process instances
  ///
  /// Retrieve a list of active and completed process instances.
  Future<List<ProcessInstance>?> listInstances({ Future<void>? abortTrigger, }) async {
    final response = await listInstancesWithHttpInfo(abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      final responseBody = await _decodeBodyBytes(response);
      return (await apiClient.deserializeAsync(responseBody, 'List<ProcessInstance>') as List)
        .cast<ProcessInstance>()
        .toList(growable: false);

    }
    return null;
  }

  /// List human/user tasks
  ///
  /// Query tasks matching criteria (assignee, candidateGroup, status).
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] assignee:
  ///
  /// * [String] candidateGroup:
  ///
  /// * [String] status:
  Future<Response> listTasksWithHttpInfo({ String? assignee, String? candidateGroup, String? status, Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/tasks';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    if (assignee != null) {
      queryParams.addAll(_queryParams('', 'assignee', assignee));
    }
    if (candidateGroup != null) {
      queryParams.addAll(_queryParams('', 'candidateGroup', candidateGroup));
    }
    if (status != null) {
      queryParams.addAll(_queryParams('', 'status', status));
    }

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// List human/user tasks
  ///
  /// Query tasks matching criteria (assignee, candidateGroup, status).
  ///
  /// Parameters:
  ///
  /// * [String] assignee:
  ///
  /// * [String] candidateGroup:
  ///
  /// * [String] status:
  Future<List<TaskRecord>?> listTasks({ String? assignee, String? candidateGroup, String? status, Future<void>? abortTrigger, }) async {
    final response = await listTasksWithHttpInfo(assignee: assignee, candidateGroup: candidateGroup, status: status, abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      final responseBody = await _decodeBodyBytes(response);
      return (await apiClient.deserializeAsync(responseBody, 'List<TaskRecord>') as List)
        .cast<TaskRecord>()
        .toList(growable: false);

    }
    return null;
  }

  /// List deliveries for webhook
  ///
  /// Get delivery audit logs and history queue for a specific webhook target.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<Response> listWebhookDeliveriesWithHttpInfo(String id, { Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/webhooks/{id}/deliveries'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// List deliveries for webhook
  ///
  /// Get delivery audit logs and history queue for a specific webhook target.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<List<WebhookDeliveryRecord>?> listWebhookDeliveries(String id, { Future<void>? abortTrigger, }) async {
    final response = await listWebhookDeliveriesWithHttpInfo(id, abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      final responseBody = await _decodeBodyBytes(response);
      return (await apiClient.deserializeAsync(responseBody, 'List<WebhookDeliveryRecord>') as List)
        .cast<WebhookDeliveryRecord>()
        .toList(growable: false);

    }
    return null;
  }

  /// List configured outgoing webhooks
  ///
  /// List all registered webhook targets.
  ///
  /// Note: This method returns the HTTP [Response].
  Future<Response> listWebhooksWithHttpInfo({ Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/webhooks';

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'GET',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// List configured outgoing webhooks
  ///
  /// List all registered webhook targets.
  Future<List<WebhookRecord>?> listWebhooks({ Future<void>? abortTrigger, }) async {
    final response = await listWebhooksWithHttpInfo(abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      final responseBody = await _decodeBodyBytes(response);
      return (await apiClient.deserializeAsync(responseBody, 'List<WebhookRecord>') as List)
        .cast<WebhookRecord>()
        .toList(growable: false);

    }
    return null;
  }

  /// Resolve process incident
  ///
  /// Resolve a process execution failure incident, triggering retry/resume.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///
  /// * [String] incidentId (required):
  Future<Response> resolveIncidentWithHttpInfo(String id, String incidentId, { Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/instances/{id}/incidents/{incidentId}/resolve'
      .replaceAll('{id}', id)
      .replaceAll('{incidentId}', incidentId);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// Resolve process incident
  ///
  /// Resolve a process execution failure incident, triggering retry/resume.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///
  /// * [String] incidentId (required):
  Future<ResolveIncident200Response?> resolveIncident(String id, String incidentId, { Future<void>? abortTrigger, }) async {
    final response = await resolveIncidentWithHttpInfo(id, incidentId, abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ResolveIncident200Response',) as ResolveIncident200Response;
    
    }
    return null;
  }

  /// Resume process instance
  ///
  /// Manually trigger execution resumption of a process instance.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<Response> resumeInstanceWithHttpInfo(String id, { Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/instances/{id}/resume'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// Resume process instance
  ///
  /// Manually trigger execution resumption of a process instance.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<ProcessInstance?> resumeInstance(String id, { Future<void>? abortTrigger, }) async {
    final response = await resumeInstanceWithHttpInfo(id, abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ProcessInstance',) as ProcessInstance;
    
    }
    return null;
  }

  /// Start process instance
  ///
  /// Start a new workflow process instance by process definition ID.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///   The process definition ID (e.g., matching the BPMN process element ID)
  ///
  /// * [StartInstanceRequest] startInstanceRequest:
  Future<Response> startInstanceWithHttpInfo(String id, { StartInstanceRequest? startInstanceRequest, Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/definitions/{id}/start'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody = startInstanceRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// Start process instance
  ///
  /// Start a new workflow process instance by process definition ID.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///   The process definition ID (e.g., matching the BPMN process element ID)
  ///
  /// * [StartInstanceRequest] startInstanceRequest:
  Future<ProcessInstance?> startInstance(String id, { StartInstanceRequest? startInstanceRequest, Future<void>? abortTrigger, }) async {
    final response = await startInstanceWithHttpInfo(id, startInstanceRequest: startInstanceRequest, abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ProcessInstance',) as ProcessInstance;
    
    }
    return null;
  }

  /// Test webhook target
  ///
  /// Send a test ping event delivery to verification URL.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<Response> testWebhookWithHttpInfo(String id, { Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/webhooks/{id}/test'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>[];


    return apiClient.invokeAPI(
      path,
      'POST',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// Test webhook target
  ///
  /// Send a test ping event delivery to verification URL.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  Future<ResolveIncident200Response?> testWebhook(String id, { Future<void>? abortTrigger, }) async {
    final response = await testWebhookWithHttpInfo(id, abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'ResolveIncident200Response',) as ResolveIncident200Response;
    
    }
    return null;
  }

  /// Update webhook target
  ///
  /// Modify the configuration of an existing webhook.
  ///
  /// Note: This method returns the HTTP [Response].
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///
  /// * [CreateWebhookRequest] createWebhookRequest (required):
  Future<Response> updateWebhookWithHttpInfo(String id, CreateWebhookRequest createWebhookRequest, { Future<void>? abortTrigger, }) async {
    // ignore: prefer_const_declarations
    final path = r'/api/webhooks/{id}'
      .replaceAll('{id}', id);

    // ignore: prefer_final_locals
    Object? postBody = createWebhookRequest;

    final queryParams = <QueryParam>[];
    final headerParams = <String, String>{};
    final formParams = <String, String>{};

    const contentTypes = <String>['application/json'];


    return apiClient.invokeAPI(
      path,
      'PUT',
      queryParams,
      postBody,
      headerParams,
      formParams,
      contentTypes.isEmpty ? null : contentTypes.first,
      abortTrigger: abortTrigger,
    );
  }

  /// Update webhook target
  ///
  /// Modify the configuration of an existing webhook.
  ///
  /// Parameters:
  ///
  /// * [String] id (required):
  ///
  /// * [CreateWebhookRequest] createWebhookRequest (required):
  Future<WebhookRecord?> updateWebhook(String id, CreateWebhookRequest createWebhookRequest, { Future<void>? abortTrigger, }) async {
    final response = await updateWebhookWithHttpInfo(id, createWebhookRequest, abortTrigger: abortTrigger,);
    if (response.statusCode >= HttpStatus.badRequest) {
      throw ApiException(response.statusCode, await _decodeBodyBytes(response));
    }
    // When a remote server returns no body with a status of 204, we shall not decode it.
    // At the time of writing this, `dart:convert` will throw an "Unexpected end of input"
    // FormatException when trying to decode an empty string.
    if (response.body.isNotEmpty && response.statusCode != HttpStatus.noContent) {
      return await apiClient.deserializeAsync(await _decodeBodyBytes(response), 'WebhookRecord',) as WebhookRecord;
    
    }
    return null;
  }
}
