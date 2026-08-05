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
import 'course.dart' as _i2;
import 'course_node.dart' as _i3;
import 'node_embedding.dart' as _i4;
import 'node_todo.dart' as _i5;
import 'package:client/src/protocol/course.dart' as _i6;
import 'package:client/src/protocol/course_node.dart' as _i7;
import 'package:client/src/protocol/node_todo.dart' as _i8;
import 'package:serverpod_auth_client/serverpod_auth_client.dart' as _i9;
export 'course.dart';
export 'course_node.dart';
export 'node_embedding.dart';
export 'node_todo.dart';
export 'client.dart';

class Protocol extends _i1.SerializationManager {
  Protocol._();

  factory Protocol() => _instance;

  static final Protocol _instance = Protocol._();

  @override
  T deserialize<T>(
    dynamic data, [
    Type? t,
  ]) {
    t ??= T;
    if (t == _i2.Course) {
      return _i2.Course.fromJson(data) as T;
    }
    if (t == _i3.CourseNode) {
      return _i3.CourseNode.fromJson(data) as T;
    }
    if (t == _i4.NodeEmbedding) {
      return _i4.NodeEmbedding.fromJson(data) as T;
    }
    if (t == _i5.NodeTodo) {
      return _i5.NodeTodo.fromJson(data) as T;
    }
    if (t == _i1.getType<_i2.Course?>()) {
      return (data != null ? _i2.Course.fromJson(data) : null) as T;
    }
    if (t == _i1.getType<_i3.CourseNode?>()) {
      return (data != null ? _i3.CourseNode.fromJson(data) : null) as T;
    }
    if (t == _i1.getType<_i4.NodeEmbedding?>()) {
      return (data != null ? _i4.NodeEmbedding.fromJson(data) : null) as T;
    }
    if (t == _i1.getType<_i5.NodeTodo?>()) {
      return (data != null ? _i5.NodeTodo.fromJson(data) : null) as T;
    }
    if (t == Map<String, dynamic>) {
      return (data as Map).map((k, v) =>
          MapEntry(deserialize<String>(k), deserialize<dynamic>(v))) as T;
    }
    if (t == List<_i6.Course>) {
      return (data as List).map((e) => deserialize<_i6.Course>(e)).toList()
          as T;
    }
    if (t == List<_i7.CourseNode>) {
      return (data as List).map((e) => deserialize<_i7.CourseNode>(e)).toList()
          as T;
    }
    if (t == List<_i8.NodeTodo>) {
      return (data as List).map((e) => deserialize<_i8.NodeTodo>(e)).toList()
          as T;
    }
    try {
      return _i9.Protocol().deserialize<T>(data, t);
    } on _i1.DeserializationTypeNotFoundException catch (_) {}
    return super.deserialize<T>(data, t);
  }

  @override
  String? getClassNameForObject(Object? data) {
    String? className = super.getClassNameForObject(data);
    if (className != null) return className;
    if (data is _i2.Course) {
      return 'Course';
    }
    if (data is _i3.CourseNode) {
      return 'CourseNode';
    }
    if (data is _i4.NodeEmbedding) {
      return 'NodeEmbedding';
    }
    if (data is _i5.NodeTodo) {
      return 'NodeTodo';
    }
    className = _i9.Protocol().getClassNameForObject(data);
    if (className != null) {
      return 'serverpod_auth.$className';
    }
    return null;
  }

  @override
  dynamic deserializeByClassName(Map<String, dynamic> data) {
    var dataClassName = data['className'];
    if (dataClassName is! String) {
      return super.deserializeByClassName(data);
    }
    if (dataClassName == 'Course') {
      return deserialize<_i2.Course>(data['data']);
    }
    if (dataClassName == 'CourseNode') {
      return deserialize<_i3.CourseNode>(data['data']);
    }
    if (dataClassName == 'NodeEmbedding') {
      return deserialize<_i4.NodeEmbedding>(data['data']);
    }
    if (dataClassName == 'NodeTodo') {
      return deserialize<_i5.NodeTodo>(data['data']);
    }
    if (dataClassName.startsWith('serverpod_auth.')) {
      data['className'] = dataClassName.substring(15);
      return _i9.Protocol().deserializeByClassName(data);
    }
    return super.deserializeByClassName(data);
  }
}
