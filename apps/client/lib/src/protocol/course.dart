/* AUTOMATICALLY GENERATED CODE DO NOT MODIFY */
/*   To generate run: "serverpod generate"    */

// ignore_for_file: implementation_imports
// ignore_for_file: library_private_types_in_public_api
// ignore_for_file: non_constant_identifier_names
// ignore_for_file: public_member_api_docs
// ignore_for_file: type_literal_in_constant_pattern
// ignore_for_file: use_super_parameters

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:serverpod_client/serverpod_client.dart' as _i1;

abstract class Course implements _i1.SerializableModel {
  Course._({
    this.id,
    required this.userId,
    required this.title,
    this.description,
    this.isPublic,
    this.createdAt,
  });

  factory Course({
    int? id,
    required _i1.UuidValue userId,
    required String title,
    String? description,
    bool? isPublic,
    DateTime? createdAt,
  }) = _CourseImpl;

  factory Course.fromJson(Map<String, dynamic> jsonSerialization) {
    return Course(
      id: jsonSerialization['id'] as int?,
      userId: _i1.UuidValueJsonExtension.fromJson(jsonSerialization['userId']),
      title: jsonSerialization['title'] as String,
      description: jsonSerialization['description'] as String?,
      isPublic: jsonSerialization['isPublic'] as bool?,
      createdAt: jsonSerialization['createdAt'] == null
          ? null
          : _i1.DateTimeJsonExtension.fromJson(jsonSerialization['createdAt']),
    );
  }

  /// The database id, set if the object has been inserted into the
  /// database or if it has been fetched from the database. Otherwise,
  /// the id will be null.
  int? id;

  _i1.UuidValue userId;

  String title;

  String? description;

  bool? isPublic;

  DateTime? createdAt;

  /// Returns a shallow copy of this [Course]
  /// with some or all fields replaced by the given arguments.
  @_i1.useResult
  Course copyWith({
    int? id,
    _i1.UuidValue? userId,
    String? title,
    String? description,
    bool? isPublic,
    DateTime? createdAt,
  });
  @override
  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'userId': userId.toJson(),
      'title': title,
      if (description != null) 'description': description,
      if (isPublic != null) 'isPublic': isPublic,
      if (createdAt != null) 'createdAt': createdAt?.toJson(),
    };
  }

  @override
  String toString() {
    return _i1.SerializationManager.encode(this);
  }
}

class _Undefined {}

class _CourseImpl extends Course {
  _CourseImpl({
    int? id,
    required _i1.UuidValue userId,
    required String title,
    String? description,
    bool? isPublic,
    DateTime? createdAt,
  }) : super._(
          id: id,
          userId: userId,
          title: title,
          description: description,
          isPublic: isPublic,
          createdAt: createdAt,
        );

  /// Returns a shallow copy of this [Course]
  /// with some or all fields replaced by the given arguments.
  @_i1.useResult
  @override
  Course copyWith({
    Object? id = _Undefined,
    _i1.UuidValue? userId,
    String? title,
    Object? description = _Undefined,
    Object? isPublic = _Undefined,
    Object? createdAt = _Undefined,
  }) {
    return Course(
      id: id is int? ? id : this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      description: description is String? ? description : this.description,
      isPublic: isPublic is bool? ? isPublic : this.isPublic,
      createdAt: createdAt is DateTime? ? createdAt : this.createdAt,
    );
  }
}
