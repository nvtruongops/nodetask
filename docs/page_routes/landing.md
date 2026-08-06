# Landing Page Route Specification (`landing.md`)

> **Route ID**: `LANDING_MAIN`  
> **Route Name**: `landing.main`  
> **Route Path**: `/`  
> **Route Type**: `PUBLIC`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `LANDING_MAIN` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `landing.main`
- **Description**: Trang chủ (`/`) là điểm tiếp cận đầu tiên của người dùng vãng lai (`GUEST`) tới nền tảng **`nodetask`** — Monorepo Quản lý Không gian Tài liệu & Tri thức Cá nhân / Tổ chức. Trang chủ giới thiệu các tính năng cốt lõi: Cấu trúc cây tài liệu phân cấp (`ltree`), Trình soạn thảo AST Tiptap, Giao diện tối giản Monochrome Zero-Icon, Bộ chuyển đổi Theme (Dark/Light/System) và Đa ngôn ngữ (`i18n`), cùng Trợ lý AI Tìm kiếm Ngữ nghĩa RAG (`pgvector`).

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/`
- **Access Type**: `PUBLIC` (Truy cập tự do không cần Session Token)
- **Auth Guard**: `GuestOnly` (Nếu đã đăng nhập, tự động chuyển hướng đến `/workspace`)
- **Layout Shell**: `PublicLayoutShell` (Header điều hướng tĩnh tích hợp Logo, Theme & Language Switcher, Footer liên kết)
- **Navigation Metadata**:
  - `sidebar`: `false`
  - `header`: `true`
  - `footer`: `true`
  - `breadcrumb`: `false`
  - `searchable`: `true`
  - `navOrder`: `1`
  - `navGroup`: `"public"`

---

## 3. SEO & Social Meta Specification
- **Title Tag**: `<title>nodetask - Monorepo Document & Knowledge Space Management</title>`
- **Meta Description**: `nodetask là nền tảng quản lý tài liệu và tri thức tối giản Monochrome Zero-Icon, hỗ trợ cây tài liệu ltree, trình soạn thảo Tiptap AST và AI Search pgvector.`
- **Keywords**: `nodetask, document management, knowledge base, ltree, tiptap, serverpod, zero-icon, monochrome`
- **Canonical URL**: `https://nodetask.io/`
- **OpenGraph Specification**:
  - `og:title`: `nodetask - Monorepo Document & Knowledge Space Management`
  - `og:description`: `Quản lý không gian tài liệu & tri thức cá nhân/tổ chức với kiến trúc Monochrome Zero-Icon tối giản.`
  - `og:image`: `https://nodetask.io/og-landing.png`
  - `og:type`: `website`
  - `og:url`: `https://nodetask.io/`
- **Twitter Card Specification**:
  - `twitter:card`: `summary_large_image`
  - `twitter:site`: `@nodetask`
  - `twitter:title`: `nodetask - Knowledge Space Management`
  - `twitter:description`: `Monochrome Zero-Icon Knowledge Management Platform.`
  - `twitter:image`: `https://nodetask.io/og-landing.png`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/landing/LandingPage'))`)
- **Preload Strategy**: `onHover` (Preload chunk khi người dùng hover chuột vào Logo hoặc Nút Trang chủ)
- **Chunk Name**: `chunk-landing`
- **Priority**: `CRITICAL` (Trang tiếp cận đầu tiên, ưu tiên render HTML/CSS cực cao)

---

## 5. Permission Matrix & RBAC
| System Role | View Access | CTA Primary Behavior | Navigation Rights | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Điều hướng `/auth/register` hoặc `/demo` | Đầy đủ Header/Footer public | Đối tượng phục vụ chính |
| `USER` | **Redirect** | Tự động chuyển hướng đến `/workspace` | Redirect tức thì qua `AuthGuard` | Tránh lặp thông tin công khai |
| `ORG_MEMBER` | **Redirect** | Tự động chuyển hướng đến `/workspace` | Redirect qua `AuthGuard` | Thành viên tổ chức |
| `ORG_ADMIN` | **Redirect** | Tự động chuyển hướng đến `/workspace` | Redirect qua `AuthGuard` | Quản trị viên tổ chức |
| `SYSTEM_ADMIN` | **Redirect** | Tự động chuyển hướng đến `/admin` | Redirect qua `AuthGuard` | Quản trị hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `I18nEndpoint.getDictionary(locale: String, namespace: 'landing')`: Lấy bộ từ điển đa ngôn ngữ cho Namespace `landing`.
- **Data Caching & Stale Policy**:
  - `staleTime`: `86400000ms` (24 giờ, cached tại Client IndexedDB via `useLanguageStore`).
  - `cacheTime`: `604800000ms` (7 ngày).
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `HYDRATING` → `READY` → `SWITCHING_LOCALE` / `REDIRECTING_WORKSPACE`
- **UI State Breakdown**:
  - `IDLE`: Server-Side HTML đã sẵn sàng.
  - `HYDRATING`: Client Hydration đang kết nối Zustand Stores (`useAuthStore`, `useThemeStore`).
  - `READY`: Hiển thị toàn bộ Hero, Feature Cards, FAQ & Footer.
  - `SWITCHING_LOCALE`: Cập nhật `locale` từ `en` ↔ `vi`, thay đổi tức thì các `contentKey`.
  - `REDIRECTING_WORKSPACE`: Nếu phát hiện Token hợp lệ, kích hoạt chuyển hướng sang `/workspace`.

