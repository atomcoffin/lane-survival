# CLAUDE.md — Lane Survival Engine

Context for Claude Code working in this repo. Read this before editing.

## What this is
A single self-contained HTML "battle generator" for vertical short-form video (TikTok/Reels/Shorts). Two ASCII lanes race side-by-side in a 1080×1920 (9:16) canvas; each lane has a hero at the bottom auto-firing an ability against an escalating horde pouring from a cave at the top, with an unkillable boss (default: a bear) looming up top making it harder over time. **Win condition = survive the longest.** First hero to fall loses; a KO animation plays, then the survivor's name shows. Audio is synthesized with Web Audio and mixed into a `.webm` screen recording for export.

The real product is the *content* (funny matchups, names, captions); the engine is the vehicle.

## Files
- `index.html` — the entire app. One big inline `<script>` + `<style>`. No build step, no dependencies except Google Fonts (CDN). This is intentional — keep it single-file unless asked to modularize.
- `tools/validate.js` — headless Node balance harness. Loads the engine, stubs the browser, and simulates matches. **This is critical infra.**
- Open `index.html` directly in a browser to play, or `npx serve` for a local server.

## THE GOLDEN RULE — balance
**Every matchup must last longer than 60 seconds** (sub-60s videos earn $0 on TikTok), be **bounded** (~110s max, no timeouts/draws), and ideally swing between runs. After ANY change that touches mechanics, run:

```
node tools/validate.js
```

It prints each ability's mirror-match survival times and must show `all mirrors min>=60s: true`. If anything drops below 60 or runs to the cap, retune before committing.

**Balance-neutral changes** (sprites, names, colors, sounds, UI text, copy) do NOT need re-validation. **Mechanic changes** (ability params, enemy HP/speed/damage, wave growth, spawn rate, the attrition drain, ult threshold, hero HP) DO.

## Architecture / current design
- **Survival model**: boss spawns at the top of each lane at match start, is `invuln:true` (never damaged — abilities ignore it; `b` is nulled inside `ability()` so attacks target minions, never the boss).
- **Enemies**: spawn in **waves** that start small (~2) and grow (up to ~30), gaps tighten over time. They home straight at the hero with light **separation** so they don't overlap. Grunts have 2 HP, elites 12, bear cubs 6. Rendered as bear emoji at the cave; cubs/poop are boss-spawned and charge directly.
- **Escalation**: waves grow → eventually overwhelm whoever clears slower. A late **attrition drain** (after ~70s, ramps hard) guarantees even a perfect-clearing hero falls by ~110s, so there are no timeouts.
- **Ult**: fires once at **10% HP** as a last-stand (heal + clear + buff).
- **KO**: on death, `beginKO()` sets a ~1.6s sequence (loser's side darkens, 💀 rises, "K.O." stamp, death sting) before `end()` shows the survivor screen. Recording stops on the winner, so the KO is captured.
- **Custom SFX**: upload panel keyed by sound function (`zap`, `fart`, `frog`, `ult`, `roar`, `hit`, `win`, `ko`). Uploaded clips decode to AudioBuffers and play through `master` → captured in recordings. Gasbag's attack IS `sFart()`, so the "Fart" slot is the fart-for-Gasbag joke.

## Key tuning levers (in `cfg` defaults and `stepLane`/`simTick`)
- Hero HP (`cfg.A.hp`/`cfg.B.hp`) — global length multiplier.
- Wave growth `waveN=Math.min(30,2+Math.floor(elapsed*0.30))` and `gap`.
- Enemy speed `spd`, enemy `cfg.edmg`, enemy/elite/cub HP in `spawnEnemy`/boss step.
- Attrition drain (`if(elapsed>70) L.hp -= ...`).
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
