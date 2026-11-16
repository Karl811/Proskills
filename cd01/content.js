/* CD01 · Career Design 1 · cd01/content.js · CHỮ VÀ NỘI DUNG (sửa chữ ở đây, không đụng engine.js)
   Nguyên tắc của khóa:
   1. Career Design là thiết kế, không phải bài kiểm tra: không đúng/sai; lựa chọn nào cũng có được và mất;
      luôn có "Tùy hôm / Chưa chắc" và "Ý khác"; sau khi chọn là lời Senpai, câu hỏi tiếp hoặc link tìm hiểu. Shin không khen chê.
   2. Học viên học trên ĐIỆN THOẠI: câu ngắn, một ý một câu, tiếng Việt tự nhiên. Câu hỏi ≤ 1 dòng rưỡi; lời Shin ≤ 2 câu.
   - [Tên] được thay bằng tên học viên (in đậm).
   - Senpai có cờ draft:1 = LỜI KỂ MẪU do Claude viết, cần thay bằng chuyện thật (ẩn danh) trước khi phát hành.
   ES5. */
var CD_ID = 'cd01';
var CD_VER = 'CD01.0.4';
var CD_TOTAL = 19;            /* Xuất phát (1) + 7 ga (18 chặng) */
var CD_XP_ACT = 30, CD_XP_WARM = 10, CD_INS_WORDS = 20, CD_INS_FIELD = 5;
var TIKME = 'https://tikme.com';

/* ---------- 7 ga + sân ga + Ga Ước Mơ ---------- */
var START = { id: 's0', n: 0, vn: 'Sân ga Xuất phát', k: '出発', kana: 'しゅっぱつ', ro: 'Shuppatsu · Xuất phát', lc: '#2F6BFF', ic: 'rail',
  sub: 'Hiểu chuyến tàu và viết mục tiêu của bạn', acts: ['x1'], card: 1,
  intro: 'Chào [Tên]! Cùng xem chuyến tàu này là gì, rồi viết điều bạn muốn mang về nhé.' };

var STATIONS = [
  { id: 's1', n: 1, vn: 'Ga Nhìn Xa', k: '未来', kana: 'みらい', ro: 'Mirai · Tương lai', lc: '#F07F1E', ic: 'mount', card: 2, ready: 1,
    sub: 'Nhìn mình của 5 năm sau', acts: ['a11', 'a13'], warm: 'w1',
    quote: { t: '5 năm là đơn vị thời gian tối thiểu cần thiết để thực hiện một việc gì đó.', by: 'Thầy Lê Long Sơn', src: 'TD – 07.01.2014' },
    intro: '5 năm nữa, [Tên] đang ở đâu, làm gì? Cùng nhìn từ chính ngày thường của bạn nhé.',
    done: 'Ô số 2 đã có chữ của bạn.',
    word: { k: '未来', kana: 'みらい', ro: 'mirai', vn: 'tương lai' } },
  { id: 's2', n: 2, vn: 'Ga Biết Mình', k: '自分', kana: 'じぶん', ro: 'Jibun · Bản thân', lc: '#E0567F', ic: 'heart', card: 3, ready: 1,
    sub: 'Bạn thích gì, giỏi gì, coi trọng gì', acts: ['a21', 'a22', 'a23'],
    intro: 'Nghề hợp với [Tên] thường nằm ở chỗ gặp nhau của 3 vòng: <b>việc bạn thích</b>, <b>việc bạn giỏi</b> và <b>điều bạn coi trọng</b>.',
    done: 'Ba vòng tròn của bạn đã có ở ô số 3.',
    word: { k: '自分', kana: 'じぶん', ro: 'jibun', vn: 'bản thân' } },
  { id: 's3', n: 3, vn: 'Ga Tính Cách', k: '性格', kana: 'せいかく', ro: 'Seikaku · Tính cách', lc: '#7A55D3', ic: 'spark', card: 4, ready: 1,
    sub: 'Trắc nghiệm RIASEC, Tikme, chọn nghề', acts: ['a31', 'a32', 'a33'],
    intro: 'Hai bài trắc nghiệm giúp [Tên] nhìn mình từ hai phía. Kết quả chỉ là gợi ý, người chọn nghề vẫn là bạn.',
    done: 'Bạn đã chọn nghề cho chặng đường đầu. Ô số 4 đã điền.',
    word: { k: '性格', kana: 'せいかく', ro: 'seikaku', vn: 'tính cách' }, report: 1 },
  { id: 's4', n: 4, vn: 'Ga Ngành Nghề', k: '仕事', kana: 'しごと', ro: 'Shigoto · Công việc', lc: '#22A05E', ic: 'tool', card: 5, ready: 1,
    sub: 'Hiểu nghề và lộ trình của bạn', acts: ['a42', 'a44', 'a43'], warm: 'w4',
    intro: 'Nghề [Nghề] ngoài đời thật ra sao? [Tên] đoán trước, rồi xem Tikme và Senpai nói gì nhé.',
    done: 'Ô số 5 đã có nghề và lộ trình của bạn.',
    word: { k: '仕事', kana: 'しごと', ro: 'shigoto', vn: 'công việc' } },
  { id: 's5', n: 5, vn: 'Ga Chuyện Trò', k: '対話', kana: 'たいわ', ro: 'Taiwa · Chuyện trò', lc: '#2A74DB', ic: 'chat', card: 6,
    sub: 'Học từ Senpai, tìm người dẫn đường', acts: ['a51', 'a53'] },
  { id: 's6', n: 6, vn: 'Ga Định Hướng', k: '道のり', kana: 'みちのり', ro: 'Michinori · Chặng đường', lc: '#0F9F98', ic: 'compass', card: 7,
    sub: 'Kế hoạch ở JPC và ở Nhật', acts: ['a62', 'a63'] },
  { id: 's7', n: 7, vn: 'Ga Thử Thách', k: '挑戦', kana: 'ちょうせん', ro: 'Chōsen · Thử thách', lc: '#DE3F35', ic: 'flag', card: 8,
    sub: 'Chọn việc khó, viết cam kết', acts: ['a71', 'a72', 'a73'] }
];
var FINAL = { id: 's8', n: 8, vn: 'Ga Ước Mơ', k: '夢', kana: 'ゆめ', ro: 'Yume · Ước mơ', lc: '#F2A20F', ic: 'star',
  sub: 'Nhận Bản Career Design 1 trang' };

/* ---------- Bản Career Design: 8 ô, mỗi ga điền một ô ---------- */
var CARDS = [
  { n: 1, t: 'Mục tiêu của tôi', st: 's0' },
  { n: 2, t: 'Tôi muốn trở thành', st: 's1' },
  { n: 3, t: 'Ba vòng tròn của tôi', st: 's2' },
  { n: 4, t: 'Tính cách và nghề tôi chọn', st: 's3' },
  { n: 5, t: 'Nghề và lộ trình của tôi', st: 's4' },
  { n: 6, t: 'Senpai và người dẫn đường', st: 's5' },
  { n: 7, t: 'Kế hoạch ở JPC và ở Nhật', st: 's6' },
  { n: 8, t: 'Việc khó và cam kết', st: 's7' }
];

/* ---------- 17 ngành trên Tikme (tikme.com/nganh-nghe/<s>) · r = nhóm RIASEC ngành thường cần (khóa học ước lượng, tham khảo) ---------- */
var INDS = [
  { s: 'co-khi', n: 'Cơ khí', d: 'Tiện, phay, CNC', r: 'RCI' },
  { s: 'dien-tu', n: 'Điện tử', d: 'Lắp ráp, kiểm tra linh kiện', r: 'RCI' },
  { s: 'han', n: 'Hàn', d: 'Hàn kim loại theo bản vẽ', r: 'RC' },
  { s: 'son', n: 'Sơn', d: 'Sơn phủ, hoàn thiện bề mặt', r: 'RCA' },
  { s: 'duc-nhua', n: 'Đúc nhựa', d: 'Vận hành máy ép nhựa', r: 'RC' },
  { s: 'dong-goi-cong-nghiep', n: 'Đóng gói công nghiệp', d: 'Lắp ráp, đóng gói, QC', r: 'CR' },
  { s: 'in-an', n: 'In ấn', d: 'Vận hành máy in', r: 'RCA' },
  { s: 'may-mac', n: 'May mặc', d: 'Cắt may công nghiệp', r: 'RAC' },
  { s: 'xay-dung', n: 'Xây dựng', d: 'Ván khuôn, cốt thép, thi công', r: 'RC' },
  { s: 'o-to', n: 'Ô tô', d: 'Lắp ráp, bảo dưỡng ô tô', r: 'RIC' },
  { s: 'nong-nghiep', n: 'Nông nghiệp', d: 'Nhà kính, trồng trọt', r: 'RC' },
  { s: 'thuy-san', n: 'Thủy sản', d: 'Chế biến hải sản', r: 'RC' },
  { s: 'thuc-pham', n: 'Thực phẩm', d: 'Bánh kẹo, bento, đồ hộp', r: 'RCA' },
  { s: 'dieu-duong', n: 'Kaigo · Chăm sóc', d: 'Chăm sóc người cao tuổi', r: 'SRC' },
  { s: 'nha-hang', n: 'Nhà hàng · Khách sạn', d: 'Phục vụ, bếp, lễ tân', r: 'SEA' },
  { s: 've-sinh-toa-nha', n: 'Vệ sinh tòa nhà', d: 'Giữ tòa nhà sạch chuẩn Nhật', r: 'RC' },
  { s: 'ky-su', n: 'Kỹ sư công nghệ', d: 'IT, tự động hóa (cần bằng ĐH)', r: 'IRC' }
];

/* ---------- CÁ NHÂN HÓA THEO NGHỀ (Ga 4 trở đi) · CD01.0.4 ----------
   Nguồn chính: trang ngành trên tikme.com/nganh-nghe/<mã> (đọc 16/11/2026). Tóm tắt tham khảo, viết gọn cho điện thoại.
   Khóa = mã ngành trong INDS. 'gen' dùng khi học viên chọn "Nghề khác" mà không có ngành gần.
   place: nơi làm (câu khởi động) · grp: nhóm câu khởi động (sx sản xuất, xd xây dựng, nn nông nghiệp, kg kaigo, dv dịch vụ, vs vệ sinh, ks kỹ sư, gen)
   first/firstOpt: tuần đầu (khởi động) · chips: 12 việc để đoán (có việc ít gặp) · real: người mới thường gặp (theo Tikme)
   ph: ví dụ cho 3 ô viết · day: 2 gợi ý "một ngày làm nghề" · r3: thẻ sẵn sàng riêng của nghề (thay thẻ số 4), Senpai = lời kể mẫu */
