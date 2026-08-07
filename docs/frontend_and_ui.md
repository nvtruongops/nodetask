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

### 1.1. Quy Tắc Xuống Hàng & Trình Bày Typography Chuyên Nghiệp (Professional Line Wrapping Rules)

Để tránh việc xuống hàng ngắt đoạn thiếu thẩm mỹ hoặc từ bị mồ côi (Orphan words) trên tiêu đề và đoạn văn, toàn bộ UI Components BẮT BỘC tuân thủ:

1. **Tiêu đề Hero & Headings (`h1`, `h2`, `h3`)**:
   - **Bắt buộc dùng `[text-wrap:balance]`**: Tự động cân bằng chiều dài các dòng tiêu đề, triệt tiêu hoàn toàn hiện tượng 1 từ đơn độc bị rơi xuống dòng mới.
   - **Giới hạn chiều rộng Tiêu đề**: Sử dụng `max-w-4xl` hoặc `max-w-5xl` để tiêu đề ngắt dòng tự nhiên thành 2-3 dòng cân đối trên màn hình lớn.
   - **Line-height tiêu đề**: Dùng `leading-[1.15]` hoặc `leading-tight` tạo độ nén thẩm mỹ cho tiêu đề chữ lớn.

2. **Văn bản Đoạn văn & Mô tả (`p`, `article`)**:
   - **Bắt buộc dùng `[text-wrap:pretty]`**: Giúp trình duyệt ngắt dòng thông minh, tránh từ mồ côi ở cuối đoạn văn.
   - **Độ dài dòng đọc chuẩn Ergonomic (`readingWidth`)**: Giới hạn tối đa `65ch` đến `80ch` (chuẩn `container.content` / `container.article`), CẤM để đoạn văn tràn full-width >1200px gây mỏi mắt.
   - **Bảo tồn xuống hàng ngữ nghĩa (`whitespace-pre-line`)**: Khi hiển thị nội dung i18n có chứa ký tự xuống hàng `\n`, dùng `whitespace-pre-line` để ngắt ý tự nhiên.

3. **Cơ Chế Rà Soát Ngắt Dòng Ngữ Nghĩa Đa Ngôn Ngữ (Multi-Language i18n Line Calibration)**:
   - **Độ dài & Cấu trúc Từ vựng Đa ngôn ngữ**: Mỗi ngôn ngữ (Locale Dictionaries `<locale>.json`) có độ dài câu, số lượng âm tiết và cấu trúc ngữ pháp khác nhau.
   - **Kỹ thuật Ngắt Dòng Ngữ Nghĩa (`\n`)**: Trong các tệp từ điển ngôn ngữ (`<locale>.json`), chủ động chèn ký tự `\n` tại các vị trí ngắt cụm từ / ngắt nhịp ngữ nghĩa tự nhiên của ngôn ngữ đó.
   - **Kết hợp `whitespace-pre-line` + `[text-wrap:balance]`**: Component React BẮT BỘC tích hợp cặp utility này để vừa bảo tồn điểm ngắt dòng `\n` ngữ nghĩa từ dictionary, vừa tự động cân bằng dòng thị giác qua CSS engine.

4. **Cấm (Anti-Patterns cho Line Wrapping)**:
   - ❌ Tiêu đề chính bị rơi 1 từ cô độc (Orphan word) xuống dòng dưới.
   - ❌ Bản dịch ngôn ngữ bị ngắt dòng giữa chừng cụm từ do không được hiệu chỉnh ký tự `\n` ngữ nghĩa trong dictionary.
   - ❌ Đoạn văn bản mô tả tràn rộng >1000px trên 1 dòng duy nhất.
   - ❌ Khoảng cách giữa các dòng quá dính (`leading-none` trên đoạn văn dài).

---

### 1.2. Quy Tắc Tương Phản, Chống Chói Màu & Giới Hạn Kích Thước Form Elements (Form Element Contrast & Bounded Rules)

