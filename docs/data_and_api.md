# Quy Chuẩn Dữ Liệu & API Backend (Data & API Specification)

---

### 1. Serverpod API Endpoints

Serverpod tự động sinh ra TypeScript Client SDK (Web) và Dart Client SDK (Mobile) từ các Endpoint class này.

#### 1.1. Authentication Endpoint (`AuthEndpoint`)
- `POST /api/auth/register` - Đăng ký tài khoản mới.
- `POST /api/auth/login` - Đăng nhập nhận Session Key.
- `POST /api/auth/logout` - Đăng xuất & hủy Session Token.
- `GET  /api/auth/me` - Lấy thông tin cá nhân hiện tại.

#### 1.2. Course Endpoint (`CourseEndpoint`)
- `GET  /api/courses` - Lấy danh sách khóa học của user.
- `POST /api/courses` - Tạo khóa học mới.
- `GET  /api/courses/:id/tree` - Lấy toàn bộ cây thư mục phân cấp của khóa học (Ưu tiên đọc từ Redis Cache `course:{id}:tree_json`).

#### 1.3. Node Endpoint (`NodeEndpoint`) - Quản lý Cây & Tài liệu
- `POST /api/nodes` - Thêm nút mới (TOPIC/MODULE/SESSION/SUBSESSION). Auto invalidate Redis cache.
- `PUT  /api/nodes/:id` - Cập nhật tiêu đề hoặc nội dung tài liệu (`content` JSON). Auto invalidate Redis cache.
- `PUT  /api/nodes/:id/reorder` - **Kéo - Thả (Reorder/Re-parent):** Cập nhật `parent_id` và `position` mới. Auto invalidate Redis cache.
- `DELETE /api/nodes/:id` - Xóa nút (tự động xóa toàn bộ nút con bên trong). Auto invalidate Redis cache.

#### 1.4. Todo Endpoint (`TodoEndpoint`) - Quản lý Task
- `GET  /api/nodes/:nodeId/todos` - Lấy danh sách Todo của node.
- `POST /api/todos` - Tạo Todo task mới. Kích hoạt Background Job `CalculateCourseProgressCall`.
- `PUT  /api/todos/:id/toggle` - Đổi trạng thái Hoàn thành / Chưa hoàn thành. Kích hoạt Background Job `CalculateCourseProgressCall`.
- `DELETE /api/todos/:id` - Xóa Todo task. Kích hoạt Background Job `CalculateCourseProgressCall`.

#### 1.5. Export & Async Jobs Endpoint (`JobEndpoint`)
- `POST /api/jobs/export-course` - Yêu cầu xuất dữ liệu khóa học ra PDF/Markdown (Khởi tạo `ExportCourseDataCall`). Trả về `jobId`.
- `GET  /api/jobs/:jobId/status` - Lấy trạng thái xử lý ngầm của Job (`[PENDING]`, `[PROCESSING]`, `[COMPLETED]`, `[FAILED]`).

#### 1.6. AI Semantic Search & RAG Assistant Endpoint (`AiEndpoint`)
- `POST /api/ai/search` - Tìm kiếm ngữ nghĩa bài học bằng Vector Embeddings (`{ query: string, topK?: number }`). Trả về danh sách bài học liên quan nhất kèm score tương đồng.
- `POST /api/ai/ask` - Trợ lý AI RAG giải đáp thắc mắc dựa trên toàn bộ tài liệu khóa học (`{ question: string, courseId?: string }`). Trả về câu trả lời tổng hợp kèm liên kết dẫn đến `node_id`.

#### 1.7. Định dạng Response & Error Standard
```json
// Success Response
{
  "success": true,
  "data": { "id": "uuid-v4", "title": "Dart Fundamentals", "position": 1 }
}

// AI RAG Response
{
  "success": true,
  "data": {
    "answer": "Trong Dart Serverpod, xung đột OCC được xử lý bằng trường version...",
    "sources": [
      { "nodeId": "node-123", "title": "Serverpod Architecture", "score": 0.92 }
    ]
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "Node has been updated by another session.",
    "currentVersion": 3
  }
}
```

---

