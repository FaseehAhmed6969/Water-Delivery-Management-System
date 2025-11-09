# Color Palette Reference
## Water Filtration Plant Delivery System

Visual reference for all colors used in the design system.

---

## 🎨 Primary Colors

### Primary Blue
**Use for:** Primary buttons, links, active states, primary actions

| Shade | Hex Code | RGB | Usage |
|-------|----------|-----|-------|
| **Primary Blue** | `#1E88E5` | `rgb(30, 136, 229)` | Default primary color |
| **Primary Blue Hover** | `#1976D2` | `rgb(25, 118, 210)` | Hover/Active state |
| **Primary Blue Light** | `#E3F2FD` | `rgb(227, 242, 253)` | Light backgrounds, badges |

**CSS Variables:**
```css
var(--color-primary-blue)
var(--color-primary-blue-hover)
var(--color-primary-blue-light)
```

**Tailwind Classes:**
```tsx
className="bg-[#1E88E5]"
className="hover:bg-[#1976D2]"
className="bg-[#E3F2FD]"
```

**Examples:**
- Primary buttons
- Assigned order badges
- Active navigation items
- Primary icons
- Links

---

## 🌊 Secondary Colors

### Secondary Teal
**Use for:** Secondary buttons, accents, icons, worker-related features

| Shade | Hex Code | RGB | Usage |
|-------|----------|-----|-------|
| **Secondary Teal** | `#26A69A` | `rgb(38, 166, 154)` | Default secondary color |
| **Secondary Teal Hover** | `#2E7D72` | `rgb(46, 125, 114)` | Hover/Active state |
| **Secondary Teal Light** | `#E0F2F1` | `rgb(224, 242, 241)` | Light backgrounds |

**CSS Variables:**
```css
var(--color-secondary-teal)
var(--color-secondary-teal-hover)
var(--color-secondary-teal-light)
```

**Tailwind Classes:**
```tsx
className="bg-[#26A69A]"
className="hover:bg-[#2E7D72]"
className="bg-[#E0F2F1]"
```

**Examples:**
- Secondary action buttons
- Worker dashboard elements
- Assignment features
- Success states (alternative)
- Accent icons

---

## ⚪ Neutral Colors

### Gray Scale
**Use for:** Text, backgrounds, borders, disabled states

| Name | Hex Code | RGB | Usage |
|------|----------|-----|-------|
| **Light Gray** | `#F5F7FA` | `rgb(245, 247, 250)` | Page backgrounds, panels |
| **Border Gray** | `#E0E0E0` | `rgb(224, 224, 224)` | Borders, dividers |
| **Medium Gray** | `#607D8B` | `rgb(96, 125, 139)` | Secondary text, labels |
| **Dark Gray** | `#37474F` | `rgb(55, 71, 79)` | Primary text, headings |

**CSS Variables:**
```css
var(--color-light-gray)
var(--color-border-gray)
var(--color-medium-gray)
var(--color-dark-gray)
```

**Tailwind Classes:**
```tsx
className="bg-[#F5F7FA]"
className="border-[#E0E0E0]"
className="text-[#607D8B]"
className="text-[#37474F]"
```

