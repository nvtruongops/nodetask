---
name: page-route-designer
description: Use when creating or editing frontend page route specification files in docs/page_routes/*.md
---

# Page Route Designer Skill

## Overview

Skill **`page-route-designer`** đóng vai trò là hướng dẫn quy chuẩn cho AI Agent khi thiết kế và khởi tạo các file đặc tả tuyến đường trang (Page Route Specifications) trong `docs/page_routes/*.md`.

---

## Single Source of Truth: Schema Contract

> [!IMPORTANT]
> **KHÔNG LẶP LẠI SCHEMA**: Nguồn dữ liệu duy nhất (Single Source of Truth) quy định danh sách các Section bắt buộc và tùy chọn được định nghĩa tại schema file:
> [`.agents/schemas/page-route-doc.yaml`](file:///e:/Code/nodetask/.agents/schemas/page-route-doc.yaml)
> 
> Skill này KHÔNG định nghĩa lại Schema, mà bổ sung các **Quy chuẩn Chất lượng (Quality Rules)**, **Tách rời Phụ thuộc (Decoupling)** và **Quy tắc Kiểm thử (Verification Loop)**.

---

## Quality Rules & Constraints

AI Agent BẮT BỘC tuân thủ 7 Quy chuẩn Chất lượng sau khi tạo hoặc chỉnh sửa bất kỳ file đặc tả nào:

1. **No Hardcoded UI Text**: 100% văn bản hiển thị giao diện phải tách rời khỏi Component Tree và tham chiếu qua `contentKey`.
2. **No CSS Framework Classes**: Không sử dụng class của bất kỳ CSS framework nào (như `grid-cols-4`, `flex-row`, `p-4`). Mô tả ý định thiết kế bằng thuộc tính trừu tượng (ví dụ: `columns: { desktop: 4, tablet: 2, mobile: 1 }`).
3. **No File Path Dependencies**: Không ghi đường dẫn source code cụ thể (như `apps/web/src/...`). Khai báo phụ thuộc ở dạng trừu tượng (`Layout: PublicLayoutShell`, `Stores: useAuthStore`).
4. **No Implementation Code**: Không viết mã nguồn React/TSX trong file đặc tả. Chỉ mô tả cấu trúc, luồng dữ liệu và hợp đồng giao tiếp.
5. **Strict Naming Convention**: Từ khóa trong `Content Dictionary` BẮT BỘC gắn tiền tố namespace theo cú pháp: `<route_name>.<section>.<element>` (Ví dụ: `landing.hero.title`, `auth.login.submit_button`).
6. **Public Route Conditional CTA Rendering**: Các trang `PUBLIC` có CTA điều hướng phải quy định rõ phân nhánh giao diện giữa người dùng vãng lai (`GUEST`) và người dùng đã đăng nhập (`USER`), tuyệt đối không dẫn link trỏ vào khu vực bảo mật (`/workspace`) cho Guest gây lỗi 401/403.
7. **Strict Canonical Policy on Error Pages**: Trang 404 và 500 không được chứa thẻ Canonical URL tự tham chiếu (Omit Canonical Tag per Google SEO Guidelines).

---

## Component Interface Contracts & Data Lineage

Mỗi đặc tả trang nên làm rõ 2 khía cạnh giao tiếp kỹ thuật:

### 1. Component Interface Contracts
Khai báo giao diện TypeScript cho các Component cốt lõi của trang:
```typescript
export interface CustomPageProps {
  id: string;
  attemptedPath?: string;
  onAction?: () => void;
}
```

### 2. Data Ownership & Content Lineage Flow
Mô tả sơ đồ luồng dữ liệu văn bản hiển thị từ CMS đến Component:
```text
[Static JSON / CMS] ──> [i18n Content Provider] ──> [useTranslation() Hook] ──> [Component (contentKey resolution)]
```

---

## Writing Style Guidelines

- **Imperative Mood & Objective Tone**: Sử dụng câu lệnh mô tả hành vi kỹ thuật khách quan.
- **Biểu đạt Chuẩn**:
  - ✅ *Good*: "Displays primary authentication CTA button"
  - ❌ *Bad*: "Beautiful and intuitive login button with smooth gradients" (Cấm sử dụng ngôn ngữ marketing/quảng bá).

---

## Anti-Patterns List (Cấm Tuyệt Đối)

```text
❌ BAD ANTI-PATTERNS:
- className="flex items-center justify-between"
- import React, { useState } from 'react'
- layout="grid grid-cols-1 md:grid-cols-4"
- path: "apps/web/src/components/Header.tsx"
- hero.title (Thiếu namespace prefix <route_name>.)
- <link rel="canonical" href="https://nodetask.io/404" /> (Cấm canonical trên trang 404)
- Guest button target="/workspace" (Cấm điều hướng Guest vào khu vực bảo mật)
```

---

## Minimal Skeleton Template

Sử dụng khung Skeleton tối giản dưới đây làm nòng cốt, không sao chép lại nội dung mẫu cứng:

```markdown
# [Title] Page Route Specification (`<route_name>.md`)

> **Route Path**: `/<path>`  
> **Route Type**: `PUBLIC` | `GUEST_ONLY` | `PROTECTED`  
> **Layout Shell**: `[LayoutName]`  
> **Specification Version**: Derived from `.agents/manifest.json`  
> **Status**: `APPROVED`  

---

## Overview
[Mô tả ngắn gọn mục đích trang và đối tượng sử dụng]

---

## Route Config
- **URL Path**: `/<path>`
- **Access Type**: `PUBLIC` | `GUEST_ONLY` | `PROTECTED`
- **Auth Guard**: `GuestOnly` | `RequireAuth` | None
- **Layout Shell**: `[LayoutName]`

---

## Route Dependencies
- **Layout Shell**: `[AbstractLayoutName]`
- **Global Stores**: `[AbstractStoreName]`
- **Providers**: `[AbstractProviderName]`
- **Router**: `[RouterInterface]`

---

## Non-Functional Requirements & Rendering Strategy
- **Rendering Strategy & HTTP Status Contract**: SSG / SSR / CSR với Client Hydration target (<100ms, CLS = 0).
- **CDN Caching Policy**: `Cache-Control` header rules.

---

## Component Tree & Interface Contracts

### Component Tree
[Mô tả cấu trúc component trừu tượng, tham chiếu contentKey, 0-icon rule, conditional Guest/User rendering]

### Component Interface Contracts
```typescript
export interface PageProps {
  id: string;
}
```

---

## Content Dictionary (i18n / CMS Ready)
```json
{
  "<route_name>.<section>.<element>": "String value"
}
```

---

## Responsive Layout & Grid Specs
- **Desktop**: `>1280px`
- **Tablet**: `768px – 1279px`
- **Mobile**: `<768px`

---

## Design Tokens System
[Khai báo tokens: themeMode: 'dark-only', color, spacing, typography, radius: 0px, motion GPU properties]

---

## Motion & Animation Spec
- **Targeted Properties**: `opacity`, `transform`, `border-color` (Cấm transition: all).

---

## State & Data Flow
[Mô tả luồng dữ liệu, Zustand store & linked RPC services]

---

## Interactions & Event Analytics
- **Comprehensive Analytics Triggers**: `<route_name>.<action>_clicked` (Kèm rich metadata: path, referrer, language).

---

## SEO & Social Meta Specification
- **Title Tag**: `<title>...</title>`
- **Robots**: `index, follow` | `noindex, follow`

---

## Performance Budget Matrix
| Performance Metric | Budget Target | Audit Tool |
| :--- | :--- | :--- |

---

## Security Headers & Policy Specification
[Khai báo CSP nonce, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy]

---

## Error & Fallback States
[Mô tả GlobalErrorBoundary wrapper, 404/500 offline, no-JS fallback]

---

## Accessibility (a11y) Full Contract
- **a11y Standard**: WAI-ARIA 1.2.
- **Landmark & Focus**: `<main id="main-content" role="main">`, focus management on mount (`tabIndex={-1}`).
- **Live Regions**: `role="status"` / `role="alert"` với `aria-live="polite"` / `"assertive"`.
- **Skip Link**: `<a href="#main-content">Skip to Content</a>`.

---

## Acceptance Criteria & Testing Scenarios (Given-When-Then)
```gherkin
Scenario: Scenario Title
  Given preconditions
  When action occurs
  Then expected outcome
```
```

---

## Self-Review Verification Checklist

Trước khi công bố hoàn thành file đặc tả, AI Agent BẮT BỘC tự duyệt lại checklist sau:

- [ ] Tất cả các section trong `.agents/schemas/page-route-doc.yaml` đều có mặt đầy đủ.
- [ ] 100% từ khóa Content Dictionary có namespace prefix `<route_name>.`.
- [ ] Không chứa bất kỳ class Tailwind, CSS framework hoặc đường dẫn source code nào.
- [ ] 0 Icon / Emoji (Tuân thủ Zero-Icon Rule).
- [ ] Motion spec không chứa `transition: all`.
- [ ] CTA trên trang Public có phân nhánh `GUEST` và `USER` rõ ràng.
- [ ] Thẻ Canonical không bị thêm nhầm vào trang 404 / 500.
- [ ] Khai báo `GlobalErrorBoundary` wrapper và a11y Focus Management / Live Region.

---

## Strict Self-Correction Verification Loop

Sau khi khởi tạo hoặc chỉnh sửa file đặc tả trang, AI Agent **BẮT BỘC** thực hiện quy trình kiểm thử tự sửa lỗi (Self-Correction Loop):

```text
[Thực thi: node .agents/scripts/verify.js --strict]
                      │
            ┌─────────┴─────────┐
         [PASS]              [FAIL]
            │                   │
            ▼                   ▼
    [Kết thúc Task]     1. Phân tích log lỗi chi tiết
                        2. Sửa trực tiếp file đặc tả
                        3. Lặp lại bước kiểm thử cho đến khi PASS
```
