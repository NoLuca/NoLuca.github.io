/* ==========================================================================
   Portfolio Luca Notarantonio · logica del sito
   Nessuna libreria: solo JavaScript del browser.
   ========================================================================== */
(() => {
  "use strict";

  const D = window.DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* niente */ } },
    sget(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch { /* niente */ } }
  };
  const progetti = D.progetti;
  const gruppo = (id) => D.gruppi.find((g) => g.id === id) || { titolo: id, sigla: "?" };
  const statoClass = (s) => "s-" + s.split(" ")[0].replace(/[^a-z]/g, "");

  /* ---------------- Toast ---------------- */
  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("show"), 2200);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      ta.remove(); return ok;
    }
  }

  /* ---------------- Effetto scramble ----------------
     Lettere e numeri diventano simboli casuali e si ricompongono in ordine di
     lettura (dall'alto in basso, da sinistra a destra). Punteggiatura e spazi
     restano fermi, così la "forma" del testo si vede già mentre si carica. */
  // solo simboli ASCII che il font del sito ha già (░▒▓ arrivavano da un altro font,
  // con altre misure) e che non creano punti in cui andare a capo (niente - / \\ ! ? + % $):
  // così righe e altezze restano identiche durante l'effetto
  const GLYPHS = "<>_[]{}=*^#&@~";
  const SCRAMBLABLE = /[\p{L}\p{N}]/u;
  const busy = new WeakSet();
  function scramble(el, ms) {
    if (reduced || !el || busy.has(el)) return;
    const nodes = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
    const origs = nodes.map((n) => n.nodeValue);
    const total = origs.reduce((n, t) => n + t.length, 0);
    if (!total) return;
    busy.add(el);
    const t0 = performance.now();
    const rnd = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
    // ogni simbolo resta fermo per qualche fotogramma prima di cambiare
    // (in media ~130 ms): il caricamento ha la stessa durata ma "sfarfalla" meno
    const CHANGE = 0.13;
    const cache = new Array(total);
    const step = (now) => {
      const p = Math.min(1, (now - t0) / ms);
      const done = Math.floor(p * total);
      let k = 0;
      nodes.forEach((n, idx) => {
        const o = origs[idx];
        let out = "";
        for (let c = 0; c < o.length; c++, k++) {
          if (k < done || !SCRAMBLABLE.test(o[c])) { out += o[c]; continue; }
          if (!cache[k] || Math.random() < CHANGE) cache[k] = rnd();
          out += cache[k];
        }
        n.nodeValue = out;
      });
      if (p < 1) requestAnimationFrame(step);
      else { nodes.forEach((n, idx) => { n.nodeValue = origs[idx]; }); busy.delete(el); }
    };
    requestAnimationFrame(step);
  }
  const scrambleTarget = (el) => el.matches(".card")
    ? scramble(el, Math.min(1100, Math.max(700, el.textContent.length * 3.2)))  // card intera
    : scramble(el, 550);                                                         // link del menu
  // link del menu: al passaggio del mouse
  document.addEventListener("mouseover", (e) => {
    const el = e.target.closest(".nav a");
    if (!el || el.contains(e.relatedTarget)) return;
    scrambleTarget(el);
  });
  // schede dei progetti: quando entrano nello schermo scorrendo, una volta sola,
  // un po' sfalsate se ne arrivano diverse insieme
  const cardObs = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e, i) => {
      cardObs.unobserve(e.target);
      setTimeout(() => scrambleTarget(e.target), i * 90);
    });
  }, { threshold: 0.35 }) : null;
  const watchCards = (root) => { if (cardObs && !reduced) root.querySelectorAll(".card").forEach((c) => cardObs.observe(c)); };

  /* ---------------- Banner ASCII ---------------- */
  const BIG = {
    L: ["██╗     ", "██║     ", "██║     ", "██║     ", "███████╗", "╚══════╝"],
    U: ["██╗   ██╗", "██║   ██║", "██║   ██║", "██║   ██║", "╚██████╔╝", " ╚═════╝ "],
    C: [" ██████╗", "██╔════╝", "██║     ", "██║     ", "╚██████╗", " ╚═════╝"],
    A: [" █████╗ ", "██╔══██╗", "███████║", "██╔══██║", "██║  ██║", "╚═╝  ╚═╝"]
  };
  const SMALL = {
    N: ["█▄ █", "█ ▀█"], O: ["█▀█", "█▄█"], T: ["▀█▀", " █ "],
    A: ["▄▀█", "█▀█"], R: ["█▀█", "█▀▄"], I: ["█", "█"]
  };
  function bannerLines() {
    const big = Array.from({ length: 6 }, (_, r) => "LUCA".split("").map((c) => BIG[c][r]).join(""));
    const small = [0, 1].map((r) => "NOTARANTONIO".split("").map((c) => SMALL[c][r]).join(" "));
    return big.map((line, r) => {
      const s = r === 3 ? small[0] : r === 4 ? small[1] : "";
      return { a: line, b: s ? "  " + s : "" };
    });
  }
  function renderBanner(scramble) {
    const lines = bannerLines();
    const glyph = "█▓▒░╗╔═║╚╝▄▀";
    const out = lines.map(({ a, b }) => {
      const mess = (s) => s.split("").map((ch) => (ch !== " " && Math.random() < scramble ? glyph[(Math.random() * glyph.length) | 0] : ch)).join("");
      return esc(mess(a)) + (b ? '<span class="b2">' + esc(mess(b)) + "</span>" : "");
    });
    $("#banner").innerHTML = out.join("\n");
  }
  function animateBanner() {
    if (reduced) { renderBanner(0); return; }
    let k = 1;
    const step = () => {
      renderBanner(k);
      k -= 0.07;
      if (k > 0) setTimeout(step, 45); else renderBanner(0);
    };
    step();
  }

  /* ---------------- Rack con i LED ---------------- */
  function renderRack() {
    const W = 28;
    const rows = [
      "@ #  ▤▤▤▤▤▤▤▤▤▤▤▤▤   ~nas~",
      "% @  ░░░░░░░░░░░░░   ~gpu~",
      "@@@@####%%%%  ::: ~switch~",
      "# %  ═════════════ ~router~"
    ];
    const plain = (s) => s.replace(/~/g, "");
    const fmt = (s) => esc(s)
      .replace(/~(\w+)~/g, '<span class="label">$1</span>')
      .replace(/@/g, '<span class="led">●</span>')
      .replace(/#/g, '<span class="led b">●</span>')
      .replace(/%/g, '<span class="led c">●</span>');
    const line = (l, m, r) => l + m.repeat(W + 2) + r;
    const out = [line("┌", "─", "┐")];
    rows.forEach((r, i) => {
      out.push("│ " + fmt(r) + " ".repeat(Math.max(0, W - plain(r).length)) + " │");
      out.push(i < rows.length - 1 ? line("├", "─", "┤") : line("└", "─", "┘"));
    });
    out.push("  ╨" + " ".repeat(W - 2) + "╨");
    $("#rack").innerHTML = out.join("\n");
  }

  /* ---------------- Neofetch ---------------- */
  function renderNeofetch() {
    $("#neofetch").innerHTML = D.profilo.neofetch.map(([k, v]) =>
      `<dt>${esc(k)}</dt><dd>${k === "Stato" ? '<span class="status-dot" aria-hidden="true">● </span>' : ""}${esc(v)}</dd>`).join("");
  }

  /* ---------------- Testo che si scrive da solo ---------------- */
  function typed() {
    const el = $("#typed");
    const frasi = [
      D.profilo.ruolo,
      "homelab: TrueNAS Scale · Docker · Tailscale",
      "elettricista qualificato: precisione da cantiere",
      "io progetto e verifico, l'AI scrive: il codice resta mio"
    ];
    if (reduced) { el.textContent = frasi[0]; return; }
    let i = 0, j = 0, del = false;
    const tick = () => {
      const f = frasi[i];
      if (!del) {
        j++; el.textContent = f.slice(0, j);
        if (j === f.length) { del = true; return setTimeout(tick, 2600); }
        return setTimeout(tick, 38 + Math.random() * 40);
      }
      j--; el.textContent = f.slice(0, j);
      if (j === 0) { del = false; i = (i + 1) % frasi.length; return setTimeout(tick, 350); }
      setTimeout(tick, 18);
    };
    tick();
  }

  /* ---------------- Avvio stile BIOS / systemd ---------------- */
  function boot(done) {
    const el = $("#boot");
    if (reduced || store.sget("avviato")) { done(); return; }
    store.sset("avviato", "1");
    el.hidden = false;
    const nSkill = D.competenze.reduce((n, c) => n + c.breve.length, 0);
    const lines = [
      ["", "LUCA-BIOS v20.26 · controllo del sistema..."],
      ["", "CPU: curiosità @ 100%      RAM: 2 × caffè      Disco: pieno di progetti"],
      ["", " "],
      ["ok", "Avviata la rete: link up"],
      ["ok", "Montato /home/luca/progetti (" + progetti.length + " progetti)"],
      ["ok", "Avviato truenas.service · pool ZFS: ONLINE"],
      ["ok", "Avviato tailscaled.service"],
      ["ok", "Caricate le competenze: " + nSkill],
      ["ok", "Raggiunto il target portfolio.target"],
      ["wait", "Compilazione della prossima idea..."]
    ];
    const log = $("#boot-log");
    let i = 0, stopped = false;
    const finish = () => {
      if (stopped) return; stopped = true;
      el.hidden = true;
      window.removeEventListener("keydown", finish);
      done();
    };
    el.addEventListener("click", finish);
    window.addEventListener("keydown", finish);
    const next = () => {
      if (stopped) return;
      if (i >= lines.length) { setTimeout(finish, 700); return; }
      const [k, t] = lines[i++];
      const tag = k === "ok" ? '<span class="ok">[  OK  ]</span> ' : k === "wait" ? '<span class="wait">[ WAIT ]</span> ' : "";
      log.innerHTML += tag + esc(t) + "\n";
      setTimeout(next, k ? 150 : 260);
    };
    next();
  }

  /* ---------------- Chi sono / contatti ---------------- */
  function renderAbout() {
    $("#chi-sono-text").innerHTML = D.profilo.chiSono.map((p) => `<p>${esc(p)}</p>`).join("");
  }
  function renderContacts() {
    const p = D.profilo;
    const row = (k, v) => `<dt>${k}</dt><dd>${v}</dd>`;
    $("#contact-list").innerHTML =
      row("github", `<a href="${esc(p.github)}" target="_blank" rel="noopener">${esc(p.github.replace("https://", ""))}</a>`) +
      row("giochi", `<a href="${esc(p.itch)}" target="_blank" rel="noopener">${esc(p.itch.replace("https://", ""))}</a>`) +
      row("email/tel", "li trovi nel mio CV");
    $("#contact-actions").innerHTML =
      (p.cv ? `<a class="btn" href="assets/${esc(p.cv)}" download>scarica CV (PDF)</a>` : "");
  }

  /* ---------------- Progetti: filtri e schede ---------------- */
  let filtro = "tutti";
  function allTags() {
    const n = new Map();
    progetti.forEach((p) => p.tag.forEach((t) => n.set(t, (n.get(t) || 0) + 1)));
    return (D.filtri || [...n.keys()]).filter((t) => n.has(t)).map((t) => [t, n.get(t)]);
  }
  function renderFilters() {
    const tags = [["tutti", progetti.length], ...allTags()];
    $("#filters").innerHTML = tags.map(([t, n]) =>
      `<button class="chip" type="button" data-tag="${esc(t)}" aria-pressed="${t === filtro}"><span class="mark">[${t === filtro ? "x" : " "}]</span> ${esc(t)} <span class="n">${n}</span></button>`).join("");
  }
  function cardHTML(p) {
    const g = gruppo(p.gruppo);
    return `<a class="card box" href="#/p/${esc(p.slug)}">
      <span class="box-title">${esc(p.slug)}/</span>
      <div class="meta"><span>[${esc(g.sigla)}] ${esc(p.anno)}</span><span class="stato ${statoClass(p.stato)}">${esc(p.stato)}</span></div>
      <h3>${esc(p.titolo)}</h3>
      <p class="sub">${esc(p.sottotitolo)}</p>
      <p class="sum">${esc(p.riassunto)}</p>
      <p class="tags">${p.tag.map((t) => "#" + esc(t.toLowerCase().replace(/\s+/g, "-"))).join(" ")}</p>
      <p class="open">&gt; apri i dettagli</p>
    </a>`;
  }
  function renderProjects() {
    const vis = progetti.filter((p) => filtro === "tutti" || p.tag.includes(filtro));
    const html = D.gruppi.map((g, i) => {
      const items = vis.filter((p) => p.gruppo === g.id);
      if (!items.length) return "";
      return `<h3 class="group-title">── ${String(i + 1).padStart(2, "0")} · <b>${esc(g.titolo)}</b> ──</h3>
              <div class="cards">${items.map(cardHTML).join("")}</div>`;
    }).join("");
    $("#project-groups").innerHTML = html || `<p class="empty">ls: nessun progetto con questo filtro</p>`;
    watchCards($("#project-groups"));
  }
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    filtro = b.dataset.tag === filtro ? "tutti" : b.dataset.tag;
    renderFilters(); renderProjects();
  });
  function renderSchool() {
    $("#school").innerHTML = D.scuola.map((r) =>
      `<li><a href="https://github.com/NoLuca/${encodeURIComponent(r)}" target="_blank" rel="noopener">${esc(r)}</a></li>`).join("");
  }

  /* ---------------- Dettaglio progetto ---------------- */
  function renderProject(slug) {
    const i = progetti.findIndex((p) => p.slug === slug);
    const v = $("#view-project");
    if (i < 0) {
      v.innerHTML = `<p class="err">cd: ${esc(slug)}: progetto inesistente</p><p><a href="#progetti">← torna ai progetti</a></p>`;
      return;
    }
    const p = progetti[i], g = gruppo(p.gruppo);
    const prev = progetti[(i - 1 + progetti.length) % progetti.length];
    const next = progetti[(i + 1) % progetti.length];
    const box = (title, inner, cls = "") => `<div class="box ${cls}"><span class="box-title">${esc(title)}</span>${inner}</div>`;
    const schemi = (p.schemi || []).map((s, k) => {
      let pre = esc(s.testo.replace(/^\n/, ""));
      const nodi = s.nodi ? Object.keys(s.nodi) : [];
      nodi.forEach((n, j) => {
        pre = pre.replace(esc(n), `<button class="node" type="button" data-s="${k}" data-n="${j}">${esc(n)}</button>`);
      });
      const info = nodi.length
        ? `<p class="node-info" id="node-info-${k}" aria-live="polite"><span class="dim">&gt; clicca un nome evidenziato nello schema</span></p>`
        : "";
      const name = "schema/" + s.titolo.toLowerCase().replace(/[()]/g, "").trim().replace(/\s+/g, "-") + ".txt";
      return box(name, `<div class="schema"><pre role="group" aria-label="Schema: ${esc(s.titolo)}">${pre}</pre></div>${info}`);
    }).join("");
    const shots = (p.immagini || []).length
      ? box("screenshot/", `<div class="shots">${p.immagini.map((im) => `<figure><img src="${esc(im.src)}" alt="${esc(im.alt || "")}" loading="lazy"><figcaption class="hint">${esc(im.alt || "")}</figcaption></figure>`).join("")}</div>`)
      : "";
    const links = (p.link || []).length
      ? box("link", `<ul class="pv-list">${p.link.map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join("")}</ul>`)
      : "";
    v.innerHTML = `
      <nav class="crumbs" aria-label="Navigazione progetto">
        <a href="#progetti" class="btn">cd ..</a>
        <span class="dim">progetto ${i + 1} di ${progetti.length}</span>
      </nav>
      <p class="dim">$ cat ~/progetti/${esc(p.slug)}/README</p>
      <h2 tabindex="-1" id="pv-title">${esc(p.titolo)}</h2>
      <p class="sub">${esc(p.sottotitolo)}</p>
      <p class="meta">[${esc(g.sigla)}] ${esc(g.titolo)} · ${esc(p.anno)} · <span class="stato ${statoClass(p.stato)}">${esc(p.stato)}</span></p>
      <div class="pv-grid">
        ${box("problema.txt", `<p>${esc(p.problema)}</p>`)}
        ${box("soluzione.txt", `<p>${esc(p.soluzione)}</p>`)}
      </div>
      ${box("cosa-ho-fatto.log", `<ul class="pv-list">${p.fatto.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>`)}
      ${schemi}
      ${shots}
      ${box("stack", `<ul class="tech">${p.tecnologie.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`)}
      ${links}
      <p class="hint">Il codice di questo progetto è privato: se vuoi vederlo o parlarne, <a href="#contatti">contattami</a>.</p>
      <nav class="pv-nav" aria-label="Altri progetti">
        <a class="btn" href="#/p/${esc(prev.slug)}">← ${esc(prev.titolo)}</a>
        <a class="btn" href="#/p/${esc(next.slug)}">${esc(next.titolo)} →</a>
      </nav>`;
    v.onclick = (e) => {
      const b = e.target.closest(".node"); if (!b) return;
      const sc = p.schemi[+b.dataset.s], key = Object.keys(sc.nodi)[+b.dataset.n];
      $$(`.node[data-s="${b.dataset.s}"]`, v).forEach((x) => x.classList.toggle("on", x === b));
      $("#node-info-" + b.dataset.s).innerHTML = `<span class="acc">&gt; ${esc(key.replace(/[[\]]/g, "").trim())}:</span> ${esc(sc.nodi[key])}`;
    };
  }

  /* ---------------- Router (indirizzi con #) ---------------- */
  function route() {
    const h = decodeURIComponent(location.hash || "");
    const home = $("#view-home"), pv = $("#view-project");
    if (h.startsWith("#/p/")) {
      const slug = h.slice(4);
      home.hidden = true; pv.hidden = false;
      renderProject(slug);
      $("#p-path").textContent = "~/progetti/" + slug;
      const p = progetti.find((x) => x.slug === slug);
      document.title = (p ? p.titolo + " · " : "") + "Luca Notarantonio";
      window.scrollTo(0, 0);
      const t = $("#pv-title"); if (t) t.focus({ preventScroll: true });
      setActiveNav("progetti");
      return;
    }
    document.title = "Luca Notarantonio · portfolio";
    const wasHidden = home.hidden;
    home.hidden = false; pv.hidden = true;
    if (wasHidden && h.length > 1) {
      const el = document.getElementById(h.slice(1));
      if (el) requestAnimationFrame(() => el.scrollIntoView());
    }
  }
  window.addEventListener("hashchange", route);

  /* Sezione attiva nella barra in alto */
  function setActiveNav(id) {
    $$(".nav a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
  }
  const secObs = new IntersectionObserver((entries) => {
    if (!$("#view-project").hidden) return;
    entries.forEach((e) => {
      if (e.isIntersecting) {
        setActiveNav(e.target.id);
        $("#p-path").textContent = "~/" + e.target.id;
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["chi-sono", "progetti", "percorso", "competenze", "contatti"].forEach((id) => secObs.observe(document.getElementById(id)));
  window.addEventListener("scroll", () => {
    if (window.scrollY < 200 && $("#view-project").hidden) { $("#p-path").textContent = "~"; setActiveNav(""); }
  }, { passive: true });

  /* Il comando di ogni sezione si scrive quando la sezione arriva sullo schermo */
  if (!reduced && "IntersectionObserver" in window) {
    const typeObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("typed-in");
        typeObs.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -15% 0px" });
    $$(".section > .cmd").forEach((h) => {
      h.style.setProperty("--n", h.textContent.length);
      h.classList.add("type-me");
      typeObs.observe(h);
    });
  }

  /* ---------------- git log ---------------- */
  function renderGitlog() {
    const out = [];
    let mergedOpen = false;
    D.percorso.forEach((c, idx) => {
      let g;
      if (c.ramo === "merge") g = "*   ";
      else if (c.ramo === "elettricista") g = "| * ";
      else g = "* ";
      if (c.ramo === "root" && mergedOpen) { out.push(`<li class="graph-only" aria-hidden="true">|/</li>`); mergedOpen = false; }
      const ref = c.head ? '<span class="ref">(HEAD -&gt; main)</span> ' : "";
      const gHTML = c.ramo === "elettricista"
        ? `<span class="g">| </span><span class="g branch">* </span>`
        : `<span class="g">${g}</span>`;
      const has = c.dettagli && c.dettagli.length;
      out.push(`<li><button class="commit" type="button" ${has ? `aria-expanded="false" aria-controls="show-${idx}"` : "disabled"}><span class="pre">${gHTML}<span class="h">${esc(c.hash)} </span><span class="d">${esc(c.data.padEnd(7))}</span> </span><span class="txt">${ref}<span class="msg">${esc(c.titolo)}</span></span></button>${has ? `<div class="show" id="show-${idx}" hidden>${c.dettagli.map((d) => `<p>${esc(d)}</p>`).join("")}</div>` : ""}</li>`);
      if (c.ramo === "merge") { out.push(`<li class="graph-only" aria-hidden="true">|<span class="branch">\\</span></li>`); mergedOpen = true; }
    });
    $("#gitlog").innerHTML = out.join("");
  }
  $("#gitlog").addEventListener("click", (e) => {
    const b = e.target.closest(".commit"); if (!b || b.disabled) return;
    const open = b.getAttribute("aria-expanded") === "true";
    b.setAttribute("aria-expanded", String(!open));
    $("#" + b.getAttribute("aria-controls")).hidden = open;
  });

  /* ---------------- Competenze: albero + globo ASCII ---------------- */
  let skillCat = "tutte";
  function renderSkillTabs() {
    const tabs = [{ id: "tutte", titolo: "tutte" }, ...D.competenze];
    $("#skill-tabs").innerHTML = tabs.map((c) =>
      `<button class="chip" type="button" data-cat="${esc(c.id)}" aria-pressed="${c.id === skillCat}"><span class="mark">[${c.id === skillCat ? "x" : " "}]</span> ${esc(c.titolo.toLowerCase())}</button>`).join("");
  }
  function renderTree() {
    const C = D.competenze;
    const line = (pre, html, cls = "") => `<div class="t-line ${cls}"><span class="l">${pre}</span><span>${html}</span></div>`;
    let s = line("", '<span class="d">~/competenze</span>');
    C.forEach((c, i) => {
      const last = i === C.length - 1;
      const off = skillCat !== "tutte" && skillCat !== c.id ? "off" : "";
      s += line(last ? "└── " : "├── ", `<span class="d">${esc(c.id)}/</span>`, off);
      c.voci.forEach((v, j) => {
        s += line((last ? "    " : "│   ") + (j === c.voci.length - 1 ? "└── " : "├── "), esc(v), off);
      });
    });
    const nFile = C.reduce((n, c) => n + c.voci.length, 0);
    s += `<div class="t-line t-sum"><span class="l">${C.length} directory, ${nFile} file</span></div>`;
    $("#tree").innerHTML = s;
  }
  $("#skill-tabs").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    skillCat = b.dataset.cat === skillCat ? "tutte" : b.dataset.cat;
    renderSkillTabs(); renderTree(); statusBar(); globe.paint();
  });

  const globe = (() => {
    const box = $("#globe"), grid = $("#globe-grid"), layer = $("#globe-words");
    const words = [];
    // le categorie si alternano, così ogni categoria è sparsa su tutto il globo
    const maxLen = Math.max(...D.competenze.map((c) => c.breve.length));
    for (let k = 0; k < maxLen; k++) D.competenze.forEach((c) => { if (c.breve[k]) words.push({ w: c.breve[k], cat: c.id }); });
    // punti distribuiti in modo uniforme sulla sfera (spirale di Fibonacci)
    const N = words.length, gold = Math.PI * (3 - Math.sqrt(5));
    words.forEach((o, i) => {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = gold * i;
      o.p = [Math.cos(t) * r, y, Math.sin(t) * r];
      o.el = document.createElement("span");
      o.el.textContent = o.w;
      layer.appendChild(o.el);
    });
    // reticolo: paralleli e meridiani
    const wire = [];
    for (let lat = -60; lat <= 60; lat += 30) for (let lon = 0; lon < 360; lon += 4) wire.push(sph(lat, lon));
    for (let lon = 0; lon < 180; lon += 30) for (let lat = -90; lat <= 270; lat += 4) wire.push(sph(lat, lon));
    function sph(lat, lon) {
      const a = (lat * Math.PI) / 180, b = (lon * Math.PI) / 180;
      return [Math.cos(a) * Math.cos(b), Math.sin(a), Math.cos(a) * Math.sin(b)];
    }

    let cw = 9, lh = 18, cols = 60, rows = 26, rx = 26, ry = 12;
    let yaw = 0.4, pitch = -0.35, vYaw = 0.005, vPitch = 0;
    const AUTO = reduced ? 0 : 0.005;
    let dragging = false, lastX = 0, lastY = 0, visible = false, raf = 0, measured = false;

    function measure() {
      const probe = document.createElement("span");
      probe.textContent = "0".repeat(20);
      grid.textContent = ""; grid.appendChild(probe);
      const r = probe.getBoundingClientRect();
      if (!r.width) return false; // globo nascosto: si misura quando diventa visibile
      cw = r.width / 20; lh = parseFloat(getComputedStyle(grid).lineHeight) || r.height;
      const width = box.parentElement.clientWidth;
      cols = Math.max(30, Math.min(74, Math.floor(width / cw)));
      rx = Math.floor(cols / 2) - 2;
      ry = (rx * cw) / lh;
      rows = Math.ceil(ry * 2) + 3;
      box.style.width = cols * cw + "px";
      box.style.height = rows * lh + "px";
      measured = true;
      return true;
    }
    function rot([x, y, z]) {
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
      const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
      return [x1, y2, z2];
    }
    function paint() {
      if (!measured && !measure()) return;
      const cx = cols / 2, cyy = rows / 2;
      const buf = Array.from({ length: rows }, () => new Array(cols).fill(" "));
      const zb = Array.from({ length: rows }, () => new Array(cols).fill(-9));
      for (const p of wire) {
        const [x, y, z] = rot(p);
        const c = Math.round(cx + x * rx), r = Math.round(cyy - y * ry);
        if (r < 0 || r >= rows || c < 0 || c >= cols || z <= zb[r][c]) continue;
        zb[r][c] = z;
        buf[r][c] = z < 0 ? "." : z < 0.45 ? ":" : z < 0.8 ? "+" : "*";
      }
      grid.innerHTML = buf.map((row, r) => row.map((ch, c) =>
        (zb[r][c] >= 0 && ch !== " ") ? `<span class="f">${ch}</span>` : ch).join("")).join("\n");
      for (const o of words) {
        const [x, y, z] = rot(o.p);
        const col = Math.max(0, Math.min(cols - o.w.length, Math.round(cx + x * rx - o.w.length / 2)));
        const row = Math.round(cyy - y * ry);
        o.el.style.transform = `translate(${col * cw}px, ${row * lh}px)`;
        o.el.style.zIndex = String(Math.round((z + 1) * 100));
        const off = skillCat !== "tutte" && o.cat !== skillCat;
        o.el.className = off ? "off" : z < -0.1 ? "back" : skillCat !== "tutte" ? "hl" : "";
      }
    }
    function loop() {
      if (!dragging) {
        yaw += vYaw; pitch += vPitch;
        vYaw += (AUTO - vYaw) * 0.03; vPitch *= 0.93;
        pitch += (-0.35 - pitch) * 0.01;
      }
      paint();
      raf = visible && (!reduced || dragging || Math.abs(vYaw) > 1e-4) ? requestAnimationFrame(loop) : 0;
    }
    function start() { if (!raf) raf = requestAnimationFrame(loop); }
    box.addEventListener("pointerdown", (e) => {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      box.setPointerCapture(e.pointerId); start();
    });
    box.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      yaw += dx * 0.01; pitch = Math.max(-1.3, Math.min(1.3, pitch + dy * 0.01));
      vYaw = dx * 0.01; vPitch = dy * 0.004;
    });
    const end = () => { dragging = false; start(); };
    box.addEventListener("pointerup", end);
    box.addEventListener("pointercancel", end);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(box);
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { measured = false; paint(); }, 150); });
    document.addEventListener("visibilitychange", () => { visible = !document.hidden && visible; });
    return { init() { measured = false; paint(); }, paint };
  })();

  /* ---------------- Terminale ---------------- */
  const term = (() => {
    const box = $("#term"), out = $("#term-out"), input = $("#term-input");
    const hist = []; let hi = 0, donutStop = null;
    const print = (html) => { out.insertAdjacentHTML("beforeend", html + "\n"); out.scrollTop = out.scrollHeight; };
    const sezioni = ["chi-sono", "progetti", "percorso", "competenze", "contatti"];
    const go = (hash) => { location.hash = hash; };

    const cmds = {
      help: () => print(
`comandi disponibili:
  <span class="c">whoami</span>             chi sono
  <span class="c">neofetch</span>           scheda di sistema
  <span class="c">ls</span> [progetti]      elenca sezioni o progetti
  <span class="c">cd</span> &lt;sezione&gt;       vai a una sezione (es. cd percorso)
  <span class="c">open</span> &lt;progetto&gt;     apri un progetto (Tab completa il nome)
  <span class="c">skills</span>             competenze ad albero
  <span class="c">git log</span>            il mio percorso
  <span class="c">contatti</span>           come raggiungermi
  <span class="c">crediti</span>            opere di altri usate nel sito
  <span class="c">clear</span> · <span class="c">exit</span>
...e qualche comando nascosto.`),
      whoami: () => print(`${esc(D.profilo.nome)} · ${esc(D.profilo.ruolo)}`),
      neofetch: () => print(D.profilo.neofetch.map(([k, v]) => `<span class="c">${esc(k.padEnd(8))}</span> ${esc(v)}`).join("\n")),
      ls: (a) => {
        if (a[0] && a[0].replace(/\/$/, "").replace("~/", "") === "progetti")
          return print(progetti.map((p) => `drwxr-xr-x  ${esc(p.anno.padEnd(9))} <a href="#/p/${esc(p.slug)}">${esc(p.slug)}/</a>`).join("\n"));
        print(sezioni.map((s) => `<span class="c">${s}/</span>`).join("  "));
      },
      cd: (a) => {
        const t = (a[0] || "~").replace(/^~\/?/, "").replace(/\/$/, "");
        if (!t || t === "..") return go(t === ".." && !$("#view-project").hidden ? "#progetti" : "#top");
        if (sezioni.includes(t)) return go("#" + t);
        if (progetti.some((p) => p.slug === t)) return go("#/p/" + t);
        print(`<span class="err">cd: ${esc(t)}: directory inesistente</span>`);
      },
      open: (a) => {
        const s = (a[0] || "").replace(/^(~\/)?progetti\//, "").replace(/\/$/, "");
        const p = progetti.find((x) => x.slug === s);
        if (!p) return print(`<span class="err">open: "${esc(s)}" non trovato.</span> prova: ls progetti`);
        go("#/p/" + p.slug); print(`apro ${esc(p.titolo)}...`);
      },
      cat: (a) => {
        const f = (a[0] || "").replace(/\.txt$/, "");
        if (f === "chi-sono") return print(D.profilo.chiSono.map(esc).join("\n\n"));
        if (f === "contatti") return cmds.contatti();
        cmds.open(a);
      },
      skills: () => print(D.competenze.map((c) => `<span class="c">${c.id}/</span>\n` + c.voci.map((v) => "  └ " + esc(v)).join("\n")).join("\n")),
      git: (a) => {
        if (a[0] !== "log") return print(`<span class="err">git: prova "git log"</span>`);
        print(D.percorso.map((c) => `<span class="ok">${c.hash}</span> ${esc(c.data.padEnd(7))} ${esc(c.titolo)}`).join("\n"));
      },
      contatti: () => print(`github  <a href="${esc(D.profilo.github)}" target="_blank" rel="noopener">${esc(D.profilo.github)}</a>\ngiochi  <a href="${esc(D.profilo.itch)}" target="_blank" rel="noopener">${esc(D.profilo.itch)}</a>\nemail e telefono: li trovi nel mio CV`),
      // la licenza CC BY 4.0 del teschio chiede di citare autore, opera e licenza
      crediti: () => {
        const a = (u, t) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`;
        print(`<span class="c">teschio 3D</span>   ${a("https://sketchfab.com/3d-models/forgotten-skull-a3d96696c1c140429dc2499d731be479", "«Forgotten Skull»")} di Nick Scott
             licenza ${a("https://creativecommons.org/licenses/by/4.0/deed.it", "CC BY 4.0")} · nel sito senza texture, disegnato in caratteri
<span class="c">mani</span>         dalla Creazione di Adamo di Michelangelo (pubblico dominio)
<span class="c">ASCII art</span>    motore ${a("https://asciify.org", "Asciify")} (licenza MIT)`);
      },
      cv: () => D.profilo.cv ? (window.open("assets/" + D.profilo.cv), print("apro il CV...")) : print("il CV non è pubblicato sul sito (comando: contatti)"),
      clear: () => { out.innerHTML = ""; },
      exit: () => close(),
      history: () => print(hist.map((h, i) => `${String(i + 1).padStart(4)}  ${esc(h)}`).join("\n")),
      sudo: () => print(`<span class="err">visitatore non è nel file sudoers. L'incidente verrà segnalato.</span>`),
      rm: () => print(`<span class="err">rm: permesso negato.</span> E comunque c'è il backup 3-2-1.`),
      ping: () => print("PING luca: 56 byte di dati\n64 byte da luca: icmp_seq=1 tempo di risposta &lt; 24h\n--- 1 pacchetto inviato, 1 ricevuto, 0% perso ---"),
      donut: () => donut(),
      date: () => print(new Date().toLocaleString("it-IT")),
      echo: (a) => print(esc(a.join(" ")))
    };
    cmds[":q"] = cmds[":wq"] = () => print("non siamo in vim, ma apprezzo il riflesso condizionato. (exit per chiudere)");
    cmds.vim = cmds.nano = () => print("modifica rifiutata: questo portfolio è in sola lettura.");
    cmds.aiuto = cmds.help; cmds.credits = cmds.crediti; cmds.progetti = () => cmds.ls(["progetti"]);

    function run(line) {
      const raw = line.trim();
      print(`<span class="c">luca@noluca:~$</span> ${esc(raw)}`);
      if (!raw) return;
      hist.push(raw); hi = hist.length;
      const [c, ...a] = raw.split(/\s+/);
      const f = cmds[c.toLowerCase()];
      if (f) f(a); else print(`<span class="err">${esc(c)}: comando non trovato.</span> scrivi "help"`);
    }
    function complete() {
      const v = input.value, parts = v.split(/\s+/);
      const pool = parts.length > 1
        ? (["cd"].includes(parts[0]) ? [...sezioni, ...progetti.map((p) => p.slug)] : progetti.map((p) => p.slug))
        : Object.keys(cmds);
      const last = parts[parts.length - 1];
      const m = pool.filter((x) => x.startsWith(last));
      if (m.length === 1) { parts[parts.length - 1] = m[0]; input.value = parts.join(" ") + " "; }
      else if (m.length > 1) print(m.join("  "));
    }
    function donut() {
      if (reduced) return print("(animazione disattivata: preferisci meno movimento)");
      if (donutStop) donutStop();
      const pre = document.createElement("span");
      out.appendChild(pre); out.appendChild(document.createTextNode("\n"));
      let A = 0, B = 0, n = 0, id = 0;
      const W = 56, H = 22, chars = ".,-~:;=!*#$@";
      const frame = () => {
        const b = new Array(W * H).fill(" "), z = new Array(W * H).fill(0);
        const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B);
        for (let j = 0; j < 6.28; j += 0.07) {
          const cj = Math.cos(j), sj = Math.sin(j);
          for (let i = 0; i < 6.28; i += 0.02) {
            const ci = Math.cos(i), si = Math.sin(i);
            const h = cj + 2, d = 1 / (si * h * sA + sj * cA + 5), t = si * h * cA - sj * sA;
            const x = Math.floor(W / 2 + 26 * d * (ci * h * cB - t * sB));
            const y = Math.floor(H / 2 + 11 * d * (ci * h * sB + t * cB));
            const o = x + W * y;
            const N = Math.floor(8 * ((sj * sA - si * cj * cA) * cB - si * cj * sA - sj * cA - ci * cj * sB));
            if (y >= 0 && y < H && x >= 0 && x < W && d > z[o]) { z[o] = d; b[o] = chars[Math.max(0, N)]; }
          }
        }
        let s = "";
        for (let k = 0; k < H; k++) s += b.slice(k * W, k * W + W).join("") + "\n";
        pre.textContent = s;
        out.scrollTop = out.scrollHeight;
        A += 0.07; B += 0.03;
        if (++n < 180) id = requestAnimationFrame(frame); else donutStop = null;
      };
      donutStop = () => { cancelAnimationFrame(id); donutStop = null; };
      frame();
    }

    function open() {
      box.hidden = false;
      $("#btn-term").setAttribute("aria-pressed", "true");
      if (!out.textContent) print(`Benvenuto nel terminale di Luca.\nScrivi <span class="c">help</span> per i comandi · <span class="c">Tab</span> completa · <span class="c">Esc</span> chiude\n`);
      input.focus();
    }
    function close() {
      box.hidden = true;
      $("#btn-term").setAttribute("aria-pressed", "false");
      if (donutStop) donutStop();
      $("#btn-term").focus();
    }
    $("#term-form").addEventListener("submit", (e) => { e.preventDefault(); run(input.value); input.value = ""; });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Tab") { e.preventDefault(); complete(); }
      else if (e.key === "ArrowUp") { if (hi > 0) { input.value = hist[--hi]; } e.preventDefault(); }
      else if (e.key === "ArrowDown") { if (hi < hist.length - 1) input.value = hist[++hi]; else { hi = hist.length; input.value = ""; } e.preventDefault(); }
      else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); out.innerHTML = ""; }
    });
    $("#btn-term").addEventListener("click", () => (box.hidden ? open() : close()));
    $("#term-close").addEventListener("click", close);
    out.addEventListener("click", () => input.focus());
    document.addEventListener("keydown", (e) => {
      const typing = /input|textarea|select/i.test(document.activeElement.tagName);
      if (e.key === "Escape" && !box.hidden) { close(); return; }
      if (!typing && (e.key === "`" || e.key === "\\") && !e.ctrlKey && !e.metaKey && $("#boot").hidden) {
        e.preventDefault(); box.hidden ? open() : close();
      }
    });
    return { open };
  })();

  /* ---------------- Barra di stato in basso, come in VS Code ---------------- */
  function statusBar() {
    const ln = $("#sb-ln"), ver = $("#sb-ver");
    if (ver) ver.textContent = D.versione || "";
    const lh = parseFloat(getComputedStyle(document.body).lineHeight) || 23;
    const upd = () => { if (ln) ln.textContent = `Ln ${Math.floor(window.scrollY / lh) + 1}, Col 1`; };
    window.addEventListener("scroll", upd, { passive: true }); upd();
    $("#sb-term").addEventListener("click", () => term.open());
  }

  /* ---------------- Sfondo ASCII animato dell'hero ----------------
     Un campo di caratteri disegnato su canvas (una riga = una sola chiamata
     di disegno). Onde lente, una scia dietro al mouse che sfuma in un attimo e
     un'onda a ogni clic. Si ferma fuori schermo, a scheda nascosta e con "meno movimento". */
  const heroBg = (() => {
    const cv = $("#hero-bg"), hero = $(".hero");
    if (!cv || !cv.getContext) return { start() {} };
    const ctx = cv.getContext("2d");
    const RAMP = " .·:-=+*";
    let W = 0, H = 0, cols = 0, rows = 0, cw = 8, ch = 16, fs = 13, dpr = 1;
    let t = 0, raf = 0, last = 0, visible = true, colFaint = "#4a3714", colDim = "#8f6a24", font = "";
    // scia del mouse: un "calore" per cella, lasciato lungo il percorso del puntatore
    // e che si raffredda da solo (i caratteri scendono la rampa: * + = - : . )
    let heat = new Float32Array(0), px = null, py = null, colAcc = "#ffb000";
    const SCIA_R = 2;         // raggio del pennello, in righe (spessore della scia)
    const SCIA_CALO = 0.95;   // quanto calore resta a ogni fotogramma (~1 s per sparire)
    const rings = [];
    function stamp(x, y, s) {
      const r2 = SCIA_R * SCIA_R, rx = Math.ceil(SCIA_R * 2), ry = Math.ceil(SCIA_R);
      const x0 = Math.max(0, Math.floor(x) - rx), x1 = Math.min(cols - 1, Math.ceil(x) + rx);
      const y0 = Math.max(0, Math.floor(y) - ry), y1 = Math.min(rows - 1, Math.ceil(y) + ry);
      for (let cy = y0; cy <= y1; cy++) for (let cx = x0; cx <= x1; cx++) {
        const dx = (cx - x) * 0.5, dy = cy - y, k = s * Math.exp(-(dx * dx + dy * dy) / r2);
        const i = cy * cols + cx;
        if (k > heat[i]) heat[i] = k;
      }
    }
    function scia(x, y) {
      // riempie il tratto dall'ultimo punto, così la scia è continua anche col mouse veloce
      if (px === null || Math.abs(x - px) > 60 || Math.abs(y - py) > 30) { px = x; py = y; }
      const dx = x - px, dy = y - py, len = Math.hypot(dx * 0.5, dy), n = Math.max(1, Math.ceil(len / 0.5));
      const s = Math.min(1, 0.25 + len * 0.22); // più veloce = scia più intensa (lento: appena accennata)
      for (let i = 1; i <= n; i++) stamp(px + dx * i / n, py + dy * i / n, s);
      px = x; py = y;
    }
    function colors() {
      const cs = getComputedStyle(document.documentElement);
      colFaint = cs.getPropertyValue("--faint").trim() || colFaint;
      colDim = cs.getPropertyValue("--dim").trim() || colDim;
      colAcc = cs.getPropertyValue("--acc").trim() || colAcc;
      font = `${fs}px ${cs.getPropertyValue("--font")}`;
    }
    function size() {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      fs = W < 600 ? 14 : 13;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      colors();
      ctx.font = font;
      cw = ctx.measureText("M").width || fs * 0.6; ch = Math.round(fs * 1.25);
      cols = Math.ceil(W / cw); rows = Math.ceil(H / ch);
      heat = new Float32Array(cols * rows); px = py = null;
    }
    function frame(now) {
      raf = 0;
      if (!visible || document.hidden) return;
      if (now - last < 33) { raf = requestAnimationFrame(frame); return; } // ~30 fps
      const dt = Math.min(4, (now - last) / 33);
      last = now; t += 0.033 * dt;
      const calo = Math.pow(SCIA_CALO, dt);
      ctx.clearRect(0, 0, W, H);
      ctx.font = font; ctx.textBaseline = "top";
      const hot = [], top = [];
      for (let i = rings.length - 1; i >= 0; i--) if (rings[i].a < 0.02) rings.splice(i, 1);
      for (let y = 0; y < rows; y++) {
        let line = "";
        for (let x = 0; x < cols; x++) {
          let v = Math.sin(x * 0.07 + t) + Math.sin(y * 0.18 - t * 0.7) + Math.sin((x + y * 2) * 0.045 + t * 0.4);
          v = (v + 3) / 6; // 0..1
          const i = y * cols + x, h = heat[i];
          let boost = h > 0.02 ? h * 0.85 : 0;
          if (h) heat[i] = h > 0.01 ? h * calo : 0;
          for (const g of rings) { const k = Math.abs(Math.sqrt(((x - g.x) * 0.5) ** 2 + (y - g.y) ** 2) - g.r); if (k < 1.5) boost += g.a * (1 - k / 1.5); }
          v = Math.min(1, v * 0.75 + boost);
          const c = RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))];
          if (h > 0.7 && c !== " ") { top.push(x, y, c); line += " "; }
          else if (boost > 0.25 && c !== " ") { hot.push(x, y, c); line += " "; } else line += c;
        }
        ctx.fillStyle = colFaint;
        ctx.fillText(line, 0, y * ch);
      }
      ctx.fillStyle = colDim;
      for (let i = 0; i < hot.length; i += 3) ctx.fillText(hot[i + 2], hot[i] * cw, hot[i + 1] * ch);
      // la testa della scia, appena lasciata, in ambra tenue
      ctx.fillStyle = colAcc; ctx.globalAlpha = 0.55;
      for (let i = 0; i < top.length; i += 3) ctx.fillText(top[i + 2], top[i] * cw, top[i + 1] * ch);
      ctx.globalAlpha = 1;
      for (const g of rings) { g.r += 0.9; g.a *= 0.95; }
      raf = requestAnimationFrame(frame);
    }
    function start() {
      size();
      if (reduced) { visible = true; t = 2; last = -1e9; frame(1e9); visible = false; return; }
      if (!raf) raf = requestAnimationFrame(frame);
    }
    if (!reduced) {
      // il mouse si ascolta su tutta la pagina: lo sfondo è largo quanto lo schermo,
      // mentre l'hero (il contenuto) è più stretto
      const inside = (e, r) => e.clientY >= r.top && e.clientY <= r.bottom;
      document.addEventListener("pointermove", (e) => {
        const r = cv.getBoundingClientRect();
        if (!inside(e, r)) { px = py = null; return; }
        scia((e.clientX - r.left) / cw, (e.clientY - r.top) / ch);
      }, { passive: true });
      document.addEventListener("pointerdown", (e) => {
        const r = cv.getBoundingClientRect();
        if (!inside(e, r) || e.target.closest("a,button,.topbar,.statusbar,.term")) return;
        rings.push({ x: (e.clientX - r.left) / cw, y: (e.clientY - r.top) / ch, r: 0, a: 0.9 });
      });
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); }).observe(hero);
      document.addEventListener("visibilitychange", () => { if (!document.hidden && visible && !raf) raf = requestAnimationFrame(frame); });
    }
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(start, 150); });
    return { start, colors };
  })();

  /* ---------------- ASCII art (motore Asciify) ----------------
     Disegnate con il motore di Asciify (MIT, https://asciify.org), installato in
     assets/vendor/asciify-engine/ e caricato solo quando serve: schermi larghi e
     disegno vicino. Le impostazioni di ogni disegno stanno in assets/ascii/arts.js.
     Se il motore non parte (browser vecchio, niente WebGL2) il disegno sparisce e
     il resto del sito funziona lo stesso. */
  const asciiArt = (() => {
    const VENDOR = new URL("assets/vendor/asciify-engine/", location.href).href;
    const moduli = {};
    const lib = (nome) => moduli[nome] || (moduli[nome] = import(VENDOR + nome + ".js"));
    const largo = window.matchMedia("(min-width: 1360px)"); // disegni nei margini
    const medio = window.matchMedia("(min-width: 1080px)"); // pesce che attraversa
    const ratio = (a) => a.formato || ((a.settings && /^\d+:\d+$/.test(a.settings.aspectRatio)) ? a.settings.aspectRatio.replace(":", " / ") : "1 / 1");
    const url = (f) => new URL(f, location.href).href;

    const items = (window.ASCII_ART || []).map((a) => {
      const sec = document.getElementById(a.sezione);
      if (!sec) return null;
      const cv = document.createElement("canvas");
      let el, box, mq;
      if (a.tipo === "attraversa") {
        if (reduced) return null; // è solo movimento: con "riduci movimento" non c'è
        el = document.createElement("div");
        el.className = "ascii-corsia";
        box = document.createElement("div");
        box.className = "ascii-nuota";
        box.style.width = a.larghezza || "240px";
        box.style.aspectRatio = ratio(a);
        el.style.setProperty("--durata", (a.durata || 30) + "s");
        el.style.height = "calc(" + (a.larghezza || "240px") + " / (" + ratio(a) + "))";
        box.appendChild(cv);
        el.appendChild(box);
        mq = medio;
      } else {
        el = box = document.createElement("div");
        el.className = "side-art side-" + (a.lato === "sinistra" ? "sinistra" : "destra");
        el.style.aspectRatio = ratio(a);
        if (a.alto) el.style.top = a.alto;
        const hover = a.settings && a.settings.hover && a.settings.hover.effect !== "none";
        if (hover) el.classList.add("interattiva");
        if (a.tipo === "modello") el.classList.add("interattiva", "modello");
        el.appendChild(cv);
        mq = largo;
      }
      el.setAttribute("aria-hidden", "true");
      sec.appendChild(el);
      return { a, el, box, cv, mq, player: null, loading: false, visible: false };
    }).filter(Boolean);
    if (!items.length) return;

    const size = (it) => { const r = it.box.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
    const togli = (it) => { if (it.player) it.player.destroy(); it.player = null; it.el.remove(); };

    // Video e immagini: lo Studio di Asciify
    async function studio(it) {
      const { mountStudio } = await lib("studio");
      const [w, h] = size(it);
      const s = await mountStudio(it.cv, url(it.a.file), {
        settings: it.a.settings, width: w, height: h, fps: 25, adaptive: true,
        onError: () => togli(it)
      });
      return { pause: (v) => s.pause(v), resize: (w, h) => s.resize(w, h), destroy: () => s.destroy() };
    }

    // Video: campo di caratteri sulla GPU, disegnato in un worker al ritmo dello schermo.
    // Il video lo gestiamo noi, così fuori schermo si ferma davvero. Senza GPU: lo Studio.
    async function video(it) {
      const field = await lib("field");
      if (!field.isGlyphFieldSupported()) return studio(it);
      const v = document.createElement("video");
      Object.assign(v, { muted: true, loop: true, playsInline: true, preload: "auto", src: url(it.a.file) });
      v.setAttribute("muted", "");
      await new Promise((ok, ko) => { v.addEventListener("loadeddata", ok, { once: true }); v.addEventListener("error", ko, { once: true }); });
      const f = field.mountGlyphField(it.cv, {
        source: v, worker: true, hover: "none", tap: "none", ...it.a.campo, onError: () => togli(it)
      });
      await f.ready;
      const r = it.a.rivela ? rivela(it, v) : null;
      return {
        pause(stop) {
          if (stop) { v.pause(); f.pause(); } else { v.play().catch(() => {}); f.play(); }
          if (r) r.attivo = !stop;
        },
        resize() { f.resize(); if (r) r.fit(); },
        destroy() { f.destroy(); if (r) r.destroy(); v.pause(); v.removeAttribute("src"); v.load(); }
      };
    }

    // "Rivela": dietro al mouse, per un attimo, si vede il video originale al posto dei
    // caratteri. Una scia di cerchi sfumati fa da maschera al video, disegnato con lo stesso
    // taglio del campo; la fusione "screen" rende trasparente il nero dello sfondo.
    function rivela(it, v) {
      const o = it.a.rivela, R = o.raggio ?? 0.13, DUR = (o.durata ?? 0.9) * 1000, OP = o.opacita ?? 0.9;
      const ov = document.createElement("canvas");
      ov.className = "rivela";
      it.box.appendChild(ov);
      const ctx = ov.getContext("2d");
      const pts = [];
      let raf = 0;
      const st = {
        attivo: true,
        fit() {
          const b = it.box.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
          ov.width = Math.max(1, Math.round(b.width * d)); ov.height = Math.max(1, Math.round(b.height * d));
        },
        destroy() { document.removeEventListener("pointermove", move); cancelAnimationFrame(raf); ov.remove(); }
      };
      st.fit();
      function move(e) {
        if (!st.attivo) return;
        const b = it.box.getBoundingClientRect();
        const x = e.clientX - b.left, y = e.clientY - b.top;
        if (x < -30 || y < -30 || x > b.width + 30 || y > b.height + 30) return;
        const k = ov.width / b.width, now = performance.now(), last = pts[pts.length - 1];
        const px = x * k, py = y * k;
        if (last && now - last.t < 120) { // riempie il tratto: scia continua anche col mouse veloce
          const dx = px - last.x, dy = py - last.y, n = Math.min(12, Math.ceil(Math.hypot(dx, dy) / (R * ov.height * 0.35)));
          for (let i = 1; i < n; i++) pts.push({ x: last.x + dx * i / n, y: last.y + dy * i / n, t: now });
        }
        pts.push({ x: px, y: py, t: now });
        if (!raf) raf = requestAnimationFrame(draw);
      }
      function draw(now) {
        raf = 0;
        const W = ov.width, H = ov.height, rad = R * H;
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, W, H);
        while (pts.length && now - pts[0].t > DUR) pts.shift();
        if (!pts.length || !v.videoWidth) return;
        for (const p of pts) {
          const a = OP * (1 - (now - p.t) / DUR);
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
          g.addColorStop(0, `rgba(0,0,0,${a.toFixed(3)})`); g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g; ctx.fillRect(p.x - rad, p.y - rad, rad * 2, rad * 2);
        }
        ctx.globalCompositeOperation = "source-in";
        const s = Math.max(W / v.videoWidth, H / v.videoHeight), w = v.videoWidth * s, h = v.videoHeight * s;
        ctx.drawImage(v, (W - w) / 2, (H - h) / 2, w, h); // "cover" al centro, come il campo
        raf = requestAnimationFrame(draw);
      }
      document.addEventListener("pointermove", move, { passive: true });
      return st;
    }

    // Modello 3D: disegnato sulla GPU e convertito in caratteri da un campo WebGL2.
    // Senza WebGL2 lo disegna la CPU, come testo, a pochi fotogrammi al secondo.
    async function modello(it) {
      const a = it.a, giri = reduced ? 0 : (a.giri ?? 18);
      const [field, model] = await Promise.all([lib("field"), lib("model")]);
      const m = await model.loadModel(url(a.file));
      if (field.isGlyphFieldSupported()) {
        const src = model.modelSource(m, { width: 640, height: 640, spin: giri, orbit: it.el, orbitMode: "drag", ...a.vista });
        const f = field.mountGlyphField(it.cv, {
          source: src.canvas, live: true, charset: field.FIELD_PHOTO_CHARSET, ...a.campo,
          interactionTarget: it.el, onError: () => togli(it)
        });
        await f.ready;
        return {
          pause(v) { src.update({ spin: v ? 0 : giri }); if (v) f.pause(); else f.play(); },
          resize() { f.resize(); },
          destroy() { f.destroy(); src.destroy(); }
        };
      }
      const pre = document.createElement("pre");
      pre.className = "modello-testo";
      it.cv.replaceWith(pre);
      let yaw = (a.vista && a.vista.yaw) || 0, timer = 0, trascina = null, ultimo = 0;
      const disegna = () => {
        const cols = Math.max(24, Math.floor(it.el.clientWidth / 6.5));
        pre.textContent = model.modelToGrid(m, { ...a.vista, yaw, columns: cols, rows: Math.round(cols * 0.55), cellAspect: 1.8 }).lines.join("\n");
      };
      const gira = () => { yaw += giri / 8; disegna(); };
      it.el.addEventListener("pointerdown", (e) => { trascina = e.clientX; it.el.setPointerCapture(e.pointerId); });
      it.el.addEventListener("pointermove", (e) => {
        if (trascina === null || performance.now() - ultimo < 60) return;
        yaw += (e.clientX - trascina) * 0.6; trascina = e.clientX; ultimo = performance.now(); disegna();
      });
      it.el.addEventListener("pointerup", () => { trascina = null; });
      disegna();
      return {
        pause(v) { clearInterval(timer); timer = 0; if (!v && giri) timer = setInterval(gira, 125); },
        resize: disegna,
        destroy() { clearInterval(timer); }
      };
    }

    function attiva(it, on) {
      if (it.player) it.player.pause(!on);
      it.el.classList.toggle("attivo", on);
      if (it.a.tipo === "attraversa") {
        it.scia = it.scia || sciaSep(it);
        if (it.scia) it.scia(on && !!it.player);
      }
    }

    // Scia del pesce: i caratteri del separatore ░▒▓ su cui passa diventano blu e poi,
    // passato il pesce, tornano piano al grigio di prima (le transizioni sono nel CSS).
    function sciaSep(it) {
      const sep = it.el.parentElement && it.el.parentElement.previousElementSibling;
      if (!sep || !sep.classList.contains("sep")) return null;
      const testo = getComputedStyle(sep, "::before").content.replace(/^["']|["']$/g, "");
      if (!testo || testo === "none") return null;
      sep.classList.add("sep-viva");
      sep.innerHTML = [...testo].map((c) => `<span>${c}</span>`).join("");
      const spans = [...sep.children], bagnati = new Set();
      let raf = 0, cw = 0;
      function passo() {
        raf = requestAnimationFrame(passo);
        const p = it.box.getBoundingClientRect(), s = sep.getBoundingClientRect();
        cw = cw || spans[0].getBoundingClientRect().width;
        if (!cw) return;
        // il corpo del pesce, senza il bordo vuoto del video
        const a = Math.max(0, Math.floor((p.left + p.width * 0.05 - s.left) / cw));
        const b = Math.min(spans.length - 1, Math.floor((p.right - p.width * 0.05 - s.left) / cw));
        for (const i of bagnati) if (i < a || i > b) { spans[i].classList.remove("bagnato"); bagnati.delete(i); }
        for (let i = a; i <= b; i++) if (!bagnati.has(i)) { spans[i].classList.add("bagnato"); bagnati.add(i); }
      }
      window.addEventListener("resize", () => { cw = 0; });
      return (on) => {
        cancelAnimationFrame(raf); raf = 0;
        if (on) raf = requestAnimationFrame(passo);
        else { bagnati.forEach((i) => spans[i].classList.remove("bagnato")); bagnati.clear(); }
      };
    }
    // in movimento solo se visibile; con "riduci movimento" i video restano fermi su
    // un fotogramma, il teschio sta fermo ma si può girare a mano
    const vivo = (it) => it.visible && !document.hidden && it.mq.matches && (!reduced || it.a.tipo === "modello");

    async function mount(it) {
      if (!it.mq.matches || it.loading) return;
      if (it.player) { attiva(it, vivo(it)); return; }
      const [w, h] = size(it);
      if (!w || !h) return;
      it.loading = true;
      try {
        it.player = await (it.a.tipo === "modello" ? modello(it) : it.a.campo ? video(it) : studio(it));
        if (!it.el.isConnected) return;
        it.el.classList.add("on");
        attiva(it, vivo(it));
      } catch (e) {
        togli(it); // senza motore o senza WebGL il sito funziona lo stesso
      }
      it.loading = false;
    }

    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      const it = items.find((x) => x.el === e.target);
      if (!it) return;
      it.visible = e.isIntersecting;
      if (it.visible) mount(it);
      else attiva(it, false);
    }), { rootMargin: "300px 0px" });
    items.forEach((it) => io.observe(it.el));
    document.addEventListener("visibilitychange", () => items.forEach((it) => {
      if (it.player) attiva(it, vivo(it));
    }));
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => items.forEach((it) => {
        if (!it.mq.matches) { attiva(it, false); return; }
        if (it.player) {
          const [w, h] = size(it);
          if (w && h) it.player.resize(w, h);
          attiva(it, vivo(it));
        } else if (it.visible) mount(it);
      }), 200);
    });
  })();

  /* ---------------- Avvio della pagina ---------------- */
  $("#year").textContent = new Date().getFullYear();
  renderRack(); renderNeofetch(); renderAbout(); renderContacts();
  renderFilters(); renderProjects(); renderSchool(); renderGitlog();
  renderSkillTabs(); renderTree(); statusBar();
  renderBanner(0);
  route();
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  fontsReady.then(() => { globe.init(); heroBg.start(); });
  boot(() => { animateBanner(); typed(); });
})();
