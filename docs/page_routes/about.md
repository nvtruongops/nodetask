<!-- Target FE Component: apps/web/src/features/about/AboutPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/about -->

# About Page Route Specification (`about.md`)

> **Route ID**: `ABOUT_MAIN`  
> **Route Name**: `about.main`  
> **Route Path**: `/about`  
> **Route Type**: `PUBLIC`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `ABOUT_MAIN` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `about.main`
- **Description**: Trang Giới thiệu (`/about`) dành cho Developer, Nhà đầu tư và Cộng đồng công nghệ, đóng vai trò trình bày **Sứ mệnh Sản phẩm, Tầm nhìn và Các Quyết định Kiến trúc Kỹ thuật (Engineering Story & Tech Decisions)**: Lý do lựa chọn Dart Serverpod RPC, thuật toán cây PostgreSQL `ltree`, định dạng Tiptap JSON AST, công nghệ AI RAG `pgvector` HNSW và triết lý thiết kế giao diện tối giản Monochrome Zero-Icon.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/about`
- **Access Type**: `PUBLIC`
- **Auth Guard**: `None`
- **Layout Shell**: `PublicLayoutShell`
- **Navigation Metadata**:
  - `sidebar`: `false`
  - `header`: `true`
  - `footer`: `true`
  - `breadcrumb`: `true`
  - `searchable`: `true`
  - `navOrder`: `7`
  - `navGroup`: `"public"`

---

## 3. SEO & Social Meta Specification
- **Title Tag**: `<title>About nodetask - Architecture & Core Principles</title>`
- **Meta Description**: `Tìm hiểu sứ mệnh, triết lý thiết kế Monochrome Zero-Icon và kiến trúc Monorepo nodetask.`
- **Keywords**: `about nodetask, nodetask architecture, zero-icon design, ltree hierarchy`
- **Canonical URL**: `/#/about`
- **OpenGraph Specification**:
  - `og:title`: `About Us - nodetask`
  - `og:description`: `Tầm nhìn, sứ mệnh và câu chuyện phát triển nền tảng nodetask.`
  - `og:image`: `/og-about.png`
  - `og:type`: `website`
  - `og:url`: `/#/about`
- **Twitter Card Specification**:
  - `twitter:card`: `summary_large_image`
  - `twitter:title`: `About nodetask`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/about/AboutPage'))`)
- **Preload Strategy**: `onHover`
- **Chunk Name**: `chunk-about`
- **Priority**: `MEDIUM`

---

## 5. Permission Matrix & RBAC
| System Role | View Access | Interaction Rights | Notes |
| :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Xem nội dung public, chuyển hướng sang `/auth/register` | Khách vãng lai |
| `USER` | **Allowed** | Xem nội dung, có nút chuyển về `/workspace` | Người dùng đã đăng nhập |
| `ORG_MEMBER` | **Allowed** | Xem nội dung, chuyển về `/workspace` | Thành viên tổ chức |
| `ORG_ADMIN` | **Allowed** | Xem nội dung, chuyển về `/workspace` | Quản trị viên tổ chức |
| `SYSTEM_ADMIN` | **Allowed** | Xem nội dung, chuyển về `/admin` | Quản trị hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `I18nEndpoint.getDictionary(locale, namespace: 'about')`: Bộ từ điển đa ngôn ngữ cho trang About.
- **Data Caching & Stale Policy**:
  - `staleTime`: `86400000ms` (24h).
  - `cacheTime`: `604800000ms`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `HYDRATING` → `READY` → `SWITCHING_LOCALE`
- **UI State Breakdown**:
  - `IDLE`: Server HTML hiển thị.
  - `READY`: Nạp xong các khối Mission, Tech Stack Card & Architecture Highlights.

---

## 8. Component Inventory & Tree

### Required Pattern Components (MUST)
- `Hero` + `Timeline` + `SplitShowcase` + `TechnicalCard` + `SpecificationPanel`

### Route Anti-Patterns (MUST NOT)
- ❌ Chỉ có văn bản thuần túy thiếu phân cấp thị giác.
- ❌ Thiếu vạch thời gian cột mốc kiến trúc `Timeline`.
- ❌ Thiếu sơ đồ luồng dữ liệu kiến trúc `SpecificationPanel`.

### Component Inventory List
- `PublicLayoutShell`: Organism bọc Header/Footer.
- `AboutMissionHero`: Hero section trình bày mục đích dự án.
- `TechStackGrid`: Grid hiển thị các khối công nghệ (PostgreSQL ltree, Serverpod, Tiptap, Zero-Icon).
- `ArchitectureHighlights`: Section mô tả sơ đồ dữ liệu và RAG Search.

### Component Tree
```text
[AboutPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
└── [MainContent id="main-content" role="main"]
    ├── [AboutMissionHero]
    ├── [TechStackGrid]
    └── [ArchitectureHighlights]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `404` | Dictionary about không khả thi | N/A (Dùng fallback `about/content/en.json`) | Fallback local static | `ABOUT_I18N_FALLBACK` |
| `500` | Serverpod Backend lỗi | `about.error.server_offline` | Hiển thị static HTML | `ABOUT_SERVER_OFFLINE` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: Guest views About page
  Given a user opens "/about"
  Then the Mission Hero and Tech Stack Grid are displayed
  And 0 icons/emojis are used on screen
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`<main id="main-content" role="main">`).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.
