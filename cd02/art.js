/* CD02 · cd02/art.js · HÌNH VẼ: biểu tượng, cờ, con thuyền, đảo, la bàn, hải đồ, 8 cảnh bến, con dấu, Shin thuyền trưởng.
   Hình tự vẽ của khóa. Từ PS1.3.39 (CD02.1.1): nét mực đen kiểu sổ tay, tô chấm, một màu nhấn cam đất, 4 tông nhạt theo vòng. ES5. */

/* biểu tượng nét (24×24, stroke currentColor) */
var CD2_IC = {
  anchor: '<circle cx="12" cy="5" r="2"/><path d="M12 7v13"/><path d="M8 11h8"/><path d="M4.5 13.5c.6 4 3.8 6.5 7.5 6.5s6.9-2.5 7.5-6.5"/><path d="M3 15l1.5-1.5L6 15M18 15l1.5-1.5L21 15"/>',
  scope: '<path d="M3 15.5 15 6l2.5 3.2-12 9.5z"/><path d="M14.2 6.6 16 5l3.5 4.4-1.8 1.5"/><path d="M9 16.5 7 21M11 15l3 6"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8z"/>',
  map: '<path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z"/><path d="M9 4v13.5M15 6.5V20"/>',
  wave: '<path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M7 10c0-3 2.5-5.5 5.5-5.5S18 7 18 9.5"/>',
  light: '<path d="M9 21h6M10 21l.8-11h2.4l.8 11"/><path d="M9.5 10h5l-.6-3h-3.8z"/><path d="M12 4.5V3M7 6 5.5 5M17 6l1.5-1"/>',
  flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 3.5 2 3.5H5"/>',
  stairs: '<path d="M3 20h5v-5h5v-5h5V5h3"/>',
  turn: '<path d="M6 20V11a5 5 0 0 1 5-5h7"/><path d="m15 3 3 3-3 3"/>',
  cap: '<path d="M2 9.5 12 5l10 4.5L12 14z"/><path d="M6 11.5V16c1.8 1.6 3.8 2.3 6 2.3s4.2-.7 6-2.3v-4.5"/><path d="M21 10v5"/>',
  wind: '<path d="M3 9h11a3 3 0 1 0-3-3"/><path d="M3 14h15a3 3 0 1 1-3 3"/><path d="M3 19h6"/>',
  speech: '<path d="M4 5h16v10H9l-5 4z"/><path d="M8.5 9h7M8.5 12h4"/>',
  shop: '<path d="M4 10v10h16V10"/><path d="M3 10 5 4h14l2 6c0 1.4-1.1 2.3-2.4 2.3S16.2 11.4 16.2 10c0 1.4-1.1 2.3-2.4 2.3s-2.4-.9-2.4-2.3c0 1.4-1.1 2.3-2.4 2.3S6.6 11.4 6.6 10c0 1.4-1.1 2.3-2.4 2.3"/><path d="M10 20v-5h4v5"/>',
  bridge: '<path d="M2 17h20"/><path d="M4 17V9M20 17V9"/><path d="M4 9c4 0 6 4 8 4s4-4 8-4"/><path d="M8 17v-4M12 17v-4M16 17v-4"/>',
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
  tool: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.4 2.4-2.6-.6-.6-2.6z"/>',
  shield: '<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
  coin: '<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.2c-.5-.8-1.5-1.3-2.8-1.3-1.6 0-2.7.8-2.7 2 0 2.8 5.6 1.5 5.6 4.3 0 1.2-1.2 2-2.9 2-1.4 0-2.5-.6-3-1.5M12 6.5v11"/>',
  people: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19c.6-3 2.7-5 5.5-5s4.9 2 5.5 5"/><circle cx="16.5" cy="9" r="2.4"/><path d="M15.5 14.2c2.5 0 4.3 1.8 5 4.8"/>',
  ship: '<path d="M3 15h18l-2.5 4.5h-13z"/><path d="M12 3v12"/><path d="M12 4 18 12h-6"/><path d="M11 6 6 12h5"/>',
  card: '<rect x="4" y="3" width="16" height="18" rx="3"/><circle cx="12" cy="10" r="3"/><path d="M8 17c.7-1.7 2.2-2.6 4-2.6s3.3.9 4 2.6"/>',
  bottle: '<path d="M10 3h4v3.5l2 3V20a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9.5l2-3z"/><path d="M8 13h8"/>',
  arrowL: '<path d="M15 5 8 12l7 7"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
};
function cdIc(k, sz, sw) {
  sz = sz || 20; sw = sw || 2;
  if (!CD2_IC[k]) return PS.icon(k, sz, sw);
  return '<svg class="ps-ic" width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + CD2_IC[k] + '</svg>';
}


/* ---------- bảng màu chung của hình (đổi ở đây là đổi cả khóa) ---------- */
var CD2_COL = {
  ink: '#141413', clay: '#D97757', clayB: '#C15F3C', clayD: '#B5532F', navy: '#2B3A55',
  peach: '#EBCBB9', lav: '#CBCAD9', sage: '#BCD3CB', khaki: '#DDDAD0', sea: '#DCE6EC', paper: '#FFFDF8', kraft: '#D4A27F'
};
/* tông nền tranh theo vòng: 1 Khám phá · 2 Thiết kế · 3 Ra khơi · cảng */
function roundBg(r) { return r === 1 ? CD2_COL.peach : (r === 2 ? CD2_COL.lav : (r === 3 ? CD2_COL.sage : CD2_COL.khaki)); }
/* tông đảo theo phía: Ở Nhật · Về Việt Nam · Cả hai */
function sideBg(side) { return side === 'jp' ? CD2_COL.sage : (side === 'vn' ? CD2_COL.peach : CD2_COL.lav); }

