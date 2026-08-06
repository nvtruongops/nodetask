<!-- Target FE Component: apps/web/src/features/auth/AccountDisabledPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/auth/account-disabled -->

# Auth Account Disabled Page Route Specification (`auth_account_disabled.md`)

> **Route ID**: `AUTH_ACCOUNT_DISABLED`  
> **Route Name**: `auth.account_disabled`  
> **Route Path**: `/auth/account-disabled`  
> **Route Type**: `PUBLIC_OR_GUEST`  
> **Layout Shell**: `AuthLayoutShell`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `AUTH_ACCOUNT_DISABLED` (Dùng cho Security Audit, Account Governance, Incident Tracking, RBAC)
- **Route Name**: `auth.account_disabled`
- **Description**: Trang hiển thị thông báo tài khoản bị vô hiệu hóa hoặc tạm khóa (`/auth/account-disabled`). Kích hoạt khi người dùng cố gắng đăng nhập hoặc bị hệ thống/Admin ngưng quyền truy cập (Account Suspended / Organization Inactive). Cung cấp lý do cụ thể theo chính sách bảo mật và hỗ trợ form gửi yêu cầu khiếu nại (Appeal / Contact Support).

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/auth/account-disabled`
- **Access Type**: `PUBLIC_OR_GUEST`
- **Page Archetype**: `Auth & Form Focus`
- **Auth Guard**: `None`
- **Layout Shell**: `AuthLayoutShell`
- **Navigation Metadata**:
  - `sidebar`: `false`
  - `header`: `true`
  - `footer`: `true`
  - `breadcrumb`: `false`
  - `searchable`: `false`
  - `navOrder`: `8`
  - `navGroup`: `"auth"`

---

## 3. SEO & Social Meta Specification
- **Title Tag**: `<title>Account Disabled - nodetask</title>`
- **Meta Description**: `Thông báo trạng thái tài khoản nodetask bị tạm khóa hoặc vô hiệu hóa.`
- **Keywords**: `nodetask account disabled, account suspended, support appeal`
- **Canonical URL**: `/#/auth/account-disabled`
- **OpenGraph Specification**:
  - `og:title`: `Account Disabled - nodetask`
  - `og:description`: `Trạng thái tài khoản và hướng dẫn hỗ trợ khiếu nại nodetask.`
  - `og:image`: `/og-auth.png`
  - `og:type`: `website`
  - `og:url`: `/#/auth/account-disabled`
- **Twitter Card Specification**:
  - `twitter:card`: `summary`
  - `twitter:title`: `Account Disabled - nodetask`
  - `twitter:description`: `Account status notice on nodetask.`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/auth/AccountDisabledPage'))`)
- **Preload Strategy**: `none` (Tải khi bị vô hiệu hóa hoặc chuyển hướng bảo mật)
- **Chunk Name**: `chunk-auth-account-disabled`
- **Priority**: `HIGH`

---

## 5. Permission Matrix & RBAC
| System Role | View Access | Form Submit Rights | Redirect Policy | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Gửi form khiếu nại support | Giữ tại trang | Xem lý do tài khoản bị vô hiệu hóa |
| `USER` | **Allowed** | Gửi form khiếu nại support | Không được vào `/workspace` | Tài khoản cá nhân bị khóa |
| `ORG_MEMBER` | **Allowed** | Gửi form khiếu nại support | Không được vào `/workspace` | Thành viên bị khóa |
| `ORG_ADMIN` | **Allowed** | Gửi form khiếu nại support | Không được vào `/workspace` | Quản trị Org bị khóa |
| `SYSTEM_ADMIN` | **Allowed** | Xem thông tin hỗ trợ | Cho phép chuyển `/admin` | Quản trị hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `AuthEndpoint.getAccountDisableReason(session, accountId: String)`: Lấy chi tiết mã lý do vô hiệu hóa tài khoản (Policy Violation, Payment Default, Admin Lock).
  - `AuthEndpoint.submitAccountAppeal(session, input: AppealInputDto)`: Gửi form khiếu nại lên hệ thống kiểm duyệt.
