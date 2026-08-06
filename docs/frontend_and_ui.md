# Quy Chuẩn Frontend, UI & UX (Frontend & UI Specification)

> **Specification Version**: `1.3.0`  
> **Schema Version**: `1`  
> **Last Updated**: `2026-08-06`  
> **Status**: `APPROVED`  

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
| **Global UI State** | **Zustand (`useTreeStore`, `useThemeStore`, `useLanguageStore`)** | Active Node ID, Sidebar Collapse, Selected Filter, Theme Mode (`dark`/`light`/`system`), Locale (`en`/`vi`). |
| **Server Data & Cache** | **TanStack Query** | Cached Tree Nodes, Todo Lists, Automatic Invalidation. |
| **Local Form State** | **React Hook Form + Zod** | Form nhập liệu, Search Input. |
| **Realtime Stream** | **WebSockets + React Query** | Đồng bộ sự kiện kéo thả & tick todo tức thì. |

#### Quy tắc Optimistic UI Update (<16ms)
1. **Cancel Queries** -> 2. **Snapshot Previous State** -> 3. **Mutate Local Cache Tức thì** -> 4. **Gửi API Request** -> 5. **Rollback nếu lỗi / Settled Refetch**.

---

### 4. Quy Chuẩn Kiến Trúc i18n Tự Chứa (Feature-Sliced Self-Contained i18n)

Toàn bộ bản dịch đa ngôn ngữ được gói gọn trong thư mục của từng Feature:

```text
apps/web/src/features/<feature_name>/
├── <FeaturePage>.tsx
└── content/
    ├── en.json       # Khóa ngôn ngữ Tiếng Anh (không lặp tiền tố feature)
    ├── vi.json       # Khóa ngôn ngữ Tiếng Việt
    └── index.ts      # Local resolver get<Feature>Content(key, locale)
```

- **Quy tắc đặt Khóa JSON**: Sử dụng cấu trúc sạch `<section>.<element>` (Ví dụ: `hero.heading`, `cta.primary`).
- **Fallback & Synchronization**:
  - Khi chưa kết nối mạng Backend: Sử dụng trực tiếp `en.json` & `vi.json` cục bộ.
  - Khi kết nối Serverpod API: Đồng bộ động qua `I18nEndpoint.getDictionary(locale, namespace)` kèm IndexedDB ETag cache per [i18n.md](docs/services/i18n.md).

---

### 4. Accessibility Guidelines (a11y)

- **Keyboard Navigation:** Mọi thao tác chọn Node, Toggle Todo, Điều hướng Cây bài học bắt buộc hỗ trợ phím mũi tên (`Up`, `Down`, `Left`, `Right`, `Space`, `Enter`).
- **Focus Indicators:** Border Focus tương phản cao trong cả 2 mode (`ring-1 ring-foreground`).
- **Screen Reader Support:** Dùng đúng thẻ HTML5 Semantic (`<header>`, `<main>`, `<nav>`, `<article>`, `<button>`) kèm thuộc tính `aria-expanded`, `aria-selected` rõ ràng.

---

### 5. Mô Hình Kiến Trúc Đặc Tả Trang & Route (`docs/page_routes/<route_name>.md`)

Tương tự như cấu trúc đặc tả Dịch vụ Backend tại `docs/services/<service_name>.md`, toàn bộ Giao diện, Route Matrix, Layout Shell và Cấu trúc Component của từng màn hình Frontend được quản lý theo mô hình thư mục **`docs/page_routes/<route_name>.md`**.

Toàn bộ 13 file đặc tả trang bắt buộc phải đáp ứng **Bộ Quy Chuẩn 10 Điểm Nâng Cấp (10-Point Page Route Specification Standard)**:

1. **Route ID & route_name**: Định danh duy nhất (Ví dụ: `AUTH_LOGIN` / `auth.login`) cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC.
2. **Navigation Metadata**: Khai báo cờ điều hướng (`sidebar`, `header`, `footer`, `breadcrumb`, `searchable`, `navGroup`) cho UI Generator.
3. **SEO & Social Meta Specification**: Metadata thẻ Title, Description, Keywords, Canonical URL, OpenGraph, Twitter Card.
4. **Loading Strategy & Code Splitting**: Cấu hình Lazy Load, Preload condition, Chunk Name, và Bundle Priority (`CRITICAL`/`HIGH`/`MEDIUM`/`LOW`).
5. **Permission Matrix & RBAC**: Bảng phân quyền chi tiết cho 5 System Roles (`GUEST`, `USER`, `ORG_MEMBER`, `ORG_ADMIN`, `SYSTEM_ADMIN`).
6. **API Dependency & Serverpod RPC**: Khai báo rõ ràng các RPC endpoints (Ví dụ: `AuthEndpoint.login()`) và chiến lược Cache TTL.
7. **Page State Machine & UI Transitions**: Sơ đồ trạng thái giao diện (`IDLE` → `TYPING` → `SUBMITTING` → `SUCCESS` / `ERROR`).
8. **Component Inventory & Tree**: Danh sách Component nguyên tử (Atoms/Molecules/Organisms) và Cây Component Zero-Icon.
9. **Error Mapping & Handling**: Bảng tra cứu mã lỗi HTTP/RPC (401, 403, 404, 409, 422, 429, 500), UI Content Key và luồng khôi phục lỗi.
10. **Acceptance Criteria & QA Scenarios**: Kịch bản kiểm thử chất lượng chuẩn Gherkin (`Given-When-Then`).

