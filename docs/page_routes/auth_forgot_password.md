# Auth Forgot Password Page Route Specification (`auth_forgot_password.md`)

> **Route ID**: `AUTH_FORGOT_PASSWORD`  
> **Route Name**: `auth.forgot_password`  
> **Route Path**: `/auth/forgot-password`  
> **Route Type**: `GUEST_ONLY`  
> **Layout Shell**: `AuthLayoutShell`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `AUTH_FORGOT_PASSWORD` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `auth.forgot_password`
- **Description**: Trang Quên mật khẩu (`/auth/forgot-password`) cho phép người dùng nhập Email để nhận mã OTP hoặc Link đặt lại mật khẩu bảo mật. Trang kết nối tới Backend RPC `AuthEndpoint.requestPasswordReset(session, email)`.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/auth/forgot-password`
- **Access Type**: `GUEST_ONLY`
- **Auth Guard**: `GuestOnlyGuard`
- **Layout Shell**: `AuthLayoutShell`
- **Navigation Metadata**:
  - `sidebar`: `false`
  - `header`: `true`
  - `footer`: `true`
  - `breadcrumb`: `false`
  - `searchable`: `false`
  - `navOrder`: `4`
  - `navGroup`: `"auth"`

---

## 3. SEO & Social Meta Specification
- **Title Tag**: `<title>Reset Password Request - nodetask</title>`
- **Meta Description**: `Yêu cầu đặt lại mật khẩu cho tài khoản nodetask.`
- **Keywords**: `nodetask forgot password, reset password request`
- **Canonical URL**: `https://nodetask.io/auth/forgot-password`
- **OpenGraph Specification**:
  - `og:title`: `Reset Password Request - nodetask`
  - `og:description`: `Đặt lại mật khẩu tài khoản nodetask.`
  - `og:image`: `https://nodetask.io/og-auth.png`
  - `og:type`: `website`
- **Twitter Card Specification**:
  - `twitter:card`: `summary`
  - `twitter:title`: `Reset Password - nodetask`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/auth/ForgotPasswordPage'))`)
- **Preload Strategy**: `None`
- **Chunk Name**: `chunk-auth-forgot-password`
- **Priority**: `MEDIUM`

---

## 5. Permission Matrix & RBAC
| System Role | View Access | Submit Rights | Redirect Policy | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Cho phép gửi yêu cầu reset | Giữ tại trang | Người dùng vãng lai |
| `USER` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/workspace` | Đã đăng nhập |
| `ORG_MEMBER` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/workspace` | Thành viên tổ chức |
| `ORG_ADMIN` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/workspace` | Quản trị viên tổ chức |
| `SYSTEM_ADMIN` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/admin` | Quản trị hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `AuthEndpoint.requestPasswordReset(session, email: String)`: Gửi OTP reset password về email.
- **Data Caching & Stale Policy**:
  - `staleTime`: `0ms`.
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `TYPING` → `SUBMITTING` → `EMAIL_SENT` (Show Confirmation) | `ERROR`
- **UI State Breakdown**:
  - `IDLE`: Chờ nhập Email.
  - `SUBMITTING`: Nút Submit hiển thị `[Sending...]`.
  - `EMAIL_SENT`: Hiển thị thông báo "Email đặt lại mật khẩu đã được gửi".

---

## 8. Component Inventory & Tree

### Component Inventory List
- `AuthLayoutShell`: Organism bọc giao diện Authentication.
- `ForgotPasswordCard`: Container card cho form quên mật khẩu.
- `EmailInput`: Atom input nhập email.
- `SubmitButton`: Button gửi yêu cầu reset.

### Component Tree
```text
[ForgotPasswordPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [AuthHeader]
└── [MainContent id="main-content" alignment="center"]
    └── [ForgotPasswordCard maxWidth="440px"]
        ├── [FormTitle contentKey="auth.forgot_password.title"]
        ├── [ForgotPasswordForm onSubmit=handleResetRequest]
        │   ├── [EmailInput type="email"]
        │   └── [SubmitButton disabled=loading]
        └── [FormFooterNav]
            └── [LoginLink target="/auth/login"]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Session token bị từ chối | `auth.forgot.error.unauthorized` | Reset form | `AUTH_FORGOT_UNAUTHORIZED` |
| `404` | Email không tồn tại | `auth.forgot.error.email_not_found` | Gợi ý đăng ký tài khoản mới | `AUTH_FORGOT_EMAIL_NOT_FOUND` |
| `429` | Yêu cầu quá 3 lần / 5 phút | `auth.forgot.error.rate_limit` | Khoá Form 120s | `AUTH_FORGOT_RATE_LIMITED` |
| `500` | Lỗi dịch vụ gửi mail Backend | `auth.forgot.error.email_service_down` | Hiển thị thông báo hỗ trợ | `AUTH_FORGOT_SERVER_ERROR` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: User requests password reset for existing email
  Given a Guest on "/auth/forgot-password"
  When entering email "user@domain.com" and submitting
  Then `AuthEndpoint.requestPasswordReset()` is invoked
  And the UI displays confirmation message "Check your inbox for reset instructions"
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2.
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.
