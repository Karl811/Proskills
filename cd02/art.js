/* CD02 · cd02/art.js · HÌNH VẼ: biểu tượng, cờ, con thuyền, đảo, la bàn, Shin thuyền trưởng.
   Hình tự vẽ của khóa (không mượn hình truyện nào). Một màu chủ đạo teal; gỗ, giấy da chỉ dùng trong hình. ES5. */

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

/* Shin thuyền trưởng: gà lớn (core/shin.js), mũ thuyền trưởng + khăn teal */
function shin2(mood, sz, cls) {
  var s = W_PSShin() ? W_PSShin().svg(mood || 'hi', { stg: 3, fit: 'captain', cls: cls || '' }) : '';
  return '<span class="shin" style="width:' + (sz || 64) + 'px">' + s + '</span>';
}
function W_PSShin() { return window.PSShin || null; }

/* ---------- biểu tượng trên cờ (vẽ trong hệ 40×40, tâm 20,20) ---------- */
function flagSym(k, c) {
  c = c || '#fff';
  switch (k) {
    case 'compass': return '<circle cx="20" cy="20" r="10" fill="none" stroke="' + c + '" stroke-width="2.4"/><path d="M20 9l3 11h-6z" fill="' + c + '"/><path d="M20 31l-3-11h6z" fill="' + c + '" opacity=".55"/>';
    case 'star': return '<path d="M20 8l3.4 7.4 8 .9-6 5.4 1.7 8-7.1-4.1-7.1 4.1 1.7-8-6-5.4 8-.9z" fill="' + c + '"/>';
    case 'sun': return '<circle cx="20" cy="20" r="6.5" fill="' + c + '"/><path d="M20 7v4M20 29v4M7 20h4M29 20h4M10.8 10.8l2.8 2.8M26.4 26.4l2.8 2.8M10.8 29.2l2.8-2.8M26.4 13.6l2.8-2.8" stroke="' + c + '" stroke-width="2.4" stroke-linecap="round"/>';
    case 'whale': return '<path d="M8 22c0-6 5-9 11-9 6.5 0 10 3.5 11 6l3-3-1 7c-1.5 4-6 6-12 6-7 0-12-2-12-7z" fill="' + c + '"/><circle cx="14" cy="20" r="1.4" fill="#2A2118"/><path d="M18 12q1-4 4-4M18 12q-1-3-3-4" stroke="' + c + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
    case 'wing': return '<path d="M7 24c6-1 10-6 12-13 1 6-1 10-4 13 4-1 8-4 10-9 1 7-4 13-12 14-3 .3-5-1-6-5z" fill="' + c + '"/>';
    case 'flame': return '<path d="M20 7c1 5 7 7 7 14a7 7 0 0 1-14 0c0-4 2-6 4-8 0 3 1 4 3 5-1-4 0-8 0-11z" fill="' + c + '"/>';
    case 'sakura': var p = ''; for (var i = 0; i < 5; i++) p += '<ellipse cx="20" cy="12.5" rx="4.2" ry="6.4" fill="' + c + '" transform="rotate(' + (i * 72) + ' 20 20)"/>'; return p + '<circle cx="20" cy="20" r="2.6" fill="#F2C230"/>';
    case 'leaf': return '<path d="M10 30c0-13 8-20 21-21-1 13-8 21-21 21z" fill="' + c + '"/><path d="M11 29 25 15" stroke="#2A2118" stroke-opacity=".25" stroke-width="1.6" stroke-linecap="round"/>';
  }
  return '';
}
/* lá cờ: nền màu học viên chọn, đuôi xẻ, biểu tượng trắng */
function flagSVG(sym, col, w, wave) {
  col = col || '#0F9F98'; w = w || 120;
  var path = wave ? 'M4 6Q30 0 56 6T108 6L96 30 108 54Q82 48 56 54T4 54Z' : 'M4 6H108L96 30 108 54H4Z';
  var ink = col === '#F2B21B' ? '#2A2118' : '#fff';
  return '<svg class="flag" viewBox="0 0 112 60" width="' + w + '" aria-hidden="true"><path d="' + path + '" fill="' + col + '" stroke="#2A2118" stroke-width="2" stroke-linejoin="round"/>' +
    '<g transform="translate(30 10)">' + flagSym(sym || 'compass', ink) + '</g></svg>';
}
/* cờ trên cột (cho xem trước khi thiết kế) */
function flagMast(sym, col) {
  return '<svg class="mast" viewBox="0 0 150 150" aria-hidden="true"><path d="M22 140V14" stroke="#7A5A3A" stroke-width="5" stroke-linecap="round"/><circle cx="22" cy="12" r="5" fill="#F2C230" stroke="#2A2118" stroke-width="1.5"/>' +
    '<g class="flagwave" transform="translate(24 18)"><path d="M0 4Q30 -2 56 4T110 4L98 30 110 56Q82 50 56 56T0 56Z" fill="' + (col || '#0F9F98') + '" stroke="#2A2118" stroke-width="2" stroke-linejoin="round"/>' +
    '<g transform="translate(30 10)">' + flagSym(sym || 'compass', col === '#F2B21B' ? '#2A2118' : '#fff') + '</g></g>' +
    '<path d="M6 140h60" stroke="#2A2118" stroke-width="3" stroke-linecap="round"/></svg>';
}

