//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class StartInstanceRequest {
  /// Returns a new [StartInstanceRequest] instance.
  StartInstanceRequest({
    this.instanceId,
    this.businessKey,
    this.variables = const {},
  });

  /// Optional user-generated UUID to enforce idempotency
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? instanceId;

  /// Business tracking keyword
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? businessKey;

  Map<String, Object> variables;

  @override
  bool operator ==(Object other) => identical(this, other) || other is StartInstanceRequest &&
    other.instanceId == instanceId &&
    other.businessKey == businessKey &&
    _deepEquality.equals(other.variables, variables);

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (instanceId == null ? 0 : instanceId!.hashCode) +
    (businessKey == null ? 0 : businessKey!.hashCode) +
    (variables.hashCode);

  @override
  String toString() => 'StartInstanceRequest[instanceId=$instanceId, businessKey=$businessKey, variables=$variables]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.instanceId != null) {
      json[r'instance_id'] = this.instanceId;
    } else {
      json[r'instance_id'] = null;
    }
    if (this.businessKey != null) {
      json[r'business_key'] = this.businessKey;
    } else {
      json[r'business_key'] = null;
    }
      json[r'variables'] = this.variables;
    return json;
  }

  /// Returns a new [StartInstanceRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static StartInstanceRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        return true;
      }());

      return StartInstanceRequest(
        instanceId: mapValueOfType<String>(json, r'instance_id'),
        businessKey: mapValueOfType<String>(json, r'business_key'),
        variables: mapCastOfType<String, Object>(json, r'variables') ?? const {},
      );
    }
    return null;
  }

  static List<StartInstanceRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <StartInstanceRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = StartInstanceRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, StartInstanceRequest> mapFromJson(dynamic json) {
    final map = <String, StartInstanceRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = StartInstanceRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of StartInstanceRequest-objects as value to a dart map
  static Map<String, List<StartInstanceRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<StartInstanceRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = StartInstanceRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}

