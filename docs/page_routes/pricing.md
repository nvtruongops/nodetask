<!-- Target FE Component: apps/web/src/features/pricing/PricingPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/pricing -->

# Public Pricing Page Route Specification (`pricing.md`)

> **Route ID**: `PUBLIC_PRICING`  
> **Route Name**: `public.pricing`  
> **Route Path**: `/pricing`  
> **Route Type**: `PUBLIC`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `PUBLIC_PRICING` (Dùng cho Analytics, Navigation, Conversion Tracking, RBAC)
- **Route Name**: `public.pricing`
- **Description**: Trang Bảng giá các gói cước dịch vụ nodetask (`/pricing`). Cung cấp thông tin so sánh minh bạch giữa các gói (Free, Pro, Enterprise Demo Cards). Hiện tại trong giai đoạn phát triển Demo, ứng dụng chưa kết nối Gateway thanh toán thực tế, toàn bộ các gói cước đều cho phép người dùng click trải nghiệm Miễn phí (`[Start Free Demo]`) nhằm hỗ trợ kiểm thử giao diện & luồng Onboarding.

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

## 3. SEO & Social Share Metadata (SEO Meta Specification)
- **Title Tag**: `<title>Pricing Plans & Free Demo - nodetask</title>`
- **Meta Description**: `Khám phá bảng giá các gói cước nodetask. Trải nghiệm không giới hạn tính năng quản lý tri thức hoàn toàn miễn phí trong bản Demo.`
- **Keywords**: `nodetask pricing, free plan, pro plan, zero-icon pricing, SaaS plan demo`
- **Canonical URL**: `/#/pricing`
- **OpenGraph Specification**:
  - `og:title`: `Pricing Plans & Free Demo - nodetask`
  - `og:description`: `Bảng giá dịch vụ nodetask - Trải nghiệm miễn phí ngay hôm nay.`
  - `og:image`: `/og-pricing.png`
  - `og:type`: `website`
  - `og:url`: `/#/pricing`
- **Twitter Card Specification**:
  - `twitter:card`: `summary_large_image`
  - `twitter:title`: `Pricing Plans & Free Demo - nodetask`
  - `twitter:description`: `Explore nodetask pricing and start your free demo.`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/pricing/PricingPage'))`)
- **Preload Strategy**: `onHover` (Preload khi hover chuột vào link Pricing trên Header Navigation)
- **Chunk Name**: `chunk-public-pricing`
- **Priority**: `HIGH`

---

## 5. Permission Matrix & Access Control (Access Control & RBAC Permissions)
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
  - `WorkspaceEndpoint.getPublicPricingPlans(session)`: Lấy danh sách thông tin gói cước công khai (Free, Pro, Enterprise). Ở chế độ Demo Mode, trả về danh sách gói cước tĩnh không kèm cổng thanh toán.
- **Data Caching & Stale Policy**:
  - `staleTime`: `3600000ms` (1 giờ - thông tin bảng giá ít thay đổi).
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `TOGGLING_CYCLE` (Monthly/Yearly Toggle) → `SELECTING_PLAN` → `DEMO_REDIRECT`
- **UI State Breakdown**:
  - `IDLE`: Hiển thị 3 thẻ Pricing Card (Free `[ACTIVE]`, Pro `[SOON / FREE DEMO]`, Enterprise `[SOON / CONTACT]`) kèm badge thông báo `[PAYMENT GATEWAY - COMING SOON]`.
  - `TOGGLING_CYCLE`: Chuyển đổi giữa chu kỳ Thanh toán Tháng / Năm (cập nhật UI label tính toán tiết kiệm).
  - `SELECTING_PLAN`: Người dùng click chọn gói cước demo bất kỳ.
  - `DEMO_REDIRECT`: Hiển thị banner thông báo "Chế độ Demo: Mọi tính năng đang mở Miễn phí! Cổng thanh toán sắp ra mắt [SOON]" và chuyển hướng tới `/auth/register` hoặc `/workspace`.

