<!-- Target FE Component: apps/web/src/features/terms/TermsPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/terms -->

# Terms of Service Page Route Specification (`terms.md`)

> **Route ID**: `TERMS_MAIN`  
> **Route Name**: `terms.main`  
> **Route Path**: `/terms`  
> **Route Type**: `PUBLIC`  
> **Page Archetype**: `Documentation & Legal Spec`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `2.1.0`  
> **Status**: `APPROVED & ENFORCED`  

---

## 1. Overview & Route ID
- **Route ID**: `TERMS_MAIN` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `terms.main`
- **Description**: Trang Điều khoản Dịch vụ (`/terms`) xác lập thỏa thuận pháp lý công bằng, minh bạch giữa người dùng và nền tảng `nodetask`:
  1. **User-First Legal Pillars**:
     - *Quyền Sở hữu Trí tuệ Tuyệt đối (100% IP Ownership)*: Toàn bộ nội dung ghi chú, tệp đính kèm và dữ liệu kiến thức thuộc sở hữu độc quyền của bạn hoặc tổ chức của bạn. nodetask không xác lập bất kỳ quyền sở hữu nào trên dữ liệu của người dùng.
     - *Chính sách Sử dụng Hợp lý (Fair Use)*: Nghiêm cấm hành vi lạm dụng tấn công từ chối dịch vụ, phát tán mã độc hoặc khai thác trái phép hạ tầng.
     - *Cam kết Không Bắt chẹt (No Lock-in)*: Người dùng luôn có quyền truy xuất và tải về 100% dữ liệu tài khoản dưới định dạng mở (Markdown, JSON).
  2. **Plain-English Terms Structure**: Loại bỏ các biệt ngữ pháp lý mơ hồ, trình bày rõ ràng quyền lợi và nghĩa vụ qua cấu trúc Bento 3 trụ cột và Mục lục điều hướng.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/terms`
- **Access Type**: `PUBLIC`
- **Page Archetype**: `Documentation & Legal Spec`
- **Auth Guard**: `None`
- **Layout Shell**: `PublicLayoutShell`
- **Navigation Metadata**:
  - `sidebar`: `false`
  - `header`: `true`
  - `footer`: `true`
  - `breadcrumb`: `true`
  - `searchable`: `true`
  - `navOrder`: `11`
  - `navGroup`: `"legal"`

---

## 3. SEO & Social Meta Specification (SEO & Social Share Metadata)
- **Title Tag**: `<title>Terms of Service & IP Ownership - nodetask</title>`
- **Meta Description**: `Điều khoản dịch vụ và cam kết bảo vệ quyền sở hữu trí tuệ của bạn tại nền tảng nodetask. Minh bạch, công bằng và không khóa dữ liệu.`
- **Keywords**: `nodetask terms, terms of service, user agreement, IP ownership, fair use policy, software terms`
- **Canonical URL**: `/#/terms`
- **OpenGraph Specification**:
  - `og:title`: `Terms of Service - nodetask`
  - `og:description`: `Điều khoản dịch vụ và thỏa thuận sử dụng minh bạch nodetask.`
  - `og:image`: `/og-legal.png`
  - `og:type`: `article`
  - `og:url`: `/#/terms`
- **Twitter Card Specification**:
  - `twitter:card`: `summary`
  - `twitter:title`: `nodetask Terms of Service`
  - `twitter:description`: `Fair, transparent terms with 100% user IP ownership.`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/legal/TermsPage'))`)
- **Preload Strategy**: `onHover`
- **Chunk Name**: `chunk-terms`
- **Priority**: `LOW`

---

