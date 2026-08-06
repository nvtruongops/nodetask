# Auth Forgot Password Page Route Specification (`auth_forgot_password.md`)

> **Route Path**: `/auth/forgot-password`  
> **Route Type**: `GUEST_ONLY`  
> **Layout Shell**: `AuthLayoutShell`  
> **Specification Version**: `1.4.0`  
> **Status**: `APPROVED`  

---

## Overview
Trang Quên mật khẩu (`/auth/forgot-password`) xử lý yêu cầu cấp lại mật khẩu khi người dùng quên thông tin đăng nhập. Luồng hoạt động gửi mã OTP xác nhận về Email qua `AuthEndpoint.sendOtp(session, { email, type: 'FORGOT_PASSWORD' })`.

---

## Route Config
- **URL Path**: `/auth/forgot-password`
- **Access Type**: `GUEST_ONLY`
- **Auth Guard**: `GuestOnlyGuard`
- **Layout Shell**: `AuthLayoutShell`

---

## Route Dependencies
- **Layout Shell**: `AuthLayoutShell`
- **Global Stores**: `useAuthStore`
- **Linked RPC Services**: `AuthEndpoint.sendOtp` (`docs/services/auth.md`)
- **Router**: `ReactRouter`

---

## Non-Functional Requirements & Rendering Strategy
- **Rendering Strategy**: Client-Side Rendering (CSR).

---

## Component Tree
Giao diện tuân thủ 100% **Zero-Icon Rule**:

```text
[ForgotPasswordPageContainer]
├── [SkipToContentLink] -> href="#main-content"
├── [AuthHeader]
│   └── [BrandLogo contentKey="brand.logo.text"]
├── [MainContent id="main-content" alignment="center" minHeight="80vh"]
│   ├── [ForgotPasswordCard maxWidth="440px" cardPadding="32px" border="default"]
│   │   ├── [FormTitle contentKey="auth.forgot_password.title"]
│   │   ├── [FormSubTitle contentKey="auth.forgot_password.subtitle"]
│   │   ├── [ForgotForm onSubmit=handleSendOtp]
│   │   │   ├── [Label contentKey="auth.forgot_password.email_label"]
│   │   │   ├── [Input type="email" placeholder="name@domain.com"]
│   │   │   └── [SubmitButton] -> contentKey="auth.forgot_password.submit_button"
│   │   └── [FormFooterNav alignment="center" spacing="24px"]
│   │       └── [BackToLoginLink target="/auth/login"] -> contentKey="auth.forgot_password.back_to_login"
└── [PublicFooter]
```

---

## Content Dictionary (i18n / CMS Ready)

```json
{
  "brand.logo.text": "NODETASK // KNOWLEDGE MANAGEMENT",
  "auth.forgot_password.title": "[FORGOT PASSWORD // ACCOUNT RECOVERY]",
  "auth.forgot_password.subtitle": "Enter your registered email to receive a password reset OTP code.",
  "auth.forgot_password.email_label": "Registered Email Address",
  "auth.forgot_password.submit_button": "[SEND RECOVERY OTP ->]",
  "auth.forgot_password.back_to_login": "[RETURN TO LOGIN]",
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
export const forgotPasswordDesignTokens = {
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
- **Request OTP**: Gọi `AuthEndpoint.sendOtp({ email, type: 'FORGOT_PASSWORD' })`.
- **On Success**: Chuyển hướng sang `/auth/reset-password?email=...`.

---

## Interactions & Event Analytics
- **Submit Form**: Kích hoạt gửi OTP khôi phục.
- **Analytics**: `auth.forgot_password_requested`.

---

## SEO & Social Meta Specification
- **Title Tag**: `<title>Forgot Password — nodetask Knowledge Engine</title>`
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
- **Email Not Found Error**: Banner Zero-Icon `[ERROR: AUTH_EMAIL_NOT_FOUND]`.
- **No-JS Fallback**: `<noscript>` thông báo *"NODETASK Forgot Password requires JavaScript."*

---

## Accessibility (a11y) Full Contract
- **a11y Standard**: WAI-ARIA 1.2.
- **Skip Link**: `<a href="#main-content">Skip to Content</a>`.

---

## Acceptance Criteria & Testing Scenarios (Given-When-Then)

```gherkin
Scenario: Guest User Requests Password Reset OTP
  Given a registered email address
  When the user submits email on "/auth/forgot-password"
  Then AuthEndpoint.sendOtp returns HTTP 200 Success
  And the system redirects to "/auth/reset-password"
```

---

## Enhanced Footer Specification
- **Copyright**: `(C) 2026 nodetask. All rights reserved.`
- **System Information**: `Version 1.3.0 | MIT License | Commit: ${GIT_SHA}`
