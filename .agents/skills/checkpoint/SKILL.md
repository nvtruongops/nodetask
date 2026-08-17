---
name: checkpoint
description: Skill tự động tạo checkpoint đánh giá hệ thống governance, nâng version (major/minor/patch), cập nhật manifest và đồng bộ trạng thái kiểm định.
---

# 🏛️ Skill: Checkpoint & Governance Versioning

## 🎯 Mục đích & Phạm vi

Skill `checkpoint` chịu trách nhiệm tạo các điểm kiểm toán định kỳ (**Checkpoint Audit & System Evaluation**) cho toàn bộ hệ thống quản trị [`.agents`](file:///e:/Code/nodetask/.agents), tự động nâng phiên bản (`governanceVersion`) và cập nhật đồng bộ các tệp siêu dữ liệu trọng yếu.

---

## ⚡ Khi Nào Kích Hoạt Skill Này?

Agent BẮT BUỘC kích hoạt hoặc chạy skill này khi:
1. Người dùng yêu cầu "tạo checkpoint", "đánh giá checkpoint", "nâng version governance", "snapshot trạng thái hệ thống".
2. Agent vừa hoàn thành chỉnh sửa lớn trong [`.agents`](file:///e:/Code/nodetask/.agents) (thêm rule mới, thêm skill mới, đổi policy, cập nhật pipeline, nâng cấp engine).
3. Trước và sau các mốc bàn giao tính năng lớn (Major / Minor Milestones).

---

## 🔄 Quy Trình Thực Hiện Checkpoint Tự Động

```text
1. Phân loại Version Bump
   ├── major : Thay đổi kiến trúc cốt lõi, phá vỡ backward compatibility (ví dụ: 1.x -> 2.0)
   ├── minor : Bổ sung Rule mới, Skill mới, Policy mới, Governance Layer mới (ví dụ: 1.5.0 -> 1.6.0)
   └── patch : Sửa lỗi nhỏ, cập nhật rule regex, tinh chỉnh prompt/template (ví dụ: 1.6.0 -> 1.6.1)
          │
          ▼
2. Chạy Lệnh Tạo Checkpoint
   node scripts/reusable/create-checkpoint.js --bump=minor --notes="<Mô tả nội dung nâng cấp>"
          │
          ▼
3. Tự Động Đồng Bộ Version:
   ├── .agents/manifest.json    ("governanceVersion": "X.Y.Z")
   ├── .agents/pipeline.json    ("governanceVersion": "X.Y.Z")
   ├── .agents/registry.json    ("registryVersion": "X.Y.Z")
   └── .agents/AGENTS.md        (Header: Governance Version: X.Y.Z)
          │
          ▼
4. Chạy Verification & Xuất Báo Cáo:
   ├── .agents/checkpoints/YYYY-MM-DD-vX.Y.Z.md  (File lưu trữ lịch sử)
   └── .agents/CHECKPOINT.md                     (File Master trỏ checkpoint mới nhất)
          │
          ▼
5. Lưu Engram Checkpoint (mem_save / mem_session_summary)
```

---

## 📋 Cấu Trúc Lệnh CLI

```powershell
# Nâng phiên bản Minor kèm ghi chú
node scripts/reusable/create-checkpoint.js --bump=minor --notes="Tích hợp Script Lifecycle Governance & Ephemeral Evidence"

# Nâng phiên bản Patch
node scripts/reusable/create-checkpoint.js --bump=patch --notes="Fix regex in whitelist-dependencies"

# Chỉ định phiên bản cụ thể và ngày thẩm định
node scripts/reusable/create-checkpoint.js --version=1.6.0 --date=2026-08-17 --notes="Bổ sung Rule SCRIPT_LIFECYCLE và Skill script-governance"
```

---

## 🛡️ Tiêu Chuẩn Chất Lượng & 4 Guardrails Bắt Buộc

Khi tạo Checkpoint, script và skill bắt buộc tuân thủ 4 Guardrails:
1. **Dirty Working Tree Awareness**: Ghi nhận trạng thái git (`Clean` vs `Dirty`) để đảm bảo tính minh bạch kiểm toán.
2. **Version Consistency Assertion**: Khẳng định 100% trường version trong `manifest.json`, `pipeline.json`, `registry.json`, `AGENTS.md` và file Checkpoint hoàn toàn khớp nhau.
3. **Duplicate Checkpoint Prevention**: Chặn việc tạo trùng file checkpoint cùng ngày/version nếu không có cờ `--force`.
4. **Strict Fail-Safe Gate**: Nếu `verify.js --strict` không đạt exit code 0, master `CHECKPOINT.md` tuyệt đối không được cập nhật thành trạng thái PASS.

---

## 📊 Cấu Trúc Báo Cáo 3 Tầng (3-Tier Scoreboard)

Báo cáo Checkpoint phân tách rành mạch 3 tầng:
1. **Verification Compliance**: Kết quả thực thi Rule Engine (0 Errors / 0 Warnings).
2. **Semantic Quality Score**: Điểm số toàn diện (96/100) kèm danh sách Open Non-blocking Findings (40 Medium về SEO/RBAC).
3. **Release Readiness**: Trạng thái sẵn sàng bàn giao (0 Blocker).
4. **Skills Breakdown**: Phân rã minh bạch: `Tổng số Skills = Local Skills (có skill.yaml) + Builtin/Platform Skills`.
