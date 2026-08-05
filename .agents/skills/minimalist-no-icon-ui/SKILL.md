---
name: minimalist-no-icon-ui
description: Nguyên tắc thiết kế giao diện UI/UX tối giản tuyệt đối, KHÔNG DÙNG ICON, theo sát quy chuẩn Monochrome (Chữ đen - Nền trắng / Chữ trắng - Nền đen) từ các tài liệu thiết kế.
---

# Quy chuẩn Thiết kế UI Tối giản KHÔNG DÙNG ICON (Minimalist No-Icon UI)

Hướng dẫn này bắt buộc áp dụng khi phát triển mọi component giao diện cho hệ thống. Yêu cầu tuân thủ nghiêm ngặt **KHÔNG DÙNG BẤT KỲ ICON NÀO** (Không dùng Lucide icons, không dùng SVG icon, không dùng Emoji). Mọi thông tin, chỉ báo và trạng thái phải được thể hiện hoàn toàn bằng **Typography, Tương phản Đen - Trắng, Đường viền và Ký tự Văn bản (Text/Brackets)**.

Mọi thiết kế phải theo sát tài liệu quy chuẩn UI cốt lõi:
- [docs/frontend_and_ui.md](file:///e:/Code/nodetask/docs/frontend_and_ui.md)

---

## 🚫 QUY TẮC VÀNG: KHÔNG DÙNG ICON (ZERO-ICON RULE)

### 1. Thay thế Icon bằng Ký tự Văn bản & Ký hiệu (Text Alternatives)
| Chức năng | Thay vì dùng Icon ❌ | Sử dụng Ký tự / Ký hiệu Văn bản ✔️ |
| :--- | :--- | :--- |
| **Search / Tìm kiếm** | 🔍 Magnifying glass icon | Nút hoặc nhãn text `[ Search... ]` hoặc `Search` |
| **Check / Completed** | ✅ Checkmark icon | Ký tự ngoặc `[x]` hoặc `[✓]` hoặc nhãn `DONE` |
| **Pending / Todo** | 🔲 Square checkbox icon | Ký tự ngoặc `[ ]` hoặc nhãn `TODO` |
| **Navigation / Back** | ⬅️ Arrow icon | Ký tự text `< Back` hoặc `/` hoặc `‹` |
| **Expand / Collapse** | 🔽 Chevron / Arrow icon | Ký tự text `[+]` / `[-]` hoặc `v` / `>` |
| **Settings / Profile** | ⚙️ Gear / User icon | Nhãn chữ `[ Settings ]`, `[ Account ]` |
| **More Options / Menu** | 📱 Hamburger / Ellipsis icon | Ký tự text `[ Menu ]`, `[ ... ]`, `[ More ]` |
| **Delete / Remove** | 🗑️ Trash icon | Nhãn text `[ Delete ]` hoặc `[ X ]` |
| **Add / Create** | ➕ Plus icon | Nhãn text `[ + New ]` hoặc `+ Add Task` |

---

## 🎨 2. QUY CHUẨN MÀU SẮC & THEME (MONOCHROME COLOR TOKENS)

Theo sát [docs/frontend_and_ui.md](docs/frontend_and_ui.md):

- **Light Mode:**
  - Nền (`--background`): `#FFFFFF` (Trắng tinh)
  - Chữ chính (`--foreground`): `#000000` (Đen tuyền)
  - Thẻ đen tương phản: `bg-black text-white`
  - Viền: `border border-black` hoặc `border-zinc-300`
- **Dark Mode:**
  - Nền (`--background`): `#000000` (Đen tuyền)
  - Chữ chính (`--foreground`): `#FFFFFF` (Trắng tinh)
  - Thẻ trắng tương phản: `bg-white text-black`
  - Viền: `border border-white` hoặc `border-zinc-700`

---

## 🔤 3. QUY CHUẨN TYPOGRAPHY (EDITORIAL STYLES)

Sử dụng sự kết hợp giữa 3 họ phông chữ để phân cấp thông tin thay cho icon:

1. **Serif (Playfair Display / Merriweather):** Dùng cho Tiêu đề lớn (Headings), Tên môn học ("Mathematics", "Self Study for Student").
2. **Sans-serif (Inter / Plus Jakarta Sans):** Dùng cho Nội dung bài học, Nút bấm, Thẻ thông tin.
3. **Monospace (JetBrains Mono):** Dùng cho Công thức, Nhãn trạng thái `[21.02.26]`, Ngày tháng, Code block.

---

## 🧩 4. QUY CHUẨN DESIGN COMPONENT (KHÔNG ICON)

### 4.1. Header Component
- Khối màu đen bo cong đáy `rounded-b-3xl bg-black text-white p-6`.
- Không dùng icon cho Search bar: Dùng input với nhãn text placeholder `Search something...`.
- Không dùng icon cho Menu/Profile: Dùng nhãn text `[ Menu ]` và `[ Profile ]`.

### 4.2. Subject Button Component (Nút Chọn Môn Học)
- Khối chữ nhật bo góc `bg-black text-white font-serif py-3 px-4 rounded-lg`.
- Không thêm icon bên cạnh tên môn học.

### 4.3. Formula Pill Card (Thẻ Công Thức)
- Khối chữ nhật màu đen chữ trắng nổi bật `bg-black text-white font-serif text-center py-2 px-6 rounded-md my-2 inline-block`.

### 4.4. Tree Navigation (Cây Thư Mục Phân Cấp Bài Học)
- Không dùng icon thư mục / icon file (❌ 📁 📄).
- Dùng thụt lề (Indentation) kết hợp với đường gạch hoặc ký tự ngoặc:
  ```text
  [+] Topic: Hình học
      |-- [-] Module: Hình khối
      |    |-- Session: Hình nón [Active]
      |    `-- Session: Cầu
  ```

### 4.5. Todo Item Component
- Định dạng thẻ viền nét đứt hoặc nét liền tối giản: `border-2 border-black rounded-xl p-4 bg-white text-black`.
- Hiển thị ngày tháng bằng Monospace Badge: `[21.02.22]`.
- Trạng thái hoàn thành dùng `[x] Text` (nếu đã xong) và `[ ] Text` (nếu chưa xong).

---

## 🛠️ CHECKLIST KIỂM TRA TRƯỚC KHI SUBMIT CODE UI

- [ ] Check xem có lỡ import thư viện icon nào không (`lucide-react`, `react-icons`...) -> **Nếu có, XÓA NGAY**.
- [ ] Check xem có dùng Emoji không (❌ 📄 📁 📌 🔍) -> **Nếu có, thay bằng Text/Brackets**.
- [ ] Giao diện có đúng màu Nền Trắng/Chữ Đen (Light) hoặc Nền Đen/Chữ Trắng (Dark) không?
- [ ] Các khối công thức/tiêu đề có dùng phông Serif/Mono chuẩn chưa?