/* Mẫu tô chấm + nét run tay: chèn một lần vào trang (dùng chung cho mọi hình) */
(function () {
  try {
    var d = document.createElement('div');
    d.innerHTML = '<svg width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><defs>' +
      '<pattern id="cd2dots" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".75" fill="#141413"/><circle cx="3" cy="3" r=".75" fill="#141413"/></pattern>' +
      '<pattern id="cd2dotsL" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r=".7" fill="#141413" opacity=".55"/><circle cx="3.7" cy="3.7" r=".7" fill="#141413" opacity=".55"/></pattern>' +
      '<filter id="cd2rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="1.8"/></filter>' +
      '</defs></svg>';
    document.body.appendChild(d.firstChild);
  } catch (e) {}
})();

/* ---------- nét vẽ cơ bản ---------- */
function aP(d, f, w, x) { return '<path d="' + d + '" fill="' + (f || 'none') + '" stroke="#141413" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round"' + (x || '') + '/>'; }
function aC(cx, cy, r, f, w) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + (f || 'none') + '" stroke="#141413" stroke-width="' + (w || 2) + '"/>'; }
function aR(x, y, w, h, f, sw, rx) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 0) + '" fill="' + (f || 'none') + '" stroke="#141413" stroke-width="' + (sw || 2) + '" stroke-linejoin="round"/>'; }
function aWave(x, y, n, s, o) { var d = 'M' + x + ' ' + y; for (var i = 0; i < n; i++) d += 'q' + s / 2 + ' ' + (-s / 3) + ' ' + s + ' 0'; return '<path d="' + d + '" fill="none" stroke="#141413" stroke-width="1.6" stroke-linecap="round" opacity="' + (o || 1) + '"/>'; }
function aGull(x, y, k) { k = k || 1; return '<path d="M' + x + ' ' + y + 'q' + 4 * k + ' ' + (-5 * k) + ' ' + 8 * k + ' 0q' + 4 * k + ' ' + (-5 * k) + ' ' + 8 * k + ' 0" fill="none" stroke="#141413" stroke-width="1.6" stroke-linecap="round"/>'; }
function aDots(d, o, light) { return '<path d="' + d + '" fill="url(#' + (light ? 'cd2dotsL' : 'cd2dots') + ')" opacity="' + (o == null ? 1 : o) + '"/>'; }

