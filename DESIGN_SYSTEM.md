# Water Filtration Plant Delivery System
## Design System & Style Guide v1.0

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Component Naming Convention](#component-naming-convention)
6. [Component Specifications](#component-specifications)
7. [Layout Guidelines](#layout-guidelines)
8. [Usage Examples](#usage-examples)

---

## 🎨 Overview

This design system provides a comprehensive set of guidelines, components, and tokens for building consistent, accessible, and beautiful interfaces for the Water Filtration Plant Delivery System.

**Design Principles:**
- **Consistency**: Use standardized colors, spacing, and components across all screens
- **Clarity**: Prioritize readability and intuitive navigation
- **Efficiency**: Design for quick task completion and minimal cognitive load
- **Accessibility**: Ensure WCAG 2.1 AA compliance for all users
- **8px Grid System**: All spacing and sizing follows multiples of 8px

---

## 🎨 Color Palette

### Primary Colors

| Color Name | Hex Code | CSS Variable | Usage |
|------------|----------|--------------|-------|
| **Primary Blue** | `#1E88E5` | `--color-primary-blue` | Primary buttons, links, active states |
| **Primary Blue Hover** | `#1976D2` | `--color-primary-blue-hover` | Hover state for primary blue |
| **Primary Blue Light** | `#E3F2FD` | `--color-primary-blue-light` | Light backgrounds, badges |

### Secondary Colors

| Color Name | Hex Code | CSS Variable | Usage |
|------------|----------|--------------|-------|
| **Secondary Teal** | `#26A69A` | `--color-secondary-teal` | Secondary buttons, accents, icons |
| **Secondary Teal Hover** | `#2E7D72` | `--color-secondary-teal-hover` | Hover state for secondary teal |
| **Secondary Teal Light** | `#E0F2F1` | `--color-secondary-teal-light` | Light backgrounds, highlights |

### Neutral Colors

| Color Name | Hex Code | CSS Variable | Usage |
|------------|----------|--------------|-------|
| **Light Gray** | `#F5F7FA` | `--color-light-gray` | Page backgrounds, disabled states |
| **Dark Gray** | `#37474F` | `--color-dark-gray` | Primary text, headings |
| **Medium Gray** | `#607D8B` | `--color-medium-gray` | Secondary text, labels |
| **Border Gray** | `#E0E0E0` | `--color-border-gray` | Borders, dividers |

### Status Colors

| Color Name | Hex Code | CSS Variable | Usage |
|------------|----------|--------------|-------|
| **Success Green** | `#43A047` | `--color-success-green` | Delivered status, success messages |
| **Success Light** | `#E8F5E9` | `--color-success-light` | Success backgrounds |
| **Error Red** | `#E53935` | `--color-error-red` | Errors, validation, delete actions |
| **Error Light** | `#FFEBEE` | `--color-error-light` | Error backgrounds |
| **Accent Yellow** | `#FFCA28` | `--color-accent-yellow` | Pending status, notifications, badges |
| **Accent Yellow Light** | `#FFF9E6` | `--color-accent-yellow-light` | Warning backgrounds |
| **Warning Orange** | `#FB8C00` | `--color-warning-orange` | Warnings, important notices |
| **Info Blue** | `#1E88E5` | `--color-info-blue` | Information, tips |

### Semantic Status Colors

| Status | Color | CSS Variable | Usage |
|--------|-------|--------------|-------|
| **Pending** | Yellow | `--color-pending` | Orders awaiting assignment |
| **Assigned** | Blue | `--color-assigned` | Orders assigned to workers |
| **Delivered** | Green | `--color-delivered` | Completed deliveries |

### Color Usage Guidelines

```css
/* Primary Actions */
.primary-button {
  background: var(--color-primary-blue);
  color: white;
}

/* Secondary Actions */
.secondary-button {
  background: var(--color-secondary-teal);
  color: white;
}

/* Status Badges */
.badge-pending { background: var(--color-accent-yellow-light); color: #F57F17; }
.badge-assigned { background: var(--color-primary-blue-light); color: var(--color-primary-blue); }
.badge-delivered { background: var(--color-success-light); color: var(--color-success-green); }
```

---

## 📝 Typography

**Primary Font:** Inter (fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)

### Type Scale

| Element | Size | Weight | CSS Variable | Usage |
|---------|------|--------|--------------|-------|
| **H1** | 32px | Semi-Bold (600) | `--font-size-h1` | Page titles, main headings |
| **H2** | 24px | Medium (500) | `--font-size-h2` | Section headers, card titles |
| **H3** | 20px | Medium (500) | - | Subsection headers |
| **H4** | 18px | Medium (500) | - | Minor headings |
| **Body** | 16px | Regular (400) | `--font-size-body` | Paragraphs, general content |
| **Small Text** | 14px | Regular (400) | `--font-size-small` | Helper text, table cells, labels |
| **Button Text** | 14px | Medium (500) | `--font-size-button` | Button labels, navigation |
| **Caption** | 12px | Regular (400) | `--font-size-caption` | Metadata, timestamps |

### Font Weights

| Weight | Value | CSS Variable | Usage |
|--------|-------|--------------|-------|
| Regular | 400 | `--font-weight-regular` | Body text, inputs |
| Medium | 500 | `--font-weight-medium` | Buttons, labels, emphasis |
| Semi-Bold | 600 | `--font-weight-semibold` | Headings, important text |
| Bold | 700 | `--font-weight-bold` | Strong emphasis (rare use) |

### Line Heights

| Type | Value | CSS Variable | Usage |
|------|-------|--------------|-------|
| Tight | 1.25 | `--line-height-tight` | Headings, compact text |
| Normal | 1.5 | `--line-height-normal` | Body text, general use |
| Relaxed | 1.75 | `--line-height-relaxed` | Long-form content |

### Typography Examples

```css
/* Page Title */
h1 {
  font-size: var(--font-size-h1);        /* 32px */
  font-weight: var(--font-weight-semibold); /* 600 */
  line-height: var(--line-height-tight); /* 1.25 */
  color: var(--color-dark-gray);
}

/* Section Header */
h2 {
  font-size: var(--font-size-h2);        /* 24px */
  font-weight: var(--font-weight-medium); /* 500 */
  line-height: var(--line-height-normal); /* 1.5 */
  color: var(--color-dark-gray);
}

/* Body Text */
p {
  font-size: var(--font-size-body);      /* 16px */
  font-weight: var(--font-weight-regular); /* 400 */
  line-height: var(--line-height-normal); /* 1.5 */
  color: var(--color-dark-gray);
}

/* Helper Text */
small {
  font-size: var(--font-size-small);     /* 14px */
  font-weight: var(--font-weight-regular); /* 400 */
  color: var(--color-medium-gray);
}
```

---

## 📏 Spacing System

**8px Grid System** - All spacing values are multiples of 8px for visual consistency

| Token | Value | CSS Variable | Common Use |
|-------|-------|--------------|------------|
| 0 | 0px | `--spacing-0` | No spacing |
| 1 | 4px | `--spacing-1` | Minimal gaps, icon spacing |
| 2 | 8px | `--spacing-2` | Base unit, small gaps |
| 3 | 12px | `--spacing-3` | Input padding, tight spacing |
| 4 | 16px | `--spacing-4` | Standard padding, margins |
| 5 | 20px | `--spacing-5` | Medium spacing |
| 6 | 24px | `--spacing-6` | Card padding, section spacing |
| 8 | 32px | `--spacing-8` | Large gaps between sections |
| 10 | 40px | `--spacing-10` | Extra large spacing |
| 12 | 48px | `--spacing-12` | Major section breaks |
| 16 | 64px | `--spacing-16` | Page margins |
| 20 | 80px | `--spacing-20` | Extra large page spacing |

### Spacing Usage Examples

```css
/* Button Padding */
.button {
  padding: var(--spacing-2) var(--spacing-4); /* 8px 16px */
}

/* Card Padding */
.card {
  padding: var(--spacing-6); /* 24px */
}

/* Section Margin */
.section {
  margin-bottom: var(--spacing-8); /* 32px */
}

/* Grid Gap */
.grid {
  gap: var(--spacing-6); /* 24px */
}
```

---

## 🏷️ Component Naming Convention

### Buttons

| Component Name | Class/Variant | Usage |
|----------------|---------------|-------|
| `btn/primary` | `.btn-primary` | Primary actions (submit, confirm) |
| `btn/secondary` | `.btn-secondary` | Secondary actions (cancel, back) |
| `btn/outline` | `.btn-outline` | Tertiary actions (view details) |
| `btn/ghost` | `.btn-ghost` | Minimal prominence actions |
| `btn/disabled` | `.btn-disabled` | Disabled state |
| `btn/icon` | `.btn-icon` | Icon-only buttons |

### Inputs

| Component Name | Class/Variant | Usage |
|----------------|---------------|-------|
| `input/text` | `.input-text` | Single-line text input |
| `input/password` | `.input-password` | Password fields |
| `input/email` | `.input-email` | Email address input |
| `input/phone` | `.input-phone` | Phone number input |
| `input/address` | `.input-address` | Address input (textarea) |
| `input/search` | `.input-search` | Search fields with icon |
| `input/select` | `.input-select` | Dropdown selectors |

### Cards

| Component Name | Class/Variant | Usage |
|----------------|---------------|-------|
| `card/order` | `.card-order` | Order information display |
| `card/customer` | `.card-customer` | Customer profile cards |
| `card/stats` | `.card-stats` | Statistical data cards |
| `card/elevated` | `.card-elevated` | Cards with shadow elevation |
| `card/dashboard` | `.card-dashboard` | Dashboard metric cards |

### Navigation

| Component Name | Class/Variant | Usage |
|----------------|---------------|-------|
| `navbar/admin` | `.navbar-admin` | Admin dashboard navigation |
| `navbar/customer` | `.navbar-customer` | Customer portal navigation |
| `navbar/worker` | `.navbar-worker` | Worker dashboard navigation |
| `navbar/mobile` | `.navbar-mobile` | Mobile responsive menu |

### Modals & Dialogs

| Component Name | Class/Variant | Usage |
|----------------|---------------|-------|
| `modal/confirm` | `.modal-confirm` | Confirmation dialogs |
| `modal/success` | `.modal-success` | Success notifications |
| `modal/error` | `.modal-error` | Error messages |
| `modal/form` | `.modal-form` | Form entry modals |

### Badges & Status

| Component Name | Class/Variant | Usage |
|----------------|---------------|-------|
| `badge/pending` | `.badge-pending` | Pending order status |
| `badge/assigned` | `.badge-assigned` | Assigned order status |
| `badge/delivered` | `.badge-delivered` | Delivered order status |
| `badge/count` | `.badge-count` | Numerical indicators |
| `badge/new` | `.badge-new` | New item indicators |

### Tables

| Component Name | Class/Variant | Usage |
|----------------|---------------|-------|
| `table/orders` | `.table-orders` | Order listing tables |
| `table/customers` | `.table-customers` | Customer management tables |
| `table/workers` | `.table-workers` | Worker assignment tables |
| `table/striped` | `.table-striped` | Alternating row colors |

---

## 🧩 Component Specifications

### Buttons

**Primary Button**
```css
.btn-primary {
  background: var(--color-primary-blue);
  color: white;
  padding: var(--spacing-2) var(--spacing-4); /* 8px 16px */
  border-radius: var(--radius-md); /* 8px */
  font-size: var(--font-size-button); /* 14px */
  font-weight: var(--font-weight-medium); /* 500 */
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease-in-out;
}

.btn-primary:hover {
  background: var(--color-primary-blue-hover);
  box-shadow: var(--shadow-md);
}
```

**Sizes**
- Small: `padding: 6px 12px` (0.75×8px, 1.5×8px)
- Medium (default): `padding: 8px 16px` (1×8px, 2×8px)
- Large: `padding: 12px 24px` (1.5×8px, 3×8px)

### Input Fields

```css
.input-text {
  padding: var(--spacing-2) var(--spacing-3); /* 8px 12px */
  border: var(--input-border);
  border-radius: var(--radius-md); /* 8px */
  font-size: var(--font-size-body); /* 16px */
  background: white;
  transition: all 0.2s ease-in-out;
}

.input-text:focus {
  border-color: var(--color-primary-blue);
  box-shadow: var(--input-focus-ring);
  outline: none;
}
```

### Cards

```css
.card-elevated {
  background: var(--card-bg);
  border-radius: var(--card-radius); /* 12px */
  padding: var(--card-padding); /* 24px */
  box-shadow: var(--card-shadow);
  border: 1px solid var(--color-border-gray);
}
```

### Badges

```css
/* Pending Badge */
.badge-pending {
  background: var(--color-accent-yellow-light);
  color: #F57F17;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  border: 1px solid var(--color-accent-yellow);
}

/* Assigned Badge */
.badge-assigned {
  background: var(--color-primary-blue-light);
  color: var(--color-primary-blue-hover);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  border: 1px solid var(--color-primary-blue);
}

/* Delivered Badge */
.badge-delivered {
  background: var(--color-success-light);
  color: var(--color-success-green);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-medium);
  border: 1px solid var(--color-success-green);
}
```

### Border Radius

| Size | Value | CSS Variable | Usage |
|------|-------|--------------|-------|
| Small | 4px | `--radius-sm` | Small buttons, badges |
| Medium | 8px | `--radius-md` | Default (buttons, inputs, cards) |
| Large | 12px | `--radius-lg` | Large cards, panels |
| XL | 16px | `--radius-xl` | Hero sections, large components |
| Full | 9999px | `--radius-full` | Pills, circular avatars |

### Shadows (Elevation)

| Level | Value | CSS Variable | Usage |
|-------|-------|--------------|-------|
| XS | Very subtle | `--shadow-xs` | Minimal depth |
| SM | Light | `--shadow-sm` | Buttons, small cards |
| MD | Medium | `--shadow-md` | Cards, dropdowns |
| LG | Large | `--shadow-lg` | Modals, floating panels |
| XL | Extra Large | `--shadow-xl` | Major overlays |

---

## 📐 Layout Guidelines

### Grid System

Use CSS Grid or Flexbox with standardized gaps:

```css
/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6); /* 24px */
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4); /* 16px */
}
```

### Container Widths

| Breakpoint | Max Width | Usage |
|------------|-----------|-------|
| Small | 640px | Mobile, narrow content |
| Medium | 768px | Tablets, forms |
| Large | 1024px | Desktop, dashboards |
| XL | 1280px | Wide dashboards |
| 2XL | 1536px | Extra wide layouts |

### Responsive Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Page Structure

```html
<header class="navbar">
  <!-- Navigation, logo, user menu -->
</header>

<main class="container">
  <section class="page-header">
    <h1>Page Title</h1>
    <p>Description</p>
  </section>
  
  <section class="content">
    <!-- Main content -->
  </section>
</main>
```

---

## 💡 Usage Examples

### Dashboard Stat Card

```tsx
<Card className="border-[#1E88E5]/20">
  <CardHeader>
    <div className="w-12 h-12 bg-[#1E88E5]/10 rounded-lg flex items-center justify-center mb-3">
      <Package className="w-6 h-6 text-[#1E88E5]" />
    </div>
    <CardTitle>125</CardTitle>
    <CardDescription>Total Orders</CardDescription>
  </CardHeader>
</Card>
```

### Order Status Badge

```tsx
<Badge className="bg-[#43A047] text-white">
  Delivered
</Badge>

<Badge className="bg-[#FFCA28] text-[#F57F17]">
  Pending
</Badge>

<Badge className="bg-[#1E88E5] text-white">
  Assigned
</Badge>
```

### Primary Button

```tsx
<Button className="bg-[#1E88E5] hover:bg-[#1976D2]">
  Place Order
</Button>
```

### Form Input

```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="customer@email.com"
    className="border-[#E0E0E0] focus:border-[#1E88E5]"
  />
</div>
```

### Navigation Header

```tsx
<header className="bg-white shadow-sm border-b border-[#E0E0E0]">
  <div className="max-w-7xl mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#1E88E5] to-[#26A69A] rounded-full">
          <Droplets className="w-6 h-6 text-white" />
        </div>
        <h1>Water Filtration Plant</h1>
      </div>
    </div>
  </div>
</header>
```

---

## 📱 Accessibility Guidelines

### Color Contrast

All text must meet WCAG 2.1 AA standards:
- Normal text: minimum 4.5:1 contrast ratio
- Large text (18px+): minimum 3:1 contrast ratio
- Interactive elements: minimum 3:1 contrast ratio

### Focus States

All interactive elements must have visible focus indicators:

```css
.button:focus-visible {
  outline: 2px solid var(--color-primary-blue);
  outline-offset: 2px;
}
```

### Touch Targets

Minimum touch target size: 44×44px for mobile devices

---

## 🎯 Design Tokens Reference

### Quick Reference Table

| Category | Token Example | Value |
|----------|---------------|-------|
| Color | `--color-primary-blue` | #1E88E5 |
| Spacing | `--spacing-4` | 16px |
| Typography | `--font-size-h1` | 32px |
| Radius | `--radius-md` | 8px |
| Shadow | `--shadow-md` | 0 4px 6px rgba(0,0,0,0.1) |

---

## 📚 Resources

### Design Files
- Figma Design System Library: [Link to Figma]
- Icon Library: Lucide React (https://lucide.dev)
- Font: Inter (Google Fonts)

### Code Implementation
- CSS Variables: `/styles/globals.css`
- React Components: `/components/`
- Tailwind Config: Uses Tailwind v4.0 with CSS variables

---

**Version:** 1.0  
**Last Updated:** November 2025  
**Maintained by:** Design System Team
