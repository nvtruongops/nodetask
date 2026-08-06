# Auth Verify Email Page Route Specification (`auth_verify_email.md`)

> **Route Path**: `/auth/verify-email`  
> **Route Type**: `PUBLIC` / `GUEST_ONLY`  
> **Layout Shell**: `AuthLayoutShell`  
> **Specification Version**: `1.4.0`  
> **Status**: `APPROVED`  

---

## Overview
Trang Xác minh Email OTP (`/auth/verify-email`) cung cấp màn hình riêng biệt để kiểm tra mã OTP 6 chữ số gửi qua email của người dùng. Trang hỗ trợ nút gửi lại OTP (`AuthEndpoint.sendOtp`) và đếm ngược thời gian hết hạn mã (TTL 300 giây).

---

## Route Config
- **URL Path**: `/auth/verify-email`
- **Access Type**: `PUBLIC`
- **Auth Guard**: None
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
[VerifyEmailPageContainer]
├── [SkipToContentLink] -> href="#main-content"
├── [AuthHeader]
│   └── [BrandLogo contentKey="brand.logo.text"]
├── [MainContent id="main-content" alignment="center" minHeight="80vh"]
│   ├── [VerifyCard maxWidth="440px" cardPadding="32px" border="default"]
│   │   ├── [FormTitle contentKey="auth.verify_email.title"]
│   │   ├── [SubTitle contentKey="auth.verify_email.subtitle"]
│   │   ├── [OtpInputForm]
│   │   │   ├── [Label contentKey="auth.verify_email.otp_label"]
│   │   │   ├── [Input type="text" maxlength=6 placeholder="000000"]
│   │   │   └── [VerifyButton] -> contentKey="auth.verify_email.submit_button"
│   │   ├── [ResendCountdown alignment="center" spacing="16px"]
│   │   │   └── [ResendButton disabled=countdownActive] -> contentKey="auth.verify_email.resend_button"
│   │   └── [FormFooterNav alignment="center" spacing="24px"]
│   │       └── [BackToLoginLink target="/auth/login"] -> contentKey="auth.verify_email.back_to_login"
└── [PublicFooter]
```

---

## Content Dictionary (i18n / CMS Ready)

```json
{
  "brand.logo.text": "NODETASK // KNOWLEDGE MANAGEMENT",
  "auth.verify_email.title": "[EMAIL OTP VERIFICATION]",
  "auth.verify_email.subtitle": "A 6-digit numeric verification code was sent to your email address.",
  "auth.verify_email.otp_label": "Enter 6-Digit OTP Code",
  "auth.verify_email.submit_button": "[VERIFY OTP CODE ->]",
  "auth.verify_email.resend_button": "[RESEND OTP CODE (60s)]",
  "auth.verify_email.back_to_login": "[RETURN TO LOGIN]",
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
export const verifyEmailDesignTokens = {
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
- **Resend Timer**: Đếm ngược 60 giây trước khi cho phép bấm nút `[RESEND OTP CODE]`.

---

## Interactions & Event Analytics
- **Click Resend**: Gửi lại OTP.
- **Analytics**: `auth.otp_resent`.

---

## SEO & Social Meta Specification
- **Title Tag**: `<title>Verify Email — nodetask Knowledge Engine</title>`
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
- **Expired OTP**: Banner Zero-Icon `[ERROR: AUTH_INVALID_OTP]`.
- **No-JS Fallback**: `<noscript>` thông báo *"NODETASK Verify Email requires JavaScript."*

---

## Accessibility (a11y) Full Contract
- **a11y Standard**: WAI-ARIA 1.2.
- **Skip Link**: `<a href="#main-content">Skip to Content</a>`.

---

## Acceptance Criteria & Testing Scenarios (Given-When-Then)

```gherkin
Scenario: Guest User Resends Email OTP
  Given an active 60s countdown timer
  When countdown reaches 0s
  And the user clicks "[RESEND OTP CODE]"
  Then AuthEndpoint.sendOtp is called and countdown resets to 60s
```

---

## Enhanced Footer Specification
- **Copyright**: `(C) 2026 nodetask. All rights reserved.`
- **System Information**: `Version 1.3.0 | MIT License | Commit: ${GIT_SHA}`