/* Shin thuyền trưởng: gà lớn (core/shin.js), mũ thuyền trưởng + khăn cam đất */
function shinRecolor(s) { return String(s || '').replace(/#0F9F98/g, '#D97757').replace(/#0B6F6A/g, '#B5532F'); }
function shin2(mood, sz, cls) {
  var s = W_PSShin() ? shinRecolor(W_PSShin().svg(mood || 'hi', { stg: 3, fit: 'captain', cls: cls || '' })) : '';
  return '<span class="shin" style="width:' + (sz || 64) + 'px">' + s + '</span>';
}
function W_PSShin() { return window.PSShin || null; }

/* ---------- cờ: 6 tông dịu (PS1.3.39). Cờ cũ màu tươi tự đổi sang tông dịu gần nhất ---------- */
var FLAG_OLD = { '#0F9F98': '#6E9E94', '#2C5BC4': '#5E7FA8', '#E8574A': '#D97757', '#F2B21B': '#D9A84E', '#7A55D3': '#8C82B4', '#2A2118': '#3D3D3A' };
function flagCol(c) { return FLAG_OLD[c] || c || '#D97757'; }
function flagInk(c) { return c === '#D9A84E' ? '#141413' : '#fff'; }
/* biểu tượng trên cờ (vẽ trong hệ 40×40, tâm 20,20) */
function flagSym(k, c) {
  c = c || '#fff';
  switch (k) {
    case 'compass': return '<circle cx="20" cy="20" r="10" fill="none" stroke="' + c + '" stroke-width="2.4"/><path d="M20 9l3 11h-6z" fill="' + c + '"/><path d="M20 31l-3-11h6z" fill="' + c + '" opacity=".55"/>';
    case 'star': return '<path d="M20 8l3.4 7.4 8 .9-6 5.4 1.7 8-7.1-4.1-7.1 4.1 1.7-8-6-5.4 8-.9z" fill="' + c + '"/>';
    case 'sun': return '<circle cx="20" cy="20" r="6.5" fill="' + c + '"/><path d="M20 7v4M20 29v4M7 20h4M29 20h4M10.8 10.8l2.8 2.8M26.4 26.4l2.8 2.8M10.8 29.2l2.8-2.8M26.4 13.6l2.8-2.8" stroke="' + c + '" stroke-width="2.4" stroke-linecap="round"/>';
    case 'whale': return '<path d="M8 22c0-6 5-9 11-9 6.5 0 10 3.5 11 6l3-3-1 7c-1.5 4-6 6-12 6-7 0-12-2-12-7z" fill="' + c + '"/><circle cx="14" cy="20" r="1.4" fill="#141413"/><path d="M18 12q1-4 4-4M18 12q-1-3-3-4" stroke="' + c + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
    case 'wing': return '<path d="M7 24c6-1 10-6 12-13 1 6-1 10-4 13 4-1 8-4 10-9 1 7-4 13-12 14-3 .3-5-1-6-5z" fill="' + c + '"/>';
    case 'flame': return '<path d="M20 7c1 5 7 7 7 14a7 7 0 0 1-14 0c0-4 2-6 4-8 0 3 1 4 3 5-1-4 0-8 0-11z" fill="' + c + '"/>';
    case 'sakura': var p = ''; for (var i = 0; i < 5; i++) p += '<ellipse cx="20" cy="12.5" rx="4.2" ry="6.4" fill="' + c + '" transform="rotate(' + (i * 72) + ' 20 20)"/>'; return p + '<circle cx="20" cy="20" r="2.6" fill="#D9A84E"/>';
    case 'leaf': return '<path d="M10 30c0-13 8-20 21-21-1 13-8 21-21 21z" fill="' + c + '"/><path d="M11 29 25 15" stroke="#141413" stroke-opacity=".25" stroke-width="1.6" stroke-linecap="round"/>';
  }
  return '';
}
/* lá cờ: nền màu học viên chọn, đuôi xẻ, biểu tượng trắng (không dùng mẫu chung: còn dùng để xuất ảnh) */
function flagSVG(sym, col, w, wave) {
  col = flagCol(col); w = w || 120;
  var path = wave ? 'M4 6Q30 0 56 6T108 6L96 30 108 54Q82 48 56 54T4 54Z' : 'M4 6H108L96 30 108 54H4Z';
  return '<svg class="flag" viewBox="0 0 112 60" width="' + w + '" aria-hidden="true"><path d="' + path + '" fill="' + col + '" stroke="#141413" stroke-width="2" stroke-linejoin="round"/>' +
    '<g transform="translate(30 10)">' + flagSym(sym || 'compass', flagInk(col)) + '</g></svg>';
}
/* cờ trên cột (xem trước khi thiết kế) */
function flagMast(sym, col) {
  col = flagCol(col);
  return '<svg class="mast" viewBox="0 0 150 150" aria-hidden="true"><path d="M22 140V14" stroke="#141413" stroke-width="3.4" stroke-linecap="round"/><circle cx="22" cy="12" r="5" fill="#fff" stroke="#141413" stroke-width="1.8"/>' +
    '<g class="flagwave" transform="translate(24 18)"><path d="M0 4Q30 -2 56 4T110 4L98 30 110 56Q82 50 56 56T0 56Z" fill="' + col + '" stroke="#141413" stroke-width="2" stroke-linejoin="round"/>' +
    '<g transform="translate(30 10)">' + flagSym(sym || 'compass', flagInk(col)) + '</g></g>' +
    '<path d="M6 140h60" stroke="#141413" stroke-width="2.4" stroke-linecap="round"/><path d="M10 146q6-4 12 0t12 0 12 0" fill="none" stroke="#141413" stroke-width="1.4" stroke-linecap="round" opacity=".5"/></svg>';
}

/* ---------- con thuyền: lớn dần theo số bến đã ghé (0–6) ----------
   0 thuyền nhỏ một buồm · 2 thêm buồm phụ · 4 thêm bánh lái · 6 đèn, cờ đuôi */
function shipSVG(lv, sym, col, w) {
  lv = lv || 0; col = flagCol(col);
  var big = lv >= 2, h = '';
  h += '<path d="M14 70h92l-12 20H26z" fill="#fff" stroke="#141413" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<path d="M22 76h78l-8 12H30z" fill="url(#cd2dots)" opacity=".4"/><path d="M20 78h80" stroke="#141413" stroke-width="1.4"/>' +
    '<g transform="translate(96 54) scale(.22)">' + (W_PSShin() ? W_PSShin().svg('still', { stg: 3, fit: 'none' }).replace(/^<svg[^>]*>|<\/svg>$/g, '') : '') + '</g>';
  h += '<path d="M56 70V14" stroke="#141413" stroke-width="2.6" stroke-linecap="round"/>' +
    '<path d="M58 18Q86 36 58 64Z" fill="#FFFDF8" stroke="#141413" stroke-width="2" stroke-linejoin="round"/>' +
    '<g transform="translate(60 30) scale(.5)">' + flagSym(sym || 'compass', col) + '</g>';
  if (big) h += '<path d="M54 24Q32 42 54 62Z" fill="#fff" stroke="#141413" stroke-width="2" stroke-linejoin="round"/><path d="M52 34Q40 44 52 58Z" fill="url(#cd2dotsL)"/>';
  if (lv >= 4) h += '<circle cx="24" cy="66" r="6" fill="none" stroke="#141413" stroke-width="2"/><path d="M24 58v16M16 66h16" stroke="#141413" stroke-width="1.4"/>';
  if (lv >= 6) h += '<path d="M30 70V54" stroke="#141413" stroke-width="1.8"/><rect x="26" y="48" width="8" height="8" rx="2" fill="#F6E6DD" stroke="#141413" stroke-width="1.5"/><circle cx="30" cy="52" r="1.8" fill="#D97757"/>';
  h += '<path d="M56 14h18l-3 4 3 4H56" fill="' + col + '" stroke="#141413" stroke-width="1.6" stroke-linejoin="round"/>';
  return '<svg class="ship" viewBox="0 0 120 96" width="' + (w || 120) + '" aria-hidden="true">' + h + '</svg>';
}

/* ---------- la bàn của học viên: 6 trục, chấm theo giá trị 0–10 (không dùng mẫu chung: còn xuất ảnh) ---------- */
function compassSVG(vals, w) {
  var cx = 110, cy = 110, R = 84, h = '', pts = [], n = PAIRS.length;
  h += '<circle cx="110" cy="110" r="96" fill="#FFFDF8" stroke="#141413" stroke-width="2"/><circle cx="110" cy="110" r="84" fill="none" stroke="#C9C2AF" stroke-dasharray="3 4"/>' +
    '<circle cx="110" cy="110" r="42" fill="none" stroke="#E3DCCB"/>';
  for (var i = 0; i < n; i++) {
    var ang = (i / n) * Math.PI - Math.PI / 2, dx = Math.cos(ang), dy = Math.sin(ang);
    h += '<path d="M' + (cx - dx * R).toFixed(1) + ' ' + (cy - dy * R).toFixed(1) + 'L' + (cx + dx * R).toFixed(1) + ' ' + (cy + dy * R).toFixed(1) + '" stroke="#C9C2AF" stroke-width="1.2"/>';
    var v = vals && vals[i] != null ? +vals[i] : 5, t = (v - 5) / 5;
    pts.push([cx + dx * R * t, cy + dy * R * t, v]);
  }
  var d = ''; pts.forEach(function (p, i) { d += (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); });
  h += '<path d="' + d + 'Z" fill="rgba(217,119,87,.24)" stroke="#B5532F" stroke-width="2" stroke-linejoin="round"/>';
  pts.forEach(function (p) { h += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="5" fill="#C15F3C" stroke="#fff" stroke-width="2"/>'; });
  h += '<path d="M110 22l5 14h-10z" fill="#141413"/><circle cx="110" cy="110" r="4" fill="#141413"/>';
  return '<svg class="cmp" viewBox="0 0 220 220" width="' + (w || 220) + '" aria-hidden="true">' + h + '</svg>';
}

/* ---------- đảo (vẽ quanh 0,0): nền theo phía, bờ nét đứt, núi, cây ---------- */
function isleShape(side, k) {
  var L = 'M-27 6q-3-11 9-14 5-10 17-7 12-5 21 3 9 5 6 14-3 8-15 8h-27q-12 0-11-4z', ns = k && k > 1.5 ? ' vector-effect="non-scaling-stroke"' : '';
  return '<g transform="scale(' + (k || 1.1) + ')"><path d="' + L + '" transform="scale(1.22 1.3)" fill="none" stroke="#141413" stroke-width=".9" stroke-dasharray="2 3" opacity=".55"' + ns + '/>' + aP(L, sideBg(side), 1.8, ns) +
    '<path d="M-20 10q22 4 40-2l3 5q-20 6-42 2z" fill="url(#cd2dots)" opacity=".55"/>' + aP('M-16 4l7-12 7 12', '#fff', 1.5, ns) + aP('M-6 4l6-9 6 9', '#fff', 1.5, ns) +
    aP('M13 6q1-7-1-13', 'none', 1.5, ns) + aP('M12-7q-6-3-9 1M12-7q6-4 9 0M12-7q-1-6 4-8', 'none', 1.4, ns) + '</g>';
}
function isleArt(is) { return '<g transform="translate(' + is.x + ' ' + is.y + ')">' + isleShape(is.side) + '</g>'; }
/* mây sương tô chấm che đảo chưa mở */
function fogArt(x, y) {
  var d = 'M-34 10c-8-10 4-20 14-14 2-12 20-16 26-4 10-8 26-2 22 10 10 0 12 12 0 14h-56c-10 0-12-4-6-6z';
  return '<g transform="translate(' + x + ' ' + y + ')"><g class="fog"><g transform="scale(1.18 1.45)"><path d="' + d + '" fill="#F3F0E7" stroke="#8C8577" stroke-width="1.2" stroke-dasharray="3 3" stroke-linejoin="round"/><path d="' + d + '" fill="url(#cd2dotsL)"/></g></g></g>';
}
/* hoa gió */
function roseArt(x, y, k) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + (k || .8) + ')">' + aC(0, 0, 13, '#fff', 1.4) + aP('M0-20L4 0 0 20-4 0z', '#fff', 1.3) +
    '<path d="M0-20L4 0H-4z" fill="#D97757" stroke="#141413" stroke-width="1.3" stroke-linejoin="round"/>' + aP('M-20 0L0 3 20 0 0-3z', '#fff', 1.1) +
    '<text y="-25" text-anchor="middle" font-family="Lora,Georgia,serif" font-size="10" font-weight="700" fill="#141413">B</text></g>';
}
/* cá voi hiền */
function seaFun(x, y) {
  return '<g transform="translate(' + (x || 94) + ' ' + (y || 444) + ') scale(.6)">' + aP('M0 0q6-14 26-12 18 2 20 14-14 8-34 6-10-2-12-8zM46 2q6-8 12-6-2 6-6 8 4 2 6 8-6 0-12-6', '#fff', 1.8) +
    aC(10, -4, 1, '#141413', 1) + aP('M18-14q-2-6 2-10M22-14q2-6 6-8', 'none', 1.4) + '</g>';
}

/* ---------- thuyền buồm nhỏ dùng trong cảnh ---------- */
function aBoat(x, y, k, fc) {
  k = k || 1; fc = fc || '#fff';
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')">' + aP('M-26 0h52l-8 12h-36z', '#fff', 2) + '<path d="M-24 4h48l-6 8h-36z" fill="url(#cd2dots)" opacity=".45"/>' +
    aP('M0 0V-46') + aP('M2-44c10 8 16 22 18 40H2z', '#fff', 2) + aP('M-2-38c-8 8-14 20-14 34h14z', '#fff', 2) + aP('M0-46l12 4-12 4', fc, 1.8) + '</g>';
}

/* ---------- biểu tượng nơi chốn nhỏ (60×56) cho hải đồ, thẻ bến ---------- */
var CD2_MINI = {
  port: function () { return aP('M8 40h44v5H8z', '#fff', 1.8) + aP('M14 45v8M30 45v8M46 45v8', 'none', 1.8) + aP('M36 40V10h16M36 18l8-8M48 10v10', 'none', 1.8) + aR(44, 20, 8, 6, '#fff', 1.4) + aR(14, 30, 12, 10, '#fff', 1.6) + aP('M12 30l2-6h10l2 6', 'none', 1.4); },
  scope: function () { return aP('M18 52l6-34M42 52l-6-34M20 42h20M22 30h16', 'none', 1.8) + aR(20, 15, 20, 4, '#fff', 1.6) + aP('M18 15l12-11 12 11z', '#fff', 1.8) + '<g transform="rotate(-16 40 12)">' + aR(38, 9, 14, 4, '#D97757', 1.4, 1) + '</g>'; },
  people: function () { return aP('M4 36h40v5H4z', '#fff', 1.8) + aP('M10 41v10M26 41v10M40 41v10', 'none', 1.8) + aP('M12 36V18', 'none', 1.8) + aR(8, 10, 8, 8, '#F6E6DD', 1.5, 1) + '<g transform="translate(46 44) scale(.42)">' + aP('M-26 0h52l-8 12h-36z', '#fff', 3) + aP('M0 0V-46', 'none', 3) + aP('M2-44c10 8 16 22 18 40H2z', '#fff', 3) + aP('M0-46l12 4-12 4', '#D97757', 3) + '</g>'; },
  compass: function () { return aP('M8 26L30 10l22 16', '#fff', 1.8) + aR(12, 25, 36, 24, '#fff', 1.8) + aC(30, 35, 7, '#fff', 1.6) + aP('M30 35l2-5-2 1-2-1z', '#D97757', 1.2) + aR(16, 37, 7, 12, '#fff', 1.4); },
  map: function () { return aR(10, 16, 40, 30, '#fff', 1.8, 3) + aP('M10 16l20-10 20 10', '#fff', 1.8) + aP('M16 40q8-14 16-6t14-10', 'none', 1.6) + '<path d="M16 40q10-2 22 2" fill="none" stroke="#D97757" stroke-width="1.8" stroke-dasharray="3 3"/>'; },
  wave: function () { return aP('M30 52V20', 'none', 1.8) + aP('M18 20h16l4 4-4 4H18z', '#fff', 1.5) + aP('M42 32H26l-4 4 4 4h16z', '#fff', 1.5) + aP('M32 12h12l3 3-3 3H32z', '#D97757', 1.4) + aP('M6 50q4-4 8 0t8 0M38 50q4-4 8 0t8 0', 'none', 1.5) + aP('M22 52q8-8 16 0', '#fff', 1.6); },
  light: function () { return '<path d="M34 14L58 6v16z" fill="#FFF3D9"/>' + aP('M22 52l3-34h10l3 34z', '#fff', 1.8) + '<path d="M23.6 40h12.8l.8 6H22.8z" fill="#D97757"/>' + aP('M23 40h14M22.6 46h14.8', 'none', 1.3) + aR(23, 10, 14, 8, '#FDEFE7', 1.6) + aP('M22 10q8-9 16 0z', '#fff', 1.6) + aC(30, 14, 1.8, '#D97757', 1); },
  flag: function () { return aP('M8 44h40l-6 7H14z', '#fff', 1.8) + aP('M22 44V8M36 44V12', 'none', 1.6) + aP('M14 38q8 2 16 0l-1-12q-7 2-14 0z', '#fff', 1.5) + aP('M28 40q8 2 16 0l-1-14q-7 2-14 0z', '#fff', 1.5) + aP('M36 12l9 3-9 3', '#D97757', 1.3); }
};
/* mã nơi chốn theo bến */
var CD2_PLACE = { p0: 'port', b1: 'scope', b2: 'people', b3: 'compass', b4: 'map', b5: 'wave', b6: 'light', fin: 'flag' };
function miniArt(k, w) { return '<svg class="mini" viewBox="0 0 60 56" width="' + (w || 60) + '" aria-hidden="true"><g filter="url(#cd2rough)">' + (CD2_MINI[k] ? CD2_MINI[k]() : '') + '</g></svg>'; }

/* ---------- 8 cảnh banner (360×150, nền tông vòng) ---------- */
function aSea(y0, o) { return aWave(14, y0, 6, 16, o) + aWave(150, y0 + 10, 7, 16, o) + aWave(40, y0 + 20, 8, 14, o) + aWave(230, y0 + 24, 6, 14, o); }
var CD2_SCN = {
  port: function () { /* Cảng 3 Năm: cầu tàu, cần cẩu, thùng hàng, thuyền neo */
    return aC(306, 40, 17, '#D97757', 1.8) + aP('M0 112H360', 'none', 1.4, ' opacity=".5"') +
      aP('M8 98h196v8H8z', '#fff') + aP('M20 106v24M60 106v26M100 106v24M140 106v26M180 106v24', 'none', 2.2) + aDots('M10 100h192v5H10z', 1, 1) +
      aP('M42 98v-6h10v6M40 92h14', '#fff', 1.8) +
      aR(76, 72, 26, 26, '#fff') + aR(102, 80, 22, 18, '#fff') + aR(84, 52, 22, 20, '#fff') + aDots('M78 74h22v22H78z', .7, 1) + aP('M76 85h26M102 89h22M84 62h22', 'none', 1.4) +
      aP('M150 98V28M150 28h64M150 40l18-12M162 98l-12-30M138 98l12-30') + aP('M206 28v30', 'none', 1.4) + aR(196, 58, 20, 16, '#fff', 1.8) + aDots('M198 66h16v6h-16z', .5) +
      aP('M170 84h26v14', 'none', 1.8) + aR(166, 76, 34, 12, '#fff', 1.8, 2) + '<text x="183" y="85.5" text-anchor="middle" font-family="Lora,Georgia,serif" font-size="8" font-weight="700" fill="#141413">3 NĂM</text>' +
      aBoat(270, 108, .95, '#D97757') + aSea(124, .9) + aGull(250, 30) + aGull(232, 44, .8);
  },
  scope: function () { /* Đài Vọng Biển: tháp gỗ trên vách đá, ống nhòm, sương ngoài khơi */
    var fog = function (x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-40 10c-6-12 8-20 18-14 4-12 22-14 28-2 10-6 24 0 22 12 8 2 8 12-2 14h-62c-10 0-12-8-4-10z" fill="#fff" stroke="#141413" stroke-width="1.6" stroke-linejoin="round"/><path d="M-30 12c4 3 50 3 58 0v8h-58z" fill="url(#cd2dotsL)"/></g>'; };
    return '<g transform="translate(0 12) scale(1 .93)">' + aP('M190 68q20-10 40 0M250 62q14-8 26 0M296 70q16-10 30 0', 'none', 1.6, ' opacity=".45"') + fog(232, 58, .9) + fog(310, 40, .75) + fog(206, 30, .6) +
      aWave(160, 126, 5, 16, .9) + aWave(190, 140, 7, 14, .9) + aWave(250, 116, 5, 14, .8) +
      aP('M0 150V102q24-14 48-12q30-6 54 2q22 2 36 14l12 44z', '#fff') + aDots('M60 110q30-4 66 8l10 32H70z', .5) +
      aP('M46 96L58 34M108 98L94 34M51 74h52M54 56h44M52 74l46-18M100 74L54 56', 'none', 2) + aR(50, 28, 52, 7, '#fff', 2) +
      aP('M46 28L76 8l30 20z', '#fff') + aDots('M58 26l18-12 18 12z', 1, 1) + aP('M76 8V0', 'none', 1.8) + aP('M76 0l12 3-12 4', '#D97757', 1.6) +
      '<g transform="rotate(-14 98 22)">' + aR(92, 16, 34, 7, '#fff', 1.8, 2) + aR(124, 14, 6, 11, '#D97757', 1.8, 1) + '</g>' + aP('M96 23l-4 5M100 23l4 5', 'none', 1.6) +
      aGull(170, 24) + aGull(150, 36, .8) + '</g>';
  },
  people: function () { /* Bến Senpai: cầu gỗ, đèn lồng, ghế, bảng chuyện, thuyền neo */
    var lamp = function (x) { return aP('M' + x + ' 98V58', 'none', 2.2) + aP('M' + (x - 6) + ' 58h12', 'none', 2) + aR(x - 6, 44, 12, 14, '#FBE3D6', 1.8, 2) + aC(x, 51, 2.6, '#D97757', 1.2) + aP('M' + (x - 4) + ' 44l4-5 4 5', '#fff', 1.6); };
    return aP('M0 98h236v8H0z', '#fff') + aP('M16 106v26M56 106v26M96 106v26M136 106v26M176 106v26M216 106v26', 'none', 2.2) + aDots('M2 100h232v5H2z', 1, 1) +
      lamp(26) + lamp(150) + aP('M60 98v-12M92 98v-12M56 86h40M58 80h36', '#fff', 2) +
      aP('M176 98V62M214 98V62', 'none', 2) + aR(170, 50, 50, 30, '#fff', 2, 3) + aR(176, 55, 16, 11, '#EBCBB9', 1.4) + aR(196, 56, 18, 9, '#fff', 1.4) + aR(184, 68, 22, 8, '#fff', 1.4) + aC(184, 55, 1.6, '#D97757', 1) + aC(205, 56, 1.6, '#141413', 1) +
      aBoat(276, 116, .8, '#D97757') + aBoat(330, 110, .62) + aBoat(250, 140, .5) + aP('M236 104q14 6 20 12', 'none', 1.2, ' opacity=".7"') +
      aSea(132, .8) + aGull(110, 30) + aGull(300, 26, .9) + aGull(320, 40, .7);
  },
  compass: function () { /* Xưởng La Bàn: xưởng mái nhọn, la bàn lớn, bàn đồ nghề */
    return aP('M0 122h292q10 0 16 8', 'none', 1.8) + aWave(300, 128, 3, 16, .9) + aWave(316, 140, 2, 16, .9) + aDots('M0 124h290l8 26H0z', .25, 1) +
      aP('M114 62L186 20l72 42', '#fff', 2.2) + aDots('M140 50l46-26 46 26z', .6, 1) + aR(124, 60, 124, 62, '#fff', 2.2) +
      aR(222, 20, 12, 22, '#fff', 2) + aP('M228 16q-6-6 0-10t0-10M236 14q6-6 0-10', 'none', 1.5, ' opacity=".7"') +
      aC(186, 82, 21, '#fff', 2.2) + aC(186, 82, 15, 'none', 1.2) + aP('M186 64v4M186 96v4M168 82h4M200 82h4', 'none', 1.6) + aP('M186 82l5-12-5 2-5-2z', '#D97757', 1.6) + aP('M186 82l5 12-5-2-5 2z', '#fff', 1.6) +
      aR(134, 86, 22, 36, '#fff', 2) + aC(151, 105, 1.4, '#141413', 1) + aR(212, 92, 26, 18, '#fff', 2) + aP('M225 92v18M212 101h26', 'none', 1.4) +
      aP('M30 122V96M96 122V96', 'none', 2.2) + aP('M22 96h82', 'none', 2.6) + aDots('M24 98h78v4H24z', 1, 1) +
      aP('M38 96l6-14 6 2-4 12M44 82l10-2', '#fff', 1.8) + aR(62, 88, 30, 8, '#fff', 1.6, 1) + aP('M66 88v3M70 88v4M74 88v3M78 88v4M82 88v3M86 88v4', 'none', 1.1) +
      aP('M8 122l4-6 4 6M262 122l3-5 3 5M282 122l4-6 4 6', 'none', 1.4) + aGull(290, 30) + aGull(60, 38, .8);
  },
  map: function () { /* Phòng Hải Đồ: bàn trải hải đồ 3 tuyến, cửa sổ nhìn biển, đèn treo */
    return aR(214, 14, 112, 66, '#fff', 2.2, 4) + aP('M270 14v66M214 46h112', 'none', 1.6) + aC(298, 34, 7, '#D97757', 1.4) + aWave(220, 68, 3, 14, .8) + aWave(276, 66, 3, 14, .8) +
      aP('M14 54h110M14 54v-26M124 54v-26M14 28h110', 'none', 1.8) + aC(30, 40, 9, '#fff', 1.8) + aC(50, 42, 8, '#fff', 1.8) + aC(68, 40, 9, '#fff', 1.8) + aC(88, 42, 7, '#fff', 1.8) + aC(106, 41, 8, '#fff', 1.8) +
      aP('M170 0v18', 'none', 1.6) + aP('M156 30l14-12 14 12z', '#fff', 2) + '<path d="M160 30h20l12 30h-44z" fill="#FFF3D9" opacity=".8"/>' +
      aP('M18 104h324l-16 16H34z', '#fff', 2.2) + aP('M40 120v28M320 120v28', 'none', 2.4) +
      aP('M70 102l10-26h196l-8 26z', '#FFFDF6', 2) + aDots('M84 80h186l-4 8H82z', .35, 1) +
      '<path d="M100 96q30-26 64-16t70-6" fill="none" stroke="#D97757" stroke-width="2.2" stroke-dasharray="5 4" stroke-linecap="round"/>' +
      '<path d="M100 96q50-4 90-2t60 0" fill="none" stroke="#141413" stroke-width="1.6" stroke-dasharray="4 4" stroke-linecap="round"/>' +
      '<path d="M100 96q40 6 70 4" fill="none" stroke="#141413" stroke-width="1.6" stroke-dasharray="4 4" stroke-linecap="round" opacity=".6"/>' + aC(100, 96, 3, '#141413', 1) +
      '<text x="238" y="76" font-family="Lora,Georgia,serif" font-size="10" font-weight="700" fill="#141413">A</text><text x="254" y="98" font-family="Lora,Georgia,serif" font-size="10" font-weight="700" fill="#141413">B</text><text x="174" y="104" font-family="Lora,Georgia,serif" font-size="10" font-weight="700" fill="#141413">C</text>' +
      aP('M206 86l14 16M206 86l-6 18', 'none', 1.6) + aC(206, 86, 2, '#fff', 1.4) +
      aR(292, 82, 20, 22, '#fff', 1.8, 3) + aP('M296 82v-14M302 82v-18M308 82v-12', 'none', 2) + aC(296, 67, 2, '#fff', 1.4) + aC(302, 63, 2, '#fff', 1.4) + aC(308, 69, 2, '#fff', 1.4);
  },
  wave: function () { /* Vịnh Ngã Rẽ: vịnh chia 3 luồng, cột biển chỉ đường */
    return aP('M0 18q20 10 22 40t-6 60q-4 18 8 32H0z', '#fff') + aDots('M2 40q14 10 12 40t0 50H2z', .4) +
      aP('M360 12q-28 14-26 46t8 56q4 22-6 36h24z', '#fff') + aDots('M358 34q-14 14-12 40t4 50h8z', .4) +
      aP('M122 78q8-14 22-10 10-8 18 2 8 4 4 12-22 8-44-4z', '#fff', 2) + aDots('M126 80q20 8 40 0v4q-20 6-40-2z', 1, 1) +
      aP('M206 66q10-12 22-6 12-2 14 10-20 8-36-4z', '#fff', 2) +
      '<path d="M180 146q-2-40-50-70T64 22" fill="none" stroke="#141413" stroke-width="1.6" stroke-dasharray="4 5" stroke-linecap="round"/>' +
      '<path d="M180 146q4-50 0-78t4-56" fill="none" stroke="#D97757" stroke-width="2.2" stroke-dasharray="5 5" stroke-linecap="round"/>' +
      '<path d="M180 146q10-40 60-62t60-60" fill="none" stroke="#141413" stroke-width="1.6" stroke-dasharray="4 5" stroke-linecap="round"/>' +
      aP('M144 74V40', 'none', 2.2) + aP('M128 40h26l6 5-6 5h-26z', '#fff', 1.8) + aP('M160 52h-26l-6 5 6 5h26z', '#fff', 1.8) + aP('M146 30h20l5 4-5 4h-20z', '#D97757', 1.6) +
      aWave(40, 120, 3, 14) + aWave(240, 128, 4, 14) + aWave(70, 96, 2, 12, .7) + aWave(268, 100, 3, 12, .7) + aWave(196, 30, 3, 12, .6) +
      '<g transform="translate(250 50)">' + aP('M-6 6h12l-2 6h-8z', '#fff', 1.6) + aP('M0 6V-6', 'none', 1.6) + aC(0, -8, 3, '#D97757', 1.4) + '</g>' +
      '<g transform="translate(180 140) scale(.42)">' + aBoat(0, 0, 1, '#D97757') + '</g>';
  },
  light: function () { /* Ngọn Hải Đăng: tháp sọc cam đất trên đảo đá, chùm sáng */
    return '<path d="M226 30L360 0v56z" fill="#FFF3D9" opacity=".95"/><path d="M214 30L60 6v46z" fill="#FFF3D9" opacity=".8"/>' +
      aP('M150 150q10-30 40-36 30-12 62-2 30 6 40 38z', '#fff', 2.2) + aDots('M214 118q30-4 54 4l18 28h-60z', .45) +
      aP('M204 116l8-80h20l8 80z', '#fff', 2.2) + '<path d="M210 96h24l1.6 12h-27.2z" fill="#D97757"/><path d="M212.6 66h18.8l1.4 12h-21.6z" fill="#D97757"/>' + aP('M209 96h26M210.4 108h23.4M212 66h20M211 78h22', 'none', 1.6) +
      aR(208, 30, 28, 6, '#fff', 2) + aR(212, 16, 20, 14, '#FDEFE7', 2) + aP('M222 16v14', 'none', 1.4) + aC(222, 23, 3.4, '#D97757', 1.4) + aP('M210 16q12-14 24 0z', '#fff', 2) + aP('M222 4v-4', 'none', 1.6) +
      aR(218, 96, 8, 12, '#fff', 1.6, 3) + aBoat(70, 116, .7) + aSea(122, .9) + aGull(120, 60) + aGull(300, 80, .8);
  },
  flag: function () { /* Cảng Khởi Hành: thuyền buồm lớn, cờ dây, mặt trời mọc */
    var bunt = '', i; for (i = 0; i < 7; i++) { var x = 8 + i * 18; bunt += aP('M' + x + ' ' + (14 + i * 2.2) + 'l9 14 9-12', i % 2 ? '#fff' : '#D97757', 1.4); }
    return '<path d="M200 112a64 64 0 0 1 128 0z" fill="#D97757" opacity=".22"/>' + aP('M200 112a64 64 0 0 1 128 0', 'none', 1.6) +
      aP('M0 12q70 16 140 14', 'none', 1.6) + bunt + aP('M0 112h360', 'none', 1.4, ' opacity=".5"') +
      aP('M0 96h46v10H0z', '#fff') + aP('M12 106v26M36 106v26', 'none', 2.2) +
      '<g transform="translate(176 112)">' + aP('M-80 0h150l-18 22H-64z', '#fff', 2.4) + aDots('M-76 6h138l-12 14H-62z', .4) + aP('M-60 8h4M-40 8h4M-20 8h4M0 8h4M20 8h4M40 8h4', 'none', 2) +
      aP('M-30 0V-86M24 0V-96') + aP('M-54-8q24 6 48 0l-2-30q-22 6-44 0z', '#fff', 2) + aP('M-50-46q20 5 40 0l-2-26q-18 5-36 0z', '#fff', 2) +
      aP('M0-8q24 6 50 0l-2-34q-22 6-46 0z', '#fff', 2) + aP('M4-52q20 5 40 0l-2-30q-18 5-36 0z', '#fff', 2) + aDots('M2-40q22 5 44 0v30q-22 6-44 0z', .5, 1) +
      aP('M24-96l18 5-18 5', '#D97757', 1.8) + aP('M-30-86l14 4-14 4', '#fff', 1.6) + aP('M70 0l30-26', 'none', 1.8) + '</g>' +
      aSea(126, .9) + aGull(300, 22) + aGull(320, 34, .8) + aGull(150, 18, .7);
  },
  isle: function (is) { /* trang đảo: đảo lớn giữa biển, bảng tên có biểu tượng đảo */
    return aSea(120, .8) + aWave(30, 92, 3, 14, .6) + aWave(270, 88, 3, 14, .6) + aGull(80, 34) + aGull(270, 28, .8) +
      '<g transform="translate(170 100)">' + isleShape(is && is.side, 2.6) + '</g>' +
      aP('M246 104V58', 'none', 2) + aC(246, 44, 15, '#fff', 2) + '<g transform="translate(236 34) scale(.84)" color="#141413"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + (CD2_IC[is && is.ic] || '') + '</g></g>' +
      aBoat(300, 132, .5, '#D97757');
  }
};
function sceneSVG(k, bg, h, arg) {
  h = h || 150;
  return '<svg class="scene" viewBox="0 0 360 ' + h + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="360" height="' + h + '" fill="' + bg + '"/><g filter="url(#cd2rough)">' + (CD2_SCN[k] ? CD2_SCN[k](arg) : '') + '</g></svg>';
}

/* ---------- con dấu kiểu hộ chiếu: 3 hình, mực cam đất hoặc xanh than, xoay nhẹ, có ngày ---------- */
function stampArt(i, ic, lab, date, w) {
  var col = i % 3 === 1 ? '#2B3A55' : '#B5532F', sh = ['c', 'r', 'o'][i % 3], rot = [-8, 6, -4, 9, -6, 5, -10, 7][i % 8], s = '';
  if (sh === 'c') s = '<circle cx="33" cy="31" r="24" fill="none" stroke="' + col + '" stroke-width="2.4"/><circle cx="33" cy="31" r="19" fill="none" stroke="' + col + '" stroke-width="1"/>';
  else if (sh === 'r') s = '<rect x="7" y="9" width="52" height="44" rx="5" fill="none" stroke="' + col + '" stroke-width="2.4"/><rect x="11" y="13" width="44" height="36" rx="3" fill="none" stroke="' + col + '" stroke-width="1"/>';
  else s = '<path d="M22 7h22l15 15v18L44 55H22L7 40V22z" fill="none" stroke="' + col + '" stroke-width="2.4"/>';
  return '<svg class="stamp" viewBox="0 0 66 62" width="' + (w || 66) + '" aria-hidden="true"><g transform="rotate(' + rot + ' 33 31)" opacity=".88">' + s +
    '<text x="33" y="22" text-anchor="middle" font-family="Be Vietnam Pro,system-ui,sans-serif" font-size="7.5" font-weight="700" letter-spacing="1" fill="' + col + '">' + lab + '</text>' +
    '<g transform="translate(25 24) scale(.68)" color="' + col + '"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' + (CD2_IC[ic] || '') + '</g></g>' +
    '<text x="33" y="49" text-anchor="middle" font-family="Lora,Georgia,serif" font-style="italic" font-size="7.5" fill="' + col + '">' + (date || '') + '</text></g></svg>';
}
function stampEmpty(n, w) {
  return '<svg class="stamp" viewBox="0 0 66 62" width="' + (w || 66) + '" aria-hidden="true"><circle cx="33" cy="31" r="23" fill="none" stroke="#C9C2AF" stroke-width="1.5" stroke-dasharray="3 4"/>' +
    '<text x="33" y="36" text-anchor="middle" font-family="Lora,Georgia,serif" font-style="italic" font-size="13" fill="#A8A08C">' + n + '</text></svg>';
}