Để tránh hoàn toàn lỗi chói màu, mờ chữ khi render dropdown trên Dark Mode cũng như tình trạng vỡ khung layout do người dùng kéo dãn ô nhập:

1. **Khuyến Khích Sử Dụng Custom Select Component (`ZeroIconSelect`)**:
   - Khi tạo ô chọn Dropdown trên Dark Mode, ưu tiên sử dụng Component `ZeroIconSelect` (hoặc custom listbox popover) thay vì thẻ native `<select>`.
   - Popover custom BẮT BỘC mang class `bg-card border border-border text-foreground`, khi hover/select đổi màu tương phản `hover:bg-foreground hover:text-background`, loại bỏ 100% hiện tượng native OS render popup màu xám sáng đè lên chữ màu trắng gây chói mắt.
   - Thẻ native `<select>` (nếu dùng) BẮT BỘC phải được định kiểu màu nền/màu chữ toàn cục qua `globals.css` (`select option { background-color: hsl(var(--background)); color: hsl(var(--foreground)); }`) và cấu hình `color-scheme: dark;`.

2. **Giới Hạn Khóa Kích Thước Ô Nhập (`<textarea>` Bounded Resizing)**:
   - Toàn bộ các thẻ `<textarea>` BẮT BỘC phải mang class `resize-none` (khóa tính năng kéo tự do làm vỡ khung Card).
   - Thiết lập giới hạn chiều cao `min-h-[120px] max-h-[240px]` kết hợp `overflow-y-auto` để ô nhập tin nhắn tự động xuất hiện thanh cuộn khi nội dung dài, giữ tuyệt đối độ cân đối của Card Container.

3. **Quy Chuẩn Placeholder Ô Nhập Liệu & Thông Điệp Súc Tích (Functional Placeholders & Value Copywriting)**:
   - **Tuyệt đối KHÔNG sử dụng tên người/email hư cấu** (như `Alex Johnson`, `alex@organization.com`, `Nguyễn Văn A`, `John Doe`, `user@domain.com`) làm placeholder.
   - Placeholder BẮT BỘC phải là **hướng dẫn thao tác chức năng súc tích** (ví dụ: `Enter full name`, `Enter work email` / `Nhập họ và tên`, `Nhập email công việc`).
   - Tiêu đề, phụ đề và mô tả BẮT BỘC giữ **ngắn gọn, trực diện & tập trung 100% vào giá trị người dùng**.

4. **Anti-Patterns cho Form Elements (MUST NOT)**:
   - ❌ Dùng tên người/email mẫu hư cấu (`Alex Johnson`, `alex@organization.com`, `John Doe`) làm placeholder.
   - ❌ Thẻ native `<option>` không có class background/color, dẫn đến trình duyệt tự render popup màu sáng đè lên chữ màu trắng gây chói mắt.
   - ❌ Thẻ `<textarea>` để `resize-y` hoặc `resize` tự do không có `max-h`, làm người dùng có thể kéo vỡ bố cục Card.
   - ❌ Tương phản chữ / nền dưới tiêu chuẩn WAI-ARIA 4.5:1.
   - ❌ Nền card bị sáng lố so với nền tổng thể Dark Mode (`#000000`).

---


### 2. Bộ Quy Chuẩn Design Preferences Engine (`design_preferences.md`)

Giao diện trong hệ thống `nodetask` bảo tốn tuyệt đối triết lý **Monochrome Zero-Icon**, không sử dụng màu sắc sặc sỡ mà quản lý dưới dạng **Hệ thống Tùy chọn Thiết kế Kỹ thuật (User Design Preferences Engine)** gồm 5 nhóm cấu hình (Grouped DTOs):

