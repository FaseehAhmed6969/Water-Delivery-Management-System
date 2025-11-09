# Component Reference Guide
## Water Filtration Plant Delivery System

Quick reference for implementing design system components consistently across the application.

---

## 🎨 Color Usage

### Tailwind Classes

```tsx
// Primary Blue
className="bg-[#1E88E5]"              // Background
className="text-[#1E88E5]"            // Text
className="border-[#1E88E5]"          // Border
className="hover:bg-[#1976D2]"        // Hover state

// Secondary Teal
className="bg-[#26A69A]"              // Background
className="text-[#26A69A]"            // Text
className="hover:bg-[#2E7D72]"        // Hover state

// Neutral Colors
className="bg-[#F5F7FA]"              // Light gray background
className="text-[#37474F]"            // Dark gray text
className="text-[#607D8B]"            // Medium gray text
className="border-[#E0E0E0]"          // Border gray

// Status Colors
className="bg-[#43A047]"              // Success green
className="bg-[#E53935]"              // Error red
className="bg-[#FFCA28]"              // Warning yellow
```

### CSS Variables

```tsx
// Use in style prop or CSS files
style={{ color: 'var(--color-primary-blue)' }}
style={{ background: 'var(--color-secondary-teal)' }}
style={{ padding: 'var(--spacing-4)' }}
```

---

## 🔘 Buttons

### Primary Button (Blue)

```tsx
<Button className="bg-[#1E88E5] hover:bg-[#1976D2]">
  Submit Order
</Button>
```

### Secondary Button (Teal)

```tsx
<Button className="bg-[#26A69A] hover:bg-[#2E7D72]">
  Assign Worker
</Button>
```

### Outline Button

```tsx
<Button variant="outline">
  Cancel
</Button>
```

### Button with Icon

```tsx
import { Plus } from 'lucide-react';

<Button className="bg-[#1E88E5] hover:bg-[#1976D2]">
  <Plus className="w-4 h-4 mr-2" />
  New Order
</Button>
```

### Button Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

---

## 🎫 Badges

### Status Badges

```tsx
import { Badge } from './components/ui/badge';

// Pending (Yellow)
<Badge className="bg-[#FFCA28] text-[#F57F17]">
  Pending
</Badge>

// Assigned (Blue)
<Badge className="bg-[#1E88E5] text-white">
  Assigned
</Badge>

// Delivered (Green)
<Badge className="bg-[#43A047] text-white">
  Delivered
</Badge>
```

### Badge with Icon

```tsx
import { Clock } from 'lucide-react';

<Badge className="bg-[#FFCA28] text-[#F57F17]">
  <Clock className="w-3 h-3 mr-1" />
  Pending
</Badge>
```

---

## 📦 Cards

### Basic Card

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

### Stat Card (Dashboard)

```tsx
import { Package } from 'lucide-react';

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

### Colored Accent Cards

```tsx
// Primary Blue accent
<Card className="border-[#1E88E5]/20">
  {/* content */}
</Card>

// Secondary Teal accent
<Card className="border-[#26A69A]/20">
  {/* content */}
</Card>

// Success Green accent
<Card className="border-[#43A047]/20">
  {/* content */}
</Card>

// Warning Yellow accent
<Card className="border-[#FFCA28]/20">
  {/* content */}
</Card>
```

---

## 📝 Form Inputs

### Text Input

```tsx
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';

<div className="space-y-2">
  <Label htmlFor="name">Full Name</Label>
  <Input 
    id="name" 
    type="text" 
    placeholder="John Smith"
  />
</div>
```

### Input with Icon

```tsx
import { User } from 'lucide-react';

<div className="relative">
  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
  <Input placeholder="Username" className="pl-10" />
</div>
```

### Select Dropdown

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Textarea

```tsx
import { Textarea } from './components/ui/textarea';

<Textarea 
  placeholder="Enter address"
  rows={3}
/>
```

---

## 🚨 Alerts

### Success Alert

```tsx
import { Alert, AlertDescription } from './components/ui/alert';
import { CheckCircle } from 'lucide-react';

<Alert className="border-[#43A047] bg-[#E8F5E9]">
  <CheckCircle className="h-4 w-4 text-[#43A047]" />
  <AlertDescription className="text-[#43A047]">
    Order successfully delivered!
  </AlertDescription>
</Alert>
```

### Error Alert

```tsx
import { XCircle } from 'lucide-react';

<Alert className="border-[#E53935] bg-[#FFEBEE]">
  <XCircle className="h-4 w-4 text-[#E53935]" />
  <AlertDescription className="text-[#E53935]">
    Failed to process order.
  </AlertDescription>
</Alert>
```

### Warning Alert

```tsx
import { AlertCircle } from 'lucide-react';

<Alert className="border-[#FFCA28] bg-[#FFF9E6]">
  <AlertCircle className="h-4 w-4 text-[#F57F17]" />
  <AlertDescription className="text-[#F57F17]">
    Order is pending assignment.
  </AlertDescription>
</Alert>
```

### Info Alert

```tsx
import { Info } from 'lucide-react';

<Alert className="border-[#1E88E5] bg-[#E3F2FD]">
  <Info className="h-4 w-4 text-[#1E88E5]" />
  <AlertDescription className="text-[#1E88E5]">
    Order has been assigned.
  </AlertDescription>
</Alert>
```

---

## 🔔 Toast Notifications

```tsx
import { toast } from 'sonner@2.0.3';

// Success toast
toast.success('Order placed successfully!');

// Error toast
toast.error('Failed to process order');

// Info toast
toast.info('Order status updated');

// Warning toast
toast.warning('Order is pending');
```

---

## 🎯 Navigation Header

### Standard Header

```tsx
import { Droplets, LogOut } from 'lucide-react';

