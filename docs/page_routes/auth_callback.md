<!-- Target FE Component: apps/web/src/features/auth/AuthCallbackPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/auth/callback -->

# Auth Callback Page Route Specification (`auth_callback.md`)

> **Route ID**: `AUTH_CALLBACK`  
> **Route Name**: `auth.callback`  
> **Route Path**: `/auth/callback`  
> **Route Type**: `PUBLIC_OR_GUEST`  
> **Layout Shell**: `AuthLayoutShell`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `AUTH_CALLBACK` (Dùng cho Analytics, OAuth Audit, Event Tracking, RBAC)
- **Route Name**: `auth.callback`
- **Description**: Trang trung gian xử lý phản hồi mã xác thực OAuth 2.0 (Google, GitHub PKCE authorization code exchange) hoặc Magic Link callback. Trang hiển thị giao diện xử lý (Demo Mode) mượt mà với spinner/progress bar để tránh hiệu ứng giật vỡ layout trên trang Đăng nhập (`/auth/login`). Khi mã xác thực được kiểm tra (mô phỏng trong bản Demo), trang tiến hành lưu Session Token và chuyển hướng người dùng vào `/workspace`.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/auth/callback`
- **Access Type**: `PUBLIC_OR_GUEST`
- **Page Archetype**: `Auth & Form Focus`
- **Auth Guard**: `None` (Được phép truy cập để nhận tham số OAuth `code`, `state` hoặc `error`)
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
- **Title Tag**: `<title>Authenticating... - nodetask</title>`
- **Meta Description**: `Đang xác thực và hoàn tất đăng nhập vào nodetask.`
- **Keywords**: `nodetask oauth, oauth callback, authentication redirect`
- **Canonical URL**: `/#/auth/callback`
- **OpenGraph Specification**:
  - `og:title`: `Authenticating... - nodetask`
  - `og:description`: `Đang xử lý đăng nhập không gian tri thức nodetask.`
  - `og:image`: `/og-auth.png`
  - `og:type`: `website`
  - `og:url`: `/#/auth/callback`
- **Twitter Card Specification**:
  - `twitter:card`: `summary`
  - `twitter:title`: `Authenticating... - nodetask`
  - `twitter:description`: `Authenticating OAuth token for nodetask.`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/auth/AuthCallbackPage'))`)
- **Preload Strategy**: `none` (Không preload trước vì chỉ kích hoạt khi Provider chuyển hướng về)
- **Chunk Name**: `chunk-auth-callback`
- **Priority**: `HIGH`

---

## 5. Permission Matrix & Access Control (Access Control & RBAC Permissions)
| System Role | View Access | Form Submit Rights | Redirect Policy | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Tự động trao đổi OAuth code | Chuyển hướng `/workspace` khi thành công | Trạng thái xử lý OAuth demo |
| `USER` | **Allowed** | Tự động trao đổi OAuth code | Direct chuyển hướng `/workspace` | Đã đăng nhập |
| `ORG_MEMBER` | **Allowed** | Tự động trao đổi OAuth code | Direct chuyển hướng `/workspace` | Thành viên tổ chức |
| `ORG_ADMIN` | **Allowed** | Tự động trao đổi OAuth code | Direct chuyển hướng `/workspace` | Quản trị viên tổ chức |
| `SYSTEM_ADMIN` | **Allowed** | Tự động trao đổi OAuth code | Direct chuyển hướng `/admin` | Quản trị hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `AuthEndpoint.exchangeOAuthCode(session, provider: String, code: String)`: Hàm nhận OAuth Authorization Code để đổi thành Session Token. Trong chế độ Demo Mode, frontend mô phỏng quá trình này và trả về thành công để kiểm thử giao diện.
  - `AuthEndpoint.getCurrentUser(session)`: Lấy thông tin user profile sau khi trao đổi token thành công.
