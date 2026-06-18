//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class CompleteInstanceTaskRequest {
  /// Returns a new [CompleteInstanceTaskRequest] instance.
  CompleteInstanceTaskRequest({
    required this.nodeId,
    this.variables = const {},
  });

  /// BPMN task element identifier
  String nodeId;

  Map<String, Object> variables;

  @override
  bool operator ==(Object other) => identical(this, other) || other is CompleteInstanceTaskRequest &&
    other.nodeId == nodeId &&
    _deepEquality.equals(other.variables, variables);

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (nodeId.hashCode) +
    (variables.hashCode);

  @override
  String toString() => 'CompleteInstanceTaskRequest[nodeId=$nodeId, variables=$variables]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'node_id'] = this.nodeId;
      json[r'variables'] = this.variables;
    return json;
  }

  /// Returns a new [CompleteInstanceTaskRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CompleteInstanceTaskRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        assert(json.containsKey(r'node_id'), 'Required key "CompleteInstanceTaskRequest[node_id]" is missing from JSON.');
        assert(json[r'node_id'] != null, 'Required key "CompleteInstanceTaskRequest[node_id]" has a null value in JSON.');
        return true;
      }());

      return CompleteInstanceTaskRequest(
        nodeId: mapValueOfType<String>(json, r'node_id')!,
        variables: mapCastOfType<String, Object>(json, r'variables') ?? const {},
      );
    }
    return null;
  }

  static List<CompleteInstanceTaskRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CompleteInstanceTaskRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CompleteInstanceTaskRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CompleteInstanceTaskRequest> mapFromJson(dynamic json) {
    final map = <String, CompleteInstanceTaskRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CompleteInstanceTaskRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CompleteInstanceTaskRequest-objects as value to a dart map
  static Map<String, List<CompleteInstanceTaskRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<CompleteInstanceTaskRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CompleteInstanceTaskRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'node_id',
  };
}

