// Settings the page needs. Nothing secret goes here: anyone on the network can read it.

// Bins alternate weekly. Give one known collection date and which bin went out that day; every
// other week is worked out from it. Add bank holiday changes to `moved` when the council
// publishes them: 'usual date': 'actual date'.
export const BINS = {
  moved: {
    // '2026-12-25': '2026-12-28',
  },
  knownDate: '2026-10-16', // a collection day (YYYY-MM-DD): Fridays
  knownBin: 'black',       // the bin collected on knownDate: 'green' or 'black'
  outFromHour: 18,         // "Out tonight" from 18:00 the day before
  collectedByHour: 9,      // "Out now" until 09:00 on collection day
};

// Team colours. Kidderminster plays in red and white halves; Liverpool in solid red.
export const TEAM_STYLE = {
  lfc: { short: 'LFC', style: 'solid' },
  khfc: { short: 'KH', style: 'halves' },
};

// Black out the screen between these hours (24-hour clock). The kiosk switches the backlight off
// on its own schedule: am start ... --ei night_from 22 --ei night_to 7 (keep the two the same).
export const NIGHT = { from: 22, to: 7 };

// The page dims gradually between these hours, up to `level` (0 = none, 1 = black), before night.
export const DIM = { from: 20, to: 22, level: 0.45 };

// From this hour the calendar drops what's finished and leads with tomorrow.
export const EVENING_FROM = 18;

// Calendar events are coloured by the first of these names found in the title (first match wins).
// Anything else keeps its calendar's colour.
export const PEOPLE = [
  { name: 'Both', colour: '#FAC775' },
  { name: 'Sam', colour: '#85B7EB' },
  { name: 'Abi', colour: '#ED93B1' },
];
