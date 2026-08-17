<!-- Target FE Component: apps/web/src/features/about/AboutPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/about -->

# About Page Route Specification (`about.md`)

> **Route ID**: `ABOUT_MAIN`  
> **Route Name**: `about.main`  
> **Route Path**: `/about`  
> **Route Type**: `PUBLIC`  
> **Page Archetype**: `Story & Organization`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `2.1.0`  
> **Status**: `APPROVED & ENFORCED`  

---

## 1. Overview & Route ID
- **Route ID**: `ABOUT_MAIN` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `about.main`
- **Description**: Trang Giới thiệu (`/about`) dành cho Developer, Kỹ sư phần mềm, Nhà sáng lập và Cộng đồng nghiên cứu, trình bày **Tuyên ngôn Kỹ thuật & Câu chuyện Kiến trúc (The Engineering Manifesto & Architectural Story)** của `nodetask`:
  1. **The Core Problem**: Tại sao các công cụ ghi chú hiện đại ngày càng trở nên chậm chạp, cồng kềnh và đầy rẫy icon/emoji gây xao nhãng?
  2. **The 4 Radical Principles**:
     - *Tốc độ phản hồi tức thì (<16ms)*: Kiến trúc Local-First và tối ưu dnd-kit không độ trễ.
     - *Phân cấp vô tận không giới hạn*: Ứng dụng thuật toán cây PostgreSQL `ltree` cho phép quản lý hàng trăm nghìn nút tài liệu ở độ phức tạp `O(log N)`.
     - *Ngữ nghĩa thông minh không xâm phạm quyền riêng tư*: Tích hợp `pgvector` HNSW vector embeddings để truy vấn tri thức ngữ nghĩa mà không huấn luyện trên dữ liệu cá nhân.
     - *Chủ nghĩa tối giản Monochrome 100% Zero-Icon*: Đưa Typography, cấu trúc khoảng trắng và độ tương phản cao thành ngôn ngữ thiết kế chính.
  3. **Open Standards & Data Sovereignty**: Khẳng định cam kết bảo toàn dữ liệu trọn đời, hỗ trợ xuất khẩu 100% JSON AST/Markdown và kiến trúc mở.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/about`
- **Access Type**: `PUBLIC`
- **Page Archetype**: `Story & Organization`
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

## 3. SEO & Social Meta Specification (SEO & Social Share Metadata)
- **Title Tag**: `<title>About nodetask - Engineering Manifesto & Architecture</title>`
- **Meta Description**: `Khám phá tuyên ngôn kỹ thuật, câu chuyện kiến trúc Dart Serverpod + PostgreSQL ltree và triết lý thiết kế Monochrome Zero-Icon của nodetask.`
- **Keywords**: `about nodetask, engineering manifesto, nodetask architecture, ltree tree hierarchy, pgvector semantic search, zero-icon typography, local-first note app, serverpod dart backend`
- **Canonical URL**: `/#/about`
- **OpenGraph Specification**:
  - `og:title`: `About nodetask - The Engineering Manifesto`
  - `og:description`: `Tầm nhìn, triết lý thiết kế tối giản và các quyết định kiến trúc đằng sau nodetask.`
  - `og:image`: `/og-about.png`
  - `og:type`: `article`
  - `og:url`: `/#/about`
- **Twitter Card Specification**:
  - `twitter:card`: `summary_large_image`
  - `twitter:title`: `About nodetask - Engineering Manifesto`
  - `twitter:description`: `Why we built a zero-icon, local-first hierarchical workspace.`
  - `twitter:image`: `/og-about.png`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/about/AboutPage'))`)
- **Preload Strategy**: `onHover`
- **Chunk Name**: `chunk-about`
- **Priority**: `MEDIUM`

---

## 5. Permission Matrix & RBAC (Access Control & RBAC Permissions)
| System Role | View Access | Interaction Rights | Notes |
| :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Xem toàn bộ câu chuyện kỹ thuật, chuyển sang `/auth/register` hoặc `/demo` | Độc giả công khai |
| `USER` | **Allowed** | Xem nội dung, có phím tắt quay lại `/workspace` | Người dùng đã đăng nhập |
| `ORG_MEMBER` | **Allowed** | Xem nội dung, chuyển về `/workspace` | Thành viên tổ chức |
| `ORG_ADMIN` | **Allowed** | Xem nội dung, chuyển về `/workspace` | Quản trị viên tổ chức |
| `SYSTEM_ADMIN` | **Allowed** | Xem nội dung, chuyển về `/admin` | Quản trị hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `I18nEndpoint.getDictionary(locale: String, namespace: 'about')`: Bộ từ điển đa ngôn ngữ cho trang About.
- **Serverpod Architecture Reference**: Truy vấn dữ liệu tài liệu kiến trúc kỹ thuật đồng bộ qua Serverpod RPC.
- **Data Caching & Stale Policy**:
  - `staleTime`: `86400000ms` (24h).
  - `cacheTime`: `604800000ms`.
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `HYDRATING` → `READY` → `SWITCHING_LOCALE`
- **UI State Breakdown**:
  - `IDLE`: Server HTML hiển thị.
  - `READY`: Nạp xong các khối Manifesto Hero, 4 Architectural Pillars, Timeline Cột mốc & Sơ đồ Topology.
  - `SWITCHING_LOCALE`: Cập nhật song ngữ EN/VI tức thì.

---

## 8. Component Inventory & Tree

### Required Pattern Components (MUST)
- `Required Pattern Components`: `Hero`, `Timeline`, `SplitShowcase`, `TechnicalCard`, `SpecificationPanel`, `Footer`