var INDP = {
  'co-khi': { place: 'xưởng cơ khí', grp: 'sx', firstOpt: 'Đo hàng, vệ sinh máy, xem quy trình',
    first: 'Tuần đầu thường là đo lường, vệ sinh máy, xem quy trình. Đứng máy CNC đến sau, có senpai kèm.',
    chips: ['Đứng máy tiện, phay, CNC', 'Đọc bản vẽ', 'Đo bằng thước cặp, panme', 'Vệ sinh máy, 5S', 'Họp đầu ca', 'Làm theo ca', 'Kiểm tra chất lượng', 'Làm ngoài trời', 'Giao tiếp với khách', 'Mang vác nặng', 'Dùng máy tính cả ngày', 'Tiếng Nhật chuyên ngành'],
    real: ['Đo lường, vệ sinh máy trước', 'Đứng máy CNC sau vài tháng', 'Họp đầu ca 10 phút về an toàn', 'Làm theo ca, 8–10 tiếng kể cả tăng ca'],
    ph: { wow: 'Ví dụ: tháng đầu chủ yếu đo hàng', like: 'Ví dụ: làm ra chi tiết chính xác', worry: 'Ví dụ: sợ đọc bản vẽ chưa hiểu' },
    day: ['Sáng 7 giờ 30, mình họp đầu ca, nhận bản vẽ rồi chỉnh máy CNC. Chiều mình đo kiểm hàng bằng panme.', 'Sáng 7 giờ 30, mình kèm em mới đo hàng, rồi tự gá phôi, chỉnh chương trình NC.'],
    r3: ['Đứng máy cả ca, có tiếng ồn, bụi kim loại', 'Anh khóa trước · ngành cơ khí', 'Tuần đầu về phòng mình mỏi chân lắm. Mình mang giày bảo hộ vừa chân, tối giãn cơ 10 phút. Tuần sau là quen.'] },
  'dien-tu': { place: 'xưởng điện tử', grp: 'sx', firstOpt: 'Gắn linh kiện, kiểm tra bằng mắt',
    first: 'Tuần đầu thường là gắn linh kiện lên bo mạch, hàn thiếc tay, kiểm tra bằng mắt. Đo kiểm chức năng đến sau.',
    chips: ['Gắn linh kiện lên bo mạch', 'Hàn thiếc bằng tay', 'Kiểm tra bằng mắt, kính lúp', 'Đo bằng đồng hồ vạn năng', 'Làm trong phòng sạch', 'Chống tĩnh điện', 'Làm theo ca, có ca đêm', 'Ghi kết quả kiểm tra', 'Làm ngoài trời', 'Mang vác nặng', 'Giao tiếp với khách', 'Tiếng Nhật chuyên ngành'],
    real: ['Gắn linh kiện, hàn tay trước', 'Làm trong phòng sạch, chống tĩnh điện', 'Ngồi hoặc đứng lâu, cần mắt tinh', 'Có thể làm ca đêm, ca luân phiên'],
    ph: { wow: 'Ví dụ: mặc đồ chống tĩnh điện cả ca', like: 'Ví dụ: việc tỉ mỉ, nơi làm sạch sẽ', worry: 'Ví dụ: sợ mỏi mắt vì linh kiện nhỏ' },
    day: ['Sáng 8 giờ, mình mặc đồ chống tĩnh điện, vào phòng sạch gắn linh kiện. Chiều mình đo kiểm, ghi kết quả.', 'Sáng 8 giờ, mình kiểm tra bo mạch trên máy, rồi chỉ em mới cách hàn tay.'],
    r3: ['Ngồi lâu, nhìn linh kiện nhỏ cả ca', 'Chị khóa trước · ngành điện tử', 'Cứ 2 tiếng mình nghỉ 10 phút, nhìn ra xa cho mắt nghỉ. Nhờ vậy cuối ca không còn mỏi mắt.'] },
  'han': { place: 'xưởng hàn', grp: 'sx', firstOpt: 'Gá phôi, mài, hàn tấm đơn giản',
    first: 'Tuần đầu thường là vát mép, gá phôi, mài mối hàn, hàn tấm đơn giản. Hàn TIG, tư thế khó đến sau.',
    chips: ['Hàn bán tự động', 'Gá phôi, vát mép', 'Mài mối hàn', 'Đọc ký hiệu hàn', 'Mặc đồ bảo hộ kín', 'Tự kiểm mối hàn', 'Làm theo ca, tăng ca', 'Có lúc làm ngoài trời', 'Mang vác phôi', 'Giao tiếp với khách', 'Dùng máy tính cả ngày', 'Thi chứng chỉ hàn'],
    real: ['Gá phôi, mài, hàn tấm trước', 'Hàn TIG, tư thế khó đến sau', 'Nóng, có khói và tia hồ quang', 'Đứng lâu, mang vác phôi'],
    ph: { wow: 'Ví dụ: phải tự kiểm mối hàn trước khi giao', like: 'Ví dụ: thấy mối hàn đẹp, chắc tay', worry: 'Ví dụ: sợ nóng và khói hàn' },
    day: ['Sáng 8 giờ, mình mặc đồ bảo hộ, gá phôi rồi hàn khung thép. Chiều mình mài mối hàn và tự kiểm.', 'Sáng 8 giờ, mình hàn TIG chi tiết inox, rồi chỉ em mới cách gá phôi cho thẳng.'],
    r3: ['Xưởng nóng, có khói và tia hồ quang', 'Anh khóa trước · ngành hàn', 'Mùa hè xưởng nóng thật. Mình uống nước đều, giữ đồ bảo hộ kín. Quen rồi thấy an tâm.'] },
  'son': { place: 'xưởng sơn', grp: 'sx', firstOpt: 'Chà nhám, che chắn, sơn lót',
    first: 'Tuần đầu thường là tẩy dầu, chà nhám, che chắn, sơn lót. Phun sơn chính đến sau.',
    chips: ['Chà nhám, tẩy dầu', 'Che chắn trước khi sơn', 'Phun sơn trong buồng', 'Pha màu', 'Đeo mặt nạ lọc', 'Đo độ dày lớp sơn', 'Làm trên giàn giáo', 'Làm theo ca', 'Đứng, cúi nhiều', 'Giao tiếp với khách', 'Dùng máy tính cả ngày', 'Tiếng Nhật chuyên ngành'],
    real: ['Chà nhám, che chắn, sơn lót trước', 'Phun sơn, sấy, đo lớp sơn sau', 'Đeo mặt nạ lọc, đồ bảo hộ kín', 'Sơn công trình thì làm ngoài trời, trên giàn giáo'],
    ph: { wow: 'Ví dụ: chuẩn bị bề mặt lâu hơn phun sơn', like: 'Ví dụ: thấy món đồ đẹp lên sau khi sơn', worry: 'Ví dụ: sợ mùi dung môi' },
    day: ['Sáng 8 giờ, mình chà nhám, che chắn khung xe. Chiều mình phun lớp lót trong buồng sơn.', 'Sáng 8 giờ, mình pha màu theo mẫu, phun lớp phủ rồi đo độ dày lớp sơn.'],
    r3: ['Mùi dung môi, đeo mặt nạ cả ca', 'Anh khóa trước · ngành sơn', 'Lúc đầu đeo mặt nạ thấy bí. Mình chỉnh dây cho vừa, đeo đúng cách. Giờ thấy nhờ nó mà khỏe.'] },
  'duc-nhua': { place: 'xưởng ép nhựa', grp: 'sx', firstOpt: 'Lấy hàng, cắt ba via, kiểm tra',
    first: 'Tuần đầu thường là lấy sản phẩm, cắt ba via, kiểm tra bằng mắt, đóng gói. Đứng máy đến sau.',
    chips: ['Lấy sản phẩm ra khỏi máy', 'Cắt ba via', 'Kiểm tra bằng mắt', 'Đóng gói', 'Vận hành máy ép', 'Ghi thông số máy', 'Thay khuôn', 'Làm theo ca, có ca đêm', 'Đứng suốt ca', 'Làm ngoài trời', 'Giao tiếp với khách', 'Dùng máy tính cả ngày'],
    real: ['Lấy hàng, cắt ba via, đóng gói trước', 'Đứng máy, ghi thông số sau', 'Xưởng sạch, việc nào cũng có quy trình', 'Đứng suốt ca, có thể ca đêm'],
    ph: { wow: 'Ví dụ: thao tác nào cũng có quy trình sẵn', like: 'Ví dụ: xưởng sạch, máy hiện đại', worry: 'Ví dụ: sợ đứng cả ca bị mỏi' },
    day: ['Sáng 8 giờ, mình lấy sản phẩm ở máy ép, cắt ba via và kiểm tra. Chiều mình đóng gói, ghi số lượng.', 'Sáng 8 giờ, mình theo dõi máy ép, ghi thông số, rồi cùng tổ thay khuôn.'],
    r3: ['Đứng máy suốt ca, việc lặp lại', 'Chị khóa trước · ngành đúc nhựa', 'Việc lặp lại thì mình đặt mục tiêu nhỏ: hôm nay ít lỗi hơn hôm qua. Thấy vui hơn nhiều.'] },
  'dong-goi-cong-nghiep': { place: 'xưởng đóng gói', grp: 'sx', firstOpt: 'Bọc hàng, dán nhãn, đóng đai',
    first: 'Tuần đầu thường là bọc hàng, dán nhãn, đóng đai theo mẫu, rồi học đo kiện.',
    chips: ['Bọc hàng, dán nhãn', 'Đo, cân kiện hàng', 'Đóng khung gỗ', 'Quấn màng pallet', 'Đóng đai', 'Kiểm đếm hàng', 'Lái xe nâng', 'Tăng ca mùa cao điểm', 'Làm bằng tay nhiều', 'Giao tiếp với khách', 'Dùng máy tính cả ngày', 'Tiếng Nhật chuyên ngành'],
    real: ['Bọc, dán nhãn, đóng đai trước', 'Đo kiện, đóng khung gỗ sau', 'Kho làm theo 5S, có xe nâng', 'Có ca đêm, bận nhất cuối năm'],
    ph: { wow: 'Ví dụ: đóng gói cũng phải đọc bản vẽ', like: 'Ví dụ: hàng gọn đẹp, chắc chắn', worry: 'Ví dụ: sợ mùa cao điểm tăng ca nhiều' },
    day: ['Sáng 8 giờ, mình bọc hàng, dán nhãn theo mẫu. Chiều mình đo kiện, quấn màng pallet.', 'Sáng 8 giờ, mình đóng khung gỗ cho máy lớn, rồi xếp hàng xuất kho.'],
    r3: ['Mùa cao điểm tăng ca nhiều', 'Anh khóa trước · ngành đóng gói', 'Cuối năm tăng ca nhiều. Mình ngủ đủ, ăn sáng đều, Chủ nhật nghỉ hẳn. Qua mùa thấy mình bền hơn.'] },
  'in-an': { place: 'nhà in', grp: 'sx', firstOpt: 'Chuẩn bị giấy, cắt, gấp, đóng gói',
    first: 'Tuần đầu thường là chuẩn bị giấy, pha mực, cắt, gấp, đóng gói. Vài tháng sau mới đứng máy cùng thợ chính.',
    chips: ['Chuẩn bị giấy, pha mực', 'Cắt, gấp, cán màng', 'Lắp bản kẽm', 'So màu tờ in', 'Đứng máy in', 'Kiểm tờ in suốt ca', 'Làm theo ca', 'Đứng lâu', 'Làm ngoài trời', 'Giao tiếp với khách', 'Thiết kế trên máy tính', 'Tiếng Nhật chuyên ngành'],
    real: ['Chuẩn bị giấy, làm sau in trước', 'Đứng máy, so màu sau vài tháng', 'Đứng lâu, cần mắt phân biệt màu', 'Xưởng bao bì có thể chạy hai ca'],
    ph: { wow: 'Ví dụ: phải so màu từng tờ với bài mẫu', like: 'Ví dụ: cầm sản phẩm in đẹp trên tay', worry: 'Ví dụ: sợ nhìn màu chưa chuẩn' },
    day: ['Sáng 8 giờ, mình chuẩn bị giấy, pha mực. Chiều mình đứng máy cùng anh thợ chính, học canh màu.', 'Sáng 8 giờ, mình lắp bản kẽm, chạy thử rồi so màu với bài mẫu.'],
    r3: ['Đứng lâu, nhìn màu cả ca', 'Chị khóa trước · ngành in ấn', 'Lúc đầu mình nhìn màu chưa ra. Anh thợ chính chỉ cách so dưới đèn chuẩn. Ba tháng sau mình tự so được.'] },
  'may-mac': { place: 'xưởng may', grp: 'sx', firstOpt: 'May một công đoạn, hoàn thiện',
    first: 'Tuần đầu thường là may một công đoạn trên máy công nghiệp, hoặc hoàn thiện, kiểm hàng, đóng gói.',
    chips: ['May một công đoạn', 'Là ủi, hoàn thiện', 'Cắt vải', 'Kiểm tra đường may', 'Đóng gói, phân loại', 'Đọc sơ đồ, rập', 'Ngồi máy cả ca', 'Làm giờ hành chính', 'Chạy theo năng suất', 'Làm ngoài trời', 'Giao tiếp với khách', 'Mang vác nặng'],
    real: ['May một công đoạn trước', 'Ngồi máy hoặc đứng chuyền cả ca', 'Cần theo kịp năng suất chuẩn', 'Thường giờ hành chính, ít ca đêm'],
    ph: { wow: 'Ví dụ: phải theo kịp năng suất chuẩn', like: 'Ví dụ: làm ra quần áo đẹp', worry: 'Ví dụ: sợ chưa theo kịp chuyền' },
    day: ['Sáng 8 giờ, mình may tay áo trên chuyền. Chiều mình kiểm đường may, rồi là ủi.', 'Sáng 8 giờ, mình kiểm hàng cuối chuyền, chỉ em mới chỗ còn lỗi.'],
    r3: ['Chạy theo năng suất của chuyền', 'Chị khóa trước · ngành may mặc', 'Mấy tuần đầu mình may chậm hơn chuyền. Chị tổ trưởng chỉ cách cầm vải. Tháng thứ hai mình theo kịp.'] },
  'xay-dung': { place: 'công trường', grp: 'xd', firstOpt: 'Phụ việc, học an toàn trước',
    first: 'Tuần đầu thường là phụ việc ở một nhánh: cốt thép, cốp pha hoặc giàn giáo. Sáng nào cũng khởi động, họp an toàn.',
    chips: ['Khởi động, họp an toàn', 'Buộc cốt thép', 'Dựng cốp pha', 'Lắp giàn giáo', 'Làm ngoài trời', 'Làm trên cao', 'Mang vác vật liệu', 'Đọc bản vẽ thi công', 'Làm theo nhóm', 'Tăng ca mùa cao điểm', 'Dùng máy tính cả ngày', 'Giao tiếp với khách'],
    real: ['Phụ việc ở một nhánh trước', 'Sáng nào cũng họp an toàn KY', 'Làm ngoài trời, trên cao', 'Tăng ca nhiều mùa cao điểm'],
    ph: { wow: 'Ví dụ: an toàn được nhắc mỗi sáng', like: 'Ví dụ: thấy công trình lên từng tầng', worry: 'Ví dụ: sợ nắng nóng, làm trên cao' },
    day: ['Sáng 8 giờ, mình khởi động, họp KY với tổ, rồi buộc cốt thép. Chiều mình dọn vật liệu, kiểm đồ bảo hộ.', 'Sáng 8 giờ, mình đọc bản vẽ, chia việc cho nhóm 3 người, rồi kiểm cốp pha.'],
    r3: ['Làm ngoài trời, nắng nóng, trên cao', 'Anh khóa trước · ngành xây dựng', 'Hè ở Nhật nóng lắm. Mình uống nước theo giờ nghỉ của tổ, đeo dây an toàn đúng cách. Không ai làm liều cả.'] },
  'o-to': { place: 'xưởng ô tô', grp: 'sx', firstOpt: 'Thay dầu, kiểm tra theo danh mục',
    first: 'Tuần đầu thường là kiểm tra theo danh mục, thay dầu, lọc, bugi, kiểm lốp, ghi báo cáo.',
    chips: ['Thay dầu, lọc, bugi', 'Kiểm tra lốp, phanh', 'Ghi báo cáo kỹ thuật', 'Chui gầm xe', 'Dùng máy chẩn đoán lỗi', 'Vệ sinh, di chuyển xe', 'Lắp ráp ở nhà máy', 'Tăng ca mùa đăng kiểm', 'Nâng phụ tùng nặng', 'Giao tiếp với khách', 'Làm ngoài trời cả ngày', 'Tiếng Nhật chuyên ngành'],
    real: ['Bảo dưỡng theo danh mục trước', 'Chẩn đoán lỗi điện tử sau', 'Đứng, cúi nhiều dưới gầm xe', 'Tăng ca nhiều vào mùa đăng kiểm'],
    ph: { wow: 'Ví dụ: sửa xe phải ghi báo cáo từng bước', like: 'Ví dụ: tìm ra lỗi rồi sửa được', worry: 'Ví dụ: sợ chưa hiểu xe hybrid' },
    day: ['Sáng 8 giờ 30, mình nhận xe, kiểm tra theo danh mục, thay dầu. Chiều mình kiểm phanh, ghi báo cáo.', 'Sáng 8 giờ 30, mình dùng máy chẩn đoán xe hybrid, tìm lỗi rồi báo anh tổ trưởng.'],
    r3: ['Chui gầm xe, nâng phụ tùng nặng', 'Anh khóa trước · ngành ô tô', 'Tuần đầu mình chỉ lau xe, đưa đồ nghề. Mình ghi lại từng bước. Tháng thứ hai được tự thay dầu.'] },
  'nong-nghiep': { place: 'trang trại', grp: 'nn', firstOpt: 'Gieo trồng, thu hoạch theo đội',
    first: 'Tuần đầu thường là gieo trồng, chăm cây, thu hoạch theo lịch mùa vụ. Lái máy, quản lý nhà màng đến sau.',
    chips: ['Gieo trồng, chăm cây', 'Thu hoạch, phân loại', 'Làm trong nhà màng', 'Làm ngoài đồng', 'Chăm bò, gà, lợn', 'Dậy sớm', 'Lái máy kéo', 'Ghi nhật ký cây trồng', 'Làm theo đội', 'Bận theo mùa vụ', 'Dùng máy tính cả ngày', 'Giao tiếp với khách'],
    real: ['Gieo, chăm, thu hoạch theo mùa trước', 'Lái máy, quản lý nhà màng sau', 'Ngoài trời: nắng hè, lạnh mùa đông', 'Chăn nuôi bắt đầu từ sáng sớm'],
    ph: { wow: 'Ví dụ: trang trại Nhật dùng cảm biến, drone', like: 'Ví dụ: thấy cây mình chăm ra trái', worry: 'Ví dụ: sợ lạnh ở vùng phía Bắc' },
    day: ['Sáng 6 giờ, mình vào nhà màng, xem cảm biến, tưới cây. Chiều mình thu hoạch cà chua cùng đội.', 'Sáng 5 giờ 30, mình vắt sữa bò, dọn chuồng. Chiều mình ghi nhật ký đàn bò.'],
    r3: ['Dậy sớm, làm ngoài trời theo mùa', 'Anh khóa trước · ngành nông nghiệp', 'Mùa đông ở đây lạnh thật. Mình mặc nhiều lớp mỏng, ngủ sớm để dậy sớm. Mùa thu hoạch cả đội vui lắm.'] },
  'thuy-san': { place: 'xưởng chế biến thủy sản', grp: 'sx', firstOpt: 'Sơ chế, bóc tôm, đóng gói',
    first: 'Tuần đầu thường là sơ chế, fillet cá, bóc tôm, đóng gói theo hướng dẫn. Làm trong xưởng lạnh, không làm trên tàu.',
    chips: ['Sơ chế, fillet cá', 'Bóc vỏ tôm', 'Làm trong xưởng lạnh', 'Mặc đồ chống lạnh', 'Đóng gói', 'Ghi sổ vệ sinh, số lô', 'Đứng gần cả ca', 'Tăng ca mùa cao điểm', 'Làm trên tàu cá', 'Giao tiếp với khách', 'Dùng máy tính cả ngày', 'Dùng dao nhiều'],
    real: ['Sơ chế, fillet, đóng gói trước', 'Làm trong xưởng lạnh, tay hay ướt', 'Đứng gần cả ca', 'Tăng ca nhiều khoảng tháng 9–11'],
    ph: { wow: 'Ví dụ: không làm trên tàu, làm trong xưởng lạnh', like: 'Ví dụ: tay dao ngày càng nhanh', worry: 'Ví dụ: sợ lạnh tay cả ca' },
    day: ['Sáng 7 giờ, mình mặc đồ chống lạnh vào xưởng, fillet cá. Chiều mình đóng gói, ghi số lô.', 'Sáng 7 giờ, mình đứng khâu cấp đông, kiểm hàng theo sổ vệ sinh.'],
    r3: ['Xưởng lạnh, tay ướt, đứng cả ca', 'Chị khóa trước · ngành thủy sản', 'Lúc đầu tay lạnh lắm. Mình đeo thêm găng lót, giờ nghỉ thì hơ tay. Vài tuần là quen.'] },
  'thuc-pham': { place: 'nhà máy thực phẩm', grp: 'sx', firstOpt: 'Sơ chế, rửa, cắt nguyên liệu',
    first: 'Tuần đầu thường là rửa, cắt, phân loại nguyên liệu. Vào xưởng phải rửa tay, qua buồng gió.',
    chips: ['Rửa tay, qua buồng gió', 'Mặc đồ bảo hộ kín', 'Sơ chế, cắt nguyên liệu', 'Cân theo công thức', 'Làm cơm hộp, bánh', 'Đóng gói, dán nhãn', 'Kiểm tra dị vật', 'Làm theo ca, có ca đêm', 'Đứng suốt ca', 'Giao tiếp với khách', 'Làm ngoài trời', 'Dùng máy tính cả ngày'],
    real: ['Sơ chế nguyên liệu trước', 'Vệ sinh rất kỹ trước khi vào xưởng', 'Đứng suốt ca, ca có thể xoay', 'Xưởng lạnh, hoặc nóng nếu gần lò'],
    ph: { wow: 'Ví dụ: vào xưởng phải qua buồng gió', like: 'Ví dụ: làm ra món ăn sạch, đẹp', worry: 'Ví dụ: sợ ca đêm khó ngủ' },
    day: ['Sáng 6 giờ, mình rửa tay, qua buồng gió, vào cắt rau. Chiều mình xếp cơm hộp, dán nhãn.', 'Sáng 6 giờ, mình kiểm dị vật cuối chuyền, ghi sổ vệ sinh, rồi chỉ em mới quy trình.'],
    r3: ['Vệ sinh nghiêm, đồ bảo hộ kín cả ca', 'Chị khóa trước · ngành thực phẩm', 'Ở JPC mình đã quen rửa tay đúng các bước. Sang đây làm theo thấy nhẹ nhàng, tổ trưởng còn khen.'] },
  'dieu-duong': { place: 'viện dưỡng lão', grp: 'kg', firstOpt: 'Học tên, quan sát cách chăm',
    first: 'Tuần đầu thường là quan sát, học tên và cách chăm từng người. Giúp ăn, tắm có người hướng dẫn bên cạnh.',
    chips: ['Chào hỏi, trò chuyện với cụ', 'Giúp cụ ăn uống', 'Giúp cụ tắm rửa', 'Dìu, đổi tư thế', 'Đo sức khỏe', 'Ghi hồ sơ, bàn giao ca', 'Dùng kính ngữ', 'Làm ca đêm', 'Sinh hoạt tập thể', 'Đứng máy', 'Làm ngoài trời', 'Mang vác hàng'],
    real: ['Quan sát, học tên từng người trước', 'Giúp ăn, tắm có người hướng dẫn', 'Ghi hồ sơ, bàn giao ca', 'Ca xoay; ca đêm khi đã quen việc'],
    ph: { wow: 'Ví dụ: phải ghi chép kỹ cho ca sau', like: 'Ví dụ: thấy các cụ vui khi mình đến', worry: 'Ví dụ: sợ nói kính ngữ chưa đúng' },
    day: ['Sáng 7 giờ, mình chào các cụ, giúp cụ ăn sáng. Chiều mình tổ chức trò chơi, rồi ghi hồ sơ bàn giao.', 'Sáng 7 giờ, mình nhận bàn giao ca đêm, đo sức khỏe các cụ, rồi kèm em mới.'],
    r3: ['Dìu đỡ người, có ngày mệt cả người lẫn lòng', 'Chị khóa trước · ngành kaigo', 'Có ngày cụ khó tính, mình buồn. Mình kể với chị tổ trưởng, chị chỉ cách nói chuyện. Giờ cụ quý mình lắm.'] },
  'nha-hang': { place: 'nhà hàng, khách sạn', grp: 'dv', firstOpt: 'Làm vị trí cơ bản theo quy trình',
    first: 'Tuần đầu thường là phục vụ bàn, dọn phòng, phụ bếp hoặc rửa bát, làm theo quy trình chuẩn.',
    chips: ['Chào khách bằng kính ngữ', 'Phục vụ bàn', 'Dọn phòng, làm giường', 'Phụ bếp, sơ chế', 'Rửa bát', 'Làm lễ tân', 'Đứng, đi lại nhiều', 'Xoay ca, làm cuối tuần', 'Làm theo sổ hướng dẫn', 'Đứng máy', 'Làm ngoài trời', 'Đọc bản vẽ'],
    real: ['Vị trí cơ bản theo quy trình trước', 'Dùng kính ngữ với khách', 'Đứng, đi lại nhiều cả ca', 'Đông khách cuối tuần, ngày lễ'],
    ph: { wow: 'Ví dụ: việc gì cũng có sổ hướng dẫn', like: 'Ví dụ: khách cảm ơn mình', worry: 'Ví dụ: sợ nói kính ngữ chưa đúng' },
    day: ['Sáng 9 giờ, mình chào khách, dọn bàn ăn sáng. Chiều mình dọn phòng, làm giường theo chuẩn.', 'Sáng 9 giờ, mình đứng quầy lễ tân, nhận phòng cho khách, rồi chỉ em mới cách chào.'],
    r3: ['Làm cuối tuần, ngày lễ, mùa du lịch', 'Chị khóa trước · ngành nhà hàng', 'Bạn bè nghỉ lễ thì mình đi làm. Mình nghỉ bù ngày thường, đi chơi lúc vắng người. Vậy cũng hay.'] },
  've-sinh-toa-nha': { place: 'tòa nhà', grp: 'vs', firstOpt: 'Lau dọn theo bảng phân công',
    first: 'Tuần đầu thường là lau sàn, tay vịn, gom rác theo bảng phân công. Máy chà sàn, phủ wax đến sau.',
    chips: ['Lau sàn, tay vịn', 'Gom, phân loại rác', 'Chạy máy chà sàn', 'Phủ wax', 'Lau kính', 'Pha hóa chất đúng loại', 'Dùng bảng kiểm', 'Làm sáng sớm hoặc tối', 'Đi nhiều tầng', 'Chào người trong tòa nhà', 'Đứng máy cả ca', 'Dùng máy tính cả ngày'],
    real: ['Lau dọn theo bảng phân công trước', 'Máy chà sàn, wax, kính sau', 'Giờ lệch: sáng sớm, tối, cuối tuần', 'Đi bộ nhiều tầng, đeo găng tay'],
    ph: { wow: 'Ví dụ: mỗi loại sàn dùng hóa chất khác', like: 'Ví dụ: thấy tòa nhà sạch bóng', worry: 'Ví dụ: sợ làm giờ lệch' },
    day: ['Sáng 6 giờ, mình lau sàn sảnh trước giờ mở cửa. Sau đó mình gom rác, đánh dấu bảng kiểm.', 'Sáng 6 giờ, mình chạy máy chà sàn, phủ wax, rồi kiểm tra bàn giao khu vực.'],
    r3: ['Làm giờ lệch, việc lặp lại', 'Anh khóa trước · ngành vệ sinh tòa nhà', 'Mình làm sáng sớm, chiều rảnh để học tiếng Nhật. Tính ra lại hợp với mình.'] },
  'ky-su': { place: 'công ty', grp: 'ks', firstOpt: 'Học quy trình, sản phẩm công ty',
    first: 'Tháng đầu thường là học quy trình và sản phẩm của công ty, làm cùng người hướng dẫn.',
    chips: ['Viết chương trình', 'Vẽ thiết kế CAD', 'Họp nhóm bằng tiếng Nhật', 'Báo cáo tiến độ', 'Làm trên máy tính', 'Xuống xưởng xem máy', 'Đọc tài liệu kỹ thuật', 'Lập trình robot', 'Đứng máy cả ca', 'Làm ngoài trời', 'Mang vác nặng', 'Giao tiếp với khách'],
    real: ['Cần bằng đại học đúng ngành', 'Tiếng Nhật thường từ N3', 'Làm ở văn phòng hoặc nhà máy', '10 năm hướng tới chuyên gia kỹ thuật'],
    ph: { wow: 'Ví dụ: nhiều công ty vừa và nhỏ tuyển kỹ sư', like: 'Ví dụ: được làm đúng chuyên ngành', worry: 'Ví dụ: sợ tiếng Nhật chưa đủ N3' },
    day: ['Sáng 9 giờ, mình họp nhóm, báo tiến độ. Sau đó mình vẽ CAD, chiều xuống xưởng xem máy chạy thử.', 'Sáng 9 giờ, mình viết chương trình cho robot hàn, rồi cùng anh senpai chạy thử.'],
    r3: ['Họp, báo cáo bằng tiếng Nhật mỗi ngày', 'Anh khóa trước · kỹ sư cơ khí', 'Lúc đầu họp mình nghe sót nhiều. Mình chuẩn bị trước 3 câu báo cáo, tối luyện lại. Nửa năm sau tự tin hơn hẳn.'] },
  gen: { place: 'nơi làm việc', grp: 'gen', firstOpt: 'Làm việc đơn giản, có người kèm',
    first: 'Phần lớn nơi làm ở Nhật cho người mới làm việc đơn giản trước, có senpai kèm. Việc khó đến sau vài tháng.',
    chips: ['Thao tác tay, đứng máy', 'Làm theo bản vẽ, quy trình', 'Đo, kiểm tra hàng', 'Dọn dẹp 5S', 'Làm ngoài trời', 'Làm theo ca', 'Giao tiếp với khách', 'Chăm sóc người', 'Dùng máy tính', 'Làm cùng nhóm', 'Mang vác nặng', 'Tiếng Nhật chuyên ngành'],
    real: [],
    ph: { wow: 'Ví dụ: người mới làm việc đơn giản trước', like: 'Ví dụ: làm ra sản phẩm thấy được', worry: 'Ví dụ: sợ đứng lâu bị mỏi' },
    day: ['Sáng 7 giờ 30, mình họp sáng với tổ, nhận việc trong ngày. Chiều mình kiểm tra lại, tối gọi về nhà.', 'Sáng 7 giờ 30, mình chuẩn bị đồ nghề, làm theo hướng dẫn của senpai, ghi lại điều mới học.'],
    r3: null }
};

