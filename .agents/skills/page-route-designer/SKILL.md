---
name: page-route-designer
description: Skill thiết kế và cập nhật các file đặc tả tuyến đường trang trong docs/page_routes/*.md tuân thủ Schema Contract & No Mock Data Rule.
---

# Page Route Designer Skill (Execution Guide)

Mục đích: Hướng dẫn AI Agent thiết kế và cập nhật các file đặc tả tuyến đường trang (Page Route Specifications) trong `docs/page_routes/*.md` tuân thủ 100% Schema Contract tại [`.agents/schemas/page-route-doc.yaml`](file:///e:/Code/nodetask/.agents/schemas/page-route-doc.yaml) và quy tắc AI Agent Governance.

---

## 🚨 STRICT MANDATORY EXECUTION PROTOCOL (CỔNG THỰC THI BẮT BUỘC)

Toàn bộ AI Agent BẮT BỘC tuân thủ nghiêm ngặt **Quy trình 4 Cổng thực thi (4 Execution Gateways)** dưới đây. Tuyệt đối **KHÔNG LÁCH BƯỚC** hoặc tự ý tạo/sửa file spec khi chưa thực hiện kiểm tra tài liệu nền tảng.

```text
[ CỔNG 1: READ SCHEMA & API DOCS ] ──► [ CỔNG 2: SCHEMA CHECKLIST ] ──► [ CỔNG 3: GENERATE / UPDATE SPEC ] ──► [ CỔNG 4: VERIFY.JS ]
```

---

### 🟢 CỔNG 1: READ SCHEMA & API DOCS FIRST (KHÔNG SỬA SPEC NẾU CHƯA THỰC HIỆN BƯỚC NÀY)

Trước khi tạo hoặc chỉnh sửa bất kỳ tệp đặc tả nào trong `docs/page_routes/*.md`, AI Agent **BẮT BỘC** phải gọi tool `view_file` mở **ĐỦ CẢ 2 TỆP**:

1. 👉 [`.agents/schemas/page-route-doc.yaml`](file:///e:/Code/nodetask/.agents/schemas/page-route-doc.yaml) - Schema contract quy định 11 sections bắt buộc.
2. 👉 [docs/data_and_api.md](file:///e:/Code/nodetask/docs/data_and_api.md) (hoặc `docs/services/*.md` liên quan) - Danh mục API Endpoints & Data Models thực tế.

> ⚠️ **STRICT GUARDRAIL**: Agent **KHÔNG ĐƯỢC PHÉP** ghi hoặc cập nhật file spec trang trước khi có tool call `view_file` đọc schema contract trong phiên làm việc.

---

### 🔵 CỔNG 2: MANDATORY SCHEMA & POLICY CHECKLIST

Mọi file `docs/page_routes/*.md` BẮT BỘC phải đáp ứng 100% các tiêu chí sau:

1. **Target FE Component & Runtime URL Header**: Bắt đầu bằng 2 dòng HTML comments:
   ```markdown
   <!-- Target FE Component: apps/web/src/features/<feature_name>/<PageName>.tsx -->
   <!-- Target Runtime URL: http://localhost:5173/#/<route_path> -->
   ```
2. **11 Mandatory Sections (Đủ 11 Mục Bắt Buộc)**:
   - `Overview & Route ID` (chứa `Route ID`)
   - `Route Config & Navigation Metadata` (chứa `Page Archetype`)
   - `SEO & Social Meta Specification` (chứa `Title Tag`)
   - `Loading Strategy & Code Splitting` (chứa `Lazy Load`)
   - `Permission Matrix & RBAC` (chứa đủ 5 roles: `GUEST`, `USER`, `ORG_MEMBER`, `ORG_ADMIN`, `SYSTEM_ADMIN`)
   - `API Dependency & Serverpod RPC` (chứa `Serverpod`)
   - `Page State Machine & UI Transitions` (chứa `IDLE`)
   - `Component Inventory & Tree` (chứa `Required Pattern Components` & `Route Anti-Patterns`)
   - `Error Mapping & Handling` (chứa `401` & `500`)
   - `Acceptance Criteria & QA Scenarios` (chứa Gherkin `Scenario:`, `Given`, `When`, `Then`)
   - `Accessibility` (chứa `WAI-ARIA`)
3. **Page Archetype Declaration**: Khai báo 1 trong 5 Archetypes (`Marketing & Showcase`, `Documentation & Legal Spec`, `Story & Organization`, `Auth & Form Focus`, `Workspace & IDE Canvas`).
4. **No Mock Data & Strict System Roles**: Tuyệt đối **KHÔNG MOCK DATA & KHÔNG MOCK DOMAIN**. Sử dụng URL tương đối `/#/<route_path>` và tham chiếu đúng endpoint từ `docs/services/*.md`.
5. **Zero Icon Rule**: Mô tả bằng thuộc tính trừu tượng, 0 icon/emoji (thay thế bằng nhãn ngoặc vuông `[ ]`).

---

### 🟡 CỔNG 3: SPECIFICATION FILE GENERATION / UPDATE

Tiến hành khởi tạo hoặc cập nhật file đặc tả trang tuân thủ đúng định dạng Markdown đã được phê duyệt.

---

### 🔴 CỔNG 4: VERIFICATION & COMPLETION LOOP

Sau khi tạo hoặc chỉnh sửa file đặc tả tại `docs/page_routes/*.md`, Agent **BẮT BỘC** thực hiện kiểm thử tự động:

```bash
node .agents/scripts/verify.js --strict
```

Chỉ khi kết quả xuất ra **PASS (0 Errors, 0 Warnings)** mới kết thúc công việc.
