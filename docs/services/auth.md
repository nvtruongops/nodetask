# Auth & Authorization Service Specification (`auth.md`)

> **Service**: `Auth & Access Control Service`  
> **Package**: `apps/server/lib/src/endpoints/auth_endpoint.dart`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

### 1. Overview
Dịch vụ Authentication & Authorization chịu trách nhiệm quản lý toàn bộ vòng đời xác thực và phân quyền trong hệ thống `nodetask`. Các chức năng chính bao gồm: đăng ký tài khoản mới (kèm xác thực Email OTP), đăng nhập (email + mật khẩu hoặc OAuth Google/GitHub), làm mới token (`refreshToken`), xác minh email (`verifyEmail`), yêu cầu và xác nhận đặt lại mật khẩu (`requestPasswordReset`, `confirmPasswordReset`), đổi mật khẩu cá nhân trong Profile (`changePassword`), xác thực & chấp nhận lời mời tham gia Organization (`verifyInviteToken`, `acceptInvite`), tra cứu & khiếu nại tài khoản bị vô hiệu hóa (`getAccountDisableReason`, `submitAccountAppeal`), kiểm tra tính hợp lệ của phiên (`checkSession`), hủy phiên làm việc (`logout`) và thực thi Ma trận Phân quyền Truy cập (Role-Based Access Control - RBAC) trên toàn hệ thống.

---

### 2. Endpoints
Hợp đồng giao tiếp qua Serverpod RPC Endpoint Methods:
- `AuthEndpoint.sendOtp(Session session, SendOtpInput input)`
- `AuthEndpoint.register(Session session, UserRegisterInput input)`
- `AuthEndpoint.login(Session session, UserLoginInput input)`
- `AuthEndpoint.refreshToken(Session session, UserRefreshTokenInput input)`
- `AuthEndpoint.verifyEmail(Session session, VerifyEmailInput input)`
- `AuthEndpoint.resendVerificationCode(Session session, SendOtpInput input)`
- `AuthEndpoint.requestPasswordReset(Session session, SendOtpInput input)`
- `AuthEndpoint.confirmPasswordReset(Session session, ConfirmPasswordResetInput input)`
- `AuthEndpoint.changePassword(Session session, UserChangePasswordInput input)`
- `AuthEndpoint.verifyInviteToken(Session session, VerifyInviteTokenInput input)`
- `AuthEndpoint.acceptInvite(Session session, AcceptInviteInput input)`
- `AuthEndpoint.getAccountDisableReason(Session session, AccountDisableReasonInput input)`
- `AuthEndpoint.submitAccountAppeal(Session session, SubmitAccountAppealInput input)`
- `AuthEndpoint.exchangeOAuthCode(Session session, ExchangeOAuthCodeInput input)`
- `AuthEndpoint.checkSession(Session session)`
- `AuthEndpoint.logout(Session session)`
- `AuthEndpoint.me(Session session)`

---

### 3. Request
Cấu trúc Request DTOs (dạng `interface`):
```typescript
interface SendOtpInput {
  email: string;
  type: 'REGISTER' | 'FORGOT_PASSWORD' | 'VERIFY_EMAIL';
}

interface UserRegisterInput {
  fullName: string;
  email: string;
  otp: string;
  password: string;
  rePassword: string;
}

interface UserLoginInput {
  email: string;
  password: string;
}

interface UserRefreshTokenInput {
  refreshToken: string;
}

interface VerifyEmailInput {
  email: string;
  otp: string;
}

interface ConfirmPasswordResetInput {
  email: string;
  otp: string;
  token?: string;
  newPassword: string;
  reNewPassword: string;
}

interface UserChangePasswordInput {
  oldPassword: string;
  newPassword: string;
  reNewPassword: string;
}

interface VerifyInviteTokenInput {
  token: string;
}

interface AcceptInviteInput {
  token: string;
  registerInput?: UserRegisterInput;
}

interface AccountDisableReasonInput {
  accountId: string;
}

interface SubmitAccountAppealInput {
  accountId: string;
  reason: string;
  contactEmail: string;
}

interface ExchangeOAuthCodeInput {
  provider: 'GOOGLE' | 'GITHUB';
  code: string;
  redirectUri?: string;
}
```

---