/* Khởi động Ga 4 theo nghề: 3 câu Đoán thử. slot 0 = tuần đầu (theo INDP); slot 1, 2 theo nhóm nghề. Senpai = lời kể mẫu. */
var GUESS = {
  ky: { q: 'Sáng nào ở [Nơi] Nhật cũng có buổi “KY”. Để làm gì?', opts: ['Điểm danh', 'Cùng đoán trước chỗ nguy hiểm', 'Tập thể dục', 'Chia việc trong ngày'],
    fact: 'KY (危険予知 · kiken yochi) là cùng đoán trước chỗ nguy hiểm trước giờ làm. Buổi họp sáng thường có cả thể dục và chia việc.',
    senpai: { who: 'Anh khóa trước · ngành xây dựng', t: 'Mỗi sáng cả nhóm chỉ vào chỗ dễ trượt, dễ va rồi hô to. Lúc đầu thấy lạ, giờ thành quen.' } },
  omote: { q: '“Omotenashi” ở nhà hàng, khách sạn Nhật là gì?', opts: ['Phục vụ thật nhanh', 'Đoán trước điều khách cần', 'Cúi chào thật sâu', 'Chưa nghe bao giờ'],
    fact: 'Omotenashi (おもてなし) là tiếp khách tận tâm, lo cả điều khách chưa kịp nói. Ở Nhật gần như không có tiền tip.',
    senpai: { who: 'Chị khóa trước · ngành nhà hàng', t: 'Thấy khách dắt em bé, mình mang ghế trẻ em ra trước khi khách hỏi. Khách cảm ơn mãi.' } },
  kiroku: { q: 'Cuối ca, nhân viên kaigo thường làm gì?', opts: ['Về ngay khi hết giờ', 'Ghi hồ sơ, bàn giao ca', 'Dọn dẹp cả viện', 'Chưa biết'],
    fact: 'Ghi hồ sơ từng người và bàn giao ca là việc hằng ngày. Ca sau đọc để chăm sóc cho đúng.',
    senpai: { who: 'Chị khóa trước · ngành kaigo', t: 'Lúc đầu mình viết chậm lắm. Chị senpai cho mình mẫu câu hay dùng. Giờ 10 phút là xong.' } },
  hrs: { q: '“Hō-ren-sō” ở chỗ làm Nhật là gì?', opts: ['Một món ăn Nhật', 'Báo cáo, liên lạc, bàn bạc', 'Chào hỏi buổi sáng', 'Chưa nghe bao giờ'],
    fact: 'Hō-ren-sō (報連相) là báo cáo, liên lạc, bàn bạc. Có gì chưa rõ hay lỡ sai, báo sớm cho cấp trên.',
    senpai: { who: 'Anh khóa trước · ngành điện tử', t: 'Có lần mình làm hỏng một bo mạch mà chưa dám nói. Báo ra rồi mới thấy, được chỉ cách sửa chứ không bị la.' } },
  late: { q: 'Ở Nhật, sắp trễ giờ làm 5 phút thì nên làm gì?', opts: ['Cứ đến, trễ chút không sao', 'Gọi báo trước cho cấp trên', 'Nghỉ luôn hôm đó', 'Mỗi nơi một khác'],
    fact: 'Ở Nhật, đúng giờ là đến sớm 5–10 phút. Sắp trễ thì gọi báo trước, dù chỉ vài phút.',
    senpai: { who: 'Chị khóa trước · ngành thực phẩm', t: 'Hôm tàu trễ, mình gọi báo trước cho tổ trưởng. Chị cảm ơn vì mình báo sớm.' } }
};
var GUESS_GRP = { sx: ['ky', 'hrs'], xd: ['ky', 'hrs'], vs: ['ky', 'hrs'], dv: ['omote', 'hrs'], kg: ['kiroku', 'hrs'], nn: ['hrs', 'late'], ks: ['hrs', 'late'], gen: ['hrs', 'late'] };

