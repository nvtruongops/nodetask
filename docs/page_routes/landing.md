# Landing Page Route Specification (`landing.md`)

> **Route Path**: `/`  
> **Route Type**: `PUBLIC`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `1.4.0`  
> **Status**: `APPROVED`  

---

## Overview
Trang chủ (`/`) là điểm tiếp cận đầu tiên của người dùng vãng lai (`GUEST`) tới nền tảng **`nodetask`** — Monorepo Quản lý Không gian Tài liệu & Tri thức Cá nhân / Tổ chức. Trang chủ giới thiệu các tính năng cốt lõi: Cấu trúc cây tài liệu phân cấp (`ltree`), Trình soạn thảo AST Tiptap, Giao diện tối giản Monochrome Zero-Icon, Bộ chuyển đổi Theme (Dark/Light/System) và Đa ngôn ngữ (`i18n`), cùng Trợ lý AI Tìm kiếm Ngữ nghĩa RAG (`pgvector`).

---

## Route Config
- **URL Path**: `/`
- **Access Type**: `PUBLIC` (Truy cập tự do không cần Session Token)
- **Auth Guard**: `GuestOnly` (Nếu đã đăng nhập, tự động chuyển hướng đến `/workspace`)
- **Layout Shell**: `PublicLayoutShell` (Header điều hướng tĩnh tích hợp Logo, Theme & Language Switcher, Footer liên kết)

---

## Route Dependencies
Danh sách các phụ thuộc kỹ thuật của Route (Tách biệt khỏi cấu trúc thư mục source code):
- **Layout Shell**: `PublicLayoutShell`
- **Global Stores**: `useAuthStore`, `useThemeStore`, `useLanguageStore`
- **Providers**: `ThemeProvider`, `I18nProvider`, `QueryClientProvider`
- **Router**: `ReactRouter`
- **Linked Backend Services**: `I18nEndpoint` (`getDictionary`)

---

## Non-Functional Requirements & Rendering Strategy
- **Rendering Strategy**: Static Site Generation (SSG) với Client-side Hydration. Trang Landing được tiền biên dịch thành HTML tĩnh tại thời điểm Build để đạt thời gian tải tối đa.
- **CDN Caching Policy**:
  - `Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800`
- **Hydration Target**: Đồng bộ HTML tĩnh với Zustand State (`useAuthStore`, `useThemeStore`, `useLanguageStore`) trong `<100ms`.

---

## Component Tree & Interface Contracts

### Component Tree
Giao diện tuân thủ 100% **Zero-Icon Rule** (0 icon/emoji, sử dụng khung chữ `[ ]`, `[+]`, typography phân cấp). Cấu trúc Component hoàn toàn tách biệt khỏi chuỗi văn bản bằng cách tham chiếu `contentKey` và độc lập với Framework CSS:

