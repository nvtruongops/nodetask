<!-- Target FE Component: apps/web/src/features/landing/LandingPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/ -->

# Landing Page Route Specification (`landing.md`)

> **Route ID**: `LANDING_MAIN`  
> **Route Name**: `landing.main`  
> **Route Path**: `/`  
> **Route Type**: `PUBLIC`  
> **Page Archetype**: `Marketing & Showcase`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `2.1.0`  
> **Status**: `APPROVED & ENFORCED`  

---

## 1. Overview & Route ID
- **Route ID**: `LANDING_MAIN` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `landing.main`
- **Description**: Trang chủ (`/`) là cổng thông tin chính giới thiệu **`nodetask`** — Không gian Quản lý Tri thức & Điều phối Tác vụ Phân cấp (Local-first Hierarchical Knowledge & Task Workspace) dành cho Kỹ sư phần mềm, Nhà nghiên cứu và Đội ngũ sản phẩm. Trang chủ được thiết kế theo nguyên lý **Liftable Content & Direct Value Hierarchy** (chuẩn AEO/SEO):
  1. **Direct Value Proposition**: Trực tiếp định nghĩa giá trị cốt lõi ngay câu đầu tiên — Tổ chức cây tài liệu lồng nhau không giới hạn độ sâu (`ltree`), Trình soạn thảo tập trung cao độ Tiptap AST không giật lag (<16ms DnD), Trợ lý Semantic RAG hỏi đáp tức thì trên đồ thị tri thức nội bộ (`pgvector`), và Giao diện Typography Monochrome 100% Zero-Icon loại bỏ 100% yếu tố xao nhãng.
  2. **Liftable Copywriting & E-E-A-T Proof Points**: Mỗi khối nội dung được cấu trúc độc lập để các bộ máy trả lời AI (ChatGPT, Perplexity, Google SGE) và người dùng có thể trích xuất thông tin chuẩn xác mà không bị cắt nghĩa.
  3. **High-Converting Product Journey**: Từ Hero giải quyết bài toán phân mảnh ghi chú -> Ma trận so sánh tính năng -> Xem trước Sandbox trực tiếp -> 6 Câu hỏi thường gặp cốt lõi (FAQ Schema) -> Kêu gọi hành động trải nghiệm tức thì không cần thẻ tín dụng.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/`
- **Access Type**: `PUBLIC` (Truy cập tự do không cần Session Token)
- **Page Archetype**: `Marketing & Showcase`
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

## 3. SEO & Social Meta Specification (SEO & Social Share Metadata)
- **Title Tag**: `<title>nodetask</title>`
- **Meta Description**: `Không gian quản lý tài liệu phân cấp không giới hạn độ sâu, soạn thảo tập trung cao độ và tìm kiếm tri thức AI ngữ nghĩa với giao diện Monochrome 100% Zero-Icon.`
- **Keywords**: `nodetask, hierarchical notes, nested document tree, ltree postgresql, pgvector semantic search, zero-icon ui, distraction-free workspace, local-first note taking, developer documentation, tiptap ast editor`
- **Canonical URL**: `/#/`
- **OpenGraph Specification**:
  - `og:title`: `nodetask - Unlimited Nested Notes & AI Knowledge Workspace`
  - `og:description`: `Tổ chức ghi chú lồng nhau không giới hạn, tìm kiếm ngữ nghĩa siêu tốc và tối đa hóa năng suất với giao diện thuần Typography Monochrome.`
  - `og:image`: `/og-landing.png`
  - `og:type`: `website`
  - `og:url`: `/#/`
- **Twitter Card Specification**:
  - `twitter:card`: `summary_large_image`
  - `twitter:site`: `@nodetask`
  - `twitter:title`: `nodetask - Local-First Hierarchical Knowledge Workspace`
  - `twitter:description`: `Distraction-free nested notes, task execution, and instant AI semantic search.`
  - `twitter:image`: `/og-landing.png`
- **Structured Data (JSON-LD)**:
  - `@type`: `SoftwareApplication` / `Organization`
  - `applicationCategory`: `ProductivityApplication`
  - `operatingSystem`: `Web, Desktop, Mobile`
  - `offers`: `{ price: "0.00", priceCurrency: "USD" }`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/landing/LandingPage'))`)
- **Preload Strategy**: `onHover` (Preload chunk khi người dùng hover chuột vào Logo hoặc Nút Trang chủ)
- **Chunk Name**: `chunk-landing`
- **Priority**: `CRITICAL` (Trang tiếp cận đầu tiên, ưu tiên render HTML/CSS cực cao)

---

## 5. Permission Matrix & RBAC (Access Control & RBAC Permissions)
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
  - `WorkspaceEndpoint.getPublicPricingPlans(session)`: Lấy dữ liệu các gói cước hiển thị trên Preview Pricing Block.
- **Serverpod Contract Integration**: Toàn bộ RPC gọi thông qua Serverpod Client Protocol đảm bảo Type-Safety từ Dart sang TypeScript.
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
  - `READY`: Hiển thị toàn bộ Hero, Feature Cards, Value Comparison, Interactive Preview, FAQ & Footer.
  - `SWITCHING_LOCALE`: Cập nhật `locale` từ `en` ↔ `vi`, thay đổi tức thì các `contentKey`.
  - `REDIRECTING_WORKSPACE`: Nếu phát hiện Token hợp lệ, kích hoạt chuyển hướng sang `/workspace`.

---

## 8. Component Inventory & Tree

### Required Pattern Components (MUST)
- `Required Pattern Components`: `Hero`, `MetricsGrid`, `ValueComparisonTable`, `BentoGrid`, `InteractiveSandboxPreview`, `FaqAccordionSection`, `SectionDivider`, `CTA`, `Footer`

