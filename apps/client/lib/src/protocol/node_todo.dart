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

abstract class NodeTodo implements _i1.SerializableModel {
  NodeTodo._({
    this.id,
    required this.nodeId,
    required this.userId,
    required this.title,
    required this.isCompleted,
    this.priority,
    this.dueDate,
    this.createdAt,
  });

  factory NodeTodo({
    int? id,
    required _i1.UuidValue nodeId,
    required _i1.UuidValue userId,
    required String title,
    required bool isCompleted,
    String? priority,
    DateTime? dueDate,
    DateTime? createdAt,
  }) = _NodeTodoImpl;

  factory NodeTodo.fromJson(Map<String, dynamic> jsonSerialization) {
    return NodeTodo(
      id: jsonSerialization['id'] as int?,
      nodeId: _i1.UuidValueJsonExtension.fromJson(jsonSerialization['nodeId']),
      userId: _i1.UuidValueJsonExtension.fromJson(jsonSerialization['userId']),
      title: jsonSerialization['title'] as String,
      isCompleted: jsonSerialization['isCompleted'] as bool,
      priority: jsonSerialization['priority'] as String?,
      dueDate: jsonSerialization['dueDate'] == null
          ? null
          : _i1.DateTimeJsonExtension.fromJson(jsonSerialization['dueDate']),
      createdAt: jsonSerialization['createdAt'] == null
          ? null
          : _i1.DateTimeJsonExtension.fromJson(jsonSerialization['createdAt']),
    );
  }

  /// The database id, set if the object has been inserted into the
  /// database or if it has been fetched from the database. Otherwise,
  /// the id will be null.
  int? id;

  _i1.UuidValue nodeId;

  _i1.UuidValue userId;

  String title;

  bool isCompleted;

  String? priority;

  DateTime? dueDate;

  DateTime? createdAt;

  /// Returns a shallow copy of this [NodeTodo]
  /// with some or all fields replaced by the given arguments.
  @_i1.useResult
  NodeTodo copyWith({
    int? id,
    _i1.UuidValue? nodeId,
    _i1.UuidValue? userId,
    String? title,
    bool? isCompleted,
    String? priority,
    DateTime? dueDate,
    DateTime? createdAt,
  });
  @override
  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'nodeId': nodeId.toJson(),
      'userId': userId.toJson(),
      'title': title,
      'isCompleted': isCompleted,
      if (priority != null) 'priority': priority,
      if (dueDate != null) 'dueDate': dueDate?.toJson(),
      if (createdAt != null) 'createdAt': createdAt?.toJson(),
    };
  }

  @override
  String toString() {
    return _i1.SerializationManager.encode(this);
  }
}

class _Undefined {}

class _NodeTodoImpl extends NodeTodo {
  _NodeTodoImpl({
    int? id,
    required _i1.UuidValue nodeId,
    required _i1.UuidValue userId,
    required String title,
    required bool isCompleted,
    String? priority,
    DateTime? dueDate,
    DateTime? createdAt,
  }) : super._(
          id: id,
          nodeId: nodeId,
          userId: userId,
          title: title,
          isCompleted: isCompleted,
          priority: priority,
          dueDate: dueDate,
          createdAt: createdAt,
        );

  /// Returns a shallow copy of this [NodeTodo]
  /// with some or all fields replaced by the given arguments.
  @_i1.useResult
  @override
  NodeTodo copyWith({
    Object? id = _Undefined,
    _i1.UuidValue? nodeId,
    _i1.UuidValue? userId,
    String? title,
    bool? isCompleted,
    Object? priority = _Undefined,
    Object? dueDate = _Undefined,
    Object? createdAt = _Undefined,
  }) {
    return NodeTodo(
      id: id is int? ? id : this.id,
      nodeId: nodeId ?? this.nodeId,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      isCompleted: isCompleted ?? this.isCompleted,
      priority: priority is String? ? priority : this.priority,
      dueDate: dueDate is DateTime? ? dueDate : this.dueDate,
      createdAt: createdAt is DateTime? ? createdAt : this.createdAt,
    );
  }
}
