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
import 'dart:async' as _i2;
import 'package:uuid/uuid_value.dart' as _i3;
import 'package:client/src/protocol/course.dart' as _i4;
import 'package:client/src/protocol/course_node.dart' as _i5;
import 'package:client/src/protocol/node_todo.dart' as _i6;
import 'package:serverpod_auth_client/serverpod_auth_client.dart' as _i7;
import 'protocol.dart' as _i8;

/// {@category Endpoint}
class EndpointAi extends _i1.EndpointRef {
  EndpointAi(_i1.EndpointCaller caller) : super(caller);

  @override
  String get name => 'ai';

  _i2.Future<Map<String, dynamic>> search(
    String query,
    int? topK,
  ) =>
      caller.callServerEndpoint<Map<String, dynamic>>(
        'ai',
        'search',
        {
          'query': query,
          'topK': topK,
        },
      );

  _i2.Future<Map<String, dynamic>> ask(
    String question,
    _i3.UuidValue? courseId,
  ) =>
      caller.callServerEndpoint<Map<String, dynamic>>(
        'ai',
        'ask',
        {
          'question': question,
          'courseId': courseId,
        },
      );
}

/// {@category Endpoint}
class EndpointAuth extends _i1.EndpointRef {
  EndpointAuth(_i1.EndpointCaller caller) : super(caller);

  @override
  String get name => 'auth';

  _i2.Future<Map<String, dynamic>> login(
    String email,
    String password,
  ) =>
      caller.callServerEndpoint<Map<String, dynamic>>(
        'auth',
        'login',
        {
          'email': email,
          'password': password,
        },
      );

  _i2.Future<Map<String, dynamic>> register(
    String email,
    String password,
  ) =>
      caller.callServerEndpoint<Map<String, dynamic>>(
        'auth',
        'register',
        {
          'email': email,
          'password': password,
        },
      );
}

/// {@category Endpoint}
class EndpointCourse extends _i1.EndpointRef {
  EndpointCourse(_i1.EndpointCaller caller) : super(caller);

  @override
  String get name => 'course';

  _i2.Future<List<_i4.Course>> getCourses() =>
      caller.callServerEndpoint<List<_i4.Course>>(
        'course',
        'getCourses',
        {},
      );

  _i2.Future<_i4.Course> createCourse(_i4.Course course) =>
      caller.callServerEndpoint<_i4.Course>(
        'course',
        'createCourse',
        {'course': course},
      );

  _i2.Future<List<_i5.CourseNode>> getCourseTree(_i3.UuidValue courseId) =>
      caller.callServerEndpoint<List<_i5.CourseNode>>(
        'course',
        'getCourseTree',
        {'courseId': courseId},
      );
}

/// {@category Endpoint}
class EndpointNode extends _i1.EndpointRef {
  EndpointNode(_i1.EndpointCaller caller) : super(caller);

  @override
  String get name => 'node';

  _i2.Future<_i5.CourseNode> createNode(_i5.CourseNode node) =>
      caller.callServerEndpoint<_i5.CourseNode>(
        'node',
        'createNode',
        {'node': node},
      );

  _i2.Future<_i5.CourseNode> updateNode(_i5.CourseNode node) =>
      caller.callServerEndpoint<_i5.CourseNode>(
        'node',
        'updateNode',
        {'node': node},
      );

  _i2.Future<void> deleteNode(int id) => caller.callServerEndpoint<void>(
        'node',
        'deleteNode',
        {'id': id},
      );
}

/// {@category Endpoint}
class EndpointTodo extends _i1.EndpointRef {
  EndpointTodo(_i1.EndpointCaller caller) : super(caller);

  @override
  String get name => 'todo';

  _i2.Future<List<_i6.NodeTodo>> getTodos(_i3.UuidValue nodeId) =>
      caller.callServerEndpoint<List<_i6.NodeTodo>>(
        'todo',
        'getTodos',
        {'nodeId': nodeId},
      );

  _i2.Future<_i6.NodeTodo> addTodo(_i6.NodeTodo todo) =>
      caller.callServerEndpoint<_i6.NodeTodo>(
        'todo',
        'addTodo',
        {'todo': todo},
      );

  _i2.Future<_i6.NodeTodo> toggleTodo(int id) =>
      caller.callServerEndpoint<_i6.NodeTodo>(
        'todo',
        'toggleTodo',
        {'id': id},
      );
}

class Modules {
  Modules(Client client) {
    auth = _i7.Caller(client);
  }

  late final _i7.Caller auth;
}

class Client extends _i1.ServerpodClientShared {
  Client(
    String host, {
    dynamic securityContext,
    _i1.AuthenticationKeyManager? authenticationKeyManager,
    Duration? streamingConnectionTimeout,
    Duration? connectionTimeout,
    Function(
      _i1.MethodCallContext,
      Object,
      StackTrace,
    )? onFailedCall,
    Function(_i1.MethodCallContext)? onSucceededCall,
    bool? disconnectStreamsOnLostInternetConnection,
  }) : super(
          host,
          _i8.Protocol(),
          securityContext: securityContext,
          authenticationKeyManager: authenticationKeyManager,
          streamingConnectionTimeout: streamingConnectionTimeout,
          connectionTimeout: connectionTimeout,
          onFailedCall: onFailedCall,
          onSucceededCall: onSucceededCall,
          disconnectStreamsOnLostInternetConnection:
              disconnectStreamsOnLostInternetConnection,
        ) {
    ai = EndpointAi(this);
    auth = EndpointAuth(this);
    course = EndpointCourse(this);
    node = EndpointNode(this);
    todo = EndpointTodo(this);
    modules = Modules(this);
  }

  late final EndpointAi ai;

  late final EndpointAuth auth;

  late final EndpointCourse course;

  late final EndpointNode node;

  late final EndpointTodo todo;

  late final Modules modules;

  @override
  Map<String, _i1.EndpointRef> get endpointRefLookup => {
        'ai': ai,
        'auth': auth,
        'course': course,
        'node': node,
        'todo': todo,
      };

  @override
  Map<String, _i1.ModuleEndpointCaller> get moduleLookup =>
      {'auth': modules.auth};
}