1. **Appearance**: `light` | `dark` | `system` (Theme Monochrome Trắng/Đen).
2. **Typography**: `mono` (Font monospace IBM Plex / JetBrains) | `sans` (Font Inter) | `serif` (Font Georgia).
3. **Layout**:
   - `density`: `compact` (Button 32px, Row 32px) | `comfortable` (Button 40px, Row 44px) | `relaxed` (Button 48px, Row 56px).
   - `radius`: `sharp` (`0px`) | `small` (`4px`) | `medium` (`8px`) | `large` (`12px`).
   - `border`: `none` | `thin` (`1px`) | `medium` (`1.5px`) | `heavy` (`2px`).
   - `readingWidth`: `72ch` | `80ch` | `90ch` | `full`.
4. **Accessibility**:
   - `motion`: `off` | `reduced` | `normal` | `fast`.
   - `contrast`: `normal` | `high` (Tương phản cao).
   - `fontScale`: `small` | `normal` | `large` | `xl`.
5. **Code Theme**: `github` | `vscodedark` | `monokai` | `onedark`.

#### Preset Profiles Động (System & Custom Presets):
- **`Developer System Preset`**: `dark`, `mono`, `compact`, `sharp`, `thin`, `full`, `normal`, `onedark`.
- **`Writer System Preset`**: `light`, `sans`, `comfortable`, `medium`, `thin`, `72ch`, `normal`, `github`.
- **`Researcher System Preset`**: `light`, `serif`, `comfortable`, `sharp`, `heavy`, `80ch`, `reduced`, `github`.
- **`Custom User Presets`**: Người dùng có thể tạo, chỉnh sửa và quản lý các Preset cá nhân qua API `createCustomPreset()`.

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
| **Global UI State** | **Zustand (`useTreeStore`, `useThemeStore`, `useLanguageStore`)** | Active Node ID, Sidebar Collapse, Selected Filter, Design Preferences (`appearance`, `typography`, `density`, `radius`, `border`, `motion`), Locale (`en`/`vi`). |
| **Server Data & Cache** | **TanStack Query** | Cached Tree Nodes, Todo Lists, Automatic Invalidation. |
| **Local Form State** | **React Hook Form + Zod** | Form nhập liệu, Search Input. |
| **Realtime Stream** | **WebSockets + React Query** | Đồng bộ sự kiện kéo thả & theme preferences tức thì. |

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

### 4. Accessibility Guidelines (a11y) & HTML5 Semantic Standards

- **Bắt buộc HTML5 Semantic Elements (Chống Div Soup):**
  - CẤM lạm dụng thẻ `<div>` lồng nhau quá nhiều (>20 divs trong 1 component).
  - Bắt buộc dùng `<article>` cho tất cả các thẻ Card (Tech Card, Metric Card, Feature Card, Pillar Card, Milestone Card).
  - Bắt buộc dùng `<header>` / `<footer>` cho các phần tiêu đề/chân thẻ Card hoặc bài viết.
  - Bắt buộc dùng `<main>` cho khối nội dung chính và `<aside>` cho Sticky Sidebar/Mục lục.
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

---

### 6. Hệ Thống Layout System & Container Tokens (Fluid & Clamped Layout Architecture)

Hệ thống UI không sử dụng hardcode `max-w-7xl` tràn lan, mà quản lý theo **Layout Classification Matrix** và **Container Tokens** với CSS `clamp()` / `min()` linh hoạt:

#### 6.1. Phân loại Loại Layout (Layout Types)
```text
Layout System
├── Marketing     (Landing Page: clamp(1000px, 92vw, 1400px))
├── Content       (Blog, Story, About Page: 80ch)
├── Documentation (Privacy, Terms, Spec Docs: 72ch)
├── Dashboard     (Analytics, System Matrix: clamp(1200px, 94vw, 1600px))
├── Workspace     (IDE Canvas, Node Graph: Canvas flex-1, Form panel max-900px)
└── Modal         (Form Overlays: max-w-lg / max-w-2xl)
```

