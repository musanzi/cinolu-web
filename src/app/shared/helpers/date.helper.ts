export function atTime(date: Date, hours: number, minutes: number): Date {
  const merged = new Date(date);
  merged.setHours(hours, minutes, 0, 0);
  return merged;
}

export function combineDateAndTime(date: Date, time: Date): Date {
  const merged = new Date(date);
  merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return merged;
}

export function formatTime(date: Date | string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';

  const hours = String(parsed.getHours()).padStart(2, '0');
  const minutes = String(parsed.getMinutes()).padStart(2, '0');
  return `${hours}h${minutes}`;
}

export function pluralize(value: number, singular: string, plural: string): string {
  return `${value} ${value > 1 ? plural : singular}`;
}

export function hasEnded(endDate: Date | string): boolean {
  const parsed = new Date(endDate);
  if (Number.isNaN(parsed.getTime())) return false;

  return parsed.getTime() < Date.now();
}

export function endOfDay(date: Date | string): Date {
  const parsed = new Date(date);
  parsed.setHours(23, 59, 59, 999);
  return parsed;
}

export function isSameDay(start: Date | string, end: Date | string): boolean {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return false;

  return startDate.toDateString() === endDate.toDateString();
}

export function timeRangeLabel(start: Date | string, end: Date | string): string {
  const startLabel = formatTime(start);
  const endLabel = formatTime(end);
  return startLabel && endLabel ? `de ${startLabel} à ${endLabel}` : '';
}

export function durationLabel(start: Date | string, end: Date | string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = endDate.getTime() - startDate.getTime();
  if (Number.isNaN(diff) || diff <= 0) return '';

  const totalMinutes = Math.round(diff / 60_000);
  if (totalMinutes < 60) return pluralize(totalMinutes, 'minute', 'minutes');

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours < 24) {
    const hoursLabel = pluralize(hours, 'heure', 'heures');
    return minutes ? `${hoursLabel} ${minutes}` : hoursLabel;
  }

  return pluralize(Math.round(hours / 24), 'jour', 'jours');
}