/* ---------- con thuyền: lớn dần theo số bến đã ghé (0–6) ----------
   0 thuyền nhỏ một buồm · 2 thêm buồm phụ · 4 thêm bánh lái, ống nhòm · 6 đèn, cờ đuôi */
function shipSVG(lv, sym, col, w) {
  lv = lv || 0; col = col || '#0F9F98';
  var big = lv >= 2, h = '';
  h += '<path d="M14 70h92l-12 20H26z" fill="#9A6B43" stroke="#2A2118" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<path d="M20 78h80" stroke="#7A5233" stroke-width="2"/>' +
    '<g transform="translate(96 54) scale(.22)">' + (W_PSShin() ? W_PSShin().svg('still', { stg: 3, fit: 'none' }).replace(/^<svg[^>]*>|<\/svg>$/g, '') : '') + '</g>';
  h += '<path d="M56 70V14" stroke="#5E4128" stroke-width="3.4" stroke-linecap="round"/>' +
    '<path d="M58 18Q86 36 58 64Z" fill="#FBFAF6" stroke="#2A2118" stroke-width="2" stroke-linejoin="round"/>' +
    '<g transform="translate(60 30) scale(.5)">' + flagSym(sym || 'compass', col) + '</g>';
  if (big) h += '<path d="M54 24Q32 42 54 62Z" fill="#EFEBE0" stroke="#2A2118" stroke-width="2" stroke-linejoin="round"/>';
  if (lv >= 4) h += '<circle cx="24" cy="66" r="6" fill="none" stroke="#5E4128" stroke-width="2.4"/><path d="M24 58v16M16 66h16" stroke="#5E4128" stroke-width="1.6"/>';
  if (lv >= 6) h += '<path d="M30 70V54" stroke="#5E4128" stroke-width="2"/><rect x="26" y="48" width="8" height="8" rx="2" fill="#F2C230" stroke="#2A2118" stroke-width="1.5"/>';
  h += '<path d="M56 14h18l-3 4 3 4H56" fill="' + col + '" stroke="#2A2118" stroke-width="1.6" stroke-linejoin="round"/>';
  return '<svg class="ship" viewBox="0 0 120 96" width="' + (w || 120) + '" aria-hidden="true">' + h + '</svg>';
}

