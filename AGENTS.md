# AGENTS.md · Quy tắc cho mọi người và mọi công cụ AI sửa Proskills

Đọc file này trước khi sửa. Thầy Khoa có thể làm tiếp bằng nhiều công cụ AI khác nhau; mọi công cụ theo cùng quy tắc.

## 1. Proskills là gì
Một website tĩnh trên GitHub Pages, cài được thành ứng dụng (PWA) tên **Proskills**.
Trang chủ cho học viên chọn module; mỗi module là một khóa e-learning nằm trong thư mục riêng.
Người học: học viên 18–25 tuổi chuẩn bị sang Nhật, học chủ yếu trên điện thoại.

## 2. Cấu trúc thư mục
```
index.html            trang chủ (chỉ khung, nội dung do hub/hub.js vẽ)
config.js             PHIÊN BẢN, thầy cô, danh sách module, mật khẩu — file sửa nhiều nhất
sw.js                 service worker duy nhất (đổi VERSION mỗi lần phát hành)
manifest.webmanifest  khai báo ứng dụng Proskills
offline.html          trang báo mất mạng
core/                 LÕI CHUNG, ít sửa: core.js (hồ sơ, lưu trữ, sao lưu, Cài đặt chuẩn, cỡ chữ), core.css, pwa.js, shin.js (gà Shin dùng chung)
hub/                  giao diện trang chủ: hub.js, hub.css, lich.js, avatar.js (ảnh đại diện)
icons/                biểu tượng ứng dụng
mau/                  module mẫu (ẩn với học viên, mở bằng ?thu=1) — sao chép khi làm module mới
<id>/                 mỗi module một thư mục, id trùng với config.js (cd01, tk, tc01, ...)
routine/              Shin Routine (rèn luyện thói quen mỗi ngày), module đặc biệt kind:'routine'
```

### Shin Routine (routine/, từ PS1.3.25)
App Shin Routine (bản gốc M.Claude.3.3.40; trong Proskills đánh số tiếp từ 3.3.41, mã riêng, không phải ES5: có async/await) đặt nguyên trong `routine/`. Tài liệu bàn giao riêng của Shin (HANDOFF, CHANGELOG…) giữ ở thư mục Shin trên máy thầy, không đưa lên GitHub.
- Trong config.js: `{ id:'routine', kind:'routine', open:1, door:1, ver:'M.Claude.3.3.40' }`. `kind:'routine'` = không hiện trong danh sách khóa, trang chủ vẽ khối Shin Routine ở đầu trang (`routineHTML()` trong hub.js; nút Check-in → `routine/index.html?ci=1#checkin`, màu theo `extra.ci`, giờ theo `extra.ciTime`). `open:1` = không cần cổng (`PS.isUnlocked`). `door:1` = cửa Rèn luyện tự chuyển (`doorNeeded()` trong hub.js); từ PS1.3.28 đặt `door: 0`.
- **Trang chủ PS1.3.28** (hub.js, hub.css): thanh trên (chuỗi ngày, ảnh đại diện = Cài đặt) → lời chào `shortName()` (2 chữ cuối) → khối Shin → Lịch học → Khóa học (3 ô số + băng chuyền `KC`/`kcLayout`/`kcGo`, tranh thẻ `ART`, nền `ART_BG` theo id khóa: khóa mới thêm 1 dòng ở hai bảng này, không có thì dùng biểu tượng). Phông Nunito, Be Vietnam Pro lấy từ `routine/assets/fonts`. Không dùng lớp `.lc`, `.lg` cho băng chuyền (đã dùng cho Lịch học).
- **Cầu nối duy nhất: `routine/proskills.js`** (ES5, nạp trước boot.js). Gói lại các hàm Shin `load`, `save`, `splashBoot`, `nbSet`, `exitDemo`; báo `PS.report('routine', …)`; nút về trang chủ ở đầu Sổ tay › Cài đặt; demo `?demo`; thanh "Vào học" khi vào bằng cửa Rèn luyện (`?door=1`). Sửa hành vi Proskills của Shin ở đây, không sửa rải rác trong mã Shin.
- Đã sửa trực tiếp trong mã Shin (ghi lại khi cập nhật bản Shin mới): `routine/scripts/core.js` (khóa lưu `ps.mod.routine` / `ps.demo.routine` / `ps.demo.routine.mode`; `startSW32` đăng ký `../sw.js` phạm vi `../`; chữ "biểu tượng Proskills"), `routine/index.html` (manifest, biểu tượng Proskills; nạp config.js, core.css, core.js, pwa.js, kiểm tra hồ sơ `PS.guard`; nạp proskills.js), `routine/boot.js` (bọc `if(!window.PS_STOP)`). Không có `routine/sw.js`, `routine/manifest.webmanifest`.
- `PS.summary('routine').extra`: day, rec, need, cards [{id, n, m}], active, fire, recDays, mastered, habits, mine {mã: active|pause|keep|master|stored}, lib {mã: tên}. Phút rèn luyện: `ps.mod.routine.min`.
- **Sao lưu (PS1.3.26):** Shin không còn sao lưu riêng; `backup` → `PS.backup()`, nút `data-act="psRestore"` → `PS.restorePick()`; `bkLast()/bkDays()` đọc `PS.prefs().lastBackup` (routine/scripts/core.js).
- **Khóa gợi ý thẻ Shin (PS1.3.26):** `PS.routineSugHTML([mã thẻ…], {from: ID, sub: 'lời dẫn đã esc', title, max})` trả khối HTML (kiểu `.ps-rt` trong core.css); link `PS.routineURL(mã, from)` = `routine/index.html?add=<mã>&from=<id khóa>`. Shin (proskills.js) mở thẻ hoặc màn đặt công thức, rồi hiện "Quay lại <khóa>". Mã thẻ và tên dự phòng: `PS_CONFIG.ROUTINE_LIB`. Dữ liệu gợi ý đặt ở content.js của khóa: CD01 `RT_GAP`, `RT_GRP`, `RT_TXT`; TC01 `RT_BAI`. Không hiện ở demo. Khóa TK (HP05): chưa nối (thầy chốt 17/11/2026), đề xuất sẵn nếu làm sau: Ải Ký túc → 5S, Đúng giờ; Ải Xưởng Rèn → Quan sát ghi lại, Báo cáo; Ải Hồ Ly → Báo cáo; Ải Sòng Đỏ Đen → Chi tiêu.
- **PS1.3.36 (M.Claude.3.4.0):** `shin()` trong routine/scripts/core.js đã thay bằng gà (`PSShin`), routine/index.html nạp thêm `../core/shin.js` — khi chép đè bản Shin mới, áp lại hai chỗ này cùng interaction.js (lớp `evening-shin`) và how-visual.js (`tipHTML`).
- **Đổi mã Shin:** tăng `APP_VER` (routine/scripts/core.js), các `?v=` trong routine/index.html và routine/habit-game.html, `ROUTINE_VER` (sw.js), `ver` của module routine (config.js) cùng một số.
- **Cập nhật bản Shin mới:** chép đè các tệp Shin vào `routine/` (trừ 3 tệp đã sửa ở trên: áp lại các chỗ sửa), đổi `ROUTINE_VER` và danh sách `ROUTINE_FILES` trong sw.js, đổi `ver` của module routine trong config.js.