## 5. Permission Matrix & RBAC (Access Control & RBAC Permissions)
| System Role | View Access | Interaction Rights | Notes |
| :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Đọc toàn bộ điều khoản sử dụng | Tất cả vai trò |
| `USER` | **Allowed** | Đọc điều khoản và quản lý trạng thái tài khoản cá nhân | Người dùng cá nhân |
| `ORG_MEMBER` | **Allowed** | Đọc điều khoản liên quan đến Không gian Tổ chức | Thành viên tổ chức |
| `ORG_ADMIN` | **Allowed** | Đọc và thực thi thỏa thuận cấp Tổ chức | Quản trị viên |
| `SYSTEM_ADMIN` | **Allowed** | Quản lý quy định điều khoản toàn hệ thống | Admin hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `I18nEndpoint.getDictionary(locale: String, namespace: 'terms')`: Bộ từ điển đa ngôn ngữ cho văn bản Điều khoản Dịch vụ.
- **Serverpod Architecture Reference**: Nội dung điều khoản được định danh phiên bản và đồng bộ qua Serverpod API.
- **Data Caching & Stale Policy**:
  - `staleTime`: `86400000ms` (24h).
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `HYDRATING` → `READY` → `SWITCHING_TABS`
- **UI State Breakdown**:
  - `IDLE`: Server HTML sẵn sàng.
  - `READY`: Hiển thị văn bản pháp lý chia theo các chuyên mục Điều khoản cốt lõi.
  - `SWITCHING_TABS`: Chuyển đổi giữa các góc nhìn điều khoản (Cá nhân / Tổ chức / Bản quyền).

---

## 8. Component Inventory & Tree

### Required Pattern Components (MUST)
- `Required Pattern Components`: `Hero`, `BentoGrid`, `InteractiveTabSwitcher`, `TechnicalCard`, `SpecificationPanel`, `Footer`

### Route Anti-Patterns (MUST NOT)
- `Route Anti-Patterns`:
  - ❌ Bài viết dài dòng thiếu phân loại bộ lọc Tab.
  - ❌ Dùng Icon/Emoji — bắt buộc dùng text badge `[IP OWNERSHIP]`, `[FAIR USE]`.
  - ❌ Thiếu khối thông báo ràng buộc bản quyền `SpecificationPanel`.

### Component Tree
```text
[TermsPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
└── [MainContent id="main-content" role="main"]
    ├── [TermsHeroHeader]
    │   ├── [TermsBadge label="[TERMS OF SERVICE • 100% IP OWNERSHIP]"]
    │   ├── [TermsTitle contentKey="terms.title"]
    │   └── [TermsLastUpdated label="[HIỆU LỰC TỪ: 2026-08-17]"]
    ├── [TermsBentoGrid columns=3]
    │   ├── [TechnicalCard title="100% Your IP" details="You own every byte of content you create."]
    │   ├── [TechnicalCard title="Zero Lock-in" details="Export your complete workspace in Markdown/JSON."]
    │   └── [TechnicalCard title="Fair SLA" details="Predictable uptime and advance notice for maintenance."]
    ├── [InteractiveTabSwitcher tabs=termsCategories]
    ├── [LegalContentArticle]
    │   ├── [TermsSection id="acceptance" title="01. Chấp thuận Điều khoản"]
    │   ├── [TermsSection id="ip-rights" title="02. Bản quyền & Quyền sở hữu Dữ liệu"]
    │   ├── [TermsSection id="acceptable-use" title="03. Quy định Sử dụng Hợp lý"]
    │   └── [TermsSection id="termination" title="04. Chấm dứt & Xuất dữ liệu"]
    └── [IpProtectionSpecificationPanel]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Session token không hợp lệ | `terms.error.unauthorized` | Cho phép đọc dưới vai trò GUEST | `TERMS_AUTH_UNAUTHORIZED` |
| `404` | Dictionary terms không phản hồi | N/A (Dùng fallback `legal/content/en.json`) | Fallback local static | `TERMS_I18N_FALLBACK` |
| `500` | Serverpod Backend offline | `terms.error.server_offline` | Hiển thị static fallback HTML | `TERMS_SERVER_OFFLINE` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: User views Terms of Service
  Given a user on "/terms"
  When the page finishes rendering
  Then the Terms Hero, 3 Bento Pillars, and Legal Sections are displayed
  And 0 icons/emojis are used on screen

Scenario: User navigates IP rights section
  Given a user clicking on the "02. Bản quyền & Quyền sở hữu Dữ liệu" tab
  Then the statement confirms complete user ownership of note content
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`<article role="article">`, `<div role="tablist">`).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.

