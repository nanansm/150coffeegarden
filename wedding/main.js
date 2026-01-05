/* =========================
   CONFIG
   ========================= */

// WhatsApp number
const WA_NUMBER = "6281222809995";

// Google Apps Script API
const CALENDAR_API =
  "https://script.google.com/macros/s/AKfycbwkoNG1LJ9zjZxCLxjC9NPvWVpV-ZnUnhUFK7FFwRg3m6HeIv_kyY8cUQV_ylHnq3Yy/exec";

/* =========================
   STATE
   ========================= */

let selectedDate = null; // tanggal yang dipilih user
const bookedMap = new Map(); // yyyy-mm-dd -> meta

/* =========================
   Helpers
   ========================= */

function $(sel, root = document) {
  return root.querySelector(sel);
}

function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function toDateKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/* =========================
   FETCH DATA FROM GOOGLE SCRIPT
   ========================= */

async function loadCalendarData() {
  try {
    const res = await fetch(CALENDAR_API, { cache: "no-store" });
    const data = await res.json();

    bookedMap.clear();
    data.forEach(item => {
      bookedMap.set(item.date, item);
    });

    renderCalendar();
  } catch (err) {
    console.error("Calendar API error:", err);
    renderCalendar();
  }
}

/* =========================
   CALENDAR RENDER
   ========================= */

const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

let current = new Date();
current.setDate(1);

function renderCalendar() {
  const title = $("#calTitle");
  const grid = $("#calGrid");
  if (!title || !grid) return;

  const y = current.getFullYear();
  const m = current.getMonth();

  title.textContent = current.toLocaleString("id-ID", {
    month: "long",
    year: "numeric"
  });

  grid.innerHTML = "";

  // Header hari
  dayNames.forEach(n => {
    const el = document.createElement("div");
    el.className = "dayName";
    el.textContent = n;
    grid.appendChild(el);
  });

  const first = new Date(y, m, 1);
  const startDay = (first.getDay() + 6) % 7; // Sen = 0

  const daysInMonth = new Date(y, m + 1, 0).getDate();

  // Padding sebelum tanggal 1
  for (let i = 0; i < startDay; i++) {
    grid.appendChild(makeCell(null, true));
  }

  // Render tanggal
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(y, m, d);
    const key = toDateKey(dateObj);
    const meta = bookedMap.get(key);

    grid.appendChild(makeCell(dateObj, false, meta));
  }
}

function makeCell(dateObj, muted, meta) {
  const cell = document.createElement("div");
  cell.className = "cell";

  if (muted || !dateObj) {
    cell.classList.add("cell--muted");
    return cell;
  }

  const key = toDateKey(dateObj);

  const num = document.createElement("div");
  num.className = "cell__num";
  num.textContent = dateObj.getDate();

  cell.appendChild(num);

  // =========================
  // BOOKED DATE
  // =========================
  if (meta) {
    cell.classList.add("cell--booked");
    cell.style.pointerEvents = "none"; // tidak bisa diklik
    return cell;
  }

  // =========================
  // AVAILABLE DATE
  // =========================
  cell.style.cursor = "pointer";
  cell.addEventListener("click", () => selectDate(key, cell));

  return cell;
}


/* =========================
   DATE SELECTION LOGIC
   ========================= */

function selectDate(dateKey, cell) {
  // Reset selection visual
  $all(".cell--selected").forEach(c =>
    c.classList.remove("cell--selected")
  );

  cell.classList.add("cell--selected");
  selectedDate = dateKey;

  // =========================
  // UPDATE TEXT INFO
  // =========================
  const info = $("#selectedDateInfo");
  if (info) {
    const dateObj = new Date(dateKey);
    const formatted = dateObj.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    info.textContent = `Tanggal yang dipilih: ${formatted}`;
  }

  // Enable button
  const btn = $("#lockDateBtn");
  if (btn) {
    btn.disabled = false;
  }
}


/* =========================
   LOCK DATE → WHATSAPP
   ========================= */

function initLockButton() {
  const btn = $("#lockDateBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (!selectedDate) return;

    const message =
      "Halo min 150 Wedding Venue, saya mau cek tanggal wedding:\n\n" +
      `📅 Tanggal: ${selectedDate}\n` +
      "Apakah Masih Available?\n\n" +
      "Terima kasih 🙏";

    const url =
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  });
}

/* =========================
   CALENDAR NAV
   ========================= */

(function initCalendarNav() {
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
})();

/* =========================
   INIT
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  loadCalendarData();
  initLockButton();
});
