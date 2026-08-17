<!-- Target FE Component: apps/web/src/features/privacy/PrivacyPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/privacy -->

# Privacy Policy Page Route Specification (`privacy.md`)

> **Route ID**: `PRIVACY_MAIN`  
> **Route Name**: `privacy.main`  
> **Route Path**: `/privacy`  
> **Route Type**: `PUBLIC`  
> **Page Archetype**: `Documentation & Legal Spec`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `2.1.0`  
> **Status**: `APPROVED & ENFORCED`  

---

## 1. Overview & Route ID
- **Route ID**: `PRIVACY_MAIN` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `privacy.main`
- **Description**: Trang Chính sách Quyền riêng tư & Bảo vệ Dữ liệu (`/privacy`) công bố cam kết minh bạch về **Chủ quyền Dữ liệu Người dùng (User Data Sovereignty)** của `nodetask`:
  1. **Plain-English Privacy Commitments**:
     - *Không bán dữ liệu*: nodetask không bao giờ chia sẻ, bán hoặc sử dụng nội dung ghi chú và tệp đính kèm của người dùng cho bất kỳ bên thứ ba hay mạng quảng cáo nào.
     - *Không huấn luyện AI công cộng*: Dữ liệu vector embeddings `pgvector` và đoạn trích tài liệu chỉ phục vụ mục đích tìm kiếm ngữ nghĩa nội bộ của chính bạn.
     - *Chế độ Local-First & Zero-Telemetry*: Trong chế độ dùng thử Sandbox hoặc Local Workspace, dữ liệu lưu 100% trong bộ nhớ trình duyệt của bạn.
  2. **Data Lifecycle & Export Rights**: Quyền xóa toàn bộ tài khoản vĩnh viễn và quyền xuất dữ liệu 1-Click sang định dạng Markdown/JSON bất cứ lúc nào.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/privacy`
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
  - `navOrder`: `10`
  - `navGroup`: `"legal"`

---

## 3. SEO & Social Meta Specification (SEO & Social Share Metadata)
- **Title Tag**: `<title>Privacy Policy & Data Sovereignty - nodetask</title>`
- **Meta Description**: `Chính sách quyền riêng tư và cam kết bảo vệ dữ liệu người dùng tại nodetask. Không quảng cáo, không bán dữ liệu, không train AI.`
- **Keywords**: `nodetask privacy, privacy policy, data sovereignty, no ai training, gdpr compliance, local-first privacy`
- **Canonical URL**: `/#/privacy`
- **OpenGraph Specification**:
  - `og:title`: `Privacy Policy - nodetask`
  - `og:description`: `Chính sách bảo mật thông tin và cam kết bảo vệ dữ liệu nodetask.`
  - `og:image`: `/og-legal.png`
  - `og:type`: `article`
  - `og:url`: `/#/privacy`
- **Twitter Card Specification**:
  - `twitter:card`: `summary`
  - `twitter:title`: `nodetask Privacy Policy`
  - `twitter:description`: `Your notes belong to you. Clear, plain-English privacy terms.`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/legal/PrivacyPage'))`)
- **Preload Strategy**: `onHover`
- **Chunk Name**: `chunk-privacy`
- **Priority**: `LOW`

---

## 5. Permission Matrix & RBAC (Access Control & RBAC Permissions)
| System Role | View Access | Interaction Rights | Notes |
| :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Đọc toàn bộ điều khoản quyền riêng tư | Tất cả vai trò |
| `USER` | **Allowed** | Đọc chính sách và truy cập công cụ Quản lý Dữ liệu Cá nhân | Người dùng cá nhân |
| `ORG_MEMBER` | **Allowed** | Đọc chính sách quyền riêng tư cấp Tổ chức | Thành viên tổ chức |
| `ORG_ADMIN` | **Allowed** | Đọc chính sách và quản lý DPO Data Retention | Quản trị viên |
| `SYSTEM_ADMIN` | **Allowed** | Đọc và cấu hình chính sách hệ thống | Admin hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `I18nEndpoint.getDictionary(locale: String, namespace: 'privacy')`: Bộ từ điển đa ngôn ngữ cho văn bản pháp lý quyền riêng tư.
- **Serverpod Architecture Reference**: Truy xuất nội dung pháp lý đã được định danh phiên bản thông qua Serverpod API.
- **Data Caching & Stale Policy**:
  - `staleTime`: `86400000ms` (24h).
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `HYDRATING` → `READY` → `SCROLLING_SECTIONS`
- **UI State Breakdown**:
  - `IDLE`: Server HTML sẵn sàng.
  - `READY`: Hiển thị văn bản pháp lý chia theo từng Section với Mục lục Table of Contents.
  - `SCROLLING_SECTIONS`: Highlight mục lục tương ứng theo vị trí cuộn màn hình.

---

## 8. Component Inventory & Tree

### Required Pattern Components (MUST)
- `Required Pattern Components`: `Hero`, `MetricsGrid`, `EditorialGrid`, `StickySidebar`, `SpecificationPanel`, `Footer`

### Route Anti-Patterns (MUST NOT)
- `Route Anti-Patterns`:
  - ❌ Văn bản pháp lý dài dằng dặc 1 cột không có Sidebar điều hướng nhanh.
  - ❌ Dùng Icon/Emoji — bắt buộc dùng text badge `[DATA PRIVACY]`, `[GDPR READY]`.
  - ❌ Thiếu khối cam kết bảo vệ dữ liệu `SpecificationPanel`.

### Component Tree
```text
[PrivacyPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
└── [MainContent id="main-content" role="main"]
    ├── [PrivacyHeroHeader]
    │   ├── [PrivacyBadge label="[PRIVACY & DATA SOVEREIGNTY]"]
    │   ├── [PrivacyTitle contentKey="privacy.title"]
    │   └── [PrivacyLastUpdated label="[CẬP NHẬT LẦN CUỐI: 2026-08-17]"]
    ├── [PrivacyEditorialGrid]
    │   ├── [StickySidebarToc]
    │   │   └── [TableOfContentsNav links=privacySections]
    │   └── [PrivacyContentArticle]
    │       ├── [PrivacySection id="collection" title="01. Dữ liệu chúng tôi thu thập"]
    │       ├── [PrivacySection id="ai-vector" title="02. Cam kết Bảo mật AI & Vector"]
    │       ├── [PrivacySection id="retention" title="03. Thời hạn Lưu trữ & Quyền xóa dữ liệu"]
    │       └── [PrivacySection id="export" title="04. Quyền Xuất dữ liệu Độc lập"]
    └── [DataSovereigntySpecificationPanel]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Session token không hợp lệ | `privacy.error.unauthorized` | Cho phép đọc dưới vai trò GUEST | `PRIVACY_AUTH_UNAUTHORIZED` |
| `404` | Dictionary privacy không phản hồi | N/A (Dùng fallback `legal/content/en.json`) | Fallback local static | `PRIVACY_I18N_FALLBACK` |
| `500` | Serverpod Backend offline | `privacy.error.server_offline` | Hiển thị static fallback HTML | `PRIVACY_SERVER_OFFLINE` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: User reads Privacy Policy
  Given a user on "/privacy"
  When scrolling through sections or clicking Table of Contents
  Then focus moves smoothly to the corresponding section header
  And the active TOC item updates its highlight indicator

Scenario: Guest views AI vector privacy commitment
  Given a user navigating to section "#ai-vector"
  Then the statement confirms 100% zero public AI model training
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`<article role="article">`, `<nav aria-label="Table of Contents">`).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.