#### 6.2. Bộ Container Tokens & CSS Rules
| Token Name | Cấu hình Max Width | Trường hợp Sử dụng |
| :--- | :--- | :--- |
| `container.content` | `72ch` (~65-80 ký tự/dòng) | Văn bản điều khoản, bảo mật, tài liệu đọc dài |
| `container.article` | `80ch` | Trang Giới thiệu, Blog, Bài viết câu chuyện |
| `container.marketing` | `clamp(1000px, 92vw, 1400px)` | Hero & Feature Matrix trang Landing |
| `container.wide` | `clamp(1200px, 94vw, 1600px)` | Trang Dashboard, Bảng thông số kỹ thuật rộng |
| `container.workspace_form` | `max-w-[900px] mx-auto` | Form khởi tạo Project/Settings nằm giữa Workspace Canvas |

#### 6.3. Quy chuẩn Kích thước Sidebar & Layout Workspace (IDE Pattern)
- Tuyệt đối **KHÔNG** chia % màn hình cứng cho Sidebar (tránh 4K bị phình quá 700px).
- **Sidebar Navigation**: Cố định / Clamped `280px` (`min: 220px`, `max: 360px`).
- **Property Panel**: Cố định / Resizable `340px`.
- **Main Canvas / AST Editor**: Sử dụng `flex-1` chiếm toàn bộ phần diện tích còn lại.

---

### 7. Thư Viện Layout & High-Level Pattern Components (Layout & Pattern System)

Thay vì chỉ định nghĩa các Component nguyên tử cấp thấp (`Button`, `Input`, `Dialog`), hệ thống Design System của nodetask quy định bộ thư viện **Layout & Pattern Components cấp cao** tạo sự khác biệt lớn về trải nghiệm (UX) và bản sắc thị giác (Brand Identity):

| Layout Component | Vai trò & Mục đích Trải nghiệm (UX Impact) | Trang Sử dụng Nòng cốt |
| :--- | :--- | :--- |
| `Hero` | Khối tiêu đề mở đầu tạo ấn tượng thị giác (Above-the-fold thesis), chứa Badge, Value Headline, Subheading & CTAs | Landing, About, Privacy, Terms |
| `EditorialGrid` | Bố cục 2 cột biên tập kỹ thuật kết hợp Sticky Sidebar & bài viết chính cuộn tự nhiên | Privacy, Documentation Specs |
| `MetricsGrid` | Lưới 4 card thông số giá trị / chỉ số hệ thống nhanh | Privacy, Dashboard, Terms |
| `SpecificationPanel` | Khối thông số điều khoản/kỹ thuật bọc trong viền monochrome sắc nét | Terms, About, System Docs |
| `ValueComparisonTable` | Bảng so sánh giá trị người dùng quan tâm (User Value Needs) mapped với công nghệ phía sau | Landing Page |
| `StickySidebar` | Thanh mục lục cố định tự động highlight `[▸]` vị trí cuộn trang qua `IntersectionObserver` | Privacy, Architecture Specs |
| `Timeline` | Trình diễn dòng thời gian cột mốc phát triển hoặc tiến trình khôi phục sự cố | About, Release Notes |
| `SplitShowcase` | Bố cục chia đôi 50/50 giữa khối mô tả giá trị và khối minh họa tính năng | Feature Matrix, Demo Page |
| `BentoGrid` | Lưới bento bất đối xứng làm nổi bật các tính năng lợi ích trụ cột | Terms, Landing Features |

---

### 7.1. Khung Nguyên Tắc Phân Cấp Thông Điệp Sản Phẩm (Value-First Product Hierarchy Framework)

Mọi trang trong hệ thống **KHÔNG CỐ ĐỊNH THEO TÊN NGUYÊN THỦY CỤ THỂ**, mà bắt buộc phân định trật tự nội dung và intent theo **5 Page Archetypes tổng quát**:

