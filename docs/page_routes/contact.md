# Contact Page Route Specification (`contact.md`)

> **Route Path**: `/contact`  
> **Route Type**: `PUBLIC`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `1.4.0`  
> **Status**: `APPROVED`  

---

## Overview
Trang Liên hệ (`/contact`) cung cấp các kênh thông tin hỗ trợ chính thức, địa chỉ email kỹ thuật, liên kết báo lỗi GitHub Issues, thông tin hợp tác và biểu mẫu gửi tin nhắn trực tiếp tới đội ngũ quản trị nền tảng **`nodetask`**.

---

## Route Config
- **URL Path**: `/contact`
- **Access Type**: `PUBLIC`
- **Auth Guard**: None (Công khai cho cả `GUEST` và `USER`)
- **Layout Shell**: `PublicLayoutShell`

---

## Route Dependencies
- **Layout Shell**: `PublicLayoutShell`
- **Global Stores**: `useAuthStore`
- **Providers**: `ThemeProvider`, `QueryClientProvider`
- **Router**: `ReactRouter`

---

## Non-Functional Requirements & Rendering Strategy
- **Rendering Strategy**: Static Site Generation (SSG) với Form Handling Client-side.
- **CDN Caching Policy**: `Cache-Control: public, max-age=86400, s-maxage=604800`

---

## Component Tree
Giao diện tuân thủ 100% **Zero-Icon Rule**:

```text
[ContactPageContainer]
├── [SkipToContentLink] -> href="#main-content"
├── [PublicHeader]
│   ├── [BrandLogo contentKey="brand.logo.text"]
│   └── [NavLinks]
├── [MainContent id="main-content"]
│   ├── [HeaderSection borderBottom="default" spacing="48px"]
│   │   ├── [Title contentKey="contact.header.title"]
│   │   └── [SubTitle contentKey="contact.header.subtitle"]
│   ├── [ContactGrid columns={ desktop: 2, tablet: 2, mobile: 1 } gap="48px" spacing="48px"]
│   │   ├── [ContactInfoCard] -> contentKeys="contact.info.*"
│   │   └── [ContactFormContainer]
│   │       ├── [FormInput id="name"] -> contentKey="contact.form.name_label"
│   │       ├── [FormInput id="email"] -> contentKey="contact.form.email_label"
│   │       ├── [FormTextarea id="message"] -> contentKey="contact.form.message_label"
│   │       └── [SubmitButton] -> contentKey="contact.form.submit_button"
└── [PublicFooter]
```

---

## Content Dictionary (i18n / CMS Ready)

```json
{
  "brand.logo.text": "NODETASK // KNOWLEDGE MANAGEMENT",
  "contact.header.title": "[CONTACT US // SUPPORT & FEEDBACK]",
  "contact.header.subtitle": "Get in touch with the nodetask engineering team for support, bug reports, or partnership.",
  "contact.info.email_title": "Technical Support Email",
  "contact.info.email_value": "support@nodetask.io",
  "contact.info.github_title": "Open Source & Issue Tracker",
  "contact.info.github_value": "github.com/nvtruongops/nodetask",
  "contact.form.name_label": "Your Full Name",
  "contact.form.email_label": "Email Address",
  "contact.form.message_label": "Message Detail",
  "contact.form.submit_button": "[SEND MESSAGE ->]",
  "footer.copyright": "(C) 2026 nodetask. All rights reserved.",
  "footer.build_info": "v1.3.0 | MIT License | Commit: ${GIT_SHA}"
}
```

---

## Responsive Layout & Grid Specs
- **Breakpoints**: Desktop (`>1280px`), Tablet (`768px–1279px`), Mobile (`<768px`).
- **Grid Layout**: 2 cột trên Desktop/Tablet, 1 cột trên Mobile.

---

## Design Tokens System

```typescript
export const contactDesignTokens = {
  color: { background: '#000000', surface: '#0A0A0A', text: { primary: '#FFFFFF', secondary: '#888888' }, border: { default: '#333333', hover: '#FFFFFF' } },
  spacing: { sectionPadding: '80px', cardGap: '48px' },
  typography: { pageHeading: { fontSize: '36px', fontWeight: '700' }, bodyText: { fontSize: '16px', lineHeight: '1.6' } },
  radius: { none: '0px' },
  motion: { duration: '200ms', easing: 'cubic-bezier(0, 0, 0.2, 1)', properties: ['opacity', 'transform', 'border-color'] },
};
```

---

## Motion & Animation Spec
- **Properties**: `opacity`, `transform`, `border-color`. Cấm `transition: all`.

---

## State & Data Flow
- **Form State**: Local React state với Zod validation.
- **Data Flow**: Submit form gửi thông tin phản hồi.

---

## Interactions & Event Analytics
- **Click Submit**: Kích hoạt gửi tin nhắn.
- **Analytics Triggers**: `contact.viewed`, `contact.submitted`.

---

## SEO & Social Meta Specification
- **Title Tag**: `<title>Contact Us — nodetask Knowledge Engine</title>`
- **Meta Description**: `"Contact nodetask technical support team and GitHub issue tracker."`
- **Canonical URL**: `https://nodetask.io/contact`
- **Robots**: `index, follow`

---

## Performance Budget Matrix

| Metric | Budget Target | Measurement Unit | Audit Tool |
| :--- | :--- | :--- | :--- |
| **LCP** | `< 1.5s` | Seconds | Google Lighthouse |
| **CLS** | `< 0.02` | Score index | Web Vitals |
| **TTFB** | `< 500ms` | Milliseconds | DevTools |

---

## Security Headers & Policy Specification
- **CSP**: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none';`
- **X-Frame-Options**: `DENY`
- **X-Content-Type-Options**: `nosniff`

---

## Error & Fallback States
- **Form Submit Error**: Hiển thị thông báo lỗi Zero-Icon `[ERROR: COULD NOT SEND MESSAGE]`.
- **No-JS Fallback**: `<noscript>` thông báo *"NODETASK requires JavaScript to run."*

---

## Accessibility (a11y) Full Contract
- **a11y Standard**: WAI-ARIA 1.2.
- **Skip Link**: `<a href="#main-content">Skip to Content</a>`.
- **Semantic HTML5**: `<main id="main-content">`, `<form>`, `<label>`, `<input>`.

---

## Acceptance Criteria & Testing Scenarios (Given-When-Then)

```gherkin
Scenario: Guest User Visits Contact Page
  Given a guest user
  When the user visits URL "/contact"
  Then the heading "[CONTACT US // SUPPORT & FEEDBACK]" is visible
  And the contact form and email support info are rendered
```

---

## Enhanced Footer Specification
- **Copyright**: `(C) 2026 nodetask. All rights reserved.`
- **System Information**: `Version 1.3.0 | MIT License | Commit: ${GIT_SHA}`
- **Footer Links**: `[Privacy Policy]`, `[Terms of Service]`, `[GitHub Repo]`, `[Contact]`