### Module tk (Nhật Bản Du Ký, HP05)
Tách từ một tệp TK13. Các tệp `tk/*.js` dùng **biến toàn cục chung**, nạp đúng thứ tự trong `tk/index.html`:
`art.js` (hình SVG) → `content.js` (**chữ, nội dung: sửa ở đây**) → `engine.js` (trạng thái, gắn lõi, điểm, điều hướng) → `steps.js` (các dạng bài) →
`report.js` (Hỏi nhanh, demo, báo cáo thầy cô) → `extras.js` (âm thanh, nhịp học, mục tiêu, chuyển cảnh, Cài đặt) → `notebook.js` (Sổ tay) →
`actions.js` (một bộ nghe click) → `game-entry.js` (cửa vào game ải 05 + khởi động, luôn nạp cuối). Game ải 05: `tk/game/` (chỉ tải khi học viên chọn).
Gắn lõi nằm ở đầu `engine.js`: `S.name/by/cls/path` là thuộc tính chỉ đọc lấy từ `PS.profile()`; demo `tk/?demo` lưu ở `ps.demo.tk`.

### Module cd01 (Career Design 1)
Nạp theo thứ tự trong `cd01/index.html`: `art.js` (Shin, biểu tượng) → `content.js` (**chữ, nội dung: sửa ở đây**; ga, chặng, các bước, demo) → `engine.js` (trạng thái, gắn lõi, điều hướng, các dạng bước, Sổ tay, demo).
Thêm ga mới: khai báo hoạt động trong `ACTS`, thêm id vào `acts` của ga, đặt `ready: 1` cho ga, nối id vào `ORDER`, viết cách điền ô Bản Career Design (`cardFilled`, `cardBody` trong engine.js).
Dạng bước có sẵn (khóa `k`): say, pick, multi, video, write (+show, +real), dil, recap, age, tag, venn, riamode (chọn 30/60 câu), ria, riares, tik (+dyn: job/visa, more), inds, cmp, guess (đoán thử → thực tế + Senpai; `slot` = câu theo nghề), jobguess (đoán việc theo nghề; Nghề khác chọn ngành gần nhất), visa, tl (năm + tháng không bắt buộc, tối đa 3 mốc riêng), tlview, swipe (thẻ bấm Sẵn sàng/Còn lo/Chưa biết), worry, comic (truyện tranh mở từng khung, dữ liệu THUY), persp (chọn góc nhìn → lời người thật + ô viết), chat (trò chuyện anh Minh, MINH), chatpick; tik có dyn: job/visa/story. Ga 6: slide (thanh trượt, `sl`; có thể kèm chips), bridge (cây cầu mốc từ a44), plan (trình độ tiếng Nhật + chips theo nghề, `dyn: jpc/work`), gap (đo khoảng cách, GAP_*), habit (2 công thức “Khi… tôi sẽ…”), iv (phỏng vấn 60 giây có đồng hồ). Ô viết có câu gợi ý chạm để dùng (`tips: '@plan'`): câu chưa sửa thì chưa tính Insight.
**Cá nhân hóa theo nghề (từ Ga 4 trở đi):** câu hỏi, ví dụ, gợi ý lấy từ `INDP[jobKey()]` (content.js, tóm từ trang ngành Tikme); chỉ khung hoạt động là cố định. Ví dụ ô viết: `ph: '@wow'`; gợi ý: `tips: '@day'`; chữ chèn `[Nơi]`. Ga mới cũng làm như vậy. **Ga 6 (CD01.0.8):** gợi ý theo TỪNG NGHỀ ở `IND6[mã ngành]` (jpc, work, gap, lvs, note, w6, save, ivx, ivt, ivq); senpai `'@w6'` `'@save'`, tips `'@ivt'` lấy theo nghề; không có nghề thì dùng nhóm (`PLAN.jpcG/workG`, `GAP_GRP`, `IV6_GEN`). Ga 7 và Ga Ước Mơ làm theo cùng cách: dữ liệu theo từng nghề trong 17 nghề, nhóm chỉ để dự phòng.
**Ga Ước Mơ (FINAL, s8, CD01.1.0):** 3 chặng `FIN_ORDER` (a80 cổng soát vé `gate` + `GATE8`; a81 lời hứa `now8`, thư `@letter`/`LETTER8`, `seal8` nhấn giữ; a82 `sheet8` bản 1 trang + lưu ảnh canvas + in, `send8` báo cáo về đích, `next8` Tikme + hướng 5 năm `IND8`). Mở khi đủ 18 chặng, không tính vào `CD_TOTAL`. Nút Bổ sung dùng `FPOS` (ô viết → chặng, bước) và `V.ret`.
**Lần đầu mở CD01 (CD01.1.3):** `viewIntro` = máy in vé (`introPrint`, `printTicket`) → lời Shin → trang chủ → hướng dẫn `TOUR` (4 bước, lưu `S.d.tour`). Âm thanh tự soạn ở `sfx()` (print, ting, train, chime). Banner ga: chấm bi mờ (đã bỏ `?pat=` ở PS1.3.15).
**PS1.3.15 (CD01.1.4):** dạng bước `vseg` (video chia đoạn: `segs` + `fields`, lưu `a33.vs`); a42 bước 1 `jobguess` + `dl` = "Một ngày của bạn TTS" từ `DAYJOB[mã ngành]` (6 việc thật + 3 việc lạc, lưu `a42.dl`). Ô Bản Career Design vẽ bằng `cdCard()` kiểu biển ga (`.eki`) + con dấu ga `ekiStamp()`; dùng chung cho Sổ tay, hộp hoàn thành ga (`chestOv`), xem trước ô. Thẻ tuyến `cdRouteHTML()`, vé vàng `goldHTML()`.
**Chặng đã xong:** bấm vào hiện Xem và sửa / Làm lại từ đầu (bài cũ giữ ở `S.bak` đến khi đóng dấu lại, có Khôi phục). Đổi nghề chính khi Ga 4 đã làm: hộp thoại, bài cũ vào `a42.hist`, chặng a42 hiện "Cần làm lại theo nghề mới".
Chữ có thể chèn `[Tên]`, `[Nghề]` (nghề chính ở a33), `[Diện]` (a44 hoặc hồ sơ). Dữ liệu diện đi Nhật ở `VISA` (content.js) là tóm tắt tham khảo: soát lại với Tikme và nguồn Nhật trước mỗi đợt phát hành.
Dạng bước có sẵn: say, pick, multi (có groups), video, write, dil (tình huống hai bên), recap, age, tag, venn, ria (RIASEC từng câu), riares, tik (mở link Tikme bắt buộc), inds (chọn ngành), cmp. **CD không chấm đúng/sai; chữ viết cho điện thoại: câu ngắn, một ý một câu** (xem đầu content.js).

