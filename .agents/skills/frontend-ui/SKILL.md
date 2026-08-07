---
name: frontend-ui
description: Skill thực thi mã nguồn Web Frontend với React, Vite, Tailwind CSS tuân thủ Design System & Container Tokens.
---

# Frontend UI Skill (Execution Guide)

Mục đích: Hướng dẫn thực thi mã nguồn Frontend tuân thủ Single Source of Truth tại [docs/frontend_and_ui.md](file:///e:/Code/nodetask/docs/frontend_and_ui.md) và đặc tả trang tương ứng tại `docs/page_routes/<route_name>.md`.

---

## 🚨 STRICT MANDATORY EXECUTION PROTOCOL (CỔNG THỰC THI BẮT BUỘC)

Toàn bộ AI Agent BẮT BỘC tuân thủ nghiêm ngặt **Quy trình 4 Cổng thực thi (4 Execution Gateways)** dưới đây. Tuyệt đối **KHÔNG LÁCH BƯỚC** hoặc tự ý đi tắt dưới bất kỳ chế độ lười/ponytail nào.

```text
[ CỔNG 1: READ DOCS FIRST ] ──► [ CỔNG 2: ARCHETYPE AUDIT ] ──► [ CỔNG 3: IMPLEMENT / REFACTOR ] ──► [ CỔNG 4: VERIFY.JS ]
```

---

### 🟢 CỔNG 1: READ DOCS FIRST (KHÔNG ĐƯỢC SỬA CODE NẾU CHƯA THỰC HIỆN BƯỚC NÀY)

Trước khi gọi bất kỳ tool tạo/sửa code nào (`write_to_file`, `replace_file_content`, `multi_replace_file_content`), AI Agent **BẮT BỘC KHỔNG NỘI TRUYỀN** phải sử dụng tool `view_file` đọc **ĐỦ CẢ 2 TỆP QUY CHUẨN**:

1. 👉 [docs/frontend_and_ui.md](file:///e:/Code/nodetask/docs/frontend_and_ui.md) - Quy chuẩn Frontend UI & Design System tổng quan.
2. 👉 `docs/page_routes/<route_name>.md` - Tệp đặc tả tuyến đường trang cụ thể cần thực thi.

> ⚠️ **STRICT GUARDRAIL**: Bất kể chế độ `ponytail` hay lời gọi shortcut nào, Agent **KHÔNG ĐƯỢC PHÉP** can thiệp mã nguồn Frontend nếu chưa có tool call `view_file` cho cả 2 tệp trên trong phiên làm việc.

---

### 🔵 CỔNG 2: ARCHETYPE & PATTERN MATRIX AUDIT

Xác định đúng **Page Archetype** của trang trong 5 Archetypes quy định tại `docs/frontend_and_ui.md#7.1`:

- **`Marketing & Showcase`**: `Hero` (Value-First Headline) + `MetricsGrid` + `ValueComparisonTable` + `BentoGrid` + `SectionDivider` + `CTA` + `Footer`.
- **`Documentation & Legal Spec`**: `Hero` + `MetricsGrid` / `BentoGrid` + `EditorialGrid` / `InteractiveTabSwitcher` + `StickySidebar` + `SpecificationPanel`.
- **`Story & Organization`**: `Hero` + `Timeline` + `SplitShowcase` + `TechnicalCard` + `SpecificationPanel` (Engineering Story & Architecture Decisions).
- **`Auth & Form Focus`**: `AuthCard` + `CenterContainer` (`max-w-[480px]`) + `ZeroIconForm` + `BrandLogo`.
- **`Workspace & IDE Canvas`**: `ClampedSidebar` (`280px`) + `ResizablePropertyPanel` (`340px`) + `MainCanvas` (`flex-1`) + `CenterFormPanel` (`max-w-[900px]`).

> 💡 **REFACTOR PERMISSION**: Nếu trang hiện tại chưa đáp ứng Pattern Matrix hoặc sai lệch phân cấp thông điệp, AI Agent **CÓ TOÀN QUYỀN VÀ BẮT BỘC FULL REFACTOR LAYOUT & CONTENT HIERARCHY**. Tuyệt đối không chỉnh sửa vụn vặt text.

---

### 🟡 CỔNG 3: IMPLEMENTATION RULES & ANTI-PATTERNS CHECKLIST

#### Rules (Bắt Buộc Cum Compliance):
1. **Zero-Icon Rule**: 0 icon imports (`lucide-react`, `react-icons`), 0 emojis. Sử dụng Text labels và ngoặc vuông `[ ]`.
2. **Typography Line Wrapping**:
   - Headings (`h1`, `h2`, `h3`): Bắt buộc `[text-wrap:balance]` + `leading-[1.15]`.
   - Paragraphs (`p`, `article`): Bắt buộc `[text-wrap:pretty]` + `whitespace-pre-line`.
3. **Container Tokens & Layout**: Dùng `max-w-[clamp(...)]` hoặc `max-w-[800px-1100px]`. CẤM hardcode `max-w-7xl`.
4. **Feature-Sliced Self-Contained i18n**: Gói gọn bản dịch tại `apps/web/src/features/<feature>/content/` (`en.json`, `vi.json`, `index.ts`).
5. **HTML5 Semantics & a11y**: Thẻ `<main id="main-content" role="main">`, `<article>` cho Card, `<header>`, `<footer>`, `<aside>` cho Sidebar.

6. **Concise & Value-First Copywriting**: Thông điệp, tiêu đề và phụ đề BẮT BỘC ngắn gọn, súc tích, tập trung 100% vào giá trị người dùng.
7. **Functional Input Placeholders**: Placeholder BẮT BỘC là hướng dẫn thao tác chức năng súc tích (như `Enter full name`, `Enter work email` / `Nhập họ và tên`, `Nhập email công việc`).

#### Anti-Patterns (MUST NOT):
- ❌ Lạm dụng thẻ `<div>` lồng nhau quá 20 tags ("Div Soup").
- ❌ Để tiêu đề rơi 1 từ mồ côi (Orphan word) xuống dòng.
- ❌ Hardcode `max-w-7xl` trong JSX.
- ❌ Import thư viện icon hoặc dán emoji.
- ❌ Form dãn tràn full-width 4000px trên Canvas.
- ❌ Thiếu class màu nền/chữ cho thẻ native `<option>` trong `<select>` gây hiện tượng chữ trắng nền xám chói màu trên Dark Mode.
- ❌ Để thẻ `<textarea>` mở rộng tự do (`resize`/`resize-y`) không giới hạn `min-h`/`max-h` làm vỡ bố cục Card.
- ❌ Dùng tên giả/email mẫu hư cấu (`Alex Johnson`, `alex@organization.com`, `John Doe`, `user@domain.com`) làm placeholder ô nhập liệu.
- ❌ Phụ đề/tiêu đề dài dòng, rườm rà không tập trung trực diện vào giá trị người dùng.



---

### 🔴 CỔNG 4: VERIFICATION & COMPLETION LOOP

Sau khi hoàn thành chỉnh sửa mã nguồn Frontend, AI Agent **BẮT BỘC** chạy kiểm thử tự động:

```bash
node .agents/scripts/verify.js --strict
```

Chỉ khi kết quả báo **PASS (0 Errors, 0 Warnings)** mới được phép tuyên bố hoàn thành task.
