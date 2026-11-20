/* CD02 · Career Design 2 · Hải Đồ La Bàn · cd02/engine.js · BỘ MÁY: trạng thái, gắn lõi Proskills, hải đồ, bến, chặng, các dạng bước, Sổ tay, demo.
   Luồng: Hải đồ (Sổ Thuyền Trưởng + bản đồ sương mù) → trang bến (lời Shin, ≤3 chặng, con dấu) → trang chặng (mỗi bước một màn).
   Không tuyến tính: Vòng Khám phá (b1, b2) đi thứ tự tùy ý; Vòng Thiết kế lần lượt; Vòng Ra khơi (b5, b6) tùy ý; 8 đảo ghé tự do sau khi nhận thuyền.
   Cảng Khởi Hành (GOAL_PORT, f1–f2) mở khi đủ 7 con dấu bến (PS1.3.42: thêm Bến 6 Phòng Tuyển Dụng, Ngọn Hải Đăng thành Bến 7); xong f2 → S.fin, Bằng Thuyền Trưởng, mở trang phục Thuyền trưởng trong Tủ đồ của Shin.
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
  function blank() { return { v: 2, intro: 0, created: Date.now(), d: {}, done: {}, xp: {}, ins: {}, days: {}, seen: {}, cards: {}, isl: {}, stamp: {}, bak: {} }; }
  function normalize(s) { var b = blank(); for (var k in b) if (s[k] === undefined) s[k] = b[k]; return s; }
  /* PS1.3.42: bài làm bản cũ → bản 2 (Ngọn Hải Đăng b61, b62 → b71, b72; con dấu b6 → b7; chặng gộp b13, b43, b53 bỏ dấu xong riêng) */
  function migrate(s) {
    if ((+s.v || 1) >= 2) return s;
    var d = s.d || {}, nd = {}, k;
    for (k in d) if (d.hasOwnProperty(k)) nd[k.indexOf('b61.') === 0 ? 'b71.' + k.slice(4) : (k.indexOf('b62.') === 0 ? 'b72.' + k.slice(4) : k)] = d[k];
    s.d = nd;
    ['done', 'xp', 'ins', 'bak'].forEach(function (f) { var o = s[f]; if (!o) return; ['b13', 'b43', 'b53'].forEach(function (x) { delete o[x]; });
      if (f === 'bak') { delete o.b61; delete o.b62; return; } if (o.b62 !== undefined) { o.b72 = o.b62; delete o.b62; } if (o.b61 !== undefined) { o.b71 = o.b61; delete o.b61; } });
    ['stamp', 'seen'].forEach(function (f) { var o = s[f]; if (o && o.b6 !== undefined) { o.b7 = o.b6; delete o.b6; } });
    s.v = 2; return s;
  }
  function load() {
    var s = null;
    try { s = (DEMO_ON && !WANT_DEMO) ? PS.get(DEMO_KEY, null) : PS.load(ID); } catch (e) {}
    return (s && typeof s === 'object') ? normalize(migrate(s)) : blank();
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
  /* PS1.3.41: trạng thái CD01 · 'done' xong khóa · 'part' làm dở · 'none' chưa học */
  function cd1State() {
    if (S.demo) return S.cd1 ? 'done' : 'none';
    var s = null; try { s = PS.summary('cd01'); } catch (e) {}
    if (!s) return 'none';
    var x = s.extra || {};
    if (x.endAt || (s.total && s.done >= s.total)) return 'done';
    return (s.done > 0 || hasCd1()) ? 'part' : 'none';
  }
  function cd1Done() { var s = null; try { s = PS.summary('cd01'); } catch (e) {} return s ? [s.done || 0, s.total || 0] : [0, 0]; }
  function arr(v) { return v && v.push ? v.filter(function (x) { return trim(x); }) : (trim(v) ? [trim(v)] : []); }
  function cut1(t, n) { t = trim(t); n = n || 150; return t.length > n ? t.slice(0, n - 1) + '…' : t; }
  /* bài CD01 dùng lại ở CD02; nếu chưa có thì lấy câu trả lời nhanh ở Xuất phát (x1.me, x1.val, x1.good) */
  function c1Val(k) {
    var c = cd1();
    switch (k) {
      case 'main': return c.mainName || '';
      case 'me': return (trim(c.me) || trim(g('x1.me'))).replace(/^5 năm sau,? mình muốn là người\s*/i, '');
      case 'value': return arr(c.value).join(', ') || arr(g('x1.val')).join(', ');
      case 'good': return arr(c.good).join(', ') || arr(g('x1.good')).join(', ');
      case 'like': return arr(c.like).join(', ');
      case 'far': return trim(c.far);
      case 'p2': return trim(c.p2);
      case 'jp2': return trim(c.jp2);
      case 'work': return arr(c.work).join(' · ');
      case 'senpai': return trim(c.senpai);
      case 'learn': return trim(c.learn);
      case 'qs': return arr(c.qs).join(' · ');
      case 'worry': return trim(c.worry);
      case 'b': return trim(c.bName);
      case 'first': return trim(c.first);
      case 'guide': return trim(c.guide);
      case 'habits': return arr(c.habits).join(' ');
      case 'motto': return trim(c.motto);
      case 'letter': return trim(c.letter);
      case 'iv': return trim(c.iv);
    }
    return '';
  }
  function c1HTML(keys) {
    var rows = keys.map(function (k) { var t = c1Val(k); return t ? '<div><small>' + esc(C1_LAB[k] || '') + '</small><b>' + esc(cut1(t)) + '</b></div>' : ''; }).join('');
    return rows ? '<div class="c1"><span class="c1__tag">' + PS.icon('book', 13) + 'Từ CD01</span>' + rows + '</div>' : '';
  }

  function isleOf(id) { for (var i = 0; i < ISLES.length; i++) if (ISLES[i].id === id) return ISLES[i]; return null; }
  function spOf(id) { for (var i = 0; i < SENPAI.length; i++) if (SENPAI[i].id === id) return SENPAI[i]; return null; }
  function benOf(id) { if (id === PORT.id) return PORT; if (id === GOAL_PORT.id) return GOAL_PORT; for (var i = 0; i < BEN.length; i++) if (BEN[i].id === id) return BEN[i]; return null; }
  function fogOpen() { return cnt(S.isl); }
  function fogPct() { return Math.round((1 - fogOpen() / ISLES.length) * 100); }
  function cardN() { return cnt(S.cards); }
  function stampN() { return cnt(S.stamp); }
  function shipLv() { var n = 0; BEN.forEach(function (b) { if (S.stamp[b.id]) n++; }); return n; }
  function flag() { var f = g('x1.flag') || {}; return { s: f.s || 'compass', c: flagCol(f.c || '#D97757') }; }

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
      ring: g('b71.r') || {}, guide: ringName(g('b71.key')), msgTo: g('b71.to') || '', work6: g('b72.w') || {}, learnH: g('b72.h') || '', learnHow: g('b72.how') || '',
      open2: { n: g('f1.n') || '', sure: g('f1.sure') == null ? '' : +g('f1.sure') }, change: g('f1.change') || '', ps: g('f1.ps') || '', fin: S.fin || 0,
      peer: g('b23.who') || '', ad: adSum(), iv: ivSum(), plan3: p3Sum(),
      cd1: cd1State(), carry: (g('x1.carry') || []).map(function (k) { return C1_LAB[k]; }), quick: { me: g('x1.me') || '', val: g('x1.val') || [], good: g('x1.good') || [] } };
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
  var V = { v: 'home' }, nbOpen = false, NBTAB = 'cd', QUIET = false, mapMode = 'ben', openR = {};
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
    var pv = V; V = v; placeIn(pv, v); render(true); delete V.fx; placeOut(pv, v);
  }
  /* PS1.3.43: ra/vào bến, phòng. Vào từ Hải đồ, đảo, thẻ Senpai (không tính khi quay về từ chặng): cảng → chuông thuyền; phòng (room: 1) → chuông cửa + cửa trượt mở trên banner. Ra Hải đồ → tiếng nhẹ đi xuống. Không tiếng sóng. */
  function placeIn(pv, v) {
    if (v.v !== 'ben' || pv.v === 'ben' || pv.v === 'act' || pv.v === 'intro') return;
    var b = benOf(v.st); if (!b) return;
    if (b.room) { if (!rmOn()) v.fx = 'room'; sfx('door'); } else sfx('bell');
  }
  function placeOut(pv, v) { if (pv.v === 'ben' && v.v === 'home') { var b = benOf(pv.st); sfx(b && b.room ? 'shut' : 'out'); } }
  function rmOn() { try { return W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
  W.addEventListener('popstate', function (e) {
    var keep = function () { try { history.pushState(hState(V), ''); } catch (er) {} };
    if (D.getElementById('cdov')) { closeOv(); keep(); return; }
    if (nbOpen) { closeNb(); keep(); return; }
    if (V.v === 'intro') return;
    var h = e.state, pv0 = V;
    if (!h || !h.cd2) V = { v: 'home' };
    else if (h.v === 'act' && ACTS[h.id] && (actOpen(h.id) || S.done[h.id])) V = { v: 'act', id: h.id, step: Math.min(h.step || 0, ACTS[h.id].steps.length - 1) };
    else if (h.v === 'ben' && benOf(h.st)) V = { v: 'ben', st: h.st };
    else if (h.v === 'isle' && isleOf(h.id)) V = { v: 'isle', id: h.id };
    else if (h.v === 'sp' && spOf(h.id)) V = { v: 'sp', id: h.id };
    else V = { v: 'home' };
    QUIET = true; render(false); QUIET = false;
    if (pv0.v === 'ben') placeOut(pv0, V);
    W.scrollTo(0, h && h.y ? h.y : 0);
  });

  /* ---------- âm thanh nhỏ (tự soạn, theo công tắc chung) ---------- */
  var AC = null;
  function ac() { AC = AC || new (W.AudioContext || W.webkitAudioContext)(); if (AC.state === 'suspended' && AC.resume) AC.resume(); return AC; }
  function tone(f, t0, dur, vol, type, f2) { /* một nốt: lên nhanh, tắt dần */
    var C = AC, o = C.createOscillator(), gn = C.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur * .8);
    gn.gain.setValueAtTime(.0001, t0); gn.gain.exponentialRampToValueAtTime(vol, t0 + .012); gn.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
    o.connect(gn); gn.connect(C.destination); o.start(t0); o.stop(t0 + dur + .05);
  }
  function bell(f, t0, dur, vol) { tone(f, t0, dur, vol); tone(f * 2.01, t0, dur * .55, vol * .32); tone(f * 2.76, t0, dur * .3, vol * .14); } /* chuông nhỏ: nốt gốc + 2 bội âm lệch */
  function sfx(k) {
    if (!PS.soundOn()) return;
    try {
      var t = ac().currentTime + .02;
      if (k === 'bell') { bell(784, t, 1.3, .05); bell(784, t + .32, 1.1, .035); return; } /* vào cảng, bến ngoài trời: chuông thuyền 2 tiếng */
      if (k === 'door') { tone(1150, t, .05, .02, 'triangle'); bell(659, t + .06, .9, .045); bell(523, t + .42, 1.1, .042); return; } /* vào phòng: tiếng cửa + chuông pin-pon */
      if (k === 'out') { bell(659, t, .8, .03); bell(523, t + .16, .9, .022); return; } /* rời bến: 2 nốt nhẹ đi xuống */
      if (k === 'shut') { tone(160, t, .12, .05, 'sine', 90); tone(900, t + .01, .04, .012, 'triangle'); return; } /* rời phòng: cửa khép */
      var f = { ting: [880, 1320, .25], flip: [520, 760, .18], horn: [196, 220, .6], stamp: [180, 120, .2], card: [660, 990, .22] }[k] || [600, 800, .2];
      tone(f[0], t, f[2], k === 'horn' ? .05 : .12, k === 'horn' ? 'sawtooth' : 'sine', f[1]);
    } catch (e) {}
  }

  /* =========================================================
     4. MÀN MỞ ĐẦU, HẢI ĐỒ
     ========================================================= */
  function viewIntro() {
    return '<div class="intro">' + '<div class="intro__sea">' + shipSVG(0, 'compass', '#D97757', 180) + '</div>' +
      '<span class="kicker">Career Design 02</span><h1 class="h1">Hải Đồ <em>La Bàn</em></h1>' +
      shinSays('welcome', T(SHIN_TALK.homeNew)) +
      '<p class="intro__sub">Sau 3 năm ở Nhật, mình sẽ đi đâu tiếp? Có rất nhiều hướng. Có những hướng bạn chưa từng nghe tới.</p>' +
      '<button type="button" class="btn btn--go btn--w" data-act="introGo">' + cdIc('anchor', 20) + 'Tới Cảng 3 Năm</button></div>';
  }
  function dmy(t) { var d = new Date(t); return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2); }
  function bookHTML(big) { /* Sổ Thuyền Trưởng (PS1.3.40: bỏ chuỗi ngày, XP, Insight, % sương cho thoáng; các số này vẫn ở Sổ tay. PS1.3.39: sổ bìa da bò, giấy kẻ dòng, ảnh cờ dán băng keo, con dấu kiểu hộ chiếu) */
    var p = prof(), f = flag(), created = new Date(S.created || Date.now()), jn = jobName() === 'bạn chọn' ? 'Chưa chọn' : jobName();
    var st = [PORT].concat(BEN).map(function (b, i) { return '<span class="lbk__st" title="' + esc(b.n) + '">' + (S.stamp[b.id] ? stampHTML(b, 62) : stampEmpty(i + 1, 62)) + '</span>'; }).join('') +
      '<span class="lbk__st lbk__st--fin" title="Cảng Khởi Hành">' + (finDone() ? stampHTML(GOAL_PORT, 62) : '<small>+ Cảng<br>Khởi Hành</small>') + '</span>';
    return '<section class="lbk" aria-label="Sổ Thuyền Trưởng"><div class="lbk__cover"></div><div class="lbk__page"><i class="lbk__rib"></i><span class="lbk__ring" aria-hidden="true">' + new Array(10).join('<i></i>') + '</span>' +
      '<div class="lbk__hd"><b>Sổ Thuyền Trưởng</b><span>Nº 02</span></div>' +
      '<div class="lbk__mid"><div class="polar"><span class="tape"></span><div class="polar__img">' + flagSVG(f.s, f.c, 74, 1) + '</div><small>cờ của tôi</small></div>' +
      '<div class="lbk__who"><small>Thuyền trưởng</small><div class="lbk__nm">' + esc(p.name || '—') + '</div>' +
      '<div class="fld"><span>Nghề</span><i></i><b>' + esc(jn) + '</b></div><div class="fld"><span>Cảng nhà</span><i></i><b>Cảng 3 Năm</b></div></div></div>' +
      (g('x1.motto') ? '<p class="lbk__motto">“' + esc(g('x1.motto')) + '”<svg width="150" height="8" viewBox="0 0 150 8" aria-hidden="true"><path d="M2 5q12-5 24 0t24 0 24 0 24 0 24 0 24 0" fill="none" stroke="#D97757" stroke-width="1.8" stroke-linecap="round"/></svg></p>' : '') +
      '<div class="lbk__sl"><b>Con dấu các bến</b><span>' + stampN() + ' / ' + (BEN.length + 1) + '</span></div><div class="lbk__stamps">' + st + '</div>' +
      '<div class="lbk__ft"><span class="lbk__s">' + cdIc('card', 15) + 'Thẻ Senpai <b>' + cardN() + '/' + SENPAI.length + '</b></span></div>' +
      (big ? '<p class="lbk__date">Nhận thuyền ' + esc(PS.fmtDate ? PS.fmtDate(created) : created.toLocaleDateString('vi-VN')) + '</p>' : '') + '</div></section>';
  }
  function isleLab(n, x, y) { /* PS1.3.40: tên dài xuống 2 dòng */
    var w = n.split(' '), a = n, b = '';
    if (n.length > 12 && w.length > 1) { var best = 99, k; for (k = 1; k < w.length; k++) { var l1 = w.slice(0, k).join(' '), d = Math.abs(l1.length - (n.length - l1.length - 1)); if (d < best) { best = d; a = l1.replace(/,$/, ''); b = w.slice(k).join(' '); } } }
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle" class="mp-t">' + esc(a) + (b ? '<tspan x="' + x + '" dy="12">' + esc(b) + '</tspan>' : '') + '</text>';
  }
  function zoneArt() { /* PS1.3.40: 3 vùng ở mặt Đảo: Việt Nam (trái) · Cả hai nơi (giữa) · Nhật Bản (phải) */
    return '<g class="mp-zone"><rect x="14" y="14" width="107" height="442" fill="' + CD2_COL.peach + '" opacity=".45"/><rect x="239" y="14" width="107" height="442" fill="' + CD2_COL.sage + '" opacity=".55"/><rect x="121" y="14" width="118" height="442" fill="' + CD2_COL.lav + '" opacity=".3"/>' +
      '<path d="M121 40V450M239 40V450" stroke="#141413" stroke-width="1" stroke-dasharray="1 5" stroke-linecap="round" opacity=".6"/>' +
      '<text x="67" y="33" text-anchor="middle" class="mp-z">VIỆT NAM</text><text x="180" y="33" text-anchor="middle" class="mp-z">CẢ HAI NƠI</text><text x="293" y="33" text-anchor="middle" class="mp-z">NHẬT BẢN</text></g>';
  }
  function mapSVG() { /* PS1.3.39: hải đồ giấy, biển xanh xám nhạt, nét mực, đảo tô theo phía, sương tô chấm */
    var h = '<svg class="chart" viewBox="0 0 360 470" role="img" aria-label="Hải đồ: Cảng 3 Năm ở giữa, 7 bến, 8 đảo">', t = '', i;
    h += '<rect x="1" y="1" width="358" height="468" rx="16" fill="#DCE6EC"/><rect x="9" y="9" width="342" height="452" rx="10" fill="none" stroke="#141413" stroke-width="1.6"/><rect x="13" y="13" width="334" height="444" rx="8" fill="none" stroke="#141413" stroke-width=".7"/>';
    for (i = 1; i < 17; i++) t += 'M' + (9 + i * 20) + ' 9v4M' + (9 + i * 20) + ' 457v4';
    for (i = 1; i < 23; i++) t += 'M9 ' + (9 + i * 20) + 'h4M347 ' + (9 + i * 20) + 'h4';
    h += '<path d="' + t + '" stroke="#141413" stroke-width=".8"/><g><path d="M44 110L316 360M316 110L44 360M180 30V440M24 232H336" stroke="#141413" stroke-width=".6" opacity=".25" stroke-dasharray="2 5"/>';
    [[40, 128], [250, 96], [130, 186], [280, 262], [60, 300], [210, 356], [150, 452], [282, 440], [30, 440], [120, 96]].forEach(function (q) { h += aWave(q[0], q[1], 2, 12, .45); });
    h += '<g class="mp-rose">' + roseArt(334, 146, .8) + seaFun(40, 446) + '</g></g>';
    /* đường hải trình nét đứt: cảng → các bến */
    var nx = nextAct(), nb = nx ? ACTS[nx].st : '';
    h += '<g class="mp-rt">';
    BEN.forEach(function (b) {
      var op = benOpen(b), dn = benDone(b), cur = nb === b.id, cx = (PORT.x + b.x) / 2 + (b.x < 180 ? -12 : 12), cy = (PORT.y + b.y) / 2;
      h += '<path d="M' + PORT.x + ' ' + PORT.y + 'Q' + cx + ' ' + cy + ' ' + b.x + ' ' + b.y + '" fill="none" stroke="' + (!op ? '#A8A49A' : (cur ? '#C15F3C' : '#141413')) + '" stroke-width="' + (cur ? 2.4 : 1.6) + '" stroke-dasharray="' + (op || dn ? '5 5' : '2 5') + '" stroke-linecap="round"/>';
    });
    h += '</g>';
    /* đảo (PS1.3.40: chỉ hiện ở mặt Đảo) */
    h += '<g class="mp-isles">' + zoneArt();
    ISLES.forEach(function (is) {
      var on = !!S.isl[is.id];
      h += '<g class="mp-isle" data-act="isle" data-id="' + is.id + '" role="button" aria-label="' + esc(is.n) + (on ? '' : ' (còn sương)') + '"><rect x="' + (is.x - 40) + '" y="' + (is.y - 28) + '" width="80" height="70" fill="transparent"/>' +
        (on ? '<g>' + isleArt(is) + '</g>' : fogArt(is.x, is.y - 1)) +
        isleLab(on ? is.n : '? ? ?', is.x, is.y + 34) + '</g>';
    });
    h += '</g>';
    /* cảng */
    h += '<g class="mp-ben" data-act="ben" data-st="p0" role="button" aria-label="Cảng 3 Năm"><g transform="translate(150 196)">' + CD2_MINI.port() + '</g>' +
      '<g class="mp-lab"><rect x="' + (PORT.x - 42) + '" y="' + (PORT.y + 20) + '" width="84" height="21" rx="10.5" fill="#141413"/><text x="' + PORT.x + '" y="' + (PORT.y + 34.5) + '" text-anchor="middle" class="mp-tn w">Cảng 3 Năm</text></g></g>';
    /* bến */
    BEN.forEach(function (b) {
      var op = benOpen(b), dn = benDone(b), cur = nb === b.id && !dn, tw = Math.round(b.n.length * 6.3 + 22), x = b.x, y = b.y;
      h += '<g class="mp-ben' + (op ? '' : ' lock') + (dn ? ' done' : '') + '" data-act="ben" data-st="' + b.id + '" role="button" aria-label="' + esc(b.n) + '"><rect x="' + (x - 34) + '" y="' + (y - 44) + '" width="68" height="64" fill="transparent"/>' +
        '<g transform="translate(' + (x - 24) + ' ' + (y - 42) + ') scale(.8)"' + (op || dn ? '' : ' opacity=".42"') + '><g>' + CD2_MINI[CD2_PLACE[b.id]]() + '</g></g>' +
        '<g class="mp-lab"><rect x="' + (x - tw / 2) + '" y="' + (y - 2) + '" width="' + tw + '" height="21" rx="10.5" fill="' + (cur ? '#C15F3C' : (op || dn ? '#fff' : '#F3F1EA')) + '" stroke="' + (cur ? '#C15F3C' : (op || dn ? '#141413' : '#B8B2A3')) + '" stroke-width="1.4"/>' +
        '<text x="' + x + '" y="' + (y + 12.5) + '" text-anchor="middle" class="mp-tn' + (cur ? ' w' : (op || dn ? '' : ' off')) + '">' + esc(b.n) + '</text>';
      if (dn) h += '<g transform="translate(' + (x + tw / 2 - 3) + ' ' + (y - 2) + ')"><circle r="7.5" fill="#141413"/><path d="M-3.4 0l2.2 2.4 4.4-4.6" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></g>';
      else if (!op) h += '<g transform="translate(' + (x + tw / 2 - 3) + ' ' + (y - 2) + ')"><circle r="7.5" fill="#fff" stroke="#B8B2A3" stroke-width="1.2"/><path d="M-3 -.5h6v4.2h-6zM-1.8 -.5v-1.6a1.8 1.8 0 0 1 3.6 0v1.6" fill="none" stroke="#8C8577" stroke-width="1.1" stroke-linejoin="round"/></g>';
      h += '</g></g>';
    });
    /* thuyền ở bến đang học */
    h = hand(h); /* PS1.3.40: nét bút sổ tay cho cả hải đồ (trừ thuyền có Shin) */
    var at = nx ? benOf(ACTS[nx].st) : PORT; if (at === GOAL_PORT || at.x == null) at = PORT; var off = at === PORT ? [50, -30] : (at.ship || [44, -30]), sx = at.x + off[0], sy = at.y + off[1], f = flag();
    h += '<g class="mp-ship" transform="translate(' + (sx - 29) + ' ' + (sy - 24) + ')">' + shipSVG(shipLv(), f.s, f.c, 58).replace('<svg class="ship"', '<svg class="ship" x="0" y="0" height="47"') + '</g>';
    return h + '</svg>';
  }
  function trialLive() { var st = g('b53.start'); if (!st) return false; var p = st.split('-'), d0 = new Date(+p[0], +p[1] - 1, +p[2]); return Date.now() - d0.getTime() < 16 * 864e5; }
  function bottleQ() { var L = SENPAI.filter(function (s) { return !!s.q; }), k = Math.floor(Date.now() / 864e5) % L.length; return L[k]; }
  function viewHome() {
    var nx = nextAct(), hi;
    if (!portDone()) hi = SHIN_TALK.homeNew; else if (nx) hi = SHIN_TALK.home[new Date().getDate() % SHIN_TALK.home.length]; else hi = finDone() ? SHIN_TALK.homeFin : SHIN_TALK.homeWait;
    var cta = nx ? '<button type="button" class="btn btn--go btn--w glow" data-act="open" data-id="' + nx + '">' + (doneMain() ? 'Đi tiếp: ' : 'Bắt đầu: ') + esc(ACTS[nx].t) + '</button>' : (finDone() ? '<button type="button" class="btn btn--go btn--w" data-act="certOv">' + cdIc('flag', 20) + 'Xem Bằng Thuyền Trưởng</button>' : '');
    if (trialTxt() && S.done.b63 && trialLive()) cta += '<div class="hometrial">' + trialCard() + '</div>';
    var bq = bottleQ(), ownIs = portDone();
    return '<button type="button" class="pshome" data-act="psHome">' + cdIc('arrowL', 15, 2.4) + 'Proskills</button>' +
      shinSays(nx ? 'hi' : 'cheer', T(hi)) + bookHTML() + '<div class="cta">' + cta + '</div>' +
      '<div class="maphd"><h2 class="sec-h">Hải đồ La Bàn</h2><div class="seg" role="group" aria-label="Mặt hải đồ">' +
      '<button type="button" class="seg__b' + (mapMode === 'ben' ? ' on' : '') + '" data-act="mapMode" data-v="ben" aria-pressed="' + (mapMode === 'ben') + '">' + cdIc('anchor', 15) + 'Bến</button>' +
      '<button type="button" class="seg__b' + (mapMode === 'isl' ? ' on' : '') + '" data-act="mapMode" data-v="isl" aria-pressed="' + (mapMode === 'isl') + '">' + cdIc('compass', 15) + 'Đảo <small>' + fogOpen() + '/8</small></button></div></div>' +
      '<p class="sec-sub" id="mapSub">' + mapSub(ownIs) + '</p>' +
      '<div class="chartbox' + (mapMode === 'isl' ? ' isl-on' : '') + '" id="chartbox">' + mapSVG() + '<div class="fogbar"><span>' + esc(SHIN_TALK.fogT) + ' <b>' + (100 - fogPct()) + '%</b> · ' + fogOpen() + '/8 đảo</span><i><b style="width:' + (100 - fogPct()) + '%"></b></i></div></div>' +
      '<h2 class="sec-h">Các bến</h2><p class="sec-sub">Chạm một vòng để xem các bến</p>' +
      [1, 2, 3, 4].map(rndHTML).join('') +
      (bq ? '<button type="button" class="bottle" data-act="sp" data-id="' + bq.id + '"><span class="bottle__ic">' + cdIc('bottle', 22) + '</span><span><small>' + esc(SHIN_TALK.bottle) + '</small><q>' + esc(bq.q) + '</q><b>' + esc(bq.n) + (bq.jl ? ' · ' + esc(bq.jl) : '') + '</b></span></button>' : '') +
      '<p class="foot">Proskills · Career Design 02 · Hải Đồ La Bàn · ' + esc(CD2_VER) + '<br>Bài làm tự lưu trên trình duyệt của máy này</p>';
  }
  function mapSub(ownIs) { return !ownIs ? 'Nhận thuyền ở Cảng 3 Năm để ra khơi' : (mapMode === 'isl' ? 'Chạm đảo để xem hướng đi' : 'Chạm bến để học · bật mặt Đảo để xem 8 hướng đi'); }
  function rndHTML(r) { /* PS1.3.40: mỗi vòng là một hàng gấp, mặc định đóng */
    var L = r === 4 ? [GOAL_PORT] : BEN.filter(function (b) { return b.r === r; }), nxa = nextAct(), here = false, nd = 0;
    L.forEach(function (b) { if (b === GOAL_PORT ? finDone() : benDone(b)) nd++; if (nxa && ACTS[nxa].st === b.id) here = true; });
    var p = r === 4 ? ['Đích', 'nhận Bằng Thuyền Trưởng'] : ROUNDS[r].split(' · '), on = !!openR[r];
    return '<div class="rgrp' + (on ? ' on' : '') + '" id="rg' + r + '"><button type="button" class="rgrp__h" data-act="rnd" data-v="' + r + '" aria-expanded="' + on + '"><i style="background:' + roundBg(r) + '"></i>' +
      '<span class="rgrp__t"><b>' + esc(p[0]) + '</b><small>' + esc(p[1] || '') + '</small></span>' + (here ? '<em>Đang đi</em>' : '') +
      '<span class="rgrp__n">' + (r === 4 ? (nd ? 'Đã xong' : '') : nd + '/' + L.length) + '</span>' + PS.icon('next', 16) + '</button>' +
      '<div class="rgrp__b"><div class="bens">' + L.map(benCard).join('') + '</div></div></div>';
  }
  function benCard(b) { /* PS1.3.39: thẻ hàng ngang, ô tranh nơi chốn theo tông vòng */
    var isG = b === GOAL_PORT, op = benOpen(b), dn = isG ? finDone() : benDone(b), nd = b.acts.filter(function (a) { return !!S.done[a]; }).length, nxa = nextAct(), nx = !dn && nxa && ACTS[nxa].st === b.id;
    var mins = b.acts.reduce(function (t, a) { return t + ACTS[a].mins; }, 0);
    var badge = dn ? '<span class="badge badge--ok">' + PS.icon('check', 12, 3) + (isG ? 'Đã nhận bằng' : 'Có dấu') + '</span>' : (op ? '<span class="badge">' + (nd ? nd + '/' + b.acts.length + ' chặng' : 'Mở') + '</span>' : '<span class="badge badge--soon">' + PS.icon('lock', 12) + (b.ready ? 'Chưa mở' : 'Sắp mở') + '</span>');
    var tag = op || dn ? 'button type="button" data-act="ben" data-st="' + b.id + '"' : 'button type="button" data-act="lockMsg" data-st="' + b.id + '"';
    if (isG && !op && !dn) tag = 'button type="button" data-act="lockMsg" data-st="fin"';
    return '<' + tag + ' class="bcard' + (op || dn ? '' : ' bcard--lock') + (dn ? ' bcard--done' : '') + (nx ? ' bcard--next' : '') + '"><span class="bcard__ic" style="background:' + roundBg(b.r) + '">' + miniArt(CD2_PLACE[b.id], 58) + '</span>' +
      '<span class="bcard__b"><b>' + esc(b.n) + '</b><small>' + esc(b.sub) + '</small><span class="bcard__m"><small>' + (isG && !op && !dn ? 'Đủ ' + BEN.length + ' con dấu để mở' : b.acts.length + ' chặng · ' + mins + ' phút') + '</small>' + badge + '</span></span></button>';
  }

  /* ---------- trang bến ---------- */
  function viewBen() {
    var b = benOf(V.st), first = !S.seen[b.id];
    if (first) { S.seen[b.id] = 1; V.showIntro = 1; save(); }
    var nd = b.acts.filter(function (a) { return !!S.done[a]; }).length;
    var h = '<button type="button" class="back" data-act="home">' + cdIc('arrowL', 18, 2.4) + 'Hải đồ</button>' +
      '<section class="bnr' + (V.fx === 'room' ? ' bnr--door' : '') + '"><div class="bnr__art">' + sceneSVG(CD2_PLACE[b.id], roundBg(b.r), 150, b.id === 'b6' ? ivWho().id : null) + (V.fx === 'room' ? '<i class="bnr__dr" aria-hidden="true"><b></b><b></b></i>' : '') + '</div><div class="bnr__b"><div class="bnr__lab">' + esc(benLabel(b)) + (b.r ? ' · ' + esc(ROUNDS[b.r].split(' · ')[0]) : '') + '</div><h1>' + esc(b.n) + '</h1>' + (b.sub ? '<p>' + esc(b.sub) + '</p>' : '') +
      '<div class="bnr__bar"><span>' + nd + '/' + b.acts.length + ' chặng</span><i><b style="width:' + Math.round(nd / b.acts.length * 100) + '%"></b></i><span>' + b.acts.reduce(function (t, a) { return t + ACTS[a].mins; }, 0) + ' phút</span></div></div></section>';
    h += (first || V.showIntro) ? shinSays('hi', T(b.intro)) : '<button type="button" class="shinmini" data-act="showIntro">' + shin2('hi', 34) + '<span><b>Thuyền trưởng Shin</b> · Xem lời Shin</span></button>';
    h += '<div class="acts">' + b.acts.map(function (id, i) {
      var a = ACTS[id], dn = !!S.done[id], nx = !dn && nextAct() === id, bk = !!S.bak[id];
      return '<button type="button" class="act' + (nx ? ' act--next' : '') + (dn ? ' act--done' : '') + '" data-act="' + (dn ? 'actMenu' : 'open') + '" data-id="' + id + '"><span class="act__n">' + (dn && !bk ? PS.icon('check', 20, 3) : (i + 1)) + '</span><span><b>' + (b === PORT ? '' : 'Chặng ' + (i + 1) + ' · ') + esc(a.t) + '</b><small>' + esc(a.d) + '</small>' +
        '<span class="act__meta">' + PS.icon('clock', 13) + a.mins + ' phút' + (nx ? '<span class="chip-go">Tiếp theo ' + PS.icon('next', 13, 2.6) + '</span>' : (bk ? '<span class="badge badge--soon">Đang làm lại</span>' : (dn ? '<span class="badge badge--ok">Xong</span>' : ''))) + '</span></span></button>' +
        (bk ? '<p class="restore"><button type="button" class="link" data-act="actRestore" data-id="' + id + '">Khôi phục bài cũ</button></p>' : '');
    }).join('') + '</div>';
    if (b === GOAL_PORT) return h + '<button type="button" class="stampbox' + (finDone() ? ' on' : '') + '" data-act="' + (finDone() ? 'certOv' : 'noop') + '"><span class="stampbox__ic">' + (finDone() ? stampHTML(b) : PS.icon('lock', 22)) + '</span><span><b>Bằng Thuyền Trưởng</b><small>' + (finDone() ? 'Chạm để xem bằng' : 'Xong 2 chặng để nhận bằng') + '</small></span></button>';
    var dnB = b === PORT ? portDone() : benDone(b);
    h += '<div class="stampbox' + (dnB ? ' on' : '') + '"><span class="stampbox__ic">' + (dnB ? stampHTML(b) : PS.icon('lock', 22)) + '</span><span><b>' + esc(SHIN_TALK.stampT) + ' · ' + esc(b.n) + '</b><small>' + (dnB ? 'Đã đóng vào Sổ Thuyền Trưởng' : 'Xong ' + b.acts.length + ' chặng để nhận dấu') + '</small></span></div>';
    return h;
  }
  function stampHTML(b, w) { /* con dấu kiểu hộ chiếu, có ngày đóng */
    var isG = b === GOAL_PORT, i = b === PORT ? 0 : (isG ? BEN.length + 1 : BEN.indexOf(b) + 1), t = isG ? S.fin : S.stamp[b.id];
    return stampArt(i, b.ic, b === PORT ? 'CẢNG' : (isG ? 'ĐÍCH' : 'BẾN ' + i), t > 1e9 ? dmy(t) : '', w || 60);
  }

  /* ---------- trang đảo, thẻ Senpai ---------- */
  function revealIsle(id, quiet) { if (!id || S.isl[id] || !portDone()) return false; S.isl[id] = Date.now(); save(); if (!quiet) PS.toast(cdIc('compass', 16) + ' Đảo mới: <b>' + esc(isleOf(id).n) + '</b>'); return true; }
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
      '<section class="bnr"><div class="bnr__art">' + sceneSVG('isle', '#DCE6EC', 150, is) + '</div><div class="bnr__b"><div class="bnr__lab">' + esc(ISLE_SIDE[is.side]) + '</div><h1>' + esc(is.n) + '</h1><p>' + esc(is.sub) + '</p></div></section>';
    if (!portDone()) h += shinSays('wink', 'Nhận thuyền ở Cảng 3 Năm trước, rồi mình ghé đảo này nhé!');
    h += isleInfo(is) + pathHTML(is, 1);
    h += '<h2 class="sec-h">Anh chị đã đi hướng này</h2><p class="sec-sub">Chạm thẻ để đọc chuyện</p><div class="spgrid">' + is.who.map(function (id) { return spCard(spOf(id)); }).join('') + '</div>';
    if (is.who.length < 3) h += '<p class="ps-small note">Đảo này còn ít chuyện công khai. Bạn biết anh chị nào đi hướng này? Kể thầy cô nghe nhé.</p>';
    return h;
  }
  function isleInfo(is) {
    return '<div class="isinfo"><p>' + esc(is.what) + '</p><div class="isinfo__g"><div><b>' + cdIc('tool', 16) + 'Cần gì</b><ul>' + is.need.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
      '<div><b>' + PS.icon('star', 16) + 'Được gì</b><p>' + esc(is.gain) + '</p></div><div><b>' + cdIc('wave', 16) + 'Phải chịu</b><p>' + esc(is.cost) + '</p></div></div></div>';
  }
  function pathHTML(is, open) { /* PS1.3.42: Các bước thường gặp (Lộ trình thật) */
    var P = ISLE_PATH[is.id]; if (!P) return '';
    return '<details class="path"' + (open ? ' open' : '') + '><summary>' + cdIc('stairs', 16) + 'Các bước thường gặp</summary><ol>' + P.L.map(function (x) { return '<li><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></li>'; }).join('') + '</ol>' +
      (P.ik ? '<p class="path__ik">' + esc(IKUSEI.t) + ' <a href="' + esc(IKUSEI.src[1]) + '" target="_blank" rel="noopener">Nguồn</a></p>' : '') +
      '<p class="path__ft">Đường hay gặp, không phải điều kiện đầy đủ. Điều kiện đổi theo ngành và theo năm.</p>' +
      P.src.map(function (x) { return '<a class="srclink" href="' + esc(x[1]) + '" target="_blank" rel="noopener">' + cdIc('link', 15) + esc(x[0]) + '</a>'; }).join('') + '</details>';
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
      '<p class="ps-small">Khóa học tóm tắt từ bài đã đăng. Câu trong ngoặc kép là nguyên văn.</p></div>';
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
    if (S.bak[id] && i === 0) h += '<div class="redo redo--new">' + PS.icon('info', 16) + esc(SHIN_TALK.redoNew) + '</div>';
    else if (S.done[id] && i === 0) h += '<div class="redo">' + PS.icon('check', 16, 3) + esc(SHIN_TALK.redo) + '</div>';
    h += '<div id="stepBody">' + stepHTML(s, id) + '</div>';
    h += '<div class="sbar"><button type="button" class="sbar__st' + (miss ? ' miss' : '') + '" id="sbarSt">' + (miss ? esc(miss) : 'Sẵn sàng!') + '</button>' +
      '<button type="button" class="btn" id="sbarGo" data-act="' + (last ? 'finish' : 'next') + '"' + (miss ? ' disabled' : '') + '>' + (last ? esc(a.btn || 'Đóng dấu chặng') : 'Tiếp tục') + '</button></div>';
    if (i > 0) h += '<p class="prevlink"><button type="button" class="link" data-act="prev">Xem lại bước trước</button></p>';
    return h;
  }
  function stepHTML(s, id) { return (s.c1 ? c1HTML(s.c1) : '') + (STEP[s.k] ? STEP[s.k](s, id) : ''); }
  function check(s) { return CHECK[s.k] ? CHECK[s.k](s) : ''; }
  function refreshBar() {
    var s = ACTS[V.id].steps[V.step], miss = check(s), st = D.getElementById('sbarSt'), gb = D.getElementById('sbarGo');
    if (!st || !gb) return;
    st.className = 'sbar__st' + (miss ? ' miss' : ''); st.textContent = miss || 'Sẵn sàng!'; gb.disabled = !!miss;
  }
  function redrawStep() { var b = D.getElementById('stepBody'); if (!b) return; var s = ACTS[V.id].steps[V.step]; b.innerHTML = stepHTML(s, V.id); refreshBar(); afterStep(); }
  function afterStep() { /* thanh trượt: cập nhật la bàn ngay khi kéo */
    var sl = APP.querySelectorAll('input[type=range][data-pair]');
    for (var i = 0; i < sl.length; i++) sl[i].addEventListener('input', onSlide);
    var sel = D.getElementById('repT');
    if (sel) sel.addEventListener('change', function () { if (sel.value) { PS.setProfile({ teacher: sel.value }); redrawStep(); } });
  }
  function words(t) { t = trim(t); return t ? t.split(/\s+/).length : 0; }
  function insOf(key) { return words(g(key)) >= CD2_INS_WORDS ? CD2_INS_FIELD : 0; }
  function tipsHTML(key, tips) { /* PS1.3.41: thầy chốt ẩn hết chip gợi ý ở CD02, chỉ giữ ví dụ mờ ở vài câu khó (ph trong content.js) */
    if (!W.CD2_TIPS_ON || !tips || !tips.length) return '';
    return '<div class="tips"><small>Chạm để dùng gợi ý, rồi sửa theo ý bạn</small>' + tips.map(function (t) { return '<button type="button" class="tip" data-act="tip" data-k="' + esc(key) + '" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>';
  }
  function areaHTML(key, ph, rows, max) {
    var v = g(key) || '';
    return '<textarea class="ta ps-sel" data-k="' + esc(key) + '" rows="' + (rows || 3) + '" maxlength="' + (max || 400) + '" placeholder="' + esc(ph || '') + '">' + esc(v) + '</textarea>' +
      '<div class="insline" data-ins="' + esc(key) + '">' + insTxt(key) + '</div>';
  }
  function insTxt(key) { return insOf(key) ? PS.icon('bulb', 14) + ' +' + CD2_INS_FIELD + ' Insight' : ''; } /* PS1.3.41: bỏ dòng nhắc dưới ô, chỉ hiện khi đã được điểm */
  function opt(key, v, t, on, act) { return '<button type="button" class="opt' + (on ? ' on' : '') + '" data-act="' + (act || 'pick') + '" data-k="' + esc(key) + '" data-v="' + esc(v) + '" aria-pressed="' + on + '"><span class="dot">' + (on ? PS.icon('check', 13, 3.2) : '') + '</span><span>' + esc(t) + '</span></button>'; }
  function qh(t, sub) { return '<h2 class="q">' + T(esc(t)) + '</h2>' + (sub ? '<p class="qsub">' + T(esc(sub)) + '</p>' : ''); }

  var STEP = {}, CHECK = {};
  STEP.say = function (s) { return shinSays(s.mood || 'hi', '<p>' + Q(s.t) + '</p>' + (s.t2 ? '<p>' + Q(s.t2) + '</p>' : ''), 76); };
  STEP.write = function (s) { return qh(s.q, s.sub) + areaHTML(s.key, s.ph, 3) + tipsHTML(s.key, s.tips); };
  CHECK.write = function (s) { return trim(g(s.key)).length >= (s.min || 6) ? '' : 'Viết vài chữ nhé'; };

  /* ----- Xuất phát ----- */
  STEP.from = function () { /* PS1.3.41: mang bài CD01 lên thuyền; chưa xong CD01 thì khuyên học CD01 trước */
    var st = cd1State(), h = '';
    if (st === 'done') {
      var CR = g('x1.carry') || [], avail = C1_CARRY.filter(function (k) { return !!c1Val(k); });
      h += shinSays('moved', '<p>Shin còn giữ bài CD01 của bạn. Chọn 3 điều bạn muốn mang theo lên thuyền nhé.</p>', 64) +
        '<div class="carry">' + avail.map(function (k) { var on = CR.indexOf(k) > -1;
          return '<button type="button" class="cry' + (on ? ' on' : '') + '" data-act="carry" data-v="' + k + '" aria-pressed="' + on + '"><span class="cry__ck">' + (on ? PS.icon('check', 13, 3.2) : '') + '</span><small>' + esc(C1_LAB[k]) + '</small><b>' + esc(cut1(c1Val(k), 110)) + '</b></button>'; }).join('') + '</div>';
      if (!jobKey() || g('x1.job')) h += jobPick();
      else h += '<button type="button" class="link" data-act="pick" data-k="x1.job" data-v="' + esc(jobKey()) + '">Đổi nghề khác</button>';
      return h;
    }
    if (!g('x1.skip')) {
      var dn = cd1Done();
      return shinSays('think', '<p>' + (st === 'part' ? 'Bạn đang học dở CD01 (' + dn[0] + '/' + dn[1] + ' chặng).' : 'Bạn chưa học CD01.') + ' Học xong CD01 trước, CD02 sẽ dùng lại bài của bạn và học liền mạch hơn.</p>', 64) +
        '<div class="c1go"><a class="btn btn--w" href="../cd01/">' + PS.icon('book', 18) + 'Sang học CD01</a>' +
        '<button type="button" class="btn btn--soft btn--w" data-act="pick" data-k="x1.skip" data-v="1">Vẫn vào CD02</button></div>';
    }
    var c = cd1(), V2 = g('x1.val') || [], G2 = g('x1.good') || [];
    h += shinSays('hi', '<p>Vậy bạn trả lời nhanh mấy câu này nhé. CD02 sẽ dùng lại.</p>', 60);
    if (!jobKey() || g('x1.job')) h += jobPick();
    if (!trim(c.me)) h += qh('5 năm sau, bạn muốn là người thế nào?') + '<input class="inp ps-sel" data-k="x1.me" maxlength="80" value="' + esc(g('x1.me') || '') + '">';
    if (!arr(c.value).length) h += qh('Điều gì quan trọng nhất với bạn?') + '<div class="chips">' + C1_VALS.map(function (t) { return '<button type="button" class="chip' + (V2.indexOf(t) > -1 ? ' on' : '') + '" data-act="multi2" data-k="x1.val" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>';
    if (!arr(c.good).length) h += qh('Bạn mạnh ở điểm nào?') + '<div class="chips">' + C1_GOOD.map(function (t) { return '<button type="button" class="chip' + (G2.indexOf(t) > -1 ? ' on' : '') + '" data-act="multi2" data-k="x1.good" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>';
    return h;
  };
  function jobPick() {
    var v = g('x1.job') || '';
    return qh('Nghề bạn định làm ở Nhật') + '<div class="chips">' + INDS2.map(function (x) { return '<button type="button" class="chip' + (v === x[0] ? ' on' : '') + '" data-act="pick" data-k="x1.job" data-v="' + x[0] + '">' + esc(x[1]) + '</button>'; }).join('') +
      '<button type="button" class="chip' + (v === 'u' ? ' on' : '') + '" data-act="pick" data-k="x1.job" data-v="u">Chưa biết</button></div>';
  }
  CHECK.from = function () {
    var job = jobKey() || g('x1.job') === 'u', c = cd1();
    if (cd1State() === 'done') { var n = C1_CARRY.filter(function (k) { return !!c1Val(k); }).length, cr = (g('x1.carry') || []).length;
      if (cr < Math.min(3, n)) return 'Chọn ' + Math.min(3, n) + ' điều mang theo (' + cr + ')'; return job ? '' : 'Chọn nghề của bạn'; }
    if (!g('x1.skip')) return 'Chọn học CD01 trước hoặc vào CD02';
    if (!job) return 'Chọn nghề của bạn';
    if (!trim(c.me) && trim(g('x1.me')).length < 4) return 'Viết bạn muốn là người thế nào';
    if (!arr(c.value).length && !(g('x1.val') || []).length) return 'Chọn điều quan trọng nhất';
    if (!arr(c.good).length && !(g('x1.good') || []).length) return 'Chọn điểm mạnh';
    return '';
  };
  STEP.flag = function (s) {
    var f = g('x1.flag') || {};
    return qh(s.q) + '<div class="flagbox">' + flagMast(f.s || 'compass', f.c || '#0F9F98') + '</div>' +
      '<h3 class="qs">Biểu tượng</h3><div class="symgrid">' + FLAG_SYM.map(function (x) { return '<button type="button" class="sym' + (f.s === x[0] ? ' on' : '') + '" data-act="flagSym" data-v="' + x[0] + '" aria-label="' + esc(x[1]) + '"><svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">' + flagSym(x[0], '#141413') + '</svg><small>' + esc(x[1]) + '</small></button>'; }).join('') + '</div>' +
      '<h3 class="qs">Màu cờ</h3><div class="colrow">' + FLAG_COL.map(function (x) { return '<button type="button" class="col' + (flagCol(f.c) === x[0] ? ' on' : '') + '" data-act="flagCol" data-v="' + x[0] + '" style="background:' + x[0] + '" aria-label="' + esc(x[1]) + '"></button>'; }).join('') + '</div>' +
      '<h3 class="qs">Khẩu hiệu của thủy thủ đoàn</h3><input class="inp ps-sel" data-k="x1.motto" maxlength="40" value="' + esc(g('x1.motto') || '') + '" placeholder="Ví dụ: Đi chậm mà chắc">' + tipsHTML('x1.motto', MOTTO_TIPS);
  };
  CHECK.flag = function () { var f = g('x1.flag') || {}; if (!f.s) return 'Chọn biểu tượng'; if (!f.c) return 'Chọn màu cờ'; return trim(g('x1.motto')).length >= 3 ? '' : 'Viết khẩu hiệu'; };
  STEP.open1 = function (s) {
    var n = g('x1.n') || '', su = g('x1.sure') == null ? 5 : +g('x1.sure');
    return qh(s.q) + '<div class="chips">' + OPEN_N.map(function (x) { return '<button type="button" class="chip' + (n === x[0] ? ' on' : '') + '" data-act="pick" data-k="x1.n" data-v="' + x[0] + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>' +
      qh(s.q2) + '<div class="slide1"><input type="range" min="0" max="10" step="1" value="' + su + '" data-k="x1.sure" aria-label="Rõ mấy phần"><div class="slide1__l"><span>Chưa rõ gì</span><b id="sureOut">' + su + '/10</b><span>Rất rõ</span></div></div>' +
      qh(s.q3) + areaHTML('x1.now', s.ph, 2) + '<p class="ps-small">Cuối khóa Shin hỏi lại 2 câu này.</p>';
  };
  CHECK.open1 = function () { if (!g('x1.n')) return 'Chọn số hướng'; return trim(g('x1.now')).length >= 3 ? '' : 'Viết điều bạn nghĩ'; };
  STEP.card = function (s) { return shinSays('proud', '<p>' + Q(s.t) + '</p>', 64) + bookHTML(1) + '<div class="shipwrap">' + shipSVG(0, flag().s, flag().c, 200) + '</div>'; };

  /* ----- Bến 1 ----- */
  function shuffled(a, seed) { var r = a.slice(), x = seed || 7; for (var i = r.length - 1; i > 0; i--) { x = (x * 9301 + 49297) % 233280; var j = Math.floor(x / 233280 * (i + 1)); var t = r[i]; r[i] = r[j]; r[j] = t; } return r; }
  STEP.flip = function () {
    var G = g('b11.g') || {};
    return '<div class="flips">' + FLIP.map(function (id, k) {
      var sp = spOf(id), gv = G[id], is = isleOf(sp.isl);
      if (!gv) return '<div class="flip"><div class="flip__front"><span class="spc__av">' + esc(initials(sp.n)) + '</span><div><b>' + esc(sp.n) + '</b><small>' + esc([sp.job, sp.jl].filter(Boolean).join(' · ')) + '</small></div></div>' +
        '<p class="flip__kd">' + esc(sp.kd) + '</p><p class="flip__q">Sau 3 năm, ' + esc(sp.a.toLowerCase()) + ' đi hướng nào?</p><div class="flip__opts">' +
        shuffled(FLIP_OPTS[id], k + 3).map(function (iid) { var x = isleOf(iid); return '<button type="button" class="isbtn" data-act="flipGuess" data-id="' + id + '" data-v="' + iid + '">' + cdIc(x.ic, 16) + esc(x.n) + '</button>'; }).join('') + '</div></div>';
      var hit = gv === sp.isl;
      return '<div class="flip flip--open"><div class="flip__front"><span class="spc__av">' + esc(initials(sp.n)) + '</span><div><b>' + esc(sp.n) + '</b><small>' + esc([sp.job, sp.jl].filter(Boolean).join(' · ')) + '</small></div></div>' +
        '<div class="flip__res"><span class="tagres' + (hit ? ' hit' : '') + '">' + (hit ? 'Bạn đoán trúng!' : 'Bất ngờ chưa?') + '</span><small>Bạn đoán: ' + esc(isleOf(gv).n) + '</small></div>' +
        '<p class="flip__isle">' + cdIc(is.ic, 16) + '<b>' + esc(is.n) + '</b></p><p class="flip__nay">' + esc(sp.nay) + '</p>' +
        '<button type="button" class="link" data-act="sp" data-id="' + sp.id + '">Đọc trọn chuyện</button></div>';
    }).join('') + '</div>';
  };
  CHECK.flip = function () { var G = g('b11.g') || {}, n = 0; FLIP.forEach(function (id) { if (G[id]) n++; }); return n >= FLIP.length ? '' : 'Lật đủ ' + FLIP.length + ' thẻ (' + n + '/' + FLIP.length + ')'; };
  STEP.flipsum = function () {
    var G = g('b11.g') || {}, hit = 0; FLIP.forEach(function (id) { if (G[id] === spOf(id).isl) hit++; });
    var sur = FLIP.length - hit;
    return shinSays(sur >= 3 ? 'wow' : 'cheer', '<p>Bạn đoán trúng <b>' + hit + '/' + FLIP.length + '</b>. Có <b>' + sur + '</b> hướng đi làm bạn bất ngờ.</p><p>' + (sur >= 3 ? 'Nghĩa là còn nhiều hướng bạn chưa biết. Mình đi tiếp nhé!' : 'Bạn đoán giỏi ghê! Đi tiếp để xem kỹ hơn nhé.') + '</p>', 76) +
      '<div class="fogmini"><b>' + fogOpen() + '/8</b><span>đảo đã hiện trên hải đồ</span></div>' +
      '<p class="ps-small">Thẻ Senpai đã cất vào Sổ tay.</p>';
  };
  STEP.isles = function () {
    var tg = g('b12.t') || {}, op = V.isOpen || '';
    return '<div class="isles">' + ISLES.map(function (is) {
      var t = tg[is.id], open = op === is.id, lab = ''; TAG3.forEach(function (x) { if (x[0] === t) lab = x[1]; });
      return '<div class="isl' + (open ? ' open' : '') + (t ? ' tagged' : '') + '"><button type="button" class="isl__h" data-act="isOpen" data-id="' + is.id + '" aria-expanded="' + open + '"><span class="isl__ic">' + cdIc(is.ic, 20) + '</span><span><b>' + esc(is.n) + '</b><small>' + esc(is.sub) + '</small></span>' +
        (t ? '<span class="badge badge--ok">' + esc(lab) + '</span>' : '<span class="badge">Chạm xem</span>') + '</button>' +
        (open ? '<div class="isl__b"><small class="side">' + esc(ISLE_SIDE[is.side]) + '</small>' + isleInfo(is) + pathHTML(is, 0) + '<p class="who"><small>Đã có người đi:</small> ' + is.who.map(function (id) { var sp = spOf(id); return '<button type="button" class="whochip" data-act="sp" data-id="' + id + '">' + esc(sp.a) + '</button>'; }).join('') + '</p>' +
          '<p class="qs">Bạn thấy hướng này…</p><div class="tag3">' + TAG3.map(function (x) { return '<button type="button" class="tag' + (t === x[0] ? ' on' : '') + '" data-act="isTag" data-id="' + is.id + '" data-v="' + x[0] + '">' + PS.icon(x[2], 15) + esc(x[1]) + '</button>'; }).join('') + '</div></div>' : '') + '</div>';
    }).join('') + '</div>';
  };
  CHECK.isles = function () { var tg = g('b12.t') || {}, n = 0; ISLES.forEach(function (is) { if (tg[is.id]) n++; }); return n >= ISLES.length ? '' : 'Gắn nhãn đủ 8 hướng (' + n + '/8)'; };
  STEP.pickisle = function (s) {
    var tg = g('b12.t') || {}, v = g(s.key);
    var L = ISLES.slice().sort(function (a, b) { var r = { cur: 0, 'new': 1, no: 2 }; return (r[tg[a.id]] == null ? 3 : r[tg[a.id]]) - (r[tg[b.id]] == null ? 3 : r[tg[b.id]]); });
    return qh(s.q, s.sub) + '<div class="opts">' + L.map(function (is) { var lab = ''; TAG3.forEach(function (x) { if (x[0] === tg[is.id]) lab = ' · ' + x[1]; }); return opt(s.key, is.id, is.n + lab, v === is.id); }).join('') + '</div>';
  };
  CHECK.pickisle = function (s) { return g(s.key) ? '' : 'Chọn một hướng'; };

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
    if (!v) return h + '<div class="spgrid">' + L.slice(0, 8).map(function (sp) { return '<button type="button" class="spc" data-act="book" data-k="' + key + '" data-v="' + sp.id + '"><span class="spc__av">' + esc(initials(sp.n)) + '</span><span class="spc__b"><b>' + esc(sp.n) + '</b><small>' + esc(sp.job) + (sp.jl ? ' · ' + esc(sp.jl) : '') + '</small><em>' + esc(sp.tag) + '</em></span></button>'; }).join('') + '</div>';
    var sp = spOf(v), fr = g(fk);
    return h + spBody(sp) + '<h3 class="qs">Đoạn nào làm bạn nhớ nhất?</h3><div class="chips">' + [['kd', 'Khởi đầu'], ['bn', 'Bước ngoặt'], ['nay', 'Hôm nay']].map(function (x) { return '<button type="button" class="chip' + (fr === x[0] ? ' on' : '') + '" data-act="pick" data-k="' + fk + '" data-v="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div>' +
      '<button type="button" class="link" data-act="bookRe" data-k="' + key + '">Chọn người khác</button>';
  };
  CHECK.book = function (s) { if (!g('b21.b' + s.n)) return 'Chọn một người'; return g('b21.fr' + s.n) ? '' : 'Chọn một đoạn'; };
  function fCount(fid) { var n = 0; SENPAI.forEach(function (sp) { if (sp.f.indexOf(fid) > -1) n++; }); return n; }
  STEP.common = function () {
    var G = g('b22.g') || {}, rev = !!g('b22.rev'), all = true;
    var h = '<p class="qsub">Điều này có ở <b>nhiều</b> anh chị hay <b>ít</b> người?</p><div class="cmn">' + CD2_F.map(function (f) {
      var v = G[f[0]]; if (!v) all = false;
      var n = fCount(f[0]), pct = Math.round(n / SENPAI.length * 100);
      return '<div class="cmn__r"><b>' + esc(f[1]) + '</b><div class="seg2"><button type="button" class="' + (v === 'm' ? 'on' : '') + '" data-act="cmn" data-id="' + f[0] + '" data-v="m">Nhiều người</button><button type="button" class="' + (v === 'f' ? 'on' : '') + '" data-act="cmn" data-id="' + f[0] + '" data-v="f">Ít người</button></div>' +
        (rev ? '<div class="bar"><i style="width:' + pct + '%"></i><span>' + n + '/' + SENPAI.length + ' người</span></div>' : '') + '</div>';
    }).join('') + '</div>';
    if (!rev) h += '<button type="button" class="btn btn--soft btn--w" data-act="cmnRev"' + (all ? '' : ' disabled') + '>' + (all ? 'Xem Shin đếm' : 'Đoán đủ 8 dòng để xem Shin đếm') + '</button>';
    else h += shinSays('think', '<p>Shin đếm từ ' + SENPAI.length + ' chuyện trong khóa. Gần như ai cũng <b>giỏi tiếng Nhật</b>. Nhiều người <b>từng đổi hướng</b>. Còn <b>có sẵn nhiều tiền</b> thì Shin không thấy ai kể.</p>', 60) + '<p class="ps-small">Shin chỉ đếm điều bài viết có kể.</p>';
    return h;
  };
  CHECK.common = function () { return g('b22.rev') ? '' : 'Đoán xong rồi bấm Xem Shin đếm'; };
  STEP.base = function () {
    var v = g('b22.base'), a = g('b22.act'), bs = null; BASE5.forEach(function (b) { if (b.id === v) bs = b; });
    var h = '<div class="aha"><span>' + cdIc('anchor', 26) + '</span><div><b>Hướng nào cũng bắt đầu từ 3 năm ở Nhật</b><p>8 hướng khác nhau, nhưng ai cũng xây cùng một nền trong 3 năm đầu.</p></div></div>' +
      qh('Nền nào bạn muốn bắt đầu xây ngay ở JPC?') + '<div class="base5">' + BASE5.map(function (b) { return '<button type="button" class="b5' + (v === b.id ? ' on' : '') + '" data-act="pick" data-k="b22.base" data-v="' + b.id + '"><span>' + cdIc(b.ic, 22) + '</span><b>' + esc(b.n) + '</b><small>' + esc(b.d) + '</small></button>'; }).join('') + '</div>';
    if (bs) {
      h += qh('Một việc nhỏ bạn làm từ tuần này') + '<div class="chips">' + bs.act.map(function (t) { return '<button type="button" class="chip' + (a === t ? ' on' : '') + '" data-act="pick" data-k="b22.act" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>';
      if (!S.demo && PS.routineSugHTML) h += PS.routineSugHTML(bs.rt, { from: ID, sub: esc('Rèn thành thói quen mỗi ngày với Shin Routine') });
    }
    return h;
  };
  CHECK.base = function () { if (!g('b22.base')) return 'Chọn một nền'; return g('b22.act') ? '' : 'Chọn một việc nhỏ'; };
  /* PS1.3.42: Phỏng vấn anh chị đi trước · chọn 1 trong 3 nhân vật ghép (PEERS), hỏi 3 câu */
  function peerOf(id) { for (var i = 0; i < PEERS.length; i++) if (PEERS[i].id === id) return PEERS[i]; return null; }
  function peer() { return peerOf(g('b23.who')) || ((g('b23.ask') || []).length ? PEERS[0] : null); }
  STEP.chat = function () {
    var p = peer();
    if (!p) return qh('Bạn là phóng viên nhỏ của lớp. Chọn 1 anh chị để phỏng vấn') + '<div class="peers">' + PEERS.map(function (x) {
      return '<button type="button" class="peer" data-act="peer" data-v="' + x.id + '"><span class="msg__av">' + esc(x.av) + '</span><span><b>' + esc(x.n) + '</b><small>' + esc(x.role) + '</small></span>' + PS.icon('next', 16) + '</button>'; }).join('') + '</div>' +
      '<p class="ps-small">' + esc(PEER_NOTE) + '</p>';
    var asked = g('b23.ask') || [];
    var h = '<div class="peerhd"><span class="msg__av">' + esc(p.av) + '</span><div><b>' + esc(p.n) + '</b><small>' + esc(p.role) + '</small></div><button type="button" class="link" data-act="peerRe">Đổi người</button></div>' +
      '<div class="chat"><div class="msg"><span class="msg__av">' + esc(p.av) + '</span><div class="msg__b">' + Q(p.hi) + '</div></div>';
    asked.forEach(function (i) { var x = p.qa[i]; if (!x) return; h += '<div class="msg msg--me"><div class="msg__b">' + esc(x[0]) + '</div></div><div class="msg"><span class="msg__av">' + esc(p.av) + '</span><div class="msg__b">' + esc(x[1]) + '</div></div>'; });
    h += '</div>' + (asked.length < p.qa.length ? '<p class="qsub">' + (asked.length < 3 ? 'Chọn câu hỏi (' + asked.length + '/3)' : 'Hỏi thêm nếu bạn muốn') + '</p>' : '') +
      '<div class="chips chips--ask">' + p.qa.map(function (x, i) { return asked.indexOf(i) > -1 ? '' : '<button type="button" class="chip" data-act="ask" data-v="' + i + '">' + esc(x[0]) + '</button>'; }).join('') + '</div>';
    if (asked.length >= 3) h += '<h3 class="qs">Đọc chuyện thật cùng hướng</h3><div class="alt">' + p.read.map(function (id) { var sp = spOf(id); return '<button type="button" class="altc" data-act="sp" data-id="' + id + '"><b>' + esc(sp.a) + '</b><span>' + esc(sp.tag) + '</span></button>'; }).join('') + '</div>';
    return h + '<p class="ps-small">' + esc(PEER_NOTE) + '</p>';
  };
  CHECK.chat = function () { if (!peer()) return 'Chọn một anh chị'; var n = (g('b23.ask') || []).length; return n >= 3 ? '' : 'Hỏi ít nhất 3 câu (' + n + '/3)'; };

  /* ----- Bến 3 ----- */
  function pv() { var v = g('b31.v'); if (!v || !v.push) { v = [5, 5, 5, 5, 5, 5]; } return v; }
  STEP.pairs = function () {
    var v = pv();
    return '<div class="cmpbox" id="cmpBox">' + compassSVG(v, 200) + '</div><div class="pairs">' + PAIRS.map(function (p, i) {
      return '<div class="pair"><div class="pair__l"><span class="' + (v[i] < 5 ? 'on' : '') + '">' + esc(p[0]) + '</span><span class="' + (v[i] > 5 ? 'on' : '') + '">' + esc(p[1]) + '</span></div>' +
        '<input type="range" min="0" max="10" step="1" value="' + v[i] + '" data-pair="' + i + '" aria-label="' + esc(p[0] + ' hay ' + p[1]) + '"></div>';
    }).join('') + '</div>';
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
      return '<div class="wind' + (m[i] ? ' set' : '') + '"><b>' + cdIc('wind', 16) + esc(w) + '</b><div class="seg2"><button type="button" class="' + (m[i] === 'can' ? 'on' : '') + '" data-act="wind" data-id="' + i + '" data-v="can">Mình thay đổi được</button><button type="button" class="' + (m[i] === 'hard' ? 'on' : '') + '" data-act="wind" data-id="' + i + '" data-v="hard">Khó thay đổi</button></div></div>';
    }).join('') + '</div>';
    if (n >= WINDS.length) {
      var hard = [], can = []; WINDS.forEach(function (w, i) { (m[i] === 'hard' ? hard : can).push(i); });
      if (!hard.length) hard = can.slice(); if (!can.length) can = hard.slice();
      h += shinSays('think', '<p>Điều khó thay đổi vẫn chuẩn bị được. Chọn 1 điều khó để nghĩ trước, và 1 điều bạn làm được ngay.</p>', 56) +
        qh('Điều khó bạn muốn chuẩn bị trước') + '<div class="chips">' + hard.map(function (i) { return '<button type="button" class="chip' + (String(g('b32.h')) === String(i) ? ' on' : '') + '" data-act="pick" data-k="b32.h" data-v="' + i + '">' + esc(WINDS[i]) + '</button>'; }).join('') + '</div>' +
        qh('Điều bạn thay đổi được') + '<div class="chips">' + can.map(function (i) { return '<button type="button" class="chip' + (String(g('b32.c')) === String(i) ? ' on' : '') + '" data-act="pick" data-k="b32.c" data-v="' + i + '">' + esc(WINDS[i]) + '</button>'; }).join('') + '</div>';
    }
    return h;
  };
  CHECK.winds = function () { var m = g('b32.s') || {}, n = 0; WINDS.forEach(function (w, i) { if (m[i]) n++; }); if (n < WINDS.length) return 'Xếp đủ 8 điều (' + n + '/8)'; if (g('b32.h') == null) return 'Chọn 1 điều khó'; return g('b32.c') == null ? 'Chọn 1 điều làm được' : ''; };
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
      '<p class="ps-small">Đường đời để tham khảo, không phải khuôn. Mỗi người một nhịp.</p>';
    return h;
  };
  STEP.compass = function () {
    return shinSays('proud', '<p>La bàn của <b class="nm">' + esc(given()) + '</b> đã chỉnh xong!</p>', 64) + '<div class="cmpbox">' + compassSVG(pv(), 220) + '</div>' +
      '<div class="cmpsum"><div><small>Nghiêng rõ nhất</small><b>' + esc(lean()) + '</b></div><div><small>Đi làm là để</small><b>' + esc(trim(g('b33.work')) || '…') + '</b></div><div><small>Tuổi 30 tốt là</small><b>' + esc(trim(g('b33.life')) || '…') + '</b></div></div>' +
      '';
  };

  /* ----- Bến 4 · Phòng Hải Đồ ----- */
  function voyOf(v) { for (var i = 0; i < VOY.length; i++) if (VOY[i][0] === v) return VOY[i]; return null; }
  function voyIsle(v) { var id = g(v + '.isl'); if (!id) return null; if (id === 'o') return { id: 'o', n: trim(g(v + '.islo')) || 'Đảo riêng', ic: 'compass', sub: '' }; return isleOf(id); }
  function msList(v) { var L = []; ['1', '3', '5'].forEach(function (y) { var t = trim(g(v + '.m' + y)); if (t) L.push('Năm ' + y + ': ' + t); }); return L; }
  function gOf(v) { var G = g(v + '.g'); return (G && typeof G === 'object') ? G : {}; }
  function wOf() { var w = g('b51.w'); return (w && typeof w === 'object') ? w : { like: 2, conf: 2, fit: 2, feas: 2 }; }
  function voyScore(v) { var G = gOf(v), W2 = wOf(), t = 0, m = 0; METERS.forEach(function (x) { var w = +W2[x[0]] || 2; t += (+G[x[0]] || 0) * w; m += 5 * w; }); return m ? Math.round(t / m * 100) : 0; }
  function voyTitle(v) { var x = voyOf(v), nm = trim(g(v + '.name')); return 'Kế hoạch ' + x[1] + (nm ? ' · ' + nm : ''); }
  function leanVoy() { var v = g('b51.lean'); return voyOf(v) ? v : ''; }
  function leanLetter() { var v = leanVoy(); return v ? voyOf(v)[1] : (g('b51.lean') === 'u' ? 'Chưa nghiêng' : ''); }
  function leanName() { var v = leanVoy(); if (v) return voyTitle(v); var is = isleOf(g('b13.isl')); return is ? 'hướng ' + is.n : 'kế hoạch bạn chọn'; }
  function leanIsle() { var v = leanVoy(); return v ? voyIsle(v) : (isleOf(g('b13.isl')) || null); }
  function gaugeSVG(n) {
    n = +n || 0; var L = 144.5, th = Math.PI * (1 - n / 5), nx = 60 + 34 * Math.cos(th), ny = 58 - 34 * Math.sin(th);
    return '<svg class="gauge" viewBox="0 0 120 66" aria-hidden="true"><path d="M14 58A46 46 0 0 1 106 58" fill="none" stroke="#EEECE4" stroke-width="10" stroke-linecap="round"/>' +
      (n ? '<path d="M14 58A46 46 0 0 1 106 58" fill="none" stroke="#C15F3C" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + (L * n / 5).toFixed(1) + ' 200"/>' : '') +
      '<path d="M60 58L' + nx.toFixed(1) + ' ' + ny.toFixed(1) + '" stroke="#141413" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="58" r="5" fill="#141413"/></svg>';
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
    var v = s.v, x = voyOf(v), id = g(v + '.isl') || '', is = voyIsle(v), c = cd1(), h = s.say ? shinSays('wink', '<p>' + Q(s.say) + '</p>', 52) : '';
    h += '<div class="voyhead"><span class="voyc__l">' + x[1] + '</span><div><b>' + esc(x[2]) + '</b><small>' + Q(x[3]) + '</small></div></div>';
    if (v === 'b41') {
      if (trim(g('x1.now'))) h += '<div class="from"><div><small>Lúc nhận thuyền, bạn viết</small><b>' + esc(g('x1.now')) + '</b></div></div>';
    } else {
      h += '<div class="voymini">' + VOY.filter(function (y) { return y[0] < v; }).map(function (y) { var i2 = voyIsle(y[0]); return '<span>' + y[1] + ' · ' + esc(i2 ? i2.n : '…') + '</span>'; }).join('') + '</div>';
    }
    h += qh('Kế hoạch ' + x[1] + ' đi hướng nào?') + '<div class="isgrid">' + ISLES.map(function (it) {
      return '<button type="button" class="isbtn' + (id === it.id ? ' on' : '') + '" data-act="pick" data-k="' + v + '.isl" data-v="' + it.id + '">' + cdIc(it.ic, 16) + esc(it.n) + '</button>';
    }).join('') + '<button type="button" class="isbtn' + (id === 'o' ? ' on' : '') + '" data-act="pick" data-k="' + v + '.isl" data-v="o">' + cdIc('compass', 16) + 'Hướng khác</button></div>';
    if (id === 'o') h += '<input class="inp ps-sel" data-k="' + v + '.islo" maxlength="40" value="' + esc(g(v + '.islo') || '') + '" placeholder="Tên hướng đi của bạn, ví dụ: làm hướng dẫn viên du lịch">';
    if (is && id !== 'o') h += '<p class="qsub voysub">' + esc(is.sub) + '</p>';
    h += qh('Đặt tên cho kế hoạch ' + x[1]) + '<input class="inp ps-sel" data-k="' + v + '.name" maxlength="40" value="' + esc(g(v + '.name') || '') + '" placeholder="Ví dụ: Thợ hàn giỏi ở Osaka">' +
      tipsHTML(v + '.name', is && id !== 'o' ? [is.sub, 'Con đường của riêng ' + given()] : ['Con đường của riêng ' + given()]);
    return h;
  };
  CHECK.voy = function (s) { var id = g(s.v + '.isl'); if (!id) return 'Chọn một hướng'; if (id === 'o' && trim(g(s.v + '.islo')).length < 3) return 'Viết tên hướng đi'; return trim(g(s.v + '.name')).length >= 3 ? '' : 'Đặt tên cho kế hoạch'; };
  STEP.tline = function (s) {
    var v = s.v, x = voyOf(v), is = voyIsle(v), a = age(), base = a ? a + 4 : 0, h = '';
    h += qh(s.short ? 'Kế hoạch ' + x[1] + ': 5 năm sau, bạn đang làm gì?' : 'Kế hoạch ' + x[1] + ': 5 năm sau khi xong 3 năm ở Nhật', v === 'b41' ? 'Viết 3 mốc, mỗi mốc một dòng ngắn.' : '');
    h += '<div class="tl5"><div class="tl5__s">' + cdIc('anchor', 18) + '<span><b>Xong 3 năm ở Nhật</b>' + (base ? '<small>khoảng ' + base + ' tuổi</small>' : '') + '</span></div>' +
      (s.short ? ['5'] : ['1', '3', '5']).map(function (y) {
        return '<label class="tl5__r"><span class="tl5__y">Năm ' + y + (base ? '<small>~' + (base + (+y)) + ' tuổi</small>' : '') + '</span><input class="inp ps-sel" data-k="' + v + '.m' + y + '" maxlength="60" value="' + esc(g(v + '.m' + y) || '') + '" placeholder="Mốc năm ' + y + '"></label>';
      }).join('') + '<div class="tl5__e">' + cdIc('flag', 18) + '<b>' + esc(is ? is.n : '') + '</b></div></div>';
    var tips = W.CD2_TIPS_ON ? (MS_TIPS[is ? is.id : 'o'] || MS_TIPS.o) : [];
    if (tips.length) h += '<div class="tips"><small>Chạm gợi ý để điền vào mốc còn trống, rồi sửa theo ý bạn</small>' + tips.map(function (t) { return '<button type="button" class="tip" data-act="msTip" data-k="' + v + '" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>';
    var jl = g(v + '.jl') || '';
    h += qh('Kế hoạch này cần tiếng Nhật tới đâu?') + '<div class="chips">' + JL_OPTS.map(function (o) { return '<button type="button" class="chip' + (jl === o[0] ? ' on' : '') + '" data-act="pick" data-k="' + v + '.jl" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div>';
    return h;
  };
  CHECK.tline = function (s) { if (s.short) { if (trim(g(s.v + '.m5')).length < 3) return 'Viết mốc năm 5'; return g(s.v + '.jl') ? '' : 'Chọn mức tiếng Nhật'; } var n = 0; ['1', '3', '5'].forEach(function (y) { if (trim(g(s.v + '.m' + y)).length >= 3) n++; }); if (n < 2) return 'Viết ít nhất 2 mốc (' + n + '/2)'; return g(s.v + '.jl') ? '' : 'Chọn mức tiếng Nhật'; };
  function metersHTML(v, first) {
    var G = gOf(v);
    return '<div class="meters">' + METERS.map(function (m) { /* PS1.3.41: câu giải thích chỉ hiện ở kế hoạch A */
      var n = +G[m[0]] || 0;
      return '<div class="meter"><div class="meter__g">' + gaugeSVG(n) + '<b>' + (n || '–') + '</b></div><div class="meter__b"><b>' + esc(m[1]) + '</b>' + (first ? '<small>' + esc(m[2]) + '</small>' : '') +
        (first && m[0] === 'fit' && g('b31.v') ? '<small class="meter__hint">La bàn của bạn nghiêng về “' + esc(lean()) + '”</small>' : '') +
        '<div class="meter__n">' + [1, 2, 3, 4, 5].map(function (k) { return '<button type="button" class="' + (n === k ? 'on' : '') + '" data-act="meter" data-k="' + v + '" data-id="' + m[0] + '" data-v="' + k + '" aria-label="' + esc(m[1]) + ' ' + k + '">' + k + '</button>'; }).join('') + '</div></div></div>';
    }).join('') + '</div>';
  }
  STEP.meters = function (s) { /* PS1.3.42: vs = chấm nhiều kế hoạch trên một màn (B và C), trio = đặt 3 kế hoạch cạnh nhau */
    var L = s.vs || [s.v], h = L.map(function (v) { var first = v === 'b41'; return qh('Tự chấm kế hoạch ' + voyOf(v)[1], first ? 'Chạm từ 1 đến 5, theo cảm nhận.' : '') + metersHTML(v, first); }).join('');
    if (s.trio) { var ok = VOY.every(function (x) { var G = gOf(x[0]), n = 0; METERS.forEach(function (m) { if (G[m[0]]) n++; }); return n >= 4; });
      return h + (ok ? STEP.trio() : ''); }
    return h + voyCard(s.v);
  };
  CHECK.meters = function (s) { var L = s.vs || [s.v], miss = ''; L.forEach(function (v) { if (miss) return; var G = gOf(v), n = 0; METERS.forEach(function (m) { if (G[m[0]]) n++; }); if (n < 4) miss = 'Chấm đủ 4 đồng hồ kế hoạch ' + voyOf(v)[1] + ' (' + n + '/4)'; }); return miss; };
  STEP.trio = function () {
    return shinSays('wow', '<p>Đây là 3 kế hoạch của <b class="nm">' + esc(given()) + '</b>. Bạn có nhiều đường hơn bạn nghĩ!</p>', 60) +
      '<div class="trio">' + VOY.map(function (x) { return voyCard(x[0]); }).join('') + '</div><p class="ps-small">Vuốt ngang để xem cả 3. Chưa cần chọn.</p>';
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
    h += shinSays('think', '<p>' + (tie ? 'Có kế hoạch đang bằng điểm nhau. Thử đổi nặng nhẹ xem sao.' : 'Theo cân của bạn, <b>kế hoạch ' + voyOf(best)[1] + '</b> đang nặng ký nhất.') + '</p>', 52);
    return h;
  };
  STEP.leanpick = function () {
    var v = g('b51.lean') || '', f = g('b51.feel') || '';
    var h = qh('Lúc này, bạn nghiêng về kế hoạch nào?') + '<div class="opts">' + VOY.map(function (x) { var is = voyIsle(x[0]); return opt('b51.lean', x[0], voyTitle(x[0]) + (is ? ' (' + is.n + ')' : ''), v === x[0]); }).join('') +
      opt('b51.lean', 'u', 'Mình chưa nghiêng về kế hoạch nào', v === 'u') + '</div>';
    h += qh('Kết quả cân có giống cảm giác của bạn không?') + '<div class="seg3">' + FEEL3.map(function (o) { return '<button type="button" class="' + (f === o[0] ? 'on' : '') + '" data-act="pick" data-k="b51.feel" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div>';
    if (f === 'diff') h += '<p class="qsub fb">Khác cũng tốt. Có thể bạn coi trọng điều mà bàn cân chưa có.</p>';
    if (f === 'unsure') h += '<p class="qsub fb">Phân vân là bình thường.</p>';
    return h;
  };
  CHECK.leanpick = function () { if (!g('b51.lean')) return 'Chọn kế hoạch bạn nghiêng'; return g('b51.feel') ? '' : 'Chọn giống hay khác'; };
  function blk() { var id = g('b52.b'); for (var i = 0; i < BLOCKS.length; i++) if (BLOCKS[i].id === id) return BLOCKS[i]; return null; }
  function stormHTML(b) { return '<div class="storm"><span>' + cdIc(b.ic, 22) + '</span><div><small>Dựa trên chuyện đã từng xảy ra</small><b>' + esc(b.t) + '</b><p>' + esc(b.ctx) + '</p></div></div>'; }
  STEP.block = function () {
    var v = g('b52.b') || '';
    return shinSays('worry', '<p>Các anh chị đi trước cũng từng bị chặn đường. Chọn một tình huống để tập gỡ nhé.</p>', 64) +
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
    h += '<div class="aha aha--soft"><span>' + cdIc('compass', 24) + '</span><div><b>Bước nhỏ của bạn</b><p>' + esc(g('b52.first') || '') + '</p></div></div><p class="ps-small">Anh chị cũng gỡ từng bước nhỏ, như bạn.</p>';
    return h;
  };
  function trialTxt() { var t = g('b53.try'); if (t === 'o') return trim(g('b53.tryo')); return t || ''; }
  function trialOpts() { var is = leanIsle(), L = []; if (is && TRY_ISLE[is.id]) L.push(TRY_ISLE[is.id].replace('[Nghề]', jobName())); return L.concat(TRIALS); }
  STEP.trial = function () {
    var t = g('b53.try') || '', is = leanIsle();
    var h = shinSays('curious', '<p>Năm 1 bắt đầu từ bây giờ. Chọn một việc nhỏ để thử trong 2 tuần ở JPC.</p>', 52) + qh('Việc nhỏ bạn thử trong 2 tuần', is ? 'Cho kế hoạch bạn nghiêng: ' + leanName() + ' · ' + is.n : '') + '<div class="opts">' + trialOpts().map(function (x) { return opt('b53.try', x, x, t === x); }).join('') + opt('b53.try', 'o', 'Việc khác, mình tự viết', t === 'o') + '</div>';
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

  /* ----- Bến 6 · Phòng Tuyển Dụng (PS1.3.42) ----- */
  function curIsle() { var is = leanIsle(); return is && is.id !== 'o' ? is.id : (g('b13.isl') || ''); }
  function adKindDef() { var i = curIsle(); if (i === 'lap') return 'plan'; if (i === 'len' || i === 're' || i === 'gio') return 'jp'; return 'vn'; }
  function adKind() { return g('b61.kind') || adKindDef(); }
  function adOf(id) { var L = ADS.concat(PLANS); for (var i = 0; i < L.length; i++) if (L[i].id === id) return L[i]; return null; }
  function isPlan(a) { return !!a && !!a.L; }
  function adFit(a) { var jk = jobKey(); return jk && a.g.indexOf(jk) > -1 ? 2 : (a.g.indexOf('all') > -1 ? 1 : 0); }
  function adList(k) {
    var L = (k === 'plan' ? PLANS : ADS.filter(function (a) { return a.k === k; })).map(function (a, i) { return [a, i]; });
    L.sort(function (x, y) { return (adFit(y[0]) - adFit(x[0])) || (x[1] - y[1]); });
    return L.map(function (x) { return x[0]; });
  }
  function curAd() { var a = adOf(g('b61.ad')); if (!a) return null; if (adKind() === 'plan' ? !isPlan(a) : (isPlan(a) || a.k !== adKind())) return null; return a; }
  STEP.adpick = function () {
    var k = adKind(), cur = g('b61.ad'), def = adKindDef();
    var h = qh('Bạn muốn đọc loại nào?') + '<div class="seg3 seg3--ic">' + AD_KIND.map(function (x) { return '<button type="button" class="' + (k === x[0] ? 'on' : '') + '" data-act="adKind" data-v="' + x[0] + '">' + cdIc(x[2], 16) + esc(x[1]) + '</button>'; }).join('') + '</div>' +
      (leanIsle() || g('b13.isl') ? '<p class="qsub">Shin chọn sẵn theo hướng bạn nghiêng: <b>' + esc(AD_KIND.filter(function (x) { return x[0] === def; })[0][1]) + '</b>. Đổi thoải mái.</p>' : '');
    h += '<div class="adlist">' + adList(k).map(function (a) {
      var fit = adFit(a) === 2;
      return '<button type="button" class="adi' + (cur === a.id ? ' on' : '') + '" data-act="adPick" data-v="' + a.id + '"><span class="adi__ic">' + cdIc(isPlan(a) ? 'shop' : 'doc', 20) + '</span><span><b>' + esc(a.n) + '</b><small>' + esc(isPlan(a) ? a.who : a.at) + '</small>' +
        (fit ? '<em>Gần nghề của bạn</em>' : '') + '</span>' + (cur === a.id ? '<span class="adi__ok">' + PS.icon('check', 14, 3) + '</span>' : '') + '</button>';
    }).join('') + '</div>';
    return h;
  };
  CHECK.adpick = function () { return curAd() ? '' : 'Chọn một tin để đọc'; };
  function adCol() { var c = g('b61.c'); return (c && typeof c === 'object') ? c : {}; }
  function planMark() { var c = g('b61.pm'); return (c && typeof c === 'object') ? c : {}; }
  function colLab(v) { for (var i = 0; i < AD_COL.length; i++) if (AD_COL[i][0] === v) return AD_COL[i][1]; return 'Chạm để tô'; }
  STEP.adread = function () {
    var a = curAd(); if (!a) return '';
    if (isPlan(a)) return planHTML(a);
    var C = adCol(), n = 0; a.req.forEach(function (r, i) { if (C[i]) n++; });
    var h = '<div class="ad"><div class="ad__h"><small>Tuyển dụng · 3 năm sau</small><b>' + esc(a.n) + '</b><span>' + esc(a.at) + '</span></div><p class="ad__job">' + esc(a.job) + '</p>' +
      '<div class="ad__leg">' + AD_COL.map(function (x) { return '<span><i class="dot-' + x[0] + '"></i>' + esc(x[1]) + '</span>'; }).join('') + '</div>' +
      '<p class="ad__hint">Chạm từng yêu cầu để tô màu theo bạn của 3 năm sau</p><ul class="ad__req">' + a.req.map(function (r, i) {
        var v = C[i] || '';
        return '<li><button type="button" class="adr' + (v ? ' c-' + v : '') + '" data-act="adc" data-id="' + i + '"><i class="dot-' + (v || 'n') + '"></i><span>' + esc(r) + '</span><small>' + esc(colLab(v)) + '</small></button></li>';
      }).join('') + '</ul><p class="ad__src">' + esc(AD_SRC) + '</p></div>';
    if (n >= a.req.length) {
      var cy = 0, cx = 0; a.req.forEach(function (r, i) { if (C[i] === 'y') cy++; if (C[i] === 'x') cx++; });
      h += shinSays(cx ? 'think' : 'cheer', '<p>' + (cy + cx ? 'Có <b>' + cy + '</b> điều phải cố' + (cx ? ', <b>' + cx + '</b> điều cần đi đường khác' : '') + '. Shin ghi vào thẻ bằng chứng còn thiếu cho bạn.' : 'Bạn thấy mình có đủ hết. Giỏi lắm!') + '</p>', 56) +
        '<div class="admore"><b>' + PS.icon('bulb', 16) + esc(AD_MORE.t) + '</b><ul>' + AD_MORE.L.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul><small>' + esc(AD_MORE.src) + '</small></div>';
    }
    return h;
  };
  function planHTML(a) {
    var M = planMark(), n = 0, P = g('b61.prep') || [];
    PLAN_ROW.forEach(function (r) { if (M[r[0]]) n++; });
    var h = '<div class="ad ad--plan"><div class="ad__h"><small>Kế hoạch 1 trang · nhân vật của khóa</small><b>' + esc(a.n) + '</b><span>' + esc(a.who) + '</span></div>' +
      '<p class="ad__hint">Mỗi dòng rõ, mơ hồ hay còn thiếu?</p><div class="pl">' + PLAN_ROW.map(function (r) {
        var v = M[r[0]] || '';
        return '<div class="pl__r' + (v ? ' set' : '') + '"><small>' + esc(r[1]) + '</small><p>' + esc(a.L[r[0]]) + '</p><div class="seg3">' + PLAN_MARK.map(function (o) { return '<button type="button" class="' + (v === o[0] ? 'on' : '') + '" data-act="pmark" data-id="' + r[0] + '" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div></div>';
      }).join('') + '</div><p class="ad__src">Số tiền không ghi, vì mỗi nơi mỗi khác.</p></div>';
    if (n >= PLAN_ROW.length) {
      var iv = g('b61.inv') || '';
      h += qh('Nếu là người góp vốn, bạn có góp không?') + '<div class="seg3">' + PLAN_INV.map(function (o) { return '<button type="button" class="' + (iv === o[0] ? 'on' : '') + '" data-act="pick" data-k="b61.inv" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div>';
      if (iv) h += qh('Nếu đi hướng này, 3 năm ở Nhật bạn cần chuẩn bị gì?', 'Chọn 1 đến 3 điều') + '<div class="chips">' + PLAN_PREP.map(function (t) { return '<button type="button" class="chip' + (P.indexOf(t) > -1 ? ' on' : '') + '" data-act="prep" data-v="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>' +
        '<h3 class="qs">Anh chị thật đã bắt đầu thế nào</h3><div class="alt">' + PLAN_SP.map(function (x) { return '<button type="button" class="altc" data-act="sp" data-id="' + x[0] + '"><b>' + esc(spOf(x[0]).a) + '</b><span>' + esc(x[1]) + '</span></button>'; }).join('') + '</div>';
    }
    return h;
  }
  CHECK.adread = function () {
    var a = curAd(); if (!a) return 'Quay lại chọn một tin';
    if (isPlan(a)) { var M = planMark(), n = 0; PLAN_ROW.forEach(function (r) { if (M[r[0]]) n++; }); if (n < PLAN_ROW.length) return 'Chấm đủ 5 dòng (' + n + '/5)'; if (!g('b61.inv')) return 'Chọn có góp vốn không'; return (g('b61.prep') || []).length ? '' : 'Chọn điều cần chuẩn bị'; }
    var C = adCol(), k = 0; a.req.forEach(function (r, i) { if (C[i]) k++; }); return k >= a.req.length ? '' : 'Tô màu đủ ' + a.req.length + ' yêu cầu (' + k + '/' + a.req.length + ')';
  };
  /* phỏng vấn 3 năm sau */
  function ivWhoDef() { var i = curIsle(); for (var j = 0; j < IV_WHO.length; j++) if (IV_WHO[j].isl.indexOf(i) > -1) return IV_WHO[j]; return IV_WHO[2]; }
  function ivWho() { var id = g('b62.who'); for (var j = 0; j < IV_WHO.length; j++) if (IV_WHO[j].id === id) return IV_WHO[j]; return ivWhoDef(); }
  function ivQs() { var q = g('b62.q'); return q && q.length === 3 ? q : ivWho().q.slice(); }
  function qOf(id) { for (var i = 0; i < IV_Q.length; i++) if (IV_Q[i].id === id) return IV_Q[i]; return IV_Q[0]; }
  STEP.ivset = function () {
    var w = ivWho(), def = ivWhoDef(), qs = ivQs();
    var h = shinSays('wink', '<p>Giờ là 3 năm sau. Bạn đi phỏng vấn nhé. Không có đúng sai, cứ trả lời như bạn của 3 năm sau.</p>', 60) +
      (c1Val('iv') ? '<p class="qsub">Đó là câu bạn trả lời để sang Nhật. Giờ bạn đã có 3 năm kinh nghiệm.</p>' : '');
    h += qh('Ai phỏng vấn bạn?') + '<div class="opts">' + IV_WHO.map(function (x) {
      return '<button type="button" class="opt opt--iv' + (w.id === x.id ? ' on' : '') + '" data-act="ivWho" data-v="' + x.id + '"><span class="dot">' + (w.id === x.id ? PS.icon('check', 13, 3.2) : '') + '</span>' + ivAv(x.id, 46) + '<span><b>' + esc(x.n) + '</b>' + (x.id === def.id ? ' <em class="opt__tag">Hợp hướng bạn nghiêng</em>' : '') + '<small class="opt__sub">' + esc(x.ctx) + '</small></span></button>';
    }).join('') + '</div>';
    h += qh('3 câu bạn sẽ được hỏi', 'Shin chọn sẵn, chạm để đổi') + '<div class="chips chips--ask">' + IV_Q.map(function (q) { var on = qs.indexOf(q.id) > -1; return '<button type="button" class="chip' + (on ? ' on' : '') + '" data-act="ivQ" data-v="' + q.id + '">' + esc(q.vi) + '</button>'; }).join('') + '</div>';
    return h;
  };
  CHECK.ivset = function () { var n = ivQs().length; return n === 3 ? '' : 'Chọn đủ 3 câu (' + n + '/3)'; };
  STEP.iva = function (s) {
    var q = qOf(ivQs()[s.n]), w = ivWho(), K = 'b62.' + q.id, ev = g(K + '.ev') || '', sy = g(K + '.say') || '';
    var h = '<div class="ivq"><div class="ivq__room">' + ivRoom(w.id) + '</div><div class="ivq__h">' + ivAv(w.id, 38) + '<b>' + esc(w.n) + '</b><small>Câu ' + (s.n + 1) + '/3</small></div>' +
      '<p class="ivq__jp" lang="ja">' + esc(q.jp) + '</p><p class="ivq__vi">' + esc(q.vi) + '</p>' +
      '<button type="button" class="btn btn--soft btn--sm" data-act="ivSpeak" data-v="' + esc(q.jp) + '">' + cdIc('speech', 16) + 'Nghe câu hỏi</button></div>';
    h += '<div class="ivbox">' + IV_BOX.map(function (b, i) {
      return '<label><small>' + (i + 1) + ' · ' + esc(b[1]) + '</small><input class="inp ps-sel" data-k="' + K + '.' + b[0] + '" maxlength="120" value="' + esc(g(K + '.' + b[0]) || '') + '"' + (s.n === 0 && i === 0 ? ' placeholder="Ví dụ: mình đề xuất xếp lại chỗ để dụng cụ"' : '') + '></label>';
    }).join('') + '</div>';
    h += qh('Có bằng chứng thật chưa?') + '<div class="seg3">' + IV_EV.map(function (o) { return '<button type="button" class="' + (ev === o[0] ? 'on' : '') + '" data-act="pick" data-k="' + K + '.ev" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div>' +
      qh('Nói được câu này bằng tiếng Nhật chưa?') + '<div class="seg3">' + IV_SAY.map(function (o) { return '<button type="button" class="' + (sy === o[0] ? 'on' : '') + '" data-act="pick" data-k="' + K + '.say" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div>';
    if (ev) h += '<div class="chat chat--iv"><div class="msg"><span class="msg__av msg__av--iv">' + ivAv(w.id, 34) + '</span><div class="msg__b"><small>Người phỏng vấn hay hỏi thêm</small>' + esc(q.more) + '</div></div></div>' +
      (ev !== 'co' ? '<p class="ivev">' + cdIc('card', 15) + 'Thêm vào thẻ bằng chứng còn thiếu: <b>' + esc(q.ev) + '</b></p>' : '');
    return h;
  };
  CHECK.iva = function (s) {
    var q = qOf(ivQs()[s.n]), K = 'b62.' + q.id, n = 0;
    IV_BOX.forEach(function (b) { if (trim(g(K + '.' + b[0])).length >= 3) n++; });
    if (n < 2) return 'Viết ít nhất 2 ô (' + n + '/2)';
    if (!g(K + '.ev')) return 'Chọn có bằng chứng chưa';
    return g(K + '.say') ? '' : 'Chọn nói được tiếng Nhật chưa';
  };
  function evList() { /* thẻ bằng chứng còn thiếu: từ tin tuyển dụng (vàng, xám), kế hoạch kinh doanh, phỏng vấn, và điều tự thêm */
    var L = [], seen = {}, add = function (t, src) { t = trim(t); if (!t || seen[t]) return; seen[t] = 1; L.push({ t: t, src: src }); };
    var a = curAd();
    if (a && !isPlan(a)) { var C = adCol(); a.req.forEach(function (r, i) { if (C[i] === 'y') add(r, 'Tin tuyển dụng'); if (C[i] === 'x') add(r, 'Đường khác'); }); }
    if (a && isPlan(a)) (g('b61.prep') || []).forEach(function (t) { add(t, 'Kế hoạch kinh doanh'); });
    if (g('b62.q') || S.done.b62) ivQs().forEach(function (id) { var ev = g('b62.' + id + '.ev'); if (ev === 'se' || ev === 'chua') add(qOf(id).ev, 'Phỏng vấn'); });
    (g('b63.own') || []).forEach(function (t) { add(t, 'Bạn thêm'); });
    return L.slice(0, 10);
  }
  STEP.ivend = function () {
    var L = evList();
    return shinSays(L.length ? 'proud' : 'cheer', '<p>' + (L.length ? 'Xong buổi phỏng vấn! Đây là <b>thẻ bằng chứng còn thiếu</b>. Chặng sau, bạn xếp chúng vào 3 năm ở Nhật.' : 'Xong buổi phỏng vấn! Bạn thấy mình đủ bằng chứng. Chặng sau, bạn chọn điều muốn làm tốt hơn.') + '</p>', 60) +
      (L.length ? '<div class="evc"><div class="evc__h">' + cdIc('card', 18) + '<b>Bằng chứng còn thiếu</b><span>' + L.length + '</span></div><ul>' + L.map(function (x) { return '<li><span>' + esc(x.t) + '</span><small>' + esc(x.src) + '</small></li>'; }).join('') + '</ul></div>' : '') +
      '<p class="ps-small">Tập nói 3 câu trả lời với bạn cùng lớp, mỗi câu khoảng 60 giây.</p>';
  };
  function p3Map() { var m = g('b63.y'); return (m && typeof m === 'object') ? m : {}; }
  function p3Year(y) { var M = p3Map(), out = []; evList().forEach(function (x) { if (M[x.t] === y) out.push(x.t); }); return out; }
  STEP.plan3 = function () {
    var L = evList(), M = p3Map();
    var h = shinSays('think', '<p>Mỗi điều còn thiếu, bạn sẽ làm trong năm nào ở Nhật? Chạm Năm 1, 2 hoặc 3.</p>', 56);
    h += '<div class="p3l">' + L.map(function (x, i) {
      var y = M[x.t] || '';
      return '<div class="p3l__r' + (y ? ' set' : '') + '"><div><b>' + esc(x.t) + '</b><small>' + esc(x.src) + '</small></div><div class="seg3">' + PLAN3_Y.map(function (o) { return '<button type="button" class="' + (y === o[0] ? 'on' : '') + '" data-act="yr" data-id="' + i + '" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div></div>';
    }).join('') + '</div>';
    h += '<div class="p3add"><input class="inp ps-sel" id="p3New" maxlength="60" placeholder="' + (L.length ? 'Thêm một điều khác (không bắt buộc)' : 'Ví dụ: đậu N3 trong năm đầu') + '"><button type="button" class="btn btn--soft btn--sm" data-act="p3add">Thêm</button></div>';
    h += '<div class="p3">' + PLAN3_Y.map(function (o) { var it = p3Year(o[0]); return '<div class="p3__c"><b>' + esc(o[1]) + '</b>' + (it.length ? '<ul>' + it.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '<small>Chưa có</small>') + '</div>'; }).join('') + '</div>';
    return h;
  };
  CHECK.plan3 = function () {
    var L = evList(), M = p3Map(), n = 0, need = Math.min(3, L.length);
    if (!L.length) return 'Thêm ít nhất 1 điều';
    L.forEach(function (x) { if (M[x.t]) n++; });
    return n >= need ? '' : 'Xếp ít nhất ' + need + ' điều (' + n + '/' + need + ')';
  };
  function adSum() { var a = curAd(); if (!a) return {}; var o = { kind: adKind(), n: a.n, plan: isPlan(a) ? 1 : 0 }; if (isPlan(a)) { o.mark = planMark(); o.inv = g('b61.inv') || ''; o.prep = g('b61.prep') || []; } else { var C = adCol(); o.y = []; o.x = []; a.req.forEach(function (r, i) { if (C[i] === 'y') o.y.push(r); if (C[i] === 'x') o.x.push(r); }); } return o; }
  function ivSum() { if (!g('b62.q') && !S.done.b62) return {}; return { who: ivWho().n, q: ivQs().map(function (id) { var K = 'b62.' + id; return { q: qOf(id).vi, ev: g(K + '.ev') || '', say: g(K + '.say') || '', do: g(K + '.do') || '', res: g(K + '.res') || '', learn: g(K + '.learn') || '' }; }) }; }
  function p3Sum() { return { y1: p3Year('1'), y2: p3Year('2'), y3: p3Year('3') }; }
  function speakJa(t) {
    if (!PS.soundOn()) { PS.toast('Bật âm thanh ở Sổ tay › Cài đặt để nghe nhé.'); return; }
    try {
      var ss = W.speechSynthesis; if (!ss || !W.SpeechSynthesisUtterance) { PS.toast('Máy này chưa đọc được tiếng Nhật. Nhờ bạn đọc giúp nhé.'); return; }
      ss.cancel(); var u = new W.SpeechSynthesisUtterance(t); u.lang = 'ja-JP'; u.rate = 0.9;
      var vs = ss.getVoices ? ss.getVoices() : []; for (var i = 0; i < vs.length; i++) if (/^ja/i.test(vs[i].lang)) { u.voice = vs[i]; break; }
      ss.speak(u);
    } catch (e) {}
  }

  /* ----- Bến 7 · Ngọn Hải Đăng (PS1.3.42: trước là Bến 6) ----- */
  var RING_SH = { fam: 'Gia đình', ban: 'Bạn lớp', gv: 'Thầy cô', sp: 'Senpai', boss: 'Cấp trên', dn: 'Đồng nghiệp', cd: 'Bạn bè VN', tc: 'Nghiệp đoàn' };
  function ringName(id) { for (var i = 0; i < RING_P.length; i++) if (RING_P[i][0] === id) return RING_P[i][1]; return ''; }
  function ringSVG() {
    var R = g('b71.r') || {}, h = '<svg class="ring" viewBox="0 0 300 300" aria-hidden="true">', rr = { 1: 52, 2: 92, 3: 132 };
    h += '<circle cx="150" cy="150" r="132" fill="#FAF9F5" stroke="#B9B3A3" stroke-dasharray="4 5"/><circle cx="150" cy="150" r="92" fill="#F0EEE6" stroke="#C9C2AF"/><circle cx="150" cy="150" r="52" fill="#F6E6DD" stroke="#EBCBB9"/>';
    h += '<text x="150" y="26" text-anchor="middle" class="ring__t">Cần tìm</text><text x="150" y="66" text-anchor="middle" class="ring__t">Có quen</text><text x="150" y="106" text-anchor="middle" class="ring__t">Đã gần</text>';
    h += '<circle cx="150" cy="150" r="22" fill="#C15F3C"/><text x="150" y="155" text-anchor="middle" class="ring__me">Bạn</text>';
    RING_P.forEach(function (p, i) {
      var l = R[p[0]]; if (!l) return;
      var an = -Math.PI / 2 + 0.5 + (i / (RING_P.length - 1)) * (Math.PI * 2 - 1), x = 150 + Math.cos(an) * rr[l], y = 150 + Math.sin(an) * rr[l], key = g('b71.key') === p[0];
      h += '<g><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (key ? 9 : 7) + '" fill="' + (key ? '#D97757' : '#fff') + '" stroke="#141413" stroke-width="2"/><text x="' + x.toFixed(1) + '" y="' + (y + 20).toFixed(1) + '" text-anchor="middle" class="ring__n">' + esc(RING_SH[p[0]]) + '</text></g>';
    });
    return h + '</svg>';
  }
  STEP.ring = function () {
    var R = g('b71.r') || {}, n = 0; RING_P.forEach(function (p) { if (R[p[0]]) n++; });
    var h = '<div class="ringbox">' + ringSVG() + '</div><p class="qsub">Mỗi người đang ở vòng nào với bạn?</p><div class="rings">' + RING_P.map(function (p) {
      return '<div class="wind' + (R[p[0]] ? ' set' : '') + '"><b>' + cdIc(p[2], 16) + esc(p[1]) + '</b><div class="seg3">' + RING_L.map(function (o) { return '<button type="button" class="' + (R[p[0]] === o[0] ? 'on' : '') + '" data-act="ring" data-id="' + p[0] + '" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div></div>';
    }).join('') + '</div>';
    if (n >= RING_P.length) {
      h += qh('Ai giúp được nhiều nhất cho kế hoạch bạn nghiêng?', leanVoy() ? leanName() : '') + '<div class="chips">' + RING_P.map(function (p) { return '<button type="button" class="chip' + (g('b71.key') === p[0] ? ' on' : '') + '" data-act="pick" data-k="b71.key" data-v="' + p[0] + '">' + esc(p[1]) + '</button>'; }).join('') + '</div>';
      h += '<h3 class="qs">Người giúp trong chuyện thật</h3><div class="alt">' + RING_STORY.map(function (x) { return '<button type="button" class="altc" data-act="sp" data-id="' + x[0] + '"><b>' + esc(spOf(x[0]).a) + '</b><span>' + esc(x[1]) + '</span></button>'; }).join('') + '</div>';
    }
    return h;
  };
  CHECK.ring = function () { var R = g('b71.r') || {}, n = 0; RING_P.forEach(function (p) { if (R[p[0]]) n++; }); if (n < RING_P.length) return 'Xếp đủ 8 người (' + n + '/8)'; return g('b71.key') ? '' : 'Chọn người giúp nhiều nhất'; };
  function msgTpl() {
    var to = trim(g('b71.to')) || 'anh chị', is = leanIsle(), q = g('b71.mq') || trim(g('b23.q')) || MSG_Q[0], jb = jobName(), hw = '';
    if (is) hw = is.id === 'o' ? is.n : is.sub; hw = hw ? hw.charAt(0).toLowerCase() + hw.slice(1) : '';
    return 'Chào ' + to + ' ạ. Em là ' + (prof().name || given()) + ', học viên JPC, sắp sang Nhật làm ' + (jb === 'bạn chọn' ? 'việc' : 'nghề ' + jb) + '. ' + (hw ? 'Sau 3 năm, em đang tìm hiểu hướng: ' + hw + '. ' : '') + 'Cho em hỏi: ' + q + ' Em cảm ơn ' + to + ' nhiều ạ.';
  }
  STEP.msg = function () {
    if (!g('b71.ed')) S.d['b71.msg'] = msgTpl();
    var qs = MSG_Q.slice(); if (trim(g('b23.q')) && qs.indexOf(trim(g('b23.q'))) < 0) qs.unshift(trim(g('b23.q')));
    var mq = g('b71.mq') || qs[0];
    return qh('Soạn một tin nhắn xin lời khuyên', 'Ngắn, lễ phép, một câu hỏi rõ.') +
      '<h3 class="qs">Bạn gọi người nhận là</h3><input class="inp ps-sel" data-k="b71.to" maxlength="30" value="' + esc(g('b71.to') || '') + '" placeholder="Ví dụ: chị Lan">' + tipsHTML('b71.to', ['anh', 'chị', 'thầy', 'cô']) +
      '<h3 class="qs">Câu hỏi của bạn</h3><div class="chips chips--ask">' + qs.map(function (q) { return '<button type="button" class="chip' + (mq === q ? ' on' : '') + '" data-act="msgQ" data-v="' + esc(q) + '">' + esc(q) + '</button>'; }).join('') + '</div>' +
      '<h3 class="qs">Tin nhắn (sửa thoải mái)</h3><textarea class="ta ps-sel" id="repMsg" data-k="b71.msg" rows="6" maxlength="600">' + esc(g('b71.msg') || '') + '</textarea>' +
      '<div class="repbtns"><button type="button" class="btn btn--soft btn--sm" data-act="copyMsg">Chép tin nhắn</button><button type="button" class="link" data-act="msgReset">Viết lại theo mẫu</button></div>' +
      '<p class="ps-small">Chưa cần gửi ngay. Chép lại để gửi khi sẵn sàng.</p>';
  };
  CHECK.msg = function () { if (trim(g('b71.to')).length < 2) return 'Viết cách gọi người nhận'; return trim(g('b71.msg')).length >= 40 ? '' : 'Tin nhắn còn ngắn quá'; };
  STEP.work = function () {
    var P = g('b72.w') || {};
    return '<div class="works">' + WORKS.map(function (w, i) {
      var v = P[i];
      return '<div class="work"><b class="work__t">' + cdIc(w.ic, 18) + esc(w.t) + '</b><div class="opts">' + w.opts.map(function (o, j) {
        return '<button type="button" class="opt' + (String(v) === String(j) ? ' on' : '') + '" data-act="work" data-id="' + i + '" data-v="' + j + '"><span class="dot">' + (String(v) === String(j) ? PS.icon('check', 13, 3.2) : '') + '</span><span>' + esc(o[0]) + '</span></button>';
      }).join('') + '</div>' + (v != null ? '<div class="workfb"><p><b>Được:</b> ' + esc(w.opts[+v][1]) + '</p><p><b>Lưu ý:</b> ' + esc(w.opts[+v][2]) + '</p></div>' : '') + '</div>';
    }).join('') + '</div><h3 class="qs">Senpai học từ công việc</h3><div class="alt">' + WORK_STORY.map(function (x) { return '<button type="button" class="altc" data-act="sp" data-id="' + x[0] + '"><b>' + esc(spOf(x[0]).a) + '</b><span>' + esc(x[1]) + '</span></button>'; }).join('') + '</div>';
  };
  CHECK.work = function () { var P = g('b72.w') || {}, n = 0; WORKS.forEach(function (w, i) { if (P[i] != null) n++; }); return n >= WORKS.length ? '' : 'Chọn cách cho cả 3 tình huống (' + n + '/3)'; };
  STEP.habit = function () {
    var v = g('b72.h') || '', i = LEARN_H.indexOf(v), rt = i < 0 ? ['horenso', 'memo'] : (i === 1 || i === 2 ? ['memo', 'xinloi'] : ['horenso', 'som']);
    var h = qh('Cách học bạn muốn tập ngay từ bây giờ') + '<div class="opts">' + LEARN_H.map(function (t) { return opt('b72.h', t, t, v === t); }).join('') + '</div>';
    if (v && !S.demo && PS.routineSugHTML) h += PS.routineSugHTML(rt, { from: ID, sub: esc('Tập thành thói quen ở JPC với Shin Routine') });
    return h;
  };
  CHECK.habit = function () { return g('b72.h') ? '' : 'Chọn một cách học'; };

  /* ----- Cảng Khởi Hành ----- */
  function nLabel(n) { for (var i = 0; i < OPEN_N.length; i++) if (OPEN_N[i][0] === n) return OPEN_N[i][1]; return '—'; }
  STEP.open2 = function () {
    var n = g('f1.n') || '', su = g('f1.sure') == null ? 5 : +g('f1.sure');
    var h = qh('Bây giờ, theo bạn, sau 3 năm ở Nhật người ta có thể đi mấy hướng?') + '<div class="chips">' + OPEN_N.map(function (x) { return '<button type="button" class="chip' + (n === x[0] ? ' on' : '') + '" data-act="pick" data-k="f1.n" data-v="' + x[0] + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>' +
      qh('Hướng đi sau 3 năm của bạn giờ đã rõ mấy phần?') + '<div class="slide1"><input type="range" min="0" max="10" step="1" value="' + su + '" data-k="f1.sure" aria-label="Rõ mấy phần"><div class="slide1__l"><span>Chưa rõ gì</span><b id="sureOut">' + su + '/10</b><span>Rất rõ</span></div></div>';
    if (n) h += '<div class="cmp2"><div><small>Lúc nhận thuyền</small><b>' + esc(nLabel(g('x1.n'))) + '</b><span>Rõ ' + (g('x1.sure') == null ? 5 : +g('x1.sure')) + '/10</span></div><div class="cmp2__ar">' + PS.icon('next', 20, 2.6) + '</div><div class="now"><small>Bây giờ</small><b>' + esc(nLabel(n)) + '</b><span id="sureOut2">Rõ ' + su + '/10</span></div></div>' +
      '<p class="ps-small">Bạn đã thấy ' + fogOpen() + '/8 đảo và gặp ' + cardN() + ' Senpai.</p>';
    return h;
  };
  CHECK.open2 = function () { return g('f1.n') ? '' : 'Chọn số hướng'; };
  STEP.ps = function () { /* PS1.3.41: viết tái bút cho thư CD01 */
    var lt = c1Val('letter');
    return (lt ? '<div class="c1 c1--letter"><span class="c1__tag">' + PS.icon('book', 13) + 'Từ CD01</span><div><small>Thư bạn gửi mình 5 năm sau</small><q>' + esc(cut1(lt, 260)) + '</q></div></div>' + qh('Viết thêm một dòng tái bút cho lá thư đó')
      : qh('Viết một câu gửi mình 5 năm sau')) + areaHTML('f1.ps', 'Tái bút: ', 3, 300);
  };
  CHECK.ps = function () { return trim(g('f1.ps')).replace(/^Tái bút:\s*/, '').length >= 6 ? '' : 'Viết vài chữ nhé'; };
  function sheetData() {
    var p = prof(), f = flag(), bs = null, wl = ''; BASE5.forEach(function (b) { if (b.id === g('b22.base')) bs = b; }); WITH3.forEach(function (o) { if (o[0] === g('b53.with')) wl = o[1]; });
    var L = [];
    var cut = function (t, pre) { t = trim(t); return t.indexOf(pre) === 0 ? trim(t.slice(pre.length)) : t; };
    var c1L = ['main', 'me', 'value'].map(function (k) { var t = c1Val(k); return t ? C1_LAB[k] + ': ' + t : ''; }).filter(Boolean);
    if (c1L.length) L.push(['Từ CD01', c1L]);
    L.push(['Điều tôi coi trọng', ['Nghiêng rõ nhất: ' + lean(), 'Đi làm là để: ' + (cut(g('b33.work'), 'Với mình, đi làm là để') || '…'), 'Tuổi 30 tốt là: ' + (cut(g('b33.life'), 'Ở tuổi 30, một cuộc sống tốt với mình là') || '…')]]);
    VOY.forEach(function (x) { var is = voyIsle(x[0]); L.push([voyTitle(x[0]) + (leanVoy() === x[0] ? '  ★ đang nghiêng' : ''), [(is ? is.n : '…') + (g(x[0] + '.jl') ? ' · Tiếng Nhật: ' + (g(x[0] + '.jl') === 'x' ? 'vừa đủ' : g(x[0] + '.jl')) : '') + ' · Cân: ' + voyScore(x[0]) + '/100'].concat(msList(x[0]))]); });
    L.push(['Nền tôi xây ở JPC', [(bs ? bs.n + ': ' : '') + (g('b22.act') || '…')]]);
    L.push(['Khi đường bị chặn', [((blk() || {}).t || '…') + '. Bước đầu: ' + (g('b52.first') || '…')]]);
    var ad = curAd(), ps = p3Sum();
    if (ad) L.push([isPlan(ad) ? 'Kế hoạch kinh doanh tôi đã đọc' : 'Tin tuyển dụng 3 năm sau', [ad.n + (g('b61.why') ? '. Cần chuẩn bị: ' + trim(g('b61.why')) : '')]]);
    if (S.d['b62.q'] || S.done.b62) L.push(['Phỏng vấn 3 năm sau', [ivWho().n + ' · ' + ivQs().map(function (id) { return qOf(id).vi; }).join(' · ')]]);
    if (ps.y1.length + ps.y2.length + ps.y3.length) L.push(['Kế hoạch 3 năm ở Nhật', [['Năm 1', ps.y1], ['Năm 2', ps.y2], ['Năm 3', ps.y3]].filter(function (x) { return x[1].length; }).map(function (x) { return x[0] + ': ' + x[1].join('; '); })]);
    L.push(['Thử nhỏ 2 tuần', [trialTxt() + (wl ? ' (' + wl + ')' : '')]]);
    L.push(['Người giúp tôi', [ringName(g('b71.key')) + '. Cách học từ công việc: ' + (g('b72.h') || '…')]]);
    L.push(['Độ mở', ['Lúc nhận thuyền: ' + nLabel(g('x1.n')) + ', rõ ' + (g('x1.sure') == null ? 5 : g('x1.sure')) + '/10. Bây giờ: ' + nLabel(g('f1.n')) + ', rõ ' + (g('f1.sure') == null ? 5 : g('f1.sure')) + '/10.'].concat(trim(g('f1.change')) ? [trim(g('f1.change'))] : []).concat(trim(g('f1.ps')) ? [trim(g('f1.ps'))] : [])]);
    return { p: p, f: f, L: L };
  }
  STEP.sheet = function () {
    var D2 = sheetData(), p = D2.p;
    var h = shinSays('proud', '<p>Đây là <b>Hướng đi của tôi</b>: cả khóa trên một trang. Lưu ảnh hoặc in ra nhé.</p>', 60) +
      '<div class="sheet" id="sheet"><div class="sheet__h"><div class="sheet__flag">' + flagSVG(D2.f.s, D2.f.c, 64, 0) + '</div><div><small>PROSKILLS · CAREER DESIGN 02</small><b>Hướng đi của tôi</b><span>' + esc((p.name || '') + (p.cls ? ' · Lớp ' + p.cls : '')) + '</span>' +
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
    var h = shinSays('hi', '<p>Gửi bản này cho thầy cô nhé. Thầy cô sẽ biết bạn đang nghĩ gì để giúp bạn đúng lúc.</p>', 60);
    if (S.demo) h += '<p class="ps-small">Bản demo: không gửi thật.</p>';
    else if (!t) h += '<div class="ps-form"><label>Thầy cô hướng dẫn' + PS.teacherSelect('id="repT"') + '</label></div>';
    else h += '<p class="qsub">Gửi tới <b>' + esc(t.name) + '</b> qua Teams. Gửi kèm ảnh Hướng đi của tôi nhé.</p>';
    h += '<textarea class="ta repmsg" id="repMsg" rows="8" readonly>' + esc(msg) + '</textarea><div class="repbtns"><button type="button" class="btn btn--soft" data-act="copyMsg" data-k="rep.end">Chép tin nhắn</button>' +
      (t ? '<a class="btn" data-act="repTeams" target="_blank" rel="noopener" href="https://teams.microsoft.com/l/chat/0/0?users=' + encodeURIComponent(t.email) + '&message=' + encodeURIComponent(msg) + '">Mở Teams</a>' : '') + '</div>' +
      (sent ? '<p class="trialc__ok">' + PS.icon('check', 16, 3) + 'Đã gửi. Gửi lại lúc nào cũng được.</p>' : '<p class="ps-small">Chưa gửi được thì để sau. Bản này luôn ở Cảng Khởi Hành.</p>');
    return h;
  };
  function certHTML() {
    var p = prof(), f = flag(), d = new Date(S.fin || Date.now());
    return '<div class="cert"><div class="cert__in"><small>Proskills · Career Design 02</small><h2>Bằng Thuyền Trưởng</h2><div class="cert__flag">' + flagSVG(f.s, f.c, 90, 1) + '</div>' +
      '<p>Trao cho</p><b class="cert__nm">' + esc(p.name || given()) + '</b><p>đã ghé đủ ' + BEN.length + ' bến, vẽ 3 kế hoạch 5 năm và biết điều mình coi trọng.</p>' +
      (g('x1.motto') ? '<em>“' + esc(g('x1.motto')) + '”</em>' : '') + '<div class="cert__ft"><span>' + esc(PS.fmtDate ? PS.fmtDate(d) : d.toLocaleDateString('vi-VN')) + '</span>' + stampHTML(GOAL_PORT) + '</div></div></div>';
  }
  STEP.cert = function () {
    return certHTML() + '<div class="shipwrap">' + shipSVG(6, flag().s, flag().c, 200) + '</div>' +
      shinSays('cheer', '<p>Shin tặng bạn trang phục <b>Thuyền trưởng</b> trong Tủ đồ của Shin (Shin Routine › Sổ tay › Cài đặt).</p><p>Nhớ nhé: hướng nào cũng bắt đầu từ 3 năm ở Nhật. Giữ vững 3 năm đó, nhiều cửa sẽ mở ra.</p>', 64) +
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
      if (draw) { cx.fillStyle = '#FAF9F5'; cx.fillRect(0, 0, Wd, cv.height); var gr = cx.createLinearGradient(0, 0, Wd, 260); gr.addColorStop(0, '#D97757'); gr.addColorStop(1, '#B5532F'); cx.fillStyle = gr; cx.fillRect(0, 0, Wd, 260); }
      y = 52; font('700', 24); txt('PROSKILLS · CAREER DESIGN 02 · HẢI ĐỒ LA BÀN', PAD, IN, 40, '#FBE3D6');
      font('800', 56); txt('Hướng đi của tôi', PAD, IN, 72, '#FFFFFF');
      font('600', 28); txt((p.name || '') + (p.cls ? ' · Lớp ' + p.cls : '') + (p.sid ? ' · ' + p.sid : ''), PAD, IN, 40, 'rgba(255,255,255,.92)');
      y = 290;
      if (cmpImg) { if (draw) cx.drawImage(cmpImg, Wd / 2 - 150, y, 300, 300); y += 316; }
      if (g('x1.motto')) { font('700', 32); txt('“' + g('x1.motto') + '”', PAD, IN, 44, '#B5532F'); y += 10; }
      D2.L.forEach(function (sec) {
        var y0 = y; if (draw) { cx.fillStyle = '#FFFFFF'; cx.fillRect(PAD, y0, IN, sec.h || 0); cx.fillStyle = '#D97757'; cx.fillRect(PAD, y0, 8, sec.h || 0); }
        y += 22; font('800', 30); txt(sec[0], PAD + 32, IN - 60, 42, '#141413');
        font('400', 27); sec[1].forEach(function (t) { txt(t, PAD + 32, IN - 60, 38, '#3D3D3A'); });
        y += 20; if (!draw) sec.h = y - y0; y += 18;
      });
      font('500', 22); txt('Proskills · Khoa Kỹ năng JPC · ' + CD2_VER, PAD, IN, 34, '#6F6E69');
      return y + PAD;
    }
    function run(img) {
      try {
        cv.width = Wd; cv.height = 100; draw = false; var H = layout(img); cv.width = Wd; cv.height = Math.ceil(H); draw = true; layout(img);
        var url = cv.toDataURL('image/png'), nm = String(p.name || 'hoc-vien');
        if (nm.normalize) nm = nm.normalize('NFD').replace(/[̀-ͯ]/g, '');
        nm = nm.replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
        S.d['f2.img'] = S.d['f2.img'] || Date.now(); save();
        ov('<h2>Ảnh Hướng đi của tôi</h2><p class="ps-small">Giữ ngón tay lên ảnh để lưu, hoặc bấm Tải ảnh.</p><div class="imgbox"><img src="' + url + '" alt="Hướng đi của ' + esc(p.name || '') + '"></div>' +
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
    S.done[id] = S.done[id] || Date.now(); if (S.bak[id]) delete S.bak[id];
    S.xp[id] = CD2_XP_ACT;
    var ins = 0; a.steps.forEach(function (s) { if (s.k === 'write') ins += insOf(s.key); if (s.k === 'open1') ins += insOf('x1.now'); if (s.k === 'ps') ins += insOf('f1.ps'); });
    S.ins[id] = ins;
    markDay();
    var b = benOf(a.st), stampNew = false, finNew = false;
    if (b !== GOAL_PORT && (b === PORT ? portDone() : benDone(b)) && !S.stamp[b.id]) { S.stamp[b.id] = Date.now(); stampNew = true; }
    if (b === GOAL_PORT && benDone(b) && !S.fin) { S.fin = Date.now(); finNew = true; }
    if (id === 'x1') S.intro = 1;
    if (id === 'b63' && !cnt(g('b53.tk') || {})) { delete S.d['b53.start']; S.d['b53.start'] = trialStart(); }
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
    ov('<div class="stampov">' + stampHTML(b) + '<h2>Con dấu ' + esc(b.n) + '</h2>' + shinSays('cheer', b === PORT ? '<p>Nhổ neo! Thuyền đã rời Cảng 3 Năm. Bến 1 và Bến 2 đều mở, bạn đi bến nào trước cũng được.</p>' : '<p>Đã đóng dấu vào Sổ Thuyền Trưởng!</p>', 56) +
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
      '<div class="tl">' + cdIc('compass', 16) + '<b>' + (100 - fogPct()) + '%</b><small>Đảo đã khám phá</small></div><div class="tl">' + cdIc('card', 16) + '<b>' + cardN() + '/' + SENPAI.length + '</b><small>Thẻ Senpai</small></div></div>' +
      (g('x1.goal') ? '<div class="nbbox"><small>Mục tiêu khóa của bạn</small><p>' + esc(g('x1.goal')) + '</p></div>' : '') +
      (cur.length ? '<div class="nbbox"><small>Đảo bạn tò mò</small><p>' + cur.map(function (is) { return esc(is.n); }).join(' · ') + '</p></div>' : '') +
      '<p class="ps-small">Tổng XP của mọi khóa: <b>' + PS.totals().xp + '</b> (xem ở trang chính Proskills).</p>';
  }
  function nbLog() {
    var h = bookHTML(1);
    if (g('b31.v')) h += '<div class="nbbox"><small>La bàn của tôi</small><div class="cmpbox">' + compassSVG(pv(), 180) + '</div><p>Nghiêng rõ nhất: <b>' + esc(lean()) + '</b></p></div>';
    if (g('b22.base')) { var bs = null; BASE5.forEach(function (b) { if (b.id === g('b22.base')) bs = b; }); h += '<div class="nbbox"><small>Nền tôi xây từ bây giờ</small><p><b>' + esc(bs.n) + '</b> · ' + esc(g('b22.act') || '') + '</p></div>'; }
    if (g('b23.q')) h += '<div class="nbbox"><small>Câu tôi muốn hỏi Senpai</small><p>' + esc(g('b23.q')) + '</p></div>';
    if (g('b41.isl')) h += '<h3 class="qs">3 kế hoạch 5 năm</h3><div class="trio">' + VOY.map(function (x) { return voyCard(x[0]); }).join('') + '</div>';
    var p3 = p3Sum(); if (p3.y1.length + p3.y2.length + p3.y3.length) h += '<div class="nbbox"><small>Kế hoạch 3 năm ở Nhật</small><div class="p3">' + PLAN3_Y.map(function (o) { var it = p3['y' + o[0]]; return '<div class="p3__c"><b>' + esc(o[1]) + '</b>' + (it.length ? '<ul>' + it.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '<small>Chưa có</small>') + '</div>'; }).join('') + '</div></div>';
    if (trialTxt() && S.done.b63) h += '<div class="nbbox nbbox--plain">' + trialCard() + '</div>';
    if (g('b52.first')) h += '<div class="nbbox"><small>Khi đường bị chặn</small><p>' + esc((blk() || {}).t || '') + '. Bước đầu: <b>' + esc(g('b52.first')) + '</b></p></div>';
    if (g('b71.key')) h += '<div class="nbbox"><small>Người giúp tôi</small><div class="ringbox">' + ringSVG() + '</div><p>Người giúp nhiều nhất: <b>' + esc(ringName(g('b71.key'))) + '</b></p></div>';
    if (g('b72.h')) h += '<div class="nbbox"><small>Cách tôi học từ công việc</small><p><b>' + esc(g('b72.h')) + '</b>' + (g('b72.how') ? ' · ' + esc(g('b72.how')) : '') + '</p></div>';
    if (finDone()) h += '<button type="button" class="btn btn--go btn--w nbcert" data-act="certOv">' + cdIc('flag', 18) + 'Bằng Thuyền Trưởng</button>';
    return h;
  }
  function nbCards() { /* PS1.3.39: tab riêng cho bộ thẻ Senpai sưu tầm */
    var h = '<p class="nbsub">Đọc xong một chuyện là có một thẻ.</p>';
    h += '<h3 class="qs">Đã gặp (' + cardN() + '/' + SENPAI.length + ')</h3><div class="spgrid spgrid--nb">' + SENPAI.map(function (sp) {
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
    el.innerHTML = '<div class="nb__in"><div class="nb__cover"><div class="nb__top"><div><h2>Sổ Thuyền Trưởng</h2><small>' + esc(prof().name || 'Thuyền trưởng') + ' · Sổ tay CD02</small></div><button type="button" class="nb__x" data-act="nbClose" aria-label="Đóng sổ tay">' + PS.icon('close', 20) + '</button></div>' +
      '<div class="tabs" role="tablist">' + [['tq', 'Tổng quan'], ['ht', 'Bài làm'], ['sp', 'Thẻ Senpai'], ['cd', 'Cài đặt']].map(function (t) { return '<button type="button" role="tab" aria-selected="' + (NBTAB === t[0]) + '" class="' + (NBTAB === t[0] ? 'on' : '') + '" data-act="tab" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '</div><div id="nbBody" class="nb__body">' + (NBTAB === 'tq' ? nbOverview() : (NBTAB === 'ht' ? nbLog() : (NBTAB === 'sp' ? nbCards() : nbSettings()))) + '</div></div>';
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
    s.cd1 = { main: 'co-khi', jobKey: 'co-khi', mainName: 'Cơ khí', bName: 'Ô tô', far: 'Tổ trưởng, kèm người mới', letter: 'Gửi mình 5 năm sau: mong là giờ bạn đã đọc bản vẽ không cần hỏi ai.',
      me: '5 năm sau, mình muốn là người có nghề vững, lo được cho ba mẹ', value: ['Gia đình', 'Học hỏi, phát triển', 'Thu nhập tốt'], good: ['Kiên nhẫn', 'Khéo tay', 'Cẩn thận, tỉ mỉ'], like: ['Sửa chữa đồ đạc', 'Lắp ráp, tháo lắp'],
      jp2: 'N3', work: ['Đậu Ginou Kentei cơ khí cấp 3', 'Đứng máy CNC'], p2: 'Ở Nhật, mình sẽ đậu thi tay nghề, lên N3', senpai: 'Anh Hoài, cơ khí', learn: 'Mình muốn học theo cách anh tự học sau giờ làm',
      qs: ['Tháng đầu làm cơ khí, điều gì khó nhất?'], worry: 'Tiếng Nhật chưa đủ để hiểu cấp trên', first: 'Tắt điện thoại lúc 23 giờ', guide: 'Anh họ đang làm ở Nhật', habits: ['Khi về phòng, tôi sẽ ôn 10 từ mới.'], motto: 'Chậm mà chắc, đi là tới.', endAt: Date.now() - 5 * 864e5 };
    s.d = { 'x1.flag': { s: 'whale', c: '#6E9E94' }, 'x1.motto': 'Đi chậm mà chắc', 'x1.n': '2', 'x1.sure': 6, 'x1.now': 'Mình sẽ về Việt Nam làm cho công ty Nhật.', 'x1.goal': 'Mình muốn biết thêm các hướng đi sau 3 năm.', 'x1.carry': ['me', 'value', 'far'] };
    var t0 = Date.now() - 864e5, d = s.d;
    /* PS1.3.38: học viên giả định đã xong Xuất phát + Bến 1–3, để thầy cô thử ngay Bến 4–6 và Cảng Khởi Hành */
    d['b11.g'] = { thuy: 'cau', lich: 'len', linh: 're', hoi: 'cau', sy: 'len', mai: 'chu' };
    d['b12.t'] = { len: 'cur', re: 'new', hoc: 'no', gio: 'new', chu: 'cur', lap: 'no', cau: 'cur', que: 'new' };
    d['b13.isl'] = 'cau'; d['b13.why'] = 'Mình muốn về gần nhà mà vẫn dùng tiếng Nhật.';
    d['b21.b1'] = 'hoai'; d['b21.fr1'] = 'bn'; d['b21.b2'] = 'thuy'; d['b21.fr2'] = 'nay'; d['b21.take'] = 'Mình thấy tiếng Nhật giỏi thì có thêm lựa chọn.';
    d['b22.g'] = { jp: 'm', change: 'm', learn: 'm', goal: 'f', rel: 'm', fam: 'f', retry: 'f', rich: 'f' }; d['b22.rev'] = 1; d['b22.base'] = 'jp'; d['b22.act'] = 'Mỗi ngày 10 từ mới';
    d['b23.who'] = 'hanh'; d['b23.ask'] = [0, 2, 4]; d['b23.q'] = 'Anh chị chuẩn bị gì từ năm đầu để về có việc tốt?';
    d['b31.v'] = [3, 5, 4, 3, 4, 7]; d['b31.why'] = 'Vì ba mẹ mình lớn tuổi rồi.';
    d['b32.s'] = { 0: 'hard', 1: 'can', 2: 'can', 3: 'hard', 4: 'hard', 5: 'can', 6: 'can', 7: 'can' }; d['b32.h'] = '0'; d['b32.c'] = '2'; d['b32.hard'] = 'Mình sẽ nói chuyện với gia đình.'; d['b32.can'] = 'Mình ôn 10 từ mới mỗi tối.';
    d['b33.work'] = 'Với mình, đi làm là để giỏi một nghề'; d['b33.life'] = 'Ở tuổi 30, một cuộc sống tốt với mình là gần ba mẹ';
    ['b11', 'b12', 'b21', 'b22', 'b23', 'b31', 'b32', 'b33'].forEach(function (a) { s.done[a] = t0; s.xp[a] = CD2_XP_ACT; });
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
    else if (a === 'mapMode') { mapMode = v === 'isl' ? 'isl' : 'ben'; var cbx = D.getElementById('chartbox'); if (cbx) cbx.className = 'chartbox' + (mapMode === 'isl' ? ' isl-on' : ''); [].forEach.call(APP.querySelectorAll('.seg__b'), function (x) { var o = x.getAttribute('data-v') === mapMode; x.className = 'seg__b' + (o ? ' on' : ''); x.setAttribute('aria-pressed', o); }); var ms = D.getElementById('mapSub'); if (ms) ms.innerHTML = esc(mapSub(portDone())); }
    else if (a === 'rnd') { var rg = D.getElementById('rg' + v); openR[v] = !openR[v]; if (rg) { rg.className = 'rgrp' + (openR[v] ? ' on' : ''); b.setAttribute('aria-expanded', !!openR[v]); } }
    else if (a === 'sp') { if (V.v === 'act') { ov(spBody(spOf(id))); collect(id, true); } else go({ v: 'sp', id: id, from: V.v === 'isle' ? V.id : null }); }
    else if (a === 'showIntro') { V.showIntro = 1; QUIET = true; render(false); QUIET = false; }
    else if (a === 'next') { var s0 = ACTS[V.id].steps[V.step]; if (check(s0)) return; if (s0.k === 'open1' && g('x1.sure') == null) S.d['x1.sure'] = 5; if (s0.k === 'open2' && g('f1.sure') == null) S.d['f1.sure'] = 5; if (s0.k === 'weigh') S.d['b51.w'] = wOf(); if (s0.k === 'ivset') { S.d['b62.who'] = ivWho().id; S.d['b62.q'] = ivQs(); } V.step++; S.d[V.id + '.st'] = V.step; save(); try { history.replaceState(hState(V), ''); } catch (er) {} render(true); }
    else if (a === 'prev') { if (V.step > 0) { V.step--; render(true); } }
    else if (a === 'finish') { var s1 = ACTS[V.id].steps[V.step]; if (check(s1)) return; finishAct(); }
    else if (a === 'pick') { S.d[k] = v; if (k === 'x1.job' && v !== 'u') { /* đổi nghề: sách cùng nghề chọn lại */ } save(); redrawStep(); }
    else if (a === 'tip') { var ta = APP.querySelector('[data-k="' + k + '"]'); if (ta) { ta.value = v; S.d[k] = v; save(); updIns(k); if (k === 'b71.to') msgSync(); refreshBar(); try { ta.focus(); } catch (er) {} } }
    else if (a === 'msTip') { var slot = null, dup = false; ['1', '3', '5'].forEach(function (y) { if (trim(g(k + '.m' + y)) === v) dup = true; }); if (dup) { PS.toast('Gợi ý này đã có trong một mốc.'); return; } ['1', '3', '5'].forEach(function (y) { if (!slot && trim(g(k + '.m' + y)).length < 3) slot = y; }); if (!slot) { PS.toast('3 mốc đã có chữ. Sửa trực tiếp trong ô nhé.'); return; } S.d[k + '.m' + slot] = v; save(); keepY(redrawStep); }
    else if (a === 'meter') { var G2 = gOf(k); G2[id] = +v; S.d[k + '.g'] = G2; save(); sfx('flip'); keepY(redrawStep); }
    else if (a === 'wt') { var W3 = wOf(); W3[id] = +v; S.d['b51.w'] = W3; save(); keepY(redrawStep); }
    else if (a === 'blk') { if (g('b52.b') !== v) { ['b52.w1', 'b52.w2', 'b52.w3', 'b52.ws', 'b52.own', 'b52.first'].forEach(function (x) { delete S.d[x]; }); } S.d['b52.b'] = v; save(); keepY(redrawStep); }
    else if (a === 'way') { var L2 = (g('b52.ws') || []).slice(), ix = L2.indexOf(v); if (ix > -1) L2.splice(ix, 1); else { if (L2.length >= 3) { PS.toast('Chọn tối đa 3 cách. Bỏ một cách trước nhé.'); return; } L2.push(v); } S.d['b52.ws'] = L2; if (g('b52.first') && waysSel().indexOf(g('b52.first')) < 0) delete S.d['b52.first']; save(); keepY(redrawStep); }
    else if (a === 'trTick') { var TK = g('b53.tk') || {}; TK[dayKey(new Date())] = 1; S.d['b53.tk'] = TK; markDay(); save(true); sfx('ting'); PS.toast('Thêm một ngày thử nhỏ. Giỏi lắm!'); if (nbOpen) drawNb(); else { QUIET = true; render(false); QUIET = false; } }
    else if (a === 'ring') { var RR = g('b71.r') || {}; RR[id] = v; S.d['b71.r'] = RR; save(); keepY(redrawStep); }
    else if (a === 'msgQ') { S.d['b71.mq'] = v; if (!g('b71.ed')) S.d['b71.msg'] = msgTpl(); save(); keepY(redrawStep); }
    else if (a === 'msgReset') { delete S.d['b71.ed']; S.d['b71.msg'] = msgTpl(); save(); keepY(redrawStep); }
    else if (a === 'copyMsg') copyText(k);
    else if (a === 'repTeams') { S.d['rep.end'] = Date.now(); save(true); setTimeout(function () { if (V.v === 'act') keepY(redrawStep); }, 400); }
    else if (a === 'work') { var P2 = g('b72.w') || {}; P2[id] = +v; S.d['b72.w'] = P2; save(); keepY(redrawStep); }
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
    else if (a === 'peer') { S.d['b23.who'] = v; S.d['b23.ask'] = []; save(); sfx('ting'); redrawStep(); }
    else if (a === 'peerRe') { delete S.d['b23.who']; S.d['b23.ask'] = []; save(); redrawStep(); }
    else if (a === 'adKind') { if (adKind() !== v) { delete S.d['b61.ad']; } S.d['b61.kind'] = v; save(); keepY(redrawStep); }
    else if (a === 'adPick') { if (g('b61.ad') !== v) { ['b61.c', 'b61.pm', 'b61.inv', 'b61.prep'].forEach(function (x) { delete S.d[x]; }); } S.d['b61.ad'] = v; if (!g('b61.kind')) S.d['b61.kind'] = adKind(); save(); sfx('flip'); keepY(redrawStep); }
    else if (a === 'adc') { var AC2 = adCol(), cy = { '': 'g', g: 'y', y: 'x', x: 'g' }; AC2[id] = cy[AC2[id] || '']; S.d['b61.c'] = AC2; save(); keepY(redrawStep); }
    else if (a === 'pmark') { var PM = planMark(); PM[id] = v; S.d['b61.pm'] = PM; save(); keepY(redrawStep); }
    else if (a === 'prep') { var PP = (g('b61.prep') || []).slice(), pi = PP.indexOf(v); if (pi > -1) PP.splice(pi, 1); else { if (PP.length >= 3) { PS.toast('Chọn tối đa 3 điều.'); return; } PP.push(v); } S.d['b61.prep'] = PP; save(); keepY(redrawStep); }
    else if (a === 'ivWho') { var W4 = null; IV_WHO.forEach(function (x) { if (x.id === v) W4 = x; }); if (W4) { S.d['b62.who'] = v; S.d['b62.q'] = W4.q.slice(); save(); keepY(redrawStep); } }
    else if (a === 'ivQ') { var IQ = ivQs(), qi = IQ.indexOf(v); if (qi > -1) IQ.splice(qi, 1); else { if (IQ.length >= 3) { PS.toast('Chọn 3 câu. Bỏ một câu trước nhé.'); return; } IQ.push(v); } S.d['b62.q'] = IQ; if (!g('b62.who')) S.d['b62.who'] = ivWho().id; save(); keepY(redrawStep); }
    else if (a === 'ivSpeak') speakJa(v);
    else if (a === 'yr') { var EL = evList(), it = EL[+id]; if (it) { var YM = p3Map(); YM[it.t] = YM[it.t] === v ? '' : v; S.d['b63.y'] = YM; save(); keepY(redrawStep); } }
    else if (a === 'p3add') { var inp = D.getElementById('p3New'), tv = inp ? trim(inp.value) : ''; if (tv.length < 3) { PS.toast('Viết vài chữ rồi bấm Thêm nhé.'); return; } var OW = (g('b63.own') || []).slice(); if (OW.indexOf(tv) < 0) OW.push(tv); S.d['b63.own'] = OW; save(); keepY(redrawStep); }
    else if (a === 'ask') { var L = (g('b23.ask') || []).slice(); if (L.indexOf(+v) < 0) L.push(+v); S.d['b23.ask'] = L; save(); redrawStep(); }
    else if (a === 'wind') { var M = g('b32.s') || {}; M[id] = v; S.d['b32.s'] = M; save(); redrawStep(); }
    else if (a === 'nb') openNb('cd');
    else if (a === 'nbClose') closeNb();
    else if (a === 'tab') { NBTAB = b.getAttribute('data-t'); drawNb(); }
    else if (a === 'ovClose') closeOv();
    else if (a === 'ovHome') { closeOv(); go({ v: 'home' }); }
    else if (a === 'demoExit') exitDemo();
    else if (a === 'actMenu') actMenu(id);
    else if (a === 'actView') { closeOv(); go({ v: 'act', id: id, step: 0 }); }
    else if (a === 'actReset') resetAsk(id);
    else if (a === 'actResetGo') resetDo(id);
    else if (a === 'actRestore') restoreDo(id);
    else if (a === 'carry') { var CR = (g('x1.carry') || []).slice(), ci = CR.indexOf(v); if (ci > -1) CR.splice(ci, 1); else { if (CR.length >= 3) { PS.toast('Chọn tối đa 3 điều. Bỏ một điều trước nhé.'); return; } CR.push(v); } S.d['x1.carry'] = CR; save(); keepY(redrawStep); }
    else if (a === 'multi2') { var M2 = (g(k) || []).slice(), mi = M2.indexOf(v); if (mi > -1) M2.splice(mi, 1); else { if (M2.length >= 2) { PS.toast('Chọn tối đa 2 điều.'); return; } M2.push(v); } S.d[k] = M2; save(); keepY(redrawStep); }
  });
  /* ---------- PS1.3.41: chặng đã xong → Xem và sửa / Làm lại từ đầu (giữ bài cũ đến khi đóng dấu lại), theo CD01 ---------- */
  function actMenu(id) {
    var a = ACTS[id]; if (!a) return;
    if (S.bak[id]) { go({ v: 'act', id: id, step: 0 }); return; }
    ov('<h2>' + esc(a.t) + '</h2><p class="ps-small">Bạn đã xong chặng này.</p><div class="amenu">' +
      '<button type="button" class="sheetbtn" data-act="actView" data-id="' + id + '">' + PS.icon('book', 18) + '<span><b>Xem và sửa</b><small>Giữ bài cũ, sửa từng chỗ</small></span></button>' +
      '<button type="button" class="sheetbtn" data-act="actReset" data-id="' + id + '">' + cdIc('turn', 18) + '<span><b>Làm lại từ đầu</b><small>Làm lại chặng này, bài cũ giữ tạm</small></span></button></div>' +
      '<button type="button" class="link" data-act="ovClose">Đóng</button>');
  }
  function resetAsk(id) {
    ov('<h2>Làm lại từ đầu?</h2><p>Bài cũ của chặng <b>' + esc(ACTS[id].t) + '</b> được giữ tạm. Đóng dấu lại thì bài mới thay bài cũ. Bỏ dở thì vẫn khôi phục được.</p>' +
      '<button type="button" class="btn btn--w" data-act="actResetGo" data-id="' + id + '">Làm lại từ đầu</button><button type="button" class="link" data-act="ovClose">Thôi, giữ bài cũ</button>');
  }
  var ACT_KEYS = { b12: ['b12.', 'b13.'], b42: ['b42.', 'b43.'], b63: ['b63.', 'b53.'] }; /* PS1.3.42: chặng gộp giữ khóa cũ */
  function actKeys(id) { var P = ACT_KEYS[id] || [id + '.'], out = []; for (var k in S.d) if (S.d.hasOwnProperty(k) && P.some(function (p) { return k.indexOf(p) === 0; })) out.push(k); return out; }
  function resetDo(id) {
    var keep = S.bak[id] || {}, fresh = !S.bak[id];
    actKeys(id).forEach(function (k) { if (fresh) keep[k] = S.d[k]; delete S.d[k]; });
    S.bak[id] = keep; save(true); closeOv(); go({ v: 'act', id: id, step: 0 });
  }
  function restoreDo(id) {
    var bk = S.bak[id]; if (!bk) return;
    actKeys(id).forEach(function (k) { delete S.d[k]; });
    for (var k in bk) if (bk.hasOwnProperty(k)) S.d[k] = bk[k];
    delete S.bak[id]; save(true); PS.toast('Đã khôi phục bài cũ.'); render(false);
  }
  function updIns(k) { var el = APP.querySelector('[data-ins="' + k + '"]'); if (el) el.innerHTML = insTxt(k); }
  D.addEventListener('input', function (e) {
    var t = e.target, k = t.getAttribute && t.getAttribute('data-k'); if (!k) return;
    if (t.type === 'range') { S.d[k] = +t.value; var o = D.getElementById('sureOut'); if (o) o.textContent = t.value + '/10'; var o2 = D.getElementById('sureOut2'); if (o2) o2.textContent = 'Rõ ' + t.value + '/10'; save(); return; }
    S.d[k] = t.value; if (k === 'b71.msg') S.d['b71.ed'] = 1; save(); updIns(k); if (k === 'b71.to') msgSync(); refreshBar();
  });
  function msgSync() { if (g('b71.ed')) return; var ta = D.getElementById('repMsg'); S.d['b71.msg'] = msgTpl(); if (ta && ta.getAttribute('data-k') === 'b71.msg') ta.value = S.d['b71.msg']; }
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
