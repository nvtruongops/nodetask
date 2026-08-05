import 'package:serverpod/serverpod.dart';
import '../generated/protocol.dart';

class TodoEndpoint extends Endpoint {
  Future<List<NodeTodo>> getTodos(Session session, UuidValue nodeId) async {
    return await NodeTodo.db.find(
      session,
      where: (t) => t.nodeId.equals(nodeId),
    );
  }

  Future<NodeTodo> addTodo(Session session, NodeTodo todo) async {
    return await NodeTodo.db.insertRow(session, todo);
  }

  Future<NodeTodo> toggleTodo(Session session, int id) async {
    final todo = await NodeTodo.db.findById(session, id);
    if (todo == null) {
      throw Exception('Todo not found');
    }
    todo.isCompleted = !todo.isCompleted;
    return await NodeTodo.db.updateRow(session, todo);
  }
}
