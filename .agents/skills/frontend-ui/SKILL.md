---
name: frontend-ui
description: Skill thực thi mã nguồn Web Frontend với React, Vite, Tailwind CSS tuân thủ Design System & Container Tokens.
---

# Frontend UI Skill (Execution Guide)

Mục đích: Hướng dẫn thực thi mã nguồn Frontend tuân thủ Single Source of Truth tại [docs/frontend_and_ui.md](docs/frontend_and_ui.md) và đặc tả trang tương ứng tại `docs/page_routes/<route_name>.md`.

---

## 1. 📖 Required Reading & Single Source of Truth

Trước khi viết code UI, AI Agent **BẮT BỘC** tra cứu tài liệu quy chuẩn duy nhất:
1. [docs/frontend_and_ui.md](file:///e:/Code/nodetask/docs/frontend_and_ui.md)
   - **Mục 1.1**: Professional Typography Line Wrapping Rules (`[text-wrap:balance]`, `[text-wrap:pretty]`, `whitespace-pre-line`).
   - **Mục 6**: System Layout & Container Tokens (`clamp()`).
   - **Mục 7.1**: Value-First Product Hierarchy Framework (Phân cấp Thông điệp Theo 5 Archetypes).
   - **Mục 8**: Archetype -> Required Pattern Matrix & Anti-Patterns.
2. `docs/page_routes/<route_name>.md` - File đặc tả chi tiết của trang cần thực thi.

> 💡 **REFACTOR PERMISSION**: Nếu trang chưa đáp ứng Pattern Matrix hoặc sai lệch phân cấp thông điệp, AI Agent **CÓ TOÀN QUYỀN VÀ BẮT BỘC FULL REFACTOR LAYOUT & CONTENT HIERARCHY**. Tuyệt đối không chỉnh sửa vụn vặt text.

---

## 2. 📋 Archetype -> Pattern Matrix Checklist

- **`Marketing & Showcase`**: `Hero` (Value-First Headline) + `MetricsGrid` + `ValueComparisonTable` + `BentoGrid` + `SectionDivider` + `CTA` + `Footer`.
- **`Documentation & Legal Spec`**: `Hero` + `MetricsGrid` / `BentoGrid` + `EditorialGrid` / `InteractiveTabSwitcher` + `StickySidebar` + `SpecificationPanel`.
- **`Story & Organization`**: `Hero` + `Timeline` + `SplitShowcase` + `TechnicalCard` + `SpecificationPanel` (Engineering Story & Architecture Decisions).
- **`Auth & Form Focus`**: `AuthCard` + `CenterContainer` (`max-w-[480px]`) + `ZeroIconForm` + `BrandLogo`.
- **`Workspace & IDE Canvas`**: `ClampedSidebar` (`280px`) + `ResizablePropertyPanel` (`340px`) + `MainCanvas` (`flex-1`) + `CenterFormPanel` (`max-w-[900px]`).

---

## 3. ❌ Anti-Patterns (MUST NOT)

- ❌ Lạm dụng thẻ `<div>` lồng nhau quá 20 tags ("Div Soup"). Bắt buộc dùng `<article>`, `<header>`, `<footer>`, `<main>`, `<aside>` cho các khối Card và Layout.
- ❌ Thiếu `[text-wrap:balance]` làm tiêu đề bị rơi 1 từ cô độc (Orphan word) xuống dòng.
- ❌ Thiếu `[text-wrap:pretty]` hoặc để đoạn văn bản mô tả tràn rộng >1000px gây mỏi mắt.
- ❌ Nhầm lẫn Intent giữa các Archetypes (xem chi tiết tại `docs/frontend_and_ui.md#7.1`).
- ❌ Hardcode `max-w-7xl` (phải dùng Container Tokens hoặc `clamp()`).
- ❌ Import thư viện icon (`lucide-react`, `react-icons`) hoặc dán emoji.
- ❌ Form dãn tràn full-width 4000px trên Canvas.
- ❌ Bố cục 1 cột cuộn dọc đơn điệu thiếu nhịp điệu thị giác.

---

## 4. 🧪 Verification & Completion Loop

Sau khi thực thi UI, AI Agent **BẮT BỘC** chạy kiểm thử:

```bash
node .agents/scripts/verify.js --strict
```

Chỉ khi kết quả báo **PASS (0 Errors, 0 Warnings)** mới tuyên bố hoàn thành.
