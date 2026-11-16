# CHANGELOG · Proskills

Quy ước số phiên bản: **PS a.b.c**
- a: thế hệ lớn của ứng dụng
- b: giai đoạn / thêm module hoặc tính năng lớn
- c: sửa nhỏ trong giai đoạn đó

## PS1.3.10 · 16/11/2026 · CD01: Ga Ước Mơ (Ga 8, về đích) · CD01.1.0
- Ga Ước Mơ mở khi xong 18 chặng. 3 chặng nghi thức (`FIN_ORDER`: a80, a81, a82), không tính vào 18. Đi liền một mạch: xong chặng nào mở luôn chặng sau.
- a80 Cổng soát vé: máy soát 8 ô (tia quét, ô sáng lần lượt). Ô sơ sài (ít từ hơn mức trong `GATE8`, hoặc còn nguyên câu gợi ý) hiện vàng + Shin “Ô 3 còn ngắn. Muốn thêm chút cho trọn không?”. Nút **Bổ sung** mở đúng ô viết (thanh “Xong, quay lại cổng”, Insight tính lại). Luôn qua cổng được. Lưu `a80.thin`.
- a81 Lời hứa với mình: hỏi lại câu “rõ nghề chưa” của Sân ga, hình lúc lên tàu → bây giờ (lùi cũng có lời Shin tích cực) + chọn điều giúp mình nhiều nhất · thư gửi “mình năm [năm nay + 5]” (3 gợi ý ghép từ bài của học viên: câu ô 2, việc khó, thói quen, lý do đi, 5 năm sau theo nghề, câu nhắn tuần đầu) + 1 câu ngắn làm chữ ký · **nhấn giữ 2 giây để đóng dấu** 約束 (sửa thư thì đóng dấu lại).
- a82 Bản Career Design 1 trang: 8 ô + câu trả lời phỏng vấn 60 giây + lời hứa và chữ ký có con dấu · **Lưu ảnh** (vẽ bằng canvas, không cần mạng, ảnh 1080px) · **In / Lưu PDF** (chỉ in bản 1 trang, khổ A4) · Báo cáo về đích gửi thầy cô (Teams, chép tin nhắn) · Tikme đọc thêm theo nghề (trang ngành, diện, chuyện cùng ngành) · chọn hướng 5 năm tới theo TỪNG NGHỀ (`IND8.far`, 17 nghề + gen) + Senpai chúc (lời kể mẫu) + hẹn CD02.
- Vé hoàn thành (vàng, 8 con dấu ga, câu chữ ký) khi về đích; mở lại ở trang Ga Ước Mơ. Trang chủ: nút “Xem Bản Career Design 1 trang”, cuống vé ghi “Về đích + ngày”. Sổ tay có nút mở bản 1 trang.
- Dữ liệu cho CD02 thêm: thin, now2, help8, letter, motto, sealAt, far, endAt.
- Demo giáo viên: vẫn xong đến Ga 7, Ga Ước Mơ đang chờ; ô 3 (a21.flow) cố ý ngắn để thấy cổng soát vé gợi ý bổ sung.
- Kiểm 390/360/1280, giảm chuyển động; đủ 17 nghề + Nghề khác (có/không ngành gần); ES5 đạt; không lỗi console; không tràn ngang; lưu bài thật báo về trang chủ đúng.
- config: cd01 `ver: 'CD01.1.0'`.

File cần xóa trên GitHub: không có.