/* ---------- RIASEC (John Holland): 6 nhóm sở thích nghề · bản nhanh 30 câu (RQ) · bản đầy đủ 60 câu = RQ + RQ2 (mỗi nhóm 10 câu) ---------- */
var RIA_ORDER = ['R', 'I', 'A', 'S', 'E', 'C'];
var RIA = {
  R: { n: 'Kỹ thuật', c: '#C2410C', d: 'Thích làm với máy móc, dụng cụ, cây cối, con vật. Thích thấy kết quả rõ ràng.', env: 'Xưởng, nhà máy, công trường, nông trại.' },
  I: { n: 'Nghiên cứu', c: '#2563EB', d: 'Tò mò, thích tìm nguyên nhân và giải quyết vấn đề.', env: 'Kỹ thuật, kiểm tra chất lượng, công nghệ.' },
  A: { n: 'Nghệ thuật', c: '#C026D3', d: 'Sáng tạo, nhạy với cái đẹp, thích thể hiện ý tưởng.', env: 'Thiết kế, may mặc, nấu ăn, in ấn.' },
  S: { n: 'Xã hội', c: '#16A34A', d: 'Thích giúp đỡ, lắng nghe, chăm sóc người khác.', env: 'Kaigo, nhà hàng, khách sạn, dịch vụ.' },
  E: { n: 'Quản lý', c: '#DC2626', d: 'Thích dẫn dắt, thuyết phục, dám nghĩ dám làm.', env: 'Trưởng nhóm, bán hàng, kinh doanh.' },
  C: { n: 'Nghiệp vụ', c: '#0891B2', d: 'Ngăn nắp, cẩn thận, thích làm theo quy trình rõ ràng.', env: 'Sản xuất theo quy trình, kho vận, văn phòng.' }
};
var RQ = [
  ['R', 'Sửa xe máy, quạt điện, đồ trong nhà'], ['I', 'Tìm hiểu vì sao một cái máy chạy được'], ['A', 'Vẽ, trang trí, thiết kế một món đồ'],
  ['S', 'Giúp bạn gỡ rối khi họ có chuyện buồn'], ['E', 'Đứng ra tổ chức một buổi đi chơi'], ['C', 'Sắp xếp đồ đạc, giấy tờ ngăn nắp'],
  ['S', 'Chỉ bài, hướng dẫn cho người khác'], ['C', 'Ghi chép chi tiêu, sổ sách rõ ràng'], ['R', 'Làm bằng tay với búa, cờ lê, máy khoan'],
  ['E', 'Thuyết phục người khác theo ý mình'], ['I', 'Giải một bài toán hay câu đố khó'], ['A', 'Hát, chơi nhạc cụ, nghe nhạc thật kỹ'],
  ['E', 'Buôn bán, kinh doanh nhỏ'], ['A', 'Nấu món mới và trình bày cho đẹp'], ['C', 'Làm theo hướng dẫn từng bước'],
  ['I', 'Xem video, đọc bài về khoa học, công nghệ'], ['R', 'Lắp ráp đồ vật theo bản hướng dẫn'], ['S', 'Chăm sóc ông bà, em nhỏ, người bệnh'],
  ['C', 'Kiểm tra lại việc mình làm cho hết lỗi'], ['R', 'Làm ngoài trời, vận động nhiều'], ['S', 'Làm việc nhóm, trò chuyện với nhiều người'],
  ['A', 'Chụp ảnh, quay và dựng video'], ['E', 'Làm lớp trưởng, nhóm trưởng'], ['I', 'Tìm ra nguyên nhân khi có sự cố'],
  ['A', 'Nghĩ cách làm mới, không thích làm giống ai'], ['E', 'Đặt mục tiêu lớn, thích thử thách'], ['I', 'Thử nhiều cách xem cách nào hiệu quả'],
  ['C', 'Lập kế hoạch, thời gian biểu, làm đúng giờ'], ['S', 'Tham gia tình nguyện, giúp cộng đồng'], ['R', 'Trồng cây, nuôi con vật']
];

