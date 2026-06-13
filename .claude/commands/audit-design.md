# /audit-design

Checks a component file for BloomBay design consistency.

## Usage
/audit-design [file-path or component-name]

Example: `/audit-design hanger-page`

## What I check

### ✅ Required
- [ ] `PINK = "#FF1F7D"` is the primary accent (not hardcoded hex elsewhere)
- [ ] Dark backgrounds use `PLUM = "#1A0A2E"` (not `#000` or generic dark)
- [ ] Headers use `var(--font-playfair)` with `fontStyle: "italic"`
- [ ] UI text uses `var(--font-jost)`
- [ ] Yande/script text uses `var(--font-caveat)`
- [ ] Yande signature is `— Yande ✦` (not "— Yande" or "YANDE SAYS:")
- [ ] Bottom padding is 96px (clears the bottom nav)
- [ ] Mobile safe area: `env(safe-area-inset-top, 0px)` for top padding
- [ ] No Tailwind classes (all styling is inline `style={{}}`)
- [ ] No shadcn components

### ⚠️ Flag if found
- Hardcoded `#000000` or `black` for backgrounds
- Generic blue (#0000FF, #007AFF) — everything is pink/plum toned
- `position: absolute` without a `position: relative` parent
- Missing `key` prop on mapped arrays
- `onClick` on non-interactive elements without `role` and `tabIndex`

### 📝 Output format
List each issue as: `LINE [n]: [issue] → [suggested fix]`
Then a summary: "X issues found. Page is [consistent/needs work/broken]."
