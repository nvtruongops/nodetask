---
name: performance
description: Skill kiểm tra và tối ưu hiệu năng Frontend, Backend API và Database query.
---

# Performance Skill (Execution Guide)

Mục đích: Hướng dẫn AI Agent kiểm tra, đo đạc và tối ưu hiệu năng hệ thống tuân thủ 100% Ngân sách Hiệu năng tại [docs/operations_and_quality.md](file:///e:/Code/nodetask/docs/operations_and_quality.md) và [docs/frontend_and_ui.md](file:///e:/Code/nodetask/docs/frontend_and_ui.md).

---

## 🚨 STRICT MANDATORY EXECUTION PROTOCOL (CỔNG THỰC THI BẮT BUỘC)

Toàn bộ AI Agent BẮT BỘC tuân thủ nghiêm ngặt **Quy trình 4 Cổng thực thi (4 Execution Gateways)** dưới đây. Tuyệt đối **KHÔNG LÁCH BƯỚC** hoặc tự ý tối ưu code khi chưa rà soát ngân sách hiệu năng.

```text
[ CỔNG 1: READ PERFORMANCE BUDGET ] ──► [ CỔNG 2: PERFORMANCE BUDGET CHECKLIST ] ──► [ CỔNG 3: OPTIMIZE & BENCHMARK ] ──► [ CỔNG 4: VERIFY.JS ]
```

---

### 🟢 CỔNG 1: READ PERFORMANCE BUDGET DOCS FIRST (KHÔNG TỐI ƯU NẾU CHƯA THỰC HIỆN BƯỚC NÀY)

Trước khi tiến hành đo đạc hoặc tối ưu hiệu năng mã nguồn, AI Agent **BẮT BỘC** phải gọi tool `view_file` mở **ĐỦ CẢ 2 TỆP QUY CHUẨN**:

1. 👉 [docs/operations_and_quality.md](file:///e:/Code/nodetask/docs/operations_and_quality.md) - Ngân sách Hiệu năng hệ thống (Performance Budget & SLA).
2. 👉 [docs/frontend_and_ui.md](file:///e:/Code/nodetask/docs/frontend_and_ui.md) - Quy chuẩn Optimistic UI <16ms & Layout Render performance.

> ⚠️ **STRICT GUARDRAIL**: Agent **KHÔNG ĐƯỢC PHÉP** sửa mã nguồn phục vụ tối ưu hiệu năng trước khi có tool call `view_file` cho 2 tệp trên trong phiên làm việc.

---

### 🔵 CỔNG 2: PERFORMANCE BUDGET CHECKLIST

1. **Optimistic UI & Drag-Drop Rate**: Phản hồi thao tác Kéo - Thả Cây bài học và Cập nhật trạng thái tức thì `< 16ms` (đạt mốc 60 FPS).
2. **Re-render Prevention**: Loại bỏ triệt để Re-render không cần thiết trên Frontend bằng Zustand selectors và `React.memo`.
3. **Web Bundle Budget**: Kích thước Initial Bundle Chunk của Web Frontend `< 300KB gzipped`.
4. **PostgreSQL LTREE Query SLA**: Thời gian truy vấn Cây phân cấp LTREE và vector search pgvector tại Database `< 20ms`.
5. **No Memory Leak**: Giải phóng toàn bộ Event Listeners, WebSocket subscriptions khi unmount Component.

---

### 🟡 CỔNG 3: CODE OPTIMIZATION & BENCHMARKING

Tiến hành tái cấu trúc mã nguồn tối ưu thuật toán, giảm độ phức tạp tính toán và nâng cao tốc độ phản hồi.

---

### 🔴 CỔNG 4: VERIFICATION & COMPLETION LOOP

Sau khi tối ưu hiệu năng, AI Agent **BẮT BỘC** thực hiện kiểm thử tự động:

```bash
node .agents/scripts/verify.js --strict
```

Chỉ khi kết quả báo **PASS (0 Errors, 0 Warnings)** mới được phép hoàn tất task.
