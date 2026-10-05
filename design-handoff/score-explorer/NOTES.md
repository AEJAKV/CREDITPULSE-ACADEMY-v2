# Score explorer export

Source: `ScoreVisual()` in `components/SinglePageCourse.jsx` (lines 320–347). CSS from `app/globals.css`. Nothing in the project was modified.

Files: `ScoreExplorer.jsx` (component), `score-explorer.css` (all rules it uses, in original source order — later rules override earlier ones, so keep the order).

## Dependencies

- **React** `useState` (`"use client"` needed in Next.js).
- **lucide-react**: `CircleGauge` (header icon), `ShieldCheck` (result box icon).
- **Font**: Plus Jakarta Sans via `next/font/google` in `app/layout.js`, `subsets:["latin"]`, `display:"swap"`, `variable:"--font-plus-jakarta-sans"`; the variable class goes on `<html>`. `.reader-shell` applies it (`font-family:var(--font-plus-jakarta-sans),sans-serif`, 18px, line-height 1.7). Without it the text falls back to `sans-serif`.
- **Wrapper**: must sit inside `.reader-shell` (supplies the `--reader-*` variables) and in the source is wrapped as `<div className="reader-score-panel"><ScoreVisual /></div>`.
- **Global base rules** (copied at the top of the CSS file): `*{box-sizing:border-box}`, `button,input…{font:inherit}`, and the global `input{width:100%;border:1px solid #bdc6c0;border-radius:9px;background:#fff;padding:14px 15px}` that `.score-number-input` overrides. Also `:root --ink:#10292b`, `--teal:#207b5f` (used by the global input focus rule).
- **No helpers or other libraries.** Score clamp is inline: `min(900, max(300, Number(input)||300))`; slider fill position `((score-300)/600)*100` is passed as `--score-position` (set on the range input but not used by any CSS rule).
- **Markup quirk**: the `.calculator-frame score-calculator-frame` outer div is what draws the gradient border. `ScoreExplorer.jsx` includes it.

## Score bands (logic)

| Key | Range | Label | Colour |
|---|---|---|---|
| building | 300–659 | Building | `#eb7053` |
| good | 660–724 | Good | `#f4be4f` |
| very-good | 725–759 | Very good | `#47a98a` |
| excellent | 760–900 | Excellent | `#16745d` |

Default score is 650. No `.score-live-result.<key>` CSS exists, so the result box looks the same for every band; only the band card marked `.current` changes.

## Colour values

CSS variables (on `.reader-shell`): `--reader-ink #102e31`, `--reader-green #16745d`, `--reader-mint #a9e582`, `--reader-blue #dcecf4`, `--reader-gold #f4be4f`, `--reader-coral #e87352`, `--reader-surface rgba(255,255,255,.76)`. Shell background `#eef3ee`.

Slider track gradient (webkit and moz, identical): `linear-gradient(90deg,#eb7053 0 60%,#f4be4f 60% 70.8%,#47a98a 70.8% 76.7%,#16745d 76.7% 100%)` — red 0–60%, yellow 60–70.8%, teal 70.8–76.7%, green 76.7–100%. Band-card top bars use the same four colours.

Card backgrounds: explorer `linear-gradient(145deg,rgba(255,255,255,.82),rgba(225,241,234,.58))` + `backdrop-filter:blur(24px) saturate(150%)`; shine overlay `:before` `linear-gradient(115deg,rgba(255,255,255,.58),transparent 36%,rgba(22,116,93,.07))`, opacity .9. Result box `linear-gradient(135deg,rgba(225,246,236,.88),rgba(238,249,244,.68))`.

