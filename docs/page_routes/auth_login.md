# Auth Login Page Route Specification (`auth_login.md`)

> **Route Path**: `/auth/login`  
> **Route Type**: `GUEST_ONLY`  
> **Layout Shell**: `AuthLayoutShell`  
> **Specification Version**: `1.4.0`  
> **Status**: `APPROVED`  

---

## Overview
Trang Đăng nhập (`/auth/login`) cung cấp giao diện đăng nhập cho thành viên cá nhân và tổ chức. Trang kết nối trực tiếp với backend Serverpod RPC Endpoint `AuthEndpoint.login(session, input)`, nhận Session Token và lưu trữ mã hóa trong Redis / Local Storage.

---

## Route Config
- **URL Path**: `/auth/login`
- **Access Type**: `GUEST_ONLY` (Nếu đã có Session Token hợp lệ, tự động redirect sang `/workspace`)
- **Auth Guard**: `GuestOnlyGuard`
- **Layout Shell**: `AuthLayoutShell`

---

## Route Dependencies
- **Layout Shell**: `AuthLayoutShell`
- **Global Stores**: `useAuthStore`
- **Linked RPC Services**: `AuthEndpoint.login` (`docs/services/auth.md`)
- **Router**: `ReactRouter`

---

## Non-Functional Requirements & Rendering Strategy
- **Rendering Strategy**: Client-Side Rendering (CSR) với Zod Form Validation.
- **Hydration Target**: Render hoàn tất trong `<100ms`.

---

## Component Tree
Giao diện tuân thủ 100% **Zero-Icon Rule**:

```text
[LoginPageContainer]
├── [SkipToContentLink] -> href="#main-content"
├── [AuthHeader]
│   └── [BrandLogo contentKey="brand.logo.text"]
├── [MainContent id="main-content" alignment="center" minHeight="80vh"]
│   ├── [LoginFormCard maxWidth="440px" cardPadding="32px" border="default"]
│   │   ├── [FormTitle contentKey="auth.login.title"]
│   │   ├── [FormSubTitle contentKey="auth.login.subtitle"]
│   │   ├── [LoginForm onSubmit=handleLogin]
│   │   │   ├── [FormGroup id="email"]
│   │   │   │   ├── [Label contentKey="auth.login.email_label"]
│   │   │   │   └── [Input type="email" placeholder="name@domain.com"]
│   │   │   ├── [FormGroup id="password"]
│   │   │   │   ├── [Label contentKey="auth.login.password_label"]
│   │   │   │   └── [Input type="password" placeholder="••••••••"]
│   │   │   ├── [FormActions alignment="space-between" margin="16px"]
│   │   │   │   └── [ForgotPasswordLink target="/auth/forgot-password"] -> contentKey="auth.login.forgot_password_link"
│   │   │   └── [SubmitButton disabled=loading] -> contentKey="auth.login.submit_button"
│   │   └── [FormFooterNav alignment="center" spacing="24px"]
│   │       ├── [Text contentKey="auth.login.no_account_text"]
│   │       └── [RegisterLink target="/auth/register"] -> contentKey="auth.login.register_link"
└── [PublicFooter]
```

---

## Content Dictionary (i18n / CMS Ready)

```json
{
  "brand.logo.text": "NODETASK // KNOWLEDGE MANAGEMENT",
  "auth.login.title": "[LOG IN // WORKSPACE ACCESS]",
  "auth.login.subtitle": "Enter your credentials to access your document workspace.",
  "auth.login.email_label": "Email Address",
  "auth.login.password_label": "Password",
  "auth.login.forgot_password_link": "[FORGOT PASSWORD?]",
  "auth.login.submit_button": "[LOG IN TO WORKSPACE ->]",
  "auth.login.no_account_text": "Don't have an account yet?",
  "auth.login.register_link": "[REGISTER NEW ACCOUNT]",
  "footer.copyright": "(C) 2026 nodetask. All rights reserved.",
  "footer.build_info": "v1.3.0 | MIT License | Commit: ${GIT_SHA}"
}
```

---

## Responsive Layout & Grid Specs
- **Card Container**: `max-width: 440px` (`max-w-md`), căn giữa `margin: 0 auto`.

---

## Design Tokens System

```typescript
export const loginDesignTokens = {
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
- **Form Validation**: Zod schema (`email`, `password`).
- **RPC Invocation**: `await client.auth.login({ email, password })`.
- **On Success**: Lưu Session Token vào Zustand `useAuthStore` ➡️ Redirect `/workspace`.
- **On Error**: Thất bại 401/403 ➡️ Hiển thị banner Zero-Icon `[ERROR: AUTH_INVALID_CREDENTIALS]`.

---

## Interactions & Event Analytics
- **Submit Form**: Kích hoạt `AuthEndpoint.login`.
- **Analytics**: `auth.login_attempted`, `auth.login_succeeded`, `auth.login_failed`.

---

## SEO & Social Meta Specification
- **Title Tag**: `<title>Log In — nodetask Knowledge Engine</title>`
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
- **Invalid Credentials Error**: Banner Zero-Icon `[ERROR: INVALID EMAIL OR PASSWORD]`.
- **No-JS Fallback**: `<noscript>` thông báo *"NODETASK Login requires JavaScript."*

---

## Accessibility (a11y) Full Contract
- **a11y Standard**: WAI-ARIA 1.2.
- **Skip Link**: `<a href="#main-content">Skip to Content</a>`.
- **Labels**: Tất cả `<input>` đều được gắn với `<label htmlFor="...">`.

---

## Acceptance Criteria & Testing Scenarios (Given-When-Then)

```gherkin
Scenario: Guest User Logs In Successfully
  Given a guest user on "/auth/login"
  When the user submits valid email and password
  Then AuthEndpoint.login returns HTTP 200 with Session Token
  And the system redirects user to "/workspace"
```

---

## Enhanced Footer Specification
- **Copyright**: `(C) 2026 nodetask. All rights reserved.`
- **System Information**: `Version 1.3.0 | MIT License | Commit: ${GIT_SHA}`
