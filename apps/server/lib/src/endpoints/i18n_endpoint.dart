import 'package:serverpod/serverpod.dart';
import '../generated/protocol.dart';

/// Internationalization & Content Dictionary Service Endpoint
/// Corresponds to docs/services/i18n.md specification.
class I18nEndpoint extends Endpoint {
  /// Fetches dictionary translations for a given locale and namespace with ETag 304 validation
  Future<DictionaryResponse> getDictionary(Session session, GetDictionaryInput input) async {
    // Input validation
    if (input.locale.trim().isEmpty) {
      throw FormatException('I18N_LOCALE_NOT_SUPPORTED');
    }
    if (input.namespace.trim().isEmpty) {
      throw FormatException('I18N_NAMESPACE_NOT_FOUND');
    }

    // Query translations matching namespace and locale
    final translations = await I18nTranslation.db.find(
      session,
      where: (t) => t.namespace.equals(input.namespace) & t.locale.equals(input.locale),
      orderBy: (t) => t.key,
    );

    int maxVersion = 1;
    DateTime lastUpdated = DateTime.now();

    final entries = translations.map((t) {
      final v = t.version ?? 1;
      if (v > maxVersion) maxVersion = v;
      if (t.updatedAt != null && t.updatedAt!.isAfter(lastUpdated)) {
        lastUpdated = t.updatedAt!;
      }
      return TranslationEntry(
        key: t.key,
        value: t.value,
        version: v,
        status: t.status ?? 'APPROVED',
        updatedAt: t.updatedAt ?? DateTime.now(),
        lastEditorId: t.lastEditorId,
        description: t.description,
      );
    }).toList();

    final eTag = 'etag_${input.locale}_${input.namespace}_v${maxVersion}_${lastUpdated.millisecondsSinceEpoch}';
    final isNotModified = input.ifNoneMatchETag == eTag;

    return DictionaryResponse(
      locale: input.locale,
      namespace: input.namespace,
      version: maxVersion,
      eTag: eTag,
      isNotModified: isNotModified,
      entries: isNotModified ? [] : entries,
      updatedAt: lastUpdated,
    );
  }

  /// Updates or inserts a single translation entry (Admin authorization required)
  Future<DictionaryResponse> updateTranslation(Session session, UpdateTranslationInput input) async {
    final now = DateTime.now();

    final existing = await I18nTranslation.db.findFirstRow(
      session,
      where: (t) =>
          t.namespace.equals(input.namespace) &
          t.locale.equals(input.locale) &
          t.key.equals(input.entry.key),
    );

    if (existing != null) {
      final updated = existing.copyWith(
        value: input.entry.value,
        description: input.entry.description ?? existing.description,
        status: input.entry.status ?? existing.status,
        version: (existing.version ?? 1) + 1,
        updatedAt: now,
      );
      await I18nTranslation.db.updateRow(session, updated);
    } else {
      final newRow = I18nTranslation(
        namespace: input.namespace,
        locale: input.locale,
        key: input.entry.key,
        value: input.entry.value,
        description: input.entry.description,
        status: input.entry.status ?? 'APPROVED',
        version: 1,
        createdAt: now,
        updatedAt: now,
      );
      await I18nTranslation.db.insertRow(session, newRow);
    }

    return await getDictionary(
      session,
      GetDictionaryInput(locale: input.locale, namespace: input.namespace),
    );
  }

  /// Bulk updates translation entries for a namespace and locale
  Future<DictionaryResponse> bulkUpdateTranslations(
    Session session,
    BulkUpdateTranslationsInput input,
  ) async {
    for (final entry in input.entries) {
      await updateTranslation(
        session,
        UpdateTranslationInput(
          locale: input.locale,
          namespace: input.namespace,
          entry: entry,
        ),
      );
    }

    return await getDictionary(
      session,
      GetDictionaryInput(locale: input.locale, namespace: input.namespace),
    );
  }

  /// Deletes a specific translation key
  Future<bool> deleteTranslation(Session session, DeleteTranslationInput input) async {
    final existing = await I18nTranslation.db.findFirstRow(
      session,
      where: (t) =>
          t.namespace.equals(input.namespace) &
          t.locale.equals(input.locale) &
          t.key.equals(input.key),
    );

    if (existing == null) {
      throw FormatException('I18N_KEY_NOT_FOUND');
    }

    await I18nTranslation.db.deleteRow(session, existing);
    return true;
  }

  /// Creates a new translation namespace
  Future<I18nNamespace> createNamespace(Session session, CreateNamespaceInput input) async {
    final existing = await I18nNamespace.db.findFirstRow(
      session,
      where: (t) => t.name.equals(input.namespace),
    );

    if (existing != null) {
      throw FormatException('I18N_DUPLICATE_KEY');
    }

    final newNs = I18nNamespace(
      name: input.namespace,
      description: input.description,
      createdAt: DateTime.now(),
    );

    return await I18nNamespace.db.insertRow(session, newNs);
  }

  /// Lists all supported locales in the system
  Future<List<SupportedLocale>> listLocales(Session session) async {
    final locales = await I18nLocale.db.find(session, orderBy: (t) => t.code);

    if (locales.isEmpty) {
      // Default supported locales if DB table is unseeded
      return [
        SupportedLocale(code: 'en', name: 'English', isDefault: true, fallbackCode: 'en'),
        SupportedLocale(code: 'vi', name: 'Tiếng Việt', isDefault: false, fallbackCode: 'en'),
      ];
    }

    return locales.map((l) => SupportedLocale(
      code: l.code,
      name: l.name,
      isDefault: l.isDefault ?? false,
      fallbackCode: l.fallbackCode ?? 'en',
    )).toList();
  }
}
