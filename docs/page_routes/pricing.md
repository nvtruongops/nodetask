<!-- Target FE Component: apps/web/src/features/pricing/PricingPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/pricing -->

# Public Pricing Page Route Specification (`pricing.md`)

> **Route ID**: `PUBLIC_PRICING`  
> **Route Name**: `public.pricing`  
> **Route Path**: `/pricing`  
> **Route Type**: `PUBLIC`  
> **Page Archetype**: `Marketing & Showcase`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `2.1.0`  
> **Status**: `APPROVED & ENFORCED`  

---

## 1. Overview & Route ID
- **Route ID**: `PUBLIC_PRICING` (Dùng cho Analytics, Navigation, Conversion Tracking, RBAC)
- **Route Name**: `public.pricing`
- **Description**: Trang Bảng giá dịch vụ (`/pricing`) công bố cấu trúc chi phí minh bạch, cam kết không khóa dữ liệu (Zero Vendor Lock-in) và hỗ trợ trải nghiệm dùng thử không giới hạn của `nodetask`:
  1. **Transparent Tier Structure**:
     - `Community Free Plan` ($0/tháng): Đầy đủ tính năng cốt lõi, không giới hạn số lượng ghi chú phân cấp (`ltree`), lưu trữ cục bộ Local-First và AI Semantic Search cơ bản.
     - `Pro Developer Plan` ($12/tháng — Hiện đang mở Miễn phí trong Chế độ Demo): Tăng dung lượng lưu trữ đám mây, vector embeddings không giới hạn và AI RAG nâng cao.
     - `Enterprise & Self-Host Plan` (Custom): Dành cho tổ chức cần triển khai on-premise, SSO/SAML, ma trận RBAC đa cấp và kiểm thử an ninh chuyên sâu Pentest.
  2. **Liftable Pricing FAQ & Answers**: Trực tiếp giải đáp các thắc mắc về chính sách thanh toán, tự lưu trữ, quyền sở hữu dữ liệu và cam kết hoàn tiền.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/pricing`
- **Access Type**: `PUBLIC`
- **Page Archetype**: `Marketing & Showcase`
- **Auth Guard**: `None` (Cho phép Guest và Logged-in User xem bảng giá)
- **Layout Shell**: `PublicLayoutShell`
- **Navigation Metadata**:
  - `sidebar`: `false`
  - `header`: `true`
  - `footer`: `true`
  - `breadcrumb`: `true`
  - `searchable`: `true`
  - `navOrder`: `4`
  - `navGroup`: `"marketing"`

---

## 3. SEO & Social Meta Specification (SEO & Social Share Metadata)
- **Title Tag**: `<title>Transparent Pricing Plans & Free Demo - nodetask</title>`
- **Meta Description**: `Xem bảng giá minh bạch của nodetask. Trải nghiệm không gian quản lý tri thức phân cấp và AI Semantic Search hoàn toàn miễn phí.`
- **Keywords**: `nodetask pricing, free note taking app, developer pricing, hierarchical notes cost, zero-icon pricing, self-host pricing, saas pricing transparent`
- **Canonical URL**: `/#/pricing`
- **OpenGraph Specification**:
  - `og:title`: `Pricing Plans - nodetask`
  - `og:description`: `Bảng giá minh bạch, không chi phí ẩn. Bắt đầu miễn phí ngay hôm nay.`
  - `og:image`: `/og-pricing.png`
  - `og:type`: `website`
  - `og:url`: `/#/pricing`
- **Twitter Card Specification**:
  - `twitter:card`: `summary_large_image`
  - `twitter:title`: `Transparent Pricing - nodetask`
  - `twitter:description`: `Honest, transparent pricing for developers and teams.`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/pricing/PricingPage'))`)
- **Preload Strategy**: `onHover` (Preload khi hover chuột vào link Pricing trên Header Navigation)
- **Chunk Name**: `chunk-public-pricing`
- **Priority**: `HIGH`

---

