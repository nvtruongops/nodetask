# Quy Chuẩn Vận Hành, Chất Lượng & Quy Trình (Operations & Quality Specification)

---

### 1. Coding Conventions & Clean Code Rules

#### 1.1. Naming Standards
* **Directories**: `kebab-case` (e.g. `components/layout/`, `course-tree/`).
* **TS/React Files**: `kebab-case` hoặc `PascalCase` (Component) (e.g. `CourseSidebar.tsx`, `use-course.ts`).
* **Dart Files**: `snake_case` (e.g. `course_endpoint.dart`, `node_todo.yaml`).
* **Class / Interface**: `PascalCase` (e.g. `CourseNode`, `UserProfile`).
* **DB Table & Column**: `snake_case` (e.g. `course_nodes`, `parent_id`).

#### 1.2. Import Order Standard
1. External Third-party Libraries -> 2. Internal UI Components -> 3. Stores & Hooks -> 4. Types & Utils.

#### 1.3. Ponytail Comment Standard
Đối với các đơn giản hóa cố ý (như global lock, naive O(n²) scan), bắt buộc thêm comment:
`// ponytail: <lý do đơn giản hóa & con đường nâng cấp sau này>`

---

### 2. Chiến Lược Kiểm Thử (Testing Strategy) & Security Specs

#### 2.1. Testing Requirements
- **Unit Tests (Dart & TS)**: Kiểm thử logic phân cấp cây (`ltree` parser), hàm tính toán position node, Zod schema validators.
- **Integration Tests (Serverpod)**: Kiểm thử các API Endpoints với test DB (Auth guard, Cascade Delete khi xóa node cha).
- **Quy tắc Kiểm thử**: Mỗi tính năng non-trivial logic phải có ít nhất 1 test case tự động ngắn gọn (không viết test rườm rà).

#### 2.2. Security Specs
- **CSRF & XSS Protection**: Tự động Encode HTML trong Tiptap AST output, dùng SameSite Cookies cho Web.
- **SQL Injection**: Tất cả query PostgreSQL bắt buộc đi qua Serverpod ORM (gõ type-safe) hoặc Parameterized Statements.

---

### 3. Performance Budget & Observability Budget

- **UI Frame Rate**: Phản hồi tương tác Kéo - Thả (Drag & Drop) và Toggle Todo dưới **16ms** (60 FPS).
- **API Response Time**: Endpoints trả lời dưới **100ms** đối với đọc/ghi node đơn lẻ.
- **Logging Level**: Client dùng `console.error()`, Backend Serverpod dùng `session.log()`. Không log token/passwords trong bất kỳ trường hợp nào.

---

### 4. Hướng Dẫn Setup & Lộ Trình Phát Triển (Setup & Roadmap)

#### 4.1. Khởi động môi trường Dev
```bash
# 0. Kích hoạt Git Pre-commit Hook (Kiểm tra AI Agent Rules)
git config core.hooksPath .githooks

# 1. Khởi động Postgres (pgvector) & Redis
docker-compose up -d

# 2. Khởi động Backend Serverpod
cd apps/server && dart bin/main.dart

# 3. Khởi động Frontend Web
cd apps/web && npm run dev
```

#### 4.2. Lộ trình Triển khai 3 Giai đoạn (Phased Roadmap)
- **Giai đoạn 1 (Core MVP Backend & Data)**:
  - Khởi tạo Monorepo (`apps/web`, `apps/server`).
  - Dựng Database Schema PostgreSQL (`LTREE` cây bài học, OCC Versioning, Auth & Course CRUD Endpoints).
- **Giai đoạn 2 (Interactive Frontend Web & Todo System)**:
  - Phát triển Cây bài học Kéo - Thả (`@dnd-kit/sortable`), Tiptap Rich Text Editor.
  - Xây dựng hệ thống Task Todo đính kèm Node (`node_todos`) & Optimistic UI Updates dưới 16ms.
- **Giai đoạn 3 (Mở rộng cuối cùng: Mobile App & AI Search/RAG)**:
  - **1. Mobile App**: Phát triển ứng dụng Flutter Mobile (`apps/mobile`) đồng bộ Client SDK Dart.
  - **2. AI Search / RAG Engine**: Kích hoạt `pgvector` Embeddings, tích hợp AI Semantic Search & AI RAG Course Assistant khi dữ liệu bài học đã phong phú.
