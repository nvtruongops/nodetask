<!-- Target FE Component: apps/web/src/features/auth/VerifyEmailPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/auth/verify-email -->

# Auth Verify Email Page Route Specification (`auth_verify_email.md`)

> **Route ID**: `AUTH_VERIFY_EMAIL`  
> **Route Name**: `auth.verify_email`  
> **Route Path**: `/auth/verify-email`  
> **Route Type**: `GUEST_ONLY`  
> **Layout Shell**: `AuthLayoutShell`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `AUTH_VERIFY_EMAIL` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `auth.verify_email`
- **Description**: Trang Xác minh Email (`/auth/verify-email`) cho phép người dùng xác nhận địa chỉ email của mình bằng mã OTP 6 chữ số hoặc click link token từ email. Trang gọi `AuthEndpoint.verifyEmail(session, input)`.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/auth/verify-email`
- **Access Type**: `GUEST_ONLY`
- **Auth Guard**: `GuestOnlyGuard`
- **Layout Shell**: `AuthLayoutShell`
- **Navigation Metadata**:
  - `sidebar`: `false`
  - `header`: `true`
  - `footer`: `true`
  - `breadcrumb`: `false`
  - `searchable`: `false`
  - `navOrder`: `6`
  - `navGroup`: `"auth"`

---

## 3. SEO & Social Share Metadata (SEO Meta Specification)
- **Title Tag**: `<title>Verify Email - nodetask</title>`
- **Meta Description**: `Xác minh địa chỉ email của bạn để kích hoạt tài khoản nodetask.`
- **Keywords**: `nodetask verify email, email confirmation, otp code`
- **Canonical URL**: `/#/auth/verify-email`
- **OpenGraph Specification**:
  - `og:title`: `Verify Email - nodetask`
  - `og:description`: `Xác thực email kích hoạt tài khoản nodetask.`
  - `og:image`: `/og-auth.png`
  - `og:type`: `website`
- **Twitter Card Specification**:
  - `twitter:card`: `summary`
  - `twitter:title`: `Verify Email - nodetask`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/auth/VerifyEmailPage'))`)
- **Preload Strategy**: `None`
- **Chunk Name**: `chunk-auth-verify-email`
- **Priority**: `HIGH`

---

## 5. Permission Matrix & Access Control (Access Control & RBAC Permissions)
| System Role | View Access | Form Submit Rights | Redirect Policy | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Cho phép nhập OTP xác minh | Giữ tại trang | Người dùng mới đăng ký |
| `USER` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/workspace` | Đã xác minh & đăng nhập |
| `ORG_MEMBER` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/workspace` | Thành viên tổ chức |
| `ORG_ADMIN` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/workspace` | Quản trị viên tổ chức |
| `SYSTEM_ADMIN` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/admin` | Quản trị hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `AuthEndpoint.verifyEmail(session, input: VerifyEmailInputDto)`: Kích hoạt tài khoản khi OTP hợp lệ.
  - `AuthEndpoint.resendVerificationCode(session, email: String)`: Gửi lại mã OTP mới.
- **Data Caching & Stale Policy**:
  - `staleTime`: `0ms`.
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `ENTERING_OTP` → `VERIFYING` → `SUCCESS` (Redirect `/auth/login?verified=true`) | `ERROR`
- **UI State Breakdown**:
  - `IDLE`: Chờ người dùng nhập OTP 6 chữ số.
  - `VERIFYING`: Đang gọi `AuthEndpoint.verifyEmail()`.
  - `SUCCESS`: Kích hoạt thành công, thông báo và chuyển hướng sang `/auth/login`.

---

## 8. Component Inventory & Tree

### Component Inventory List
- `AuthLayoutShell`: Organism bọc giao diện Authentication.
- `VerifyEmailCard`: Container card bọc form nhập OTP.
- `OtpCodeInput`: Atom input 6 ô nhập mã OTP.
- `ResendCodeButton`: Button atom gửi lại mã OTP kèm đếm ngược 60s.
- `SubmitButton`: Button xác nhận OTP.

### Component Tree
```text
[VerifyEmailPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [AuthHeader]
└── [MainContent id="main-content" alignment="center"]
    └── [VerifyEmailCard maxWidth="440px"]
        ├── [FormTitle contentKey="auth.verify_email.title"]
        ├── [VerifyEmailForm onSubmit=handleVerify]
        │   ├── [OtpCodeInput length=6]
        │   ├── [ResendCodeButton cooldown=60]
        │   └── [SubmitButton disabled=loading]
        └── [FormFooterNav]
            └── [LoginLink target="/auth/login"]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Mã OTP không chính xác hoặc hết hạn | `auth.verify.error.invalid_otp` | Xóa OTP, yêu cầu nhập lại hoặc gửi lại | `AUTH_VERIFY_BAD_OTP` |
| `409` | Email đã được xác minh trước đó | `auth.verify.error.already_verified` | Chuyển hướng sang `/auth/login` | `AUTH_VERIFY_ALREADY_DONE` |
| `429` | Thử sai OTP > 5 lần | `auth.verify.error.rate_limit` | Khoá nhập OTP 180s | `AUTH_VERIFY_RATE_LIMITED` |
| `500` | Lỗi dịch vụ backend | `auth.verify.error.server_error` | Banner báo lỗi hệ thống | `AUTH_VERIFY_SERVER_ERROR` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: Entering valid OTP activates account
  Given a Guest with unverified email on "/auth/verify-email?email=test@example.com"
  When entering correct 6-digit OTP "123456"
  Then `AuthEndpoint.verifyEmail()` completes
  And user is redirected to "/auth/login?verified=true"

Scenario: Resend OTP cooldown timer
  Given a user on "/auth/verify-email"
  When clicking "Resend Code" button
  Then a new OTP is sent to user's email
  And the "Resend Code" button enters a 60-second disabled cooldown state
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`role="form"`, OTP inputs with arrow-key traversal).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.
