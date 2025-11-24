# Black Magic Reels — Cursor Task List (Afro-Chic Luxe)

> Small, testable tickets. Each one should produce a visible change or passing tests.

## Foundation
- [x] chore(repo): init project; add Playwright, ESLint, Prettier; GitHub Actions CI
- [x] chore(ui): add theme tokens (Tailwind or CSS Modules)
- [x] docs: scaffold README (demo, features, tech, a11y)

### Theme Tokens (Afro-Chic Luxe)
- [x] chore(ui): define CSS vars
  - `--bg-obsidian:#0B0B0C; --bg-espresso:#1A1411; --text:#EDE7E1`
  - `--gold-classic:#D4AF37; --gold-rich:#B88A2B; --gold-antique:#A0772B; --gold-rose:#E6B7A9`
  - `--accent-emerald:#0F6D4E; --accent-indigo:#1A265E; --accent-oxblood:#5E1F2A`

## Core Logic (pure modules + tests)
- [x] feat(core): `rng/` — crypto-safe `randInt(n)` + unit tests
- [x] feat(core): `symbols/` — symbol defs (weights, payouts) + tests
- [x] feat(core): `paylines/` — `LINES_9` coordinates + tests
- [x] feat(core): `reels/` — build 5 reel strips (30–50 items each) from weights; spin to 3-visible per reel + tests
- [x] feat(core): `evaluator/` — left→right 3/4/5-oak; multi-line sum + tests
- [x] feat(core): `bankroll/` — balance, bet/line, lines, total bet; guards + tests
- [x] feat(core): `fsm/` — `IDLE → BET → SPINNING → EVAL → PAYOUT → IDLE` + tests

## UI Composition
- [x] feat(ui): ReelGrid (5×3) with stub symbols
- [x] feat(ui): BetControls (Lines: 1/9/20/25; Bet/Line: $1/$2/$5; show Total Bet)
- [x] feat(ui): HUD (Balance, Last Win, Spin) + disable rules when `balance < totalBet`
- [x] feat(a11y): ARIA live region for per-line + total win; keyboard: ↑/↓ lines, ←/→ bet/line, **Space** spin, **M** mute
- [x] feat(ui): Settings modal (Mute, Volume, Reduced-motion/audio, High-contrast)

## Animation & Feedback
- [x] feat(anim): staggered reel stops (~160ms gap) + tiny overshoot
- [x] feat(anim): near-miss wobble (respect `prefers-reduced-motion`)
- [x] feat(svg): SVG overlay for paylines (build paths from cell centers)
- [x] feat(svg): multi-win highlight — glow winning paths in gold; fade others; sequential per-line callouts
- [x] feat(audio): SFX (spin, stop, per-line chime, total fanfare) + mute/volume slider

## More Lines & Depth
- [ ] feat(paylines): add `LINES_20` + toggle; tests
- [ ] feat(paylines): add `LINES_25` + toggle; tests
- [ ] feat(ui): Achievements (Triple Thread, All Lights On, Diagonal Deity, Five-Reel Fever)
- [ ] feat(stats): Session stats (spins, hit rate, biggest win, streak) persisted in localStorage

## Designer Mode (optional stretch)
- [ ] feat(designer): dev-only panel to tweak symbol weights & active paylines
- [ ] feat(sim): run 10k–50k spin sim → chart RTP & hit rate → export PNG for README

## PWA & Delivery (optional)
- [ ] feat(pwa): manifest, icons, offline cache (sprites/SFX)
- [ ] docs: finalize README (diagram, a11y, RTP, badges) + capture 12–15s hero GIF
- [ ] docs: add tiny trailer clip to README

## QA & Performance
- [ ] test(unit): rng bounds; evaluator cases (wild/mult/3-/4-/5-oak); bankroll math
- [ ] test(e2e): spin flow; keyboard play; a11y tab order; reduced-motion path
- [ ] perf: FPS guard (reduce confetti density under load); prefetch assets; bundle budget
- [ ] audit: Lighthouse ≥95 (Perf & A11y); axe clean; fix regressions

---

## Quick Interfaces (reference)
- **Symbols JSON:** `{ id, label, weight, wild?, mult?: number[], payouts: { "3"?:number, "4"?:number, "5"?:number } }`
- **Evaluator result:** `{ total:number, results:[{ lineIndex, count, base, multStack, amount, coords:[ [r,c], ... ] }] }`
- **Events:** `onSpinStart`, `onReelStop(i)`, `onEvaluate(result)`, `onPayout(total)`
- **Persistence keys:** `bmr.balance`, `bmr.settings`, `bmr.stats`, `bmr.achievements`

## Definition of Done
- Works on mobile & desktop; keyboard operable; reduced-motion/audio respected
- No jank during spins; no layout shift on win
- Unit + e2e tests pass; CI green
- README updated with demo + a11y + RTP note