1. **`Marketing & Showcase` Archetype (Ví dụ: Trang Chủ, Bảng Giá, Demo Sản Phẩm, Giới Thiệu Tính Năng)**:
   - **Độc giả chính**: Khách hàng, Người dùng cuối, Khách vãng lai.
   - **Trật tự thông điệp BẮT BỘC**: **Giá trị Sản phẩm (Product Value) → Vấn đề & Giải pháp (Problem & Solution) → Tính năng & Lợi ích (User Benefits) → Bằng chứng Kỹ thuật (Technical Proof Points)**.
   - **Quy tắc Hero**: Hero BẮT BỘC tập trung trả lời 5 câu hỏi cốt lõi (*Sản phẩm là gì? Giải quyết vấn đề gì? Tại sao nên dùng? Khác biệt gì? Bắt đầu như thế nào?*). CẤM đưa tên thuật ngữ công nghệ backend thô (`ltree`, `pgvector`, `Serverpod`, `OCC`) làm Tiêu đề Hero chính.
   - **Quy tắc So sánh**: Bảng so sánh (`ValueComparisonTable`) phải so sánh **Giá trị Người dùng quan tâm** (mapped với công nghệ phía dưới), CẤM so sánh thô các xâu công nghệ.

2. **`Story & Organization` Archetype (Ví dụ: Trang Giới Thiệu, Sứ Mệnh Đội Ngũ, Engineering Story, Release Notes)**:
   - **Độc giả chính**: Developers, Nhà đầu tư, Cộng đồng công nghệ, Nhân sự.
   - **Trật tự thông điệp BẮT BỘC**: **Sứ mệnh & Tầm nhìn → Câu chuyện Sản phẩm → Quyết định Kiến trúc Kỹ thuật (Why Tech X?) → Cột mốc & Roadmap**.

3. **`Documentation & Legal Spec` Archetype (Ví dụ: Chính Sách Bảo Mật, Điều Khoản Dịch Vụ, Trung Tâm Tin Cậy, API Specs)**:
   - **Độc giả chính**: Đội ngũ Pháp lý, Enterprise Security Auditors, Người dùng tra cứu.
   - **Trật tự thông điệp BẮT BỘC**: **Metadata Control Bar → Executive Summary → Granular Clauses/Specifications → Compliance Commitments**.
   - **Quy tắc Bố cục**: Bắt buộc sử dụng `EditorialGrid` kết hợp `StickySidebar` / `InteractiveTabSwitcher` cho khả năng định vị nội dung mượt mà.

4. **`Auth & Form Focus` Archetype (Ví dụ: Đăng Nhập, Đăng Ký, Quên Mật Khẩu, Chấp Nhận Lời Mời, Tài Khoản Vô Hiệu)**:
   - **Độc giả chính**: Người dùng đang Onboarding hoặc Đăng nhập lại.
   - **Trật tự thông điệp BẮT BỘC**: **Brand Logo/Badge → Main Form Action → Real-time Inline Validation / Status → Secondary Recovery Navigation**.
   - **Quy tắc Bố cục**: Container card cố định `max-w-[480px]`, 100% Zero-Icon form, focus rings tương phản cao.

5. **`Workspace & IDE Canvas` Archetype (Ví dụ: Workspace Chính, Cây Tài Liệu Canvas, Bảng Cấu Hình Settings)**:
   - **Độc giả chính**: Thành viên Workspace active, Người tạo nội dung.
   - **Trật tự thông điệp BẮT BỘC**: **Navigation Tree Hierarchy → Main Document Canvas → Contextual Inspector Panel**.
   - **Quy tắc Bố cục**: Clamped sidebar (`280px`), Main canvas (`flex-1`), Optimistic UI updates <16ms.

---

### 8. Ma Trận Pattern Bắt Buộc & Anti-Patterns Theo Archetype Trang (Archetype -> Pattern Matrix)

