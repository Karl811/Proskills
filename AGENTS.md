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
core/                 LÕI CHUNG, ít sửa: core.js (hồ sơ, lưu trữ, sao lưu, Cài đặt chuẩn), core.css, pwa.js
hub/                  giao diện trang chủ: hub.js, hub.css
icons/                biểu tượng ứng dụng
mau/                  module mẫu (ẩn với học viên, mở bằng ?thu=1) — sao chép khi làm module mới
<id>/                 mỗi module một thư mục, id trùng với config.js (cd01, tk, ...)
```

### Module tk (Nhật Bản Du Ký, HP05)
Tách từ một tệp TK13. Các tệp `tk/*.js` dùng **biến toàn cục chung**, nạp đúng thứ tự trong `tk/index.html`:
`art.js` (hình SVG) → `content.js` (**chữ, nội dung: sửa ở đây**) → `engine.js` (trạng thái, gắn lõi, điểm, điều hướng) → `steps.js` (các dạng bài) →
`report.js` (Hỏi nhanh, demo, báo cáo thầy cô) → `extras.js` (âm thanh, nhịp học, mục tiêu, chuyển cảnh, Cài đặt) → `notebook.js` (Sổ tay) →
`actions.js` (một bộ nghe click) → `game-entry.js` (cửa vào game ải 05 + khởi động, luôn nạp cuối). Game ải 05: `tk/game/` (chỉ tải khi học viên chọn).
Gắn lõi nằm ở đầu `engine.js`: `S.name/by/cls/path` là thuộc tính chỉ đọc lấy từ `PS.profile()`; demo `tk/?demo` lưu ở `ps.demo.tk`.

### Module cd01 (Career Design 1)
Nạp theo thứ tự trong `cd01/index.html`: `art.js` (Shin, biểu tượng) → `content.js` (**chữ, nội dung: sửa ở đây**; ga, chặng, các bước, demo) → `engine.js` (trạng thái, gắn lõi, điều hướng, các dạng bước, Sổ tay, demo).
Thêm ga mới: khai báo hoạt động trong `ACTS`, thêm id vào `acts` của ga, đặt `ready: 1` cho ga, nối id vào `ORDER`, viết cách điền ô Bản Career Design (`cardFilled`, `cardBody` trong engine.js).
Dạng bước có sẵn (khóa `k`): say, pick, multi, video, write (+show), dil, recap, age, tag, venn, ria, riares, tik (+dyn: job/visa, more), inds, cmp, guess (đoán thử → thực tế + Senpai), visa, tl (chọn năm cho từng mốc), tlview, swipe (thẻ Sẵn sàng/Còn lo/Chưa biết, vuốt được), worry.
Chữ có thể chèn `[Tên]`, `[Nghề]` (nghề chính ở a33), `[Diện]` (a44 hoặc hồ sơ). Dữ liệu diện đi Nhật ở `VISA` (content.js) là tóm tắt tham khảo: soát lại với Tikme và nguồn Nhật trước mỗi đợt phát hành.
Dạng bước có sẵn: say, pick, multi (có groups), video, write, dil (tình huống hai bên), recap, age, tag, venn, ria (RIASEC từng câu), riares, tik (mở link Tikme bắt buộc), inds (chọn ngành), cmp. **CD không chấm đúng/sai; chữ viết cho điện thoại: câu ngắn, một ý một câu** (xem đầu content.js).

## 3. Hợp đồng giữa module và lõi (bắt buộc)
1. Trang module nạp theo thứ tự: `../config.js`, `../core/core.css`, `../core/core.js`, `../core/pwa.js`, rồi file của module.
2. Dòng đầu mã module: `if (!PS.guard(ID)) return;` (thiếu hồ sơ hoặc chưa qua cổng thì về trang chủ).
3. Lưu bài: `PS.load(ID)` / `PS.save(ID, S)`. Khóa phụ nếu cần: `ps.mod.<ID>.<tên>`. Demo giáo viên: `ps.demo.<ID>`.
4. Mỗi lần lưu gọi `PS.report(ID, {xp, ins, done, total, days, extra})`. Trang chủ cộng XP, tính chuỗi ngày chung từ đây.
   `extra` là dữ liệu module khác được đọc (ví dụ CD01 để CD02 điền sẵn).
5. Tên, năm sinh, mã HV, lớp, diện, thầy cô: **chỉ đọc** `PS.profile()`, `PS.given()`, `PS.teacher()`. Không hỏi lại, không lưu bản riêng.
6. Sổ tay 3 thẻ: **Tổng quan | thẻ riêng của module | Cài đặt**. Thẻ Cài đặt = `PS.settingsHTML({ctx:'module', mod:ID, pace, extra})` + `PS.wireSettings(el, {...})`. Không tự làm Cài đặt riêng.
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
