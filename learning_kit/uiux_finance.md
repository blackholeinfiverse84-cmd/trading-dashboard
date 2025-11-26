# UI/UX Principles for the Trading Dashboard

This interface blends the calm clarity of Apple Finance UI with the density of Bloomberg Terminal and the playful motion of Blackhole Infiverse. When extending the product, keep the following principles in mind.

---

## 1. Visual Language

### Minimal Dark Palette
- Use the existing theme tokens in `src/styles/theme.js`.
- Multi-tone blacks (primary/secondary/tertiary) create layering without relying on drop shadows everywhere.
- Accents should be purposeful: blue for primary actions, green/red for profit/loss, purple/orange for secondary states.

### Typography
- Base font stack already mirrors Apple’s San Francisco family; stick to the defined scale (`xs`–`4xl`).
- Headlines should feel confident but never shouty—avoid all caps on main titles.
- Keep body copy at `1rem` with `line-height: 1.5` for readability on iPad.

### Iconography
- Prefer lightweight outline icons or simple glyphs. Overly detailed icons clash with the minimal grid.
- Motion cues (Framer Motion) should replace heavy icons when communicating feedback.

---

## 2. Layout Patterns

### Grid and Density
- Bloomberg-inspired density lives in cards; everything outside cards has breathing room.
- Use the `dashboard-grid` pattern: two columns on desktop (2fr/1fr), stacked on mobile.
- Keep cards self-contained (title, subtitle, body). New modules (Portfolio Overview, Market Events, Multi-asset board) continue the headline + stat pattern.

### Responsive Behavior
- The layout is tested for iPad landscape (1024px). Breakpoints:
  - `lg` (≥1024px): two-column layout
  - `md` (768–1023px): single column, sidebar panels reorder above feed
  - `<768px`: full-stack column, smaller typography (`html font-size: 14px`)
- Shared utilities in `global.css` handle container padding—reuse instead of hard-coded values.

### Information Hierarchy
- Every module must answer “What is this?” in the first line (title/subtitle).
- Live data shows badges (LiveFeed displays “Live / Polling” + timestamp).
- Inputs and chat adopt conversational layouts: segmented asset buttons, risk mode toggles, guided prompts.
- Insights cards should always include a fallback summary so the dashboard never looks empty when APIs are down.

---

## 3. Motion & Feedback

### Micro-Interactions
- Buttons scale subtly on hover/tap using Framer Motion.
- LiveFeed now leverages `lightweight-charts`; keep chart transitions subtle (no flashing colors).
- Typing indicators / loaders reuse the existing spinner/dot patterns.

### State Communication
- Loading: prefer skeletons/spinners within cards rather than blocking overlays.
- Errors: show inline banners inside the affected card, never toast modals that cover the feed.
- Confirmation: badge the card (e.g., green border on confirmed ActionPanel entries) instead of pop-ups.

---

## 4. Accessibility & Tone

- Maintain WCAG AA contrast by sticking to provided color tokens.
- Ensure focus states are visible (`outline-offset: 2px` already defined).
- Tone is confident but humble—avoid jargon in headers while allowing details in body text/chat.
- When surfacing AI explanations (ChatPanel), structure answers with paragraphs or bullet points for skimmability.

---

## 5. Design Checklist for New Features

1. **Define card**: title + subtitle + primary action.
2. **Choose palette**: background tier + accent usage + border.
3. **Plan responsive layout**: Does it degrade gracefully to single column?
4. **Add motion**: entry animation, hover state, loading state.
5. **Validate content density**: is it Bloomberg-level inside the card but Apple-level calm outside?
6. **Test on tablet**: Safari iPad (landscape + portrait).

Following this playbook keeps future modules aligned with the current experience and ready for production deployment.***

