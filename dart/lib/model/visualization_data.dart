//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class VisualizationData {
  /// Returns a new [VisualizationData] instance.
  VisualizationData({
    required this.instanceId,
    required this.definitionId,
    required this.xml,
    this.activeNodes = const [],
    this.waitingNodes = const [],
    this.completedNodes = const [],
    this.history = const [],
    required this.completed,
  });

  String instanceId;

  String definitionId;

  String xml;

  List<String> activeNodes;

  List<String> waitingNodes;

  List<String> completedNodes;

  List<HistoryRecord> history;

  bool completed;

  @override
  bool operator ==(Object other) => identical(this, other) || other is VisualizationData &&
    other.instanceId == instanceId &&
    other.definitionId == definitionId &&
    other.xml == xml &&
    _deepEquality.equals(other.activeNodes, activeNodes) &&
    _deepEquality.equals(other.waitingNodes, waitingNodes) &&
    _deepEquality.equals(other.completedNodes, completedNodes) &&
    _deepEquality.equals(other.history, history) &&
    other.completed == completed;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (instanceId.hashCode) +
    (definitionId.hashCode) +
    (xml.hashCode) +
    (activeNodes.hashCode) +
    (waitingNodes.hashCode) +
    (completedNodes.hashCode) +
    (history.hashCode) +
    (completed.hashCode);

  @override
  String toString() => 'VisualizationData[instanceId=$instanceId, definitionId=$definitionId, xml=$xml, activeNodes=$activeNodes, waitingNodes=$waitingNodes, completedNodes=$completedNodes, history=$history, completed=$completed]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'instance_id'] = this.instanceId;
      json[r'definition_id'] = this.definitionId;
      json[r'xml'] = this.xml;
      json[r'active_nodes'] = this.activeNodes;
      json[r'waiting_nodes'] = this.waitingNodes;
      json[r'completed_nodes'] = this.completedNodes;
      json[r'history'] = this.history;
      json[r'completed'] = this.completed;
    return json;
  }

  /// Returns a new [VisualizationData] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static VisualizationData? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        assert(json.containsKey(r'instance_id'), 'Required key "VisualizationData[instance_id]" is missing from JSON.');
        assert(json[r'instance_id'] != null, 'Required key "VisualizationData[instance_id]" has a null value in JSON.');
        assert(json.containsKey(r'definition_id'), 'Required key "VisualizationData[definition_id]" is missing from JSON.');
        assert(json[r'definition_id'] != null, 'Required key "VisualizationData[definition_id]" has a null value in JSON.');
        assert(json.containsKey(r'xml'), 'Required key "VisualizationData[xml]" is missing from JSON.');
        assert(json[r'xml'] != null, 'Required key "VisualizationData[xml]" has a null value in JSON.');
        assert(json.containsKey(r'active_nodes'), 'Required key "VisualizationData[active_nodes]" is missing from JSON.');
        assert(json[r'active_nodes'] != null, 'Required key "VisualizationData[active_nodes]" has a null value in JSON.');
        assert(json.containsKey(r'waiting_nodes'), 'Required key "VisualizationData[waiting_nodes]" is missing from JSON.');
        assert(json[r'waiting_nodes'] != null, 'Required key "VisualizationData[waiting_nodes]" has a null value in JSON.');
        assert(json.containsKey(r'completed_nodes'), 'Required key "VisualizationData[completed_nodes]" is missing from JSON.');
        assert(json[r'completed_nodes'] != null, 'Required key "VisualizationData[completed_nodes]" has a null value in JSON.');
        assert(json.containsKey(r'history'), 'Required key "VisualizationData[history]" is missing from JSON.');
        assert(json[r'history'] != null, 'Required key "VisualizationData[history]" has a null value in JSON.');
        assert(json.containsKey(r'completed'), 'Required key "VisualizationData[completed]" is missing from JSON.');
        assert(json[r'completed'] != null, 'Required key "VisualizationData[completed]" has a null value in JSON.');
        return true;
      }());

      return VisualizationData(
        instanceId: mapValueOfType<String>(json, r'instance_id')!,
        definitionId: mapValueOfType<String>(json, r'definition_id')!,
        xml: mapValueOfType<String>(json, r'xml')!,
        activeNodes: json[r'active_nodes'] is Iterable
            ? (json[r'active_nodes'] as Iterable).cast<String>().toList(growable: false)
            : const [],
        waitingNodes: json[r'waiting_nodes'] is Iterable
            ? (json[r'waiting_nodes'] as Iterable).cast<String>().toList(growable: false)
            : const [],
        completedNodes: json[r'completed_nodes'] is Iterable
            ? (json[r'completed_nodes'] as Iterable).cast<String>().toList(growable: false)
            : const [],
        history: HistoryRecord.listFromJson(json[r'history']),
        completed: mapValueOfType<bool>(json, r'completed')!,
      );
    }
    return null;
  }

  static List<VisualizationData> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <VisualizationData>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = VisualizationData.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, VisualizationData> mapFromJson(dynamic json) {
    final map = <String, VisualizationData>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = VisualizationData.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of VisualizationData-objects as value to a dart map
  static Map<String, List<VisualizationData>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<VisualizationData>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = VisualizationData.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'instance_id',
    'definition_id',
    'xml',
    'active_nodes',
    'waiting_nodes',
    'completed_nodes',
    'history',
    'completed',
  };
}