### Route Anti-Patterns (MUST NOT)
- `Route Anti-Patterns`:
  - ❌ Hero nhồi nhét tên thuật ngữ backend thô mà không giải thích giá trị thực tế cho người dùng.
  - ❌ Single centered column stack cuộn dọc đơn điệu.
  - ❌ Khoảng trắng chết >30vh lãng phí.
  - ❌ Dùng Icon/Emoji (SVG Lucide, FontAwesome, Unicode Emoji) — bắt buộc dùng Monochrome Typography Tokens & Text Badges `[ ]`.
  - ❌ Thiếu bảng so sánh ma trận giá trị người dùng `ValueComparisonTable`.

### Editorial Sections & Content Structure
1. **Hero Section (Value Headline)**:
   - *Primary Headline*: "Tổ chức Tri thức Phân cấp. Soạn thảo Không Xao nhãng. Tìm kiếm Ngữ nghĩa Tức thì."
   - *Subheading*: "nodetask hợp nhất ghi chú phân cấp đa tầng, danh sách công việc theo ngữ cảnh và trợ lý AI RAG trong một giao diện Monochrome tinh khiết — được thiết kế để bạn tập trung trọn vẹn vào tư duy sâu."
   - *Primary CTAs*: `[Bắt đầu Miễn phí]` (Dẫn tới `/auth/register`) và `[Thử Sandbox Trực tiếp]` (Dẫn tới `/demo`).
   - *Trust Proofs*: `[Hoàn toàn Miễn phí]` • `[Không cần Thẻ tín dụng]` • `[Hỗ trợ Offline Local-First]`.
2. **Metrics & Engineering Benchmarks Grid**:
   - `01. ĐỘ TRỄ KÉO THẢ`: `<16ms` (Duy trì chuẩn 60 FPS mượt mà với dnd-kit và vị trí số nguyên).
   - `02. TRUY VẤN CÂY PHÂN CẤP`: `O(log N)` (PostgreSQL `ltree` index hỗ trợ hàng triệu nút tài liệu tức thì).
   - `03. TÌM KIẾM NGỮ NGHĨA AI`: `<10ms` (Chỉ mục `pgvector` HNSW 1536 chiều Cosine Distance).
   - `04. BẢO TOÀN DỮ LIỆU`: `100%` (Optimistic Concurrency Control OCC ngăn chặn ghi đè xung đột).
3. **Core Value Pillars (Bento Grid 4 Khối)**:
   - *Khối 1: Cây Tài liệu Lồng nhau Vô tận*: Không giới hạn độ sâu thư mục. Kéo thả phân cấp tự nhiên như cách não bộ tổ chức ý tưởng.
   - *Khối 2: Trình soạn thảo Tiptap AST Trực quan*: Trải nghiệm gõ phím mượt mà như Notion với cấu trúc khối Block AST JSON, hỗ trợ Code block, Markdown syntax, Callout và Bảng biểu.
   - *Khối 3: Trợ lý AI RAG Hỏi đáp Tri thức Nội bộ*: Đặt câu hỏi trực tiếp trên toàn bộ kho ghi chú của bạn. AI phân tích ngữ nghĩa và trích dẫn chính xác từng đoạn tài liệu nguồn.
   - *Khối 4: Triết lý Monochrome 100% Zero-Icon*: Loại bỏ toàn bộ icon màu sắc và emoji gây phân tán thị giác, đưa typography và độ tương phản cao làm trung tâm trải nghiệm.
4. **Value Comparison Matrix (`ValueComparisonTable`)**:
   - So sánh trực quan giữa `Ghi chú Truyền thống (Flat Folders)`, `Công cụ SaaS Cồng kềnh (Heavy Bloatware)` và `nodetask (Local-First Monochrome)`.
5. **Liftable FAQ Section (Chuẩn AEO/Schema)**:
   - *Q1*: "nodetask khác gì so với Notion hay Obsidian?" -> Trả lời rõ về sự kết hợp giữa cấu trúc phân cấp nhanh như Notion, tốc độ local-first và AI Semantic Search tích hợp sẵn không cần plugin.
   - *Q2*: "Dữ liệu của tôi có được bảo mật và riêng tư không?" -> Khẳng định mã hóa TLS 1.3, AES-256 at-rest, cách ly Row-Level Security và AI không bao giờ dùng dữ liệu ghi chú để train model công cộng.
   - *Q3*: "Tôi có thể xuất dữ liệu ghi chú ra ngoài không?" -> 1-Click xuất toàn bộ sang Markdown, JSON AST và PDF bất cứ lúc nào.

### Component Tree
```text
[LandingPageContainer]
├── [LandingErrorBoundary]
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
│   ├── [BrandLogoLink target="/"]
│   ├── [NavLinks]
│   │   ├── [FeaturesLink target="#features"]
│   │   ├── [ComparisonLink target="#comparison"]
│   │   ├── [PricingLink target="/pricing"]
│   │   └── [AboutLink target="/about"]
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
    │   ├── [HeroBadge label="[NODETASK 2.0 • LOCAL-FIRST WORKSPACE]"]
    │   ├── [HeroHeading]
    │   ├── [HeroSubheading]
    │   ├── [HeroCTAButtonGroup]
    │   └── [TrustBadgesList]
    ├── [MetricsGridSection]
    ├── [BentoFeaturesSection]
    ├── [ValueComparisonSection]
    ├── [InteractivePreviewSection]
    ├── [FaqAccordionSection]
    └── [FinalCTASection]
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
  Given a Guest user navigates to "/#/"
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