```text
[LandingPageContainer]
├── [LandingErrorBoundary] -> Route Error Boundary Fallback
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
│   ├── [BrandLogoLink target="/"]
│   │   └── [BrandLogo contentKey="landing.brand.logo.text" fallback="NODETASK"]
│   ├── [NavLinks]
│   │   ├── [NavLink target="/"] -> contentKey="landing.nav.landing"
│   │   ├── [NavLink target="/about"] -> contentKey="landing.nav.about"
│   │   ├── [NavLink target="/privacy"] -> contentKey="landing.nav.privacy"
│   │   └── [NavLink target="/terms"] -> contentKey="landing.nav.terms"
│   ├── [HeaderControls]
│   │   ├── [ThemeSwitcherButton] -> toggles useThemeStore (dark/light/system) -> contentKey="landing.nav.theme_toggle"
│   │   └── [LanguageSwitcherMenu] -> toggles useLanguageStore (en/vi) -> contentKey="landing.nav.language_switcher"
│   ├── [MobileMenuButton contentKey="landing.nav.mobile_toggle"] -> Visible on mobile (<768px)
│   └── [AuthCTA]
│       ├── [LoginButton target="/auth/login"] -> contentKey="landing.nav.login"
│       └── [RegisterButton target="/auth/register"] -> contentKey="landing.nav.register"
├── [MainContent id="main-content"]
│   ├── [HeroSection alignment="center" minHeight="80vh" paddingTop="80px"]
│   │   ├── [Badge contentKey="landing.hero.badge"]
│   │   ├── [MainHeading contentKey="landing.hero.heading" maxWidth="800px" wrap="balance"]
│   │   ├── [SubHeading contentKey="landing.hero.subheading" maxWidth="600px"]
│   │   └── [HeroCTAButtons]
│   │       ├── [PrimaryButton target="/auth/register"] -> contentKey="landing.hero.cta.primary"
│   │       └── [SecondaryButton target="/demo"] -> contentKey="landing.hero.cta.secondary"
│   ├── [FeatureMatrixGrid columns={ desktop: 4, tablet: 2, mobile: 1 } gap="32px"]
│   │   ├── [FeatureCard id="tree-engine" order=1] -> contentKeys="landing.feature.tree_engine.*"
│   │   ├── [FeatureCard id="ast-editor" order=2] -> contentKeys="landing.feature.ast_editor.*"
│   │   ├── [FeatureCard id="zero-icon-ui" order=3] -> contentKeys="landing.feature.zero_icon_ui.*"
│   │   └── [FeatureCard id="ai-rag" order=4] -> contentKeys="landing.feature.ai_rag.*"
│   └── [ComparisonSection]
│       └── [ComparisonTable]
└── [PublicFooter]
    ├── [FooterBrand]
    │   ├── [BrandLogo contentKey="landing.brand.logo.text" fallback="NODETASK"]
    │   └── [Copyright contentKey="landing.footer.copyright"]
    ├── [FooterControls]
    │   ├── [ThemeSwitcherButton] -> contentKey="landing.nav.theme_toggle"
    │   └── [LanguageSwitcherMenu] -> contentKey="landing.nav.language_switcher"
    ├── [SystemInfo contentKey="landing.footer.build_info"]
    └── [FooterLinks]
        ├── [FooterLink target="/privacy"] -> contentKey="landing.footer.privacy"
        ├── [FooterLink target="/terms"] -> contentKey="landing.footer.terms"
        ├── [FooterLink target="https://github.com/nvtruongops/nodetask"] -> contentKey="landing.footer.github"
        └── [FooterLink target="/contact"] -> contentKey="landing.footer.contact"
```

### Component Interface Contracts
Định nghĩa giao diện TypeScript cho các Component cốt lõi của trang Landing:

```typescript
export interface BrandLogoProps {
  textKey: string;
  ariaLabelKey: string;
  fallbackText: string;
  targetPath?: string;
  compactOnMobile?: boolean;
}

export interface ThemeSwitcherProps {
  currentTheme: 'dark' | 'light' | 'system';
  onThemeChange: (newTheme: 'dark' | 'light' | 'system') => void;
  ariaLabelKey: string;
}

export interface LanguageSwitcherProps {
  currentLocale: string;
  supportedLocales: Array<{ code: string; labelKey: string }>;
  onLocaleChange: (newLocale: string) => Promise<void>;
  ariaLabelKey: string;
}

export interface LandingErrorBoundaryProps {
  fallbackComponent?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
```

---

## Data Ownership & Content Lineage Flow
Luồng truyền dữ liệu từ dịch vụ i18n Backend tới Component UI trang Landing:

```text
[Backend Serverpod I18nEndpoint]
              │
              ▼
    [IndexedDB / Redis Cache]
              │
              ▼
    [useLanguageStore / I18nProvider]
              │
              ▼
   [useTranslation() Hook]
              │
              ▼
[Landing Components (contentKey resolution)]
```

---

## Content Dictionary (i18n / CMS Ready)
Tách rời chuỗi văn bản dạng Feature-Sliced Self-Contained trong `features/landing/content/en.json` và `vi.json` (tương thích 1:1 với Serverpod RPC `namespace: "landing"`):

