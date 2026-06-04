# CLAUDE.md — Lane Survival Engine

Context for Claude Code working in this repo. Read this before editing.

## What this is
A single self-contained HTML "battle generator" for vertical short-form video (TikTok/Reels/Shorts). Two ASCII lanes race side-by-side in a 1080×1920 (9:16) canvas; each lane has a hero at the bottom auto-firing an ability against an escalating horde pouring from a cave at the top, with an unkillable boss (default: a bear) looming up top making it harder over time. **Win condition = survive the longest.** First hero to fall loses; a KO animation plays, then the survivor's name shows. Audio is synthesized with Web Audio and mixed into a `.webm` screen recording for export.

The real product is the *content* (funny matchups, names, captions); the engine is the vehicle.

## Files
- `index.html` — the entire app. One big inline `<script>` + `<style>`. No build step, no dependencies except Google Fonts (CDN). Keep the *engine* single-file unless asked to modularize.
- `characters/` — editable content overrides, **one plain `.js` file per hero** (plus `README.md`). Each registers `window.LS_CHARACTERS.<KEY> = { name, color?, idle[], hurt[], ult[] }`; `index.html` loads them via `<script src>` tags (just before the main script) and merges them over the baked-in defaults at load. Lets the maintainer change a hero's **display name and dialogue on the fly** — edit a file, refresh, done. Each character has a stable `key` (its original id) used for sprite/ult/dialogue lookup, so the editable `name` can change freely without breaking art. The inline `QUIPS`/`CHARACTERS` defaults in `index.html` are the fallback: a missing/broken/absent `characters/` folder just reverts to defaults, so `file://` double-click, GitHub Pages, and the validate harness all keep working. **Content-only (names/dialogue/color) — never abilities, sprites, or balance; those stay in `index.html`.** This is the one sanctioned exception to single-file.
- `tools/validate.js` — headless Node balance harness. Loads the engine, stubs the browser, and simulates matches. Extracts the main script via a `<script>` (no-attribute) regex, so the `characters/*.js` tags (which have a `src` attribute) are correctly skipped — don't add an attribute-less `<script>` before the main one. **This is critical infra.**
- Open `index.html` directly in a browser to play, or `npx serve` for a local server. Hosts as static files on GitHub Pages (the `characters/` folder ships alongside `index.html`).

## THE GOLDEN RULE — balance
**Every matchup must last longer than 60 seconds** (sub-60s videos earn $0 on TikTok), be **bounded** (~110s max, no timeouts/draws), and ideally swing between runs. The balance harness checks this:

```
node tools/validate.js
```

It prints each ability's mirror-match survival times and must show `all mirrors min>=60s: true`. If anything drops below 60 or runs to the cap, retune.

**Workflow note (maintainer preference):** do NOT run `validate.js` automatically — the sim is slow. Make the change and ship it; the maintainer will ask for a balance check when they want one. If a change clearly risks breaking balance, flag it in the summary so they can decide.

**Balance-neutral changes** (sprites, names, colors, sounds, UI text, copy) do NOT need re-validation. **Mechanic changes** (ability params, enemy HP/speed/damage, wave growth, spawn rate, enemy HP scaling, ult threshold, hero HP) DO — but still only run the sim on request.

## Architecture / current design
- **Survival model**: boss spawns at the top of each lane at match start, is `invuln:true` (never damaged — abilities ignore it; `b` is nulled inside `ability()` so attacks target minions, never the boss).
- **Enemies**: spawn in **waves** that start small (~2) and grow (up to ~30), gaps tighten over time. They home straight at the hero with light **separation** so they don't overlap. Grunts have 2 HP, elites 12, bear cubs 6. Rendered as bear emoji at the cave; cubs/poop are boss-spawned and charge directly.
- **Escalation**: death is **enemy-driven** (the old post-70s attrition HP drain was removed). Waves grow bigger and tighter, enemy **speed ramps hard** (mid ramp after ~30s + a steep late wall), and enemies **gain HP over time** (after ~50s) so AOE can't hold the line forever. Together these overwhelm even a perfect clearer by ~120s — no timeouts.
- **Ult**: fires once at **10% HP** as a last-stand (heal + clear + buff).
- **KO**: on death, `beginKO()` sets a ~1.6s sequence (loser's side darkens, 💀 rises, "K.O." stamp, death sting) before `end()` shows the survivor screen. Recording stops on the winner, so the KO is captured.
- **Custom SFX**: upload panel keyed by sound function (`zap`, `fart`, `frog`, `ult`, `roar`, `hit`, `win`, `ko`). Uploaded clips decode to AudioBuffers and play through `master` → captured in recordings. Gasbag's attack IS `sFart()`, so the "Fart" slot is the fart-for-Gasbag joke.

## Key tuning levers (in `cfg` defaults and `stepLane`/`simTick`)
- Hero HP (`cfg.A.hp`/`cfg.B.hp`) — global length multiplier.
- Wave growth `waveN` (cap + `Math.floor(elapsed*…)`), `gap` floor, and the on-field enemy cap — all in `stepLane`.
- Enemy speed ramp `spd` (the `Math.max(0,elapsed-…)*…` terms — main game-length lever), enemy `cfg.edmg`.
- Enemy HP scaling `ghp` in `spawnEnemy` (grunt/elite base + growth after ~50s); cub HP in boss step.
- `ULT_THRESH` (0.10), `SURV_CAP` (160 safety).

## Editing gotchas
- It's one large inline script — search for the function/constant by name.
- Sprites, boss art, and entrances are ASCII string arrays; widths can vary (the renderer centers each row).
- The boss renders at hero scale on the grid; enemies render as raw-positioned emoji.

## Workflow
1. Edit `index.html`.
2. `node tools/validate.js` (if mechanics changed) → confirm `all mirrors min>=60s: true`.
3. Open `index.html` to eyeball the visuals.
4. Commit + push. GitHub Pages redeploys automatically.
