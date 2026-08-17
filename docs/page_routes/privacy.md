<!-- Target FE Component: apps/web/src/features/privacy/PrivacyPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/privacy -->

# Privacy Policy Page Route Specification (`privacy.md`)

> **Route ID**: `PRIVACY_MAIN`  
> **Route Name**: `privacy.main`  
> **Route Path**: `/privacy`  
> **Route Type**: `PUBLIC`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `PRIVACY_MAIN` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `privacy.main`
- **Description**: Trang Chính sách Bảo mật (`/privacy`) công bố minh bạch các điều khoản về thu thập dữ liệu, mã hóa Session Token, quyền riêng tư và cam kết bảo vệ thông tin tri thức người dùng của nodetask.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/privacy`
- **Access Type**: `PUBLIC`
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

## 3. SEO & Social Share Metadata (SEO Meta Specification)
- **Title Tag**: `<title>Privacy Policy - nodetask</title>`
- **Meta Description**: `Chính sách bảo mật và cam kết bảo vệ dữ liệu người dùng tại nền tảng nodetask.`
- **Keywords**: `nodetask privacy, privacy policy, data security, encryption`
- **Canonical URL**: `/#/privacy`
- **OpenGraph Specification**:
  - `og:title`: `Privacy Policy - nodetask`
  - `og:description`: `Chính sách bảo mật thông tin người dùng nodetask.`
  - `og:image`: `/og-legal.png`
  - `og:type`: `website`
- **Twitter Card Specification**:
  - `twitter:card`: `summary`
  - `twitter:title`: `Privacy Policy - nodetask`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/legal/PrivacyPage'))`)
- **Preload Strategy**: `onHover`
- **Chunk Name**: `chunk-privacy`
- **Priority**: `LOW`

---

## 5. Permission Matrix & Access Control (Access Control & RBAC Permissions)
| System Role | View Access | Interaction Rights | Notes |
| :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Đọc nội dung văn bản pháp lý | Tất cả vai trò |
| `USER` | **Allowed** | Đọc nội dung văn bản pháp lý | Tất cả vai trò |
| `ORG_MEMBER` | **Allowed** | Đọc nội dung văn bản pháp lý | Tất cả vai trò |
| `ORG_ADMIN` | **Allowed** | Đọc nội dung văn bản pháp lý | Tất cả vai trò |
| `SYSTEM_ADMIN` | **Allowed** | Đọc nội dung văn bản pháp lý | Tất cả vai trò |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `I18nEndpoint.getDictionary(locale, namespace: 'privacy')`: Bộ từ điển đa ngôn ngữ cho văn bản bảo mật.
- **Data Caching & Stale Policy**:
  - `staleTime`: `86400000ms` (24h).

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `HYDRATING` → `READY`
- **UI State Breakdown**:
  - `READY`: Hiển thị văn bản pháp lý chia theo từng Section với Mục lục Table of Contents.

---

## 8. Component Inventory & Tree

### Required Pattern Components (MUST)
- `Hero` + `MetricsGrid` + `EditorialGrid` + `StickySidebar` + `SpecificationPanel`

### Route Anti-Patterns (MUST NOT)
- ❌ 1 cột cuộn dọc đơn điệu không có Sidebar điều hướng.
- ❌ Thiếu thẻ chỉ số bảo mật `MetricsGrid`.
- ❌ Thiếu hộp cam kết bảo vệ dữ liệu `SpecificationPanel`.

### Component Inventory List
- `PublicLayoutShell`: Organism bọc Header/Footer.
- `LegalContentArticle`: Molecule chứa nội dung văn bản pháp lý.
- `TableOfContentsNav`: Molecule mục lục điều hướng nhanh các mục.

### Component Tree
```text
[PrivacyPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
└── [MainContent id="main-content" role="main"]
    ├── [LegalHeaderTitle]
    ├── [TableOfContentsNav]
    └── [LegalContentArticle]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `404` | Dictionary privacy không phản hồi | N/A (Dùng fallback `legal/content/en.json`) | Fallback local static | `PRIVACY_I18N_FALLBACK` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: User reads Privacy Policy
  Given a user on "/privacy"
  When scrolling through sections or clicking Table of Contents
  Then focus moves smoothly to the corresponding section header
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`<article role="article">`).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.
