---
name: flutter-ui
description: Skill phát triển giao diện Mobile Flutter đồng bộ 100% Data Models với Backend Serverpod.
---

# Flutter UI Skill (Execution Guide)

Mục đích: Hướng dẫn AI Agent phát triển mã nguồn Flutter Mobile tuân thủ 100% quy chuẩn UI/UX tại [docs/frontend_and_ui.md](file:///e:/Code/nodetask/docs/frontend_and_ui.md) và mô hình dữ liệu tại [docs/data_and_api.md](file:///e:/Code/nodetask/docs/data_and_api.md).

---

## 🚨 STRICT MANDATORY EXECUTION PROTOCOL (CỔNG THỰC THI BẮT BUỘC)

Toàn bộ AI Agent BẮT BỘC tuân thủ nghiêm ngặt **Quy trình 4 Cổng thực thi (4 Execution Gateways)** dưới đây. Tuyệt đối **KHÔNG LÁCH BƯỚC** hoặc tự ý viết Widget khi chưa đọc quy chuẩn UI và Data Models.

```text
[ CỔNG 1: READ UI & DATA DOCS ] ──► [ CỔNG 2: FLUTTER MONOCHROME CHECKLIST ] ──► [ CỔNG 3: WIDGET DEVELOPMENT ] ──► [ CỔNG 4: VERIFY.JS ]
```

---

### 🟢 CỔNG 1: READ UI & DATA DOCS FIRST (KHÔNG SỬA CODE FLUTTER NẾU CHƯA THỰC HIỆN BƯỚC NÀY)

Trước khi khởi tạo hoặc chỉnh sửa bất kỳ tệp Flutter Widget / Screen nào trong `apps/mobile/`, AI Agent **BẮT BỘC** phải gọi tool `view_file` mở **ĐỦ CẢ 2 TỆP QUY CHUẨN**:

1. 👉 [docs/frontend_and_ui.md](file:///e:/Code/nodetask/docs/frontend_and_ui.md) - Quy chuẩn Thiết kế UI Monochrome & Line wrapping.
2. 👉 [docs/data_and_api.md](file:///e:/Code/nodetask/docs/data_and_api.md) - Danh mục API Endpoints & Serverpod Client Models.

> ⚠️ **STRICT GUARDRAIL**: Agent **KHÔNG ĐƯỢC PHÉP** tạo hoặc can thiệp mã nguồn Flutter Mobile trước khi có tool call `view_file` cho 2 tệp trên trong phiên làm việc.

---

### 🔵 CỔNG 2: FLUTTER MONOCHROME & RIVERPOD CHECKLIST

1. **Zero-Icon Rule**: Tuyệt đối KHÔNG DÙNG ICON hay Emoji. Thay thế biểu tượng bằng Text Labels, ký tự ngoặc vuông `[ ]`, `[+]`, `[-]` hoặc Typography phân cấp.
2. **Monochrome Color System**: Tuân thủ strict monochrome palette: Light Mode (Chữ Đen - Nền Trắng) và Dark Mode (Chữ Trắng - Nền Đen).
3. **Serverpod Client SDK**: Đồng bộ 100% Data Models qua Serverpod Dart Client SDK tự động sinh.
4. **State Management**: Sử dụng `Riverpod` cho toàn bộ luồng quản lý State trên Mobile.
5. **Golden Testing**: Thực hiện Golden Test kiểm thử giao diện thực tế trước khi xuất bản.

---

### 🟡 CỔNG 3: WIDGET DEVELOPMENT & REFACTOR

Tiến hành phát triển Widget Flutter tuân thủ kiến trúc phân rã sạch, không bloat code.

---

### 🔴 CỔNG 4: VERIFICATION & COMPLETION LOOP

Sau khi triển khai mã nguồn Flutter, AI Agent **BẮT BỘC** thực hiện kiểm thử tự động:

```bash
node .agents/scripts/verify.js --strict
```

Chỉ khi kết quả báo **PASS (0 Errors, 0 Warnings)** mới được phép hoàn tất task.
