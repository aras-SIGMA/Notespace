# Design System Specification

## 1. Overview and Aesthetic Direction

- **Style Archetype**: Modern Clean SaaS / Productivity Dashboard
- **Core Mood**: Professional, Crisp, Organized, Minimalist
- **Primary Viewport & Density**: Responsive Desktop & Mobile (Default Spacious Grid)

## 2. Color Palette (Semantic Tokens)

| Token Name              | Approximate Value | Role / Usage                                |
| :---------------------- | :---------------- | :------------------------------------------ |
| `color-bg-base`         | `#F8FAFC`         | Latar belakang utama halaman aplikasi       |
| `color-surface-card`    | `#FFFFFF`         | Permukaan kartu catatan, form, dan panel    |
| `color-surface-sidebar` | `#FFFFFF`         | Latar sidebar navigasi / shell              |
| `color-surface-border`  | `#E2E8F0`         | Garis tepi kartu, divider, dan input        |
| `color-primary`         | `#3B82F6`         | Aksi utama, tombol submit, active state     |
| `color-primary-hover`   | `#2563EB`         | Status hover tombol utama                   |
| `color-primary-light`   | `#EFF6FF`         | Background active menu & badge biru         |
| `color-text-main`       | `#0F172A`         | Teks judul catatan dan heading              |
| `color-text-muted`      | `#64748B`         | Tanggal catatan, placeholder, teks sekunder |
| `color-status-danger`   | `#EF4444`         | Pesan validasi error dan tombol hapus       |
| `color-status-success`  | `#10B981`         | Status valid dan indikator sukses           |
| `color-badge-bg`        | `#F1F5F9`         | Latar tag badge catatan                     |

## 3. Typography

- **Font Family**:
  - Primary: `'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
- **Type Scale**:
  - `Display / H1`: `28px` (font-weight: 700, line-height: 1.2)
  - `Heading / H2`: `20px` (font-weight: 600, line-height: 1.3)
  - `Subheading / H3`: `16px` (font-weight: 600, line-height: 1.4)
  - `Body Regular`: `14px` (font-weight: 400, line-height: 1.6)
  - `Caption / Small`: `12px` (font-weight: 500, line-height: 1.4)

## 4. Spacing and Layout Architecture

- **Base Grid Unit**: 4px / 8px scale
  - `space-xs`: 4px
  - `space-sm`: 8px
  - `space-md`: 16px
  - `space-lg`: 24px
  - `space-xl`: 32px
- **Layout Shell**:
  - Sidebar samping desktop: `260px` fixed / collapsible pada mobile
  - Header / Topbar: `64px` height dengan search bar & profile
  - Notes Grid: `display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;`

## 5. Shape, Elevation, and Borders

- **Border Radii**:
  - Inputs & Buttons: `8px`
  - Cards & Panels: `14px`
  - Badges & Pills: `9999px`
- **Borders**: `1px solid var(--color-surface-border)`
- **Shadows / Elevation**:
  - Subtle Card: `0 1px 3px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.03)`
  - Elevated Modal/Hover: `0 10px 25px -5px rgba(15, 23, 42, 0.08)`

## 6. Generic Component Specifications

### Action Buttons

- **Primary**: Background `#3B82F6`, text `#FFFFFF`, border-radius `8px`, font-weight `600`, padding `10px 18px`.
- **Secondary / Ghost**: Background `transparent`, border `1px solid #E2E8F0`, text `#0F172A`.

### Form Controls

- **Inputs & Textarea**: Background `#FFFFFF`, border `1px solid #E2E8F0`, radius `8px`, padding `10px 14px`.
- **Focus State**: `outline: 2px solid #3B82F6; border-color: transparent;`
- **Invalid State**: `outline: 2px solid #EF4444; border-color: #EF4444;`

### Note Cards

- Background `#FFFFFF`, border `1px solid #E2E8F0`, padding `20px`, border-radius `14px`.
- Transisi hover halus: `translateY(-2px)`, shadow meningkat.