### Module cd02 (Career Design 2 · Hải Đồ La Bàn, từ PS1.3.37)
Nạp theo thứ tự trong `cd02/index.html`: `../core/shin.js` → `art.js` (biểu tượng `CD2_IC`/`cdIc`, cờ `flagSym/flagSVG/flagMast`, thuyền `shipSVG(lv)`, la bàn `compassSVG`, đảo `isleArt`, sương `fogArt`, Shin `shin2()` = PSShin gà lớn + `fit: 'captain'`) → `content.js` (**chữ: sửa ở đây**) → `engine.js`.
- Dữ liệu: `ISLES` (8 đảo = 8 hướng; x, y trên hải đồ 360×460; who = mã Senpai) · `SENPAI` (người thật: kd/bn/nay khóa tóm tắt, q nguyên văn, url, f điểm chung `CD2_F`) · `BASE5` (5 nền, rt = thẻ Shin Routine) · `HANH` (nhân vật ghép) · `PORT`, `BEN` (r: vòng 1 tùy ý / 2 lần lượt / 3 tùy ý; `ready: 1` = đã mở) · `ACTS`, `ORDER`.
- Mở khóa ở `benOpen()`: x1 → b1, b2 → b3 → b4 → b5, b6 → (đủ 6 con dấu) Cảng Khởi Hành. Mở bến mới: viết chặng vào `ACTS`, đặt `ready: 1`, nối id vào `ORDER`.
- Dạng bước (k): say, write (key, min, tips), from, flag, open1, card, flip, flipsum, isles, pickisle, book, common, base, chat, pairs, winds, life, compass. Mỗi dạng có `STEP[k]` và (nếu cần) `CHECK[k]`.
- Chữ chèn: [Tên], [Nghề], [Đảo] (b13), [Lệch] (la bàn), [Gió], [Gió2] (b32).
- Trạng thái `S`: d, done, xp, ins, days, seen, cards (thẻ Senpai), isl (đảo đã tan sương), stamp (con dấu bến). Thẻ mới +2 XP (`xp['card.<id>']`).
- Đọc CD01: `PS.summary('cd01').extra` (jobKey/main, mainName, far, letter). Không học CD01 vẫn vào được (chọn nghề ở x1).
- Quy tắc chữ: không đúng/sai; không chữ “hải tặc”, không cờ đầu lâu; biển, đảo hư cấu; ý của Thầy nói gián tiếp “thầy của Shin”; Senpai chỉ JLPT N3+ và chuyện đã công khai.
- **Từ PS1.3.38 (CD02.1.0) đủ khóa:** Bến 4 (b41–b43, `VOY`, `MS_TIPS`, `JL_OPTS`, `METERS`), Bến 5 (b51–b53, `WEIGHT`, `FEEL3`, `BLOCKS`, `WHY3`, `TRIALS`, `TRY_ISLE`), Bến 6 (b61–b62, `RING_P`, `RING_L`, `MSG_Q`, `WORKS`, `LEARN_H`), Cảng Khởi Hành `GOAL_PORT` (acts f1, f2; `FIN_ORDER`, không tính vào `CD2_TOTAL` = 18). Dạng bước mới: voy, tline, meters, trio, weigh, leanpick, block, why3, ways, real, trial, ring, msg, work, habit, open2, sheet, send, cert. Khóa dữ liệu hải trình: `<b41|b42|b43>.isl/.islo/.name/.m1/.m3/.m5/.jl/.g`; cân `b51.w`, nghiêng `b51.lean`; thử nhỏ `b53.try/.when/.with/.start/.tk`. Chữ chèn thêm [Nghiêng]. Xong f2 → `S.fin` (không đóng dấu, có Bằng Thuyền Trưởng `certHTML()`), `extra.fin` mở trang phục Thuyền trưởng (`PSShin.FITS` phần tử thứ 5 = mã khóa, `PSShin.earned`).

