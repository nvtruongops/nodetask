# User Design Preferences Service Specification (`design_preferences.md`)

> **Service**: `User Design Preferences Service`  
> **Package**: `apps/server/lib/src/endpoints/design_preferences_endpoint.dart`  
> **Specification Version**: `2.0.0`  
> **Status**: `APPROVED`  

---

### 1. Overview
Dịch vụ User Design Preferences Service chịu trách nhiệm quản lý toàn bộ cấu hình giao diện cá nhân hóa theo mô hình **Design Preferences Architecture** cho nền tảng `nodetask`. Dịch vụ bảo tốn tuyệt đối triết lý tối giản Monochrome Zero-Icon, không sử dụng màu sắc sặc sỡ mà quản lý 5 nhóm tùy chọn kỹ thuật nhóm gọn (Grouped DTOs): Appearance, Typography, Layout, Accessibility, Code Theme, cùng hệ thống Quản lý Preset Profiles động hỗ trợ tạo Preset tùy chỉnh cá nhân.

---

### 2. Endpoints
Hợp đồng giao tiếp qua Serverpod RPC Endpoint Methods:
- `DesignPreferencesEndpoint.getPreferences(Session session)`
- `DesignPreferencesEndpoint.updatePreferences(Session session, UpdatePreferencesInput input)`
- `DesignPreferencesEndpoint.listPresets(Session session)`
- `DesignPreferencesEndpoint.getPreset(Session session, String presetId)`
- `DesignPreferencesEndpoint.createCustomPreset(Session session, CreatePresetInput input)`
- `DesignPreferencesEndpoint.updateCustomPreset(Session session, UpdatePresetInput input)`
- `DesignPreferencesEndpoint.deleteCustomPreset(Session session, String presetId)`
- `DesignPreferencesEndpoint.applyPreset(Session session, String presetId)`
- `DesignPreferencesEndpoint.resetToDefault(Session session)`

---

### 3. Request
Cấu trúc Request DTOs (Grouped Architecture):

```typescript
type ThemeAppearance = 'light' | 'dark' | 'system';
type ThemeTypography = 'mono' | 'sans' | 'serif';
type LayoutDensity = 'compact' | 'comfortable' | 'relaxed';
type LayoutRadius = 'sharp' | 'small' | 'medium' | 'large';
type LayoutBorder = 'none' | 'thin' | 'medium' | 'heavy';
type LayoutReadingWidth = '72ch' | '80ch' | '90ch' | 'full';
type AccessibilityMotion = 'off' | 'reduced' | 'normal' | 'fast';
type AccessibilityContrast = 'normal' | 'high';
type AccessibilityFontScale = 'small' | 'normal' | 'large' | 'xl';
type CodeTheme = 'github' | 'vscodedark' | 'monokai' | 'onedark';

interface UpdateLayoutPreferences {
  density?: LayoutDensity;
  radius?: LayoutRadius;
  border?: LayoutBorder;
  readingWidth?: LayoutReadingWidth;
}

interface UpdateAccessibilityPreferences {
  motion?: AccessibilityMotion;
  contrast?: AccessibilityContrast;
  fontScale?: AccessibilityFontScale;
}

interface UpdatePreferencesInput {
  appearance?: ThemeAppearance;
  typography?: ThemeTypography;
  layout?: UpdateLayoutPreferences;
  accessibility?: UpdateAccessibilityPreferences;
  codeTheme?: CodeTheme;
}

interface CreatePresetInput {
  name: string;
  description?: string;
  config: UpdatePreferencesInput;
}

interface UpdatePresetInput {
  presetId: string;
  name?: string;
  description?: string;
  config?: UpdatePreferencesInput;
}
```

---

### 4. Response
Cấu trúc Response DTOs:

```typescript
interface LayoutPreferences {
  density: LayoutDensity;
  radius: LayoutRadius;
  border: LayoutBorder;
  readingWidth: LayoutReadingWidth;
}

interface AccessibilityPreferences {
  motion: AccessibilityMotion;
  contrast: AccessibilityContrast;
  fontScale: AccessibilityFontScale;
}

interface DesignPreferencesResponse {
  userId: string;
  appearance: ThemeAppearance;
  typography: ThemeTypography;
  layout: LayoutPreferences;
  accessibility: AccessibilityPreferences;
  codeTheme: CodeTheme;
  activePresetId?: string | null;
  updatedAt: string;
}

interface DesignPresetProfile {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean; // System preset vs User custom preset
  order: number;
  config: DesignPreferencesResponse;
  ownerId?: string | null;
  createdAt: string;
}
```

---