### 4. Response
Cấu trúc Response DTOs (dạng `interface`):
```typescript
interface SendOtpResponse {
  success: boolean;
  message: string;
  expiresInSeconds: number;
}

interface ActionSuccessResponse {
  success: boolean;
  message: string;
}

interface AuthSessionResponse {
  sessionKey: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    systemRole: 'SYSTEM_ADMIN' | 'USER';
    isEmailVerified: boolean;
    isDisabled: boolean;
  };
  expiresAt: string;
}

interface InviteTokenDetailsResponse {
  valid: boolean;
  orgId: string;
  orgName: string;
  inviterName: string;
  role: 'ORG_MEMBER' | 'ORG_ADMIN';
  expiresAt: string;
}

interface AccountDisableReasonResponse {
  accountId: string;
  isDisabled: boolean;
  reasonCode: 'POLICY_VIOLATION' | 'PAYMENT_DEFAULT' | 'ADMIN_LOCK';
  reasonDescription: string;
  disabledAt: string;
}

interface CheckSessionResponse {
  isValid: boolean;
  user?: {
    id: string;
    email: string;
    fullName: string;
    systemRole: 'SYSTEM_ADMIN' | 'USER';
  };
}
```

---

### 5. Validation
Quy tắc kiểm tra dữ liệu đầu vào (Zod & Dart Trust Boundary):
- `email`: Required, `string`, valid email format, max 255 chars, trim & lowercase.
- `password`: Required, `string`, min length 8, max length 64, contains letter & number.
- `rePassword`: Required, `string`, must strictly match `password`.
- `newPassword`: Required, `string`, min length 8, max length 64, contains letter & number.
- `oldPassword`: Required, `string`, verified against stored password hash.
- `reNewPassword`: Required, `string`, must strictly match `newPassword`.
- `fullName`: Required, `string`, min length 2, max length 100, sanitized (no HTML tags).
- `otp`: Required, `string`, exactly 6 numeric digits (`/^\d{6}$/`).
- `type`: Required, enum `'REGISTER' | 'FORGOT_PASSWORD' | 'VERIFY_EMAIL'`.
- `token`: Required, `string`, min length 16, valid UUID or JWT format.
- `refreshToken`: Required, `string`, non-empty refresh token payload.
- `accountId`: Required, `string`, valid UUID v4 format.
- `reason`: Required, `string`, min length 10, max length 1000 chars.
- `provider`: Required, enum `'GOOGLE' | 'GITHUB'`.
- `code`: Required, `string`, authorization code received from OAuth Provider callback.

---

### 6. Permissions
Ma trận Phân quyền Truy cập & Tài nguyên (RBAC Matrix):

