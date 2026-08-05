# Quy Chuẩn Kiến Trúc Dự Án (Architecture Specification)

---

### 1. Master Tech Stack

| Tầng (Layer) | Công nghệ / Framework | Lý do & Vai trò |
| :--- | :--- | :--- |
| **Web Frontend (FE)** | **React (Vite)** | Tốc độ build cực nhanh, hệ sinh thái Tiptap & dnd-kit tốt nhất. |
| **Styling & UI Kit** | **Tailwind CSS + Shadcn UI** | UI hiện đại, responsive, hỗ trợ Dark/Light mode Monochrome. |
| **State & Caching** | **Zustand + TanStack Query** | Phản hồi kéo-thả dưới 16ms (Optimistic UI updates). |
| **Rich Text Editor** | **Tiptap Editor** | Soạn thảo dạng block (Notion-like), lưu dạng JSON AST. |
| **Drag & Drop Engine**| **`@dnd-kit/core` & `@dnd-kit/sortable`** | Engine kéo thả mượt nhất trên Web DOM. |
| **Backend (BE)** | **Dart (Serverpod Framework)** | Ngôn ngữ Dart mạnh mẽ, tự động sinh Client SDK cho Web & Mobile. |
| **Database (DB)** | **PostgreSQL + pgvector** | ORM Code-First, extension `ltree` (cây), `JSONB` và `pgvector` (RAG Search). |
| **Distributed Cache** | **Redis (Serverpod Redis Cache)** | Caching Session Auth & Cây bài học (Read-heavy) giảm tải DB. |
| **Async Task Queue** | **Serverpod FutureCalls Engine** | Engine native xử lý ngầm (Background jobs & Scheduled Tasks). |
| **Mobile App** | **Flutter (Dart)** | Tái sử dụng 100% Data Models và API Client SDK từ Backend Dart. |

---

### 2. Cấu trúc Tổng quan Monorepo (`./`)

```text
./
├── .agents/                      # AI Agent Governance & Rules (AGENTS.md, skills, prompts, scripts)
├── docs/                         # Bộ tài liệu quy chuẩn cốt lõi (architecture, data_and_api, frontend_and_ui, operations_and_quality)
├── apps/                         # Các ứng dụng client & server
│   ├── web/                      # React (Vite) Frontend
│   ├── server/                   # Dart Serverpod Backend
│   └── mobile/                   # Flutter Mobile App
├── packages/                     # Dynamic Shared packages/models
└── docker-compose.yml            # Docker cấu hình PostgreSQL (pgvector) & Redis
```

#### 2.1. Cấu trúc Frontend Web (`apps/web/src/`)
```text
apps/web/src/
├── assets/                       # Images, Fonts
├── components/                   # Shared UI Components (Shadcn UI, Custom Layout, Tree)
├── features/                     # Feature-driven (auth, courses, editor, todos, ai-search)
├── hooks/                        # Custom React Hooks
├── lib/                          # Utils, Client SDK Instantiation (serverpod.ts, utils.ts)
├── services/                     # API Fetching & React Query Queries
├── store/                        # Zustand Local Stores
├── types/                        # TypeScript Interfaces & Types
└── styles/                       # globals.css (Theme Tokens)
```

#### 2.2. Cấu trúc Backend Serverpod (`apps/server/`)
```text
apps/server/
├── config/                       # Passwords & Server Configuration
├── lib/
│   ├── src/
│   │   ├── endpoints/            # API Endpoints (auth_endpoint, course_endpoint, node_endpoint, todo_endpoint, ai_endpoint)
│   │   ├── generated/            # Code tự sinh bởi Serverpod (DO NOT EDIT)
│   │   ├── models/               # Declarative YAML Models (course.yaml, course_node.yaml, node_todo.yaml, node_embedding.yaml)
│   │   ├── future_calls/         # Serverpod Native Async Job Handlers
│   │   └── services/             # Business Logic & Helpers (ai_service.dart, vector_service.dart)
│   └── server.dart               # Server Initializer Entry
└── pubspec.yaml                  # Dart Dependencies
```

---

### 3. Danh sách Thư viện Yêu cầu (Whitelisted Dependencies)

Chỉ sử dụng các thư viện đã được duyệt dưới đây. **Không cài thêm UI kit hoặc State Library khác.**

#### 3.1. Frontend Web (`apps/web`)
* **UI & Theme**: `tailwindcss`, `next-themes`, `shadcn-ui` / `@radix-ui/*`.
* **Auth & Forms**: `zod`, `react-hook-form`.
* **State & Data**: `zustand`, `@tanstack/react-query`.
* **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`.
* **Rich Text**: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-task-list`.

#### 3.2. Backend (`apps/server`)
* `serverpod`, `serverpod_postgres`, `serverpod_redis`, `serverpod_auth_server`.

#### 3.3. Mobile (`apps/mobile`)
* `flutter_riverpod`, `serverpod_auth_shared_flutter`, `flex_color_scheme`, `go_router`.

---

### 4. Quyết định Kiến trúc Bắt buộc (Architecture Decisions - ADR)