## PS1.3.9 · 16/11/2026 · CD01: Ga 7 Thử Thách (2 chặng, theo TỪNG NGHỀ)
- Ga 7 còn 2 chặng (bỏ a73). Toàn khóa: Sân ga + 17 chặng = 18. Lời cam kết và soát vé chuyển sang Ga Ước Mơ.
- a71 Tuần đầu ở Nhật: lịch tuần mini, mở 2 ngày. Thứ Ba: tình huống riêng nghề (`IND7[mã ngành].sc`, 17 nghề + `gen`). Thứ Năm: tình huống từ điều lo nhất ở Ga 4 (`WORRY7`, 8 thẻ; thẻ 4 dùng điều vất vả riêng nghề; điều tự viết dùng `WORRY7_OWN`). 3 cách đều có được/mất + “Mình làm khác” → “Điều có thể xảy ra” + Senpai kể. Cuối: chọn 1–2 việc chuẩn bị + một câu nhắn cho mình của tuần đầu.
- a72 Việc khó đầu tiên: ba vùng (An toàn · Học hỏi · Quá sức), học viên tự xếp thẻ việc lấy từ chính hành trình (việc chuẩn bị ở a71, hỏi người dẫn đường 2 câu ở Ga 5, nói câu phỏng vấn 60 giây, 2 việc khó theo nghề `IND7.hard`, 2 việc chung, việc tự thêm). Nhận 1–2 việc, hạn chót (7 / 14 ngày / chọn ngày), ai cùng biết, “Nếu ngại, mình sẽ…”.
- Sau hạn chót: trang chủ có lời Shin “kể Shin nghe”, chọn Làm được / Làm một phần / Chưa làm + 1 dòng (+10 XP lần đầu, không phán xét). Trang Ga 7 có nút “Kết quả việc khó” để kể bất cứ lúc nào.
- Ô 8 đổi tên “Thử thách và việc khó của tôi”. Hình mới: `cdBoy`, `cdWork` (9 cảnh: xưởng, công trường, nông trại, kaigo, nhà hàng, xưởng thực phẩm, vệ sinh, văn phòng, ký túc xá), `cdZones`.
- Demo giáo viên: học viên giả định xong đến Ga 7, hạn việc khó là hôm qua để thấy lời Shin hỏi kết quả.
- File cần xóa: không có.

## PS1.3.8 · 16/11/2026 · CD01: Ga 6 cá nhân hóa theo TỪNG NGHỀ (17 nghề)
- Đọc lại 17 trang ngành Tikme (16/11/2026), tóm vào `IND6[mã ngành]` (content.js). Ga 6 không còn chung theo nhóm: cơ khí, may mặc, đóng gói… mỗi nghề một bộ gợi ý riêng.
- Khởi động “Rõ mấy phần?”: Senpai kể theo nghề (kế hoạch từng đổi trong nghề đó).
- a62: việc ở JPC (3 gợi ý riêng nghề đứng đầu, rồi gợi ý chung); điều muốn đạt ở Nhật (tên kỳ thi, máy, vị trí đúng nghề, vd. Ginou Kentei cơ khí cấp 3, lái xe nâng, Kaigo Fukushishi); Senpai để dành theo nghề.
- Ghi chú trình độ tiếng Nhật theo diện + nghề: “kaigo cần N4” chỉ hiện khi nghề là kaigo (Thực tập sinh); kaigo Kỹ năng đặc định thêm bài thi tiếng Nhật kaigo; kỹ sư: N3 trở lên. Thực tập sinh nghề khác: “thường học khoảng N5–N4 trước khi bay”.
- Sau khi chọn trình độ trước khi bay: thêm 1 câu theo nghề (vd. kaigo, nhà hàng cần giao tiếp nhiều).
- a63 Đo khoảng cách: 4 điều riêng nghề + điều vất vả của nghề (r3) + 4 điều chung; việc nhỏ gợi ý cho “Khi… tôi sẽ…” theo nghề. Đã bỏ các ý trùng với r3.
- Phỏng vấn 60 giây: ví dụ + 3 gợi ý cấu trúc theo nghề; thẻ mới “Người phỏng vấn ngành … hay hỏi thêm” (1 câu + cách trả lời, không bắt buộc viết).
- Nghề khác không có ngành gần: giữ gợi ý theo nhóm (dự phòng `PLAN.jpcG/workG`, `GAP_GRP`, `IV6_GEN`).
- Demo giáo viên (cơ khí) cập nhật theo gợi ý mới. Kiểm 390/1280: cơ khí, may mặc, kaigo, nhà hàng, kỹ sư, Nghề khác; lướt đủ 17 nghề; ES5 đạt; không lỗi console.
- config: cd01 `ver: 'CD01.0.8'`.

File cần xóa trên GitHub: không có.