Mọi trang trong hệ thống (hiện tại và tương lai) BẮT BỘC phải tự định danh thuộc 1 trong các **Page Archetypes** dưới đây trong file đặc tả `docs/page_routes/<route_name>.md` và tuân thủ Ma trận Pattern tương ứng:

| Page Archetype | Required Pattern Components (MUST) | Archetype Anti-Patterns (MUST NOT) |
| :--- | :--- | :--- |
| **`Marketing & Showcase`** | `Hero` (Value Headline) + `MetricsGrid` + `ValueComparisonTable` + `BentoGrid` + `SectionDivider` + `CTA` + `Footer` | ❌ Hero nhồi nhét tên công nghệ backend, ❌ Single centered column, ❌ Khoảng trắng chết >30vh |
| **`Documentation & Legal Spec`** | `Hero` + `MetricsGrid` / `BentoGrid` + `EditorialGrid` / `InteractiveTabSwitcher` + `StickySidebar` + `SpecificationPanel` | ❌ 1 cột cuộn dọc đơn điệu không Sidebar/Tab, ❌ Thiếu thẻ chỉ số, ❌ Thiếu hộp cam kết |
| **`Story & Organization`** | `Hero` + `Timeline` + `SplitShowcase` + `TechnicalCard` + `SpecificationPanel` | ❌ Chỉ có văn bản thuần túy, ❌ Thiếu vạch thời gian cột mốc (`Timeline`), ❌ Thiếu sơ đồ kiến trúc |
| **`Auth & Form Focus`** | `AuthCard` + `CenterContainer` (`max-w-[480px]`) + `ZeroIconForm` + `BrandLogo` | ❌ Form dãn tràn full-width >600px, ❌ Thiếu focus ring, ❌ Dán icon bên trong input |
| **`Workspace & IDE Canvas`** | `ClampedSidebar` (`280px`) + `ResizablePropertyPanel` (`340px`) + `MainCanvas` (`flex-1`) + `CenterFormPanel` (`max-w-[900px]`) | ❌ Chia % màn hình cứng cho Sidebar (700px trên 4K), ❌ Form cài đặt tràn 4000px |



---

### 9. Quyền Hạn Tái Cấu Trúc Bố Cục (Refactor Permission & Creative Authority)

Khi thực thi hoặc bảo trì giao diện:
1. **AI Agent CÓ TOÀN QUYỀN VÀ BẮT BỘC Refactor Layout**: Nếu trang hiện tại chưa đáp ứng Ma trận Pattern (`Route -> Required Pattern Matrix`), Agent **KHÔNG ĐƯỢC CHỈ SỬA VỤN VẶT VĂN BẢN/COLOR**. Agent phải chủ động tái cấu trúc lại toàn bộ Layout để đạt tiêu chuẩn Pattern Matrix.
2. **Quyền linh hoạt mở rộng**: AI Agent được phép tự do chia lại cột, thêm Section, đổi dạng Grid và thiết kế mới Hero nếu điều đó giúp tăng thẩm mỹ và trải nghiệm UI/UX.

---

### 10. Tiêu Chí Duyệt Giao Diện (UI Review Checklist)

Trước khi công bố hoàn tất task Frontend, AI Agent BẮT BỘC thực hiện kiểm tra tự duyệt UI:

- [ ] **Pattern Matrix**: Trang đã chứa đủ 100% các Pattern Component bắt buộc theo Route Matrix chưa?
- [ ] **Visual Rhythm**: Có nhịp điệu thị giác (xen kẽ giữa Grid, Bento, Table, Callout) thay vì 1 cột phẳng lặp đi lặp lại không?
- [ ] **No Dead Space**: Có khoảng trắng chết (>30vh) nào bị lãng phí không?
- [ ] **Anti-Pattern Check**: Trang có vi phạm bất kỳ cờ MUST NOT nào trong Route Anti-Pattern không?
- [ ] **Governance Verification**: Đã chạy `node .agents/scripts/verify.js --strict` và đạt PASS (0 Errors)?




