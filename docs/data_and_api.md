# Quy Chuẩn Dữ Liệu & API Backend (Data & API Specification)

> **Specification Version**: `2.0.0`  
> **Schema Version**: `1`  
> **Last Updated**: `2026-08-17`  
> **Status**: `APPROVED & ENFORCED`  

---

> [!NOTE]
> **Thư mục Đặc tả Dịch vụ Độc lập (`docs/services/`)**:
> Chi tiết về API Endpoints, Request/Response DTOs, Logic nghiệp vụ, Zod Validation, Ma trận Phân quyền, Lỗi và Caching của từng Dịch vụ được lưu trữ độc lập tại thư mục [docs/services/](file:///E:/Code/nodetask/docs/services) theo định dạng `docs/services/<service_name>.md`.
> File Core Spec `data_and_api.md` đóng vai trò **Bản đồ Chỉ mục (Index Map)**, **Quy chuẩn Cơ sở Dữ liệu Toàn cục (Master DB Schema & DDL)** và **Kiến trúc Lưu trữ Tổng thể (Storage & Access Architecture)**.

---

### 1. Bản Đồ Dịch Vụ Backend & Serverpod RPC Endpoints (Services Index Map)

Serverpod định nghĩa API theo dạng các **Endpoint Classes & Methods**. Để loại bỏ lặp lại và đảm bảo nguyên tắc **Single Source of Truth**, tất cả Endpoint Method Signatures, Request/Response DTOs, Zod Validation, RBAC Matrix và Caching Rules chi tiết được quản lý độc lập tại thư mục `docs/services/`:

| Dịch vụ (Service Domain) | Serverpod Endpoint Class | File Đặc tả Chi tiết (Single Source of Truth) | Phạm vi & Chức năng Dịch vụ |
| :--- | :--- | :--- | :--- |
| **Authentication & Access Control** | `AuthEndpoint` | [docs/services/auth.md](file:///E:/Code/nodetask/docs/services/auth.md) | Đăng ký (Email OTP), Đăng nhập, Quên/Đổi mật khẩu, Session & Ma trận RBAC hệ thống. |
| **Knowledge Workspace** | `WorkspaceEndpoint` | [docs/services/workspace.md](file:///E:/Code/nodetask/docs/services/workspace.md) | Quản lý Không gian tri thức Cá nhân & Tổ chức, Cây thư mục tài liệu phân cấp. |
| **Node Structure & AST Document** | `NodeEndpoint` | [docs/services/node.md](file:///E:/Code/nodetask/docs/services/node.md) | Cấu trúc cây `ltree`, Kéo-Thả (Reorder), Nội dung ghi chú Tiptap AST JSON & OCC Versioning. |
| **Storage & File Attachments** | `StorageEndpoint` | [docs/services/storage.md](file:///E:/Code/nodetask/docs/services/storage.md) | Lưu trữ File đính kèm, Presigned Upload URLs, Hash SHA-256 Deduplication & Quota. |
| **Todo & Task Management** | `TodoEndpoint` | [docs/services/todo.md](file:///E:/Code/nodetask/docs/services/todo.md) | Quản lý công việc (Todo) đính kèm nút tài liệu & Tính toán phần trăm tiến độ. |
| **AI Semantic Search & RAG** | `AiEndpoint` | [docs/services/ai.md](file:///E:/Code/nodetask/docs/services/ai.md) | Tách khối (Chunking), Vector `pgvector` HNSW, Tìm kiếm ngữ nghĩa & Trợ lý RAG giải đáp tri thức. |
| **Organization & Access Policies** | `OrganizationEndpoint` | [docs/services/organization.md](file:///E:/Code/nodetask/docs/services/organization.md) | Quản lý Tổ chức, Thành viên, Lời mời gia nhập & Phân quyền đa cấp. |
| **Background Jobs & Export** | `JobEndpoint` | [docs/services/job.md](file:///E:/Code/nodetask/docs/services/job.md) | Xuất dữ liệu PDF/Markdown ngầm qua FutureCalls và theo dõi trạng thái tác vụ. |
| **User Design Preferences** | `DesignPreferencesEndpoint` | [docs/services/design_preferences.md](file:///E:/Code/nodetask/docs/services/design_preferences.md) | Quản lý giao diện cá nhân hóa Monochrome Zero-Icon, Typography, Density & Custom Presets. |
| **Internationalization (i18n)** | `I18nEndpoint` | [docs/services/i18n.md](file:///E:/Code/nodetask/docs/services/i18n.md) | Quản lý từ điển đa ngôn ngữ (`en`/`vi`), Content Dictionary & CMS sync. |
| **AI Knowledge Graph & Vector Topology** | `GraphEndpoint` | [docs/services/graph.md](file:///E:/Code/nodetask/docs/services/graph.md) | Trích xuất Topology đồ thị tri thức 2D/3D (pgvector + ltree + backlinks), Phân cụm cộng đồng & Stream WebGL. |
| **Pentest & API Security Testing** | `PentestEndpoint` | [docs/services/pentest.md](file:///E:/Code/nodetask/docs/services/pentest.md) | Kiểm thử an ninh tự động, quét lỗ hổng OWASP API Top 10, Fuzzing & Báo cáo an toàn thông tin. |

---

### 2. Kiến Trúc Lưu Trữ Dữ Liệu (Storage Layer Architecture)

Hệ thống `nodetask` phân chia lưu trữ dữ liệu thành 4 tầng chuyên biệt:

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           STORAGE LAYER ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 1. Text & Block Documents (Rich Text AST, Cây phân cấp)                        │
│    └── PostgreSQL Database: JSONB (`document_nodes.content`) + LTREE (`path`)   │
│                                                                                 │
│ 2. Binary Files & Media Attachments (Ảnh, PDFs, Video, Docs, Avatars)           │
│    └── Object Storage: S3 / Cloudflare R2 / MinIO (Metadata in `file_assets`)   │
│                                                                                 │
│ 3. AI RAG & Vector Embeddings (1536-dim Text Embeddings)                        │
│    └── PostgreSQL `pgvector`: HNSW Index Cosine Distance (`node_embeddings`)    │
│                                                                                 │
│ 4. Fast Cache, Sessions & Ephemeral Memory                                      │
│    └── Redis Distributed Cache (Auth Session, Tree JSON, Rate Limits)          │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### Chi tiết phân bổ nguồn lưu trữ:
1. **Dữ liệu Cá nhân (Personal Workspace)**:
   - Lưu trữ trong bảng `workspaces` (`type = 'PERSONAL'`) và `document_nodes`.
   - Thuộc sở hữu độc quyền của `user_id` tạo ra, chỉ chia sẻ khi người dùng bật `is_public` hoặc mời cộng tác viên.
2. **Dữ liệu Nội bộ Tổ chức (Internal / Organization Workspace)**:
   - Lưu trữ trong bảng `workspaces` (`type = 'ORGANIZATION'`) liên kết với `organization_id`.
   - Toàn bộ thành viên trong tổ chức (`ORG_MEMBER`, `ORG_ADMIN`) truy cập theo ma trận quyền hạn được cấp (`OWNER`, `EDITOR`, `VIEWER`).
3. **Tệp tin đính kèm & Đa phương tiện (Media Attachments)**:
   - **File nhị phân**: Không lưu blob trực tiếp vào cơ sở dữ liệu để tránh làm phình DB. Tất cả file được đẩy trực tiếp lên **Object Storage** (Amazon S3 / Cloudflare R2 / MinIO) thông qua **Presigned Upload URLs**.
   - **Siêu dữ liệu & Liên kết**: Bảng `file_assets` lưu URL, dung lượng (`byte_size`), MIME type, SHA-256 hash và bảng trung gian `node_attachments` liên kết với từng nút ghi chú.
4. **AI Semantic Search & RAG Data**:
   - **Chunking Pipeline**: Khi tài liệu được lưu, nội dung Tiptap AST được chuyển đổi thành Plain Text và chia đoạn (512–1024 tokens kèm 10% overlap).
   - **Vector Storage**: Các vector 1536 chiều được lưu trong bảng `node_embeddings` với chỉ mục `hnsw (embedding vector_cosine_ops)`.

---

### 3. Thiết Kế Cơ Sở Dữ Liệu Toàn Cục (Master Database Schema & DDL SQL)

```sql
-- ============================================================================
-- 1. KÍCH HOẠT POSTGRESQL EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "ltree";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================================
-- 2. TẦNG NGƯỜI DÙNG & TỔ CHỨC (USERS & ORGANIZATIONS)
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  system_role VARCHAR(20) NOT NULL DEFAULT 'USER', -- GUEST, USER, SYSTEM_ADMIN
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'ORG_MEMBER', -- ORG_MEMBER, ORG_ADMIN
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (organization_id, user_id)
);

CREATE INDEX idx_org_members_user ON organization_members(user_id);

-- ============================================================================
-- 3. TẦNG KHÔNG GIAN TRI THỨC (WORKSPACES & SHARING)
-- ============================================================================
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  type VARCHAR(20) NOT NULL DEFAULT 'PERSONAL', -- PERSONAL, ORGANIZATION
  visibility VARCHAR(20) NOT NULL DEFAULT 'PRIVATE', -- PRIVATE, INTERNAL, PUBLIC
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX idx_workspaces_org ON workspaces(organization_id);

CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'VIEWER', -- OWNER, EDITOR, VIEWER
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (workspace_id, user_id)
);

-- ============================================================================
-- 4. TẦNG CẤU TRÚC CÂY TÀI LIỆU & AST GHI CHÚ (POSTGRES LTREE + OCC VERSIONING)
-- ============================================================================
CREATE TABLE document_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES document_nodes(id) ON DELETE CASCADE,
  path LTREE,
  node_type VARCHAR(20) NOT NULL, -- WORKSPACE, FOLDER, DOCUMENT, SECTION
  title VARCHAR(255) NOT NULL,
  content JSONB,                  -- Dynamic Tiptap AST JSON Block Content
  position INT NOT NULL DEFAULT 0,
  version INT NOT NULL DEFAULT 1, -- Optimistic Concurrency Control
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_document_nodes_ws_parent_pos ON document_nodes(workspace_id, parent_id, position);
CREATE INDEX idx_document_nodes_path ON document_nodes USING GIST(path);

CREATE TABLE document_node_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID NOT NULL REFERENCES document_nodes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content JSONB NOT NULL,
  change_summary VARCHAR(255),
  is_snapshot BOOLEAN DEFAULT FALSE,
  snapshot_tag VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (node_id, version_number)
);

CREATE INDEX idx_node_versions_node_ver ON document_node_versions(node_id, version_number DESC);
CREATE INDEX idx_node_versions_snapshot ON document_node_versions(node_id, is_snapshot);

-- ============================================================================
-- 5. TẦNG TÁC VỤ TODO ĐÍNH KÈM NODE (NODE TODOS)
-- ============================================================================
CREATE TABLE node_todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID NOT NULL REFERENCES document_nodes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  priority VARCHAR(10) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH
  due_date TIMESTAMP WITH TIME ZONE,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_node_todos_node_status ON node_todos(node_id, is_completed);

-- ============================================================================
-- 6. TẦNG LƯU TRỮ FILE & TÀI LIỆU ĐÍNH KÈM (OBJECT STORAGE METADATA)
-- ============================================================================
CREATE TABLE file_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  category VARCHAR(30) NOT NULL, -- EMBEDDED_IMAGE, ATTACHMENT, AVATAR, EXPORT_TEMP
  storage_key TEXT NOT NULL,
  public_url TEXT NOT NULL,
  storage_provider VARCHAR(20) NOT NULL DEFAULT 'S3', -- S3, R2, MINIO, LOCAL
  checksum_sha256 VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_file_assets_user ON file_assets(user_id);
CREATE INDEX idx_file_assets_checksum ON file_assets(checksum_sha256);

CREATE TABLE node_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID NOT NULL REFERENCES document_nodes(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES file_assets(id) ON DELETE CASCADE,
  display_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (node_id, file_id)
);

-- ============================================================================
-- 7. TẦNG VECTOR EMBEDDINGS CHO AI SEMANTIC SEARCH & RAG (PGVECTOR)
-- ============================================================================
CREATE TABLE node_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID NOT NULL REFERENCES document_nodes(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL DEFAULT 0,
  chunk_content TEXT NOT NULL,
  embedding VECTOR(1536) NOT NULL, -- Dimension cho Gemini / OpenAI Embeddings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chỉ mục HNSW cho tốc độ tìm kiếm Cosine Similarity dưới 10ms
CREATE INDEX idx_node_embeddings_vector ON node_embeddings 
USING hnsw (embedding vector_cosine_ops);

CREATE INDEX idx_node_embeddings_node ON node_embeddings(node_id);
CREATE INDEX idx_node_embeddings_workspace ON node_embeddings(workspace_id);

-- ============================================================================
-- 8. TẦNG TÁC VỤ NỀN & XUẤT BẢN DỮ LIỆU (BACKGROUND JOBS)
-- ============================================================================
CREATE TABLE background_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_type VARCHAR(30) NOT NULL, -- EXPORT_DOCUMENT, EXPORT_WORKSPACE, BACKUP_FULL, REINDEX_AI
  status VARCHAR(20) NOT NULL DEFAULT 'QUEUED', -- QUEUED, PROCESSING, COMPLETED, FAILED, CANCELLED
  progress_percentage INT DEFAULT 0,
  download_url TEXT,
  error_message TEXT,
  file_size_bytes BIGINT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_background_jobs_user_status ON background_jobs(user_id, status);

-- ============================================================================
-- 9. TẦNG KIỂM THỬ AN NINH & QUÉT LỖ HỔNG (PENTEST & VULNERABILITY AUDITING)
-- ============================================================================
CREATE TABLE pentest_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  target_scope VARCHAR(30) NOT NULL, -- FULL_SYSTEM, WORKSPACE_SCOPE, AUTH_GATEWAY, STORAGE_PIPELINE, AI_VECTOR_ENGINE
  scan_type VARCHAR(30) NOT NULL,    -- PASSIVE_AUDIT, ACTIVE_FUZZING, BOLA_INSPECTION, FULL_PENETRATION_TEST
  status VARCHAR(20) NOT NULL DEFAULT 'QUEUED', -- QUEUED, RUNNING, COMPLETED, FAILED, CANCELLED
  progress_percentage INT DEFAULT 0,
  total_endpoints_scanned INT DEFAULT 0,
  critical_vulnerabilities INT DEFAULT 0,
  high_vulnerabilities INT DEFAULT 0,
  medium_vulnerabilities INT DEFAULT 0,
  low_vulnerabilities INT DEFAULT 0,
  compliance_score INT DEFAULT 100,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_pentest_scans_org_status ON pentest_scans(organization_id, status);

CREATE TABLE pentest_vulnerabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID NOT NULL REFERENCES pentest_scans(id) ON DELETE CASCADE,
  endpoint_name VARCHAR(100) NOT NULL,
  vulnerability_type VARCHAR(50) NOT NULL,
  owasp_category VARCHAR(50) NOT NULL, -- e.g. API1:2023-BOLA
  severity VARCHAR(10) NOT NULL,       -- INFO, LOW, MEDIUM, HIGH, CRITICAL
  cvss_score NUMERIC(3, 1) NOT NULL,   -- 0.0 - 10.0
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  proof_of_concept TEXT,
  remediation_advice TEXT NOT NULL,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pentest_vuln_scan_severity ON pentest_vulnerabilities(scan_id, severity);
```

---

### 4. Ma Trận Quyền Hạn & Chính Sách Phân Quyền Hệ Thống (Master RBAC Policy)

Hệ thống thực thi mô hình Phân quyền Đa cấp:
1. **Cấp Hệ Thống (System-level Roles)**: `GUEST`, `USER`, `SYSTEM_ADMIN`.
2. **Cấp Tổ Chức (Organization-level Roles)**: `ORG_MEMBER`, `ORG_ADMIN`.
3. **Cấp Không Gian Làm Việc (Workspace Resource Roles)**: `OWNER`, `EDITOR`, `VIEWER`.

| Thao Tác Nghiệp Vụ (Operation) | GUEST | USER (Cá nhân) | ORG_MEMBER | ORG_ADMIN | SYSTEM_ADMIN |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Đăng ký / Đăng nhập / Đổi mật khẩu** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Tạo Workspace Cá nhân** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Xem Workspace Công khai (`isPublic: true`)** | ✅ (Read-only) | ✅ | ✅ | ✅ | ✅ |
| **Xem Workspace Nội bộ Tổ chức** | ❌ | ❌ | ✅ (Org Scope) | ✅ (Org Scope) | ✅ (All) |
| **Tạo / Sửa / Kéo thả Node tài liệu** | ❌ | ✅ (Owner/Editor) | ✅ (Editor/Owner) | ✅ (Org Scope) | ✅ (All) |
| **Upload File / Ảnh đính kèm** | ❌ | ✅ (Personal Quota) | ✅ (Org Quota) | ✅ (Org Quota) | ✅ (Unlimited) |
| **Tìm kiếm ngữ nghĩa & Hỏi đáp AI RAG** | ❌ (Public only) | ✅ (Personal Scope) | ✅ (Org Scope) | ✅ (Org Scope) | ✅ (All) |
| **Mời thành viên / Đổi quyền Tổ chức** | ❌ | ❌ | ❌ | ✅ (Org Scope) | ✅ (All) |
| **Xuất dữ liệu PDF / Markdown / Backup** | ❌ | ✅ (Owner/Viewer) | ✅ (Org Scope) | ✅ (Org Scope) | ✅ (All) |
| **Chạy quét an ninh & Pentest API** | ❌ | ❌ | ❌ | ✅ (Org Scope) | ✅ (Full System) |
| **Quản trị Toàn quyền Hệ thống** | ❌ | ❌ | ❌ | ❌ | ✅ (Full Root) |

---

### 5. Định dạng Response & Ma Trận Chuẩn Lỗi (Error Contract Standard)

#### 5.1. Standard Response Payload Format
```json
// Success Response
{
  "success": true,
  "data": { "id": "uuid-v4", "title": "Knowledge Management System Architecture", "position": 1, "version": 2 }
}

// Error Response Format
{
  "success": false,
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Node has been updated by another user/session.",
    "details": { "currentVersion": 4, "providedVersion": 3 }
  }
}
```

#### 5.2. Error Code Matrix

| Error Code | HTTP Status | Nguyên nhân | Hành động xử lý client |
| :--- | :--- | :--- | :--- |
| `INVALID_INPUT` | `400 Bad Request` | Dữ liệu gửi lên vi phạm Zod validation / Trust Boundary. | Hiển thị thông báo lỗi form tại client. |
| `UNAUTHORIZED` | `401 Unauthorized` | Thao tác yêu cầu Session Key hợp lệ nhưng token hết hạn/thiếu. | Redirect về trang Đăng nhập. |
| `FORBIDDEN` | `403 Forbidden` | User không có quyền trên tài nguyên (RBAC violation). | Hiển thị thông báo "Không có quyền thực hiện". |
| `NOT_FOUND` | `404 Not Found` | Tài nguyên `workspace_id`, `node_id`, `todo_id` không tồn tại. | Trở về danh sách trang chính. |
| `VERSION_CONFLICT` | `409 Conflict` | Xung đột ghi đồng thời (OCC version mismatch). | Rollback UI local, fetch lại cây node mới nhất. |
| `STORAGE_QUOTA_EXCEEDED` | `413 Payload Too Large` | Vượt quá dung lượng lưu trữ cho phép. | Gợi ý dọn dẹp file hoặc nâng cấp gói. |
| `MINIO_CONNECTION_FAILED` | `502 Bad Gateway` | Không thể kết nối tới MinIO / S3 Object Storage. | Kiểm tra trạng thái container MinIO. |
| `PRESIGNED_URL_EXPIRED` | `410 Gone` | Presigned URL đã quá hạn thời gian hiệu lực. | Yêu cầu cấp mới Presigned URL. |
| `PENTEST_SCAN_ALREADY_RUNNING` | `409 Conflict` | Đang có chiến dịch quét bảo mật đang chạy. | Chờ quét xong hoặc hủy chiến dịch cũ. |
| `PENTEST_UNAUTHORIZED_TARGET` | `403 Forbidden` | Quét mục tiêu ngoài phạm vi thẩm quyền tổ chức. | Chỉ định đúng scope quản trị. |
| `INTERNAL_ERROR` | `500 Internal Error` | Lỗi không xác định tại backend server. | Hiển thị "Lỗi hệ thống, thử lại sau". |

---

### 6. Quy Chuẩn Cache Keys Standard

Tất cả Redis cache key phải tuân thủ chuẩn `snake_case` phân cấp bằng dấu hai chấm `:`:
- `auth:session:{session_token}` -> User Session Data (TTL 24h).
- `workspace:{workspace_id}:meta` -> Metadata của Workspace (TTL 1h).
- `workspace:{workspace_id}:tree_json` -> Cấu trúc cây thư mục JSON phân cấp (TTL 30m).
- `node:{node_id}:detail` -> Chi tiết nội dung node và Tiptap AST (TTL 1h).
- `storage:file:{file_id}:meta` -> Metadata file đính kèm (TTL 24h).
- `storage:node:{node_id}:attachments` -> Danh sách file đính kèm theo node (TTL 1h).
- `storage:user:{user_id}:usage` -> Thống kê dung lượng đã dùng (TTL 10m).
- `storage:presigned:{file_id}:download` -> Cache Presigned Download URL (TTL 10m).
- `ai:search:{sha256(query_workspace)}` -> Kết quả tìm kiếm ngữ nghĩa vector (TTL 10m).
- `user:{user_id}:workspaces` -> Danh sách Workspace của người dùng (TTL 15m).
- `pentest:scan:{scan_id}:summary` -> Thông tin tiến độ chiến dịch quét an ninh (TTL 1h).
- `pentest:rules:active` -> Danh mục quy tắc kiểm thử an ninh (TTL 24h).
- `pentest:org:{org_id}:active_scan` -> Khóa ngăn chặn quét đồng thời theo tổ chức (TTL 2h).