## PS1.3.7 · 16/11/2026 · CD01: Ga 6 Định Hướng
- Ga 6 Định Hướng mở (`ready: 1`), khởi động + 2 chặng, điền ô số 7. Câu hỏi, gợi ý theo nghề chính (nhóm nghề trong INDP; thực phẩm, thủy sản có nhóm riêng).
- Khởi động “Rõ mấy phần?”: thanh trượt 0–10, kéo xong hiện Senpai kể (lời kể mẫu).
- a62 Kế hoạch 2 chặng: cây cầu mốc (lấy các mốc ở Ga 4, chia Chặng 1 · Ở JPC / Chặng 2 · Ở Nhật theo mốc bay) → trình độ tiếng Nhật trước khi bay (ghi chú theo diện) + 2–4 việc ở JPC → trình độ ở Nhật + 1–3 điều trong công việc → thanh trượt để dành mỗi năm (số tự đặt, tham khảo, có “Mình chưa tính được”, link trang ngành Tikme) + trải nghiệm ngoài giờ → viết 2 câu kế hoạch (gợi ý ghép từ lựa chọn, chạm để dùng; câu gợi ý chưa sửa thì chưa tính Insight).
- a63 Đo khoảng cách: “Nghề cần − Bạn đã có = Việc cần rèn”, 8 điều theo nghề, chọn Đã có / Đang có dần / Chưa có (không đúng sai) → 2 công thức “Khi… tôi sẽ…” (chạm việc nhỏ gợi ý từ điều còn thiếu, có “Lúc khác”) → trả lời phỏng vấn 60 giây: xem lại ý đã viết ở các ga trước, ước lượng số giây đọc to, đồng hồ 60 giây tập nói (không bắt buộc, đếm số lần tập).
- Dạng bước mới: slide, bridge, plan, gap, habit, iv. Hình mới: `cdBridge()` (art.js).
- Dữ liệu cho CD02 thêm: clear, jp1, do1, p1, jp2, work, save, joy, p2, gapNeed, habits, iv, ivn. Demo giáo viên: xong đến Ga 6.
- config: cd01 `ver: 'CD01.0.7'`.

File cần xóa trên GitHub: không có.

## PS1.3.6 · 16/11/2026 · CD01: chỉnh Ga 5 + banner theo góp ý
- Banner trang ga: bỏ hình tàu; nền chấm bi mờ như CD49, đậm dần về bên phải. Không có chữ Hán mờ trên nền.
- Truyện tranh chị Thúy: vẽ lại nhân vật (nửa người, không vẽ bàn tay, có tóc mái, cổ, vai, mũ tốt nghiệp ở khung 1), bỏ vật cầm tay.
- Video chị Thúy nhúng ngay trong chặng 1 (bấm mới tải, có link mở YouTube dự phòng).
- Gợi ý chuyện Đổi đời theo ngành: chỉ chọn anh chị đã đi Nhật, đạt N1–N3 hoặc đang làm quản lý, giáo viên; bỏ các bạn N4, N5. Ưu tiên có video, có nam có nữ. Ngành dưới 2 chuyện thì thêm chuyện chung (anh Hoàng Văn Thiệu, chị Nguyễn Thị Son). Thẻ ghi JLPT, việc hiện nay, nhãn "Có video".
- config: cd01 `ver: 'CD01.0.6'`.

File cần xóa trên GitHub: không có.

## PS1.3.5 · 16/11/2026 · CD01: Ga Chuyện Trò + banner mới
- Banner trang ga: bỏ họa tiết sóng và đường ray; nền trơn, thêm con tàu cách điệu mờ ở góc phải dưới.
- Ga 5 Chuyện Trò mở (`ready: 1`), 2 chặng, điền ô số 6. Shin lên đại bàng sau ga này.
- a51 Chuyện chị Thúy: truyện tranh 3 khung (mở từng khung, có hình) → đoán thử “chị dùng giờ rảnh thế nào” → khung cuối → chọn 1–3 góc nhìn “điều gì giúp chị” (không đúng sai) → lời chị trích Tikme + link đọc trọn chuyện + video → viết “ngoài tiền, mình muốn mang về gì” → mở danh sách Đổi đời trên Tikme (bắt buộc mở), có thẻ chuyện cùng ngành (cơ khí, thực phẩm, thủy sản, in ấn, kỹ sư) → ghi chuyện của ai, bước ngoặt, điều muốn học theo.
- a53 Trò chuyện với anh Minh (nhân vật giả định): giao diện chat, chạm câu mình tò mò (ít nhất 3/7), anh Minh trả lời theo nhóm nghề và “một ngày làm việc” theo nghề → chọn câu cho câu trả lời dùng được nhất (Shin nhắc: câu có/không nhận câu ngắn) → viết người dẫn đường ngoài đời + 2 câu hỏi.
- Dạng bước mới: comic, persp, chat, chatpick; `guess` có `src`, không bắt buộc Senpai; `tik` có `dyn: 'story'`. Ví dụ ô viết `@who` theo nghề.
- Dữ liệu cho CD02 thêm: senpai, turn, learn, bring, guide, qs. Demo giáo viên: xong đến Ga 5.
- config: cd01 `ver: 'CD01.0.5'`.

