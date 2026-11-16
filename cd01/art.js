/* CD01 · cd01/art.js · HÌNH: Shin (giữ nguyên nét vẽ từ Career Design CD49, 4 giai đoạn lớn dần theo số ga đã qua) + biểu tượng ga.
   ES5, biến toàn cục. shinCracks() do engine.js định nghĩa (số vết nứt trên vỏ trứng ở Sân ga/Ga 1). */
function shinEyes(m,x1,x2,y,r){
  var K="#2A2118";
  function arc(x){ return 'M'+(x-r)+' '+(y+1)+'q'+r+' '+(-r*1.5)+' '+(2*r)+' 0'; }
  function eye(x,R,ox,oy,pr){ return '<circle cx="'+x+'" cy="'+y+'" r="'+R+'" fill="#fff" stroke="'+K+'" stroke-width="1.2"/><circle cx="'+(x+ox)+'" cy="'+(y+oy)+'" r="'+(R*(pr||.6))+'" fill="'+K+'"/><circle cx="'+(x+ox-R*.22)+'" cy="'+(y+oy-R*.25)+'" r="'+(R*.22)+'" fill="#fff"/>'; }
  if(m==="cheer"||m==="party"||m==="touched") return '<path d="'+arc(x1)+arc(x2)+'" stroke="'+K+'" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+(m==="touched"?'<path d="M'+(x2+r+1)+' '+(y+3)+'q2 4 0 6q-2-2 0-6z" fill="#7FC4FF"/><path d="M'+(x1-r-1)+' '+(y+3)+'q2 4 0 6q-2-2 0-6z" fill="#7FC4FF"/>':'');
  if(m==="encourage") return '<path d="'+arc(x1)+'" stroke="'+K+'" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+eye(x2,r,0,.3);
  if(m==="surprise") return eye(x1,r*1.3,0,0,.34)+eye(x2,r*1.3,0,0,.34)+'<path d="M'+(x1-r)+' '+(y-r*2)+'q'+r+' -3 '+(2*r)+' 0M'+(x2-r)+' '+(y-r*2)+'q'+r+' -3 '+(2*r)+' 0" stroke="'+K+'" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
  if(m==="sad") return eye(x1,r,0,1.4)+eye(x2,r,0,1.4)+'<path d="M'+(x1-r)+' '+(y-r-1)+'l'+(2*r)+' -2.5M'+(x2+r)+' '+(y-r-1)+'l'+(-2*r)+' -2.5" stroke="'+K+'" stroke-width="1.8" stroke-linecap="round"/><path d="M'+(x2+2)+' '+(y+r+2)+'q2.4 4.5 0 7q-2.4-2.5 0-7z" fill="#7FC4FF"/>';
  if(m==="pout") return eye(x1,r,1.3,.3)+eye(x2,r,1.3,.3)+'<path d="M'+(x1-r)+' '+(y-r-3)+'l'+(2*r)+' 2.6M'+(x2+r)+' '+(y-r-3)+'l'+(-2*r)+' 2.6" stroke="'+K+'" stroke-width="2" stroke-linecap="round"/>';
  var R=m==="miss"?r*1.18:r, ox=m==="think"?1.2:0, oy=m==="think"?-1.4:.4;
  return eye(x1,R,ox,oy)+eye(x2,R,ox,oy);
}
function shinCap(x,y,rot,sc){ return '<g transform="translate('+x+' '+y+') rotate('+rot+') scale('+(sc||1)+')"><path d="M-13 0L13 0L10-11Q0-15-10-11Z" fill="#1F3A8A"/><rect x="-13" y="-3.4" width="26" height="3.6" fill="#F2C230"/><ellipse cx="3" cy="1.6" rx="15" ry="3.2" fill="#13203B"/><circle cx="0" cy="-7.6" r="2.6" fill="#F2C230"/></g>'; }
function shin(mood,sz,stg,anim){
  sz=sz||64; mood=mood||"hi"; stg=stg||0; var b="", ex="";
  var beakOpen = mood==="cheer"||mood==="party"||mood==="surprise"||mood==="encourage";
  if(stg===0){
    var cr=shinCracks();
    b='<ellipse cx="50" cy="60" rx="28" ry="33" fill="#FFF4D6" stroke="#E3C98F" stroke-width="2.5"/><circle cx="36" cy="74" r="3" fill="#F3D9A0"/><circle cx="64" cy="70" r="2.4" fill="#F3D9A0"/><circle cx="60" cy="84" r="2" fill="#F3D9A0"/>'+
      (cr>0?'<path d="M30 46l6 4 5-5 6 5" stroke="#C9A35E" stroke-width="2" fill="none" stroke-linejoin="round"/>':'')+(cr>1?'<path d="M56 44l5 5 5-3 5 5" stroke="#C9A35E" stroke-width="2" fill="none" stroke-linejoin="round"/>':'')+(cr>2?'<path d="M38 88l4-5 5 4 4-5" stroke="#C9A35E" stroke-width="2" fill="none"/>':'')+
      shinEyes(mood,42,58,58,4.2)+'<circle cx="35" cy="66" r="3.4" fill="#F7A1B5" opacity=".6"/><circle cx="65" cy="66" r="3.4" fill="#F7A1B5" opacity=".6"/>'+
      (beakOpen?'<path d="M46 66q4 5 8 0z" fill="#FF9F1C"/>':'<path d="M47 66q3 2 6 0" stroke="#2A2118" stroke-width="1.8" fill="none" stroke-linecap="round"/>')+shinCap(50,29,-10,.9);
  } else if(stg===1){
    b='<g class="sw sw-l"><ellipse cx="22" cy="64" rx="7" ry="12" fill="#FFC93C" stroke="#E8B92E" stroke-width="1.5" transform="rotate(25 22 64)"/></g><g class="sw sw-r"><ellipse cx="78" cy="64" rx="7" ry="12" fill="#FFC93C" stroke="#E8B92E" stroke-width="1.5" transform="rotate(-25 78 64)"/></g>'+
      '<circle cx="50" cy="60" r="29" fill="#FFD84D" stroke="#E8B92E" stroke-width="2"/><ellipse cx="50" cy="70" rx="17" ry="13" fill="#FFE98A"/>'+
      '<path d="M42 89l-3 5M42 89l0 5M42 89l3 5M58 89l-3 5M58 89l0 5M58 89l3 5" stroke="#FF9F1C" stroke-width="2.2" stroke-linecap="round"/>'+
      shinEyes(mood,41,59,55,4.4)+'<circle cx="34" cy="63" r="3.6" fill="#FF9FB0" opacity=".6"/><circle cx="66" cy="63" r="3.6" fill="#FF9FB0" opacity=".6"/>'+
      (beakOpen?'<path d="M45 61h10l-5 4z" fill="#FF9F1C"/><path d="M46 66h8l-4 4z" fill="#F07F1E"/>':'<path d="M45 62h10l-5 6z" fill="#FF9F1C" stroke="#E07B10" stroke-width="1"/>')+
      '<path d="M48 31q2-6 5-1M52 31q3-5 5 0" stroke="#E8B92E" stroke-width="2" fill="none" stroke-linecap="round"/>'+shinCap(50,34,-9,.85);
  } else if(stg===2){
    b='<g class="sw sw-l"><path d="M28 56Q4 38 6 64Q14 70 30 68Z" fill="#E09A3A" stroke="#B87420" stroke-width="1.5"/><path d="M12 56l6 4M10 62l7 3" stroke="#B87420" stroke-width="1.3"/></g><g class="sw sw-r"><path d="M72 56Q96 38 94 64Q86 70 70 68Z" fill="#E09A3A" stroke="#B87420" stroke-width="1.5"/><path d="M88 56l-6 4M90 62l-7 3" stroke="#B87420" stroke-width="1.3"/></g>'+
      '<ellipse cx="50" cy="62" rx="25" ry="28" fill="#F5B04C" stroke="#C8862A" stroke-width="2"/><ellipse cx="50" cy="72" rx="14" ry="13" fill="#FFE2A8"/>'+
      '<path d="M42 89l-3 6M42 89l3 6M58 89l-3 6M58 89l3 6" stroke="#F2A20F" stroke-width="2.4" stroke-linecap="round"/>'+
      shinEyes(mood,42,58,55,4.3)+'<circle cx="35" cy="63" r="3.4" fill="#FF9FB0" opacity=".55"/><circle cx="65" cy="63" r="3.4" fill="#FF9FB0" opacity=".55"/>'+
      (beakOpen?'<path d="M45 61h11l-4 4z" fill="#F2A20F"/><path d="M46 66h8l-3 3z" fill="#D9850A"/>':'<path d="M45 61h11q-1 5-6 7z" fill="#F2A20F" stroke="#C47A0A" stroke-width="1"/>')+
      '<path d="M46 34q2-7 6-2M51 33q4-6 7-1" stroke="#C8862A" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+shinCap(50,36,-8,.85);
  } else {
    b='<g class="sw sw-l"><path d="M32 60Q4 30 2 66Q12 66 16 74Q22 66 32 72Z" fill="#5A361F" stroke="#3E2414" stroke-width="1.5"/><path d="M8 58l8 6M6 66l9 3M12 72l7-2" stroke="#3E2414" stroke-width="1.3"/></g><g class="sw sw-r"><path d="M68 60Q96 30 98 66Q88 66 84 74Q78 66 68 72Z" fill="#5A361F" stroke="#3E2414" stroke-width="1.5"/><path d="M92 58l-8 6M94 66l-9 3M88 72l-7-2" stroke="#3E2414" stroke-width="1.3"/></g>'+
      '<ellipse cx="50" cy="68" rx="20" ry="24" fill="#6B4226" stroke="#3E2414" stroke-width="2"/><path d="M42 90l8 6 8-6" fill="#fff" stroke="#E5E5E5" stroke-width="1"/>'+
      '<circle cx="50" cy="44" r="18" fill="#FFFFFF" stroke="#DADADA" stroke-width="2"/>'+
      '<path d="M44 92l-2 5M47 92l1 5M53 92l-1 5M56 92l2 5" stroke="#F2B21B" stroke-width="2.4" stroke-linecap="round"/>'+
      shinEyes(mood,43,57,42,3.8)+(mood==="hi"||mood==="think"?'<path d="M39 36l7 2M61 36l-7 2" stroke="#2A2118" stroke-width="1.8" stroke-linecap="round"/>':'')+
      (beakOpen?'<path d="M45 48h12q3 2 0 5h-12z" fill="#F2B21B"/><path d="M46 54h9l-3 3z" fill="#D9960A"/>':'<path d="M45 47h12q5 2 1 8q-2-3-13-3z" fill="#F2B21B" stroke="#C48A0A" stroke-width="1"/>')+shinCap(50,28,-8,.8);
  }
  if(mood==="think") ex='<text x="84" y="22" font-size="20" font-weight="700" fill="#1D5FD1" font-family="Be Vietnam Pro,sans-serif">?</text>';
  if(mood==="party") ex='<rect x="8" y="10" width="5" height="9" rx="1.5" fill="#F2B21B" transform="rotate(-20 10 14)"/><rect x="86" y="8" width="5" height="9" rx="1.5" fill="#E0567F" transform="rotate(25 88 12)"/><circle cx="92" cy="34" r="3" fill="#22A05E"/><circle cx="6" cy="36" r="3" fill="#7A55D3"/>';
  if(mood==="hi") ex='<path d="M86 22l4-6M90 30l7-2M82 15v-6" stroke="#F2B21B" stroke-width="2.5" stroke-linecap="round"/>';
  if(mood==="surprise") ex='<text x="82" y="26" font-size="24" font-weight="800" fill="#E0453A" font-family="Be Vietnam Pro,sans-serif">!</text><path d="M14 22l-5-5M12 32l-7-1" stroke="#E0453A" stroke-width="2.4" stroke-linecap="round"/>';
  if(mood==="touched") ex='<path class="hrt h1" d="M84 26c-2-3-7-1-5 3l5 5 5-5c2-4-3-6-5-3z" fill="#FF6F9C"/><path class="hrt h2" d="M14 34c-1.6-2.4-5.6-.8-4 2.4l4 4 4-4c1.6-3.2-2.4-4.8-4-2.4z" fill="#FF9CBA"/>';
  if(mood==="encourage") ex='<path d="M84 18l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#22A05E"/><path d="M14 26l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="#F2B21B"/>';
  if(mood==="pout") ex='<path d="M80 14l4 4M88 12l-2 6M92 20l-6 1M84 24l2-3" stroke="#E0453A" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="22" cy="70" rx="5" ry="3" fill="#FF9FB0" opacity=".8"/><ellipse cx="78" cy="70" rx="5" ry="3" fill="#FF9FB0" opacity=".8"/>';
  if(mood==="sad") ex='<path d="M10 14h16a5 5 0 0 0-5-6 6 6 0 0 0-11 2 3 3 0 0 0 0 4z" fill="#C9D3E6"/><path d="M14 18l-1 4M19 18l-1 4M24 18l-1 4" stroke="#7FA4D8" stroke-width="1.6" stroke-linecap="round"/>';
  return '<svg class="shin st'+stg+(anim?" a-"+anim:"")+'" width="'+sz+'" height="'+sz+'" viewBox="0 0 100 100" aria-hidden="true">'+b+ex+'</svg>';
}
/* Biểu tượng nét (24×24), cùng kiểu với PS.icon của lõi */
var CD_ICONS = {
  mount: '<path d="M3 19l6.5-10 4 6 2.5-3.5L21 19z"/><circle cx="17" cy="6" r="2"/>',
  heart: '<circle cx="9" cy="8" r="3.4"/><path d="M3.5 19c.6-3.4 2.8-5.4 5.5-5.4 1.2 0 2.3.4 3.2 1.1"/><path d="M17.5 20.5l-3.2-3.1a2 2 0 012.9-2.8l.3.3.3-.3a2 2 0 012.9 2.8z"/>',
  tool: '<path d="M14.5 6.5a4 4 0 00-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 005.3-5.3l-2.5 2.5-2.5-.5-.5-2.5z"/>',
  chat: '<path d="M4 5h11a2 2 0 012 2v6a2 2 0 01-2 2H9l-4 3.5V15H4a2 2 0 01-2-2V7a2 2 0 012-2z"/><path d="M19 9h1a2 2 0 012 2v5a2 2 0 01-2 2h-1v2.5L16 18h-3"/>',
  flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
  play: '<path d="M8 5.5v13l11-6.5z"/>',
  ext: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
  map: '<path d="M9 4L3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4z"/><path d="M9 4v13M15 6.5v13"/>',
  arrowL: '<path d="M15 5l-7 7 7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  ticket: '<path d="M3 8a2 2 0 002-2h14a2 2 0 002 2v2a2 2 0 000 4v2a2 2 0 00-2 2H5a2 2 0 00-2-2v-2a2 2 0 000-4z"/><path d="M14 6v12" stroke-dasharray="2 2"/>',
  seed: '<path d="M12 20v-7"/><path d="M12 13c0-4 3-6 7-6 0 4-3 6-7 6z"/><path d="M12 15c0-3-2.5-5-6-5 0 3 2.5 5 6 5z"/>'
};
function cdIcon(k, sz, sw) {
  var p = CD_ICONS[k]; if (!p) return PS.icon(k, sz, sw);
  sz = sz || 20;
  return '<svg class="ps-ic" width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
}
