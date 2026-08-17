<!-- Target FE Component: apps/web/src/features/auth/RegisterPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/auth/register -->

# Auth Register Page Route Specification (`auth_register.md`)

> **Route ID**: `AUTH_REGISTER`  
> **Route Name**: `auth.register`  
> **Route Path**: `/auth/register`  
> **Route Type**: `GUEST_ONLY`  
> **Layout Shell**: `AuthLayoutShell`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `AUTH_REGISTER` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `auth.register`
- **Description**: Trang Đăng ký (`/auth/register`) cung cấp giao diện tạo tài khoản mới cho người dùng cá nhân hoặc đại diện tổ chức. Trang gửi dữ liệu đăng ký qua `AuthEndpoint.register(session, input)`, khởi tạo User profile và gửi OTP/Link xác minh email.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/auth/register`
- **Access Type**: `GUEST_ONLY`
- **Auth Guard**: `GuestOnlyGuard`
- **Layout Shell**: `AuthLayoutShell`
- **Navigation Metadata**:
  - `sidebar`: `false`
  - `header`: `true`
  - `footer`: `true`
  - `breadcrumb`: `false`
  - `searchable`: `false`
  - `navOrder`: `3`
  - `navGroup`: `"auth"`

---

## 3. SEO & Social Share Metadata (SEO Meta Specification)
- **Title Tag**: `<title>Create Account - nodetask</title>`
- **Meta Description**: `Đăng ký tài khoản nodetask để trải nghiệm không gian quản lý tài liệu tối giản Monochrome.`
- **Keywords**: `nodetask register, create account, sign up, zero-icon workspace`
- **Canonical URL**: `/#/auth/register`
- **OpenGraph Specification**:
  - `og:title`: `Create Account - nodetask`
  - `og:description`: `Đăng ký tài khoản không gian tri thức nodetask.`
  - `og:image`: `/og-auth.png`
  - `og:type`: `website`
  - `og:url`: `/#/auth/register`
- **Twitter Card Specification**:
  - `twitter:card`: `summary`
  - `twitter:title`: `Create Account - nodetask`
  - `twitter:description`: `Create your nodetask account.`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/auth/RegisterPage'))`)
- **Preload Strategy**: `onHover`
- **Chunk Name**: `chunk-auth-register`
- **Priority**: `HIGH`

---

## 5. Permission Matrix & Access Control (Access Control & RBAC Permissions)
| System Role | View Access | Form Submit Rights | Redirect Policy | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Cho phép submit Form đăng ký | Giữ tại trang | Người dùng vãng lai |
| `USER` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/workspace` | Đã đăng nhập |
| `ORG_MEMBER` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/workspace` | Thành viên tổ chức |
| `ORG_ADMIN` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/workspace` | Quản trị viên tổ chức |
| `SYSTEM_ADMIN` | **Redirect** | Bị vô hiệu | Direct chuyển hướng `/admin` | Quản trị hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `AuthEndpoint.register(session, input: RegisterInputDto)`: Tạo tài khoản mới, khởi tạo workspace cá nhân mặc định, trả về `AuthResponseDto`.
- **Data Caching & Stale Policy**:
  - `staleTime`: `0ms`.
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `TYPING` → `SUBMITTING` → `VERIFY_REQUIRED` (Redirect `/auth/verify-email`) | `ERROR`
- **UI State Breakdown**:
  - `IDLE`: Form sẵn sàng nhập Full Name, Email & Password.
  - `TYPING`: Zod validation kiểm tra độ mạnh mật khẩu và định dạng email.
  - `SUBMITTING`: Nút Submit hiển thị `[Registering...]`, input disabled.
  - `VERIFY_REQUIRED`: Đăng ký thành công, tự động chuyển sang trang `/auth/verify-email?email=...`.
  - `ERROR`: Hiển thị lỗi trùng email (409) hoặc lỗi định dạng.

---

## 8. Component Inventory & Tree

### Component Inventory List
- `AuthLayoutShell`: Organism bọc giao diện Authentication.
- `RegisterFormCard`: Card container bọc tiêu đề và form đăng ký.
- `FullNameInput`: Atom input nhận họ tên hiển thị.
- `EmailInput`: Atom input nhận email.
- `PasswordInput`: Atom input nhận mật khẩu kèm thước đo độ mạnh (`[Weak]`, `[Medium]`, `[Strong]`).
- `SubmitButton`: Button atom gửi thông tin đăng ký.

### Component Tree
```text
[RegisterPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [AuthHeader]
│   └── [BrandLogo contentKey="brand.logo.text"]
└── [MainContent id="main-content" alignment="center"]
    └── [RegisterFormCard maxWidth="440px"]
        ├── [FormTitle contentKey="auth.register.title"]
        ├── [FormSubTitle contentKey="auth.register.subtitle"]
        ├── [RegisterForm onSubmit=handleRegister]
        │   ├── [FormGroup id="fullName"]
        │   │   ├── [Label contentKey="auth.register.name_label"]
        │   │   └── [FullNameInput type="text"]
        │   ├── [FormGroup id="email"]
        │   │   ├── [Label contentKey="auth.register.email_label"]
        │   │   └── [EmailInput type="email"]
        │   ├── [FormGroup id="password"]
        │   │   ├── [Label contentKey="auth.register.password_label"]
        │   │   └── [PasswordInput type="password"]
        │   └── [SubmitButton disabled=loading]
        └── [FormFooterNav]
            └── [LoginLink target="/auth/login"]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Session token không hợp lệ khi tự động lấy cấu hình | `auth.register.error.unauthorized` | Reset form | `AUTH_REG_UNAUTHORIZED` |
| `403` | Địa chỉ IP bị block đăng ký | `auth.register.error.ip_blocked` | Hiển thị thông báo hỗ trợ | `AUTH_REG_IP_BLOCKED` |
| `409` | Email đã tồn tại trong hệ thống | `auth.register.error.email_exists` | Gợi ý đăng nhập hoặc quên mật khẩu | `AUTH_REG_DUPLICATE_EMAIL` |
| `422` | Mật khẩu chưa đủ độ dài/ký tự bắt buộc | `auth.register.error.weak_password` | Hiển thị hướng dẫn độ mạnh mật khẩu | `AUTH_REG_WEAK_PASSWORD` |
| `429` | Quá nhiều lần thử đăng ký từ cùng 1 IP | `auth.register.error.rate_limit` | Khoá Form 60s | `AUTH_REG_RATE_LIMITED` |
| `500` | Lỗi khởi tạo tài khoản ở Serverpod Database | `auth.register.error.server_error` | Banner báo lỗi hệ thống | `AUTH_REG_SERVER_ERROR` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: Guest creates account with valid input
  Given a Guest on "/auth/register"
  When filling name "John Doe", email "john@example.com", valid password
  And clicking Submit button
  Then `AuthEndpoint.register()` succeeds
  And user is redirected to "/auth/verify-email?email=john@example.com"

Scenario: Registration fails due to existing email
  Given a Guest attempting to register with "registered@domain.com"
  When submitting the form
  Then server returns 409 Conflict status
  And UI displays "Email already registered. Would you like to sign in?"
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`role="form"`).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.
