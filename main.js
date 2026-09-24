(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = u => /^https?:\/\//i.test(u) ? u : "#";

  /* ---- Card: l'URL arriva sempre dai dati del progetto ---- */
  function card(p, label) {
    const cat = CATEGORIES[p.category] || p.category;
    const initials = p.title.split(/[\s&]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("");
    return `
    <article class="card reveal">
      <a class="shot" href="${esc(safeUrl(p.url))}" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">
        <span class="bar"><i></i><i></i><i></i></span>
        <span class="ph-img" aria-hidden="true">${esc(initials)}</span>
        ${p.image ? `<img src="${esc(p.image)}" alt="Anteprima del progetto ${esc(p.title)}" width="1280" height="800" loading="lazy" decoding="async">` : ""}
      </a>
      <div class="card-body">
        <p class="meta">${esc(cat)}${p.year ? ` · ${esc(p.year)}` : ""}</p>
        <h3>${esc(p.title)}</h3>
        <p class="desc">${esc(p.description)}</p>
        <a class="btn btn-card" href="${esc(safeUrl(p.url))}" target="_blank" rel="noopener noreferrer" aria-label="${esc(label)}: ${esc(p.title)} (si apre in una nuova scheda)">${esc(label)}</a>
      </div>
    </article>`;
  }

  function fill(el, list, label) {
    el.innerHTML = list.length ? list.map(p => card(p, label)).join("") : `<p class="empty">Nessun progetto in questa categoria, per ora.</p>`;
    el.querySelectorAll("img").forEach(img => {
      img.addEventListener("error", () => img.remove());
      img.addEventListener("load", () => img.classList.add("ok"));
      if (img.complete && img.naturalWidth) img.classList.add("ok");
    });
    observe(el);
  }

  /* ---- Reveal: solo una dissolvenza leggera all'ingresso ---- */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }) : null;
  function observe(root) {
    root.querySelectorAll(".reveal:not(.in)").forEach(el => io ? io.observe(el) : el.classList.add("in"));
  }

  /* ---- Render ---- */
  const sorted = [...PROJECTS].sort((a, b) => (b.year || 0) - (a.year || 0) || b.id - a.id);
  fill($("#featuredGrid"), sorted.filter(p => p.featured), "Esplora progetto");
  fill($("#weddingGrid"), sorted.filter(p => p.category === "matrimonio"), "Visita il sito");

  const grid = $("#projectsGrid"), filters = $("#filters");
  const keys = ["tutti", ...Object.keys(CATEGORIES).filter(k => PROJECTS.some(p => p.category === k))];
  filters.innerHTML = keys.map((k, i) => `<button type="button" class="chip" data-k="${k}" aria-pressed="${i === 0}">${k === "tutti" ? "Tutti" : esc(CATEGORIES[k])}</button>`).join("");
  filters.addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    filters.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c === b));
    fill(grid, b.dataset.k === "tutti" ? sorted : sorted.filter(p => p.category === b.dataset.k), "Esplora progetto");
  });
  fill(grid, sorted, "Esplora progetto");

  /* ---- Hero: anteprima del primo progetto in evidenza ---- */
  const first = sorted.find(p => p.featured) || sorted[0];
  if (first) {
    $("#heroVisual").innerHTML = `<div class="browser"><span class="bar"><i></i><i></i><i></i><em>${esc(first.url.replace(/^https?:\/\//, ""))}</em></span><div class="browser-view"><span class="ph-img">${esc(first.title[0])}</span>${first.image ? `<img src="${esc(first.image)}" alt="" decoding="async" fetchpriority="high">` : ""}</div></div>`;
    const hi = $("#heroVisual img");
    if (hi) { hi.addEventListener("error", () => hi.remove()); hi.addEventListener("load", () => hi.classList.add("ok")); if (hi.complete && hi.naturalWidth) hi.classList.add("ok"); }
  } else $("#heroVisual").remove();

  /* ---- Contatti: link dai dati di SITE ---- */
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

  /* ---- Ombra navbar + voce attiva ---- */
  const onScroll = () => nav.classList.toggle("stuck", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const links = [...document.querySelectorAll(".menu a[href^='#']")];
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + (e.target.id === "in-evidenza" ? "home" : e.target.id)));
    }), { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(s => spy.observe(s));
  }
  observe(document);
})();
