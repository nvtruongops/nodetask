# Auth Register Page Route Specification (`auth_register.md`)

> **Route Path**: `/auth/register`  
> **Route Type**: `GUEST_ONLY`  
> **Layout Shell**: `AuthLayoutShell`  
> **Specification Version**: `1.4.0`  
> **Status**: `APPROVED`  

---

## Overview
Trang Đăng ký tài khoản (`/auth/register`) quản lý luồng khởi tạo tài khoản thành viên mới. Quy trình gồm 2 bước: Gửi mã Email OTP 6 chữ số qua `AuthEndpoint.sendOtp(session, { email, type: 'REGISTER' })` và Đăng ký chính thức qua `AuthEndpoint.register(session, input)`.

---

## Route Config
- **URL Path**: `/auth/register`
- **Access Type**: `GUEST_ONLY`
- **Auth Guard**: `GuestOnlyGuard`
- **Layout Shell**: `AuthLayoutShell`

---

## Route Dependencies
- **Layout Shell**: `AuthLayoutShell`
- **Global Stores**: `useAuthStore`
- **Linked RPC Services**: `AuthEndpoint.sendOtp`, `AuthEndpoint.register` (`docs/services/auth.md`)
- **Router**: `ReactRouter`

---

## Non-Functional Requirements & Rendering Strategy
- **Rendering Strategy**: Client-Side Rendering (CSR) với 2-Step Form Wizard.

---

## Component Tree
Giao diện tuân thủ 100% **Zero-Icon Rule**:

```text
[RegisterPageContainer]
├── [SkipToContentLink] -> href="#main-content"
├── [AuthHeader]
│   └── [BrandLogo contentKey="brand.logo.text"]
├── [MainContent id="main-content" alignment="center" minHeight="80vh"]
│   ├── [RegisterFormCard maxWidth="440px" cardPadding="32px" border="default"]
│   │   ├── [FormTitle contentKey="auth.register.title"]
│   │   ├── [StepIndicator contentKey="auth.register.step_indicator"]
│   │   ├── [RegisterForm]
│   │   │   ├── [Step1: Email & Request OTP]
│   │   │   │   ├── [Label contentKey="auth.register.email_label"]
│   │   │   │   ├── [Input type="email"]
│   │   │   │   └── [SendOtpButton] -> contentKey="auth.register.send_otp_button"
│   │   │   └── [Step2: OTP Verification & Password Setup]
│   │   │       ├── [Label contentKey="auth.register.otp_label"]
│   │   │       ├── [Input type="text" maxlength=6 placeholder="123456"]
│   │   │       ├── [Label contentKey="auth.register.password_label"]
│   │   │       ├── [Input type="password"]
│   │   │       └── [RegisterSubmitButton] -> contentKey="auth.register.submit_button"
│   │   └── [FormFooterNav alignment="center" spacing="24px"]
│   │       ├── [Text contentKey="auth.register.already_account_text"]
│   │       └── [LoginLink target="/auth/login"] -> contentKey="auth.register.login_link"
└── [PublicFooter]
```

---

## Content Dictionary (i18n / CMS Ready)

```json
{
  "brand.logo.text": "NODETASK // KNOWLEDGE MANAGEMENT",
  "auth.register.title": "[CREATE ACCOUNT // NEW WORKSPACE]",
  "auth.register.step_indicator": "STEP 1 OF 2: EMAIL OTP VERIFICATION",
  "auth.register.email_label": "Email Address",
  "auth.register.send_otp_button": "[SEND 6-DIGIT OTP ->]",
  "auth.register.otp_label": "6-Digit Email OTP Code",
  "auth.register.password_label": "Choose Password (min 8 chars)",
  "auth.register.submit_button": "[COMPLETE REGISTRATION ->]",
  "auth.register.already_account_text": "Already have a nodetask account?",
  "auth.register.login_link": "[LOG IN HERE]",
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
export const registerDesignTokens = {
  color: { background: '#000000', surface: '#0A0A0A', border: { default: '#333333', focus: '#FFFFFF' } },
  spacing: { cardPadding: '32px', cardMaxWidth: '440px' },
  radius: { none: '0px' },
  motion: { duration: '200ms', properties: ['opacity', 'transform', 'border-color'] },
};
```

---

## Motion & Animation Spec
- **Properties**: `opacity`, `transform`, `border-color`. Cấm `transition: all`.

---

## State & Data Flow
- **Step 1**: Gọi `AuthEndpoint.sendOtp({ email, type: 'REGISTER' })`.
- **Step 2**: Gọi `AuthEndpoint.register({ fullName, email, otp, password, rePassword })`.
- **On Success**: Đăng ký thành công ➡️ Redirect `/auth/login`.

---

## Interactions & Event Analytics
- **Click Send OTP**: Gửi mã OTP.
- **Analytics**: `auth.register_otp_requested`, `auth.register_completed`.

---

## SEO & Social Meta Specification
- **Title Tag**: `<title>Register Account — nodetask Knowledge Engine</title>`
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
- **Email Exists**: Banner Zero-Icon `[ERROR: AUTH_EMAIL_ALREADY_EXISTS]`.

---

## Accessibility (a11y) Full Contract
- **a11y Standard**: WAI-ARIA 1.2.
- **Skip Link**: `<a href="#main-content">Skip to Content</a>`.

---

## Acceptance Criteria & Testing Scenarios (Given-When-Then)

```gherkin
Scenario: Guest User Completes Registration via OTP
  Given a guest user on "/auth/register"
  When the user inputs email and requests OTP
  And enters valid 6-digit OTP code with new password
  Then AuthEndpoint.register returns HTTP 200 Success
```

---

## Enhanced Footer Specification
- **Copyright**: `(C) 2026 nodetask. All rights reserved.`
- **System Information**: `Version 1.3.0 | MIT License | Commit: ${GIT_SHA}`
