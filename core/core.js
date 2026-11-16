/* =========================================================
   PROSKILLS · LÕI CHUNG (core.js)
   Dùng chung cho trang chủ và mọi module. Ít khi sửa.
   Phụ trách: hồ sơ học viên, mật khẩu module, nơi lưu bài từng module,
   tổng XP / chuỗi ngày, sao lưu – khôi phục tất cả, xóa một module,
   thẻ Cài đặt chuẩn, nút về trang chính, hộp thoại, thông báo.
   Quy ước lưu trữ (localStorage, mọi khóa bắt đầu bằng "ps."):
     ps.profile        hồ sơ chung
     ps.unlock         {idModule: thời điểm mở cổng}
     ps.settings       {snd:1|0, lastBackup}
     ps.mod.<id>       bài làm của module (module tự quản lý nội dung)
     ps.mod.<id>.xxx   khóa phụ của module (vẫn thuộc module đó)
     ps.sum.<id>       bản tóm tắt module tự báo: xp, ins, done, total, days
     ps.days           nhật ký ngày học chung {ngày: {idModule: phút}} để tính chuỗi ngày
     ps.demo.<id>      dữ liệu demo giáo viên (không sao lưu)
   Không bao giờ dùng localStorage.clear(): cùng tên miền github.io còn
   có các website khác của cùng tài khoản.
   JavaScript kiểu cũ (ES5) để chạy trên iPhone đời cũ.
   ========================================================= */
