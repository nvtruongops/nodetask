---
name: git-pr
description: Skill hỗ trợ review Pull Request, tự động tạo CHANGELOG và tóm tắt file thay đổi.
---

# Git PR Skill (Execution Guide)

Mục đích: Hướng dẫn AI Agent tự động hóa quy trình review mã nguồn, tổng hợp thay đổi, sinh CHANGELOG và tạo Pull Request tuân thủ 100% Governance Pipeline.

---

## 🚨 STRICT MANDATORY EXECUTION PROTOCOL (CỔNG THỰC THI BẮT BUỘC)

Toàn bộ AI Agent BẮT BỘC tuân thủ nghiêm ngặt **Quy trình 4 Cổng thực thi (4 Execution Gateways)** dưới đây. Tuyệt đối **KHÔNG TẠO PR/CHANGELOG** khi chưa chạy lệnh kiểm thử governance.

```text
[ CỔNG 1: RUN VERIFY.JS STRICT ] ──► [ CỔNG 2: DIFF & REVISION AUDIT ] ──► [ CỔNG 3: GENERATE CHANGELOG ] ──► [ CỔNG 4: PR SUMMARY ]
```

---

### 🟢 CỔNG 1: MANDATORY VERIFICATION GATEWAY (KHÔNG TẠO PR NẾU CHƯA PASS VERIFY)

Trước khi thực hiện bất kỳ thao tác tạo CHANGELOG hay mở PR nào, AI Agent **BẮT BỘC** phải chạy kiểm thử tự động toàn hệ thống:

```bash
node .agents/scripts/verify.js --strict
```

Đồng thời tự động cập nhật đồ thị mã nguồn CodeGraph local:
```powershell
codegraph sync
```

> ⚠️ **STRICT GUARDRAIL**: Bất kỳ cảnh báo (Warning) hoặc lỗi (Error) nào xuất ra từ `verify.js` BẮT BỘC phải được khắc phục hoàn toàn trước khi tiếp tục. Tuyệt đối **CẤM TẠO PR** khi kết quả chưa đạt `PASS (0 Errors, 0 Warnings)`.

---

### 🔵 CỔNG 2: DIFF & REVISION AUDIT

1. **Tổng hợp danh sách File**: Rà soát chính xác toàn bộ danh sách file đã thêm mới `[NEW]`, chỉnh sửa `[MODIFY]` hoặc xóa bỏ `[DELETE]`.
2. **Kiểm tra Scope & Ponytail Mode**: Đảm bảo diff tối giản nhất, không chứa code thừa/bloat, không sửa các file ngoài phạm vi yêu cầu của task.
3. **Strict Compliance**: Đảm bảo 100% mã nguồn tuân thủ Zero-Icon rule, 5 RBAC System Roles và không hardcode mock data.

---

### 🟡 CỔNG 3: GENERATE CHANGELOG & SUMMARY

Tạo tệp hoặc nội dung CHANGELOG phân loại rõ ràng theo chuẩn Keep a Changelog:
- `Added`: Tính năng / tệp đặc tả / components mới.
- `Changed`: Cải tiến / refactor mã nguồn.
- `Fixed`: Sửa lỗi bug / lints.

---

### 🔴 CỔNG 4: PULL REQUEST CREATION

Tổng hợp bản tóm tắt PR chuyên nghiệp (bao gồm Mục đích, Thay đổi chính, Bằng chứng verify PASS) và tiến hành tạo Pull Request.
