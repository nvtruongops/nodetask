---
name: page-route-designer
description: Skill thiết kế và cập nhật các file đặc tả tuyến đường trang trong docs/page_routes/*.md tuân thủ Schema Contract & No Mock Data Rule.
---

# Page Route Designer Skill

## Overview

Skill **`page-route-designer`** hướng dẫn AI Agent thiết kế và cập nhật các file đặc tả tuyến đường trang (Page Route Specifications) trong `docs/page_routes/*.md` tuân thủ 100% Schema Contract và quy tắc AI Agent Governance.

---

## 1. 📖 Required Reading

Trước khi khởi tạo hoặc chỉnh sửa file đặc tả trang, AI Agent **BẮT BỘC** đọc Schema Contract tại:
👉 [`.agents/schemas/page-route-doc.yaml`](file:///e:/Code/nodetask/.agents/schemas/page-route-doc.yaml)

---

## 2. 📋 Execution Checklist

- [ ] **Target FE Component & Runtime URL Header**: File `docs/page_routes/*.md` BẮT BỘC bắt đầu bằng các dòng comment HTML chỉ định đường dẫn Component React FE và URL thực thi môi trường phát triển (KHÔNG MOCK DOMAIN):
  ```markdown
  <!-- Target FE Component: apps/web/src/features/<feature_name>/<PageName>.tsx -->
  <!-- Target Runtime URL: http://localhost:5173/#/<route_path> -->
  ```
- [ ] **11 Mandatory Sections**: `Overview & Route ID`, `Route Config & Navigation Metadata`, `SEO & Social Meta Specification`, `Loading Strategy & Code Splitting`, `Permission Matrix & RBAC`, `API Dependency & Serverpod RPC`, `Page State Machine & UI Transitions`, `Component Inventory & Tree`, `Error Mapping & Handling`, `Acceptance Criteria & QA Scenarios`, `Accessibility`.
- [ ] **Page Archetype Declaration**: Phải khai báo 1 trong 5 Page Archetypes (`Marketing & Showcase`, `Documentation & Legal Spec`, `Story & Organization`, `Auth & Form Focus`, `Workspace & IDE Canvas`).
- [ ] **No Mock Data / No Fake Domain & 5 RBAC Roles**: Tuyệt đối **KHÔNG MOCK DATA & KHÔNG MOCK DOMAIN**. Section `Permission Matrix` BẮT BỘC chứa đủ 5 roles chuẩn từ `docs/data_and_api.md`: `GUEST`, `USER`, `ORG_MEMBER`, `ORG_ADMIN`, `SYSTEM_ADMIN`. Canonical URL & Meta URL sử dụng đường dẫn tương đối `/#/<route_path>`. Tất cả Endpoints tham chiếu chuẩn từ `docs/services/*.md`.
- [ ] **Zero CSS Framework Classes & 0 Icon**: Mô tả ý định thiết kế bằng thuộc tính trừu tượng, 0 icon/emoji (thay thế bằng text label `[ ]`).
- [ ] **Gherkin QA Scenarios**: Section `Acceptance Criteria` chứa cấu trúc `Scenario:`, `Given`, `When`, `Then`.

---

## 3. 🧪 Verification & Completion Loop

Sau khi khởi tạo hoặc chỉnh sửa file đặc tả tại `docs/page_routes/*.md`, Agent **BẮT BỘC** thực hiện kiểm thử:

```bash
node .agents/scripts/verify.js --strict
```

Chỉ khi kết quả báo **PASS (0 Errors, 0 Warnings)** mới tuyên bố hoàn thành task.
