// Monthly anniversary: use the 31st, or the last day in shorter months.
function anniversaryInMonth(year, month) {
  return new Date(year, month, Math.min(31, new Date(year, month + 1, 0).getDate()));
}
function getNextAnniversary(now = new Date()) {
  const year = now.getFullYear(), month = now.getMonth();
  const today = new Date(year, month, now.getDate());
  const current = anniversaryInMonth(year, month);
  if (today.getTime() === current.getTime()) return { date: current, celebrating: true };
  return { date: today < current ? current : anniversaryInMonth(year, month + 1), celebrating: false };
}
function calendarDaysSince(start, now = new Date()) {
  return Math.max(0, Math.round((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / 86400000));
}
if (typeof module !== 'undefined') module.exports = { getNextAnniversary, calendarDaysSince };
