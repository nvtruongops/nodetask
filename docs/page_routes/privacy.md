# Privacy Policy Page Route Specification (`privacy.md`)

> **Route Path**: `/privacy`  
> **Route Type**: `PUBLIC`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `1.4.0`  
> **Status**: `APPROVED`  

---

## Overview
Trang Chính sách Bảo mật (`/privacy`) quy định cam kết bảo vệ thông tin cá nhân, quyền sở hữu dữ liệu tri thức của người dùng cá nhân & tổ chức, cách thức mã hóa Session Token và lưu trữ trên PostgreSQL / Redis của hệ thống **`nodetask`**.

---

## Route Config
- **URL Path**: `/privacy`
- **Access Type**: `PUBLIC`
- **Auth Guard**: None (Công khai cho cả `GUEST` và `USER`)
- **Layout Shell**: `PublicLayoutShell`

---

## Route Dependencies
Danh sách các phụ thuộc kỹ thuật của Route:
- **Layout Shell**: `PublicLayoutShell`
- **Global Stores**: `useAuthStore`
- **Providers**: `ThemeProvider`, `QueryClientProvider`
- **Router**: `ReactRouter` (`createBrowserRouter` / `RouterProvider`)

---

## Non-Functional Requirements & Rendering Strategy
- **Rendering Strategy**: Static Site Generation (SSG) với Client-side Hydration.
- **CDN Caching Policy**:
  - `Cache-Control: public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000`
- **Hydration Target**: Render hoàn tất trong `<100ms`.

---

## Component Tree
Giao diện tuân thủ 100% **Zero-Icon Rule**. Cấu trúc Component hoàn toàn tách biệt khỏi chuỗi văn bản bằng cách tham chiếu `contentKey`:

```text
[PrivacyPageContainer]
├── [SkipToContentLink] -> href="#main-content"
├── [PublicHeader]
│   ├── [BrandLogo contentKey="brand.logo.text"]
│   ├── [NavLinks]
│   │   ├── [NavLink target="/"] -> contentKey="nav.landing"
│   │   ├── [NavLink target="/about"] -> contentKey="nav.about"
│   │   ├── [NavLink target="/privacy"] -> contentKey="nav.privacy"
│   │   └── [NavLink target="/terms"] -> contentKey="nav.terms"
│   └── [AuthCTA]
│       ├── [LoginButton target="/auth/login"] -> contentKey="nav.login"
│       └── [RegisterButton target="/auth/register"] -> contentKey="nav.register"
├── [MainContent id="main-content"]
│   ├── [DocumentHeader borderBottom="default" spacing="48px"]
│   │   ├── [Title contentKey="privacy.header.title"]
│   │   └── [LastUpdated contentKey="privacy.header.effective_date"]
│   └── [PolicyBody maxWidth="900px" spacing="48px" itemGap="32px"]
│       ├── [PolicySection id="collection"] -> contentKeys="privacy.section.collection.*"
│       ├── [PolicySection id="session-security"] -> contentKeys="privacy.section.session_security.*"
│       ├── [PolicySection id="data-ownership"] -> contentKeys="privacy.section.data_ownership.*"
│       └── [PolicySection id="ai-vector-privacy"] -> contentKeys="privacy.section.ai_vector_privacy.*"
└── [PublicFooter]
    ├── [Copyright contentKey="footer.copyright"]
    ├── [SystemInfo contentKey="footer.build_info"]
    └── [FooterLinks]
```

---

## Content Dictionary (i18n / CMS Ready)
Tách rời chuỗi văn bản khỏi cấu trúc Component hỗ trợ Đa ngôn ngữ (i18n), A/B Testing và CMS:

```json
{
  "brand.logo.text": "NODETASK // KNOWLEDGE MANAGEMENT",
  "nav.landing": "[Landing]",
  "nav.about": "[About]",
  "nav.privacy": "[Privacy]",
  "nav.terms": "[Terms]",
  "nav.login": "[LOG IN]",
  "nav.register": "[GET STARTED]",
  "privacy.header.title": "[PRIVACY POLICY // DATA PROTECTION STATEMENT]",
  "privacy.header.effective_date": "Effective Date: August 6, 2026",
  "privacy.section.collection.title": "1. Information Collection & Email OTP Verification",
  "privacy.section.collection.body": "We collect email addresses exclusively for authentication via numeric OTP verification codes.",
  "privacy.section.session_security.title": "2. Session Storage & Redis Token Security",
  "privacy.section.session_security.body": "Session keys are stored in encrypted Redis memory with a strict 24-hour TTL expiration.",
  "privacy.section.data_ownership.title": "3. Ownership of Personal & Organizational Documents",
  "privacy.section.data_ownership.body": "Users retain 100% intellectual property rights over all document nodes created in their workspaces.",
  "privacy.section.ai_vector_privacy.title": "4. Vector Embeddings & AI Search Data Privacy",
  "privacy.section.ai_vector_privacy.body": "PostgreSQL pgvector embeddings remain isolated per organization and are never shared with external third-party LLMs.",
  "footer.copyright": "(C) 2026 nodetask. All rights reserved.",
  "footer.build_info": "v1.3.0 | MIT License | Commit: ${GIT_SHA}"
}
```

