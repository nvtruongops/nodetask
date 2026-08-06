import 'package:serverpod/serverpod.dart';
import '../generated/protocol.dart';

class WorkspaceEndpoint extends Endpoint {
  Future<List<Workspace>> getWorkspaces(Session session) async {
    return await Workspace.db.find(session);
  }

  Future<Workspace> createWorkspace(Session session, Workspace workspace) async {
    return await Workspace.db.insertRow(session, workspace);
  }

  Future<List<DocumentNode>> getWorkspaceTree(Session session, UuidValue workspaceId) async {
    // Read hierarchy nodes using workspace_parent_pos_idx
    return await DocumentNode.db.find(
      session,
      where: (t) => t.workspaceId.equals(workspaceId),
      orderBy: (t) => t.position,
    );
  }
}