```json
{
  "brand.logo.text": "NODETASK // KNOWLEDGE MANAGEMENT",
  "brand.logo.aria": "nodetask homepage",
  "nav.landing": "[Landing]",
  "nav.about": "[About]",
  "nav.privacy": "[Privacy]",
  "nav.terms": "[Terms]",
  "nav.theme_toggle": "[THEME: {mode}]",
  "nav.theme_toggle_aria": "Toggle color theme between dark, light and system mode",
  "nav.theme_dark": "[DARK]",
  "nav.theme_light": "[LIGHT]",
  "nav.theme_system": "[SYS]",
  "nav.language_switcher": "[LANG: {locale}]",
  "nav.language_switcher_aria": "Select interface language",
  "nav.language.en": "[EN]",
  "nav.language.vi": "[VI]",
  "nav.mobile_toggle": "[MENU]",
  "nav.login": "[LOG IN]",
  "nav.register": "[GET STARTED]",
  "hero.badge": "[MONOREPO ARCHITECTURE // POSTGRES LTREE + PGVECTOR]",
  "hero.heading": "HIERARCHICAL KNOWLEDGE & DOCUMENT ENGINE",
  "hero.subheading": "Notion-Like AST Editor with Zero-Icon Monochrome UI",
  "hero.cta.primary": "[CREATE FREE WORKSPACE ->]",
  "hero.cta.secondary": "[EXPLORE DEMO DOCUMENT]",
  "feature.matrix_title": "[ CORE SYSTEM ARCHITECTURE MATRIX ]",
  "feature.tree_engine.title": "Hierarchical Tree Engine",
  "feature.tree_engine.desc": "Unlimited depth document tree using PostgreSQL ltree extension.",
  "feature.ast_editor.title": "Notion-Like AST Editor",
  "feature.ast_editor.desc": "Tiptap block-based rich text editor saved as clean JSON AST.",
  "feature.zero_icon_ui.title": "Zero-Icon Monochrome UI",
  "feature.zero_icon_ui.desc": "Strict minimalist design with 0 icon dependencies and text brackets.",
  "feature.ai_rag.title": "Native AI RAG Assistant",
  "feature.ai_rag.desc": "PostgreSQL pgvector semantic search with HNSW index.",
  "comparison.title": "[ TECHNICAL SPECIFICATION COMPARISON ]",
  "comparison.col.dimension": "Technical Feature Dimension",
  "comparison.col.generic": "Generic Note Apps",
  "comparison.col.nodetask": "nodetask Knowledge Engine",
  "footer.copyright": "(C) 2026 nodetask. All rights reserved.",
  "footer.build_info": "v1.4.0 | MIT License | Commit: ${GIT_SHA}"
}
```

---

## Responsive Layout & Grid Specs

### Breakpoints Definition
- **Desktop**: `>1280px`
- **Tablet**: `768px – 1279px`
- **Mobile**: `<768px`

### Layout Behavior Rules
1. **Header Navigation & Controls**:
   - **Desktop / Tablet**: Hiển thị đầy đủ `[BrandLogoLink]`, `[NavLinks]`, `[HeaderControls]` (`[ThemeSwitcherButton]` + `[LanguageSwitcherMenu]`) và `[AuthCTA]`.
   - **Mobile (<768px)**: Logo hiển thị dạng rút gọn typography `[NODETASK]`. Nút `[HeaderControls]` và `[NavLinks]` thu gọn vào drawer Zero-Icon qua nút `[MENU]` (`contentKey: "landing.nav.mobile_toggle"`).
2. **Hero Section Container**:
   - **Layout**: `display: flex`, `flex-direction: column`, `min-height: 80vh`, `align-items: center`, `justify-content: center`, `padding-top: 80px`.
   - **Width Limit**: `max-width: 800px`, Căn giữa `margin: 0 auto`.
   - **Typography Wrapping**: `text-wrap: balance`.
3. **Feature Matrix Grid**:
   - **Desktop (>1280px)**: 4 cột (`columns: 4`).
   - **Tablet (768px–1279px)**: 2 cột (`columns: 2`).
   - **Mobile (<768px)**: 1 cột (`columns: 1`).

---

## Design Tokens System

Hệ thống Design Tokens hỗ trợ chuyển đổi linh hoạt giữa các chế độ **Dark Theme**, **Light Theme** và **System Preference**:

```typescript
export const landingDesignTokens = {
  themeMode: 'dynamic', // 'dark' | 'light' | 'system'
  darkTheme: {
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
  },
  lightTheme: {
    color: {
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: {
        primary: '#000000',
        secondary: '#666666',
        muted: '#888888',
      },
      border: {
        default: '#E5E7EB',
        hover: '#000000',
        focus: '#000000',
      },
    },
  },
  spacing: {
    heroMinHeight: '80vh',
    heroMaxWidth: '800px',
    sectionPadding: '120px',
    cardGap: '32px',
    cardPadding: '24px',
  },
  typography: {
    heroHeading: { fontSize: '72px', lineHeight: '1.1', fontWeight: '800', fontFamily: 'monospace' },
    sectionHeading: { fontSize: '36px', lineHeight: '1.2', fontWeight: '700' },
    cardTitle: { fontSize: '28px', lineHeight: '1.3', fontWeight: '600' },
    bodyText: { fontSize: '18px', lineHeight: '1.6', fontWeight: '400' },
    caption: { fontSize: '14px', lineHeight: '1.4', fontFamily: 'monospace', textTransform: 'uppercase' },
  },
  radius: {
    none: '0px',
  },
  motion: {
    duration: '200ms',
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    properties: ['opacity', 'transform', 'border-color', 'background-color', 'color'],
  },
};
```

