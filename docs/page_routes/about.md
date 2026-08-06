# About Page Route Specification (`about.md`)

> **Route Path**: `/about`  
> **Route Type**: `PUBLIC`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `1.4.0`  
> **Status**: `APPROVED`  

---

## Overview
Trang Giới thiệu (`/about`) cung cấp cái nhìn sâu sắc về tầm nhìn dự án **`nodetask`**, kiến trúc kỹ thuật Monorepo (React Frontend + Dart Serverpod Backend + PostgreSQL `ltree` & `pgvector`), và triết lý thiết kế tối giản Monochrome Zero-Icon.

---

## Route Config
- **URL Path**: `/about`
- **Access Type**: `PUBLIC`
- **Auth Guard**: None (Công khai cho cả `GUEST` và `USER`)
- **Layout Shell**: `PublicLayoutShell` (Header điều hướng tĩnh, Footer liên kết)

---

## Route Dependencies
Danh sách các phụ thuộc kỹ thuật của Route (Tách biệt khỏi cấu trúc thư mục source code):
- **Layout Shell**: `PublicLayoutShell`
- **Global Stores**: `useAuthStore`, `useThemeStore`
- **Providers**: `ThemeProvider`, `QueryClientProvider`
- **Router**: `ReactRouter`

---

## Non-Functional Requirements & Rendering Strategy
- **Rendering Strategy**: Static Site Generation (SSG) với Client-side Hydration.
- **Hydration & Loading Strategy**:
  - Tải sẵn HTML tĩnh render từ build time.
  - Hydration mismatch strategy: Text Content & State synchronization hoàn thành trong `<100ms`.
  - Placeholder & Skeleton: Render khung viền Monochrome tĩnh trước khi hydrate, không gây lệch bố cục (`CLS = 0`).
- **CDN Caching Policy**:
  - `Cache-Control: public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000`

---

## Component Tree & Interface Contracts

### Component Tree
Giao diện tuân thủ 100% **Zero-Icon Rule**. Cấu trúc Component hoàn toàn tách biệt khỏi chuỗi văn bản bằng cách tham chiếu `contentKey`:

```text
[AboutPageContainer]
├── [AboutErrorBoundary] -> Route Error Boundary Fallback
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
│   ├── [BrandLogo contentKey="about.brand.logo.text"]
│   ├── [NavLinks]
│   │   ├── [NavLink target="/"] -> contentKey="about.nav.landing"
│   │   ├── [NavLink target="/about"] -> contentKey="about.nav.about"
│   │   ├── [NavLink target="/privacy"] -> contentKey="about.nav.privacy"
│   │   └── [NavLink target="/terms"] -> contentKey="about.nav.terms"
│   ├── [MobileMenuButton contentKey="about.nav.mobile_toggle"] -> Visible on mobile (<768px)
│   └── [AuthCTA]
│       ├── [LoginButton target="/auth/login"] -> contentKey="about.nav.login"
│       └── [RegisterButton target="/auth/register"] -> contentKey="about.nav.register"
├── [MainContent id="main-content"]
│   ├── [VisionSection alignment="center" spacing="80px"]
│   │   ├── [SectionHeading contentKey="about.vision.title"]
│   │   └── [Paragraph contentKey="about.vision.desc"]
│   ├── [TechStackGrid columns={ desktop: 3, tablet: 3, mobile: 1 } gap="32px"]
│   │   ├── [StackCard id="frontend" order=1] -> contentKeys="about.stack.frontend.*"
│   │   ├── [StackCard id="backend" order=2] -> contentKeys="about.stack.backend.*"
│   │   └── [StackCard id="database" order=3] -> contentKeys="about.stack.database.*"
│   └── [GovernanceSection spacing="64px" borderTop="default"]
│       └── [Details contentKey="about.governance.desc"]
└── [PublicFooter]
    ├── [Copyright contentKey="about.footer.copyright"]
    ├── [SystemInfo contentKey="about.footer.build_info"]
    └── [FooterLinks]
        ├── [FooterLink target="/privacy"] -> contentKey="about.footer.privacy"
        ├── [FooterLink target="/terms"] -> contentKey="about.footer.terms"
        ├── [FooterLink target="https://github.com/nvtruongops/nodetask"] -> contentKey="about.footer.github"
        └── [FooterLink target="/contact"] -> contentKey="about.footer.contact"
```

### Component Interface Contracts
Định nghĩa giao diện TypeScript cho các Component cốt lõi:

```typescript
export interface StackCardProps {
  id: 'frontend' | 'backend' | 'database';
  order: number;
  titleKey: string;
  descriptionKey: string;
  onHover?: (id: string) => void;
}

export interface AboutErrorBoundaryProps {
  fallbackComponent?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
```

---

## Data Ownership & Content Lineage Flow
Luồng truyền dữ liệu văn bản giao diện (Content Lineage):

```text
[Static JSON Dictionary / CMS]
              │
              ▼
    [i18n Content Provider]
              │
              ▼
   [useTranslation() Hook]
              │
              ▼
[Component (contentKey resolution)]
```

---