/* 30 câu thêm cho bản đầy đủ (khóa học biên soạn theo mô hình Holland, mỗi nhóm 5 câu) */
var RQ2 = [
  ['R', 'Lái xe, điều khiển máy móc'], ['S', 'Lắng nghe người khác tâm sự'], ['C', 'Nhập số liệu, làm bảng tính'],
  ['I', 'Đọc kỹ thông số trước khi mua đồ'], ['A', 'Phối đồ, chọn màu cho đẹp'], ['E', 'Đứng nói trước đông người'],
  ['R', 'Đóng kệ, sửa bàn ghế bằng gỗ'], ['C', 'Để đồ dùng đúng chỗ quy định'], ['S', 'Đón tiếp khách đến nhà chu đáo'],
  ['A', 'Viết nhật ký, viết truyện, làm thơ'], ['E', 'Chia việc cho cả nhóm'], ['I', 'Tìm hiểu cơ thể người hoạt động thế nào'],
  ['C', 'Làm việc lặp lại mà không thấy chán'], ['R', 'Phụ sơn sửa, xây lại nhà cửa'], ['E', 'Rủ bạn bè cùng làm một việc'],
  ['S', 'Hòa giải khi bạn bè giận nhau'], ['I', 'Đo đạc, so sánh số liệu cho chính xác'], ['A', 'Trang trí phòng, góc học tập'],
  ['E', 'Mặc cả, thương lượng giá'], ['R', 'Tự thay bóng đèn, sửa ống nước'], ['C', 'Đọc kỹ quy định trước khi làm'],
  ['A', 'Làm đồ thủ công: may, đan, xếp giấy'], ['S', 'Hỏi han người mới để họ đỡ lạ'], ['I', 'Hỏi “tại sao” đến khi hiểu mới thôi'],
  ['R', 'Làm việc tay chân, thấy ngay kết quả'], ['E', 'Đi đầu khi cả nhóm còn ngại'], ['C', 'Đếm, kiểm kho, kiểm hàng'],
  ['I', 'Chơi cờ, game chiến thuật'], ['A', 'Diễn kịch, làm MC, kể chuyện'], ['S', 'Làm việc giúp người khác vui hơn']
];
var RQ_ALL = RQ.concat(RQ2);

/* ---------- Ga 4 · Diện đi Nhật (a44) · TÓM TẮT THAM KHẢO, đối chiếu 16/11/2026 ----------
   Nguồn: tikme.com/visa/* và Cơ quan Quản lý Xuất nhập cảnh Nhật (ISA). Quy định có thể thay đổi: soát lại trước mỗi đợt phát hành.
   p = khớp với hồ sơ (PS_CONFIG.PATHS) */
var VISA = {
  tts: { n: 'Thực tập sinh', p: 'Thực tập sinh', u: '/visa/thuc-tap-sinh', road: 'Thường: học JPC 6–12 tháng → làm ở Nhật 1–3 năm.',
    f: ['Học ở JPC khoảng 6–12 tháng', 'Làm ở Nhật 1–3 năm, đúng ngành đã chọn', 'Kaigo cần N4. Ngành khác học từ đầu', 'Xong có thể về nước hoặc lên Kỹ năng đặc định 1'],
    note: 'Từ 1/4/2027, Ikusei Shuro thay chế độ Thực tập sinh. Lớp bạn theo diện nào, hỏi thầy cô nhé.' },
  iku: { n: 'Ikusei Shuro', p: 'Ikusei Shuro', u: '/visa/ikusei-shurou', road: 'Thường: học JPC → làm ở Nhật 3 năm → lên Kỹ năng đặc định 1.',
    f: ['Bắt đầu từ 1/4/2027', 'Nhập cảnh cần A1 (khoảng N5). Chưa đạt thì học thêm 100 giờ', 'Làm 3 năm. Đủ điều kiện thì được đổi chỗ làm cùng ngành', 'Đậu tay nghề cấp 3 + N4 → lên Kỹ năng đặc định 1'],
    note: 'Chế độ mới, chi tiết có thể còn cập nhật.' },
  ssw: { n: 'Kỹ năng đặc định', p: 'Kỹ năng đặc định', u: '/visa/ky-nang-dac-dinh-1', road: 'Thường: đậu thi tay nghề + N4 → làm ở Nhật tối đa 5 năm.',
    f: ['Cần đậu thi tay nghề + N4 (hoặc JFT-Basic A2)', 'Diện số 1 ở tối đa 5 năm', 'Được đổi chỗ làm cùng ngành', 'Số 1 chưa mang gia đình. Lên số 2 thì được'],
    note: 'Lên số 2 cần đậu kỳ thi tay nghề cao hơn, chỉ ở một số ngành.' },
  na: { n: 'Chưa rõ', p: 'Chưa rõ', u: '/visa/hanh-trinh', road: 'Chọn năm theo dự định của bạn. Chưa biết thì chọn “Chưa biết”.',
    f: ['Thực tập sinh: 1–3 năm, thay bằng Ikusei Shuro từ 4/2027', 'Ikusei Shuro: 3 năm → Kỹ năng đặc định 1', 'Kỹ năng đặc định 1: tối đa 5 năm, cần tay nghề + N4'],
    note: 'Làm bài chọn visa trên Tikme, rồi hỏi thầy cô chủ nhiệm.' }
};
var VISA_ORDER = ['tts', 'iku', 'ssw', 'na'];
var VISA_SRC = 'Tham khảo Tikme và Cơ quan Xuất nhập cảnh Nhật. Quy định có thể thay đổi.';
/* Mốc tự dựng dòng thời gian (a44). next: nhãn riêng theo diện */
var MILES = [
  ['n5', 'Đạt tiếng Nhật N5'], ['pv', 'Đậu phỏng vấn công việc ở Nhật'], ['fly', 'Bay sang Nhật'], ['n4', 'Đạt N4'],
  ['skill', 'Đậu thi tay nghề [Nghề]'], ['n3', 'Đạt N3'], ['next', 'Lên Kỹ năng đặc định 1'], ['back', 'Về nước hoặc ở lại tiếp']
];
var MILE_NEXT = { ssw: 'Lên Kỹ năng đặc định 2' };

/* ---------- Ga 4 · thẻ sẵn sàng (a43) · Senpai kể theo từng điều (lời kể mẫu) ---------- */
var READY = [
  ['Học tiếng Nhật mỗi ngày, kể cả khi đã sang Nhật', 'Anh khóa trước · ngành cơ khí', 'Sang Nhật mình vẫn học 20 phút mỗi tối. Năm thứ hai mình nghe hiểu tổ trưởng mà không phải hỏi lại.'],
  ['Xa gia đình 3–5 năm', 'Chị khóa trước · ngành thực phẩm', 'Tháng đầu mình nhớ nhà lắm. Mình hẹn gọi video với mẹ mỗi tối Chủ nhật, thấy đỡ hẳn.'],
  ['Làm theo ca, có khi ca đêm', 'Anh khóa trước · ngành điện tử', 'Tuần ca đêm, mình che kín cửa sổ, ngủ đủ buổi sáng. Quen nếp rồi thì không mệt như mình sợ.'],
  ['Đứng nhiều, việc lặp lại', 'Chị khóa trước · ngành đóng gói', 'Việc lặp lại thì mình tự đặt mục tiêu nhỏ: hôm nay ít lỗi hơn hôm qua. Thấy vui hơn nhiều.'],
  ['Giữ giờ giấc, 5S, an toàn', 'Anh khóa trước · ngành xây dựng', 'Ở JPC mình thấy 5S hơi khắt khe. Sang Nhật mới hiểu, nhờ quen từ trước mà mình được giao việc sớm.'],
  ['Bắt đầu từ việc đơn giản nhất', 'Anh khóa trước · ngành ô tô', 'Tuần đầu mình chỉ lau máy, xếp hàng. Mình ghi lại từng bước, tháng thứ hai được đứng máy.'],
  ['Tiêu ít để tích lũy', 'Chị khóa trước · ngành may mặc', 'Ngày nhận lương, mình chia ba phần ngay: gửi nhà, để dành, tiêu. Tiêu trước thì không bao giờ dư.'],
  ['Ở ký túc xá với nhiều người', 'Anh khóa trước · ngành nông nghiệp', 'Phòng bốn người, tụi mình cùng lập lịch trực và giờ tắt đèn. Có luật chung thì ít va chạm.']
];
var READY_OPTS = [['r', 'Sẵn sàng'], ['w', 'Còn lo'], ['u', 'Chưa biết']];

