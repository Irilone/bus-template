# Responsive Testing & Validation Guide

## Bootstrap 5.3 Breakpoint Validation System

### Standard Breakpoints to Test
```
xs: 0-575px    (Mobile phones)
sm: 576-767px  (Large phones, small tablets)
md: 768-991px  (Tablets)
lg: 992-1199px (Small laptops)
xl: 1200-1399px (Large laptops)
xxl: 1400px+   (Large desktops)
```

### Testing Methodology

#### 1. DevTools Responsive Testing
```javascript
// Responsive Testing Checklist
const breakpoints = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'Samsung Galaxy S21', width: 384, height: 854 },
  { name: 'iPad Mini', width: 768, height: 1024 },
  { name: 'iPad Pro', width: 1024, height: 1366 },
  { name: 'Laptop', width: 1440, height: 900 },
  { name: 'Desktop', width: 1920, height: 1080 }
];
```

#### 2. CSS Validation Commands
```bash
# Test CSS validity
npx stylelint "**/*.css" --fix

# Check for unused CSS
npx uncss index.html --stylesheets styles.css

# Validate responsive images
npx lighthouse index.html --only-categories=performance
```

#### 3. Manual Testing Checklist

**Critical Tests:**
- [ ] Navigation collapses properly on mobile
- [ ] Text remains readable (min 16px on mobile)
- [ ] Touch targets are 44px minimum
- [ ] Images scale without breaking layout
- [ ] Tables scroll horizontally on mobile
- [ ] Forms are thumb-friendly
- [ ] No horizontal scrolling at any breakpoint

**Typography Tests:**
- [ ] H1: 28-48px range (clamp working)
- [ ] H2: 24-36px range
- [ ] Body: 14-16px range
- [ ] Small: 12-14px range

**Spacing Tests:**
- [ ] Container padding: 16px mobile, 32px+ desktop
- [ ] Section spacing: 32px mobile, 48px+ desktop
- [ ] Card spacing: 16px mobile, 24px+ desktop

#### 4. Automated Testing Script

```javascript
// Breakpoint Validation Test
function validateBreakpoints() {
  const testViewports = [375, 576, 768, 992, 1200, 1400];
  
  testViewports.forEach(width => {
    // Set viewport
    window.resizeTo(width, 800);
    
    // Test critical elements
    const container = document.querySelector('.container');
    const nav = document.querySelector('nav');
    const text = document.querySelector('p');
    
    // Validate container width
    console.log(`${width}px: Container = ${container.offsetWidth}px`);
    
    // Validate typography
    const computedStyle = window.getComputedStyle(text);
    console.log(`${width}px: Font size = ${computedStyle.fontSize}`);
    
    // Validate touch targets
    const buttons = document.querySelectorAll('button, a.btn');
    buttons.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      if (rect.height < 44 || rect.width < 44) {
        console.warn(`Touch target too small at ${width}px:`, btn);
      }
    });
  });
}
```

#### 5. Performance Testing

**Core Web Vitals Targets:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Testing Commands:**
```bash
# Lighthouse audit
npx lighthouse index.html --view

# WebPageTest
curl -X POST "https://www.webpagetest.org/runtest.php" \
  -d "url=https://yoursite.com" \
  -d "location=Dulles:Chrome" \
  -d "runs=3" \
  -d "fvonly=1"
```

#### 6. Accessibility Testing

**WCAG 2.1 Compliance:**
- [ ] Color contrast ≥ 4.5:1 for normal text
- [ ] Color contrast ≥ 3:1 for large text
- [ ] All interactive elements focusable
- [ ] Semantic HTML structure
- [ ] Alt text for images

**Testing Tools:**
```bash
# axe-core accessibility testing
npx @axe-core/cli index.html

# WAVE accessibility evaluation
curl "https://wave.webaim.org/api/request?key=YOUR_KEY&url=https://yoursite.com"
```

### Validation Checklist for Vaccine Bjarred App

#### Container System
- [ ] Mobile (375px): 16px padding, full width
- [ ] Tablet (768px): clamp(16px, 4vw, 32px) padding
- [ ] Desktop (1200px): max-width 1140px, centered

#### Typography System
- [ ] H1: clamp(32px, 4vw + 16px, 48px)
- [ ] H2: clamp(28px, 3vw + 16px, 36px)
- [ ] Body: clamp(14px, 1vw + 12.8px, 16px)

#### Spacing System
- [ ] XS: clamp(4px, 0.5vw + 3.2px, 6px)
- [ ] SM: clamp(8px, 1vw + 6.4px, 12px)
- [ ] MD: clamp(16px, 2vw + 12.8px, 24px)
- [ ] LG: clamp(32px, 4vw + 24px, 48px)

#### Component Tests
- [ ] Price table scrolls horizontally on mobile
- [ ] FAQ accordions work on touch
- [ ] Images use picture element with responsive sources
- [ ] Navigation collapses to hamburger menu
- [ ] All forms are thumb-friendly

### Regression Testing

**Before Deployment:**
1. Run full breakpoint test suite
2. Validate all clamp() functions
3. Check touch target sizes
4. Verify no horizontal scroll
5. Confirm Core Web Vitals
6. Test on real devices

**Post-Deployment:**
1. Monitor real user metrics
2. Check for layout shifts
3. Validate performance on 3G
4. Test cross-browser compatibility

### Emergency Fixes

**Common Issues & Solutions:**
- Horizontal scroll: Add `overflow-x: hidden` to html/body
- Text too small: Increase clamp() minimum values
- Touch targets: Add min-height/width 44px
- Layout breaks: Check for fixed widths, use max-width
- Images overflow: Add `max-width: 100%; height: auto`

This testing methodology ensures Bootstrap 5.3 responsive design principles are properly implemented and maintained.