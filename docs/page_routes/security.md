<!-- Target FE Component: apps/web/src/features/security/SecurityPage.tsx -->
<!-- Target Runtime URL: http://localhost:5173/#/security -->

# Public Security & Trust Center Page Route Specification (`security.md`)

> **Route ID**: `PUBLIC_SECURITY`  
> **Route Name**: `public.security`  
> **Route Path**: `/security`  
> **Route Type**: `PUBLIC`  
> **Page Archetype**: `Documentation & Legal Spec`  
> **Layout Shell**: `PublicLayoutShell`  
> **Specification Version**: `2.1.0`  
> **Status**: `APPROVED & ENFORCED`  

---

## 1. Overview & Route ID
- **Route ID**: `PUBLIC_SECURITY` (Dùng cho Analytics, Compliance Audit, Brand Trust, RBAC)
- **Route Name**: `public.security`
- **Description**: Trang An toàn Thông tin & Trung tâm Tin cậy (`/security`) là tài liệu kỹ thuật công khai chi tiết về **Kiến trúc Phòng thủ Đa tầng (Defense-in-Depth Architecture)** và các tiêu chuẩn bảo vệ dữ liệu của `nodetask`:
  1. **The 6 Pillars of Security**:
     - *Mã hóa Toàn diện*: TLS 1.3 trên đường truyền (In-transit) và AES-256-GCM ở trạng thái lưu trữ (At-rest).
     - *Cách ly Dữ liệu Multi-Tenant Chặt chẽ*: Kiểm soát truy cập phân tầng PostgreSQL Row-Level Security theo Workspace và Tổ chức.
     - *Cam kết Bảo mật AI & Vector Embeddings*: Vector `pgvector` HNSW chỉ phục vụ truy vấn cục bộ của người dùng, 100% không dùng để huấn luyện mô hình AI công cộng.
     - *Kiểm soát Phiên bản Bất biến (OCC Snapshots)*: Lưu vết lịch sử sửa đổi kèm mã băm SHA-256 chống giả mạo.
     - *Kiểm thử An ninh Tự động (Continuous Pentest)*: Tích hợp bộ quy tắc quét lỗ hổng theo tiêu chuẩn OWASP API Security Top 10.
     - *Chương trình Công bố Lỗ hổng Trách nhiệm (VDP)*: Chính sách Safe Harbor dành cho các nhà nghiên cứu bảo mật.
  2. **Enterprise Compliance Readiness**: Trình bày rõ ràng lộ trình tuân thủ tiêu chuẩn GDPR, SOC2 Type II và ISO 27001.

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

## 3. SEO & Social Meta Specification (SEO & Social Share Metadata)
- **Title Tag**: `<title>Security & Trust Center - nodetask</title>`
- **Meta Description**: `Tìm hiểu kiến trúc bảo mật đa tầng, mã hóa dữ liệu AES-256/TLS 1.3 và cam kết bảo vệ tri thức của nodetask.`
- **Keywords**: `nodetask security, trust center, data encryption, pgvector security, multi-tenant isolation, vulnerability disclosure program, compliance GDPR`
- **Canonical URL**: `/#/security`
- **OpenGraph Specification**:
  - `og:title`: `Security & Trust Center - nodetask`
  - `og:description`: `Kiến trúc an ninh thông tin và các tiêu chuẩn bảo vệ dữ liệu nodetask.`
  - `og:image`: `/og-security.png`
  - `og:type`: `article`
  - `og:url`: `/#/security`
- **Twitter Card Specification**:
  - `twitter:card`: `summary_large_image`
  - `twitter:title`: `Security Standards - nodetask`
  - `twitter:description`: `Enterprise-grade encryption and privacy protection.`
  - `twitter:image`: `/og-security.png`

---

## 4. Loading Strategy & Code Splitting
- **Lazy Load**: `true` (`React.lazy(() => import('@/features/security/SecurityPage'))`)
- **Preload Strategy**: `onHover` (Preload khi hover vào link Security từ Footer Navigation)
- **Chunk Name**: `chunk-public-security`
- **Priority**: `HIGH`

---