### Module tc01 (Huấn luyện thể chất, TC01)
Nạp theo thứ tự trong `tc01/index.html`: `art.js` (HLV Shin `shin()`, người tập `fig(tênTưThế,{marks})` từ `POSES`, `figGuide/figArrow/figArc`, biểu tượng `TC_ICONS`) → `content.js` (**chữ: sửa ở đây**: `GROUPS`, `JOBS`, `KHU`, `TXT`, `EX` động tác, `MOC` mốc lớp, `BAI` bài và hoạt động, `PLANS`, `DEMO`) → `engine.js`.
**Không tuần tự:** mọi khu, bài, hoạt động mở tự do. Khu chưa làm: `KHU[].ready` không có → "Sắp mở". Thêm khu mới: thêm dữ liệu bài như `BAI` và bật `ready: 1`.
Dạng hoạt động (`k`): how (EX.frames: p tư thế, t lời, g đường gióng, a mũi tên, arc vòng xoay) · spot (rounds: p, q, hs [x,y,r,t,why] trên hệ tọa độ 240×180) · try (ex: danh sách động tác; MOC[ex].u 'rep' đếm, 's' bấm giờ) · order · pick (opts, ok, why) · plan.
Tư thế mới: thêm vào `POSES` (tọa độ khớp; công cụ tạo ở máy Claude, có thể sửa tay từng số). Nhìn nghiêng: L = [chân xa, tay xa, chân gần, tay gần]; nhìn thẳng: L = [chân trái, chân phải, tay trái, tay phải].
**Khu Bếp dinh dưỡng (từ TC01.0.3):** bài ở `BAI_BEP` (content.js, id d1–d6, hoạt động d1a…); bài chưa làm có `soon: 1, acts: []` → hiện "Sắp mở". Mỗi bài có `khu` ('san' | 'bep', engine tự gán); `baisOf(khu)`, `baiCount(khu)`. Dạng mới: plate (xếp đĩa, `items[].z` ∈ PLATE_Z) · meal (bữa hôm qua, `MEAL_FOODS`) · write (viết ra, `tips`) · calc (BMI/BMR/TDEE/nước, `ACT_LV`) · hilo (`pairs` [tên, kcal/100 g]) · day (`items` có `err`) · commit (`HABITS`, 21 ngày). pick có thêm `rounds` (nhiều câu) và `byGroup` (câu theo nhóm). Dữ liệu học viên ở `S.food` (meal, calc, commit{h, txt, at, days}); báo về trang chủ `extra.food`. Ở khu Bếp, `SHIN_OUTFIT = 'apron'` (Shin đeo tạp dề, không băng đô). Thẻ hội viên có 2 dải dấu (Sàn tập, Bếp).
**Góc nghề (từ TC01.0.5):** bài ở `BAI_NGHE` (id n1–n6, khu 'nghe'), chữ ở `NGHE_TXT`, `BODY_Z`, `BODY_NEED`, `LAD_G`, `LAD_NEED` (tra mã nghề trước, rồi nhóm). Dạng: body · ladder · story (story + rounds hỏi dồn + viết). pick: `rounds` + `byGroup`/`byJob` thay câu cuối; `kg: 1` hiện thẻ mức nâng (`kgInfo`). Vật vẽ thêm `TC_MARK`, cảnh `TC_ART.kho`, tư thế liftLow/liftUp/liftBad/carryHigh. `SHIN_OUTFIT = 'helmet'`. Dữ liệu `S.nghe` (body, lad), báo `extra.nghe`.
**Góc nghề đợt 2 (TC01.0.6):** dạng flow (tập theo Shin, đếm giờ: `fx` = mã EX, `sec` giây mỗi động tác, `EX[].frames[].c` lời ngắn) · ca (`CA_DAY[nhóm]` 8 mốc `CA_H`, `hot`; `SCHOOL_DAY` ngày học 8–17 giờ) · habit (`NHABITS`) · week (`N6_SET`). how/try nhận `exBy` (bộ động tác theo nhóm; nữ đổi pushup → kneepush). Khung hình nhận `mu` (vẽ dưới người tập, vd ghế `TC_MARK.chair`). Chữ ở `NGHE2_TXT`. Lưu `S.nghe.fl/ca/habit/week`.
**Bếp đợt 2 (TC01.0.4):** dạng match (`pairs` v/j/k/r) · basket (`items` j/k/v/p/g/w, `budget`, `days`) · label (`rows`, `rounds[].ok` = số dòng hoặc 'p') · shift (`SHIFTS`, `shiftPlan`) · bento (`slots[].opts[].no` = món chưa hợp) · date (`items`, `DATE_LAB`). pick: `byGroup[g].rounds`, `end`. spot: `rounds[].art` = tên hình trong `TC_ART` (art.js, hệ 240×180). Chữ ở `BEP2_TXT`. Lưu `S.food.konbini/shift/bento`.
**Shin Fitness Center (TC01.0.7):** cửa phòng tập `storefront()` (Shin `a-taiso`), phiếu đăng ký `.reg`, trao thẻ `handover()` (lớp phủ `.hov`), thẻ hội viên `memCard(big, still)` = `cardFront()` + `cardBack()` (lật bằng `data-act="flipCard"`), hàng lỗ `punchRow(khu, nhãn, bàiMới)`, hạng `TIERS`/`tier()`, nhãn hàng lỗ `PUNCH`. Âm thanh `sfx(door|whistle|pen|slide|ting|flip|punch)` theo `PS.soundOn()`. Khu mới cần thêm 1 dòng vào `PUNCH`.
**Tòa nhà, bảng tên phòng, sân (TC01.0.8):** `KHU[]` có `no` (số phòng), `en`, `short`, `col` [màu sáng, màu đậm]; tầng ở `FLOORS` ('lobby' = lễ tân, `LOBBY`). Nội thất phòng vẽ ở `TC_ROOM[id](w)` + `TC_ROOM_W` (art.js, hệ W×118). `building()`, `room()`, bảng tên phòng `zoneHead()` (.zh). Sân trước: `tc01/yard.js` (`TCYard.mount/unmount`), Matter.js `tc01/matter-0.19.0.min.js` tải lười trong `mountYard()`; mẹo ở `YARD_TIPS`. Chữ ký Shin `SHIN_SIG` (art.js). Mở phòng mới: bật `ready`, thêm 1 dòng `PUNCH`.
**Phòng y tế (TC01.1.1–1.1.2):** bài ở `BAI_YTE` (id y1–y6, khu 'yte'; đủ 6 bài từ TC01.1.2; habit `hl` → `YHABITS`, lưu `S.yte.habit`; pick `scale` → thẻ `THANG`, cũng ở Sổ tay › Khẩn cấp; write `dyn: 'yte'`), chữ `YTE_TXT`, Thẻ khẩn cấp `KC` (Sổ tay › thẻ 'kc', ô tự ghi `data-kc` lưu `S.kc`, không báo cáo). Dạng **sim** (Ca trực): `scene {ic, place, time, tag}`, `intro` (có [Tên]), `steps[] {say, q, opts[] {t, ok, key, res, why}}`, `end`; trạng thái `T.sm {i, pick, tried, first, met}`; lưu `S.yte.sim`, báo `extra.yte`. Hoạt động nhận `kl` (nhãn dạng riêng), story nhận `w` (khóa chữ câu viết), match tra `TK()` = `YTE_TXT` rồi `NGHE_TXT`. `SHIN_OUTFIT = 'aid'`. PUNCH có dòng AID. Kiểu `.cnt` của cửa phòng tập chỉ áp `.door .cnt`.
**Phòng test (TC01.1.3):** bài ở `BAI_TEST` (id t1–t6, khu 'test'; t4–t6 `soon`), chữ `TEST_TXT`. Ngân hàng `QB.dd`/`QB.sk` (`{id, s: bài để ôn, q, o: [đúng, sai, sai], why}`, `o[0]` luôn đúng, máy xáo) và `QTF.dd`/`QTF.sk` (`{id, s, t, v: 1|0, why}`). Dạng: **quiz** (`bank` 'dd'|'sk'|'mix', `n`, `pass`; `T.qz`) · **tf** (`bank`, `n`; `T.tq`) · **redo** (ôn `S.test.w`; `T.rd`). Lưu `S.test = {q: {id: {b, l, n, k, at}}, w: {mã câu: 1}, tf: {id: {b, n}}}`, báo `extra.test` (`testSum()`). Thêm câu: chỉ sửa content.js, giữ 1 đáp án sai dài bằng hoặc hơn đáp án đúng. PUNCH có dòng TEST.
**Tự test thể lực (TC01.1.4):** t4–t6 mở. Dạng **ft** (một buổi test nhiều bài: `items` = khóa trong `FT`, `lv` 'cb'|'nc'|'sb'; `T.ft {st 0 giới thiệu|1 làm bài|2 kết quả + nghỉ 2 phút|3 tổng kết, i, r, rs, feel, rec}`; dùng lại nút đếm `tap`/`tStart` của try) · **board** (thẻ thành tích `ftCard()`). `FT[k] = {n, ex (hoặc {nam, nu}), u 'rep'|'s', dat {nam, nu} | lad: 1 (thang MOC), how (bài chưa có hình), nuN}`, chữ `FT_TXT`. Lưu `S.ft.h [{d, a, lv, r, f}]` (≤ 40) + ghi `S.log[ex]` với `t: 1` (tryCount bỏ qua). Mục tiêu lần tới = `S.refl.t6b` (write `dyn: 'ft'` → `ftTips()`). Báo `extra.test.ft` (`ftSum()`). Sổ tay › Thẻ hội viên có mục "Thể lực tự test" (`nbFt`). Demo: `DEMO.ft`.
**Radio Taiso Deck (TC01.1.5):** bài ở `BAI_RT` (id r1–r6, khu 'radio', `gtip: RT_GTIP`), 13 động tác `RT[] {n, j, k, n8 (số lần 8 nhịp khi tập trong app), cue, id rt01–rt13}`, `EX.rt01…rt13` (2 khung, tạo trong content.js), chữ `RT_TXT`, đếm `RT_COUNT`, tốc độ `RT_TEMPO`. Tư thế mới `rt*` trong art.js (nhìn thẳng, lật như soi gương; `POSES[].top` = khoảng trống trên cho tay giơ cao, `fig()` nới viewBox). Máy đếm nhịp dùng chung `mtStart(ms, cb, k0)/mtStop()`, tiếng `beep(hi)` (theo `PS.soundOn()`, không tắt khi giảm chuyển động). Dạng: **beat** (bắt nhịp: 8 nhịp nghe + 16 nhịp chạm, ±170 ms, chạm bằng pointerdown; `T.rb`) · **rtq** (thẻ nhanh `mv`: vòng chẵn "hình này là động tác nào", vòng lẻ "sau X là"; `rtqOpts` luôn có 1 đáp án sai dài ≥ đáp án đúng; `T.rq`) · **rflow** (tập theo nhịp `mv`, hình đổi bằng CSS `.tg`, giảm chuyển động hiện 2 khung `.tgs`; `T.rf {st, tp, mi, g, run, feel}`) · **rself** (tự chấm 3 tiêu chí Bảng 3.3 + động tác cần tập thêm; `T.rs`) · **sang7** (hẹn 7 buổi: `s7Card()` ở khu và Sổ tay, nút `s7Tick`). Lưu `S.radio {beat, fl, self {c, need}, s7 {slot, txt, at, days}}`, báo `extra.radio` (`radioSum()`), Sổ tay `nbRadio()`. Nhạc thật: `TC_RADIO` (`vidBtn()`), không nhúng nhạc. PUNCH có dòng DECK (đủ 36 lỗ = CHAMPION).
**Buổi tập 10 phút cùng Shin (TC01.1.5):** màn riêng `V.v = 's10'` (`viewS10()`, nút `s10Btn()` dưới "Gợi ý hôm nay"). PA A: 3 bài cố định `S10_MENU {id, n, ic, d, main[6 mã EX]}`, khung `S10 {warm: 'preshift', cool: 'midstretch', wSec 24, work 40, rest 20}` (`qSegs`), chữ `S10_TXT`. Trạng thái `QS {st 0 chọn|1 giới thiệu|2 tập|3 xong, m, segs, i, run, end, rem, act, feel, full}`, đồng hồ `qRun/qPause/qNext/qEnd`. Không đục lỗ thẻ; mặt sau thẻ có ô số buổi (`PT_IC.tm`). Lưu `S.s10.h [{d, m, sec, f, full}]`, báo `extra.s10` (`s10Sum()`: n, min, wk, pain, last 5), Sổ tay `nbS10()`. Demo: `DEMO.radio`, `DEMO.s10`.
Màu (từ TC01.0.2): chủ đạo M4 Xanh JPC dịu `--c #348A5F`, màu phụ Kem cát `--ac*` (nút mời gọi `.btn--go`, dải dấu thẻ hội viên, `gtip`, mũi tên/vòng trên hình `#B8964F`), `--ok #2B8A86`. Không dùng lại vàng `#FFC93C` trong TC01; `--xp` giữ như mọi khóa.
Hồ sơ tập luyện ở `S.mem` (job, g, g2, sex, inj 0/1, goal, h, w). Gợi ý nghề từ CD01: `PS.summary('cd01').extra.jobKey`. Báo về trang chủ `extra`: job, group, goal, tries, plan.

