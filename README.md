# Lane Survival Engine

A self-contained, vertical (9:16) **ASCII battle generator** for short-form video. Two heroes defend side-by-side lanes against an escalating horde and an unkillable boss — last one standing wins. Records itself to a `.webm` with synthesized sound baked in, so you can export clips for TikTok / Reels / Shorts.

## Run it
It's a single HTML file, no build step.

- **Easiest:** open `index.html` in a browser.
- **Local server (recommended for recording):** `npx serve` then open the printed URL.

## Play
- Pick the two lane characters and the boss in the **Matchup** panel, then hit **Start battle**.
- **Random** rolls a fresh matchup. **Record / Download** export a clip (recording auto-starts on Start and stops on the winner).
- Granular tuning (abilities, HP, horde, render, custom sounds) lives in the collapsible panels.
- Custom SFX: upload your own audio for each sound (e.g. a real fart for Gasbag) — it's mixed into exports.

## Develop
This repo is set up for [Claude Code](https://docs.claude.com/en/docs/claude-code/overview). See `CLAUDE.md` for the architecture and the golden rule: **every matchup must run >60s**, verified with the balance harness:

```
node tools/validate.js
```

## Deploy
Hosted on **GitHub Pages** — pushing to `main` redeploys automatically. The live URL is `https://<your-username>.github.io/lane-survival/`.
