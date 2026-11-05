// Which bin goes out next. Bins alternate weekly from one known collection; `moved` lists the weeks
// the council changes the day (bank holidays), as { usualDate: actualDate }.
const pad = (n) => (n < 10 ? '0' : '') + n;
const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const dateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function nextBin(now, bins) {
  const known = new Date(`${bins.knownDate}T00:00:00`);
  const today = midnight(now);
  const moved = bins.moved || {};
  const other = bins.knownBin === 'green' ? 'black' : 'green';
  // Start a fortnight back, because a collection moved later can still be ahead of us.
  let usual = addDays(today, (known.getDay() - today.getDay() + 7) % 7 - 14);
  let best = null;
  for (let i = 0; i < 6; i++, usual = addDays(usual, 7)) {
    const movedTo = moved[dateKey(usual)];
    const date = movedTo ? new Date(`${movedTo}T00:00:00`) : usual;
    const gone = +date < +today || (+date === +today && now.getHours() >= bins.collectedByHour);
    if (gone) continue;
    if (best && +date >= +best.date) continue;
    const weeks = Math.round((usual - known) / (7 * 864e5));
    best = { date, bin: Math.abs(weeks) % 2 === 0 ? bins.knownBin : other, moved: !!movedTo };
  }
  const days = Math.round((best.date - today) / 864e5);
  return { ...best, days, urgent: days === 0 || (days === 1 && now.getHours() >= bins.outFromHour) };
}
