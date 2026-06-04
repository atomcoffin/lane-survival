# Character names & dialogue

One file per hero. Edit a file, **save, refresh the browser** — changes show up
immediately. No build step.

## What you can change

```js
window.LS_CHARACTERS.RIBBIT = {
  name: "RIBBIT",                       // the matchup name shown on screen
  color: "#46e2a0",                     // (optional) hex tint for the hero
  idle: ["ribbit ribbit", "hop hop"],   // random chatter during the fight
  hurt: ["croak!", "ow, my legs"],      // shown when the hero takes damage
  ult:  ["FLOOD TIME!", "make it rain"] // shown when the ultimate fires
};
```

- **name** — what shows above the hero (keep it short so it fits the lane).
- **color** — optional; delete the line to keep the built-in color.
- **idle / hurt / ult** — lists of one-liners; one is picked at random each time.
  Leave a list empty (`[]`) or delete it to keep the built-in defaults for that slot.

## Rules of thumb

- Keep each line short (a few words) — long lines get clipped to the lane.
- Wrap every line in straight quotes `"like this"`. If a line itself contains a
  `"`, use single quotes around it instead: `'she said "hi"'`.
- Don't rename the `window.LS_CHARACTERS.KEY` part (e.g. `RIBBIT`) — that key wires
  the file to the right hero, its sprite, and its ultimate. Only change the values.
- Break a file and that hero just falls back to the built-in name/dialogue — the
  rest of the game keeps working.

## What you can't change here

Abilities, sprites, ult mechanics, and balance live in `index.html`. These files
are names + dialogue only.