## 5. Permission Matrix & RBAC (Access Control & RBAC Permissions)
| System Role | View Access | Form Submit Rights | Redirect Policy | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `GUEST` | **Allowed** | Gửi báo cáo lỗ hổng VDP | Giữ tại trang | Xem tài liệu bảo mật |
| `USER` | **Allowed** | Gửi báo cáo lỗ hổng VDP | Giữ tại trang | Người dùng cá nhân |
| `ORG_MEMBER` | **Allowed** | Gửi báo cáo lỗ hổng VDP | Giữ tại trang | Thành viên tổ chức |
| `ORG_ADMIN` | **Allowed** | Gửi báo cáo lỗ hổng VDP | Giữ tại trang | Quản trị viên tổ chức |
| `SYSTEM_ADMIN` | **Allowed** | Xem toàn bộ báo cáo quét an ninh | Giữ tại trang | Quản trị hệ thống |

---

## 6. API Dependency & Serverpod RPC
- **Linked Backend RPC Endpoints**:
  - `I18nEndpoint.getDictionary(locale: String, namespace: 'security')`: Tải từ điển đa ngôn ngữ cho tài liệu bảo mật.
  - `WorkspaceEndpoint.getSecurityComplianceReport(session)`: Lấy dữ liệu báo cáo tuân thủ an ninh thông tin công khai.
- **Serverpod Architecture Reference**: Hệ thống RPC tuân thủ mã hóa SSL/TLS và xác thực token JWT phân tầng qua Serverpod Auth Module.
- **Data Caching & Stale Policy**:
  - `staleTime`: `86400000ms` (24 giờ - thông tin tài liệu bảo mật ít thay đổi).
  - `refetchOnWindowFocus`: `false`.

---

## 7. Page State Machine & UI Transitions
- **State Machine Flow**:
  `IDLE` → `SWITCHING_SECTION` → `SUBMITTING_REPORT` → `REPORT_SENT`
- **UI State Breakdown**:
  - `IDLE`: Hiển thị 6 Trụ cột bảo mật (Encryption, Isolation, Vector Privacy, Audit Trail, Pentest, VDP).
  - `SWITCHING_SECTION`: Người dùng cuộn hoặc nhấp chọn các tab điều hướng nội dung bảo mật.
  - `SUBMITTING_REPORT`: Người dùng gửi mẫu báo cáo phát hiện lỗ hổng an ninh VDP.
  - `REPORT_SENT`: Thông báo đã tiếp nhận báo cáo bảo mật thành công kèm mã tham chiếu ticket.

---

## 8. Component Inventory & Tree

### Required Pattern Components (MUST)
- `Required Pattern Components`: `Hero`, `SecurityPillarGrid`, `ComplianceBadgeList`, `VulnerabilityReportForm`, `SpecificationPanel`, `Footer`

### Route Anti-Patterns (MUST NOT)
- `Route Anti-Patterns`:
  - ❌ Dùng icon khiên bảo vệ, chìa khóa hoặc emoji — bắt buộc thể hiện nhãn chứng nhận dạng text badge monochrome `[TLS 1.3]`, `[AES-256]`, `[GDPR COMPLIANT]`.
  - ❌ Thiếu bảng phân tích mô hình đe dọa (Threat Model & Mitigations).

### Editorial Sections & Security Architecture Breakdown
1. **Security Hero Header**:
   - *Headline*: "An toàn Dữ liệu và Quyền riêng tư là Nền tảng Kiến trúc, không phải Tính năng bổ sung."
   - *Subheading*: "Mọi nốt tài liệu, đoạn vector embeddings và tệp tin đính kèm của bạn đều được bảo vệ bởi các tiêu chuẩn mật mã học hiện đại nhất."
   - *Trust Badges*: `[TLS 1.3 IN-TRANSIT]` • `[AES-256 AT-REST]` • `[ZERO AI TRAINING]`.