Gradient card border (`.calculator-frame`): 2px padding, radius 11px, `overflow:hidden`. `:before` is a 150%-wide square with `conic-gradient(from 0deg,#16745d 0deg,#6bdaa2 72deg,rgba(255,255,255,.86) 128deg,#8054c7 205deg,#bb91ef 270deg,rgba(255,255,255,.86) 320deg,#16745d 360deg)`, rotating 360° over 12s linear infinite (`@keyframes calculator-perimeter`). The inner `.score-explorer` is lifted above it (`z-index:1`), `border:0`, radius 9px, `background:linear-gradient(145deg,#fbfcfb,#edf4f0)`, which leaves a 2px ring of the moving gradient. Under 760px the `:before` width is fixed at 1100px. Reduced-motion turns the animation off.

Text colours: value `#0d3937`; labels/small text `#345954`, `#526b67`, `#607773`, `#627976`, `#647b77`, `#758985`, `#49635e`; header text `#3a5b56`; result title `#173f3a`; result body `#526b67`; disclaimer `#6e817e`.

## Sizes, spacing, borders, shadows

- **Panel**: `.reader-score-panel` width `min(720px,100%)`, margin `48px auto` (38px under 760px).
- **Explorer**: 2-column grid `minmax(0,1fr) 150px`, gap `18px 24px`, padding `clamp(24px,4vw,38px)`, radius 8px, border `1px solid rgba(255,255,255,.96)`, shadow `0 30px 80px rgba(19,63,57,.16), inset 0 1px 0 #fff`.
- **Header**: bottom padding 17px, border-bottom `1px solid rgba(16,46,49,.1)`; label .78rem/800 uppercase, letter-spacing .05em, icon 19px; "LIVE" pill `.58rem`, letter-spacing .1em, radius 999px, padding `7px 11px`.
- **Score number**: `clamp(3.5rem,8vw,5.7rem)`, line-height 1, weight 800 (Plus Jakarta). "Your score" .68rem uppercase; "out of 900" .75rem/700. Card: min-height 132px, padding `22px 24px`, radius 8px, border `1px solid rgba(255,255,255,.85)`, bg `rgba(255,255,255,.48)`, blur 16px, shadow `inset 0 1px 0 rgba(255,255,255,.95), 0 14px 34px rgba(25,68,62,.08)`.
- **Number input**: height 54px, radius 7px, font 1.15rem/800 centred, colour `#123f3b`, border `rgba(22,116,93,.2)`; focus ring `0 0 0 4px rgba(22,116,93,.14)`.
- **Slider wrap**: padding `22px 20px 14px`, radius 8px, bg `rgba(247,252,249,.54)`, border `1px solid rgba(255,255,255,.82)`. Track 10px high, radius 999px, shadow `inset 0 1px 2px rgba(16,46,49,.12), 0 0 0 5px rgba(255,255,255,.38)`. Thumb 30px (webkit) / 18px + 6px border (moz), 6px white border, fill `#0d3937`, shadow `0 5px 16px rgba(16,46,49,.32)`. Labels 300 / 900 at .68rem/800.
- **Band cards**: 4 columns, gap 10px, padding `12px 11px`, radius 6px, 4px top colour bar. `.current`: lifted `translateY(-3px)`, border `rgba(22,116,93,.3)`, bg `rgba(232,247,239,.9)`, shadow `0 12px 26px rgba(24,91,76,.12)`.
- **Result (shield) box**: padding 20px, radius 7px, gap 14px, border `1px solid rgba(22,116,93,.2)`, blur 14px, shadow `inset 0 1px 0 rgba(255,255,255,.9), 0 14px 34px rgba(22,87,72,.09)`. Shield icon 28px, `--reader-green`. Range text .65rem, title 1.25rem, paragraph .82rem/1.55.
- **Disclaimer**: .67rem, line-height 1.5 (all `!important`).

## Mobile

- ≤760px: explorer columns `minmax(0,1fr) 118px`, padding `22px 16px`, gap `15px 13px`; "Your score" label hidden; value 3.75rem; value card min-height 112px/padding 18px; slider wrap padding `20px 14px 12px`; band grid 2 columns, gap 8px; result padding 17px, text .74rem; gradient border width 1100px.
- ≤420px: second column 105px; value 3.35rem; number input padding 8px; band text .64rem.
- `prefers-reduced-motion`: border rotation disabled.
