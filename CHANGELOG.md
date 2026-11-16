# CHANGELOG · Proskills

Quy ước số phiên bản: **PS a.b.c**
- a: thế hệ lớn của ứng dụng
- b: giai đoạn / thêm module hoặc tính năng lớn
- c: sửa nhỏ trong giai đoạn đó

## PS1.3.3 · 16/11/2026 · CD01: Ga Ngành Nghề
- Ga 4 Ngành Nghề mở (`ready: 1`), 3 chặng + khởi động, điền ô số 5.
- Khởi động “Đoán thử” 3 câu (người mới làm gì, KY, Omotenashi): đoán xong hiện “Thực tế thường là” + Senpai kể. Không đúng sai.
- a42 Nghề của tôi: đoán một ngày làm nghề → mở trang ngành của mình trên Tikme (bắt buộc bấm) → bất ngờ / thích / còn lo → kể một ngày làm nghề 5 năm sau.
- a44 Lộ trình của tôi: chọn diện (gợi ý theo hồ sơ), xem tóm tắt diện (nguồn: Tikme, ISA; ghi mốc Ikusei Shuro 1/4/2027) → mở trang diện trên Tikme (+ link bài chọn visa) → chọn năm cho 8 mốc + 1 mốc riêng → xem dòng thời gian tự vẽ → viết cách bắt đầu mốc gần nhất.
- a43 Sẵn sàng đến đâu?: 8 thẻ đời sống ở Nhật, vuốt hoặc bấm Sẵn sàng / Còn lo / Chưa biết → điều lo nhất (có cả điều ghi ở a42) + Senpai kể → vì sao vẫn muốn đi.
- Dạng bước mới: guess, visa, tl, tlview, swipe, worry. Chữ dùng được [Nghề], [Diện].
- Dữ liệu cho CD02 thêm: visa, tl, day, worry, ready, goWhy. Demo giáo viên: xong đến Ga 4.
- config: cd01 `ver: 'CD01.0.3'`.

File cần xóa trên GitHub: không có.

## PS1.3.2 · 16/11/2026 · CD01: biên tập gọn chữ + Ga Biết Mình + Ga Tính Cách
- Biên tập lại toàn bộ chữ Sân ga và Ga Nhìn Xa cho điện thoại: câu ngắn, một ý một câu (câu hỏi ≤ 1 dòng rưỡi, lời Shin ≤ 2 câu). Ý giữ nguyên.
- Ga 2 Biết Mình: a21 việc thích (+ lần quên cả thời gian) · a22 điểm mạnh chia 4 nhóm Tâm, Thân, Trí, Kỹ năng (+ lời khen) · a23 chọn 3 điều coi trọng → 3 vòng tròn tự vẽ từ lựa chọn → nghề ở giữa 3 vòng. Điền ô số 3.
- Ga 3 Tính Cách: a31 RIASEC 30 câu, mỗi màn một câu (Thích / Không hẳn, có Câu trước) → 3 nhóm nổi bật + biểu đồ 6 nhóm · a32 mở Tikme Ngành nghề (bắt buộc bấm mở), chọn tối đa 3 ngành Tikme gợi ý, so với RIASEC · a33 video 3 dấu hiệu chọn nghề → nghề chính, phương án 2 (có Nghề khác, Chưa nghĩ ra), link trang ngành trên Tikme, vì sao chọn. Điền ô số 4.
- Báo cáo giữa đường sau Ga 3: chọn thầy cô (nếu chưa có) → tin nhắn soạn sẵn 4 ô đầu → Chép tin nhắn / Mở Teams. Có ở hộp hoàn thành Ga 3 và trang Ga 3.
- Shin lớn thêm sau Ga 3 (gà rừng). Demo giáo viên: học viên giả đã xong Sân ga đến Ga 3.
- Dữ liệu cho CD02 thêm: like, good, value, ria, main/mainName, b/bName, why.
- config: cd01 `ver: 'CD01.0.2'`.

File cần xóa trên GitHub: không có.

## PS1.3.1 · 16/11/2026 · CD01 bản xem thử: Sân ga Xuất phát + Ga Nhìn Xa
- Module mới `cd01/` (Career Design 1, bản CD01.0.1), mở cho học viên trong config (`state: 'ready'`, `total: 19`). Mật khẩu cổng như cũ (Oden).
- Nguyên tắc nội dung: Career Design là thiết kế, không phải bài kiểm tra. Không chấm đúng/sai; mọi lựa chọn có "được" và "mất", luôn có "Tùy hôm" và "Mình làm khác"; sau khi chọn hiện lời Senpai kể. XP thưởng khi làm xong, Insight thưởng khi tự viết ≥ 20 từ.
- Luồng theo TK: Sơ đồ tuyến → trang ga (lời Shin, câu mở ga, khởi động 30 giây, chặng, ô Bản Career Design) → trang chặng mỗi bước một màn (thanh bước, thanh trạng thái bấm được, Xem lại bước trước) → đóng dấu → hoàn thành ga.
- Giao diện theo CD49: vé hành trình, Shin (trứng → gà con → … lớn dần theo số ga), nền xanh sáng, nút nổi khối, thanh trên tự ẩn khi cuộn.
- Đầu ra chính: "Bản Career Design của tôi" 8 ô, mỗi ga điền một ô (xem ở trang chủ module và Sổ tay › Bản Career Design).
- Có: Sân ga Xuất phát (1 chặng: luật chơi, tự định vị, video gương học viên, mục tiêu) · Ga Nhìn Xa (khởi động 5 năm nữa; chặng 1 "Mình thật sự hay làm gì?" 5 tình huống; chặng 2 "Hai phiên bản của tôi 5 năm sau"). Ga 2–7 và Ga Ước Mơ hiện "Đang xây".
- Lời Senpai kể ở chặng 1 là **lời kể mẫu** (có nhãn trên màn hình), cần thay bằng chuyện thật ẩn danh trước khi phát hành.
- Demo giáo viên: `cd01/?demo` + mật khẩu chung; học viên giả định đã xong Sân ga và Ga Nhìn Xa; lưu ở `ps.demo.cd01`.
- Dữ liệu cho CD02: `PS.report('cd01', {extra: {goal, now, me, hope, first}})`.
- Tệp: `cd01/index.html`, `cd01/cd01.css`, `cd01/art.js` (Shin, biểu tượng), `cd01/content.js` (chữ: sửa ở đây), `cd01/engine.js` (bộ máy).