### Dùng như app thật, intro, logo (PS1.3.34)
- **Logo**: `icons/logo.svg` = bản nền trắng (V2) dùng trong trang; hình app = bản nền xanh (V1). Màu: xanh dương #0F4D98, xanh lá #199F5A, đỏ #EE1D23 (theo logo JPC).
- **Intro** chỉ ở trang chủ (`intro()` trong hub.js, `.pi*` trong hub.css, đoạn script đầu index.html), lần mở đầu trong ngày (`ps.intro`). Module và Shin không có intro.
- **Hành vi app** đặt chung ở cuối core.css và trong pwa.js: module mới chỉ cần nạp core.css, pwa.js như hợp đồng. Chỗ cần cho chọn chữ: thêm lớp `ps-sel`. Khu có cử chỉ riêng tự đặt `touch-action`. Viewport mọi trang: `maximum-scale=1, user-scalable=no`.
- **Service worker**: tệp js/css PHẢI có `?v=<phiên bản>` khi nạp (được lấy từ bộ nhớ ngay, không chờ mạng); quên `?v=` thì học viên có thể giữ bản cũ đến khi mạng trả về. Hình/phông/âm thanh không cần `?v=`.
- **Nút Back** ở trang chủ: tấm mới (giống Cài đặt, Lịch học) gọi `W.PSSheetPush()` khi mở và `W.PSSheetDone()` khi đóng bằng nút.

