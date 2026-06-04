/* RIBBIT — edit the display name and dialogue, then refresh the browser.
   name : the matchup name shown on screen (keep it short)
   color: hex tint for this hero (optional; omit to keep the default)
   idle : random chatter that pops up during the fight
   hurt : pops up when this hero takes damage
   ult  : pops up when the ultimate fires
   Leave a list empty ([]) to keep the built-in default for that slot. */
window.LS_CHARACTERS = window.LS_CHARACTERS || {};
window.LS_CHARACTERS.RIBBIT = {
  name: "RIBBIT",
  idle: ["ribbit ribbit", "hop hop", "catch flies", "so fly", "lily good"],
  hurt: ["croak!", "ow, my legs", "not toad-ally cool"],
  ult:  ["FLOOD TIME!", "make it rain", "pond's mine now"]
};
