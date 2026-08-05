import 'package:serverpod/serverpod.dart';
import '../generated/protocol.dart';

class NodeEndpoint extends Endpoint {
  Future<CourseNode> createNode(Session session, CourseNode node) async {
    return await CourseNode.db.insertRow(session, node);
  }

  Future<CourseNode> updateNode(Session session, CourseNode node) async {
    if (node.id != null) {
      final existing = await CourseNode.db.findById(session, node.id!);
      if (existing != null && existing.version != node.version) {
        throw Exception('VERSION_CONFLICT: Node has been updated by another session');
      }
    }
    node.version = node.version + 1;
    return await CourseNode.db.updateRow(session, node);
  }

  Future<void> deleteNode(Session session, int id) async {
    await CourseNode.db.deleteWhere(session, where: (t) => t.id.equals(id));
  }
}
