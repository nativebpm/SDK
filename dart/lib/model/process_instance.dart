//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ProcessInstance {
  /// Returns a new [ProcessInstance] instance.
  ProcessInstance({
    required this.id,
    required this.processId,
    required this.definitionHash,
    required this.businessKey,
    required this.state,
    required this.version,
    required this.completed,
    required this.updatedAt,
    required this.tenantId,
  });

  String id;

  String processId;

  String definitionHash;

  String businessKey;

  /// Raw JSON object representing internal Wazero process engine state representation
  Object state;

  int version;

  bool completed;

  DateTime updatedAt;

  String tenantId;

  @override
  bool operator ==(Object other) => identical(this, other) || other is ProcessInstance &&
    other.id == id &&
    other.processId == processId &&
    other.definitionHash == definitionHash &&
    other.businessKey == businessKey &&
    other.state == state &&
    other.version == version &&
    other.completed == completed &&
    other.updatedAt == updatedAt &&
    other.tenantId == tenantId;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id.hashCode) +
    (processId.hashCode) +
    (definitionHash.hashCode) +
    (businessKey.hashCode) +
    (state.hashCode) +
    (version.hashCode) +
    (completed.hashCode) +
    (updatedAt.hashCode) +
    (tenantId.hashCode);

  @override
  String toString() => 'ProcessInstance[id=$id, processId=$processId, definitionHash=$definitionHash, businessKey=$businessKey, state=$state, version=$version, completed=$completed, updatedAt=$updatedAt, tenantId=$tenantId]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'id'] = this.id;
      json[r'process_id'] = this.processId;
      json[r'definition_hash'] = this.definitionHash;
      json[r'business_key'] = this.businessKey;
      json[r'state'] = this.state;
      json[r'version'] = this.version;
      json[r'completed'] = this.completed;
      json[r'updated_at'] = this.updatedAt.toUtc().toIso8601String();
      json[r'tenant_id'] = this.tenantId;
    return json;
  }

  /// Returns a new [ProcessInstance] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ProcessInstance? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        assert(json.containsKey(r'id'), 'Required key "ProcessInstance[id]" is missing from JSON.');
        assert(json[r'id'] != null, 'Required key "ProcessInstance[id]" has a null value in JSON.');
        assert(json.containsKey(r'process_id'), 'Required key "ProcessInstance[process_id]" is missing from JSON.');
        assert(json[r'process_id'] != null, 'Required key "ProcessInstance[process_id]" has a null value in JSON.');
        assert(json.containsKey(r'definition_hash'), 'Required key "ProcessInstance[definition_hash]" is missing from JSON.');
        assert(json[r'definition_hash'] != null, 'Required key "ProcessInstance[definition_hash]" has a null value in JSON.');
        assert(json.containsKey(r'business_key'), 'Required key "ProcessInstance[business_key]" is missing from JSON.');
        assert(json[r'business_key'] != null, 'Required key "ProcessInstance[business_key]" has a null value in JSON.');
        assert(json.containsKey(r'state'), 'Required key "ProcessInstance[state]" is missing from JSON.');
        assert(json[r'state'] != null, 'Required key "ProcessInstance[state]" has a null value in JSON.');
        assert(json.containsKey(r'version'), 'Required key "ProcessInstance[version]" is missing from JSON.');
        assert(json[r'version'] != null, 'Required key "ProcessInstance[version]" has a null value in JSON.');
        assert(json.containsKey(r'completed'), 'Required key "ProcessInstance[completed]" is missing from JSON.');
        assert(json[r'completed'] != null, 'Required key "ProcessInstance[completed]" has a null value in JSON.');
        assert(json.containsKey(r'updated_at'), 'Required key "ProcessInstance[updated_at]" is missing from JSON.');
        assert(json[r'updated_at'] != null, 'Required key "ProcessInstance[updated_at]" has a null value in JSON.');
        assert(json.containsKey(r'tenant_id'), 'Required key "ProcessInstance[tenant_id]" is missing from JSON.');
        assert(json[r'tenant_id'] != null, 'Required key "ProcessInstance[tenant_id]" has a null value in JSON.');
        return true;
      }());

      return ProcessInstance(
        id: mapValueOfType<String>(json, r'id')!,
        processId: mapValueOfType<String>(json, r'process_id')!,
        definitionHash: mapValueOfType<String>(json, r'definition_hash')!,
        businessKey: mapValueOfType<String>(json, r'business_key')!,
        state: mapValueOfType<Object>(json, r'state')!,
        version: mapValueOfType<int>(json, r'version')!,
        completed: mapValueOfType<bool>(json, r'completed')!,
        updatedAt: mapDateTime(json, r'updated_at', r'')!,
        tenantId: mapValueOfType<String>(json, r'tenant_id')!,
      );
    }
    return null;
  }

  static List<ProcessInstance> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProcessInstance>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProcessInstance.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProcessInstance> mapFromJson(dynamic json) {
    final map = <String, ProcessInstance>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProcessInstance.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ProcessInstance-objects as value to a dart map
  static Map<String, List<ProcessInstance>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ProcessInstance>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ProcessInstance.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'id',
    'process_id',
    'definition_hash',
    'business_key',
    'state',
    'version',
    'completed',
    'updated_at',
    'tenant_id',
  };
}