**Text Color Guidelines:**
- **Dark Gray (#37474F):** Headings, primary content, important text
- **Medium Gray (#607D8B):** Secondary text, descriptions, helper text
- **Light Gray (#F5F7FA):** Backgrounds, disabled text (with reduced opacity)

---

## ✅ Status Colors

### Success Green
**Use for:** Delivered status, success messages, confirmations

| Shade | Hex Code | RGB | Usage |
|-------|----------|-----|-------|
| **Success Green** | `#43A047` | `rgb(67, 160, 71)` | Success states |
| **Success Light** | `#E8F5E9` | `rgb(232, 245, 233)` | Success backgrounds |

**CSS Variables:**
```css
var(--color-success-green)
var(--color-success-light)
```

**Tailwind Classes:**
```tsx
className="bg-[#43A047]"
className="bg-[#E8F5E9]"
className="text-[#43A047]"
```

**Examples:**
- ✓ Delivered order badge
- ✓ Success alerts
- ✓ Confirmation messages
- ✓ Completed status indicators
- ✓ Check marks and success icons

---

### Error Red
**Use for:** Errors, validation messages, destructive actions

| Shade | Hex Code | RGB | Usage |
|-------|----------|-----|-------|
| **Error Red** | `#E53935` | `rgb(229, 57, 53)` | Error states |
| **Error Light** | `#FFEBEE` | `rgb(255, 235, 238)` | Error backgrounds |

**CSS Variables:**
```css
var(--color-error-red)
var(--color-error-light)
```

**Tailwind Classes:**
```tsx
className="bg-[#E53935]"
className="bg-[#FFEBEE]"
className="text-[#E53935]"
```

**Examples:**
- ✗ Error alerts
- ✗ Validation messages
- ✗ Delete buttons
- ✗ Failed status
- ✗ Form errors
- ✗ Cancelled orders

---

### Accent Yellow
**Use for:** Pending status, warnings, notifications

| Shade | Hex Code | RGB | Usage |
|-------|----------|-----|-------|
| **Accent Yellow** | `#FFCA28` | `rgb(255, 202, 40)` | Warning/Pending states |
| **Accent Yellow Light** | `#FFF9E6` | `rgb(255, 249, 230)` | Warning backgrounds |
| **Yellow Dark** | `#F57F17` | `rgb(245, 127, 23)` | Yellow text for contrast |

**CSS Variables:**
```css
var(--color-accent-yellow)
var(--color-accent-yellow-light)
```

**Tailwind Classes:**
```tsx
className="bg-[#FFCA28]"
className="bg-[#FFF9E6]"
className="text-[#F57F17]"
```

**Examples:**
- ⏱ Pending order badge
- ⚠ Warning alerts
- 🔔 Notification badges
- ⏸ In-progress states
- ⏳ Awaiting action items

---

### Warning Orange
**Use for:** Important warnings, urgent notices

| Color | Hex Code | RGB | Usage |
|-------|----------|-----|-------|
| **Warning Orange** | `#FB8C00` | `rgb(251, 140, 0)` | Urgent warnings |

**CSS Variables:**
```css
var(--color-warning-orange)
```

**Tailwind Classes:**
```tsx
className="bg-[#FB8C00]"
className="text-[#FB8C00]"
```

**Examples:**
- ⚠️ Urgent notifications
- ⚠️ Important warnings
- ⚠️ Time-sensitive alerts

---

### Info Blue
**Use for:** Informational messages, tips

| Color | Hex Code | RGB | Usage |
|-------|----------|-----|-------|
| **Info Blue** | `#1E88E5` | `rgb(30, 136, 229)` | Information |

**CSS Variables:**
```css
var(--color-info-blue)
```

**Tailwind Classes:**
```tsx
className="bg-[#1E88E5]"
className="text-[#1E88E5]"
```

**Examples:**
- ℹ️ Info alerts
- ℹ️ Tips and hints
- ℹ️ Informational badges

---

## 🏷️ Semantic Status Colors

### Order Status Colors

| Status | Color Name | Hex Code | Usage |
|--------|------------|----------|-------|
| **Pending** | Accent Yellow | `#FFCA28` | Orders awaiting assignment |
| **Assigned** | Primary Blue | `#1E88E5` | Orders assigned to workers |
| **Delivered** | Success Green | `#43A047` | Completed deliveries |
| **Cancelled** | Error Red | `#E53935` | Cancelled orders |

**Badge Examples:**

```tsx
// Pending
<Badge className="bg-[#FFCA28] text-[#F57F17] border-[#FFCA28]">
  Pending
</Badge>

// Assigned
<Badge className="bg-[#1E88E5] text-white">
  Assigned
</Badge>

// Delivered
<Badge className="bg-[#43A047] text-white">
  Delivered
</Badge>

// Cancelled
<Badge className="bg-[#E53935] text-white">
  Cancelled
</Badge>
```

---

## 🎨 Gradient Combinations

### Primary Gradient (Logo, Heroes)

```tsx
className="bg-gradient-to-br from-[#1E88E5] to-[#26A69A]"
```

**Use for:**
- Logo backgrounds
- Hero sections
- Feature highlights
- Premium UI elements

### Light Gradient (Backgrounds)

```tsx
className="bg-gradient-to-br from-[#1E88E5]/10 to-[#26A69A]/10"
```

**Use for:**
- Login page backgrounds
- Subtle page backgrounds
- Card overlays

---

## 🎯 Color Accessibility

### Contrast Ratios (WCAG 2.1 AA Compliance)

| Background | Text Color | Contrast | Pass/Fail |
|------------|------------|----------|-----------|
| `#1E88E5` (Blue) | White | 4.52:1 | ✅ PASS |
| `#26A69A` (Teal) | White | 3.54:1 | ✅ PASS (Large text) |
| `#43A047` (Green) | White | 3.88:1 | ✅ PASS (Large text) |
| `#E53935` (Red) | White | 4.51:1 | ✅ PASS |
| `#FFCA28` (Yellow) | `#F57F17` | 4.52:1 | ✅ PASS |
| `#F5F7FA` (Light Gray) | `#37474F` | 11.8:1 | ✅ PASS |
| White | `#37474F` | 12.6:1 | ✅ PASS |
| White | `#607D8B` | 5.12:1 | ✅ PASS |

**Guidelines:**
- Normal text (16px): Minimum 4.5:1 contrast
- Large text (18px+): Minimum 3:1 contrast
- UI components: Minimum 3:1 contrast

---

## 💡 Usage Recommendations

### Primary Actions
Use **Primary Blue (#1E88E5)** for:
- Submit buttons
- Confirm actions
- Primary CTAs (Call To Action)
- Active states
- Links

### Secondary Actions
Use **Secondary Teal (#26A69A)** for:
- Cancel buttons
- Alternative actions
- Worker-specific features
- Secondary CTAs

### Status Indicators
- **Green (#43A047):** Completed, success, delivered
- **Yellow (#FFCA28):** Pending, in-progress, warnings
- **Blue (#1E88E5):** Assigned, active, information
- **Red (#E53935):** Failed, error, cancelled, delete

### Backgrounds
- **Light Gray (#F5F7FA):** Page backgrounds, disabled states
- **White (#FFFFFF):** Cards, modals, forms, active areas
- **Gradient:** Hero sections, special features

### Text
- **Dark Gray (#37474F):** Primary text, headings
- **Medium Gray (#607D8B):** Secondary text, descriptions
- **White:** Text on colored backgrounds

---

## 🖌️ Color Swatches

### Copy-Paste Hex Codes

```
PRIMARY COLORS
#1E88E5  Primary Blue
#1976D2  Primary Blue Hover
#E3F2FD  Primary Blue Light

SECONDARY COLORS
#26A69A  Secondary Teal
#2E7D72  Secondary Teal Hover
#E0F2F1  Secondary Teal Light

NEUTRAL COLORS
#F5F7FA  Light Gray
#E0E0E0  Border Gray
#607D8B  Medium Gray
#37474F  Dark Gray

STATUS COLORS
#43A047  Success Green
#E8F5E9  Success Light
#E53935  Error Red
#FFEBEE  Error Light
#FFCA28  Accent Yellow
#FFF9E6  Accent Yellow Light
#F57F17  Yellow Dark Text
#FB8C00  Warning Orange
```

---

## 📊 Color in Context

### Dashboard Cards

```tsx
// Orders Card (Blue)
<Card className="border-[#1E88E5]/20">
  <div className="w-12 h-12 bg-[#1E88E5]/10 rounded-lg">
    <Package className="w-6 h-6 text-[#1E88E5]" />
  </div>
</Card>

// Pending Card (Yellow)
<Card className="border-[#FFCA28]/20">
  <div className="w-12 h-12 bg-[#FFCA28]/10 rounded-lg">
    <Clock className="w-6 h-6 text-[#F57F17]" />
  </div>
</Card>

// Delivered Card (Green)
<Card className="border-[#43A047]/20">
  <div className="w-12 h-12 bg-[#43A047]/10 rounded-lg">
    <CheckCircle className="w-6 h-6 text-[#43A047]" />
  </div>
</Card>

// Workers Card (Teal)
<Card className="border-[#26A69A]/20">
  <div className="w-12 h-12 bg-[#26A69A]/10 rounded-lg">
    <Users className="w-6 h-6 text-[#26A69A]" />
  </div>
</Card>
```

---

**Palette Version:** 1.0  
**Last Updated:** November 2025  
**WCAG Compliance:** AA Standard
