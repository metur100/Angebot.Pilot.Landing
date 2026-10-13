/* AngebotPilot landing – motion & interaction (vanilla, no dependencies).
   Everything degrades gracefully: without JS all content is visible; with reduced motion
   all scroll-linked and looping animations are disabled and final states are shown. */
(() => {
  'use strict';
  const doc = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
  const fmt = (n) => eur.format(n).replace(/ /g, ' ');

  // ---------- Page load ----------
  requestAnimationFrame(() => requestAnimationFrame(() => doc.classList.add('is-loaded')));

  // ---------- Header, progress, scroll-linked variables ----------
  const header = $('[data-header]');
  const hero = $('[data-hero]');
  const darkSections = $$('[data-dark], .page-head, .notfound');
  const progressBar = $('.scroll-progress');
  const story = $('[data-story]');
  const final = $('[data-final]');
  const parallaxEls = reduced ? [] : $$('[data-parallax]');
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function sectionProgress(el, startAt = 1, endAt = 0) {
    // 0 when the element's top reaches startAt*viewport, 1 when its bottom reaches endAt*viewport.
    const r = el.getBoundingClientRect();
    const vh = innerHeight;
    const start = vh * startAt;
    const end = vh * endAt - r.height;
    return clamp((start - r.top) / (start - end));
  }

  function update() {
    ticking = false;
    const y = scrollY;
    const max = doc.scrollHeight - innerHeight;
    if (progressBar) progressBar.style.setProperty('--scroll', max > 0 ? (y / max).toFixed(4) : 0);

    if (header) {
      // Light glass over light sections, dark glass over dark ones (hero, mobile, security, CTA, page heads).
      header.classList.toggle('is-scrolled', y > 24);
      const probe = header.offsetHeight / 2;
      const overDark = darkSections.some((s) => { const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe; });
      header.classList.toggle('is-dark', overDark);
    }

    if (reduced) return;

    if (hero) {
      const hp = clamp(y / (hero.offsetHeight * 0.9));
      hero.style.setProperty('--hp', hp.toFixed(4));
    }

    if (story && storyPinned()) {
      const track = $('.story-track', story);
      const r = track.getBoundingClientRect();
      const total = r.height - innerHeight;
      const sp = clamp(-r.top / total);
      story.style.setProperty('--sp', sp.toFixed(4));
      setStoryStep(Math.min(storySteps.length - 1, Math.floor(sp * storySteps.length * 0.999)));
    }

    if (final) {
      const fp = sectionProgress(final, 1, 0);
      final.style.setProperty('--fp', fp.toFixed(4));
      const plane = $('.final-plane', final);
      if (plane) plane.style.opacity = (1 - Math.abs(fp - 0.5) * 1.8).toFixed(3);
    }

    for (const el of parallaxEls) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) continue;
      const centre = r.top + r.height / 2 - innerHeight / 2;
      el.style.setProperty('--pp', (centre * parseFloat(el.dataset.parallax)).toFixed(1));
    }

    updateWords();
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);

  // ---------- Mobile navigation ----------
  const toggle = $('.nav-toggle');
  const nav = $('#site-nav');
  if (toggle && nav) {
    const setOpen = (open) => {
      doc.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && doc.classList.contains('nav-open')) { setOpen(false); toggle.focus(); } });
    matchMedia('(min-width: 1101px)').addEventListener('change', (m) => { if (m.matches) setOpen(false); });
  }

  // ---------- Reveal on scroll ----------
  $$('[data-stagger]').forEach((group) => {
    $$(':scope > [data-reveal]', group).forEach((el, i) => el.style.setProperty('--i', String(i % 8)));
  });
  const revealTargets = $$('[data-reveal], [data-timeline], .shield, .card-accept');
  if (reduced || !('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revealTargets.forEach((el) => io.observe(el));
  }

  // ---------- Statement: words light up while scrolling ----------
  const wordsEl = $('[data-words]');
  let words = [];
  if (wordsEl) {
    const accent = new Set(['Kalkulation,', 'Versand,', 'Nachfassen', 'Auftragsanlage.']);
    const text = wordsEl.textContent.trim().split(/\s+/);
    wordsEl.innerHTML = text.map((w) => `<span class="w${accent.has(w) ? ' w-accent' : ''}">${w}</span>`).join(' ');
    words = $$('.w', wordsEl);
  }
  function updateWords() {
    if (!wordsEl || reduced) return;
    const p = sectionProgress(wordsEl, 0.85, 0.35);
    const lit = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < lit));
  }

  // ---------- Story (pinned) ----------
  const storySteps = story ? $$('.story-step', story) : [];
  const storyShots = story ? $$('[data-shot]', story) : [];
  const storyZooms = story ? $$('[data-zoom]', story) : [];
  let currentStep = -1;
  const storyPinned = () => !reduced && matchMedia('(min-width: 961px)').matches;
  function setStoryStep(i) {
    if (i === currentStep) return;
    currentStep = i;
    storySteps.forEach((s, n) => s.classList.toggle('is-active', n === i));
    storyShots.forEach((img, n) => img.classList.toggle('is-active', n === i));
    storyZooms.forEach((z, n) => z.classList.toggle('is-active', n === i));
  }
  if (story) {
    setStoryStep(0);
    // Preload story screenshots shortly before the section comes into view.
    if ('IntersectionObserver' in window) {
      const pre = new IntersectionObserver((es) => {
        if (es.some((e) => e.isIntersecting)) { [...storyShots, ...$$('img', story)].forEach((img) => { img.loading = 'eager'; }); pre.disconnect(); }
      }, { rootMargin: '600px 0px' });
      pre.observe(story);
    }
  }

  // ---------- Hero scene ----------
  const scene = $('[data-scene]');
  const stage = $('[data-stage]');
  if (scene && stage) {
    const rows = $$('[data-row]', scene);
    const counters = $$('[data-count]', scene);
    const status = $('[data-doc-status]', scene);
    const STATES = ['scene-sent', 'scene-fly', 'scene-phone', 'scene-press', 'scene-accepted', 'scene-pdf', 'scene-reminder', 'scene-job', 'scene-fadeout'];
    let timers = [];
    let running = false;
    let visible = true;

    const later = (ms, fn) => timers.push(setTimeout(fn, ms));
    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
    const setCount = (el, value) => { el.textContent = fmt(value); };

    function countUp(el, to, ms) {
      const start = performance.now();
      const step = (t) => {
        const k = clamp((t - start) / ms);
        const eased = 1 - Math.pow(1 - k, 3);
        setCount(el, Math.round(to * eased * 100) / 100);
        if (k < 1 && running) requestAnimationFrame(step);
        else setCount(el, to);
      };
      requestAnimationFrame(step);
    }

    function finalState() {
      rows.forEach((r) => r.classList.add('is-on'));
      counters.forEach((c) => setCount(c, parseFloat(c.dataset.count)));
      scene.classList.add('scene-sent', 'scene-phone', 'scene-accepted', 'scene-pdf', 'scene-job');
      if (status) status.textContent = 'Angenommen';
    }

    function play() {
      if (running) return;
      running = true;
      clearTimers();
      scene.classList.remove(...STATES);
      rows.forEach((r) => r.classList.remove('is-on'));
      counters.forEach((c) => setCount(c, 0));
      if (status) status.textContent = 'Entwurf';

      let t = 900;
      rows.forEach((r) => { later(t, () => r.classList.add('is-on')); t += 520; });
      later(t, () => counters.forEach((c, i) => countUp(c, parseFloat(c.dataset.count), 900 + i * 150)));
      t += 1300;
      later(t, () => { scene.classList.add('scene-pdf'); });
      t += 900;
      later(t, () => { scene.classList.add('scene-sent', 'scene-fly'); if (status) status.textContent = 'Versendet'; });
      t += 700;
      later(t, () => scene.classList.add('scene-reminder'));
      t += 700;
      later(t, () => scene.classList.add('scene-phone'));
      t += 1100;
      later(t, () => scene.classList.add('scene-press'));
      t += 260;
      later(t, () => { scene.classList.remove('scene-press', 'scene-reminder'); scene.classList.add('scene-accepted'); if (status) status.textContent = 'Angenommen'; });
      t += 900;
      later(t, () => scene.classList.add('scene-job'));
      t += 3600;
      later(t, () => scene.classList.add('scene-fadeout'));
      t += 800;
      later(t, () => { running = false; scene.classList.remove('scene-fly'); if (visible && !document.hidden) play(); });
    }

    function stop() { running = false; clearTimers(); }

    if (reduced) {
      finalState();
    } else {
      setTimeout(play, 600);
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((es) => {
          visible = es[0].isIntersecting;
          if (!visible) stop();
          else if (!running) play();
        }, { threshold: 0.15 }).observe(scene);
      }
      document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (visible && !running) play(); });

      // Pointer tilt (desktop only)
      if (finePointer) {
        let raf = 0;
        hero.addEventListener('pointermove', (e) => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            const r = hero.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            scene.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`);
            scene.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`);
          });
        });
        hero.addEventListener('pointerleave', () => { scene.style.setProperty('--ry', '0deg'); scene.style.setProperty('--rx', '0deg'); });
      }
    }
  }

  // ---------- Calculator (same rules as the product: cents, half away from zero) ----------
  const calc = $('[data-calc]');
  if (calc) {
    const q = $('[data-in="qty"]', calc);
    const p = $('[data-in="price"]', calc);
    const d = $('[data-in="discount"]', calc);
    const out = (k) => $(`[data-out="${k}"]`, calc);
    const res = (k) => $(`[data-res="${k}"]`, calc);
    const round2 = (v) => Math.sign(v) * Math.round(Math.abs(v) * 100 + 1e-9) / 100;
    let prev = {};

    const fill = (input) => {
      const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
      input.style.setProperty('--fill', `${pct}%`);
    };

    function compute() {
      const qty = parseInt(q.value, 10);
      const price = parseFloat(p.value);
      const discountPct = parseInt(d.value, 10);
      const rate = parseFloat($('input[name="calc-tax"]:checked', calc).value);
      // Integer cents to avoid floating point errors, like the server's decimal arithmetic.
      const before = round2((qty * Math.round(price * 100)) / 100);
      const discount = round2(before * discountPct / 100);
      const net = round2(before - discount);
      const tax = round2(net * rate / 100);
      const gross = round2(net + tax);
      out('qty').textContent = qty;
      out('price').textContent = fmt(price);
      out('discount').textContent = `${discountPct} %`;
      const values = {
        before: fmt(before),
        discount: discount > 0 ? `−${fmt(discount)}` : fmt(0),
        net: fmt(net),
        tax: fmt(tax),
        gross: fmt(gross),
        taxlabel: rate === 0 ? 'USt. (§ 19 UStG)' : `USt. ${rate} %`,
      };
      for (const [k, v] of Object.entries(values)) {
        const el = res(k);
        if (!el || prev[k] === v) continue;
        el.textContent = v;
        if (k !== 'taxlabel' && !reduced) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
      }
      prev = values;
      [q, p, d].forEach(fill);
    }
    calc.addEventListener('input', compute);
    compute();
  }

  // ---------- Spotlight cards ----------
  if (finePointer && !reduced) {
    $$('[data-spotlight]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--x', `${e.clientX - r.left}px`);
        card.style.setProperty('--y', `${e.clientY - r.top}px`);
      });
    });

    // Magnetic buttons
    $$('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', `${((e.clientX - r.left) / r.width - 0.5) * 10}px`);
        btn.style.setProperty('--my', `${((e.clientY - r.top) / r.height - 0.5) * 8}px`);
      });
      btn.addEventListener('pointerleave', () => { btn.style.setProperty('--mx', '0px'); btn.style.setProperty('--my', '0px'); });
    });
  }

  // ---------- Accordion with smooth height ----------
  $$('.accordion details').forEach((det) => {
    const summary = $('summary', det);
    const body = $('.acc-body', det);
    if (!summary || !body || reduced) return;
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (det.dataset.animating) return;
      det.dataset.animating = '1';
      if (det.open) {
        const h = body.offsetHeight;
        body.animate([{ height: `${h}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' })
          .onfinish = () => { det.open = false; delete det.dataset.animating; };
      } else {
        det.open = true;
        const h = body.offsetHeight;
        body.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.16,1,.3,1)' })
          .onfinish = () => { delete det.dataset.animating; };
      }
    });
  });

  // ---------- Legal pages: table of contents highlight ----------
  const tocLinks = $$('.toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(tocLinks.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
    const targets = [...map.keys()].map((id) => document.getElementById(id)).filter(Boolean);
    const tio = new IntersectionObserver((es) => {
      for (const e of es) {
        if (e.isIntersecting) {
          tocLinks.forEach((a) => a.classList.remove('is-current'));
          map.get(e.target.id)?.classList.add('is-current');
        }
      }
    }, { rootMargin: '-20% 0px -70% 0px' });
    targets.forEach((t) => tio.observe(t));
  }

  update();
})();
