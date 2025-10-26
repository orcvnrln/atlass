# Quick Fix Checklist - Priority Actions

## 🔴 CRITICAL - Fix Today (2-3 hours)

### 1. Accessibility - Contrast Ratios
**File**: `src/index.css`
**Line**: 133, 147
```css
/* BEFORE */
--text-on-card-secondary: #9CA3AF; /* 3.2:1 - FAILS */

/* AFTER */
--text-on-card-secondary: #B4B9C5; /* 4.6:1 - PASSES ✓ */
```

### 2. Missing Focus States
**File**: `src/pages/MarketsPage.jsx`
**Line**: 110
```jsx
/* BEFORE */
className="flex items-center gap-2 px-4 py-2 rounded-lg"

/* AFTER */
className="flex items-center gap-2 px-4 py-2 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
```

### 3. ARIA Labels for Icon Buttons
**File**: `src/components/layout/Navbar.jsx`
**Line**: 50, 119
```jsx
/* BEFORE */
<button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
  <Menu />
</button>

/* AFTER */
<button 
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
  aria-expanded={isMobileMenuOpen}
>
  <Menu />
</button>
```

### 4. Form Input Labels
**File**: `src/pages/MarketsPage.jsx`
**Line**: 127
```jsx
/* BEFORE */
<input type="text" placeholder="Search..." />

/* AFTER */
<label htmlFor="market-search" className="sr-only">Search markets</label>
<input id="market-search" type="text" placeholder="Search..." />
```

---

## 🟠 HIGH PRIORITY - Fix This Week (1 day)

### 5. Consolidate Color Variables
**File**: `src/index.css`
**Action**: Remove duplicate color definitions
```css
/* DELETE lines 113-153 (duplicate theme definitions) */
/* KEEP only lines 8-83 (HSL-based system) */
```

### 6. Fix Hardcoded Colors
**File**: `src/pages/MarketsPage.jsx`
**Line**: 89
```jsx
/* BEFORE */
className="bg-[#0D1117] text-[#E5E7EB]"

/* AFTER */
className="bg-primary-bg text-text-primary"
```

### 7. Add Loading Skeletons
**File**: `src/pages/MarketsPage.jsx`
**Create**: `src/components/ui/SkeletonRow.jsx`
```jsx
export const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-700 rounded w-32"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-700 rounded w-20"></div>
    </td>
    {/* ... more cells */}
  </tr>
);
```

### 8. Mobile Table Responsiveness
**File**: `src/pages/MarketsPage.jsx`
**Add**: Responsive card view for mobile
```jsx
const isMobile = useMediaQuery('(max-width: 768px)');

return isMobile ? (
  <div className="space-y-4">
    {data.map(asset => (
      <AssetCard key={asset.symbol} asset={asset} />
    ))}
  </div>
) : (
  <table>...</table>
);
```

---

## 🟡 MEDIUM PRIORITY - Next Sprint (2-3 days)

### 9. Spacing Consistency
**Action**: Create spacing utility file
**File**: `src/utils/spacing.js`
```js
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};
```

### 10. Button Size System
**File**: `src/components/ui/Button.jsx`
```jsx
const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = ({ size = 'md', ...props }) => (
  <button className={`${sizes[size]} ...`} {...props} />
);
```

### 11. Toast Notification System
**Install**: `npm install react-hot-toast`
**File**: `src/App.jsx`
```jsx
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      {/* ... rest of app */}
    </>
  );
}
```

### 12. Navbar Overlap Fix
**File**: `src/components/layout/Navbar.jsx`
**Line**: 47
```jsx
/* BEFORE */
className="fixed top-0 left-0 lg:left-64"

/* AFTER */
className="fixed top-0 left-0 lg:left-[257px]"
```

---

## 🟢 LOW PRIORITY - Backlog (1 week)

### 13. Border Radius Standardization
**File**: `tailwind.config.js`
```js
borderRadius: {
  'sm': '4px',
  'md': '8px',
  'lg': '12px',
  'xl': '16px',
}
```

### 14. Icon Size Consistency
**Create**: `src/components/ui/Icon.jsx`
```jsx
const sizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const Icon = ({ icon: IconComponent, size = 'md' }) => (
  <IconComponent className={sizes[size]} />
);
```

### 15. Keyboard Shortcuts
**Install**: `npm install react-hotkeys-hook`
```jsx
import { useHotkeys } from 'react-hotkeys-hook';

useHotkeys('cmd+k', () => openSearch());
useHotkeys('/', () => focusSearch());
```

---

## 📋 Testing Checklist

After implementing fixes, test:

- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Screen reader (NVDA/JAWS)
- [ ] Color contrast (Chrome DevTools)
- [ ] Mobile responsiveness (375px, 768px, 1024px)
- [ ] Focus indicators visible
- [ ] All buttons have accessible names
- [ ] Forms have proper labels
- [ ] Loading states work
- [ ] Error states display correctly
- [ ] Theme switching works

---

## 🛠️ Tools to Use

1. **Accessibility**:
   - Chrome Lighthouse
   - axe DevTools
   - WAVE browser extension

2. **Contrast**:
   - WebAIM Contrast Checker
   - Chrome DevTools Color Picker

3. **Performance**:
   - React DevTools Profiler
   - Chrome Performance tab

4. **Responsive**:
   - Chrome Device Toolbar
   - BrowserStack

---

## 📊 Success Metrics

**Before Fixes**:
- Lighthouse Accessibility: ~65/100
- WCAG AA Compliance: ~40%
- Keyboard Navigation: Partial
- Mobile UX: Poor

**Target After Fixes**:
- Lighthouse Accessibility: 95+/100
- WCAG AA Compliance: 100%
- Keyboard Navigation: Full
- Mobile UX: Excellent

---

## 🚀 Implementation Order

### Day 1 (Critical)
1. Fix contrast ratios (30 min)
2. Add focus states (30 min)
3. Add ARIA labels (1 hour)
4. Add form labels (30 min)

### Day 2-3 (High Priority)
5. Consolidate colors (2 hours)
6. Fix hardcoded colors (1 hour)
7. Add loading skeletons (2 hours)
8. Mobile responsiveness (3 hours)

### Week 2 (Medium Priority)
9. Spacing system (1 day)
10. Button system (1 day)
11. Toast notifications (0.5 day)
12. Navbar fix (0.5 day)

### Week 3-4 (Low Priority)
13-15. Polish & refinements

---

## 💡 Pro Tips

1. **Use CSS Variables**: Easier to maintain themes
2. **Component Library**: Build once, use everywhere
3. **Accessibility First**: Easier to build in than retrofit
4. **Test Early**: Catch issues before they compound
5. **Document Changes**: Keep this checklist updated

---

## 📝 Notes

- All line numbers are approximate
- Test each fix individually
- Commit after each major change
- Update documentation as you go
- Get design review before deploying