File cần xóa trên GitHub: không có.

## PS1.2.2 · 16/11/2026 · Mật khẩu demo chung
- Một mật khẩu demo giáo viên cho mọi khóa: `Oden@123#` (phân biệt hoa thường), đặt ở `config.js` (`DEMO_PASS`).
- Mở demo: thêm `?demo` vào link khóa (ví dụ `tk/?demo`), hộp nhập mật khẩu hiện ra. Bỏ mã cũ `HP05@PHUTANG`.
- Lõi: thêm `PS.checkDemo`, `PS.demoParam`, `PS.demoAsk`; hộp thoại có `onClose`. AGENTS.md mục 3.9 ghi quy tắc cho module mới.
- TK15: dùng mật khẩu demo chung; bước "Giữ bài làm an toàn" đổi thành "Thêm ứng dụng Proskills vào màn hình chính".

File cần xóa trên GitHub: không có.

## PS1.2.1 · 16/11/2026 · Đưa Nhật Bản Du Ký (TK) vào khung
- Module `tk/` (HP05 · Nhật Bản Du Ký, bản TK14) mở cho học viên; mật khẩu như cũ (Đào). Nội dung, cách chấm, XP, Insight, con dấu giữ nguyên TK13.
- Tách cơ học tệp TK13 (một index.html 468 KB) thành: `tk/index.html`, `tk/tk.css`, `tk/art.js` (hình), `tk/content.js` (chữ, sửa nội dung ở đây), `tk/engine.js`, `tk/steps.js`, `tk/report.js`, `tk/extras.js`, `tk/notebook.js`, `tk/actions.js`, `tk/game-entry.js`; game ải 05 ở `tk/game/`.
- Gắn lõi: bỏ màn nhập thông tin và câu hỏi qua cổng riêng của TK (trang chủ làm); họ tên, lớp, diện, thầy cô đọc từ hồ sơ chung; Cài đặt dùng thẻ chuẩn (thêm Nhịp học và lời nhắc, Túi cứu viện); sao lưu, khôi phục, xóa bài làm dùng lõi; âm thanh dùng công tắc chung; chuỗi ngày tính chung.
- Bài làm lưu ở `ps.mod.tk`, demo giáo viên ở `ps.demo.tk` (mở bằng `tk/?demo=HP05@PHUTANG`). Không chuyển dữ liệu TK13 cũ (chưa phát hành).
- Lần đầu vào TK sau khi qua cổng: vẫn có màn mở văn điệp như TK13.
- Trang bản đồ TK có nút nhỏ "‹ Proskills" để về trang chính.
- Sửa lỗi nhỏ có từ TK13: trang ghi chép luôn hiện "Chưa điền" ở ô thầy cô, nay hiện đúng tên.
- Bỏ các tệp riêng của TK13: pwa.js, pwa.css, sw.js, manifest, offline.html, icons (dùng chung của Proskills).
- config.js: module tk `state: 'ready'`, `ver: 'TK14'`, `total: 26` (26 chặng chính, không tính 7 phần khởi động).

File cần xóa trên GitHub: không có (repository Proskills chưa có tệp TK cũ).

## PS1.1.2 · 16/11/2026 · Logo và tên repository
- Logo Proskills mới: đầu tàu tiến về bình minh trên đường ray (ý nghĩa hành trình Career Design). File gốc `icons/logo.svg`; các icon PNG dựng lại từ file này.
- Trang chủ và trang mất mạng dùng logo mới.
- Tên repository chốt: `Proskills`; hướng dẫn tải lên cập nhật link.
- Mã học viên không bắt buộc khi nhập lần đầu (giữ như PS1.1.1).

File cần xóa trên GitHub: không có. Các file icon trùng tên sẽ được thay.

## PS1.1.1 · 16/11/2026 · Khung và lõi chung
Đã làm:
- Trang chủ Proskills: chào mừng + nhập thông tin một lần (họ tên, năm sinh, mã học viên, lớp, diện, thầy cô), tổng chuỗi ngày, tổng XP, Insight, thẻ các module.
- Cổng mật khẩu từng module (CD = Oden, TK = Đào), không phân biệt hoa thường, dấu.
- Lõi chung `core/`: hồ sơ chung, lưu bài theo module, sao lưu một tập tin cho mọi module, khôi phục có chọn phần, xóa làm lại một module (giữ hồ sơ, giữ module khác, giữ chuỗi ngày), Cài đặt chuẩn.
- Một ứng dụng PWA Proskills cho mọi module; học được khi mất mạng sau lần mở đầu.
- Module mẫu `mau/` (ẩn, mở bằng `?thu=1`) để thử khung.
- CD01, CD02, HP05 đang ở trạng thái "Sắp ra mắt".

File cần xóa trên GitHub: không có (bản đầu).
