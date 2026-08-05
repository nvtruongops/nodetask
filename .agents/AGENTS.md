# Workspaces & AI Agent Governance (Single Source of Truth)

---

## 🚨 I. BỘ QUY TẮC CỐ ĐỊNH (STRICT POLICIES & GUARDRAILS)

Những quy định này trả lời câu hỏi: **"ĐƯỢC PHÉP VÀ KHÔNG ĐƯỢC PHÉP LÀM GÌ?"**

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

5. **TRIẾT LÝ PONYTAIL LAZY SENIOR DEV MODE (APPLIED EVERYWHERE):**
   - Triết lý xuyên suốt mọi giai đoạn: Ít code nhất có thể, không tạo abstraction thừa (YAGNI).
   - Boring over clever. Fewest files possible. Shortest working diff wins.
   - Thêm comment `// ponytail: <lý do & upgrade path>` đối với các đơn giản hóa tạm thời.

6. **ĐỌC TÀI LIỆU QUY CHUẨN TRƯỚC KHI CODE:**
   - Bắt buộc tra cứu các tài liệu cốt lõi trong `docs/` (`architecture.md`, `data_and_api.md`, `frontend_and_ui.md`, `operations_and_quality.md`), các file đặc tả dịch vụ tại `docs/services/<service_name>.md` và đặc tả trang/route tại `docs/page_routes/<route_name>.md` khi làm việc với từng dịch vụ hoặc màn hình cụ thể.

7. **KHÔNG SUY DIỄN (NO GUESSWORK):**
   - Tuyệt đối KHÔNG đoán mò implementation, schema hay file path.
   - Quy trình kiểm chứng: Không chắc $\rightarrow$ Đọc code $\rightarrow$ Đọc docs $\rightarrow$ Tra CodeGraph $\rightarrow$ Mới tiến hành sửa.

8. **BẮT BỘC KIỂM THỬ XÁC NHẬN VERIFY.JS:**
   - Mọi thay đổi mã nguồn trước khi công bố hoàn thành BẮT BỘC chạy `node .agents/scripts/verify.js --strict`. Chỉ khi kết quả **PASS (0 Errors, 0 Warnings)** mới kết thúc task.

9. **KHÔNG DUPLICATE LOGIC (REUSE ROOT SOURCE):**
   - Không viết trùng lặp helper hay copy-paste logic. Ưu tiên sửa tại root source để tất cả caller dùng chung.

---

## 🔄 II. QUY TRÌNH THỰC THI (WORKFLOW & EXECUTION PIPELINE)

Quy trình này trả lời câu hỏi: **"THỰC HIỆN CÁC BƯỚC THEO THỨ TỰ NÀO?"**

```text
               User Request
                    │
                    ▼
     1. using-superpowers Workflow
         (Method & Skill Selection)
                    │
                    ▼
           2. Planning Phase
         (Write & Confirm Plan)
                    │
                    ▼
       3. CodeGraph MCP Traversal
   (Kích hoạt KHI: refactor, rename,
    move, delete, cross-file impact)
                    │
                    ▼
       4. Implementation Phase
      (Governed by Ponytail Mode)
                    │
                    ▼
   5. Automated verify.js Verification
        (Must Output PASS 0 Errors)
                    │
                    ▼
                 Done 🎉
```

### Chi tiết thứ tự các bước:
1. **Lựa chọn Phương pháp (`using-superpowers`)**: Kiểm tra và gọi skill phù hợp (ví dụ: `brainstorming` cho feature mới, `systematic-debugging` cho bug).
2. **Lập Kế hoạch (`Planning`)**: Xây dựng kế hoạch thực thi rõ ràng, xác định phạm vi thay đổi.
3. **Tra cứu Đồ thị Điều kiện (`CodeGraph MCP`)**: Kích hoạt tra cứu `graph.db` KHI VÀ CHỈ KHI làm việc với các tác vụ `refactor`, `rename`, `move`, `delete`, hoặc thay đổi liên-file phức tạp. Task nhỏ (như sửa typo docs, đổi style đơn lẻ) KHÔNG chạy CodeGraph để tối ưu hiệu năng.
4. **Thực thi Mã nguồn (`Implementation`)**: Áp dụng triết lý Ponytail Mode (Sửa tận gốc, ngắn nhất, đơn giản nhất, 0-icon).
5. **Kiểm tra Xác nhận (`Verification`)**: Chạy `node .agents/scripts/verify.js --strict` và xác nhận PASS trước khi tuyên bố hoàn tất.
