//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class HistoryRecord {
  /// Returns a new [HistoryRecord] instance.
  HistoryRecord({
    required this.id,
    required this.instanceId,
    required this.nodeId,
    required this.nodeName,
    required this.nodeType,
    required this.action,
    this.variables,
    required this.timestamp,
  });

  String id;

  String instanceId;

  String nodeId;

  String nodeName;

  String nodeType;

  String action;

  /// JSON encoded payload variables associated with this transition
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  Object? variables;

  DateTime timestamp;

  @override
  bool operator ==(Object other) => identical(this, other) || other is HistoryRecord &&
    other.id == id &&
    other.instanceId == instanceId &&
    other.nodeId == nodeId &&
    other.nodeName == nodeName &&
    other.nodeType == nodeType &&
    other.action == action &&
    other.variables == variables &&
    other.timestamp == timestamp;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id.hashCode) +
    (instanceId.hashCode) +
    (nodeId.hashCode) +
    (nodeName.hashCode) +
    (nodeType.hashCode) +
    (action.hashCode) +
    (variables == null ? 0 : variables!.hashCode) +
    (timestamp.hashCode);

  @override
  String toString() => 'HistoryRecord[id=$id, instanceId=$instanceId, nodeId=$nodeId, nodeName=$nodeName, nodeType=$nodeType, action=$action, variables=$variables, timestamp=$timestamp]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'id'] = this.id;
      json[r'instance_id'] = this.instanceId;
      json[r'node_id'] = this.nodeId;
      json[r'node_name'] = this.nodeName;
      json[r'node_type'] = this.nodeType;
      json[r'action'] = this.action;
    if (this.variables != null) {
      json[r'variables'] = this.variables;
    } else {
      json[r'variables'] = null;
    }
      json[r'timestamp'] = this.timestamp.toUtc().toIso8601String();
    return json;
  }

  /// Returns a new [HistoryRecord] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static HistoryRecord? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        assert(json.containsKey(r'id'), 'Required key "HistoryRecord[id]" is missing from JSON.');
        assert(json[r'id'] != null, 'Required key "HistoryRecord[id]" has a null value in JSON.');
        assert(json.containsKey(r'instance_id'), 'Required key "HistoryRecord[instance_id]" is missing from JSON.');
        assert(json[r'instance_id'] != null, 'Required key "HistoryRecord[instance_id]" has a null value in JSON.');
        assert(json.containsKey(r'node_id'), 'Required key "HistoryRecord[node_id]" is missing from JSON.');
        assert(json[r'node_id'] != null, 'Required key "HistoryRecord[node_id]" has a null value in JSON.');
        assert(json.containsKey(r'node_name'), 'Required key "HistoryRecord[node_name]" is missing from JSON.');
        assert(json[r'node_name'] != null, 'Required key "HistoryRecord[node_name]" has a null value in JSON.');
        assert(json.containsKey(r'node_type'), 'Required key "HistoryRecord[node_type]" is missing from JSON.');
        assert(json[r'node_type'] != null, 'Required key "HistoryRecord[node_type]" has a null value in JSON.');
        assert(json.containsKey(r'action'), 'Required key "HistoryRecord[action]" is missing from JSON.');
        assert(json[r'action'] != null, 'Required key "HistoryRecord[action]" has a null value in JSON.');
        assert(json.containsKey(r'timestamp'), 'Required key "HistoryRecord[timestamp]" is missing from JSON.');
        assert(json[r'timestamp'] != null, 'Required key "HistoryRecord[timestamp]" has a null value in JSON.');
        return true;
      }());

      return HistoryRecord(
        id: mapValueOfType<String>(json, r'id')!,
        instanceId: mapValueOfType<String>(json, r'instance_id')!,
        nodeId: mapValueOfType<String>(json, r'node_id')!,
        nodeName: mapValueOfType<String>(json, r'node_name')!,
        nodeType: mapValueOfType<String>(json, r'node_type')!,
        action: mapValueOfType<String>(json, r'action')!,
        variables: mapValueOfType<Object>(json, r'variables'),
        timestamp: mapDateTime(json, r'timestamp', r'')!,
      );
    }
    return null;
  }

  static List<HistoryRecord> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <HistoryRecord>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = HistoryRecord.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, HistoryRecord> mapFromJson(dynamic json) {
    final map = <String, HistoryRecord>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = HistoryRecord.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of HistoryRecord-objects as value to a dart map
  static Map<String, List<HistoryRecord>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<HistoryRecord>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = HistoryRecord.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'id',
    'instance_id',
    'node_id',
    'node_name',
    'node_type',
    'action',
    'timestamp',
  };
}