---

## 8. Component Inventory & Tree

### Component Inventory List
- `PublicLayoutShell`: Shell khung giao diện công khai tiêu chuẩn.
- `PricingHeroHeader`: Component tiêu đề bảng giá và phụ đề giải thích chế độ Free Demo & Payment [SOON].
- `BillingCycleToggle`: Switch toggle chuyển đổi Tháng/Năm không dùng icon.
- `PricingCardGrid`: Grid 3 cột chứa các thẻ gói cước (`FreeCard`, `ProCard [SOON]`, `EnterpriseCard [SOON]`).
- `PlanFeatureList`: Danh sách tính năng của từng gói dạng text label định dạng monochrome.
- `PlanCtaButton`: Button hành động cho từng gói `[Start Free Demo]` / `[Try Pro Demo - SOON]`.

### Required Pattern Components
- `Required Pattern Components`: `PublicLayoutShell`, `PricingHeroHeader`, `BillingCycleToggle`, `PricingCardGrid`, `PlanCtaButton`

### Route Anti-Patterns
- `Route Anti-Patterns`: Không dùng icon tích xanh / dấu x hay emoji; không tích hợp SDK cổng thanh toán bên thứ 3 (Stripe/PayPal) khi chưa có backend API.

### Component Tree
```text
[PricingPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
└── [MainContent id="main-content" alignment="center"]
    ├── [PricingHeroHeader]
    │   ├── [Title contentKey="pricing.title"]
    │   ├── [Subtitle contentKey="pricing.subtitle"]
    │   └── [DemoNoticeBadge label="[FREE DEMO - PAYMENT GATEWAY SOON]"]
    ├── [BillingCycleToggle activeCycle="yearly"]
    └── [PricingCardGrid columns=3]
        ├── [PricingCard plan="free"]
        │   ├── [CardHeader name="Free Plan" price="$0"]
        │   ├── [PlanFeatureList]
        │   └── [PlanCtaButton label="[Start Free Demo]" target="/auth/register"]
        ├── [PricingCard plan="pro" highlighted=true]
        │   ├── [CardHeader name="Pro Plan [SOON]" price="$0 (Free Demo)"]
        │   ├── [PlanFeatureList]
        │   └── [PlanCtaButton label="[Try Pro Demo - SOON]" target="/auth/register"]
        └── [PricingCard plan="enterprise"]
            ├── [CardHeader name="Enterprise Plan [SOON]" price="Custom"]
            ├── [PlanFeatureList]
            └── [PlanCtaButton label="[Contact Sales - SOON]" target="/contact"]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Session hết hạn khi click CTA | `pricing.error.session_expired` | Dẫn hướng đăng nhập | `PRICING_SESSION_EXPIRED` |
| `403` | Đã hết quyền tạo workspace thử nghiệm | `pricing.error.limit_reached` | Hiển thị thông báo giới hạn | `PRICING_LIMIT_REACHED` |
| `409` | Xung đột nâng cấp gói | `pricing.error.conflict` | Nút làm mới trang | `PRICING_CONFLICT` |
| `422` | Tham số chu kỳ thanh toán không hợp lệ | `pricing.error.invalid_cycle` | Reset toggle về Monthly | `PRICING_INVALID_CYCLE` |
| `429` | Thao tác click CTA quá dồn dập | `pricing.error.rate_limit` | Khóa tạm thời 5 giây | `PRICING_RATE_LIMIT` |
| `500` | Không lấy được danh sách gói cước từ RPC | `pricing.error.server_error` | Hiển thị fallback UI tĩnh | `PRICING_SERVER_ERROR` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: Visitor views pricing page in demo mode
  Given a Guest user navigating to "/pricing"
  When the page loads successfully
  Then all 3 pricing cards display price "$0 / Free Demo"
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