---

## 8. Component Inventory & Tree

### Component Inventory List
- `PublicLayoutShell`: Organism bọc Header & Footer công khai.
- `PublicHeader`: Organism thanh điều hướng trên cùng kèm Logo, Link, Switchers.
- `PublicFooter`: Organism thanh chân trang thông tin bản quyền và chính sách.
- `LandingHeroSection`: Section chính hiển thị Tiêu đề, Mô tả và CTA Buttons.
- `LandingFeaturesGrid`: Grid 6 Card giới thiệu tính năng cốt lõi (ltree, Tiptap, Zero-Icon, RAG).
- `LandingDemoPreview`: Molecule preview giao diện workspace dạng ASCII / Zero-Icon frame.
- `ThemeSwitcherButton`: Atom nút chuyển đổi giao diện Dark/Light/System.
- `LanguageSwitcherButton`: Atom nút chuyển đổi ngôn ngữ EN/VI.

### Component Tree
```text
[LandingPageContainer]
├── [LandingErrorBoundary]
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
│   ├── [BrandLogoLink target="/"]
│   ├── [NavLinks]
│   ├── [HeaderControls]
│   │   ├── [ThemeSwitcherButton]
│   │   └── [LanguageSwitcherButton]
│   └── [AuthCTAButtons]
│       ├── [ConditionalRendering role="GUEST"]
│       │   ├── [LoginLink target="/auth/login"]
│       │   └── [RegisterLink target="/auth/register"]
│       └── [ConditionalRendering role="USER"]
│           └── [GoToWorkspaceLink target="/workspace"]
└── [MainContent id="main-content" role="main"]
    ├── [HeroSection]
    ├── [FeaturesGridSection]
    ├── [DemoPreviewSection]
    └── [CTASection]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Session token hết hạn khi kiểm tra auth | `landing.error.unauthorized` | Giữ nguyên vai trò GUEST, xoá local session | `LANDING_AUTH_EXPIRED` |
| `403` | Tài khoản bị khoá khi chuyển hướng | `landing.error.forbidden` | Chuyển hướng `/auth/login?reason=disabled` | `LANDING_AUTH_DISABLED` |
| `404` | Endpoint RPC i18n không phản hồi | N/A (Dùng fallback locale JSON Cục bộ) | Tự động khôi phục từ `content/en.json` | `LANDING_I18N_FALLBACK` |
| `429` | Quá nhiều request tải dictionary | `landing.error.rate_limit` | Sử dụng Cache trong IndexedDB | `LANDING_RATE_LIMITED` |
| `500` | Serverpod Backend Offline | `landing.error.server_offline` | Hiển thị Banner offline, fallback local static | `LANDING_SERVER_OFFLINE` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: Guest accesses Landing Page successfully
  Given a Guest user navigates to "https://nodetask.io/"
  When the page finishes hydration in <100ms
  Then the Hero Section, Features Grid, and Header CTA Buttons ("Sign In", "Get Started") are displayed
  And 0 icons or emojis are rendered on the UI

Scenario: Authenticated User is auto-redirected to Workspace
  Given a User with a valid session token visits "/"
  When the AuthGuard evaluates `useAuthStore.isAuthenticated == true`
  Then the user is immediately redirected to "/workspace"
  And the Landing Page is not rendered

Scenario: Language Switcher toggles content between English and Vietnamese
  Given a Guest user on the Landing Page
  When the user clicks the Language Switcher button from "EN" to "VI"
  Then all text elements update dynamically according to "vi.json" content keys
  And the selected locale "vi" is persisted in `useLanguageStore`

Scenario: Accessibility keyboard navigation
  Given a keyboard user presses `Tab` on initial page load
  When focus lands on the "Skip to Content" link
  Then pressing `Enter` moves keyboard focus directly to `<main id="main-content">`
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`<main id="main-content" role="main">`, `aria-live="polite"`).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.
