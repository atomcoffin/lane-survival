/* DEADEYE — edit the display name and dialogue, then refresh the browser.
   name : the matchup name shown on screen (keep it short)
   color: hex tint for this hero (optional; omit to keep the default)
   idle : random chatter that pops up during the fight
   hurt : pops up when this hero takes damage
   ult  : pops up when the ultimate fires
   Leave a list empty ([]) to keep the built-in default for that slot. */
window.LS_CHARACTERS = window.LS_CHARACTERS || {};
window.LS_CHARACTERS.DEADEYE = {
  name: "DEADEYE",
  idle: ["one shot", "bang", "headshot", "hold still"],
  hurt: ["missed me?", "tagged!", "ow, reload"],
  ult:  ["BULLET TIME!", "slow down"]
};
