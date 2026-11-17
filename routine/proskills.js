/* =========================================================
   SHIN ROUTINE · CẦU NỐI PROSKILLS (routine/proskills.js) · PS1.3.25, PS1.3.26
   Nạp sau mã Shin Routine, ngay trước boot.js. Không đổi giao diện trang Hôm nay.
   Phụ trách:
   - Dùng chung lớp, thầy cô với hồ sơ Proskills (không hỏi lại); Shin chỉ hỏi "tên gọi".
   - Báo tóm tắt về trang chủ: PS.report('routine', …) → extra { day, rec (đã đóng dấu hôm nay),
     need (có thẻ cần ghi nhận), cards, active, fire (Lửa), recDays, mastered, habits }.
   - Phút rèn luyện thật (đang mở và có thao tác) theo ngày: ps.mod.routine.min → tính vào chuỗi ngày, phút học chung.
   - Cửa Rèn luyện (?door=1, trang chủ chuyển sang khi hôm nay chưa đóng dấu): đóng dấu xong thì mời vào học.
   - Nút "Về trang chủ Proskills" đặt ở đầu Sổ tay › Cài đặt (không thêm nút trên trang Hôm nay);
     nút ⋯ (Sổ tay) mở thẳng thẻ Cài đặt.
   - Demo giáo viên dùng mật khẩu chung: routine/?demo.
   - Lần đầu mở: giữ màn chào của Shin rồi mời chọn "Việc nhỏ đầu tiên"; những lần sau vào thẳng.
   - PS1.3.26: chỉ dùng sao lưu chung (backup → PS.backup, psRestore → PS.restorePick).
     Khóa gợi ý thẻ: routine/?add=<mã thẻ>&from=<id khóa> → mở thẻ (đang có) hoặc màn đặt công thức; thanh "Quay lại <khóa>".
     extra báo thêm mine {mã: active|pause|keep|master|stored} và lib {mã: tên}.
   ========================================================= */
(function (W, D) {
  'use strict';
  if (!W.PS || W.PS_STOP) return;
  var PS = W.PS, ID = 'routine';
  var FIRST_KEY = 'ps.mod.routine.first', MIN_KEY = 'ps.mod.routine.min';
  var DOOR = /[?&]door=1/.test(location.search || '');
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
    if (!S.name) S.name = PS.given();
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

  /* ---------- màn chào: chỉ lần đầu ---------- */
  var baseSplash = W.splashBoot;
  W.splashBoot = function () {
    if (!lsGet(FIRST_KEY)) { FIRST = true; lsSet(FIRST_KEY, today()); return baseSplash.apply(this, arguments); }
    D.documentElement.classList.remove('growth-starting');
    var meta = D.querySelector('meta[name="theme-color"]'); if (meta) meta.content = '#F9F9FF';
  };

  /* ---------- Sổ tay › Cài đặt: về trang chủ Proskills ở trên cùng ---------- */
  var baseNbSet = W.nbSet;
  W.nbSet = function () {
    var h = baseNbSet.apply(this, arguments);
    var row = W.setRow('psHome', 'phone', 2, 'Trang chủ Proskills', '', '', '<a class="btn btn--soft btn--sm" href="../index.html" data-ps-home>Về trang chủ</a>');
    return W.setGroup('Proskills', [row]) + h;
  };
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
    var mine = {}, lib = {};
    all.forEach(function (id) {
      var u = S.habits[id]; if (!u || !W.HMAP[id]) return;
      mine[id] = u.master ? 'master' : (u.status === 'keep' ? 'keep' : (S.slots.indexOf(id) >= 0 ? (u.status === 'pause' ? 'pause' : 'active') : 'stored'));
    });
    (W.HABITS || []).forEach(function (h) { lib[h.id] = W.sname(h.id); });
    var x = { day: t, rec: !!rec[t], need: now.length > 0 || all.length === 0, cards: cards, active: now.length,
      fire: W.streak(), recDays: Object.keys(rec).length, mastered: mastered, habits: all.length, mine: mine, lib: lib };
    PS.report(ID, { xp: 0, ins: 0, done: x.recDays, total: 0, days: minutes(), extra: x, ver: W.APP_VER });
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
    if (wasRec === null) { wasRec = x.rec; return; }
    if (DOOR && x.rec && !wasRec) whenFree(goCard, 0);
    wasRec = x.rec;
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
    el.innerHTML = '<span class="psgo__t"><b>Đã đóng dấu hôm nay</b><small>Vào Proskills học tiếp nhé.</small></span>' +
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
    '@media (min-width:900px){.psgo{bottom:24px}}';
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
    } else if (DOOR && !wasRec && W.r2TrainingNow().length) {
      setTimeout(function () { try { W.toast('Ghi nhận thói quen hôm nay, rồi vào học tiếp nhé.', 3200); } catch (e) {} }, 700);
    }
    queue();
  }
  if (D.readyState === 'complete') setTimeout(afterBoot, 0);
  else W.addEventListener('load', function () { setTimeout(afterBoot, 0); });
})(window, document);
