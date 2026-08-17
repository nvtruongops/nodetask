# Document Node Service Specification (`node.md`)

> **Service**: `Node Structure & AST Document Service`  
> **Package**: `apps/server/lib/src/endpoints/node_endpoint.dart`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

### 1. Overview
Dịch vụ Document Node Service quản lý từng khối dữ liệu phân cấp trong Workspace theo mô hình cấu trúc cây PostgreSQL `ltree`. Nút tài liệu (Node) hỗ trợ 4 định dạng chính: `WORKSPACE`, `FOLDER`, `DOCUMENT`, `SECTION`. Nội dung ghi chú được lưu trữ dưới dạng khối Tiptap AST JSON linh hoạt (Rich-Text Block). Dịch vụ xử lý các thao tác kéo-thả sắp xếp vị trí (`position`), di chuyển cây cha-con (`moveNode`), cập nhật nội dung đồng thời bảo vệ bằng cơ chế Optimistic Concurrency Control (`version: int`), và kích hoạt tác vụ nền phân tách khối (chunking) sinh Vector Embeddings.

---

### 2. Endpoints
Hợp đồng giao tiếp qua Serverpod RPC Endpoint Methods:
- `NodeEndpoint.getNode(Session session, String nodeId)`
- `NodeEndpoint.createNode(Session session, CreateNodeInput input)`
- `NodeEndpoint.updateNode(Session session, UpdateNodeInput input)`
- `NodeEndpoint.deleteNode(Session session, String nodeId)`
- `NodeEndpoint.moveNode(Session session, MoveNodeInput input)`
- `NodeEndpoint.reorderNodes(Session session, ReorderNodesInput input)`
- `NodeEndpoint.duplicateNode(Session session, DuplicateNodeInput input)`
- `NodeEndpoint.getNodeBreadcrumb(Session session, String nodeId)`

---

### 3. Request
Cấu trúc Request DTOs:

```typescript
type NodeType = 'WORKSPACE' | 'FOLDER' | 'DOCUMENT' | 'SECTION';

interface CreateNodeInput {
  workspaceId: string;
  parentId?: string;
  nodeType: NodeType;
  title: string;
  content?: string; // Tiptap AST JSON string
  position?: number;
}

interface UpdateNodeInput {
  nodeId: string;
  title?: string;
  content?: string; // Tiptap AST JSON string
  version: number; // OCC Versioning check
}

interface MoveNodeInput {
  nodeId: string;
  targetParentId?: string;
  targetPosition: number;
}

interface NodePositionItem {
  nodeId: string;
  position: number;
}

interface ReorderNodesInput {
  workspaceId: string;
  parentId?: string;
  items: NodePositionItem[];
}

interface DuplicateNodeInput {
  nodeId: string;
  targetParentId?: string;
  includeChildren?: boolean;
}
```

---

### 4. Response
Cấu trúc Response DTOs:

```typescript
interface DocumentNodeResponse {
  id: string;
  workspaceId: string;
  parentId?: string;
  path: string; // ltree path
  nodeType: NodeType;
  title: string;
  content?: string; // JSON AST string
  position: number;
  version: number;
  todoCount: number;
  attachmentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface NodeBreadcrumbItem {
  id: string;
  title: string;
  nodeType: NodeType;
  path: string;
}

interface NodeBreadcrumbResponse {
  nodeId: string;
  breadcrumbs: NodeBreadcrumbItem[];
}

interface ReorderNodesResponse {
  success: boolean;
  updatedNodesCount: number;
}
```

---

### 5. Validation
Quy chuẩn kiểm tra tính hợp lệ dữ liệu đầu vào:
- `title`: Bắt buộc, chuỗi từ 1 đến 255 ký tự.
- `version`: Số nguyên dương (`version >= 1`), bắt buộc khi gọi `updateNode` để kiểm soát xung đột ghi đồng thời.
- `nodeType`: Bắt buộc thuộc enum `WORKSPACE`, `FOLDER`, `DOCUMENT`, `SECTION`.
- `content`: Chuỗi JSON hợp lệ theo Tiptap Block AST format (tối đa 5MB mỗi node).
- `items`: Mảng từ 1 đến 500 phần tử khi reorder các node con.

---

### 6. Permissions
Ma trận Phân quyền Truy cập (RBAC Matrix):

