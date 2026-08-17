<!-- Target FE Component: apps/web/src/features/demo/DemoPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/demo -->

# Demo Page Route Specification (`demo.md`)

> **Route ID**: `DEMO_MAIN`  
> **Route Name**: `demo.main`  
> **Route Path**: `/demo`  
> **Route Type**: `PUBLIC`  
> **Page Archetype**: `Marketing & Showcase`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `2.1.0`  
> **Status**: `APPROVED & ENFORCED`  

---

## 1. Overview & Route ID
- **Route ID**: `DEMO_MAIN` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `demo.main`
- **Description**: Trang Trải nghiệm Trực tiếp (`/demo`) cung cấp môi trường **Interactive In-Browser Sandbox** cho phép người dùng vãng lai (`GUEST`) trải nghiệm 100% sức mạnh của `nodetask` mà không cần tạo tài khoản hay cung cấp thẻ tín dụng:
  1. **Zero-Friction Hands-On Sandbox**: Nạp sẵn một kho tri thức mẫu gồm các tài liệu Kỹ thuật Kiến trúc hệ thống, Lộ trình Sản phẩm và Ghi chú Học thuật đa tầng.
  2. **Live Interactive Workflows**:
     - *Thử nghiệm Kéo-Thả Cây phân cấp*: Thao tác di chuyển, lồng sâu và sắp xếp lại các nhánh tài liệu với độ trễ phản hồi <16ms.
     - *Soạn thảo Tiptap Block AST*: Trải nghiệm trình soạn thảo khối hỗ trợ Code block, Checklist tiến độ, Callout cảnh báo và Markdown syntax.
     - *Thử nghiệm Trợ lý Semantic RAG*: Nhập câu hỏi tự nhiên trên thanh tìm kiếm để trải nghiệm thuật toán trích xuất đoạn tri thức tương đồng.
  3. **Seamless Conversion Hook**: Nút hành động `[Lưu vào Workspace của bạn]` cho phép chuyển đổi toàn bộ dữ liệu đang soạn thảo trong sandbox sang tài khoản chính thức chỉ trong 1 bước.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/demo`
- **Access Type**: `PUBLIC`
- **Page Archetype**: `Marketing & Showcase`
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

## 3. SEO & Social Meta Specification (SEO & Social Share Metadata)
- **Title Tag**: `<title>Interactive Sandbox Demo - Try nodetask Live in Browser</title>`
- **Meta Description**: `Trải nghiệm trực tiếp trình quản lý cây tài liệu phân cấp ltree và soạn thảo Tiptap AST của nodetask ngay trên trình duyệt mà không cần đăng ký.`
- **Keywords**: `nodetask demo, live interactive demo, nested notes sandbox, zero-icon editor demo, local-first sandbox, tiptap ast demo`
- **Canonical URL**: `/#/demo`
- **OpenGraph Specification**:
  - `og:title`: `Interactive Sandbox Demo - nodetask`
  - `og:description`: `Thử nghiệm kéo thả cây tài liệu và soạn thảo không xao nhãng ngay trên trình duyệt.`
  - `og:image`: `/og-demo.png`
  - `og:type`: `website`
  - `og:url`: `/#/demo`
- **Twitter Card Specification**:
  - `twitter:card`: `summary_large_image`
  - `twitter:title`: `nodetask Interactive Sandbox`
  - `twitter:description`: `Test drive the nested document workspace live in your browser.`
  - `twitter:image`: `/og-demo.png`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/demo/DemoPage'))`)
- **Preload Strategy**: `onHover`
- **Chunk Name**: `chunk-demo`
- **Priority**: `HIGH`

---

## 5. Permission Matrix & RBAC (Access Control & RBAC Permissions)
| System Role | View Access | Sandbox Edit Rights | Notes |
| :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Tạo / Sửa / Kéo thả nốt tài liệu tạm trong bộ nhớ Client | Môi trường Sandbox |
| `USER` | **Allowed** | Trải nghiệm Sandbox kèm nút "Nhập vào Workspace chính" | Đã đăng nhập |
| `ORG_MEMBER` | **Allowed** | Trải nghiệm Sandbox | Thành viên tổ chức |
| `ORG_ADMIN` | **Allowed** | Trải nghiệm Sandbox | Quản trị viên |
| `SYSTEM_ADMIN` | **Allowed** | Trải nghiệm Sandbox | Admin hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `I18nEndpoint.getDictionary(locale: String, namespace: 'demo')`: Tải từ điển ngôn ngữ cho Sandbox.
  - `NodeEndpoint.getSampleTemplateNodes()`: Nạp cây tài liệu mẫu từ Serverpod backend khi khởi tạo sandbox (fallback local IndexedDB nếu offline).
