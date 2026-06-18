//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class ProcessDefinition {
  /// Returns a new [ProcessDefinition] instance.
  ProcessDefinition({
    required this.hash,
    required this.id,
    required this.name,
    required this.xmlData,
    required this.deployedAt,
  });

  /// MD5/SHA256 content hash of the process XML schema definition
  String hash;

  /// Unique process definition identifier
  String id;

  /// Friendly name of the process
  String name;

  /// Base64-encoded raw BPMN 2.0 XML schema data
  String xmlData;

  DateTime deployedAt;

  @override
  bool operator ==(Object other) => identical(this, other) || other is ProcessDefinition &&
    other.hash == hash &&
    other.id == id &&
    other.name == name &&
    other.xmlData == xmlData &&
    other.deployedAt == deployedAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (hash.hashCode) +
    (id.hashCode) +
    (name.hashCode) +
    (xmlData.hashCode) +
    (deployedAt.hashCode);

  @override
  String toString() => 'ProcessDefinition[hash=$hash, id=$id, name=$name, xmlData=$xmlData, deployedAt=$deployedAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'hash'] = this.hash;
      json[r'id'] = this.id;
      json[r'name'] = this.name;
      json[r'xml_data'] = this.xmlData;
      json[r'deployed_at'] = this.deployedAt.toUtc().toIso8601String();
    return json;
  }

  /// Returns a new [ProcessDefinition] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ProcessDefinition? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        assert(json.containsKey(r'hash'), 'Required key "ProcessDefinition[hash]" is missing from JSON.');
        assert(json[r'hash'] != null, 'Required key "ProcessDefinition[hash]" has a null value in JSON.');
        assert(json.containsKey(r'id'), 'Required key "ProcessDefinition[id]" is missing from JSON.');
        assert(json[r'id'] != null, 'Required key "ProcessDefinition[id]" has a null value in JSON.');
        assert(json.containsKey(r'name'), 'Required key "ProcessDefinition[name]" is missing from JSON.');
        assert(json[r'name'] != null, 'Required key "ProcessDefinition[name]" has a null value in JSON.');
        assert(json.containsKey(r'xml_data'), 'Required key "ProcessDefinition[xml_data]" is missing from JSON.');
        assert(json[r'xml_data'] != null, 'Required key "ProcessDefinition[xml_data]" has a null value in JSON.');
        assert(json.containsKey(r'deployed_at'), 'Required key "ProcessDefinition[deployed_at]" is missing from JSON.');
        assert(json[r'deployed_at'] != null, 'Required key "ProcessDefinition[deployed_at]" has a null value in JSON.');
        return true;
      }());

      return ProcessDefinition(
        hash: mapValueOfType<String>(json, r'hash')!,
        id: mapValueOfType<String>(json, r'id')!,
        name: mapValueOfType<String>(json, r'name')!,
        xmlData: mapValueOfType<String>(json, r'xml_data')!,
        deployedAt: mapDateTime(json, r'deployed_at', r'')!,
      );
    }
    return null;
  }

  static List<ProcessDefinition> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ProcessDefinition>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ProcessDefinition.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ProcessDefinition> mapFromJson(dynamic json) {
    final map = <String, ProcessDefinition>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ProcessDefinition.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ProcessDefinition-objects as value to a dart map
  static Map<String, List<ProcessDefinition>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ProcessDefinition>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ProcessDefinition.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'hash',
    'id',
    'name',
    'xml_data',
    'deployed_at',
  };
}

