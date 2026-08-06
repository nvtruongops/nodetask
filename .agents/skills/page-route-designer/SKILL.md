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
5. **Feature-Sliced i18n Naming Convention**: Từ khóa từ điển được tổ chức dạng Tự chứa (Self-contained Feature Slice) trong `features/<feature>/content/en.json` và `vi.json`. Do namespace đã được gói gọn theo thư mục Feature, các key trong JSON sử dụng cấu trúc sạch `<section>.<element>` (Ví dụ: `hero.title`, `cta.primary`), tương thích 1:1 với Serverpod RPC `I18nEndpoint.getDictionary(locale, namespace)`.
6. **Public Route Conditional CTA Rendering**: Các trang `PUBLIC` có CTA điều hướng phải quy định rõ phân nhánh giao diện giữa người dùng vãng lai (`GUEST`) và người dùng đã đăng nhập (`USER`), tuyệt đối không dẫn link trỏ vào khu vực bảo mật (`/workspace`) cho Guest gây lỗi 401/403.
7. **Strict Canonical Policy on Error Pages**: Trang 404 và 500 không được chứa thẻ Canonical URL tự tham chiếu (Omit Canonical Tag per Google SEO Guidelines).
8. **No Mock Data & Strict System Roles**: Tuyệt đối không dùng Mock Data, mảng dữ liệu giả hay tự định nghĩa Role ngoài chuẩn. 100% Data Types và System/RBAC Roles (`GUEST`, `USER`, `ORG_MEMBER`, `ORG_ADMIN`, `SYSTEM_ADMIN`) phải tham chiếu trực tiếp từ `docs/services/*.md`.

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
Mô tả sơ đồ luồng dữ liệu văn bản hiển thị từ Backend Serverpod i18n Endpoint đến Feature Component:
```text
[Serverpod I18nEndpoint / Feature JSON] ──> [useLanguageStore / IndexedDB] ──> [getLandingContent(key, locale)] ──> [Feature Component]
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
- Hardcoding direct text strings inside JSX components without content keys
- <link rel="canonical" href="https://nodetask.io/404" /> (Cấm canonical trên trang 404)
- Guest button target="/workspace" (Cấm điều hướng Guest vào khu vực bảo mật)
- const mockData = [...] / role="STUDENT" (Cấm dùng Mock Data hoặc Role tự chế không có trong auth.md)
```

---

## Minimal Skeleton Template

Sử dụng khung Skeleton 10 Điểm Nâng Cấp dưới đây làm nòng cốt cho tất cả các file đặc tả:

```markdown
# [Title] Page Route Specification (`<route_name>.md`)

> **Route ID**: `ROUTE_ID_ENUM`  
> **Route Path**: `/<path>`  
> **Route Type**: `PUBLIC` | `GUEST_ONLY` | `PROTECTED`  
> **Layout Shell**: `[LayoutName]`  
> **Specification Version**: Derived from `.agents/manifest.json`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `ROUTE_ID_ENUM` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `<route_name>`
- **Description**: [Mô tả mục đích trang và đối tượng sử dụng]

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/<path>`
- **Access Type**: `PUBLIC` | `GUEST_ONLY` | `PROTECTED`
- **Auth Guard**: `GuestOnly` | `RequireAuth` | None
- **Layout Shell**: `[LayoutName]`
- **Navigation Metadata**:
  - `sidebar`: `true` | `false`
  - `header`: `true` | `false`
  - `footer`: `true` | `false`
  - `breadcrumb`: `true` | `false`
  - `searchable`: `true` | `false`
  - `navGroup`: `[GroupName]`

---

## 3. SEO & Social Meta Specification
- **Title Tag**: `<title>...</title>`
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
