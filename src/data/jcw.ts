/**
 * Single source of truth for the Jakarta Coffee Week appearance: dates,
 * venue, and the .ics / Google Calendar links generated from them.
 *
 * Confirmed with the client on 8 September 2026.
 */

export const jcwEvent = {
  title: '150 Coffee Garden at Jakarta Coffee Week',
  description:
    "We're bringing the garden to Jakarta Coffee Week. Come find us — there's something different waiting for you.",
  location: 'ICE BSD',
  venueDetail: 'Booth C94-95',
  startDate: '2026-12-04',
  endDate: '2026-12-06',
  doorsOpen: '10:00',
  doorsClose: '22:00',
  timezone: 'Asia/Jakarta',
  uid: 'jcw-2026@150coffeegarden.com',
} as const;

/** Formats a UTC `Date` as an iCalendar `YYYYMMDDTHHMMSSZ` timestamp. */
function formatUtc(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

/** Escapes text per RFC 5545 §3.3.11 for use inside SUMMARY/DESCRIPTION/LOCATION. */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Folds a single `KEY:value` line so no output line exceeds 75 octets, per
 * RFC 5545 §3.1. Splits on Unicode code points so a multi-byte UTF-8
 * character is never cut in half; continuation lines start with a space.
 */
function foldIcsLine(line: string): string {
  const maxOctets = 75;
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= maxOctets) return line;

  const chunks: string[] = [];
  let current = '';
  let currentOctets = 0;
  let limit = maxOctets;

  for (const char of line) {
    const charOctets = encoder.encode(char).length;
    if (currentOctets + charOctets > limit) {
      chunks.push(current);
      current = '';
      currentOctets = 0;
      limit = maxOctets - 1; // continuation lines are prefixed with a space
    }
    current += char;
    currentOctets += charOctets;
  }
  chunks.push(current);

  return chunks.join('\r\n ');
}

/** `YYYY-MM-DD` → the `YYYYMMDD` form an all-day DTSTART/DTEND takes. */
function icsDate(date: string): string {
  return date.replace(/-/g, '');
}

/**
 * All-day DTEND is *exclusive* (RFC 5545 §3.8.2.2): a 4–6 December event
 * ends on the 7th. Getting this wrong drops the last day of the fair.
 */
function icsDateEndExclusive(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  return formatUtc(next).slice(0, 8);
}

/** Body of the calendar entry: the invitation line, then the opening hours. */
function icsDescription(): string {
  return `${jcwEvent.description}\n\nOpen daily ${jcwEvent.doorsOpen}\u2013${jcwEvent.doorsClose} WIB.`;
}

function icsLocation(): string {
  return jcwEvent.venueDetail ? `${jcwEvent.location}, ${jcwEvent.venueDetail}` : jcwEvent.location;
}

/** Builds the full VCALENDAR document for the JCW appearance. */
export function toIcs(): string {
  // Deliberately an all-day event, not a timed one. A single VEVENT running
  // 4 Dec 10:00 to 6 Dec 22:00 renders as one unbroken 60-hour busy block —
  // it swallows two nights of the guest's calendar and invites deletion.
  // All-day shows as a quiet three-day banner and marks nobody busy; the
  // opening hours live in the description instead.
  const dtStart = icsDate(jcwEvent.startDate);
  const dtEnd = icsDateEndExclusive(jcwEvent.endDate);
  const dtStamp = formatUtc(new Date());

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//150 Coffee Garden//JCW//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${jcwEvent.uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${escapeIcsText(jcwEvent.title)}`,
    `DESCRIPTION:${escapeIcsText(icsDescription())}`,
    `LOCATION:${escapeIcsText(icsLocation())}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT14H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcsText(jcwEvent.title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.map(foldIcsLine).join('\r\n') + '\r\n';
}

/** Builds a "Add to Google Calendar" link that matches the .ics dates exactly. */
export function googleCalendarUrl(): string {
  // Bare `YYYYMMDD/YYYYMMDD` (end exclusive) is how Google's template URL
  // spells an all-day event — matching the .ics above. No `ctz`: an all-day
  // event has no timezone to convert.
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: jcwEvent.title,
    dates: `${icsDate(jcwEvent.startDate)}/${icsDateEndExclusive(jcwEvent.endDate)}`,
    details: icsDescription(),
    location: icsLocation(),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
