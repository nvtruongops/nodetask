---
name: frontend-ui
description: Skill hướng dẫn phát triển giao diện Web Frontend với React, Vite, Tailwind CSS, Tiptap và dnd-kit.
---

# Frontend UI Skill

Mục đích: Đảm bảo mã nguồn Frontend tuân thủ [docs/frontend_and_ui.md](docs/frontend_and_ui.md) và đặc tả trang tương ứng tại `docs/page_routes/<route_name>.md`.

## 📋 CHECKLIST KIỂM TRA FRONTEND

- [ ] Đọc và tuân thủ đặc tả giao diện trang tại `docs/page_routes/<route_name>.md` (nếu có).
- [ ] Tổ chức bản dịch đa ngôn ngữ dạng Feature-Sliced Self-Contained tại `features/<feature>/content/en.json` & `vi.json`, tích hợp `useLanguageStore` và `useThemeStore`.
- [ ] Sử dụng các CSS variables từ [docs/frontend_and_ui.md](docs/frontend_and_ui.md).
- [ ] Tích hợp `@dnd-kit` cho thao tác Kéo - Thả mượt dưới 16ms.
- [ ] Soạn thảo văn bản bằng Tiptap Editor.
- [ ] Tuân thủ tuyệt đối quy tắc KHÔNG ICON từ `minimalist-no-icon-ui`.
- [ ] Tuyệt đối KHÔNG sử dụng Mock Data, fake roles hay dummy arrays khi thiết kế state & components. Sử dụng chuẩn RBAC System Roles (`GUEST`, `USER`, `ORG_MEMBER`, `ORG_ADMIN`, `SYSTEM_ADMIN`) từ `docs/services/*.md`.