/* ---------- Lời Shin, chữ giao diện ---------- */
var SHIN_NAMES = ['Shin trứng', 'Shin gà con', 'Shin gà rừng', 'Shin đại bàng'];
var TXT = {
  introKicker: 'Career Design 01',
  intro: 'Chào [Tên]! Mình là <b>Shin</b>. Ở đây không có đúng sai, chỉ có câu trả lời thật của bạn. Đi hết 7 ga, bạn có <b>Bản Career Design</b> của riêng mình.',
  introBtn: 'Chào Shin! Mình bắt đầu nhé',
  gateToast: 'Chính xác! Shin mê Oden lắm. Lên tàu thôi!',
  homeHi: ['Chào [Tên]! Hôm nay đi tiếp một ga nhé.', 'Chào [Tên]! Mỗi ga chỉ khoảng 15 phút thôi.', 'Chào [Tên]! Bản Career Design của bạn đang lớn dần đó.'],
  homeWait: '[Tên] giỏi quá! Các ga sau đang được xây, chờ Shin chút nhé.',
  warmT: 'Khởi động 30 giây', warmSub: 'Không bắt buộc · +10 XP',
  stampBtn: 'Đóng dấu',
  redo: 'Bạn đang xem lại bài đã làm. Sửa chỗ nào cũng được.',
  redoNew: 'Bạn đang làm lại từ đầu. Bài cũ vẫn giữ đến khi bạn đóng dấu.',
  noScore: 'Không có đúng sai',
  senpaiDraft: 'lời kể mẫu',
  reportT: 'Báo cáo tiến độ',
  reportSub: 'Gửi thầy cô 4 ô đầu của bạn. Thầy cô đọc để hiểu bạn, không chấm điểm.'
};

