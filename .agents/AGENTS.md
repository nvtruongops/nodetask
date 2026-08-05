# Workspaces & AI Agent Guardrails (Single Source of Truth)

---

### 🚨 BỘ QUY TẮC CỐ ĐỊNH DÀNH CHO AI AGENT (STRICT GUARDRAILS)

Khi phát triển hoặc chỉnh sửa bất kỳ phần code nào trong hệ thống, AI Agent **BẮT BUỘC** tuân thủ các quy định sau:

1. **KHÔNG ĐỔI KIẾN TRÚC STACK (NO ARCHITECTURE SWAPPING):**
   - Frontend: **React + Vite + Tailwind CSS + Shadcn UI**.
   - Backend: **Dart (Serverpod Framework)**.
   - Mobile: **Flutter (Dart)**.
   - Nghiêm cấm tự ý chuyển đổi sang Next.js App Router, NestJS, Express hay React Native.

2. **KHÔNG TỰ THÊM DEPENDENCY MỚI (NO UNAPPROVED DEPENDENCIES):**
   - Chỉ được sử dụng các thư viện đã được phê duyệt trong [architecture.md](docs/architecture.md).
   - Tuyệt đối KHÔNG tự cài thêm UI kit hay state management khác (như Redux, MobX...).

3. **TUÂN THỦ QUY TẮC UI KHÔNG ICON (ZERO-ICON RULE):**
   - Kiểm tra kỹ skill [.agents/skills/minimalist-no-icon-ui/SKILL.md](.agents/skills/minimalist-no-icon-ui/SKILL.md).
   - Tuyệt đối **KHÔNG dùng bất kỳ Icon hay Emoji nào** trên UI Component. Thay thế bằng Text Labels, Brackets `[ ]` và Typography.

4. **KHÔNG TỰ Ý REFACTOR API HOẶC DB SCHEMA CŨ:**
   - Khi sửa code, luôn tuân theo Endpoints & Schema trong [data_and_api.md](docs/data_and_api.md).
   - Giữ lại tính tương thích ngược (Backward compatibility).

5. **TRIẾT LÝ PONYTAIL LAZY SENIOR DEV MODE:**
   - Ít code nhất có thể, không tạo abstraction thừa (YAGNI).
   - Tái sử dụng helper/util sẵn có trong codebase.
   - Sửa bug tận gốc (root cause), không sửa triệu chứng.
   - Thêm comment `// ponytail: <lý do & upgrade path>` đối với các đơn giản hóa tạm thời.

6. **ĐỌC TÀI LIỆU QUY CHUẨN TRƯỚC KHI CODE:**
   - Trước khi thực hiện bất kỳ task nào, bắt buộc tra cứu các tài liệu trong `docs/` (`architecture.md`, `data_and_api.md`, `frontend_and_ui.md`, `operations_and_quality.md`).