| System / Resource Role | Auth (Register / Login / Reset / Verify / OAuth) | Xem Tài liệu Công khai (`is_public: true`) | Xem & Thao tác Tài liệu Cá nhân | Xem & Thao tác Tài liệu Tổ chức (Org) | Quản trị Hệ thống |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GUEST` (Chưa đăng nhập) | ✅ (Trừ ChangePass) | ✅ (Qua Public Link) | ❌ | ❌ | ❌ |
| `USER` (Thành viên Cá nhân) | ✅ | ✅ | ✅ (Tài liệu do mình tạo) | ❌ (Trừ khi được Invite vào Org) | ❌ |
| `ORG_MEMBER` (Thành viên Org) | ✅ | ✅ | ✅ | ✅ (Theo role Org: Viewer / Editor) | ❌ |
| `ORG_ADMIN` (Quản trị Org) | ✅ | ✅ | ✅ | ✅ (Toàn bộ tài liệu & thành viên Org) | ❌ |
| `SYSTEM_ADMIN` (Quản trị Hệ thống) | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### 7. Errors
Mã lỗi chuẩn hóa trả về khi có thất bại:

| Error Code Constant | HTTP Status | Nguyên nhân |
| :--- | :--- | :--- |
| `AUTH_INVALID_CREDENTIALS` | `401` | Mật khẩu hoặc email nhập vào không chính xác khi đăng nhập. |
| `AUTH_UNAUTHORIZED` | `401` | Session token không hợp lệ hoặc đã hết hạn (TTL 24h). |
| `AUTH_REFRESH_TOKEN_EXPIRED` | `401` | Refresh token đã hết hạn hoặc không hợp lệ. |
| `AUTH_FORBIDDEN` | `403` | Không đủ quyền thực hiện hành động hoặc truy cập tài nguyên tổ chức. |
| `AUTH_ACCOUNT_LOCKED` | `403` | Tài khoản đã bị tạm khóa do vi phạm điều khoản dịch vụ (`ACCOUNT_DISABLED`). |
| `AUTH_EMAIL_NOT_FOUND` | `404` | Email không tồn tại trong hệ thống. |
| `AUTH_EMAIL_ALREADY_EXISTS` | `409` | Địa chỉ email đã được đăng ký trước đó. |
| `AUTH_INVALID_OTP` | `400` | Mã OTP không đúng hoặc đã hết hạn (TTL 5 phút). |
| `AUTH_INVALID_INVITE_TOKEN` | `400` | Token lời mời tham gia Organization bị hỏng, hết hạn hoặc không tồn tại. |
| `AUTH_PASSWORD_MISMATCH` | `400` | Mật khẩu mới nhập lại (`rePassword` / `reNewPassword`) không trùng khớp. |
| `AUTH_OLD_PASSWORD_INVALID` | `400` | Mật khẩu cũ nhập vào không chính xác khi thực hiện đổi mật khẩu. |
| `AUTH_OAUTH_EXCHANGE_FAILED` | `400` | Thất bại khi đổi OAuth Authorization Code với Google/GitHub Provider. |
| `AUTH_RATE_LIMITED` | `429` | Thao tác gửi OTP, xác thực hoặc đăng nhập quá tần suất cho phép (Rate limit). |

---

### 8. Events
Danh sách các sự kiện xuất bản qua Serverpod Streaming Connection:
- `auth.otp_sent`: Phát khi mã OTP mới được tạo và gửi qua Email gateway.
- `auth.user_registered`: Phát khi tài khoản mới được đăng ký thành công.
- `auth.user_logged_in`: Phát khi người dùng đăng nhập nhận Session Token.
- `auth.email_verified`: Phát khi tài khoản hoàn tất xác minh địa chỉ email.
- `auth.password_reset`: Phát khi người dùng đặt lại mật khẩu thành công.
- `auth.password_changed`: Phát khi người dùng thực hiện đổi mật khẩu trong Profile.
- `auth.invite_accepted`: Phát khi người dùng xác nhận tham gia Organization thành công.
- `auth.appeal_submitted`: Phát khi người dùng gửi khiếu nại tài khoản bị khóa.
- `auth.session_revoked`: Phát khi admin thu hồi quyền hoặc user đăng xuất.

---

### 9. Cache
Quy tắc Caching Redis:
- **OTP Verification Code Cache**: `auth:otp:{type}:{email}` -> Hashed OTP String (TTL: 300 giây / 5 phút).
- **OTP Rate Limit Cache**: `auth:rate_limit:otp:{email}` -> Count Integer (TTL: 60 giây, max 1 request/min).
- **Session Key Cache**: `auth:session:{session_key}` -> User Session Payload (TTL: 24 giờ).
- **Invite Token Cache**: `auth:invite:{token}` -> Invite Details Payload (TTL: 7 ngày).
- **Invalidation Rule**: Xóa Redis Key `auth:otp:{type}:{email}` ngay sau khi verify thành công. Xóa Redis Key `auth:session:{session_key}` khi `AuthEndpoint.logout()` hoặc Admin thu hồi phiên. Xóa Redis Key `auth:invite:{token}` khi lời mời được chấp nhận.

---

### 10. Examples
Code mẫu Request & Response:

```typescript
// 1. Send OTP Request Example (Register / Verify)
const otpRes = await client.auth.sendOtp({
  email: "developer@nodetask.io",
  type: "REGISTER"
});

// 2. Register Request Example
const regRes = await client.auth.register({
  fullName: "Senior Developer",
  email: "developer@nodetask.io",
  otp: "123456",
  password: "SecurePassword123",
  rePassword: "SecurePassword123"
});

// 3. Login Request Example
const loginRes = await client.auth.login({
  email: "developer@nodetask.io",
  password: "SecurePassword123"
});

// 4. Confirm Password Reset Request Example
const confirmResetRes = await client.auth.confirmPasswordReset({
  email: "developer@nodetask.io",
  otp: "654321",
  newPassword: "NewSecurePassword123",
  reNewPassword: "NewSecurePassword123"
});

// 5. Exchange OAuth Code Example
const oauthRes = await client.auth.exchangeOAuthCode({
  provider: "GOOGLE",
  code: "4/0AY0e-g7X..."
});

// 6. Verify Invite Token Example
const inviteDetails = await client.auth.verifyInviteToken({
  token: "inv_tok_987654321"
});
```