/* ---------- HOẠT ĐỘNG ---------- */
var ACTS = {
  /* ===== SÂN GA XUẤT PHÁT ===== */
  x1: { t: 'Lên tàu', mins: 5, st: 's0', d: 'Chuyến tàu là gì, bạn đang ở đâu, muốn mang về gì.',
    steps: [
      { k: 'say', mood: 'hi', t: 'Career Design là tự vẽ hướng đi nghề nghiệp của bạn: <b>hiểu mình</b>, <b>hiểu nghề</b>, biết <b>bắt đầu từ đâu</b>.',
        rules: [
          ['check', 'Không có đúng sai', 'Chỉ cần thật với mình.'],
          ['info', '“Chưa chắc” cũng là câu trả lời', 'Các ga sau giúp bạn nghĩ tiếp.'],
          ['people', 'Thầy cô đọc để hiểu bạn', 'Không chấm điểm bài viết.'],
          ['book', 'Xong 7 ga, có Bản Career Design', 'Mỗi ga điền một ô.']
        ] },
      { k: 'pick', key: 'x1.now', scale: 1, q: 'Bạn đã rõ nghề mình muốn làm chưa?', sub: 'Cuối khóa, Shin hỏi lại câu này.',
        opts: [
          { v: '1', t: 'Chưa nghĩ nhiều', rep: 'Không sao. Chuyến tàu này giúp bạn nghĩ.' },
          { v: '2', t: 'Có vài ý, còn mơ hồ', rep: 'Khởi đầu tốt rồi. Mình cùng lọc xem ý nào là của bạn.' },
          { v: '3', t: 'Có hướng, muốn rõ hơn', rep: 'Các ga sau sẽ giúp hướng đó rõ hơn.' },
          { v: '4', t: 'Khá rõ, muốn lên kế hoạch', rep: 'Vậy mình cùng kiểm tra lại và lên kế hoạch nhé.' }
        ] },
      { k: 'video', yt: 'PrgsXcJ_yGc', start: 10, url: 'https://www.youtube.com/watch?v=PrgsXcJ_yGc&t=10s', title: 'Gương anh chị học viên Esuhai',
        hint: 'Để ý: họ bắt đầu từ đâu, chọn gì, nhờ đâu đi xa.',
        key: 'x1.notice', q: 'Bạn để ý điều gì nhất?', sub: 'Chọn 1 hoặc vài ý.', min: 1, own: 'Ý khác',
        opts: ['Hoàn cảnh giống mình', 'Dám chọn khác số đông', 'Học tiếng Nhật bền bỉ', 'Có người dẫn đường', 'Vượt qua lúc khó', 'Chưa xem hết, xem sau'] },
      { k: 'write', q: 'Mục tiêu của bạn', sub: 'Viết ngắn, thật là được.',
        fields: [{ key: 'x1.goal', l: 'Học xong khóa này, bạn muốn có được gì?', starter: 'Mình muốn ', ph: 'Ví dụ: biết mình hợp nghề gì', min: 12, rows: 3 }],
        tips: ['Mình muốn biết mình hợp nghề nào.', 'Mình muốn trả lời được “Vì sao chọn nghề này?” khi phỏng vấn.', 'Mình muốn có kế hoạch học tiếng Nhật rõ ràng.'] },
      { k: 'say', mood: 'cheer', card: 1, t: 'Vé đã in! Ô số 1 đã có chữ của bạn. Bấm <b>Đóng dấu</b> để lên tàu nhé.' }
    ] },

  /* ===== GA 1 · NHÌN XA ===== */
  w1: { t: 'Khởi động · 5 năm nữa', mins: 1, st: 's1', warm: 1,
    steps: [
      { k: 'age', key: 'w1.where', q: 'Lúc đó, bạn đang ở đâu?',
        opts: [{ v: 'jp', t: 'Làm việc ở Nhật' }, { v: 'vn', t: 'Về Việt Nam, đi làm' }, { v: 'other', t: 'Ở nơi khác' }, { v: 'na', t: 'Chưa hình dung được' }],
        rep: 'Đi Nhật thường 3–5 năm. Vậy 5 năm tới gần trùng chuyến đi của bạn đó.' }
    ] },
  a11: { t: 'Mình thật sự hay làm gì?', mins: 5, st: 's1', d: '5 tình huống. Chọn điều bạn hay làm thật.',
    steps: [
      { k: 'say', mood: 'think', t: 'Không có bên đúng sai. Bên nào cũng có <b>được</b> có <b>mất</b>. Chọn điều bạn <b>hay làm thật</b> nhé.' },
      { k: 'dil', key: 'a11.p1', q: 'Có lương hoặc tiền làm thêm, bạn thường…',
        a: { t: 'Mua ngay món thích từ lâu', get: 'Vui, tự thưởng mình', lose: 'Cuối tháng dễ hụt tiền' },
        b: { t: 'Gửi nhà, để dành rồi mới tiêu', get: 'Yên tâm khi có việc gấp', lose: 'Chờ lâu mới mua được' },
        senpai: { who: 'Anh khóa trước · ngành cơ khí', draft: 1, t: 'Tháng lương đầu, mình mua điện thoại ngay. Tháng sau mình chia tiền làm ba phần: gửi nhà, để dành, tiêu.' } },
      { k: 'dil', key: 'a11.p2', q: 'Tối rảnh, bạn thường…', calc: 1,
        a: { t: 'Lướt TikTok, xem phim', get: 'Thư giãn, có khi học được điều hay', lose: 'Dễ quá giờ, sáng mệt' },
        b: { t: 'Học thêm chút rồi ngủ sớm', get: 'Mỗi ngày một ít, cộng dồn', lose: 'Phải cố lúc mệt' },
        senpai: { who: 'Chị khóa trước · ngành điều dưỡng', draft: 1, t: 'Mình vẫn xem TikTok, nhưng hẹn giờ 20 phút. Hết giờ thì học 15 phút từ vựng.' } },
      { k: 'dil', key: 'a11.p3', q: 'Chưa hiểu bài, bạn thường…',
        a: { t: 'Để đó, cần thì học lại', get: 'Đỡ áp lực lúc đó', lose: 'Chỗ hổng lớn dần' },
        b: { t: 'Hỏi thầy cô, bạn bè ngay', get: 'Hiểu chắc từ đầu', lose: 'Hơi ngại' },
        senpai: { who: 'Anh khóa trước · ngành xây dựng', draft: 1, t: 'Mình ngại hỏi trước lớp, nên nhắn riêng cô sau giờ học. Sang Nhật, mình chờ lúc senpai rảnh mới hỏi.' } },
      { k: 'dil', key: 'a11.p4', q: 'Sáng cuối tuần, bạn thường…',
        a: { t: 'Ngủ bù cho đã', get: 'Lấy lại sức', lose: 'Dễ lệch giờ ngủ' },
        b: { t: 'Dậy như thường, vận động, dọn phòng', get: 'Giữ nhịp, phòng gọn', lose: 'Ít được nghỉ' },
        senpai: { who: 'Chị khóa trước · ngành thực phẩm', draft: 1, t: 'Ở Nhật, ca làm luôn đúng giờ. Cuối tuần mình chỉ ngủ thêm khoảng 1 tiếng.' } },
      { k: 'dil', key: 'a11.p5', q: 'Bạn thân rủ nghỉ học đi chơi, bạn thường…',
        a: { t: 'Đi luôn, lâu lâu mới một lần', get: 'Vui, thân bạn hơn', lose: 'Lỡ bài, có thể bị nhắc' },
        b: { t: 'Hẹn bạn dịp khác', get: 'Không lỡ bài, vẫn giữ bạn', lose: 'Sợ bạn buồn' },
        senpai: { who: 'Anh khóa trước · ngành nông nghiệp', draft: 1, t: 'Mình từng đi vài lần, chép bài lại rất cực. Giờ mình rủ cả nhóm đi chơi chiều Chủ nhật.' } },
      { k: 'recap', from: ['a11.p1', 'a11.p2', 'a11.p3', 'a11.p4', 'a11.p5'], labels: ['Tiền lương', 'Buổi tối', 'Chưa hiểu bài', 'Cuối tuần', 'Bạn rủ đi chơi'],
        key: 'a11.try', q: 'Tuần này, bạn muốn thử đổi tình huống nào?', sub: 'Chạm một tình huống, hoặc giữ như hiện tại.', keepT: 'Giữ như hiện tại',
        fields: [{ key: 'a11.why', l: 'Vì sao?', ph: 'Viết ngắn thôi', min: 12, rows: 2 }],
        tips: ['Mình muốn hẹn giờ lướt điện thoại, vì sáng nào cũng buồn ngủ.', 'Mình giữ như cũ, vì thấy cách tiêu tiền của mình đang ổn.'] }
    ] },
  a13: { t: 'Hai phiên bản của tôi', mins: 5, st: 's1', d: 'Bạn mong gì, và ngày thường đang đưa bạn tới đâu.',
    steps: [
      { k: 'multi', key: 'a13.hope', q: '5 năm sau, bạn mong mình thế nào?', sub: 'Chọn tối đa 3.', min: 1, max: 3, own: 'Ý khác',
        opts: ['Có nghề vững tay', 'Nói tiếng Nhật tự tin', 'Khỏe mạnh', 'Lo được cho gia đình', 'Có tiền để dành', 'Có bạn bè tốt', 'Dám thử việc mới', 'Được người khác tin'] },
      { k: 'multi', key: 'a13.day', q: 'Ngày thường của bạn có những việc nào?', sub: 'Chọn ít nhất 3, đúng như thật.', min: 3, own: 'Việc khác',
        opts: ['Dậy trước 6 giờ', 'Thức sau 12 giờ đêm', 'Lướt mạng xã hội', 'Chơi game', 'Học tiếng Nhật thêm', 'Tập thể dục', 'Đi làm thêm', 'Nấu ăn', 'Gọi điện về nhà', 'Dọn phòng', 'Đến lớp sát giờ', 'Ăn vặt, trà sữa', 'Ghi chép chi tiêu', 'Đi chơi với bạn'] },
      { k: 'tag', key: 'a13.tag', from: 'a13.day', hope: 'a13.hope',
        q: 'Mỗi việc kéo bạn lại gần hay ra xa điều bạn mong?', sub: 'Mỗi người xếp một khác. Bạn tự quyết.',
        opts: [['g', 'Lại gần'], ['x', 'Ra xa'], ['u', 'Chưa biết']] },
      { k: 'write', twin: 1, from: 'a13.tag', q: 'Hai phiên bản của bạn', sub: 'Dựa vào cách bạn vừa xếp.',
        fields: [
          { key: 'a13.keep', l: 'Nếu mọi thứ giữ như bây giờ', starter: 'Mình sẽ ', ph: 'Ví dụ: vẫn làm được việc, nhưng…', min: 12, rows: 3, tag: 'Giữ nguyên' },
          { key: 'a13.change', l: 'Nếu đổi 1–2 việc nhỏ', starter: 'Mình sẽ ', ph: 'Ví dụ: nói tiếng Nhật tự tin hơn…', min: 12, rows: 3, tag: 'Đổi 1–2 việc' }
        ],
        tips: ['Giữ nguyên: vẫn làm được việc, nhưng tiếng Nhật chỉ đủ dùng, hay mệt vì thức khuya.', 'Đổi 1–2 việc: nói chuyện công việc bằng tiếng Nhật, khỏe hơn, có tiền gửi nhà.'] },
      { k: 'write', q: 'Bạn muốn trở thành ai?', sub: 'Câu này vào ô số 2.',
        fields: [
          { key: 'a13.me', l: 'Viết một câu', starter: '5 năm sau, mình muốn là người ', ph: 'Ví dụ: có nghề vững tay, lo được cho ba mẹ', min: 12, rows: 2 },
          { key: 'a13.first', l: 'Việc nhỏ bạn thử từ tuần này', ph: 'Ví dụ: tắt điện thoại lúc 23 giờ', min: 6, rows: 2, noIns: 1 }
        ] }
    ] },

  /* ===== GA 2 · BIẾT MÌNH ===== */
  a21: { t: 'Tôi thích làm gì?', mins: 4, st: 's2', d: 'Vòng 1: việc làm bạn thấy vui.',
    steps: [
      { k: 'multi', key: 'a21.sel', q: 'Việc nào làm bạn thấy vui?', sub: 'Chọn ít nhất 3. Chọn theo cảm nhận.', min: 3, own: 'Việc khác',
        opts: ['Sửa chữa đồ đạc', 'Lắp ráp, tháo lắp', 'Nấu ăn', 'Trồng cây, nuôi con vật', 'Chăm sóc người khác', 'Trò chuyện, kết bạn', 'Vẽ, trang trí', 'May vá, làm đồ thủ công', 'Dọn dẹp, sắp xếp', 'Thể thao, vận động', 'Máy tính, công nghệ', 'Lái xe, vận hành máy', 'Bán hàng, phục vụ khách', 'Chỉ dạy người khác', 'Tìm hiểu cái mới', 'Làm một mình, yên tĩnh'] },
      { k: 'write', q: 'Lần gần nhất bạn quên cả thời gian?', sub: 'Lúc đó bạn đang làm gì?',
        fields: [{ key: 'a21.flow', l: 'Kể ngắn', ph: 'Ví dụ: cùng ba sửa xe, mải làm hết buổi chiều', min: 12, rows: 3 }] }
    ] },
  a22: { t: 'Tôi giỏi gì?', mins: 4, st: 's2', d: 'Vòng 2: điểm mạnh của bạn.',
    steps: [
      { k: 'multi', key: 'a22.sel', q: 'Bạn mạnh ở những điểm nào?', sub: 'Chọn ít nhất 3. Không chắc thì hỏi người thân.', min: 3, own: 'Điểm mạnh khác',
        groups: [
          ['Tâm · thái độ', ['Kiên nhẫn', 'Biết lắng nghe', 'Biết ơn', 'Chân thành', 'Có trách nhiệm', 'Hay giúp người']],
          ['Thân · sức khỏe, thói quen', ['Khỏe, chịu khó', 'Khéo tay', 'Đúng giờ', 'Gọn gàng', 'Cẩn thận, tỉ mỉ', 'Chịu được áp lực']],
          ['Trí · cách nghĩ, cách học', ['Học nhanh', 'Nhớ tốt', 'Tính toán', 'Quan sát tốt', 'Sáng tạo', 'Hay hỏi “tại sao”']],
          ['Kỹ năng', ['Giao tiếp', 'Làm việc nhóm', 'Tiếng Nhật', 'Dẫn dắt nhóm', 'Dùng máy tính', 'Sửa chữa, lắp ráp']]
        ] },
      { k: 'write', q: 'Ai từng khen bạn, khen gì?', sub: 'Lời khen thật thường chỉ ra điểm mạnh thật.',
        fields: [{ key: 'a22.praise', l: 'Kể ngắn', ph: 'Ví dụ: cô chủ nhiệm khen mình ghi chép kỹ', min: 12, rows: 3 }] }
    ] },
  a23: { t: 'Điều gì quan trọng với tôi?', mins: 5, st: 's2', d: 'Vòng 3, rồi tìm chỗ 3 vòng gặp nhau.',
    steps: [
      { k: 'multi', key: 'a23.rank', q: 'Điều gì quan trọng nhất với bạn?', sub: 'Chọn đúng 3 điều.', min: 3, max: 3, own: 'Điều khác',
        opts: ['Thu nhập tốt', 'Gia đình', 'Học hỏi, phát triển', 'Ổn định lâu dài', 'Sức khỏe', 'Tự do, tự chủ', 'Giúp đỡ người khác', 'Được tôn trọng', 'Khám phá, trải nghiệm', 'Làm chủ, kinh doanh'] },
      { k: 'venn', q: 'Nghề nào nằm ở giữa 3 vòng?', sub: 'Gợi ý 1–3 nghề. Chưa chắc cũng không sao.',
        fields: [{ key: 'a23.inter', l: 'Nghề bạn nghĩ tới', starter: 'Mình nghĩ tới ', ph: 'Ví dụ: sửa ô tô, vì thích sửa xe, khéo tay', min: 8, rows: 3 }] }
    ] },

  /* ===== GA 3 · TÍNH CÁCH ===== */
  a31: { t: 'Trắc nghiệm RIASEC', mins: 5, st: 's3', d: '30 hoặc 60 câu Thích / Không hẳn, tìm 3 nhóm sở thích nghề.',
    steps: [
      { k: 'riamode', key: 'a31.n', t: 'RIASEC chia sở thích nghề thành <b>6 nhóm</b>. Chọn theo cảm nhận, đừng nghĩ lâu nhé.',
        opts: [{ v: 60, t: 'Bản đầy đủ · 60 câu', d: 'Khoảng 8 phút · kết quả rõ hơn', rec: 1 }, { v: 30, t: 'Bản nhanh · 30 câu', d: 'Khoảng 4 phút · làm thêm 30 câu sau cũng được' }] },
      { k: 'ria', key: 'a31.rq', q: 'Bạn có thích việc này không?' },
      { k: 'riares', key: 'a31.rq' }
    ] },
  a32: { t: 'Trắc nghiệm ngành Tikme', mins: 5, st: 's3', d: 'Làm bài trên Tikme, rồi so với RIASEC.',
    steps: [
      { k: 'tik', key: 'a32.open', url: TIKME + '/nganh-nghe', btn: 'Mở trang Ngành nghề trên Tikme',
        t: 'Tikme có <b>17 ngành</b> đi Nhật. Mở trang Ngành nghề, làm bài trắc nghiệm ngành, rồi quay lại đây.',
        tips: ['Tikme mở ở thẻ mới. Làm xong, quay lại thẻ này để đi tiếp.', 'Chưa làm kịp? Bước sau bạn chọn ngành theo cảm nhận cũng được.'] },
      { k: 'inds', key: 'a32.t', multi: 1, max: 3, q: 'Tikme gợi ý cho bạn ngành nào?', sub: 'Chọn tối đa 3. Chưa làm được thì chọn ngành bạn thấy thích.' },
      { k: 'cmp', key: 'a32.feel', q: 'Hai kết quả có khớp nhau không?',
        opts: [{ v: 'y', t: 'Khá khớp' }, { v: 'p', t: 'Khớp một phần' }, { v: 'n', t: 'Khác nhau' }, { v: 'u', t: 'Chưa chắc' }],
        rep: 'Khớp hay không đều có ích. Khác nhau nghĩa là bạn có nhiều hướng để cân nhắc.' }
    ] },
  a33: { t: 'Chọn ga đích', mins: 5, st: 's3', d: 'Xem 3 dấu hiệu chọn nghề, chọn nghề chính và phương án 2.',
    steps: [
      { k: 'video', yt: 'gndJToZz76M', start: 0, url: 'https://www.youtube.com/watch?v=gndJToZz76M', title: 'Thầy Lê Long Sơn · Dấu hiệu chọn nghề',
        hint: '3 dấu hiệu: năng khiếu, ước mơ từ nhỏ, hình mẫu bạn muốn giống.',
        key: 'a33.signs', q: 'Bạn đã thấy dấu hiệu nào ở mình?', sub: 'Chọn 1 hoặc vài ý.', min: 1, own: 'Ý khác',
        opts: ['Năng khiếu', 'Ước mơ từ nhỏ', 'Hình mẫu mình muốn giống', 'Chưa thấy rõ'] },
      { k: 'inds', key: 'a33.main', q: 'Nghề chính bạn chọn là gì?', sub: 'Đây là ga đích của chặng đầu. Sau này vẫn đổi được.', other: 1 },
      { k: 'inds', key: 'a33.b', q: 'Phương án 2 của bạn?', sub: 'Có phương án 2 không phải là thiếu quyết tâm.', other: 1, none: 'Chưa nghĩ ra', exclude: 'a33.main' },
      { k: 'write', q: 'Vì sao bạn chọn nghề chính này?', sub: 'Câu này giúp bạn trả lời khi phỏng vấn.',
        fields: [{ key: 'a33.why', l: 'Viết 1–2 câu', starter: 'Mình chọn nghề này vì ', ph: 'Ví dụ: mình khéo tay, thích máy móc', min: 12, rows: 3 }],
        tips: ['Mình chọn nghề này vì mình khéo tay và thích máy móc từ nhỏ.', 'Mình chọn nghề này vì muốn giỏi như chú mình, thợ máy 20 năm.'] }
    ] },
  /* ===== GA 4 · NGÀNH NGHỀ ===== */
  w4: { t: 'Khởi động · Đoán thử', mins: 1, st: 's4', warm: 1,
    steps: [ /* câu hỏi lấy theo nghề: xem INDP, GUESS, GUESS_GRP */
      { k: 'guess', key: 'w4.g1', slot: 0 },
      { k: 'guess', key: 'w4.g2', slot: 1 },
      { k: 'guess', key: 'w4.g3', slot: 2 }
    ] },
  a42: { t: 'Nghề của tôi', mins: 5, st: 's4', d: 'Đoán trước, xem Tikme, rồi viết một ngày làm nghề.',
    steps: [
      { k: 'jobguess', key: 'a42.guess', q: 'Bạn đoán một ngày làm [Nghề] có những gì?', sub: 'Chọn ít nhất 2. Đoán thôi, chưa cần chắc.', min: 2, own: 'Việc khác' },
      { k: 'tik', key: 'a42.open', dyn: 'job', btn: 'Xem ngành [Nghề] trên Tikme',
        t: 'Giờ xem Tikme nói gì về [Nghề]. Đọc phần <b>công việc hằng ngày</b> và <b>lộ trình</b>, rồi quay lại nhé.',
        tNear: 'Nghề của bạn chưa có trang riêng trên Tikme. Xem ngành gần nhất bạn đã chọn, rồi quay lại nhé.',
        tNone: 'Nghề của bạn chưa có trang riêng trên Tikme. Xem danh sách 17 ngành, rồi hỏi thầy cô thêm nhé.',
        tips: ['Tikme mở ở thẻ mới. Đọc xong, quay lại thẻ này.', 'Để ý chỗ nào khác với điều bạn vừa đoán.'] },
      { k: 'write', show: 'a42.guess', real: 1, q: 'Sau khi xem Tikme, bạn thấy gì?', sub: 'Viết ngắn, mỗi ô một ý.',
        fields: [
          { key: 'a42.wow', l: 'Điều làm bạn bất ngờ', ph: '@wow', min: 6, rows: 2 },
          { key: 'a42.like', l: 'Điều bạn thích ở nghề này', ph: '@like', min: 6, rows: 2 },
          { key: 'a42.worry', l: 'Điều bạn còn lo', ph: '@worry', min: 4, rows: 2, noIns: 1 }
        ] },
      { k: 'write', q: 'Một ngày làm nghề của bạn, 5 năm sau', sub: 'Tưởng tượng như kể lại cho bạn thân nghe.',
        fields: [{ key: 'a42.day', l: 'Kể từ sáng đến tối', starter: 'Buổi sáng, mình ', ph: '@dayph', min: 20, rows: 4 }],
        tips: '@day' }
    ] },
  a44: { t: 'Lộ trình của tôi', mins: 5, st: 's4', d: 'Xem diện đi Nhật, rồi tự vẽ các mốc của bạn.',
    steps: [
      { k: 'visa', key: 'a44.path', q: 'Bạn dự định đi Nhật theo diện nào?', sub: 'Chưa chắc thì chọn “Chưa rõ”.' },
      { k: 'tik', key: 'a44.open', dyn: 'visa', btn: 'Xem diện [Diện] trên Tikme',
        t: 'Mở Tikme xem kỹ <b>điều kiện</b> và <b>thời gian</b> của diện này nhé.',
        more: { u: '/visa/hanh-trinh', t: 'Làm bài chọn visa trên Tikme' },
        tips: ['Mốc tiếng Nhật và tay nghề là chỗ cần nhớ nhất.', 'Thông tin trên Tikme là tham khảo. Hỏi thầy cô khi chưa rõ.'] },
      { k: 'tl', key: 'a44.tl', q: 'Mỗi mốc, bạn dự định khi nào?', sub: 'Chọn năm. Tháng thì chọn nếu muốn. “Đã xong”, “Chưa biết” cũng được.' },
      { k: 'tlview', key: 'a44.tl', q: 'Lộ trình bạn vừa vẽ',
        fields: [{ key: 'a44.next', l: 'Mốc gần nhất, bạn bắt đầu thế nào?', starter: 'Mốc gần nhất của mình là ', ph: 'Ví dụ: đạt N5, mỗi tối học 20 từ', min: 10, rows: 3 }],
        tips: ['Mốc gần nhất của mình là N5 vào tháng 6. Mỗi tối mình học 20 từ, Chủ nhật làm 1 đề.', 'Mốc gần nhất của mình là đậu phỏng vấn ngành [Nghề]. Mình tập trả lời “Vì sao chọn nghề này?” mỗi tuần.'] }
    ] },
  a43: { t: 'Sẵn sàng đến đâu?', mins: 4, st: 's4', d: 'Xem 8 thẻ đời sống ở Nhật. Còn lo là bình thường.',
    steps: [
      { k: 'swipe', key: 'a43.r', q: 'Với điều này, bạn thấy mình…' },
      { k: 'worry', key: 'a43.top', q: 'Điều bạn lo nhất là gì?', sub: 'Chọn một. Ga 7, Shin cùng bạn chuẩn bị cho điều này.' },
      { k: 'write', q: 'Dù còn lo, vì sao bạn vẫn muốn đi?', sub: 'Lý do của chính bạn, không cần hay.',
        fields: [{ key: 'a43.why', l: 'Viết 1–2 câu', starter: 'Mình vẫn muốn đi vì ', ph: 'Ví dụ: muốn sửa lại nhà cho ba mẹ', min: 12, rows: 3 }],
        tips: ['Mình vẫn muốn đi vì muốn có nghề vững và sửa lại nhà cho ba mẹ.', 'Mình vẫn muốn đi vì muốn thử sống tự lập, xem mình làm được tới đâu.'] }
    ] }
};

