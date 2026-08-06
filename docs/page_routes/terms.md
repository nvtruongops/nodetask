# Terms of Service Page Route Specification (`terms.md`)

> **Route Path**: `/terms`  
> **Route Type**: `PUBLIC`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `1.4.0`  
> **Status**: `APPROVED`  

---

## Overview
Trang Điều khoản Sử dụng (`/terms`) xác định quy định pháp lý, quyền và nghĩa vụ của người dùng khi khởi tạo Workspace, tạo lập tài liệu tri thức, quy định sử dụng tài nguyên và giới hạn trách nhiệm hệ thống **`nodetask`**.

---

## Route Config
- **URL Path**: `/terms`
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
[TermsPageContainer]
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
│   │   ├── [Title contentKey="terms.header.title"]
│   │   └── [LastUpdated contentKey="terms.header.effective_date"]
│   └── [TermsBody maxWidth="900px" spacing="48px" itemGap="32px"]
│       ├── [TermsSection id="acceptance"] -> contentKeys="terms.section.acceptance.*"
│       ├── [TermsSection id="intellectual-property"] -> contentKeys="terms.section.intellectual_property.*"
│       ├── [TermsSection id="acceptable-use"] -> contentKeys="terms.section.acceptable_use.*"
│       └── [TermsSection id="limitation-liability"] -> contentKeys="terms.section.limitation_liability.*"
└── [PublicFooter]
    ├── [Copyright contentKey="footer.copyright"]
    ├── [SystemInfo contentKey="footer.build_info"]
    └── [FooterLinks]
```

---

## Content Dictionary (i18n / CMS Ready)
Tách rời chuỗi văn bản dạng Feature-Sliced Self-Contained trong `features/terms/content/en.json` và `vi.json` (tương thích 1:1 với Serverpod RPC `namespace: "terms"`):

```json
{
  "brand.logo.text": "NODETASK // KNOWLEDGE MANAGEMENT",
  "nav.landing": "[Landing]",
  "nav.about": "[About]",
  "nav.privacy": "[Privacy]",
  "nav.terms": "[Terms]",
  "nav.login": "[LOG IN]",
  "nav.register": "[GET STARTED]",
  "header.title": "[TERMS OF SERVICE // TERMS & CONDITIONS]",
  "header.effective_date": "Effective Date: August 6, 2026",
  "section.acceptance.title": "1. Acceptance of Terms & Account Registration",
  "section.acceptance.body": "By creating a workspace account, users agree to strictly comply with system rules and governance policies.",
  "section.intellectual_property.title": "2. User Content & Intellectual Property Rights",
  "section.intellectual_property.body": "All knowledge nodes and AST content remain the exclusive property of the creating user or organization.",
  "section.acceptable_use.title": "3. Acceptable Use Policy & System Limits",
  "section.acceptable_use.body": "Users must not misuse automated API endpoints, execute denial-of-service attacks, or bypass RBAC access matrix.",
  "section.limitation_liability.title": "4. Limitation of Liability & Service Guarantees",
  "section.limitation_liability.body": "Service is provided as-is with strict automated backup policies and open architecture guarantees.",
  "footer.copyright": "(C) 2026 nodetask. All rights reserved.",
  "footer.build_info": "v1.4.0 | MIT License | Commit: ${GIT_SHA}"
}
```

---

## Responsive Layout & Grid Specs
- **Breakpoints**: Desktop (`>1280px`), Tablet (`768px–1279px`), Mobile (`<768px`).
- **Container Max-Width**: `max-width: 900px`, `margin: 0 auto`.

---

## Design Tokens System

```typescript
export const termsDesignTokens = {
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
- **State**: Static Page.
- **Data Flow**: Pure client-side render.

---

## Interactions & Event Analytics
- **Anchor Links**: Điều hướng mượt qua các phần điều khoản.
- **Analytics**: `terms.viewed`.

---

## SEO & Social Meta Specification
- **Title Tag**: `<title>Terms of Service — nodetask Knowledge Engine</title>`
- **Meta Description**: `"Read nodetask Terms of Service and user content agreements."`
- **Keywords**: `"terms of service, nodetask, user agreement"`
- **Canonical URL**: `https://nodetask.io/terms`
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
- **State Attributes**: `aria-current="page"` trên NavLink `/terms`.
- **Semantic HTML5**: `<main id="main-content">`, `<article>`, `<section>`.

---

## Acceptance Criteria & Testing Scenarios (Given-When-Then)

```gherkin
Scenario: Guest User Visits Terms of Service Page
  Given a guest user
  When the user visits URL "/terms"
  Then the heading "[TERMS OF SERVICE // TERMS & CONDITIONS]" is visible
  And 4 terms sections are displayed clearly
```

---

## Enhanced Footer Specification
- **Copyright**: `(C) 2026 nodetask. All rights reserved.`
- **System Information**: `Version 1.3.0 | MIT License | Commit: ${GIT_SHA}`
- **Footer Links**: `[Privacy Policy]`, `[Terms of Service]`, `[GitHub Repo]`, `[Contact]`
