# Good Patrone — Design System

> Visual source of truth: `app/stopwatch/StopwatchClient.tsx` and `app/days/DaysClient.tsx`.
> Do not deviate from these rules without updating this document.

---

## 1. Color Palette

### Backgrounds & Surfaces

| Token | Tailwind class | Use |
|---|---|---|
| Base | _(set by `ToolWrapper`)_ | Page background |
| Surface lift | `bg-white/5` | Subtle card/panel, table header |
| Card | `bg-zinc-900` | Input fields, stat cards, icon buttons |
| Table row highlight (fast) | `bg-emerald-950/40` | Best lap |
| Table row highlight (slow) | `bg-red-950/30` | Worst lap |

### Borders

| Token | Tailwind class | Use |
|---|---|---|
| Strong | `border-zinc-700` | Inputs, secondary buttons |
| Mid | `border-zinc-800` | Card edges, section dividers |
| Subtle | `border-white/8`–`border-white/10` | Alpha panels, lap table |
| Row separator | `border-white/5` | Table row dividers |

### Text

| Role | Tailwind class | Use |
|---|---|---|
| Primary | `text-white` | Hero numbers, main data |
| Secondary | `text-zinc-300` / `text-slate-300` | Body text, pill labels |
| Muted | `text-zinc-500` / `text-gray-500` | Sub-labels, descriptors |
| Very muted | `text-zinc-600` / `text-gray-600` | Table headers, timestamps |
| Accent (positive) | `text-emerald-400` / `text-emerald-500` | Good state, hover, links |
| Accent (negative) | `text-red-400` | Bad state, running/stop button |
| Accent (neutral) | `text-slate-300` | Average / neutral value |

---

## 2. Typography Scale

| Role | Size | Weight | Other |
|---|---|---|---|
| Hero number | `text-[64px]`–`text-[96px]` | `font-black` | `tracking-tighter leading-none tabular-nums` |
| Hero decimal / sub-number | `text-3xl` | `font-bold` | `text-gray-500 tabular-nums` |
| Section label | `text-sm` | `font-medium` | `uppercase tracking-widest text-zinc-500` |
| Card primary value | `text-3xl` | `font-black` | `tabular-nums text-white` |
| Card sub-label | `text-xs` | `font-medium` | `uppercase tracking-widest text-zinc-500` |
| Table header | `text-[10px]` | _(default)_ | `uppercase tracking-widest text-gray-600` |
| Table data (key) | `text-xs` | `font-bold` | `text-white tabular-nums` |
| Table data (secondary) | `text-xs` | `font-semibold` | `text-gray-500 tabular-nums` |
| Input text | `text-base` | _(default)_ | `text-white` |
| Button label | `text-sm` | `font-semibold` | _(inherits color)_ |
| Preset pill label | `text-sm` | `font-medium` | `text-zinc-300` |

---

## 3. Spacing

- **Between major sections**: `space-y-8` to `space-y-12`
- **Between sub-sections / groups**: `space-y-5`
- **Section separator**: `pt-10 border-t border-zinc-800`
- **Stat card padding**: `py-6 px-3`
- **Compact stat pill padding**: `p-3`
- **Input field padding**: `px-5 py-4`
- **Action button padding**: `px-8 py-3`
- **Pill/preset button padding**: `px-6 py-3`
- **Table row padding**: `px-4 py-2.5`
- **Table header padding**: `px-4 py-2`
- **Stat grid gap**: `gap-2` (compact) / `gap-4` (standard)
- **Input grid gap**: `gap-8`
- **Button row gap**: `gap-3`

---

## 4. Border Radius

| Shape | Class | Use |
|---|---|---|
| Large card / input | `rounded-2xl` | Date inputs, stat cards |
| Standard card / button | `rounded-xl` | Action buttons, panels, lap table container |
| Pill | `rounded-full` | Preset buttons, circular icon buttons |

Always pair `rounded-xl` with `overflow-hidden` on containers that clip children (e.g. scrollable tables).

---

## 5. Button Styles