/* Thứ tự học (chặng chính). Ga chưa có hoạt động (ready:0) hiện "Đang xây". */
var ORDER = ['x1', 'a11', 'a13', 'a21', 'a22', 'a23', 'a31', 'a32', 'a33', 'a42', 'a44', 'a43'];

/* ---------- Bản demo giáo viên: học viên giả đã xong Sân ga đến Ga 4 ---------- */
var DEMO_DATA = {
  prof: { name: 'Nguyễn Văn An', by: '2005', sid: 'HV2026-0123', cls: 'E696', path: 'Ikusei Shuro' },
  intro: 1,
  done: { x1: 1763260000000, w1: 1763260000000, a11: 1763260000000, a13: 1763260000000, a21: 1763260000000, a22: 1763260000000, a23: 1763260000000, a31: 1763260000000, a32: 1763260000000, a33: 1763260000000, w4: 1763260000000, a42: 1763260000000, a44: 1763260000000, a43: 1763260000000 },
  d: {
    'x1.now': '2', 'x1.notice': ['Hoàn cảnh giống mình', 'Học tiếng Nhật bền bỉ'],
    'x1.goal': 'Mình muốn biết mình hợp nghề cơ khí hay nghề hàn hơn, và có kế hoạch học tiếng Nhật rõ ràng.',
    'w1.where': 'jp',
    'a11.p1': 'b', 'a11.p2': 'a', 'a11.p3': 'm', 'a11.p4': 'a', 'a11.p5': 'b', 'a11.mins': 15,
    'a11.try': 'a11.p2', 'a11.why': 'Mình muốn hẹn giờ lướt điện thoại 20 phút, vì sáng nào lên lớp cũng buồn ngủ.',
    'a13.hope': ['Có nghề vững tay', 'Lo được cho gia đình', 'Nói tiếng Nhật tự tin'],
    'a13.day': ['Thức sau 12 giờ đêm', 'Lướt mạng xã hội', 'Đi làm thêm', 'Gọi điện về nhà', 'Học tiếng Nhật thêm'],
    'a13.tag': { 'Thức sau 12 giờ đêm': 'x', 'Lướt mạng xã hội': 'u', 'Đi làm thêm': 'g', 'Gọi điện về nhà': 'g', 'Học tiếng Nhật thêm': 'g' },
    'a13.keep': 'Mình sẽ vẫn làm được việc, nhưng tiếng Nhật chỉ đủ dùng và hay mệt vì thức khuya.',
    'a13.change': 'Mình sẽ nói chuyện công việc bằng tiếng Nhật, khỏe hơn và có tiền sửa nhà cho ba mẹ.',
    'a13.me': '5 năm sau, mình muốn là người thợ cơ khí vững tay, nói tiếng Nhật tự tin và lo được cho ba mẹ.',
    'a13.first': 'Tắt điện thoại lúc 23 giờ, trước đó học 10 từ vựng.',
    'a21.sel': ['Sửa chữa đồ đạc', 'Lắp ráp, tháo lắp', 'Nấu ăn', 'Thể thao, vận động'],
    'a21.flow': 'Mình tháo cái quạt hỏng ra sửa, ngồi cả buổi chiều mà không thấy mệt.',
    'a22.sel': ['Kiên nhẫn', 'Khéo tay', 'Cẩn thận, tỉ mỉ', 'Sửa chữa, lắp ráp'],
    'a22.praise': 'Thầy chủ nhiệm khen mình lắp lại xe đạp cho bạn mà không sót con ốc nào.',
    'a23.rank': ['Gia đình', 'Học hỏi, phát triển', 'Thu nhập tốt'],
    'a23.inter': 'Mình nghĩ tới thợ cơ khí CNC hoặc sửa ô tô, vì mình khéo tay và thích máy móc.',
    'a31.n': 60, 'a31.rq': [1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0],
    'a32.open': 1, 'a32.t': ['co-khi', 'o-to'], 'a32.feel': 'y',
    'a33.signs': ['Năng khiếu', 'Hình mẫu mình muốn giống'], 'a33.main': 'co-khi', 'a33.b': 'han',
    'a33.why': 'Mình chọn nghề này vì mình khéo tay, thích máy móc và muốn giỏi như chú mình, thợ máy 20 năm.',
    'w4.g1': 1, 'w4.g2': 0, 'w4.g3': 1,
    'a42.guess': ['Đứng máy tiện, phay, CNC', 'Đọc bản vẽ', 'Làm theo ca'], 'a42.open': 1, 'a42.for': 'co-khi',
    'a42.wow': 'Người mới phải đo hàng bằng thước kẹp rất nhiều, chưa đứng máy ngay.',
    'a42.like': 'Làm ra chi tiết máy chính xác, nhìn thấy kết quả.',
    'a42.worry': 'Sợ đọc bản vẽ tiếng Nhật chưa hiểu.',
    'a42.day': 'Sáng 7 giờ 30, mình họp sáng với tổ, nhận bản vẽ rồi chỉnh máy CNC. Chiều mình đo kiểm hàng, ghi sổ. Tối mình học 20 phút tiếng Nhật rồi gọi về nhà.',
    'a44.path': 'iku', 'a44.open': 1,
    'a44.tl': { n5: '2026', n5_m: '12', pv: '2027', pv_m: '6', fly: '2027', fly_m: '12', n4: '2028', skill: '2030', n3: '2030', next: '2030', back: 'u', own: '2029' },
    'a44.ownt': 'Đậu tay nghề cấp 3 ngành cơ khí',
    'a44.next': 'Mốc gần nhất của mình là N5 vào cuối năm nay. Mỗi tối mình học 20 từ và Chủ nhật làm một đề.',
    'a43.r': { 0: 'r', 1: 'w', 2: 'u', 3: 'r', 4: 'r', 5: 'r', 6: 'w', 7: 'u' }, 'a43.top': '1',
    'a43.why': 'Mình vẫn muốn đi vì muốn có nghề cơ khí vững tay và sửa lại nhà cho ba mẹ.'
  }
};