- **Data Caching & Stale Policy**:
  - `staleTime`: `0ms`.
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `VIEWING_REASON` → `SUBMITTING_APPEAL` → `APPEAL_SENT` | `ERROR`
- **UI State Breakdown**:
  - `IDLE`: Đọc mã lý do khóa tài khoản từ Session State / Query Params.
  - `VIEWING_REASON`: Hiển thị thông báo lý do `[ACCOUNT_DISABLED_REASON]` và quy định điều khoản bị ảnh hưởng.
  - `SUBMITTING_APPEAL`: Người dùng nhập lý do khiếu nại, nút submit chuyển `[Submitting Appeal...]`.
  - `APPEAL_SENT`: Hiển thị thông báo khiếu nại đã gửi thành công `[Appeal Submitted - Case ID: #1234]`.
  - `ERROR`: Lỗi gửi khiếu nại, cho phép thử lại hoặc liên hệ qua email support.

---

## 8. Component Inventory & Tree

### Component Inventory List
- `AuthLayoutShell`: Container giao diện Authentication.
- `DisabledNoticeCard`: Card container hiển thị cảnh báo vô hiệu hóa.
- `ReasonBadge`: Text label hiển thị mã lý do `[POLICY_VIOLATION]` hoặc `[ADMIN_SUSPENDED]`.
- `AppealForm`: Form nhập nội dung giải trình khiếu nại.
- `ContactSupportButton`: Button liên hệ trực tiếp bộ phận hỗ trợ.

### Required Pattern Components
- `Required Pattern Components`: `AuthLayoutShell`, `DisabledNoticeCard`, `ReasonBadge`, `AppealForm`

### Route Anti-Patterns
- `Route Anti-Patterns`: Tuyệt đối không dùng icon cảnh báo / màu đỏ icon dạng emoji; sử dụng typography monochrome và mảng màu độ tương phản cao.

### Component Tree
```text
[AccountDisabledPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [AuthHeader]
│   └── [BrandLogo contentKey="brand.logo.text"]
└── [MainContent id="main-content" alignment="center"]
    └── [DisabledNoticeCard maxWidth="480px"]
        ├── [NoticeTitle contentKey="auth.disabled.title"]
        ├── [ReasonBadge label="[REASON: ACCOUNT_SUSPENDED]"]
        ├── [NoticeDescription contentKey="auth.disabled.description"]
        ├── [AppealForm onSubmit=handleAppealSubmit]
        │   ├── [AppealTextArea id="appealMessage"]
        │   └── [SubmitAppealButton disabled=loading]
        └── [DisabledFooterNav]
            └── [ContactSupportButton target="/contact"]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Mã phiên không hợp lệ khi kiểm tra tài khoản | `auth.disabled.error.invalid_session` | Chuyển hướng về `/auth/login` | `ACCOUNT_DISABLED_BAD_SESSION` |
| `403` | Tài khoản đã bị khóa vĩnh viễn không cho khiếu nại | `auth.disabled.error.permanently_banned` | Hiển thị thông báo quyết định cuối cùng | `ACCOUNT_PERMANENTLY_BANNED` |
| `409` | Đơn khiếu nại trùng lặp đã được gửi trước đó | `auth.disabled.error.appeal_exists` | Hiển thị trạng thái đơn đang xử lý | `APPEAL_ALREADY_EXISTS` |
| `422` | Nội dung khiếu nại không đủ số ký tự tối thiểu | `auth.disabled.error.validation` | Yêu cầu nhập chi tiết tối thiểu 50 từ | `APPEAL_VALIDATION_ERROR` |
| `429` | Gửi form khiếu nại quá 3 lần / giờ | `auth.disabled.error.rate_limit` | Tạm khóa nút gửi 1 giờ | `APPEAL_RATE_LIMIT` |
| `500` | Lỗi máy chủ khi lưu đơn khiếu nại | `auth.disabled.error.server_error` | Hiển thị nút gửi lại | `APPEAL_SERVER_ERROR` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: User with disabled account attempts to view page
  Given a user whose account status is "SUSPENDED"
  When navigating to "/auth/account-disabled"
  Then the system displays the DisabledNoticeCard with ReasonBadge "[REASON: ACCOUNT_SUSPENDED]"
  And provides the AppealForm for support submission

Scenario: User submits an appeal request
  Given a user on "/auth/account-disabled" page
  When the user fills appeal details and submits the form
  Then the system calls `AuthEndpoint.submitAccountAppeal()`
  And displays confirmation message "[Appeal Submitted - Case ID: #...]"
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`role="alertdialog"`, `aria-describedby` nội dung lý do).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.
