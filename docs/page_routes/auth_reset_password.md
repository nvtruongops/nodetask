<!-- Target FE Component: apps/web/src/features/auth/ResetPasswordPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/auth/reset-password -->

# Auth Reset Password Page Route Specification (`auth_reset_password.md`)

> **Route ID**: `AUTH_RESET_PASSWORD`  
> **Route Name**: `auth.reset_password`  
> **Route Path**: `/auth/reset-password`  
> **Route Type**: `GUEST_ONLY`  
> **Layout Shell**: `AuthLayoutShell`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `AUTH_RESET_PASSWORD` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `auth.reset_password`
- **Description**: Trang Đặt lại mật khẩu (`/auth/reset-password`) tiếp nhận token đặt lại từ URL parameter (`?token=...`), xác thực tính hợp lệ của token và cập nhật mật khẩu mới qua `AuthEndpoint.confirmPasswordReset(session, input)`.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/auth/reset-password`
- **Access Type**: `GUEST_ONLY`
- **Auth Guard**: `GuestOnlyGuard`
- **Layout Shell**: `AuthLayoutShell`
- **Navigation Metadata**:
  - `sidebar`: `false`
  - `header`: `true`
  - `footer`: `true`
  - `breadcrumb`: `false`
  - `searchable`: `false`
  - `navOrder`: `5`
  - `navGroup`: `"auth"`

---

## 3. SEO & Social Share Metadata (SEO Meta Specification)
- **Title Tag**: `<title>Set New Password - nodetask</title>`
- **Meta Description**: `Thiết lập mật khẩu mới cho tài khoản nodetask.`
- **Keywords**: `nodetask reset password, confirm reset token`
- **Canonical URL**: `/#/auth/reset-password`
- **OpenGraph Specification**:
  - `og:title`: `Reset Password - nodetask`
  - `og:description`: `Thiết lập mật khẩu mới cho tài khoản nodetask.`
  - `og:image`: `/og-auth.png`
  - `og:type`: `website`
- **Twitter Card Specification**:
  - `twitter:card`: `summary`
  - `twitter:title`: `Set New Password - nodetask`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/auth/ResetPasswordPage'))`)
- **Preload Strategy**: `None`
- **Chunk Name**: `chunk-auth-reset-password`
- **Priority**: `MEDIUM`

---

## 5. Permission Matrix & Access Control (Access Control & RBAC Permissions)
| System Role | View Access | Form Submit Rights | Redirect Policy | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Cho phép submit mật khẩu mới khi token hợp lệ | Giữ tại trang | Người dùng có token |
| `USER` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/workspace` | Đã đăng nhập |
| `ORG_MEMBER` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/workspace` | Thành viên tổ chức |
| `ORG_ADMIN` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/workspace` | Quản trị viên tổ chức |
| `SYSTEM_ADMIN` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/admin` | Quản trị hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `AuthEndpoint.confirmPasswordReset(session, input: ResetPasswordInputDto)`: Xác thực token và lưu mật khẩu mới.
- **Data Caching & Stale Policy**:
  - `staleTime`: `0ms`.
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `VALIDATING_TOKEN` → `TOKEN_VALID` (Show Form) → `SUBMITTING` → `SUCCESS` (Redirect `/auth/login`) | `TOKEN_INVALID`
- **UI State Breakdown**:
  - `IDLE`: Khởi tạo state machine.
  - `VALIDATING_TOKEN`: Đang kiểm tra token trên URL.
  - `TOKEN_VALID`: Token hợp lệ, hiển thị Form nhập mật khẩu mới.
  - `TOKEN_INVALID`: Token đã hết hạn hoặc không hợp lệ, hiển thị nút yêu cầu gửi lại link.
  - `SUCCESS`: Cập nhật thành công, chuyển hướng về `/auth/login?reset=success`.

---

## 8. Component Inventory & Tree

### Component Inventory List
- `AuthLayoutShell`: Organism bọc giao diện Authentication.
- `ResetPasswordCard`: Container card cho form đặt lại mật khẩu.
- `NewPasswordInput`: Atom input nhập mật khẩu mới.
- `ConfirmPasswordInput`: Atom input xác nhận lại mật khẩu.
- `SubmitButton`: Button cập nhật mật khẩu.

### Component Tree
```text
[ResetPasswordPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [AuthHeader]
└── [MainContent id="main-content" alignment="center"]
    └── [ResetPasswordCard maxWidth="440px"]
        ├── [FormTitle contentKey="auth.reset_password.title"]
        ├── [ResetPasswordForm onSubmit=handleConfirmReset]
        │   ├── [NewPasswordInput type="password"]
        │   ├── [ConfirmPasswordInput type="password"]
        │   └── [SubmitButton disabled=loading]
        └── [FormFooterNav]
            └── [LoginLink target="/auth/login"]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Reset token không hợp lệ hoặc đã hết hạn | `auth.reset.error.token_expired` | Hiển thị link về `/auth/forgot-password` | `AUTH_RESET_TOKEN_EXPIRED` |
| `422` | Mật khẩu mới trùng mật khẩu cũ | `auth.reset.error.password_reused` | Yêu cầu nhập mật khẩu khác | `AUTH_RESET_PASSWORD_REUSED` |
| `429` | Thử quá nhiều lần | `auth.reset.error.rate_limit` | Khoá Form 60s | `AUTH_RESET_RATE_LIMITED` |
| `500` | Lỗi Serverpod Backend | `auth.reset.error.server_error` | Hiển thị thông báo lỗi hệ thống | `AUTH_RESET_SERVER_ERROR` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: Reset password with valid token
  Given a Guest user opening "/auth/reset-password?token=valid_token"
  When entering new valid password and submitting
  Then `AuthEndpoint.confirmPasswordReset()` succeeds
  And user is redirected to "/auth/login?reset=success"

Scenario: Opening reset page with expired token
  Given a Guest opening "/auth/reset-password?token=expired_token"
  Then the UI displays "Reset token has expired"
  And provides a link to "/auth/forgot-password"
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2.
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.