---

## Motion & Animation Spec
- **Targeted Transition Properties**: Chỉ áp dụng transition trên các thuộc tính GPU & Theme switching: `opacity`, `transform`, `border-color`, `background-color`, `color`. Nghiêm cấm `transition: all`.
- **Transition Contract**: `transition: opacity 200ms ease-out, transform 200ms ease-out, border-color 200ms ease-out, background-color 200ms ease-out`
- **Hover Micro-interaction**: `transform: translateY(-2px)`, `border-color: currentColor`.
- **Reduced Motion Support**: Tự động tắt mọi hiệu ứng chuyển động khi người dùng bật `prefers-reduced-motion: reduce`.

---

## Feature & Comparison Matrix Table (Objective Technical Standard)

| Technical Feature Dimension | Generic Notes / E-Learning Apps | `nodetask` Knowledge Engine |
| :--- | :--- | :--- |
| **Data Hierarchy Model** | Tag-based or 2-level folder trees | Unlimited depth PostgreSQL `ltree` tree (`Workspace -> Folder -> Document -> Section`) |
| **Document Content Format** | HTML strings or plain Markdown | Clean JSON AST (Tiptap Engine, Notion-like block AST) |
| **UI Aesthetics & Assets** | Third-party icon libraries (`lucide`, `react-icons`) | Strict Zero-Icon Monochrome System (0 icon packages, 100% typography) |
| **Theme & i18n Architecture** | Hardcoded client strings & single theme | Dynamic Serverpod i18n Endpoint with ETag IndexedDB cache & Dark/Light/System switch |
| **Vector Search Architecture** | External Vector DB SaaS (e.g., Pinecone / Weaviate) | Native PostgreSQL `pgvector` HNSW index (Embedded in primary Postgres instance) |
| **State Synchronization** | Server-side blocking RPC updates | Optimistic local update with Concurrency Control (OCC) |

---

## State & Data Flow

### Global Stores Integration
- **`useAuthStore`**: Kiểm tra trạng thái Session Token của người dùng (GuestOnly protection & automatic redirect to `/workspace`).
- **`useThemeStore`**:
  - Quản lý trạng thái Theme hiện tại (`dark`, `light`, `system`).
  - Tự động lưu giá trị lựa chọn vào `localStorage` key `nodetask_theme`.
  - Đồng bộ CSS class `.dark` hoặc `.light` lên thẻ HTML root (`document.documentElement`).
  - Tự động lắng nghe sự kiện `matchMedia('(prefers-color-scheme: dark)')` khi ở chế độ `system`.
- **`useLanguageStore`**:
  - Quản lý mã ngôn ngữ hiện tại (mặc định: `en` hoặc `vi`).
  - Lưu mã ngôn ngữ vào `localStorage` key `nodetask_locale`.
  - Gọi RPC `I18nEndpoint.getDictionary({ locale, namespace: 'landing' })` kèm ETag validation (`ifNoneMatchETag`).
  - Đồng bộ và cập nhật IndexedDB browser cache (`nodetask_i18n_db`).

---

## Interactions & Event Analytics

### Interaction Triggers
- **Click `[BrandLogoLink]`**: Chuyển hướng sang `/` (cuộn mượt lên đầu trang nếu đang ở Landing Page).
- **Click `[ThemeSwitcherButton]`**: Thay đổi chế độ Theme theo vòng lặp `dark` ➡️ `light` ➡️ `system` ➡️ `dark`.
- **Click `[LanguageSwitcherMenu]`**: Thay đổi mã ngôn ngữ giữa `en` và `vi`, tải từ điển i18n tương ứng.
- **Click `[LOG IN]`**: Chuyển hướng sang Route `/auth/login`.
- **Click `[GET STARTED]` / `[CREATE FREE WORKSPACE]`**: Chuyển hướng sang Route `/auth/register`.
- **Click `[EXPLORE DEMO DOCUMENT]`**: Chuyển hướng sang Route `/demo`.
- **Click NavLinks**: Chuyển hướng mượt sang `/about`, `/privacy`, `/terms`.