### Ảnh đại diện, cỡ chữ, gà Shin (PS1.3.36)
- **Ảnh đại diện**: `hub/avatar.js` (`PSAvatar`): 12 hình `AV` [mã, tên, màu nền, hình 96×96] + chữ cái 8 màu `COLS`; lưu `PS.prefs().av`. Thêm hình: thêm dòng vào `AV`, không đổi mã cũ.
- **Cỡ chữ**: `PS.fontBig()`, `PS.setFont()`, `PS.applyFont()` trong core.js; hàng "Cỡ chữ" nằm trong `PS.settingsHTML` (mọi khóa). Cỡ chữ trong CSS phải viết bằng px để được phóng; chữ đặt bằng `style=` trong JS không được phóng. Trang không muốn phóng: `window.PS_FS_OFF = 1`.
- **Gà Shin**: `core/shin.js` (`PSShin.svg(mood, {stg, fit, days})`, `PSShin.now(mood)`, `look()`, `stageOf()`, `FITS`, `STAGE_DAYS`). Khung 120×124. Nạp ở index.html và routine/index.html. Shin Routine: `shin()` (routine/scripts/core.js) gọi `PSShin.now`; Tủ đồ, màn "Shin đã lớn" ở routine/proskills.js. CD01 (`cd01/art.js`) và TC01 (`tc01/art.js`) vẫn dùng hình Shin riêng cùng nét vẽ; nếu cần đồng bộ sâu hơn, chuyển dần sang `PSShin`.