File cần xóa trên GitHub: không có.

## PS1.3.4 · 16/11/2026 · CD01: chỉnh theo góp ý thầy (22 ý) + cá nhân hóa theo nghề
- Thanh trên chỉ còn Sơ đồ tuyến và Sổ tay. Chuỗi ngày, XP, Insight chuyển lên vé (dòng nhỏ). Nút "Proskills" chỉ ở đầu trang chủ CD (như TK); trong Cài đặt vẫn có "Về trang chính".
- Vé: tàu chạy từ đầu đến chỗ đang học rồi lắc lư; thanh vàng chạy lên rồi ánh nhẹ; vệt sáng lướt qua vé; chạm vé thì vé nghiêng theo chỗ chạm. "Đi tiếp" và ga đang học nháy sáng nhẹ. Các ga hiện dần khi lướt. Bản Career Design: ô đã điền xanh đậm, số trắng. Máy bật giảm chuyển động thì tắt hiệu ứng.
- Banner ga: họa tiết sóng Nhật mờ + đường ray mảnh; chữ Hán nháy sáng nhẹ.
- RIASEC: chọn Bản đầy đủ 60 câu (khuyên dùng) hoặc Bản nhanh 30 câu; 60 = 30 câu cũ + 30 câu mới (RQ2). Ai làm 30 câu có nút "Làm thêm 30 câu".
- Chặng đã xong: chạm vào hiện "Xem và sửa" / "Làm lại từ đầu" (hỏi xác nhận, nhắc tải sao lưu; bài cũ giữ đến khi đóng dấu lại, bỏ dở thì "Khôi phục bài cũ"; không cộng, không trừ XP).
- Đổi nghề chính ở Ga 3 khi Ga 4 đã làm: hộp thoại xác nhận, nhắc sao lưu; bài cũ lưu vào lịch sử (a42.hist); chặng "Nghề của tôi" hiện "Cần làm lại theo nghề mới", ô 5 có ghi chú.
- Cá nhân hóa Ga 4 theo nghề (17 ngành, tóm từ trang ngành Tikme): 3 câu khởi động, 12 việc để đoán, phần "thực tế theo Tikme" sau khi xem Tikme, ví dụ 3 ô viết, gợi ý "một ngày làm nghề", mốc "Đậu thi tay nghề [Nghề]", thẻ sẵn sàng số 4 + Senpai theo nghề. Nghề khác: chọn ngành gần nhất (hoặc không có) để lấy gợi ý và link Tikme.
- Link Tikme ở bước chọn nghề chính, phương án 2 thành thẻ nổi bật.
- Lộ trình: tháng không bắt buộc cho mỗi mốc; tối đa 3 mốc riêng. Bỏ vuốt thẻ ở chặng Sẵn sàng (chỉ bấm 3 nút), bỏ dòng hướng dẫn vuốt.
- Đổi "Báo cáo giữa đường" thành "Báo cáo tiến độ". Bỏ từ "đơn hàng" (mốc: "Đậu phỏng vấn công việc ở Nhật"); ghi quy tắc vào AGENTS.md.
- Gợi ý nhỏ luôn căn trái. Demo: RIASEC 60 câu, có tháng và mốc riêng.
- config: cd01 `ver: 'CD01.0.4'`.

File cần xóa trên GitHub: không có.

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
