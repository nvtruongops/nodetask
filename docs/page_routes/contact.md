<!-- Target FE Component: apps/web/src/features/contact/ContactPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/contact -->

# Contact Page Route Specification (`contact.md`)

> **Route ID**: `CONTACT_MAIN`  
> **Route Name**: `contact.main`  
> **Route Path**: `/contact`  
> **Route Type**: `PUBLIC`  
> **Page Archetype**: `Auth & Form Focus`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `2.1.0`  
> **Status**: `APPROVED & ENFORCED`  

---

## 1. Overview & Route ID
- **Route ID**: `CONTACT_MAIN` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `contact.main`
- **Description**: Trang Liên hệ & Hỗ trợ kỹ thuật (`/contact`) là kênh giao tiếp chính thức giữa người dùng, kỹ sư và đội ngũ vận hành `nodetask`:
  1. **Direct Triage Routing**: Phân luồng yêu cầu chính xác theo 4 kênh chuyên biệt:
     - `Kỹ thuật & Bug Report`: Xử lý sự cố đồng bộ, parser lỗi AST hoặc cài đặt self-host.
     - `An toàn Thông tin & VDP`: Tiếp nhận báo cáo lỗ hổng an ninh từ chuyên gia bảo mật.
     - `Tổ chức & Enterprise`: Tư vấn triển khai on-premise, SSO/SAML và license số lượng lớn.
     - `Đóng góp Ý kiến & Feature Request`: Thu thập phản hồi xây dựng tính năng mới.
  2. **Guaranteed SLA & E-E-A-T Transparency**: Cam kết phản hồi qua email trong vòng 24 giờ làm việc. Cung cấp thông tin liên lạc rõ ràng và tài liệu kỹ thuật tự phục vụ (Self-serve Docs).

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/contact`
- **Access Type**: `PUBLIC`
- **Page Archetype**: `Auth & Form Focus`
- **Auth Guard**: `None`
- **Layout Shell**: `PublicLayoutShell`
- **Navigation Metadata**:
  - `sidebar`: `false`
  - `header`: `true`
  - `footer`: `true`
  - `breadcrumb`: `true`
  - `searchable`: `true`
  - `navOrder`: `8`
  - `navGroup`: `"public"`

---

## 3. SEO & Social Meta Specification (SEO & Social Share Metadata)
- **Title Tag**: `<title>Contact Support & Engineering - nodetask</title>`
- **Meta Description**: `Liên hệ với đội ngũ kỹ thuật và hỗ trợ khách hàng của nodetask. Cam kết phản hồi trong vòng 24 giờ làm việc.`
- **Keywords**: `nodetask contact, engineering support, bug report, enterprise enquiry, security vulnerability report, contact nodetask team`
- **Canonical URL**: `/#/contact`
- **OpenGraph Specification**:
  - `og:title`: `Contact Support - nodetask`
  - `og:description`: `Kết nối trực tiếp với đội ngũ phát triển và kỹ thuật nodetask.`
  - `og:image`: `/og-contact.png`
  - `og:type`: `website`
  - `og:url`: `/#/contact`
- **Twitter Card Specification**:
  - `twitter:card`: `summary`
  - `twitter:title`: `Contact nodetask Support`
  - `twitter:description`: `Direct engineering assistance and customer support.`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/contact/ContactPage'))`)
- **Preload Strategy**: `onHover`
- **Chunk Name**: `chunk-contact`
- **Priority**: `MEDIUM`

---

## 5. Permission Matrix & RBAC (Access Control & RBAC Permissions)
| System Role | View Access | Form Submit Rights | Notes |
| :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Gửi form liên hệ (Kèm Client Rate-limit & Token kiểm soát) | Khách vãng lai |
| `USER` | **Allowed** | Gửi form với Email người dùng tự động điền sẵn | Người dùng cá nhân |
| `ORG_MEMBER` | **Allowed** | Gửi form kèm thông tin Tổ chức đang tham gia | Thành viên tổ chức |
| `ORG_ADMIN` | **Allowed** | Gửi yêu cầu hỗ trợ ưu tiên cấp Tổ chức | Quản trị viên |
| `SYSTEM_ADMIN` | **Allowed** | Gửi tin nhắn trực tiếp hệ thống | Admin hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `I18nEndpoint.getDictionary(locale: String, namespace: 'contact')`: Tải từ điển cho form liên hệ.
  - `WorkspaceEndpoint.submitContactEnquiry(session, fullName, email, category, message)`: Nhận thông tin liên hệ và ghi nhận ticket hỗ trợ.