### Route Anti-Patterns (MUST NOT)
- `Route Anti-Patterns`:
  - ❌ Văn bản thuần tuý dài dằng dặc không có phân cấp bố cục editorial.
  - ❌ Thiếu vạch thời gian cột mốc phát triển `Timeline`.
  - ❌ Thiếu sơ đồ kiến trúc dữ liệu trực quan `SpecificationPanel`.
  - ❌ Dùng Icon/Emoji — bắt buộc dùng text badge `[ ]` và cấu trúc typography monochrome.

### Editorial Content & Section Layout
1. **Manifesto Hero Section**:
   - *Headline*: "Chúng tôi xây dựng nodetask vì các công cụ ghi chú hiện tại đã quên mất mục đích ban đầu: Giúp bạn suy nghĩ."
   - *Narrative*: "Trong kỷ nguyên của những ứng dụng SaaS ngốn hàng gigabyte RAM với hàng nghìn nút bấm, emoji và bảng màu rực rỡ, khả năng tập trung sâu của con người đang bị bào mòn. nodetask sinh ra như một phản ứng mạnh mẽ: Tốc độ cơ học thuần khiết, cấu trúc phân cấp chặt chẽ và sự tĩnh lặng tuyệt đối của giao diện Monochrome."
2. **The 4 Architectural Pillars (`TechnicalCard` Grid 2x2)**:
   - *Pillar 01 — Local-First Speed*: Kết hợp Zustand store với thuật toán kéo thả dnd-kit chuẩn hóa tọa độ số nguyên, mang lại phản hồi <16ms trên từng cú nhấp chuột.
   - *Pillar 02 — PostgreSQL `ltree` Native Hierarchy*: Thay vì các câu lệnh đệ quy CTE chậm chạp, chúng tôi sử dụng chỉ mục GiST trên đường dẫn phân cấp ltree, cho phép di chuyển nhánh cây 10,000 node chỉ trong 1 transaction SQL duy nhất.
   - *Pillar 03 — Isolated Vector Embeddings (`pgvector`)*: Tự động chia đoạn tài liệu thành các vector 1536 chiều và đánh chỉ mục HNSW Cosine Distance, mang lại khả năng hỏi đáp RAG tức thì mà không bao giờ chia sẻ dữ liệu với bên thứ ba.
   - *Pillar 04 — The Zero-Icon Philosophy*: 100% không icon, không emoji. Mỗi nút bấm, trạng thái và nhãn phân loại đều được định danh bằng chữ viết và khung viền vi mô sắc nét, tạo nên không gian làm việc tĩnh lặng tuyệt đối.
3. **Engineering Timeline (`Timeline`)**:
   - `2025 Q3` — *Khởi tạo Core Monorepo*: Lựa chọn Dart Serverpod + React Vite + PostgreSQL.
   - `2025 Q4` — *Đột phá Cây phân cấp*: Hoàn thiện tích hợp `ltree` và cơ chế Optimistic Concurrency Control (OCC).
   - `2026 Q1` — *Đưa AI RAG vào lõi*: Tích hợp `pgvector` HNSW vector embeddings hỗ trợ tìm kiếm ngữ nghĩa <10ms.
   - `2026 Q2` — *Quy chuẩn Governance & Zero-Icon*: Hoàn thiện Rule Engine kiểm định 100% không icon và phát hành bản v2.0.
4. **Data Sovereignty Promise (`SpecificationPanel`)**:
   - Cam kết độc lập dữ liệu: Dữ liệu của bạn là của bạn. Cho phép xuất toàn bộ cây ghi chú ra Markdown và JSON AST bất kỳ lúc nào chỉ bằng 1 thao tác.

### Component Tree
```text
[AboutPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
└── [MainContent id="main-content" role="main"]
    ├── [ManifestoHeroSection]
    │   ├── [ManifestoBadge label="[MANIFESTO • WHY WE BUILT NODETASK]"]
    │   ├── [ManifestoHeading]
    │   └── [ManifestoStoryParagraphs]
    ├── [ArchitecturalPillarsGrid columns=2]
    │   ├── [TechnicalCard pillar="01" title="Sub-16ms Local-First Engine"]
    │   ├── [TechnicalCard pillar="02" title="PostgreSQL ltree Hierarchy"]
    │   ├── [TechnicalCard pillar="03" title="Isolated AI RAG pgvector"]
    │   └── [TechnicalCard pillar="04" title="Zero-Icon Typographic Purity"]
    ├── [EngineeringTimelineSection]
    ├── [DataSovereigntySpecificationPanel]
    └── [AboutFooterCTA target="/auth/register"]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Session token không hợp lệ khi kiểm tra quyền | `about.error.unauthorized` | Bỏ qua auth, cho phép xem public | `ABOUT_AUTH_UNAUTHORIZED` |
| `404` | Dictionary about không khả thi | N/A (Dùng fallback `about/content/en.json`) | Fallback local static | `ABOUT_I18N_FALLBACK` |
| `500` | Serverpod Backend lỗi kết nối | `about.error.server_offline` | Hiển thị static fallback HTML | `ABOUT_SERVER_OFFLINE` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: Guest views About page
  Given a user opens "/about"
  When the page finishes rendering
  Then the Manifesto Hero, 4 Architectural Pillars, Timeline and Data Sovereignty Panel are displayed
  And 0 icons/emojis are used on screen

Scenario: Language toggle on About page
  Given a user on "/about"
  When clicking language toggle button "VI"
  Then the technical narrative updates cleanly to Vietnamese translation
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`<main id="main-content" role="main">`, `<article role="article">`).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.