/* ---------- la bàn của học viên: 6 trục (mỗi cặp một đường kính), chấm theo giá trị 0–10 ---------- */
function compassSVG(vals, w) {
  var cx = 110, cy = 110, R = 84, h = '', pts = [], n = PAIRS.length;
  h += '<circle cx="110" cy="110" r="96" fill="#FBF6EA" stroke="#2A2118" stroke-width="2"/><circle cx="110" cy="110" r="84" fill="none" stroke="#D9CDB4" stroke-dasharray="3 4"/>' +
    '<circle cx="110" cy="110" r="42" fill="none" stroke="#E6DCC6"/>';
  for (var i = 0; i < n; i++) {
    var ang = (i / n) * Math.PI - Math.PI / 2, dx = Math.cos(ang), dy = Math.sin(ang);
    h += '<path d="M' + (cx - dx * R).toFixed(1) + ' ' + (cy - dy * R).toFixed(1) + 'L' + (cx + dx * R).toFixed(1) + ' ' + (cy + dy * R).toFixed(1) + '" stroke="#D9CDB4" stroke-width="1.4"/>';
    var v = vals && vals[i] != null ? +vals[i] : 5, t = (v - 5) / 5; /* -1 trái … 1 phải */
    var px = cx + dx * R * t, py = cy + dy * R * t;
    pts.push([px, py, v]);
  }
  /* đường nối các chấm thành “kim” của riêng mình */
  var d = ''; pts.forEach(function (p, i) { d += (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); });
  h += '<path d="' + d + 'Z" fill="rgba(15,159,152,.16)" stroke="#0F9F98" stroke-width="2" stroke-linejoin="round"/>';
  pts.forEach(function (p) { h += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="5" fill="#0F9F98" stroke="#fff" stroke-width="2"/>'; });
  h += '<path d="M110 22l5 14h-10z" fill="#E8574A"/><circle cx="110" cy="110" r="4" fill="#2A2118"/>';
  return '<svg class="cmp" viewBox="0 0 220 220" width="' + (w || 220) + '" aria-hidden="true">' + h + '</svg>';
}

/* ---------- đảo trên hải đồ ---------- */
function isleArt(is, on) {
  var x = is.x, y = is.y, h = '';
  h += '<ellipse cx="' + x + '" cy="' + (y + 8) + '" rx="27" ry="10" fill="#BFE6E2" opacity=".9"/>' +
    '<path d="M' + (x - 24) + ' ' + (y + 6) + 'Q' + (x - 20) + ' ' + (y - 16) + ' ' + x + ' ' + (y - 18) + 'Q' + (x + 22) + ' ' + (y - 16) + ' ' + (x + 25) + ' ' + (y + 6) + 'Q' + x + ' ' + (y + 14) + ' ' + (x - 24) + ' ' + (y + 6) + 'Z" fill="' + (on ? '#F1E2B8' : '#E4DCC8') + '" stroke="#2A2118" stroke-width="1.8"/>' +
    '<path d="M' + (x - 14) + ' ' + (y - 2) + 'q6-10 12-4q5-9 13 0" fill="' + (on ? '#7FC4A0' : '#C9C3B2') + '" stroke="#2A2118" stroke-width="1.4" stroke-linejoin="round"/>' +
    '<g transform="translate(' + (x - 9) + ' ' + (y - 14) + ') scale(.75)" color="#174A63">' + (CD2_IC[is.ic] ? '<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + CD2_IC[is.ic] + '</g>' : '') + '</g>';
  return h;
}
/* mây sương che đảo chưa mở */
function fogArt(x, y, k) {
  k = k || 1;
  return '<g class="fog"><ellipse cx="' + x + '" cy="' + (y + 4 * k) + '" rx="' + (36 * k) + '" ry="' + (18 * k) + '" fill="#F6F5F1" stroke="#E2DFD6" stroke-width="1.2"/>' +
    '<circle cx="' + (x - 16 * k) + '" cy="' + (y - 6 * k) + '" r="' + (15 * k) + '" fill="#F9F8F5"/><circle cx="' + (x + 12 * k) + '" cy="' + (y - 9 * k) + '" r="' + (18 * k) + '" fill="#FCFBF9"/>' +
    '<circle cx="' + (x - 2 * k) + '" cy="' + (y - 14 * k) + '" r="' + (12 * k) + '" fill="#FFFFFF"/></g>';
}
/* hoa gió góc hải đồ */
function roseArt(x, y, r) {
  return '<g transform="translate(' + x + ' ' + y + ')" opacity=".75"><circle r="' + r + '" fill="none" stroke="#B9A57E" stroke-width="1.2"/>' +
    '<path d="M0-' + (r + 6) + 'L4 0 0 ' + (r + 6) + '-4 0Z" fill="#B9A57E"/><path d="M-' + (r + 6) + ' 0L0 4 ' + (r + 6) + ' 0 0-4Z" fill="#D9CDB4"/>' +
    '<text y="-' + (r + 9) + '" text-anchor="middle" font-size="10" font-weight="700" fill="#8A7650">B</text></g>';
}
/* cá voi hiền, bạch tuộc vẽ vui trên biển */
function seaFun() {
  return '<g opacity=".55" transform="translate(-92 14)"><path d="M152 262c0-7 6-10 13-10 7 0 11 4 12 7l4-3-1 8c-2 4-7 6-14 6-8 0-14-2-14-8z" fill="#8CCFCB"/><circle cx="158" cy="259" r="1.4" fill="#174A63"/>' +
    '<path d="M162 250q1-5 5-5" stroke="#8CCFCB" stroke-width="2" fill="none" stroke-linecap="round"/></g>' +
    '<g opacity=".5" transform="translate(36 -4)"><circle cx="300" cy="300" r="7" fill="#F0A7A0"/><path d="M294 305q-3 6 0 8M298 306q-1 6 2 8M302 306q1 6 4 7M306 304q4 5 6 5" stroke="#F0A7A0" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>';
}
