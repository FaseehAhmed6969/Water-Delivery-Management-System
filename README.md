# Water Filtration Plant Delivery System

A comprehensive web application for managing water bottle delivery operations with role-based access for Admins, Customers, and Delivery Workers.

![Design System Version](https://img.shields.io/badge/Design%20System-v1.0-1E88E5)
![Status](https://img.shields.io/badge/Status-Active-43A047)

---

## 📋 Overview

This application provides a complete delivery management system with:

- **Customer Portal**: Place orders, track deliveries, manage profile
- **Admin Dashboard**: Manage customers, assign orders, view analytics
- **Worker Dashboard**: View assignments, update delivery status

---

## 🎨 Design System

This project includes a comprehensive design system with:

### Documentation Files

| Document | Description |
|----------|-------------|
| **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** | Complete design system guide with colors, typography, spacing, and components |
| **[COMPONENT_REFERENCE.md](./COMPONENT_REFERENCE.md)** | Quick reference for implementing components with code examples |
| **[COLOR_PALETTE.md](./COLOR_PALETTE.md)** | Detailed color palette with accessibility guidelines and usage examples |

### Design Tokens

**Color Palette:**
- 🔵 Primary Blue: `#1E88E5` - Buttons, highlights
- 🌊 Secondary Teal: `#26A69A` - Accents, icons
- ⚪ Light Gray: `#F5F7FA` - Backgrounds, panels
- ⚫ Dark Gray: `#37474F` - Text, headings
- ✅ Success Green: `#43A047` - Delivered status
- ❌ Error Red: `#E53935` - Alerts, validation
- ⚠️ Accent Yellow: `#FFCA28` - Pending status, notifications

**Typography:**
- Font Family: Inter
- H1: 32px / Semi-Bold
- H2: 24px / Medium
- Body: 16px / Regular
- Small: 14px / Regular
- Buttons: 14px / Medium

**Spacing:**
- 8px grid system
- Consistent spacing tokens from 4px to 80px

**Border Radius:**
- Small: 4px
- Medium: 8px (default)
- Large: 12px
- XL: 16px
- Full: 9999px (pills)

---

## 🏗️ Application Structure

### Screens

1. **Login / Registration** - Multi-role authentication
2. **Customer Dashboard** - Order management and profile
3. **New Order Form** - Place water bottle orders
4. **Order Tracking** - Real-time delivery status
5. **Admin Dashboard** - System overview and management
6. **Customer Management** - CRUD operations for customers
7. **Assign Order** - Assign deliveries to workers
8. **Worker Dashboard** - Delivery task management

### User Roles

**👤 Customer**
- Place new orders
- Track order status
- View order history
- Manage profile

**👨‍💼 Admin**
- View analytics dashboard
- Manage customers (Add/Edit/Delete)
- Assign orders to workers
- Monitor all orders

**🚚 Delivery Worker**
- View assigned deliveries
- Update delivery status
- Track completion metrics

---

## 🚀 Features

### Order Management
- ✅ Multiple bottle sizes (5L, 10L, 20L, 25L)
- ✅ Quantity selection
- ✅ Delivery address management
- ✅ Order status tracking (Pending → Assigned → Delivered)

### Dashboard Analytics
- 📊 Total orders count
- 📊 Pending orders
- 📊 Delivered orders
- 📊 Customer statistics

### Real-time Updates
- 🔔 Toast notifications
- 🔔 Status change alerts
- 🔔 Success/error feedback

### Responsive Design
- 📱 Mobile-first approach
- 📱 Tablet optimized
- 📱 Desktop layouts
- 📱 Adaptive navigation

---

## 🛠️ Technology Stack

- **Framework:** React with TypeScript
- **Styling:** Tailwind CSS v4.0
- **UI Components:** Shadcn/ui
- **Icons:** Lucide React
- **Notifications:** Sonner
- **State Management:** React Hooks

---

## 📁 Project Structure

```
├── App.tsx                          # Main application with routing logic
├── components/
│   ├── Login.tsx                    # Login/Registration page
│   ├── CustomerDashboard.tsx        # Customer portal
│   ├── NewOrderForm.tsx             # Order creation form
│   ├── OrderTracking.tsx            # Order status tracking
│   ├── AdminDashboard.tsx           # Admin control panel
│   ├── CustomerManagement.tsx       # Customer CRUD operations
│   ├── AssignOrder.tsx              # Worker assignment screen
│   ├── DeliveryWorkerDashboard.tsx  # Worker task management
│   ├── DesignSystemShowcase.tsx     # Design system reference
│   └── ui/                          # Shadcn UI components
├── styles/
│   └── globals.css                  # Design system tokens and styles
├── DESIGN_SYSTEM.md                 # Complete design system guide
├── COMPONENT_REFERENCE.md           # Component usage reference
└── COLOR_PALETTE.md                 # Color palette documentation
```

---

## 🎨 Design System Quick Reference

### Buttons

```tsx
// Primary Button (Blue)
<Button className="bg-[#1E88E5] hover:bg-[#1976D2]">
  Submit
</Button>

// Secondary Button (Teal)
<Button className="bg-[#26A69A] hover:bg-[#2E7D72]">
  Assign
</Button>
```

### Badges

```tsx
// Status Badges
<Badge className="bg-[#FFCA28] text-[#F57F17]">Pending</Badge>
<Badge className="bg-[#1E88E5] text-white">Assigned</Badge>
<Badge className="bg-[#43A047] text-white">Delivered</Badge>
```

### Cards

```tsx
// Dashboard Stat Card
<Card className="border-[#1E88E5]/20">
  <CardHeader>
    <div className="w-12 h-12 bg-[#1E88E5]/10 rounded-lg">
      <Package className="w-6 h-6 text-[#1E88E5]" />
    </div>
    <CardTitle>125</CardTitle>
    <CardDescription>Total Orders</CardDescription>
  </CardHeader>
</Card>
```

---

## 🎯 Component Naming Convention

| Component Type | Naming Pattern | Example |
|----------------|----------------|---------|
| Buttons | `btn/[variant]` | `btn/primary`, `btn/secondary` |
| Inputs | `input/[type]` | `input/text`, `input/password` |
| Cards | `card/[purpose]` | `card/order`, `card/stats` |
| Navbars | `navbar/[role]` | `navbar/admin`, `navbar/customer` |
| Modals | `modal/[type]` | `modal/confirm`, `modal/success` |
| Badges | `badge/[status]` | `badge/pending`, `badge/delivered` |

---

## 📐 Layout Guidelines

### Grid System

```tsx
// Dashboard Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Cards */}
</div>

// Form Grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Form fields */}
</div>
```

### Container Widths

- **Small:** 640px (Mobile)
- **Medium:** 768px (Tablets)
- **Large:** 1024px (Desktop)
- **XL:** 1280px (Wide screens)
- **2XL:** 1536px (Extra wide)

---

## 🎨 Color Usage Examples

### Primary Actions
```tsx
className="bg-[#1E88E5] hover:bg-[#1976D2]"
```

### Secondary Actions
```tsx
className="bg-[#26A69A] hover:bg-[#2E7D72]"
```

### Status Colors
```tsx
// Success
className="bg-[#43A047] text-white"

// Error
className="bg-[#E53935] text-white"

// Warning/Pending
className="bg-[#FFCA28] text-[#F57F17]"
```

### Backgrounds
```tsx
// Light gray (pages)
className="bg-[#F5F7FA]"

// White (cards)
className="bg-white"

// Gradient (hero)
className="bg-gradient-to-br from-[#1E88E5]/10 to-[#26A69A]/10"
```

---

## 📱 Responsive Breakpoints

```tsx
// Tailwind breakpoints
sm:   640px   // Small tablets
md:   768px   // Tablets
lg:   1024px  // Laptops
xl:   1280px  // Desktops
2xl:  1536px  // Large screens
```

---

## 🔧 Development Guidelines

### Adding New Components

1. Follow the design system color palette
2. Use 8px grid spacing (`space-4`, `space-6`, etc.)
3. Apply consistent border radius (`rounded-lg` = 12px)
4. Include proper shadows for elevation
5. Ensure responsive design
6. Add hover/focus states

### Code Style

```tsx
// Component structure
export function ComponentName({ props }: Props) {
  return (
    <div className="class-names">
      {/* Content */}
    </div>
  );
}
```

### Styling Conventions

- Use Tailwind utility classes
- Follow 8px spacing grid
- Apply design system colors
- Use semantic HTML
- Ensure accessibility

---

## 🎓 Learning Resources

### Design System Files
- Read `DESIGN_SYSTEM.md` for comprehensive guidelines
- Check `COMPONENT_REFERENCE.md` for quick code examples
- Review `COLOR_PALETTE.md` for color usage

### Component Library
- Explore `/components/DesignSystemShowcase.tsx` for visual examples
- Review `/components/ui/` for base components
- Check individual screen components for patterns

---

## 📊 Features by Role

### Customer Features
- ✅ Place water bottle orders
- ✅ Track delivery status
- ✅ View order history
- ✅ Manage profile information

### Admin Features
- ✅ View system analytics
- ✅ Manage customer accounts
- ✅ Assign orders to workers
- ✅ Monitor all deliveries
- ✅ Search and filter customers

### Worker Features
- ✅ View assigned deliveries
- ✅ Update order status
- ✅ Toggle delivery completion
- ✅ Track daily deliveries
- ✅ View customer details

---

## 🚀 Getting Started

1. Clone the repository
2. Review the design system documentation
3. Explore the component showcase
4. Start building with consistent patterns

---

## 📝 Component Checklist

When creating new components, ensure:

- [ ] Uses design system colors
- [ ] Follows 8px spacing grid
- [ ] Includes proper shadows
- [ ] Has responsive breakpoints
- [ ] Includes hover/focus states
- [ ] Uses consistent border radius
- [ ] Follows naming conventions
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Has proper TypeScript types
- [ ] Includes error states

---

## 🎨 Design System at a Glance

```
COLORS
├── Primary Blue     #1E88E5
├── Secondary Teal   #26A69A
├── Success Green    #43A047
├── Error Red        #E53935
├── Warning Yellow   #FFCA28
├── Light Gray       #F5F7FA
└── Dark Gray        #37474F

TYPOGRAPHY
├── H1: 32px / Semi-Bold
├── H2: 24px / Medium
├── Body: 16px / Regular
└── Small: 14px / Regular

SPACING (8px Grid)
├── 4px, 8px, 12px, 16px
├── 24px, 32px, 48px, 64px
└── 80px

RADIUS
├── Small: 4px
├── Medium: 8px
├── Large: 12px
└── Full: 9999px
```

---

## 📞 Support

For design system questions, refer to:
- `DESIGN_SYSTEM.md` - Comprehensive guide
- `COMPONENT_REFERENCE.md` - Code examples
- `COLOR_PALETTE.md` - Color usage
- `DesignSystemShowcase.tsx` - Visual reference

---

## 📄 License

Design System v1.0 - Water Filtration Plant Delivery System

---

**Version:** 1.0  
**Last Updated:** November 2025  
**Design System:** Complete & Production-Ready
