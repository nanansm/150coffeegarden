/* =========================
   CONFIG
   ========================= */

// WhatsApp number (ganti ke nomor wedding)
const WA_NUMBER = "6281222809995";

// Prefill message (ringkas & human)
const WA_PREFILL =
  "Halo min 150 Wedding Venue, saya mau tanya ketersediaan tanggal wedding.\n" +
  "Tanggal incaran: \n" +
  "Estimasi tamu: \n" +
  "Akad/Resepsi: \n" +
  "Terima kasih 🙂";

// Google Sheet Calendar (optional)
// 1) Publish sheet: File > Share > Publish to web
// 2) Isi SHEET_ID & GID
// 3) Kolom di sheet (header): date | status | note
//    date format: YYYY-MM-DD
//    status: available / tentative / booked
const SHEET_ID = ""; // <-- isi kalau sudah ada
const GID = "";      // <-- isi kalau sudah ada

/* =========================
   Helpers
   ========================= */

function buildWhatsAppLink() {
  const text = encodeURIComponent(WA_PREFILL);
  return `https://wa.me/${WA_NUMBER}?text=${text}`;
}

function $(sel, root = document) {
  return root.querySelector(sel);
}

function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

/* =========================
   Mobile Drawer
   ========================= */

(function initDrawer() {
  const burger = $("#burger");
  const drawer = $("#drawer");
  const closeBtn = $("#drawerClose");

  if (!burger || !drawer || !closeBtn) return;

  const open = () => {
    drawer.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    drawer.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  burger.addEventListener("click", () => {
    const hidden = drawer.getAttribute("aria-hidden") !== "false";
    hidden ? open() : close();
  });

  closeBtn.addEventListener("click", close);
  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) close();
  });

  $all(".drawer__link", drawer).forEach((a) => a.addEventListener("click", close));
})();

/* =========================
   WhatsApp buttons
   ========================= */

(function initWhatsAppButtons() {
  const link = buildWhatsAppLink();

  const waButton = $("#waButton");
  const stickyWA = $("#stickyWA");
  const ctaTop = $("#ctaWhatsAppTop");

  [waButton, stickyWA].forEach((el) => {
    if (!el) return;
    el.setAttribute("href", link);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noreferrer");
  });

  // Top CTA scrolls to action (not WA directly) - but still friendly:
  if (ctaTop) {
    ctaTop.addEventListener("click", (e) => {
      // keep smooth scroll default
    });
  }
})();

/* =========================
   FAQ Accordion
   ========================= */

(function initAccordion() {
  const acc = $("#accordion");
  if (!acc) return;

  $all(".qa", acc).forEach((item) => {
    const btn = $(".qa__q", item);
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      // close others for cleaner UX
      $all(".qa", acc).forEach((x) => {
        x.classList.remove("open");
        const b = $(".qa__q", x);
        if (b) b.setAttribute("aria-expanded", "false");
        const icon = $(".qa__icon", x);
        if (icon) icon.textContent = "+";
      });

      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        const icon = $(".qa__icon", item);
        if (icon) icon.textContent = "−";
      }
    });
  });
})();

/* =========================
   Lightbox for moments
   ========================= */

(function initLightbox() {
  const lb = $("#lightbox");
  const lbImg = $("#lightboxImg");
  const lbClose = $("#lightboxClose");
  const masonry = $("#masonry");

  if (!lb || !lbImg || !lbClose || !masonry) return;

  const open = (src) => {
    lbImg.src = src;
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lb.setAttribute("aria-hidden", "true");
    lbImg.src = "";
    document.body.style.overflow = "";
  };

  masonry.addEventListener("click", (e) => {
    const btn = e.target.closest(".masonry__item");
    if (!btn) return;
    const src = btn.getAttribute("data-img");
    if (src) open(src);
  });

  lbClose.addEventListener("click", close);
  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lb.getAttribute("aria-hidden") === "false") close();
  });
})();

/* =========================
   Calendar (local render + optional Google Sheet)
   ========================= */

const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const statusMap = new Map(); // dateStr -> {status, note}

let current = new Date();
current.setDate(1);

function pad(n) {
  return String(n).padStart(2, "0");
}

function toDateKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function renderCalendar() {
  const title = $("#calTitle");
  const grid = $("#calGrid");
  if (!title || !grid) return;

  const y = current.getFullYear();
  const m = current.getMonth(); // 0-based

  const monthName = current.toLocaleString("en-US", { month: "long" });
  title.textContent = `${monthName} ${y}`;

  grid.innerHTML = "";

  // day names
  for (const n of dayNames) {
    const el = document.createElement("div");
    el.className = "dayName";
    el.textContent = n;
    grid.appendChild(el);
  }

  // compute first day offset (Mon-based)
  const first = new Date(y, m, 1);
  const jsDay = first.getDay(); // 0 Sun..6 Sat
  const monBased = (jsDay === 0 ? 7 : jsDay); // 1..7 (Mon..Sun)
  const offset = monBased - 1; // 0..6

  // previous month fill
  const prevLast = new Date(y, m, 0).getDate();
  for (let i = offset - 1; i >= 0; i--) {
    const cell = makeCell(new Date(y, m - 1, prevLast - i), true);
    grid.appendChild(cell);
  }

  // current month cells
  const last = new Date(y, m + 1, 0).getDate();
  for (let d = 1; d <= last; d++) {
    const cell = makeCell(new Date(y, m, d), false);
    grid.appendChild(cell);
  }

  // next month fill to complete grid (6 weeks)
  const totalCells = 7 * 6;
  const already = grid.children.length - 7; // exclude day names row
  const remain = totalCells - already;
  for (let i = 1; i <= remain; i++) {
    const cell = makeCell(new Date(y, m + 1, i), true);
    grid.appendChild(cell);
  }
}

function makeCell(dateObj, muted) {
  const cell = document.createElement("div");
  cell.className = "cell" + (muted ? " cell--muted" : "");
  const num = document.createElement("div");
  num.className = "cell__num";
  num.textContent = dateObj.getDate();

  const key = toDateKey(dateObj);
  const meta = statusMap.get(key);

  const tag = document.createElement("div");
  tag.className = "cell__tag";

  // default when no sheet: show nothing (clean)
  if (meta?.status) {
    const s = meta.status.toLowerCase();
    if (s.includes("book")) {
      tag.textContent = "Booked";
      tag.classList.add("tag--book");
    } else if (s.includes("tent")) {
      tag.textContent = "Tentative";
      tag.classList.add("tag--tent");
    } else {
      tag.textContent = "Available";
      tag.classList.add("tag--avail");
    }
  } else {
    tag.style.display = "none";
  }

  cell.appendChild(num);
  cell.appendChild(tag);

  // click to prefill WA with date
  if (!muted) {
    cell.style.cursor = "pointer";
    cell.title = meta?.note ? meta.note : "Klik untuk tanya tanggal ini via WhatsApp";
    cell.addEventListener("click", () => {
      const dateText = key;
      const message =
        "Halo min 150 Wedding Venue, saya mau tanya ketersediaan tanggal wedding.\n" +
        `Tanggal incaran: ${dateText}\n` +
        "Estimasi tamu: \n" +
        "Akad/Resepsi: \n" +
        "Terima kasih 🙂";
      const link = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(link, "_blank", "noopener,noreferrer");
    });
  }

  return cell;
}

async function loadSheetIfConfigured() {
  if (!SHEET_ID || !GID) {
    // no sheet: still render calendar
    renderCalendar();
    $("#calHint").textContent =
      "*Klik tanggal untuk tanya via WhatsApp. (Integrasi Google Sheet bisa ditambahkan.)";
    return;
  }

  // Google Visualization API (published sheet) - returns JS-like response
  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?gid=${GID}&tqx=out:json`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();

    // response looks like: google.visualization.Query.setResponse({...});
    const jsonStr = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const data = JSON.parse(jsonStr);

    const cols = data.table.cols.map((c) => (c.label || "").toLowerCase());
    const rows = data.table.rows;

    const dateIdx = cols.indexOf("date");
    const statusIdx = cols.indexOf("status");
    const noteIdx = cols.indexOf("note");

    statusMap.clear();

    rows.forEach((r) => {
      const cells = r.c;
      const dateVal = cells?.[dateIdx]?.v;
      const statusVal = cells?.[statusIdx]?.v;
      const noteVal = noteIdx >= 0 ? cells?.[noteIdx]?.v : "";

      if (!dateVal || !statusVal) return;

      // dateVal could be "2025-12-19" or Date() formatted; normalize:
      const key = String(dateVal).slice(0, 10);
      statusMap.set(key, { status: String(statusVal), note: noteVal ? String(noteVal) : "" });
    });

    $("#calHint").textContent =
      "*Status bisa berubah. Setelah pilih tanggal, chat WA untuk konfirmasi & lock date.";
    renderCalendar();
  } catch (e) {
    console.error(e);
    $("#calHint").textContent =
      "*Gagal memuat kalender dari Google Sheet. Silakan chat WA untuk cek tanggal.";
    renderCalendar();
  }
}

(function initCalendar() {
  const prev = $("#calPrev");
  const next = $("#calNext");
  if (prev) {
    prev.addEventListener("click", () => {
      current.setMonth(current.getMonth() - 1);
      renderCalendar();
    });
  }
  if (next) {
    next.addEventListener("click", () => {
      current.setMonth(current.getMonth() + 1);
      renderCalendar();
    });
  }

  loadSheetIfConfigured();
})();
