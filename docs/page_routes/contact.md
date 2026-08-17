<!-- Target FE Component: apps/web/src/features/contact/ContactPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/contact -->

# Contact Page Route Specification (`contact.md`)

> **Route ID**: `CONTACT_MAIN`  
> **Route Name**: `contact.main`  
> **Route Path**: `/contact`  
> **Route Type**: `PUBLIC`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `CONTACT_MAIN` (Dùng cho Analytics, Breadcrumb, Logging, Event Tracking, RBAC)
- **Route Name**: `contact.main`
- **Description**: Trang Liên hệ (`/contact`) cung cấp form phản hồi, hỗ trợ kỹ thuật và thông tin liên lạc chính thức của nodetask cho người dùng và đối tác.

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/contact`
- **Access Type**: `PUBLIC`
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

## 3. SEO & Social Share Metadata (SEO Meta Specification)
- **Title Tag**: `<title>Contact Us - nodetask Support & Feedback</title>`
- **Meta Description**: `Gửi phản hồi, yêu cầu hỗ trợ hoặc câu hỏi hợp tác cho đội ngũ nodetask.`
- **Keywords**: `nodetask contact, support, feedback, enquiry`
- **Canonical URL**: `/#/contact`
- **OpenGraph Specification**:
  - `og:title`: `Contact Support - nodetask`
  - `og:description`: `Gửi thắc mắc hoặc yêu cầu hỗ trợ kỹ thuật nodetask.`
  - `og:image`: `/og-contact.png`
  - `og:type`: `website`
- **Twitter Card Specification**:
  - `twitter:card`: `summary`
  - `twitter:title`: `Contact Us - nodetask`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/contact/ContactPage'))`)
- **Preload Strategy**: `onHover`
- **Chunk Name**: `chunk-contact`
- **Priority**: `MEDIUM`

---

## 5. Permission Matrix & Access Control (Access Control & RBAC Permissions)
| System Role | View Access | Form Submit Rights | Notes |
| :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Gửi form liên hệ kèm captcha/rate-limit | Mọi đối tượng |
| `USER` | **Allowed** | Gửi form với thông tin email tự điền | Người dùng cá nhân |
| `ORG_MEMBER` | **Allowed** | Gửi form hỗ trợ tổ chức | Thành viên tổ chức |
| `ORG_ADMIN` | **Allowed** | Gửi form ưu tiên | Quản trị viên |
| `SYSTEM_ADMIN` | **Allowed** | Gửi form trực tiếp | Admin hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `ContactEndpoint.submitEnquiry(session, input: ContactFormDto)`: Nhận thông tin liên hệ và lưu log hỗ trợ.
- **Data Caching & Stale Policy**:
  - `staleTime`: `0ms`.
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `TYPING` → `SUBMITTING` → `SUCCESS` (Show Feedback Banner) | `ERROR`
- **UI State Breakdown**:
  - `IDLE`: Form sẵn sàng nhập Name, Email, Subject, Message.
  - `SUBMITTING`: Nút Submit hiển thị `[Sending...]`.
  - `SUCCESS`: Hiển thị "Cảm ơn bạn đã gửi liên hệ. Đội ngũ nodetask sẽ phản hồi sớm nhất."

---

## 8. Component Inventory & Tree

### Component Inventory List
- `PublicLayoutShell`: Organism bọc giao diện công khai.
- `ContactFormCard`: Container card bọc form liên hệ.
- `ZeroIconSelect`: Custom Molecule dropdown chọn chủ đề liên hệ (Chống chói màu native OS & 100% Zero-Icon).
- `MessageTextarea`: Atom textarea nhập nội dung (Khóa resize tự do `resize-none`, bounded `min-h-[140px] max-h-[220px]`).
- `SubmitButton`: Button atom gửi form.

### Component Tree
```text
[ContactPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
└── [MainContent id="main-content" role="main"]
    └── [ContactFormCard maxWidth="650px"]
        ├── [FormTitle contentKey="contact.title"]
        ├── [ContactForm onSubmit=handleContactSubmit]
        │   ├── [NameInput]
        │   ├── [EmailInput]
        │   ├── [ZeroIconSelect options=subjectOptions]
        │   ├── [MessageTextarea resize="none" max-h="220px"]
        │   └── [SubmitButton disabled=loading]
        └── [ContactInfoBlock]
```


---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `422` | Thông tin form không đầy đủ | `contact.error.validation_failed` | Highlight trường bị thiếu | `CONTACT_VALIDATION_ERROR` |
| `429` | Gửi quá 3 tin nhắn / phút | `contact.error.rate_limit` | Cooldown 60s | `CONTACT_RATE_LIMITED` |
| `500` | Lỗi gửi ticket ở Backend | `contact.error.server_error` | Banner báo lỗi hệ thống | `CONTACT_SERVER_ERROR` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: Guest submits contact form
  Given a user on "/contact"
  When filling name, email, subject, message and clicking Submit
  Then `ContactEndpoint.submitEnquiry()` receives the payload
  And a success message is displayed on screen
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`role="form"`).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.
