/* CD02 · Career Design 2 · Hải Đồ La Bàn · cd02/engine.js · BỘ MÁY: trạng thái, gắn lõi Proskills, hải đồ, bến, chặng, các dạng bước, Sổ tay, demo.
   Luồng: Hải đồ (Sổ Thuyền Trưởng + bản đồ sương mù) → trang bến (lời Shin, ≤3 chặng, con dấu) → trang chặng (mỗi bước một màn).
   Không tuyến tính: Vòng Khám phá (b1, b2) đi thứ tự tùy ý; Vòng Thiết kế lần lượt; Vòng Ra khơi (b5, b6) tùy ý; 8 đảo ghé tự do sau khi nhận thuyền.
   Cảng Khởi Hành (GOAL_PORT, f1–f2) mở khi đủ 6 con dấu bến; xong f2 → S.fin, Bằng Thuyền Trưởng, mở trang phục Thuyền trưởng trong Tủ đồ của Shin.
   Chữ ở content.js, hình ở art.js. ES5. */
(function (W, D) {
  'use strict';
  var PS = W.PS, ID = CD2_ID, esc = PS.esc;
  var DEMO_KEY = 'ps.demo.' + ID;
  var DQ = PS.demoParam();
  var WANT_DEMO = DQ.on && PS.checkDemo(DQ.val);
  var ASK_DEMO = DQ.on && !WANT_DEMO;
  var DEMO_ON = WANT_DEMO || (!ASK_DEMO && !!PS.get(DEMO_KEY, null));
  var OK = DEMO_ON || ASK_DEMO || PS.guard(ID);
  if (!OK) return;
  var RM = false; try { RM = !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) {}

  /* =========================================================
     1. TRẠNG THÁI
     ========================================================= */
  function blank() { return { v: 1, intro: 0, created: Date.now(), d: {}, done: {}, xp: {}, ins: {}, days: {}, seen: {}, cards: {}, isl: {}, stamp: {} }; }
  function normalize(s) { var b = blank(); for (var k in b) if (s[k] === undefined) s[k] = b[k]; return s; }
  function load() {
    var s = null;
    try { s = (DEMO_ON && !WANT_DEMO) ? PS.get(DEMO_KEY, null) : PS.load(ID); } catch (e) {}
    return (s && typeof s === 'object') ? normalize(s) : blank();
  }
  var S = load();
  var NOSAVE = ASK_DEMO ? 1 : 0, saveT = null;
  function prof() { return S.demo ? (S.prof || {}) : PS.profile(); }
  function given() { var n = String(prof().name || '').replace(/^\s+|\s+$/g, '').split(/\s+/); return n[n.length - 1] || 'bạn'; }
  function g(k) { return S.d[k]; }
  function trim(x) { return String(x == null ? '' : x).replace(/^\s+|\s+$/g, ''); }
  function sumObj(o) { var t = 0; for (var k in o) if (o.hasOwnProperty(k)) t += (+o[k] || 0); return t; }
  function xpTotal() { return sumObj(S.xp); }
  function insTotal() { return sumObj(S.ins); }
  function doneMain() { var n = 0; ORDER.forEach(function (a) { if (S.done[a]) n++; }); return n; }
  function cnt(o) { var n = 0; for (var k in o) if (o.hasOwnProperty(k) && o[k]) n++; return n; }

  /* CD01 (nếu đã học): nghề, hướng 5 năm, thư gửi mình 5 năm sau */
  function cd1() { if (S.demo) return S.cd1 || {}; try { var s = PS.summary('cd01'); return (s && s.extra) || {}; } catch (e) { return {}; } }
  function indName(k) { for (var i = 0; i < INDS2.length; i++) if (INDS2[i][0] === k) return INDS2[i][1]; return ''; }
  function jobKey() { var x = g('x1.job'); if (x && x !== 'u') return indName(x) ? x : ''; var c = cd1(); if (c.jobKey && indName(c.jobKey)) return c.jobKey; if (c.main && indName(c.main)) return c.main; return ''; }
  function jobName() { var x = g('x1.job'); if (x === 'u') return 'bạn chọn'; if (x && indName(x)) return indName(x); var c = cd1(); return c.mainName || indName(jobKey()) || 'bạn chọn'; }
  function hasCd1() { var c = cd1(); return !!(c.main || c.jobKey || c.goal); }

  function isleOf(id) { for (var i = 0; i < ISLES.length; i++) if (ISLES[i].id === id) return ISLES[i]; return null; }
  function spOf(id) { for (var i = 0; i < SENPAI.length; i++) if (SENPAI[i].id === id) return SENPAI[i]; return null; }
  function benOf(id) { if (id === PORT.id) return PORT; if (id === GOAL_PORT.id) return GOAL_PORT; for (var i = 0; i < BEN.length; i++) if (BEN[i].id === id) return BEN[i]; return null; }
  function fogOpen() { return cnt(S.isl); }
  function fogPct() { return Math.round((1 - fogOpen() / ISLES.length) * 100); }
  function cardN() { return cnt(S.cards); }
  function stampN() { return cnt(S.stamp); }
  function shipLv() { var n = 0; BEN.forEach(function (b) { if (S.stamp[b.id]) n++; }); return n; }
  function flag() { var f = g('x1.flag') || {}; return { s: f.s || 'compass', c: f.c || '#0F9F98' }; }

  /* chữ có chỗ chèn */
  function lean() { /* bên nghiêng rõ nhất ở la bàn */
    var v = g('b31.v') || [], best = -1, bi = -1;
    PAIRS.forEach(function (p, i) { var x = v[i] == null ? 5 : +v[i], d = Math.abs(x - 5); if (d > best) { best = d; bi = i; } });
    if (bi < 0 || best === 0) return 'ở giữa';
    var x2 = v[bi] == null ? 5 : +v[bi];
    return x2 < 5 ? PAIRS[bi][0] : PAIRS[bi][1];
  }
  function windTxt(k) { var i = g(k); return i == null || i === '' ? 'điều đó' : WINDS[+i]; }
  function T(s) {
    var is = isleOf(g('b13.isl'));
    return String(s == null ? '' : s).replace(/\[Tên\]/g, '<b class="nm">' + esc(given()) + '</b>').replace(/\[Nghề\]/g, '<b>' + esc(jobName()) + '</b>')
      .replace(/\[Đảo\]/g, '<b>' + esc(is ? is.n : 'bạn chọn') + '</b>').replace(/\[Lệch\]/g, esc(lean())).replace(/\[Gió\]/g, esc(windTxt('b32.h'))).replace(/\[Gió2\]/g, esc(windTxt('b32.c')))
      .replace(/\[Nghiêng\]/g, esc(leanName()));
  }
  function Q(x) { return T(esc(x)); }

  function extra() {
    var tags = g('b12.t') || {}, cur = [];
    ISLES.forEach(function (is) { if (tags[is.id] === 'cur') cur.push(is.n); });
    var bs = null; BASE5.forEach(function (b) { if (b.id === g('b22.base')) bs = b.n; });
    return { job: jobKey(), jobName: jobName(), flag: flag(), motto: g('x1.motto') || '', goal: g('x1.goal') || '',
      open1: { n: g('x1.n') || '', sure: g('x1.sure') == null ? '' : +g('x1.sure'), now: g('x1.now') || '' },
      fog: fogPct(), isles: fogOpen(), cards: cardN(), curious: cur, isl: (isleOf(g('b13.isl')) || {}).n || '', islWhy: g('b13.why') || '',
      books: [g('b21.b1') || '', g('b21.b2') || ''], take: g('b21.take') || '', base: bs || '', baseAct: g('b22.act') || '', askSenpai: g('b23.q') || '',
      compass: g('b31.v') || [], lean: lean(), leanWhy: g('b31.why') || '', windHard: g('b32.h') == null ? '' : windTxt('b32.h'), adapt: g('b32.hard') || '', can: g('b32.can') || '',
      work: g('b33.work') || '', life30: g('b33.life') || '', stamps: stampN(),
      voy: VOY.map(function (x) { var is = voyIsle(x[0]); return { l: x[1], isl: is ? is.n : '', name: g(x[0] + '.name') || '', jl: g(x[0] + '.jl') || '', m: msList(x[0]), g: g(x[0] + '.g') || {}, score: voyScore(x[0]) }; }),
      trio: g('b43.see') || '', leanVoy: leanLetter(), leanFeel: g('b51.feel') || '', leanWhy5: g('b51.why') || '',
      block: (blk() || {}).t || '', blockRoot: g('b52.w3') == null ? '' : WHY3[+g('b52.w3')], ways: waysSel(), firstStep: g('b52.first') || '',
      trial: trialTxt(), trialStart: g('b53.start') || '', trialDays: cnt(g('b53.tk') || {}), trialLearn: g('b53.learn') || '',
      ring: g('b61.r') || {}, guide: ringName(g('b61.key')), msgTo: g('b61.to') || '', work6: g('b62.w') || {}, learnH: g('b62.h') || '', learnHow: g('b62.how') || '',
      open2: { n: g('f1.n') || '', sure: g('f1.sure') == null ? '' : +g('f1.sure') }, change: g('f1.change') || '', fin: S.fin || 0 };
  }
  function save(now) {
    clearTimeout(saveT);
    if (NOSAVE || W.PS_NOSAVE) return;
    var w = function () {
      if (NOSAVE || W.PS_NOSAVE) return;
      try {
        if (S.demo) { S.savedAt = Date.now(); PS.set(DEMO_KEY, S); return; }
        PS.save(ID, S);
        PS.report(ID, { xp: xpTotal(), ins: insTotal(), done: doneMain(), total: CD2_TOTAL, days: S.days, ver: CD2_VER, extra: extra() });
      } catch (e) {}
    };
    if (now) w(); else saveT = setTimeout(w, 300);
  }
  W.addEventListener('ps:change', function (e) {
    var f = e.detail && e.detail.field;
    if (f === 'beforeBackup' || f === 'beforeRestore') save(true);
    if ((f === 'profile' || f === 'teacher') && !nbOpen) render(false);
  });
  W.addEventListener('pagehide', function () { save(true); });
  D.addEventListener('visibilitychange', function () { if (D.visibilityState === 'hidden') save(true); });
  var lastAct = Date.now();
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (ev) { W.addEventListener(ev, function () { lastAct = Date.now(); }, { passive: true }); });
  setInterval(function () {
    if (D.visibilityState !== 'visible' || Date.now() - lastAct > 60000 || S.demo) return;
    var k = PS.today(); S.days[k] = Math.round(((S.days[k] || 0) + 0.25) * 100) / 100; save();
  }, 15000);
  function markDay() { if (S.demo) return; var k = PS.today(); if (!S.days[k]) { S.days[k] = 0.25; save(); } }

  /* =========================================================
     2. BẾN, VÒNG, MỞ KHÓA
     ========================================================= */
  function benDone(b) { return !!b && b.acts.length > 0 && b.acts.every(function (a) { return !!S.done[a]; }); }
  function portDone() { return !!S.done.x1; }
  function benOpen(b) {
    if (b === PORT) return true;
    if (!portDone() || !b.ready) return false;
    if (b.r === 1) return true;
    if (b.id === 'b3') return benDone(benOf('b1')) && benDone(benOf('b2'));
    if (b.id === 'b4') return benDone(benOf('b3'));
    if (b.r === 3) return benDone(benOf('b4'));
    if (b === GOAL_PORT) return allBen();
    return false;
  }
  function allBen() { return BEN.every(function (x) { return !!S.stamp[x.id]; }); }
  function finDone() { return !!S.fin; }
  function lockMsg(b) {
    if (!portDone()) return SHIN_TALK.lockP;
    if (!b.ready) return SHIN_TALK.soon;
    if (b.id === 'b3') return SHIN_TALK.lockR2;
    if (b.id === 'b4') return SHIN_TALK.lockR2b;
    if (b === GOAL_PORT) return SHIN_TALK.lockFin6;
    return SHIN_TALK.lockR3;
  }
  function actOpen(id) { var a = ACTS[id]; if (!a) return false; var b = benOf(a.st); if (!benOpen(b)) return false; return true; }
  function nextAct() {
    if (!S.done.x1) return 'x1';
    var cand = [];
    BEN.concat([GOAL_PORT]).forEach(function (b) { if (benOpen(b)) b.acts.forEach(function (a) { if (!S.done[a]) cand.push(a); }); });
    /* ưu tiên bến đang dở */
    for (var i = 0; i < cand.length; i++) { var b = benOf(ACTS[cand[i]].st); if (b.acts.some(function (a) { return !!S.done[a]; })) return cand[i]; }
    return cand[0] || null;
  }
  function benLabel(b) { return b === PORT ? 'Xuất phát' : (b === GOAL_PORT ? 'Đích' : 'Bến ' + b.id.slice(1)); }

  /* =========================================================
     3. GIAO DIỆN CHUNG
     ========================================================= */
  var APP = D.getElementById('app');
  var V = { v: 'home' }, nbOpen = false, NBTAB = 'cd', QUIET = false;
  function topnav() {
    return '<nav class="topnav" aria-label="Điều hướng"><div class="topnav__in"><span class="tn-sp"></span><div class="tn-pill">' +
      '<button type="button" class="tn-btn' + (V.v === 'home' ? ' on' : '') + '" data-act="home" aria-label="Hải đồ" title="Hải đồ">' + cdIc('map', 20) + '</button>' +
      '<button type="button" class="tn-btn" data-act="nb" aria-label="Sổ tay" title="Sổ tay">' + PS.icon('book', 20) + '</button></div></div></nav>';
  }
  function demoStrip() { return S.demo ? '<div class="demo-strip"><span>Bản demo giáo viên · học viên giả định</span><button type="button" data-act="demoExit">Thoát demo</button></div>' : ''; }
  function shinSays(mood, html, sz) { return '<div class="say">' + shin2(mood, sz || 64) + '<div class="say__b">' + html + '</div></div>'; }
  function hState(v, y) { return { cd2: 1, v: v.v, st: v.st || null, id: v.id || null, step: v.step || 0, y: y || 0 }; }
  function render(top) {
    try { if (!history.state || !history.state.cd2) history.replaceState(hState(V), ''); } catch (e) {}
    var h;
    if (V.v === 'intro') { APP.innerHTML = '<div class="wrap enter">' + viewIntro() + '</div>'; stagger(); return; }
    if (V.v === 'ben') h = viewBen(); else if (V.v === 'act') h = viewAct(); else if (V.v === 'isle') h = viewIsle(); else if (V.v === 'sp') h = viewSp(); else h = viewHome();
    APP.innerHTML = topnav() + '<div class="wrap' + (QUIET ? '' : ' enter') + (S.demo ? ' wrap--demo' : '') + '">' + h + '</div>' + demoStrip();
    stagger();
    if (top !== false) W.scrollTo(0, 0);
    if (V.v === 'act') afterStep();
  }
  function stagger() { var w = APP.querySelector('.enter'); if (!w) return; var c = w.children; for (var i = 0; i < c.length; i++) c[i].style.setProperty('--i', Math.min(i, 8)); }
  function go(v) {
    try { var same = v.v === V.v && v.st === V.st && v.id === V.id; if (V.v !== 'intro' && !same) { history.replaceState(hState(V, W.pageYOffset || 0), ''); history.pushState(hState(v), ''); } else history.replaceState(hState(v), ''); } catch (e) {}
    V = v; render(true);
  }
  W.addEventListener('popstate', function (e) {
    var keep = function () { try { history.pushState(hState(V), ''); } catch (er) {} };
    if (D.getElementById('cdov')) { closeOv(); keep(); return; }
    if (nbOpen) { closeNb(); keep(); return; }
    if (V.v === 'intro') return;
    var h = e.state;
    if (!h || !h.cd2) V = { v: 'home' };
    else if (h.v === 'act' && ACTS[h.id] && (actOpen(h.id) || S.done[h.id])) V = { v: 'act', id: h.id, step: Math.min(h.step || 0, ACTS[h.id].steps.length - 1) };
    else if (h.v === 'ben' && benOf(h.st)) V = { v: 'ben', st: h.st };
    else if (h.v === 'isle' && isleOf(h.id)) V = { v: 'isle', id: h.id };
    else if (h.v === 'sp' && spOf(h.id)) V = { v: 'sp', id: h.id };
    else V = { v: 'home' };
    QUIET = true; render(false); QUIET = false;
    W.scrollTo(0, h && h.y ? h.y : 0);
  });

  /* ---------- âm thanh nhỏ (tự soạn, theo công tắc chung) ---------- */
  var AC = null;
  function sfx(k) {
    if (!PS.soundOn()) return;
    try {
      AC = AC || new (W.AudioContext || W.webkitAudioContext)();
      var t = AC.currentTime, o = AC.createOscillator(), gn = AC.createGain();
      var f = { ting: [880, 1320, .25], flip: [520, 760, .18], horn: [196, 220, .6], stamp: [180, 120, .2], card: [660, 990, .22] }[k] || [600, 800, .2];
      o.type = k === 'horn' ? 'sawtooth' : 'sine'; o.frequency.setValueAtTime(f[0], t); o.frequency.exponentialRampToValueAtTime(f[1], t + f[2] * .8);
      gn.gain.setValueAtTime(.0001, t); gn.gain.exponentialRampToValueAtTime(k === 'horn' ? .05 : .12, t + .02); gn.gain.exponentialRampToValueAtTime(.0001, t + f[2]);
      o.connect(gn); gn.connect(AC.destination); o.start(t); o.stop(t + f[2] + .05);
    } catch (e) {}
  }

  /* =========================================================
     4. MÀN MỞ ĐẦU, HẢI ĐỒ
     ========================================================= */
  function viewIntro() {
    return '<div class="intro">' + '<div class="intro__sea">' + shipSVG(0, 'compass', '#0F9F98', 180) + '</div>' +
      '<span class="kicker">Career Design 02</span><h1 class="h1">Hải Đồ <em>La Bàn</em></h1>' +
      shinSays('welcome', T(SHIN_TALK.homeNew)) +
      '<p class="intro__sub">Sau 3 năm ở Nhật, mình sẽ đi đâu tiếp? Có rất nhiều hướng. Có những hướng bạn chưa từng nghe tới.</p>' +
      '<button type="button" class="btn btn--go btn--w" data-act="introGo">' + cdIc('anchor', 20) + 'Tới Cảng 3 Năm</button></div>';
  }
  function bookHTML(big) { /* Sổ Thuyền Trưởng */
    var p = prof(), f = flag(), created = new Date(S.created || Date.now());
    var stamps = [PORT].concat(BEN).map(function (b) { var on = !!S.stamp[b.id]; return '<i class="stp' + (on ? ' on' : '') + '" title="' + esc(b.n) + '">' + (on ? cdIc(b.ic, 15, 2.2) : '') + '</i>'; }).join('');
    return '<section class="logbook" aria-label="Sổ Thuyền Trưởng"><div class="logbook__top"><span>Sổ Thuyền Trưởng</span><span>CD02</span></div>' +
      '<div class="logbook__mid"><div class="logbook__flag">' + flagSVG(f.s, f.c, 76, 1) + '</div><div class="logbook__who">' +
      '<small>Thuyền trưởng</small><b>' + esc(p.name || '—') + '</b>' +
      '<div class="logbook__row"><span><small>Nghề</small><b>' + esc(jobName() === 'bạn chọn' ? 'Chưa chọn' : jobName()) + '</b></span><span><small>Cảng nhà</small><b>Cảng 3 Năm</b></span></div>' +
      (g('x1.motto') ? '<p class="logbook__motto">“' + esc(g('x1.motto')) + '”</p>' : '') + '</div></div>' +
      '<div class="logbook__stamps" aria-label="Con dấu bến ' + stampN() + '/7">' + stamps + '</div>' +
      '<div class="logbook__meta"><span>' + cdIc('compass', 14) + 'Sương đã tan <b>' + (100 - fogPct()) + '%</b></span><span>' + cdIc('card', 14) + 'Thẻ Senpai <b>' + cardN() + '/' + SENPAI.length + '</b></span>' +
      '<span class="pts">' + PS.icon('flame', 13) + (S.demo ? 5 : PS.streak()) + ' ' + PS.icon('star', 13) + xpTotal() + ' ' + PS.icon('bulb', 13) + insTotal() + '</span></div>' +
      (big ? '<p class="logbook__date">Nhận thuyền ' + esc(PS.fmtDate ? PS.fmtDate(created) : created.toLocaleDateString('vi-VN')) + '</p>' : '') + '</section>';
  }
  function mapSVG() {
    var h = '<svg class="chart" viewBox="0 0 360 460" role="img" aria-label="Hải đồ: Cảng 3 Năm ở giữa, 6 bến, 8 đảo">';
    h += '<rect x="2" y="2" width="356" height="456" rx="22" fill="#CFEDEA" stroke="#2A2118" stroke-width="2"/>';
    for (var i = 0; i < 9; i++) h += '<path d="M' + (20 + (i % 3) * 112) + ' ' + (40 + i * 46) + 'q14-6 28 0t28 0" stroke="#A9DCD7" stroke-width="2" fill="none" stroke-linecap="round"/>';
    h += roseArt(338, 132, 11) + seaFun();
    /* đường hải trình nét đứt: cảng → các bến */
    BEN.forEach(function (b) { h += '<path d="M' + PORT.x + ' ' + PORT.y + 'Q' + ((PORT.x + b.x) / 2 + (b.x < 180 ? -10 : 10)) + ' ' + ((PORT.y + b.y) / 2) + ' ' + b.x + ' ' + b.y + '" stroke="' + (benOpen(b) ? '#0B6F6A' : '#9BB9B6') + '" stroke-width="2" stroke-dasharray="5 6" fill="none"/>'; });
    /* đảo */
    ISLES.forEach(function (is) {
      var on = !!S.isl[is.id];
      h += '<g class="mp-isle" data-act="isle" data-id="' + is.id + '" role="button" aria-label="' + esc(is.n) + (on ? '' : ' (còn sương)') + '">' + isleArt(is, on) + (on ? '' : fogArt(is.x, is.y - 2, .95)) +
        '<text x="' + is.x + '" y="' + (is.y + 30) + '" text-anchor="middle" class="mp-t">' + esc(on ? is.n.replace('Đảo ', '') : '???') + '</text></g>';
    });
    /* cảng */
    h += '<g class="mp-ben" data-act="ben" data-st="p0"><ellipse cx="' + PORT.x + '" cy="' + PORT.y + '" rx="44" ry="25" fill="#F7EBC8" stroke="#2A2118" stroke-width="2"/>' +
      '<text x="' + PORT.x + '" y="' + (PORT.y - 2) + '" text-anchor="middle" class="mp-tb">Cảng 3 Năm</text><text x="' + PORT.x + '" y="' + (PORT.y + 13) + '" text-anchor="middle" class="mp-ts">' + (portDone() ? 'Đã nhổ neo' : 'Xuất phát') + '</text></g>';
    /* bến */
    BEN.forEach(function (b) {
      var op = benOpen(b), dn = benDone(b), w = 114;
      h += '<g class="mp-ben' + (op ? '' : ' lock') + (dn ? ' done' : '') + '" data-act="ben" data-st="' + b.id + '"><rect x="' + (b.x - w / 2) + '" y="' + (b.y - 16) + '" width="' + w + '" height="32" rx="16" fill="' + (dn ? '#0F9F98' : (op ? '#FFFFFF' : '#E6EFEE')) + '" stroke="#2A2118" stroke-width="1.8"/>' +
        '<g transform="translate(' + (b.x - w / 2 + 8) + ' ' + (b.y - 9) + ') scale(.75)" color="' + (dn ? '#fff' : (op ? '#0B6F6A' : '#8AA6A3')) + '"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + (op || dn ? CD2_IC[b.ic] : '<rect x="6" y="11" width="12" height="9" rx="2"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"/>') + '</g></g>' +
        '<text x="' + (b.x + 11) + '" y="' + (b.y + 4.5) + '" text-anchor="middle" class="mp-tn' + (dn ? ' w' : '') + '">' + esc(b.n) + '</text></g>';
    });
    /* thuyền ở bến đang học */
    var nx = nextAct(), at = nx ? benOf(ACTS[nx].st) : PORT; if (at === GOAL_PORT || at.x == null) at = PORT; var sx = at === PORT ? PORT.x + 52 : at.x, sy = at === PORT ? PORT.y - 28 : at.y - 36, f = flag();
    h += '<g class="mp-ship" transform="translate(' + (sx - 22) + ' ' + (sy - 18) + ')">' + shipSVG(shipLv(), f.s, f.c, 44).replace('<svg class="ship"', '<svg class="ship" x="0" y="0" height="36"') + '</g>';
    return h + '</svg>';
  }
  function trialLive() { var st = g('b53.start'); if (!st) return false; var p = st.split('-'), d0 = new Date(+p[0], +p[1] - 1, +p[2]); return Date.now() - d0.getTime() < 16 * 864e5; }
  function bottleQ() { var L = SENPAI.filter(function (s) { return !!s.q; }), k = Math.floor(Date.now() / 864e5) % L.length; return L[k]; }
  function viewHome() {
    var nx = nextAct(), hi;
    if (!portDone()) hi = SHIN_TALK.homeNew; else if (nx) hi = SHIN_TALK.home[new Date().getDate() % SHIN_TALK.home.length]; else hi = finDone() ? SHIN_TALK.homeFin : SHIN_TALK.homeWait;
    var cta = nx ? '<button type="button" class="btn btn--go btn--w glow" data-act="open" data-id="' + nx + '">' + (doneMain() ? 'Đi tiếp: ' : 'Bắt đầu: ') + esc(ACTS[nx].t) + '</button>' : (finDone() ? '<button type="button" class="btn btn--go btn--w" data-act="certOv">' + cdIc('flag', 20) + 'Xem Bằng Thuyền Trưởng</button>' : '');
    if (trialTxt() && S.done.b53 && trialLive()) cta += '<div class="hometrial">' + trialCard() + '</div>';
    var bq = bottleQ(), ownIs = portDone();
    return '<button type="button" class="pshome" data-act="psHome">' + cdIc('arrowL', 15, 2.4) + 'Proskills</button>' +
      shinSays(nx ? 'hi' : 'cheer', T(hi)) + bookHTML() + '<div class="cta">' + cta + '</div>' +
      '<h2 class="sec-h">Hải đồ La Bàn</h2><p class="sec-sub">' + (ownIs ? 'Chạm bến để học · chạm đảo để ghé thăm' : 'Nhận thuyền ở Cảng 3 Năm để ra khơi') + '</p>' +
      '<div class="chartbox">' + mapSVG() + '<div class="fogbar"><span>' + esc(SHIN_TALK.fogT) + ' <b>' + (100 - fogPct()) + '%</b> · ' + fogOpen() + '/8 đảo</span><i><b style="width:' + (100 - fogPct()) + '%"></b></i></div></div>' +
      [1, 2, 3].map(function (r) {
        return '<h3 class="rnd">' + esc(ROUNDS[r]) + '</h3><div class="bens">' + BEN.filter(function (b) { return b.r === r; }).map(benCard).join('') + '</div>';
      }).join('') +
      '<div class="bens">' + benCard(GOAL_PORT) + '</div>' +
      (bq ? '<button type="button" class="bottle" data-act="sp" data-id="' + bq.id + '"><span class="bottle__ic">' + cdIc('bottle', 22) + '</span><span><small>' + esc(SHIN_TALK.bottle) + '</small><q>' + esc(bq.q) + '</q><b>' + esc(bq.n) + (bq.jl ? ' · ' + esc(bq.jl) : '') + '</b></span></button>' : '') +
      '<p class="foot">Proskills · Career Design 02 · Hải Đồ La Bàn · ' + esc(CD2_VER) + '<br>Bài làm tự lưu trên trình duyệt của máy này</p>';
  }
  function benCard(b) {
    var isG = b === GOAL_PORT, op = benOpen(b), dn = isG ? finDone() : benDone(b), nd = b.acts.filter(function (a) { return !!S.done[a]; }).length;
    var badge = dn ? '<span class="badge badge--ok">' + (isG ? 'Đã nhận bằng' : 'Đã có dấu') + '</span>' : (op ? (nd ? '<span class="badge">' + nd + '/' + b.acts.length + ' chặng</span>' : '<span class="badge">Mở</span>') : '<span class="badge badge--soon">' + (b.ready ? 'Chưa mở' : 'Sắp mở') + '</span>');
    var tag = op || dn ? 'button type="button" data-act="ben" data-st="' + b.id + '"' : 'button type="button" data-act="lockMsg" data-st="' + b.id + '"';
    if (isG && !op && !dn) tag = 'button type="button" data-act="lockMsg" data-st="fin"';
    return '<' + tag + ' class="bcard' + (op ? '' : ' bcard--lock') + (dn ? ' bcard--done' : '') + '"><span class="bcard__ic">' + (op || dn ? cdIc(b.ic, 22) : PS.icon('lock', 20)) + '</span><span><b>' + esc(b.n) + '</b><small>' + esc(b.sub) + '</small></span>' + badge + '</button>';
  }

  /* ---------- trang bến ---------- */
  function viewBen() {
    var b = benOf(V.st), first = !S.seen[b.id];
    if (first) { S.seen[b.id] = 1; V.showIntro = 1; save(); }
    var nd = b.acts.filter(function (a) { return !!S.done[a]; }).length;
    var h = '<button type="button" class="back" data-act="home">' + cdIc('arrowL', 18, 2.4) + 'Hải đồ</button>' +
      '<section class="banner"><div class="banner__top"><span class="banner__ic">' + cdIc(b.ic, 30) + '</span><div><div class="banner__lab">' + esc(benLabel(b).toUpperCase()) + (b.r ? ' · ' + esc(ROUNDS[b.r].split(' · ')[0]) : '') + '</div><h1>' + esc(b.n) + '</h1>' + (b.sub ? '<p>' + esc(b.sub) + '</p>' : '') + '</div></div>' +
      '<div class="banner__bar"><i style="width:' + Math.round(nd / b.acts.length * 100) + '%"></i></div><div class="banner__meta"><span>' + nd + '/' + b.acts.length + ' chặng xong</span><span>' + b.acts.reduce(function (t, a) { return t + ACTS[a].mins; }, 0) + ' phút</span></div></section>';
    h += (first || V.showIntro) ? shinSays('hi', T(b.intro)) : '<button type="button" class="shinmini" data-act="showIntro">' + shin2('hi', 34) + '<span><b>Thuyền trưởng Shin</b> · Xem lời Shin</span></button>';
    h += '<div class="acts">' + b.acts.map(function (id, i) {
      var a = ACTS[id], dn = !!S.done[id], nx = !dn && nextAct() === id;
      return '<button type="button" class="act' + (nx ? ' act--next' : '') + (dn ? ' act--done' : '') + '" data-act="open" data-id="' + id + '"><span class="act__n">' + (dn ? PS.icon('check', 20, 3) : (i + 1)) + '</span><span><b>' + (b === PORT ? '' : 'Chặng ' + (i + 1) + ' · ') + esc(a.t) + '</b><small>' + esc(a.d) + '</small>' +
        '<span class="act__meta">' + PS.icon('clock', 13) + a.mins + ' phút' + (nx ? '<span class="chip-go">Tiếp theo ' + PS.icon('next', 13, 2.6) + '</span>' : (dn ? '<span class="badge badge--ok">Xong</span>' : '')) + '</span></span></button>';
    }).join('') + '</div>';
    if (b === GOAL_PORT) return h + '<button type="button" class="stampbox' + (finDone() ? ' on' : '') + '" data-act="' + (finDone() ? 'certOv' : 'noop') + '"><span class="stampbox__ic">' + (finDone() ? stampHTML(b) : PS.icon('lock', 22)) + '</span><span><b>Bằng Thuyền Trưởng</b><small>' + (finDone() ? 'Chạm để xem bằng' : 'Xong 2 chặng để nhận bằng') + '</small></span></button>';
    var dnB = b === PORT ? portDone() : benDone(b);
    h += '<div class="stampbox' + (dnB ? ' on' : '') + '"><span class="stampbox__ic">' + (dnB ? stampHTML(b) : PS.icon('lock', 22)) + '</span><span><b>' + esc(SHIN_TALK.stampT) + ' · ' + esc(b.n) + '</b><small>' + (dnB ? 'Đã đóng vào Sổ Thuyền Trưởng' : 'Xong ' + b.acts.length + ' chặng để nhận dấu') + '</small></span></div>';
    return h;
  }
  function stampHTML(b) {
    return '<svg viewBox="0 0 60 60" width="52" height="52" aria-hidden="true"><circle cx="30" cy="30" r="26" fill="none" stroke="#0F9F98" stroke-width="3"/><circle cx="30" cy="30" r="20" fill="none" stroke="#0F9F98" stroke-width="1.4" stroke-dasharray="2 3"/>' +
      '<g transform="translate(18 18)" color="#0F9F98"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + CD2_IC[b.ic] + '</g></g></svg>';
  }

  /* ---------- trang đảo, thẻ Senpai ---------- */
  function revealIsle(id, quiet) { if (!id || S.isl[id] || !portDone()) return false; S.isl[id] = Date.now(); save(); if (!quiet) PS.toast(cdIc('compass', 16) + ' Sương tan! <b>' + esc(isleOf(id).n) + '</b> hiện ra trên hải đồ.'); return true; }
  function collect(id, quiet) {
    if (!id || S.cards[id]) return false;
    S.cards[id] = Date.now(); S.xp['card.' + id] = CD2_XP_CARD; save(); sfx('card');
    var sp = spOf(id); if (sp) revealIsle(sp.isl, true);
    if (!quiet) PS.toast(cdIc('card', 16) + ' <b>' + esc(SHIN_TALK.cardNew) + '</b> · ' + esc(sp.n) + ' · +' + CD2_XP_CARD + ' XP');
    return true;
  }
  function viewIsle() {
    var is = isleOf(V.id);
    if (portDone()) revealIsle(is.id, true);
    var h = '<button type="button" class="back" data-act="home">' + cdIc('arrowL', 18, 2.4) + 'Hải đồ</button>' +
      '<section class="banner banner--isle"><div class="banner__top"><span class="banner__ic">' + cdIc(is.ic, 30) + '</span><div><div class="banner__lab">' + esc(ISLE_SIDE[is.side].toUpperCase()) + '</div><h1>' + esc(is.n) + '</h1><p>' + esc(is.sub) + '</p></div></div></section>';
    if (!portDone()) h += shinSays('wink', 'Nhận thuyền ở Cảng 3 Năm trước, rồi mình ghé đảo này nhé!');
    h += isleInfo(is);
    h += '<h2 class="sec-h">Thuyền trưởng đã cập đảo này</h2><p class="sec-sub">Chạm thẻ để đọc chuyện và cất thẻ vào Sổ tay</p><div class="spgrid">' + is.who.map(function (id) { return spCard(spOf(id)); }).join('') + '</div>';
    if (is.who.length < 3) h += '<p class="ps-small note">Đảo này còn ít chuyện công khai. Bạn biết anh chị nào đi hướng này? Kể thầy cô nghe nhé.</p>';
    return h;
  }
  function isleInfo(is) {
    return '<div class="isinfo"><p>' + esc(is.what) + '</p><div class="isinfo__g"><div><b>' + cdIc('tool', 16) + 'Cần gì</b><ul>' + is.need.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
      '<div><b>' + PS.icon('star', 16) + 'Được gì</b><p>' + esc(is.gain) + '</p></div><div><b>' + cdIc('wave', 16) + 'Đánh đổi</b><p>' + esc(is.cost) + '</p></div></div></div>';
  }
  function spCard(sp, sel) {
    var got = !!S.cards[sp.id];
    return '<button type="button" class="spc' + (got ? ' got' : '') + (sel ? ' on' : '') + '" data-act="sp" data-id="' + sp.id + '"><span class="spc__av">' + esc(initials(sp.n)) + '</span><span class="spc__b"><b>' + esc(sp.n) + '</b>' +
      '<small>' + esc(sp.job) + (sp.jl ? ' · ' + esc(sp.jl) : '') + '</small><em>' + esc(sp.tag) + '</em></span>' + (got ? '<span class="spc__ok">' + PS.icon('check', 14, 3) + '</span>' : '') + '</button>';
  }
  function initials(n) { var p = n.split(' '); return (p[p.length - 2] ? p[p.length - 2].charAt(0) : '') + p[p.length - 1].charAt(0); }
  function spBody(sp) {
    var is = isleOf(sp.isl);
    return '<div class="sp"><div class="sp__top"><span class="spc__av spc__av--big">' + esc(initials(sp.n)) + '</span><div><b>' + esc(sp.n) + '</b><small>' + esc([sp.job, sp.jl, sp.jp].filter(Boolean).join(' · ')) + '</small>' +
      '<button type="button" class="islechip" data-act="isle" data-id="' + is.id + '">' + cdIc(is.ic, 14) + esc(is.n) + '</button></div></div>' +
      '<ol class="frames"><li><small>Khởi đầu</small>' + esc(sp.kd) + '</li><li><small>Bước ngoặt</small>' + esc(sp.bn) + '</li><li><small>Hôm nay</small>' + esc(sp.nay) + '</li></ol>' +
      (sp.q ? '<blockquote class="quote">“' + esc(sp.q) + '”<cite>' + esc(sp.n) + '</cite></blockquote>' : '') +
      '<a class="srclink" href="' + esc(sp.url) + '" target="_blank" rel="noopener">' + cdIc('link', 15) + 'Đọc bài gốc trên ' + esc(sp.src) + '</a>' +
      '<p class="ps-small">Ba khung trên là khóa học tóm tắt từ bài đã đăng công khai. Câu trong ngoặc kép là nguyên văn.</p></div>';
  }
  function viewSp() {
    var sp = spOf(V.id); collect(sp.id);
    return '<button type="button" class="back" data-act="' + (V.from ? 'isle' : 'home') + '"' + (V.from ? ' data-id="' + V.from + '"' : '') + '>' + cdIc('arrowL', 18, 2.4) + (V.from ? esc(isleOf(V.from).n) : 'Hải đồ') + '</button>' + spBody(sp);
  }

  /* =========================================================
     5. TRANG CHẶNG VÀ CÁC DẠNG BƯỚC
     ========================================================= */
  function viewAct() {
    var id = V.id, a = ACTS[id], steps = a.steps, i = V.step, s = steps[i], last = i === steps.length - 1;
    var miss = check(s), b = benOf(a.st);
    var h = '<button type="button" class="back" data-act="ben" data-st="' + a.st + '">' + cdIc('arrowL', 18, 2.4) + esc(b.n) + '</button>' +
      '<header class="ah"><div class="ah__lab">' + esc(benLabel(b)) + ' · ' + esc(b.n) + '</div><h1>' + esc(a.t) + '</h1><div class="stepbar" aria-label="Bước ' + (i + 1) + '/' + steps.length + '">' +
      steps.map(function (x, j) { return '<i class="' + (j < i ? 'on' : (j === i ? 'cur' : '')) + '"></i>'; }).join('') + '</div></header>';
    if (S.done[id] && i === 0) h += '<div class="redo">' + PS.icon('check', 16, 3) + esc(SHIN_TALK.redo) + '</div>';
    h += '<div id="stepBody">' + (STEP[s.k] ? STEP[s.k](s, id) : '') + '</div>';
    h += '<div class="sbar"><button type="button" class="sbar__st' + (miss ? ' miss' : '') + '" id="sbarSt">' + (miss ? esc(miss) : 'Sẵn sàng!') + '</button>' +
      '<button type="button" class="btn" id="sbarGo" data-act="' + (last ? 'finish' : 'next') + '"' + (miss ? ' disabled' : '') + '>' + (last ? esc(a.btn || 'Đóng dấu chặng') : 'Tiếp tục') + '</button></div>';
    if (i > 0) h += '<p class="prevlink"><button type="button" class="link" data-act="prev">Xem lại bước trước</button></p>';
    return h;
  }
  function check(s) { return CHECK[s.k] ? CHECK[s.k](s) : ''; }
  function refreshBar() {
    var s = ACTS[V.id].steps[V.step], miss = check(s), st = D.getElementById('sbarSt'), gb = D.getElementById('sbarGo');
    if (!st || !gb) return;
    st.className = 'sbar__st' + (miss ? ' miss' : ''); st.textContent = miss || 'Sẵn sàng!'; gb.disabled = !!miss;
  }
  function redrawStep() { var b = D.getElementById('stepBody'); if (!b) return; var s = ACTS[V.id].steps[V.step]; b.innerHTML = STEP[s.k](s, V.id); refreshBar(); afterStep(); }
  function afterStep() { /* thanh trượt: cập nhật la bàn ngay khi kéo */
    var sl = APP.querySelectorAll('input[type=range][data-pair]');
    for (var i = 0; i < sl.length; i++) sl[i].addEventListener('input', onSlide);
    var sel = D.getElementById('repT');
    if (sel) sel.addEventListener('change', function () { if (sel.value) { PS.setProfile({ teacher: sel.value }); redrawStep(); } });
  }
  function words(t) { t = trim(t); return t ? t.split(/\s+/).length : 0; }
  function insOf(key) { return words(g(key)) >= CD2_INS_WORDS ? CD2_INS_FIELD : 0; }
  function tipsHTML(key, tips) {
    if (!tips || !tips.length) return '';
    return '<div class="tips"><small>Chạm để dùng gợi ý, rồi sửa theo ý bạn</small>' + tips.map(function (t) { return '<button type="button" class="tip" data-act="tip" data-k="' + esc(key) + '" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>';
  }
  function areaHTML(key, ph, rows, max) {
    var v = g(key) || '';
    return '<textarea class="ta ps-sel" data-k="' + esc(key) + '" rows="' + (rows || 3) + '" maxlength="' + (max || 400) + '" placeholder="' + esc(ph || '') + '">' + esc(v) + '</textarea>' +
      '<div class="insline" data-ins="' + esc(key) + '">' + (insOf(key) ? PS.icon('bulb', 14) + ' Viết thật, đủ ý: +' + CD2_INS_FIELD + ' Insight' : PS.icon('bulb', 14) + ' Viết từ ' + CD2_INS_WORDS + ' chữ để có Insight') + '</div>';
  }
  function opt(key, v, t, on, act) { return '<button type="button" class="opt' + (on ? ' on' : '') + '" data-act="' + (act || 'pick') + '" data-k="' + esc(key) + '" data-v="' + esc(v) + '" aria-pressed="' + on + '"><span class="dot">' + (on ? PS.icon('check', 13, 3.2) : '') + '</span><span>' + esc(t) + '</span></button>'; }
  function qh(t, sub) { return '<h2 class="q">' + T(esc(t)) + '</h2>' + (sub ? '<p class="qsub">' + T(esc(sub)) + '</p>' : ''); }

  var STEP = {}, CHECK = {};
  STEP.say = function (s) { return shinSays(s.mood || 'hi', '<p>' + Q(s.t) + '</p>' + (s.t2 ? '<p>' + Q(s.t2) + '</p>' : ''), 76); };
  STEP.write = function (s) { return qh(s.q, s.sub) + areaHTML(s.key, s.ph, 3) + tipsHTML(s.key, s.tips); };
  CHECK.write = function (s) { return trim(g(s.key)).length >= (s.min || 6) ? '' : 'Viết vài chữ nhé'; };

  /* ----- Xuất phát ----- */
  STEP.from = function () {
    var c = cd1(), h = '';
    if (hasCd1()) {
      h += shinSays('moved', '<p>Shin còn giữ bài bạn làm ở CD01 đây.</p>', 64) + '<div class="from">' +
        (c.mainName ? '<div><small>Nghề chính bạn chọn</small><b>' + esc(c.mainName) + '</b></div>' : '') +
        (c.far ? '<div><small>Hướng 5 năm bạn tò mò</small><b>' + esc(c.far) + '</b></div>' : '') +
        (c.letter ? '<div><small>Thư gửi mình 5 năm sau</small><q>' + esc(String(c.letter).slice(0, 160)) + (String(c.letter).length > 160 ? '…' : '') + '</q></div>' : '') + '</div>' +
        '<p class="qsub">CD01 là 3 năm đầu. CD02 nhìn xa hơn: sau 3 năm đó, còn những hướng nào?</p>';
      if (!jobKey() || g('x1.job')) h += jobPick();
      else h += '<button type="button" class="link" data-act="pick" data-k="x1.job" data-v="' + esc(jobKey()) + '">Đổi nghề khác</button>';
    } else {
      h += shinSays('hi', '<p>Bạn chưa học CD01 cũng không sao. Cho Shin biết nghề bạn định làm ở Nhật nhé.</p>', 64) + jobPick();
    }
    return h;
  };
  function jobPick() {
    var v = g('x1.job') || '';
    return qh('Nghề bạn định làm ở Nhật') + '<div class="chips">' + INDS2.map(function (x) { return '<button type="button" class="chip' + (v === x[0] ? ' on' : '') + '" data-act="pick" data-k="x1.job" data-v="' + x[0] + '">' + esc(x[1]) + '</button>'; }).join('') +
      '<button type="button" class="chip' + (v === 'u' ? ' on' : '') + '" data-act="pick" data-k="x1.job" data-v="u">Chưa biết</button></div>';
  }
  CHECK.from = function () { return jobKey() || g('x1.job') === 'u' ? '' : 'Chọn nghề của bạn'; };
  STEP.flag = function (s) {
    var f = g('x1.flag') || {};
    return qh(s.q) + '<div class="flagbox">' + flagMast(f.s || 'compass', f.c || '#0F9F98') + '</div>' +
      '<h3 class="qs">Biểu tượng</h3><div class="symgrid">' + FLAG_SYM.map(function (x) { return '<button type="button" class="sym' + (f.s === x[0] ? ' on' : '') + '" data-act="flagSym" data-v="' + x[0] + '" aria-label="' + esc(x[1]) + '"><svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">' + flagSym(x[0], '#174A63') + '</svg><small>' + esc(x[1]) + '</small></button>'; }).join('') + '</div>' +
      '<h3 class="qs">Màu cờ</h3><div class="colrow">' + FLAG_COL.map(function (x) { return '<button type="button" class="col' + (f.c === x[0] ? ' on' : '') + '" data-act="flagCol" data-v="' + x[0] + '" style="background:' + x[0] + '" aria-label="' + esc(x[1]) + '"></button>'; }).join('') + '</div>' +
      '<h3 class="qs">Khẩu hiệu của thủy thủ đoàn</h3><input class="inp ps-sel" data-k="x1.motto" maxlength="40" value="' + esc(g('x1.motto') || '') + '" placeholder="Ví dụ: Đi chậm mà chắc">' + tipsHTML('x1.motto', MOTTO_TIPS);
  };
  CHECK.flag = function () { var f = g('x1.flag') || {}; if (!f.s) return 'Chọn biểu tượng'; if (!f.c) return 'Chọn màu cờ'; return trim(g('x1.motto')).length >= 3 ? '' : 'Viết khẩu hiệu'; };
  STEP.open1 = function (s) {
    var n = g('x1.n') || '', su = g('x1.sure') == null ? 5 : +g('x1.sure');
    return qh(s.q) + '<div class="chips">' + OPEN_N.map(function (x) { return '<button type="button" class="chip' + (n === x[0] ? ' on' : '') + '" data-act="pick" data-k="x1.n" data-v="' + x[0] + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>' +
      qh(s.q2) + '<div class="slide1"><input type="range" min="0" max="10" step="1" value="' + su + '" data-k="x1.sure" aria-label="Rõ mấy phần"><div class="slide1__l"><span>Chưa rõ gì</span><b id="sureOut">' + su + '/10</b><span>Rất rõ</span></div></div>' +
      qh(s.q3) + areaHTML('x1.now', s.ph, 2) + '<p class="ps-small">Cuối khóa Shin hỏi lại 2 câu này. Rõ hơn hay bớt chắc đều tốt: nghĩa là bạn đã nghĩ kỹ hơn.</p>';
  };
  CHECK.open1 = function () { if (!g('x1.n')) return 'Chọn số hướng'; return trim(g('x1.now')).length >= 3 ? '' : 'Viết điều bạn nghĩ'; };
  STEP.card = function (s) { return shinSays('proud', '<p>' + Q(s.t) + '</p>', 64) + bookHTML(1) + '<div class="shipwrap">' + shipSVG(0, flag().s, flag().c, 200) + '<p class="ps-small">Thuyền của bạn sẽ lớn dần qua từng bến: thêm buồm, bánh lái, đèn.</p></div>'; };

  /* ----- Bến 1 ----- */
  function shuffled(a, seed) { var r = a.slice(), x = seed || 7; for (var i = r.length - 1; i > 0; i--) { x = (x * 9301 + 49297) % 233280; var j = Math.floor(x / 233280 * (i + 1)); var t = r[i]; r[i] = r[j]; r[j] = t; } return r; }
  STEP.flip = function () {
    var G = g('b11.g') || {};
    return '<div class="flips">' + FLIP.map(function (id, k) {
      var sp = spOf(id), gv = G[id], is = isleOf(sp.isl);
      if (!gv) return '<div class="flip"><div class="flip__front"><span class="spc__av">' + esc(initials(sp.n)) + '</span><div><b>' + esc(sp.n) + '</b><small>' + esc([sp.job, sp.jl].filter(Boolean).join(' · ')) + '</small></div></div>' +
        '<p class="flip__kd">' + esc(sp.kd) + '</p><p class="flip__q">Sau 3 năm, ' + esc(sp.a.toLowerCase()) + ' đi tới đảo nào?</p><div class="flip__opts">' +
        shuffled(FLIP_OPTS[id], k + 3).map(function (iid) { var x = isleOf(iid); return '<button type="button" class="isbtn" data-act="flipGuess" data-id="' + id + '" data-v="' + iid + '">' + cdIc(x.ic, 16) + esc(x.n.replace('Đảo ', '')) + '</button>'; }).join('') + '</div></div>';
      var hit = gv === sp.isl;
      return '<div class="flip flip--open"><div class="flip__front"><span class="spc__av">' + esc(initials(sp.n)) + '</span><div><b>' + esc(sp.n) + '</b><small>' + esc([sp.job, sp.jl].filter(Boolean).join(' · ')) + '</small></div></div>' +
        '<div class="flip__res"><span class="tagres' + (hit ? ' hit' : '') + '">' + (hit ? 'Bạn đoán trúng!' : 'Bất ngờ chưa?') + '</span><small>Bạn đoán: ' + esc(isleOf(gv).n) + '</small></div>' +
        '<p class="flip__isle">' + cdIc(is.ic, 16) + '<b>' + esc(is.n) + '</b></p><p class="flip__nay">' + esc(sp.nay) + '</p>' + (sp.q ? '<q class="flip__qt">' + esc(sp.q) + '</q>' : '') +
        '<button type="button" class="link" data-act="sp" data-id="' + sp.id + '">Đọc trọn chuyện</button></div>';
    }).join('') + '</div>';
  };
  CHECK.flip = function () { var G = g('b11.g') || {}, n = 0; FLIP.forEach(function (id) { if (G[id]) n++; }); return n >= FLIP.length ? '' : 'Lật đủ ' + FLIP.length + ' thẻ (' + n + '/' + FLIP.length + ')'; };
  STEP.flipsum = function () {
    var G = g('b11.g') || {}, hit = 0; FLIP.forEach(function (id) { if (G[id] === spOf(id).isl) hit++; });
    var sur = FLIP.length - hit;
    return shinSays(sur >= 3 ? 'wow' : 'cheer', '<p>Bạn đoán trúng <b>' + hit + '/' + FLIP.length + '</b>. Có <b>' + sur + '</b> hải trình làm bạn bất ngờ.</p><p>' + (sur >= 3 ? 'Nghĩa là ngoài kia còn nhiều hướng bạn chưa biết. Tốt quá, mình đi khám phá tiếp!' : 'Bạn nhìn xa ghê. Còn nhiều đảo nữa, đi tiếp để xem kỹ hơn nhé!') + '</p>', 76) +
      '<div class="fogmini"><b>' + (100 - fogPct()) + '%</b><span>sương đã tan · ' + fogOpen() + '/8 đảo hiện ra</span></div>' +
      '<p class="ps-small">Thẻ Senpai đã cất vào Sổ tay › Hải trình.</p>';
  };
  STEP.isles = function () {
    var tg = g('b12.t') || {}, op = V.isOpen || '';
    return '<div class="isles">' + ISLES.map(function (is) {
      var t = tg[is.id], open = op === is.id, lab = ''; TAG3.forEach(function (x) { if (x[0] === t) lab = x[1]; });
      return '<div class="isl' + (open ? ' open' : '') + (t ? ' tagged' : '') + '"><button type="button" class="isl__h" data-act="isOpen" data-id="' + is.id + '" aria-expanded="' + open + '"><span class="isl__ic">' + cdIc(is.ic, 20) + '</span><span><b>' + esc(is.n) + '</b><small>' + esc(is.sub) + '</small></span>' +
        (t ? '<span class="badge badge--ok">' + esc(lab) + '</span>' : '<span class="badge">Chạm xem</span>') + '</button>' +
        (open ? '<div class="isl__b"><small class="side">' + esc(ISLE_SIDE[is.side]) + '</small>' + isleInfo(is) + '<p class="who"><small>Đã có người đi:</small> ' + is.who.map(function (id) { var sp = spOf(id); return '<button type="button" class="whochip" data-act="sp" data-id="' + id + '">' + esc(sp.a) + '</button>'; }).join('') + '</p>' +
          '<p class="qs">Bạn thấy đảo này…</p><div class="tag3">' + TAG3.map(function (x) { return '<button type="button" class="tag' + (t === x[0] ? ' on' : '') + '" data-act="isTag" data-id="' + is.id + '" data-v="' + x[0] + '">' + PS.icon(x[2], 15) + esc(x[1]) + '</button>'; }).join('') + '</div></div>' : '') + '</div>';
    }).join('') + '</div>';
  };
  CHECK.isles = function () { var tg = g('b12.t') || {}, n = 0; ISLES.forEach(function (is) { if (tg[is.id]) n++; }); return n >= ISLES.length ? '' : 'Gắn nhãn đủ 8 đảo (' + n + '/8)'; };
  STEP.pickisle = function (s) {
    var tg = g('b12.t') || {}, v = g(s.key);
    var L = ISLES.slice().sort(function (a, b) { var r = { cur: 0, 'new': 1, no: 2 }; return (r[tg[a.id]] == null ? 3 : r[tg[a.id]]) - (r[tg[b.id]] == null ? 3 : r[tg[b.id]]); });
    return qh(s.q, s.sub) + '<div class="opts">' + L.map(function (is) { var lab = ''; TAG3.forEach(function (x) { if (x[0] === tg[is.id]) lab = ' · ' + x[1]; }); return opt(s.key, is.id, is.n + lab, v === is.id); }).join('') + '</div>';
  };
  CHECK.pickisle = function (s) { return g(s.key) ? '' : 'Chọn một đảo'; };

  /* ----- Bến 2 ----- */
  function bookList(same) {
    var jk = jobKey(), mine = g('b21.b1'), cur = g('b13.isl');
    var L = SENPAI.filter(function (sp) { return same ? (jk && sp.ind === jk) : (!jk || sp.ind !== jk) && sp.id !== mine; });
    if (same && !L.length) return null;
    if (!same && cur) L.sort(function (a, b) { return (a.isl === cur ? 0 : 1) - (b.isl === cur ? 0 : 1); });
    return L;
  }
  STEP.book = function (s) {
    var key = 'b21.b' + s.n, fk = 'b21.fr' + s.n, v = g(key), L = bookList(!!s.same), h = qh(s.q);
    if (s.same && !L) { L = SENPAI.filter(function (sp) { return sp.id !== g('b21.b2'); }); h += '<p class="qsub">Khóa chưa có chuyện cùng nghề ' + esc(jobName()) + '. Bạn chọn người bạn thấy gần mình nhé.</p>'; }
    else if (!s.same && g('b13.isl')) h += '<p class="qsub">Gợi ý: người đi tới ' + esc(isleOf(g('b13.isl')).n) + ' đứng đầu danh sách.</p>';
    if (!v) return h + '<div class="spgrid">' + L.slice(0, 8).map(function (sp) { return '<button type="button" class="spc" data-act="book" data-k="' + key + '" data-v="' + sp.id + '"><span class="spc__av">' + esc(initials(sp.n)) + '</span><span class="spc__b"><b>' + esc(sp.n) + '</b><small>' + esc(sp.job) + (sp.jl ? ' · ' + esc(sp.jl) : '') + '</small><em>' + esc(sp.tag) + '</em></span></button>'; }).join('') + '</div>';
    var sp = spOf(v), fr = g(fk);
    return h + spBody(sp) + '<h3 class="qs">Khung nào chạm bạn nhất?</h3><div class="chips">' + [['kd', 'Khởi đầu'], ['bn', 'Bước ngoặt'], ['nay', 'Hôm nay']].map(function (x) { return '<button type="button" class="chip' + (fr === x[0] ? ' on' : '') + '" data-act="pick" data-k="' + fk + '" data-v="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div>' +
      '<button type="button" class="link" data-act="bookRe" data-k="' + key + '">Mượn cuốn khác</button>';
  };
  CHECK.book = function (s) { if (!g('b21.b' + s.n)) return 'Chọn một cuốn sách'; return g('b21.fr' + s.n) ? '' : 'Chọn khung chạm bạn'; };
  function fCount(fid) { var n = 0; SENPAI.forEach(function (sp) { if (sp.f.indexOf(fid) > -1) n++; }); return n; }
  STEP.common = function () {
    var G = g('b22.g') || {}, rev = !!g('b22.rev'), all = true;
    var h = '<p class="qsub">Bạn đoán: điều này có ở <b>nhiều</b> anh chị, hay chỉ <b>ít</b> người?</p><div class="cmn">' + CD2_F.map(function (f) {
      var v = G[f[0]]; if (!v) all = false;
      var n = fCount(f[0]), pct = Math.round(n / SENPAI.length * 100);
      return '<div class="cmn__r"><b>' + esc(f[1]) + '</b><div class="seg2"><button type="button" class="' + (v === 'm' ? 'on' : '') + '" data-act="cmn" data-id="' + f[0] + '" data-v="m">Nhiều người</button><button type="button" class="' + (v === 'f' ? 'on' : '') + '" data-act="cmn" data-id="' + f[0] + '" data-v="f">Ít người</button></div>' +
        (rev ? '<div class="bar"><i style="width:' + pct + '%"></i><span>' + n + '/' + SENPAI.length + ' người</span></div>' : '') + '</div>';
    }).join('') + '</div>';
    if (!rev) h += '<button type="button" class="btn btn--soft btn--w" data-act="cmnRev"' + (all ? '' : ' disabled') + '>' + (all ? 'Xem Shin đếm' : 'Đoán đủ 8 dòng để xem Shin đếm') + '</button>';
    else h += shinSays('think', '<p>Shin đếm từ ' + SENPAI.length + ' chuyện trong khóa. Gần như ai cũng <b>giỏi tiếng Nhật</b>. Nhiều người <b>từng đổi hướng</b>. Còn <b>có sẵn nhiều tiền</b> thì Shin không thấy ai kể.</p>', 60) + '<p class="ps-small">Shin đếm theo điều mỗi bài viết có kể. Bài không kể không có nghĩa là người đó không có.</p>';
    return h;
  };
  CHECK.common = function () { return g('b22.rev') ? '' : 'Đoán xong rồi bấm Xem Shin đếm'; };
  STEP.base = function () {
    var v = g('b22.base'), a = g('b22.act'), bs = null; BASE5.forEach(function (b) { if (b.id === v) bs = b; });
    var h = '<div class="aha"><span>' + cdIc('anchor', 26) + '</span><div><b>Mọi hải trình đều xuất phát từ Cảng 3 Năm</b><p>8 hướng khác nhau, nhưng ai cũng xây cùng một nền trong 3 năm đầu.</p></div></div>' +
      qh('Nền nào bạn muốn bắt đầu xây ngay ở JPC?') + '<div class="base5">' + BASE5.map(function (b) { return '<button type="button" class="b5' + (v === b.id ? ' on' : '') + '" data-act="pick" data-k="b22.base" data-v="' + b.id + '"><span>' + cdIc(b.ic, 22) + '</span><b>' + esc(b.n) + '</b><small>' + esc(b.d) + '</small></button>'; }).join('') + '</div>';
    if (bs) {
      h += qh('Một việc nhỏ bạn làm từ tuần này') + '<div class="chips">' + bs.act.map(function (t) { return '<button type="button" class="chip' + (a === t ? ' on' : '') + '" data-act="pick" data-k="b22.act" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>';
      if (!S.demo && PS.routineSugHTML) h += PS.routineSugHTML(bs.rt, { from: ID, sub: esc('Rèn thành thói quen mỗi ngày với Shin Routine') });
    }
    return h;
  };
  CHECK.base = function () { if (!g('b22.base')) return 'Chọn một nền'; return g('b22.act') ? '' : 'Chọn một việc nhỏ'; };
  STEP.chat = function () {
    var asked = g('b23.ask') || [];
    var h = '<div class="chat"><div class="msg"><span class="msg__av">H</span><div class="msg__b">Chào <b class="nm">' + esc(given()) + '</b>! Chị là Hạnh, từng là TTS 3 năm như em sắp đi. Em muốn hỏi gì chị nào?</div></div>';
    asked.forEach(function (i) { h += '<div class="msg msg--me"><div class="msg__b">' + esc(HANH[i][0]) + '</div></div><div class="msg"><span class="msg__av">H</span><div class="msg__b">' + esc(HANH[i][1]) + '</div></div>'; });
    h += '</div><div class="chips chips--ask">' + HANH.map(function (x, i) { return asked.indexOf(i) > -1 ? '' : '<button type="button" class="chip" data-act="ask" data-v="' + i + '">' + esc(x[0]) + '</button>'; }).join('') + '</div>' +
      '<p class="ps-small">' + esc(HANH_NOTE) + '</p>';
    return h;
  };
  CHECK.chat = function () { var n = (g('b23.ask') || []).length; return n >= 2 ? '' : 'Hỏi chị Hạnh ít nhất 2 câu (' + n + '/2)'; };

  /* ----- Bến 3 ----- */
  function pv() { var v = g('b31.v'); if (!v || !v.push) { v = [5, 5, 5, 5, 5, 5]; } return v; }
  STEP.pairs = function () {
    var v = pv();
    return '<div class="cmpbox" id="cmpBox">' + compassSVG(v, 200) + '</div><div class="pairs">' + PAIRS.map(function (p, i) {
      return '<div class="pair"><div class="pair__l"><span class="' + (v[i] < 5 ? 'on' : '') + '">' + esc(p[0]) + '</span><span class="' + (v[i] > 5 ? 'on' : '') + '">' + esc(p[1]) + '</span></div>' +
        '<input type="range" min="0" max="10" step="1" value="' + v[i] + '" data-pair="' + i + '" aria-label="' + esc(p[0] + ' hay ' + p[1]) + '"></div>';
    }).join('') + '</div><p class="ps-small">Để ở giữa nghĩa là bạn chưa chắc, hoặc cả hai đều quan trọng như nhau.</p>';
  };
  function onSlide(e) {
    var t = e.target, i = +t.getAttribute('data-pair'), v = pv().slice(); v[i] = +t.value; S.d['b31.v'] = v; save();
    var box = D.getElementById('cmpBox'); if (box) box.innerHTML = compassSVG(v, 200);
    var lab = t.parentNode.querySelectorAll('.pair__l span'); if (lab.length === 2) { lab[0].className = v[i] < 5 ? 'on' : ''; lab[1].className = v[i] > 5 ? 'on' : ''; }
  }
  STEP.winds = function () {
    var m = g('b32.s') || {}, n = 0, h = '';
    WINDS.forEach(function (w, i) { if (m[i]) n++; });
    h += '<div class="winds">' + WINDS.map(function (w, i) {
      return '<div class="wind' + (m[i] ? ' set' : '') + '"><b>' + cdIc('wind', 16) + esc(w) + '</b><div class="seg2"><button type="button" class="' + (m[i] === 'can' ? 'on' : '') + '" data-act="wind" data-id="' + i + '" data-v="can">Mình tác động được</button><button type="button" class="' + (m[i] === 'hard' ? 'on' : '') + '" data-act="wind" data-id="' + i + '" data-v="hard">Khó tác động</button></div></div>';
    }).join('') + '</div>';
    if (n >= WINDS.length) {
      var hard = [], can = []; WINDS.forEach(function (w, i) { (m[i] === 'hard' ? hard : can).push(i); });
      if (!hard.length) hard = can.slice(); if (!can.length) can = hard.slice();
      h += shinSays('think', '<p>Điều khó tác động vẫn chuẩn bị được. Chọn 1 cơn gió khó để nghĩ trước, và 1 điều bạn làm được từ bây giờ.</p>', 56) +
        qh('Cơn gió khó bạn muốn chuẩn bị') + '<div class="chips">' + hard.map(function (i) { return '<button type="button" class="chip' + (String(g('b32.h')) === String(i) ? ' on' : '') + '" data-act="pick" data-k="b32.h" data-v="' + i + '">' + esc(WINDS[i]) + '</button>'; }).join('') + '</div>' +
        qh('Điều bạn tác động được') + '<div class="chips">' + can.map(function (i) { return '<button type="button" class="chip' + (String(g('b32.c')) === String(i) ? ' on' : '') + '" data-act="pick" data-k="b32.c" data-v="' + i + '">' + esc(WINDS[i]) + '</button>'; }).join('') + '</div>';
    }
    return h;
  };
  CHECK.winds = function () { var m = g('b32.s') || {}, n = 0; WINDS.forEach(function (w, i) { if (m[i]) n++; }); if (n < WINDS.length) return 'Xếp đủ 8 cơn gió (' + n + '/8)'; if (g('b32.h') == null) return 'Chọn 1 cơn gió khó'; return g('b32.c') == null ? 'Chọn 1 điều làm được' : ''; };
  function age() { var by = +prof().by || 0, y = new Date().getFullYear(); return by > 1950 && by < y ? y - by : 0; }
  STEP.life = function () {
    var a = age(), h = shinSays('think', '<p>Hồi ở trường, thầy của Shin hay vẽ một đường đời lên bảng. Shin nhớ mãi, kể bạn nghe nhé.</p>', 68);
    h += '<div class="life">' + LIFE.map(function (x) { var cur = a >= x[0] && a < x[1]; return '<div class="life__r' + (cur ? ' cur' : '') + '"><b>' + x[0] + '–' + x[1] + '</b><span>' + esc(x[2]) + '</span>' + (cur ? '<em>Bạn đang ở đây</em>' : '') + '</div>'; }).join('') + '</div>' +
      '<div class="tnote"><b>Thầy bảo:</b> đi Nhật 3–5 năm là “lấy ngắn nuôi dài”. Mấy năm ngắn ở Nhật để nuôi cả sự nghiệp dài phía sau.</div>';
    if (a) h += '<p class="qsub">Năm nay bạn khoảng <b>' + a + '</b> tuổi. Xong 3 năm ở Nhật, bạn khoảng <b>' + (a + 4) + '</b>. Tuổi 30 còn <b>' + Math.max(0, 30 - a) + '</b> năm nữa.</p>';
    h += '<h3 class="qs">Nhưng có Senpai đi khác đường thầy vẽ</h3><div class="alt">' +
      '<button type="button" class="altc" data-act="sp" data-id="huan"><b>Anh Huân</b><span>30 tuổi mới sang Nhật, về nước với N1.</span></button>' +
      '<button type="button" class="altc" data-act="sp" data-id="lich"><b>Anh Lịch</b><span>26 tuổi mới học tiếng Nhật từ số 0.</span></button>' +
      '<button type="button" class="altc" data-act="sp" data-id="vinh"><b>Chị Cẩm Vinh</b><span>Bỏ nghề giảng viên để bắt đầu lại.</span></button></div>' +
      '<p class="ps-small">Đường đời là để tham khảo, không phải khuôn. Mỗi người đi một nhịp.</p>';
    return h;
  };
  STEP.compass = function () {
    return shinSays('proud', '<p>La bàn của <b class="nm">' + esc(given()) + '</b> đã chỉnh xong!</p>', 64) + '<div class="cmpbox">' + compassSVG(pv(), 220) + '</div>' +
      '<div class="cmpsum"><div><small>Nghiêng rõ nhất</small><b>' + esc(lean()) + '</b></div><div><small>Đi làm là để</small><b>' + esc(trim(g('b33.work')) || '…') + '</b></div><div><small>Tuổi 30 tốt là</small><b>' + esc(trim(g('b33.life')) || '…') + '</b></div></div>' +
      '<p class="ps-small">Ở Phòng Hải Đồ, bạn sẽ dùng la bàn này để vẽ 3 hải trình 5 năm.</p>';
  };

  /* ----- Bến 4 · Phòng Hải Đồ ----- */
  function voyOf(v) { for (var i = 0; i < VOY.length; i++) if (VOY[i][0] === v) return VOY[i]; return null; }
  function voyIsle(v) { var id = g(v + '.isl'); if (!id) return null; if (id === 'o') return { id: 'o', n: trim(g(v + '.islo')) || 'Đảo riêng', ic: 'compass', sub: '' }; return isleOf(id); }
  function msList(v) { var L = []; ['1', '3', '5'].forEach(function (y) { var t = trim(g(v + '.m' + y)); if (t) L.push('Năm ' + y + ': ' + t); }); return L; }
  function gOf(v) { var G = g(v + '.g'); return (G && typeof G === 'object') ? G : {}; }
  function wOf() { var w = g('b51.w'); return (w && typeof w === 'object') ? w : { like: 2, conf: 2, fit: 2, feas: 2 }; }
  function voyScore(v) { var G = gOf(v), W2 = wOf(), t = 0, m = 0; METERS.forEach(function (x) { var w = +W2[x[0]] || 2; t += (+G[x[0]] || 0) * w; m += 5 * w; }); return m ? Math.round(t / m * 100) : 0; }
  function voyTitle(v) { var x = voyOf(v), nm = trim(g(v + '.name')); return 'Hải trình ' + x[1] + (nm ? ' · ' + nm : ''); }
  function leanVoy() { var v = g('b51.lean'); return voyOf(v) ? v : ''; }
  function leanLetter() { var v = leanVoy(); return v ? voyOf(v)[1] : (g('b51.lean') === 'u' ? 'Chưa nghiêng' : ''); }
  function leanName() { var v = leanVoy(); if (v) return voyTitle(v); var is = isleOf(g('b13.isl')); return is ? 'hướng ' + is.n : 'hải trình bạn chọn'; }
  function leanIsle() { var v = leanVoy(); return v ? voyIsle(v) : (isleOf(g('b13.isl')) || null); }
  function gaugeSVG(n) {
    n = +n || 0; var L = 144.5, th = Math.PI * (1 - n / 5), nx = 60 + 34 * Math.cos(th), ny = 58 - 34 * Math.sin(th);
    return '<svg class="gauge" viewBox="0 0 120 66" aria-hidden="true"><path d="M14 58A46 46 0 0 1 106 58" fill="none" stroke="#E2EBEA" stroke-width="10" stroke-linecap="round"/>' +
      (n ? '<path d="M14 58A46 46 0 0 1 106 58" fill="none" stroke="#0F9F98" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + (L * n / 5).toFixed(1) + ' 200"/>' : '') +
      '<path d="M60 58L' + nx.toFixed(1) + ' ' + ny.toFixed(1) + '" stroke="#2A2118" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="58" r="5" fill="#2A2118"/></svg>';
  }
  function voyCard(v, sm) {
    var x = voyOf(v), is = voyIsle(v), G = gOf(v), ms = msList(v), jl = g(v + '.jl'), lean = leanVoy() === v;
    if (!is) return '<div class="voyc voyc--empty"><span class="voyc__l">' + x[1] + '</span><b>' + esc(x[2]) + '</b><small>Chưa vẽ</small></div>';
    return '<div class="voyc' + (lean ? ' voyc--lean' : '') + '"><div class="voyc__h"><span class="voyc__l">' + x[1] + '</span><div><small>' + esc(x[2]) + '</small><b>' + esc(trim(g(v + '.name')) || is.n) + '</b></div></div>' +
      '<p class="voyc__is">' + cdIc(is.ic, 15) + esc(is.n) + (jl ? ' · ' + esc(jl === 'x' ? 'Tiếng Nhật vừa đủ' : jl) : '') + '</p>' +
      (sm ? '' : '<ol class="voyc__ms">' + ms.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>') +
      '<div class="voyc__g">' + METERS.map(function (m) { var n = +G[m[0]] || 0; return '<span><small>' + esc(m[1]) + '</small><i><b style="width:' + (n * 20) + '%"></b></i></span>'; }).join('') + '</div>' +
      (lean ? '<em class="voyc__tag">Đang nghiêng về</em>' : '') + '</div>';
  }
  STEP.voy = function (s) {
    var v = s.v, x = voyOf(v), id = g(v + '.isl') || '', is = voyIsle(v), c = cd1(), h = '';
    h += '<div class="voyhead"><span class="voyc__l">' + x[1] + '</span><div><b>' + esc(x[2]) + '</b><small>' + Q(x[3]) + '</small></div></div>';
    if (v === 'b41') {
      var hint = [];
      if (c.far) hint.push('<div><small>Ở CD01, hướng 5 năm bạn tò mò</small><b>' + esc(c.far) + '</b></div>');
      if (trim(g('x1.now'))) hint.push('<div><small>Lúc nhận thuyền, bạn viết</small><b>' + esc(g('x1.now')) + '</b></div>');
      if (hint.length) h += '<div class="from">' + hint.join('') + '</div>';
    } else {
      h += '<div class="voymini">' + VOY.filter(function (y) { return y[0] < v; }).map(function (y) { var i2 = voyIsle(y[0]); return '<span>' + y[1] + ' · ' + esc(i2 ? i2.n : '…') + '</span>'; }).join('') + '</div>';
    }
    h += qh('Hải trình ' + x[1] + ' cập đảo nào?') + '<div class="isgrid">' + ISLES.map(function (it) {
      return '<button type="button" class="isbtn' + (id === it.id ? ' on' : '') + '" data-act="pick" data-k="' + v + '.isl" data-v="' + it.id + '">' + cdIc(it.ic, 16) + esc(it.n.replace('Đảo ', '')) + '</button>';
    }).join('') + '<button type="button" class="isbtn' + (id === 'o' ? ' on' : '') + '" data-act="pick" data-k="' + v + '.isl" data-v="o">' + cdIc('compass', 16) + 'Đảo khác</button></div>';
    if (id === 'o') h += '<input class="inp ps-sel" data-k="' + v + '.islo" maxlength="40" value="' + esc(g(v + '.islo') || '') + '" placeholder="Tên hướng đi của bạn, ví dụ: làm hướng dẫn viên du lịch">';
    if (is && id !== 'o') h += '<p class="qsub voysub">' + esc(is.sub) + '</p>';
    h += qh('Đặt tên cho hải trình ' + x[1]) + '<input class="inp ps-sel" data-k="' + v + '.name" maxlength="40" value="' + esc(g(v + '.name') || '') + '" placeholder="Ví dụ: Thợ hàn giỏi ở Osaka">' +
      tipsHTML(v + '.name', is && id !== 'o' ? [is.sub, 'Con đường của riêng ' + given()] : ['Con đường của riêng ' + given()]);
    return h;
  };
  CHECK.voy = function (s) { var id = g(s.v + '.isl'); if (!id) return 'Chọn một đảo'; if (id === 'o' && trim(g(s.v + '.islo')).length < 3) return 'Viết tên hướng đi'; return trim(g(s.v + '.name')).length >= 3 ? '' : 'Đặt tên cho hải trình'; };
  STEP.tline = function (s) {
    var v = s.v, x = voyOf(v), is = voyIsle(v), a = age(), base = a ? a + 4 : 0, h = '';
    h += qh('Hải trình ' + x[1] + ': 5 năm sau khi xong 3 năm ở Nhật', 'Viết 3 mốc. Mỗi mốc một dòng ngắn.');
    h += '<div class="tl5"><div class="tl5__s">' + cdIc('anchor', 18) + '<span><b>Xong 3 năm ở Nhật</b>' + (base ? '<small>khoảng ' + base + ' tuổi</small>' : '') + '</span></div>' +
      ['1', '3', '5'].map(function (y) {
        return '<label class="tl5__r"><span class="tl5__y">Năm ' + y + (base ? '<small>~' + (base + (+y)) + ' tuổi</small>' : '') + '</span><input class="inp ps-sel" data-k="' + v + '.m' + y + '" maxlength="60" value="' + esc(g(v + '.m' + y) || '') + '" placeholder="Mốc năm ' + y + '"></label>';
      }).join('') + '<div class="tl5__e">' + cdIc('flag', 18) + '<b>' + esc(is ? is.n : '') + '</b></div></div>';
    var tips = MS_TIPS[is ? is.id : 'o'] || MS_TIPS.o;
    h += '<div class="tips"><small>Chạm gợi ý để điền vào mốc còn trống, rồi sửa theo ý bạn</small>' + tips.map(function (t) { return '<button type="button" class="tip" data-act="msTip" data-k="' + v + '" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>';
    var jl = g(v + '.jl') || '';
    h += qh('Tiếng Nhật cần đạt cho hải trình này') + '<div class="chips">' + JL_OPTS.map(function (o) { return '<button type="button" class="chip' + (jl === o[0] ? ' on' : '') + '" data-act="pick" data-k="' + v + '.jl" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div>';
    return h;
  };
  CHECK.tline = function (s) { var n = 0; ['1', '3', '5'].forEach(function (y) { if (trim(g(s.v + '.m' + y)).length >= 3) n++; }); if (n < 2) return 'Viết ít nhất 2 mốc (' + n + '/2)'; return g(s.v + '.jl') ? '' : 'Chọn mức tiếng Nhật'; };
  STEP.meters = function (s) {
    var v = s.v, x = voyOf(v), G = gOf(v);
    var h = qh('Tự chấm hải trình ' + x[1], 'Chạm số từ 1 đến 5. Chấm theo cảm nhận, không có đúng sai.') + '<div class="meters">' + METERS.map(function (m) {
      var n = +G[m[0]] || 0;
      return '<div class="meter"><div class="meter__g">' + gaugeSVG(n) + '<b>' + (n || '–') + '</b></div><div class="meter__b"><b>' + esc(m[1]) + '</b><small>' + esc(m[2]) + '</small>' +
        (m[0] === 'fit' && g('b31.v') ? '<small class="meter__hint">La bàn của bạn nghiêng về “' + esc(lean()) + '”</small>' : '') +
        '<div class="meter__n">' + [1, 2, 3, 4, 5].map(function (k) { return '<button type="button" class="' + (n === k ? 'on' : '') + '" data-act="meter" data-k="' + v + '" data-id="' + m[0] + '" data-v="' + k + '" aria-label="' + esc(m[1]) + ' ' + k + '">' + k + '</button>'; }).join('') + '</div></div></div>';
    }).join('') + '</div>';
    return h + voyCard(v);
  };
  CHECK.meters = function (s) { var G = gOf(s.v), n = 0; METERS.forEach(function (m) { if (G[m[0]]) n++; }); return n >= 4 ? '' : 'Chấm đủ 4 đồng hồ (' + n + '/4)'; };
  STEP.trio = function () {
    return shinSays('wow', '<p>Đây là 3 hải trình của <b class="nm">' + esc(given()) + '</b>. Bạn có nhiều đường hơn bạn nghĩ!</p>', 60) +
      '<div class="trio">' + VOY.map(function (x) { return voyCard(x[0]); }).join('') + '</div><p class="ps-small">Vuốt ngang để xem cả 3. Bạn chưa cần chọn. Ở Vịnh Ngã Rẽ, mình sẽ cân nhắc kỹ hơn.</p>';
  };

  /* ----- Bến 5 · Vịnh Ngã Rẽ ----- */
  STEP.weigh = function () {
    var W2 = wOf(), best = '', bs = -1, tie = false;
    VOY.forEach(function (x) { var sc = voyScore(x[0]); if (sc > bs) { bs = sc; best = x[0]; tie = false; } else if (sc === bs) tie = true; });
    var h = qh('Với bạn, điều nào nặng, điều nào nhẹ?') + '<div class="wts">' + METERS.map(function (m) {
      var w = String(W2[m[0]] || 2);
      return '<div class="wt"><b>' + esc(m[1]) + '</b><div class="seg3">' + WEIGHT.map(function (o) { return '<button type="button" class="' + (w === o[0] ? 'on' : '') + '" data-act="wt" data-id="' + m[0] + '" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div></div>';
    }).join('') + '</div>';
    h += '<h3 class="qs">Kết quả cân</h3><div class="scale">' + VOY.map(function (x) {
      var sc = voyScore(x[0]), is = voyIsle(x[0]);
      return '<div class="scale__r' + (x[0] === best && !tie ? ' top' : '') + '"><span class="voyc__l">' + x[1] + '</span><div><b>' + esc(trim(g(x[0] + '.name')) || (is ? is.n : '')) + '</b><i><em style="width:' + sc + '%"></em></i></div><strong>' + sc + '</strong></div>';
    }).join('') + '</div>';
    h += shinSays('think', '<p>' + (tie ? 'Có hải trình đang ngang điểm nhau. Thử đổi nặng nhẹ xem sao.' : 'Theo cân của bạn, <b>hải trình ' + voyOf(best)[1] + '</b> đang nặng ký nhất.') + '</p>', 52);
    return h;
  };
  STEP.leanpick = function () {
    var v = g('b51.lean') || '', f = g('b51.feel') || '';
    var h = qh('Lúc này, bạn nghiêng về hải trình nào?') + '<div class="opts">' + VOY.map(function (x) { var is = voyIsle(x[0]); return opt('b51.lean', x[0], voyTitle(x[0]) + (is ? ' (' + is.n + ')' : ''), v === x[0]); }).join('') +
      opt('b51.lean', 'u', 'Mình chưa nghiêng về hải trình nào', v === 'u') + '</div>';
    h += qh('Kết quả cân có giống cảm giác của bạn không?') + '<div class="seg3">' + FEEL3.map(function (o) { return '<button type="button" class="' + (f === o[0] ? 'on' : '') + '" data-act="pick" data-k="b51.feel" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div>';
    if (f === 'diff') h += '<p class="qsub fb">Khác cũng tốt. Có thể bạn coi trọng một điều mà bàn cân chưa có. Viết điều đó ra ở bước sau nhé.</p>';
    if (f === 'unsure') h += '<p class="qsub fb">Phân vân là bình thường. Bến sau có cách thử nhỏ để bạn biết thêm.</p>';
    return h;
  };
  CHECK.leanpick = function () { if (!g('b51.lean')) return 'Chọn hải trình bạn nghiêng'; return g('b51.feel') ? '' : 'Chọn giống hay khác'; };
  function blk() { var id = g('b52.b'); for (var i = 0; i < BLOCKS.length; i++) if (BLOCKS[i].id === id) return BLOCKS[i]; return null; }
  function stormHTML(b) { return '<div class="storm"><span>' + cdIc(b.ic, 22) + '</span><div><small>Dựa trên chuyện đã từng xảy ra</small><b>' + esc(b.t) + '</b><p>' + esc(b.ctx) + '</p></div></div>'; }
  STEP.block = function () {
    var v = g('b52.b') || '';
    return shinSays('worry', '<p>Biển có lúc động. Các anh chị đi trước cũng từng bị chặn đường.</p><p>Chọn một tình huống để tập gỡ nhé.</p>', 64) +
      '<div class="blocks">' + BLOCKS.map(function (b) { return '<button type="button" class="blk' + (v === b.id ? ' on' : '') + '" data-act="blk" data-v="' + b.id + '"><span>' + cdIc(b.ic, 22) + '</span><b>' + esc(b.t) + '</b></button>'; }).join('') + '</div>' +
      (blk() ? stormHTML(blk()) : '');
  };
  CHECK.block = function () { return g('b52.b') ? '' : 'Chọn một tình huống'; };
  function chipRow(key, list, useIdx) { var v = g(key); return '<div class="chips">' + list.map(function (t, i) { var val = useIdx ? String(i) : t; return '<button type="button" class="chip' + (String(v) === val ? ' on' : '') + '" data-act="pick" data-k="' + key + '" data-v="' + esc(val) + '">' + esc(t) + '</button>'; }).join('') + '</div>'; }
  STEP.why3 = function () {
    var b = blk(); if (!b) return '';
    var h = stormHTML(b) + '<div class="why3"><div class="why3__r"><span>1</span><div>' + qh('Vì sao chuyện này xảy ra?') + chipRow('b52.w1', b.w1) + '</div></div>';
    if (g('b52.w1')) h += '<div class="why3__r"><span>2</span><div>' + qh('Vì sao lại như vậy?') + chipRow('b52.w2', b.w2) + '</div></div>';
    if (g('b52.w2')) h += '<div class="why3__r"><span>3</span><div>' + qh('Gốc rễ nằm ở đâu?') + chipRow('b52.w3', WHY3, 1) + '</div></div>';
    h += '</div>';
    if (g('b52.w3') != null && g('b52.w3') !== '') h += shinSays(+g('b52.w3') === 3 ? 'comfort' : 'cheer', +g('b52.w3') === 3 ? '<p>Hoàn cảnh khó đổi. Nhưng cách mình chuẩn bị thì đổi được.</p>' : '<p>Gốc rễ ở chỗ mình chạm tới được. Vậy là có cách gỡ!</p>', 52);
    return h;
  };
  CHECK.why3 = function () { if (!g('b52.w1')) return 'Trả lời tầng 1'; if (!g('b52.w2')) return 'Trả lời tầng 2'; return g('b52.w3') != null && g('b52.w3') !== '' ? '' : 'Trả lời tầng 3'; };
  function waysSel() { var L = (g('b52.ws') || []).slice(), o = trim(g('b52.own')); if (o.length >= 4) L.push(o); return L; }
  STEP.ways = function () {
    var b = blk(); if (!b) return '';
    var sel = g('b52.ws') || [], all = waysSel(), f = g('b52.first') || '';
    var h = qh('Nghĩ nhiều cách gỡ', 'Chọn 2 đến 3 cách. Có cách riêng thì viết thêm.') + '<div class="opts">' + b.ways.map(function (t) { return opt('b52.ws', t, t, sel.indexOf(t) > -1, 'way'); }).join('') + '</div>' +
      '<input class="inp ps-sel inp--gap" data-k="b52.own" maxlength="80" value="' + esc(g('b52.own') || '') + '" placeholder="Cách của riêng bạn (không bắt buộc)">';
    if (all.length >= 2) h += qh('Bước nhỏ đầu tiên bạn sẽ làm') + '<div class="chips">' + all.map(function (t) { return '<button type="button" class="chip' + (f === t ? ' on' : '') + '" data-act="pick" data-k="b52.first" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>';
    return h;
  };
  CHECK.ways = function () { var n = waysSel().length; if (n < 2) return 'Chọn ít nhất 2 cách (' + n + '/2)'; var f = g('b52.first'); return f && waysSel().indexOf(f) > -1 ? '' : 'Chọn bước nhỏ đầu tiên'; };
  STEP.real = function () {
    var b = blk(); if (!b) return '';
    var h = shinSays('cheer', '<p>Đây là điều các anh chị đã làm khi gặp chuyện giống vậy.</p>', 56) + '<div class="reals">' + b.sp.map(function (id) {
      var sp = spOf(id); collect(id, true);
      return '<div class="real"><div class="flip__front"><span class="spc__av">' + esc(initials(sp.n)) + '</span><div><b>' + esc(sp.n) + '</b><small>' + esc([sp.job, sp.jl].filter(Boolean).join(' · ')) + '</small></div></div>' +
        '<ol class="frames"><li><small>Bước ngoặt</small>' + esc(sp.bn) + '</li><li><small>Hôm nay</small>' + esc(sp.nay) + '</li></ol>' + (sp.q ? '<q class="flip__qt">' + esc(sp.q) + '</q>' : '') +
        '<button type="button" class="link" data-act="sp" data-id="' + id + '">Đọc trọn chuyện</button></div>';
    }).join('') + '</div>';
    h += '<div class="aha aha--soft"><span>' + cdIc('compass', 24) + '</span><div><b>Bước nhỏ của bạn</b><p>' + esc(g('b52.first') || '') + '</p></div></div><p class="ps-small">Senpai không có phép màu. Họ gỡ từng bước nhỏ, như bạn vừa chọn.</p>';
    return h;
  };
  function trialTxt() { var t = g('b53.try'); if (t === 'o') return trim(g('b53.tryo')); return t || ''; }
  function trialOpts() { var is = leanIsle(), L = []; if (is && TRY_ISLE[is.id]) L.push(TRY_ISLE[is.id].replace('[Nghề]', jobName())); return L.concat(TRIALS); }
  STEP.trial = function () {
    var t = g('b53.try') || '', is = leanIsle();
    var h = qh('Việc nhỏ bạn thử trong 2 tuần', is ? 'Cho hải trình bạn nghiêng: ' + leanName() + ' · ' + is.n : '') + '<div class="opts">' + trialOpts().map(function (x) { return opt('b53.try', x, x, t === x); }).join('') + opt('b53.try', 'o', 'Việc khác, mình tự viết', t === 'o') + '</div>';
    if (t === 'o') h += '<input class="inp ps-sel inp--gap" data-k="b53.tryo" maxlength="80" value="' + esc(g('b53.tryo') || '') + '" placeholder="Ví dụ: mỗi tối xem 1 video về nghề phiên dịch">';
    h += qh('Bắt đầu khi nào?') + '<div class="seg3">' + WHEN3.map(function (o) { return '<button type="button" class="' + (g('b53.when') === o[0] ? 'on' : '') + '" data-act="pick" data-k="b53.when" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div>';
    h += qh('Làm cùng ai?') + '<div class="chips">' + WITH3.map(function (o) { return '<button type="button" class="chip' + (g('b53.with') === o[0] ? ' on' : '') + '" data-act="pick" data-k="b53.with" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div>';
    if (trialTxt() && g('b53.when')) h += '<h3 class="qs">Thẻ thử nhỏ của bạn</h3>' + trialCard(1);
    return h;
  };
  CHECK.trial = function () { var t = g('b53.try'); if (!t) return 'Chọn một việc nhỏ'; if (t === 'o' && trim(g('b53.tryo')).length < 4) return 'Viết việc bạn muốn thử'; if (!g('b53.when')) return 'Chọn ngày bắt đầu'; return g('b53.with') ? '' : 'Chọn làm cùng ai'; };
  function dayKey(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function trialStart() {
    var st = g('b53.start'); if (st) return st;
    var d = new Date(), w = g('b53.when');
    if (w === '1') d.setDate(d.getDate() + 1); else if (w === '7') { var add = (8 - d.getDay()) % 7 || 7; d.setDate(d.getDate() + add); }
    return dayKey(d);
  }
  function trialCard(preview) {
    var t = trialTxt(); if (!t) return '';
    var st = trialStart(), p = st.split('-'), d0 = new Date(+p[0], +p[1] - 1, +p[2]), tk = g('b53.tk') || {}, today = dayKey(new Date()), n = 0, canTick = false, dots = '';
    for (var i = 0; i < 14; i++) { var d = new Date(d0.getTime()); d.setDate(d0.getDate() + i); var k = dayKey(d), on = !!tk[k]; if (on) n++; if (k === today) canTick = true; dots += '<i class="' + (on ? 'on' : '') + (k === today ? ' now' : '') + '" title="' + k + '"></i>'; }
    var wl = ''; WITH3.forEach(function (o) { if (o[0] === g('b53.with')) wl = o[1]; });
    return '<div class="trialc"><div class="trialc__h">' + cdIc('compass', 18) + '<b>Thử nhỏ 2 tuần</b><span>' + n + '/14</span></div><p>' + esc(t) + '</p><small>Bắt đầu ' + esc(p[2] + '/' + p[1]) + (wl ? ' · ' + esc(wl) : '') + '</small><div class="trialc__d">' + dots + '</div>' +
      (preview ? '' : (canTick ? (tk[today] ? '<p class="trialc__ok">' + PS.icon('check', 15, 3) + 'Hôm nay đã làm. Giỏi lắm!</p>' : '<button type="button" class="btn btn--soft btn--sm" data-act="trTick">Hôm nay mình đã làm</button>') : '')) + '</div>';
  }

  /* ----- Bến 6 · Ngọn Hải Đăng ----- */
  var RING_SH = { fam: 'Gia đình', ban: 'Bạn lớp', gv: 'Thầy cô', sp: 'Senpai', boss: 'Cấp trên', dn: 'Đồng nghiệp', cd: 'Bạn bè VN', tc: 'Nghiệp đoàn' };
  function ringName(id) { for (var i = 0; i < RING_P.length; i++) if (RING_P[i][0] === id) return RING_P[i][1]; return ''; }
  function ringSVG() {
    var R = g('b61.r') || {}, h = '<svg class="ring" viewBox="0 0 300 300" aria-hidden="true">', rr = { 1: 52, 2: 92, 3: 132 };
    h += '<circle cx="150" cy="150" r="132" fill="#F7FBFB" stroke="#BFE6E2" stroke-dasharray="4 5"/><circle cx="150" cy="150" r="92" fill="#EAF7F5" stroke="#BFE6E2"/><circle cx="150" cy="150" r="52" fill="#D9F1EE" stroke="#9FD8D2"/>';
    h += '<text x="150" y="26" text-anchor="middle" class="ring__t">Cần tìm</text><text x="150" y="66" text-anchor="middle" class="ring__t">Có quen</text><text x="150" y="106" text-anchor="middle" class="ring__t">Đã gần</text>';
    h += '<circle cx="150" cy="150" r="22" fill="#0F9F98"/><text x="150" y="155" text-anchor="middle" class="ring__me">Bạn</text>';
    RING_P.forEach(function (p, i) {
      var l = R[p[0]]; if (!l) return;
      var an = -Math.PI / 2 + 0.5 + (i / (RING_P.length - 1)) * (Math.PI * 2 - 1), x = 150 + Math.cos(an) * rr[l], y = 150 + Math.sin(an) * rr[l], key = g('b61.key') === p[0];
      h += '<g><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (key ? 9 : 7) + '" fill="' + (key ? '#F6C453' : '#fff') + '" stroke="#0B7F79" stroke-width="2"/><text x="' + x.toFixed(1) + '" y="' + (y + 20).toFixed(1) + '" text-anchor="middle" class="ring__n">' + esc(RING_SH[p[0]]) + '</text></g>';
    });
    return h + '</svg>';
  }
  STEP.ring = function () {
    var R = g('b61.r') || {}, n = 0; RING_P.forEach(function (p) { if (R[p[0]]) n++; });
    var h = '<div class="ringbox">' + ringSVG() + '</div><p class="qsub">Mỗi người đang ở vòng nào với bạn?</p><div class="rings">' + RING_P.map(function (p) {
      return '<div class="wind' + (R[p[0]] ? ' set' : '') + '"><b>' + cdIc(p[2], 16) + esc(p[1]) + '</b><div class="seg3">' + RING_L.map(function (o) { return '<button type="button" class="' + (R[p[0]] === o[0] ? 'on' : '') + '" data-act="ring" data-id="' + p[0] + '" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div></div>';
    }).join('') + '</div>';
    if (n >= RING_P.length) {
      h += qh('Ai có thể giúp hải trình bạn đang nghiêng nhiều nhất?', leanVoy() ? leanName() : '') + '<div class="chips">' + RING_P.map(function (p) { return '<button type="button" class="chip' + (g('b61.key') === p[0] ? ' on' : '') + '" data-act="pick" data-k="b61.key" data-v="' + p[0] + '">' + esc(p[1]) + '</button>'; }).join('') + '</div>';
      h += '<h3 class="qs">Người soi đường trong chuyện thật</h3><div class="alt">' + RING_STORY.map(function (x) { return '<button type="button" class="altc" data-act="sp" data-id="' + x[0] + '"><b>' + esc(spOf(x[0]).a) + '</b><span>' + esc(x[1]) + '</span></button>'; }).join('') + '</div>';
    }
    return h;
  };
  CHECK.ring = function () { var R = g('b61.r') || {}, n = 0; RING_P.forEach(function (p) { if (R[p[0]]) n++; }); if (n < RING_P.length) return 'Xếp đủ 8 người (' + n + '/8)'; return g('b61.key') ? '' : 'Chọn người giúp nhiều nhất'; };
  function msgTpl() {
    var to = trim(g('b61.to')) || 'anh chị', is = leanIsle(), q = g('b61.mq') || trim(g('b23.q')) || MSG_Q[0], jb = jobName(), hw = '';
    if (is) hw = is.id === 'o' ? is.n : is.sub; hw = hw ? hw.charAt(0).toLowerCase() + hw.slice(1) : '';
    return 'Chào ' + to + ' ạ. Em là ' + (prof().name || given()) + ', học viên JPC, sắp sang Nhật làm ' + (jb === 'bạn chọn' ? 'việc' : 'nghề ' + jb) + '. ' + (hw ? 'Sau 3 năm, em đang tìm hiểu hướng: ' + hw + '. ' : '') + 'Cho em hỏi: ' + q + ' Em cảm ơn ' + to + ' nhiều ạ.';
  }
  STEP.msg = function () {
    if (!g('b61.ed')) S.d['b61.msg'] = msgTpl();
    var qs = MSG_Q.slice(); if (trim(g('b23.q')) && qs.indexOf(trim(g('b23.q'))) < 0) qs.unshift(trim(g('b23.q')));
    var mq = g('b61.mq') || qs[0];
    return qh('Soạn một tin nhắn xin lời khuyên', 'Gửi cho người soi đường của bạn. Ngắn, lễ phép, một câu hỏi rõ.') +
      '<h3 class="qs">Bạn gọi người nhận là</h3><input class="inp ps-sel" data-k="b61.to" maxlength="30" value="' + esc(g('b61.to') || '') + '" placeholder="Ví dụ: chị Lan">' + tipsHTML('b61.to', ['anh', 'chị', 'thầy', 'cô']) +
      '<h3 class="qs">Câu hỏi của bạn</h3><div class="chips chips--ask">' + qs.map(function (q) { return '<button type="button" class="chip' + (mq === q ? ' on' : '') + '" data-act="msgQ" data-v="' + esc(q) + '">' + esc(q) + '</button>'; }).join('') + '</div>' +
      '<h3 class="qs">Tin nhắn (sửa thoải mái)</h3><textarea class="ta ps-sel" id="repMsg" data-k="b61.msg" rows="6" maxlength="600">' + esc(g('b61.msg') || '') + '</textarea>' +
      '<div class="repbtns"><button type="button" class="btn btn--soft btn--sm" data-act="copyMsg">Chép tin nhắn</button><button type="button" class="link" data-act="msgReset">Viết lại theo mẫu</button></div>' +
      '<p class="ps-small">Chưa cần gửi ngay. Chép lại, khi nào sẵn sàng thì gửi qua Zalo, Messenger hoặc Teams.</p>';
  };
  CHECK.msg = function () { if (trim(g('b61.to')).length < 2) return 'Viết cách gọi người nhận'; return trim(g('b61.msg')).length >= 40 ? '' : 'Tin nhắn còn ngắn quá'; };
  STEP.work = function () {
    var P = g('b62.w') || {};
    return '<div class="works">' + WORKS.map(function (w, i) {
      var v = P[i];
      return '<div class="work"><b class="work__t">' + cdIc(w.ic, 18) + esc(w.t) + '</b><div class="opts">' + w.opts.map(function (o, j) {
        return '<button type="button" class="opt' + (String(v) === String(j) ? ' on' : '') + '" data-act="work" data-id="' + i + '" data-v="' + j + '"><span class="dot">' + (String(v) === String(j) ? PS.icon('check', 13, 3.2) : '') + '</span><span>' + esc(o[0]) + '</span></button>';
      }).join('') + '</div>' + (v != null ? '<div class="workfb"><p><b>Được:</b> ' + esc(w.opts[+v][1]) + '</p><p><b>Lưu ý:</b> ' + esc(w.opts[+v][2]) + '</p></div>' : '') + '</div>';
    }).join('') + '</div><h3 class="qs">Senpai học từ công việc</h3><div class="alt">' + WORK_STORY.map(function (x) { return '<button type="button" class="altc" data-act="sp" data-id="' + x[0] + '"><b>' + esc(spOf(x[0]).a) + '</b><span>' + esc(x[1]) + '</span></button>'; }).join('') + '</div>';
  };
  CHECK.work = function () { var P = g('b62.w') || {}, n = 0; WORKS.forEach(function (w, i) { if (P[i] != null) n++; }); return n >= WORKS.length ? '' : 'Chọn cách cho cả 3 tình huống (' + n + '/3)'; };
  STEP.habit = function () {
    var v = g('b62.h') || '', i = LEARN_H.indexOf(v), rt = i < 0 ? ['horenso', 'memo'] : (i === 1 || i === 2 ? ['memo', 'xinloi'] : ['horenso', 'som']);
    var h = qh('Cách học bạn muốn tập ngay từ bây giờ') + '<div class="opts">' + LEARN_H.map(function (t) { return opt('b62.h', t, t, v === t); }).join('') + '</div>';
    if (v && !S.demo && PS.routineSugHTML) h += PS.routineSugHTML(rt, { from: ID, sub: esc('Tập thành thói quen ở JPC với Shin Routine') });
    return h;
  };
  CHECK.habit = function () { return g('b62.h') ? '' : 'Chọn một cách học'; };

  /* ----- Cảng Khởi Hành ----- */
  function nLabel(n) { for (var i = 0; i < OPEN_N.length; i++) if (OPEN_N[i][0] === n) return OPEN_N[i][1]; return '—'; }
  STEP.open2 = function () {
    var n = g('f1.n') || '', su = g('f1.sure') == null ? 5 : +g('f1.sure');
    var h = qh('Bây giờ, theo bạn, sau 3 năm ở Nhật người ta có thể đi mấy hướng?') + '<div class="chips">' + OPEN_N.map(function (x) { return '<button type="button" class="chip' + (n === x[0] ? ' on' : '') + '" data-act="pick" data-k="f1.n" data-v="' + x[0] + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>' +
      qh('Hướng đi sau 3 năm của bạn giờ đã rõ mấy phần?') + '<div class="slide1"><input type="range" min="0" max="10" step="1" value="' + su + '" data-k="f1.sure" aria-label="Rõ mấy phần"><div class="slide1__l"><span>Chưa rõ gì</span><b id="sureOut">' + su + '/10</b><span>Rất rõ</span></div></div>';
    if (n) h += '<div class="cmp2"><div><small>Lúc nhận thuyền</small><b>' + esc(nLabel(g('x1.n'))) + '</b><span>Rõ ' + (g('x1.sure') == null ? 5 : +g('x1.sure')) + '/10</span></div><div class="cmp2__ar">' + PS.icon('next', 20, 2.6) + '</div><div class="now"><small>Bây giờ</small><b>' + esc(nLabel(n)) + '</b><span id="sureOut2">Rõ ' + su + '/10</span></div></div>' +
      '<p class="ps-small">Bạn đã thấy ' + fogOpen() + '/8 đảo và gặp ' + cardN() + ' Senpai trên hải trình.</p>';
    return h;
  };
  CHECK.open2 = function () { return g('f1.n') ? '' : 'Chọn số hướng'; };
  function sheetData() {
    var p = prof(), f = flag(), bs = null, wl = ''; BASE5.forEach(function (b) { if (b.id === g('b22.base')) bs = b; }); WITH3.forEach(function (o) { if (o[0] === g('b53.with')) wl = o[1]; });
    var L = [];
    var cut = function (t, pre) { t = trim(t); return t.indexOf(pre) === 0 ? trim(t.slice(pre.length)) : t; };
    L.push(['La bàn của tôi', ['Nghiêng rõ nhất: ' + lean(), 'Đi làm là để: ' + (cut(g('b33.work'), 'Với mình, đi làm là để') || '…'), 'Tuổi 30 tốt là: ' + (cut(g('b33.life'), 'Ở tuổi 30, một cuộc sống tốt với mình là') || '…')]]);
    VOY.forEach(function (x) { var is = voyIsle(x[0]); L.push([voyTitle(x[0]) + (leanVoy() === x[0] ? '  ★ đang nghiêng' : ''), [(is ? is.n : '…') + (g(x[0] + '.jl') ? ' · Tiếng Nhật: ' + (g(x[0] + '.jl') === 'x' ? 'vừa đủ' : g(x[0] + '.jl')) : '') + ' · Cân: ' + voyScore(x[0]) + '/100'].concat(msList(x[0]))]); });
    L.push(['Nền tôi xây ở JPC', [(bs ? bs.n + ': ' : '') + (g('b22.act') || '…')]]);
    L.push(['Khi đường bị chặn', [((blk() || {}).t || '…') + '. Bước đầu: ' + (g('b52.first') || '…')]]);
    L.push(['Thử nhỏ 2 tuần', [trialTxt() + (wl ? ' (' + wl + ')' : '')]]);
    L.push(['Người soi đường', [ringName(g('b61.key')) + '. Cách học từ công việc: ' + (g('b62.h') || '…')]]);
    L.push(['Độ mở', ['Lúc nhận thuyền: ' + nLabel(g('x1.n')) + ', rõ ' + (g('x1.sure') == null ? 5 : g('x1.sure')) + '/10. Bây giờ: ' + nLabel(g('f1.n')) + ', rõ ' + (g('f1.sure') == null ? 5 : g('f1.sure')) + '/10.'].concat(trim(g('f1.change')) ? [trim(g('f1.change'))] : [])]);
    return { p: p, f: f, L: L };
  }
  STEP.sheet = function () {
    var D2 = sheetData(), p = D2.p;
    var h = shinSays('proud', '<p>Đây là <b>Hải trình của tôi</b>: cả khóa trên một trang. Lưu ảnh hoặc in ra nhé.</p>', 60) +
      '<div class="sheet" id="sheet"><div class="sheet__h"><div class="sheet__flag">' + flagSVG(D2.f.s, D2.f.c, 64, 0) + '</div><div><small>PROSKILLS · CAREER DESIGN 02</small><b>Hải trình của tôi</b><span>' + esc((p.name || '') + (p.cls ? ' · Lớp ' + p.cls : '')) + '</span>' +
      (g('x1.motto') ? '<em>“' + esc(g('x1.motto')) + '”</em>' : '') + '</div></div><div class="sheet__cmp">' + compassSVG(pv(), 150) + '</div>' +
      D2.L.map(function (sec) { return '<div class="sheet__s"><b>' + esc(sec[0]) + '</b>' + sec[1].map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div>'; }).join('') +
      '<p class="sheet__ft">Proskills · Khoa Kỹ năng JPC · ' + esc(CD2_VER) + '</p></div>' +
      '<div class="repbtns"><button type="button" class="btn" data-act="sheetImg">' + PS.icon('save', 18) + 'Lưu ảnh</button><button type="button" class="btn btn--soft" data-act="sheetPrint">In / PDF</button></div>';
    return h;
  };
  function reportMsg() {
    var p = prof(), t = S.demo ? null : PS.teacher(), D2 = sheetData();
    return ['Em chào ' + (t ? t.pron + ' ' + t.name : 'thầy cô') + '. Em là ' + (p.name || '') + (p.cls ? ', lớp ' + p.cls : '') + (p.sid ? ' (' + p.sid + ')' : '') + '. Em đã xong CD02 · Hải Đồ La Bàn.',
      'Mục tiêu khóa: ' + (g('x1.goal') || '…') + '.'].concat(D2.L.map(function (sec) { return '- ' + sec[0] + ': ' + sec[1].join('; '); })).concat(['Câu em muốn hỏi Senpai: ' + (g('b23.q') || '…'), 'Em cảm ơn ' + (t ? t.pron : 'thầy cô') + ' ạ.']).join('\n');
  }
  STEP.send = function () {
    var t = S.demo ? null : PS.teacher(), msg = reportMsg(), sent = g('rep.end');
    var h = shinSays('hi', '<p>Gửi hải trình cho thầy cô nhé. Thầy cô sẽ biết bạn đang nghĩ gì để giúp bạn đúng lúc.</p>', 60);
    if (S.demo) h += '<p class="ps-small">Bản demo: không gửi thật.</p>';
    else if (!t) h += '<div class="ps-form"><label>Thầy cô hướng dẫn' + PS.teacherSelect('id="repT"') + '</label></div>';
    else h += '<p class="qsub">Gửi tới <b>' + esc(t.name) + '</b> qua Teams. Gửi kèm ảnh Hải trình của tôi nhé.</p>';
    h += '<textarea class="ta repmsg" id="repMsg" rows="8" readonly>' + esc(msg) + '</textarea><div class="repbtns"><button type="button" class="btn btn--soft" data-act="copyMsg" data-k="rep.end">Chép tin nhắn</button>' +
      (t ? '<a class="btn" data-act="repTeams" target="_blank" rel="noopener" href="https://teams.microsoft.com/l/chat/0/0?users=' + encodeURIComponent(t.email) + '&message=' + encodeURIComponent(msg) + '">Mở Teams</a>' : '') + '</div>' +
      (sent ? '<p class="trialc__ok">' + PS.icon('check', 16, 3) + 'Đã gửi. Gửi lại lúc nào cũng được.</p>' : '<p class="ps-small">Chưa gửi được thì để sau. Bản này luôn ở Cảng Khởi Hành.</p>');
    return h;
  };
  function certHTML() {
    var p = prof(), f = flag(), d = new Date(S.fin || Date.now());
    return '<div class="cert"><div class="cert__in"><small>Proskills · Career Design 02</small><h2>Bằng Thuyền Trưởng</h2><div class="cert__flag">' + flagSVG(f.s, f.c, 90, 1) + '</div>' +
      '<p>Trao cho</p><b class="cert__nm">' + esc(p.name || given()) + '</b><p>đã ghé đủ 6 bến, vẽ 3 hải trình 5 năm và tự chỉnh la bàn của mình.</p>' +
      (g('x1.motto') ? '<em>“' + esc(g('x1.motto')) + '”</em>' : '') + '<div class="cert__ft"><span>' + esc(PS.fmtDate ? PS.fmtDate(d) : d.toLocaleDateString('vi-VN')) + '</span>' + stampHTML(GOAL_PORT) + '</div></div></div>';
  }
  STEP.cert = function () {
    return certHTML() + '<div class="shipwrap">' + shipSVG(6, flag().s, flag().c, 200) + '</div>' +
      shinSays('cheer', '<p>Shin tặng bạn trang phục <b>Thuyền trưởng</b> trong Tủ đồ của Shin (Shin Routine › Sổ tay › Cài đặt).</p><p>Nhớ nhé: mọi hải trình đều xuất phát từ Cảng 3 Năm. Giữ vững 3 năm ở Nhật, biển rộng sẽ mở ra.</p>', 64) +
      '<a class="srclink" href="' + esc(TIKME_HOME) + '" target="_blank" rel="noopener">' + cdIc('link', 15) + 'Đọc thêm chuyện thật trên Tikme</a>';
  };

  /* ----- ảnh và in Hải trình của tôi ----- */
  function sheetImg() {
    var D2 = sheetData(), p = D2.p, cv = D.createElement('canvas'), cx = cv.getContext('2d'), Wd = 1080, PAD = 64, IN = Wd - PAD * 2, y = 0, draw = false;
    function font(w, s) { cx.font = w + ' ' + s + 'px "Be Vietnam Pro", system-ui, sans-serif'; }
    function txt(t, x, mw, lh, col) {
      var ws = String(t).split(' '), line = '';
      for (var i = 0; i < ws.length; i++) { var tt = line ? line + ' ' + ws[i] : ws[i]; if (cx.measureText(tt).width > mw && line) { if (draw) { cx.fillStyle = col; cx.fillText(line, x, y); } y += lh; line = ws[i]; } else line = tt; }
      if (line) { if (draw) { cx.fillStyle = col; cx.fillText(line, x, y); } y += lh; }
    }
    function layout(cmpImg) {
      y = 0; cx.textBaseline = 'top';
      if (draw) { cx.fillStyle = '#F2F8F6'; cx.fillRect(0, 0, Wd, cv.height); var gr = cx.createLinearGradient(0, 0, Wd, 260); gr.addColorStop(0, '#22B5AE'); gr.addColorStop(1, '#0B7F79'); cx.fillStyle = gr; cx.fillRect(0, 0, Wd, 260); }
      y = 52; font('700', 24); txt('PROSKILLS · CAREER DESIGN 02 · HẢI ĐỒ LA BÀN', PAD, IN, 40, '#FFE08A');
      font('800', 56); txt('Hải trình của tôi', PAD, IN, 72, '#FFFFFF');
      font('600', 28); txt((p.name || '') + (p.cls ? ' · Lớp ' + p.cls : '') + (p.sid ? ' · ' + p.sid : ''), PAD, IN, 40, 'rgba(255,255,255,.92)');
      y = 290;
      if (cmpImg) { if (draw) cx.drawImage(cmpImg, Wd / 2 - 150, y, 300, 300); y += 316; }
      if (g('x1.motto')) { font('700', 32); txt('“' + g('x1.motto') + '”', PAD, IN, 44, '#0B7F79'); y += 10; }
      D2.L.forEach(function (sec) {
        var y0 = y; if (draw) { cx.fillStyle = '#FFFFFF'; cx.fillRect(PAD, y0, IN, sec.h || 0); cx.fillStyle = '#0F9F98'; cx.fillRect(PAD, y0, 8, sec.h || 0); }
        y += 22; font('800', 30); txt(sec[0], PAD + 32, IN - 60, 42, '#16323A');
        font('400', 27); sec[1].forEach(function (t) { txt(t, PAD + 32, IN - 60, 38, '#47616A'); });
        y += 20; if (!draw) sec.h = y - y0; y += 18;
      });
      font('500', 22); txt('Proskills · Khoa Kỹ năng JPC · ' + CD2_VER, PAD, IN, 34, '#7A8F95');
      return y + PAD;
    }
    function run(img) {
      try {
        cv.width = Wd; cv.height = 100; draw = false; var H = layout(img); cv.width = Wd; cv.height = Math.ceil(H); draw = true; layout(img);
        var url = cv.toDataURL('image/png'), nm = String(p.name || 'hoc-vien');
        if (nm.normalize) nm = nm.normalize('NFD').replace(/[̀-ͯ]/g, '');
        nm = nm.replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
        S.d['f2.img'] = S.d['f2.img'] || Date.now(); save();
        ov('<h2>Ảnh Hải trình của tôi</h2><p class="ps-small">Giữ ngón tay lên ảnh để lưu, hoặc bấm Tải ảnh.</p><div class="imgbox"><img src="' + url + '" alt="Hải trình của ' + esc(p.name || '') + '"></div>' +
          '<a class="btn btn--w" href="' + url + '" download="HaiTrinh-' + esc(nm || 'CD02') + '.png">' + PS.icon('save', 18) + 'Tải ảnh</a>');
      } catch (e) { PS.toast('Chưa tạo được ảnh. Bạn chụp màn hình hoặc chọn In nhé.'); }
    }
    PS.toast('Đang tạo ảnh…');
    var go2 = function () {
      try {
        var im = new Image(), done = false, fin = function (ok) { if (done) return; done = true; run(ok ? im : null); };
        im.onload = function () { fin(true); }; im.onerror = function () { fin(false); };
        im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(compassSVG(pv(), 300).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" height="300" '));
        setTimeout(function () { fin(false); }, 1500);
      } catch (e) { run(null); }
    };
    if (D.fonts && D.fonts.ready && D.fonts.ready.then) D.fonts.ready.then(go2, go2); else go2();
  }
  function copyText(rk) {
    var ta = D.getElementById('repMsg'); if (!ta) return;
    var ok = function () { if (rk) { S.d[rk] = Date.now(); save(true); } PS.toast('Đã chép. Dán vào Zalo, Messenger hoặc Teams nhé.'); };
    try { if (W.navigator.clipboard && W.isSecureContext) { W.navigator.clipboard.writeText(ta.value).then(ok, function () { fb(); }); return; } } catch (e) {}
    fb();
    function fb() { var ro = ta.hasAttribute('readonly'); try { ta.removeAttribute('readonly'); ta.select(); D.execCommand('copy'); if (ro) ta.setAttribute('readonly', ''); ok(); } catch (e2) { PS.toast('Chưa chép được. Giữ ngón tay lên tin nhắn để chép nhé.'); } }
  }

  /* ---------- hoàn thành chặng ---------- */
  function finishAct() {
    var id = V.id, a = ACTS[id], first = !S.done[id];
    S.done[id] = S.done[id] || Date.now();
    S.xp[id] = CD2_XP_ACT;
    var ins = 0; a.steps.forEach(function (s) { if (s.k === 'write') ins += insOf(s.key); if (s.k === 'open1') ins += insOf('x1.now'); });
    S.ins[id] = ins;
    markDay();
    var b = benOf(a.st), stampNew = false, finNew = false;
    if (b !== GOAL_PORT && (b === PORT ? portDone() : benDone(b)) && !S.stamp[b.id]) { S.stamp[b.id] = Date.now(); stampNew = true; }
    if (b === GOAL_PORT && benDone(b) && !S.fin) { S.fin = Date.now(); finNew = true; }
    if (id === 'x1') S.intro = 1;
    if (id === 'b53' && !cnt(g('b53.tk') || {})) { delete S.d['b53.start']; S.d['b53.start'] = trialStart(); }
    save(true);
    if (finNew) { sfx('horn'); setTimeout(function () { sfx('stamp'); }, 380); PS.toast('<b>Bằng Thuyền Trưởng!</b> +' + CD2_XP_ACT + ' XP' + (ins ? ' · +' + ins + ' Insight' : '')); go({ v: 'home' }); certOv(1); return; }
    if (stampNew) { sfx('horn'); setTimeout(function () { sfx('stamp'); }, 380); }
    else sfx('ting');
    PS.toast('<b>' + esc(SHIN_TALK.doneAct) + '</b> +' + CD2_XP_ACT + ' XP' + (ins ? ' · +' + ins + ' Insight' : '') + (stampNew ? ' · Con dấu ' + esc(b.n) : ''));
    if (stampNew) { go({ v: 'ben', st: b.id }); showStamp(b); return; }
    go({ v: 'ben', st: b.id });
  }
  function certOv(first) {
    ov('<div class="stampov">' + certHTML() + shinSays('cheer', first ? '<p>Chúc mừng thuyền trưởng <b class="nm">' + esc(given()) + '</b>! Trang phục Thuyền trưởng đã có trong Tủ đồ của Shin.</p>' : '<p>Hải đồ vẫn mở. Ghé đảo, đọc thêm Senpai lúc nào cũng được.</p>', 56) +
      '<button type="button" class="btn btn--go btn--w" data-act="ovHome">Về hải đồ</button></div>');
  }
  function showStamp(b) {
    ov('<div class="stampov">' + stampHTML(b) + '<h2>Con dấu ' + esc(b.n) + '</h2>' + shinSays('cheer', b === PORT ? '<p>Nhổ neo! Thuyền đã rời Cảng 3 Năm. Bến 1 và Bến 2 đều mở, bạn đi bến nào trước cũng được.</p>' : '<p>Đã đóng dấu vào Sổ Thuyền Trưởng. Thuyền của bạn vừa được nâng cấp!</p>', 56) +
      '<div class="shipwrap">' + shipSVG(shipLv(), flag().s, flag().c, 170) + '</div><button type="button" class="btn btn--go btn--w" data-act="ovHome">Về hải đồ</button></div>');
  }

  /* ---------- lớp phủ ---------- */
  function ov(html) { closeOv(); var el = D.createElement('div'); el.id = 'cdov'; el.className = 'cdov'; el.setAttribute('role', 'dialog'); el.innerHTML = '<div class="cdov__box"><button type="button" class="cdov__x" data-act="ovClose" aria-label="Đóng">' + PS.icon('close', 20) + '</button>' + html + '</div>'; D.body.appendChild(el); D.body.classList.add('ps-lock'); }
  function closeOv() { var el = D.getElementById('cdov'); if (el) el.parentNode.removeChild(el); if (!nbOpen) D.body.classList.remove('ps-lock'); }

  /* =========================================================
     6. SỔ TAY: Tổng quan | Hải trình | Cài đặt
     ========================================================= */
  function nbOverview() {
    var tg = g('b12.t') || {}, cur = ISLES.filter(function (is) { return tg[is.id] === 'cur'; });
    return '<div class="tiles"><div class="tl">' + PS.icon('check', 16) + '<b>' + doneMain() + '/' + ORDER.length + '</b><small>Chặng đã xong</small></div><div class="tl">' + PS.icon('star', 16) + '<b>' + xpTotal() + '</b><small>XP</small></div>' +
      '<div class="tl">' + PS.icon('bulb', 16) + '<b>' + insTotal() + '</b><small>Insight</small></div><div class="tl">' + PS.icon('flame', 16) + '<b>' + (S.demo ? 5 : PS.streak()) + '</b><small>Chuỗi ngày</small></div>' +
      '<div class="tl">' + cdIc('compass', 16) + '<b>' + (100 - fogPct()) + '%</b><small>Sương đã tan</small></div><div class="tl">' + cdIc('card', 16) + '<b>' + cardN() + '/' + SENPAI.length + '</b><small>Thẻ Senpai</small></div></div>' +
      (g('x1.goal') ? '<div class="nbbox"><small>Mục tiêu khóa của bạn</small><p>' + esc(g('x1.goal')) + '</p></div>' : '') +
      (cur.length ? '<div class="nbbox"><small>Đảo bạn tò mò</small><p>' + cur.map(function (is) { return esc(is.n); }).join(' · ') + '</p></div>' : '') +
      '<p class="ps-small">Tổng XP của mọi khóa: <b>' + PS.totals().xp + '</b> (xem ở trang chính Proskills).</p>';
  }
  function nbLog() {
    var h = bookHTML(1);
    if (g('b31.v')) h += '<div class="nbbox"><small>La bàn của tôi</small><div class="cmpbox">' + compassSVG(pv(), 180) + '</div><p>Nghiêng rõ nhất: <b>' + esc(lean()) + '</b></p></div>';
    if (g('b22.base')) { var bs = null; BASE5.forEach(function (b) { if (b.id === g('b22.base')) bs = b; }); h += '<div class="nbbox"><small>Nền tôi xây từ bây giờ</small><p><b>' + esc(bs.n) + '</b> · ' + esc(g('b22.act') || '') + '</p></div>'; }
    if (g('b23.q')) h += '<div class="nbbox"><small>Câu tôi muốn hỏi Senpai</small><p>' + esc(g('b23.q')) + '</p></div>';
    if (g('b41.isl')) h += '<h3 class="qs">3 hải trình 5 năm</h3><div class="trio">' + VOY.map(function (x) { return voyCard(x[0]); }).join('') + '</div>';
    if (trialTxt() && S.done.b53) h += '<div class="nbbox nbbox--plain">' + trialCard() + '</div>';
    if (g('b52.first')) h += '<div class="nbbox"><small>Khi đường bị chặn</small><p>' + esc((blk() || {}).t || '') + '. Bước đầu: <b>' + esc(g('b52.first')) + '</b></p></div>';
    if (g('b61.key')) h += '<div class="nbbox"><small>Ngọn hải đăng của tôi</small><div class="ringbox">' + ringSVG() + '</div><p>Người giúp nhiều nhất: <b>' + esc(ringName(g('b61.key'))) + '</b></p></div>';
    if (g('b62.h')) h += '<div class="nbbox"><small>Cách tôi học từ công việc</small><p><b>' + esc(g('b62.h')) + '</b>' + (g('b62.how') ? ' · ' + esc(g('b62.how')) : '') + '</p></div>';
    if (finDone()) h += '<button type="button" class="btn btn--go btn--w nbcert" data-act="certOv">' + cdIc('flag', 18) + 'Bằng Thuyền Trưởng</button>';
    h += '<h3 class="qs">Thẻ Senpai (' + cardN() + '/' + SENPAI.length + ')</h3><div class="spgrid spgrid--nb">' + SENPAI.map(function (sp) {
      var got = !!S.cards[sp.id];
      return got ? spCard(sp) : '<div class="spc spc--no"><span class="spc__av">?</span><span class="spc__b"><b>Chưa gặp</b><small>' + esc(isleOf(sp.isl).n) + '</small></span></div>';
    }).join('') + '</div>';
    return h;
  }
  function nbSettings() {
    if (S.demo) return '<p class="ps-small">Đang mở bản demo giáo viên. Thông tin và bài làm ở đây là của học viên giả định.</p><button type="button" class="btn btn--soft btn--w" data-act="demoExit">Thoát demo</button>';
    return PS.settingsHTML({ ctx: 'module', mod: ID, ver: CD2_VER });
  }
  function drawNb() {
    var el = D.getElementById('nb'); if (!el) return;
    el.innerHTML = '<div class="nb__in"><div class="nb__top"><h2>Sổ tay</h2><button type="button" class="nb__x" data-act="nbClose" aria-label="Đóng sổ tay">' + PS.icon('close', 20) + '</button></div>' +
      '<div class="tabs" role="tablist">' + [['tq', 'Tổng quan'], ['ht', 'Hải trình'], ['cd', 'Cài đặt']].map(function (t) { return '<button type="button" role="tab" aria-selected="' + (NBTAB === t[0]) + '" class="' + (NBTAB === t[0] ? 'on' : '') + '" data-act="tab" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<div id="nbBody">' + (NBTAB === 'tq' ? nbOverview() : (NBTAB === 'ht' ? nbLog() : nbSettings())) + '</div></div>';
    if (NBTAB === 'cd' && !S.demo) PS.wireSettings(D.getElementById('nbBody'), { ctx: 'module', mod: ID, onChange: function () { drawNb(); } });
  }
  function openNb(tab) { NBTAB = tab || 'cd'; if (nbOpen) { drawNb(); return; } nbOpen = true; var el = D.createElement('div'); el.id = 'nb'; el.className = 'nb'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Sổ tay'); D.body.appendChild(el); D.body.classList.add('ps-lock'); drawNb(); }
  function closeNb() { var el = D.getElementById('nb'); if (el) el.parentNode.removeChild(el); nbOpen = false; D.body.classList.remove('ps-lock'); QUIET = true; render(false); QUIET = false; }

  /* =========================================================
     7. DEMO GIÁO VIÊN: học viên giả định đã xong Xuất phát + Bến 1–3 (từ PS1.3.38)
     ========================================================= */
  function enterDemo() {
    var s = blank(); s.demo = 1; s.intro = 1; s.created = Date.now() - 2 * 864e5;
    s.prof = { name: 'Nguyễn Minh An', by: new Date().getFullYear() - 20, sid: 'HV-DEMO', cls: 'Lớp demo', path: 'Thực tập sinh' };
    s.cd1 = { main: 'co-khi', jobKey: 'co-khi', mainName: 'Cơ khí', far: 'Tổ trưởng, kèm người mới', letter: 'Gửi mình 5 năm sau: mong là giờ bạn đã đọc bản vẽ không cần hỏi ai.' };
    s.d = { 'x1.flag': { s: 'whale', c: '#0F9F98' }, 'x1.motto': 'Đi chậm mà chắc', 'x1.n': '2', 'x1.sure': 6, 'x1.now': 'Mình sẽ về Việt Nam làm cho công ty Nhật.', 'x1.goal': 'Mình muốn biết thêm các hướng đi sau 3 năm.' };
    var t0 = Date.now() - 864e5, d = s.d;
    /* PS1.3.38: học viên giả định đã xong Xuất phát + Bến 1–3, để thầy cô thử ngay Bến 4–6 và Cảng Khởi Hành */
    d['b11.g'] = { thuy: 'cau', lich: 'len', linh: 're', hoi: 'cau', sy: 'len', mai: 'chu' };
    d['b12.t'] = { len: 'cur', re: 'new', hoc: 'no', gio: 'new', chu: 'cur', lap: 'no', cau: 'cur', que: 'new' };
    d['b13.isl'] = 'cau'; d['b13.why'] = 'Mình muốn về gần nhà mà vẫn dùng tiếng Nhật.';
    d['b21.b1'] = 'hoai'; d['b21.fr1'] = 'bn'; d['b21.b2'] = 'thuy'; d['b21.fr2'] = 'nay'; d['b21.take'] = 'Mình thấy tiếng Nhật giỏi thì có thêm lựa chọn.';
    d['b22.g'] = { jp: 'm', change: 'm', learn: 'm', goal: 'f', rel: 'm', fam: 'f', retry: 'f', rich: 'f' }; d['b22.rev'] = 1; d['b22.base'] = 'jp'; d['b22.act'] = 'Mỗi ngày 10 từ mới';
    d['b23.ask'] = [0, 2]; d['b23.q'] = 'Anh chị chuẩn bị gì từ năm đầu để về có việc tốt?';
    d['b31.v'] = [3, 5, 4, 3, 4, 7]; d['b31.why'] = 'Vì ba mẹ mình lớn tuổi rồi.';
    d['b32.s'] = { 0: 'hard', 1: 'can', 2: 'can', 3: 'hard', 4: 'hard', 5: 'can', 6: 'can', 7: 'can' }; d['b32.h'] = '0'; d['b32.c'] = '2'; d['b32.hard'] = 'Mình sẽ nói chuyện với gia đình.'; d['b32.can'] = 'Mình ôn 10 từ mới mỗi tối.';
    d['b33.work'] = 'Với mình, đi làm là để giỏi một nghề'; d['b33.life'] = 'Ở tuổi 30, một cuộc sống tốt với mình là gần ba mẹ';
    ['b11', 'b12', 'b13', 'b21', 'b22', 'b23', 'b31', 'b32', 'b33'].forEach(function (a) { s.done[a] = t0; s.xp[a] = CD2_XP_ACT; });
    s.done.x1 = t0; s.xp.x1 = CD2_XP_ACT; s.stamp = { p0: t0, b1: t0, b2: t0, b3: t0 }; s.seen = { p0: 1, b1: 1, b2: 1, b3: 1 };
    ['thuy', 'lich', 'linh', 'hoi', 'sy', 'mai', 'hoai'].forEach(function (id) { s.cards[id] = t0; s.xp['card.' + id] = CD2_XP_CARD; });
    ISLES.forEach(function (is) { s.isl[is.id] = t0; });
    S = s; NOSAVE = 0; save(true); V = { v: 'home' }; render(true);
    PS.toast('<b>Bản demo giáo viên</b> · học viên giả định đã xong Bến 1–3. Bến 4 Phòng Hải Đồ đang mở.');
  }
  function exitDemo() { NOSAVE = 1; clearTimeout(saveT); try { PS.set(DEMO_KEY, null); } catch (e) {} W.location.replace(W.location.pathname); }

  /* =========================================================
     8. SỰ KIỆN
     ========================================================= */
  D.addEventListener('click', function (e) {
    var b = PS.closest(e.target, '[data-act]'); if (!b) return;
    var a = b.getAttribute('data-act'), id = b.getAttribute('data-id'), k = b.getAttribute('data-k'), v = b.getAttribute('data-v');
    if (a === 'home') go({ v: 'home' });
    else if (a === 'psHome') { save(true); PS.home(); }
    else if (a === 'introGo') { S.intro = 1; save(true); go({ v: 'act', id: 'x1', step: 0 }); }
    else if (a === 'ben') { var bn = benOf(b.getAttribute('data-st')); if (bn && (benOpen(bn) || benDone(bn))) go({ v: 'ben', st: bn.id }); else if (bn) PS.toast(esc(lockMsg(bn))); }
    else if (a === 'lockMsg') { var bl = benOf(b.getAttribute('data-st')); PS.toast(esc(bl ? lockMsg(bl) : SHIN_TALK.lockFin)); }
    else if (a === 'open') { if (actOpen(id) || S.done[id]) go({ v: 'act', id: id, step: 0 }); else PS.toast(esc(lockMsg(benOf(ACTS[id].st)))); }
    else if (a === 'isle') { if (D.getElementById('cdov')) closeOv(); go({ v: 'isle', id: id }); }
    else if (a === 'sp') { if (V.v === 'act') { ov(spBody(spOf(id))); collect(id, true); } else go({ v: 'sp', id: id, from: V.v === 'isle' ? V.id : null }); }
    else if (a === 'showIntro') { V.showIntro = 1; QUIET = true; render(false); QUIET = false; }
    else if (a === 'next') { var s0 = ACTS[V.id].steps[V.step]; if (check(s0)) return; if (s0.k === 'open1' && g('x1.sure') == null) S.d['x1.sure'] = 5; if (s0.k === 'open2' && g('f1.sure') == null) S.d['f1.sure'] = 5; if (s0.k === 'weigh') S.d['b51.w'] = wOf(); V.step++; S.d[V.id + '.st'] = V.step; save(); try { history.replaceState(hState(V), ''); } catch (er) {} render(true); }
    else if (a === 'prev') { if (V.step > 0) { V.step--; render(true); } }
    else if (a === 'finish') { var s1 = ACTS[V.id].steps[V.step]; if (check(s1)) return; finishAct(); }
    else if (a === 'pick') { S.d[k] = v; if (k === 'x1.job' && v !== 'u') { /* đổi nghề: sách cùng nghề chọn lại */ } save(); redrawStep(); }
    else if (a === 'tip') { var ta = APP.querySelector('[data-k="' + k + '"]'); if (ta) { ta.value = v; S.d[k] = v; save(); updIns(k); if (k === 'b61.to') msgSync(); refreshBar(); try { ta.focus(); } catch (er) {} } }
    else if (a === 'msTip') { var slot = null, dup = false; ['1', '3', '5'].forEach(function (y) { if (trim(g(k + '.m' + y)) === v) dup = true; }); if (dup) { PS.toast('Gợi ý này đã có trong một mốc.'); return; } ['1', '3', '5'].forEach(function (y) { if (!slot && trim(g(k + '.m' + y)).length < 3) slot = y; }); if (!slot) { PS.toast('3 mốc đã có chữ. Sửa trực tiếp trong ô nhé.'); return; } S.d[k + '.m' + slot] = v; save(); keepY(redrawStep); }
    else if (a === 'meter') { var G2 = gOf(k); G2[id] = +v; S.d[k + '.g'] = G2; save(); sfx('flip'); keepY(redrawStep); }
    else if (a === 'wt') { var W3 = wOf(); W3[id] = +v; S.d['b51.w'] = W3; save(); keepY(redrawStep); }
    else if (a === 'blk') { if (g('b52.b') !== v) { ['b52.w1', 'b52.w2', 'b52.w3', 'b52.ws', 'b52.own', 'b52.first'].forEach(function (x) { delete S.d[x]; }); } S.d['b52.b'] = v; save(); keepY(redrawStep); }
    else if (a === 'way') { var L2 = (g('b52.ws') || []).slice(), ix = L2.indexOf(v); if (ix > -1) L2.splice(ix, 1); else { if (L2.length >= 3) { PS.toast('Chọn tối đa 3 cách. Bỏ một cách trước nhé.'); return; } L2.push(v); } S.d['b52.ws'] = L2; if (g('b52.first') && waysSel().indexOf(g('b52.first')) < 0) delete S.d['b52.first']; save(); keepY(redrawStep); }
    else if (a === 'trTick') { var TK = g('b53.tk') || {}; TK[dayKey(new Date())] = 1; S.d['b53.tk'] = TK; markDay(); save(true); sfx('ting'); PS.toast('Thêm một ngày thử nhỏ. Giỏi lắm!'); if (nbOpen) drawNb(); else { QUIET = true; render(false); QUIET = false; } }
    else if (a === 'ring') { var RR = g('b61.r') || {}; RR[id] = v; S.d['b61.r'] = RR; save(); keepY(redrawStep); }
    else if (a === 'msgQ') { S.d['b61.mq'] = v; if (!g('b61.ed')) S.d['b61.msg'] = msgTpl(); save(); keepY(redrawStep); }
    else if (a === 'msgReset') { delete S.d['b61.ed']; S.d['b61.msg'] = msgTpl(); save(); keepY(redrawStep); }
    else if (a === 'copyMsg') copyText(k);
    else if (a === 'repTeams') { S.d['rep.end'] = Date.now(); save(true); setTimeout(function () { if (V.v === 'act') keepY(redrawStep); }, 400); }
    else if (a === 'work') { var P2 = g('b62.w') || {}; P2[id] = +v; S.d['b62.w'] = P2; save(); keepY(redrawStep); }
    else if (a === 'sheetImg') sheetImg();
    else if (a === 'sheetPrint') { S.d['f2.print'] = Date.now(); save(); D.body.classList.add('printing'); setTimeout(function () { try { W.print(); } catch (er) {} setTimeout(function () { D.body.classList.remove('printing'); }, 500); }, 60); }
    else if (a === 'certOv') certOv(0);
    else if (a === 'noop') {}
    else if (a === 'flagSym' || a === 'flagCol') { var f = g('x1.flag') || {}; if (a === 'flagSym') f.s = v; else f.c = v; S.d['x1.flag'] = { s: f.s, c: f.c }; save(); redrawStep(); }
    else if (a === 'flipGuess') { var G = g('b11.g') || {}; G[id] = v; S.d['b11.g'] = G; save(); sfx('flip'); collect(id, true); redrawStep(); }
    else if (a === 'isOpen') { V.isOpen = V.isOpen === id ? '' : id; var o = g('b12.o') || {}; o[id] = 1; S.d['b12.o'] = o; revealIsle(id, true); save(); redrawStep(); }
    else if (a === 'isTag') { var tg = g('b12.t') || {}; tg[id] = v; S.d['b12.t'] = tg; revealIsle(id, true); var nx = null; ISLES.forEach(function (is) { if (!nx && !tg[is.id]) nx = is.id; }); V.isOpen = nx || ''; if (nx) revealIsle(nx, true); save(); redrawStep(); }
    else if (a === 'book') { S.d[k] = v; collect(v, true); save(); redrawStep(); W.scrollTo(0, 0); }
    else if (a === 'bookRe') { delete S.d[k]; delete S.d[k.replace('.b', '.fr')]; save(); redrawStep(); }
    else if (a === 'cmn') { var C = g('b22.g') || {}; C[id] = v; S.d['b22.g'] = C; save(); redrawStep(); }
    else if (a === 'cmnRev') { S.d['b22.rev'] = 1; save(); sfx('ting'); redrawStep(); }
    else if (a === 'ask') { var L = (g('b23.ask') || []).slice(); if (L.indexOf(+v) < 0) L.push(+v); S.d['b23.ask'] = L; save(); redrawStep(); }
    else if (a === 'wind') { var M = g('b32.s') || {}; M[id] = v; S.d['b32.s'] = M; save(); redrawStep(); }
    else if (a === 'nb') openNb('cd');
    else if (a === 'nbClose') closeNb();
    else if (a === 'tab') { NBTAB = b.getAttribute('data-t'); drawNb(); }
    else if (a === 'ovClose') closeOv();
    else if (a === 'ovHome') { closeOv(); go({ v: 'home' }); }
    else if (a === 'demoExit') exitDemo();
  });
  function updIns(k) { var el = APP.querySelector('[data-ins="' + k + '"]'); if (el) el.innerHTML = insOf(k) ? PS.icon('bulb', 14) + ' Viết thật, đủ ý: +' + CD2_INS_FIELD + ' Insight' : PS.icon('bulb', 14) + ' Viết từ ' + CD2_INS_WORDS + ' chữ để có Insight'; }
  D.addEventListener('input', function (e) {
    var t = e.target, k = t.getAttribute && t.getAttribute('data-k'); if (!k) return;
    if (t.type === 'range') { S.d[k] = +t.value; var o = D.getElementById('sureOut'); if (o) o.textContent = t.value + '/10'; var o2 = D.getElementById('sureOut2'); if (o2) o2.textContent = 'Rõ ' + t.value + '/10'; save(); return; }
    S.d[k] = t.value; if (k === 'b61.msg') S.d['b61.ed'] = 1; save(); updIns(k); if (k === 'b61.to') msgSync(); refreshBar();
  });
  function msgSync() { if (g('b61.ed')) return; var ta = D.getElementById('repMsg'); S.d['b61.msg'] = msgTpl(); if (ta && ta.getAttribute('data-k') === 'b61.msg') ta.value = S.d['b61.msg']; }
  function keepY(fn) { var y = W.pageYOffset || 0; fn(); W.scrollTo(0, y); }

  /* thanh trên tự ẩn khi cuộn xuống */
  var lastY = 0, navT = null;
  W.addEventListener('scroll', function () {
    if (navT) return;
    navT = setTimeout(function () {
      navT = null; var y = W.pageYOffset || 0, nav = D.querySelector('.topnav'); if (!nav) return;
      if (y > lastY + 6 && y > 90) nav.classList.add('topnav--hide'); else if (y < lastY - 6 || y < 90) nav.classList.remove('topnav--hide');
      lastY = y;
    }, 80);
  }, { passive: true });

  /* =========================================================
     9. KHỞI ĐỘNG
     ========================================================= */
  try { if (DQ.on) history.replaceState(null, '', W.location.pathname); } catch (e) {}
  if (ASK_DEMO) PS.demoAsk(function (ok) { if (ok) { NOSAVE = 0; enterDemo(); } else W.location.replace(W.location.pathname); });
  else if (WANT_DEMO) enterDemo();
  else {
    markDay();
    if (!S.intro && !S.demo) V = { v: 'intro' };
    render(true); save(true);
  }
})(window, document);