## Content Dictionary (i18n / CMS Ready)
Tách rời chuỗi văn bản dạng Feature-Sliced Self-Contained trong `features/about/content/en.json` và `vi.json` (tương thích 1:1 với Serverpod RPC `namespace: "about"`):

```json
{
  "brand.logo.text": "NODETASK // KNOWLEDGE MANAGEMENT",
  "nav.landing": "[Landing]",
  "nav.about": "[About]",
  "nav.privacy": "[Privacy]",
  "nav.terms": "[Terms]",
  "nav.mobile_toggle": "[MENU]",
  "nav.login": "[LOG IN]",
  "nav.register": "[GET STARTED]",
  "vision.title": "[ABOUT NODETASK // VISION & PHILOSOPHY]",
  "vision.desc": "Built for engineers and organizations who value speed, structure, and zero visual noise.",
  "stack.frontend.title": "React & Tiptap AST Engine",
  "stack.frontend.desc": "React (Vite) + Zustand + TanStack Query + Tiptap AST Editor.",
  "stack.backend.title": "Dart Serverpod Framework",
  "stack.backend.desc": "Code-first Serverpod RPC endpoints generating client SDKs.",
  "stack.database.title": "PostgreSQL ltree & pgvector",
  "stack.database.desc": "Native PostgreSQL ltree extension for tree hierarchy and pgvector for AI RAG.",
  "governance.desc": "Governed by AI Agent Governance System v1.3.0 with strict automated rule verification.",
  "footer.copyright": "(C) 2026 nodetask. All rights reserved.",
  "footer.build_info": "v1.4.0 | Environment: production | Build: 2026-08-06T02:31Z | Commit: ${GIT_SHA}"
}
```

---

## Responsive Layout & Grid Specs

### Breakpoints Definition
- **Desktop**: `>1280px`
- **Tablet**: `768px – 1279px`
- **Mobile**: `<768px`

### Layout Behavior Rules
1. **Header Navigation**:
   - **Desktop / Tablet**: Hiển thị thanh ngang đầy đủ `[NavLinks]`.
   - **Mobile**: Thu gọn thanh nav thành nút Zero-Icon `[MENU]`.
2. **Tech Stack Grid**:
   - **Desktop (>1280px)**: 3 cột (`columns: 3`).
   - **Tablet (768px–1279px)**: 3 cột (`columns: 3`).
   - **Mobile (<768px)**: 1 cột (`columns: 1`).

---

## Design Tokens System

> **Theme System Notice**: Hệ thống giao diện tuân thủ chế độ màu **Dark Only** (Strict Monochrome System).

```typescript
export const aboutDesignTokens = {
  themeMode: 'dark-only',
  color: {
    background: '#000000',
    surface: '#0A0A0A',
    text: {
      primary: '#FFFFFF',
      secondary: '#888888',
      muted: '#666666',
    },
    border: {
      default: '#333333',
      hover: '#FFFFFF',
      focus: '#FFFFFF',
    },
  },
  spacing: {
    sectionPadding: '120px',
    cardGap: '32px',
    cardPadding: '24px',
  },
  typography: {
    sectionHeading: { fontSize: '36px', lineHeight: '1.2', fontWeight: '700' },
    cardTitle: { fontSize: '28px', lineHeight: '1.3', fontWeight: '600' },
    bodyText: { fontSize: '18px', lineHeight: '1.6', fontWeight: '400' },
  },
  radius: {
    none: '0px',
  },
  motion: {
    duration: '200ms',
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    properties: ['opacity', 'transform', 'border-color'],
  },
};
```

---

## Motion & Animation Spec
- **Targeted Transition Properties**: Chỉ áp dụng transition trên 3 thuộc tính GPU: `opacity`, `transform`, `border-color`. Nghiêm cấm `transition: all`.
- **Hover Micro-interaction**: `transform: translateY(-2px)`, `border-color: #FFFFFF`.
- **Reduced Motion Support**: Hỗ trợ `@media (prefers-reduced-motion: reduce)`.

---

## State & Data Flow
- **Zustand Store**: `useThemeStore` (Đồng bộ Theme Dark-only), `useAuthStore`.
- **Data Fetching**: Static Informational Content (No Serverpod RPC calls needed).

---

## Interactions & Event Analytics

### Interaction Triggers
- **Click Links**: Chuyển hướng sang các tuyến công khai khác (`/`, `/privacy`, `/terms`, `/contact`).
- **Card Hover**: Kích hoạt hiệu ứng hover khung viền thẻ bài.

### Comprehensive Analytics Event Contract
- `about.viewed`: Khởi chạy khi người dùng truy cập trang About.
- `about.section_view`: Fired khi từng section cuộn vào viewport (`vision`, `tech_stack`, `governance`).
- `about.scroll_depth`: Tracking độ sâu cuộn trang (`25%`, `50%`, `75%`, `100%`).
- `about.tech_card_hover`: Tracking thẻ bài được di chuột (`frontend`, `backend`, `database`).
- `about.footer_link_clicked`: Tracking liên kết chân trang được nhấn.
- `about.cta_clicked`: Tracking khi nhấn nút chuyển hướng Đăng nhập / Đăng ký.

---

