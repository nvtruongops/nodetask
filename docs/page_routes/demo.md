# Interactive Demo Document Page Route Specification (`demo.md`)

> **Route Path**: `/demo`  
> **Route Type**: `PUBLIC`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `1.4.0`  
> **Status**: `APPROVED`  

---

## Overview
Trang Demo Tương tác (`/demo`) cung cấp môi trường trải nghiệm trực tiếp giao diện Cây tài liệu phân cấp (`ltree`), Trình soạn thảo AST Tiptap và Trợ lý AI Search RAG mà không cần đăng ký tài khoản.

---

## Route Config
- **URL Path**: `/demo`
- **Access Type**: `PUBLIC`
- **Auth Guard**: None
- **Layout Shell**: `PublicLayoutShell`

---

## Route Dependencies
- **Layout Shell**: `PublicLayoutShell`
- **Global Stores**: `useTreeStore`, `useAuthStore`
- **Components**: `DocumentTree`, `TiptapEditor`, `AISearchModal`
- **Router**: `ReactRouter`

---

## Non-Functional Requirements & Rendering Strategy
- **Rendering Strategy**: Client-Side Rendering (CSR) với Mock State.
- **CDN Caching Policy**: `Cache-Control: public, max-age=3600`

---

## Component Tree
Giao diện tuân thủ 100% **Zero-Icon Rule**:

```text
[DemoPageContainer]
├── [SkipToContentLink] -> href="#main-content"
├── [PublicHeader]
│   ├── [BrandLogo contentKey="brand.logo.text"]
│   └── [NavLinks]
├── [MainContent id="main-content" layout="split-pane"]
│   ├── [DemoSidebar width="320px" borderRight="default"]
│   │   └── [DocumentTree mockMode=true]
│   └── [DemoEditorArea fill="true"]
│       ├── [DemoHeaderBanner contentKey="demo.banner.text"]
│       └── [TiptapEditor readOnly=false]
└── [PublicFooter]
```

---

## Content Dictionary (i18n / CMS Ready)

```json
{
  "brand.logo.text": "NODETASK // KNOWLEDGE MANAGEMENT",
  "demo.banner.text": "[INTERACTIVE DEMO MODE // CHANGES ARE LOCAL ONLY]",
  "footer.copyright": "(C) 2026 nodetask. All rights reserved.",
  "footer.build_info": "v1.3.0 | MIT License | Commit: ${GIT_SHA}"
}
```

---

## Responsive Layout & Grid Specs
- **Desktop/Tablet**: Sidebar 320px + Editor Flex-1.
- **Mobile**: Toggle Sidebar Drawer qua nút `[TREE]`.

---

## Design Tokens System

```typescript
export const demoDesignTokens = {
  color: { background: '#000000', surface: '#0A0A0A', border: { default: '#333333' } },
  spacing: { sidebarWidth: '320px' },
  radius: { none: '0px' },
  motion: { duration: '200ms', properties: ['opacity', 'transform'] },
};
```

---

## Motion & Animation Spec
- **Properties**: `opacity`, `transform`. Cấm `transition: all`.

---

## State & Data Flow
- **State**: Mock Zustand Tree state (`workspace-default-1`).

---

## Interactions & Event Analytics
- **Click Node**: Chuyển nội dung Tiptap Editor.
- **Analytics**: `demo.viewed`, `demo.node_selected`.

---

## SEO & Social Meta Specification
- **Title Tag**: `<title>Interactive Demo — nodetask Knowledge Engine</title>`
- **Meta Description**: `"Try nodetask document tree editor and AI search in interactive demo mode."`
- **Canonical URL**: `https://nodetask.io/demo`

---

## Performance Budget Matrix

| Metric | Budget Target | Audit Tool |
| :--- | :--- | :--- |
| **LCP** | `< 1.8s` | Google Lighthouse |
| **CLS** | `< 0.05` | Web Vitals |

---

## Security Headers & Policy Specification
- **CSP**: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';`
- **X-Frame-Options**: `DENY`

---

## Error & Fallback States
- **No-JS Fallback**: `<noscript>` thông báo *"NODETASK Demo requires JavaScript."*

---

## Accessibility (a11y) Full Contract
- **a11y Standard**: WAI-ARIA 1.2.
- **Skip Link**: `<a href="#main-content">Skip to Content</a>`.

---

## Acceptance Criteria & Testing Scenarios (Given-When-Then)

```gherkin
Scenario: Guest User Visits Interactive Demo Page
  Given a guest user
  When the user visits URL "/demo"
  Then the DocumentTree and TiptapEditor are loaded in interactive mode
```

---

## Enhanced Footer Specification
- **Copyright**: `(C) 2026 nodetask. All rights reserved.`
- **System Information**: `Version 1.3.0 | MIT License | Commit: ${GIT_SHA}`
