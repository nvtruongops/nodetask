# Demo Page Route Specification (`demo.md`)

> **Route ID**: `DEMO_MAIN`  
> **Route Name**: `demo.main`  
> **Route Path**: `/demo`  
> **Route Type**: `PUBLIC`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `DEMO_MAIN` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `demo.main`
- **Description**: Trang Trải nghiệm tương tác (`/demo`) cung cấp môi trường Sandbox dùng thử giao diện Cây tài liệu Monochrome Zero-Icon và Trình soạn thảo Tiptap AST trực tiếp trên trình duyệt mà không cần đăng ký tài khoản.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/demo`
- **Access Type**: `PUBLIC`
- **Auth Guard**: `None`
- **Layout Shell**: `PublicLayoutShell`
- **Navigation Metadata**:
  - `sidebar`: `false`
  - `header`: `true`
  - `footer`: `true`
  - `breadcrumb`: `true`
  - `searchable`: `true`
  - `navOrder`: `9`
  - `navGroup`: `"public"`

---

## 3. SEO & Social Meta Specification
- **Title Tag**: `<title>Interactive Demo - Try nodetask Sandbox</title>`
- **Meta Description**: `Dùng thử môi trường quản lý cây tài liệu và trình soạn thảo Tiptap nodetask ngay trên trình duyệt.`
- **Keywords**: `nodetask demo, interactive sandbox, zero-icon editor, tiptap demo`
- **Canonical URL**: `https://nodetask.io/demo`
- **OpenGraph Specification**:
  - `og:title`: `Interactive Demo - nodetask Sandbox`
  - `og:description`: `Dùng thử giao diện Monochrome Zero-Icon không cần tạo tài khoản.`
  - `og:image`: `https://nodetask.io/og-demo.png`
- **Twitter Card Specification**:
  - `twitter:card`: `summary_large_image`
  - `twitter:title`: `nodetask Interactive Demo`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/demo/DemoPage'))`)
- **Preload Strategy**: `onHover`
- **Chunk Name**: `chunk-demo`
- **Priority**: `HIGH`

---

## 5. Permission Matrix & RBAC
| System Role | View Access | Sandbox Edit Rights | Notes |
| :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Cho phép tạo node tạm trong memory/IndexedDB | Khách vãng lai |
| `USER` | **Allowed** | Cho phép dùng thử kèm nút "Import to Workspace" | Đã đăng nhập |
| `ORG_MEMBER` | **Allowed** | Cho phép dùng thử | Thành viên tổ chức |
| `ORG_ADMIN` | **Allowed** | Cho phép dùng thử | Quản trị viên |
| `SYSTEM_ADMIN` | **Allowed** | Cho phép dùng thử | Admin hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - None (Demo chạy 100% Client-side qua `IndexedDB` Local Memory State, không ghi nhận dữ liệu thật vào Backend Serverpod DB).
- **Data Caching & Stale Policy**:
  - Local Session Storage.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `INTERACTING` → `EXPORTING`
- **UI State Breakdown**:
  - `IDLE`: Khởi tạo cây tài liệu mẫu (Sample Tree Nodes).
  - `INTERACTING`: Người dùng thực hiện kéo thả node, chỉnh sửa văn bản Tiptap.

---

## 8. Component Inventory & Tree

### Component Inventory List
- `PublicLayoutShell`: Organism bọc giao diện public.
- `DemoTreePreview`: Molecule hiển thị cây tài liệu `ltree` tương tác.
- `DemoEditorPreview`: Molecule hiển thị trình soạn thảo AST Tiptap Zero-Icon.
- `SignUpBanner`: Section CTA kêu gọi đăng ký lưu dữ liệu.

### Component Tree
```text
[DemoPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
└── [MainContent id="main-content" role="main"]
    ├── [DemoHeaderBanner]
    ├── [DemoSandboxWorkspace]
    │   ├── [DemoSidebarTree]
    │   └── [DemoTiptapEditor]
    └── [SignUpCTASection]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| N/A | Lỗi bộ nhớ IndexedDB trình duyệt | `demo.error.storage_full` | Hiển thị nút "Reset Demo Data" | `DEMO_STORAGE_ERROR` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: Guest interacts with Demo Sandbox
  Given a Guest user opens "/demo"
  When adding a new document node in the demo sidebar
  Then the document tree updates instantly in memory
  And 0 icons/emojis are used in the interface
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`role="region"`).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.