## SEO & Social Meta Specification
- **Title Tag**: `<title>About Us — nodetask Knowledge Engine</title>`
- **Meta Description**: `"Learn about nodetask monorepo architecture, design philosophy, and technical stack."`
- **Keywords**: `"about nodetask, monorepo architecture, serverpod, ltree, zero-icon"`
- **Canonical URL**: `https://nodetask.io/about`
- **Robots**: `index, follow`

---

## Performance Budget Matrix

| Performance Metric | Budget Target | Measurement Unit | Audit Tool |
| :--- | :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | `< 1.5s` | Seconds | Google Lighthouse |
| **CLS (Cumulative Layout Shift)** | `< 0.05` | Score index | Web Vitals Extension |
| **TTFB (Time To First Byte)** | `< 500ms` | Milliseconds | Network Timing DevTools |
| **JS Bundle Size Target** | `< 100KB` | Gzipped bytes | Vite Rollup Visualizer |

---

## Security Headers & Policy Specification
- **Content Security Policy (CSP)**: `default-src 'self'; script-src 'self' 'nonce-${NONCE}'; style-src 'self' 'nonce-${NONCE}'; img-src 'self' data:; frame-ancestors 'none';`
- **X-Frame-Options**: `DENY`
- **X-Content-Type-Options**: `nosniff`
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: `camera=(), microphone=(), geolocation=()`

---

## Error & Fallback States
- **Route Error Boundary (`AboutErrorBoundary`)**: Bắt lỗi runtime render React component, hiển thị màn hình fallback Zero-Icon `[ERROR: ABOUT_RENDER_FAILURE]` kèm nút `[RELOAD PAGE]`.
- **Logo Fallback**: Render text `"NODETASK"`.
- **Offline Mode State**: Banner Zero-Icon `[OFFLINE MODE: VIEWING CACHED ABOUT]`.
- **No-JS Fallback**: `<noscript>` thông báo *"NODETASK requires JavaScript to run."*

---

## Accessibility (a11y) Full Contract
- **a11y Standard**: WAI-ARIA Accessible Rich Internet Applications 1.2.
- **Skip Link**: Thẻ `<a href="#main-content">Skip to Content</a>` đầu trang.
- **State Attributes**: `aria-current="page"` trên NavLink `/about`.
- **Color Contrast**: Tỷ lệ tương phản tối thiểu `7:1`.
- **Semantic HTML5**: Sử dụng `<header>`, `<main id="main-content">`, `<section>`, `<footer>`, `<nav>`.

---

## Acceptance Criteria & Testing Scenarios (Given-When-Then)

```gherkin
Scenario: Guest User Visits About Page
  Given a guest user
  When the user visits URL "/about"
  Then the heading "[ABOUT NODETASK // VISION & PHILOSOPHY]" is visible
  And 3 tech stack cards (Frontend, Backend, Database) are rendered

Scenario: Desktop Layout Grid Specification
  Given a viewport width >1280px
  When the About page renders
  Then TechStackGrid displays 3 columns horizontally

Scenario: Mobile Menu Navigation Toggle
  Given a viewport width <768px (Mobile)
  When the user taps "[MENU]"
  Then the mobile menu opens with aria-expanded set to "true"

Scenario: Offline Mode Viewing
  Given a network disconnected state
  When the user navigates to "/about"
  Then the cached page renders with banner "[OFFLINE MODE: VIEWING CACHED ABOUT]"

Scenario: No-JS Fallback Handling
  Given a browser with JavaScript disabled
  When the user visits "/about"
  Then the noscript alert "NODETASK requires JavaScript to run." is displayed

Scenario: Reduced Motion Support
  Given user preference "prefers-reduced-motion: reduce"
  When hovering over TechStackCard
  Then CSS transform transitions are disabled

Scenario: Keyboard Navigation Focus Flow
  Given a user pressing "Tab" key
  When focus enters About page
  Then focus moves first to SkipToContentLink ("#main-content")

Scenario: Screen Reader Accessibility Contract
  Given an active Screen Reader
  When navigating to "/about"
  Then main landmark is identified as id "main-content"

Scenario: SEO Meta Verification
  Given search engine crawler
  When inspecting head tags
  Then title is "About Us — nodetask Knowledge Engine" and robots is "index, follow"

Scenario: Cache Control Header Audit
  Given a GET request to "/about"
  Then response header contains "Cache-Control: public, max-age=86400"

Scenario: Analytics Event Triggering
  Given a user scrolling through About page
  When user reaches TechStack section
  Then analytics event "about.section_view" is fired with section="tech_stack"

Scenario: Hydration Synchronization
  Given static HTML rendered via SSG
  When client hydration executes
  Then React state synchronizes with DOM in under 100ms with 0 layout shift
```

---

## Enhanced Footer Specification
- **Copyright**: `(C) 2026 nodetask. All rights reserved.`
- **System Information**: `Version 1.4.0 | Environment: production | Build: 2026-08-06T02:31Z | Commit: ${GIT_SHA}`
- **Footer Links**: `[Privacy Policy]`, `[Terms of Service]`, `[GitHub Repo]`, `[Contact]`
