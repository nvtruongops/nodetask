<!-- Target FE Component: apps/web/src/features/security/SecurityPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/security -->

# Public Security & Trust Center Page Route Specification (`security.md`)

> **Route ID**: `PUBLIC_SECURITY`  
> **Route Name**: `public.security`  
> **Route Path**: `/security`  
> **Route Type**: `PUBLIC`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

## 1. Overview & Route ID
- **Route ID**: `PUBLIC_SECURITY` (Dùng cho Analytics, Compliance Audit, Brand Trust, RBAC)
- **Route Name**: `public.security`
- **Description**: Trang An toàn Thông tin & Trung tâm Tin cậy (`/security`). Cung cấp thông tin minh bạch về kiến trúc bảo mật của nodetask: Mã hóa dữ liệu (TLS 1.3 in-transit, AES-256 at-rest), Kiến trúc lưu trữ PostgreSQL + pgvector cách ly Multi-tenant, Quy trình sao lưu dữ liệu tự động, Tiêu chuẩn tuân thủ bảo mật và Chương trình báo cáo lỗ hổng an ninh (Vulnerability Disclosure Program).

---

## 2. Route Config & Navigation Metadata
- **URL Path**: `/security`
- **Access Type**: `PUBLIC`
- **Page Archetype**: `Documentation & Legal Spec`
- **Auth Guard**: `None`
- **Layout Shell**: `PublicLayoutShell`
- **Navigation Metadata**:
  - `sidebar`: `false`
  - `header`: `true`
  - `footer`: `true`
  - `breadcrumb`: `true`
  - `searchable`: `true`
  - `navOrder`: `5`
  - `navGroup`: `"marketing"`

---

## 3. SEO & Social Meta Specification
- **Title Tag**: `<title>Security & Trust Center - nodetask</title>`
- **Meta Description**: `Tìm hiểu cam kết bảo mật thông tin, mã hóa dữ liệu và trung tâm tin cậy nodetask.`
- **Keywords**: `nodetask security, trust center, data encryption, compliance, vulnerability disclosure`
- **Canonical URL**: `/#/security`
- **OpenGraph Specification**:
  - `og:title`: `Security & Trust Center - nodetask`
  - `og:description`: `Kiến trúc bảo mật & cam kết an toàn thông tin nodetask.`
  - `og:image`: `/og-security.png`
  - `og:type`: `website`
  - `og:url`: `/#/security`
- **Twitter Card Specification**:
  - `twitter:card`: `summary_large_image`
  - `twitter:title`: `Security & Trust Center - nodetask`
  - `twitter:description`: `Security standards and data protection commitments.`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/security/SecurityPage'))`)
- **Preload Strategy**: `onHover` (Preload khi hover vào link Security từ Footer Navigation)
- **Chunk Name**: `chunk-public-security`
- **Priority**: `HIGH`

---

## 5. Permission Matrix & RBAC
| System Role | View Access | Form Submit Rights | Redirect Policy | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Gửi báo cáo lỗ hổng | Giữ tại trang | Xem thông tin bảo mật |
| `USER` | **Allowed** | Gửi báo cáo lỗ hổng | Giữ tại trang | Người dùng cá nhân |
| `ORG_MEMBER` | **Allowed** | Gửi báo cáo lỗ hổng | Giữ tại trang | Thành viên tổ chức |
| `ORG_ADMIN` | **Allowed** | Gửi báo cáo lỗ hổng | Giữ tại trang | Quản trị viên tổ chức |
| `SYSTEM_ADMIN` | **Allowed** | Gửi báo cáo lỗ hổng | Giữ tại trang | Quản trị hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `WorkspaceEndpoint.getSecurityComplianceReport(session)`: Lấy dữ liệu báo cáo tuân thủ an ninh thông tin công khai.
- **Data Caching & Stale Policy**:
  - `staleTime`: `86400000ms` (24 giờ - thông tin tài liệu bảo mật ít thay đổi).
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `SWITCHING_SECTION` → `SUBMITTING_REPORT` → `REPORT_SENT`
- **UI State Breakdown**:
  - `IDLE`: Hiển thị tổng quan các trụ cột bảo mật (Encryption, Multi-tenant Isolation, Backup, Compliance Status `[SOON / COMPLIANT]`).
  - `SWITCHING_SECTION`: Người dùng cuộn hoặc nhấp chọn các tab điều hướng nội dung bảo mật.
  - `SUBMITTING_REPORT`: Người dùng gửi mẫu báo cáo phát hiện lỗ hổng an ninh.
  - `REPORT_SENT`: Thông báo đã tiếp nhận báo cáo bảo mật thành công.

