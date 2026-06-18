//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class CreateWebhookRequest {
  /// Returns a new [CreateWebhookRequest] instance.
  CreateWebhookRequest({
    required this.url,
    this.secret,
    this.events = const [],
    this.processId,
    this.isActive,
    this.enableAudit,
  });

  String url;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? secret;

  List<String> events;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? processId;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? isActive;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? enableAudit;

  @override
  bool operator ==(Object other) => identical(this, other) || other is CreateWebhookRequest &&
    other.url == url &&
    other.secret == secret &&
    _deepEquality.equals(other.events, events) &&
    other.processId == processId &&
    other.isActive == isActive &&
    other.enableAudit == enableAudit;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (url.hashCode) +
    (secret == null ? 0 : secret!.hashCode) +
    (events.hashCode) +
    (processId == null ? 0 : processId!.hashCode) +
    (isActive == null ? 0 : isActive!.hashCode) +
    (enableAudit == null ? 0 : enableAudit!.hashCode);

  @override
  String toString() => 'CreateWebhookRequest[url=$url, secret=$secret, events=$events, processId=$processId, isActive=$isActive, enableAudit=$enableAudit]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'url'] = this.url;
    if (this.secret != null) {
      json[r'secret'] = this.secret;
    } else {
      json[r'secret'] = null;
    }
      json[r'events'] = this.events;
    if (this.processId != null) {
      json[r'process_id'] = this.processId;
    } else {
      json[r'process_id'] = null;
    }
    if (this.isActive != null) {
      json[r'is_active'] = this.isActive;
    } else {
      json[r'is_active'] = null;
    }
    if (this.enableAudit != null) {
      json[r'enable_audit'] = this.enableAudit;
    } else {
      json[r'enable_audit'] = null;
    }
    return json;
  }

  /// Returns a new [CreateWebhookRequest] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static CreateWebhookRequest? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        assert(json.containsKey(r'url'), 'Required key "CreateWebhookRequest[url]" is missing from JSON.');
        assert(json[r'url'] != null, 'Required key "CreateWebhookRequest[url]" has a null value in JSON.');
        assert(json.containsKey(r'events'), 'Required key "CreateWebhookRequest[events]" is missing from JSON.');
        assert(json[r'events'] != null, 'Required key "CreateWebhookRequest[events]" has a null value in JSON.');
        return true;
      }());

      return CreateWebhookRequest(
        url: mapValueOfType<String>(json, r'url')!,
        secret: mapValueOfType<String>(json, r'secret'),
        events: json[r'events'] is Iterable
            ? (json[r'events'] as Iterable).cast<String>().toList(growable: false)
            : const [],
        processId: mapValueOfType<String>(json, r'process_id'),
        isActive: mapValueOfType<bool>(json, r'is_active'),
        enableAudit: mapValueOfType<bool>(json, r'enable_audit'),
      );
    }
    return null;
  }

  static List<CreateWebhookRequest> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <CreateWebhookRequest>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = CreateWebhookRequest.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, CreateWebhookRequest> mapFromJson(dynamic json) {
    final map = <String, CreateWebhookRequest>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = CreateWebhookRequest.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of CreateWebhookRequest-objects as value to a dart map
  static Map<String, List<CreateWebhookRequest>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<CreateWebhookRequest>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = CreateWebhookRequest.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'url',
    'events',
  };
}

