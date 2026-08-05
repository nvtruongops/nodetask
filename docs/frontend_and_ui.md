# Quy Chuẩn Frontend, UI & UX (Frontend & UI Specification)

---

### 1. Quy Tắc Thiết Kế UI Tối Giản Tuyệt Đối (Minimalist Zero-Icon Rule)

1. **KHÔNG DÙNG ICON NÀO TRÊN UI:**
   * Tuyệt đối **KHÔNG** import hay sử dụng icon từ `lucide-react`, `react-icons`, `@heroicons` hay bất kỳ bộ icon font/svg nào trên các UI Components.
   * Thay thế biểu tượng bằng **Text Labels**, ký tự ngoặc vuông `[ ]`, `[+]`, `[-]`, `[x]`, `[>]` hoặc Typography phân cấp.
2. **Monochrome Color Scheme:**
   * Sử dụng cặp màu Monochrome thuần túy: Light Mode (Chữ Đen - Nền Trắng) và Dark Mode (Chữ Trắng - Nền Đen).
3. **Phân cấp bằng Typography & Spacing:**
   * Thay vì dùng màu sắc sặc sỡ hoặc icon rườm rà, phân biệt thứ cấp dựa trên `font-weight`, `font-size`, `letter-spacing`, và `border` sắc nét.

---

### 2. Bộ Quy Chuẩn CSS Theme Tokens (`globals.css`)

```css
@layer base {
  :root {
    --background: 0 0% 100%;       /* #ffffff */
    --foreground: 0 0% 0%;          /* #000000 */
    --card: 0 0% 100%;
    --card-foreground: 0 0% 0%;
    --primary: 0 0% 0%;            /* Nền nút đen #000000 */
    --primary-foreground: 0 0% 100%;/* Chữ trên nút trắng #ffffff */
    --secondary: 0 0% 96.1%;       /* #f4f4f5 */
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 40%;  /* #666666 */
    --border: 0 0% 89.8%;          /* #e4e4e7 */
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 0%;         /* #000000 */
    --foreground: 0 0% 100%;       /* #ffffff */
    --card: 0 0% 4%;
    --card-foreground: 0 0% 100%;
    --primary: 0 0% 100%;          /* Nền nút trắng #ffffff */
    --primary-foreground: 0 0% 0%; /* Chữ trên nút đen #000000 */
    --secondary: 0 0% 14.9%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --border: 0 0% 18%;            /* #2e2e2e */
  }
}
```

---

### 3. Chiến Lược Quản Lý State & Optimistic UI

| Loại State | Giải pháp Công nghệ | Phạm vi & Trường hợp Sử dụng |
| :--- | :--- | :--- |
| **Global UI State** | **Zustand (`useTreeStore`)** | Active Node ID, Sidebar Collapse, Selected Filter, Theme. |
| **Server Data & Cache** | **TanStack Query** | Cached Tree Nodes, Todo Lists, Automatic Invalidation. |
| **Local Form State** | **React Hook Form + Zod** | Form nhập liệu, Search Input. |
| **Realtime Stream** | **WebSockets + React Query** | Đồng bộ sự kiện kéo thả & tick todo tức thì. |

#### Quy tắc Optimistic UI Update (<16ms)
1. **Cancel Queries** -> 2. **Snapshot Previous State** -> 3. **Mutate Local Cache Tức thì** -> 4. **Gửi API Request** -> 5. **Rollback nếu lỗi / Settled Refetch**.

---

### 4. Accessibility Guidelines (a11y)

- **Keyboard Navigation:** Mọi thao tác chọn Node, Toggle Todo, Điều hướng Cây bài học bắt buộc hỗ trợ phím mũi tên (`Up`, `Down`, `Left`, `Right`, `Space`, `Enter`).
- **Focus Indicators:** Border Focus tương phản cao trong cả 2 mode (`ring-1 ring-foreground`).
- **Screen Reader Support:** Dùng đúng thẻ HTML5 Semantic (`<header>`, `<main>`, `<nav>`, `<article>`, `<button>`) kèm thuộc tính `aria-expanded`, `aria-selected` rõ ràng.
