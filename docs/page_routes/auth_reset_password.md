# Auth Reset Password Page Route Specification (`auth_reset_password.md`)

> **Route Path**: `/auth/reset-password`  
> **Route Type**: `GUEST_ONLY`  
> **Layout Shell**: `AuthLayoutShell`  
> **Specification Version**: `1.4.0`  
> **Status**: `APPROVED`  

---

## Overview
Trang Đặt lại Mật khẩu (`/auth/reset-password`) nhận mã Email OTP 6 chữ số và mật khẩu mới của người dùng, thực hiện gọi RPC Endpoint `AuthEndpoint.forgotPassword(session, { email, otp, newPassword })` để cập nhật mật khẩu mới.

---

## Route Config
- **URL Path**: `/auth/reset-password`
- **Access Type**: `GUEST_ONLY`
- **Auth Guard**: `GuestOnlyGuard`
- **Layout Shell**: `AuthLayoutShell`

---

## Route Dependencies
- **Layout Shell**: `AuthLayoutShell`
- **Global Stores**: `useAuthStore`
- **Linked RPC Services**: `AuthEndpoint.forgotPassword` (`docs/services/auth.md`)
- **Router**: `ReactRouter`

---

## Non-Functional Requirements & Rendering Strategy
- **Rendering Strategy**: Client-Side Rendering (CSR).

---

## Component Tree
Giao diện tuân thủ 100% **Zero-Icon Rule**:

```text
[ResetPasswordPageContainer]
├── [SkipToContentLink] -> href="#main-content"
├── [AuthHeader]
│   └── [BrandLogo contentKey="brand.logo.text"]
├── [MainContent id="main-content" alignment="center" minHeight="80vh"]
│   ├── [ResetPasswordCard maxWidth="440px" cardPadding="32px" border="default"]
│   │   ├── [FormTitle contentKey="auth.reset_password.title"]
│   │   ├── [ResetForm onSubmit=handleResetPassword]
│   │   │   ├── [Label contentKey="auth.reset_password.otp_label"]
│   │   │   ├── [Input type="text" maxlength=6 placeholder="654321"]
│   │   │   ├── [Label contentKey="auth.reset_password.new_password_label"]
│   │   │   ├── [Input type="password"]
│   │   │   └── [SubmitButton] -> contentKey="auth.reset_password.submit_button"
│   │   └── [FormFooterNav alignment="center" spacing="24px"]
│   │       └── [BackToLoginLink target="/auth/login"] -> contentKey="auth.reset_password.back_to_login"
└── [PublicFooter]
```

---

## Content Dictionary (i18n / CMS Ready)

```json
{
  "brand.logo.text": "NODETASK // KNOWLEDGE MANAGEMENT",
  "auth.reset_password.title": "[RESET PASSWORD // NEW CREDENTIALS]",
  "auth.reset_password.otp_label": "Enter 6-Digit Email OTP Code",
  "auth.reset_password.new_password_label": "New Password (min 8 chars)",
  "auth.reset_password.submit_button": "[SAVE NEW PASSWORD ->]",
  "auth.reset_password.back_to_login": "[RETURN TO LOGIN]",
  "footer.copyright": "(C) 2026 nodetask. All rights reserved.",
  "footer.build_info": "v1.3.0 | MIT License | Commit: ${GIT_SHA}"
}
```

---

## Responsive Layout & Grid Specs
- **Card Container**: `max-width: 440px`, căn giữa `margin: 0 auto`.

---

## Design Tokens System

```typescript
export const resetPasswordDesignTokens = {
  color: { background: '#000000', surface: '#0A0A0A', border: { default: '#333333' } },
  spacing: { cardPadding: '32px', cardMaxWidth: '440px' },
  radius: { none: '0px' },
  motion: { duration: '200ms', properties: ['opacity', 'transform'] },
};
```

---

## Motion & Animation Spec
- **Properties**: `opacity`, `transform`. Cấm `transition: all`.

---

## State & Data Flow
- **Reset Password**: Gọi `AuthEndpoint.forgotPassword({ email, otp, newPassword })`.
- **On Success**: Mật khẩu được lưu ➡️ Redirect `/auth/login`.

---

## Interactions & Event Analytics
- **Submit Form**: Kích hoạt đổi mật khẩu.
- **Analytics**: `auth.reset_password_completed`.

---

## SEO & Social Meta Specification
- **Title Tag**: `<title>Reset Password — nodetask Knowledge Engine</title>`
- **Robots**: `noindex, follow`

---

## Performance Budget Matrix

| Metric | Budget Target | Audit Tool |
| :--- | :--- | :--- |
| **LCP** | `< 1.2s` | Google Lighthouse |

---

## Security Headers & Policy Specification
- **CSP**: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';`
- **X-Frame-Options**: `DENY`

---

## Error & Fallback States
- **Invalid OTP**: Banner Zero-Icon `[ERROR: AUTH_INVALID_OTP]`.
- **No-JS Fallback**: `<noscript>` thông báo *"NODETASK Reset Password requires JavaScript."*

---

## Accessibility (a11y) Full Contract
- **a11y Standard**: WAI-ARIA 1.2.
- **Skip Link**: `<a href="#main-content">Skip to Content</a>`.

---

## Acceptance Criteria & Testing Scenarios (Given-When-Then)

```gherkin
Scenario: Guest User Resets Password Successfully
  Given a valid OTP code and new password
  When the user submits form on "/auth/reset-password"
  Then AuthEndpoint.forgotPassword returns HTTP 200 Success
  And user is redirected to "/auth/login"
```

---

## Enhanced Footer Specification
- **Copyright**: `(C) 2026 nodetask. All rights reserved.`
- **System Information**: `Version 1.3.0 | MIT License | Commit: ${GIT_SHA}`
