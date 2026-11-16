/* CD01 · Career Design 1 · cd01/content.js · CHỮ VÀ NỘI DUNG (sửa chữ ở đây, không đụng engine.js)
   Nguyên tắc của khóa:
   1. Career Design là thiết kế, không phải bài kiểm tra: không đúng/sai; lựa chọn nào cũng có được và mất;
      luôn có "Tùy hôm / Chưa chắc" và "Ý khác"; sau khi chọn là lời Senpai, câu hỏi tiếp hoặc link tìm hiểu. Shin không khen chê.
   2. Học viên học trên ĐIỆN THOẠI: câu ngắn, một ý một câu, tiếng Việt tự nhiên. Câu hỏi ≤ 1 dòng rưỡi; lời Shin ≤ 2 câu.
   - [Tên] được thay bằng tên học viên (in đậm).
   - Senpai có cờ draft:1 = LỜI KỂ MẪU do Claude viết, cần thay bằng chuyện thật (ẩn danh) trước khi phát hành.
   ES5. */
var CD_ID = 'cd01';
var CD_VER = 'CD01.0.3';
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

/* ---------- RIASEC (John Holland): 6 nhóm sở thích nghề · 30 câu, mỗi nhóm 5 câu ---------- */
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
  ['n5', 'Đạt tiếng Nhật N5'], ['pv', 'Đậu phỏng vấn đơn hàng'], ['fly', 'Bay sang Nhật'], ['n4', 'Đạt N4'],
  ['skill', 'Đậu thi tay nghề'], ['n3', 'Đạt N3'], ['next', 'Lên Kỹ năng đặc định 1'], ['back', 'Về nước hoặc ở lại tiếp']
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
  redo: 'Đã xong · làm lại để ôn',
  noScore: 'Không có đúng sai',
  senpaiDraft: 'lời kể mẫu',
  reportT: 'Báo cáo giữa đường',
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
  a31: { t: 'Trắc nghiệm RIASEC', mins: 5, st: 's3', d: '30 câu Thích / Không hẳn, tìm 3 nhóm sở thích nghề.',
    steps: [
      { k: 'say', mood: 'think', t: 'RIASEC chia sở thích nghề thành <b>6 nhóm</b>. Bạn trả lời 30 câu. Chọn theo cảm nhận, đừng nghĩ lâu nhé.' },
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
    steps: [
      { k: 'guess', key: 'w4.g1', q: 'Tuần đầu ở xưởng Nhật, người mới thường làm gì?',
        opts: ['Đứng máy chính ngay', 'Học quy trình, dọn dẹp, đo đạc', 'Ngồi học lý thuyết cả tuần', 'Mỗi công ty một khác'],
        fact: 'Phần lớn công ty cho người mới làm việc đơn giản trước, có senpai kèm. Việc khó đến sau vài tháng.',
        senpai: { who: 'Anh khóa trước · ngành cơ khí', draft: 1, t: 'Ba tháng đầu mình chủ yếu đo hàng. Giờ mới thấy nhờ vậy mà tay mình chắc.' } },
      { k: 'guess', key: 'w4.g2', q: 'Sáng nào công trường Nhật cũng có buổi “KY”. Để làm gì?',
        opts: ['Điểm danh', 'Cùng đoán trước chỗ nguy hiểm', 'Tập thể dục', 'Chia việc trong ngày'],
        fact: 'KY (危険予知 · kiken yochi) là cùng đoán trước nguy hiểm trước giờ làm. Buổi họp sáng thường có cả thể dục và chia việc.',
        senpai: { who: 'Anh khóa trước · ngành xây dựng', draft: 1, t: 'Mỗi sáng cả nhóm chỉ vào chỗ dễ trượt, dễ va rồi hô to. Lúc đầu thấy lạ, giờ thành quen.' } },
      { k: 'guess', key: 'w4.g3', q: '“Omotenashi” ở nhà hàng, khách sạn Nhật là gì?',
        opts: ['Phục vụ thật nhanh', 'Đoán trước điều khách cần', 'Cúi chào thật sâu', 'Chưa nghe bao giờ'],
        fact: 'Omotenashi (おもてなし) là tiếp khách tận tâm, lo cả điều khách chưa kịp nói. Ở Nhật gần như không có tiền tip.',
        senpai: { who: 'Chị khóa trước · ngành nhà hàng', draft: 1, t: 'Thấy khách dắt em bé, mình mang ghế trẻ em ra trước khi khách hỏi. Khách cảm ơn mãi.' } }
    ] },
  a42: { t: 'Nghề của tôi', mins: 5, st: 's4', d: 'Đoán trước, xem Tikme, rồi viết một ngày làm nghề.',
    steps: [
      { k: 'multi', key: 'a42.guess', q: 'Bạn đoán một ngày làm [Nghề] có những gì?', sub: 'Chọn ít nhất 2. Đoán thôi, chưa cần chắc.', min: 2, own: 'Việc khác',
        opts: ['Thao tác tay, đứng máy', 'Làm theo bản vẽ, quy trình', 'Đo, kiểm tra hàng', 'Dọn dẹp 5S', 'Làm ngoài trời', 'Làm theo ca', 'Giao tiếp với khách', 'Chăm sóc người', 'Dùng máy tính', 'Làm cùng nhóm', 'Mang vác nặng', 'Tiếng Nhật chuyên ngành'] },
      { k: 'tik', key: 'a42.open', dyn: 'job', btn: 'Xem ngành [Nghề] trên Tikme',
        t: 'Giờ xem Tikme nói gì. Đọc phần <b>công việc</b> và <b>yêu cầu</b>, rồi quay lại nhé.',
        tips: ['Tikme mở ở thẻ mới. Đọc xong, quay lại thẻ này.', 'Để ý chỗ nào khác với điều bạn vừa đoán.'] },
      { k: 'write', show: 'a42.guess', q: 'Sau khi xem Tikme, bạn thấy gì?', sub: 'Viết ngắn, mỗi ô một ý.',
        fields: [
          { key: 'a42.wow', l: 'Điều làm bạn bất ngờ', ph: 'Ví dụ: phải đo bằng thước kẹp mỗi ngày', min: 6, rows: 2 },
          { key: 'a42.like', l: 'Điều bạn thích ở nghề này', ph: 'Ví dụ: làm ra sản phẩm thấy được', min: 6, rows: 2 },
          { key: 'a42.worry', l: 'Điều bạn còn lo', ph: 'Ví dụ: sợ đứng lâu bị mỏi', min: 4, rows: 2, noIns: 1 }
        ] },
      { k: 'write', q: 'Một ngày làm nghề của bạn, 5 năm sau', sub: 'Tưởng tượng như kể lại cho bạn thân nghe.',
        fields: [{ key: 'a42.day', l: 'Kể từ sáng đến tối', starter: 'Sáng 7 giờ 30, mình ', ph: 'Ví dụ: họp sáng với tổ, rồi đứng máy CNC…', min: 20, rows: 4 }],
        tips: ['Sáng 7 giờ 30, mình họp sáng với tổ, nhận bản vẽ. Chiều mình kiểm tra hàng, tối gọi về nhà.', 'Sáng 7 giờ 30, mình đến viện dưỡng lão, chào các cụ, giúp cụ ăn sáng rồi ghi sổ.'] }
    ] },
  a44: { t: 'Lộ trình của tôi', mins: 5, st: 's4', d: 'Xem diện đi Nhật, rồi tự vẽ các mốc của bạn.',
    steps: [
      { k: 'visa', key: 'a44.path', q: 'Bạn dự định đi Nhật theo diện nào?', sub: 'Chưa chắc thì chọn “Chưa rõ”.' },
      { k: 'tik', key: 'a44.open', dyn: 'visa', btn: 'Xem diện [Diện] trên Tikme',
        t: 'Mở Tikme xem kỹ <b>điều kiện</b> và <b>thời gian</b> của diện này nhé.',
        more: { u: '/visa/hanh-trinh', t: 'Làm bài chọn visa trên Tikme' },
        tips: ['Mốc tiếng Nhật và tay nghề là chỗ cần nhớ nhất.', 'Thông tin trên Tikme là tham khảo. Hỏi thầy cô khi chưa rõ.'] },
      { k: 'tl', key: 'a44.tl', q: 'Mỗi mốc, bạn dự định năm nào?', sub: 'Chọn “Đã xong” hoặc “Chưa biết” cũng được.' },
      { k: 'tlview', key: 'a44.tl', q: 'Lộ trình bạn vừa vẽ',
        fields: [{ key: 'a44.next', l: 'Mốc gần nhất, bạn bắt đầu thế nào?', starter: 'Mốc gần nhất của mình là ', ph: 'Ví dụ: đạt N5, mỗi tối học 20 từ', min: 10, rows: 3 }],
        tips: ['Mốc gần nhất của mình là N5 vào tháng 6. Mỗi tối mình học 20 từ, Chủ nhật làm 1 đề.', 'Mốc gần nhất của mình là đậu phỏng vấn. Mình tập trả lời “Vì sao chọn nghề này?” mỗi tuần.'] }
    ] },
  a43: { t: 'Sẵn sàng đến đâu?', mins: 4, st: 's4', d: 'Lật 8 thẻ đời sống ở Nhật. Còn lo là bình thường.',
    steps: [
      { k: 'swipe', key: 'a43.r', q: 'Với điều này, bạn thấy mình…', sub: 'Vuốt phải: Sẵn sàng · vuốt trái: Còn lo' },
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
    'a31.rq': [1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1],
    'a32.open': 1, 'a32.t': ['co-khi', 'o-to'], 'a32.feel': 'y',
    'a33.signs': ['Năng khiếu', 'Hình mẫu mình muốn giống'], 'a33.main': 'co-khi', 'a33.b': 'han',
    'a33.why': 'Mình chọn nghề này vì mình khéo tay, thích máy móc và muốn giỏi như chú mình, thợ máy 20 năm.',
    'w4.g1': 1, 'w4.g2': 0, 'w4.g3': 1,
    'a42.guess': ['Thao tác tay, đứng máy', 'Làm theo bản vẽ, quy trình', 'Làm theo ca'], 'a42.open': 1,
    'a42.wow': 'Người mới phải đo hàng bằng thước kẹp rất nhiều, chưa đứng máy ngay.',
    'a42.like': 'Làm ra chi tiết máy chính xác, nhìn thấy kết quả.',
    'a42.worry': 'Sợ đọc bản vẽ tiếng Nhật chưa hiểu.',
    'a42.day': 'Sáng 7 giờ 30, mình họp sáng với tổ, nhận bản vẽ rồi chỉnh máy CNC. Chiều mình đo kiểm hàng, ghi sổ. Tối mình học 20 phút tiếng Nhật rồi gọi về nhà.',
    'a44.path': 'iku', 'a44.open': 1,
    'a44.tl': { n5: '2026', pv: '2027', fly: '2027', n4: '2028', skill: '2030', n3: '2030', next: '2030', back: 'u' },
    'a44.next': 'Mốc gần nhất của mình là N5 vào cuối năm nay. Mỗi tối mình học 20 từ và Chủ nhật làm một đề.',
    'a43.r': { 0: 'r', 1: 'w', 2: 'u', 3: 'r', 4: 'r', 5: 'r', 6: 'w', 7: 'u' }, 'a43.top': '1',
    'a43.why': 'Mình vẫn muốn đi vì muốn có nghề cơ khí vững tay và sửa lại nhà cho ba mẹ.'
  }
};