### Analytics Event Tracking Contract
- `landing.viewed`: Khởi chạy khi người dùng truy cập trang chủ.
- `landing.logo_clicked`: Tracking khi nhấn vào Logo thương hiệu `[NODETASK]`.
- `landing.theme_toggled`: Tracking khi đổi Theme với metadata `{ previousMode, newMode }`.
- `landing.language_changed`: Tracking khi đổi Ngôn ngữ với metadata `{ previousLocale, newLocale }`.
- `landing.hero_cta_clicked`: Tracking khi nhấn `[CREATE FREE WORKSPACE ->]`.
- `landing.login_clicked`: Tracking khi nhấn `[LOG IN]`.
- `landing.register_clicked`: Tracking khi nhấn `[GET STARTED]`.
- `landing.demo_clicked`: Tracking khi nhấn `[EXPLORE DEMO DOCUMENT]`.

---

## SEO & Social Meta Specification
- **Title Tag**: `<title>nodetask — Hierarchical Knowledge & Document Engine</title>`
- **Meta Description**: `"High-performance hierarchical document tree and knowledge management engine built with React, Serverpod, and PostgreSQL pgvector."`
- **Keywords**: `"knowledge base, document tree, ltree, tiptap ast, zero-icon ui, serverpod, pgvector, theme switcher, i18n"`
- **Canonical URL**: `https://nodetask.io/`
- **OpenGraph Tags**:
  - `og:title`: `"nodetask — Hierarchical Knowledge & Document Engine"`
  - `og:description`: `"Notion-like AST Editor with Zero-Icon Monochrome UI & Native AI RAG Search."`
  - `og:type`: `"website"`
  - `og:url`: `"https://nodetask.io/"`
  - `og:image`: `"https://nodetask.io/og-landing.png"`
- **Twitter Card**: `summary_large_image`
- **Robots**: `index, follow`

---

## Performance Budget Matrix

| Performance Metric | Budget Target | Measurement Unit | Audit Tool |
| :--- | :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | `< 2.0s` | Seconds | Google Lighthouse / Core Web Vitals |
| **CLS (Cumulative Layout Shift)** | `< 0.1` | Score index | Web Vitals Extension |
| **TTFB (Time To First Byte)** | `< 500ms` | Milliseconds | Network Timing DevTools |
| **Theme Toggle Response Time** | `< 16ms` | Milliseconds (60fps) | Chrome Performance Profiler |
| **i18n Dictionary Switch Time** | `< 50ms` | Milliseconds (IndexedDB cache) | Chrome DevTools Network |
| **JS Bundle Size Target** | `< 150KB` | Gzipped bytes | Vite Rollup Visualizer |

---

## Security Headers & Policy Specification
- **Content Security Policy (CSP)**: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none';`
- **X-Frame-Options**: `DENY`
- **X-Content-Type-Options**: `nosniff`
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: `camera=(), microphone=(), geolocation=(), payment=()`
- **External Links**: Bắt buộc thuộc tính `rel="noopener noreferrer" target="_blank"`.
- **Inline Scripts**: Nghiêm cấm Inline Scripts (`<script>` inline bị chặn bởi CSP).

---

## Error & Fallback States
- **Route Error Boundary (`LandingErrorBoundary`)**: Bắt lỗi runtime render React component, hiển thị màn hình fallback Zero-Icon `[ERROR: LANDING_RENDER_FAILURE]` kèm nút `[RELOAD PAGE]`.
- **Logo Fallback**: Render typography text thuần `"NODETASK"`.
- **Theme Fallback**: Mặc định chế độ `dark` nếu không thể đọc `localStorage` hoặc hệ thống không hỗ trợ `prefers-color-scheme`.
- **Language / Dictionary Fallback**: Mặc định sử dụng từ điển ngôn ngữ Tiếng Anh (`en`) nếu tải từ điển `vi` thất bại hoặc thiếu key bản dịch (tuân theo quy chuẩn Fallback Contract trong `i18n.md`).
- **404 / Route Fallback**: Chuyển hướng về `/` nếu đường dẫn phụ không tồn tại.
- **Offline Mode State**: Hiển thị banner Zero-Icon `[OFFLINE MODE: VIEWING CACHED LANDING]`.
- **No-JS Fallback**: `<noscript>` thông báo *"NODETASK requires JavaScript to run."*

---

