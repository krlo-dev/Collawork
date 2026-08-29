---
name: WorkLink
colors:
  surface: '#f7f9ff'
  surface-dim: '#d7dadf'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f9'
  surface-container: '#ebeef3'
  surface-container-high: '#e5e8ee'
  surface-container-highest: '#e0e3e8'
  on-surface: '#181c20'
  on-surface-variant: '#454652'
  inverse-surface: '#2d3135'
  inverse-on-surface: '#eef1f6'
  outline: '#757684'
  outline-variant: '#c5c5d4'
  surface-tint: '#4355b9'
  primary: '#24389c'
  on-primary: '#ffffff'
  primary-container: '#3f51b5'
  on-primary-container: '#cacfff'
  inverse-primary: '#bac3ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#6c3400'
  on-tertiary: '#ffffff'
  tertiary-container: '#8f4700'
  on-tertiary-container: '#ffc7a2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee0ff'
  primary-fixed-dim: '#bac3ff'
  on-primary-fixed: '#00105c'
  on-primary-fixed-variant: '#293ca0'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb784'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#f7f9ff'
  on-background: '#181c20'
  surface-variant: '#e0e3e8'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 16px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
---

## Brand & Style
The design system is anchored in a **Minimalist Corporate** aesthetic, tailored for high-end professional networking. It prioritizes clarity, efficiency, and a sense of "digital quietude" to allow professional contributions to remain the focal point. 

The visual language avoids all decorative flourishes, opting instead for a "Content-First" philosophy. By utilizing generous whitespace and a restricted palette, the UI evokes an emotional response of organized calm and institutional reliability. It bridges the gap between a traditional executive environment and a modern, high-growth technology platform.

## Colors
The palette is built on a foundation of "High-End Neutrals." 

*   **Primary (Deep Indigo):** Used for primary actions, active navigation states, and brand-critical identifiers. It conveys depth and stability.
*   **Secondary (Emerald Green):** Reserved for "success" states, growth indicators, and subtle call-to-outs that require a distinct but professional contrast.
*   **Neutral (Charcoal & Off-white):** The Charcoal (#212529) is used for primary text to reduce the harshness of pure black, while the Off-white (#F8F9FA) provides a soft canvas that reduces eye strain during long periods of reading.

## Typography
This design system utilizes **Inter** exclusively to maintain a systematic and utilitarian feel. 

- **Hierarchy:** Use weight (SemiBold/Bold) rather than size to denote hierarchy where possible to keep the interface compact.
- **Micro-copy:** Use `label-sm` in all-caps with the specified letter spacing for metadata (e.g., timestamps, category tags) to differentiate from body content.
- **Readability:** Body text should maintain a maximum line length of 65-75 characters to ensure professional readability in long-form articles or profile bios.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for desktop to maintain a structured, "editorial" feel, transitioning to a fluid model for mobile.

- **Desktop:** A 12-column grid with a 1200px max-width centered in the viewport. 
- **Spacing Rhythm:** All spacing must be a multiple of the 8px base unit. 
- **Density:** Use `stack-lg` (24px) between distinct content cards to emphasize whitespace. Use `stack-md` (12px) for internal card elements.
- **Negative Space:** Content containers should never feel crowded; always err on the side of larger margins to preserve the high-end minimalist feel.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Subtle Ambient Shadows**. 

1.  **Level 0 (Background):** #F8F9FA.
2.  **Level 1 (Cards/Surface):** Pure White (#FFFFFF) with a 1px border of #E5E7EB. Shadows are avoided here to keep the "flat" professional look.
3.  **Level 2 (Dropdowns/Modals):** Pure White (#FFFFFF) with a soft, diffused shadow (0px 10px 15px -3px rgba(0, 0, 0, 0.05)).

Avoid heavy blurs or "glass" effects; the focus is on structural integrity and clear boundaries.

## Shapes
This design system utilizes **Soft (0.25rem)** roundedness. 

The goal is to move away from the "playful" circles of consumer social media and toward a "precise" professional tool. 
- **Small Elements:** Buttons and Input fields use the standard 0.25rem (4px) radius.
- **Large Elements:** Content cards and modals may use `rounded-lg` (0.5rem / 8px) to provide a slightly softer frame for high-density information.
- **Avatars:** Strictly circular to provide the only organic shape in the interface, helping user profiles stand out.

## Components
- **Buttons:** Primary buttons use a solid Indigo background with white text. Secondary buttons use a Charcoal outline (1px) with no fill. All buttons feature a 4px corner radius and 12px/24px vertical/horizontal padding.
- **Input Fields:** Use a white background, 1px border (#D1D5DB), and 4px radius. On focus, the border transitions to Deep Indigo with a subtle 2px outer glow.
- **Cards:** White surfaces with a 1px light gray border. No shadows unless the card is interactive/hoverable.
- **Chips:** Used for skills or industry tags. Light gray background (#F3F4F6) with Charcoal text, no border, and a 4px radius. 
- **Lists:** Professional "Feed" items should have 24px of vertical padding between items, separated by a hairline 1px divider (#F3F4F6).
- **Navigation:** A top-anchored bar with a blur-less, solid white background and a 1px bottom border. Navigation links use `label-md` weight.