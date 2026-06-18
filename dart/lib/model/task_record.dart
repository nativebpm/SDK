//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class TaskRecord {
  /// Returns a new [TaskRecord] instance.
  TaskRecord({
    required this.id,
    required this.instanceId,
    required this.activityId,
    required this.name,
    required this.assignee,
    required this.candidateGroups,
    required this.status,
    this.dueDate,
    this.inputSchema,
    required this.createdAt,
    this.claimedAt,
    this.completedAt,
    this.currentStep,
    this.draftVariables = const {},
  });

  String id;

  String instanceId;

  String activityId;

  String name;

  String assignee;

  String candidateGroups;

  String status;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  DateTime? dueDate;

  /// JSON schema definition of form widgets
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? inputSchema;

  DateTime createdAt;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  DateTime? claimedAt;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  DateTime? completedAt;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? currentStep;

  Map<String, Object> draftVariables;

  @override
  bool operator ==(Object other) => identical(this, other) || other is TaskRecord &&
    other.id == id &&
    other.instanceId == instanceId &&
    other.activityId == activityId &&
    other.name == name &&
    other.assignee == assignee &&
    other.candidateGroups == candidateGroups &&
    other.status == status &&
    other.dueDate == dueDate &&
    other.inputSchema == inputSchema &&
    other.createdAt == createdAt &&
    other.claimedAt == claimedAt &&
    other.completedAt == completedAt &&
    other.currentStep == currentStep &&
    _deepEquality.equals(other.draftVariables, draftVariables);

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id.hashCode) +
    (instanceId.hashCode) +
    (activityId.hashCode) +
    (name.hashCode) +
    (assignee.hashCode) +
    (candidateGroups.hashCode) +
    (status.hashCode) +
    (dueDate == null ? 0 : dueDate!.hashCode) +
    (inputSchema == null ? 0 : inputSchema!.hashCode) +
    (createdAt.hashCode) +
    (claimedAt == null ? 0 : claimedAt!.hashCode) +
    (completedAt == null ? 0 : completedAt!.hashCode) +
    (currentStep == null ? 0 : currentStep!.hashCode) +
    (draftVariables.hashCode);

  @override
  String toString() => 'TaskRecord[id=$id, instanceId=$instanceId, activityId=$activityId, name=$name, assignee=$assignee, candidateGroups=$candidateGroups, status=$status, dueDate=$dueDate, inputSchema=$inputSchema, createdAt=$createdAt, claimedAt=$claimedAt, completedAt=$completedAt, currentStep=$currentStep, draftVariables=$draftVariables]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'id'] = this.id;
      json[r'instance_id'] = this.instanceId;
      json[r'activity_id'] = this.activityId;
      json[r'name'] = this.name;
      json[r'assignee'] = this.assignee;
      json[r'candidate_groups'] = this.candidateGroups;
      json[r'status'] = this.status;
    if (this.dueDate != null) {
      json[r'due_date'] = this.dueDate!.toUtc().toIso8601String();
    } else {
      json[r'due_date'] = null;
    }
    if (this.inputSchema != null) {
      json[r'input_schema'] = this.inputSchema;
    } else {
      json[r'input_schema'] = null;
    }
      json[r'created_at'] = this.createdAt.toUtc().toIso8601String();
    if (this.claimedAt != null) {
      json[r'claimed_at'] = this.claimedAt!.toUtc().toIso8601String();
    } else {
      json[r'claimed_at'] = null;
    }
    if (this.completedAt != null) {
      json[r'completed_at'] = this.completedAt!.toUtc().toIso8601String();
    } else {
      json[r'completed_at'] = null;
    }
    if (this.currentStep != null) {
      json[r'current_step'] = this.currentStep;
    } else {
      json[r'current_step'] = null;
    }
      json[r'draft_variables'] = this.draftVariables;
    return json;
  }

  /// Returns a new [TaskRecord] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static TaskRecord? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        assert(json.containsKey(r'id'), 'Required key "TaskRecord[id]" is missing from JSON.');
        assert(json[r'id'] != null, 'Required key "TaskRecord[id]" has a null value in JSON.');
        assert(json.containsKey(r'instance_id'), 'Required key "TaskRecord[instance_id]" is missing from JSON.');
        assert(json[r'instance_id'] != null, 'Required key "TaskRecord[instance_id]" has a null value in JSON.');
        assert(json.containsKey(r'activity_id'), 'Required key "TaskRecord[activity_id]" is missing from JSON.');
        assert(json[r'activity_id'] != null, 'Required key "TaskRecord[activity_id]" has a null value in JSON.');
        assert(json.containsKey(r'name'), 'Required key "TaskRecord[name]" is missing from JSON.');
        assert(json[r'name'] != null, 'Required key "TaskRecord[name]" has a null value in JSON.');
        assert(json.containsKey(r'assignee'), 'Required key "TaskRecord[assignee]" is missing from JSON.');
        assert(json[r'assignee'] != null, 'Required key "TaskRecord[assignee]" has a null value in JSON.');
        assert(json.containsKey(r'candidate_groups'), 'Required key "TaskRecord[candidate_groups]" is missing from JSON.');
        assert(json[r'candidate_groups'] != null, 'Required key "TaskRecord[candidate_groups]" has a null value in JSON.');
        assert(json.containsKey(r'status'), 'Required key "TaskRecord[status]" is missing from JSON.');
        assert(json[r'status'] != null, 'Required key "TaskRecord[status]" has a null value in JSON.');
        assert(json.containsKey(r'created_at'), 'Required key "TaskRecord[created_at]" is missing from JSON.');
        assert(json[r'created_at'] != null, 'Required key "TaskRecord[created_at]" has a null value in JSON.');
        return true;
      }());

      return TaskRecord(
        id: mapValueOfType<String>(json, r'id')!,
        instanceId: mapValueOfType<String>(json, r'instance_id')!,
        activityId: mapValueOfType<String>(json, r'activity_id')!,
        name: mapValueOfType<String>(json, r'name')!,
        assignee: mapValueOfType<String>(json, r'assignee')!,
        candidateGroups: mapValueOfType<String>(json, r'candidate_groups')!,
        status: mapValueOfType<String>(json, r'status')!,
        dueDate: mapDateTime(json, r'due_date', r''),
        inputSchema: mapValueOfType<String>(json, r'input_schema'),
        createdAt: mapDateTime(json, r'created_at', r'')!,
        claimedAt: mapDateTime(json, r'claimed_at', r''),
        completedAt: mapDateTime(json, r'completed_at', r''),
        currentStep: mapValueOfType<int>(json, r'current_step'),
        draftVariables: mapCastOfType<String, Object>(json, r'draft_variables') ?? const {},
      );
    }
    return null;
  }

  static List<TaskRecord> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TaskRecord>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TaskRecord.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TaskRecord> mapFromJson(dynamic json) {
    final map = <String, TaskRecord>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TaskRecord.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of TaskRecord-objects as value to a dart map
  static Map<String, List<TaskRecord>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<TaskRecord>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = TaskRecord.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'id',
    'instance_id',
    'activity_id',
    'name',
    'assignee',
    'candidate_groups',
    'status',
    'created_at',
  };
}