- **Data Caching & Stale Policy**:
  - `staleTime`: `0ms` (Không cache kết quả callback).
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `PROCESSING` (Extract URL Params & Demo Code Exchange) → `SUCCESS` (Redirect `/workspace`) | `ERROR` (Redirect `/auth/login` kèm error banner)
- **UI State Breakdown**:
  - `IDLE`: Khởi tạo trang, đọc tham số `code` và `state` từ URL Search Parameters.
  - `PROCESSING`: Hiển thị trạng thái đang xử lý xác thực `[Authenticating with Provider...]` kèm badge `[SOON / DEMO]` mô phỏng cho Google/GitHub OAuth provider.
  - `SUCCESS`: Xác thực thành công (hoặc mô phỏng thành công ở Demo Mode), chuyển hướng người dùng về `/workspace`.
  - `ERROR`: Khi URL chứa `error` hoặc đổi token thất bại, hiển thị thông báo lỗi và cung cấp nút quay lại `/auth/login`.

---

## 8. Component Inventory & Tree

### Component Inventory List
- `AuthLayoutShell`: Container giao diện Authentication.
- `CallbackStatusCard`: Card hiển thị trạng thái xử lý OAuth.
- `ProviderLogoBadge`: Text-based Provider Brand Label `[Google OAuth / SOON]` hoặc `[GitHub OAuth / SOON]` (Tuân thủ Zero-Icon Rule).
- `ProcessingSpinner`: Atom hiển thị chỉ báo đang xử lý không dùng icon (Monochrome Progress Indicator).
- `StatusMessage`: Text label thông báo tiến trình xác thực (`auth.callback.processing`).
- `ReturnToLoginButton`: Button quay lại trang đăng nhập khi có lỗi.

### Required Pattern Components
- `Required Pattern Components`: `AuthLayoutShell`, `CallbackStatusCard`, `ProcessingSpinner`, `StatusMessage`

### Route Anti-Patterns
- `Route Anti-Patterns`: Tuyệt đối không import icon/emoji từ bất kỳ thư viện nào; không tự ý hiển thị mock token nhạy cảm ra giao diện.

### Component Tree
```text
[AuthCallbackPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [AuthHeader]
│   └── [BrandLogo contentKey="brand.logo.text"]
└── [MainContent id="main-content" alignment="center"]
    └── [CallbackStatusCard maxWidth="440px"]
        ├── [StatusTitle contentKey="auth.callback.title"]
        ├── [ProviderLogoBadge label="[Google / GitHub OAuth - SOON]"]
        ├── [ProcessingSpinner progressState=active]
        ├── [StatusMessage contentKey="auth.callback.processing"]
        └── [FormActions alignment="center"]
            └── [ReturnToLoginButton target="/auth/login" visibleOn="ERROR"]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | OAuth Code không hợp lệ hoặc hết hạn | `auth.callback.error.invalid_code` | Chuyển hướng sang `/auth/login` | `AUTH_CALLBACK_INVALID_CODE` |
| `403` | Nhà cung cấp từ chối cấp quyền OAuth | `auth.callback.error.access_denied` | Hiển thị thông báo và nút đăng nhập lại | `AUTH_CALLBACK_DENIED` |
| `409` | State parameter không khớp (Chống CSRF) | `auth.callback.error.csrf_mismatch` | Hủy tiến trình, cảnh báo bảo mật | `AUTH_CALLBACK_CSRF_ERROR` |
| `422` | URL Callback thiếu tham số required `code` | `auth.callback.error.missing_params` | Hiển thị lỗi tham sốURL | `AUTH_CALLBACK_MISSING_PARAMS` |
| `429` | Thao tác đổi code quá số lần cho phép | `auth.callback.error.rate_limit` | Khóa thử lại 60s | `AUTH_CALLBACK_RATE_LIMIT` |
| `500` | Lỗi máy chủ OAuth Backend Serverpod | `auth.callback.error.server_error` | Nút thử lại sau | `AUTH_CALLBACK_SERVER_ERROR` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: OAuth provider redirects back with authorization code
  Given a Guest user redirected to "/auth/callback?code=demo_oauth_code&state=demo_state"
  When the page mounts and parses URL parameters
  Then the system transitions state to PROCESSING
  And in Demo Mode, simulates code exchange and stores demo session in `useAuthStore`
  And redirects the user to "/workspace"

Scenario: OAuth provider returns user cancellation error
  Given a Guest user redirected to "/auth/callback?error=access_denied"
  When the page parses the error query parameter
  Then the system transitions state to ERROR
  And displays error message "auth.callback.error.access_denied"
  And provides "Return to Sign In" button pointing to "/auth/login"
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`role="status"`, `aria-live="polite"` cho thông báo trạng thái xử lý).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.
