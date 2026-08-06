<!-- Target FE Component: apps/web/src/features/auth/AcceptInvitePage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/auth/accept-invite -->

# Auth Accept Invite Page Route Specification (`auth_accept_invite.md`)

> **Route ID**: `AUTH_ACCEPT_INVITE`  
> **Route Name**: `auth.accept_invite`  
> **Route Path**: `/auth/accept-invite`  
> **Route Type**: `PUBLIC_OR_GUEST`  
> **Layout Shell**: `AuthLayoutShell`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `AUTH_ACCEPT_INVITE` (Dùng cho Analytics, Invitation Audit, Organization Onboarding, RBAC)
- **Route Name**: `auth.accept_invite`
- **Description**: Trang xử lý chấp nhận lời mời tham gia Organization hoặc Workspace (`/auth/accept-invite?token=...`). Người dùng nhấp vào liên kết lời mời trong email để xác minh mã token, xem thông tin tổ chức mời và hoàn tất tham gia. Cho phép người dùng mới tạo tài khoản đồng thời gia nhập tổ chức, hoặc người dùng đã có tài khoản xác nhận gia nhập trực tiếp.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/auth/accept-invite`
- **Access Type**: `PUBLIC_OR_GUEST`
- **Page Archetype**: `Auth & Form Focus`
- **Auth Guard**: `None` (Hỗ trợ cả Guest và Authenticated User)
- **Layout Shell**: `AuthLayoutShell`
- **Navigation Metadata**:
  - `sidebar`: `false`
  - `header`: `true`
  - `footer`: `true`
  - `breadcrumb`: `false`
  - `searchable`: `false`
  - `navOrder`: `7`
  - `navGroup`: `"auth"`

---

## 3. SEO & Social Meta Specification
- **Title Tag**: `<title>Accept Organization Invitation - nodetask</title>`
- **Meta Description**: `Chấp nhận lời mời tham gia không gian làm việc nodetask từ đồng nghiệp.`
- **Keywords**: `nodetask invite, accept invitation, organization join, team workspace`
- **Canonical URL**: `/#/auth/accept-invite`
- **OpenGraph Specification**:
  - `og:title`: `Accept Organization Invitation - nodetask`
  - `og:description`: `Tham gia không gian làm việc nodetask cùng đội ngũ của bạn.`
  - `og:image`: `/og-auth.png`
  - `og:type`: `website`
  - `og:url`: `/#/auth/accept-invite`
- **Twitter Card Specification**:
  - `twitter:card`: `summary`
  - `twitter:title`: `Accept Organization Invitation - nodetask`
  - `twitter:description`: `Join your team workspace on nodetask.`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/auth/AcceptInvitePage'))`)
- **Preload Strategy**: `none` (Tải khi truy cập trực tiếp từ liên kết email)
- **Chunk Name**: `chunk-auth-accept-invite`
- **Priority**: `HIGH`

---

## 5. Permission Matrix & RBAC
| System Role | View Access | Form Submit Rights | Redirect Policy | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Tạo tài khoản & Chấp nhận lời mời | Redirect `/workspace` sau khi tạo thành công | Khách nhận được lời mời |
| `USER` | **Allowed** | Xác nhận chấp nhận lời mời | Direct `/workspace` liên kết Org | Thành viên cá nhân |
| `ORG_MEMBER` | **Allowed** | Chấp nhận lời mời Org mới | Direct `/workspace` chuyển Org | Thành viên Org |
| `ORG_ADMIN` | **Allowed** | Chấp nhận lời mời Org mới | Direct `/workspace` | Quản trị viên Org |
| `SYSTEM_ADMIN` | **Allowed** | Chấp nhận lời mời | Direct `/admin` | Quản trị hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `AuthEndpoint.verifyInviteToken(session, token: String)`: Kiểm tra mã token lời mời có hợp lệ, chưa hết hạn và lấy thông tin Org mời.
  - `AuthEndpoint.acceptInvite(session, token: String, registerInput: RegisterInputDto?)`: Xác nhận chấp nhận lời mời và liên kết tài khoản người dùng vào Organization.
