# Layout & Responsiveness Notes

This document captures how the trading dashboard handles layout on different screens and how to verify the CSS behavior during QA.

## Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| ≥ 1200px (Desktop) | Two-column grid (`LiveFeed + Insights + tables` alongside `InputPanel + Portfolio + ActionPanel`). Global padding is `clamp(16px, 3vw, 32px)` so ultra‑wide monitors still get breathing room without fixed widths. |
| 1200px → 768px (Tablet) | Sidebar column moves above the main feed so inputs remain accessible first. Padding tightens, typography scales down slightly. |
| ≤ 768px (Tablet Portrait / Mobile) | Everything stacks vertically. Cards stretch full width, padding drops to `var(--spacing-md)` or `var(--spacing-sm)`, typography scales to ~1.35rem for H1. |
| ≤ 600px (Small Mobile) | Additional padding reduction and card padding normalization so controls remain tappable without horizontal scrolling. |

## Key Style Rules

- `html`, `body`, `#root`, `#app` are all set to `width: 100%`, `min-height: 100vh`, and share the dark background to prevent white gutters.
- `.app` is a flex container that grows vertically so content can extend beyond the initial viewport.
- `.dashboard` uses fluid padding and `box-sizing: border-box`, ensuring the grid never exceeds the viewport width.
- `.dashboard-grid` leverages `minmax()` columns and clamps the gap spacing so cards don’t collapse on small screens.
- All cards (`.card`) are set to `width: 100%` inside the dashboard grid to avoid overflow.

## Manual QA Checklist

1. **Run the app**
   ```bash
   cd trading-dashboard
   npm run dev
   ```

2. **Desktop (≥1400px)**
   - Ensure two-column layout with no white margins.
   - Confirm candlestick feed and input panel render side-by-side.
   - Scroll the page: there should be no horizontal scrollbars.

3. **Tablet (≈1024px)**
   - Resize the browser or use dev tools (toggle device toolbar, pick iPad).
   - Sidebar cards should move above the feed stack.
   - Verify paddings tighten and nothing overflows horizontally.

4. **Mobile (≈768px and 480px)**
   - In dev tools, select iPad Mini / iPhone 12 widths.
   - Each card should span full width, and controls remain tappable.
   - Chat panel and Multi-asset board remain accessible via vertical scroll.

5. **Cross-check**
   - Confirm `LiveFeed` warnings, buttons, and ActionPanel buttons stay within viewport.
   - Check that global background stays dark when scrolling beyond the content.

## Troubleshooting Notes

- If you ever see white gutters, verify `html`/`body`/`#app` styles weren’t overridden.
- If cards overflow at narrow widths, ensure `min-width: 0` is present on flex/grid columns.
- For new components, prefer `width: 100%` and rely on container padding rather than fixed widths.

Keeping this document up-to-date will help future contributors understand and maintain the responsive behavior without digging through CSS files.