(function (W, D) {
  'use strict';
  var CFG = W.PS_CONFIG || { APP: 'Proskills', APP_VER: '?', MODULES: [], TEACHERS: [], PATHS: [] };
  var CORE_VER = '1.1.2';
  var PS = { CORE_VER: CORE_VER, cfg: CFG };

  /* ---------- đường dẫn gốc (thư mục chứa index.html trang chủ) ---------- */
  PS.root = (function () {
    var ss = D.getElementsByTagName('script');
    for (var i = 0; i < ss.length; i++) {
      var src = ss[i].getAttribute('src') || '';
      var k = src.indexOf('core/core.js');
      if (k >= 0) return src.slice(0, k) || './';
    }
    return './';
  })();
  PS.url = function (p) { return PS.root + (p || ''); };

  /* ---------- tiện ích ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) {
    s = String(s || '').toLowerCase();
    if (s.normalize) s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
    return s.replace(/đ/g, 'd').replace(/[^a-z0-9぀-ヿ]/g, '');
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dkey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return dkey(new Date()); }
  function fmtDate(t) { var d = new Date(t || Date.now()); return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear(); }
  function fmtTime(t) { var d = new Date(t || Date.now()); return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function $(q, r) { return (r || D).querySelector(q); }
  function $$(q, r) { return Array.prototype.slice.call((r || D).querySelectorAll(q)); }
  function closest(el, sel) {
    while (el && el.nodeType === 1) {
      if ((el.matches || el.msMatchesSelector || el.webkitMatchesSelector).call(el, sel)) return el;
      el = el.parentNode;
    }
    return null;
  }
  PS.esc = esc; PS.norm = norm; PS.today = today; PS.dkey = dkey; PS.fmtDate = fmtDate; PS.fmtTime = fmtTime; PS.closest = closest;

  /* ---------- lưu trữ ---------- */
  var MEM = {}; /* dự phòng khi trình duyệt chặn lưu trữ */
  PS.storageOK = (function () { try { localStorage.setItem('ps.__t', '1'); localStorage.removeItem('ps.__t'); return true; } catch (e) { return false; } })();
  function rawGet(k) { try { return PS.storageOK ? localStorage.getItem(k) : (MEM.hasOwnProperty(k) ? MEM[k] : null); } catch (e) { return null; } }
  function rawSet(k, v) { try { if (PS.storageOK) localStorage.setItem(k, v); else MEM[k] = v; return true; } catch (e) { return false; } }
  function rawDel(k) { try { if (PS.storageOK) localStorage.removeItem(k); else delete MEM[k]; } catch (e) {} }
  function allKeys() {
    var out = [];
    try { if (PS.storageOK) { for (var i = 0; i < localStorage.length; i++) out.push(localStorage.key(i)); } else { for (var k in MEM) out.push(k); } } catch (e) {}
    return out;
  }
  function get(k, def) { var r = rawGet(k); if (r == null) return def; try { return JSON.parse(r); } catch (e) { return def; } }
  function set(k, v) { return rawSet(k, JSON.stringify(v)); }
  PS.get = get; PS.set = set;

  /* ---------- module ---------- */
  PS.modules = function () { return CFG.MODULES || []; };
  PS.mod = function (id) { var m = PS.modules(); for (var i = 0; i < m.length; i++) if (m[i].id === id) return m[i]; return null; };
  PS.modKey = function (id) { return 'ps.mod.' + id; };
  PS.load = function (id) { return get(PS.modKey(id), null); };
  PS.save = function (id, obj) { obj = obj || {}; obj.savedAt = Date.now(); return set(PS.modKey(id), obj); };
  function modKeys(id) {
    var base = PS.modKey(id);
    return allKeys().filter(function (k) { return k === base || k.indexOf(base + '.') === 0; });
  }

  /* ---------- hồ sơ chung ---------- */
  /* Cố định: name, by (năm sinh), sid (mã học viên). Hay đổi: cls (lớp), path (diện), teacher (email). */
  PS.FIXED = ['name', 'by', 'sid'];
  PS.profile = function () {
    var p = get('ps.profile', null) || {};
    return { name: p.name || '', by: p.by || '', sid: p.sid || '', cls: p.cls || '', path: p.path || '', teacher: p.teacher || '', created: p.created || 0, updated: p.updated || 0 };
  };
  PS.setProfile = function (patch) {
    var p = PS.profile();
    for (var k in patch) if (patch.hasOwnProperty(k)) p[k] = typeof patch[k] === 'string' ? patch[k].trim() : patch[k];
    if (!p.created) p.created = Date.now();
    p.updated = Date.now();
    set('ps.profile', p);
    fire('profile');
    return p;
  };
  PS.needProfile = function () { var p = PS.profile(); return !(p.name && p.by && p.cls); };
  PS.given = function () { var n = String(PS.profile().name || '').trim().split(/\s+/); return n[n.length - 1] || 'bạn'; };
  PS.teachers = function () { return CFG.TEACHERS || []; };
  PS.teacher = function () {
    var e = String(PS.profile().teacher || '').toLowerCase(), t = PS.teachers();
    for (var i = 0; i < t.length; i++) if (String(t[i][1]).toLowerCase() === e) return { name: t[i][0], email: t[i][1], intro: t[i][2], pron: t[i][0].indexOf('Thầy') === 0 ? 'thầy' : 'cô' };
    return null;
  };
  PS.checkYear = function (v) { var y = parseInt(v, 10); var now = new Date().getFullYear(); return /^\d{4}$/.test(String(v).trim()) && y >= now - 45 && y <= now - 14; };

  /* ---------- cổng mật khẩu ---------- */
  PS.isUnlocked = function (id) { var u = get('ps.unlock', {}) || {}; return !!u[id]; };
  PS.tryPass = function (id, val) {
    var m = PS.mod(id); if (!m) return false;
    var v = norm(val), ok = false;
    (m.pass || []).forEach(function (p) { if (norm(p) === v) ok = true; });
    if (ok) { var u = get('ps.unlock', {}) || {}; u[id] = Date.now(); set('ps.unlock', u); fire('unlock'); }
    return ok;
  };
  /* Module gọi đầu tiên. Thiếu hồ sơ hoặc chưa qua cổng thì về trang chủ để làm. */
  PS.guard = function (id) {
    if (PS.needProfile() || !PS.isUnlocked(id)) { W.location.replace(PS.url('index.html') + '?m=' + encodeURIComponent(id)); return false; }
    return true;
  };
  PS.home = function () { W.location.href = PS.url('index.html'); };
  PS.open = function (id) { W.location.href = PS.url(id + '/index.html'); };

  /* ---------- điểm, chuỗi ngày (tính chung) ---------- */
  /* Module gọi PS.report(id, {xp, ins, done, total, days, extra}) mỗi lần lưu.
     days: {'yyyy-mm-dd': số phút học}. extra: dữ liệu module khác có thể đọc (ví dụ CD01 → CD02). */
  PS.report = function (id, s) {
    s = s || {};
    var old = get('ps.sum.' + id, {}) || {};
    var o = { xp: +s.xp || 0, ins: +s.ins || 0, done: +s.done || 0, total: +s.total || 0, days: s.days || old.days || {}, extra: s.extra || old.extra || null, last: Date.now(), ver: s.ver || '' };
    set('ps.sum.' + id, o);
    /* nhật ký ngày học chung: giữ lại cả khi xóa làm lại một module, để chuỗi ngày không mất */
    var log = get('ps.days', {}) || {}, ch = false;
    for (var k in o.days) if (o.days.hasOwnProperty(k) && o.days[k] > 0) {
      var e = log[k] || (log[k] = {});
      if (!e[id] || o.days[k] > e[id]) { e[id] = o.days[k]; ch = true; }
    }
    if (ch) set('ps.days', log);
    return o;
  };
  PS.summary = function (id) { return get('ps.sum.' + id, null); };
  PS.allDays = function () {
    var log = get('ps.days', {}) || {}, out = {};
    for (var k in log) if (log.hasOwnProperty(k)) { var t = 0; for (var id in log[k]) if (log[k].hasOwnProperty(id)) t += +log[k][id] || 0; if (t > 0) out[k] = t; }
    return out;
  };
  PS.streak = function () {
    var days = PS.allDays(), d = new Date(), n = 0;
    if (!days[dkey(d)]) d.setDate(d.getDate() - 1);
    while (days[dkey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  };
  PS.totals = function () {
    var t = { xp: 0, ins: 0, done: 0, started: 0, streak: PS.streak(), todayMin: 0 };
    PS.modules().forEach(function (m) {
      var s = PS.summary(m.id); if (!s) return;
      t.xp += s.xp || 0; t.ins += s.ins || 0; t.done += s.done || 0;
      if ((s.done || 0) > 0 || (s.xp || 0) > 0) t.started++;
    });
    t.todayMin = Math.round(PS.allDays()[today()] || 0);
    return t;
  };

  /* ---------- cài đặt chung ---------- */
  PS.prefs = function () { return get('ps.settings', {}) || {}; };
  PS.setPref = function (k, v) { var s = PS.prefs(); s[k] = v; set('ps.settings', s); fire(k); };
  PS.soundOn = function () { return PS.prefs().snd !== 0; };

  /* ---------- sự kiện cho module ---------- */
  function fire(field) {
    var ev;
    try { ev = new CustomEvent('ps:change', { detail: { field: field } }); }
    catch (e) { ev = D.createEvent('CustomEvent'); ev.initCustomEvent('ps:change', false, false, { field: field }); }
    W.dispatchEvent(ev);
  }
  PS.fire = fire;

  /* ---------- biểu tượng (nét đơn, vẽ riêng cho Proskills) ---------- */
  var IC = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1.2-3.8 4-5.6 7.5-5.6s6.3 1.8 7.5 5.6"/>',
    people: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19.5c.9-3.3 3.2-5 6-5s5.1 1.7 6 5"/><path d="M15.5 5.6a3 3 0 0 1 0 5.8M18 14.8c1.6.7 2.6 2.2 3 4.7"/>',
    flame: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.1 0-3.4 2.4-5.3 3.6-8.4.4 2.1 1.6 3.3 2.9 3.8-.3-3 1.1-5.6 3.3-7.3-.2 3.3 4.2 5.7 4.2 11.9 0 3.5-3.1 6.1-7.5 6.1z"/>',
    sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',
    mute: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
    save: '<path d="M12 4v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M4.5 19.5h15"/>',
    upload: '<path d="M12 15V4"/><path d="m7.5 8.5 4.5-4.5 4.5 4.5"/><path d="M4.5 19.5h15"/>',
    shield: '<path d="M12 3.5 19 6v5.5c0 4.4-2.9 7.7-7 9-4.1-1.3-7-4.6-7-9V6z"/><path d="m8.8 12 2.2 2.2 4.3-4.4"/>',
    phone: '<rect x="7" y="2.8" width="10" height="18.4" rx="2.4"/><path d="M10.5 18h3"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    trash: '<path d="M4.5 7h15"/><path d="M9.5 7V4.8h5V7"/><path d="M6.5 7l.9 12.7h9.2L17.5 7"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.4"/><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5"/>',
    unlock: '<rect x="5" y="10.5" width="14" height="10" rx="2.4"/><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.3-1.5"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    next: '<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>',
    back: '<path d="M14.5 5.5 8 12l6.5 6.5"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    star: '<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
    bulb: '<path d="M9 17.5h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.7 10.7c.6.5 1 1.3 1 2.1v1.7h5.4v-1.7c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>',
    edit: '<path d="M4.5 19.5h4L19 9a2.8 2.8 0 0 0-4-4L4.5 15.5z"/><path d="m13.5 6.5 4 4"/>',
    rail: '<rect x="6" y="3" width="12" height="13" rx="3"/><path d="M6 10h12M9.5 13.2h.1M14.5 13.2h.1M8.5 16l-2.5 5M15.5 16l2.5 5M7.5 19h9"/>',
    compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z"/>',
    scroll: '<path d="M7 4.5h11a2 2 0 0 1 2 2v1H9"/><path d="M7 4.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5"/><path d="M9 11h7M9 14.5h5"/>',
    spark: '<path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6 6l2.8 2.8M15.2 15.2 18 18M18 6l-2.8 2.8M8.8 15.2 6 18"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    book: '<path d="M4 4.5h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4.5h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1.6"/><path d="M3 9h18v-1.5H3zM12 7.5v12.5M12 7.5c-1.4-2.8-5-3.2-5-1.2 0 1.5 2.6 1.2 5 1.2zM12 7.5c1.4-2.8 5-3.2 5-1.2 0 1.5-2.6 1.2-5 1.2z"/>'
  };
  PS.icon = function (k, sz, sw) {
    sz = sz || 20; sw = sw || 2;
    return '<svg class="ps-ic" width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[k] || IC.spark) + '</svg>';
  };

  /* ---------- thông báo và hộp thoại ---------- */
  var toastT = null;
  PS.toast = function (html, ms) {
    var t = $('#ps-toast');
    if (!t) { t = D.createElement('div'); t.id = 'ps-toast'; t.className = 'ps-toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); D.body.appendChild(t); }
    t.innerHTML = html; t.className = 'ps-toast show';
    clearTimeout(toastT); toastT = setTimeout(function () { t.className = 'ps-toast'; }, ms || 3800);
  };
  var dlgStack = [];
  /* PS.dialog({title, html, buttons:[{t, cls, fn, keep}], onOpen, onClose}) – fn trả false để giữ hộp thoại */
  PS.dialog = function (o) {
    var ov = D.createElement('div'); ov.className = 'ps-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    var btns = (o.buttons || [{ t: 'Đóng', cls: 'ps-btn--soft' }]);
    ov.innerHTML = '<div class="ps-ov__box' + (o.wide ? ' ps-ov__box--wide' : '') + '">' +
      (o.icon ? '<div class="ps-ov__ic">' + PS.icon(o.icon, 26) + '</div>' : '') +
      (o.title ? '<h3 class="ps-ov__t">' + o.title + '</h3>' : '') +
      '<div class="ps-ov__b">' + (o.html || '') + '</div>' +
      '<div class="ps-ov__btns">' + btns.map(function (b, i) { return '<button type="button" class="ps-btn ' + (b.cls || '') + '" data-psdlg="' + i + '">' + b.t + '</button>'; }).join('') + '</div></div>';
    function close() { if (!ov.parentNode) return; ov.parentNode.removeChild(ov); dlgStack.pop(); D.body.classList.toggle('ps-lock', dlgStack.length > 0); if (o.onClose) o.onClose(); }
    ov.addEventListener('click', function (e) {
      var b = closest(e.target, '[data-psdlg]');
      if (b) { var spec = btns[+b.getAttribute('data-psdlg')]; var r = spec.fn ? spec.fn(ov) : true; if (r !== false) close(); return; }
      if (e.target === ov && o.dismiss !== false) close();
    });
    D.body.appendChild(ov); dlgStack.push(close); D.body.classList.add('ps-lock');
    if (o.onOpen) o.onOpen(ov);
    var f = $('input,select,button', ov); if (f && f.focus) { try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }
    return close;
  };
  D.addEventListener('keydown', function (e) { if ((e.key === 'Escape' || e.keyCode === 27) && dlgStack.length) { dlgStack[dlgStack.length - 1](); } });

  /* ---------- bản demo giáo viên (một mật khẩu cho mọi module: CFG.DEMO_PASS) ----------
     Module: var q = PS.demoParam(); q.on = link có ?demo; nếu PS.checkDemo(q.val) thì vào demo ngay,
     nếu không thì PS.demoAsk(function (ok) {...}) để hỏi mật khẩu. Dữ liệu demo lưu ở ps.demo.<id>, không báo điểm. */
  PS.checkDemo = function (v) { return !!CFG.DEMO_PASS && String(v == null ? '' : v).replace(/^\s+|\s+$/g, '') === CFG.DEMO_PASS; };
  PS.demoParam = function () {
    /* đọc từ cả địa chỉ để giữ được dấu # nếu thầy cô gõ thẳng mật khẩu vào link */
    var h = String(W.location.href), i = h.indexOf('?'); if (i < 0) return { on: false, val: '' };
    var m = /(?:^|&)demo(?:=([^&]*))?(?:&|$)/.exec(h.slice(i + 1)); if (!m) return { on: false, val: '' };
    var v = m[1] || ''; try { v = decodeURIComponent(v); } catch (e) {}
    return { on: true, val: v };
  };
  PS.demoAsk = function (done) {
    var decided = false;
    function fin(ok) { if (decided) return; decided = true; done(ok); }
    PS.dialog({
      icon: 'lock', title: 'Bản demo cho giáo viên', dismiss: false,
      html: '<p class="ps-small">Bản demo là một học viên giả định đã học xong, không đụng bài làm thật trên máy.</p>' +
        '<div class="ps-form"><label>Mật khẩu demo<input class="ps-inp" id="psDemoIn" type="password" maxlength="40" autocomplete="off" autocapitalize="off" spellcheck="false"></label></div><p class="ps-warn" id="psDemoErr" style="display:none" role="alert"></p>',
      onOpen: function (ov) {
        $('#psDemoIn', ov).addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.keyCode === 13) { e.preventDefault(); $('[data-psdlg="0"]', ov).click(); } });
      },
      onClose: function () { fin(false); },
      buttons: [
        { t: 'Mở demo', cls: 'ps-btn--go', fn: function (ov) {
          if (PS.checkDemo($('#psDemoIn', ov).value)) { fin(true); return true; }
          var er = $('#psDemoErr', ov); er.style.display = ''; er.textContent = 'Chưa đúng mật khẩu. Lưu ý chữ hoa, chữ thường.'; return false;
        } },
        { t: 'Thôi', cls: 'ps-btn--soft' }
      ]
    });
  };

  /* ---------- sao lưu – khôi phục (tất cả module) ---------- */
  PS.backupData = function () {
    var mods = {};
    PS.modules().forEach(function (m) {
      var keys = modKeys(m.id); if (!keys.length && !PS.summary(m.id)) return;
      var raw = {}; keys.forEach(function (k) { raw[k] = rawGet(k); });
      mods[m.id] = { title: m.title, keys: raw, sum: PS.summary(m.id) };
    });
    return { kind: 'proskills-backup', v: 1, app: CFG.APP, appVer: CFG.APP_VER, at: Date.now(), profile: PS.profile(), unlock: get('ps.unlock', {}), settings: PS.prefs(), days: get('ps.days', {}), mods: mods };
  };
  PS.download = function (name, text, type) {
    try {
      var blob = new Blob([text], { type: type || 'application/json' });
      if (W.navigator.msSaveBlob) { W.navigator.msSaveBlob(blob, name); return true; }
      var a = D.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; D.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); if (a.parentNode) a.parentNode.removeChild(a); }, 1500);
      return true;
    } catch (e) { return false; }
  };
  PS.backup = function () {
    fire('beforeBackup'); /* module lưu ngay bài đang làm */
    var data = PS.backupData(), p = data.profile;
    var nm = ('Proskills_' + norm(p.name).slice(0, 24) + '_' + norm(p.cls) + '_' + today()).replace(/_+/g, '_') + '.json';
    if (PS.download(nm, JSON.stringify(data))) {
      PS.setPref('lastBackup', Date.now());
      PS.toast('Đã tải tập tin sao lưu <b>' + esc(nm) + '</b>. Giữ tập tin này cẩn thận nhé.', 5200);
      fire('backup');
    } else PS.toast('Chưa tải được tập tin. Thử mở bằng Chrome hoặc Safari nhé.');
  };
  function countDone(entry) { return entry && entry.sum ? (entry.sum.done || 0) : 0; }
  PS.restorePick = function () {
    var inp = D.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json'; inp.style.display = 'none';
    inp.addEventListener('change', function () {
      var f = inp.files && inp.files[0]; if (!f) return;
      var rd = new FileReader();
      rd.onload = function () { var o = null; try { o = JSON.parse(rd.result); } catch (e) {} PS.restoreAsk(o); };
      rd.readAsText(f);
      if (inp.parentNode) inp.parentNode.removeChild(inp);
    });
    D.body.appendChild(inp); inp.click();
  };
  PS.restoreAsk = function (o) {
    if (!o || o.kind !== 'proskills-backup' || !o.mods) { PS.toast('Tập tin này không phải bản sao lưu của Proskills.'); return; }
    var ids = Object.keys(o.mods);
    var list = '<label class="ps-chk"><input type="checkbox" data-r="profile" checked><span><b>Thông tin học viên</b><small>' + esc(o.profile && o.profile.name || '') + (o.profile && o.profile.cls ? ' · Lớp ' + esc(o.profile.cls) : '') + '</small></span></label>' +
      ids.map(function (id) {
        var e = o.mods[id], m = PS.mod(id), total = (e.sum && e.sum.total) || (m && m.total) || 0;
        return '<label class="ps-chk"><input type="checkbox" data-r="' + esc(id) + '" checked' + (m ? '' : ' disabled') + '><span><b>' + esc((m && m.title) || e.title || id) + '</b><small>' + (m ? countDone(e) + (total ? '/' + total : '') + ' hoạt động' : 'Module không còn trong bản này') + '</small></span></label>';
      }).join('');
    PS.dialog({
      icon: 'upload', title: 'Khôi phục bài làm',
      html: '<p>Bản sao lưu ngày <b>' + fmtDate(o.at) + '</b> lúc ' + fmtTime(o.at) + '. Chọn phần muốn khôi phục:</p><div class="ps-chks">' + list + '</div><p class="ps-small">Phần được chọn sẽ <b>thay</b> bài làm đang có trên máy này. Phần không chọn giữ nguyên.</p>',
      buttons: [
        { t: 'Khôi phục', cls: 'ps-btn--go', fn: function (ov) {
          var picked = $$('input[data-r]', ov).filter(function (c) { return c.checked && !c.disabled; }).map(function (c) { return c.getAttribute('data-r'); });
          if (!picked.length) { PS.toast('Bạn chưa chọn phần nào.'); return false; }
          PS.restoreApply(o, picked); return true;
        } },
        { t: 'Để sau', cls: 'ps-btn--soft' }
      ]
    });
  };
  PS.restoreApply = function (o, picked) {
    fire('beforeRestore');
    W.PS_NOSAVE = 1; /* module không ghi đè sau khi khôi phục */
    picked.forEach(function (id) {
      if (id === 'profile') {
        if (o.profile) set('ps.profile', o.profile);
        if (o.days) { /* gộp nhật ký ngày học, lấy số lớn hơn */
          var log = get('ps.days', {}) || {};
          for (var d in o.days) if (o.days.hasOwnProperty(d)) { var e = log[d] || (log[d] = {}); for (var m in o.days[d]) if (o.days[d].hasOwnProperty(m) && (!e[m] || o.days[d][m] > e[m])) e[m] = o.days[d][m]; }
          set('ps.days', log);
        }
        return;
      }
      var e = o.mods[id]; if (!e) return;
      modKeys(id).forEach(rawDel);
      for (var k in e.keys) if (e.keys.hasOwnProperty(k) && e.keys[k] != null && (k === PS.modKey(id) || k.indexOf(PS.modKey(id) + '.') === 0)) rawSet(k, e.keys[k]);
      if (e.sum) set('ps.sum.' + id, e.sum);
      var u = get('ps.unlock', {}) || {}; if (o.unlock && o.unlock[id]) { u[id] = o.unlock[id]; set('ps.unlock', u); }
    });
    PS.toast('Đã khôi phục. Đang mở lại…');
    setTimeout(function () { W.location.reload(); }, 900);
  };

  /* ---------- xóa ---------- */
  PS.resetModule = function (id) {
    W.PS_NOSAVE = 1;
    modKeys(id).forEach(rawDel); rawDel('ps.sum.' + id);
    fire('reset');
  };
  PS.resetAll = function () {
    W.PS_NOSAVE = 1;
    allKeys().filter(function (k) { return k && k.indexOf('ps.') === 0; }).forEach(rawDel);
    fire('resetAll');
  };
  PS.askReset = function (id, after) {
    var m = PS.mod(id), name = m ? m.title : id;
    PS.dialog({
      icon: 'trash', title: 'Xóa bài làm ' + esc(name) + '?',
      html: '<p>Chỉ xóa bài làm, điểm và con dấu của <b>' + esc(name) + '</b> trên máy này. Thông tin của bạn và các module khác giữ nguyên.</p><p class="ps-small">Nên tải bản sao lưu trước. Đã xóa thì không lấy lại được nếu không có bản sao lưu.</p>',
      buttons: [
        { t: PS.icon('save', 18) + ' Tải sao lưu trước', cls: 'ps-btn--soft', fn: function () { PS.backup(); return false; } },
        { t: 'Xóa và làm lại', cls: 'ps-btn--danger', fn: function () { PS.resetModule(id); PS.toast('Đã xóa bài làm ' + esc(name) + '.'); setTimeout(function () { if (after) after(); else W.location.reload(); }, 700); } },
        { t: 'Thôi', cls: 'ps-btn--soft' }
      ]
    });
  };
  PS.askResetAll = function () {
    PS.dialog({
      icon: 'trash', title: 'Xóa toàn bộ dữ liệu?',
      html: '<p>Xóa thông tin của bạn và bài làm của <b>tất cả module</b> trên máy này.</p><label class="ps-chk"><input type="checkbox" id="psAllOk"><span><b>Tôi đã sao lưu hoặc chắc chắn muốn xóa</b></span></label>',
      buttons: [
        { t: 'Xóa toàn bộ', cls: 'ps-btn--danger', fn: function (ov) { if (!$('#psAllOk', ov).checked) { PS.toast('Đánh dấu ô xác nhận trước nhé.'); return false; } PS.resetAll(); setTimeout(function () { W.location.href = PS.url('index.html'); }, 500); } },
        { t: 'Thôi', cls: 'ps-btn--soft' }
      ]
    });
  };

  /* ---------- toàn màn hình ---------- */
  PS.fsOK = function () { return !!(D.fullscreenEnabled || D.webkitFullscreenEnabled); };
  PS.toggleFull = function () {
    var el = D.documentElement;
    try {
      if (D.fullscreenElement || D.webkitFullscreenElement) { (D.exitFullscreen || D.webkitExitFullscreen).call(D); }
      else { (el.requestFullscreen || el.webkitRequestFullscreen).call(el); }
    } catch (e) { PS.toast('Máy này chưa hỗ trợ toàn màn hình.'); }
  };

  /* =========================================================
     THẺ CÀI ĐẶT CHUẨN – giống nhau ở trang chủ và mọi module
     Thứ tự cố định:
       Về trang chính (chỉ trong module) · Thông tin của bạn · Thầy cô hướng dẫn ·
       Nhịp học và lời nhắc (nếu module có) · Âm thanh · [mục riêng của module] ·
       Sao lưu và khôi phục · Cài ứng dụng, toàn màn hình · Xóa bài làm (đỏ, cuối)
     opts = { ctx:'hub'|'module', mod:'id', pace:{status, body}, extra:[{k, ic, title, status, body}] }
     ========================================================= */
  function row(k, ic, title, status, body, cls) {
    return '<div class="ps-srow ' + (cls || '') + '" data-k="' + k + '"><button type="button" class="ps-srow__h" data-psact="row" aria-expanded="false"><span class="ps-srow__ic">' + PS.icon(ic, 18) + '</span><b>' + title + '</b><span class="ps-srow__st">' + (status || '') + '</span>' + PS.icon('next', 16) + '</button><div class="ps-srow__b">' + body + '</div></div>';
  }
  function infoBody() {
    var p = PS.profile();
    var fixed = '<div class="ps-fixed"><div><small>Họ và tên</small><b>' + esc(p.name || '—') + '</b></div><div><small>Năm sinh</small><b>' + esc(p.by || '—') + '</b></div><div><small>Mã học viên</small><b>' + esc(p.sid || 'Chưa có') + '</b></div></div>' +
      '<button type="button" class="ps-link" data-psact="editFixed">' + PS.icon('edit', 15) + ' Sửa họ tên, năm sinh, mã học viên</button>';
    var opts = (CFG.PATHS || []).map(function (x) { return '<option' + (p.path === x ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('');
    var change = '<div class="ps-form ps-row2"><label>Lớp<input class="ps-inp" data-psset="cls" maxlength="20" value="' + esc(p.cls) + '"></label>' +
      '<label>Diện<select class="ps-inp" data-psset="path"><option value="">Chọn diện</option>' + opts + '</select></label></div><p class="ps-small">Lớp và diện có thể đổi khi bạn chuyển lớp. Thông tin dùng chung cho mọi module.</p>';
    return fixed + change;
  }
  PS.teacherSelect = function (attr) {
    var cur = String(PS.profile().teacher || '').toLowerCase();
    return '<select class="ps-inp" ' + attr + '><option value="">Chọn thầy cô</option>' + PS.teachers().map(function (t) { return '<option value="' + esc(t[1]) + '"' + (String(t[1]).toLowerCase() === cur ? ' selected' : '') + '>' + esc(t[0]) + '</option>'; }).join('') + '</select>';
  };
  PS.settingsHTML = function (opts) {
    opts = opts || {};
    var ctx = opts.ctx || 'module', m = opts.mod ? PS.mod(opts.mod) : null, p = PS.profile(), t = PS.teacher();
    var lb = PS.prefs().lastBackup;
    var h = '<div class="ps-set">';
    if (ctx === 'module') h += '<button type="button" class="ps-homebtn" data-psact="home">' + PS.icon('home', 20) + '<span><b>Về trang chính ' + esc(CFG.APP) + '</b><small>Chọn module khác, xem tổng điểm</small></span>' + PS.icon('next', 16) + '</button>';
    h += row('info', 'user', 'Thông tin của bạn', esc(p.name ? PS.given() + (p.cls ? ' · ' + p.cls : '') : 'Chưa nhập'), infoBody());
    h += row('tch', 'people', 'Thầy cô hướng dẫn', t ? esc(t.name) : 'Chưa chọn', '<div class="ps-form"><label>Thầy cô hướng dẫn lớp bạn' + PS.teacherSelect('data-psset="teacher"') + '</label></div><p class="ps-small">Dùng khi gửi báo cáo qua Teams. Đổi khi bạn chuyển lớp.</p>');
    if (opts.pace) h += row('pace', 'flame', 'Nhịp học và lời nhắc', opts.pace.status || '', opts.pace.body || '');
    h += '<div class="ps-srow ps-srow--sw"><div class="ps-srow__h"><span class="ps-srow__ic">' + PS.icon(PS.soundOn() ? 'sound' : 'mute', 18) + '</span><b>Âm thanh</b><button type="button" class="ps-sw' + (PS.soundOn() ? ' on' : '') + '" data-psact="snd" role="switch" aria-checked="' + PS.soundOn() + '" aria-label="Âm thanh"><i></i></button></div></div>';
    (opts.extra || []).forEach(function (x) { h += row(x.k, x.ic || 'spark', x.title, x.status || '', x.body || ''); });
    h += row('safe', 'shield', 'Sao lưu và khôi phục', lb ? 'Lần cuối ' + fmtDate(lb) : 'Chưa sao lưu',
      '<p class="ps-small">Một tập tin chứa <b>thông tin của bạn và bài làm của tất cả module</b>. Khi đổi máy, xóa dữ liệu trình duyệt hay chuyển sang ứng dụng, chọn Khôi phục rồi mở lại tập tin đó.</p>' +
      '<div class="ps-btnrow"><button type="button" class="ps-btn ps-btn--sm" data-psact="backup">' + PS.icon('save', 16) + ' Tải sao lưu</button><button type="button" class="ps-btn ps-btn--sm ps-btn--soft" data-psact="restore">' + PS.icon('upload', 16) + ' Khôi phục</button></div>' +
      (PS.storageOK ? '' : '<p class="ps-warn">Trình duyệt này đang chặn lưu bài. Bài chỉ giữ khi trang còn mở, hãy tải sao lưu trước khi tắt.</p>'));
    h += row('app', 'phone', 'Cài ứng dụng, toàn màn hình', '',
      '<div class="ps-btnrow"><button type="button" class="ps-btn ps-btn--sm" data-pwa="install">' + PS.icon('save', 16) + '<span data-pwa-label>Cài ứng dụng</span></button>' + (PS.fsOK() ? '<button type="button" class="ps-btn ps-btn--sm ps-btn--soft" data-psact="full">' + PS.icon('expand', 16) + ' Toàn màn hình</button>' : '') + '</div>' +
      '<p class="ps-small"><b>iPhone:</b> mở bằng Safari, chạm Chia sẻ, chọn "Thêm vào MH chính".<br><b>Android:</b> mở bằng Chrome, chạm dấu ⋮, chọn "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính".<br>Một ứng dụng ' + esc(CFG.APP) + ' dùng cho mọi module.</p>');
    if (ctx === 'module' && m) h += row('reset', 'trash', 'Xóa bài làm ' + esc(m.title), '', '<p class="ps-small">Chỉ xóa bài làm của module này. Thông tin của bạn và các module khác giữ nguyên.</p><div class="ps-btnrow"><button type="button" class="ps-btn ps-btn--sm ps-btn--dangersoft" data-psact="reset">' + PS.icon('trash', 16) + ' Xóa bài làm module này</button></div>', 'ps-srow--danger');
    else h += row('reset', 'trash', 'Xóa toàn bộ dữ liệu', '', '<p class="ps-small">Xóa thông tin và bài làm của tất cả module trên máy này. Muốn làm lại một module, vào Cài đặt của module đó.</p><div class="ps-btnrow"><button type="button" class="ps-btn ps-btn--sm ps-btn--dangersoft" data-psact="resetAll">' + PS.icon('trash', 16) + ' Xóa toàn bộ</button></div>', 'ps-srow--danger');
    h += '<p class="ps-ver">' + esc(CFG.APP) + ' ' + esc(CFG.APP_VER) + (m ? ' · ' + esc(m.code) + ' ' + esc(opts.ver || m.ver || '') : '') + '</p></div>';
    return h;
  };
  /* Gắn sự kiện cho thẻ Cài đặt. Gọi lại mỗi lần vẽ lại. opts.onChange(field) để module vẽ lại phần liên quan. */
  PS.wireSettings = function (rootEl, opts) {
    opts = opts || {};
    if (!rootEl || rootEl.__psWired) return; rootEl.__psWired = 1;
    rootEl.addEventListener('click', function (e) {
      var b = closest(e.target, '[data-psact]'); if (!b || !rootEl.contains(b)) return;
      var a = b.getAttribute('data-psact');
      if (a === 'row') {
        var r = closest(b, '.ps-srow'), open = !r.classList.contains('open');
        $$('.ps-srow.open', rootEl).forEach(function (x) { x.classList.remove('open'); $('.ps-srow__h', x).setAttribute('aria-expanded', 'false'); });
        if (open) { r.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
      } else if (a === 'home') PS.home();
      else if (a === 'snd') { PS.setPref('snd', PS.soundOn() ? 0 : 1); b.classList.toggle('on', PS.soundOn()); b.setAttribute('aria-checked', PS.soundOn()); var ic = $('.ps-srow__ic', closest(b, '.ps-srow')); if (ic) ic.innerHTML = PS.icon(PS.soundOn() ? 'sound' : 'mute', 18); if (opts.onChange) opts.onChange('snd'); }
      else if (a === 'backup') PS.backup();
      else if (a === 'restore') PS.restorePick();
      else if (a === 'full') PS.toggleFull();
      else if (a === 'reset') PS.askReset(opts.mod, opts.afterReset);
      else if (a === 'resetAll') PS.askResetAll();
      else if (a === 'editFixed') PS.editFixed(function () { refreshInfo(rootEl); if (opts.onChange) opts.onChange('profile'); });
    });
    rootEl.addEventListener('change', function (e) {
      var el = e.target, k = el.getAttribute && el.getAttribute('data-psset'); if (!k) return;
      var v = String(el.value || '').trim();
      if (k === 'cls' && !v) { el.value = PS.profile().cls; PS.toast('Lớp không để trống nhé.'); return; }
      var patch = {}; patch[k] = v; PS.setProfile(patch);
      var st = $('.ps-srow[data-k="' + (k === 'teacher' ? 'tch' : 'info') + '"] .ps-srow__st', rootEl);
      if (st) st.innerHTML = k === 'teacher' ? (PS.teacher() ? esc(PS.teacher().name) : 'Chưa chọn') : esc(PS.given() + (PS.profile().cls ? ' · ' + PS.profile().cls : ''));
      PS.toast(k === 'teacher' ? 'Đã lưu thầy cô hướng dẫn.' : 'Đã cập nhật thông tin.');
      if (opts.onChange) opts.onChange(k);
    });
  };
  function refreshInfo(rootEl) {
    var r = $('.ps-srow[data-k="info"]', rootEl); if (!r) return;
    $('.ps-srow__b', r).innerHTML = infoBody();
    $('.ps-srow__st', r).innerHTML = esc(PS.given() + (PS.profile().cls ? ' · ' + PS.profile().cls : ''));
  }
  PS.editFixed = function (done) {
    var p = PS.profile();
    PS.dialog({
      icon: 'edit', title: 'Sửa thông tin cố định',
      html: '<p class="ps-small">Chỉ sửa khi bạn nhập nhầm. Thầy cô dùng các thông tin này để nhận đúng bài của bạn.</p>' +
        '<div class="ps-form"><label>Họ và tên<input class="ps-inp" id="psFxName" maxlength="40" value="' + esc(p.name) + '"></label>' +
        '<div class="ps-row2"><label>Năm sinh<input class="ps-inp" id="psFxBy" inputmode="numeric" maxlength="4" value="' + esc(p.by) + '"></label>' +
        '<label>Mã học viên<input class="ps-inp" id="psFxSid" maxlength="30" value="' + esc(p.sid) + '"></label></div></div>',
      buttons: [
        { t: 'Lưu', cls: 'ps-btn--go', fn: function (ov) {
          var n = $('#psFxName', ov).value.trim(), y = $('#psFxBy', ov).value.trim(), s = $('#psFxSid', ov).value.trim();
          if (n.split(/\s+/).length < 2) { PS.toast('Nhập đủ họ và tên nhé.'); return false; }
          if (!PS.checkYear(y)) { PS.toast('Năm sinh gồm 4 số, ví dụ 2005.'); return false; }
          PS.setProfile({ name: n, by: y, sid: s }); PS.toast('Đã lưu thông tin.'); if (done) done(); return true;
        } },
        { t: 'Thôi', cls: 'ps-btn--soft' }
      ]
    });
  };

  W.PS = PS;
})(window, document);