## 5. Permission Matrix & RBAC (Access Control & RBAC Permissions)
| System Role | View Access | Form Submit Rights | Redirect Policy | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Kích hoạt nút Demo CTA | Dẫn tới `/auth/register` hoặc `/demo` | Khách vãng lai xem bảng giá |
| `USER` | **Allowed** | Kích hoạt nút Demo CTA | Trực tiếp dẫn tới `/workspace` | Người dùng cá nhân |
| `ORG_MEMBER` | **Allowed** | Kích hoạt nút Demo CTA | Dẫn tới `/workspace` | Thành viên tổ chức |
| `ORG_ADMIN` | **Allowed** | Kích hoạt nút Demo CTA | Dẫn tới `/workspace` | Quản trị viên tổ chức |
| `SYSTEM_ADMIN` | **Allowed** | Kích hoạt nút Demo CTA | Dẫn tới `/admin` | Quản trị hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `WorkspaceEndpoint.getPublicPricingPlans(session)`: Lấy danh sách thông tin gói cước công khai (Free, Pro, Enterprise).
  - `I18nEndpoint.getDictionary(locale: String, namespace: 'pricing')`: Tải từ điển đa ngôn ngữ cho bảng giá.
- **Serverpod Architecture Reference**: Dữ liệu gói cước và tính năng được đồng bộ dạng typed DTO từ backend Serverpod.
- **Data Caching & Stale Policy**:
  - `staleTime`: `3600000ms` (1 giờ - thông tin bảng giá ít thay đổi).
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `TOGGLING_CYCLE` (Monthly/Yearly) → `SELECTING_PLAN` → `DEMO_REDIRECT`
- **UI State Breakdown**:
  - `IDLE`: Hiển thị 3 thẻ Pricing Card (Free `[ACTIVE]`, Pro `[FREE DEMO MODE]`, Enterprise `[CONTACT]`) kèm badge `[DEMO ACTIVE • FULL ACCESS]`.
  - `TOGGLING_CYCLE`: Chuyển đổi giữa chu kỳ Thanh toán Tháng / Năm (tiết kiệm 20% khi chọn Yearly).
  - `SELECTING_PLAN`: Người dùng click chọn gói cước bất kỳ.
  - `DEMO_REDIRECT`: Chuyển hướng nhanh tới luồng Onboarding `/auth/register` hoặc `/workspace`.

---

## 8. Component Inventory & Tree

### Required Pattern Components (MUST)
- `Required Pattern Components`: `Hero`, `BillingCycleToggle`, `PricingCardGrid`, `PlanComparisonTable`, `FaqAccordionSection`, `PlanCtaButton`, `Footer`

### Route Anti-Patterns (MUST NOT)
- `Route Anti-Patterns`:
  - ❌ Dùng icon tích xanh / dấu x hay emoji màu mè — dùng text label `[YES]` / `[--]` và text badge monochrome.
  - ❌ Ẩn chi phí thật hoặc nhồi nhét phí phụ thu không rõ ràng.
  - ❌ Thiếu bảng so sánh chi tiết tính năng `PlanComparisonTable`.

### Editorial Sections & Plan Breakdown
1. **Pricing Hero Header**:
   - *Headline*: "Bảng giá Đơn giản, Minh bạch và Hoàn toàn Không Khóa dữ liệu."
   - *Subheading*: "Mọi tính năng mạnh mẽ nhất đều có thể trải nghiệm ngay hôm nay. Không yêu cầu thẻ tín dụng."
   - *Notice Badge*: `[CHẾ ĐỘ DEMO: TOÀN BỘ TÍNH NĂNG ĐANG MỞ MIỄN PHÍ TRẢI NGHIỆM]`.