## Accessibility (a11y) Full Contract
- **a11y Standard**: WAI-ARIA Accessible Rich Internet Applications 1.2.
- **Skip Link**: Thẻ Skip to Content đầu trang (`href="#main-content"`, tự động ẩn và chỉ hiển thị khi nhận focus bàn phím).
- **Brand Logo Link**: Thẻ `<a href="/" aria-label="nodetask homepage">` bọc typography logo.
- **Theme Switcher Control**: Thẻ `<button role="button" aria-label="Toggle color theme between dark, light and system mode">` với trạng thái `aria-press`.
- **Language Switcher Control**: Thẻ `<button role="listbox" aria-label="Select interface language" aria-expanded="false">` điều khiển menu lựa chọn ngôn ngữ.
- **State Attributes**:
  - `aria-current="page"` trên NavLink của trang hiện tại.
  - `aria-expanded="true/false"` trên nút `[MENU]` Mobile và Language Switcher.
- **Reduced Motion**: Tuân thủ `@media (prefers-reduced-motion: reduce)`.
- **Color Contrast**: Tỷ lệ tương phản tối thiểu `7:1` (Monochrome Contrast Standard cho cả Dark và Light Mode).
- **Focus Indicators**: Khung nét đứt rõ ràng `outline: 2px solid currentColor` khi focus bằng bàn phím.
- **Semantic HTML5**: Sử dụng `<header>`, `<main id="main-content">`, `<section>`, `<footer>`, `<nav>`.

---

## Acceptance Criteria & Testing Scenarios (Given-When-Then)

```gherkin
Scenario: Guest User Visits Landing Page
  Given a guest user with no session token
  When the user visits URL "/"
  Then the Hero Heading "HIERARCHICAL KNOWLEDGE & DOCUMENT ENGINE" is visible
  And LCP is measured under 2.0s
  And Header displays Brand Logo, Theme Switcher, Language Switcher, "[LOG IN]" and "[GET STARTED]" buttons

Scenario: Logged-in User Visits Landing Page (Auth Guard)
  Given an authenticated user with valid Session Token
  When the user visits URL "/"
  Then the system automatically redirects user to "/workspace"

Scenario: Theme Switcher Micro-interaction
  Given a user on "/" in Dark Theme mode
  When the user clicks Theme Switcher button "[THEME: DARK]"
  Then the theme mode switches to Light Theme
  And the store updates localStorage "nodetask_theme" to "light"
  And document.documentElement receives class "light"
  And analytics event "landing.theme_toggled" is fired with previousMode="dark" and newMode="light"

Scenario: Language Switcher Locale Update
  Given a user on "/" with English locale "[EN]"
  When the user selects Vietnamese locale "[VI]"
  Then useLanguageStore triggers I18nEndpoint.getDictionary for locale "vi"
  And UI content keys re-render with Vietnamese dictionary translations
  And analytics event "landing.language_changed" is fired with previousLocale="en" and newLocale="vi"

Scenario: Brand Logo Keyboard Focus & Navigation
  Given a keyboard-only user on "/"
  When the user tabs to BrandLogoLink "[NODETASK]"
  Then screen reader reads aria-label "nodetask homepage"
  And pressing "Enter" scrolls page smooth to top

Scenario: Mobile View Header Toggle
  Given a viewport width of 375px (Mobile)
  When the landing page loads
  Then horizontal NavLinks are hidden
  And compact Brand Logo "[NODETASK]" is visible
  And Zero-Icon "[MENU]" button is visible
  And clicking "[MENU]" sets aria-expanded to "true"

Scenario: Keyboard Focus & Skip Link Navigation
  Given a keyboard-only user on "/"
  When the user presses "Tab"
  Then focus moves first to SkipToContentLink ("#main-content")
  And pressing "Enter" scrolls view directly to MainContent container

Scenario: Analytics Event Firing on CTA Click
  Given a user on "/"
  When the user clicks "[CREATE FREE WORKSPACE ->]"
  Then analytics event "landing.hero_cta_clicked" is fired with timestamp
```

---

## Enhanced Footer Specification
- **Footer Brand**: Logo `[NODETASK]` + Copyright `(C) 2026 nodetask. All rights reserved.`
- **Footer Controls**: Backup `[ThemeSwitcherButton]` + `[LanguageSwitcherMenu]` cho trải nghiệm cuộn ở cuối trang.
- **System Information**: `Version 1.4.0 | MIT License | Commit: ${GIT_SHA}`
- **Footer Links**: `[Privacy Policy]`, `[Terms of Service]`, `[GitHub Repo]`, `[Contact]`