## 3. Hợp đồng giữa module và lõi (bắt buộc)
1. Trang module nạp theo thứ tự: `../config.js`, `../core/core.css`, `../core/core.js`, `../core/pwa.js`, rồi file của module.
2. Dòng đầu mã module: `if (!PS.guard(ID)) return;` (thiếu hồ sơ hoặc chưa qua cổng thì về trang chủ).
3. Lưu bài: `PS.load(ID)` / `PS.save(ID, S)`. Khóa phụ nếu cần: `ps.mod.<ID>.<tên>`. Demo giáo viên: `ps.demo.<ID>`.
4. Mỗi lần lưu gọi `PS.report(ID, {xp, ins, done, total, days, extra})`. Trang chủ cộng XP, tính chuỗi ngày chung từ đây.
   `extra` là dữ liệu module khác được đọc (ví dụ CD01 để CD02 điền sẵn).
5. Tên, năm sinh, mã HV, lớp, diện, thầy cô: **chỉ đọc** `PS.profile()`, `PS.given()`, `PS.teacher()`. Không hỏi lại, không lưu bản riêng.
6. Sổ tay 3 thẻ: **Tổng quan | thẻ riêng của module | Cài đặt**. Nút Sổ tay chính của module **mở thẻ Cài đặt trước** (có nút về trang chính; từ PS1.3.25). Thẻ Cài đặt = `PS.settingsHTML({ctx:'module', mod:ID, pace, extra})` + `PS.wireSettings(el, {...})`. Không tự làm Cài đặt riêng.
7. Nghe `window` sự kiện `ps:change`: `beforeBackup`/`beforeRestore` → lưu ngay; `profile` → vẽ lại tên. Không lưu khi `window.PS_NOSAVE` bật.
8. Âm thanh: đọc `PS.soundOn()` (công tắc chung).
9. Demo giáo viên: **một mật khẩu chung** `PS_CONFIG.DEMO_PASS` cho mọi module. Mở bằng `<id>/?demo`: module đọc `PS.demoParam()`;
   đúng mật khẩu (`PS.checkDemo`) thì vào demo, chưa có thì gọi `PS.demoAsk(cb)`. Có `?demo` thì bỏ qua `PS.guard`.
   Dữ liệu demo ở `ps.demo.<ID>`, không gọi `PS.report`. Không đặt mật khẩu demo riêng trong module.