2. **Pricing Cards Matrix (3 Tiers)**:
   - **Community Free ($0 / vĩnh viễn)**:
     - Không giới hạn số lượng nốt tài liệu phân cấp `ltree`.
     - Trình soạn thảo Tiptap AST đầy đủ định dạng.
     - 1 Workspace Cá nhân, tìm kiếm ngữ nghĩa 500 chunks vector.
     - CTA: `[Bắt đầu Miễn phí]` -> `/auth/register`.
   - **Pro Developer ($12 / tháng — Đang mở Miễn phí)**:
     - Tất cả quyền lợi của Community.
     - Không giới hạn vector embeddings và trợ lý AI RAG nội bộ.
     - 10GB dung lượng lưu trữ Object Storage đính kèm.
     - Tự động sao lưu lịch sử phiên bản tài liệu (OCC Snapshots).
     - CTA: `[Trải nghiệm Pro Miễn phí]` -> `/auth/register`.
   - **Enterprise & Self-Host (Custom / Đội ngũ)**:
     - Hỗ trợ triển khai On-Premise / Private Cloud.
     - Quản lý Tổ chức & Phân quyền đa cấp RBAC.
     - Tích hợp kiểm thử an ninh Pentest & Báo cáo tuân thủ an toàn.
     - Hỗ trợ kỹ thuật 24/7 có cam kết SLA.
     - CTA: `[Liên hệ Đội ngũ]` -> `/contact`.
3. **Liftable Pricing FAQs**:
   - *Q1*: "Tôi có thể tự host (Self-host) nodetask trên server riêng không?" -> Có, kiến trúc monorepo chạy hoàn chỉnh qua Docker Compose (PostgreSQL, Redis, Serverpod).
   - *Q2*: "Dữ liệu của tôi có bị mất nếu ngừng sử dụng không?" -> Không, bạn có thể xuất toàn bộ ghi chú sang Markdown/JSON chỉ với 1 cú nhấp chuột.

### Component Tree
```text
[PricingPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
└── [MainContent id="main-content" alignment="center"]
    ├── [PricingHeroHeader]
    │   ├── [Title contentKey="pricing.title"]
    │   ├── [Subtitle contentKey="pricing.subtitle"]
    │   └── [DemoNoticeBadge label="[FREE DEMO • FULL ACCESS]"]
    ├── [BillingCycleToggle activeCycle="yearly"]
    ├── [PricingCardGrid columns=3]
    │   ├── [PricingCard plan="free"]
    │   ├── [PricingCard plan="pro" highlighted=true]
    │   └── [PricingCard plan="enterprise"]
    ├── [PlanComparisonSection]
    │   ├── [ComparisonTitle]
    │   └── [PlanComparisonTable]
    ├── [PricingFaqSection]
    └── [PricingFinalCTA target="/auth/register"]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Session hết hạn khi click CTA | `pricing.error.session_expired` | Dẫn hướng đăng nhập | `PRICING_SESSION_EXPIRED` |
| `403` | Đã hết quyền tạo workspace thử nghiệm | `pricing.error.limit_reached` | Hiển thị thông báo giới hạn | `PRICING_LIMIT_REACHED` |
| `409` | Xung đột nâng cấp gói | `pricing.error.conflict` | Nút làm mới trang | `PRICING_CONFLICT` |
| `422` | Tham số chu kỳ thanh toán không hợp lệ | `pricing.error.invalid_cycle` | Reset toggle về Monthly | `PRICING_INVALID_CYCLE` |
| `429` | Thao tác click CTA quá dồn dập | `pricing.error.rate_limit` | Khóa tạm thời 5 giây | `PRICING_RATE_LIMITED` |
| `500` | Không lấy được danh sách gói cước từ Serverpod RPC | `pricing.error.server_error` | Hiển thị fallback UI tĩnh | `PRICING_SERVER_ERROR` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: Visitor views pricing page in demo mode
  Given a Guest user navigating to "/pricing"
  When the page loads successfully
  Then all 3 pricing cards display transparent pricing details
  And clicking any "[Start Free Demo]" CTA button redirects to "/auth/register"

Scenario: User toggles billing cycle between Monthly and Yearly
  Given a user on "/pricing" page
  When the user clicks the BillingCycleToggle
  Then the pricing values recalculate instantly without page reload
  And display the yearly discount text label "[Save 20%]"
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`role="region"`, `aria-labelledby="pricing-heading"`).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.

