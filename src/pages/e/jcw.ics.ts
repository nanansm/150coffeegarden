import type { APIRoute } from 'astro';
import { toIcs } from '../../data/jcw';

/** Static endpoint, prerendered at build time (site uses `output: 'static'`). */
export const GET: APIRoute = () =>
  new Response(toIcs(), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="150-jcw.ics"',
    },
  });