---

## Responsive Layout & Grid Specs
- **Breakpoints**: Desktop (`>1280px`), Tablet (`768px–1279px`), Mobile (`<768px`).
- **Container Max-Width**: `max-width: 900px`, `margin: 0 auto`.

---

## Design Tokens System

```typescript
export const privacyDesignTokens = {
  color: {
    background: '#000000',
    surface: '#0A0A0A',
    text: { primary: '#FFFFFF', secondary: '#888888' },
    border: { default: '#333333', hover: '#FFFFFF' },
  },
  spacing: { sectionPadding: '60px', bodyMaxWidth: '900px' },
  typography: {
    pageHeading: { fontSize: '32px', fontWeight: '700' },
    sectionTitle: { fontSize: '24px', fontWeight: '600' },
    bodyText: { fontSize: '16px', lineHeight: '1.7' },
  },
  radius: { none: '0px' },
  motion: { duration: '200ms', easing: 'cubic-bezier(0, 0, 0.2, 1)', properties: ['opacity', 'transform'] },
};
```

---

## Motion & Animation Spec
- **Properties**: `opacity`, `transform`. Cấm `transition: all`.

---

## State & Data Flow
- **State**: Static Markdown Page.
- **Data Flow**: Pure client-side render.

---

## Interactions & Event Analytics
- **Anchor Scroll**: Click vào các mục chính sách sẽ cuộn mượt đến phần tương ứng.
- **Analytics**: `privacy.viewed`.

---

## SEO & Social Meta Specification
- **Title Tag**: `<title>Privacy Policy — nodetask Knowledge Engine</title>`
- **Meta Description**: `"Read nodetask Privacy Policy on data security, session storage, and document ownership."`
- **Keywords**: `"privacy policy, data security, nodetask, encryption"`
- **Canonical URL**: `https://nodetask.io/privacy`
- **Robots**: `index, follow`

---

## Performance Budget Matrix

| Performance Metric | Budget Target | Measurement Unit | Audit Tool |
| :--- | :--- | :--- | :--- |
| **LCP** | `< 1.2s` | Seconds | Google Lighthouse |
| **CLS** | `< 0.01` | Score index | Web Vitals |
| **TTFB** | `< 500ms` | Milliseconds | DevTools |

---

## Security Headers & Policy Specification
- **CSP**: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none';`
- **X-Frame-Options**: `DENY`
- **X-Content-Type-Options**: `nosniff`
- **Referrer-Policy**: `strict-origin-when-cross-origin`

---

## Error & Fallback States
- **No-JS Fallback**: `<noscript>` thông báo *"NODETASK requires JavaScript to run."*

---

## Accessibility (a11y) Full Contract
- **a11y Standard**: WAI-ARIA 1.2.
- **Skip Link**: `<a href="#main-content">Skip to Content</a>`.
- **State Attributes**: `aria-current="page"` trên NavLink `/privacy`.
- **Semantic HTML5**: `<main id="main-content">`, `<article>`, `<section>`.

---

## Acceptance Criteria & Testing Scenarios (Given-When-Then)

```gherkin
Scenario: Guest User Visits Privacy Policy Page
  Given a guest user
  When the user visits URL "/privacy"
  Then the heading "[PRIVACY POLICY // DATA PROTECTION STATEMENT]" is visible
  And 4 policy sections are displayed clearly
```

---

## Enhanced Footer Specification
- **Copyright**: `(C) 2026 nodetask. All rights reserved.`
- **System Information**: `Version 1.3.0 | MIT License | Commit: ${GIT_SHA}`
- **Footer Links**: `[Privacy Policy]`, `[Terms of Service]`, `[GitHub Repo]`, `[Contact]`
