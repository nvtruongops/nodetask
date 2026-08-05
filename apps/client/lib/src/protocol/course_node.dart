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

abstract class CourseNode implements _i1.SerializableModel {
  CourseNode._({
    this.id,
    required this.courseId,
    this.parentId,
    this.path,
    required this.nodeType,
    required this.title,
    this.content,
    required this.position,
    required this.version,
    this.createdAt,
  });

  factory CourseNode({
    int? id,
    required _i1.UuidValue courseId,
    _i1.UuidValue? parentId,
    String? path,
    required String nodeType,
    required String title,
    String? content,
    required int position,
    required int version,
    DateTime? createdAt,
  }) = _CourseNodeImpl;

  factory CourseNode.fromJson(Map<String, dynamic> jsonSerialization) {
    return CourseNode(
      id: jsonSerialization['id'] as int?,
      courseId:
          _i1.UuidValueJsonExtension.fromJson(jsonSerialization['courseId']),
      parentId: jsonSerialization['parentId'] == null
          ? null
          : _i1.UuidValueJsonExtension.fromJson(jsonSerialization['parentId']),
      path: jsonSerialization['path'] as String?,
      nodeType: jsonSerialization['nodeType'] as String,
      title: jsonSerialization['title'] as String,
      content: jsonSerialization['content'] as String?,
      position: jsonSerialization['position'] as int,
      version: jsonSerialization['version'] as int,
      createdAt: jsonSerialization['createdAt'] == null
          ? null
          : _i1.DateTimeJsonExtension.fromJson(jsonSerialization['createdAt']),
    );
  }

  /// The database id, set if the object has been inserted into the
  /// database or if it has been fetched from the database. Otherwise,
  /// the id will be null.
  int? id;

  _i1.UuidValue courseId;

  _i1.UuidValue? parentId;

  String? path;

  String nodeType;

  String title;

  String? content;

  int position;

  int version;

  DateTime? createdAt;

  /// Returns a shallow copy of this [CourseNode]
  /// with some or all fields replaced by the given arguments.
  @_i1.useResult
  CourseNode copyWith({
    int? id,
    _i1.UuidValue? courseId,
    _i1.UuidValue? parentId,
    String? path,
    String? nodeType,
    String? title,
    String? content,
    int? position,
    int? version,
    DateTime? createdAt,
  });
  @override
  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'courseId': courseId.toJson(),
      if (parentId != null) 'parentId': parentId?.toJson(),
      if (path != null) 'path': path,
      'nodeType': nodeType,
      'title': title,
      if (content != null) 'content': content,
      'position': position,
      'version': version,
      if (createdAt != null) 'createdAt': createdAt?.toJson(),
    };
  }

  @override
  String toString() {
    return _i1.SerializationManager.encode(this);
  }
}

class _Undefined {}

class _CourseNodeImpl extends CourseNode {
  _CourseNodeImpl({
    int? id,
    required _i1.UuidValue courseId,
    _i1.UuidValue? parentId,
    String? path,
    required String nodeType,
    required String title,
    String? content,
    required int position,
    required int version,
    DateTime? createdAt,
  }) : super._(
          id: id,
          courseId: courseId,
          parentId: parentId,
          path: path,
          nodeType: nodeType,
          title: title,
          content: content,
          position: position,
          version: version,
          createdAt: createdAt,
        );

  /// Returns a shallow copy of this [CourseNode]
  /// with some or all fields replaced by the given arguments.
  @_i1.useResult
  @override
  CourseNode copyWith({
    Object? id = _Undefined,
    _i1.UuidValue? courseId,
    Object? parentId = _Undefined,
    Object? path = _Undefined,
    String? nodeType,
    String? title,
    Object? content = _Undefined,
    int? position,
    int? version,
    Object? createdAt = _Undefined,
  }) {
    return CourseNode(
      id: id is int? ? id : this.id,
      courseId: courseId ?? this.courseId,
      parentId: parentId is _i1.UuidValue? ? parentId : this.parentId,
      path: path is String? ? path : this.path,
      nodeType: nodeType ?? this.nodeType,
      title: title ?? this.title,
      content: content is String? ? content : this.content,
      position: position ?? this.position,
      version: version ?? this.version,
      createdAt: createdAt is DateTime? ? createdAt : this.createdAt,
    );
  }
}
