// Special dates for the cookieowl site. Picks the season from the visitor's
// local date, sets data-season on <html> for the CSS and the seasonal art,
// adds a small chip with an off switch (remembered per season) and, unless
// reduced motion is asked, a light particle canvas in the hero.
// ?season=<id> forces a season, ?season=off turns it off. Dependency free.
(function (g) {
  var IDS = ['newyear', 'carnival', 'easter', 'valentine', 'junina', 'halloween', 'christmas'];
  var DAY = 864e5;
  function easter(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
    var h = (19 * a + b - d - Math.floor((b - Math.floor((b + 8) / 25) + 1) / 3) + 15) % 30;
    var l = (32 + 2 * e + 2 * Math.floor(c / 4) - h - (c % 4)) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var n = h + l - 7 * m + 114;
    return new Date(y, Math.floor(n / 31) - 1, (n % 31) + 1);
  }
  // Whole days from a to b, safe across daylight saving changes.
  function days(a, b) {
    return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / DAY);
  }
  /** The season of a local date, or null. br: the visitor reads pt-BR. */
  function seasonFor(date, br) {
    var m = date.getMonth() + 1, d = date.getDate(), md = m * 100 + d;
    var e = days(date, easter(date.getFullYear()));
    if (md >= 1230 || md <= 102) return 'newyear';
    if (md >= 1218 && md <= 1226) return 'christmas';
    if (md >= 1024 && md <= 1031) return 'halloween';
    if (e >= 0 && e <= 2) return 'easter';
    if (e >= 46 && e <= 50) return 'carnival';
    if (md === 214 || (br && md === 612)) return 'valentine';
    if (md >= 613 && md <= 629) return 'junina';
    return null;
  }
  function isBr(nav) {
    return [].concat(nav.languages || [], nav.language || []).some(function (l) { return /^pt-br$/i.test(l); });
  }
  /** The season to show: the ?season override first, then the date and the stored off switch. */
  function pick(search, date, br, store) {
    var q = /[?&]season=([a-z]+)/.exec(search || '');
    if (q) return IDS.indexOf(q[1]) >= 0 ? { id: q[1], on: true, forced: true } : null;
    var id = seasonFor(date, br);
    if (!id) return null;
    var off;
    try { off = store && store.getItem('cookieowl:season-off:' + id) === '1'; } catch (x) { off = false; }
    return { id: id, on: !off };
  }
  function label(id, br) {
    return { newyear: 'New Year', carnival: 'Carnival', easter: 'Easter', valentine: "Valentine's", junina: br ? 'Festa Junina' : 'Midsummer', halloween: 'Halloween', christmas: 'Christmas' }[id];
  }
  var api = { IDS: IDS, easter: easter, seasonFor: seasonFor, pick: pick, label: label };
  g.cookieowlSeasons = api;
  if (typeof document === 'undefined') return;

  var root = document.documentElement;
  var base = new URL('./', (document.currentScript && document.currentScript.src) || location.href);
  var br = isBr(navigator);
  var store;
  try { store = localStorage; } catch (x) { store = null; }
  var s = pick(location.search, new Date(), br, store);
  if (!s) return;
  if (s.on) root.setAttribute('data-season', s.id);
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fx() {
    var town = document.querySelector('.town');
    if (fx.wake) return fx.wake();
    if (!town || reduce) return;
    var c = document.createElement('canvas');
    c.className = 'season-fx';
    c.setAttribute('aria-hidden', 'true');
    town.appendChild(c);
    var x = c.getContext('2d'), W, H, run = true, seen = true, ps = [];
    var up = s.id === 'newyear' || s.id === 'junina';
    var cols = { newyear: ['#f2b134', '#c9a7e8', '#8fb4e8'], carnival: ['#f2b134', '#e58aa8', '#8fcfbf', '#8a5cc7'], easter: ['#f6d2e0', '#cfe9df', '#f7e3a8'], valentine: ['#e58aa8', '#d6336c', '#f6d2e0'], junina: ['#f2b134', '#ffd36e', '#e8833a'], halloween: ['#e8833a', '#b85a1e', '#c79a45', '#2e2548'], christmas: ['#ffffff'] }[s.id];
    function size() {
      var r = Math.min(devicePixelRatio || 1, 2);
      W = c.width = town.clientWidth * r;
      H = c.height = town.clientHeight * r;
      x.setTransform(1, 0, 0, 1, 0, 0);
    }
    function add(any) {
      return { x: Math.random() * W, y: any ? Math.random() * H : up ? H + 10 : -10, v: (0.3 + Math.random() * 0.7) * H / 900, w: Math.random() * 6, r: 2 + Math.random() * 4, c: cols[ps.length % cols.length], a: Math.random() * 6 };
    }
    size();
    for (var i = 0; i < 34; i++) ps.push(add(true));
    addEventListener('resize', size, { passive: true });
    document.addEventListener('visibilitychange', loop);
    new IntersectionObserver(function (e) { seen = e[0].isIntersecting; loop(); }).observe(town);
    function loop() {
      if (!run && seen && !document.hidden && root.hasAttribute('data-season')) { run = true; requestAnimationFrame(tick); }
    }
    function tick() {
      if (!seen || document.hidden || !root.hasAttribute('data-season')) { run = false; return; }
      x.clearRect(0, 0, W, H);
      ps.forEach(function (p, i) {
        p.a += 0.02;
        p.y += up ? -p.v * 1.4 : p.v * 1.6;
        p.x += Math.sin(p.a + p.w) * 0.6;
        if (p.y > H + 12 || p.y < -12) ps[i] = add(false);
        x.save();
        x.translate(p.x, p.y);
        x.rotate(p.a);
        x.globalAlpha = up ? Math.max(0, Math.min(1, p.y / H)) : 0.85;
        x.fillStyle = p.c;
        x.beginPath();
        if (s.id === 'carnival' || s.id === 'newyear') x.rect(-p.r, -p.r / 3, p.r * 2, p.r / 1.5);
        else if (s.id === 'halloween' && i % 5 === 0) { x.ellipse(0, 0, p.r * 2.2, p.r / 2, 0, 0, 7); x.ellipse(0, 0, p.r / 1.4, p.r, 0, 0, 7); }
        else if (s.id === 'christmas' || up) x.arc(0, 0, p.r / (up ? 2.2 : 1.6), 0, 7);
        else x.ellipse(0, 0, p.r * 1.3, p.r / 1.8, 0, 0, 7);
        x.fill();
        x.restore();
      });
      requestAnimationFrame(tick);
    }
    fx.wake = loop;
    requestAnimationFrame(tick);
  }

  function chip() {
    var name = label(s.id, br) + ' mode';
    var el = document.createElement('div');
    el.className = 'season-chip';
    el.innerHTML = '<span class="season-hoot" aria-hidden="true"><img class="only-light" alt="" src="' + base + 'assets/seasons/' + s.id + '/hoot-light.svg"><img class="only-dark" alt="" src="' + base + 'assets/seasons/' + s.id + '/hoot-dark.svg"></span><span>' + name + '</span><button type="button" role="switch" class="season-sw"></button>';
    var b = el.querySelector('button');
    b.setAttribute('aria-label', name);
    function sync() { b.setAttribute('aria-checked', String(s.on)); }
    b.onclick = function () {
      s.on = !s.on;
      sync();
      if (s.on) { root.setAttribute('data-season', s.id); fx(); } else root.removeAttribute('data-season');
      try { s.on ? store.removeItem('cookieowl:season-off:' + s.id) : store.setItem('cookieowl:season-off:' + s.id, '1'); } catch (x) { /* private mode */ }
    };
    sync();
    document.body.appendChild(el);
    if (s.on) fx();
  }
  if (document.body) chip();
  else document.addEventListener('DOMContentLoaded', chip);
})(typeof window !== 'undefined' ? window : globalThis);
