(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = u => /^https?:\/\//i.test(u) ? u : "#";
  const svg = d => `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICONS = {
    app: svg('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
    web: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/>'),
    heart: svg('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
    grid: svg('<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>')
  };
  const ARROW = svg('<path d="M5 12h14M13 6l6 6-6 6"/>').replace('width="26" height="26"', 'width="20" height="20"');

  const sorted = [...PROJECTS].sort((a, b) => (b.year || 0) - (a.year || 0) || b.id - a.id);
  const count = path => sorted.filter(p => p.path === path || p.path.startsWith(path + "/")).length;

  /* ---- Reveal ---- */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -6% 0px", threshold: 0.05 }) : null;
  const observe = root => root.querySelectorAll(".reveal:not(.in)").forEach(el => io ? io.observe(el) : el.classList.add("in"));
  const imgOk = img => { img.addEventListener("error", () => img.remove()); img.addEventListener("load", () => img.classList.add("ok")); if (img.complete && img.naturalWidth) img.classList.add("ok"); };

  /* ---- Card progetto: l'URL arriva sempre dai dati ---- */
  function card(p, label) {
    const initials = p.title.split(/[\s&]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("");
    const meta = [p.tag, p.year].filter(Boolean).join(" · ");
    const url = esc(safeUrl(p.url));
    return `
    <article class="card reveal">
      <a class="shot" href="${url}" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">
        <span class="bar"><i></i><i></i><i></i></span>
        <span class="ph-img" aria-hidden="true">${esc(initials)}</span>
        ${p.image ? `<img src="${esc(p.image)}" alt="Anteprima del sito ${esc(p.title)}" width="1280" height="800" loading="lazy" decoding="async">` : ""}
      </a>
      <div class="card-body">
        ${meta ? `<p class="meta">${esc(meta)}</p>` : ""}
        <h3>${esc(p.title)}</h3>
        <p class="desc">${esc(p.description)}</p>
        <a class="btn btn-card" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${esc(label)}: ${esc(p.title)} (si apre in una nuova scheda)">${esc(label)}</a>
      </div>
    </article>`;
  }

  /* ---- Scheda di livello (App / Web / Matrimoni / Altri) ---- */
  function tile(n, path) {
    const c = count(path), leaf = !n.children;
    const info = c ? `${c} ${c === 1 ? "progetto" : "progetti"}` : "Presto disponibile";
    return `
    <a class="tile reveal ${n.theme || ""}" href="#progetti/${esc(path)}">
      <span class="ico">${ICONS[n.icon] || ICONS.grid}</span>
      <span>
        <h3>${esc(n.title)}</h3>
        <p>${esc(n.text)}</p>
      </span>
      <span class="tile-foot"><span>${leaf || !n.children ? info : n.children.length + " sezioni"}</span><i>${ARROW}</i></span>
    </a>`;
  }

  function walk(path) {
    let list = TREE; const trail = [];
    for (const k of path.split("/").filter(Boolean)) {
      const n = list.find(x => x.key === k); if (!n) return null;
      trail.push({ n, path: (trail.length ? trail[trail.length - 1].path + "/" : "") + k });
      list = n.children || [];
    }
    return trail;
  }

  function render(path, focus) {
    let trail = walk(path); if (!trail) { trail = []; path = ""; }
    const cur = trail.length ? trail[trail.length - 1] : null, node = cur && cur.n;
    const kids = node ? node.children : TREE;
    const title = $("#pTitle");
    title.textContent = node ? node.title : "Progetti";
    title.className = node && node.theme === "rose" ? "serif" : "";
    $("#pSub").textContent = node ? node.text : "Scegli una categoria per esplorare i lavori.";

    const parent = trail.length > 1 ? trail[trail.length - 2].path : "";
    $("#crumbs").innerHTML = node ? `
      <a class="back" href="#progetti${parent ? "/" + esc(parent) : ""}">← Indietro</a>
      <span class="trail"><a href="#progetti">Progetti</a>${trail.map((t, i) => `<span class="sep">/</span>${i === trail.length - 1 ? `<span aria-current="page">${esc(t.n.title)}</span>` : `<a href="#progetti/${esc(t.path)}">${esc(t.n.title)}</a>`}`).join("")}</span>` : "";

    const view = $("#pView");
    if (kids && kids.length) {
      view.innerHTML = `<div class="tiles">${kids.map(k => tile(k, (path ? path + "/" : "") + k.key)).join("")}</div>`;
    } else {
      const items = sorted.filter(p => p.path === path);
      const cta = (node && node.cta) || "Esplora progetto";
      view.innerHTML = items.length
        ? `<div class="grid ${node && node.theme === "rose" ? "rose" : ""}">${items.map(p => card(p, cta)).join("")}</div>`
        : `<p class="empty">Nessun progetto qui, per ora. I nuovi lavori compariranno presto.</p>`;
    }
    view.querySelectorAll("img").forEach(imgOk);
    observe(view);
    if (focus) title.focus({ preventScroll: true });
  }

  let first = true;
  function route() {
    const h = decodeURIComponent(location.hash);
    if (h === "#progetti" || h.startsWith("#progetti/")) {
      render(h.slice(10), !first);
      if (!first || h.length > 9) $("#progetti").scrollIntoView({ behavior: first ? "auto" : "smooth" });
    } else if (first) render("", false);
    first = false;
  }
  addEventListener("hashchange", route);
  route();

  /* ---- Hero: anteprima del progetto in evidenza ---- */
  const f = sorted.find(p => p.featured) || sorted[0];
  if (f) {
    $("#heroVisual").innerHTML = `<div class="browser"><span class="bar"><i></i><i></i><i></i><em>${esc(f.url.replace(/^https?:\/\//, ""))}</em></span><div class="browser-view"><span class="ph-img">${esc(f.title[0])}</span>${f.image ? `<img src="${esc(f.image)}" alt="" decoding="async" fetchpriority="high">` : ""}</div></div>`;
    const hi = $("#heroVisual img"); if (hi) imgOk(hi);
  } else $("#heroVisual").remove();

  /* ---- Contatti ---- */
  const isPh = v => !v || /INSERISCI/i.test(v);
  document.querySelectorAll("[data-link]").forEach(a => {
    const k = a.dataset.link, v = SITE[k];
    if (isPh(v)) { a.classList.add("off"); a.setAttribute("aria-disabled", "true"); a.removeAttribute("target"); return; }
    a.href = k === "email" ? "mailto:" + v : v;
  });
  document.querySelectorAll("[data-text]").forEach(el => { const v = SITE[el.dataset.text]; if (!isPh(v)) el.textContent = v.replace(/^https?:\/\/(www\.)?/, ""); });

  /* ---- Menu mobile ---- */
  const burger = $("#burger"), nav = $("#nav");
  const setMenu = open => { nav.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu"); document.body.classList.toggle("lock", open); };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  $("#menu").addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  matchMedia("(min-width: 861px)").addEventListener("change", () => setMenu(false));

  /* ---- Navbar: ombra e voce attiva ---- */
  const onScroll = () => nav.classList.toggle("stuck", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const links = [...document.querySelectorAll(".menu a[href^='#']")];
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(s => spy.observe(s));
  }
  observe(document);
})();
