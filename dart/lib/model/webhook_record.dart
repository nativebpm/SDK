//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class WebhookRecord {
  /// Returns a new [WebhookRecord] instance.
  WebhookRecord({
    required this.id,
    required this.tenantId,
    required this.url,
    this.secret,
    this.events = const [],
    this.processId,
    required this.isActive,
    required this.enableAudit,
    required this.status,
    required this.createdAt,
  });

  String id;

  String tenantId;

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

  bool isActive;

  bool enableAudit;

  String status;

  DateTime createdAt;

  @override
  bool operator ==(Object other) => identical(this, other) || other is WebhookRecord &&
    other.id == id &&
    other.tenantId == tenantId &&
    other.url == url &&
    other.secret == secret &&
    _deepEquality.equals(other.events, events) &&
    other.processId == processId &&
    other.isActive == isActive &&
    other.enableAudit == enableAudit &&
    other.status == status &&
    other.createdAt == createdAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id.hashCode) +
    (tenantId.hashCode) +
    (url.hashCode) +
    (secret == null ? 0 : secret!.hashCode) +
    (events.hashCode) +
    (processId == null ? 0 : processId!.hashCode) +
    (isActive.hashCode) +
    (enableAudit.hashCode) +
    (status.hashCode) +
    (createdAt.hashCode);

  @override
  String toString() => 'WebhookRecord[id=$id, tenantId=$tenantId, url=$url, secret=$secret, events=$events, processId=$processId, isActive=$isActive, enableAudit=$enableAudit, status=$status, createdAt=$createdAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'id'] = this.id;
      json[r'tenant_id'] = this.tenantId;
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
      json[r'is_active'] = this.isActive;
      json[r'enable_audit'] = this.enableAudit;
      json[r'status'] = this.status;
      json[r'created_at'] = this.createdAt.toUtc().toIso8601String();
    return json;
  }

  /// Returns a new [WebhookRecord] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static WebhookRecord? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        assert(json.containsKey(r'id'), 'Required key "WebhookRecord[id]" is missing from JSON.');
        assert(json[r'id'] != null, 'Required key "WebhookRecord[id]" has a null value in JSON.');
        assert(json.containsKey(r'tenant_id'), 'Required key "WebhookRecord[tenant_id]" is missing from JSON.');
        assert(json[r'tenant_id'] != null, 'Required key "WebhookRecord[tenant_id]" has a null value in JSON.');
        assert(json.containsKey(r'url'), 'Required key "WebhookRecord[url]" is missing from JSON.');
        assert(json[r'url'] != null, 'Required key "WebhookRecord[url]" has a null value in JSON.');
        assert(json.containsKey(r'events'), 'Required key "WebhookRecord[events]" is missing from JSON.');
        assert(json[r'events'] != null, 'Required key "WebhookRecord[events]" has a null value in JSON.');
        assert(json.containsKey(r'is_active'), 'Required key "WebhookRecord[is_active]" is missing from JSON.');
        assert(json[r'is_active'] != null, 'Required key "WebhookRecord[is_active]" has a null value in JSON.');
        assert(json.containsKey(r'enable_audit'), 'Required key "WebhookRecord[enable_audit]" is missing from JSON.');
        assert(json[r'enable_audit'] != null, 'Required key "WebhookRecord[enable_audit]" has a null value in JSON.');
        assert(json.containsKey(r'status'), 'Required key "WebhookRecord[status]" is missing from JSON.');
        assert(json[r'status'] != null, 'Required key "WebhookRecord[status]" has a null value in JSON.');
        assert(json.containsKey(r'created_at'), 'Required key "WebhookRecord[created_at]" is missing from JSON.');
        assert(json[r'created_at'] != null, 'Required key "WebhookRecord[created_at]" has a null value in JSON.');
        return true;
      }());

      return WebhookRecord(
        id: mapValueOfType<String>(json, r'id')!,
        tenantId: mapValueOfType<String>(json, r'tenant_id')!,
        url: mapValueOfType<String>(json, r'url')!,
        secret: mapValueOfType<String>(json, r'secret'),
        events: json[r'events'] is Iterable
            ? (json[r'events'] as Iterable).cast<String>().toList(growable: false)
            : const [],
        processId: mapValueOfType<String>(json, r'process_id'),
        isActive: mapValueOfType<bool>(json, r'is_active')!,
        enableAudit: mapValueOfType<bool>(json, r'enable_audit')!,
        status: mapValueOfType<String>(json, r'status')!,
        createdAt: mapDateTime(json, r'created_at', r'')!,
      );
    }
    return null;
  }

  static List<WebhookRecord> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <WebhookRecord>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = WebhookRecord.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, WebhookRecord> mapFromJson(dynamic json) {
    final map = <String, WebhookRecord>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = WebhookRecord.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of WebhookRecord-objects as value to a dart map
  static Map<String, List<WebhookRecord>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<WebhookRecord>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = WebhookRecord.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'id',
    'tenant_id',
    'url',
    'events',
    'is_active',
    'enable_audit',
    'status',
    'created_at',
  };
}