- **Serverpod Architecture Reference**: Môi trường Demo mô phỏng trọn vẹn hợp đồng dữ liệu Serverpod DTOs và cấu trúc cây `ltree`.
- **Data Caching & Stale Policy**:
  - Client-Side IndexedDB / Session Storage Cache (TTL: Phiên làm việc hiện tại).
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `HYDRATING_SANDBOX` → `INTERACTING` → `EXPORTING` / `SAVING_TO_ACCOUNT`
- **UI State Breakdown**:
  - `IDLE`: Server HTML sẵn sàng.
  - `HYDRATING_SANDBOX`: Nạp dữ liệu cây phân cấp mẫu và khởi tạo Zustand Local Store.
  - `INTERACTING`: Người dùng thực hiện kéo thả node, soạn thảo văn bản Tiptap AST, kiểm tra checklist todo.
  - `SAVING_TO_ACCOUNT`: Kích hoạt lưu dữ liệu sandbox và chuyển hướng sang `/auth/register`.

---

## 8. Component Inventory & Tree

### Required Pattern Components (MUST)
- `Required Pattern Components`: `Hero`, `DemoHeaderBanner`, `InteractiveSandboxWorkspace`, `DemoSidebarTree`, `DemoTiptapEditor`, `SpecificationPanel`, `CTA`, `Footer`

### Route Anti-Patterns (MUST NOT)
- `Route Anti-Patterns`:
  - ❌ Giao diện Sandbox bị khóa cứng không cho phép người dùng sửa đổi.
  - ❌ Dùng Icon/Emoji trên thanh công cụ cây tài liệu — bắt buộc dùng text glyphs `[+]`, `[-]`, `[DOC]`, `[DIR]`.
  - ❌ Mất toàn bộ nội dung khi chuyển hướng đăng ký — bắt buộc chuyển tiếp State sang Onboarding.

### Component Inventory List
- `PublicLayoutShell`: Organism bọc giao diện public.
- `DemoHeaderBanner`: Banner hướng dẫn người dùng thử nghiệm các tính năng cốt lõi.
- `DemoSidebarTree`: Molecule cây tài liệu phân cấp tương tác kéo thả.
- `DemoTiptapEditor`: Molecule trình soạn thảo AST hỗ trợ đầy đủ khối block.
- `SignUpBannerCTA`: Section kêu gọi đăng ký lưu trữ đám mây.

### Component Tree
```text
[DemoPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
└── [MainContent id="main-content" role="main"]
    ├── [DemoHeaderBanner]
    │   ├── [BannerBadge label="[SANDBOX MODE • NO ACCOUNT REQUIRED]"]
    │   ├── [BannerTitle contentKey="demo.title"]
    │   └── [BannerInstructionsList]
    ├── [InteractiveSandboxWorkspace]
    │   ├── [DemoSidebarTree]
    │   │   ├── [TreeHeaderActions]
    │   │   └── [NestedNodeItemsList]
    │   └── [DemoTiptapEditor]
    │       ├── [EditorToolbar]
    │       └── [EditorContentArea]
    ├── [SandboxCapabilitiesPanel]
    └── [SaveToAccountCTA target="/auth/register"]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Session hết hạn khi lưu dữ liệu sang tài khoản | `demo.error.unauthorized` | Chuyển hướng `/auth/register` lưu state | `DEMO_AUTH_EXPIRED` |
| `404` | Template mẫu không tải được | N/A (Dùng fallback Offline Template) | Khởi tạo cây mẫu từ memory | `DEMO_TEMPLATE_FALLBACK` |
| `429` | Thao tác xuất khẩu dữ liệu quá tải | `demo.error.rate_limit` | Tạm dừng 5 giây | `DEMO_RATE_LIMITED` |
| `500` | Serverpod Backend gặp lỗi khi đồng bộ | `demo.error.server_offline` | Chuyển sang chế độ Thuần Offline | `DEMO_SERVER_OFFLINE` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: Guest interacts with Demo Sandbox
  Given a Guest user opens "/demo"
  When adding a new document node in the demo sidebar
  Then the document tree updates instantly in memory with sub-16ms response
  And 0 icons/emojis are used in the interface

Scenario: Guest saves sandbox data to a new account
  Given a user having modified documents in Sandbox
  When clicking "[Save to Your Workspace]"
  Then the modified state is serialized into localStorage
  And the user is routed to "/auth/register?source=sandbox"
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`role="region"`, `aria-label="Interactive Sandbox Workspace"`).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.

