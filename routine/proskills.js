/* =========================================================
   SHIN ROUTINE · CẦU NỐI PROSKILLS (routine/proskills.js) · PS1.3.25, PS1.3.26
   Nạp sau mã Shin Routine, ngay trước boot.js. Không đổi giao diện trang Hôm nay.
   Phụ trách:
   - Dùng chung lớp, thầy cô với hồ sơ Proskills (không hỏi lại); Shin chỉ hỏi "tên gọi".
   - Báo tóm tắt về trang chủ: PS.report('routine', …) → extra { day, rec (đã đóng dấu hôm nay),
     need (có thẻ cần ghi nhận), cards, active, fire (Lửa), recDays, mastered, habits }.
   - Phút rèn luyện thật (đang mở và có thao tác) theo ngày: ps.mod.routine.min → tính vào chuỗi ngày, phút học chung.
   - Cửa Rèn luyện (?door=1, trang chủ chuyển sang khi hôm nay chưa đóng dấu): đóng dấu xong thì mời vào học.
   - PS1.3.28: nút Check-in trang chủ mở ?ci=1#checkin; check-in xong hiện thanh "Đã check-in hôm nay · Vào học".
     extra báo thêm ci (đã check-in hôm nay), ciTime (giờ check-in).
   - Nút "Về trang chủ Proskills" đặt ở đầu Sổ tay › Cài đặt (không thêm nút trên trang Hôm nay);
     nút ⋯ (Sổ tay) mở thẳng thẻ Cài đặt.
   - Demo giáo viên dùng mật khẩu chung: routine/?demo.
   - Lần đầu mở: giữ màn chào của Shin rồi mời chọn "Việc nhỏ đầu tiên"; những lần sau vào thẳng.
   - PS1.3.26: chỉ dùng sao lưu chung (backup → PS.backup, psRestore → PS.restorePick).
     Khóa gợi ý thẻ: routine/?add=<mã thẻ>&from=<id khóa> → mở thẻ (đang có) hoặc màn đặt công thức; thanh "Quay lại <khóa>".
     extra báo thêm mine {mã: active|pause|keep|master|stored} và lib {mã: tên}.
     PS1.3.47: extra.dn {mã thẻ: số ngày đã ghi nhận (r2Count)} để CD02 hiện “x/14 ngày” cho thẻ thử nhỏ 2 tuần.
   - PS1.3.36: Shin là gà lớn dần (../core/shin.js). Tủ đồ của Shin ở Sổ tay › Cài đặt › nhóm Proskills
     (PS.prefs().shinFit; demo chỉ thử tạm). Qua mốc ngày ghi nhận thì hiện màn "Shin đã lớn".
   ========================================================= */
