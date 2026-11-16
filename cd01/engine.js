/* CD01 · Career Design 1 · cd01/engine.js · BỘ MÁY: trạng thái, gắn lõi Proskills, điều hướng, các dạng bước, Sổ tay, demo.
   Luồng theo TK: Sơ đồ tuyến → trang ga (lời Shin, khởi động, chặng, ô Bản Career Design) → trang chặng (mỗi bước một màn).
   Giao diện theo CD49. Chữ nằm ở content.js. ES5. */
(function (W, D) {
  'use strict';
  var PS = W.PS, ID = CD_ID, esc = PS.esc;
  var DEMO_KEY = 'ps.demo.' + ID;
  var DQ = PS.demoParam();
  var WANT_DEMO = DQ.on && PS.checkDemo(DQ.val);
  var ASK_DEMO = DQ.on && !WANT_DEMO;
  var DEMO_ON = WANT_DEMO || (!ASK_DEMO && !!PS.get(DEMO_KEY, null));
  var OK = DEMO_ON || ASK_DEMO || PS.guard(ID);
  if (!OK) return;

  /* =========================================================
     1. TRẠNG THÁI
     ========================================================= */
  function blank() { return { v: 1, intro: 0, created: Date.now(), d: {}, done: {}, xp: {}, ins: {}, days: {}, seen: {}, chest: {} }; }
  function normalize(s) { var b = blank(); for (var k in b) if (s[k] === undefined) s[k] = b[k]; return s; }
  function load() {
    var s = null;
    try { s = (DEMO_ON && !WANT_DEMO) ? PS.get(DEMO_KEY, null) : PS.load(ID); } catch (e) {}
    return (s && typeof s === 'object') ? normalize(s) : blank();
  }
  var S = load();
  var NOSAVE = ASK_DEMO ? 1 : 0, saveT = null;
  function prof() { return S.demo ? (S.prof || {}) : PS.profile(); }
  function given() { var n = String(prof().name || '').trim().split(/\s+/); return n[n.length - 1] || 'bạn'; }
  function T(s) { return String(s == null ? '' : s).replace(/\[Tên\]/g, '<b class="nm">' + esc(given()) + '</b>'); }
  function g(k) { return S.d[k]; }
  function ga(k) { var v = S.d[k]; return (v && v.push) ? v : []; }
  function sumObj(o) { var t = 0; for (var k in o) if (o.hasOwnProperty(k)) t += (+o[k] || 0); return t; }
  function xpTotal() { return sumObj(S.xp); }
  function insTotal() { return sumObj(S.ins); }
  function doneMain() { var n = 0; ORDER.forEach(function (a) { if (S.done[a]) n++; }); return n; }
  function extra() {
    return { goal: g('x1.goal') || '', now: g('x1.now') || '', me: g('a13.me') || '', hope: ga('a13.hope'), first: g('a13.first') || '' };
  }
  function save(now) {
    clearTimeout(saveT);
    if (NOSAVE || W.PS_NOSAVE) return;
    var w = function () {
      if (NOSAVE || W.PS_NOSAVE) return;
      try {
        if (S.demo) { S.savedAt = Date.now(); PS.set(DEMO_KEY, S); return; }
        PS.save(ID, S);
        PS.report(ID, { xp: xpTotal(), ins: insTotal(), done: doneMain(), total: CD_TOTAL, days: S.days, ver: CD_VER, extra: extra() });
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

  /* thời gian học: chỉ đếm khi màn hình mở và có thao tác trong 60 giây gần nhất */
  var lastAct = Date.now();
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (ev) { W.addEventListener(ev, function () { lastAct = Date.now(); }, { passive: true }); });
  setInterval(function () {
    if (D.visibilityState !== 'visible' || Date.now() - lastAct > 60000 || S.demo) return;
    var k = PS.today(); S.days[k] = Math.round(((S.days[k] || 0) + 0.25) * 100) / 100; save();
  }, 15000);
  function markDay() { if (S.demo) return; var k = PS.today(); if (!S.days[k]) { S.days[k] = 0.25; save(); } }

  /* =========================================================
     2. GA, CHẶNG, MỞ KHÓA
     ========================================================= */
  var ALLST = [START].concat(STATIONS);
  function stById(id) { for (var i = 0; i < ALLST.length; i++) if (ALLST[i].id === id) return ALLST[i]; return id === FINAL.id ? FINAL : null; }
  function stReady(st) { return st === START || !!st.ready; }
  function stDone(st) { return stReady(st) && st.acts.every(function (a) { return !!S.done[a]; }); }
  function stIndex(st) { return ALLST.indexOf(st); }
  function stOpen(st) { var i = stIndex(st); return i === 0 || (stReady(st) && stDone(ALLST[i - 1])); }
  function nextAct() { for (var i = 0; i < ORDER.length; i++) if (!S.done[ORDER[i]]) return ORDER[i]; return null; }
  function actOpen(id) {
    var a = ACTS[id]; if (!a) return false;
    if (a.warm) return stOpen(stById(a.st));
    var i = ORDER.indexOf(id); if (i < 0) return false;
    for (var j = 0; j < i; j++) if (!S.done[ORDER[j]]) return false;
    return true;
  }
  function curStation() {
    var n = nextAct(); if (n) return stById(ACTS[n].st);
    for (var i = 0; i < ALLST.length; i++) if (!stDone(ALLST[i])) return ALLST[i];
    return FINAL;
  }
  function gaDoneCount() { var k = 0; STATIONS.forEach(function (st) { if (stDone(st)) k++; }); return k; }
  function stampCount() { var k = 0; ALLST.forEach(function (st) { if (stDone(st)) k++; }); return k; }
  function shinStage() { var k = gaDoneCount(); return k >= 5 ? 3 : (k >= 3 ? 2 : (k >= 1 ? 1 : 0)); }
  W.shinCracks = function () { var k = 0; ['x1', 'a11', 'a13'].forEach(function (a) { if (S.done[a]) k++; }); return k; };
  function shinNow(mood, sz, anim) { return shin(mood, sz, shinStage(), anim); }
  function shinSays(mood, html, sz, cls) {
    return '<div class="shinbox' + (cls ? ' ' + cls : '') + '">' + shinNow(mood, sz || 60, 'bob') + '<div class="shinbox__b"><b>' + esc(SHIN_NAMES[shinStage()]) + '</b>' + html + '</div></div>';
  }
  function stLabel(st) { return st === START ? 'Sân ga' : (st === FINAL ? 'Ga cuối' : 'Ga ' + (st.n < 10 ? '0' : '') + st.n); }
  function actLabel(id) {
    var a = ACTS[id], st = stById(a.st);
    if (a.warm) return stLabel(st) + ' · Khởi động';
    if (st === START) return 'Sân ga · Xuất phát';
    return stLabel(st) + ' · Chặng ' + (st.acts.indexOf(id) + 1);
  }
  function stMins(st) { var m = 0; (st.acts || []).forEach(function (a) { if (ACTS[a]) m += ACTS[a].mins; }); return m; }
  function tint(hex) { /* màu nhạt cho nhãn ga, không dùng color-mix để chạy trên máy cũ */
    var h = hex.replace('#', ''), r = parseInt(h.substr(0, 2), 16), gg = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
    function m(c) { return Math.round(c * 0.12 + 255 * 0.88); }
    return 'rgb(' + m(r) + ',' + m(gg) + ',' + m(b) + ')';
  }

  /* =========================================================
     3. BẢN CAREER DESIGN
     ========================================================= */
  var NOW_LBL = {}; ACTS.x1.steps[1].opts.forEach(function (o) { NOW_LBL[o.v] = o.t; });
  function cardFilled(n) {
    if (n === 1) return !!S.done.x1;
    if (n === 2) return stDone(STATIONS[0]);
    return false;
  }
  function cardBody(n) {
    if (n === 1) return '<p>' + esc(g('x1.goal') || '') + '</p>' + (g('x1.now') ? '<small class="lbl">Lúc lên tàu: ' + esc(NOW_LBL[g('x1.now')] || '') + '</small>' : '');
    if (n === 2) return '<p>' + esc(g('a13.me') || '') + '</p>' +
      (ga('a13.hope').length ? '<div class="tags">' + ga('a13.hope').map(function (h) { return '<span>' + esc(h) + '</span>'; }).join('') + '</div>' : '') +
      (g('a13.first') ? '<p><small class="lbl">Việc nhỏ đầu tiên</small>' + esc(g('a13.first')) + '</p>' : '');
    return '';
  }
  function cdCard(n, isNew) {
    var c = CARDS[n - 1], st = stById(c.st), f = cardFilled(n);
    return '<div class="cdcard' + (f ? '' : ' cdcard--empty') + (isNew ? ' cdcard--new' : '') + '"><span class="cdcard__n">' + n + '</span><h4>' + esc(c.t) + '</h4>' +
      (f ? cardBody(n) : '<p>Điền ở ' + esc(st.vn) + '.</p>') + '</div>';
  }
  function cardCount() { var k = 0; for (var i = 1; i <= 8; i++) if (cardFilled(i)) k++; return k; }

  /* =========================================================
     4. GIAO DIỆN CHUNG
     ========================================================= */
  var APP = D.getElementById('app');
  var V = { v: 'home' }, nbOpen = false, NBTAB = 'tq';
  function topnav() {
    return '<nav class="topnav" aria-label="Điều hướng"><div class="topnav__in">' +
      (V.v === 'home' ? '<button type="button" class="tn-home" data-act="psHome">' + cdIcon('arrowL', 18, 2.4) + 'Proskills</button>' : '') +
      '<span class="tn-sp"></span><div class="tn-pill"><span class="pts" aria-label="Điểm">' +
      '<span class="p-fire" title="Chuỗi ngày">' + PS.icon('flame', 15) + (S.demo ? 5 : PS.streak()) + '</span>' +
      '<span class="p-xp" title="XP">' + PS.icon('star', 15) + xpTotal() + '</span>' +
      '<span class="p-ins" title="Insight">' + PS.icon('bulb', 15) + insTotal() + '</span></span>' +
      '<button type="button" class="tn-btn' + (V.v === 'home' ? ' on' : '') + '" data-act="home" aria-label="Sơ đồ tuyến" title="Sơ đồ tuyến">' + cdIcon('map', 20) + '</button>' +
      '<button type="button" class="tn-btn" data-act="nb" aria-label="Sổ tay" title="Sổ tay">' + PS.icon('book', 20) + '</button></div></div></nav>';
  }
  function demoStrip() { return S.demo ? '<div class="demo-strip"><span>Bản demo giáo viên · học viên giả định</span><button type="button" data-act="demoExit">Thoát demo</button></div>' : ''; }
  function render(top) {
    if (V.v === 'intro') { APP.innerHTML = '<div class="wrap enter">' + viewIntro() + '</div>'; stagger(); return; }
    var h = V.v === 'st' ? viewStation() : (V.v === 'act' ? viewAct() : viewHome());
    APP.innerHTML = topnav() + '<div class="wrap enter' + (S.demo ? ' wrap--demo' : '') + '">' + h + '</div>' + demoStrip();
    stagger();
    if (top !== false) W.scrollTo(0, 0);
  }
  function stagger() { var w = APP.querySelector('.enter'); if (!w) return; var c = w.children; for (var i = 0; i < c.length; i++) c[i].style.setProperty('--i', Math.min(i, 8)); }
  function go(v) { V = v; render(true); }

  /* ---------- màn mở đầu ---------- */
  function viewIntro() {
    return '<div class="intro">' + shin('hi', 150, 0, 'bob') +
      '<span class="kicker">' + esc(TXT.introKicker) + '</span><h2 class="h1">Thiết kế <em>hành trình nghề nghiệp</em> của bạn</h2>' +
      shinSays('hi', T(TXT.intro)) +
      '<p style="margin-top:16px"><button type="button" class="btn btn--w" data-act="introGo">' + esc(TXT.introBtn) + '</button></p></div>';
  }

  /* ---------- trang chủ module: vé + Bản Career Design + sơ đồ tuyến ---------- */
  function viewHome() {
    var nx = nextAct(), p = prof(), stp = stampCount(), pct = Math.round(doneMain() / CD_TOTAL * 100);
    var hi = nx ? TXT.homeHi[new Date().getDate() % TXT.homeHi.length] : TXT.homeDone1;
    var created = new Date(S.created || Date.now());
    var cta;
    if (nx) cta = '<button type="button" class="btn btn--go btn--w" data-act="open" data-id="' + nx + '">' + (doneMain() ? 'Đi tiếp: ' : 'Bắt đầu: ') + esc(ACTS[nx].t) + '</button>';
    else { var cs = curStation(); cta = '<button type="button" class="btn btn--go btn--w" disabled>' + esc(cs.vn) + ' sắp mở</button>'; }
    var trainX = 8 + Math.min(84, pct * 0.84);
    return shinSays(nx ? 'hi' : 'cheer', T(hi)) +
      '<section class="ticket" aria-label="Vé hành trình"><div class="ticket__body">' +
      '<div class="ticket__lab"><span>Vé hành trình</span><span>CD01</span></div>' +
      '<div class="ticket__route"><div><small>しゅっぱつ</small><b>JPC</b></div><div></div><div class="r"><small>ゆめ</small><b>Ước Mơ</b></div></div>' +
      '<div class="ticket__track"><span class="ticket__train" style="left:' + trainX + '%">' + trainSvg() + '</span></div>' +
      '<div class="ticket__grid"><div><small>Hành khách</small><b>' + esc(p.name || '—') + '</b></div><div><small>Lớp</small><b>' + esc(p.cls || '—') + '</b></div>' +
      '<div><small>Diện</small><b>' + esc(p.path || 'Chưa rõ') + '</b></div><div><small>Ngày lên tàu</small><b>' + esc(PS.fmtDate ? PS.fmtDate(created) : created.toLocaleDateString('vi-VN')) + '</b></div></div>' +
      '<div class="ticket__bar"><i style="width:' + pct + '%"></i></div><div class="ticket__meta">' + doneMain() + '/' + CD_TOTAL + ' chặng · ' + cardCount() + '/8 ô Bản Career Design</div>' + cta + '</div>' +
      '<div class="ticket__stub"><span>ID <b style="font-size:14px">' + esc(p.sid || '—') + '</b></span><span>Con dấu <b>' + stp + '</b>/8</span></div></section>' +
      '<section class="cdmini"><div class="cdmini__top">' + cdIcon('ticket', 22) + '<b>Bản Career Design của tôi</b><small>' + cardCount() + '/8 ô</small></div>' +
      '<div class="cdmini__dots">' + CARDS.map(function (c) { return '<i class="' + (cardFilled(c.n) ? 'on' : '') + '">' + c.n + '</i>'; }).join('') + '</div>' +
      '<button type="button" class="btn btn--soft btn--w btn--sm" data-act="nbcd">Xem Bản Career Design</button></section>' +
      '<h2 class="sec-h">Sơ đồ tuyến Career Design</h2><p class="sec-sub">Đi lần lượt từng ga · chạm vào ga để vào</p>' +
      '<div class="route">' + ALLST.map(stopHTML).join('') + stopHTML(FINAL) + '</div>' +
      '<p class="foot">Proskills · Career Design 01 · ' + esc(CD_VER) + '<br>Bài làm tự lưu trên trình duyệt của máy này</p>';
  }
  function trainSvg() {
    return '<svg width="34" height="22" viewBox="0 0 34 22" aria-hidden="true"><rect x="2" y="3" width="28" height="14" rx="6" fill="#fff"/><rect x="6" y="6" width="7" height="5" rx="1.5" fill="#2F6BFF"/><rect x="15" y="6" width="7" height="5" rx="1.5" fill="#2F6BFF"/><circle cx="9" cy="18.5" r="2.5" fill="#FFC93C"/><circle cx="23" cy="18.5" r="2.5" fill="#FFC93C"/><rect x="25" y="7" width="3" height="3" rx="1" fill="#FFC93C"/></svg>';
  }
  function stopHTML(st) {
    var isFinal = st === FINAL, ready = !isFinal && stReady(st), dn = ready && stDone(st), open = ready && stOpen(st);
    var cur = !isFinal && curStation() === st && open && !dn;
    var acts = st.acts || [], nd = acts.filter(function (a) { return !!S.done[a]; }).length;
    var cls = 'stop' + (cur ? ' stop--cur' : '') + ((!open && !dn) ? ' stop--lock' : '');
    var badge;
    if (dn) badge = '<span class="badge badge--ok">Đã qua</span>';
    else if (cur) badge = '<span class="badge">' + (nd ? nd + '/' + acts.length + ' chặng' : 'Tiếp theo') + '</span>';
    else if (!isFinal && !ready) badge = '<span class="badge badge--soon">Đang xây</span>';
    else badge = '';
    var meta = isFinal ? '' : '<div class="stop__meta"><span>' + acts.length + ' chặng · ' + (stMins(st) || '~15') + ' phút</span><span class="pips">' + acts.map(function (a) { return '<i class="' + (S.done[a] ? 'on' : '') + '"></i>'; }).join('') + '</span>' + badge + '</div>';
    var ic = (!open && !dn) ? PS.icon('lock', 22) : cdIcon(st.ic, 26);
    var tag = (open || dn) ? 'button type="button" data-act="station" data-st="' + st.id + '"' : 'div';
    return '<' + tag + ' class="' + cls + '" style="--lc:' + st.lc + ';--lt:' + tint(st.lc) + '"><span class="stop__ic">' + ic + '</span><span><span class="stop__lab">' + esc(stLabel(st).toUpperCase()) + '</span><b>' + esc(st.vn) + '</b><p>' + esc(st.sub) + '</p>' + meta + '</span></' + (tag === 'div' ? 'div' : 'button') + '>';
  }

  /* ---------- trang ga ---------- */
  function viewStation() {
    var st = stById(V.st), acts = st.acts, nd = acts.filter(function (a) { return !!S.done[a]; }).length;
    var first = !S.seen[st.id];
    if (first) { S.seen[st.id] = 1; save(); }
    var h = '<button type="button" class="back" data-act="home">' + cdIcon('arrowL', 18, 2.4) + 'Sơ đồ tuyến</button>' +
      '<section class="banner"><div class="banner__top"><div class="kanji' + (st.k.length > 2 ? ' k3' : '') + ' jp">' + esc(st.k) + '</div><div>' +
      '<div class="banner__lab">' + esc(stLabel(st).toUpperCase()) + '</div><h1>' + esc(st.vn) + '</h1>' +
      '<div class="banner__ro"><span class="jp">' + esc(st.kana) + '</span><span>' + esc(st.ro) + '</span><button type="button" class="say-btn" data-act="speak" data-t="' + esc(st.kana) + '" aria-label="Nghe đọc">' + PS.icon('sound', 16) + '</button></div></div></div>' +
      '<div class="banner__bar"><i style="width:' + Math.round(nd / acts.length * 100) + '%"></i></div><div class="banner__meta"><span>' + nd + '/' + acts.length + ' chặng xong</span><span>' + stMins(st) + ' phút</span></div></section>';
    h += (first || V.showIntro) ? shinSays('hi', T(st.intro)) : '<button type="button" class="shinmini" data-act="showIntro">' + shinNow('hi', 34) + '<span><b>' + esc(SHIN_NAMES[shinStage()]) + '</b> · Xem lời Shin</span></button>';
    if (st.quote) h += '<figure class="quote"><p>' + esc(st.quote.t) + '</p><small>' + esc(st.quote.by) + '</small></figure>';
    if (st.warm) {
      var wd = !!S.done[st.warm];
      h += '<button type="button" class="warm' + (wd ? ' warm--done' : '') + '" data-act="open" data-id="' + st.warm + '"><span class="warm__ic">' + (wd ? PS.icon('check', 20, 3) : PS.icon('clock', 20)) + '</span><span><b>' + esc(TXT.warmT) + ' · ' + esc(ACTS[st.warm].t.replace('Khởi động · ', '')) + '</b><small>' + (wd ? 'Đã xong · +' + CD_XP_WARM + ' XP' : esc(TXT.warmSub)) + '</small></span></button>';
    }
    h += '<div class="acts">' + acts.map(function (id, i) {
      var a = ACTS[id], dn = !!S.done[id], op = actOpen(id), nx = op && !dn && nextAct() === id;
      if (!op && !dn) return '<div class="act act--lock"><span class="act__n">' + PS.icon('lock', 18) + '</span><span><b>Chặng ' + (i + 1) + ' · ???</b><small>Xong chặng trước để mở</small></span></div>';
      return '<button type="button" class="act' + (nx ? ' act--next' : '') + (dn ? ' act--done' : '') + '" data-act="open" data-id="' + id + '"><span class="act__n">' + (dn ? PS.icon('check', 20, 3) : (i + 1)) + '</span><span><b>' + (st === START ? '' : 'Chặng ' + (i + 1) + ' · ') + esc(a.t) + '</b><small>' + esc(a.d) + '</small>' +
        '<span class="act__meta">' + PS.icon('clock', 13) + a.mins + ' phút' + (nx ? '<span class="chip-go">Tiếp theo ' + PS.icon('next', 13, 2.6) + '</span>' : (dn ? '<span class="badge badge--ok">Xong · làm lại để ôn</span>' : '')) + '</span></span></button>';
    }).join('') + '</div>';
    var cn = st.card, cdn = stDone(st);
    h += '<button type="button" class="chest' + (cdn ? '' : ' chest--lock') + '"' + (cdn ? ' data-act="chest" data-st="' + st.id + '"' : ' disabled') + '><span class="chest__ic">' + (cdn ? cdIcon('ticket', 24) : PS.icon('lock', 22)) + '</span><span><b>Ô số ' + cn + ' · ' + esc(CARDS[cn - 1].t) + '</b><small>' + (cdn ? 'Đã điền · chạm để xem' : 'Xong ' + acts.length + ' chặng để điền ô này') + '</small></span></button>';
    return h;
  }

  /* =========================================================
     5. TRANG CHẶNG VÀ CÁC DẠNG BƯỚC
     ========================================================= */
  function viewAct() {
    var id = V.id, a = ACTS[id], steps = a.steps, i = V.step, s = steps[i], last = i === steps.length - 1;
    var miss = check(s);
    var h = '<button type="button" class="back" data-act="station" data-st="' + a.st + '">' + cdIcon('arrowL', 18, 2.4) + esc(stById(a.st).vn) + '</button>' +
      '<header class="ah"><div class="ah__lab">' + esc(actLabel(id)) + '</div><h1>' + esc(a.t) + '</h1><div class="stepbar" aria-label="Bước ' + (i + 1) + '/' + steps.length + '">' +
      steps.map(function (x, j) { return '<i class="' + (j < i ? 'on' : (j === i ? 'cur' : '')) + '"></i>'; }).join('') + '</div></header>';
    if (S.done[id] && i === 0) h += '<div class="redo">' + PS.icon('check', 18, 3) + esc(TXT.redo) + '</div>';
    h += '<div id="stepBody">' + (STEP[s.k] ? STEP[s.k](s, id) : '') + '</div>';
    h += '<div class="sbar"><button type="button" class="sbar__st' + (miss ? ' miss' : '') + '" id="sbarSt"' + (miss ? ' data-act="showMiss"' : '') + '>' + (miss ? esc(miss) : 'Sẵn sàng!') + '</button>' +
      '<button type="button" class="btn" id="sbarGo" data-act="' + (last ? 'finish' : 'next') + '"' + (miss ? ' disabled' : '') + '>' + (last ? esc(a.warm ? 'Xong' : TXT.stampBtn) : 'Tiếp tục') + '</button></div>';
    if (i > 0) h += '<p class="prevlink"><button type="button" class="link" data-act="prev">Xem lại bước trước</button></p>';
    return h;
  }
  function refreshBar() {
    var s = ACTS[V.id].steps[V.step], miss = check(s), st = D.getElementById('sbarSt'), gb = D.getElementById('sbarGo');
    if (!st || !gb) return;
    st.className = 'sbar__st' + (miss ? ' miss' : ''); st.textContent = miss || 'Sẵn sàng!';
    if (miss) st.setAttribute('data-act', 'showMiss'); else st.removeAttribute('data-act');
    gb.disabled = !!miss;
  }
  function check(s) { return CHECK[s.k] ? CHECK[s.k](s) : ''; }
  function redrawStep() { var b = D.getElementById('stepBody'); if (!b) return; var s = ACTS[V.id].steps[V.step]; b.innerHTML = STEP[s.k](s, V.id); refreshBar(); }

  /* ----- tiện ích viết ----- */
  var FIELD = {};
  for (var aid in ACTS) if (ACTS.hasOwnProperty(aid)) ACTS[aid].steps.forEach(function (st) { (st.fields || []).forEach(function (f) { FIELD[f.key] = f; }); });
  function words(t) { t = String(t || '').replace(/^\s+|\s+$/g, ''); return t ? t.split(/\s+/).length : 0; }
  function own(f, v) { v = String(v || ''); if (f.starter && v.indexOf(f.starter) === 0) v = v.slice(f.starter.length); return v.replace(/^\s+|\s+$/g, ''); }
  function fieldOK(f) { return own(f, g(f.key)).length >= (f.min || 1); }
  function insOf(f) { return !f.noIns && words(own(f, g(f.key))) >= CD_INS_WORDS ? CD_INS_FIELD : 0; }
  function insHTML(f) {
    f = FIELD[f.key] || f; if (f.noIns) return '';
    var w = words(own(f, g(f.key))), full = w >= CD_INS_WORDS;
    return '<span class="ins' + (full ? ' full' : '') + '" data-ins="' + esc(f.key) + '">' + PS.icon('bulb', 13) + (full ? '+' + CD_INS_FIELD + ' Insight' : w + '/' + CD_INS_WORDS + ' từ để +' + CD_INS_FIELD + ' Insight') + '</span>';
  }
  function fieldHTML(f, i) {
    var v = g(f.key); if (v == null || v === '') v = f.starter || '';
    return '<label class="field">' + (f.tag ? '<span class="field__tag t' + (i || 0) + '">' + esc(f.tag) + '</span>' : '') + '<span class="field__l">' + esc(f.l) + '</span>' +
      '<textarea class="ta" rows="' + (f.rows || 3) + '" data-k="' + esc(f.key) + '" placeholder="' + esc(f.ph || '') + '" maxlength="600">' + esc(v) + '</textarea>' + insHTML(f) + '</label>';
  }
  function tipsHTML(t) { return t && t.length ? '<details class="tips"><summary>' + PS.icon('bulb', 15) + 'Gợi ý nhỏ</summary><ul>' + t.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></details>' : ''; }
  function chipsHTML(s) {
    var sel = ga(s.key), max = s.max || 99, full = sel.length >= max;
    var all = s.opts.slice(); sel.forEach(function (x) { if (all.indexOf(x) < 0) all.push(x); });
    var h = '<div class="chips">' + all.map(function (o) {
      var on = sel.indexOf(o) >= 0;
      return '<button type="button" class="chip' + (on ? ' on' : '') + '" data-act="chip" data-k="' + esc(s.key) + '" data-v="' + esc(o) + '"' + (!on && full ? ' disabled' : '') + ' aria-pressed="' + on + '">' + esc(o) + '</button>';
    }).join('') + (s.own && !full ? '<button type="button" class="chip chip--own" data-act="ownOpen" data-k="' + esc(s.key) + '">+ ' + esc(s.own) + '</button>' : '') + '</div>';
    if (V.ownOpen === s.key) h += '<div class="ownrow"><input class="inp" id="ownIn" maxlength="60" placeholder="Viết ngắn gọn" data-ownk="' + esc(s.key) + '"><button type="button" class="btn btn--sm" data-act="ownAdd" data-k="' + esc(s.key) + '">Thêm</button></div>';
    h += '<p class="counter">Đã chọn ' + sel.length + (s.max ? '/' + s.max : '') + (s.min && sel.length < s.min ? ' · cần ít nhất ' + s.min : '') + '</p>';
    return h;
  }
  function optBtn(key, v, t, on, extra) { return '<button type="button" class="opt' + (on ? ' on' : '') + '" data-act="pick" data-k="' + esc(key) + '" data-v="' + esc(v) + '" aria-pressed="' + on + '">' + (extra || '<span class="dot">' + (on ? PS.icon('check', 13, 3.2) : '') + '</span>') + '<span>' + esc(t) + '</span></button>'; }

  var STEP = {
    say: function (s) {
      var h = shinSays(s.mood || 'hi', T(s.t));
      if (s.rules) h += '<div class="rules">' + s.rules.map(function (r) { return '<div class="rule"><span class="ri">' + PS.icon(r[0], 18) + '</span><span><b>' + esc(r[1]) + '</b><small>' + esc(r[2]) + '</small></span></div>'; }).join('') + '</div>';
      if (s.card) h += cdCardPreview(s.card);
      return h;
    },
    pick: function (s) {
      var v = g(s.key), rep = '';
      var h = '<div class="card"><p class="q">' + esc(s.q) + '</p>' + (s.sub ? '<p class="qsub">' + esc(s.sub) + '</p>' : '') + '<div class="opts' + (s.scale ? ' scale' : '') + '">' +
        s.opts.map(function (o, i) { if (v === o.v) rep = o.rep; return optBtn(s.key, o.v, o.t, v === o.v, s.scale ? '<span class="lv">' + (i + 1) + '</span>' : null); }).join('') + '</div></div>';
      if (rep) h += shinSays('encourage', esc(rep));
      return h;
    },
    multi: function (s) { return '<div class="card"><p class="q">' + esc(s.q) + '</p>' + (s.sub ? '<p class="qsub">' + esc(s.sub) + '</p>' : '') + chipsHTML(s) + '</div>'; },
    video: function (s, id) {
      var played = !!g(id + '.vid');
      var h = '<div class="card"><p class="q">' + esc(s.title) + '</p><p class="qsub">' + esc(s.hint) + '</p><div class="vid">' +
        (played ? '<iframe src="https://www.youtube-nocookie.com/embed/' + s.yt + '?start=' + (s.start || 0) + '&rel=0&playsinline=1' + (V.autoplay ? '&autoplay=1' : '') + '" title="' + esc(s.title) + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'
          : '<button type="button" class="vid__poster" data-act="vplay"><span><span class="vid__play">' + cdIcon('play', 28, 2.4) + '</span>Bấm để xem video</span></button>') +
        '</div><a class="vlink" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + cdIcon('ext', 15) + 'Không xem được? Mở trên YouTube</a></div>';
      h += '<div class="card"><p class="q">' + esc(s.q) + '</p>' + (s.sub ? '<p class="qsub">' + esc(s.sub) + '</p>' : '') + chipsHTML(s) + '</div>';
      return h;
    },
    write: function (s) {
      var sum = '';
      if (s.twin && s.from) {
        var tg = g(s.from) || {}, near = [], far = [];
        for (var it in tg) if (tg.hasOwnProperty(it)) { if (tg[it] === 'g') near.push(it); else if (tg[it] === 'x') far.push(it); }
        sum = '<div class="twinsum">' + (near.length ? '<p><b class="tg">Lại gần</b>' + esc(near.join(' · ')) + '</p>' : '') + (far.length ? '<p><b class="tx">Ra xa</b>' + esc(far.join(' · ')) + '</p>' : '') + '</div>';
        if (!near.length && !far.length) sum = '';
      }
      return '<div class="card"><p class="q">' + esc(s.q) + '</p>' + (s.sub ? '<p class="qsub">' + esc(s.sub) + '</p>' : '') + sum +
        '<div class="' + (s.twin ? 'twin' : '') + '">' + s.fields.map(function (f, i) { return fieldHTML(f, s.twin ? i : null); }).join('') + '</div>' + tipsHTML(s.tips) + '</div>';
    },
    dil: function (s) {
      var v = g(s.key);
      function side(k) { var o = s[k], on = v === k; return '<button type="button" class="side' + (on ? ' on' : '') + '" data-act="pick" data-k="' + esc(s.key) + '" data-v="' + k + '" aria-pressed="' + on + '"><span class="tick">' + (on ? PS.icon('check', 13, 3.2) : '') + '</span><b>' + esc(o.t) + '</b><span class="gl"><span class="g"><em>Được</em>' + esc(o.get) + '</span><span class="l"><em>Mất</em>' + esc(o.lose) + '</span></span></button>'; }
      var h = '<div class="card"><span class="noscore">' + PS.icon('info', 14) + esc(TXT.noScore) + '</span><p class="q">' + esc(s.q) + '</p><div class="dil">' + side('a') + side('b') +
        '<div class="dil__more">' + optBtn(s.key, 'm', 'Tùy hôm', v === 'm') + optBtn(s.key, 'o', 'Mình làm khác', v === 'o') + '</div></div>';
      if (v === 'o') h += '<label class="field"><span class="field__l">Bạn thường làm gì?</span><input class="inp" data-k="' + esc(s.key) + 'o" maxlength="120" placeholder="Viết ngắn gọn" value="' + esc(g(s.key + 'o') || '') + '"></label>';
      h += '</div>';
      if (v) {
        var sp = s.senpai;
        h += '<div class="senpai"><div class="senpai__h"><span class="senpai__av">' + PS.icon('people', 15) + '</span><span><b>Senpai kể</b><small>' + esc(sp.who) + '</small></span>' + (sp.draft ? '<span class="draft">' + esc(TXT.senpaiDraft) + '</span>' : '') + '</div><p>' + esc(sp.t) + '</p></div>';
        if (s.calc) {
          var m = +g('a11.mins') || 15;
          h += '<div class="calc"><label for="calcR">Thử tính: mỗi ngày dành <b id="calcM">' + m + '</b> phút cho một việc bạn muốn giỏi lên</label><input id="calcR" type="range" min="5" max="60" step="5" value="' + m + '" data-calc="a11.mins"><div class="calc__out">1 năm ≈ <b id="calcH">' + Math.round(m * 365 / 60) + '</b> giờ</div></div>';
        }
      }
      return h;
    },
    recap: function (s) {
      var dil = ACTS.a11.steps.filter(function (x) { return x.k === 'dil'; });
      function chosen(k) { var d = null; dil.forEach(function (x) { if (x.key === k) d = x; }); var v = g(k); if (!d || !v) return '—'; if (v === 'm') return 'Tùy hôm'; if (v === 'o') return g(k + 'o') || 'Làm khác'; return d[v].t; }
      var cur = g(s.key);
      function row(k, lab, txt) { var on = cur === k; return '<button type="button" class="opt opt--rc' + (on ? ' on' : '') + '" data-act="pick" data-k="' + esc(s.key) + '" data-v="' + esc(k) + '" aria-pressed="' + on + '"><span class="dot">' + (on ? PS.icon('check', 13, 3.2) : '') + '</span><span><small>' + esc(lab) + '</small>' + esc(txt) + '</span></button>'; }
      return '<div class="card"><p class="q">' + esc(s.q) + '</p><p class="qsub">Dưới đây là 5 điều bạn vừa chọn. Chạm vào tình huống bạn muốn thử khác đi. Giữ như hiện tại cũng là một lựa chọn.</p><div class="opts">' +
        s.from.map(function (k, i) { return row(k, s.labels[i], chosen(k)); }).join('') + row('keep', 'Hoặc', s.keepT) + '</div>' +
        s.fields.map(function (f) { return fieldHTML(f); }).join('') + tipsHTML(s.tips) + '</div>';
    },
    age: function (s) {
      var by = parseInt(prof().by, 10), y = new Date().getFullYear(), y5 = y + 5, age5 = by > 1900 ? y5 - by : 0, v = g(s.key);
      var h = '<div class="age"><span class="age__n">' + (age5 || '?') + '</span><p>' + (age5 ? 'Bạn sinh năm ' + by + '. 5 năm nữa, năm <b>' + y5 + '</b>, bạn khoảng <b>' + age5 + ' tuổi</b>.' : '5 năm nữa là năm <b>' + y5 + '</b>.') + '</p></div>' +
        '<div class="card"><p class="q">' + esc(s.q) + '</p><div class="opts">' + s.opts.map(function (o) { return optBtn(s.key, o.v, o.t, v === o.v); }).join('') + '</div></div>';
      if (v) h += shinSays('think', esc(s.rep));
      return h;
    },
    tag: function (s) {
      var items = ga(s.from), tg = g(s.key) || {};
      var h = '<div class="card"><p class="q">' + esc(s.q) + '</p><p class="qsub">' + esc(s.sub) + '</p>' +
        (ga(s.hope).length ? '<div class="hopes">' + ga(s.hope).map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' : '') +
        items.map(function (it, i) {
          return '<div class="tagrow" data-row="' + i + '"><b>' + esc(it) + '</b><div class="seg">' + s.opts.map(function (o) {
            var on = tg[it] === o[0];
            return '<button type="button" class="' + o[0] + (on ? ' on' : '') + '" data-act="tag" data-k="' + esc(s.key) + '" data-i="' + i + '" data-v="' + o[0] + '" aria-pressed="' + on + '">' + esc(o[1]) + '</button>';
          }).join('') + '</div></div>';
        }).join('') + '</div>';
      return h;
    }
  };
  function cdCardPreview(n) { return '<div style="margin-top:12px">' + cdCardForce(n) + '</div>'; }
  function cdCardForce(n) { /* xem trước ô trước khi đóng dấu */
    var c = CARDS[n - 1];
    return '<div class="cdcard cdcard--new"><span class="cdcard__n">' + n + '</span><h4>' + esc(c.t) + '</h4>' + cardBody(n) + '</div>';
  }
  var CHECK = {
    say: function () { return ''; },
    pick: function (s) { return g(s.key) ? '' : 'Chọn một mức gần với bạn'; },
    age: function (s) { return g(s.key) ? '' : 'Chọn một ý'; },
    multi: function (s) { var n = ga(s.key).length; return n >= (s.min || 1) ? '' : (s.min > 1 ? 'Chọn thêm ' + (s.min - n) + ' ý' : 'Chọn ít nhất 1 ý'); },
    video: function (s) { return ga(s.key).length >= (s.min || 1) ? '' : 'Chọn điều bạn để ý'; },
    write: function (s) { var n = 0; s.fields.forEach(function (f) { if (!fieldOK(f)) n++; }); return n ? 'Còn ' + n + ' ô cần viết' : ''; },
    dil: function (s) { var v = g(s.key); if (!v) return 'Chọn điều bạn hay làm'; if (v === 'o' && String(g(s.key + 'o') || '').replace(/\s/g, '').length < 4) return 'Viết điều bạn hay làm'; return ''; },
    recap: function (s) { if (!g(s.key)) return 'Chọn một tình huống hoặc giữ như hiện tại'; var n = 0; s.fields.forEach(function (f) { if (!fieldOK(f)) n++; }); return n ? 'Viết vì sao bạn chọn' : ''; },
    tag: function (s) { var items = ga(s.from), tg = g(s.key) || {}, n = 0; items.forEach(function (it) { if (!tg[it]) n++; }); return n ? 'Còn ' + n + ' việc chưa xếp' : ''; }
  };
  function showMiss() {
    var body = D.getElementById('stepBody'); if (!body) return;
    var el = null, s = ACTS[V.id].steps[V.step];
    if (s.k === 'write' || s.k === 'recap') { (s.fields || []).forEach(function (f) { if (!el && !fieldOK(f)) el = body.querySelector('[data-k="' + f.key + '"]'); }); if (s.k === 'recap' && !g(s.key)) el = body.querySelector('.opts'); }
    else if (s.k === 'tag') { var tg = g(s.key) || {}; ga(s.from).forEach(function (it, i) { if (!el && !tg[it]) el = body.querySelector('[data-row="' + i + '"]'); }); }
    else if (s.k === 'dil' && g(s.key) === 'o') el = body.querySelector('[data-k="' + s.key + 'o"]');
    if (!el) el = body.querySelector('.card') || body;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('need', 'pulse'); setTimeout(function () { el.classList.remove('pulse'); }, 2600);
    if (el.focus && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT')) el.focus();
  }

  /* =========================================================
     6. HOÀN THÀNH CHẶNG · ĐÓNG DẤU · Ô BẢN CAREER DESIGN
     ========================================================= */
  function insForAct(id) { var t = 0; ACTS[id].steps.forEach(function (s) { (s.fields || []).forEach(function (f) { t += insOf(f); }); }); return t; }
  function finish() {
    var id = V.id, a = ACTS[id], st = stById(a.st), first = !S.done[id], stageBefore = shinStage();
    var xp = 0, insOld = S.ins[id] || 0, insNew = insForAct(id);
    if (first) { S.done[id] = Date.now(); xp = a.warm ? CD_XP_WARM : CD_XP_ACT; S.xp[id] = xp; }
    S.ins[id] = Math.max(insOld, insNew);
    var gainIns = S.ins[id] - insOld;
    S.d[id + '.st'] = 0; markDay(); save(true);
    var stNowDone = stDone(st), newChest = stNowDone && !S.chest[st.id];
    sound(first ? 'stamp' : 'tap');
    var kan = st === START ? '出発' : st.k;
    ov('<div class="stamp jp">' + esc(kan) + '</div><h2>' + (first ? 'Đã đóng dấu!' : 'Đã lưu lại') + '</h2><p>' + esc(a.t) + '</p>' +
      ((xp || gainIns) ? '<div class="gain">' + (xp ? '<span class="gx">' + PS.icon('star', 15) + '+' + xp + ' XP</span>' : '') + (gainIns ? '<span class="gi">' + PS.icon('bulb', 15) + '+' + gainIns + ' Insight</span>' : '') + '</div>' : '<p class="ps-small">Bài làm lại không cộng thêm XP.</p>') +
      '<button type="button" class="btn btn--w" data-act="ovNext">Tiếp tục</button>', function () {
        if (newChest) { S.chest[st.id] = Date.now(); save(true); chestOv(st, stageBefore); }
        else go({ v: 'st', st: st.id });
      });
  }
  function chestOv(st, stageBefore, again) {
    var stg = shinStage(), grew = !again && stg > stageBefore;
    var h = '<h2>' + (st === START ? 'Vé đã in!' : 'Hoàn thành ' + esc(st.vn) + '!') + '</h2>' +
      (grew ? '<div class="evolve">' + shin('cheer', 64, stageBefore) + '<span class="arrow">' + PS.icon('next', 20) + '</span>' + shin('party', 86, stg, 'hop') + '</div><p><b>' + (stageBefore === 0 ? 'Shin đã nở rồi!' : 'Shin đã lớn thêm!') + '</b></p>' : '') +
      (st.done ? '<p>' + esc(st.done) + '</p>' : '') + cdCard(st.card, true) +
      (st.word ? '<div class="word"><span class="jp">' + esc(st.word.k) + '</span><span><small>' + esc(st.word.kana) + ' · ' + esc(st.word.ro) + '</small><b>' + esc(st.word.vn) + '</b></span><button type="button" class="say-btn" data-act="speak" data-t="' + esc(st.word.kana) + '" aria-label="Nghe đọc">' + PS.icon('sound', 16) + '</button></div>' : '') +
      '<button type="button" class="btn btn--go btn--w" data-act="ovNext">' + (again ? 'Đóng' : 'Về sơ đồ tuyến') + '</button>';
    if (!again) sound('badge');
    ov(h, function () { if (!again) go({ v: 'home' }); });
  }
  var OVCB = null;
  function ov(html, cb) {
    closeOv(); OVCB = cb || null;
    var el = D.createElement('div'); el.className = 'ov'; el.id = 'cdov'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    el.innerHTML = '<div class="ov__box">' + html + '</div>'; D.body.appendChild(el); D.body.classList.add('ps-lock');
    var b = el.querySelector('.btn'); if (b) setTimeout(function () { try { b.focus(); } catch (e) {} }, 60);
  }
  function closeOv(run) { var el = D.getElementById('cdov'); if (el) el.parentNode.removeChild(el); if (!nbOpen) D.body.classList.remove('ps-lock'); var cb = OVCB; OVCB = null; if (run && cb) cb(); }

  /* âm thanh nhẹ (Web Audio), theo công tắc chung */
  var AC = null;
  function sound(k) {
    if (!PS.soundOn() || S.demo) return;
    try {
      AC = AC || new (W.AudioContext || W.webkitAudioContext)();
      var seq = { stamp: [220, 330, 523], badge: [392, 523, 659, 784], tap: [520] }[k] || [440], t0 = AC.currentTime;
      seq.forEach(function (f, i) {
        var o = AC.createOscillator(), gn = AC.createGain(); o.type = 'sine'; o.frequency.value = f;
        gn.gain.setValueAtTime(0.0001, t0 + i * 0.09); gn.gain.exponentialRampToValueAtTime(0.16, t0 + i * 0.09 + 0.02); gn.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.09 + 0.28);
        o.connect(gn); gn.connect(AC.destination); o.start(t0 + i * 0.09); o.stop(t0 + i * 0.09 + 0.3);
      });
    } catch (e) {}
  }
  function speak(t) {
    try { if (!W.speechSynthesis) { PS.toast('Máy chưa hỗ trợ đọc tiếng Nhật'); return; } var u = new W.SpeechSynthesisUtterance(t); u.lang = 'ja-JP'; u.rate = 0.85; W.speechSynthesis.cancel(); W.speechSynthesis.speak(u); } catch (e) {}
  }

  /* =========================================================
     7. SỔ TAY: Tổng quan | Bản Career Design | Cài đặt
     ========================================================= */
  function nbOverview() {
    var mins = 0; for (var k in S.days) if (S.days.hasOwnProperty(k)) mins += S.days[k];
    return '<div class="tiles"><div class="tl">' + cdIcon('ticket', 18) + '<b>' + stampCount() + '/8</b><small>Con dấu</small></div><div class="tl x">' + PS.icon('star', 18) + '<b>' + xpTotal() + '</b><small>XP khóa này</small></div>' +
      '<div class="tl i">' + PS.icon('bulb', 18) + '<b>' + insTotal() + '</b><small>Insight</small></div><div class="tl f">' + PS.icon('flame', 18) + '<b>' + (S.demo ? 5 : PS.streak()) + '</b><small>Chuỗi ngày (chung)</small></div></div>' +
      '<div class="goalbox"><small>MỤC TIÊU CỦA BẠN</small><p>' + esc(g('x1.goal') || 'Bạn sẽ viết mục tiêu ở Sân ga Xuất phát.') + '</p></div>' +
      '<p class="ps-small">Đã học khoảng <b>' + Math.round(mins) + ' phút</b> · ' + doneMain() + '/' + CD_TOTAL + ' chặng.' + (S.demo ? '' : ' Tổng XP mọi khóa: <b>' + PS.totals().xp + '</b> (xem ở trang chính).') + '</p>';
  }
  function nbCD() {
    return '<p class="ps-small">Mỗi ga điền thêm một ô. Đến <b>Ga Ước Mơ</b>, bạn nhận bản 1 trang để lưu ảnh và gửi thầy cô.</p>' + CARDS.map(function (c) { return cdCard(c.n); }).join('');
  }
  function nbSettings() {
    if (S.demo) return '<p class="ps-small">Đang mở bản demo giáo viên. Thông tin và bài làm ở đây là của học viên giả định.</p><button type="button" class="btn btn--soft btn--w" data-act="demoExit">Thoát demo</button>';
    return PS.settingsHTML({ ctx: 'module', mod: ID, ver: CD_VER,
      pace: { status: '1 ga mỗi ngày', body: '<p class="ps-small">Mỗi ga khoảng 10–15 phút. Đi đều mỗi ngày một ga là vừa đẹp. Bài làm tự lưu, bạn có thể dừng giữa chừng.</p>' } });
  }
  function drawNb() {
    var el = D.getElementById('nb'); if (!el) return;
    el.innerHTML = '<div class="nb__in"><div class="nb__top"><h2>Sổ tay</h2><button type="button" class="nb__x" data-act="nbClose" aria-label="Đóng sổ tay">' + PS.icon('close', 20) + '</button></div>' +
      '<div class="tabs" role="tablist">' + [['tq', 'Tổng quan'], ['cd', 'Bản Career Design'], ['set', 'Cài đặt']].map(function (t) { return '<button type="button" role="tab" aria-selected="' + (NBTAB === t[0]) + '" class="' + (NBTAB === t[0] ? 'on' : '') + '" data-act="tab" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<div id="nbBody">' + (NBTAB === 'tq' ? nbOverview() : (NBTAB === 'cd' ? nbCD() : nbSettings())) + '</div></div>';
    if (NBTAB === 'set' && !S.demo) PS.wireSettings(D.getElementById('nbBody'), { ctx: 'module', mod: ID, onChange: function () { } });
  }
  function openNb(tab) { NBTAB = tab || NBTAB; if (!nbOpen) { nbOpen = true; var el = D.createElement('div'); el.id = 'nb'; el.className = 'nb'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Sổ tay'); D.body.appendChild(el); D.body.classList.add('ps-lock'); } drawNb(); }
  function closeNb() { var el = D.getElementById('nb'); if (el) el.parentNode.removeChild(el); nbOpen = false; D.body.classList.remove('ps-lock'); render(false); }

  /* =========================================================
     8. DEMO GIÁO VIÊN
     ========================================================= */
  function enterDemo() {
    var s = JSON.parse(JSON.stringify(DEMO_DATA)); s = normalize(s);
    s.demo = 1; s.created = Date.now() - 3 * 864e5;
    S = s;
    for (var id in S.done) if (S.done.hasOwnProperty(id) && ACTS[id]) { S.xp[id] = ACTS[id].warm ? CD_XP_WARM : CD_XP_ACT; S.ins[id] = insForAct(id); }
    ALLST.forEach(function (st) { if (stDone(st)) { S.chest[st.id] = 1; S.seen[st.id] = 1; } });
    NOSAVE = 0; save(true); V = { v: 'home' }; render(true);
    PS.toast('<b>Bản demo giáo viên</b> · học viên giả định đã xong Sân ga và Ga Nhìn Xa');
  }
  function exitDemo() { NOSAVE = 1; clearTimeout(saveT); try { PS.set(DEMO_KEY, null); } catch (e) {} W.location.replace(W.location.pathname); }

  /* =========================================================
     9. SỰ KIỆN
     ========================================================= */
  function openAct(id) {
    if (!actOpen(id) && !S.done[id]) return;
    var st = S.d[id + '.st'];
    go({ v: 'act', id: id, step: (!S.done[id] && typeof st === 'number' && st < ACTS[id].steps.length) ? st : 0 });
  }
  function toggleArr(k, v, max) {
    var a = ga(k).slice(), i = a.indexOf(v);
    if (i >= 0) a.splice(i, 1); else { if (max && a.length >= max) return; a.push(v); }
    S.d[k] = a;
  }
  D.addEventListener('click', function (e) {
    var b = PS.closest(e.target, '[data-act]'); if (!b || b.disabled) return;
    var a = b.getAttribute('data-act'), k = b.getAttribute('data-k'), v = b.getAttribute('data-v');
    if (a === 'psHome') { save(true); PS.home(); }
    else if (a === 'home') { closeOv(); if (nbOpen) closeNb(); go({ v: 'home' }); }
    else if (a === 'station') { var stx = stById(b.getAttribute('data-st')); if (stx && (stOpen(stx) || stDone(stx))) go({ v: 'st', st: stx.id }); }
    else if (a === 'showIntro') { V.showIntro = 1; render(false); }
    else if (a === 'open') openAct(b.getAttribute('data-id'));
    else if (a === 'introGo') { S.intro = 1; save(true); go({ v: 'home' }); }
    else if (a === 'next') { V.step++; S.d[V.id + '.st'] = V.step; V.ownOpen = null; save(); render(true); }
    else if (a === 'prev') { if (V.step > 0) { V.step--; V.ownOpen = null; render(true); } }
    else if (a === 'finish') finish();
    else if (a === 'showMiss') showMiss();
    else if (a === 'pick') {
      S.d[k] = v; save(); sound('tap');
      var y = W.pageYOffset; redrawStep(); W.scrollTo(0, y);
      var rep = D.querySelector('#stepBody .senpai, #stepBody .shinbox'); if (rep && rep.getBoundingClientRect().bottom > W.innerHeight) rep.scrollIntoView({ behavior: 'smooth', block: 'end' });
      if (v === 'o') { var oi = D.querySelector('[data-k="' + k + 'o"]'); if (oi) oi.focus(); }
    }
    else if (a === 'chip') {
      var stp = ACTS[V.id].steps[V.step]; toggleArr(k, v, stp.max); save();
      var y2 = W.pageYOffset; redrawStep(); W.scrollTo(0, y2);
    }
    else if (a === 'ownOpen') { V.ownOpen = k; var y3 = W.pageYOffset; redrawStep(); W.scrollTo(0, y3); var oi2 = D.getElementById('ownIn'); if (oi2) oi2.focus(); }
    else if (a === 'ownAdd') addOwn(k);
    else if (a === 'tag') {
      var stp2 = ACTS[V.id].steps[V.step], it = ga(stp2.from)[+b.getAttribute('data-i')], tg = g(k) || {};
      tg[it] = v; S.d[k] = tg; save(); var y4 = W.pageYOffset; redrawStep(); W.scrollTo(0, y4);
    }
    else if (a === 'vplay') { S.d[V.id + '.vid'] = 1; V.autoplay = 1; save(); var y5 = W.pageYOffset; redrawStep(); W.scrollTo(0, y5); V.autoplay = 0; }
    else if (a === 'speak') speak(b.getAttribute('data-t'));
    else if (a === 'ovNext') closeOv(true);
    else if (a === 'chest') { var sc = stById(b.getAttribute('data-st')); chestOv(sc, shinStage(), true); }
    else if (a === 'nb') openNb();
    else if (a === 'nbcd') openNb('cd');
    else if (a === 'nbClose') closeNb();
    else if (a === 'tab') { NBTAB = b.getAttribute('data-t'); drawNb(); }
    else if (a === 'demoExit') exitDemo();
  });
  function addOwn(k) {
    var inp = D.getElementById('ownIn'); if (!inp) return;
    var t = String(inp.value || '').replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
    if (t.length < 2) { inp.classList.add('need'); inp.focus(); return; }
    var stp = ACTS[V.id].steps[V.step], arr = ga(k).slice();
    if (arr.indexOf(t) < 0) { if (stp.max && arr.length >= stp.max) { PS.toast('Bạn đã chọn đủ ' + stp.max + ' điều. Bỏ bớt một điều để thêm.'); return; } arr.push(t); }
    S.d[k] = arr; V.ownOpen = null; save(); var y = W.pageYOffset; redrawStep(); W.scrollTo(0, y);
  }
  D.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.keyCode === 13) && e.target && e.target.id === 'ownIn') { e.preventDefault(); addOwn(e.target.getAttribute('data-ownk')); }
    if ((e.key === 'Escape' || e.keyCode === 27) && D.getElementById('cdov')) closeOv(true);
  });
  D.addEventListener('input', function (e) {
    var t = e.target; if (!t || !t.getAttribute) return;
    var k = t.getAttribute('data-k'), c = t.getAttribute('data-calc');
    if (c) { var m = +t.value; S.d[c] = m; var cm = D.getElementById('calcM'), ch = D.getElementById('calcH'); if (cm) cm.textContent = m; if (ch) ch.textContent = Math.round(m * 365 / 60); save(); return; }
    if (!k || V.v !== 'act') return;
    S.d[k] = t.value; t.classList.remove('need'); save();
    var ins = D.querySelector('[data-ins="' + k + '"]');
    if (ins) { var tmp = D.createElement('div'); tmp.innerHTML = insHTML({ key: k }); ins.parentNode.replaceChild(tmp.firstChild, ins); }
    refreshBar();
  });
  D.addEventListener('focusin', function (e) {
    var t = e.target; if (!t || t.tagName !== 'TEXTAREA') return;
    setTimeout(function () { try { var n = t.value.length; t.setSelectionRange(n, n); } catch (er) {} }, 0);
  });

  /* thanh trên tự ẩn khi cuộn xuống, hiện lại khi cuộn lên (như CD49) */
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
     10. KHỞI ĐỘNG
     ========================================================= */
  try { if (DQ.on) history.replaceState(null, '', W.location.pathname); } catch (e) {}
  if (ASK_DEMO) PS.demoAsk(function (ok) { if (ok) { NOSAVE = 0; enterDemo(); } else W.location.replace(W.location.pathname); });
  else if (WANT_DEMO) enterDemo();
  else {
    markDay();
    if (!S.intro && !S.demo) { V = { v: 'intro' }; render(true); PS.toast(TXT.gateToast); }
    else render(true);
    save(true);
  }
})(window, document);