- **Data Caching & Stale Policy**:
  - `staleTime`: `0ms` (Không cache thông tin token lời mời).
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `VERIFYING_TOKEN` → `VALID_INVITE` → `ACCEPTING` → `SUCCESS` (Redirect `/workspace`) | `TOKEN_EXPIRED` (Hiển thị form xin lại token)
- **UI State Breakdown**:
  - `IDLE`: Đọc tham số `token` từ URL Query String.
  - `VERIFYING_TOKEN`: Gọi `verifyInviteToken()`, hiển thị màn hình tải `[Verifying Invitation...]`.
  - `VALID_INVITE`: Hiển thị tên Organization, tên người mời và form xác nhận.
  - `ACCEPTING`: Người dùng bấm nút `[Accept & Join Workspace]`, trạng thái `[Joining...]`.
  - `SUCCESS`: Lưu thông tin Org vào `useAuthStore` và điều hướng tới `/workspace`.
  - `TOKEN_EXPIRED`: Hiển thị thông báo token hết hạn kèm nút `[Request New Invite]`.

---

## 8. Component Inventory & Tree

### Component Inventory List
- `AuthLayoutShell`: Container giao diện Authentication.
- `InviteCard`: Card container hiển thị thông tin lời mời.
- `OrgBrandBadge`: Text label hiển thị tên Organization được mời `[Org Name]`.
- `InviterInfoText`: Text label tên người gửi lời mời (`auth.invite.from_user`).
- `AcceptSubmitButton`: Button atom gửi xác nhận tham gia `[Accept & Join Workspace]`.
- `RequestNewInviteButton`: Button gửi lại yêu cầu khi token hết hạn.

### Required Pattern Components
- `Required Pattern Components`: `AuthLayoutShell`, `InviteCard`, `OrgBrandBadge`, `AcceptSubmitButton`

### Route Anti-Patterns
- `Route Anti-Patterns`: Tuyệt đối không sử dụng icon hay emoji; không chấp nhận token giả định không đi qua Serverpod RPC validation.

### Component Tree
```text
[AcceptInvitePageContainer]
├── [SkipToContentLink target="#main-content"]
├── [AuthHeader]
│   └── [BrandLogo contentKey="brand.logo.text"]
└── [MainContent id="main-content" alignment="center"]
    └── [InviteCard maxWidth="460px"]
        ├── [InviteTitle contentKey="auth.invite.title"]
        ├── [OrgBrandBadge label="[Organization Name]"]
        ├── [InviterInfoText contentKey="auth.invite.sent_by"]
        ├── [AcceptInviteForm onSubmit=handleAccept]
        │   ├── [GuestRegisterFields visibleIf="GUEST"]
        │   └── [AcceptSubmitButton disabled=loading]
        └── [InviteFooter]
            └── [RequestNewInviteButton target="/contact" visibleOn="TOKEN_EXPIRED"]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Token lời mời hết hạn hoặc sai chữ ký | `auth.invite.error.expired_token` | Hiển thị nút yêu cầu gửi lại lời mời | `INVITE_TOKEN_EXPIRED` |
| `403` | Email đăng nhập không khớp với email được mời | `auth.invite.error.email_mismatch` | Gợi ý đăng xuất và đăng nhập đúng email | `INVITE_EMAIL_MISMATCH` |
| `409` | Người dùng đã là thành viên của Organization này | `auth.invite.error.already_member` | Trực tiếp dẫn tới `/workspace` | `INVITE_ALREADY_MEMBER` |
| `422` | Tham số token trống hoặc sai định dạng | `auth.invite.error.invalid_token` | Hiển thị thông báo token không hợp lệ | `INVITE_INVALID_TOKEN` |
| `429` | Thử chấp nhận token quá số lần cho phép | `auth.invite.error.rate_limit` | Khóa thử lại 60 giây | `INVITE_RATE_LIMIT` |
| `500` | Lỗi Backend Serverpod khi gán quyền Org | `auth.invite.error.server_error` | Nút thử lại sau | `INVITE_SERVER_ERROR` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: Guest opens valid invitation link and accepts
  Given a Guest user opening "/auth/accept-invite?token=valid_invite_token"
  When the page verifies the token with `AuthEndpoint.verifyInviteToken()`
  And the user fills password and clicks "[Accept & Join Workspace]"
  Then the system creates user account and links to Organization
  And redirects the user to "/workspace"

Scenario: User opens expired invitation link
  Given an authenticated user opening "/auth/accept-invite?token=expired_token"
  When the server returns 401 Expired Token
  Then the page displays error message "auth.invite.error.expired_token"
  And shows button "[Request New Invite]"
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`role="form"`, `aria-live="polite"` cho thông báo lỗi token).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.
