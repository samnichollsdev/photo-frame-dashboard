# Home dashboard

A family dashboard for a 10.1" Frameo photo frame (1280×800, Android 6, WebView 106): clock, weather,
calendar, bins, birthdays, football and Spotify. It's a Vite page served by a Cloudflare Worker.
The frame only talks to the Worker, which holds the keys.

## Run it locally

Copy `.dev.vars.example` to `.dev.vars` and fill it in, then install the dependencies:

```bash
npm ci
```

Run these in two terminals, then open http://localhost:5175:

```bash
npm run api
```

```bash
npm run dev
```

Or use `npm run frame` to build and serve everything on port 5174, reachable from your network.
Spotify sign-in uses this port locally.

The page is black from 22:00 to 07:00. Click or tap it to wake it for a minute.

Use npm here. A `bun.lock` in this folder makes the Cloudflare build fail.

## Deploy

Pushing to `main` builds and deploys through Cloudflare Workers Builds:

| Setting | Value |
|---|---|
| Root directory | `home` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

The Worker's secrets are `ACCESS_KEY`, `CALENDARS`, `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`,
plus an optional `SPORTSDB_KEY`. The `STORE` KV namespace is set in `wrangler.jsonc`. The frame reloads
itself within about a minute of a new deploy.

## Change the settings

| What | Where |
|---|---|
| Bin schedule and moved collection dates | `src/config.js`, `BINS` |
| Night and evening dim hours | `src/config.js`, `NIGHT` and `DIM` |
| Person colours | `src/config.js`, `PEOPLE` |
| When the calendar leads with tomorrow | `src/config.js`, `EVENING_FROM` |
| Teams | `src/football.js` and `worker/config.js` |
| Weather location | `worker/config.js` |

If you change the night hours, change the kiosk's schedule to match:

```bash
adb shell am start -n com.wesbos.homehq/.MainActivity --ei night_from 22 --ei night_to 7
```

**Birthdays** come from calendar events whose title ends in "birthday", such as "Alex's Birthday" or
"Alex 30th Birthday". Titles like "birthday meal" are treated as plans and ignored. One-off events
repeat every year, and an age only shows if the title gives one. A yearly event is the most reliable.

## To do

- [ ] Add this year's Christmas and New Year bin dates to `BINS.moved`.
- [ ] Add yearly "Name's Birthday" events for anyone missing, and check dates that came from one-off events.
- [ ] Check the evening dim and tap to wake on the frame.
- [ ] Rebuild and install the kiosk app, so the frame gets the upstream changes, then test night mode.
- [ ] See the football out-of-date label appear during a real feed failure. It's only been seen on the calendar.

## Ideas

Size is a rough guess: **S** is under an hour, **M** is an evening, **L** is a bigger project.

### Features

**Best first**

- [ ] **Family photos when idle (L).** The frame no longer shows photos now that Frameo is off. Show a
  slideshow with a small clock, returning to the dashboard on a tap. First decide where the photos
  come from: a shared album, or a folder served by the Worker.
- [ ] **Today's highlights line (S).** One sentence under the date, such as "Bins out tonight, rain from
  16:00, football at 15:00".
- [ ] **Anniversaries and other yearly dates (S).** Search for them the same way as birthdays.
- [ ] **Present reminders (S).** Flag a birthday two weeks ahead, in time to buy something.

**Around the house**

- [ ] **Recurring jobs (M).** Show what's due and when it was last done, such as bin cleaning or pet
  appointments, using calendar events with a tap to mark them done.
- [ ] **Automatic bin dates (M).** Read collections from the council's website or calendar, if it offers
  one, instead of keeping the moved dates by hand.
- [ ] **Notes from your phone (M).** Send a short message to the frame, such as "Back late", through a
  small private page. Nothing would need typing on the frame.

**Weather**

- [ ] **Severe weather warnings (S).** Show a banner only when there's an official warning.
- [ ] **Rain chart for the next few hours (M).** A small graph, replacing the percentages.

**Football**

- [ ] **Recent form (S).** Show the last five results as W/D/L, using a feed that provides them.
- [ ] **Goal alerts (M).** Flash the card when the live score changes.
- [ ] **Bigger mini table on match day (S).** There's room for only about two rows at the moment.

**Interaction**

- [ ] **Tap a day for its details (M).** Open the full event list from the two-week strip or month view,
  including anything hidden behind "+2 more".
- [ ] **Tap Birthdays for the full year (S).** Only the next few fit on the main screen.
- [ ] **Swipe between screens (L).** Dashboard, photos and a full-screen calendar.

**Maybe later**

- [ ] **Travel time (M).** Leave-by times for the next event that has a location.
- [ ] **Smart home controls (L).** Worth it only if you have a hub to connect to, such as Home Assistant.

### Design

- [ ] **Use the gap in the clock card (S).** There's empty space under the current temperature when
  there's no rain warning. Move a highlights line there, or space the card out evenly.
- [ ] **Friendlier birthday names (S).** Names come from titles, so one can read oddly. Add a small
  list of display names, or rename the events.
- [ ] **Calmer weather tiles (S).** The clock card still has three rows of small tiles. Try
  merging the two daily forecasts into the hourly row.
- [ ] **Stronger "right now" (S).** Highlight the next event with a larger time and a countdown.
- [ ] **Daytime and evening looks (M).** Warmer, lower-contrast colours after sunset.
- [ ] **Birthday-day treatment (S).** A banner across the top on the day, instead of a highlighted row.
- [ ] **Check from across the room (S).** Look at it on the frame from where you'd normally stand, then
  adjust text sizes. All sizing so far was judged from screenshots.

### Technical

- [ ] **Add tests (M).** Cover `src/bins.js` and `worker/birthdays.js`, which are easy to test and easy to
  break quietly.
- [ ] **Keep football code in one place (M).** Fixtures are handled in both `src/football.js` and
  `worker/index.js`, and teams are listed in both too.
- [ ] **Lower the backlight in the evening (M).** Evening dim only darkens the page. Doing it in the kiosk
  app would dim the screen properly.
- [ ] **Remove the unused `FOOTBALL_KEY` (S).** It's still in local `.dev.vars` files, but nothing reads it.
- [ ] **Rotate shared keys (S).** Replace `ACCESS_KEY`, the Spotify secret and the calendar link if
  they've been shared anywhere, such as in a chat.
