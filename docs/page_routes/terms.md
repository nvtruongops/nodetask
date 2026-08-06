<!-- Target FE Component: apps/web/src/features/terms/TermsPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/terms -->

# Terms of Service Page Route Specification (`terms.md`)

> **Route ID**: `TERMS_MAIN`  
> **Route Name**: `terms.main`  
> **Route Path**: `/terms`  
> **Route Type**: `PUBLIC`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `TERMS_MAIN` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `terms.main`
- **Description**: Trang Điều khoản Dịch vụ (`/terms`) quy định quyền hạn, trách nhiệm người dùng và nguyên tắc sử dụng dịch vụ nodetask.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/terms`
- **Access Type**: `PUBLIC`
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

## 3. SEO & Social Meta Specification
- **Title Tag**: `<title>Terms of Service - nodetask</title>`
- **Meta Description**: `Điều khoản dịch vụ và quy định sử dụng nền tảng nodetask.`
- **Keywords**: `nodetask terms, terms of service, user agreement`
- **Canonical URL**: `/#/terms`
- **OpenGraph Specification**:
  - `og:title`: `Terms of Service - nodetask`
  - `og:description`: `Điều khoản sử dụng và thỏa thuận dịch vụ nodetask.`
  - `og:image`: `/og-legal.png`
  - `og:type`: `website`
- **Twitter Card Specification**:
  - `twitter:card`: `summary`
  - `twitter:title`: `Terms of Service - nodetask`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/legal/TermsPage'))`)
- **Preload Strategy**: `onHover`
- **Chunk Name**: `chunk-terms`
- **Priority**: `LOW`

---

## 5. Permission Matrix & RBAC
| System Role | View Access | Interaction Rights | Notes |
| :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Đọc điều khoản dịch vụ | Tất cả vai trò |
| `USER` | **Allowed** | Đọc điều khoản dịch vụ | Tất cả vai trò |
| `ORG_MEMBER` | **Allowed** | Đọc điều khoản dịch vụ | Tất cả vai trò |
| `ORG_ADMIN` | **Allowed** | Đọc điều khoản dịch vụ | Tất cả vai trò |
| `SYSTEM_ADMIN` | **Allowed** | Đọc điều khoản dịch vụ | Tất cả vai trò |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `I18nEndpoint.getDictionary(locale, namespace: 'terms')`: Bộ từ điển đa ngôn ngữ cho Điều khoản Dịch vụ.
- **Data Caching & Stale Policy**:
  - `staleTime`: `86400000ms` (24h).

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `HYDRATING` → `READY`
- **UI State Breakdown**:
  - `READY`: Hiển thị các mục điều khoản pháp lý.

---

## 8. Component Inventory & Tree

### Required Pattern Components (MUST)
- `Hero` + `BentoGrid` (3 Pillars) + `InteractiveTabSwitcher` + `TechnicalCard` Grid + `SpecificationPanel`

### Route Anti-Patterns (MUST NOT)
- ❌ Bài viết dài dằng dặc không có Tab chuyển đổi lọc nội dung.
- ❌ Thiếu 3 thẻ trụ cột điều khoản `BentoGrid`.
- ❌ Thiếu khối thông báo ràng buộc `SpecificationPanel`.

### Component Inventory List
- `PublicLayoutShell`: Organism bọc Header/Footer.
- `LegalContentArticle`: Molecule chứa nội dung điều khoản.
- `TableOfContentsNav`: Molecule mục lục điều hướng nhanh.

### Component Tree
```text
[TermsPageContainer]
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
| `404` | Dictionary terms không phản hồi | N/A (Dùng fallback `legal/content/en.json`) | Fallback local static | `TERMS_I18N_FALLBACK` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: User views Terms of Service
  Given a user on "/terms"
  Then the Terms of Service document renders cleanly
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`<article role="article">`).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.