(function (W, D) {
  'use strict';
  if (!W.PS || W.PS_STOP) return;
  var PS = W.PS, ID = 'routine';
  var FIRST_KEY = 'ps.mod.routine.first', MIN_KEY = 'ps.mod.routine.min';
  var DOOR = /[?&](?:door|ci)=1/.test(location.search || '');
  /* PS1.3.28: ?ci=1 = vào từ nút Check-in trên trang chủ (kèm #checkin) */
  var DOOR_CI = /[?&]ci=1/.test(location.search || '');
  function qp(n) { var m = new RegExp('[?&]' + n + '=([^&#]*)').exec(location.search || ''); if (!m) return ''; try { return decodeURIComponent(m[1]); } catch (e) { return ''; } }
  var ADD = qp('add'), FROM = qp('from');
  var FROM_MOD = FROM ? PS.mod(FROM) : null; if (FROM_MOD && FROM_MOD.kind === 'routine') FROM_MOD = null;
  var FIRST = false;
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function today() { return PS.today(); }

  /* bỏ ?door=1 khỏi địa chỉ (giữ #checkin nếu có) */
  if (DOOR || ADD || FROM) { try { history.replaceState(null, '', location.pathname + (location.hash || '')); } catch (e) {} }
  /* đã vào Rèn luyện trong phiên này: trang chủ không tự chuyển sang nữa */
  try { sessionStorage.setItem('ps.door', today()); } catch (e) {}

  /* ---------- thầy cô: một danh sách chung trong config.js ---------- */
  W.TEACHERS = PS.teachers().map(function (t) { return [t[0], t[1]]; });
  function teacherIndex(email) {
    email = String(email || '').toLowerCase();
    for (var i = 0; i < W.TEACHERS.length; i++) if (String(W.TEACHERS[i][1]).toLowerCase() === email) return i;
    return null;
  }

  /* ---------- đồng bộ hồ sơ khi nạp bài ---------- */
  function sync() {
    var S = W.S; if (!S || W.DEMO || W.LOAD_ISSUE32) return;
    var p = PS.profile(), t = PS.teacher();
    /* PS1.3.28: tên gọi 2 chữ cuối như trang chủ (Nguyễn Thị Quỳnh Anh → Quỳnh Anh) */
    if (!S.name) { var w = String(p.name || '').trim().split(/\s+/); S.name = w.length >= 3 ? w.slice(-2).join(' ') : PS.given(); }
    if (p.cls) S.cls = p.cls;
    S.teacher = t ? teacherIndex(t.email) : null;
    if (!S.introSeen) S.introSeen = 1;
  }
  var baseLoad = W.load;
  W.load = function () { var r = baseLoad.apply(this, arguments); try { sync(); } catch (e) {} return r; };

  /* Học viên đổi lớp, thầy cô trong Cài đặt của Shin → ghi về hồ sơ chung */
  var clsT = null;
  D.addEventListener('input', function (e) {
    if (W.DEMO || !e.target || e.target.getAttribute('data-in') !== 'cls') return;
    var v = String(e.target.value || '').trim(); clearTimeout(clsT);
    if (v) clsT = setTimeout(function () { PS.setProfile({ cls: v }); }, 600);
  });
  D.addEventListener('change', function (e) {
    if (W.DEMO || !e.target || e.target.getAttribute('data-in') !== 'teacher') return;
    var v = e.target.value, t = v === '' ? null : W.TEACHERS[+v];
    PS.setProfile({ teacher: t ? t[1] : '' });
  });

  /* ---------- màn chào: PS1.3.34 bỏ hẳn (kể cả lần đầu), vào thẳng app cho nhanh ---------- */
  var baseSplash = W.splashBoot;
  W.splashBoot = function () {
    if (!lsGet(FIRST_KEY)) { FIRST = true; lsSet(FIRST_KEY, today()); }
    D.documentElement.classList.remove('growth-starting');
    var meta = D.querySelector('meta[name="theme-color"]'); if (meta) meta.content = '#F9F9FF';
  };

  /* ---------- Sổ tay › Cài đặt: về trang chủ Proskills ở trên cùng ---------- */
  var baseNbSet = W.nbSet;
  W.nbSet = function () {
    var h = baseNbSet.apply(this, arguments);
    var row = W.setRow('psHome', 'phone', 2, 'Trang chủ Proskills', '', '', '<a class="btn btn--soft btn--sm" href="../index.html" data-ps-home>Về trang chủ</a>');
    return W.setGroup('Proskills', [row, fitRow()]) + h;
  };

  /* ---------- PS1.3.36 · Tủ đồ của Shin (gà lớn dần, trang phục mở theo giai đoạn) ---------- */
  function fitRow() {
    if (!W.PSShin) return '';
    var Z = W.PSShin, l = Z.look(), F = {}; Z.FITS.forEach(function (f) { F[f[0]] = f; });
    var nx = l.stg < 3 ? Z.STAGE_DAYS[l.stg + 1] : 0, pct = nx ? Math.min(100, Math.round(l.days / nx * 100)) : 100;
    var body = '<div class="psfit__now">' + Z.svg('proud', { stg: l.stg, fit: l.fit, days: l.days }) +
      '<div><b>Shin đang là ' + Z.STAGE_NAME[l.stg] + '</b><small>' + (W.DEMO ? 'Bản demo: Shin đã lớn.' : 'Bạn đã ghi nhận ' + l.days + ' ngày.') +
      (nx && !W.DEMO ? ' Thêm ' + (nx - l.days) + ' ngày nữa, Shin thành ' + Z.STAGE_NAME[l.stg + 1] + '.' : (l.stg === 3 ? ' Shin đã trưởng thành cùng bạn!' : '')) + '</small>' +
      '<span class="psfit__bar"><i style="width:' + pct + '%"></i></span></div></div>' +
      '<div class="psfit__g">' + Z.FITS.map(function (f) {
        var need = !W.DEMO && Z.earned && !Z.earned(f), lock = f[2] > l.stg || need, on = f[0] === l.fit;
        return '<button type="button" class="psfit__b' + (on ? ' on' : '') + (lock ? ' lock' : '') + '" data-ps-fit="' + f[0] + '"' + (lock ? ' aria-disabled="true"' : '') + ' aria-pressed="' + on + '">' +
          Z.svg('still', { stg: Math.max(l.stg, f[2]), fit: f[0], days: l.days }) + '<b>' + PS.esc(f[1]) + '</b><small>' + (need ? 'Mở khi xong ' + PS.esc(String(f[4]).toUpperCase()) : (lock ? 'Mở khi Shin là ' + Z.STAGE_NAME[f[2]] : PS.esc(f[3]))) + '</small></button>';
      }).join('') + '</div><p class="psfit__ft">Shin lớn dần theo số ngày bạn ghi nhận: Gà con ' + Z.STAGE_DAYS[1] + ' ngày · Gà choai ' + Z.STAGE_DAYS[2] + ' ngày · Gà lớn ' + Z.STAGE_DAYS[3] + ' ngày.</p>';
    return W.setRow('psFit', 'smile', 4, 'Tủ đồ của Shin', PS.esc(F[l.fit][1]) + ' · ' + Z.STAGE_NAME[l.stg], body);
  }
  D.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('[data-ps-fit]') : null; if (!b || !W.PSShin) return;
    e.preventDefault(); e.stopPropagation();
    var k = b.getAttribute('data-ps-fit'), l = W.PSShin.look(), f = null;
    W.PSShin.FITS.forEach(function (x) { if (x[0] === k) f = x; });
    if (!f) return;
    if (!W.DEMO && W.PSShin.earned && !W.PSShin.earned(f)) { W.toast('Trang phục này mở khi bạn nhận Bằng Thuyền Trưởng Vững Vàng ở CD02 · Hải Đồ La Bàn.'); return; }
    if (f[2] > l.stg) { W.toast('Trang phục này mở khi Shin thành ' + W.PSShin.STAGE_NAME[f[2]] + '. Ghi nhận đều mỗi ngày nhé!'); return; }
    if (W.DEMO) W.PS_SHIN_FIT_TMP = k; else PS.setPref('shinFit', k);
    try { W.refreshAll(); } catch (er) {}
    W.toast('Shin đã thay: ' + f[1] + '.');
  }, true);
  /* Shin lớn lên: mừng một lần khi vừa qua mốc */
  function grewUp(from, to, days) {
    var Z = W.PSShin, news = Z.FITS.filter(function (f) { return f[2] === to; }).map(function (f) { return f[1]; });
    whenFree(function () {
      if (W.OV || typeof W.openMini !== 'function') return;
      W.openMini('<div class="center psgrow"><div class="psgrow__art">' + Z.svg('cheer', { stg: to, fit: Z.look().fit, days: days }) + '</div>' +
        '<small>SHIN ĐÃ LỚN</small><h2>' + (to === 1 ? 'Shin nở rồi! Chào Gà con!' : 'Shin thành ' + Z.STAGE_NAME[to] + '!') + '</h2>' +
        '<p class="muted">Bạn đã ghi nhận <b>' + days + ' ngày</b>. Shin lớn lên nhờ từng ngày bạn giữ nhịp.</p>' +
        (news.length ? '<p class="psgrow__new">Tủ đồ có thêm: <b>' + news.map(PS.esc).join(', ') + '</b></p>' : '') +
        '<button class="btn btn--wide" data-act="close">Tuyệt quá!</button></div>');
    }, 0);
  }
  D.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target : null; if (!t) return;
    if (t.closest('[data-ps-home]')) { try { W.save(true); } catch (er) {} }
    /* nút ⋯ (Sổ tay) mở thẻ Cài đặt trước, như các khóa Proskills */
    if (t.closest('#gear')) W.NBTAB = 'set';
  }, true);

  /* ---------- phút rèn luyện thật ---------- */
  var lastAct = Date.now();
  ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(function (n) { W.addEventListener(n, function () { lastAct = Date.now(); }, { passive: true, capture: true }); });
  function minutes() {
    var o = {}; try { o = JSON.parse(lsGet(MIN_KEY) || '{}') || {}; } catch (e) { o = {}; }
    return o;
  }
  function addMinutes(m) {
    var o = minutes(), t = today(), keys;
    o[t] = Math.round(((+o[t] || 0) + m) * 100) / 100;
    keys = Object.keys(o).sort(); while (keys.length > 120) delete o[keys.shift()];
    lsSet(MIN_KEY, JSON.stringify(o));
  }
  setInterval(function () {
    if (D.hidden || W.DEMO || Date.now() - lastAct > 60000) return;
    addMinutes(0.25); queue();
  }, 15000);

  /* ---------- báo về trang chủ ---------- */
  var repT = null, wasRec = null;
  function queue() { clearTimeout(repT); repT = setTimeout(report, 400); }
  function report() {
    var S = W.S;
    if (!S || W.DEMO || W.PS_NOSAVE || W.SAVE_BLOCK || W.LOAD_ISSUE32) return;
    var t = W.dk(), C = W.r2Calc() || {}, rec = C.rec || {}, now = W.r2TrainingNow(), all = Object.keys(S.habits || {});
    var cards = now.slice(0, 5).map(function (id) { return { id: id, n: W.sname(id), m: W.mark(t, id) }; });
    var mastered = all.filter(function (id) { return S.habits[id] && S.habits[id].master; }).length;
    var mine = {}, lib = {}, dn = {};
    all.forEach(function (id) {
      var u = S.habits[id]; if (!u || !W.HMAP[id]) return;
      try { dn[id] = W.r2Count(id); } catch (e) {}
      mine[id] = u.master ? 'master' : (u.status === 'keep' ? 'keep' : (S.slots.indexOf(id) >= 0 ? (u.status === 'pause' ? 'pause' : 'active') : 'stored'));
    });
    (W.HABITS || []).forEach(function (h) { lib[h.id] = W.sname(h.id); });
    var x = { day: t, rec: !!rec[t], ci: !!(S.ci && S.ci[t]), ciTime: S.ciTime || '21:00', need: now.length > 0 || all.length === 0, cards: cards, active: now.length,
      fire: W.streak(), recDays: Object.keys(rec).length, mastered: mastered, habits: all.length, mine: mine, lib: lib, dn: dn };
    var prev = PS.summary(ID), pd = prev && prev.extra ? +prev.extra.recDays || 0 : -1;
    PS.report(ID, { xp: 0, ins: 0, done: x.recDays, total: 0, days: minutes(), extra: x, ver: W.APP_VER });
    /* PS1.3.36: Shin lớn lên khi số ngày ghi nhận qua mốc (không mừng lần báo đầu tiên trên máy) */
    if (W.PSShin && pd >= 0 && W.PSShin.stageOf(x.recDays) > W.PSShin.stageOf(pd)) { grewUp(W.PSShin.stageOf(pd), W.PSShin.stageOf(x.recDays), x.recDays); try { W.render(); } catch (er) {} }
    door(x);
  }
  var baseSave = W.save;
  W.save = function () { var r = baseSave.apply(this, arguments); queue(); return r; };
  W.addEventListener('ps:change', function (e) {
    var f = e.detail && e.detail.field;
    if (f === 'beforeBackup' || f === 'beforeRestore') { try { W.save(true); } catch (er) {} }
    if (W.PS_NOSAVE) W.SAVE_BLOCK = true;
    if (f === 'backup') { try { W.renderTop(); if (W.NBOPEN && W.OV) W.sheetSet(W.nbSheet()); } catch (er) {} }
  });

  /* ---------- chỉ dùng sao lưu chung của Proskills ---------- */
  W.backup = function () { if (W.DEMO) { W.toast('Bản demo không cần sao lưu.'); return; } PS.backup(); };
  D.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('[data-act="psRestore"]') : null;
    if (b) { e.preventDefault(); e.stopPropagation(); PS.restorePick(); }
  }, true);

  /* ---------- cửa Rèn luyện: đóng dấu xong thì mời vào học ---------- */
  function door(x) {
    var on = DOOR_CI ? x.ci : x.rec;
    if (wasRec === null) { wasRec = on; return; }
    if (DOOR && on && !wasRec) whenFree(goCard, 0);
    wasRec = on;
  }
  function whenFree(fn, n) {
    if (n > 900) return;
    var tt = D.getElementById('toast');
    if (W.OV || D.getElementById('splash') || (tt && tt.classList.contains('show'))) { setTimeout(function () { whenFree(fn, n + 1); }, 1000); return; }
    setTimeout(fn, n ? 900 : 250);
  }
  function goCard() {
    if (D.getElementById('psGo')) return;
    var el = D.createElement('div'); el.id = 'psGo'; el.className = 'psgo'; el.setAttribute('role', 'status');
    el.innerHTML = '<span class="psgo__t"><b>' + (DOOR_CI ? 'Đã check-in hôm nay' : 'Đã đóng dấu hôm nay') + '</b><small>Vào Proskills học tiếp nhé.</small></span>' +
      '<a class="psgo__go" href="../index.html" data-ps-home>Vào học</a>' +
      '<button type="button" class="psgo__x" aria-label="Để sau">×</button>';
    el.querySelector('.psgo__x').addEventListener('click', function () { if (el.parentNode) el.parentNode.removeChild(el); });
    D.body.appendChild(el);
  }
  var css = D.createElement('style');
  css.textContent = '.psgo{position:fixed;left:12px;right:12px;bottom:calc(max(8px,env(safe-area-inset-bottom) - 10px) + 76px);z-index:60;max-width:460px;margin:0 auto;' +
    'display:flex;align-items:center;gap:10px;padding:10px 10px 10px 16px;border-radius:20px;background:#1F4FA8;color:#fff;box-shadow:0 10px 28px rgba(16,40,90,.28);' +
    'animation:psgoIn .35s cubic-bezier(.22,.9,.24,1)}' +
    '.psgo__t{flex:1;display:flex;flex-direction:column;line-height:1.35}.psgo__t b{font-size:15px}.psgo__t small{font-size:12.5px;opacity:.85}' +
    '.psgo__go{flex:none;background:#fff;color:#1F4FA8;font-weight:700;font-size:14px;text-decoration:none;padding:10px 16px;border-radius:999px}' +
    '.psgo__x{flex:none;width:36px;height:36px;border:0;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;font-size:20px;line-height:1;cursor:pointer}' +
    '@keyframes psgoIn{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}' +
    '@media (prefers-reduced-motion:reduce){.psgo{animation:none}}' +
    '@media (min-width:900px){.psgo{bottom:24px}}' +
    /* PS1.3.36 · Tủ đồ của Shin, màn mừng Shin lớn */
    '.psfit__now{display:flex;align-items:center;gap:12px;background:#F4F6FC;border-radius:18px;padding:8px 12px 8px 4px}.psfit__now svg{width:78px;height:80px;flex:none}' +
    '.psfit__now b{display:block;font-size:15px}.psfit__now small{display:block;font-size:12.5px;color:#5D6478;line-height:1.4;margin-top:2px}' +
    '.psfit__bar{display:block;height:7px;border-radius:9px;background:#DFE5F2;margin-top:8px;overflow:hidden}.psfit__bar i{display:block;height:100%;border-radius:9px;background:#F2B21B}' +
    '.psfit__g{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:10px}' +
    '.psfit__b{display:flex;flex-direction:column;align-items:center;gap:1px;border:1.5px solid #E2E6F0;background:#fff;border-radius:16px;padding:6px 6px 9px;cursor:pointer;font:inherit;color:inherit;-webkit-tap-highlight-color:transparent}' +
    '.psfit__b svg{width:70px;height:72px}.psfit__b b{font-size:13.5px}.psfit__b small{font-size:11.5px;color:#6B7183;line-height:1.3;text-align:center}' +
    '.psfit__b.on{border-color:#2265C5;box-shadow:0 0 0 2px #2265C5 inset;background:#F3F7FF}.psfit__b.lock{opacity:.55}.psfit__b.lock svg{filter:grayscale(1)}' +
    '.psfit__b:active{transform:scale(.97)}.psfit__ft{font-size:12px;color:#6B7183;margin:10px 2px 2px;line-height:1.45}' +
    '.psgrow__art{width:150px;margin:0 auto}.psgrow__art svg{width:100%;height:auto}.psgrow small{display:block;font-size:12px;font-weight:700;letter-spacing:.08em;color:#2265C5;margin-top:4px}' +
    '.psgrow h2{margin:4px 0 6px}.psgrow__new{background:#FFF6DA;border-radius:14px;padding:8px 12px;font-size:14px;margin:10px 0 14px}' +
    '@media (min-width:600px){.psfit__g{grid-template-columns:repeat(4,1fr)}}';
  D.head.appendChild(css);

  /* ---------- khóa gợi ý thẻ: mở thẻ, đặt công thức, rồi mời quay lại khóa ---------- */
  function openAdd() {
    var S = W.S, id = ADD;
    if (!S || !W.HMAP[id]) return;
    if (W.H(id)) W.openCard(id);
    else if (S.slots.indexOf(null) < 0) W.chooseSwap(id, 'start');
    else W.openStart(id, false);
  }
  function backCard() {
    if (!FROM_MOD || D.getElementById('psGo')) return;
    var el = D.createElement('div'); el.id = 'psGo'; el.className = 'psgo'; el.setAttribute('role', 'status');
    el.innerHTML = '<span class="psgo__t"><b>Xong rồi?</b><small>Quay lại ' + PS.esc(FROM_MOD.title) + '.</small></span>' +
      '<a class="psgo__go" href="' + PS.esc(PS.url(FROM_MOD.id + '/index.html')) + '" data-ps-home>Quay lại</a>' +
      '<button type="button" class="psgo__x" aria-label="Để sau">×</button>';
    el.querySelector('.psgo__x').addEventListener('click', function () { if (el.parentNode) el.parentNode.removeChild(el); });
    D.body.appendChild(el);
  }

  /* ---------- demo giáo viên: routine/?demo (mật khẩu chung) ---------- */
  W.exitDemo = function () {
    W.SAVE_BLOCK = true;
    try { localStorage.removeItem(W.KEY_DEMO); localStorage.setItem(W.KEY_MODE, 'own'); } catch (e) {}
    location.replace('index.html');
  };
  function demoStart() {
    var q = PS.demoParam();
    if (!q.on || W.DEMO) return;
    if (PS.checkDemo(q.val)) { W.enterDemo(); return; }
    PS.demoAsk(function (ok) { if (ok) W.enterDemo(); else location.replace('index.html'); });
  }

  /* ---------- sau khi Shin dựng xong trang ---------- */
  function afterBoot() {
    demoStart();
    if (W.DEMO || !W.S) return;
    var S = W.S;
    if (ADD && W.HMAP[ADD]) {
      whenFree(function () { openAdd(); setTimeout(function () { whenFree(backCard, 0); }, 300); }, 0);
    } else if (FROM_MOD) whenFree(backCard, 0);
    else if (FIRST && !Object.keys(S.habits || {}).length && typeof W.openFirstChoice32 === 'function') {
      whenFree(function () { if (!W.OV) W.openFirstChoice32(); }, 0);
    } else if (DOOR && !DOOR_CI && !wasRec && W.r2TrainingNow().length) {
      setTimeout(function () { try { W.toast('Ghi nhận thói quen hôm nay, rồi vào học tiếp nhé.', 3200); } catch (e) {} }, 700);
    }
    queue();
  }
  if (D.readyState === 'complete') setTimeout(afterBoot, 0);
  else W.addEventListener('load', function () { setTimeout(afterBoot, 0); });
})(window, document);
