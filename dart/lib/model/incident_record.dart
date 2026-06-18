//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class IncidentRecord {
  /// Returns a new [IncidentRecord] instance.
  IncidentRecord({
    required this.id,
    required this.instanceId,
    required this.activityId,
    required this.errorMessage,
    this.stackTrace,
    required this.attemptsMade,
    required this.resolved,
    required this.createdAt,
    this.resolvedAt,
  });

  String id;

  String instanceId;

  String activityId;

  String errorMessage;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? stackTrace;

  int attemptsMade;

  bool resolved;

  DateTime createdAt;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  DateTime? resolvedAt;

  @override
  bool operator ==(Object other) => identical(this, other) || other is IncidentRecord &&
    other.id == id &&
    other.instanceId == instanceId &&
    other.activityId == activityId &&
    other.errorMessage == errorMessage &&
    other.stackTrace == stackTrace &&
    other.attemptsMade == attemptsMade &&
    other.resolved == resolved &&
    other.createdAt == createdAt &&
    other.resolvedAt == resolvedAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id.hashCode) +
    (instanceId.hashCode) +
    (activityId.hashCode) +
    (errorMessage.hashCode) +
    (stackTrace == null ? 0 : stackTrace!.hashCode) +
    (attemptsMade.hashCode) +
    (resolved.hashCode) +
    (createdAt.hashCode) +
    (resolvedAt == null ? 0 : resolvedAt!.hashCode);

  @override
  String toString() => 'IncidentRecord[id=$id, instanceId=$instanceId, activityId=$activityId, errorMessage=$errorMessage, stackTrace=$stackTrace, attemptsMade=$attemptsMade, resolved=$resolved, createdAt=$createdAt, resolvedAt=$resolvedAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'id'] = this.id;
      json[r'instance_id'] = this.instanceId;
      json[r'activity_id'] = this.activityId;
      json[r'error_message'] = this.errorMessage;
    if (this.stackTrace != null) {
      json[r'stack_trace'] = this.stackTrace;
    } else {
      json[r'stack_trace'] = null;
    }
      json[r'attempts_made'] = this.attemptsMade;
      json[r'resolved'] = this.resolved;
      json[r'created_at'] = this.createdAt.toUtc().toIso8601String();
    if (this.resolvedAt != null) {
      json[r'resolved_at'] = this.resolvedAt!.toUtc().toIso8601String();
    } else {
      json[r'resolved_at'] = null;
    }
    return json;
  }

  /// Returns a new [IncidentRecord] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static IncidentRecord? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        assert(json.containsKey(r'id'), 'Required key "IncidentRecord[id]" is missing from JSON.');
        assert(json[r'id'] != null, 'Required key "IncidentRecord[id]" has a null value in JSON.');
        assert(json.containsKey(r'instance_id'), 'Required key "IncidentRecord[instance_id]" is missing from JSON.');
        assert(json[r'instance_id'] != null, 'Required key "IncidentRecord[instance_id]" has a null value in JSON.');
        assert(json.containsKey(r'activity_id'), 'Required key "IncidentRecord[activity_id]" is missing from JSON.');
        assert(json[r'activity_id'] != null, 'Required key "IncidentRecord[activity_id]" has a null value in JSON.');
        assert(json.containsKey(r'error_message'), 'Required key "IncidentRecord[error_message]" is missing from JSON.');
        assert(json[r'error_message'] != null, 'Required key "IncidentRecord[error_message]" has a null value in JSON.');
        assert(json.containsKey(r'attempts_made'), 'Required key "IncidentRecord[attempts_made]" is missing from JSON.');
        assert(json[r'attempts_made'] != null, 'Required key "IncidentRecord[attempts_made]" has a null value in JSON.');
        assert(json.containsKey(r'resolved'), 'Required key "IncidentRecord[resolved]" is missing from JSON.');
        assert(json[r'resolved'] != null, 'Required key "IncidentRecord[resolved]" has a null value in JSON.');
        assert(json.containsKey(r'created_at'), 'Required key "IncidentRecord[created_at]" is missing from JSON.');
        assert(json[r'created_at'] != null, 'Required key "IncidentRecord[created_at]" has a null value in JSON.');
        return true;
      }());

      return IncidentRecord(
        id: mapValueOfType<String>(json, r'id')!,
        instanceId: mapValueOfType<String>(json, r'instance_id')!,
        activityId: mapValueOfType<String>(json, r'activity_id')!,
        errorMessage: mapValueOfType<String>(json, r'error_message')!,
        stackTrace: mapValueOfType<String>(json, r'stack_trace'),
        attemptsMade: mapValueOfType<int>(json, r'attempts_made')!,
        resolved: mapValueOfType<bool>(json, r'resolved')!,
        createdAt: mapDateTime(json, r'created_at', r'')!,
        resolvedAt: mapDateTime(json, r'resolved_at', r''),
      );
    }
    return null;
  }

  static List<IncidentRecord> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <IncidentRecord>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = IncidentRecord.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, IncidentRecord> mapFromJson(dynamic json) {
    final map = <String, IncidentRecord>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = IncidentRecord.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of IncidentRecord-objects as value to a dart map
  static Map<String, List<IncidentRecord>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<IncidentRecord>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = IncidentRecord.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'id',
    'instance_id',
    'activity_id',
    'error_message',
    'attempts_made',
    'resolved',
    'created_at',
  };
}