| Type | Classes |
|---|---|
| Primary CTA | `bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3 rounded-xl transition-all active:scale-[0.98]` |
| Secondary icon | `bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all` |
| Ghost pill (preset) | `rounded-full border border-zinc-700 text-zinc-300 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-950/30 transition-all` |
| Circular secondary | `rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all active:scale-95` |
| Circular start (running) | `rounded-full bg-emerald-700/80 hover:bg-emerald-700 border border-emerald-600/50 shadow-lg active:scale-95` |
| Circular stop | `rounded-full bg-red-600/80 hover:bg-red-600 border border-red-500/50 shadow-lg active:scale-95` |
| Destructive hover | Add `hover:bg-red-600/20 hover:border-red-500/30 hover:text-red-400` to any secondary button |
| Inline text link | `text-emerald-500 hover:text-emerald-400 font-semibold transition-colors` |
| Disabled | `disabled:opacity-20` — no pointer changes needed |

**Active feedback**: always `active:scale-95` (circular) or `active:scale-[0.98]` (rectangular).

---

## 6. Layout Patterns

| Pattern | Implementation |
|---|---|
| Tool root | Single-column content inside `<ToolWrapper>` |
| Stat grid (3-up) | `grid grid-cols-3 gap-2` |
| Stat grid (4-up) | `grid grid-cols-4 gap-4` |
| Two-column inputs | `grid grid-cols-2 gap-8` |
| Centered controls | `flex items-center justify-center gap-3` |
| Label + inline action | `flex justify-between items-center` |
| Scrollable list | Fixed `max-h-*` + `overflow-y-auto` inside a `rounded-xl overflow-hidden` wrapper |
| Primary + icon-reset pair | CTA button (`min-w-[160px]`) + square icon button (`w-11 h-11`) side by side |

---

## 7. Icons

- Library: **Lucide React** exclusively
- Size range: `size={14}` (small inline) → `size={26}` (large button)
- Stroke weight: `strokeWidth={1.8}` (secondary) / `strokeWidth={2}` (primary)
- Header icon color: `text-gray-400` (neutral tools) or `text-emerald-400` (featured tools)
- Icon inside buttons: inherits button text color — do not override
- Decorative icons inside `<ToolWrapper>` header receive no background or border

---

## 8. Transitions

- Default: `transition-all` on every interactive element
- Color-only changes: `transition-colors` (saves a few repaints)
- Scale on press: `active:scale-95` (round) / `active:scale-[0.98]` (rect)
- Shadow: `shadow-lg` on the primary circular CTA only — nowhere else

---

## 9. What to Omit

> If it is not in this document, do not add it.

- No gradients (alpha overlays like `bg-white/5` are fine)
- No decorative borders, dividers, or rules beyond functional separators
- No background patterns, textures, or images
- No entrance/exit animations — only `transition` + `active:scale`
- No colored backgrounds on text labels or badges
- No `font-italic` or `text-decoration` styling
- No `text-shadow` or `drop-shadow` on text

---

## 10. Rules for New Tools

Follow every rule above. Additionally:

1. **Wrap in `<ToolWrapper>`** — every tool page renders its content inside the shared `ToolWrapper` component, passing `title`, `subtitle`, `icon`, and `adSlot`.

2. **Use `ToolWrapper` icon color to signal tone** — use `text-emerald-400` for calculators / time tools, `text-gray-400` for neutral utilities. Never use other colors for the header icon.

3. **Hero number first** — if the tool produces a primary numeric result, display it as a `text-[64px]+` `font-black` `tabular-nums` hero. All other output is secondary.

4. **No custom color introductions** — the only accent colors are `emerald` (positive / primary) and `red` (negative / destructive). Do not add blue, violet, amber, etc.

5. **Inputs follow one pattern** — `bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all`. Do not invent variations.

6. **Preset/quick-action buttons are ghost pills** — `rounded-full border border-zinc-700` with the emerald hover. Never use solid backgrounds for preset chips.

7. **Stat grids use `rounded-2xl` cards on `bg-zinc-900`** — label below value, value in `font-black tabular-nums`, label in `text-xs uppercase tracking-widest text-zinc-500`.

8. **Section labels are always `uppercase tracking-widest text-sm text-zinc-500 font-medium`** — no exceptions, no sentence-case section headers.

9. **One primary CTA per tool** — `bg-emerald-600` button. Everything else is secondary or ghost.

10. **Spacing between sections is `space-y-8` minimum, `space-y-12` maximum** — do not use arbitrary `mt-*` / `mb-*` to separate major sections.
