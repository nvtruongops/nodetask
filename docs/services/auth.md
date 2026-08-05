# Auth & Authorization Service Specification (`auth.md`)

> **Service**: `Auth & Access Control Service`  
> **Package**: `apps/server/lib/src/endpoints/auth_endpoint.dart`  
> **Specification Version**: `1.5.0`  
> **Status**: `APPROVED`  

---

### 1. Overview
Dịch vụ Authentication & Authorization chịu trách nhiệm quản lý đăng ký tài khoản (kèm xác thực Email OTP), đăng nhập, khôi phục/quên mật khẩu (Forgot Password via Email OTP), đổi mật khẩu cá nhân trong Profile (Change Password), hủy phiên làm việc (Session Key Revocation) và Phân quyền truy cập tài nguyên (Role-Based Access Control - RBAC) trên toàn hệ thống `nodetask`.

---

### 2. Endpoints
Hợp đồng giao tiếp qua Serverpod RPC Endpoint Methods:
- `AuthEndpoint.sendOtp(Session session, SendOtpInput input)`
- `AuthEndpoint.register(Session session, UserRegisterInput input)`
- `AuthEndpoint.login(Session session, UserLoginInput input)`
- `AuthEndpoint.forgotPassword(Session session, UserForgotPasswordInput input)`
- `AuthEndpoint.changePassword(Session session, UserChangePasswordInput input)`
- `AuthEndpoint.logout(Session session)`
- `AuthEndpoint.me(Session session)`

---

### 3. Request
Cấu trúc Request DTOs:
```typescript
interface SendOtpInput {
  email: string;
  type: 'REGISTER' | 'FORGOT_PASSWORD';
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

interface UserForgotPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

interface UserChangePasswordInput {
  oldPassword: string;
  newPassword: string;
  reNewPassword: string;
}
```

---

### 4. Response
Cấu trúc Response DTOs:
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
  user: {
    id: string;
    email: string;
    fullName: string;
    systemRole: 'SYSTEM_ADMIN' | 'USER';
  };
  expiresAt: string;
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
- `type`: Required, enum `'REGISTER' | 'FORGOT_PASSWORD'`.

---

### 6. Permissions
Ma trận Phân quyền Truy cập & Tài nguyên (RBAC Matrix):

| System / Resource Role | Auth (Register / Login / Reset / ChangePass) | Xem Tài liệu Công khai (`is_public: true`) | Xem & Thao tác Tài liệu Cá nhân | Xem & Thao tác Tài liệu Tổ chức (Org) | Quản trị Hệ thống |
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
| `AUTH_FORBIDDEN` | `403` | Không đủ quyền thực hiện hành động hoặc truy cập tài nguyên tổ chức. |
| `AUTH_ACCOUNT_LOCKED` | `403` | Tài khoản đã bị tạm khóa do vi phạm điều khoản. |
| `AUTH_EMAIL_NOT_FOUND` | `404` | Email không tồn tại trong hệ thống (khi gọi Forgot Password). |
| `AUTH_EMAIL_ALREADY_EXISTS` | `409` | Địa chỉ email đã được đăng ký trước đó. |
| `AUTH_INVALID_OTP` | `400` | Mã OTP không đúng hoặc đã hết hạn (TTL 5 phút). |
| `AUTH_PASSWORD_MISMATCH` | `400` | Mật khẩu mới nhập lại (`rePassword` / `reNewPassword`) không trùng khớp. |
| `AUTH_OLD_PASSWORD_INVALID` | `400` | Mật khẩu cũ nhập vào không chính xác khi thực hiện đổi mật khẩu. |
| `AUTH_RATE_LIMITED` | `429` | Thao tác gửi OTP hoặc đăng nhập quá tần suất cho phép (Rate limit). |

---

### 8. Events
Danh sách các sự kiện xuất bản qua Serverpod Streaming Connection:
- `auth.otp_sent`: Phát khi mã OTP mới được tạo và gửi qua Email gateway.
- `auth.user_registered`: Phát khi tài khoản mới được đăng ký thành công qua OTP.
- `auth.user_logged_in`: Phát khi người dùng đăng nhập nhận Session Token.
- `auth.password_reset`: Phát khi người dùng đặt lại mật khẩu thành công (Forgot Password).
- `auth.password_changed`: Phát khi người dùng thực hiện đổi mật khẩu trong Profile.
- `auth.session_revoked`: Phát khi admin thu hồi quyền hoặc user đăng xuất.

---

### 9. Cache
Quy tắc Caching Redis:
- **OTP Verification Code Cache**: `auth:otp:{type}:{email}` -> Hashed OTP String (TTL: 300 giây / 5 phút).
- **OTP Rate Limit Cache**: `auth:rate_limit:otp:{email}` -> Count Integer (TTL: 60 giây, max 1 request/min).
- **Session Key Cache**: `auth:session:{session_key}` -> User Session Payload (TTL: 24 giờ).
- **Invalidation Rule**: Xóa Redis Key `auth:otp:{type}:{email}` ngay sau khi verify thành công. Xóa Redis Key `auth:session:{session_key}` khi `AuthEndpoint.logout()` hoặc Admin thu hồi phiên.

---

### 10. Examples
Code mẫu Request & Response:

```typescript
// 1. Send OTP Request Example (Register)
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

// 4. Forgot Password Request Example
const forgotRes = await client.auth.forgotPassword({
  email: "developer@nodetask.io",
  otp: "654321",
  newPassword: "NewSecurePassword123"
});

// 5. Change Password (In Profile) Request Example
const changePassRes = await client.auth.changePassword({
  oldPassword: "SecurePassword123",
  newPassword: "BrandNewPassword456",
  reNewPassword: "BrandNewPassword456"
});
```


