import type { APIRoute } from 'astro';

/** Tiga hari, 10.00–20.30 WIB, satu VEVENT berulang harian. */
const ics = [
  'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//150 Coffee Garden//JCW Undangan//ID', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  'BEGIN:VEVENT', 'UID:jcw-undangan-2026@150coffeegarden.com', 'DTSTAMP:20261115T000000Z',
  'DTSTART:20261204T030000Z', 'DTEND:20261204T133000Z', 'RRULE:FREQ=DAILY;COUNT=3',
  'SUMMARY:The Garden of Wonder — 150 Coffee Garden at Jacoweek 2026',
  'DESCRIPTION:Undangan The Garden of Wonder #SensoryExperience. Buka setiap hari 10.00–20.30 WIB.',
  'LOCATION:ICE BSD City\\, Hall 9 & 10',
  'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:The Garden of Wonder', 'END:VALARM',
  'END:VEVENT', 'END:VCALENDAR', '',
].join('\r\n');

export const GET: APIRoute = () =>
  new Response(ics, { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': 'attachment; filename="the-garden-of-wonder.ics"' } });
