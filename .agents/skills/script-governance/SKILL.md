---
name: script-governance
description: Role và quy chuẩn quản trị vòng đời Script (Reusable vs Ephemeral), ngăn chặn hardcode đường dẫn, secret và phụ thuộc môi trường.
---

# 📜 Script Governance & Ephemeral Script Lifecycle

## 🎯 Tổng quan & Mục tiêu

Skill `script-governance` chịu trách nhiệm kiểm soát toàn diện ý định, phân loại vòng đời, tính độc lập môi trường, an toàn bí mật (secrets) và truy vết bằng chứng (audit trail) cho mọi script được tạo ra hoặc chỉnh sửa bởi AI Agent trong repository `nodetask`.

---

## 🚦 3 Câu Hỏi Bắt Buộc Trước Khi Tạo Script

Trước khi tạo bất kỳ script nào (`.js`, `.ts`, `.mjs`, `.cjs`, `.ps1`, `.sh`, `.py`), Agent BẮT BUỘC phải tự kiểm tra 3 điều kiện:

### 1. Script này có khả năng được tái sử dụng lâu dài không?
- **CÓ (Reusable)**: Phải đặt trong `scripts/reusable/`, tạo kèm file `manifest.yaml` tương ứng, ghi chép tài liệu hướng dẫn và tuân thủ chuẩn tự động hóa.
- **KHÔNG (Ephemeral)**: Phải đặt trong `scripts/tmp/`, đánh dấu rõ mục đích phục vụ task hiện tại.

### 2. Script có phụ thuộc môi trường cụ thể không?
- **TUYỆT ĐỐI CẤM** hardcode đường dẫn tuyệt đối (`E:\Code\...`, `C:\Users\...`, `/home/...`, `/root/...`).
- **BẮT BUỘC** sử dụng biến môi trường: `process.env.NODETASK_ROOT`, `process.env.CODEGRAPH_DATA_DIR`...
- **CẤM FALLBACK SANG HARDCODED PATH**: Cấm cú pháp dạng `process.env.VAR || "E:\\Code\\..."`. Nếu thiếu biến môi trường, script phải **fail-fast** với thông báo lỗi rõ ràng: `Missing required environment variable: VAR_NAME`.

### 3. Script có chứa secret hoặc thông tin định danh người dùng không?
- **TUYỆT ĐỐI CẤM** ghi API key, Token, Password, JWT, Private Key, Database Credentials trực tiếp vào mã nguồn.
- **BẮT BUỘC** truyền qua biến môi trường hoặc file cấu hình được bảo vệ bởi `.gitignore`.

---

## 🔄 Phân Biệt Vòng Đời: REUSABLE vs EPHEMERAL

```text
Script Lifecycle
│
├── REUSABLE (scripts/reusable/)
│   ├── Có giá trị sử dụng lại lâu dài cho repository / tooling
│   ├── Được commit vào Git
│   ├── Có manifest metadata machine-readable (<name>.manifest.yaml)
│   ├── 100% độc lập môi trường (Chỉ dùng ENV / CLI arguments)
│   └── 0% secret, 0% hardcoded user identity
│
└── EPHEMERAL (scripts/tmp/)
    ├── Phục vụ một task / điều tra / phân tích tạm thời
    ├── Không commit vào Git (được bảo vệ bởi scripts/tmp/.gitignore)
    ├── ĐƯỢC PHÉP chạy nhiều lần trong suốt quá trình xử lý task ("one-off purpose" != "one execution only")
    ├── Phải để lại Evidence kiểm toán (.agents/evidence/scripts/YYYY/*.json) trước khi xóa
    └── Sau khi task hoàn tất -> Xóa bỏ khỏi scripts/tmp/
```

---

## 📋 Cấu Trúc Bằng Chứng Thực Thi (Execution Evidence)

Trước khi xóa ephemeral script, Agent phải tạo bản ghi JSON tinh gọn tại `.agents/evidence/scripts/YYYY/YYYY-MM-DD-<scriptId>.json`:

```json
{
  "scriptId": "ephemeral-route-audit-20260817",
  "type": "ephemeral",
  "purpose": "Audit duplicate route definitions during task NODETASK-123",
  "path": "scripts/tmp/audit-routes.js",
  "createdAt": "2026-08-17T20:41:00+07:00",
  "deletedAt": "2026-08-17T20:53:00+07:00",
  "executions": 3,
  "result": "success",
  "reusable": false,
  "retention": "task",
  "sourceRetained": false
}
```

> [!IMPORTANT]
> **Chống Bloat Repository**: Evidence chỉ chứa thông tin định danh, mục đích, kết quả và metadata. **CẤM** lưu full stdout, dump dữ liệu lớn, source code đầy đủ hoặc secrets vào file evidence.

---

## 📈 Cơ Chế Tự Động Phát Hiện Tái Sử Dụng & Nâng Cấp (Promotion)

Nếu một ephemeral script được tái sử dụng liên tục (ngưỡng: $\ge 3$ lần chạy hoặc xuất hiện qua $\ge 2$ tasks khác nhau):
- Hệ thống Governance sẽ phát cảnh báo / yêu cầu **PROMOTE TO REUSABLE**.
- Agent sẽ chuẩn hóa script, chuyển vào `scripts/reusable/` và tạo manifest đi kèm.
