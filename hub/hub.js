/* =========================================================
   PROSKILLS · TRANG CHỦ (hub.js)
   Màn hình: Chào mừng + nhập thông tin (lần đầu) → Trang chủ (tổng điểm, Rèn luyện hôm nay, Lịch học, thẻ module)
   Cửa Rèn luyện (PS1.3.25): mở Proskills mà hôm nay chưa đóng dấu Shin Routine thì vào thẳng routine/ (mỗi phiên một lần)
   Lớp phủ: Cổng mật khẩu module · Cài đặt (thẻ chuẩn của lõi)
   Không chứa nội dung bài học. Danh sách module đọc từ config.js.
   ========================================================= */
(function (W, D) {
  'use strict';
  var PS = W.PS, CFG = PS.cfg, esc = PS.esc, icon = PS.icon;
  var APP = D.getElementById('app');
  var QS = (function () { var o = {}; (location.search || '').replace(/^\?/, '').split('&').forEach(function (p) { if (!p) return; var kv = p.split('='); o[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || ''); }); return o; })();
  var SHOW_HIDDEN = QS.thu === '1';
  var WANT = QS.m || '';
  /* bỏ ?m= khỏi địa chỉ để nút Back không mở lại cổng */
  if (WANT) { try { history.replaceState(null, '', location.pathname + (SHOW_HIDDEN ? '?thu=1' : '')); } catch (e) {} }
  var noMotion = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Logo Proskills: đầu tàu tiến về bình minh (icons/logo.svg) */
  function logo(sz) {
    sz = sz || 40;
    return '<img class="hub-logo" src="' + PS.url('icons/logo.svg') + '" width="' + sz + '" height="' + sz + '" alt="">';
  }
  function visibleMods() { return PS.modules().filter(function (m) { return m.kind !== 'routine' && (m.state !== 'hidden' || SHOW_HIDDEN); }); }

  /* ---------------- Shin Routine: thẻ Rèn luyện hôm nay + cửa Rèn luyện ---------------- */
  function routineMod() { var m = PS.mod('routine'); return m && m.state === 'ready' ? m : null; }
  function routineInfo() {
    var s = PS.summary('routine'), x = (s && s.extra) || null, t = PS.today();
    return { x: x, isT: !!(x && x.day === t), rec: !!(x && x.day === t && x.rec) };
  }
  /* Vào thẳng Rèn luyện khi: có hồ sơ, hôm nay chưa đóng dấu, còn thẻ cần ghi nhận, phiên này chưa vào lần nào */
  function doorNeeded() {
    var m = routineMod(); if (!m || !m.door) return false;
    if (PS.needProfile() || WANT || QS.lich || SHOW_HIDDEN) return false;
    var t = PS.today();
    try { if (W.sessionStorage.getItem('ps.door') === t) return false; } catch (e) { return false; }
    var r = routineInfo();
    if (r.rec || (r.x && r.x.need === false)) return false;
    return true;
  }
  var MARK = { y: 'Đã làm', p: 'Một phần', n: 'Chưa làm', x: 'Không có dịp' };
  function routineHTML() {
    var m = routineMod(); if (!m) return '';
    var r = routineInfo(), x = r.x, n = x ? (x.active || 0) : 0, st, cta, k;
    if (!x || !x.habits) { k = 'new'; st = ''; cta = 'Bắt đầu'; }
    else if (r.rec) { k = 'done'; st = 'Đã đóng dấu hôm nay. Giữ nhịp nhé!'; cta = 'Mở'; }
    else if (!n) { k = 'idle'; st = 'Chưa có thẻ đang rèn. Chọn thêm thẻ trong Thư viện.'; cta = 'Mở'; }
    else { k = 'todo'; st = 'Hôm nay chưa đóng dấu · ' + n + ' thẻ đang rèn'; cta = 'Đóng dấu'; }
    var chips = (x && x.cards && x.cards.length) ? '<span class="rt__chips">' + x.cards.map(function (c) {
      var mk = r.isT && c.m ? c.m : '';
      return '<span class="rt-chip rt-chip--' + (mk || 'none') + '" title="' + esc(MARK[mk] || 'Chưa ghi nhận') + '"><i aria-hidden="true"></i>' + esc(c.n) + '</span>';
    }).join('') + '</span>' : '';
    var fire = x && x.habits ? '<span class="rt__fire">' + icon('flame', 14) + ' Lửa <b>' + (x.fire || 0) + '</b></span>' : '';
    return '<button type="button" class="rt rt--' + k + '" data-act="mod" data-id="routine" style="--i:1">' +
      '<span class="rt__row"><img class="rt__shin" src="' + PS.url('routine/icon-192.png') + '" width="52" height="52" alt="">' +
      '<span class="rt__tx"><small>CHECK-IN RÈN LUYỆN</small><b>Shin Routine</b>' + (st ? '<span class="rt__st">' + (k === 'done' ? icon('check', 15, 3) + ' ' : '') + st + '</span>' : '') + '</span>' +
      '<span class="rt__go">' + cta + icon('next', 16) + '</span></span>' +
      (chips || fire ? '<span class="rt__foot">' + chips + fire + '</span>' : '') + '</button>';
  }

  /* ---------------- Chào mừng + thông tin ---------------- */
  function vWelcome() {
    var p = PS.profile();
    var paths = (CFG.PATHS || []).map(function (x) { return '<option' + (p.path === x ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('');
    return '<section class="onb enter">' +
      '<div class="onb__brand" style="--i:0">' + logo(64) + '<div><small>' + esc(CFG.ORG) + '</small><h1>' + esc(CFG.APP) + '</h1></div></div>' +
      '<p class="onb__lead" style="--i:1">Nơi bạn học các khóa kỹ năng trước khi sang Nhật. Nhập thông tin <b>một lần</b>, dùng cho mọi khóa học.</p>' +
      '<div class="card onb__form" style="--i:2"><div class="ps-form">' +
      '<label>Họ và tên<input class="ps-inp" id="fName" maxlength="40" autocomplete="name" placeholder="Ví dụ: Nguyễn Văn An" value="' + esc(p.name) + '"></label>' +
      '<div class="ps-row2"><label>Năm sinh<input class="ps-inp" id="fBy" inputmode="numeric" maxlength="4" placeholder="2005" value="' + esc(p.by) + '"></label>' +
      '<label>Mã học viên<input class="ps-inp" id="fSid" maxlength="30" placeholder="Nếu đã có" value="' + esc(p.sid) + '"></label></div>' +
      '<div class="ps-row2"><label>Lớp<input class="ps-inp" id="fCls" maxlength="20" placeholder="Ví dụ: E696" value="' + esc(p.cls) + '"></label>' +
      '<label>Diện<select class="ps-inp" id="fPath"><option value="">Chọn diện</option>' + paths + '</select></label></div>' +
      '<label>Thầy cô hướng dẫn' + PS.teacherSelect('id="fT"') + '</label>' +
      '</div><p class="ps-small">Họ tên, năm sinh, mã học viên ít khi đổi. Lớp, diện, thầy cô đổi được bất cứ lúc nào trong Cài đặt.</p>' +
      '<p class="onb__err" id="fErr" role="alert"></p>' +
      '<button type="button" class="ps-btn hub-wide" data-act="onbGo">Vào ' + esc(CFG.APP) + ' ' + icon('next', 18) + '</button></div>' +
      '<button type="button" class="ps-link onb__restore" style="--i:3" data-act="restore">' + icon('upload', 16) + ' Đã học trên máy khác? Khôi phục từ bản sao lưu</button>' +
      '</section>';
  }
  function onbGo() {
    var n = D.getElementById('fName').value.trim(), y = D.getElementById('fBy').value.trim(), s = D.getElementById('fSid').value.trim(),
      c = D.getElementById('fCls').value.trim(), pa = D.getElementById('fPath').value, t = D.getElementById('fT').value, err = '';
    if (n.split(/\s+/).length < 2) err = 'Nhập đủ họ và tên nhé.';
    else if (!PS.checkYear(y)) err = 'Năm sinh gồm 4 số, ví dụ 2005.';
    else if (!c) err = 'Nhập lớp của bạn nhé.';
    var e = D.getElementById('fErr'); e.textContent = err;
    if (err) return;
    PS.setProfile({ name: n, by: y, sid: s, cls: c, path: pa, teacher: t });
    PS.toast('Chào <b>' + esc(PS.given()) + '</b>! Chọn khóa học để bắt đầu nhé.');
    render(true);
    if (WANT) { var w = WANT; WANT = ''; setTimeout(function () { openMod(w); }, 400); }
  }

  /* ---------------- Trang chủ ---------------- */
  function greet() {
    var h = new Date().getHours();
    return h < 11 ? 'Chào buổi sáng' : (h < 14 ? 'Chào buổi trưa' : (h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'));
  }
  function modState(m) {
    var s = PS.summary(m.id) || {}, total = s.total || m.total || 0, done = s.done || 0;
    var pct = total ? Math.min(100, Math.round(done / total * 100)) : 0;
    var st = m.state === 'soon' ? 'soon' : (!PS.isUnlocked(m.id) ? 'lock' : (done === 0 && !s.xp ? 'new' : (pct >= 100 ? 'done' : 'go')));
    return { s: s, total: total, done: done, pct: pct, st: st };
  }
  /* pha màu thẻ khóa học (không dùng color-mix để chạy trên máy cũ) */
  function mix(a, b, t) {
    function rgb(h) { h = String(h).replace('#', ''); if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2); var n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
    var x = rgb(a), y = rgb(b), o = '#';
    for (var j = 0; j < 3; j++) { var v = Math.round(x[j] + (y[j] - x[j]) * t).toString(16); o += v.length < 2 ? '0' + v : v; }
    return o;
  }
  function cardHTML(m, i) {
    var k = modState(m);
    var cta = { soon: 'Sắp ra mắt', lock: icon('lock', 17) + ' Mở khóa', 'new': 'Bắt đầu ' + icon('next', 17), go: 'Học tiếp ' + icon('next', 17), done: 'Ôn lại ' + icon('next', 17) }[k.st];
    var meta = k.st === 'soon' ? '<span class="mcard__soon">Đang xây dựng</span>' :
      (k.st === 'lock' ? '<span class="mcard__hint">' + icon('info', 14) + ' Thầy cô cho mật khẩu khi bắt đầu khóa tại lớp</span>' :
        '<div class="mcard__bar"><i style="width:' + k.pct + '%"></i></div><span class="mcard__meta">' + k.done + (k.total ? '/' + k.total : '') + ' hoạt động' + (k.s.xp ? ' · ' + k.s.xp + ' XP' : '') + '</span>');
    var mc = m.color || '#24307A';
    return '<article class="mcard mcard--' + k.st + '" style="--mc:' + esc(mc) + ';--ml:' + mix(mc, '#FFFFFF', 0.18) + ';--md:' + mix(mc, '#0B1233', 0.28) + ';--mt:' + mix(mc, '#FFFFFF', 0.9) + ';--i:' + (i + 3) + '">' +
      '<span class="mcard__wm" aria-hidden="true">' + icon(m.icon, 124, 1.4) + '</span>' +
      '<div class="mcard__ic">' + icon(m.icon, 26, 2) + '</div>' +
      '<div class="mcard__tx"><span class="mcard__code">' + esc(m.code) + (m.state === 'hidden' ? ' · ẩn' : '') + '</span><h3>' + esc(m.title) + '</h3><p>' + esc(m.sub) + '</p>' + meta + '</div>' +
      '<button type="button" class="mcard__go" data-act="mod" data-id="' + esc(m.id) + '"' + (k.st === 'soon' ? ' disabled' : '') + '>' + cta + '</button>' +
      (k.st === 'done' ? '<span class="mcard__stamp">' + icon('check', 16, 3) + ' Hoàn thành</span>' : '') +
      '</article>';
  }
  function nudge() {
    var t = PS.totals(), lb = PS.prefs().lastBackup || 0;
    if (!PS.storageOK) return '<div class="nudge nudge--warn">' + icon('info', 18) + '<p>Trình duyệt này đang chặn lưu bài. Hãy mở bằng Chrome hoặc Safari, hoặc tải sao lưu trước khi tắt.</p></div>';
    if (t.done > 0 && Date.now() - lb > 7 * 864e5) return '<div class="nudge">' + icon('shield', 18) + '<p>' + (lb ? 'Đã hơn 7 ngày bạn chưa sao lưu.' : 'Bạn chưa sao lưu bài làm lần nào.') + ' Một tập tin giữ bài của mọi khóa.</p><button type="button" class="ps-btn ps-btn--sm ps-btn--go" data-act="backup">Tải sao lưu</button></div>';
    return '';
  }
  function vHome() {
    var p = PS.profile(), t = PS.totals(), tc = PS.teacher();
    var mods = visibleMods();
    return '<header class="hbar"><div class="hbar__brand">' + logo(34) + '<b>' + esc(CFG.APP) + '</b></div>' +
      '<div class="hbar__btns"><button type="button" class="hbar__btn hub-install" data-pwa="install" aria-label="Cài ứng dụng">' + icon('phone', 19) + '<span data-pwa-label>Cài ứng dụng</span></button>' +
      '<button type="button" class="hbar__btn" data-act="settings" aria-label="Cài đặt">' + icon('user', 19) + '<span>Cài đặt</span></button></div></header>' +
      '<div class="wrap enter">' +
      '<section class="hero" style="--i:0"><small>' + greet() + ',</small><h1>' + esc(PS.given()) + '</h1>' +
      '<p class="hero__who">' + esc(p.cls ? 'Lớp ' + p.cls : '') + (p.path ? ' · ' + esc(p.path) : '') + (tc ? ' · ' + esc(tc.name) : '') + '</p>' +
      '<div class="stats">' +
      '<div class="st st--fire">' + icon('flame', 18) + '<b data-n="' + t.streak + '">' + t.streak + '</b><small>Chuỗi ngày</small></div>' +
      '<div class="st st--xp">' + icon('star', 18) + '<b data-n="' + t.xp + '">' + t.xp + '</b><small>Tổng XP</small></div>' +
      '<div class="st st--ins">' + icon('bulb', 18) + '<b data-n="' + t.ins + '">' + t.ins + '</b><small>Insight</small></div>' +
      '</div><p class="hero__today">' + icon('clock', 15) + (t.todayMin ? ' Hôm nay bạn đã học và rèn luyện ' + t.todayMin + ' phút. Giữ chuỗi nhé!' : (t.streak ? ' Học hôm nay để giữ chuỗi ' + t.streak + ' ngày.' : ' Học vài phút mỗi ngày để bắt đầu chuỗi ngày học.')) + '</p></section>' +
      routineHTML() +
      (W.PSLich ? W.PSLich.cardHTML() : '') +
      '<div style="--i:1">' + nudge() + '</div>' +
      '<h2 class="sec" style="--i:2">Khóa học của bạn</h2>' +
      '<div class="mlist">' + mods.map(cardHTML).join('') + '</div>' +
      guidesHTML() +
      '<footer class="hfoot">' + esc(CFG.ORG) + '<br>' + esc(CFG.APP) + ' ' + esc(CFG.APP_VER) + ' · Bài làm lưu trên máy này</footer>' +
      '</div>';
  }

  /* thẻ hướng dẫn (cao bằng nửa thẻ khóa): CFG.GUIDES */
  function guidesHTML() {
    var g = CFG.GUIDES || []; if (!g.length) return '';
    return '<div class="glist" style="--i:7">' + g.map(function (x) {
      var mc = x.color || '#24307A', soon = x.state !== 'ready';
      var tag = soon ? 'div' : 'a href="' + esc(PS.url(x.href || '')) + '"';
      return '<' + tag + ' class="gcard' + (soon ? ' gcard--soon' : '') + '" style="--mc:' + esc(mc) + ';--ml:' + mix(mc, '#FFFFFF', 0.18) + ';--md:' + mix(mc, '#0B1233', 0.28) + ';--mt:' + mix(mc, '#FFFFFF', 0.9) + '">' +
        '<span class="gcard__ic">' + icon(x.icon, 24, 2) + '</span><span class="gcard__tx"><span class="mcard__code">' + esc(x.code || 'HƯỚNG DẪN') + '</span><b>' + esc(x.title) + '</b><small>' + esc(x.sub) + '</small></span>' +
        (soon ? '<span class="gcard__soon">Sắp có</span>' : icon('next', 18)) + '</' + (soon ? 'div' : 'a') + '>';
    }).join('') + '</div>';
  }

  /* ---------------- Cổng mật khẩu ---------------- */
  var gateErr = 0;
  function openMod(id) {
    var m = PS.mod(id); if (!m) return;
    if (m.state === 'soon') { PS.toast('Khóa <b>' + esc(m.title) + '</b> đang được xây dựng.'); return; }
    if (PS.isUnlocked(id)) { go(id); return; }
    gateErr = 0;
    PS.dialog({
      icon: 'lock', title: 'Mở khóa ' + esc(m.title),
      html: '<p>Trả lời câu hỏi thầy cô đọc trên lớp:</p><p class="gate__q">' + esc(m.gateQ || 'Mật khẩu của khóa học là gì?') + '</p>' +
        '<input class="ps-inp" id="gateIn" maxlength="30" autocomplete="off" autocapitalize="off" placeholder="Câu trả lời"><p class="gate__err" id="gateErr" role="alert"></p>',
      onOpen: function (ov) {
        var inp = ov.querySelector('#gateIn');
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.keyCode === 13) { e.preventDefault(); ov.querySelector('[data-psdlg="0"]').click(); } });
      },
      buttons: [
        { t: 'Mở khóa', cls: 'ps-btn--go', fn: function (ov) {
          var v = ov.querySelector('#gateIn').value;
          if (PS.tryPass(id, v)) { PS.toast('Đã mở khóa <b>' + esc(m.title) + '</b>!'); setTimeout(function () { go(id); }, 500); return true; }
          gateErr++;
          var box = ov.querySelector('.ps-ov__box'); box.classList.remove('shake'); void box.offsetWidth; if (!noMotion) box.classList.add('shake');
          ov.querySelector('#gateErr').textContent = gateErr > 1 ? 'Thử lại nhé. Nếu chưa nhớ, hỏi thầy cô đang hướng dẫn lớp mình.' : 'Thử lại nhé.';
          return false;
        } },
        { t: 'Để sau', cls: 'ps-btn--soft' }
      ]
    });
  }
  function go(id) {
    if (!PS.isUnlocked(id)) return;
    D.body.classList.add('leaving');
    setTimeout(function () { PS.open(id); }, noMotion ? 0 : 180);
  }

  /* ---------------- Cài đặt ---------------- */
  function openSettings() {
    var ov = D.createElement('div'); ov.className = 'sheet'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Cài đặt');
    ov.innerHTML = '<div class="sheet__in"><div class="sheet__top"><h2>Cài đặt</h2><button type="button" class="sheet__x" data-act="closeSet" aria-label="Đóng">' + icon('close', 20) + '</button></div><div id="setBody">' + PS.settingsHTML({ ctx: 'hub' }) + '</div></div>';
    D.body.appendChild(ov); D.body.classList.add('ps-lock');
    PS.wireSettings(ov.querySelector('#setBody'), { ctx: 'hub' });
  }
  function closeSettings() { var s = D.querySelector('.sheet'); if (s) s.parentNode.removeChild(s); D.body.classList.remove('ps-lock'); render(false); }

  /* ---------------- vẽ, sự kiện ---------------- */
  function render(enter) {
    APP.innerHTML = PS.needProfile() ? vWelcome() : vHome();
    if (!enter || noMotion) Array.prototype.forEach.call(APP.querySelectorAll('.enter'), function (e) { e.classList.remove('enter'); });
    if (PS.pwaRefresh) PS.pwaRefresh();
  }
  D.addEventListener('click', function (e) {
    var b = PS.closest(e.target, '[data-act]'); if (!b) return;
    var a = b.getAttribute('data-act');
    if (a === 'onbGo') onbGo();
    else if (a === 'mod') openMod(b.getAttribute('data-id'));
    else if (a === 'settings') openSettings();
    else if (a === 'closeSet') closeSettings();
    else if (a === 'backup') PS.backup();
    else if (a === 'restore') PS.restorePick();
  });
  D.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.keyCode === 13) && PS.closest(e.target, '.onb__form') && e.target.tagName === 'INPUT') { e.preventDefault(); onbGo(); }
    if ((e.key === 'Escape' || e.keyCode === 27) && D.querySelector('.sheet:not(.sheet--lc)') && !D.querySelector('.ps-ov')) closeSettings();
  });
  W.addEventListener('ps:change', function (e) { if (e.detail && (e.detail.field === 'backup') && !D.querySelector('.sheet')) render(false); });
  var hbT = null;
  W.addEventListener('scroll', function () {
    if (hbT) return;
    hbT = setTimeout(function () { hbT = null; var hb = D.querySelector('.hbar'); if (hb) { if ((W.pageYOffset || 0) > 8) hb.classList.add('is-scrolled'); else hb.classList.remove('is-scrolled'); } }, 60);
  }, { passive: true });
  W.addEventListener('pageshow', function (e) { if (e.persisted) { D.body.classList.remove('leaving'); render(false); } });

  W.PSHubRender = function () { if (!PS.needProfile()) render(false); };
  /* trạng thái lịch học (Đang học, Còn … phút) tự cập nhật mỗi phút */
  setInterval(function () {
    var c = D.querySelector('.lc'); if (!c || !W.PSLich || D.hidden) return;
    var t = D.createElement('div'); t.innerHTML = W.PSLich.cardHTML(); var n = t.firstChild; if (n) { n.style.cssText = c.style.cssText; c.parentNode.replaceChild(n, c); }
  }, 60000);
  if (doorNeeded()) {
    try { W.sessionStorage.setItem('ps.door', PS.today()); } catch (e) {}
    W.location.replace(PS.url('routine/index.html') + '?door=1');
    return;
  }
  render(true);
  /* ?lich=1 mở tấm Lịch học; ?lich=nhac mở phần giờ tự học (link từ các khóa) */
  if (QS.lich && !PS.needProfile() && W.PSLich) { try { history.replaceState(null, '', location.pathname); } catch (e) {} setTimeout(function () { W.PSLich.open(QS.lich === 'nhac' ? 'nhac' : '', W.PSHubRender); }, 300); }
  /* Đến từ module chưa đủ điều kiện (?m=id): hỏi thông tin trước, rồi mở cổng */
  if (WANT && !PS.needProfile()) { var w0 = WANT; WANT = ''; setTimeout(function () { openMod(w0); }, 350); }
})(window, document);