### 2. Thiết Kế Database PostgreSQL (`ltree` + `JSONB` + `pgvector`)

#### 2.1. Dynamic Model YAML mẫu (`models/course_node.yaml`)
```yaml
class: CourseNode
table: course_nodes
fields:
  courseId: Uuid
  parentId: Uuid?
  path: String?               # ltree path 'topic1.module2.session5'
  nodeType: String            # 'TOPIC', 'MODULE', 'SESSION', 'SUBSESSION'
  title: String
  content: String?            # Dynamic JSON (Tiptap AST)
  position: int
  version: int                # OCC: Xử lý ghi đồng thời
  createdAt: DateTime?
indexes:
  course_parent_pos_idx:
    fields: courseId, parentId, position
```

#### 2.2. Generated DDL SQL
```sql
-- 1. Kích hoạt PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS ltree;
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Bảng Khóa học
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bảng Cây Cấu trúc Phân cấp (Postgres LTREE + OCC Versioning)
CREATE TABLE course_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES course_nodes(id) ON DELETE CASCADE,
  path LTREE,
  node_type VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content JSONB,
  position INT NOT NULL DEFAULT 0,
  version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_course_nodes_course_parent_pos ON course_nodes(course_id, parent_id, position);
CREATE INDEX idx_course_nodes_path ON course_nodes USING GIST(path);

-- 4. Bảng Todo đính kèm Node
CREATE TABLE node_todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID NOT NULL REFERENCES course_nodes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  priority VARCHAR(10) DEFAULT 'MEDIUM',
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Bảng Vector Embeddings cho AI Semantic Search & RAG Assistant (pgvector)
CREATE TABLE node_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID NOT NULL REFERENCES course_nodes(id) ON DELETE CASCADE,
  chunk_content TEXT NOT NULL,
  embedding VECTOR(1536), -- Dimension cho Gemini / OpenAI Embeddings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chỉ mục HNSW cho tốc độ query Cosine Vector Search dưới 10ms
CREATE INDEX idx_node_embeddings_vector ON node_embeddings 
USING hnsw (embedding vector_cosine_ops);
```

---

### 3. Xác Thực Auth & Realtime WebSocket Events

#### 3.1. Authentication (Serverpod Auth Session Key)
- Client truyền Session Token trong Header: `Authorization: Bearer <session_key>`.
- Mọi endpoint ngoại trừ `/auth/login` và `/auth/register` bắt buộc phải được bảo vệ bằng Auth Guard.

#### 3.2. Realtime WebSocket Events
Serverpod Streaming Connection gửi và nhận các sự kiện realtime đồng bộ dữ liệu giữa các tab Web và Mobile App:
- `node_reordered`: Phát khi 1 user kéo thả vị trí node trong cây.
- `content_updated`: Phát khi 1 user chỉnh sửa nội dung bài viết.
- `todo_toggled`: Phát khi 1 task Todo được tick chọn.

---

### 4. Quy Chuẩn Cache Keys & Hợp Đồng Async Queue Jobs

#### 4.1. Cache Key Patterns Standard
Tất cả Redis cache key phải tuân thủ chuẩn `snake_case` phân cấp bằng dấu hai chấm `:`:
- `auth:session:{session_token}` -> Data: User Session Json (TTL 24h).
- `course:{course_id}:tree_json` -> Data: Complete Tree Structure Json (TTL 1h).
- `user:{user_id}:course_list` -> Data: Summary User Courses Array (TTL 30m).

#### 4.2. Job Queue Execution Lifecycle
Các tác vụ ngầm đi qua lifecycle chuẩn:
1. `POST /api/jobs/export-course` -> Backend đăng ký `FutureCall('exportCourseDataCall', payload)`.
2. Trả về `jobId` ngay lập tức cho Client dưới dạng HTTP 202 Accepted.
3. Serverpod Worker thực thi tác vụ ở Background Thread.
4. Trạng thái Job cập nhật trong Redis Key `job:status:{job_id}` (`PROCESSING` -> `COMPLETED`).
5. Kết thúc: Gửi sự kiện WebSocket `job_completed` cho Client kèm URL tải xuống.