---

## 8. Component Inventory & Tree

### Component Inventory List
- `PublicLayoutShell`: Shell khung giao diện công khai tiêu chuẩn.
- `SecurityHeroHeader`: Component tiêu đề Security Center và badge trạng thái tuân thủ `[TRUST CENTER]`.
- `SecurityPillarGrid`: Grid 4 cột chứa các trụ cột bảo mật (Data Encryption, Access Control, Infrastructure, Compliance).
- `ComplianceBadgeList`: Danh sách nhãn chứng nhận tuân thủ dạng text label `[GDPR COMPLIANT]`, `[SOC2 TYPE II - SOON]`.
- `VulnerabilityReportForm`: Form gửi báo cáo lỗ hổng an toàn thông tin cho Security Team.

### Required Pattern Components
- `Required Pattern Components`: `PublicLayoutShell`, `SecurityHeroHeader`, `SecurityPillarGrid`, `ComplianceBadgeList`

### Route Anti-Patterns
- `Route Anti-Patterns`: Tuyệt đối không dùng icon khiên bảo vệ hay emoji; thể hiện nhãn chứng nhận dạng text badge monochrome.

### Component Tree
```text
[SecurityPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
└── [MainContent id="main-content" alignment="center"]
    ├── [SecurityHeroHeader]
    │   ├── [Title contentKey="security.title"]
    │   ├── [Subtitle contentKey="security.subtitle"]
    │   └── [ComplianceBadgeList label="[TRUST CENTER & SECURITY]"]
    ├── [SecurityPillarGrid columns=2]
    │   ├── [SecurityPillarCard title="Data Encryption" details="TLS 1.3 & AES-256"]
    │   ├── [SecurityPillarCard title="Multi-tenant Isolation" details="PostgreSQL Row-Level Security"]
    │   ├── [SecurityPillarCard title="Automated Backups" details="Daily WAL Archiving"]
    │   └── [SecurityPillarCard title="Audit Logging" details="Immutable Audit Trail"]
    └── [VulnerabilityReportSection]
        ├── [SectionTitle contentKey="security.vulnerability.title"]
        └── [VulnerabilityReportForm onSubmit=handleReportSubmit]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Session hết hạn khi gửi báo cáo lỗ hổng | `security.error.session_expired` | Yêu cầu đăng nhập | `SECURITY_SESSION_EXPIRED` |
| `422` | Mẫu báo cáo lỗ hổng thiếu thông tin POC | `security.error.invalid_report` | Yêu cầu bổ sung chi tiết | `SECURITY_INVALID_REPORT` |
| `429` | Gửi báo cáo lỗ hổng dồn dập quá 5 lần/giờ | `security.error.rate_limit` | Khóa tạm thời 1 giờ | `SECURITY_RATE_LIMIT` |
| `500` | Lỗi máy chủ khi lưu báo cáo an ninh | `security.error.server_error` | Thử lại sau | `SECURITY_SERVER_ERROR` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: Visitor reads security compliance standards
  Given a Guest user navigating to "/security"
  When the page loads successfully
  Then all security pillars display details without graphical icon dependencies
  And ComplianceBadgeList shows text labels "[GDPR COMPLIANT]" and "[SOC2 TYPE II - SOON]"

Scenario: Security researcher submits vulnerability report
  Given a user on "/security" page filling the VulnerabilityReportForm
  When submitting valid proof-of-concept details
  Then the system calls `WorkspaceEndpoint.getSecurityComplianceReport()`
  And displays confirmation message "[Security Report Received]"
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`role="region"`, `aria-labelledby="security-heading"`).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.
