# Auth Login Page Route Specification (`auth_login.md`)

> **Route ID**: `AUTH_LOGIN`  
> **Route Name**: `auth.login`  
> **Route Path**: `/auth/login`  
> **Route Type**: `GUEST_ONLY`  
> **Layout Shell**: `AuthLayoutShell`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `AUTH_LOGIN` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `auth.login`
- **Description**: Trang Đăng nhập (`/auth/login`) cung cấp giao diện đăng nhập cho thành viên cá nhân và tổ chức. Trang kết nối trực tiếp với backend Serverpod RPC Endpoint `AuthEndpoint.login(session, input)`, nhận Session Token và lưu trữ mã hóa trong Local Storage / State.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/auth/login`
- **Access Type**: `GUEST_ONLY` (Nếu đã có Session Token hợp lệ, tự động redirect sang `/workspace`)
- **Auth Guard**: `GuestOnlyGuard`
- **Layout Shell**: `AuthLayoutShell`
- **Navigation Metadata**:
  - `sidebar`: `false`
  - `header`: `true`
  - `footer`: `true`
  - `breadcrumb`: `false`
  - `searchable`: `false`
  - `navOrder`: `2`
  - `navGroup`: `"auth"`

---

## 3. SEO & Social Meta Specification
- **Title Tag**: `<title>Sign In - nodetask</title>`
- **Meta Description**: `Đăng nhập vào nodetask để quản lý không gian tài liệu và tri thức cá nhân/tổ chức.`
- **Keywords**: `nodetask login, sign in, authentication, zero-icon auth`
- **Canonical URL**: `https://nodetask.io/auth/login`
- **OpenGraph Specification**:
  - `og:title`: `Sign In - nodetask`
  - `og:description`: `Đăng nhập vào không gian tri thức nodetask.`
  - `og:image`: `https://nodetask.io/og-auth.png`
  - `og:type`: `website`
  - `og:url`: `https://nodetask.io/auth/login`
- **Twitter Card Specification**:
  - `twitter:card`: `summary`
  - `twitter:title`: `Sign In - nodetask`
  - `twitter:description`: `Sign in to your nodetask workspace.`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/auth/LoginPage'))`)
- **Preload Strategy**: `onHover` (Preload chunk khi hover vào link "Sign In" từ Header)
- **Chunk Name**: `chunk-auth-login`
- **Priority**: `HIGH`

---

## 5. Permission Matrix & RBAC
| System Role | View Access | Form Submit Rights | Redirect Policy | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Cho phép submit Form đăng nhập | Giữ tại trang | Người dùng vãng lai |
| `USER` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/workspace` | Đã đăng nhập |
| `ORG_MEMBER` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/workspace` | Thành viên tổ chức |
| `ORG_ADMIN` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/workspace` | Quản trị viên tổ chức |
| `SYSTEM_ADMIN` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/admin` | Quản trị hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `AuthEndpoint.login(session, input: LoginInputDto)`: Thực hiện xác thực email + mật khẩu, trả về `AuthResponseDto` chứa `sessionToken` và `user`.
  - `AuthEndpoint.refreshToken(session, refreshToken: String)`: Đổi refresh token khi sessionToken hết hạn.
- **Data Caching & Stale Policy**:
  - `staleTime`: `0ms` (Không cache form credentials).
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `TYPING` → `SUBMITTING` → `SUCCESS` (Redirect `/workspace`) | `ERROR` (Retry)
- **UI State Breakdown**:
  - `IDLE`: Form sẵn sàng nhập Email & Password.
  - `TYPING`: Người dùng nhập liệu, kích hoạt Zod real-time validation.
  - `SUBMITTING`: Nút Submit hiển thị `[Submitting...]`, input disabled.
  - `SUCCESS`: Lưu Token vào `useAuthStore`, chuyển hướng người dùng sang `/workspace`.
  - `ERROR`: Hiển thị Banner lỗi tương ứng (401/403/429), khôi phục form trạng thái `TYPING`.

---

## 8. Component Inventory & Tree

### Component Inventory List
- `AuthLayoutShell`: Organism bọc giao diện Authentication.
- `LoginFormCard`: Card container bọc tiêu đề và form nhập liệu.
- `EmailInput`: Atom input nhận địa chỉ email.
- `PasswordInput`: Atom input nhận mật khẩu mã hoá.
- `ForgotPasswordLink`: Link atom dẫn sang `/auth/forgot-password`.
- `SubmitButton`: Button atom gửi credentials với trạng thái loading `[Submitting...]`.

### Component Tree
```text
[LoginPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [AuthHeader]
│   └── [BrandLogo contentKey="brand.logo.text"]
└── [MainContent id="main-content" alignment="center"]
    └── [LoginFormCard maxWidth="440px"]
        ├── [FormTitle contentKey="auth.login.title"]
        ├── [FormSubTitle contentKey="auth.login.subtitle"]
        ├── [LoginForm onSubmit=handleLogin]
        │   ├── [FormGroup id="email"]
        │   │   ├── [Label contentKey="auth.login.email_label"]
        │   │   └── [EmailInput type="email"]
        │   ├── [FormGroup id="password"]
        │   │   ├── [Label contentKey="auth.login.password_label"]
        │   │   └── [PasswordInput type="password"]
        │   ├── [FormActions]
        │   │   └── [ForgotPasswordLink target="/auth/forgot-password"]
        │   └── [SubmitButton disabled=loading]
        └── [FormFooterNav]
            └── [RegisterLink target="/auth/register"]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Mật khẩu không chính xác hoặc email chưa đăng ký | `auth.login.error.invalid_credentials` | Hiển thị thông báo sai thông tin, focus Password | `AUTH_LOGIN_BAD_CREDENTIALS` |
| `403` | Tài khoản chưa xác minh email hoặc bị khoá | `auth.login.error.account_unverified` | Gợi ý link `/auth/verify-email` | `AUTH_LOGIN_UNVERIFIED` |
| `409` | Xung đột phiên làm việc đã tồn tại | `auth.login.error.conflict` | Yêu cầu huỷ phiên cũ hoặc đăng xuất thiết bị | `AUTH_LOGIN_SESSION_CONFLICT` |
| `422` | Email/Password không tuân thủ định dạng Zod | `auth.login.error.validation_failed` | Focus trường lỗi, hiển thị inline message | `AUTH_LOGIN_VALIDATION` |
| `429` | Đăng nhập thất bại > 5 lần / phút | `auth.login.error.rate_limit` | Khóa Form 60s kèm đồng hồ đếm ngược | `AUTH_LOGIN_RATE_LIMITED` |
| `500` | Serverpod Backend ném ra unhandled exception | `auth.login.error.server_error` | Hiển thị banner thử lại sau ít phút | `AUTH_LOGIN_SERVER_ERROR` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: Guest submits valid email and password
  Given a Guest user on "/auth/login"
  When the user fills email "user@domain.com" and valid password
  And clicks the Submit button
  Then the system calls `AuthEndpoint.login()`
  And upon success, stores session token in `useAuthStore`
  And redirects the user to "/workspace"

Scenario: Guest inputs invalid email format
  Given a Guest user on "/auth/login"
  When the user types "invalid-email" in email field
  Then Zod inline validation triggers message "auth.login.error.invalid_email"
  And the Submit button remains disabled

Scenario: Rate limit triggered after repeated failures
  Given a user who entered incorrect password 5 consecutive times
  When submitting the 6th attempt
  Then the server returns 429 Rate Limit status
  And the UI displays countdown timer "Try again in 60s"
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`role="form"`, `aria-describedby` for validation errors).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.