### 5. Validation
Quy tắc kiểm tra dữ liệu đầu vào (Dart & Serverpod Trust Boundary):
- `appearance`: Optional, enum `'light' | 'dark' | 'system'`.
- `typography`: Optional, enum `'mono' | 'sans' | 'serif'`.
- `density`: Optional, enum `'compact' | 'comfortable' | 'relaxed'`.
- `radius`: Optional, enum `'sharp' | 'small' | 'medium' | 'large'`.
- `border`: Optional, enum `'none' | 'thin' | 'medium' | 'heavy'`.
- `readingWidth`: Optional, enum `'72ch' | '80ch' | '90ch' | 'full'`.
- `motion`: Optional, enum `'off' | 'reduced' | 'normal' | 'fast'`.
- `contrast`: Optional, enum `'normal' | 'high'`.
- `fontScale`: Optional, enum `'small' | 'normal' | 'large' | 'xl'`.
- `codeTheme`: Optional, enum `'github' | 'vscodedark' | 'monokai' | 'onedark'`.
- `presetId`: Optional, valid UUID or system slug (`'developer' | 'writer' | 'researcher'`).

---

### 6. Permissions
Ma trận Phân quyền Truy cập & Tài nguyên (RBAC Matrix):

| System / Resource Role | Đọc Preferences (`getPreferences`) | Đổi Preferences (`updatePreferences`) | Tạo/Sửa Preset Cá nhân | Sửa System Presets | Quản trị Hệ thống |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GUEST` (Chưa đăng nhập) | ✅ (Local Storage Client) | ❌ (Chỉ lưu Local) | ❌ | ❌ | ❌ |
| `USER` (Thành viên Cá nhân) | ✅ | ✅ | ✅ (Chỉ Preset của mình) | ❌ | ❌ |
| `ORG_MEMBER` (Thành viên Org) | ✅ | ✅ | ✅ | ❌ | ❌ |
| `ORG_ADMIN` (Quản trị Org) | ✅ | ✅ | ✅ | ❌ | ❌ |
| `SYSTEM_ADMIN` (Quản trị Hệ thống) | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### 7. Errors
Mã lỗi chuẩn hóa trả về khi thao tác thất bại:

| Error Code Constant | HTTP Status | Nguyên nhân |
| :--- | :--- | :--- |
| `PREFERENCES_INVALID_VALUE` | `400` | Giá trị tùy chọn giao diện vi phạm danh mục enum cho phép. |
| `PRESETS_NOT_FOUND` | `404` | Mã Preset Profile không tồn tại trong hệ thống. |
| `PRESETS_FORBIDDEN` | `403` | Không có quyền sửa hoặc xóa System Preset Profile. |
| `PREFERENCES_UNAUTHORIZED` | `401` | Session token hết hạn khi lưu tùy chọn lên server. |
| `PREFERENCES_SYNC_FAILED` | `500` | Không thể ghi cache Redis hoặc phát sự kiện đồng bộ. |

---

### 8. Events
Danh sách sự kiện phát qua Serverpod Streaming Connection:
- `design_preferences.updated`: Phát khi người dùng cập nhật tùy chọn thiết kế trên một thiết bị (gửi kèm `userId` và payload `DesignPreferencesResponse`) để các phiên làm việc khác của cùng user tự động đồng bộ tức thì.

---

### 9. Cache (TTL & Invalidation Rules)

#### Server-side Redis Cache Policy
- **Redis Cache Key**: `design_prefs:{userId}`
- **TTL Policy**: **365 Days** (`31536000` seconds) / Persistent Config Cache + Event-Driven Purge.
- **Cache Invalidation Rule**: Xóa và ghi đè Redis Key `design_prefs:{userId}` lập tức khi gọi `updatePreferences`, `applyPreset` hoặc `resetToDefault`.

#### Client-side Store Strategy
- **Zustand Store**: `useThemeStore` quản lý trạng thái local, đồng bộ 2 chiều với Serverpod Backend & `localStorage` (`nodetask_design_preferences`).

---

### 10. Examples
Code mẫu Request & Response:

```typescript
// 1. Fetch User Design Preferences
const prefs = await client.designPreferences.getPreferences();

// 2. Update Grouped Preferences (e.g. Developer Layout & High Contrast)
const updatedPrefs = await client.designPreferences.updatePreferences({
  appearance: "dark",
  typography: "mono",
  layout: {
    density: "compact",
    radius: "sharp",
    border: "thin",
    readingWidth: "full"
  },
  accessibility: {
    motion: "normal",
    contrast: "high",
    fontScale: "normal"
  },
  codeTheme: "onedark"
});

// 3. Create Custom Preset Profile
const newPreset = await client.designPreferences.createCustomPreset({
  name: "My Focused IDE",
  description: "Compact Mono Dark setup for high-speed coding",
  config: updatedPrefs
});

// 4. Apply System or Custom Preset Profile
const appliedPrefs = await client.designPreferences.applyPreset("writer");
```
