/* =========================================================
   TC01 · Huấn luyện thể chất · tc01/engine.js
   Trạng thái, gắn lõi Proskills, điều hướng, các dạng hoạt động, Sổ tay, demo.
   Chữ nằm ở content.js, hình ở art.js. ES5: var, function, nối chuỗi.
   Màn hình: join (làm thẻ hội viên) · home (phòng tập) · khu · bai · act.
   Khu đang mở: Sàn tập (BAI) và Bếp dinh dưỡng (BAI_BEP). Dữ liệu Bếp của học viên ở S.food (meal, calc, commit).
   ========================================================= */
(function (W, D) {
  'use strict';
  var PS = W.PS, ID = 'tc01', MOD = PS.mod(ID) || { code: 'TC01', title: 'Huấn luyện thể chất', ver: TC_VER }, esc = PS.esc;
  var DQ = PS.demoParam(), DEMO_KEY = 'ps.demo.' + ID, IS_DEMO = false;
  if (!DQ.on && !PS.guard(ID)) return;
  var RM = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var APP = D.getElementById('app');

  /* ---------- tiện ích ---------- */
  function $(s, r) { return (r || D).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); }
  function ic(k, sz, sw) { return TC_ICONS[k] ? tcIcon(k, sz, sw) : PS.icon(k, sz, sw); }
  function today() { return PS.today ? PS.today() : new Date().toISOString().slice(0, 10); }
  function dmy(t) { var d = new Date(t || Date.now()); return (d.getDate() < 10 ? '0' : '') + d.getDate() + '/' + (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1) + '/' + d.getFullYear(); }
  function words(s) { s = String(s || '').replace(/^\s+|\s+$/g, ''); return s ? s.split(/\s+/).length : 0; }
  function given() { return PS.given(); }
  function fill(s) { return String(s).replace(/\[Tên\]/g, esc(given())); }
  function seedShuffle(arr, seed) { var a = arr.slice(), x = 0, i; for (i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) % 9973; for (i = a.length - 1; i > 0; i--) { x = (x * 7 + 13) % 9973; var j = x % (i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function fmtT(s) { s = Math.max(0, Math.round(s)); var m = Math.floor(s / 60), r = s % 60; return m ? m + ' phút ' + (r ? r + ' giây' : '') : r + ' giây'; }
  function fmtClock(ms) { var s = Math.floor(ms / 1000), m = Math.floor(s / 60); s = s % 60; return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s; }

  /* ---------- trạng thái ---------- */
  function blank() { return { v: 1, created: Date.now(), done: {}, xp: {}, ins: {}, days: {}, mem: null, log: {}, refl: {}, plan: null, d: {}, food: {} }; }
  function demoState() {
    var s = blank(), m = DEMO.mem; s.demo = 1; s.mem = { job: m.job, g: m.g, sex: m.sex, inj: m.inj, goal: m.goal, h: m.h, w: m.w, at: Date.now() - 20 * 864e5 };
    DEMO.done.concat(DEMO.bepDone || []).forEach(function (id, i) { var a = actById(id); s.done[id] = Date.now() - (12 - i) * 864e5; s.xp[id] = a ? a.xp : 10; });
    var F = DEMO.food || {}, cs = F.calc, cm = F.commit;
    if (F.meal) s.food.meal = { sang: F.meal.sang.slice(), trua: F.meal.trua.slice(), toi: F.meal.toi.slice(), skip: {}, d: today() };
    if (cs) { var cr = calcRes(cs); s.food.calc = { h: cs.h, w: cs.w, age: cs.age, sex: cs.sex, lv: cs.lv, bmi: cr.bmi, bmr: cr.bmr, tdee: cr.tdee, water: cr.water, at: Date.now() - 3 * 864e5 }; }
    if (F.shift) s.food.shift = { s: F.shift.s, l: F.shift.l, pre: F.shift.pre, at: Date.now() - 864e5 };
    if (cm) { var st = new Date(); st.setHours(8, 0, 0, 0); st = new Date(st.getTime() - cm.ago * 864e5); s.food.commit = { h: cm.h, txt: cm.txt, at: st.getTime(), days: {} }; cm.done.forEach(function (d) { s.food.commit.days[dayKeyFrom(st, d)] = 1; }); }
    for (var k in DEMO.log) if (DEMO.log.hasOwnProperty(k)) s.log[k] = DEMO.log[k].map(function (e, i) { return { d: Date.now() - (5 - i) * 864e5, n: e.n, f: e.f }; });
    for (var r in DEMO.refl) if (DEMO.refl.hasOwnProperty(r)) { s.refl[r] = DEMO.refl[r]; s.ins[r] = 1; }
    return s;
  }
  var S;
  function rawGet(k) { try { return JSON.parse(W.localStorage.getItem(k)); } catch (e) { return null; } }
  function rawSet(k, v) { try { W.localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function loadState() {
    if (IS_DEMO) { S = rawGet(DEMO_KEY) || demoState(); S.demo = 1; return; }
    S = PS.load(ID) || blank();
    if (!S.done) S = blank();
    if (!S.food) S.food = {};
  }
  function xpTotal() { var t = 0; for (var k in S.xp) if (S.xp.hasOwnProperty(k)) t += S.xp[k]; return t; }
  function insTotal() { var t = 0; for (var k in S.ins) if (S.ins.hasOwnProperty(k)) t += S.ins[k]; return t; }
  function doneCount() { var n = 0; ALLACTS.forEach(function (a) { if (S.done[a.id]) n++; }); return n; }
  function tryCount() { var n = 0; for (var k in S.log) if (S.log.hasOwnProperty(k)) n += S.log[k].length; return n; }
  var saveT = null;
  function save(now) {
    clearTimeout(saveT);
    var w = function () {
      if (W.PS_NOSAVE) return;
      if (IS_DEMO) { rawSet(DEMO_KEY, S); return; }
      PS.save(ID, S);
      PS.report(ID, { xp: xpTotal(), ins: insTotal(), done: doneCount(), total: ALLACTS.length, days: S.days, ver: TC_VER,
        extra: { job: S.mem ? S.mem.job : '', group: S.mem ? S.mem.g : '', goal: S.mem ? S.mem.goal : '', tries: tryCount(), plan: S.plan || null, food: foodSum() } });
    };
    if (now) w(); else saveT = setTimeout(w, 250);
  }
  W.addEventListener('ps:change', function (e) { var f = e.detail && e.detail.field; if (f === 'beforeBackup' || f === 'beforeRestore') save(true); if (f === 'profile' || f === 'teacher') render(); });
  W.addEventListener('pagehide', function () { save(true); });
  D.addEventListener('visibilitychange', function () { if (D.visibilityState === 'hidden') save(true); });
  var lastAct = Date.now();
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (ev) { W.addEventListener(ev, function () { lastAct = Date.now(); }, { passive: true }); });
  setInterval(function () {
    if (!S || IS_DEMO || D.visibilityState !== 'visible' || Date.now() - lastAct > 60000) return;
    var k = today(); S.days[k] = Math.round(((S.days[k] || 0) + 0.25) * 100) / 100; save();
  }, 15000);
  function markDay() { if (IS_DEMO) return; var k = today(); if (!S.days[k]) { S.days[k] = 0.25; save(); } }

  /* ---------- dữ liệu ---------- */
  BAI.forEach(function (b) { b.khu = 'san'; });
  BAI_BEP.forEach(function (b) { b.khu = 'bep'; });
  var ALLBAI = BAI.concat(BAI_BEP), ALLACTS = [], ACT = {}, BAI_BY = {};
  ALLBAI.forEach(function (b) { BAI_BY[b.id] = b; b.acts.forEach(function (a) { a.bai = b.id; ALLACTS.push(a); ACT[a.id] = a; }); });
  function actById(id) { return ACT[id]; }
  function baisOf(k) { return k === 'bep' ? BAI_BEP : BAI; }
  function baiDone(b) { if (b.soon || !b.acts.length) return false; for (var i = 0; i < b.acts.length; i++) if (!S.done[b.acts[i].id]) return false; return true; }
  function baiN(b) { var n = 0; b.acts.forEach(function (a) { if (S.done[a.id]) n++; }); return n; }
  function baiCount(k) { var n = 0; baisOf(k || 'san').forEach(function (b) { if (baiDone(b)) n++; }); return n; }
  function curKhu() {
    if (V.v === 'khu') return V.id;
    if (V.v === 'bai') return BAI_BY[V.id] ? BAI_BY[V.id].khu : '';
    if (V.v === 'act') { var a = actById(V.a); return a ? BAI_BY[a.bai].khu : ''; }
    return '';
  }
  function jobOf(s) { for (var i = 0; i < JOBS.length; i++) if (JOBS[i].s === s) return JOBS[i]; return null; }
  function grp() { return S.mem && GROUPS[S.mem.g] ? S.mem.g : ''; }
  function grpName(g) { return GROUPS[g] ? GROUPS[g].n : 'Chưa chọn'; }
  function jobName() { if (!S.mem) return ''; var j = jobOf(S.mem.job); return j ? (j.s === 'khac' ? 'Nghề khác' : j.n) : ''; }
  function cdJob() {
    var sm = PS.summary('cd01'), k = sm && sm.extra ? (sm.extra.jobKey || sm.extra.main || '') : '';
    return jobOf(k) && k !== 'khac' ? k : '';
  }
  function sexKey() { return S.mem && S.mem.sex === 'nu' ? 'nu' : 'nam'; }
  function best(ex) { var l = S.log[ex] || [], b = 0; l.forEach(function (e) { if (e.n > b) b = e.n; }); return b; }
  function nextBai(k) { var L = baisOf(k || 'san'); for (var i = 0; i < L.length; i++) if (!L[i].soon && !baiDone(L[i])) return L[i]; return null; }

  /* ---------- điều hướng ---------- */
  var V = { v: 'home' }, J = null;
  function go(v, replace) {
    stopTimer(); V = v;
    try { if (replace) history.replaceState({ tc: 1, v: v }, ''); else history.pushState({ tc: 1, v: v }, ''); } catch (e) {}
    render(true);
  }
  W.addEventListener('popstate', function (e) { var st = e.state; stopTimer(); if (st && st.tc) { V = st.v; render(true); } else { V = { v: 'home' }; render(true); } });

  /* ---------- khung chung ---------- */
  function topnav() {
    return '<nav class="topnav" aria-label="Điều hướng"><div class="topnav__in"><span class="tn-sp"></span><div class="tn-pill">' +
      '<button type="button" class="tn-btn' + (V.v === 'home' ? ' on' : '') + '" data-act="home" aria-label="Sơ đồ phòng tập" title="Sơ đồ phòng tập">' + ic('map', 20) + '</button>' +
      '<button type="button" class="tn-btn" data-act="nb" aria-label="Sổ tay" title="Sổ tay">' + PS.icon('book', 20) + '</button></div></div></nav>';
  }
  function demoStrip() { return IS_DEMO ? '<div class="demo-strip"><span>Bản demo giáo viên · học viên giả định</span><button type="button" data-act="demoExit">Thoát demo</button></div>' : ''; }
  function shinSays(mood, html, sz, cls) { return '<div class="shinbox' + (cls ? ' ' + cls : '') + '">' + shin(mood, sz || 58, 'bob') + '<div class="shinbox__b"><b>HLV Shin</b>' + html + '</div></div>'; }
  function back(label, act, extra) { return '<button type="button" class="backl" data-act="' + act + '"' + (extra || '') + '>' + ic('arrowL', 15, 2.4) + esc(label) + '</button>'; }
  function render(top) {
    if (!S.mem && V.v !== 'join') { V = { v: 'join', step: 0 }; J = J || {}; }
    var h = '';
    SHIN_OUTFIT = curKhu() === 'bep' ? 'apron' : '';
    if (V.v === 'join') h = viewJoin();
    else if (V.v === 'khu') h = viewKhu();
    else if (V.v === 'bai') h = viewBai();
    else if (V.v === 'act') h = viewAct();
    else h = viewHome();
    APP.innerHTML = (V.v === 'join' ? '' : topnav()) + '<div class="wrap enter' + (IS_DEMO ? ' wrap--demo' : '') + '">' + h + '</div>' + demoStrip();
    var kids = $$('.wrap.enter > *'); kids.forEach(function (el, i) { el.style.setProperty('--i', Math.min(i, 8)); });
    if (top) W.scrollTo(0, 0);
    afterRender();
  }
  function afterRender() {
    if (V.v === 'act') { var a = actById(V.a); if (a && a.k === 'try' && V.step === 1) drawCounter(); }
  }

  /* =========================================================
     LÀM THẺ HỘI VIÊN (lần đầu)
     ========================================================= */
  function viewJoin() {
    J = J || {}; var st = V.step || 0, h = '';
    var bar = '<div class="stepbar stepbar--join">' + [1, 2, 3, 4].map(function (i) { return '<i class="' + (i < st ? 'on' : (i === st ? 'cur' : '')) + '"></i>'; }).join('') + '</div>';
    if (st === 0) {
      return '<div class="intro">' + shin('hi', 120, 'bob') + '<span class="kicker">TC01 · Huấn luyện thể chất</span><h1 class="h1">Phòng tập của <em>HLV Shin</em></h1>' +
        shinSays('hi', fill(TXT.joinHi)) + shinSays('encourage', TXT.joinHi2) +
        '<button type="button" class="btn btn--go btn--w" data-act="jNext">' + ic('card', 18) + 'Làm thẻ hội viên</button>' +
        (S.mem ? '' : '<button type="button" class="link" data-act="psHome">Về trang chính Proskills</button>') + '</div>';
    }
    h = (S.mem ? back('Sơ đồ phòng tập', 'home') : '') + '<div class="ah"><span class="ah__lab">Thẻ hội viên · bước ' + st + '/4</span>' + bar + '</div>';
    if (st === 1) {
      if (!J.job && J.cd === undefined) { J.cd = cdJob(); if (J.cd) J.job = J.cd; }
      h += '<div class="card"><p class="q">' + esc(TXT.jobQ) + '</p><p class="qsub">' + esc(TXT.jobSub) + '</p>' +
        (J.cd ? '<div class="note note--cd">' + ic('stamp', 16) + '<span>' + TXT.fromCd.replace('[Nghề]', esc(jobOf(J.cd).n)) + '</span></div>' : '') +
        '<div class="jobs">' + JOBS.map(function (j) {
          var g = GROUPS[j.g];
          return '<button type="button" class="job' + (J.job === j.s ? ' on' : '') + '" data-act="jJob" data-s="' + j.s + '"><b>' + esc(j.n) + '</b>' + (g ? '<small>' + ic(g.ic, 13) + esc(g.n) + (j.two ? ' + việc làm thêm' : '') + '</small>' : '<small>Chọn nơi làm ở bước sau</small>') + '</button>';
        }).join('') + '</div>' +
        (J.job && jobOf(J.job).note ? '<p class="qsub" style="margin-top:10px">' + esc(jobOf(J.job).note) + '</p>' : '') + '</div>' +
        '<button type="button" class="btn btn--w" data-act="jNext"' + (J.job ? '' : ' disabled') + '>Tiếp</button>';
      return h;
    }
    if (st === 2) {
      var j = jobOf(J.job), two = j && j.two;
      if (!two && j && j.g) J.g = j.g;
      if (!two && j && j.g) { h += '<div class="card"><p class="q">Nơi làm việc của nghề ' + esc(j.n) + '</p><div class="grps">' + grpBtn('g')(j.g) + '</div><p class="qsub" style="margin:10px 0 0">Không đúng với công việc của bạn? Quay lại chọn “Nghề khác” rồi chọn nơi làm.</p></div>'; }
      else h += '<div class="card">' + (two ? '<p class="q">' + esc(TXT.partQ) + '</p><p class="qsub">Giờ học của bạn thuộc nhóm Văn phòng. Shin thêm nhóm việc làm thêm.</p>' : (j && j.g ? '' : '<p class="q">' + esc(TXT.whereQ) + '</p><p class="qsub">Chọn nơi giống nhất.</p>')) +
        (two ? '<div class="grps">' + ['dv', 'chuyen'].map(grpBtn('g2')).join('') + '<button type="button" class="grp' + (J.g2 === 'none' ? ' on' : '') + '" data-act="jG2" data-g="none"><span class="grp__ic">' + PS.icon('close', 20) + '</span><b>' + esc(TXT.partNo) + '</b></button></div>' :
          (j && j.g ? '' : '<div class="grps">' + GROUP_ORDER.map(grpBtn('g')).join('') + '</div>')) + '</div>';
      if (two) J.g = 'vp';
      var ready = two ? !!J.g2 : !!J.g;
      if (ready) h += grpResult();
      h += '<button type="button" class="btn btn--w" data-act="jNext"' + (ready ? '' : ' disabled') + '>Tiếp</button>';
      return h;
    }
    if (st === 3) {
      h += '<div class="card"><p class="q">' + esc(TXT.sexQ) + '</p><div class="opts opts--2">' +
        [['nam', 'Mốc nam'], ['nu', 'Mốc nữ']].map(function (o) { return '<button type="button" class="opt' + (J.sex === o[0] ? ' on' : '') + '" data-act="jSex" data-v="' + o[0] + '"><span class="dot">' + (J.sex === o[0] ? PS.icon('check', 13, 3) : '') + '</span>' + o[1] + '</button>'; }).join('') + '</div></div>' +
        '<div class="card"><p class="q">' + esc(TXT.injQ) + '</p><div class="opts opts--2">' +
        [[0, 'Không'], [1, 'Có']].map(function (o) { return '<button type="button" class="opt' + (J.inj === o[0] ? ' on' : '') + '" data-act="jInj" data-v="' + o[0] + '"><span class="dot">' + (J.inj === o[0] ? PS.icon('check', 13, 3) : '') + '</span>' + o[1] + '</button>'; }).join('') + '</div>' +
        (J.inj === 1 ? shinSays('encourage', TXT.injYes, 46) : (J.inj === 0 ? shinSays('cheer', TXT.injNo, 46) : '')) +
        '<p class="ps-small" style="margin:8px 0 0">' + esc(TXT.injNote) + '</p></div>' +
        '<button type="button" class="btn btn--w" data-act="jNext"' + (J.sex && J.inj !== undefined ? '' : ' disabled') + '>Tiếp</button>';
      return h;
    }
    if (st === 4) {
      var okGoal = words(J.goal) >= 3;
      h += '<div class="card"><p class="q">' + esc(TXT.goalQ) + '</p><p class="qsub">' + esc(TXT.goalSub) + '</p>' +
        '<textarea class="inp ta" id="jGoal" rows="3" maxlength="160" placeholder="Ví dụ: Chống đẩy được 20 cái liên tục">' + esc(J.goal || '') + '</textarea>' +
        '<div class="chips chips--tips">' + TXT.goalTips.map(function (t, i) { return '<button type="button" class="chip chip--tip" data-act="jTip" data-i="' + i + '">' + esc(t) + '</button>'; }).join('') + '</div></div>' +
        '<details class="card fold"' + (J.h || J.w ? ' open' : '') + '><summary>' + esc(TXT.bodyQ) + '</summary><div class="body2"><label>Chiều cao (cm)<input class="inp" id="jH" inputmode="numeric" maxlength="3" value="' + esc(J.h || '') + '"></label><label>Cân nặng (kg)<input class="inp" id="jW" inputmode="decimal" maxlength="5" value="' + esc(J.w || '') + '"></label></div><div id="jBmi">' + bmiHTML(J.h, J.w) + '</div><p class="ps-small">' + esc(TXT.bodyNote) + '</p></details>' +
        '<button type="button" class="btn btn--go btn--w" data-act="jDone" id="jDoneBtn"' + (okGoal ? '' : ' disabled') + '>' + ic('card', 18) + 'In thẻ hội viên</button>';
      return h;
    }
    return h;
  }
  function grpBtn(field) {
    return function (g) { var G = GROUPS[g], on = J[field] === g; return '<button type="button" class="grp' + (on ? ' on' : '') + '" data-act="' + (field === 'g' ? 'jG' : 'jG2') + '" data-g="' + g + '"><span class="grp__ic">' + ic(G.ic, 22) + '</span><b>' + esc(G.n) + '</b><small>' + esc(G.d) + '</small></button>'; };
  }
  function grpResult() {
    var G = GROUPS[J.g], txt = TXT.grpSay.replace('[Nhóm]', esc(G.n) + (J.g2 && GROUPS[J.g2] ? ' + ' + esc(GROUPS[J.g2].n) : ''));
    return shinSays('cheer', txt, 50);
  }
  function bmi(h, w) { h = parseFloat(h); w = parseFloat(String(w).replace(',', '.')); if (!(h >= 120 && h <= 220 && w >= 30 && w <= 200)) return 0; return Math.round(w / ((h / 100) * (h / 100)) * 10) / 10; }
  function bmiHTML(h, w) {
    var b = bmi(h, w); if (!b) return '';
    var lab = b < 18.5 ? 'Gầy' : (b < 23 ? 'Bình thường' : (b < 25 ? 'Thừa cân' : 'Béo phì'));
    return '<div class="bmi"><b>' + b + '</b><span>BMI · ' + lab + '</span></div>';
  }
  function finishJoin() {
    var old = S.mem || {};
    S.mem = { job: J.job, g: J.g, g2: J.g2 && J.g2 !== 'none' ? J.g2 : '', sex: J.sex, inj: J.inj ? 1 : 0, goal: String(J.goal || '').replace(/^\s+|\s+$/g, ''), h: bmi(J.h, J.w) ? +J.h : 0, w: bmi(J.h, J.w) ? +String(J.w).replace(',', '.') : 0, at: old.at || Date.now() };
    markDay(); save(true);
  }

  /* ---------- thẻ hội viên ---------- */
  function stampRow(k, lab) {
    return '<div class="mcard__row"><span class="mcard__rl">' + lab + '</span>' + baisOf(k).map(function (b) { var dn = baiDone(b); return '<i class="' + (dn ? 'on' : '') + '" title="' + esc(b.t) + '">' + (dn ? ic(b.ic, 15) : '') + '</i>'; }).join('') + '</div>';
  }
  function memCard(big) {
    var o = SHIN_OUTFIT; SHIN_OUTFIT = '';
    var h = memCardIn(big); SHIN_OUTFIT = o; return h;
  }
  function memCardIn(big) {
    var p = PS.profile(), m = S.mem || {}, G = GROUPS[m.g] || {};
    return '<section class="mcard' + (big ? ' mcard--big' : '') + '" aria-label="Thẻ hội viên"><div class="mcard__body">' +
      '<div class="mcard__lab"><span>Thẻ hội viên · <span class="jp">会員証</span></span><span>TC01</span></div>' +
      '<div class="mcard__top">' + shin('cheer', 54) + '<div><small>Phòng tập HLV Shin</small><b>' + esc(p.name || (IS_DEMO ? 'Học viên demo' : given())) + '</b></div></div>' +
      '<div class="mcard__grid"><div><small>Lớp</small><b>' + esc(p.cls || '—') + '</b></div><div><small>Nhóm</small><b>' + (G.ic ? ic(G.ic, 14) : '') + esc(grpName(m.g)) + (m.g2 && GROUPS[m.g2] ? ' + ' + esc(GROUPS[m.g2].n) : '') + '</b></div>' +
      '<div><small>Nghề</small><b>' + esc(jobName() || '—') + '</b></div><div><small>Ngày cấp</small><b>' + esc(dmy(m.at)) + '</b></div></div>' +
      (m.goal ? '<div class="mcard__goal"><small>Mục tiêu</small><span>' + esc(m.goal) + '</span></div>' : '') +
      '<div class="mcard__meta"><span>Dấu: Sàn tập ' + baiCount('san') + '/' + BAI.length + ' · Bếp ' + baiCount('bep') + '/' + BAI_BEP.length + '</span><span class="mcard__pts"><span title="Chuỗi ngày">' + PS.icon('flame', 13) + (IS_DEMO ? 5 : PS.streak()) + '</span><span title="XP">' + PS.icon('star', 13) + xpTotal() + '</span><span title="Insight">' + PS.icon('bulb', 13) + insTotal() + '</span></span></div></div>' +
      '<div class="mcard__stamps">' + stampRow('san', 'Sàn tập') + stampRow('bep', 'Bếp') + '</div></section>';
  }

  /* =========================================================
     TRANG CHỦ: SƠ ĐỒ PHÒNG TẬP
     ========================================================= */
  function viewHome() {
    var hi = TXT.homeHi[new Date().getDate() % TXT.homeHi.length], cand = [];
    ['san', 'bep'].forEach(function (k) { var x = nextBai(k); if (x) cand.push(x); });
    var nb = cand.length ? cand[new Date().getDate() % cand.length] : null;
    return '<button type="button" class="pshome" data-act="psHome">' + ic('arrowL', 15, 2.4) + 'Proskills</button>' +
      shinSays('hi', fill(hi) + (S.mem && S.mem.inj ? '<br><span class="warn-s">' + esc(TXT.injHome) + '</span>' : '')) +
      memCard() +
      (nb ? '<button type="button" class="btn btn--go btn--w glow" data-act="bai" data-id="' + nb.id + '">Gợi ý hôm nay: ' + esc(nb.t) + '</button>' : '<button type="button" class="btn btn--go btn--w" data-act="khu" data-id="san">Ôn lại Sàn tập</button>') +
      '<h2 class="sec-h">Sơ đồ phòng tập</h2><p class="sec-sub">Chọn khu nào học trước cũng được</p>' +
      '<div class="gym">' + KHU.map(function (k) {
        var nDone = k.ready ? baiCount(k.id) : 0, tot = k.ready ? baisOf(k.id).length : 0;
        return '<button type="button" class="zone' + (k.ready ? '' : ' zone--soon') + '" data-act="khu" data-id="' + k.id + '">' +
          '<span class="zone__jp jp">' + esc(k.jp) + '</span><span class="zone__ic">' + ic(k.ic, 24) + '</span><b>' + esc(k.t) + '</b><small>' + esc(k.sub) + '</small>' +
          (k.ready ? '<span class="zone__bar"><i style="width:' + Math.round(nDone / tot * 100) + '%"></i></span><span class="zone__n">' + nDone + '/' + tot + ' bài</span>' : '<span class="badge badge--soon">Sắp mở</span>') + '</button>';
      }).join('') + '</div>' +
      '<p class="foot">Proskills · TC01 Huấn luyện thể chất · ' + esc(TC_VER) + '<br>Bài làm tự lưu trên trình duyệt của máy này</p>';
  }

  /* ---------- khu ---------- */
  function khuById(id) { for (var i = 0; i < KHU.length; i++) if (KHU[i].id === id) return KHU[i]; return KHU[0]; }
  function zoneHead(k, extra) {
    return '<header class="zh"><span class="zh__jp"><b class="jp">' + esc(k.jp) + '</b><small class="jp">' + esc(k.kana) + '</small></span><div class="zh__tx"><span class="zh__lab">Khu</span><h1>' + esc(k.t) + '</h1><p>' + esc(k.sub) + '</p></div>' + (extra || '') + '</header>';
  }
  function viewKhu() {
    var k = khuById(V.id);
    if (!k.ready) return back('Sơ đồ phòng tập', 'home') + zoneHead(k) + shinSays('think', TXT.khuSoon) + '<button type="button" class="btn btn--soft btn--w" data-act="home">Về sơ đồ phòng tập</button>';
    var L = baisOf(k.id), n = baiCount(k.id);
    return back('Sơ đồ phòng tập', 'home') + zoneHead(k, '<div class="zh__bar"><i style="width:' + Math.round(n / L.length * 100) + '%"></i></div><div class="zh__meta"><span>' + n + '/' + L.length + ' bài xong</span><span>Chọn bài nào trước cũng được</span></div>') +
      (k.id === 'bep' ? shinSays('hi', esc(BEP_TXT.khuSay)) + commitCard() : '') +
      '<div class="bais">' + L.map(function (b) {
        var dn = baiDone(b), nd = baiN(b);
        if (b.soon) return '<button type="button" class="bai bai--soon" data-act="baiSoon"><span class="bai__ic">' + ic(b.ic, 24) + '</span><span class="bai__tx"><b>' + esc(b.t) + '</b><small>' + esc(b.sub) + '</small><span class="bai__meta"><span class="badge badge--soon">Sắp mở</span></span></span></button>';
        return '<button type="button" class="bai' + (dn ? ' bai--done' : '') + '" data-act="bai" data-id="' + b.id + '"><span class="bai__ic">' + ic(b.ic, 24) + '</span><span class="bai__tx"><b>' + esc(b.t) + '</b><small>' + esc(b.sub) + '</small>' +
          '<span class="bai__meta"><span>' + ic('timer', 13) + b.min + ' phút</span><span class="pips">' + b.acts.map(function (a) { return '<i class="' + (S.done[a.id] ? 'on' : '') + '"></i>'; }).join('') + '</span>' + (dn ? '<span class="badge badge--ok">Có dấu</span>' : (nd ? '<span class="badge">' + nd + '/' + b.acts.length + '</span>' : '')) + '</span></span></button>';
      }).join('') + '</div>';
  }

  /* ---------- bài ---------- */
  function viewBai() {
    var b = BAI_BY[V.id], g = grp(), G = GROUPS[g];
    if (!b || b.soon) { V = { v: 'home' }; return viewHome(); }
    var K = khuById(b.khu);
    return back(K.t, 'khu', ' data-id="' + b.khu + '"') +
      '<header class="bh"><span class="bh__ic">' + ic(b.ic, 30) + '</span><div><span class="ah__lab">' + esc(K.t) + ' · ' + b.min + ' phút</span><h1>' + esc(b.t) + '</h1><p>' + esc(b.sub) + '</p></div></header>' +
      (G && b.gtip[g] ? '<div class="gtip"><span class="gtip__ic">' + ic(G.ic, 20) + '</span><div><small>Với nhóm ' + esc(G.n) + '</small>' + esc(b.gtip[g]) + '</div></div>' : '') +
      (S.mem && S.mem.g2 && b.gtip[S.mem.g2] ? '<div class="gtip"><span class="gtip__ic">' + ic(GROUPS[S.mem.g2].ic, 20) + '</span><div><small>Khi làm thêm · ' + esc(GROUPS[S.mem.g2].n) + '</small>' + esc(b.gtip[S.mem.g2]) + '</div></div>' : '') +
      '<div class="acts">' + b.acts.map(function (a, i) {
        var dn = !!S.done[a.id];
        return '<button type="button" class="act' + (dn ? ' act--done' : '') + '" data-act="act" data-id="' + a.id + '"><span class="act__n">' + (dn ? PS.icon('check', 18, 3) : (i + 1)) + '</span><span><b>' + esc(a.t) + '</b><small>' + esc(KIND[a.k]) + ' · ' + a.min + ' phút · +' + a.xp + ' XP</small></span>' + (dn ? '<span class="badge badge--ok">Xong</span>' : '') + '</button>';
      }).join('') + '</div>' +
      (baiDone(b) ? '<div class="stampbox">' + ic('stamp', 20) + '<span>Bài này đã có dấu trên thẻ hội viên. ' + (b.khu === 'bep' ? 'Làm lại' : 'Tập lại') + ' lúc nào cũng được.</span></div>' : '');
  }
  var KIND = { how: 'Xem cách làm', spot: 'Tìm điểm chưa đúng', 'try': 'Tập thử', order: 'Xếp thứ tự', pick: 'Chọn cách đúng', plan: 'Lên lịch',
    plate: 'Xếp đĩa', meal: 'Bữa của bạn', write: 'Viết ra', calc: 'Máy tính', hilo: 'Cao hay thấp', day: 'Tìm việc chưa ổn', commit: 'Cam kết',
    match: 'Ghép cặp', basket: 'Giỏ konbini', label: 'Đọc nhãn', shift: 'Giờ ăn theo ca', bento: 'Xếp hộp cơm', date: 'Đọc hạn dùng' };

  /* =========================================================
     HOẠT ĐỘNG
     ========================================================= */
  var T = {}; /* trạng thái tạm của hoạt động đang làm */
  function newT(a) {
    var t = { a: a.id, ex: 0, fr: 0, seen: {}, round: 0, found: {}, miss: 0, ord: [], pick: -1, tryEx: a.k === 'try' ? defaultTryEx(a) : null, n: 0, t0: 0, el: 0, run: false, feel: -1, txt: S.refl[a.id] || '',
      plan: S.plan ? JSON.parse(JSON.stringify(S.plan)) : { k: '', days: [], slot: -1, txt: '' }, sel: -1, placed: {}, wrong: '', mtab: 0, meal: null, mres: false, hp: {}, okTap: {}, hab: -1, own: '', c: null,
      ms: -1, mm: {}, mw: -1, mlast: -1, bk: {}, lk: {}, lw: '', lseen: {}, sh: null, bt: {}, bw: null };
    if (a.k === 'meal') { var m = S.food.meal; t.meal = m ? { sang: m.sang.slice(), trua: m.trua.slice(), toi: m.toi.slice(), skip: JSON.parse(JSON.stringify(m.skip || {})) } : { sang: [], trua: [], toi: [], skip: {} }; }
    if (a.k === 'calc') {
      var c = S.food.calc || {}, mm = S.mem || {}, by = parseInt(PS.profile().by, 10), age = by > 1900 ? new Date().getFullYear() - by : '';
      t.c = { h: c.h || mm.h || '', w: c.w || mm.w || '', age: c.age || age, sex: c.sex || mm.sex || '', lv: c.lv >= 0 ? c.lv : -1 };
    }
    if (a.k === 'shift' && S.food.shift) t.sh = { s: S.food.shift.s, l: S.food.shift.l, pre: S.food.shift.pre };
    if (a.k === 'bento' && S.food.bento) { var ob = S.food.bento; for (var bk in ob) if (ob.hasOwnProperty(bk)) t.bt[bk] = ob[bk]; }
    if (a.k === 'basket' && S.food.konbini) S.food.konbini.sel.forEach(function (i) { t.bk[i] = 1; });
    if (a.k === 'commit' && S.food.commit) { var cm = S.food.commit; t.txt = cm.txt; t.hab = HABITS.length; t.own = cm.h; HABITS.forEach(function (x, i) { if (x.t === cm.h) { t.hab = i; t.own = ''; } }); }
    return t;
  }
  function openAct(id) { var a = actById(id); T = newT(a); go({ v: 'act', a: id, b: a.bai, step: 0 }); }
  function defaultTryEx(a) { if (a.ex.indexOf('kneepush') >= 0 && sexKey() === 'nu') return 'kneepush'; return a.ex[0]; }
  function actHead(a) {
    var b = BAI_BY[a.bai];
    return back(b.t, 'bai', ' data-id="' + b.id + '"') + '<div class="ah"><span class="ah__lab">' + esc(khuById(b.khu).t) + ' · ' + esc(KIND[a.k]) + '</span><h1>' + esc(a.t) + '</h1></div>' +
      (S.done[a.id] ? '<div class="redo">' + PS.icon('check', 16, 3) + 'Bạn đã làm xong. Làm lại thoải mái, không mất điểm.</div>' : '');
  }
  function viewAct() {
    var a = actById(V.a); if (!a) { V = { v: 'home' }; return viewHome(); }
    if (T.a !== a.id) T = newT(a);
    var h = actHead(a);
    if (a.k === 'how') h += viewHow(a);
    else if (a.k === 'spot') h += viewSpot(a);
    else if (a.k === 'try') h += viewTry(a);
    else if (a.k === 'order') h += viewOrder(a);
    else if (a.k === 'pick') h += viewPick(a);
    else if (a.k === 'plan') h += viewPlan(a);
    else if (a.k === 'plate') h += viewPlate(a);
    else if (a.k === 'meal') h += viewMeal(a);
    else if (a.k === 'write') h += viewWrite(a);
    else if (a.k === 'calc') h += viewCalc(a);
    else if (a.k === 'hilo') h += viewHilo(a);
    else if (a.k === 'day') h += viewDay(a);
    else if (a.k === 'commit') h += viewCommit(a);
    else if (a.k === 'match') h += viewMatch(a);
    else if (a.k === 'basket') h += viewBasket(a);
    else if (a.k === 'label') h += viewLabel(a);
    else if (a.k === 'shift') h += viewShift(a);
    else if (a.k === 'bento') h += viewBento(a);
    else if (a.k === 'date') h += viewDate(a);
    return h;
  }

  /* ---------- xem cách làm ---------- */
  function frameFig(fr, w) {
    var m = '';
    if (fr.g) m += figGuide([fr.g[0], fr.g[1]], [fr.g[2], fr.g[3]], 1);
    if (fr.a) m += figArrow(fr.a[0], fr.a[1]);
    if (fr.arc) fr.arc.forEach(function (c) { m += figArc(c[0], c[1], c[2]); });
    return fig(fr.p, { marks: m, w: w, label: fr.t });
  }
  function viewHow(a) {
    var exId = a.ex[T.ex], E = EX[exId], n = E.frames.length, fr = E.frames[T.fr];
    T.seen[exId + T.fr] = 1;
    var allSeen = true; for (var i = 0; i < n; i++) if (!T.seen[exId + i]) allSeen = false;
    if (allSeen) T.seen[exId] = 1;
    var anyDone = false; a.ex.forEach(function (x) { if (T.seen[x]) anyDone = true; });
    return (a.ex.length > 1 ? '<div class="extabs" role="tablist">' + a.ex.map(function (x, i) { return '<button type="button" role="tab" class="extab' + (i === T.ex ? ' on' : '') + '" data-act="howEx" data-i="' + i + '">' + esc(EX[x].n) + (T.seen[x] ? PS.icon('check', 13, 3) : '') + '</button>'; }).join('') + '</div>' : '') +
      '<div class="card howc"><div class="howc__top"><b>' + esc(E.n) + '</b><small>' + esc(E.who) + '</small></div>' +
      '<div class="figbox">' + frameFig(fr) + '<span class="figbox__n">' + (T.fr + 1) + '/' + n + '</span></div>' +
      '<p class="howc__t"><b>Bước ' + (T.fr + 1) + '.</b> ' + esc(fr.t) + '</p>' +
      '<div class="howc__nav"><button type="button" class="btn btn--soft btn--sm" data-act="howFr" data-d="-1"' + (T.fr ? '' : ' disabled') + '>' + PS.icon('back', 16) + 'Trước</button>' +
      '<span class="dots">' + E.frames.map(function (f, i) { return '<i class="' + (i === T.fr ? 'on' : (T.seen[exId + i] ? 'seen' : '')) + '"></i>'; }).join('') + '</span>' +
      '<button type="button" class="btn btn--sm" data-act="howFr" data-d="1"' + (T.fr < n - 1 ? '' : ' disabled') + '>Tiếp' + PS.icon('next', 16) + '</button></div></div>' +
      '<div class="card keys"><b class="keys__h">' + ic('stamp', 16) + 'Ba điểm chính</b><ul>' + E.keys.map(function (k) { return '<li>' + esc(k) + '</li>'; }).join('') + '</ul>' +
      '<a class="ytbtn" href="' + esc(E.yt ? 'https://www.youtube.com/watch?v=' + E.yt : TC_YT) + '" target="_blank" rel="noopener">' + ic('play', 18) + '<span><b>Xem video của thầy cô GDTC</b><small>' + (E.yt ? 'Mở đúng video động tác' : 'Mở kênh video động tác của khóa') + '</small></span>' + PS.icon('ext', 16) + '</a></div>' +
      (a.more ? '<p class="morenote">' + esc(a.more) + '</p>' : '') +
      '<button type="button" class="btn btn--go btn--w" data-act="finish"' + (anyDone ? '' : ' disabled') + '>' + (anyDone ? 'Mình xem xong rồi' : 'Xem hết các bước để hoàn thành') + '</button>';
  }

  /* ---------- tìm điểm chưa đúng ---------- */
  function viewSpot(a) {
    var R = a.rounds[T.round], nF = 0, i; for (i = 0; i < R.hs.length; i++) if (T.found[T.round + '.' + i]) nF++;
    var all = nF === R.hs.length, hint = T.miss >= 2 && !all, show = T.miss >= 4 && !all;
    var ov = R.hs.map(function (s, i) { var f = T.found[T.round + '.' + i]; return '<g class="hs' + (f ? ' hs--f' : '') + (hint ? ' hs--hint' : '') + (show ? ' hs--show' : '') + '"><circle cx="' + s.x + '" cy="' + s.y + '" r="' + (s.r + 6) + '" fill="transparent" data-act="hs" data-i="' + i + '"/>' + (f || show ? '<circle class="hs__ring" cx="' + s.x + '" cy="' + s.y + '" r="' + s.r + '"/><text x="' + (s.x + s.r - 2) + '" y="' + (s.y - s.r + 2) + '" class="hs__n">' + (i + 1) + '</text>' : '') + '</g>'; }).join('');
    var svg = (R.art ? '<svg class="fig fig--art" viewBox="0 0 240 180" role="img" aria-label="' + esc(R.q) + '">' + TC_ART[R.art]() + '</svg>' : fig(R.p, { label: R.q })).replace('</svg>', '<rect x="0" y="0" width="240" height="180" fill="transparent" data-act="hsMiss" style="pointer-events:all" class="hs-bg"/>' + ov + '</svg>');
    /* đưa nền bấm trượt xuống dưới các điểm */
    return (a.rounds.length > 1 ? '<div class="stepbar">' + a.rounds.map(function (r, j) { return '<i class="' + (j < T.round ? 'on' : (j === T.round ? 'cur' : '')) + '"></i>'; }).join('') + '</div>' : '') +
      '<div class="card"><p class="q">' + esc(R.q) + '</p><p class="qsub">Tìm được ' + nF + '/' + R.hs.length + (T.miss ? ' · chạm trượt ' + T.miss + ' lần' : '') + '</p>' +
      '<div class="figbox figbox--spot no">' + svg + '</div>' +
      (hint && !show ? '<p class="hintl">' + ic('bulb', 15) + 'Gợi ý: các chỗ cần tìm đang nhấp nháy nhẹ.</p>' : '') +
      '<ol class="found">' + R.hs.map(function (s, i) { var f = T.found[T.round + '.' + i] || show; return f ? '<li><b>' + esc(s.t) + '</b><small>' + esc(s.why) + '</small></li>' : '<li class="q-empty">…</li>'; }).join('') + '</ol></div>' +
      (all || show ? (T.round < a.rounds.length - 1 ? '<button type="button" class="btn btn--w" data-act="spotNext">Hình tiếp theo</button>' : '<button type="button" class="btn btn--go btn--w" data-act="finish">Hoàn thành</button>') :
        (T.miss >= 3 ? '<button type="button" class="link" data-act="spotShow">Xem đáp án</button>' : ''));
  }

  /* ---------- tập thử cùng Shin ---------- */
  var TIMER = null;
  function stopTimer() { if (TIMER) { clearInterval(TIMER); TIMER = null; } if (T && T.run) { T.el += Date.now() - T.t0; T.run = false; } }
  function viewTry(a) {
    var exId = T.tryEx, E = EX[exId], M = MOC[exId] || {}, timeMode = M.u === 's', st = V.step || 0;
    var bar = '<div class="stepbar">' + [0, 1, 2, 3].map(function (i) { return '<i class="' + (i < st ? 'on' : (i === st ? 'cur' : '')) + '"></i>'; }).join('') + '</div>';
    if (st === 0) {
      return bar + '<div class="card"><p class="q">Hôm nay bạn tập động tác nào?</p><div class="chips">' + a.ex.map(function (x) { return '<button type="button" class="chip' + (x === exId ? ' on' : '') + '" data-act="tryEx" data-x="' + x + '">' + esc(EX[x].n) + '</button>'; }).join('') + '</div>' +
        '<div class="mini">' + frameFig(E.frames[0], 150) + '<ul>' + E.keys.map(function (k) { return '<li>' + esc(k) + '</li>'; }).join('') + '</ul></div>' +
        (best(exId) ? '<p class="qsub">Kỷ lục của bạn: <b>' + (timeMode ? fmtT(best(exId)) : best(exId) + ' cái') + '</b></p>' : '') + '</div>' +
        (S.mem && S.mem.inj ? shinSays('encourage', esc(TXT.injHome), 46) : '') +
        shinSays('think', 'Bạn đã khởi động chưa? Cơ ấm rồi mới tập nhé.', 46) +
        '<div class="btnrow"><button type="button" class="btn btn--soft" data-act="act" data-id="b1a">Chưa, xem khởi động</button><button type="button" class="btn" data-act="tryGo">Rồi, bắt đầu</button></div>';
    }
    if (st === 1) {
      return bar + '<div class="card cnt"><p class="q">' + esc(E.n) + '</p>' +
        (timeMode ? '<p class="qsub">Bấm Bắt đầu rồi vào tư thế. Hết sức hoặc sai tư thế thì bấm Dừng.</p><div class="clock" id="cClock">' + fmtClock(T.el) + '</div>' +
          '<div class="btnrow"><button type="button" class="btn btn--go" data-act="tStart" id="cStart">' + (T.run ? 'Dừng' : (T.el ? 'Tiếp tục' : 'Bắt đầu')) + '</button><button type="button" class="btn btn--soft" data-act="tReset">Làm lại</button></div>' :
          '<p class="qsub">Mỗi lần làm xong một cái, chạm vào nút tròn. Hoặc nhập số ở dưới.</p><button type="button" class="tap" data-act="tap" id="cTap"><b id="cN">' + T.n + '</b><small>chạm +1</small></button>' +
          '<div class="btnrow btnrow--c"><button type="button" class="btn btn--soft btn--sm" data-act="tapMinus">Bớt 1</button><label class="numin">Nhập số<input class="inp" id="cNin" inputmode="numeric" maxlength="3" value=""></label></div>') +
        '</div><button type="button" class="btn btn--w" data-act="tryDone" id="cDone">Xong hiệp này</button>';
    }
    if (st === 2) {
      var n = timeMode ? Math.round(T.el / 1000) : T.n, mk = M[sexKey()], pr = T.isPr;
      var ladder = '';
      if (mk) {
        var mx = mk[2] * 1.25, pos = Math.min(100, n / mx * 100);
        var vf = function (v) { return timeMode ? fmtT(v) : v + ' cái'; };
        ladder = '<div class="moc"><div class="moc__bar"><i style="width:' + pos + '%"></i>' + mk.map(function (v, i) { return '<span class="moc__m moc__m--' + i + '" style="left:' + (v / mx * 100) + '%"></span>'; }).join('') + '</div>' +
          '<div class="moc__leg">' + mk.map(function (v, i) { return '<span class="moc__l moc__l--' + i + '"><i></i>' + MOC_LAB[i] + ' <b>' + vf(v) + '</b></span>'; }).join('') + '</div><p class="ps-small">Mốc của lớp GDTC (' + esc(M.src) + ', ' + (sexKey() === 'nu' ? 'nữ' : 'nam') + '). Chỉ để tham khảo: so với chính mình là chính.</p></div>';
      } else if (M.note) ladder = '<p class="ps-small">' + esc(M.note) + '</p>';
      var feels = ['Nhẹ nhàng', 'Vừa sức', 'Hơi quá sức', 'Thấy đau'], say = ['easySay', 'okSay', 'hardSay', 'painStop'];
      return bar + '<div class="card res"><span class="ah__lab">Kết quả</span><div class="res__n">' + (timeMode ? fmtT(n) : n + ' <small>cái</small>') + '</div>' + (pr ? '<span class="prtag">' + PS.icon('star', 14) + esc(TXT.pr) + '</span>' : '') + ladder + '</div>' +
        '<div class="card"><p class="q">Bạn thấy thế nào?</p><div class="chips">' + feels.map(function (f, i) { return '<button type="button" class="chip' + (T.feel === i ? ' on' : '') + (i === 3 ? ' chip--pain' : '') + '" data-act="feel" data-i="' + i + '">' + f + '</button>'; }).join('') + '</div>' +
        (T.feel >= 0 ? shinSays(T.feel === 3 ? 'sad' : (T.feel === 2 ? 'think' : 'cheer'), esc(TXT[say[T.feel]]), 46) : '') + '</div>' +
        '<button type="button" class="btn btn--w" data-act="tryNext"' + (T.feel >= 0 ? '' : ' disabled') + '>Tiếp</button>';
    }
    return bar + writeBox(TXT.reflQ, TXT.reflSub, E.keys.map(function (k) { return 'Lần tới mình sẽ chú ý: ' + k.charAt(0).toLowerCase() + k.slice(1) + '.'; })) +
      '<button type="button" class="btn btn--go btn--w" data-act="finish" id="wDone"' + (words(T.txt) >= 3 ? '' : ' disabled') + '>Lưu và hoàn thành</button>';
  }
  function writeBox(q, sub, tips) {
    var w = words(T.txt);
    return '<div class="card"><p class="q">' + esc(q) + '</p><p class="qsub">' + esc(sub) + '</p><textarea class="inp ta" id="wTxt" rows="3" maxlength="300">' + esc(T.txt || '') + '</textarea>' +
      '<div class="counter" id="wCnt">' + w + ' chữ' + (w >= 10 ? (T.txt === T.tipUsed ? ' · sửa thành lời của bạn để được Insight' : ' · +1 Insight') : '') + '</div>' +
      (tips && tips.length ? '<div class="chips chips--tips">' + tips.map(function (t, i) { return '<button type="button" class="chip chip--tip" data-act="wTip" data-t="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>' : '') + '</div>';
  }
  function drawCounter() {
    var a = actById(V.a), M = MOC[T.tryEx] || {};
    if (M.u === 's' && T.run && !TIMER) {
      TIMER = setInterval(function () { var el = $('#cClock'); if (!el) { stopTimer(); return; } el.textContent = fmtClock(T.el + Date.now() - T.t0); }, 250);
    }
  }
  function tick() { if (!PS.soundOn() || RM) return; try { var C = W.AudioContext || W.webkitAudioContext; if (!C) return; var c = tick.c || (tick.c = new C()), o = c.createOscillator(), g = c.createGain(); o.frequency.value = 880; g.gain.setValueAtTime(0.08, c.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.12); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.13); } catch (e) {} }

  /* ---------- xếp thứ tự ---------- */
  function viewOrder(a) {
    var items = seedShuffle(a.items.map(function (t, i) { return i; }), a.id), full = T.ord.length === a.items.length;
    var ok = full && T.ord.join() === a.items.map(function (t, i) { return i; }).join();
    return '<div class="card"><p class="q">' + esc(a.q) + '</p><p class="qsub">' + esc(a.sub) + '</p><div class="ordl">' + items.map(function (i) {
      var pos = T.ord.indexOf(i);
      return '<button type="button" class="ordi' + (pos >= 0 ? ' on' : '') + (full ? (ok ? ' ok' : ' no') : '') + '" data-act="ord" data-i="' + i + '"' + (full ? ' disabled' : '') + '><span class="ordi__n">' + (pos >= 0 ? pos + 1 : '') + '</span>' + esc(a.items[i]) + '</button>';
    }).join('') + '</div></div>' +
      (full ? (ok ? '<div class="fb fb--ok"><b>Đúng rồi!</b> ' + esc(a.ok) + '</div><button type="button" class="btn btn--go btn--w" data-act="finish">Hoàn thành</button>' :
        '<div class="fb fb--no"><b>Thử lại nhé.</b> ' + esc(a.hint) + '</div><button type="button" class="btn btn--w" data-act="ordReset">Thử xếp lại</button>') :
        (T.ord.length ? '<button type="button" class="link" data-act="ordReset">Xếp lại từ đầu</button>' : ''));
  }

  /* ---------- chọn cách đúng ---------- */
  function pickRounds(a) { if (a.rounds) return a.rounds; if (a.byGroup) { var G = a.byGroup[grp()] || a.byGroup.xuong; if (G.rounds) return G.rounds; } return null; }
  function pickData(a) { var RR = pickRounds(a); if (RR) return RR[T.round]; if (a.byGroup) return a.byGroup[grp()] || a.byGroup.xuong; return a; }
  function viewPick(a) {
    var R = pickData(a), ord = seedShuffle(R.opts.map(function (o, i) { return i; }), a.id + 'p' + T.round + (a.byGroup ? grp() : '')), P = T.pick, chosen = P >= 0 ? R.opts[P] : null;
    var RR = pickRounds(a), last = !RR || T.round >= RR.length - 1, G = a.byGroup ? GROUPS[grp()] || GROUPS.xuong : null;
    return (RR ? '<div class="stepbar">' + RR.map(function (r, j) { return '<i class="' + (j < T.round ? 'on' : (j === T.round ? 'cur' : '')) + '"></i>'; }).join('') + '</div>' : '') +
      '<div class="card">' + (G ? '<p class="qsub">' + ic(G.ic, 14) + ' Tình huống của nhóm ' + esc(G.n) + '</p>' : '') + '<p class="q">' + esc(R.q) + '</p><div class="opts">' + ord.map(function (i) {
      var o = R.opts[i], on = P === i;
      return '<button type="button" class="opt' + (on ? (o.ok ? ' opt--ok' : ' opt--no') : '') + '" data-act="pick" data-i="' + i + '"' + (chosen && chosen.ok ? ' disabled' : '') + '><span class="dot">' + (on ? PS.icon(o.ok ? 'check' : 'close', 13, 3) : '') + '</span>' + esc(o.t) + '</button>';
    }).join('') + '</div></div>' +
      (chosen ? (chosen.ok ? '<div class="fb fb--ok">' + esc(chosen.why) + '</div>' + (last ? (a.end ? shinSays('think', esc(a.end), 46) : '') + '<button type="button" class="btn btn--go btn--w" data-act="finish">Hoàn thành</button>' : '<button type="button" class="btn btn--w" data-act="pickNext">Câu tiếp theo</button>') :
        '<div class="fb fb--no"><b>Thử lại nhé.</b> ' + esc(chosen.why) + '</div><p class="qsub" style="text-align:center">Thử chọn lại một cách khác.</p>') : '');
  }

  /* ---------- lịch tập của mình ---------- */
  function viewPlan(a) {
    var P = T.plan, sug = best('pushup') > 15 ? 'B' : 'A', okDays = P.days.length >= 3, okTxt = words(P.txt) >= 4;
    return '<div class="card"><p class="q">Chọn kế hoạch hợp sức bạn</p><p class="qsub">Shin gợi ý: <b>Kế hoạch ' + sug + '</b>' + (best('pushup') ? ' (kỷ lục chống đẩy của bạn: ' + best('pushup') + ' cái)' : '') + '.</p>' +
      ['A', 'B'].map(function (k) { var L = PLANS[k]; return '<button type="button" class="plan' + (P.k === k ? ' on' : '') + '" data-act="planK" data-k="' + k + '"><b>' + esc(L.n) + '</b><small>' + esc(L.who) + ' · ' + esc(L.d) + '</small>' + (P.k === k ? '<ul>' + L.body.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') + '</button>'; }).join('') +
      '<p class="ps-small">' + esc(PLAN_TIP) + '</p></div>' +
      (P.k ? '<div class="card"><p class="q">Bạn tập vào những ngày nào?</p><p class="qsub">Chọn ít nhất 3 ngày' + (PLANS[P.k].days === 4 ? ' (kế hoạch A nên chọn 4)' : '') + '.</p><div class="chips chips--days">' + DAYS7.map(function (d, i) { return '<button type="button" class="chip' + (P.days.indexOf(i) >= 0 ? ' on' : '') + '" data-act="planD" data-i="' + i + '">' + d + '</button>'; }).join('') + '</div>' +
        '<p class="q" style="margin-top:14px">Giờ nào?</p><div class="chips">' + SLOTS.map(function (s, i) { return '<button type="button" class="chip' + (P.slot === i ? ' on' : '') + '" data-act="planS" data-i="' + i + '">' + s + '</button>'; }).join('') + '</div></div>' : '') +
      (P.k && okDays && P.slot >= 0 ? '<div class="card"><p class="q">' + esc(PLAN_Q) + '</p><textarea class="inp ta" id="pTxt" rows="2" maxlength="200">' + esc(P.txt || '') + '</textarea><div class="chips chips--tips">' + PLAN_TIPS.map(function (t) { return '<button type="button" class="chip chip--tip" data-act="pTip" data-t="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div></div>' +
        '<button type="button" class="btn btn--go btn--w" data-act="finish" id="pDone"' + (okTxt ? '' : ' disabled') + '>Lưu lịch tập</button>' : '');
  }
  function planLine(P) { if (!P || !P.k) return ''; return PLANS[P.k].n + ' · ' + P.days.map(function (i) { return DAYS7[i]; }).join(', ') + ' · ' + (SLOTS[P.slot] || ''); }

  /* ---------- hoàn thành ---------- */
  function finishAct() {
    var a = actById(V.a), first = !S.done[a.id], b = BAI_BY[a.bai], wasDone = baiDone(b), ins = 0;
    if (a.k === 'try') {
      var M = MOC[T.tryEx] || {}, n = M.u === 's' ? Math.round(T.el / 1000) : T.n;
      S.refl[a.id] = T.txt; if (words(T.txt) >= 10 && T.txt !== T.tipUsed) ins = 1;
    }
    if (a.k === 'write') { S.refl[a.id] = T.txt; if (words(T.txt) >= 10 && T.txt !== T.tipUsed) ins = 1; }
    if (a.k === 'commit') {
      var hab = T.hab < HABITS.length ? HABITS[T.hab].t : String(T.own || '').replace(/^\s+|\s+$/g, ''), oc = S.food.commit, I0 = commitInfo(), keep = oc && oc.h === hab && I0 && I0.di < COMMIT_DAYS;
      S.food.commit = { h: hab, txt: T.txt, at: keep ? oc.at : Date.now(), days: keep ? oc.days : {} };
      if (words(T.txt) >= 10 && T.txt !== T.tipUsed) ins = 1;
    }
    if (a.k === 'meal') S.food.meal = { sang: T.meal.sang.slice(), trua: T.meal.trua.slice(), toi: T.meal.toi.slice(), skip: T.meal.skip, d: today() };
    if (a.k === 'calc') { var cr = calcRes(T.c); if (cr) { S.food.calc = { h: +T.c.h, w: num(T.c.w), age: +T.c.age, sex: T.c.sex, lv: T.c.lv, bmi: cr.bmi, bmr: cr.bmr, tdee: cr.tdee, water: cr.water, at: Date.now() }; if (S.mem) { S.mem.h = +T.c.h; S.mem.w = num(T.c.w); } } }
    if (a.k === 'shift' && T.sh) S.food.shift = { s: T.sh.s, l: T.sh.l, pre: T.sh.pre, at: Date.now() };
    if (a.k === 'bento') { S.food.bento = {}; for (var bk2 in T.bt) if (T.bt.hasOwnProperty(bk2)) S.food.bento[bk2] = T.bt[bk2]; }
    if (a.k === 'basket') { var BS = bkSum(a, T.bk), sel = []; for (var bi in T.bk) if (T.bk.hasOwnProperty(bi) && T.bk[bi]) sel.push(+bi); S.food.konbini = { sel: sel, t: BS.t, at: Date.now() }; }
    if (a.k === 'plan') { S.plan = { k: T.plan.k, days: T.plan.days.slice().sort(), slot: T.plan.slot, txt: T.plan.txt, at: Date.now() }; if (words(T.plan.txt) >= 10 && T.plan.txt !== T.tipUsed) ins = 1; }
    if (ins) S.ins[a.id] = 1;
    if (first) { S.done[a.id] = Date.now(); S.xp[a.id] = a.xp; }
    markDay(); save(true);
    var msg = first ? '<b>+' + a.xp + ' XP</b>' + (ins ? ' · +1 Insight' : '') + ' · Giỏi lắm, <b>' + esc(given()) + '</b>!' : (b.khu === 'bep' ? 'Đã lưu. Làm lại là cách nhớ lâu nhất!' : 'Đã lưu. Tập lại là cách nhớ lâu nhất!');
    PS.toast(msg);
    if (!wasDone && baiDone(b)) {
      go({ v: 'bai', id: b.id }, true);
      PS.dialog({ title: 'Có dấu mới!', html: '<div class="stampdlg">' + shin('party', 90, 'hop') + '<div class="stampdlg__s">' + ic(b.ic, 34) + '</div><p>' + TXT.baiDone.replace('[Bài]', esc(b.t)) + '</p><p class="ps-small">' + esc(khuById(b.khu).t) + ' · ' + baiCount(b.khu) + '/' + baisOf(b.khu).length + ' dấu</p></div>', buttons: [{ t: 'Tuyệt!', cls: 'ps-btn--go' }] });
    } else go({ v: 'bai', id: b.id }, true);
  }

  /* =========================================================
     BẾP DINH DƯỠNG: tiện ích, các dạng hoạt động mới
     plate (xếp đĩa) · meal (bữa hôm qua) · write (viết ra) · calc (máy tính) · hilo (cao hay thấp) · day (tìm việc chưa ổn) · commit (cam kết 21 ngày)
     ========================================================= */
  function num(v) { return parseFloat(String(v == null ? '' : v).replace(',', '.')) || 0; }
  function fmtK(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function fmtL(n) { return String(n).replace('.', ','); }
  function dayKeyFrom(st, i) { var d = new Date(st.getFullYear(), st.getMonth(), st.getDate() + i); return PS.dkey(d); }
  var BMI_LAB = ['Gầy', 'Bình thường', 'Thừa cân', 'Béo phì'];
  function calcRes(c) {
    if (!c) return null;
    var h = num(c.h), w = num(c.w), age = num(c.age);
    if (!(h >= 120 && h <= 220 && w >= 30 && w <= 200 && age >= 15 && age <= 70) || !(c.lv >= 0) || !c.sex) return null;
    var b = Math.round(w / (h * h / 1e4) * 10) / 10;
    var bmr = c.sex === 'nu' ? 9.247 * w + 3.098 * h - 4.330 * age + 447.593 : 13.397 * w + 4.799 * h - 5.677 * age + 88.362;
    return { bmi: b, li: b < 18.5 ? 0 : (b < 23 ? 1 : (b < 25 ? 2 : 3)), bmr: Math.round(bmr / 10) * 10, tdee: Math.round(bmr * ACT_LV[c.lv].f / 10) * 10, water: Math.round(w * 0.04 * 10) / 10 };
  }
  function foodByT(t) { for (var i = 0; i < MEAL_FOODS.length; i++) if (MEAL_FOODS[i].t === t) return MEAL_FOODS[i]; return null; }
  var ZN = { tb: 'tinh bột', dam: 'đạm', rau: 'rau', qs: 'trái cây, sữa' };
  function mealReport(M) {
    var lines = [], gaps = [], anyQs = false, warn = [], bad = 0;
    MEALS.forEach(function (ml) {
      var k = ml[0], nm = ml[1].toLowerCase(), g = {};
      if (M.skip[k]) { lines.push(MEAL_TXT.skipped.replace('[Bữa]', nm)); gaps.push({ k: k, nm: nm, skip: 1 }); bad++; return; }
      M[k].forEach(function (t) { var f = foodByT(t); if (!f) return; f.g.forEach(function (x) { g[x] = 1; }); if (f.w && warn.indexOf(t) < 0) warn.push(t); });
      if (g.qs) anyQs = true;
      var miss = ['tb', 'dam', 'rau'].filter(function (x) { return !g[x]; });
      if (miss.length) { lines.push(MEAL_TXT.miss.replace('[Bữa]', nm).replace('[Nhóm]', miss.map(function (x) { return ZN[x]; }).join(', '))); gaps.push({ k: k, nm: nm, miss: miss }); bad++; }
      else lines.push(MEAL_TXT.good.replace('[Bữa]', nm));
    });
    if (!anyQs) { lines.push(MEAL_TXT.noQs); gaps.push({ qs: 1 }); bad++; }
    if (warn.length) { lines.push(MEAL_TXT.warn.replace('[Món]', warn.map(function (t) { return t.toLowerCase(); }).join(', '))); }
    return { lines: lines, gaps: gaps, warn: warn, good: !bad };
  }
  function mealGroups(M, k) { var g = {}; M[k].forEach(function (t) { var f = foodByT(t); if (f) f.g.forEach(function (x) { g[x] = 1; }); }); return g; }
  function commitInfo() {
    var c = S.food && S.food.commit; if (!c) return null;
    var st = new Date(c.at); st = new Date(st.getFullYear(), st.getMonth(), st.getDate());
    var now = new Date(); now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var di = Math.round((now.getTime() - st.getTime()) / 864e5), n = 0, k;
    for (k in c.days) if (c.days.hasOwnProperty(k)) n++;
    return { c: c, st: st, di: di, n: Math.min(n, COMMIT_DAYS), todayOn: !!c.days[today()] };
  }
  function foodSum() {
    var f = S.food || {}, o = {}, I = commitInfo();
    if (f.meal) o.meal = mealReport(f.meal).lines.join(' ');
    if (f.calc) o.calc = { bmi: f.calc.bmi, tdee: f.calc.tdee, water: f.calc.water };
    if (I) o.commit = { h: I.c.h, txt: I.c.txt, days: I.n, start: PS.dkey(I.st) };
    if (f.shift) o.shift = hh(f.shift.s) + '–' + hh(f.shift.s + f.shift.l);
    if (f.bento) o.bento = bentoLine(f.bento);
    if (f.konbini) o.konbini = f.konbini.t;
    return o;
  }
  function commitCard() {
    var I = commitInfo(); if (!I) return '';
    var dots = '', i;
    for (i = 0; i < COMMIT_DAYS; i++) { var k = dayKeyFrom(I.st, i); dots += '<i class="' + (I.c.days[k] ? 'on' : (i < I.di ? 'miss' : (i === I.di ? 'cur' : ''))) + '" title="Ngày ' + (i + 1) + '"></i>'; }
    var over = I.di >= COMMIT_DAYS;
    return '<section class="cmt" aria-label="' + esc(BEP_TXT.commitCard) + '"><div class="cmt__top">' + ic('cal', 18) + '<b>' + esc(BEP_TXT.commitCard) + '</b><span>' + I.n + '/' + COMMIT_DAYS + ' ngày' + (over ? '' : ' · hôm nay ngày ' + (I.di + 1)) + '</span></div>' +
      '<p class="cmt__h">' + esc(I.c.h) + '</p><p class="cmt__t">' + esc(I.c.txt) + '</p><div class="cmt__dots">' + dots + '</div>' +
      (over ? '<p class="cmt__ok">' + (I.n >= 15 ? esc(BEP_TXT.commitEnd) : 'Hết 21 ngày: bạn giữ được ' + I.n + ' ngày. Bắt đầu vòng mới ở bài Lỗi ăn uống hay gặp nhé.') + '</p>' :
        (I.todayOn ? '<p class="cmt__ok">' + PS.icon('check', 15, 3) + esc(BEP_TXT.commitToday) + '</p>' : '<button type="button" class="btn btn--go btn--sm btn--w" data-act="cmtTick">' + PS.icon('check', 16, 3) + esc(BEP_TXT.commitBtn) + '</button>')) + '</section>';
  }
  function nbFood() {
    var f = S.food || {}, c = f.calc, h = '<div class="nbsec"><h3>Bếp của mình</h3>';
    if (c) h += '<ul class="kv"><li><span>BMI (tham khảo)</span><b>' + fmtL(c.bmi) + ' · ' + BMI_LAB[c.bmi < 18.5 ? 0 : (c.bmi < 23 ? 1 : (c.bmi < 25 ? 2 : 3))] + '</b></li><li><span>Năng lượng cả ngày</span><b>khoảng ' + fmtK(c.tdee) + ' kcal</b></li><li><span>Nước mỗi ngày</span><b>khoảng ' + fmtL(c.water) + ' lít</b></li></ul><p class="ps-small">Tính ngày ' + esc(dmy(c.at)) + '. Chỉ để tham khảo, so với chính mình.</p>';
    else h += '<p class="ps-small">Chưa tính. Làm ở Bếp › Năng lượng của mình.</p>';
    if (f.meal) h += '<p class="ps-small" style="margin-top:8px"><b>Bữa bạn ghi lại:</b> ' + esc(mealReport(f.meal).lines.join(' ')) + '</p>';
    if (f.shift) { var sp2 = shiftPlan(f.shift.s, f.shift.l); h += '<p class="ps-small" style="margin-top:8px"><b>Giờ ăn theo ca (' + hh(f.shift.s) + '–' + hh(f.shift.s + f.shift.l) + '):</b> ' + esc(sp2.map(function (p) { return hh(p.t) + ' ' + p.n.toLowerCase(); }).join(' · ')) + '</p>'; }
    if (f.bento) h += '<p class="ps-small"><b>Hộp cơm mang đi:</b> ' + esc(bentoLine(f.bento)) + '</p>';
    return h + '</div>' + commitCard();
  }

  /* ---------- xếp đĩa ---------- */
  function plateSVG(cnt, tot) {
    var Z = { rau: { d: 'M110 22A70 70 0 0 0 110 162Z', x: 72, y: 92, c: '#BFE0CB', n: 'Rau' }, tb: { d: 'M110 92L110 22A70 70 0 0 1 180 92Z', x: 141, y: 62, c: '#EADAB2', n: 'Tinh bột' },
      dam: { d: 'M110 92L180 92A70 70 0 0 1 110 162Z', x: 141, y: 126, c: '#F0C9BB', n: 'Đạm' } };
    function op(k) { return (0.28 + 0.72 * ((cnt[k] || 0) / (tot[k] || 1))).toFixed(2); }
    var h = '<svg class="plate" viewBox="0 0 260 184" role="img" aria-label="Đĩa ăn bốn nhóm"><circle cx="110" cy="92" r="84" fill="#fff" stroke="#DCE5DF" stroke-width="2"/><circle cx="110" cy="92" r="74" fill="#F7FAF8" stroke="#E6EEE9"/>';
    ['rau', 'tb', 'dam'].forEach(function (k) { var z = Z[k]; h += '<path d="' + z.d + '" fill="' + z.c + '" fill-opacity="' + op(k) + '" stroke="#fff" stroke-width="3" data-act="plZone" data-z="' + k + '" style="cursor:pointer"/>' +
      '<text x="' + z.x + '" y="' + z.y + '" text-anchor="middle" class="plate__t">' + z.n + '</text><text x="' + z.x + '" y="' + (z.y + 16) + '" text-anchor="middle" class="plate__n">' + (cnt[k] || 0) + '/' + tot[k] + '</text>'; });
    h += '<circle cx="222" cy="50" r="31" fill="#fff" stroke="#DCE5DF" stroke-width="2"/><circle cx="222" cy="50" r="25" fill="#F4D7B5" fill-opacity="' + op('qs') + '" data-act="plZone" data-z="qs" style="cursor:pointer"/>' +
      '<text x="222" y="46" text-anchor="middle" class="plate__t plate__t--s">Trái cây,</text><text x="222" y="58" text-anchor="middle" class="plate__t plate__t--s">sữa ' + (cnt.qs || 0) + '/' + tot.qs + '</text></svg>';
    return h;
  }
  function viewPlate(a) {
    var tot = {}, cnt = {}, names = {}, nP = 0;
    a.items.forEach(function (it, i) { tot[it.z] = (tot[it.z] || 0) + 1; if (T.placed[i]) { cnt[it.z] = (cnt[it.z] || 0) + 1; (names[it.z] = names[it.z] || []).push(it.t); nP++; } });
    var all = nP === a.items.length, ord = seedShuffle(a.items.map(function (x, i) { return i; }), a.id);
    return '<div class="card"><p class="q">' + esc(a.q) + '</p><p class="qsub">' + esc(a.sub) + '</p>' +
      (all ? '' : '<p class="pfl">' + (T.sel >= 0 ? 'Đã chọn <b>' + esc(a.items[T.sel].t) + '</b>. Giờ chạm nhóm của món này.' : 'Món ăn · đã xếp ' + nP + '/' + a.items.length) + '</p><div class="chips pfood">' +
        ord.filter(function (i) { return !T.placed[i]; }).map(function (i) { return '<button type="button" class="chip' + (T.sel === i ? ' on' : '') + '" data-act="plFood" data-i="' + i + '">' + esc(a.items[i].t) + '</button>'; }).join('') + '</div>') +
      (T.wrong ? '<div class="fb fb--no">' + esc(T.wrong) + '</div>' : '') +
      '<div class="platebox">' + plateSVG(cnt, tot) + '</div>' +
      '<div class="pzs">' + PLATE_Z.map(function (z) { return '<button type="button" class="pz pz--' + z.k + (T.sel >= 0 ? ' pz--ready' : '') + '" data-act="plZone" data-z="' + z.k + '"' + (all ? ' disabled' : '') + '><b>' + esc(z.n) + '</b><small>' + esc(names[z.k] ? names[z.k].join(', ') : z.d) + '</small></button>'; }).join('') + '</div></div>' +
      (all ? shinSays('cheer', esc(BEP_TXT.plateDone), 50) + '<button type="button" class="btn btn--go btn--w" data-act="finish">Hoàn thành</button>' : '');
  }

  /* ---------- bữa hôm qua ---------- */
  function mealAnswered(k) { return !!(T.meal.skip[k] || T.meal[k].length); }
  function viewMeal(a) {
    var M = T.meal;
    if (T.mres) {
      var R = mealReport(M), cols = ['tb', 'dam', 'rau', 'qs'], cl = ['Tinh bột', 'Đạm', 'Rau', 'Quả, sữa'];
      return '<div class="card"><p class="q">Bữa hôm qua của bạn</p><table class="mtab"><thead><tr><th></th>' + cl.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead><tbody>' +
        MEALS.map(function (ml) {
          if (M.skip[ml[0]]) return '<tr><th>' + ml[1] + '</th><td colspan="4" class="mtab__skip">Bỏ bữa</td></tr>';
          var g = mealGroups(M, ml[0]);
          return '<tr><th>' + ml[1] + '</th>' + cols.map(function (c) { return '<td><i class="' + (g[c] ? 'on' : '') + '" aria-label="' + (g[c] ? 'Có' : 'Chưa có') + '"></i></td>'; }).join('') + '</tr>';
        }).join('') + '</tbody></table></div>' +
        shinSays(R.good ? 'cheer' : 'encourage', (R.good ? esc(MEAL_TXT.allGood) + '<br>' : '') + R.lines.map(esc).join('<br>') + '<br><small class="ps-small">' + esc(MEAL_TXT.none) + '</small>', 50) +
        '<div class="btnrow"><button type="button" class="btn btn--soft" data-act="mBack">Sửa lại</button><button type="button" class="btn btn--go" data-act="finish">Hoàn thành</button></div>';
    }
    var k = MEALS[T.mtab][0], allA = mealAnswered('sang') && mealAnswered('trua') && mealAnswered('toi');
    return '<div class="card"><p class="q">' + esc(MEAL_TXT.q) + '</p><p class="qsub">' + esc(MEAL_TXT.sub) + '</p>' +
      '<div class="mtabs" role="tablist">' + MEALS.map(function (ml, i) { return '<button type="button" role="tab" class="mtabs__b' + (i === T.mtab ? ' on' : '') + '" data-act="mTab" data-i="' + i + '">' + ml[1] + (mealAnswered(ml[0]) ? PS.icon('check', 13, 3) : '') + '</button>'; }).join('') + '</div>' +
      '<div class="chips mfood">' + MEAL_FOODS.map(function (f) { var on = M[k].indexOf(f.t) >= 0; return '<button type="button" class="chip' + (on ? ' on' : '') + '" data-act="mFood" data-t="' + esc(f.t) + '">' + esc(f.t) + '</button>'; }).join('') +
      '<button type="button" class="chip chip--skip' + (M.skip[k] ? ' on' : '') + '" data-act="mSkip">' + esc(MEAL_TXT.skip) + '</button></div></div>' +
      (allA ? '<button type="button" class="btn btn--w" data-act="mSee">' + esc(MEAL_TXT.see) + '</button>' :
        '<button type="button" class="btn btn--w" data-act="mNext"' + (mealAnswered(k) && T.mtab < 2 ? '' : ' disabled') + '>' + (T.mtab < 2 ? 'Bữa tiếp theo' : 'Chọn đủ 3 bữa để xem') + '</button>');
  }

  /* ---------- viết ra ---------- */
  function writeTips(a) {
    var tips = [], f = S.food.meal;
    if (f) {
      var R = mealReport(f);
      R.gaps.forEach(function (g) {
        if (g.skip && g.k === 'sang') tips.push('Sáng mai mình sẽ dậy sớm 10 phút để ăn sáng');
        else if (g.skip) tips.push('Mai mình sẽ không bỏ bữa ' + g.nm + ', ăn ít cũng được');
        else if (g.miss && g.miss.indexOf('dam') >= 0) tips.push('Bữa ' + g.nm + ' mai mình sẽ ăn thêm một quả trứng hoặc đậu phụ');
        else if (g.miss && g.miss.indexOf('rau') >= 0) tips.push('Bữa ' + g.nm + ' mai mình sẽ thêm một đĩa rau luộc');
        else if (g.miss && g.miss.indexOf('tb') >= 0) tips.push('Bữa ' + g.nm + ' mai mình sẽ ăn đủ cơm hoặc bánh mì');
        else if (g.qs) tips.push('Mai mình sẽ ăn một quả chuối hoặc hộp sữa chua');
      });
      if (R.warn.indexOf('Nước ngọt, trà sữa') >= 0) tips.push('Mai mình sẽ uống nước lọc thay cho nước ngọt, trà sữa');
      else if (R.warn.indexOf('Mì gói') >= 0) tips.push('Mai mình sẽ ăn cơm có rau thay cho mì gói');
    }
    a.tips.forEach(function (t) { if (tips.indexOf(t) < 0) tips.push(t); });
    return tips.slice(0, 3);
  }
  function viewWrite(a) {
    return shinSays('encourage', esc(a.say), 50) + writeBox(a.q, a.sub, writeTips(a)) +
      '<button type="button" class="btn btn--go btn--w" data-act="finish" id="wDone"' + (words(T.txt) >= 3 ? '' : ' disabled') + '>Lưu và hoàn thành</button>';
  }

  /* ---------- máy tính ---------- */
  function calcResHTML() {
    var r = calcRes(T.c);
    if (!r) return '<p class="ps-small calc__wait">Nhập đủ số và chọn mức vận động, Shin tính ngay.</p>';
    return '<div class="ctiles"><div class="ct"><small>BMI</small><b>' + fmtL(r.bmi) + '</b><span>' + BMI_LAB[r.li] + '</span></div>' +
      '<div class="ct"><small>Năng lượng khi nghỉ</small><b>' + fmtK(r.bmr) + '</b><span>kcal/ngày</span></div>' +
      '<div class="ct ct--main"><small>Năng lượng cả ngày</small><b>' + fmtK(r.tdee) + '</b><span>kcal/ngày, theo mức vận động</span></div>' +
      '<div class="ct ct--water"><small>' + ic('drop', 13) + ' Nước</small><b>' + fmtL(r.water) + '</b><span>lít/ngày (cân nặng × 0,04)</span></div></div>' +
      shinSays(r.li === 1 ? 'cheer' : 'encourage', esc(BEP_TXT.bmiSay[r.li]), 46) +
      '<ul class="calc__notes"><li>' + esc(BEP_TXT.bmiNote) + '</li><li>' + esc(BEP_TXT.waterNote) + '</li><li><b>' + esc(BEP_TXT.calcNote) + '</b></li></ul>' +
      '<p class="ps-small">Công thức BMR, mức vận động, ngưỡng BMI: Sổ quản lý học tập GDTC. Số làm tròn, chỉ để tham khảo.</p>';
  }
  function viewCalc(a) {
    var c = T.c;
    return '<div class="card"><p class="q">' + esc(BEP_TXT.calcQ) + '</p><p class="qsub">' + esc(BEP_TXT.calcSub) + '</p>' +
      '<div class="calc3"><label>Chiều cao (cm)<input class="inp" id="cH" inputmode="numeric" maxlength="3" value="' + esc(c.h) + '"></label><label>Cân nặng (kg)<input class="inp" id="cW" inputmode="decimal" maxlength="5" value="' + esc(c.w) + '"></label><label>Tuổi<input class="inp" id="cA" inputmode="numeric" maxlength="2" value="' + esc(c.age) + '"></label></div>' +
      '<p class="qsub" style="margin:10px 0 6px">Công thức tính khác nhau cho nam và nữ</p><div class="chips">' + [['nam', 'Nam'], ['nu', 'Nữ']].map(function (o) { return '<button type="button" class="chip' + (c.sex === o[0] ? ' on' : '') + '" data-act="cSex" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="card"><p class="q">' + esc(BEP_TXT.calcLv) + '</p><div class="opts">' + ACT_LV.map(function (L, i) { var on = c.lv === i; return '<button type="button" class="opt' + (on ? ' on' : '') + '" data-act="cLv" data-i="' + i + '"><span class="dot">' + (on ? PS.icon('check', 13, 3) : '') + '</span>' + esc(L.n) + '</button>'; }).join('') + '</div></div>' +
      '<div class="card" id="cRes">' + calcResHTML() + '</div>' +
      '<button type="button" class="btn btn--go btn--w" data-act="finish" id="cDoneB"' + (calcRes(c) ? '' : ' disabled') + '>Lưu kết quả</button>';
  }
  function syncCalc() {
    if (!T.c) return;
    var h = $('#cH'), w = $('#cW'), ag = $('#cA');
    if (h) T.c.h = h.value.replace(/[^\d]/g, ''); if (w) T.c.w = w.value.replace(/[^\d.,]/g, ''); if (ag) T.c.age = ag.value.replace(/[^\d]/g, '');
    var r = $('#cRes'); if (r) r.innerHTML = calcResHTML();
    var d = $('#cDoneB'); if (d) d.disabled = !calcRes(T.c);
  }

  /* ---------- cao hay thấp ---------- */
  function viewHilo(a) {
    var P = a.pairs[T.round], flip = seedShuffle([0, 1], a.id + T.round)[0] === 1, o = flip ? [[P.b, 0], [P.a, 1]] : [[P.a, 1], [P.b, 0]];
    var st = T.hp[T.round] || {}, solved = !!st.ok, tried = false, last = T.round >= a.pairs.length - 1;
    o.forEach(function (x, i) { if (st[i] && !x[1]) tried = true; });
    return '<div class="stepbar">' + a.pairs.map(function (r, j) { return '<i class="' + (j < T.round ? 'on' : (j === T.round ? 'cur' : '')) + '"></i>'; }).join('') + '</div>' +
      '<div class="card"><p class="q">' + esc(BEP_TXT.hiloQ) + '</p><p class="qsub">Cặp ' + (T.round + 1) + '/' + a.pairs.length + '</p><div class="hilo">' +
      o.map(function (x, i) { var ch = st[i]; return '<button type="button" class="hl' + (ch ? (x[1] ? ' hl--ok' : ' hl--no') : '') + (solved ? ' hl--show' : '') + '" data-act="hilo" data-i="' + i + '" data-hi="' + x[1] + '"' + (solved || ch ? ' disabled' : '') + '><b>' + esc(x[0][0]) + '</b><small>100 g</small>' + (solved || ch ? '<span class="hl__k">' + fmtK(x[0][1]) + ' kcal</span>' : '') + '</button>'; }).join('<span class="hilo__vs">hay</span>') + '</div></div>' +
      (solved ? '<div class="fb fb--ok"><b>Đúng rồi!</b> ' + esc(P.why) + '</div>' + (last ? shinSays('think', esc(BEP_TXT.hiloEnd), 46) + '<p class="ps-small">' + esc(BEP_TXT.hiloSrc) + '</p><button type="button" class="btn btn--go btn--w" data-act="finish">Hoàn thành</button>' : '<button type="button" class="btn btn--w" data-act="hiloNext">Cặp tiếp theo</button>') :
        (tried ? '<div class="fb fb--no"><b>Thử lại nhé.</b> Món này nhẹ hơn. Chạm món còn lại.</div>' : ''));
  }

  /* ---------- tìm việc chưa ổn trong một ngày ---------- */
  function viewDay(a) {
    var nErr = 0, nF = 0; a.items.forEach(function (it, i) { if (it.err) { nErr++; if (T.found[i]) nF++; } });
    var all = nF === nErr, hint = T.miss >= 2 && !all, show = T.miss >= 4 && !all;
    return '<div class="card"><p class="qsub">' + esc(BEP_TXT.dayIntro) + '</p><p class="q">Tìm được ' + nF + '/' + nErr + ' việc chưa ổn</p><ol class="dayl">' +
      a.items.map(function (it, i) {
        var f = T.found[i] || (show && it.err), okT = T.okTap[i] && !it.err;
        return '<li><button type="button" class="dl' + (f ? ' dl--err' : '') + (okT ? ' dl--ok' : '') + (hint && it.err && !f ? ' dl--hint' : '') + '" data-act="dayTap" data-i="' + i + '"' + (f || okT ? ' aria-pressed="true"' : '') + '><span class="dl__h">' + esc(it.h) + '</span><span class="dl__b"><span class="dl__t">' + esc(it.t) + '</span>' +
          (f ? '<span class="dl__n">' + PS.icon('close', 13, 3) + esc(it.n) + '</span><small>' + esc(it.why) + '</small>' : '') + (okT ? '<small class="dl__ok">' + esc(BEP_TXT.dayOk + it.ok) + '</small>' : '') + '</span></button></li>';
      }).join('') + '</ol>' + (hint && !show ? '<p class="hintl">' + ic('bulb', 15) + esc(BEP_TXT.dayHint) + '</p>' : '') + '</div>' +
      (all || show ? '<button type="button" class="btn btn--go btn--w" data-act="finish">Hoàn thành</button>' : (T.miss >= 3 ? '<button type="button" class="link" data-act="dayShow">Xem đáp án</button>' : ''));
  }

  /* ---------- cam kết 21 ngày ---------- */
  function viewCommit(a) {
    var own = T.hab === HABITS.length, tip = T.hab >= 0 && !own ? [HABITS[T.hab].tip] : ['Khi …, mình sẽ …'];
    if (own) tip = [];
    return commitCard() + shinSays('encourage', esc(BEP_TXT.commitSay), 50) +
      '<div class="card"><p class="q">' + esc(BEP_TXT.commitQ) + '</p><div class="opts">' + HABITS.map(function (x, i) { var on = T.hab === i; return '<button type="button" class="opt' + (on ? ' on' : '') + '" data-act="cHab" data-i="' + i + '"><span class="dot">' + (on ? PS.icon('check', 13, 3) : '') + '</span>' + esc(x.t) + '</button>'; }).join('') +
      '<button type="button" class="opt' + (own ? ' on' : '') + '" data-act="cHab" data-i="' + HABITS.length + '"><span class="dot">' + (own ? PS.icon('check', 13, 3) : '') + '</span>' + esc(BEP_TXT.commitOwn) + '</button></div>' +
      (S.food.commit && T.hab >= 0 && (T.hab < HABITS.length ? HABITS[T.hab].t : T.own) !== S.food.commit.h ? '<p class="qsub" style="margin:10px 0 0">Chọn thói quen khác sẽ bắt đầu lại 21 ngày.</p>' : '') +
      (own ? '<input class="inp" id="cOwn" maxlength="80" placeholder="Ví dụ: Ăn chậm, không xem điện thoại khi ăn" value="' + esc(T.own) + '" style="margin-top:10px">' : '') + '</div>' +
      (T.hab >= 0 ? writeBox(BEP_TXT.commitW, BEP_TXT.commitSub, T.hab < HABITS.length ? tip : []) +
        '<button type="button" class="btn btn--go btn--w" data-act="finish" id="wDone"' + (words(T.txt) >= 3 ? '' : ' disabled') + '>' + ic('cal', 18) + 'Bắt đầu 21 ngày</button>' +
        '<p class="ps-small" style="text-align:center">Mỗi ngày làm được, chạm “' + esc(BEP_TXT.commitBtn) + '” ở khu Bếp hoặc Sổ tay.</p>' : '');
  }

  /* =========================================================
     BẾP ĐỢT 2 (TC01.0.4): match (ghép cặp) · basket (giỏ konbini) · label (đọc nhãn) · shift (giờ ăn theo ca) · bento (hộp cơm) · date (hạn dùng)
     ========================================================= */
  function idxs(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  function zName(k) { for (var i = 0; i < PLATE_Z.length; i++) if (PLATE_Z[i].k === k) return PLATE_Z[i].n; return k; }
  function jpName(x) { var rd = x.k ? x.k + (x.r ? ' · ' + x.r : '') : (x.r || ''); return '<span class="jp">' + esc(x.j) + '</span>' + (rd ? '<small class="jpr">' + esc(rd) + '</small>' : ''); }

  /* ---------- ghép cặp món Việt – món Nhật ---------- */
  function viewMatch(a) {
    var n = a.pairs.length, nd = 0, i; for (i = 0; i < n; i++) if (T.mm[i]) nd++;
    var all = nd === n, L = seedShuffle(idxs(n), a.id + 'v'), R = seedShuffle(idxs(n), a.id + 'j'), last = T.mlast >= 0 ? a.pairs[T.mlast] : null;
    return '<div class="card"><p class="q">' + esc(a.q) + '</p><p class="qsub">' + esc(a.sub) + ' Đã ghép ' + nd + '/' + n + '.</p><div class="mt"><div class="mt__col">' +
      L.map(function (i) { var d = T.mm[i]; return '<button type="button" class="mt__b' + (d ? ' mt__b--ok' : '') + (T.ms === i ? ' on' : '') + '" data-act="mtV" data-i="' + i + '"' + (d ? ' disabled' : '') + '><b>' + esc(a.pairs[i].v) + '</b></button>'; }).join('') +
      '</div><div class="mt__col">' +
      R.map(function (i) { var d = T.mm[i]; return '<button type="button" class="mt__b mt__b--j' + (d ? ' mt__b--ok' : '') + (T.mw === i ? ' mt__b--no' : '') + (T.ms >= 0 && !d ? ' mt__b--ready' : '') + '" data-act="mtJ" data-i="' + i + '"' + (d ? ' disabled' : '') + '>' + jpName(a.pairs[i]) + '</button>'; }).join('') +
      '</div></div>' + (T.ms >= 0 ? '<p class="pfl">' + BEP2_TXT.matchSel.replace('[Món]', '<b>' + esc(a.pairs[T.ms].v) + '</b>') + '</p>' : '') + '</div>' +
      (T.mw >= 0 ? '<div class="fb fb--no">' + esc(BEP2_TXT.matchNo) + '</div>' : (last ? '<div class="fb fb--ok"><b>Đúng rồi!</b> ' + esc(last.v) + ' ≈ <span class="jp">' + esc(last.j) + '</span>. ' + esc(last.why) + '</div>' : '')) +
      (all ? shinSays('cheer', esc(BEP2_TXT.matchEnd), 50) + '<button type="button" class="btn btn--go btn--w" data-act="finish">Hoàn thành</button>' : '');
  }

  /* ---------- giỏ konbini ---------- */
  function bkSum(a, sel) {
    var t = 0, g = {}, w = [], names = [];
    a.items.forEach(function (it, i) { if (sel[i]) { t += it.p; names.push(it.v); it.g.forEach(function (x) { g[x] = 1; }); if (it.w) w.push(it.w); } });
    var miss = ['tb', 'dam', 'rau'].filter(function (x) { return !g[x]; });
    return { t: t, g: g, w: w, names: names, miss: miss, ok: !miss.length && t > 0 && t <= a.budget };
  }
  function viewBasket(a) {
    var B = bkSum(a, T.bk), over = B.t - a.budget, pct = Math.min(100, Math.round(B.t / a.budget * 100));
    var msg = '';
    if (over > 0) msg = '<div class="fb fb--no"><b>Thử lại nhé.</b> ' + esc(BEP2_TXT.bkOver.replace('[N]', over)) + '</div>';
    else if (B.t && B.miss.length) msg = '<p class="pfl bk__need">' + esc(BEP2_TXT.bkNeed.replace('[Nhóm]', B.miss.map(function (k) { return ZN[k]; }).join(', '))) + '</p>';
    return '<div class="card"><p class="q">' + esc(a.q) + '</p><p class="qsub">' + esc(a.sub) + '</p>' +
      '<div class="bk__top"><div class="bk__bar' + (over > 0 ? ' bk__bar--over' : '') + '"><i style="width:' + pct + '%"></i></div>' +
      '<div class="bk__sum"><span>' + esc(BEP2_TXT.bkTotal) + ' <b>' + fmtK(B.t) + ' yên</b></span><span>' + (over > 0 ? '' : esc(BEP2_TXT.bkLeft) + ' <b>' + fmtK(a.budget - B.t) + ' yên</b>') + '</span></div>' +
      '<div class="bk__g">' + ['tb', 'dam', 'rau'].map(function (k) { return '<span class="bk__p' + (B.g[k] ? ' on' : '') + '">' + (B.g[k] ? PS.icon('check', 12, 3) : '') + esc(zName(k)) + '</span>'; }).join('') + '</div></div>' +
      '<div class="bk">' + a.items.map(function (it, i) { var on = !!T.bk[i]; return '<button type="button" class="bk__i' + (on ? ' on' : '') + '" data-act="bkI" data-i="' + i + '" aria-pressed="' + on + '"><span class="bk__j jp">' + esc(it.j) + '</span>' + (it.k ? '<small class="jpr">' + esc(it.k) + '</small>' : '') + '<b>' + esc(it.v) + '</b><span class="bk__pr">' + it.p + ' yên</span>' + (on ? '<span class="bk__ck">' + PS.icon('check', 12, 3) + '</span>' : '') + '</button>'; }).join('') + '</div></div>' +
      msg + (B.ok ? shinSays('cheer', esc(BEP2_TXT.bkDone.replace('[N]', fmtK(a.budget - B.t))) + (B.w.length ? '<br><small>' + esc(B.w.join(' ')) + '</small>' : ''), 50) +
        '<div class="card bk__money">' + ic('bowl', 18) + '<p>' + esc(BEP2_TXT.bkMoney.replace('[T]', fmtK(B.t)).replace('[D]', a.days).replace('[M]', fmtK(B.t * a.days))) + '</p></div>' +
        '<button type="button" class="btn btn--go btn--w" data-act="finish">Hoàn thành</button>' : '');
  }

  /* ---------- đọc nhãn 栄養成分表示 ---------- */
  function viewLabel(a) {
    var R = a.rounds[T.round], okK = String(R.ok), solved = !!T.lk[T.round], last = T.round >= a.rounds.length - 1;
    function row(key, j, rd, n, v, cls) {
      var isOk = solved && key === okK, isW = !solved && T.lw === key, seen = T.lseen[key];
      return '<button type="button" class="lb__r' + (cls ? ' ' + cls : '') + (isOk ? ' lb__r--ok' : '') + (isW ? ' lb__r--no' : '') + '" data-act="lbR" data-k="' + key + '"' + (solved ? ' disabled' : '') + '><span class="lb__j"><span class="jp">' + esc(j) + '</span>' + (rd ? '<small class="jpr">' + esc(rd) + '</small>' : '') + (seen ? '<small class="lb__v">' + esc(v) + '</small>' : '') + '</span>' + (n ? '<span class="lb__n">' + esc(n) + '</span>' : '') + '</button>';
    }
    var wv = '';
    if (!solved && T.lw !== '') wv = T.lw === 'p' ? a.perV : a.rows[+T.lw].v;
    return '<div class="stepbar">' + a.rounds.map(function (r, j) { return '<i class="' + (j < T.round ? 'on' : (j === T.round ? 'cur' : '')) + '"></i>'; }).join('') + '</div>' +
      '<div class="card"><p class="q">' + esc(R.q) + '</p><p class="qsub">Nhãn trên ' + esc(a.prodV) + ' <span class="jp">' + esc(a.prod) + '</span></p>' +
      '<div class="lb"><div class="lb__h"><span class="jp">栄養成分表示</span><small class="jpr">えいようせいぶんひょうじ · ' + esc(BEP2_TXT.lbHead) + '</small></div>' +
      row('p', a.per, '', '', a.perV, 'lb__r--per') + a.rows.map(function (r, i) { return row(String(i), r.j, r.r, r.n, r.v); }).join('') + '</div>' +
      '<p class="ps-small">' + esc(BEP2_TXT.lbSrc) + '</p></div>' +
      (solved ? '<div class="fb fb--ok"><b>Đúng rồi!</b> ' + esc(R.why) + '</div>' + (last ? shinSays('cheer', esc(BEP2_TXT.lbEnd), 48) + '<button type="button" class="btn btn--go btn--w" data-act="finish">Hoàn thành</button>' : '<button type="button" class="btn btn--w" data-act="lbNext">Câu tiếp theo</button>') :
        (wv ? '<div class="fb fb--no"><b>Thử lại nhé.</b> ' + esc(BEP2_TXT.lbNo.replace('Thử lại nhé. ', '')) + '<b>' + esc(wv) + '</b>.</div>' : ''));
  }

  /* ---------- giờ ăn theo ca ---------- */
  function hh(x) { x = ((x % 24) + 24) % 24; var h = Math.floor(x), m = Math.round((x - h) * 60); return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; }
  function mod24(x) { return ((x % 24) + 24) % 24; }
  function shiftPlan(s, l) {
    var out = [], e = s + l, eh = mod24(e);
    out.push({ t: s - 1, n: BEP2_TXT.shBefore, d: BEP2_TXT.shBeforeD, main: 1 });
    if (l >= 5) {
      var mid = s + Math.round(l / 2), mh = mod24(mid), main = l >= 8 && ((mh >= 11 && mh <= 14) || (mh >= 17 && mh <= 20));
      out.push({ t: mid, n: main ? BEP2_TXT.shMidMain : BEP2_TXT.shMidLight, d: BEP2_TXT.shMidD, main: main ? 1 : 0 });
    }
    if (eh >= 17 && eh <= 20) out.push({ t: e + 0.5, n: BEP2_TXT.shAfterMain, d: BEP2_TXT.shAfterDM, main: 1 });
    else if (eh >= 21 || eh <= 9) out.push({ t: e + 0.5, n: BEP2_TXT.shAfterLight, d: BEP2_TXT.shAfterD, main: 0 });
    else out.push({ t: e + 0.5, n: 'Sau ca: ăn nhẹ nếu đói', d: 'Bữa tối vẫn ăn đủ, đúng giờ.', main: 0 });
    return out;
  }
  function shiftBar(s, l, plan) {
    var segs = [], e = s + l;
    if (e <= 24) segs.push([s, l]); else { segs.push([s, 24 - s]); segs.push([0, e - 24]); }
    return '<div class="sh__bar" aria-hidden="true">' + segs.map(function (g) { return '<i class="sh__ca" style="left:' + (g[0] / 24 * 100) + '%;width:' + (g[1] / 24 * 100) + '%"></i>'; }).join('') +
      plan.map(function (p) { return '<b class="sh__m' + (p.main ? '' : ' sh__m--l') + '" style="left:' + (mod24(p.t) / 24 * 100) + '%"></b>'; }).join('') + '</div>' +
      '<div class="sh__ax"><span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>24h</span></div>';
  }
  function viewShift(a) {
    var H = T.sh, plan = H ? shiftPlan(H.s, H.l) : null;
    return '<div class="card"><p class="q">' + esc(BEP2_TXT.shQ) + '</p><p class="qsub">' + esc(BEP2_TXT.shSub) + '</p><div class="chips">' +
      SHIFTS.map(function (x, i) { return '<button type="button" class="chip' + (H && H.pre === i ? ' on' : '') + '" data-act="shPre" data-i="' + i + '">' + esc(x.n) + ' <small>' + hh(x.s).slice(0, 2) + '–' + hh(x.s + x.l).slice(0, 2) + 'h</small></button>'; }).join('') + '</div>' +
      (H ? '<div class="sh__st"><div><small>Bắt đầu</small><span class="sh__ctl"><button type="button" class="sh__pm" data-act="shS" data-d="-1" aria-label="Sớm hơn 1 giờ">−</button><b>' + hh(H.s) + '</b><button type="button" class="sh__pm" data-act="shS" data-d="1" aria-label="Muộn hơn 1 giờ">+</button></span></div>' +
        '<div><small>Số giờ</small><span class="sh__ctl"><button type="button" class="sh__pm" data-act="shL" data-d="-1" aria-label="Bớt 1 giờ">−</button><b>' + H.l + ' giờ</b><button type="button" class="sh__pm" data-act="shL" data-d="1" aria-label="Thêm 1 giờ">+</button></span></div></div>' +
        '<p class="ps-small sh__end">Kết thúc lúc <b>' + hh(H.s + H.l) + '</b>' + (H.s + H.l > 24 ? ' (sáng hôm sau)' : '') + '</p>' : '') + '</div>' +
      (H ? '<div class="card"><p class="q">Giờ ăn của bạn</p>' + shiftBar(H.s, H.l, plan) +
        '<ol class="sh__l">' + plan.map(function (p) { return '<li class="' + (p.main ? '' : 'lt') + '"><span class="sh__t">' + hh(p.t) + '</span><span><b>' + esc(p.n) + '</b><small>' + esc(p.d) + '</small></span></li>'; }).join('') +
        '<li class="wt"><span class="sh__t">' + ic('drop', 16) + '</span><span><b>' + esc(BEP2_TXT.shWater) + '</b>' + (H.l < 5 ? '<small>' + esc(BEP2_TXT.shShort) + '</small>' : '') + '</span></li></ol></div>' +
        shinSays('think', esc(BEP2_TXT.shSay), 46) + '<button type="button" class="btn btn--go btn--w" data-act="finish">Lưu giờ ăn của mình</button>' : '');
  }

  /* ---------- hộp cơm mang đi ---------- */
  function bentoBox(a) {
    return '<div class="bento">' + a.slots.map(function (s) { var i = T.bt[s.k], has = i >= 0; return '<div class="bento__c bento__c--' + s.k + (has ? ' on' : '') + '"><small>' + esc(s.n) + '</small>' + (has ? '<b>' + esc(s.opts[i].t) + '</b>' : '<b class="bento__e">…</b>') + '</div>'; }).join('') + '</div>';
  }
  function viewBento(a) {
    var nOk = 0; a.slots.forEach(function (s) { if (T.bt[s.k] >= 0) nOk++; });
    var all = nOk === a.slots.length, g = grp(), gt = BAI_BY.d5 && BAI_BY.d5.gtip ? BAI_BY.d5.gtip[g] : '';
    return '<div class="card"><p class="q">' + esc(a.q) + '</p><p class="qsub">' + esc(a.sub) + '</p>' + bentoBox(a) + '</div>' +
      a.slots.map(function (s) {
        var ord = seedShuffle(idxs(s.opts.length), a.id + s.k), bw = T.bw && T.bw.k === s.k ? T.bw.i : -1;
        return '<div class="card bt__s"><p class="bt__q"><i class="bt__dot bt__dot--' + s.k + '"></i>' + esc(s.n) + (T.bt[s.k] >= 0 ? '<span class="bt__ok">' + PS.icon('check', 14, 3) + '</span>' : '') + '</p><div class="chips">' +
          ord.map(function (i) { var o = s.opts[i]; return '<button type="button" class="chip' + (T.bt[s.k] === i ? ' on' : '') + (bw === i ? ' chip--no' : '') + '" data-act="btO" data-k="' + s.k + '" data-i="' + i + '">' + esc(o.t) + '</button>'; }).join('') + '</div>' +
          (bw >= 0 ? '<div class="fb fb--no"><b>Thử lại nhé.</b> ' + esc(s.opts[bw].no) + '</div>' : '') + '</div>';
      }).join('') +
      (all ? shinSays('cheer', esc(BEP2_TXT.btEnd), 50) + '<div class="card"><ol class="bt__safe">' + a.safe.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' +
        (gt && GROUPS[g] ? '<div class="gtip"><span class="gtip__ic">' + ic(GROUPS[g].ic, 20) + '</span><div><small>Với nhóm ' + esc(GROUPS[g].n) + '</small>' + esc(gt) + '</div></div>' : '') + '</div>' +
        '<button type="button" class="btn btn--go btn--w" data-act="finish">Hoàn thành</button>' : '');
  }
  function bentoLine(b) { var a = actById('d5c'); if (!b || !a) return ''; var L = []; a.slots.forEach(function (s) { if (b[s.k] >= 0 && s.opts[b[s.k]]) L.push(s.opts[b[s.k]].t); }); return L.join(', '); }

  /* ---------- hạn dùng 消費期限 / 賞味期限 ---------- */
  function viewDate(a) {
    var it = a.items[T.round], L = DATE_LAB[it.lab], P = T.pick, solved = P >= 0 && (P === it.ok), last = T.round >= a.items.length - 1;
    var hint = it.note ? BEP2_TXT.dtHint.note : BEP2_TXT.dtHint[it.lab];
    return '<div class="card dt__intro"><p class="q">' + esc(BEP2_TXT.dtIntro) + '</p><div class="dt2">' +
      ['shohi', 'shomi'].map(function (k) { var D = DATE_LAB[k]; return '<div class="dt2__b dt2__b--' + k + '"><span class="jp">' + esc(D.j) + '</span><small class="jpr">' + esc(D.k) + '</small><b>' + esc(D.n) + '</b><small>' + esc(D.d) + '</small></div>'; }).join('') +
      '</div><p class="ps-small">' + esc(BEP2_TXT.dtFmt) + '</p></div>' +
      '<div class="stepbar">' + a.items.map(function (r, j) { return '<i class="' + (j < T.round ? 'on' : (j === T.round ? 'cur' : '')) + '"></i>'; }).join('') + '</div>' +
      '<div class="card"><p class="qsub">' + ic('cal', 14) + ' ' + esc(BEP2_TXT.dtToday) + ' <b>' + esc(a.todayV) + '</b> (<span class="jp">' + esc(a.today) + '</span>)</p>' +
      '<div class="pk"><div class="pk__n">' + jpName(it) + '<b>' + esc(it.v) + '</b></div><div class="pk__lab"><span class="jp">' + esc(L.j) + '</span><b class="pk__d">' + esc(it.d) + '</b></div>' +
      (it.note ? '<p class="pk__note">' + ic('alert', 14) + esc(it.note) + '</p>' : '') + '</div>' +
      '<div class="dt__btns">' + [[1, BEP2_TXT.dtYes], [0, BEP2_TXT.dtNo]].map(function (o) { var on = P === o[0]; return '<button type="button" class="opt' + (on ? (o[0] === it.ok ? ' opt--ok' : ' opt--no') : '') + '" data-act="dtP" data-v="' + o[0] + '"' + (solved ? ' disabled' : '') + '><span class="dot">' + (on ? PS.icon(o[0] === it.ok ? 'check' : 'close', 13, 3) : '') + '</span>' + esc(o[1]) + '</button>'; }).join('') + '</div></div>' +
      (solved ? '<div class="fb fb--ok"><b>Đúng rồi!</b> ' + esc(it.why) + '</div>' + (last ? shinSays('think', esc(BEP2_TXT.dtEnd), 46) + '<button type="button" class="btn btn--go btn--w" data-act="finish">Hoàn thành</button>' : '<button type="button" class="btn btn--w" data-act="dtNext">Món tiếp theo</button>') :
        (P >= 0 ? '<div class="fb fb--no"><b>Thử lại nhé.</b> ' + esc(hint) + '</div>' : ''));
  }

  /* =========================================================
     SỔ TAY: Tổng quan | Thẻ hội viên | Cài đặt
     ========================================================= */
  var nbOpen = false, TAB = 'tq';
  function nbOverview() {
    var m = S.mem || {};
    var CI = commitInfo();
    return '<div class="tiles"><div class="tl">' + ic('stamp', 16) + '<b>' + baiCount('san') + '/' + BAI.length + '</b><small>Dấu Sàn tập</small></div><div class="tl">' + ic('bowl', 16) + '<b>' + baiCount('bep') + '/' + BAI_BEP.length + '</b><small>Dấu Bếp dinh dưỡng</small></div>' +
      '<div class="tl">' + PS.icon('check', 16) + '<b>' + doneCount() + '/' + ALLACTS.length + '</b><small>Hoạt động</small></div><div class="tl">' + ic('cal', 16) + '<b>' + (CI ? CI.n + '/' + COMMIT_DAYS : '—') + '</b><small>Ngày giữ cam kết</small></div>' +
      '<div class="tl tl--xp">' + PS.icon('star', 16) + '<b>' + xpTotal() + '</b><small>XP</small></div><div class="tl tl--ins">' + PS.icon('bulb', 16) + '<b>' + insTotal() + '</b><small>Insight</small></div>' +
      '<div class="tl tl--fire">' + PS.icon('flame', 16) + '<b>' + (IS_DEMO ? 5 : PS.streak()) + '</b><small>Chuỗi ngày (chung)</small></div><div class="tl">' + ic('timer', 16) + '<b>' + tryCount() + '</b><small>Lần tập thử</small></div></div>' +
      '<div class="nbsec"><h3>Mục tiêu của bạn</h3><p class="goal">' + esc(m.goal || 'Chưa viết') + '</p><button type="button" class="btn btn--soft btn--sm" data-act="editMem">' + ic('pen', 15) + 'Sửa thẻ hội viên</button></div>' +
      '<p class="ps-small">Tổng XP của mọi khóa: <b>' + PS.totals().xp + '</b> (xem ở trang chính).</p>';
  }
  function nbCard() {
    var m = S.mem || {}, rec = [], k;
    for (k in EX) if (EX.hasOwnProperty(k) && best(k)) rec.push('<li><span>' + esc(EX[k].n) + '</span><b>' + (MOC[k] && MOC[k].u === 's' ? fmtT(best(k)) : best(k) + ' cái') + '</b></li>');
    var notes = []; ALLACTS.forEach(function (a) { if (S.refl[a.id]) notes.push('<li><small>' + esc(BAI_BY[a.bai].t) + '</small>' + esc(S.refl[a.id]) + '</li>'); });
    return memCard(true) +
      '<div class="nbsec"><h3>Thông tin tập luyện</h3><ul class="kv"><li><span>Nghề</span><b>' + esc(jobName()) + '</b></li><li><span>Nhóm</span><b>' + esc(grpName(m.g)) + (m.g2 && GROUPS[m.g2] ? ' + ' + esc(GROUPS[m.g2].n) : '') + '</b></li><li><span>Mốc thể lực</span><b>' + (m.sex === 'nu' ? 'Nữ' : 'Nam') + '</b></li>' +
      (bmi(m.h, m.w) ? '<li><span>BMI (tham khảo)</span><b>' + bmi(m.h, m.w) + '</b></li>' : '') + '<li><span>Chấn thương cũ</span><b>' + (m.inj ? 'Có · tập nhẹ, hỏi thầy cô' : 'Không') + '</b></li></ul>' +
      '<button type="button" class="btn btn--soft btn--sm" data-act="editMem">' + ic('pen', 15) + 'Sửa thẻ hội viên</button></div>' +
      '<div class="nbsec"><h3>Lịch tập của mình</h3>' + (S.plan ? '<p><b>' + esc(planLine(S.plan)) + '</b></p><p class="goal">' + esc(S.plan.txt) + '</p>' : '<p class="ps-small">Chưa có. Làm ở Sàn tập › Giãn cơ và lịch tập.</p>') + '</div>' +
      '<div class="nbsec"><h3>Kỷ lục cá nhân</h3>' + (rec.length ? '<ul class="kv">' + rec.join('') + '</ul>' : '<p class="ps-small">Chưa có. Tập thử ở các bài của Sàn tập nhé.</p>') + '</div>' +
      nbFood() +
      (notes.length ? '<div class="nbsec"><h3>Ghi chú của bạn</h3><ul class="notes">' + notes.join('') + '</ul></div>' : '');
  }
  function nbSettings() { return PS.settingsHTML({ ctx: 'module', mod: ID, ver: TC_VER }); }
  function drawNb() {
    var el = $('#nb'); if (!el) return;
    el.innerHTML = '<div class="nb__in"><div class="nb__top"><h2>Sổ tay</h2><button type="button" class="nb__x" data-act="nbClose" aria-label="Đóng sổ tay">' + PS.icon('close', 20) + '</button></div>' +
      '<div class="tabs" role="tablist">' + [['tq', 'Tổng quan'], ['the', 'Thẻ hội viên'], ['cd', 'Cài đặt']].map(function (t) { return '<button type="button" role="tab" aria-selected="' + (TAB === t[0]) + '" class="' + (TAB === t[0] ? 'on' : '') + '" data-act="tab" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<div id="nbBody">' + (TAB === 'tq' ? nbOverview() : (TAB === 'the' ? nbCard() : nbSettings())) + '</div></div>';
    if (TAB === 'cd') PS.wireSettings($('#nbBody'), { ctx: 'module', mod: ID, onChange: function () { render(); } });
  }
  function openNb() { if (nbOpen) return; nbOpen = true; var el = D.createElement('div'); el.id = 'nb'; el.className = 'nb'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Sổ tay'); D.body.appendChild(el); D.body.classList.add('ps-lock'); drawNb(); }
  function closeNb() { var el = $('#nb'); if (el) el.parentNode.removeChild(el); nbOpen = false; D.body.classList.remove('ps-lock'); render(); }

  /* =========================================================
     SỰ KIỆN
     ========================================================= */
  D.addEventListener('click', function (e) {
    var b = PS.closest(e.target, '[data-act]'); if (!b) return;
    var a = b.getAttribute('data-act'), id = b.getAttribute('data-id');
    if (a === 'psHome') { save(true); PS.home(); return; }
    if (a === 'home') { if (nbOpen) closeNb(); go({ v: 'home' }); return; }
    if (a === 'nb') { openNb(); return; }
    if (a === 'nbClose') { closeNb(); return; }
    if (a === 'tab') { TAB = b.getAttribute('data-t'); drawNb(); return; }
    if (a === 'editMem') { if (nbOpen) closeNb(); var m = S.mem || {}; J = { job: m.job, g: m.g, g2: m.g2 || (m.job === 'du-hoc' ? 'none' : ''), sex: m.sex, inj: m.inj, goal: m.goal, h: m.h || '', w: m.w || '', cd: '' }; go({ v: 'join', step: 1 }); return; }
    if (a === 'demoExit') { W.PS_NOSAVE = true; clearTimeout(saveT); try { W.localStorage.removeItem(DEMO_KEY); } catch (er) {} W.location.href = PS.url(ID + '/index.html'); return; }
    if (a === 'khu') { go({ v: 'khu', id: id }); return; }
    if (a === 'bai') { go({ v: 'bai', id: id }); return; }
    if (a === 'act') { openAct(id); return; }
    if (a === 'baiSoon') { PS.toast('Bài này Shin đang chuẩn bị. Sắp mở nhé!', 2000); return; }
    if (a === 'cmtTick') { var CC = S.food.commit; if (CC) { CC.days[today()] = 1; markDay(); save(true); tick(); PS.toast('Giỏi lắm! Thêm một ngày giữ lời hẹn.'); } if (nbOpen) drawNb(); else render(); return; }
    /* làm thẻ hội viên */
    if (a === 'jNext') { var st = V.step || 0; if (st === 1) { var jj = jobOf(J.job); if (jj && jj.g && !jj.two) { J.g = jj.g; J.g2 = ''; } } go({ v: 'join', step: st + 1 }); return; }
    if (a === 'jJob') { J.job = b.getAttribute('data-s'); var jb = jobOf(J.job); if (jb.g && !jb.two) { J.g = jb.g; J.g2 = ''; } else if (jb.two) { J.g = 'vp'; } else { J.g = ''; J.g2 = ''; } render(); return; }
    if (a === 'jG') { J.g = b.getAttribute('data-g'); render(); return; }
    if (a === 'jG2') { J.g2 = b.getAttribute('data-g'); render(); return; }
    if (a === 'jSex') { J.sex = b.getAttribute('data-v'); render(); return; }
    if (a === 'jInj') { J.inj = +b.getAttribute('data-v'); render(); return; }
    if (a === 'jTip') { var gt = $('#jGoal'); J.goal = TXT.goalTips[+b.getAttribute('data-i')]; if (gt) gt.value = J.goal; syncJoin(); return; }
    if (a === 'jDone') { syncJoin(); if (words(J.goal) < 3) return; var isNew = !S.mem; finishJoin(); if (isNew) showCardDlg(); else PS.toast('Đã cập nhật thẻ hội viên.'); go({ v: 'home' }, true); return; }
    /* hoạt động */
    if (a === 'finish') {
      syncWrite();
      var fa = actById(V.a);
      if (fa && fa.k === 'calc') { syncCalc(); if (!calcRes(T.c)) { PS.toast('Nhập đủ chiều cao, cân nặng, tuổi, giới tính và mức vận động nhé.'); return; } }
      if (fa && fa.k === 'commit' && T.hab >= HABITS.length && words(T.own) < 2) { PS.toast('Viết tên thói quen của bạn nhé.'); return; }
      finishAct(); return;
    }
    if (a === 'pickNext') { T.round++; T.pick = -1; render(true); return; }
    if (a === 'plFood') { T.sel = +b.getAttribute('data-i'); T.wrong = ''; render(); return; }
    if (a === 'plZone') {
      var pa = actById(V.a); if (T.sel < 0) { PS.toast('Chạm một món trước, rồi chạm nhóm nhé.', 1800); return; }
      var it = pa.items[T.sel];
      if (it.z === b.getAttribute('data-z')) { T.placed[T.sel] = 1; T.sel = -1; T.wrong = ''; tick(); } else { T.wrong = BEP_TXT.plateWrong + (it.h || BEP_TXT.plateHint); }
      render(); return;
    }
    if (a === 'mTab') { T.mtab = +b.getAttribute('data-i'); render(); return; }
    if (a === 'mFood') { var mk = MEALS[T.mtab][0], ft = b.getAttribute('data-t'), L = T.meal[mk], fp = L.indexOf(ft); if (fp >= 0) L.splice(fp, 1); else L.push(ft); T.meal.skip[mk] = 0; render(); return; }
    if (a === 'mSkip') { var sk = MEALS[T.mtab][0]; T.meal.skip[sk] = T.meal.skip[sk] ? 0 : 1; if (T.meal.skip[sk]) T.meal[sk] = []; render(); return; }
    if (a === 'mNext') { T.mtab = Math.min(2, T.mtab + 1); render(); return; }
    if (a === 'mSee') { T.mres = true; render(true); return; }
    if (a === 'mBack') { T.mres = false; render(true); return; }
    if (a === 'hilo') { var hr = T.hp[T.round] = T.hp[T.round] || {}; hr[b.getAttribute('data-i')] = 1; if (b.getAttribute('data-hi') === '1') { hr.ok = 1; tick(); } render(); return; }
    if (a === 'hiloNext') { T.round++; render(true); return; }
    if (a === 'dayTap') { var di2 = +b.getAttribute('data-i'), dit = actById(V.a).items[di2]; if (dit.err) { if (!T.found[di2]) { T.found[di2] = 1; tick(); } } else if (!T.okTap[di2]) { T.okTap[di2] = 1; T.miss++; } render(); return; }
    if (a === 'dayShow') { T.miss = 99; render(); return; }
    if (a === 'cHab') { T.hab = +b.getAttribute('data-i'); render(); return; }
    if (a === 'cSex') { syncCalc(); T.c.sex = b.getAttribute('data-v'); render(); return; }
    if (a === 'cLv') { syncCalc(); T.c.lv = +b.getAttribute('data-i'); render(); return; }
    /* Bếp đợt 2 */
    if (a === 'mtV') { T.ms = +b.getAttribute('data-i'); T.mw = -1; render(); return; }
    if (a === 'mtJ') { var mj = +b.getAttribute('data-i'); if (T.ms < 0) { PS.toast('Chạm một món Việt trước nhé.', 1800); return; } if (mj === T.ms) { T.mm[mj] = 1; T.mlast = mj; T.ms = -1; T.mw = -1; tick(); } else { T.mw = mj; T.mlast = -1; } render(); return; }
    if (a === 'bkI') { var bki = +b.getAttribute('data-i'); T.bk[bki] = T.bk[bki] ? 0 : 1; if (T.bk[bki]) tick(); render(); return; }
    if (a === 'lbR') { var lk = b.getAttribute('data-k'), LR = actById(V.a).rounds[T.round]; T.lseen[lk] = 1; if (lk === String(LR.ok)) { T.lk[T.round] = 1; T.lw = ''; tick(); } else T.lw = lk; render(); return; }
    if (a === 'lbNext') { T.round++; T.lw = ''; render(true); return; }
    if (a === 'shPre') { var sp = SHIFTS[+b.getAttribute('data-i')]; T.sh = { s: sp.s, l: sp.l, pre: +b.getAttribute('data-i') }; render(); return; }
    if (a === 'shS') { T.sh.s = (T.sh.s + (+b.getAttribute('data-d')) + 24) % 24; T.sh.pre = -1; render(); return; }
    if (a === 'shL') { T.sh.l = Math.max(3, Math.min(12, T.sh.l + (+b.getAttribute('data-d')))); T.sh.pre = -1; render(); return; }
    if (a === 'btO') { var bsk = b.getAttribute('data-k'), bsi = +b.getAttribute('data-i'), BA = actById(V.a), SL = null; BA.slots.forEach(function (x) { if (x.k === bsk) SL = x; });
      if (SL.opts[bsi].no) { T.bw = { k: bsk, i: bsi }; delete T.bt[bsk]; } else { T.bt[bsk] = bsi; if (T.bw && T.bw.k === bsk) T.bw = null; tick(); } render(); return; }
    if (a === 'dtP') { T.pick = +b.getAttribute('data-v'); if (T.pick === actById(V.a).items[T.round].ok) tick(); render(); return; }
    if (a === 'dtNext') { T.round++; T.pick = -1; render(true); return; }
    if (a === 'howEx') { T.ex = +b.getAttribute('data-i'); T.fr = 0; render(); return; }
    if (a === 'howFr') { T.fr = Math.max(0, T.fr + (+b.getAttribute('data-d'))); render(); return; }
    if (a === 'hs') { var ac = actById(V.a), k2 = T.round + '.' + b.getAttribute('data-i'); if (!T.found[k2]) { T.found[k2] = 1; tick(); } render(); return; }
    if (a === 'hsMiss') { T.miss++; PS.toast('Chưa phải chỗ này. Thử lại nhé.', 1600); render(); return; }
    if (a === 'spotNext') { T.round++; T.miss = 0; render(true); return; }
    if (a === 'spotShow') { T.miss = 4; render(); return; }
    if (a === 'tryEx') { T.tryEx = b.getAttribute('data-x'); render(); return; }
    if (a === 'tryGo') { T.n = 0; T.el = 0; T.run = false; V.step = 1; render(); return; }
    if (a === 'tap') { T.n++; tick(); var cn = $('#cN'); if (cn) { cn.textContent = T.n; cn.parentNode.classList.remove('bump'); void cn.offsetWidth; cn.parentNode.classList.add('bump'); } var ni = $('#cNin'); if (ni) ni.value = ''; return; }
    if (a === 'tapMinus') { T.n = Math.max(0, T.n - 1); var cm = $('#cN'); if (cm) cm.textContent = T.n; return; }
    if (a === 'tStart') { if (T.run) { stopTimer(); } else { T.t0 = Date.now(); T.run = true; } render(); return; }
    if (a === 'tReset') { stopTimer(); T.el = 0; render(); return; }
    if (a === 'tryDone') {
      stopTimer(); var M = MOC[T.tryEx] || {}, ninp = $('#cNin');
      if (ninp && ninp.value) T.n = Math.max(0, Math.min(999, parseInt(ninp.value, 10) || 0));
      var n = M.u === 's' ? Math.round(T.el / 1000) : T.n;
      if (n <= 0) { PS.toast(M.u === 's' ? 'Bấm Bắt đầu và giữ tư thế trước đã nhé.' : 'Bạn chưa đếm cái nào. Chạm nút tròn mỗi lần làm xong nhé.'); return; }
      T.isPr = best(T.tryEx) > 0 && n > best(T.tryEx); (S.log[T.tryEx] = S.log[T.tryEx] || []).push({ d: Date.now(), n: n, f: -1 }); if (S.log[T.tryEx].length > 60) S.log[T.tryEx].shift();
      save(); V.step = 2; render(true); return;
    }
    if (a === 'feel') { T.feel = +b.getAttribute('data-i'); var l = S.log[T.tryEx]; if (l && l.length) l[l.length - 1].f = T.feel; save(); render(); return; }
    if (a === 'tryNext') { V.step = 3; render(true); return; }
    if (a === 'wTip') { var ta = $('#wTxt'); T.txt = b.getAttribute('data-t'); T.tipUsed = T.txt; if (ta) { ta.value = T.txt; ta.focus(); } syncWrite(); return; }
    if (a === 'ord') { var i = +b.getAttribute('data-i'); if (T.ord.indexOf(i) < 0) T.ord.push(i); render(); return; }
    if (a === 'ordReset') { T.ord = []; render(); return; }
    if (a === 'pick') { T.pick = +b.getAttribute('data-i'); render(); return; }
    if (a === 'planK') { T.plan.k = b.getAttribute('data-k'); render(); return; }
    if (a === 'planD') { var di = +b.getAttribute('data-i'), p = T.plan.days.indexOf(di); if (p >= 0) T.plan.days.splice(p, 1); else T.plan.days.push(di); render(); return; }
    if (a === 'planS') { T.plan.slot = +b.getAttribute('data-i'); render(); return; }
    if (a === 'pTip') { var pt = $('#pTxt'); T.plan.txt = b.getAttribute('data-t'); T.tipUsed = T.plan.txt; if (pt) pt.value = T.plan.txt; syncWrite(); return; }
  });
  D.addEventListener('input', function (e) {
    var t = e.target;
    if (t.id === 'jGoal' || t.id === 'jH' || t.id === 'jW') syncJoin();
    if (t.id === 'wTxt' || t.id === 'pTxt') syncWrite();
    if (t.id === 'cH' || t.id === 'cW' || t.id === 'cA') syncCalc();
    if (t.id === 'cOwn') T.own = t.value;
  });
  function syncJoin() {
    var g = $('#jGoal'), h = $('#jH'), w = $('#jW');
    if (g) J.goal = g.value; if (h) J.h = h.value.replace(/[^\d]/g, ''); if (w) J.w = w.value.replace(/[^\d.,]/g, '');
    var bt = $('#jDoneBtn'); if (bt) bt.disabled = words(J.goal) < 3;
    var bm = $('#jBmi'); if (bm) bm.innerHTML = bmiHTML(J.h, J.w);
  }
  function syncWrite() {
    var ta = $('#wTxt'); if (ta) { T.txt = ta.value; var w = words(T.txt), c = $('#wCnt'); if (c) c.textContent = w + ' chữ' + (w >= 10 ? (T.txt === T.tipUsed ? ' · sửa thành lời của bạn để được Insight' : ' · +1 Insight') : ''); var d = $('#wDone'); if (d) d.disabled = w < 3; }
    var pt = $('#pTxt'); if (pt) { T.plan.txt = pt.value; var pd = $('#pDone'); if (pd) pd.disabled = words(T.plan.txt) < 4; }
  }
  function showCardDlg() {
    PS.dialog({ title: 'Thẻ hội viên của bạn', wide: true, html: memCard(true) + shinSays('party', esc(TXT.cardSay), 50), buttons: [{ t: 'Vào phòng tập', cls: 'ps-btn--go' }] });
  }

  /* ---------- khởi động ---------- */
  function start() {
    loadState();
    if (!S.mem) { V = { v: 'join', step: 0 }; J = {}; } else V = { v: 'home' };
    try { history.replaceState({ tc: 1, v: V }, ''); } catch (e) {}
    markDay(); render(true); save(true);
    if (IS_DEMO) PS.toast('Bản demo giáo viên · học viên giả định đã làm 2 bài Sàn tập, 1 bài Bếp.', 4200);
  }
  if (DQ.on) {
    if (PS.checkDemo(DQ.val)) { IS_DEMO = true; start(); }
    else PS.demoAsk(function (ok) { if (ok) { IS_DEMO = true; start(); } else { if (PS.needProfile() || !PS.isUnlocked(ID)) PS.guard(ID); else start(); } });
  } else start();
})(window, document);
