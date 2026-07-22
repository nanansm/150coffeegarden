/**
 * Meta Pixel — deferred loader.
 *
 * The legacy site ran the Pixel bootstrap as a synchronous inline script in
 * <head>, blocking parsing and pulling ~80KB of fbevents.js on the critical
 * path. It was the largest non-image cost on the page, and it tracked only
 * PageView — no conversion signal at all, which makes it nearly useless for
 * ad optimisation.
 *
 * Here: a tiny stub queues calls immediately, the real script loads on the
 * first idle moment or first interaction, and queued events flush on attach.
 * Critical-path cost: 0 KB, 0 ms.
 */

declare global {
  interface Window {
    fbq?: FbqFn & { callMethod?: (...a: unknown[]) => void; queue?: unknown[][] };
    _fbq?: unknown;
  }
}

type FbqFn = (...args: unknown[]) => void;

const PIXEL_ID = '1019637798400517';
const IDLE_TIMEOUT_MS = 3500;

function installStub() {
  if (window.fbq) return;
  const fbq: FbqFn & { callMethod?: (...a: unknown[]) => void; queue?: unknown[][] } = function (
    ...args: unknown[]
  ) {
    fbq.callMethod ? fbq.callMethod(...args) : fbq.queue!.push(args);
  };
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
}

let loaded = false;

function loadPixel() {
  if (loaded) return;
  loaded = true;

  // init/PageView/ViewContent are already queued by initPixel; loading the
  // script just flushes them.
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
}

export function initPixel(pageEvent?: 'ViewContent') {
  installStub();

  // Order matters. fbevents.js replays this queue verbatim on load, so `init`
  // has to be queued FIRST — a `track` sitting ahead of it is processed
  // against an uninitialised pixel and silently dropped. Queueing init here
  // (rather than inside loadPixel) costs no network: it is just an array push.
  window.fbq?.('init', PIXEL_ID);
  window.fbq?.('track', 'PageView');
  if (pageEvent) window.fbq?.('track', pageEvent);

  const triggers: Array<[string, EventListenerOptions & { once: true }]> = [
    ['scroll', { once: true, passive: true } as never],
    ['pointerdown', { once: true }],
  ];
  triggers.forEach(([event, opts]) => window.addEventListener(event, loadPixel, opts));

  // requestIdleCallback is not available everywhere, so always ship the
  // setTimeout fallback.
  if ('requestIdleCallback' in window) {
    (window as never as { requestIdleCallback: (cb: () => void, o?: object) => void })
      .requestIdleCallback(loadPixel, { timeout: IDLE_TIMEOUT_MS });
  } else {
    setTimeout(loadPixel, IDLE_TIMEOUT_MS);
  }

  // Every WhatsApp CTA is a conversion signal. The legacy site had none of
  // these, so the Pixel could not optimise for anything but traffic.
  const fireContact = () => {
    loadPixel();
    window.fbq?.('track', 'Contact');
  };

  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement)?.closest?.('[data-wa]')) fireContact();
  });
  window.addEventListener('wa:contact', fireContact);
}