- **Serverpod Architecture Reference**: Payload được kiểm tra toàn vẹn kiểu dữ liệu Serverpod DTO trước khi lưu trữ.
- **Data Caching & Stale Policy**:
  - `staleTime`: `0ms` (Form tương tác động).
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `TYPING` → `SUBMITTING` → `SUCCESS` (Hiển thị Confirmation Badge) | `ERROR`
- **UI State Breakdown**:
  - `IDLE`: Form sẵn sàng tiếp nhận thông tin (Họ tên, Email, Kênh phân loại, Nội dung).
  - `TYPING`: Xác thực hợp lệ trường dữ liệu theo thời gian thực (Zod validation).
  - `SUBMITTING`: Nút Submit hiển thị `[ĐANG GỬI TIN NHẮN...]` và tạm thời khóa input.
  - `SUCCESS`: Hiển thị "Yêu cầu đã được tiếp nhận. Mã Ticket #[ID] sẽ được phản hồi qua email trong 24h."

---

## 8. Component Inventory & Tree

### Required Pattern Components (MUST)
- `Required Pattern Components`: `Hero`, `ContactFormCard`, `ZeroIconSelect`, `MessageTextarea`, `SubmitButton`, `SpecificationPanel`, `Footer`

### Route Anti-Patterns (MUST NOT)
- `Route Anti-Patterns`:
  - ❌ Dùng icon phong bì thư hoặc biểu tượng điện thoại — bắt buộc dùng text labels `[SUPPORT CHANNEL]`, `[SECURITY]`, `[ENTERPRISE]`.
  - ❌ Cho phép Textarea co giãn tự do phá vỡ layout (`resize-none` với `min-h-[140px] max-h-[220px]`).
  - ❌ Thiếu bảng thông tin thời gian phản hồi SLA `SpecificationPanel`.

### Component Tree
```text
[ContactPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
└── [MainContent id="main-content" role="main"]
    ├── [ContactHeroSection]
    │   ├── [ContactBadge label="[SUPPORT & TRIAGE • 24H SLA]"]
    │   ├── [ContactTitle contentKey="contact.title"]
    │   └── [ContactSubtitle contentKey="contact.subtitle"]
    ├── [ContactFormCard maxWidth="680px"]
    │   ├── [ContactForm onSubmit=handleContactSubmit]
    │   │   ├── [FullNameInput name="fullName" required=true]
    │   │   ├── [EmailInput name="email" type="email" required=true]
    │   │   ├── [ZeroIconSelect name="category" options=triageCategories]
    │   │   ├── [MessageTextarea name="message" resize="none" min-h="140px" max-h="220px"]
    │   │   └── [SubmitButton label="[Gửi Yêu Cầu Liên Hệ]"]
    │   └── [DirectChannelsSpecificationPanel]
    └── [ContactFAQQuickLinks]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Session token hết hạn khi người dùng đăng nhập submit | `contact.error.unauthorized` | Fallback gửi dưới vai trò GUEST | `CONTACT_AUTH_EXPIRED` |
| `422` | Thông tin form không hợp lệ (Email sai định dạng, tin nhắn <10 ký tự) | `contact.error.validation_failed` | Đánh dấu viền đỏ trường nhập lỗi | `CONTACT_VALIDATION_ERROR` |
| `429` | Gửi quá 3 tin nhắn trong vòng 5 phút | `contact.error.rate_limit` | Khóa nút gửi kèm đếm ngược 60s | `CONTACT_RATE_LIMITED` |
| `500` | Serverpod Backend lỗi khi lưu ticket | `contact.error.server_error` | Hiển thị thông báo lưu tạm offline | `CONTACT_SERVER_ERROR` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: Guest submits contact form successfully
  Given a user on "/contact"
  When filling valid Name, Email, Category "Technical Support" and a message
  And clicking "[Gửi Yêu Cầu Liên Hệ]"
  Then `WorkspaceEndpoint.submitContactEnquiry()` receives the payload
  And a success badge "[Yêu cầu đã được tiếp nhận]" is displayed on screen

Scenario: Form validates invalid email inputs
  Given a user enters an invalid email format "user@"
  When the user blurs the input field
  Then an inline error message "[Email không đúng định dạng]" is displayed
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`<form role="form" aria-labelledby="contact-heading">`).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.

