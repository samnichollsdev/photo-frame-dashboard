// Finds birthdays among calendar event titles. Only titles that END in "birthday" count, because
// "birthday meal", "birthday weekend" and the like are plans, often on a different day.
const TITLE = /^(.*?)\s*(?:(\d+)(?:st|nd|rd|th)\s+)?(?:birthday|b-?day)[\s!.]*$/i;

// "Sam - Daniel's" -> Daniel; "Sam -" -> Sam; "Gizmo's" -> Gizmo.
function nameFrom(text) {
  const parts = text.split(/\s+[-–—]\s*/).map((p) => p.trim()).filter(Boolean);
  const last = parts[parts.length - 1] || '';
  return last.replace(/\s*[-–—]$/, '').replace(/['’]s$/i, '').trim();
}

export function parseBirthday(title) {
  const m = TITLE.exec((title || '').trim());
  if (!m) return null;
  const name = nameFrom(m[1]);
  if (!name) return null;
  return { name, age: m[2] ? Number(m[2]) : null };
}

// events: [{ title, month, day, year, recurring }]. A one-off event counts as a yearly birthday.
// Age is only known when a title states one ("26th"), so it's given with the year it applied to.
export function findBirthdays(events) {
  const byName = new Map();
  for (const e of events) {
    const b = parseBirthday(e.title);
    if (!b) continue;
    const key = b.name.toLowerCase();
    const entry = { name: b.name, month: e.month, day: e.day, recurring: e.recurring, year: e.year, age: b.age };
    const had = byName.get(key);
    // Prefer a repeating event (the date was entered as the birthday), then the most recent one.
    if (!had || (e.recurring && !had.recurring) || (e.recurring === had.recurring && e.year > had.year)) byName.set(key, entry);
  }
  return [...byName.values()].map(({ name, month, day, age, year }) => ({ name, month, day, age, ageYear: age == null ? null : year }));
}