<header className="bg-white shadow-sm border-b">
  <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#1E88E5] to-[#26A69A] rounded-full flex items-center justify-center">
          <Droplets className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl">Water Filtration Plant</h1>
          <p className="text-sm text-gray-500">Customer Portal</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  </div>
</header>
```

---

## 📊 Tables

### Basic Table

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>ID</TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">ORD001</TableCell>
      <TableCell>John Smith</TableCell>
      <TableCell>
        <Badge className="bg-[#43A047] text-white">Delivered</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm">View</Button>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## 🎭 Icons

### Common Icons (Lucide React)

```tsx
import { 
  Droplets,      // Logo, water
  Package,       // Orders
  Users,         // Customers
  Truck,         // Delivery
  CheckCircle,   // Success/Delivered
  Clock,         // Pending
  Plus,          // Add
  Edit,          // Edit
  Trash2,        // Delete
  Search,        // Search
  MapPin,        // Location
  Phone,         // Phone
  Mail,          // Email
  LogOut,        // Logout
  User,          // User profile
  UserCog,       // Admin/Worker
  AlertCircle,   // Warning
  Info,          // Information
  XCircle        // Error/Cancel
} from 'lucide-react';

// Usage
<Package className="w-6 h-6 text-[#1E88E5]" />
```

---

## 📐 Layout Patterns

### Dashboard Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Stat cards */}
</div>
```

### Form Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Form fields */}
</div>
```

### Page Container

```tsx
<main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
  {/* Page content */}
</main>
```

### Space-Y for Vertical Stacking

```tsx
<div className="space-y-4">
  {/* Vertically stacked items with 16px gap */}
</div>

<div className="space-y-6">
  {/* Vertically stacked items with 24px gap */}
</div>

<div className="space-y-8">
  {/* Vertically stacked items with 32px gap */}
</div>
```

---

## 🎨 Background Patterns

### Gradient Background (Login)

```tsx
<div className="min-h-screen bg-gradient-to-br from-[#1E88E5]/10 to-[#26A69A]/10">
  {/* Content */}
</div>
```

### Light Gray Background (Dashboards)

```tsx
<div className="min-h-screen bg-[#F5F7FA]">
  {/* Content */}
</div>
```

### White Background (Cards, Modals)

```tsx
<div className="bg-white">
  {/* Content */}
</div>
```

---

## 📏 Spacing Utilities

### Common Spacing Classes

```tsx
// Padding
className="p-4"    // 16px all sides
className="p-6"    // 24px all sides
className="px-4"   // 16px horizontal
className="py-2"   // 8px vertical

// Margin
className="mb-4"   // 16px bottom
className="mb-6"   // 24px bottom
className="mb-8"   // 32px bottom
className="mt-6"   // 24px top

// Gap (for flex/grid)
className="gap-4"  // 16px gap
className="gap-6"  // 24px gap
```

---

## 🎯 Shadow/Elevation

```tsx
// Light shadow (buttons, small cards)
className="shadow-sm"

// Medium shadow (cards, dropdowns)
className="shadow-md"

// Large shadow (modals, floating panels)
className="shadow-lg"

// Extra large shadow
className="shadow-xl"
```

---

## 🔄 Transitions

```tsx
// Hover transition
className="transition-shadow hover:shadow-md"

// All properties transition
className="transition-all duration-200 ease-in-out"

// Custom transition
className="transition-colors hover:bg-[#1976D2]"
```

---

## 📱 Responsive Design

### Breakpoint Classes

```tsx
// Hidden on mobile, visible on sm and up
className="hidden sm:block"

// Grid columns responsive
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

// Flex direction responsive
className="flex-col sm:flex-row"

// Text size responsive
className="text-lg sm:text-xl lg:text-2xl"
```

### Common Breakpoints

- `sm:` - 640px (small tablets)
- `md:` - 768px (tablets)
- `lg:` - 1024px (laptops)
- `xl:` - 1280px (desktops)
- `2xl:` - 1536px (large screens)

---

## 🎨 Helper Classes

### Text Colors

```tsx
className="text-[#37474F]"    // Primary text (dark gray)
className="text-[#607D8B]"    // Secondary text (medium gray)
className="text-gray-500"     // Helper text
className="text-white"        // White text
```

### Border Radius

```tsx
className="rounded"        // 4px (default)
className="rounded-md"     // 8px (medium)
className="rounded-lg"     // 12px (large)
className="rounded-full"   // Pill shape
```

### Opacity

```tsx
className="opacity-60"     // Disabled state
className="opacity-90"     // Slightly transparent
className="bg-[#1E88E5]/10"  // 10% opacity background
className="bg-[#1E88E5]/20"  // 20% opacity background
```

---

## 📋 Quick Copy Templates

### Login Page Structure

```tsx
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E88E5]/10 to-[#26A69A]/10 p-4">
  <Card className="w-full max-w-md shadow-lg">
    <CardHeader className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#1E88E5] to-[#26A69A] rounded-full flex items-center justify-center">
          <Droplets className="w-8 h-8 text-white" />
        </div>
      </div>
      <CardTitle className="text-2xl">Water Filtration Plant</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Login form */}
    </CardContent>
  </Card>
</div>
```

### Dashboard Page Structure

```tsx
<div className="min-h-screen bg-[#F5F7FA]">
  {/* Header */}
  <header className="bg-white shadow-sm border-b">
    {/* Header content */}
  </header>

  {/* Main Content */}
  <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <div className="mb-8">
      <h2 className="text-2xl mb-2">Dashboard Title</h2>
      <p className="text-gray-600">Dashboard description</p>
    </div>

    {/* Grid of cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Stat cards */}
    </div>
  </main>
</div>
```

---

**Reference Version:** 1.0  
**Last Updated:** November 2025
