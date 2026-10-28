document.documentElement.classList.add("js");
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const W = "https://wolt.com/en/mkd/skopje/restaurant/amici-pizza1";
const D = [
  [
    "Основни",
    ["30 цм", "40 цм"],
    [
      ["Маринара", 200],
      ["Двојна", 300],
      ["Маргарита", 400, 550],
      ["Фунги", 400, 650],
      ["Везувио", 400, 650],
      ["Хаваи", 400, 700],
      ["Капричиоза", 400, 700],
      ["Пеперони", 400, 700],
      ["Туна", 400, 700],
    ],
    1,
  ],
  [
    "Вегетаријански",
    ["30 цм", "40 цм"],
    [
      ["Веге", 400, 700],
      ["Кватро формаџи", 400, 700],
    ],
    1,
  ],
  [
    "Гурмански",
    ["30 цм", "40 цм"],
    [
      ["Морски плодови", 500, 800],
      ["Пармиџана", 500, 800],
      ["Гурманска", 600, 900],
    ],
    1,
  ],
  [
    "Премиум",
    ["30 цм", "40 цм"],
    [
      ["Медитерана", 650, 950],
      ["Сапоре рустико", 650, 950],
    ],
    1,
  ],
  [
    "Печива",
    ["", ""],
    [
      ["Фурнаринки", 80],
      ["Пица-леб", 80],
      ["Фокача", 80],
      ["Сомун", 80],
    ],
    0,
  ],
  [
    "Пастрмајлија",
    ["", ""],
    [
      ["Пилешка пастрмајлија", 350],
      ["Свинска пастрмајлија", 350],
    ],
    0,
  ],
  [
    "Пијалоци",
    ["0,5 л", "1 л"],
    [
      ["Pepsi", 70, 100],
      ["Газоза", 70, 100],
      ["Миринда", 70, 100],
    ],
    0,
  ],
];
const tabs = $("#tabs"),
  grid = $("#grid");
function show(k) {
  $$("#tabs button").forEach((b, i) => b.setAttribute("aria-selected", i == k));
  const [, L, items, pz] = D[k];
  grid.innerHTML = items
    .map(
      (it, i) =>
        `<div class="c" style="--i:${i}">${pz ? '<svg viewBox="0 0 100 100"><use href="#pz"/></svg>' : ""}<h3>${it[0]}</h3><div class="pr">${it
          .slice(1)
          .map(
            (p, j) =>
              `<span>${L[j] ? `<small>${it.length == 2 && pz ? "30 цм" : L[j]}</small>` : ""}${p} ден</span>`,
          )
          .join("")}</div></div>`,
    )
    .join("");
}
D.forEach((d, i) => {
  const b = document.createElement("button");
  b.textContent = d[0];
  b.setAttribute("role", "tab");
  b.onclick = () => show(i);
  tabs.append(b);
});
show(0);
/* picker */
const pool = D.slice(0, 4).flatMap((d) => d[2]);
let busy = 0;
$("#go").onclick = () => {
  if (busy) return;
  busy = 1;
  const r = $("#res");
  r.classList.add("go");
  let n = 0;
  const t = setInterval(() => {
    const p = pool[(Math.random() * pool.length) | 0];
    r.innerHTML = `<h3>${p[0]}</h3>`;
    if (++n > 14) {
      clearInterval(t);
      r.classList.remove("go");
      r.innerHTML = `<h3>${p[0]}</h3><p>30 цм: ${p[1]} ден${p[2] ? " · 40 цм: " + p[2] + " ден" : ""}</p><a class="btn r" style="margin-top:8px" href="${W}" target="_blank" rel="noopener">Нарачај</a>`;
      busy = 0;
    }
  }, 90);
};
/* nav */
const mb = $("#mb"),
  nv = $("#nv");
mb.onclick = () => mb.setAttribute("aria-expanded", nv.classList.toggle("o"));
nv.onclick = (e) => {
  if (e.target.tagName == "A") {
    nv.classList.remove("o");
    mb.setAttribute("aria-expanded", false);
  }
};
/* squiggles under titles */
$$("h2").forEach((h) => {
  if (h.closest("#fb")) return;
  h.insertAdjacentHTML(
    "afterend",
    '<svg class="sq rv" viewBox="0 0 200 14"><path d="M2 8Q15 0 28 8T54 8T80 8T106 8T132 8T158 8T184 8"/></svg>',
  );
});
/* reveal */
$$("[data-st]").forEach((p) =>
  [...p.children].forEach((c, i) => c.style.setProperty("--d", i * 0.15 + "s")),
);
const io =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          }),
        { threshold: 0.15 },
      )
    : null;
$$(".rv").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
/* scroll effects */
const bar = $("#bar");
function sc() {
  const y = scrollY,
    h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  $$(".fl").forEach((f) =>
    f.style.setProperty("--py", -y * f.dataset.s + "px"),
  );
  $$("[data-rot]").forEach(
    (e) => (e.style.transform = `rotate(${y * e.dataset.rot}deg)`),
  );
}
addEventListener("scroll", () => requestAnimationFrame(sc), { passive: true });
sc();
/* open status (Skopje time) */
const t = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Skopje" }),
  ),
  m = t.getHours() * 60 + t.getMinutes(),
  o = m >= 780 && m < 1260;
$("#st").textContent = o
  ? "Сега примаме нарачки"
  : "Затворено. Следно отворање во 13:00";
if (!o) $("#dot").classList.add("off");