2. **6 Pillars of Defense Grid**:
   - *01. Mã hóa Toàn chu trình*: TLS 1.3 cho toàn bộ kết nối RPC Serverpod. Dữ liệu đĩa cứng mã hóa AES-256-GCM.
   - *02. Cách ly Phân quyền Multi-tenant*: Phân tách hoàn toàn không gian làm việc giữa các tổ chức thông qua PostgreSQL Row-Level Security.
   - *03. Quyền riêng tư AI*: Vector embeddings 1536 chiều được tính toán và lưu cục bộ trong DB của bạn. Không bao giờ gửi dữ liệu để train AI nền tảng khác.
   - *04. Toàn vẹn Dữ liệu & OCC Snapshots*: Kiểm soát xung đột ghi đè đồng thời và tính toán mã băm SHA-256 trên từng tệp đính kèm.
   - *05. Kiểm tra Lỗ hổng Tự động (Pentest)*: Chạy kiểm thử tự động quét các lỗi bảo mật BOLA/IDOR và Injection.
   - *06. Vulnerability Disclosure Program (VDP)*: Tiếp nhận báo cáo và xử lý phản hồi trong vòng 48 giờ đối với các phát hiện an ninh nghiêm trọng.

### Component Tree
```text
[SecurityPageContainer]
├── [SkipToContentLink target="#main-content"]
├── [PublicHeader]
└── [MainContent id="main-content" alignment="center"]
    ├── [SecurityHeroHeader]
    │   ├── [Title contentKey="security.title"]
    │   ├── [Subtitle contentKey="security.subtitle"]
    │   └── [ComplianceBadgeList label="[TRUST CENTER & SECURITY ARCHITECTURE]"]
    ├── [SecurityPillarGrid columns=2]
    │   ├── [SecurityPillarCard title="Data Encryption" details="TLS 1.3 & AES-256-GCM"]
    │   ├── [SecurityPillarCard title="Multi-tenant Isolation" details="PostgreSQL Row-Level Security"]
    │   ├── [SecurityPillarCard title="AI Vector Privacy" details="Isolated Tenant Embeddings"]
    │   ├── [SecurityPillarCard title="Audit & OCC Snapshots" details="SHA-256 Immutable Versions"]
    │   ├── [SecurityPillarCard title="Continuous Pentest" details="OWASP Top 10 Automated Fuzzing"]
    │   └── [SecurityPillarCard title="Vulnerability Program" details="Safe Harbor Disclosure"]
    ├── [ThreatMitigationSpecificationPanel]
    └── [VulnerabilityReportSection]
        ├── [SectionTitle contentKey="security.vulnerability.title"]
        └── [VulnerabilityReportForm onSubmit=handleReportSubmit]
```

---

## 9. Error Mapping & Handling
| Status Code | Trigger Condition | UI Error Content Key | Recovery Action | Logging Tag |
| :--- | :--- | :--- | :--- | :--- |
| `401` | Session hết hạn khi gửi báo cáo lỗ hổng | `security.error.session_expired` | Cho phép gửi dưới danh nghĩa ẩn danh | `SECURITY_SESSION_EXPIRED` |
| `422` | Mẫu báo cáo lỗ hổng thiếu thông tin POC | `security.error.invalid_report` | Yêu cầu bổ sung chi tiết các bước tái hiện | `SECURITY_INVALID_REPORT` |
| `429` | Gửi báo cáo lỗ hổng dồn dập quá 5 lần/giờ | `security.error.rate_limit` | Khóa tạm thời 1 giờ | `SECURITY_RATE_LIMIT` |
| `500` | Lỗi máy chủ khi lưu báo cáo an ninh | `security.error.server_error` | Thử lại sau | `SECURITY_SERVER_ERROR` |

---

## 10. Acceptance Criteria & QA Scenarios

```gherkin
Scenario: Visitor reads security compliance standards
  Given a Guest user navigating to "/security"
  When the page loads successfully
  Then all 6 security pillars display technical details without graphical icons
  And ComplianceBadgeList shows text labels "[GDPR COMPLIANT]" and "[SOC2 TYPE II - SOON]"

Scenario: Security researcher submits vulnerability report
  Given a user on "/security" page filling the VulnerabilityReportForm
  When submitting valid proof-of-concept details
  Then the system calls `WorkspaceEndpoint.getSecurityComplianceReport()`
  And displays confirmation badge "[Báo cáo bảo mật đã tiếp nhận]"
```

---

## Accessibility (a11y) & Design Tokens
- **a11y Standard**: WAI-ARIA 1.2 (`role="region"`, `aria-labelledby="security-heading"`).
- **Design Tokens**: `themeMode: 'dark-only'`, `radius: 0px`, `colorScheme: 'monochrome'`.