## 4. Quy tắc mã
- JavaScript kiểu cũ ES5 (var, function, nối chuỗi) cho mọi file chạy trên trang. Không dùng `?.`, `??`, `=>`, `let/const`, `class`, lookbehind. Riêng `sw.js` được dùng cú pháp mới.
- Không bao giờ `localStorage.clear()`. Mọi khóa lưu trữ bắt đầu bằng `ps.`.
- **Không tạo file vá** (kiểu refinement16.js, final.css). Sửa đúng file phụ trách phần đó.
- Tên file giữ cố định giữa các phiên bản. Phiên bản ghi trong config.js, sw.js và tham số `?v=`.
- Trong module: chữ (nội dung) tách khỏi luồng xử lý và giao diện, để sửa chữ không đụng mã.
- Ưu tiên điện thoại 390px, rồi máy tính 1280px. Tôn trọng `prefers-reduced-motion`.
- **Từ ngữ:** không dùng từ "đơn hàng" ở mọi module. Dùng "cơ hội việc làm" hoặc "công việc" tùy ngữ cảnh.

## 5. Phát hành một bản mới (PSa.b.c)
1. Sao chép cả thư mục bản trước thành thư mục mới `PSa.b.c` rồi mới sửa.
2. Đổi số phiên bản ở: `config.js` (APP_VER), `sw.js` (VERSION), các `?v=` trong `index.html` và trang module có sửa.
3. Ghi CHANGELOG.md: đã đổi gì; **file nào cần xóa trên GitHub** (tải lên trên web không tự xóa file cũ).
4. Kiểm thử (mục 6), rồi kéo thả toàn bộ nội dung thư mục lên GitHub.

## 6. Kiểm thử tối thiểu
- Cú pháp ES5: `acorn --ecma5` cho config.js, core/*.js, hub/hub.js, mã module.
- Chạy bằng máy chủ tĩnh (`python3 -m http.server`), trình duyệt 390px và 1280px:
  vào thẳng module khi chưa có hồ sơ → về trang chủ → nhập thông tin → cổng tự mở → sai rồi đúng mật khẩu → vào module →
  làm hoạt động → Sổ tay › Cài đặt → đổi lớp → tải sao lưu → về trang chính (tổng XP đúng) → xóa bài làm module (hồ sơ còn) →
  khôi phục → mất mạng mở lại trang chủ và module. Chỉ có đúng **1** service worker.
- Chưa kiểm được bằng máy: cài thật trên iPhone/Android, màu thanh trạng thái, phông chữ khi mất mạng.

## 7. Phiên bản hiện tại
Xem CHANGELOG.md.
