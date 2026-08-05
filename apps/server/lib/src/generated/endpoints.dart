/* AUTOMATICALLY GENERATED CODE DO NOT MODIFY */
/*   To generate run: "serverpod generate"    */

// ignore_for_file: implementation_imports
// ignore_for_file: library_private_types_in_public_api
// ignore_for_file: non_constant_identifier_names
// ignore_for_file: public_member_api_docs
// ignore_for_file: type_literal_in_constant_pattern
// ignore_for_file: use_super_parameters

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:serverpod/serverpod.dart' as _i1;
import '../endpoints/ai_endpoint.dart' as _i2;
import '../endpoints/auth_endpoint.dart' as _i3;
import '../endpoints/course_endpoint.dart' as _i4;
import '../endpoints/node_endpoint.dart' as _i5;
import '../endpoints/todo_endpoint.dart' as _i6;
import 'package:uuid/uuid_value.dart' as _i7;
import 'package:server/src/generated/course.dart' as _i8;
import 'package:server/src/generated/course_node.dart' as _i9;
import 'package:server/src/generated/node_todo.dart' as _i10;
import 'package:serverpod_auth_server/serverpod_auth_server.dart' as _i11;

class Endpoints extends _i1.EndpointDispatch {
  @override
  void initializeEndpoints(_i1.Server server) {
    var endpoints = <String, _i1.Endpoint>{
      'ai': _i2.AiEndpoint()
        ..initialize(
          server,
          'ai',
          null,
        ),
      'auth': _i3.AuthEndpoint()
        ..initialize(
          server,
          'auth',
          null,
        ),
      'course': _i4.CourseEndpoint()
        ..initialize(
          server,
          'course',
          null,
        ),
      'node': _i5.NodeEndpoint()
        ..initialize(
          server,
          'node',
          null,
        ),
      'todo': _i6.TodoEndpoint()
        ..initialize(
          server,
          'todo',
          null,
        ),
    };
    connectors['ai'] = _i1.EndpointConnector(
      name: 'ai',
      endpoint: endpoints['ai']!,
      methodConnectors: {
        'search': _i1.MethodConnector(
          name: 'search',
          params: {
            'query': _i1.ParameterDescription(
              name: 'query',
              type: _i1.getType<String>(),
              nullable: false,
            ),
            'topK': _i1.ParameterDescription(
              name: 'topK',
              type: _i1.getType<int?>(),
              nullable: true,
            ),
          },
          call: (
            _i1.Session session,
            Map<String, dynamic> params,
          ) async =>
              (endpoints['ai'] as _i2.AiEndpoint).search(
            session,
            params['query'],
            params['topK'],
          ),
        ),
        'ask': _i1.MethodConnector(
          name: 'ask',
          params: {
            'question': _i1.ParameterDescription(
              name: 'question',
              type: _i1.getType<String>(),
              nullable: false,
            ),
            'courseId': _i1.ParameterDescription(
              name: 'courseId',
              type: _i1.getType<_i7.UuidValue?>(),
              nullable: true,
            ),
          },
          call: (
            _i1.Session session,
            Map<String, dynamic> params,
          ) async =>
              (endpoints['ai'] as _i2.AiEndpoint).ask(
            session,
            params['question'],
            params['courseId'],
          ),
        ),
      },
    );
    connectors['auth'] = _i1.EndpointConnector(
      name: 'auth',
      endpoint: endpoints['auth']!,
      methodConnectors: {
        'login': _i1.MethodConnector(
          name: 'login',
          params: {
            'email': _i1.ParameterDescription(
              name: 'email',
              type: _i1.getType<String>(),
              nullable: false,
            ),
            'password': _i1.ParameterDescription(
              name: 'password',
              type: _i1.getType<String>(),
              nullable: false,
            ),
          },
          call: (
            _i1.Session session,
            Map<String, dynamic> params,
          ) async =>
              (endpoints['auth'] as _i3.AuthEndpoint).login(
            session,
            params['email'],
            params['password'],
          ),
        ),
        'register': _i1.MethodConnector(
          name: 'register',
          params: {
            'email': _i1.ParameterDescription(
              name: 'email',
              type: _i1.getType<String>(),
              nullable: false,
            ),
            'password': _i1.ParameterDescription(
              name: 'password',
              type: _i1.getType<String>(),
              nullable: false,
            ),
          },
          call: (
            _i1.Session session,
            Map<String, dynamic> params,
          ) async =>
              (endpoints['auth'] as _i3.AuthEndpoint).register(
            session,
            params['email'],
            params['password'],
          ),
        ),
      },
    );
    connectors['course'] = _i1.EndpointConnector(
      name: 'course',
      endpoint: endpoints['course']!,
      methodConnectors: {
        'getCourses': _i1.MethodConnector(
          name: 'getCourses',
          params: {},
          call: (
            _i1.Session session,
            Map<String, dynamic> params,
          ) async =>
              (endpoints['course'] as _i4.CourseEndpoint).getCourses(session),
        ),
        'createCourse': _i1.MethodConnector(
          name: 'createCourse',
          params: {
            'course': _i1.ParameterDescription(
              name: 'course',
              type: _i1.getType<_i8.Course>(),
              nullable: false,
            )
          },
          call: (
            _i1.Session session,
            Map<String, dynamic> params,
          ) async =>
              (endpoints['course'] as _i4.CourseEndpoint).createCourse(
            session,
            params['course'],
          ),
        ),
        'getCourseTree': _i1.MethodConnector(
          name: 'getCourseTree',
          params: {
            'courseId': _i1.ParameterDescription(
              name: 'courseId',
              type: _i1.getType<_i7.UuidValue>(),
              nullable: false,
            )
          },
          call: (
            _i1.Session session,
            Map<String, dynamic> params,
          ) async =>
              (endpoints['course'] as _i4.CourseEndpoint).getCourseTree(
            session,
            params['courseId'],
          ),
        ),
      },
    );
    connectors['node'] = _i1.EndpointConnector(
      name: 'node',
      endpoint: endpoints['node']!,
      methodConnectors: {
        'createNode': _i1.MethodConnector(
          name: 'createNode',
          params: {
            'node': _i1.ParameterDescription(
              name: 'node',
              type: _i1.getType<_i9.CourseNode>(),
              nullable: false,
            )
          },
          call: (
            _i1.Session session,
            Map<String, dynamic> params,
          ) async =>
              (endpoints['node'] as _i5.NodeEndpoint).createNode(
            session,
            params['node'],
          ),
        ),
        'updateNode': _i1.MethodConnector(
          name: 'updateNode',
          params: {
            'node': _i1.ParameterDescription(
              name: 'node',
              type: _i1.getType<_i9.CourseNode>(),
              nullable: false,
            )
          },
          call: (
            _i1.Session session,
            Map<String, dynamic> params,
          ) async =>
              (endpoints['node'] as _i5.NodeEndpoint).updateNode(
            session,
            params['node'],
          ),
        ),
        'deleteNode': _i1.MethodConnector(
          name: 'deleteNode',
          params: {
            'id': _i1.ParameterDescription(
              name: 'id',
              type: _i1.getType<int>(),
              nullable: false,
            )
          },
          call: (
            _i1.Session session,
            Map<String, dynamic> params,
          ) async =>
              (endpoints['node'] as _i5.NodeEndpoint).deleteNode(
            session,
            params['id'],
          ),
        ),
      },
    );
    connectors['todo'] = _i1.EndpointConnector(
      name: 'todo',
      endpoint: endpoints['todo']!,
      methodConnectors: {
        'getTodos': _i1.MethodConnector(
          name: 'getTodos',
          params: {
            'nodeId': _i1.ParameterDescription(
              name: 'nodeId',
              type: _i1.getType<_i7.UuidValue>(),
              nullable: false,
            )
          },
          call: (
            _i1.Session session,
            Map<String, dynamic> params,
          ) async =>
              (endpoints['todo'] as _i6.TodoEndpoint).getTodos(
            session,
            params['nodeId'],
          ),
        ),
        'addTodo': _i1.MethodConnector(
          name: 'addTodo',
          params: {
            'todo': _i1.ParameterDescription(
              name: 'todo',
              type: _i1.getType<_i10.NodeTodo>(),
              nullable: false,
            )
          },
          call: (
            _i1.Session session,
            Map<String, dynamic> params,
          ) async =>
              (endpoints['todo'] as _i6.TodoEndpoint).addTodo(
            session,
            params['todo'],
          ),
        ),
        'toggleTodo': _i1.MethodConnector(
          name: 'toggleTodo',
          params: {
            'id': _i1.ParameterDescription(
              name: 'id',
              type: _i1.getType<int>(),
              nullable: false,
            )
          },
          call: (
            _i1.Session session,
            Map<String, dynamic> params,
          ) async =>
              (endpoints['todo'] as _i6.TodoEndpoint).toggleTodo(
            session,
            params['id'],
          ),
        ),
      },
    );
    modules['serverpod_auth'] = _i11.Endpoints()..initializeEndpoints(server);
  }
}