1. **ADR-01: Serverpod Code-First YAML Models & Auto-Generated SDK**
   * Tất cả data model đều được định nghĩa tại `apps/server/lib/src/models/*.yaml`. Dùng `serverpod generate` để tự tạo TypeScript SDK và Dart SDK. KHÔNG bao giờ viết thủ công API client code.
2. **ADR-02: PostgreSQL `ltree` cho Cây bài học phân cấp**
   * Quản lý cây bài học (Topic -> Module -> Session -> Subsession) bằng `ltree` extension trên Postgres. Giúp query nhanh toàn bộ cây con bằng 1 câu lệnh duy nhất mà không tốn công đệ quy.
3. **ADR-03: Optimistic Concurrency Control (OCC)**
   * Dùng trường `version` trong bảng `course_nodes`. Cập nhật dữ liệu luôn kiểm tra `WHERE id = $1 AND version = $2`. Nếu không trùng version, báo lỗi xung đột đồng thời để client rollback.
4. **ADR-04: Serverpod Native Cache & FutureCalls**
   * Sử dụng `session.caches` (In-memory & Redis distributed cache) để cache dữ liệu đọc nhiều. Sử dụng `FutureCalls` làm Task Queue native chạy ngầm mà không cài thêm BullMQ hay RabbitMQ.
5. **ADR-05: PostgreSQL Native Vector Extension (`pgvector`) cho AI Search & RAG**
   * Tận dụng extension `pgvector` ngay trong PostgreSQL database chính với chỉ mục HNSW. KHÔNG cài thêm Vector DB độc lập như Chroma hay Qdrant để tối giản hạ tầng (Zero Extra Infrastructure Bloat).

---

### 5. Đặc Tả Kiến Trúc Cache, Task Queue & Vector Search Specification

#### 5.1. Kiến trúc Caching Service (`session.caches`)
- **Layer 1: Local In-Memory Cache (`session.caches.local`)**:
  - Dùng cho dữ liệu ngắn hạn của single server instance (e.g. Rate Limiting counters, Temporary Tokens).
- **Layer 2: Distributed Redis Cache (`session.caches.global`)**:
  - **Auth Session Cache**: Key `auth:session:{session_key}` (TTL 24 giờ). Xác thực nhanh request mà không query DB.
  - **Course Tree Cache**: Key `course:{course_id}:tree_json` (TTL 1 giờ). Phục vụ hàng ngàn request đọc cây bài học cùng lúc.
- **Cache Invalidation Rules**:
  - Tự động xóa (Purge/Invalidate) Redis Key `course:{course_id}:tree_json` ngay khi thực hiện bất kỳ mutation API nào: `POST /api/nodes`, `PUT /api/nodes/:id`, `PUT /api/nodes/:id/reorder`, `DELETE /api/nodes/:id`.

#### 5.2. Kiến trúc Async Task Queue (`Serverpod FutureCalls Engine`)
Tất cả các tác vụ xử lý ngầm (Background Tasks) đều được đăng ký dưới dạng `FutureCall` handler tại `apps/server/lib/src/future_calls/`:

1. **`CalculateCourseProgressCall`**:
   - Tác vụ tính toán lại phần trăm hoàn thành khóa học dựa trên tổng số `node_todos` đã tick chọn. Đăng ký chạy ngầm khi user hoàn thành task.
2. **`ExportCourseDataCall`**:
   - Tác vụ xuất dữ liệu bài học ra định dạng PDF hoặc Markdown AST. Trả về cho client `job_id` và thông báo khi hoàn tất.
3. **`DailyCleanupCall`**:
   - Scheduled Cron Job đăng ký chạy lúc 00:00 hàng ngày: Xóa các node đã bị soft-delete quá 30 ngày và thu hồi expired auth sessions.

#### 5.3. Kiến trúc AI Semantic Search & RAG Engine (`pgvector`)
Hỗ trợ tính năng học viên nhập câu hỏi / từ khóa ngẫu nhiên -> Hệ thống tự động truy xuất các đoạn bài học phù hợp nhất xuyên suốt các mạng lưới khóa học:

- **Data Chunking & Embedding**:
  - Khi nội dung bài học được lưu/cập nhật (`content` JSONB), tự động chia nhỏ bài viết thành các đoạn (chunks ~500 tokens).
  - Khởi tạo Vector Embedding 1536 chiều bằng Embedding Model (Gemini / OpenAI).
- **Indexing & Retrieval Performance**:
  - Lưu trữ trong bảng PostgreSQL `node_embeddings`.
  - Sử dụng chỉ mục **HNSW (Hierarchical Navigable Small World)** với Cosine Distance (`vector_cosine_ops`), cho tốc độ tìm kiếm dưới **10ms** trên hàng chục nghìn đoạn văn.
- **RAG Course Assistant Flow**:
  - **Step 1**: User gửi câu hỏi qua `POST /api/ai/ask`.
  - **Step 2**: Backend sinh Query Vector -> Query top 3-5 đoạn bài học tương đồng nhất từ `node_embeddings`.
  - **Step 3**: Ghép context bài học vào Prompt -> Trợ lý AI tổng hợp câu trả lời kèm link dẫn trực tiếp tới `node_id` tương ứng.