| Endpoint Method | GUEST | USER | ORG_MEMBER | ORG_ADMIN | SYSTEM_ADMIN |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `NodeEndpoint.getNode` | ❌ (Public only) | ✅ (Owner/Shared) | ✅ (Org Scope) | ✅ (Org Scope) | ✅ (All) |
| `NodeEndpoint.createNode` | ❌ | ✅ (Owner/Editor) | ✅ (Editor/Owner) | ✅ (Org Scope) | ✅ (All) |
| `NodeEndpoint.updateNode` | ❌ | ✅ (Owner/Editor) | ✅ (Editor/Owner) | ✅ (Org Scope) | ✅ (All) |
| `NodeEndpoint.deleteNode` | ❌ | ✅ (Owner/Editor) | ✅ (Editor/Owner) | ✅ (Org Scope) | ✅ (All) |
| `NodeEndpoint.moveNode` | ❌ | ✅ (Owner/Editor) | ✅ (Editor/Owner) | ✅ (Org Scope) | ✅ (All) |
| `NodeEndpoint.reorderNodes` | ❌ | ✅ (Owner/Editor) | ✅ (Editor/Owner) | ✅ (Org Scope) | ✅ (All) |
| `NodeEndpoint.duplicateNode` | ❌ | ✅ (Owner/Editor) | ✅ (Editor/Owner) | ✅ (Org Scope) | ✅ (All) |
| `NodeEndpoint.getNodeBreadcrumb` | ❌ (Public only) | ✅ (Owner/Shared) | ✅ (Org Scope) | ✅ (Org Scope) | ✅ (All) |

---

### 7. Errors
Bảng mã lỗi và HTTP Status tương ứng:

| Mã Lỗi (Error Code) | HTTP Status | Nguyên nhân | Hướng xử lý Client |
| :--- | :--- | :--- | :--- |
| `NODE_NOT_FOUND` | `404 Not Found` | Không tìm thấy `nodeId` trong cơ sở dữ liệu. | Thông báo tài liệu không tồn tại hoặc đã bị xóa. |
| `VERSION_CONFLICT` | `409 Conflict` | Xung đột ghi đồng thời (OCC version mismatch). | Rollback Optimistic UI, fetch lại nội dung mới nhất. |
| `CIRCULAR_DEPENDENCY` | `400 Bad Request` | Cố gắng di chuyển node cha vào làm con của chính nó. | Chặn hành động di chuyển không hợp lệ. |
| `FORBIDDEN` | `403 Forbidden` | Không có quyền chỉnh sửa node trong Workspace này. | Hiển thị thông báo quyền truy cập bị từ chối. |
| `INVALID_INPUT` | `400 Bad Request` | Payload hoặc JSON AST không hợp lệ. | Báo lỗi validation trên giao diện. |
| `INTERNAL_ERROR` | `500 Internal Error` | Lỗi máy chủ nội bộ không xác định. | Thông báo thử lại sau. |

---

### 8. Events
Danh sách Domain Events phát sinh:
- `node.created`: Phát ra khi tạo mới một nút tài liệu.
- `node.updated`: Phát ra khi cập nhật tiêu đề, phiên bản hoặc nội dung AST.
- `node.moved`: Phát ra khi node thay đổi vị trí hoặc cây cha trong cấu trúc `ltree`.
- `node.deleted`: Phát ra khi node bị xóa (kích hoạt FutureCalls dọn dẹp embeddings và todo).

---

### 9. Cache
Chiến lược Caching qua Redis:
- **Keys & TTL**:
  - `node:{node_id}:detail` -> Toàn bộ dữ liệu chi tiết của node bao gồm nội dung AST (TTL: 1h).
  - `workspace:{workspace_id}:tree_json` -> Cây cấu trúc phân cấp (TTL: 30m).
- **Invalidation Strategy**:
  - Khi gọi `updateNode` -> Xóa cache `node:{node_id}:detail` và xóa cache `workspace:{workspace_id}:tree_json`.
  - Khi gọi `moveNode` hoặc `reorderNodes` -> Xóa cache `workspace:{workspace_id}:tree_json`.

---

### 10. Examples
Ví dụ tích hợp TypeScript Frontend Client:

```typescript
import { api } from '@/services/api';

// 1. Cập nhật nội dung tài liệu với OCC Version
try {
  const updated = await api.put('/rpc/node/updateNode', {
    nodeId: 'doc-node-uuid',
    title: 'Quy chuẩn Kiến trúc Vi dịch vụ',
    content: JSON.stringify({ type: 'doc', content: [{ type: 'paragraph', text: 'Nội dung block...' }] }),
    version: 2
  });
  console.log('Phiên bản mới:', updated.data.version);
} catch (err: any) {
  if (err.code === 'VERSION_CONFLICT') {
    console.warn('Xung đột phiên bản ghi! Vui lòng tải lại trang.');
  }
}
```
