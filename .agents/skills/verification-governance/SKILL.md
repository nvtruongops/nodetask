---
name: verification-governance
description: Use when running governance verification, creating new rule plugins in .agents/scripts/rules/, configuring policies in .agents/policies/, or executing the automated verification loop before task completion.
---

# Verification Automated Governance Skill

## Overview

Skill **`verification-governance`** quy định cơ chế và quy trình vận hành Hệ thống Kiểm thử & Xác nhận Tự động (Automated Rule Engine Verification Engine) tại `.agents/scripts/verify.js` cho toàn bộ Monorepo **`nodetask`**.

Hệ thống được thiết kế theo kiến trúc **Plugin Engine Động** (Dynamic Rule Plugins), kiểm soát toàn bộ 6 Lớp Guardrails từ Kiến trúc, Phụ thuộc, Cấu trúc Thư mục, Mã nguồn UI Zero-Icon đến các Hợp đồng Đặc tả File Schema (`docs/page_routes/` và `docs/services/`).

---

## System Architecture & Data Sources

### Core File Locations
- **Engine Entrypoint**: [`.agents/scripts/verify.js`](file:///e:/Code/nodetask/.agents/scripts/verify.js)
- **Manifest Config**: [`.agents/manifest.json`](file:///e:/Code/nodetask/.agents/manifest.json)
- **Registry Config**: [`.agents/registry.json`](file:///e:/Code/nodetask/.agents/registry.json)
- **Rule Policies JSON**: [`.agents/policies/`](file:///e:/Code/nodetask/.agents/policies/)
- **Rule Plugins JS**: [`.agents/scripts/rules/`](file:///e:/Code/nodetask/.agents/scripts/rules/)
- **Yaml Schemas**: [`.agents/schemas/`](file:///e:/Code/nodetask/.agents/schemas/)

---

## Active Guardrail Rules Index

Hệ thống hiện tại thực thi 6 Lớp Rule Plugins trong `.agents/scripts/rules/`:

| Rule ID | Rule File (`.agents/scripts/rules/`) | Category | Default Severity | Mục đích & Phạm vi Kiểm soát |
| :--- | :--- | :--- | :--- | :--- |
| **`WHITELIST_DEPENDENCIES`** | `dependencies.js` | `ARCHITECTURE` | `ERROR` | Kiểm tra tất cả dependencies trong `apps/web/package.json` có nằm trong Whitelist được duyệt hay không. |
| **`FOLDER_STRUCTURE`** | `folder-structure.js` | `ARCHITECTURE` | `ERROR` | Đảm bảo 4 Core Docs (`architecture.md`, `data_and_api.md`, `frontend_and_ui.md`, `operations_and_quality.md`) và cấu trúc `.agents/` tồn tại hợp lệ. |
| **`IMPORT_ORDER`** | `imports.js` | `STYLE` | `INFO` | Kiểm tra thứ tự Import Convention (Third-party ➡️ UI ➡️ Store ➡️ Types). |
| **`PAGE_ROUTE_DOC_SCHEMA`** | `page-route-doc.js` | `SPECIFICATION` | `WARNING` | Validate tất cả file `docs/page_routes/*.md` khớp 100% 6 Sections Schema Contract (`page-route-doc.yaml`). |
| **`SERVICE_DOC_SCHEMA`** | `service-doc.js` | `SPECIFICATION` | `WARNING` | Validate tất cả file `docs/services/*.md` khớp 100% 10 Sections Schema Contract (`service-doc.yaml`). |
| **`ZERO_ICON`** | `zero-icon.js` | `UI` | `WARNING` | Quét toàn bộ mã nguồn Frontend phát hiện icon package hoặc emoji bị cấm (Quy tắc Zero-Icon Monochrome). |

---

## Execution Command Syntax

AI Agent khởi chạy hệ thống verify thông qua Terminal:

```bash
# 1. Chạy mặc định (Fails khi có ERROR):
node .agents/scripts/verify.js

# 2. Chạy Strict Mode (REQUIRED FOR TASK COMPLETION - Fails trên cả ERROR & WARNING):
node .agents/scripts/verify.js --strict

# 3. Chạy lọc theo Category:
node .agents/scripts/verify.js --category=architecture

# 4. Chạy lọc theo Rule ID cụ thể:
node .agents/scripts/verify.js --rule=ZERO_ICON
```

---

## How to Author a New Rule Plugin

Để bổ sung một quy tắc kiểm tra tự động mới vào Governance System:

1. **Tạo Policy File (`.agents/policies/<rule_key>.json`)**:
   ```json
   {
     "id": "NEW_RULE_ID",
     "enabled": true,
     "category": "SPECIFICATION",
     "severity": "ERROR"
   }
   ```

2. **Tạo Plugin JS (`.agents/scripts/rules/<rule_key>.js`)**:
   ```javascript
   module.exports = {
     name: "New Custom Verification Rule Check",
     category: "SPECIFICATION",
     severity: "ERROR",
     execute(ctx) {
       // ctx chứa: rootDir, manifest, registry, policies, severity, logPass(), logFail(), logWarn(), logInfo()
       const isValid = true; // Logic kiểm tra
       if (isValid) {
         ctx.logPass("Tất cả kiểm tra cho New Custom Rule đều hợp lệ.");
       } else {
         ctx.logFail("Phát hiện vi phạm quy tắc New Custom Rule!");
       }
     }
   };
   ```

3. **Chạy kiểm thử lại plugin**:
   `node .agents/scripts/verify.js --rule=NEW_RULE_ID`

---

## Strict Self-Correction Verification Loop

Mọi AI Agent làm việc trong Monorepo `nodetask` BẮT BỘC tuân thủ **Vòng lặp Kiểm thử Tự sửa lỗi** trước khi tuyên bố hoàn thành bất kỳ task nào:

```text
               [Bắt đầu Kiểm thử Xác nhận Task]
                               │
                               ▼
        [Chạy: node .agents/scripts/verify.js --strict]
                               │
                     ┌─────────┴─────────┐
                  [PASS]              [FAIL]
                     │                   │
                     ▼                   ▼
            [Tuyên bố Hoàn thành]  1. Đọc và phân tích Log lỗi chi tiết từ Console
                                   2. Tìm nguyên nhân gốc rễ (Root Cause)
                                   3. Chỉnh sửa trực tiếp file vi phạm
                                   4. Lặp lại bước Chạy verify --strict
```

### Tiêu chí Hoàn thành Task (Definition of Done)
- Terminal xuất kết quả: `Total Passed: X | Errors: 0 | Warnings: 0`.
- Thông báo xuất hiện: `🎉 TẤT CẢ CÁC QUY TẮC ĐỀU HỢP LỆ!`.
- Trả về mã thoát Process Exit Code `0`.
