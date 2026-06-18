//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class WebhookDeliveryRecord {
  /// Returns a new [WebhookDeliveryRecord] instance.
  WebhookDeliveryRecord({
    required this.id,
    required this.webhookId,
    required this.tenantId,
    required this.eventType,
    required this.payload,
    required this.status,
    this.responseCode,
    this.responseBody,
    required this.attempts,
    this.nextRetry,
    required this.createdAt,
    this.processedAt,
  });

  String id;

  String webhookId;

  String tenantId;

  String eventType;

  String payload;

  String status;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? responseCode;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? responseBody;

  int attempts;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  DateTime? nextRetry;

  DateTime createdAt;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  DateTime? processedAt;

  @override
  bool operator ==(Object other) => identical(this, other) || other is WebhookDeliveryRecord &&
    other.id == id &&
    other.webhookId == webhookId &&
    other.tenantId == tenantId &&
    other.eventType == eventType &&
    other.payload == payload &&
    other.status == status &&
    other.responseCode == responseCode &&
    other.responseBody == responseBody &&
    other.attempts == attempts &&
    other.nextRetry == nextRetry &&
    other.createdAt == createdAt &&
    other.processedAt == processedAt;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (id.hashCode) +
    (webhookId.hashCode) +
    (tenantId.hashCode) +
    (eventType.hashCode) +
    (payload.hashCode) +
    (status.hashCode) +
    (responseCode == null ? 0 : responseCode!.hashCode) +
    (responseBody == null ? 0 : responseBody!.hashCode) +
    (attempts.hashCode) +
    (nextRetry == null ? 0 : nextRetry!.hashCode) +
    (createdAt.hashCode) +
    (processedAt == null ? 0 : processedAt!.hashCode);

  @override
  String toString() => 'WebhookDeliveryRecord[id=$id, webhookId=$webhookId, tenantId=$tenantId, eventType=$eventType, payload=$payload, status=$status, responseCode=$responseCode, responseBody=$responseBody, attempts=$attempts, nextRetry=$nextRetry, createdAt=$createdAt, processedAt=$processedAt]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'id'] = this.id;
      json[r'webhook_id'] = this.webhookId;
      json[r'tenant_id'] = this.tenantId;
      json[r'event_type'] = this.eventType;
      json[r'payload'] = this.payload;
      json[r'status'] = this.status;
    if (this.responseCode != null) {
      json[r'response_code'] = this.responseCode;
    } else {
      json[r'response_code'] = null;
    }
    if (this.responseBody != null) {
      json[r'response_body'] = this.responseBody;
    } else {
      json[r'response_body'] = null;
    }
      json[r'attempts'] = this.attempts;
    if (this.nextRetry != null) {
      json[r'next_retry'] = this.nextRetry!.toUtc().toIso8601String();
    } else {
      json[r'next_retry'] = null;
    }
      json[r'created_at'] = this.createdAt.toUtc().toIso8601String();
    if (this.processedAt != null) {
      json[r'processed_at'] = this.processedAt!.toUtc().toIso8601String();
    } else {
      json[r'processed_at'] = null;
    }
    return json;
  }

  /// Returns a new [WebhookDeliveryRecord] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static WebhookDeliveryRecord? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        assert(json.containsKey(r'id'), 'Required key "WebhookDeliveryRecord[id]" is missing from JSON.');
        assert(json[r'id'] != null, 'Required key "WebhookDeliveryRecord[id]" has a null value in JSON.');
        assert(json.containsKey(r'webhook_id'), 'Required key "WebhookDeliveryRecord[webhook_id]" is missing from JSON.');
        assert(json[r'webhook_id'] != null, 'Required key "WebhookDeliveryRecord[webhook_id]" has a null value in JSON.');
        assert(json.containsKey(r'tenant_id'), 'Required key "WebhookDeliveryRecord[tenant_id]" is missing from JSON.');
        assert(json[r'tenant_id'] != null, 'Required key "WebhookDeliveryRecord[tenant_id]" has a null value in JSON.');
        assert(json.containsKey(r'event_type'), 'Required key "WebhookDeliveryRecord[event_type]" is missing from JSON.');
        assert(json[r'event_type'] != null, 'Required key "WebhookDeliveryRecord[event_type]" has a null value in JSON.');
        assert(json.containsKey(r'payload'), 'Required key "WebhookDeliveryRecord[payload]" is missing from JSON.');
        assert(json[r'payload'] != null, 'Required key "WebhookDeliveryRecord[payload]" has a null value in JSON.');
        assert(json.containsKey(r'status'), 'Required key "WebhookDeliveryRecord[status]" is missing from JSON.');
        assert(json[r'status'] != null, 'Required key "WebhookDeliveryRecord[status]" has a null value in JSON.');
        assert(json.containsKey(r'attempts'), 'Required key "WebhookDeliveryRecord[attempts]" is missing from JSON.');
        assert(json[r'attempts'] != null, 'Required key "WebhookDeliveryRecord[attempts]" has a null value in JSON.');
        assert(json.containsKey(r'created_at'), 'Required key "WebhookDeliveryRecord[created_at]" is missing from JSON.');
        assert(json[r'created_at'] != null, 'Required key "WebhookDeliveryRecord[created_at]" has a null value in JSON.');
        return true;
      }());

      return WebhookDeliveryRecord(
        id: mapValueOfType<String>(json, r'id')!,
        webhookId: mapValueOfType<String>(json, r'webhook_id')!,
        tenantId: mapValueOfType<String>(json, r'tenant_id')!,
        eventType: mapValueOfType<String>(json, r'event_type')!,
        payload: mapValueOfType<String>(json, r'payload')!,
        status: mapValueOfType<String>(json, r'status')!,
        responseCode: mapValueOfType<int>(json, r'response_code'),
        responseBody: mapValueOfType<String>(json, r'response_body'),
        attempts: mapValueOfType<int>(json, r'attempts')!,
        nextRetry: mapDateTime(json, r'next_retry', r''),
        createdAt: mapDateTime(json, r'created_at', r'')!,
        processedAt: mapDateTime(json, r'processed_at', r''),
      );
    }
    return null;
  }

  static List<WebhookDeliveryRecord> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <WebhookDeliveryRecord>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = WebhookDeliveryRecord.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, WebhookDeliveryRecord> mapFromJson(dynamic json) {
    final map = <String, WebhookDeliveryRecord>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = WebhookDeliveryRecord.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of WebhookDeliveryRecord-objects as value to a dart map
  static Map<String, List<WebhookDeliveryRecord>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<WebhookDeliveryRecord>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = WebhookDeliveryRecord.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'id',
    'webhook_id',
    'tenant_id',
    'event_type',
    'payload',
    'status',
    'attempts',
    'created_at',
  };
}

