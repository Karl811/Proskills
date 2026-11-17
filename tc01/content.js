/* =========================================================
   TC01 · Huấn luyện thể chất · tc01/content.js · CHỮ VÀ NỘI DUNG (sửa ở đây)
   Học viên học trên ĐIỆN THOẠI: câu ngắn, một ý một câu. Lời Shin ≤ 2 câu.
   Nguồn nội dung: Sổ quản lý học tập GDTC v10.1, chương trình GDTC TTS/Kỹ sư, tiêu chí đo lường theo nghề (KTN),
   Sổ tay sức khỏe 2.0. Kỹ thuật động tác do GV GDTC duyệt lại. Mốc thể lực: bảng thành tích Sổ quản lý v10.1.
   ========================================================= */
var TC_VER = 'TC01.0.8';
var TC_YT = 'https://www.youtube.com/@THECHAT_SUCKHOE/shorts'; /* kênh video động tác của thầy cô GDTC */
var TC_RADIO = 'https://www.youtube.com/watch?v=0xfDmrcI7OI';

/* ---------- 5 nhóm môi trường làm việc ---------- */
var GROUPS = {
  xuong:  { n: 'Nhà xưởng',  jp: '工場', kana: 'こうじょう', ic: 'gear',   d: 'Đứng máy cả ca, tiếng ồn, nóng, bụi, nhấc chi tiết.' },
  chuyen: { n: 'Dây chuyền', jp: 'ライン', kana: 'らいん',     ic: 'line',   d: 'Đứng hoặc ngồi một chỗ, lặp một động tác, có nơi lạnh ẩm.' },
  troi:   { n: 'Ngoài trời', jp: '屋外', kana: 'おくがい',   ic: 'sun',    d: 'Nắng nóng, rét, mang vác, cúi, đào, làm trên cao.' },
  dv:     { n: 'Dịch vụ',    jp: 'サービス', kana: 'さーびす', ic: 'tray',  d: 'Đi lại cả ngày, đỡ người, bưng bê, cúi lau.' },
  vp:     { n: 'Văn phòng',  jp: 'オフィス', kana: 'おふぃす', ic: 'desk',  d: 'Ngồi lâu, cổ vai gáy, mỏi mắt, ít vận động.' }
};
var GROUP_ORDER = ['xuong', 'chuyen', 'troi', 'dv', 'vp'];

/* ---------- nghề → nhóm (s trùng mã ngành của CD01 để tự gợi ý) ---------- */
var JOBS = [
  { s: 'co-khi', n: 'Cơ khí', g: 'xuong' },
  { s: 'han', n: 'Hàn', g: 'xuong' },
  { s: 'o-to', n: 'Ô tô', g: 'xuong' },
  { s: 'duc-nhua', n: 'Đúc nhựa', g: 'xuong' },
  { s: 'son', n: 'Sơn', g: 'xuong', note: 'Sơn công trình, sơn nhà: chọn nhóm Ngoài trời.' },
  { s: 'in-an', n: 'In ấn', g: 'xuong' },
  { s: 'thuc-pham', n: 'Thực phẩm', g: 'chuyen' },
  { s: 'thuy-san', n: 'Thủy sản', g: 'chuyen' },
  { s: 'dong-goi-cong-nghiep', n: 'Đóng gói công nghiệp', g: 'chuyen' },
  { s: 'dien-tu', n: 'Điện tử', g: 'chuyen' },
  { s: 'may-mac', n: 'May mặc', g: 'chuyen' },
  { s: 'xay-dung', n: 'Xây dựng', g: 'troi' },
  { s: 'nong-nghiep', n: 'Nông nghiệp', g: 'troi' },
  { s: 'dieu-duong', n: 'Kaigo · Chăm sóc', g: 'dv' },
  { s: 'nha-hang', n: 'Nhà hàng · Khách sạn', g: 'dv' },
  { s: 've-sinh-toa-nha', n: 'Vệ sinh tòa nhà', g: 'dv' },
  { s: 'ky-su', n: 'Kỹ sư công nghệ', g: 'vp' },
  { s: 'du-hoc', n: 'Du học sinh', g: 'vp', two: 1 },
  { s: 'khac', n: 'Nghề khác hoặc chưa biết', g: '' }
];

/* ---------- 6 khu của phòng tập ---------- */
/* Phòng tập Shin Fitness Center (TC01.0.8): no = số phòng, en = tên tiếng Anh (short: bản ngắn trên tòa nhà), col = 2 màu dải trái bảng tên phòng */
var KHU = [
  { id: 'san',   t: 'Sàn tập',        no: '101', en: 'WORKOUT FLOOR',     short: 'WORKOUT FLOOR', col: ['#3E9A6B', '#2A714D'], ic: 'dumbbell', sub: 'Động tác đúng kỹ thuật, tự tập ở nhà', ready: 1 },
  { id: 'radio', t: 'Radio Taiso',    no: 'R',   en: 'RADIO TAISO DECK',  short: 'RADIO TAISO DECK', col: ['#C9A45A', '#9C7C38'], ic: 'radio', sub: '13 động tác buổi sáng của người Nhật' },
  { id: 'bep',   t: 'Bếp dinh dưỡng', no: '201', en: 'NUTRITION KITCHEN', short: 'KITCHEN', col: ['#D08A60', '#A9623E'], ic: 'bowl', sub: 'Ăn vậy đủ chưa? Món Việt, món Nhật', ready: 1 },
  { id: 'nghe',  t: 'Góc nghề',       no: '202', en: 'WORK-FIT CORNER',   short: 'WORK-FIT', col: ['#5E88A8', '#406A89'], ic: 'helmet', sub: 'Thân thể cho nghề, nâng vật đúng, an toàn', ready: 1 },
  { id: 'yte',   t: 'Phòng y tế',     no: '301', en: 'FIRST AID ROOM',    short: 'FIRST AID', col: ['#3A9C97', '#24736F'], ic: 'cross', sub: 'Choáng, say nắng, cảm lạnh, đau lưng' },
  { id: 'test',  t: 'Phòng test',     no: '302', en: 'TEST LAB',          short: 'TEST LAB', col: ['#8C7BB0', '#66568A'], ic: 'gauge', sub: 'Test thử lý thuyết, tự test thể lực' }
];
/* tầng của tòa nhà (từ trên xuống); 'lobby' = quầy lễ tân, mở Sổ tay › Thẻ hội viên */
var FLOORS = [['radio'], ['yte', 'test'], ['bep', 'nghe'], ['san', 'lobby']];
var LOBBY = { no: 'G', short: 'LOBBY', t: 'Lễ tân' };
/* sân trước phòng tập: chạm khối, Shin kể 1 mẹo (câu ngắn lấy từ bài đã duyệt) */
var YARD_TIPS = {
  dumb: 'Làm đúng 5 cái tốt hơn làm sai 15 cái.',
  plate: 'Làm ấm khớp và tim trước khi tập.',
  kb: 'Siết bụng, lưng thẳng khi nâng.',
  bottle: 'Nước mỗi ngày: cân nặng (kg) × 0,04 lít.',
  oni: 'Ăn đủ bữa trước ca làm.',
  bento: 'Cơm hộp mang đi: giữ mát, ăn sớm.',
  helm: 'Thấy nặng quá sức: nhờ người, dùng xe đẩy.',
  watch: 'Giãn cơ 2 phút giữa ca.',
  mat: 'Làm 5 động tác khởi động trước ca.',
  radio: 'Radio Taiso ở sân thượng. Sắp mở!',
  aid: 'Phòng y tế: sắp mở.',
  shin: 'Chạm khối nào, Shin kể một mẹo cho bạn.'
};

/* ---------- lời Shin ---------- */
var TXT = {
  joinHi: 'Chào <b class="nm">[Tên]</b>! Shin đang khởi động nè. Vào tập cùng Shin nhé!',
  joinHi2: 'Trước hết, ghé quầy lễ tân làm thẻ hội viên nhé. Mất khoảng 2 phút.',
  jobQ: 'Bạn sẽ làm nghề gì ở Nhật?',
  jobSub: 'Shin dùng để gợi ý bài tập hợp nơi làm việc của bạn. Đổi lại được bất cứ lúc nào.',
  fromCd: 'Ở Career Design 01, Ga đích của bạn là <b>[Nghề]</b>. Shin chọn sẵn nhé.',
  whereQ: 'Bạn sẽ làm việc chủ yếu ở đâu?',
  partQ: 'Bạn có làm thêm không? Làm ở đâu?',
  partNo: 'Chưa làm thêm',
  grpSay: 'Nhóm của bạn là <b>[Nhóm]</b>. Mỗi bài, Shin sẽ nói thêm điều nhóm bạn cần chú ý.',
  sexQ: 'Bảng mốc thể lực của lớp chia theo nam và nữ. Bạn xem mốc nào?',
  injQ: 'Bạn có chấn thương cũ, vừa mổ, hoặc đang điều trị bệnh không?',
  injYes: 'Cảm ơn bạn đã cho Shin biết. Báo thầy cô GDTC trước khi tập. Tập nhẹ, thấy đau là dừng.',
  injNo: 'Tốt quá! Vẫn nhớ: thấy đau là dừng nhé.',
  injNote: 'Shin không hỏi chi tiết bệnh. Câu trả lời chỉ lưu trên máy của bạn.',
  goalQ: 'Mục tiêu sức khỏe của bạn trước khi sang Nhật là gì?',
  goalSub: 'Viết một điều cụ thể, đo được.',
  goalTips: ['Chống đẩy được 20 cái liên tục', 'Plank được 1 phút', 'Ngủ trước 23 giờ mỗi ngày', 'Đủ sức làm ca 8 tiếng không mệt lả'],
  bodyQ: 'Thêm chiều cao, cân nặng (không bắt buộc)',
  bodyNote: 'Chỉ số BMI chỉ để tham khảo. Thầy cô GDTC sẽ đo lại trên lớp.',
  cardSay: 'Thẻ của <b class="nm">[Tên]</b> đây! Xong mỗi bài, Shin đục một lỗ trên thẻ.',
  cardGo: 'Đeo thẻ, vào tập',
  homeHi: [
    'Hôm nay tập gì nào, <b class="nm">[Tên]</b>? Chọn một bài 5 phút thôi cũng được.',
    'Làm đúng 5 cái tốt hơn làm sai 15 cái. Mình tập chậm mà chắc nhé.',
    'Tập đều mỗi ngày một chút. Sức khỏe là hành lý quan trọng nhất khi sang Nhật.',
    'Nhớ khởi động trước khi tập nha. Cơ thể ấm lên thì ít chấn thương.'
  ],
  injHome: 'Bạn có chấn thương cũ: tập nhẹ, thấy đau là dừng, hỏi thầy cô GDTC trước nhé.',
  khuSoon: 'Khu này đang xây. Shin mở sớm nhé!',
  baiDone: 'Xong bài <b>[Bài]</b>! Shin đục một lỗ trên thẻ hội viên cho bạn.',
  painStop: 'Dừng bài này hôm nay nhé. Đau kéo dài hoặc đau nhói thì báo thầy cô GDTC.',
  hardSay: 'Lần sau giảm số lần, giữ đúng tư thế trước đã. Tăng dần 1–2 cái mỗi 2 ngày.',
  okSay: 'Vừa sức là đúng nhịp rồi. Ghi lại để lần sau so với chính mình nhé.',
  easySay: 'Nhẹ nhàng à? Lần sau thử thêm 1–2 cái, hoặc thêm một hiệp.',
  pr: 'Kỷ lục mới của bạn!',
  reflQ: 'Lần tới tập bài này, bạn sẽ chú ý điều gì?',
  reflSub: 'Viết một câu cho chính bạn. Viết từ 10 chữ trở lên được thêm Insight.'
};

/* ---------- động tác ----------
   frames: các khoảnh khắc chính (p = tên tư thế trong art.js, t = lời hướng dẫn, g = đường gióng [x1,y1,x2,y2], a = mũi tên)
   keys: 3 điểm chính · s: tên ngắn cho nút chọn (không bắt buộc) · yt: link video riêng (để trống thì mở kênh video của thầy cô GDTC) */
var EX = {
  pushup: { n: 'Chống đẩy cơ bản', who: 'Nam · mốc giữa kỳ', yt: '',
    frames: [
      { p: 'pushUp', t: 'Hai tay chống ngay dưới vai, rộng hơn vai một chút. Thân thẳng từ đầu đến gót.', g: [42, 160, 186, 107] },
      { p: 'pushDown', t: 'Hít vào, hạ người đến khi ngực gần chạm sàn. Khuỷu tay chếch về sau.', a: [[150, 90], [150, 126]] },
      { p: 'pushUp', t: 'Thở ra, đẩy người lên. Thân vẫn thẳng một đường.', a: [[200, 150], [200, 112]] }
    ],
    keys: ['Siết bụng, siết mông', 'Mắt nhìn sàn, phía trước tay', 'Không võng hông, không chổng mông'] },
  kneepush: { n: 'Chống đẩy khuỵu gối', who: 'Nữ · người mới tập', yt: '',
    frames: [
      { p: 'kneeUp', t: 'Hai gối chạm sàn, tay chống ngay dưới vai. Thân thẳng từ đầu đến gối.', g: [92, 165, 190, 112] },
      { p: 'kneeDown', t: 'Hít vào, hạ ngực xuống gần sàn. Hông đi cùng thân.', a: [[150, 100], [150, 134]] },
      { p: 'kneeUp', t: 'Thở ra, đẩy lên. Làm chậm, đều nhịp.', a: [[204, 156], [204, 122]] }
    ],
    keys: ['Thân thẳng từ đầu đến gối', 'Lót khăn dưới gối cho êm', 'Làm đúng 5 cái tốt hơn làm sai 15 cái'] },
  plank: { n: 'Plank', who: 'Giữ thân bằng cẳng tay', yt: '',
    frames: [
      { p: 'plank', t: 'Khuỷu tay ngay dưới vai, cẳng tay đặt trên sàn.', a: [[174, 118], [174, 150]] },
      { p: 'plank', t: 'Siết bụng, siết mông. Thân thẳng từ đầu đến gót.', g: [40, 160, 192, 132] },
      { p: 'plank', t: 'Thở đều, không nín thở. Bấm giờ, giữ đến khi còn giữ đúng tư thế.' }
    ],
    keys: ['Khuỷu tay ngay dưới vai', 'Thân thẳng một đường', 'Thở đều, không nín thở'] },
  legraise: { n: 'Gập bụng nâng chân', who: 'Bụng dưới', yt: '',
    frames: [
      { p: 'legDown', t: 'Nằm ngửa, tay xuôi theo người. Lưng dưới áp sát sàn.' },
      { p: 'legUp', t: 'Thở ra, nâng hai chân thẳng lên đến khi vuông góc với sàn.', a: [[50, 140], [96, 92]] },
      { p: 'legDown', t: 'Hít vào, hạ chân thật chậm. Gót gần chạm sàn thì nâng lên tiếp.', a: [[86, 80], [44, 132]] }
    ],
    keys: ['Lưng dưới luôn áp sàn', 'Hạ chân chậm, không thả rơi', 'Chân thẳng, mũi chân duỗi'] },
  superman: { n: 'Superman (lưng)', who: 'Lưng dưới', yt: '',
    frames: [
      { p: 'supRest', t: 'Nằm sấp, hai tay duỗi thẳng qua đầu, hai chân duỗi thẳng.' },
      { p: 'supUp', t: 'Siết bụng, siết lưng dưới. Nâng tay, ngực và chân khỏi sàn. Giữ 1–2 giây.', a: [[200, 158], [200, 128]] },
      { p: 'supRest', t: 'Hạ xuống chậm. Mắt nhìn sàn, cổ thẳng theo lưng.' }
    ],
    keys: ['Nâng chậm, không giật', 'Cổ thẳng theo lưng', 'Giữ 1–2 giây rồi hạ'] },
  lift: { n: 'Nâng vật đúng cách', who: 'Lưng, chân, hông', yt: '',
    frames: [
      { p: 'liftLow', mk: 'boxLow', t: 'Đứng sát vật, hai chân rộng bằng vai. Hạ hông xuống, giữ lưng thẳng.', g: [96, 128, 127, 91] },
      { p: 'liftUp', mk: 'boxUp', t: 'Ôm vật sát bụng. Đứng lên bằng sức chân, không giật lưng.', a: [[96, 150], [96, 108]] },
      { p: 'liftUp', mk: 'boxUp', t: 'Muốn đổi hướng thì bước cả bàn chân theo. Không vặn lưng khi đang ôm vật.', arc: [[126, 156, 12]] }
    ],
    keys: ['Lưng thẳng, hạ hông bằng chân', 'Ôm vật sát người', 'Đổi hướng bằng bước chân, không vặn lưng'] },
  squat: { n: 'Squat', who: 'Chân, hông', yt: '',
    frames: [
      { p: 'standArms', t: 'Chân rộng bằng vai, mũi chân hơi mở ra. Tay đưa ra trước.' },
      { p: 'squatDown', t: 'Đẩy hông ra sau như ngồi xuống ghế. Hạ đến khi đùi gần song song sàn.', g: [76, 140, 148, 54] },
      { p: 'standArms', t: 'Dồn lực ở gót và đùi, đứng thẳng lên.', a: [[90, 130], [90, 92]] }
    ],
    keys: ['Lưng thẳng, ngực mở', 'Gối hướng theo mũi chân', 'Gót luôn chạm sàn'] },
  lunge: { n: 'Bước lunge', who: 'Chân, hông, thăng bằng', yt: '',
    frames: [
      { p: 'stand', t: 'Đứng thẳng, tay thả lỏng hoặc chống hông.' },
      { p: 'lungeDown', t: 'Bước một chân ra sau. Hạ người đến khi hai gối gập khoảng 90 độ.', g: [113, 50, 113, 160] },
      { p: 'stand', t: 'Đẩy bằng gót chân trước, về tư thế đứng. Đổi chân.' }
    ],
    keys: ['Thân thẳng, không đổ về trước', 'Gối trước không vượt xa mũi chân', 'Gối sau gần sàn, không đập xuống'] },
  jj: { n: 'Jumping jack', who: 'Tim mạch', yt: '',
    frames: [
      { p: 'jjClose', t: 'Đứng thẳng, hai chân khép, tay thả xuôi.' },
      { p: 'jjOpen', t: 'Bật nhảy, dang chân rộng hơn vai, hai tay đưa lên cao.' },
      { p: 'jjClose', t: 'Bật về khép chân, hạ tay. Lặp lại đều nhịp.' }
    ],
    keys: ['Tiếp đất nhẹ bằng nửa trước bàn chân', 'Gối hơi chùng khi tiếp đất', 'Thở đều, không nín thở'] },
  kneehigh: { n: 'Nâng cao đùi', who: 'Tim mạch · test đầu vào', yt: '',
    frames: [
      { p: 'kneeHigh', t: 'Chạy tại chỗ, nâng đùi lên ngang hông.', g: [100, 86, 176, 86] },
      { p: 'kneeHigh', t: 'Tay đánh theo nhịp, ngược với chân.' },
      { p: 'kneeHigh', t: 'Thân thẳng, không ngả ra sau. Nhanh dần.' }
    ],
    keys: ['Đùi lên ngang hông', 'Thân thẳng', 'Tay đánh theo nhịp'] },
  /* khởi động và giãn cơ: thẻ hình, không có mốc */
  warm: { n: 'Chuỗi khởi động 10 phút', who: 'Làm trước mọi buổi tập', yt: '',
    frames: [
      { p: 'armSide', t: 'Xoay cổ tay, khuỷu tay, khớp vai. Mỗi khớp 8 nhịp, xoay cả hai chiều.', arc: [[50, 42, 9], [190, 42, 9]] },
      { p: 'sideBend', t: 'Xoay cổ, vặn mình, nghiêng lườn. Mỗi bên 8 nhịp.' },
      { p: 'stand', t: 'Xoay gối, xoay cổ chân. Mỗi bên 8 nhịp.', arc: [[121, 132, 10], [126, 163, 7]] },
      { p: 'kneeHigh', t: 'Nâng cao đùi tại chỗ khoảng 30 giây.' },
      { p: 'jjOpen', t: 'Chạy tại chỗ hoặc bật nhảy, nhanh dần khoảng 1 phút.' }
    ],
    keys: ['Khởi động 10–15 phút trước khi tập', 'Khớp trước, tim mạch sau; nhẹ rồi mạnh dần', 'Người ấm lên, hơi ra mồ hôi là đủ'] },
  stretch: { n: 'Giãn cơ sau tập', who: 'Làm sau mọi buổi tập', yt: '',
    frames: [
      { p: 'armCross', t: 'Kéo dãn vai: kéo tay ngang ngực, giữ 15–30 giây. Đổi bên.' },
      { p: 'triceps', t: 'Kéo dãn tay sau: gập tay qua đầu, tay kia đẩy nhẹ khuỷu. Đổi bên.' },
      { p: 'sideBend', t: 'Nghiêng lườn: một tay lên cao, nghiêng người sang bên. Đổi bên.' }
    ],
    keys: ['Giữ 15–30 giây mỗi bên', 'Căng nhẹ là đủ, không đau', 'Thở đều, không nhún giật'] },
  /* Góc nghề đợt 2 (TC01.0.8): khởi động trước ca, giãn giữa ca (dùng cho dạng flow: c = lời ngắn khi tập theo Shin) */
  preshift: { n: 'Khởi động trước ca', who: 'Khoảng 3 phút · đứng tại chỗ, không cần dụng cụ', yt: '',
    frames: [
      { p: 'neckSide', c: 'Cổ: nghiêng, cúi, ngửa', t: 'Cổ: nghiêng đầu sang trái, sang phải, rồi cúi xuống, ngửa nhẹ. Mỗi hướng 4 nhịp.' },
      { p: 'handsShoulder', c: 'Vai: xoay khuỷu tay', t: 'Vai: đặt các ngón tay lên vai, xoay khuỷu tay ra trước 8 vòng, ra sau 8 vòng.', arc: [[78, 52, 9], [162, 52, 9]] },
      { p: 'standArms', c: 'Cổ tay: xoay, nắm – xòe', t: 'Cổ tay: duỗi tay ra trước, xoay cổ tay hai chiều. Rồi nắm chặt, xòe bàn tay 10 lần.', arc: [[184, 39, 9]] },
      { p: 'handsHip', c: 'Hông: xoay vòng', t: 'Hông: chống tay vào hông, xoay hông thành vòng tròn. Mỗi chiều 8 vòng.', arc: [[120, 100, 13]] },
      { p: 'stand', c: 'Gối, cổ chân: xoay nhẹ', t: 'Gối, cổ chân: hơi chùng gối, xoay gối nhẹ. Rồi nhấc từng chân, xoay cổ chân. Mỗi bên 8 nhịp.', arc: [[121, 132, 10], [126, 163, 7]] }
    ],
    keys: ['Đi từ trên xuống: cổ, vai, cổ tay, hông, gối – cổ chân', 'Xoay chậm, đều, không giật mạnh', 'Làm trước giờ vào ca và sau giờ nghỉ trưa'] },
  midstretch: { n: 'Giãn 2 phút giữa ca', who: 'Đứng tại chỗ · làm trong giờ nghỉ', yt: '',
    frames: [
      { p: 'neckSide', c: 'Cổ: nghiêng, giữ 10 giây', t: 'Cổ: nghiêng đầu sang một bên, giữ 10 giây. Đổi bên.' },
      { p: 'armCross', c: 'Vai: kéo tay ngang ngực', t: 'Vai: kéo một tay ngang ngực, giữ 10 giây. Đổi bên.' },
      { p: 'wristPull', c: 'Cổ tay: kéo ngón tay về', t: 'Cổ tay: duỗi tay ra trước, tay kia kéo nhẹ các ngón tay về phía mình. Giữ 10 giây, đổi tay.', a: [[192, 30], [178, 44]] },
      { p: 'handsBack', c: 'Lưng: chống tay, ưỡn nhẹ', t: 'Lưng: hai tay chống sau thắt lưng, ưỡn nhẹ người ra sau. Giữ 5 giây, làm 3 lần.' },
      { p: 'tiptoe', c: 'Bắp chân: kiễng gót', t: 'Bắp chân: kiễng gót lên rồi hạ xuống chậm, 15 lần. Đang ngồi thì nhấc mũi chân lên xuống.', a: [[96, 166], [96, 140]] }
    ],
    keys: ['Căng nhẹ là đủ, không đau', 'Thở đều, không nín thở', 'Đứng hay ngồi đều làm được'] },
  /* bài bổ trợ lớp Kiến thức nghề (không dụng cụ) */
  dip: { n: 'Hít đất ngược trên ghế', s: 'Hít đất ngược', who: 'Tay sau, vai · cần 1 ghế chắc', yt: '',
    frames: [
      { p: 'dipUp', mu: 'chair', t: 'Ngồi mép ghế, hai tay chống mép ghế sát hông. Trượt mông ra khỏi ghế, chân duỗi về trước.' },
      { p: 'dipDown', mu: 'chair', t: 'Hít vào, gập khuỷu tay, hạ người xuống đến khi khuỷu gần vuông góc.', a: [[126, 96], [126, 124]] },
      { p: 'dipUp', mu: 'chair', t: 'Thở ra, đẩy tay thẳng lên. Lưng đi sát mép ghế.', a: [[126, 124], [126, 96]] }
    ],
    keys: ['Ghế chắc, kê sát tường cho khỏi trượt', 'Khuỷu tay chĩa ra sau, không bè ra hai bên', 'Hạ vừa sức, thấy đau vai thì dừng'] },
  crunch: { n: 'Gập bụng trên', who: 'Bụng trên', yt: '',
    frames: [
      { p: 'crunchDown', t: 'Nằm ngửa, co gối, bàn chân đặt trên sàn. Hai tay chéo trước ngực.' },
      { p: 'crunchUp', t: 'Thở ra, siết bụng, nâng đầu và vai khỏi sàn. Lưng dưới vẫn áp sàn.', a: [[184, 160], [184, 134]] },
      { p: 'crunchDown', t: 'Hít vào, hạ xuống chậm. Vai vừa chạm sàn thì lên tiếp.' }
    ],
    keys: ['Siết bụng để nâng, không dùng tay kéo cổ', 'Lưng dưới luôn áp sàn', 'Lên xuống chậm, thở đều'] },
  sidelunge: { n: 'Bước ngang (side lunge)', s: 'Bước ngang', who: 'Chân, hông, đùi trong', yt: '',
    frames: [
      { p: 'wideStand', t: 'Đứng chân rộng khoảng gấp đôi vai, mũi chân hơi mở. Tay chắp trước ngực.' },
      { p: 'sideLunge', t: 'Dồn người sang một bên: gập gối bên đó, đẩy hông ra sau. Chân kia duỗi thẳng.', a: [[126, 102], [96, 102]] },
      { p: 'wideStand', t: 'Đạp gót đẩy người về giữa. Đổi bên. Mỗi bên tính 1 cái.' }
    ],
    keys: ['Gối gập hướng theo mũi chân', 'Lưng thẳng, ngực mở', 'Hai bàn chân luôn chạm sàn'] },
  hinge: { n: 'Gập hông lưng thẳng', s: 'Gập hông', who: 'Lưng, mông, sau đùi · nền của nâng vật đúng', yt: '',
    frames: [
      { p: 'hingeUp', t: 'Đứng chân rộng bằng vai, tay chéo trước ngực. Gối hơi chùng.' },
      { p: 'hingeDown', t: 'Đẩy hông ra sau, thân đổ về trước. Thấy căng sau đùi là đủ. Lưng luôn thẳng.', g: [92, 94, 154, 50] },
      { p: 'hingeUp', t: 'Siết mông, đẩy hông về trước để đứng thẳng lên.', a: [[84, 92], [104, 92]] }
    ],
    keys: ['Lưng thẳng từ đầu đến hông', 'Hông đẩy ra sau, không cúi gập lưng', 'Gối hơi chùng, không ngồi xuống'] }
};

/* ---------- mốc thể lực của lớp (Sổ quản lý học tập GDTC v10.1) ----------
   [Yếu, Trung bình, Tốt]; u: 'rep' đếm số lần · 's' giây giữ liên tục. Tham khảo, so với chính mình là chính. */
var MOC = {
  pushup:   { u: 'rep', nam: [20, 35, 40], src: 'Hít đất cơ bản · giữa kỳ' },
  kneepush: { u: 'rep', nu: [20, 30, 35], src: 'Hít đất khuỵu gối · giữa kỳ' },
  plank:    { u: 's', nam: [120, 150, 180], nu: [90, 120, 150], src: 'Plank · giữa kỳ' },
  legraise: { u: 'rep', nam: [30, 40, 50], nu: [20, 30, 40], src: 'Gập bụng nâng chân · cuối kỳ' },
  superman: { u: 'rep', nam: [30, 40, 50], nu: [20, 30, 40], src: 'Lưng bụng (superman) · cuối kỳ' },
  squat:    { u: 'rep', note: 'Trên lớp, squat tính theo set: 15 cái + giữ 10 giây = 1 set. Mốc giữa kỳ: nam 3 · 4 · 5 set, nữ 2 · 3 · 4 set.' },
  lunge:    { u: 'rep' },
  jj:       { u: 's', nam: [60, 90, 105], nu: [50, 60, 75], src: 'Jumping jack · giữa kỳ' },
  kneehigh: { u: 's', nam: [45, 60, 70], nu: [30, 45, 60], src: 'Nâng cao đùi · đầu vào' },
  /* bài bổ trợ lớp Kiến thức nghề: chưa có mốc lớp, ghi yêu cầu số lần */
  dip:       { u: 'rep', note: 'Lớp Kiến thức nghề: nam 20 cái × 2 hiệp, nữ 15 cái × 2 hiệp.' },
  crunch:    { u: 'rep', note: 'Lớp Kiến thức nghề: nam 20 cái × 2 hiệp, nữ 15 cái × 2 hiệp.' },
  sidelunge: { u: 'rep', note: 'Lớp Kiến thức nghề: nam 20 cái × 2 hiệp, nữ 15 cái × 2 hiệp (mỗi bên tính 1 cái).' },
  hinge:     { u: 'rep', note: 'Lớp Kiến thức nghề: nam 20 cái × 2 hiệp, nữ 15 cái × 2 hiệp.' }
};
var MOC_LAB = ['Yếu', 'Trung bình', 'Tốt'];

/* ---------- 6 bài của Sàn tập ----------
   Mỗi bài tối đa 3 hoạt động, 3–5 phút. Hoạt động: how (xem cách làm) · spot (tìm điểm chưa đúng) · try (tập thử cùng Shin)
   · order (xếp thứ tự) · pick (chọn cách làm đúng) · plan (lịch tập của mình). gtip: một câu riêng cho từng nhóm. */
var BAI = [
  { id: 'b1', t: 'Khởi động đúng cách', ic: 'warm', sub: 'Làm ấm khớp và tim trước khi tập', min: 10,
    acts: [
      { id: 'b1a', k: 'how', t: 'Xem chuỗi khởi động', min: 3, xp: 10, ex: ['warm'] },
      { id: 'b1b', k: 'order', t: 'Xếp chuỗi khởi động', min: 3, xp: 10,
        q: 'Xếp 5 việc khởi động theo thứ tự đúng.', sub: 'Chạm lần lượt từ việc làm trước đến việc làm sau.',
        items: ['Xoay cổ tay, khuỷu tay, vai', 'Xoay cổ, vặn mình', 'Xoay gối, cổ chân', 'Nâng cao đùi tại chỗ', 'Chạy tại chỗ, nhanh dần'],
        hint: 'Gợi ý: khớp trước, tim mạch sau. Khớp đi từ trên xuống dưới.',
        ok: 'Khớp ấm trước, tim tăng nhịp dần. Cơ thể sẵn sàng mà không bị sốc.' },
      { id: 'b1c', k: 'pick', t: 'Trễ giờ thì sao?', min: 2, xp: 10,
        q: 'Hôm nay bạn chỉ còn 15 phút để tập. Bạn làm gì?',
        opts: [
          { t: 'Bỏ khởi động, vào tập luôn cho kịp giờ', why: 'Cơ còn lạnh mà tập mạnh ngay thì dễ chấn thương.' },
          { t: 'Khởi động 5 phút, tập 10 phút nhẹ hơn mọi ngày', ok: 1, why: 'Đúng rồi! Tập ít mà an toàn vẫn hơn tập nhiều rồi chấn thương.' },
          { t: 'Tập thật nhanh, thật mạnh để bù lại thời gian đã mất', why: 'Vội và quá sức là lúc dễ sai tư thế, dễ đau nhất.' }
        ] }
    ],
    gtip: {
      xuong: 'Đứng máy cả ca dễ cứng vai, cổ tay. Khởi động khớp thật kỹ.',
      chuyen: 'Lặp một động tác cả ca. Khởi động kỹ cổ tay, vai gáy, cổ chân.',
      troi: 'Mùa đông ở Nhật rất lạnh. Cơ lạnh dễ chấn thương, nên khởi động lâu hơn.',
      dv: 'Đi lại, cúi, bưng bê cả ngày. Khởi động kỹ lưng, hông, gối.',
      vp: 'Ngồi lâu làm cơ cứng lại. Khởi động giúp vai gáy, hông linh hoạt hơn.' } },

  { id: 'b2', t: 'Ngực – Vai – Tay', ic: 'arm', sub: 'Chống đẩy cơ bản, chống đẩy khuỵu gối', min: 12,
    acts: [
      { id: 'b2a', k: 'how', t: 'Xem cách làm', min: 4, xp: 10, ex: ['pushup', 'kneepush'],
        more: 'Nâng cao: chống đẩy tay chạm gối (test cuối kỳ). Xem cách làm trong video của thầy cô GDTC.' },
      { id: 'b2b', k: 'spot', t: 'Tìm điểm chưa đúng', min: 3, xp: 10,
        rounds: [{ p: 'pushWrong', q: 'Bạn này chống đẩy chưa đúng ở 3 chỗ. Chạm vào từng chỗ.',
          hs: [
            { x: 132, y: 152, r: 20, t: 'Hông võng xuống', why: 'Lực dồn vào thắt lưng, dễ đau lưng.' },
            { x: 178, y: 132, r: 15, t: 'Cúi gằm đầu', why: 'Cổ bị gập, không thẳng theo lưng.' },
            { x: 197, y: 162, r: 15, t: 'Tay đặt quá xa phía trước', why: 'Tay phải ở ngay dưới vai thì mới đẩy khỏe.' }
          ] }] },
      { id: 'b2c', k: 'try', t: 'Tập thử cùng Shin', min: 4, xp: 15, ex: ['pushup', 'kneepush'] }
    ],
    gtip: {
      xuong: 'Nhấc chi tiết, chỉnh máy, cầm dụng cụ cả ca cần vai và tay khỏe.',
      chuyen: 'Tay làm liên tục cả ca. Vai, tay khỏe thì đỡ mỏi, làm đều tay hơn.',
      troi: 'Vác vật liệu, kéo ống, cầm cuốc xẻng cần tay, vai, ngực khỏe.',
      dv: 'Đỡ người, bưng khay, đẩy xe cần tay và vai khỏe.',
      vp: 'Ngồi lâu dễ gù vai. Tập ngực, vai giúp dáng thẳng hơn.' } },

  { id: 'b3', t: 'Bụng – Lưng', ic: 'core', sub: 'Plank, gập bụng nâng chân, superman', min: 12,
    acts: [
      { id: 'b3a', k: 'how', t: 'Xem cách làm', min: 4, xp: 10, ex: ['plank', 'legraise', 'superman'] },
      { id: 'b3b', k: 'spot', t: 'Tìm điểm chưa đúng', min: 3, xp: 10,
        rounds: [
          { p: 'plankSag', q: 'Plank này chưa đúng ở 2 chỗ. Chạm vào từng chỗ.',
            hs: [
              { x: 126, y: 156, r: 20, t: 'Hông võng xuống', why: 'Bụng không siết, lưng dưới chịu hết lực.' },
              { x: 186, y: 152, r: 15, t: 'Cúi đầu sát sàn', why: 'Mắt nhìn sàn nhưng cổ phải thẳng theo lưng.' }
            ] },
          { p: 'plankHigh', q: 'Còn plank này? Chạm vào chỗ chưa đúng.',
            hs: [{ x: 136, y: 98, r: 22, t: 'Mông chổng cao', why: 'Trông dễ hơn nhưng bụng gần như không phải làm việc.' }] },
          { p: 'legWrong', q: 'Gập bụng nâng chân: chạm vào chỗ chưa đúng.',
            hs: [{ x: 134, y: 150, r: 20, t: 'Lưng dưới cong lên khỏi sàn', why: 'Dễ đau lưng. Hạ chân ít thôi, giữ lưng áp sàn.' }] }
        ] },
      { id: 'b3c', k: 'try', t: 'Tập thử cùng Shin', min: 4, xp: 15, ex: ['plank', 'legraise', 'superman'] }
    ],
    gtip: {
      xuong: 'Bụng, lưng khỏe giữ thân vững khi đứng máy và cúi nhấc đồ.',
      chuyen: 'Đứng hoặc ngồi một chỗ lâu dễ mỏi lưng. Bụng, lưng khỏe giúp giữ dáng.',
      troi: 'Cúi, đào, vác nhiều giờ. Bụng và lưng khỏe giúp đỡ cho cột sống.',
      dv: 'Cúi lau, đỡ người, bưng bê cần bụng và lưng khỏe để đỡ đau lưng.',
      vp: 'Ngồi lâu dễ đau lưng dưới. Bụng, lưng khỏe giúp ngồi thẳng lâu hơn.' } },

  { id: 'b4', t: 'Chân – Hông', ic: 'leg', sub: 'Squat, bước lunge', min: 12,
    acts: [
      { id: 'b4a', k: 'how', t: 'Xem cách làm', min: 4, xp: 10, ex: ['squat', 'lunge'],
        more: 'Nâng cao: ôm bình nước trước ngực khi squat (test cuối kỳ dùng tạ 20 kg trên lớp).' },
      { id: 'b4b', k: 'spot', t: 'Tìm điểm chưa đúng', min: 3, xp: 10,
        rounds: [
          { p: 'squatWrong', q: 'Squat này chưa đúng ở 3 chỗ. Chạm vào từng chỗ.',
            hs: [
              { x: 118, y: 92, r: 22, t: 'Lưng gù', why: 'Lưng phải thẳng, ngực mở thì cột sống mới an toàn.' },
              { x: 116, y: 160, r: 14, t: 'Nhón gót', why: 'Gót phải chạm sàn để đứng vững.' },
              { x: 150, y: 136, r: 15, t: 'Gối đẩy quá xa ra trước', why: 'Đẩy hông ra sau trước, gối sẽ đỡ bị ép.' }
            ] },
          { p: 'lungeWrong', q: 'Bước lunge này: chạm vào 2 chỗ chưa đúng.',
            hs: [
              { x: 156, y: 108, r: 20, t: 'Thân đổ về trước', why: 'Giữ thân thẳng thì lực dồn đều hai chân.' },
              { x: 176, y: 132, r: 15, t: 'Gối trước vượt xa mũi chân', why: 'Gối chịu lực quá nhiều, dễ đau gối.' }
            ] }
        ] },
      { id: 'b4c', k: 'try', t: 'Tập thử cùng Shin', min: 4, xp: 15, ex: ['squat', 'lunge'] }
    ],
    gtip: {
      xuong: 'Đứng máy 8 tiếng mỗi ngày. Chân khỏe thì cuối ca vẫn còn sức.',
      chuyen: 'Đứng một chỗ cả ca dễ mỏi, đau chân. Chân, hông khỏe giúp đứng vững lâu hơn.',
      troi: 'Ngồi xổm, đứng lên, leo giàn, vác đồ đi lại. Chân, hông là gốc sức của bạn.',
      dv: 'Đi lại cả ngày, ngồi xuống đỡ người. Squat đúng cũng là cách nâng đồ đúng.',
      vp: 'Ngồi nhiều thì chân, hông ít vận động. Vài phút squat giữa giờ rất có ích.' } },

  { id: 'b5', t: 'Tim mạch', ic: 'heart', sub: 'Jumping jack, nâng cao đùi', min: 10,
    acts: [
      { id: 'b5a', k: 'how', t: 'Xem cách làm', min: 3, xp: 10, ex: ['jj', 'kneehigh'] },
      { id: 'b5b', k: 'spot', t: 'Tìm điểm chưa đúng', min: 2, xp: 10,
        rounds: [{ p: 'kneeLow', q: 'Nâng cao đùi chưa đúng ở 2 chỗ. Chạm vào từng chỗ.',
          hs: [
            { x: 150, y: 104, r: 18, t: 'Đùi thấp, chưa ngang hông', why: 'Đùi lên ngang hông thì tim mới làm việc đủ.' },
            { x: 108, y: 54, r: 20, t: 'Ngả người ra sau', why: 'Thân thẳng giúp giữ thăng bằng, đỡ mỏi lưng.' }
          ] }] },
      { id: 'b5c', k: 'try', t: 'Tập thử cùng Shin', min: 4, xp: 15, ex: ['jj', 'kneehigh'] }
    ],
    gtip: {
      xuong: 'Tim phổi khỏe giúp bạn bền sức qua ca dài, cả khi tăng ca.',
      chuyen: 'Làm theo nhịp máy cả ca cần sức bền. Tập tim mạch giúp bạn bền sức.',
      troi: 'Làm ngoài trời, vận động nhiều cả ngày. Sức bền tốt giúp bạn trụ đến cuối ca.',
      dv: 'Đi lại, chạy việc cả ngày cần sức bền. Tập đều giúp đỡ hụt hơi.',
      vp: 'Ít vận động cả ngày. 10 phút tim mạch giúp cơ thể tỉnh táo hơn.' } },

  { id: 'b6', t: 'Giãn cơ và lịch tập', ic: 'stretch', sub: 'Thả lỏng sau tập, lên lịch tập ở nhà', min: 10,
    acts: [
      { id: 'b6a', k: 'how', t: 'Xem cách giãn cơ', min: 3, xp: 10, ex: ['stretch'] },
      { id: 'b6b', k: 'pick', t: 'Giãn cơ thế nào?', min: 2, xp: 10,
        q: 'Sau buổi tập, bạn giãn cơ thế nào là đúng?',
        opts: [
          { t: 'Kéo thật mạnh, nhún liên tục để cơ mau giãn ra hơn', why: 'Nhún giật dễ làm cơ bị căng quá, đau thêm.' },
          { t: 'Bỏ qua, vì tập xong là đã xong buổi', why: 'Không giãn cơ thì hôm sau cơ dễ đau, cứng hơn.' },
          { t: 'Giữ mỗi động tác 15–30 giây, căng nhẹ, thở đều', ok: 1, why: 'Đúng rồi! Căng nhẹ, giữ đủ lâu là cơ thả lỏng tốt nhất.' }
        ] },
      { id: 'b6c', k: 'plan', t: 'Lịch tập của mình', min: 4, xp: 15 }
    ],
    gtip: {
      xuong: 'Sau ca đứng máy, giãn chân, lưng giúp cơ thả lỏng.',
      chuyen: 'Lặp một động tác cả ca: giãn cổ tay, vai gáy cuối ca và sau khi tập.',
      troi: 'Sau ngày làm nặng, giãn cơ giúp cơ thể hồi lại cho ngày mai.',
      dv: 'Đi lại, cúi cả ngày: giãn lưng, chân trước khi ngủ.',
      vp: 'Ngồi lâu: cứ 1 giờ đứng dậy giãn vai, cổ 1–2 phút.' } }
];

/* ---------- lịch tập ở nhà (Sổ quản lý học tập GDTC · hướng dẫn tập tại nhà) ---------- */
var PLANS = {
  A: { n: 'Kế hoạch A · Mới bắt đầu', who: 'Chưa chống đẩy cơ bản được', d: '4 buổi/tuần · 40 phút/buổi (10 phút khởi động, 30 phút bài chính)', days: 4,
    body: ['Chống đẩy (nữ khuỵu gối): tối thiểu 5 cái', 'Nghỉ 15–60 giây · Plank tối thiểu 30 giây', 'Nghỉ 15–60 giây · Squat tối thiểu 20 cái', 'Nghỉ 1–3 phút, uống ngụm nước · lặp vòng 2'] },
  B: { n: 'Kế hoạch B · Thể chất tốt', who: 'Chống đẩy cơ bản trên 15 cái', d: '3 buổi/tuần · 60 phút/buổi (10–15 phút khởi động, 45 phút bài chính)', days: 3,
    body: ['Chống đẩy cơ bản 8–20 cái · nghỉ 30 giây · khuỵu gối 18–40 cái', 'Plank 60–90 giây', 'Squat 30–60 cái', 'Nghỉ 2–3 phút, bổ sung nước · lặp đến khi hết sức'] }
};
var PLAN_TIP = 'Cứ 2 ngày, tăng thêm 1–2 cái. Ghi vào sổ để so với chính mình.';
var DAYS7 = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
var SLOTS = ['Sáng sớm', 'Trưa, chiều', 'Tối'];
var PLAN_Q = 'Viết lời hẹn với chính mình: “Khi …, mình sẽ …”';
var PLAN_TIPS = ['Khi về đến phòng, mình sẽ thay đồ và khởi động ngay', 'Khi chuông báo thức reo, mình sẽ tập 10 phút trước khi rửa mặt'];

/* =========================================================
   BẾP DINH DƯỠNG (khu 'bep') · đợt 1: d1, d2, d4 (TC01.0.3) · đợt 2: d3, d5, d6 (TC01.0.4)
   Nguồn: Sổ quản lý học tập GDTC v10.1 (BMI ngưỡng 23, BMR, TDEE 5 nhóm, bảng calo /100 g, 2–2,5 L nước/ngày),
   Sổ tay sức khỏe 2.0 (giờ ăn, nhóm chất, nước, tình huống bỏ bữa, cà phê lúc đói, mệt khi làm ca).
   Rào chắn: không thực đơn giảm cân, không mục tiêu calo; số liệu chỉ để tham khảo, so với chính mình.
   ========================================================= */
var PLATE_Z = [
  { k: 'tb',  n: 'Tinh bột',      d: 'Cho năng lượng' },
  { k: 'dam', n: 'Đạm',           d: 'Nuôi cơ, giúp phục hồi' },
  { k: 'rau', n: 'Rau',           d: 'Vitamin, chất xơ' },
  { k: 'qs',  n: 'Trái cây, sữa', d: 'Vitamin, khoáng chất' }
];
/* món ăn trong ngày (bài Bữa hôm qua): g = nhóm có trong món · w = món nên ăn ít */
var MEAL_FOODS = [
  { t: 'Cơm', g: ['tb'] }, { t: 'Bánh mì không', g: ['tb'] }, { t: 'Xôi', g: ['tb'] }, { t: 'Cháo trắng', g: ['tb'] },
  { t: 'Phở, bún có thịt', g: ['tb', 'dam'] }, { t: 'Bánh mì kẹp thịt, trứng', g: ['tb', 'dam'] }, { t: 'Mì gói', g: ['tb'], w: 1 },
  { t: 'Thịt', g: ['dam'] }, { t: 'Cá', g: ['dam'] }, { t: 'Trứng', g: ['dam'] }, { t: 'Đậu phụ', g: ['dam'] },
  { t: 'Rau luộc, rau xào', g: ['rau'] }, { t: 'Canh rau', g: ['rau'] },
  { t: 'Trái cây', g: ['qs'] }, { t: 'Sữa, sữa chua', g: ['qs'] },
  { t: 'Nước ngọt, trà sữa', g: [], w: 1 }, { t: 'Bánh ngọt, snack', g: [], w: 1 }
];
var MEALS = [['sang', 'Sáng'], ['trua', 'Trưa'], ['toi', 'Tối']];
var MEAL_TXT = {
  q: 'Hôm qua bạn đã ăn gì?', sub: 'Chạm từng bữa, chọn các món đã ăn. Không ăn bữa nào thì chọn “Mình bỏ bữa này”.',
  skip: 'Mình bỏ bữa này', see: 'Xem bữa của mình', none: 'Shin không chấm điểm. Biết bữa nào thiếu gì là bước đầu.',
  good: 'Bữa [Bữa] đủ tinh bột, đạm, rau.', miss: 'Bữa [Bữa] thiếu [Nhóm].', skipped: 'Bữa [Bữa]: bạn bỏ bữa.',
  noQs: 'Cả ngày chưa có trái cây hoặc sữa.', warn: 'Có [Món]: nhiều năng lượng nhưng ít chất. Thỉnh thoảng thôi nhé.',
  allGood: 'Một ngày ăn đủ nhóm. Giữ nhịp này nhé!'
};
var COMMIT_DAYS = 21;
var HABITS = [
  { t: 'Ăn sáng trước khi đến lớp', tip: 'Khi chuông báo thức reo, mình sẽ dậy sớm 10 phút để ăn sáng' },
  { t: 'Bữa chính nào cũng có rau', tip: 'Khi mua cơm phần, mình sẽ chọn thêm một món rau' },
  { t: 'Thay nước ngọt bằng nước lọc', tip: 'Khi thấy khát, mình sẽ uống nước lọc trong bình trước' },
  { t: 'Mang bình nước theo mỗi ngày', tip: 'Khi soạn cặp buổi tối, mình sẽ đổ đầy bình nước' },
  { t: 'Ăn nhẹ trước ca làm thêm', tip: 'Khi tan học, mình sẽ ăn một cơm nắm hoặc quả chuối trước khi đi làm' },
  { t: 'Ăn tối trước giờ ngủ ít nhất 3 tiếng', tip: 'Khi có ca làm thêm buổi tối, mình sẽ ăn tối trước ca' }
];
/* máy tính: hệ số vận động (Sổ quản lý v10.1) */
var ACT_LV = [
  { n: 'Ít hoặc không vận động', f: 1.2 },
  { n: 'Vận động 1–3 lần/tuần', f: 1.375 },
  { n: 'Vận động 3–5 lần/tuần', f: 1.55 },
  { n: 'Vận động 6–7 lần/tuần', f: 1.725 },
  { n: 'Vận động nặng hơn 7 lần/tuần', f: 1.9 }
];
var BEP_TXT = {
  khuSay: 'Ở Bếp, Shin không bắt bạn ăn kiêng. Ăn đủ từ hôm nay là giữ sức cho 3–5 năm ở Nhật và cả nghề sau này.',
  plateDone: 'Đĩa đủ 4 nhóm rồi! Bữa chính nào cũng nhìn đĩa: có đủ tinh bột, đạm, rau chưa? Trái cây, sữa thì trong ngày.',
  plateWrong: 'Thử lại nhé. ',
  plateHint: 'Món này thuộc nhóm khác. Nghĩ xem nó cho cơ thể điều gì.',
  calcQ: 'Nhập số của bạn', calcSub: 'Shin lấy sẵn số ở thẻ hội viên. Sửa nếu đã thay đổi.',
  calcLv: 'Một tuần của bạn giống mức nào nhất?',
  calcNote: 'Các con số chỉ để bạn hiểu cơ thể mình, không phải để ăn kiêng. Muốn tăng hoặc giảm cân, hỏi thầy cô GDTC hoặc nhân viên y tế.',
  bmiNote: 'BMI không phân biệt cơ và mỡ. Người tập nhiều có thể có BMI cao hơn.',
  bmiSay: ['Hơi nhẹ cân so với chiều cao. Ăn đủ 3 bữa, thêm đạm; hỏi thầy cô GDTC cách tăng cân an toàn.',
    'Trong khoảng bình thường. Giữ nhịp ăn đủ, tập đều nhé.',
    'Cao hơn khoảng bình thường một chút. Đừng nhịn ăn: hỏi thầy cô GDTC cách điều chỉnh an toàn.',
    'Cao hơn khoảng bình thường. Đừng nhịn ăn: hỏi thầy cô GDTC hoặc nhân viên y tế cách điều chỉnh an toàn.'],
  waterNote: 'Ngày nóng, ca nặng, giờ tập: uống thêm. Uống từng ngụm, chia đều trong ngày.',
  hiloQ: 'Cùng 100 g, món nào nhiều năng lượng hơn?', hiloSrc: 'Số liệu: bảng calo cơ bản, Sổ quản lý học tập GDTC (trên 100 g, tham khảo).',
  hiloEnd: 'Món chiên, món ngọt đậm năng lượng hơn nhiều. Không cấm, chỉ cần biết để chọn cho hợp.',
  dayIntro: 'Đây là một ngày của một bạn học viên (nhân vật minh họa). Có 4 việc ăn uống chưa ổn. Chạm vào từng việc.',
  dayOk: 'Việc này ổn: ', dayHint: 'Gợi ý: các việc chưa ổn đang nhấp nháy nhẹ.',
  commitSay: 'Biết rồi thì phải làm được. Chọn một thói quen thôi, làm đủ 21 ngày.',
  commitQ: 'Bạn chọn thói quen nào?', commitOwn: 'Thói quen khác của mình',
  commitW: 'Viết lời hẹn với chính mình: “Khi …, mình sẽ …”', commitSub: 'Viết từ 10 chữ trở lên được thêm Insight.',
  commitCard: 'Cam kết 21 ngày', commitBtn: 'Hôm nay mình đã làm được', commitToday: 'Hôm nay đã đánh dấu. Mai gặp lại nhé!',
  commitEnd: 'Đủ 21 ngày rồi! Thói quen này đang thành của bạn.'
};

/* ---------- Bếp đợt 2 (TC01.0.4): d3, d5, d6 ---------- */
var BEP2_TXT = {
  matchSel: 'Đã chọn [Món]. Giờ chạm món Nhật hợp với nó.', matchNo: 'Thử lại nhé. Hai món này chưa giống nhau. Nghĩ xem món Việt được làm thế nào.',
  matchEnd: 'Ở Nhật vẫn có món quen. Biết tên món bằng tiếng Nhật là tự chọn được bữa đủ chất.',
  bkTotal: 'Trong giỏ', bkLeft: 'Còn', bkOver: 'Vượt [N] yên. Bỏ bớt một món nhé.', bkNeed: 'Giỏ còn thiếu: [Nhóm].',
  bkDone: 'Đủ tinh bột, đạm, rau, còn dư [N] yên.', bkMoney: 'Mỗi ngày làm việc một bữa như vậy: [T] yên × [D] ngày = [M] yên một tháng (giá minh họa). Tự nấu ở ký túc xá thường đỡ tốn hơn, giữ tiền cho mục tiêu của bạn.',
  lbHead: 'Nhãn thành phần dinh dưỡng', lbNo: 'Thử lại nhé. Dòng bạn chạm là: ', lbEnd: 'Đọc được 3 dòng này là chọn món ở Nhật tự tin hơn: năng lượng, đạm, muối.',
  lbSrc: 'Nhãn và số liệu minh họa. Thứ tự các dòng theo cách ghi nhãn phổ biến ở Nhật.',
  shQ: 'Ca làm hoặc lịch học của bạn', shSub: 'Chọn một mẫu gần nhất, rồi chỉnh giờ bắt đầu, số giờ cho đúng.',
  shSay: 'Ăn cùng giờ mỗi ngày giúp cơ thể quen nhịp. Lịch này để tham khảo, sửa cho hợp ca thật của bạn.',
  shBefore: 'Trước ca: bữa chính', shBeforeD: 'Ăn trước giờ vào ca 1–2 tiếng, đủ tinh bột, đạm, rau.',
  shMidMain: 'Giữa ca: bữa chính', shMidLight: 'Giữa ca: bữa nhẹ', shMidD: 'Ăn vào giờ nghỉ. Mang sẵn hộp cơm hoặc cơm nắm, trái cây.',
  shAfterMain: 'Sau ca: bữa chính', shAfterLight: 'Sau ca: bữa nhẹ, dễ tiêu', shAfterD: 'Về muộn hoặc sắp đi ngủ thì ăn nhẹ: cháo, cơm ít với rau, trứng.', shAfterDM: 'Ăn đủ bữa, rồi nghỉ ngơi.',
  shWater: 'Mỗi giờ nghỉ: vài ngụm nước', shShort: 'Ca ngắn: ăn trước ca là đủ, mang theo nước.',
  btSel: 'Hộp cơm của bạn', btEnd: 'Hộp cơm đủ nhóm rồi! Ba điều để mang đi an toàn:',
  dtIntro: 'Hai loại hạn trên bao bì ở Nhật', dtToday: 'Hôm nay là', dtFmt: 'Ngày ghi theo năm.tháng.ngày: 26.11.15 là 15/11/2026.',
  dtYes: 'Ăn được', dtNo: 'Không ăn',
  dtHint: { shohi: 'Gợi ý: 消費期限 là hạn an toàn. So với ngày hôm nay.', shomi: 'Gợi ý: 賞味期限 là hạn ngon nhất, không phải hạn an toàn.', note: 'Gợi ý: đọc kỹ dòng về cách cất giữ.' },
  dtEnd: 'Hạn chỉ đúng khi chưa mở và cất đúng cách. Không chắc thì đừng ăn.'
};
var DATE_LAB = {
  shohi: { j: '消費期限', k: 'しょうひきげん', n: 'Hạn an toàn', d: 'Đồ nhanh hỏng: cơm hộp, bánh mì kẹp, thịt cá tươi. Qua ngày là không ăn.' },
  shomi: { j: '賞味期限', k: 'しょうみきげん', n: 'Hạn ngon nhất', d: 'Đồ để lâu: mì ly, snack, đồ hộp. Qua ngày một chút, chưa mở, vẫn ăn được.' }
};
/* giờ ăn theo ca: s giờ bắt đầu (0–23), l số giờ */
var SHIFTS = [
  { n: 'Ngày học ở trường', s: 8, l: 9 },
  { n: 'Ca ngày', s: 8, l: 9 },
  { n: 'Ca sớm', s: 6, l: 9 },
  { n: 'Ca chiều', s: 14, l: 9 },
  { n: 'Ca đêm', s: 22, l: 9 },
  { n: 'Làm thêm buổi tối', s: 18, l: 4 }
];

var BAI_BEP = [
  { id: 'd1', t: 'Đĩa cơm của mình', ic: 'bowl', sub: 'Ăn vậy đủ chưa? Bốn nhóm trong một ngày', min: 10,
    acts: [
      { id: 'd1a', k: 'plate', t: 'Xếp đĩa đủ nhóm', min: 3, xp: 10,
        q: 'Xếp 12 món vào đúng nhóm.', sub: 'Chạm một món, rồi chạm nhóm của món đó trên đĩa.',
        items: [
          { t: 'Cơm trắng', z: 'tb' }, { t: 'Bánh mì', z: 'tb' }, { t: 'Khoai lang', z: 'tb', h: 'Khoai lang nhiều tinh bột, ăn thay cơm được.' },
          { t: 'Trứng', z: 'dam' }, { t: 'Cá thu', z: 'dam' }, { t: 'Đậu phụ', z: 'dam', h: 'Đậu phụ làm từ đậu nành: đạm từ thực vật.' },
          { t: 'Rau muống', z: 'rau' }, { t: 'Cải bắp', z: 'rau' }, { t: 'Cà rốt', z: 'rau', h: 'Cà rốt là củ dùng làm rau, nhiều vitamin.' },
          { t: 'Chuối', z: 'qs' }, { t: 'Cam', z: 'qs' }, { t: 'Sữa chua', z: 'qs', h: 'Sữa chua thuộc nhóm sữa.' }
        ] },
      { id: 'd1b', k: 'meal', t: 'Bữa hôm qua của bạn', min: 4, xp: 10 },
      { id: 'd1c', k: 'write', t: 'Bữa mai mình thêm…', min: 3, xp: 15,
        say: 'Chỉ cần thêm một món là bữa ăn đã khác. Viết ra để mai nhớ làm nhé.',
        q: 'Bữa mai, bạn sẽ thêm hoặc đổi món gì?', sub: 'Viết cụ thể: bữa nào, món gì. Từ 10 chữ trở lên được thêm Insight.',
        tips: ['Bữa sáng mai mình sẽ ăn thêm một quả trứng', 'Bữa trưa mai mình sẽ chọn thêm một đĩa rau luộc', 'Mai mình sẽ ăn một quả chuối thay cho ly trà sữa'] }
    ],
    gtip: {
      xuong: 'Đứng máy cả ca tốn sức. Bữa trưa đủ tinh bột, đạm thì chiều không bị đuối.',
      chuyen: 'Làm theo ca, giờ ăn hay bị lệch. Mang theo bữa đủ nhóm thì không phải ăn vội.',
      troi: 'Làm ngoài trời tốn rất nhiều sức. Bữa chính cần đủ cơm, đạm, rau.',
      dv: 'Đi lại, đỡ người cả ngày. Ăn đủ bữa để không bị choáng giữa ca.',
      vp: 'Ngồi nhiều, ít vận động. Thêm rau, bớt đồ chiên và nước ngọt.' } },

  { id: 'd2', t: 'Năng lượng của mình', ic: 'drop', sub: 'BMI, năng lượng cần mỗi ngày, lượng nước', min: 10,
    acts: [
      { id: 'd2a', k: 'calc', t: 'Máy tính của mình', min: 4, xp: 10 },
      { id: 'd2b', k: 'hilo', t: 'Món nào đậm năng lượng hơn?', min: 3, xp: 10,
        pairs: [
          { a: ['Mì gói (vắt khô)', 435], b: ['Bún', 110], why: 'Mì gói đã chiên qua dầu nên đậm năng lượng, lại ít đạm, ít rau.' },
          { a: ['Khoai tây chiên', 525], b: ['Khoai tây luộc', 92], why: 'Cùng là khoai tây, chiên dầu thì năng lượng gấp hơn 5 lần.' },
          { a: ['Đậu phộng', 573], b: ['Đậu phụ', 95], why: 'Đậu phộng nhiều chất béo, rất đậm năng lượng: một nắm nhỏ là đủ.' },
          { a: ['Sữa đặc có đường', 336], b: ['Sữa tươi', 74], why: 'Sữa đặc phần lớn là đường. Cà phê sữa đặc mỗi ngày là nạp khá nhiều đường.' },
          { a: ['Bánh sô-cô-la', 449], b: ['Bánh mì', 249], why: 'Bánh ngọt thêm đường và bơ nên đậm năng lượng hơn bánh mì.' }
        ] },
      { id: 'd2c', k: 'pick', t: 'Ca làm của mình cần gì?', min: 2, xp: 10,
        byGroup: {
          xuong: { q: 'Xưởng nóng, bạn đổ nhiều mồ hôi. Uống nước thế nào là đúng?',
            opts: [
              { t: 'Uống từng ngụm, đều đặn mỗi giờ, cả khi chưa khát', ok: 1, why: 'Đúng rồi! Chờ khát mới uống là cơ thể đã thiếu nước rồi.' },
              { t: 'Chờ đến giờ nghỉ trưa, uống một lần thật nhiều cho đã khát', why: 'Uống dồn một lúc khó hấp thu, cả buổi sáng vẫn thiếu nước.' },
              { t: 'Uống nước ngọt có ga thật lạnh cho mát và đỡ mệt', why: 'Nước ngọt nhiều đường, không bù nước tốt bằng nước lọc.' }
            ] },
          chuyen: { q: 'Bạn làm ca đêm ở dây chuyền, từ 22 giờ đến 7 giờ sáng. Ăn thế nào?',
            opts: [
              { t: 'Ăn bữa chính trước ca, giữa ca ăn nhẹ, về nhà không ăn quá no', ok: 1, why: 'Đúng rồi! Có năng lượng suốt ca, về nhà vẫn ngủ được.' },
              { t: 'Nhịn cả ca cho tỉnh, về phòng ăn một bữa thật no rồi ngủ luôn', why: 'Nhịn lâu dễ choáng giữa ca; ăn no rồi ngủ ngay dễ khó tiêu.' },
              { t: 'Uống cà phê, nước tăng lực suốt ca để thay cho bữa ăn', why: 'Chất kích thích không thay được bữa ăn, còn làm khó ngủ hơn.' }
            ] },
          troi: { q: 'Mùa hè ở Nhật có ngày trên 35 độ. Làm ngoài trời cả ngày, bạn chuẩn bị gì?',
            opts: [
              { t: 'Nhiều nước, thêm đồ bù muối khoáng, nghỉ uống theo giờ', ok: 1, why: 'Đúng rồi! Mồ hôi mất cả nước lẫn muối, nên bù cả hai.' },
              { t: 'Chỉ mang một chai nước nhỏ cho đỡ phải đi vệ sinh nhiều', why: 'Thiếu nước khi trời nóng rất dễ say nắng, choáng.' },
              { t: 'Mang nước ngọt có ga thật lạnh, khát thì uống một hơi cho đã', why: 'Nước ngọt nhiều đường; uống một hơi lớn cũng khó hấp thu.' }
            ] },
          dv: { q: 'Ca nhà hàng bận, giờ ăn trưa bị lùi đến 15 giờ. Bạn làm gì?',
            opts: [
              { t: 'Ăn nhẹ trước ca (cơm nắm, chuối), đến giờ nghỉ thì ăn bữa đủ', ok: 1, why: 'Đúng rồi! Có bữa nhẹ lót dạ thì không bị đói cồn cào, choáng.' },
              { t: 'Nhịn luôn bữa trưa cho kịp việc, tối về nhà ăn bù gấp đôi cho đủ', why: 'Nhịn lâu dễ choáng khi bưng bê; ăn bù không bù được lúc thiếu sức.' },
              { t: 'Ăn vặt bánh kẹo, uống nước ngọt suốt ca cho đỡ đói', why: 'Đồ ngọt cho no nhanh rồi đói nhanh, lại thiếu đạm và rau.' }
            ] },
          vp: { q: 'Bạn ngồi học, ngồi làm việc gần cả ngày. Bữa trưa nên thế nào?',
            opts: [
              { t: 'Đủ bốn nhóm, nhiều rau, bớt đồ chiên, uống nước lọc', ok: 1, why: 'Đúng rồi! Ít vận động thì càng cần bữa ăn đủ chất, ít dầu mỡ.' },
              { t: 'Bỏ bữa trưa vì ngồi một chỗ thì không tốn sức gì', why: 'Não cũng cần năng lượng. Bỏ bữa dễ mệt, khó tập trung.' },
              { t: 'Ăn mì gói, uống trà sữa cho nhanh để tiết kiệm thời gian', why: 'Nhanh nhưng ít chất, nhiều đường và dầu mỡ.' }
            ] }
        } }
    ],
    gtip: {
      xuong: 'Xưởng nóng, đổ nhiều mồ hôi: uống nước đều suốt ca.',
      chuyen: 'Có nơi lạnh, ẩm, có ca đêm. Cơ thể vẫn cần đủ nước và năng lượng.',
      troi: 'Ngoài trời mùa hè rất nóng. Bạn cần nhiều nước hơn, có cả muối khoáng.',
      dv: 'Đi lại cả ngày tốn sức hơn bạn nghĩ. Luôn mang nước theo.',
      vp: 'Ngồi nhiều thì cần ít năng lượng hơn. Ăn đủ chất, bớt ăn vặt.' } },

  { id: 'd3', t: 'Món Việt, món Nhật', ic: 'swap', sub: 'Món quen ở Nhật, giỏ konbini, đọc nhãn', min: 11,
    acts: [
      { id: 'd3a', k: 'match', t: 'Món nào giống món nào?', min: 3, xp: 10,
        q: 'Ghép món Việt với món Nhật gần giống.', sub: 'Chạm một món Việt, rồi chạm món Nhật hợp với nó.',
        pairs: [
          { v: 'Cơm nắm', j: 'おにぎり', r: 'onigiri', why: 'Có ở mọi konbini. Thêm trứng, rau là thành bữa nhẹ đủ chất.' },
          { v: 'Cháo trắng', j: 'お粥', k: 'おかゆ', r: 'okayu', why: 'Người Nhật hay ăn khi mệt, khi ốm. Dễ tiêu.' },
          { v: 'Canh rau', j: '味噌汁', k: 'みそしる', r: 'misoshiru', why: 'Canh tương miso với rong biển, đậu phụ, rau. Khá mặn: mỗi bữa một bát là vừa.' },
          { v: 'Chả giò', j: '春巻き', k: 'はるまき', r: 'harumaki', why: 'Cũng chiên dầu như chả giò. Ăn kèm rau cho cân bằng.' },
          { v: 'Gà chiên', j: '唐揚げ', k: 'からあげ', r: 'karaage', why: 'Món chiên rất hay gặp trong cơm hộp. Ngon nhưng nhiều dầu.' },
          { v: 'Thịt kho', j: '豚の角煮', k: 'ぶたのかくに', r: 'buta no kakuni', why: 'Thịt ba chỉ kho ngọt, khá giống thịt kho. Nhiều mỡ: ăn vừa phải.' }
        ] },
      { id: 'd3b', k: 'basket', t: 'Giỏ konbini 600 yên', min: 4, xp: 10, budget: 600, days: 22,
        q: 'Chọn bữa trưa ở konbini: đủ tinh bột, đạm, rau, không quá 600 yên.', sub: 'Chạm để bỏ vào giỏ, chạm lần nữa để bỏ ra. Giá minh họa.',
        items: [
          { j: 'おにぎり', v: 'Cơm nắm cá hồi', p: 150, g: ['tb'] },
          { j: '菓子パン', k: 'かしパン', v: 'Bánh mì ngọt', p: 160, g: ['tb'], w: 'Bánh mì ngọt nhiều đường, bơ: no nhanh, đói nhanh.' },
          { j: 'カップラーメン', v: 'Mì ly', p: 220, g: ['tb'], w: 'Mì ly nhiều dầu, muối, ít đạm và rau.' },
          { j: 'ゆで卵', k: 'ゆでたまご', v: 'Trứng luộc', p: 90, g: ['dam'] },
          { j: 'サラダチキン', v: 'Ức gà luộc', p: 250, g: ['dam'] },
          { j: '唐揚げ', k: 'からあげ', v: 'Gà chiên', p: 250, g: ['dam'], w: 'Gà chiên ngon nhưng nhiều dầu.' },
          { j: 'サラダ', v: 'Rau trộn', p: 250, g: ['rau'] },
          { j: 'ほうれん草のおひたし', k: 'ほうれんそうのおひたし', v: 'Rau bina luộc', p: 180, g: ['rau'] },
          { j: 'バナナ', v: 'Chuối', p: 120, g: ['qs'] },
          { j: '牛乳', k: 'ぎゅうにゅう', v: 'Sữa tươi', p: 130, g: ['qs'] },
          { j: 'エナジードリンク', v: 'Nước tăng lực', p: 210, g: [], w: 'Nước tăng lực nhiều đường, caffeine, không thay được bữa ăn.' },
          { j: 'お茶', k: 'おちゃ', v: 'Trà xanh chai', p: 140, g: [] }
        ] },
      { id: 'd3c', k: 'label', t: 'Đọc nhãn dinh dưỡng', min: 3, xp: 10,
        prod: 'おにぎり（鮭）', prodV: 'Cơm nắm cá hồi', per: '1個（110g）当たり', perV: 'Các số tính cho 1 cái (110 g)',
        rows: [
          { j: 'エネルギー', r: 'enerugī', v: 'Năng lượng', n: '180kcal' },
          { j: 'たんぱく質', r: 'tanpakushitsu', v: 'Đạm', n: '4.5g' },
          { j: '脂質', r: 'shishitsu', v: 'Chất béo', n: '1.5g' },
          { j: '炭水化物', r: 'tansuikabutsu', v: 'Tinh bột, đường', n: '38.0g' },
          { j: '食塩相当量', r: 'shokuen sōtōryō', v: 'Muối', n: '1.1g' }
        ],
        rounds: [
          { q: 'Chạm dòng cho biết năng lượng.', ok: 0, why: 'エネルギー là năng lượng, tính bằng kcal. Có nhãn ghi 熱量 (netsuryō), cùng nghĩa.' },
          { q: 'Chạm dòng cho biết lượng đạm.', ok: 1, why: 'たんぱく質 là đạm. Làm việc nặng, tập nhiều thì cần đủ đạm.' },
          { q: 'Chạm dòng cho biết lượng muối.', ok: 4, why: '食塩相当量 là lượng muối. Mì ly, canh miso thường khá mặn.' },
          { q: 'Các con số tính cho bao nhiêu? Chạm dòng đó.', ok: 'p', why: '1個当たり là “tính cho 1 cái”. Ăn 2 cái thì nhân đôi các số.' }
        ] }
    ],
    gtip: {
      xuong: 'Tăng ca hay mua đồ ở konbini. Chọn cơm nắm, trứng, rau; bớt mì ly.',
      chuyen: 'Làm xưởng thực phẩm, bạn sẽ gặp nhiều nhãn tiếng Nhật. Tập đọc từ bây giờ.',
      troi: 'Làm ngoài trời cần bữa trưa chắc bụng. Cơm nắm, trứng, rau dễ mua ở konbini.',
      dv: 'Nhà hàng, khách sạn, kaigo: biết tên món Nhật giúp bạn làm việc, trò chuyện dễ hơn.',
      vp: 'Ngồi nhiều thì xem dòng エネルギー trên nhãn, bớt đồ chiên, đồ ngọt.' } },


  { id: 'd4', t: 'Lỗi ăn uống hay gặp', ic: 'alert', sub: 'Bỏ bữa sáng, mì gói, nước ngọt, nhịn ăn', min: 12,
    acts: [
      { id: 'd4a', k: 'day', t: 'Một ngày của bạn cùng lớp', min: 4, xp: 10,
        items: [
          { h: '05:45', t: 'Thức dậy, uống một ly nước.', ok: 'Uống nước sau khi ngủ dậy là thói quen tốt.' },
          { h: '07:30', t: 'Không kịp ăn sáng. Mua ly cà phê sữa đá, uống trên đường đến trường.', err: 1,
            n: 'Bỏ bữa sáng, uống cà phê lúc bụng đói', why: 'Bụng rỗng gặp cà phê dễ cồn cào, đau bụng. Thiếu bữa sáng thì giờ học khó tập trung.' },
          { h: '08:00', t: 'Vào học tiếng Nhật. Mang theo bình nước, uống từng ngụm.', ok: 'Uống từng ngụm, chia đều trong ngày là đúng.' },
          { h: '11:30', t: 'Ăn trưa: cơm, cá kho, rau luộc, canh.', ok: 'Đủ tinh bột, đạm, rau. Bữa trưa tốt.' },
          { h: '16:45', t: 'Tan giờ thể chất, uống liền một lon nước tăng lực cho đỡ mệt.', err: 1,
            n: 'Dùng nước tăng lực thay nước lọc', why: 'Nước tăng lực nhiều đường và caffeine. Sau giờ tập, nước lọc là đủ.' },
          { h: '17:30', t: 'Đi làm thêm đến 22 giờ. Không ăn tối vì sợ mập.', err: 1,
            n: 'Nhịn ăn tối vì sợ mập', why: 'Nhịn ăn làm thiếu năng lượng, dễ choáng khi làm việc. Muốn giữ dáng thì ăn đủ và vận động đều.' },
          { h: '22:30', t: 'Về phòng đói quá. Nấu hai gói mì, ăn xong đi ngủ ngay.', err: 1,
            n: 'Ăn mì gói thay bữa, ăn xong ngủ ngay', why: 'Mì gói chủ yếu là tinh bột và dầu, ít đạm, ít rau. Ăn no sát giờ ngủ dễ khó tiêu.' },
          { h: '22:55', t: 'Đánh răng, đi ngủ.', ok: 'Ngủ trước 23 giờ giúp cơ thể hồi sức.' }
        ] },
      { id: 'd4b', k: 'pick', t: 'Đổi món', min: 4, xp: 10,
        rounds: [
          { q: 'Không kịp ăn sáng. Cách nào hợp nhất?',
            opts: [
              { t: 'Mua ổ bánh mì trứng hoặc hộp sữa, ăn trước giờ học', ok: 1, why: 'Đúng rồi! Có chút tinh bột và đạm lót dạ; cà phê để sau bữa ăn.' },
              { t: 'Uống cà phê thật đậm cho tỉnh, trưa ăn bù thật nhiều vào', why: 'Bụng rỗng gặp cà phê đậm dễ đau bụng. Ăn bù không bù được buổi sáng thiếu sức.' },
              { t: 'Nhịn đến trưa, quen dần thì cơ thể sẽ hết thấy đói', why: 'Cơ thể không quen được việc thiếu năng lượng. Bạn chỉ mệt và khó tập trung hơn.' }
            ] },
          { q: 'Tập xong thấy mệt và khát. Uống gì?',
            opts: [
              { t: 'Nước lọc, uống từng ngụm', ok: 1, why: 'Đúng rồi! Sau giờ tập thông thường, nước lọc bù nước tốt nhất.' },
              { t: 'Một lon nước tăng lực cho tỉnh người, đỡ mệt nhanh hơn', why: 'Nhiều đường và caffeine. Mệt thì cần nghỉ, nước lọc và bữa ăn.' },
              { t: 'Một ly trà sữa trân châu thật lớn cho đã khát', why: 'Trà sữa nhiều đường, no bụng mà ít chất. Để làm món thưởng thỉnh thoảng thôi.' }
            ] },
          { q: 'Bạn muốn giữ dáng. Cách nào đúng?',
            opts: [
              { t: 'Ăn đủ 3 bữa, bớt đồ chiên, nước ngọt, vận động đều', ok: 1, why: 'Đúng rồi! Giữ dáng bền là ăn đủ, chọn món tốt và tập đều.' },
              { t: 'Bỏ bữa tối, chỉ uống nước cho nhẹ bụng', why: 'Nhịn ăn dễ choáng, mệt, rồi lại ăn bù nhiều hơn. Cần giảm cân thì hỏi thầy cô hoặc nhân viên y tế.' },
              { t: 'Uống trà giảm cân mua trên mạng, quảng cáo giảm 5 kg một tuần', why: 'Sản phẩm không rõ nguồn gốc có thể hại sức khỏe. Không có cách giảm cân an toàn nhanh như vậy.' }
            ] },
          { q: 'Đi làm thêm về muộn, rất đói. Bạn làm gì?',
            opts: [
              { t: 'Ăn nhẹ trước ca; về ăn ít cơm với rau, trứng', ok: 1, why: 'Đúng rồi! Có bữa nhẹ trước ca thì về không đói cồn cào, bữa muộn cũng nhẹ hơn.' },
              { t: 'Nấu luôn hai gói mì cho nhanh, ăn thật no rồi lên giường ngủ', why: 'Mì gói ít chất; ăn no sát giờ ngủ dễ khó tiêu, khó ngủ.' },
              { t: 'Nhịn đến sáng mai, ngủ sớm rồi sẽ quên đói thôi', why: 'Đói lâu dễ mất ngủ, sáng dậy mệt và dễ choáng.' }
            ] }
        ] },
      { id: 'd4c', k: 'commit', t: 'Cam kết 21 ngày', min: 3, xp: 15 }
    ],
    gtip: {
      xuong: 'Tăng ca dễ bỏ bữa, ăn mì gói. Chuẩn bị sẵn bữa nhẹ mang theo.',
      chuyen: 'Ca đêm dễ dùng cà phê, nước tăng lực để thức. Ăn nhẹ giữa ca tốt hơn.',
      troi: 'Trời nóng dễ uống nhiều nước ngọt lạnh. Nước lọc, nước bù khoáng tốt hơn.',
      dv: 'Giờ ăn hay bị lùi. Ăn nhẹ trước ca để không đói cồn cào.',
      vp: 'Ngồi học lâu dễ ăn vặt, uống trà sữa. Để bình nước lọc ngay trên bàn.' } },

  { id: 'd5', t: 'Ăn theo ca và nghề', ic: 'timer', sub: 'Ca đêm, đứng lâu, nắng nóng, hộp cơm mang đi', min: 12,
    acts: [
      { id: 'd5a', k: 'pick', t: 'Tình huống của nhóm mình', min: 4, xp: 10,
        byGroup: {
          xuong: { rounds: [
            { q: 'Ca 8–17 giờ, đứng máy cả ca, có tăng ca đến 19 giờ. Buổi chiều ăn thế nào?',
              opts: [
                { t: 'Ăn nhẹ trước giờ tăng ca (cơm nắm, chuối), về ăn tối đủ bữa', ok: 1, why: 'Đúng rồi! Có chút năng lượng thì hai giờ tăng ca không bị đuối, tay vẫn chắc.' },
                { t: 'Nhịn đến khi về phòng rồi ăn một bữa thật no cho bù lại cả buổi', why: 'Đói lâu khi đứng máy dễ choáng, dễ sơ suất. Ăn bù không bù được lúc thiếu sức.' },
                { t: 'Uống một lon nước tăng lực để làm tiếp cho hết giờ', why: 'Nước tăng lực chỉ làm tỉnh một lúc. Cơ thể vẫn thiếu năng lượng.' }
              ] },
            { q: 'Sau bữa trưa bạn hay buồn ngủ, đứng máy chiều rất mệt. Vì sao, và nên làm gì?',
              opts: [
                { t: 'Ăn vừa no, đủ cơm, đạm, rau; không ăn quá no', ok: 1, why: 'Đúng rồi! Ăn quá no làm người nặng nề, buồn ngủ. Vừa đủ thì chiều vẫn tỉnh.' },
                { t: 'Ăn thật nhiều cơm cho có sức làm hết cả buổi chiều', why: 'Ăn quá no làm người nặng nề, buồn ngủ hơn.' },
                { t: 'Bỏ bữa trưa, ăn bánh ngọt và cà phê sữa cho tỉnh táo', why: 'Đồ ngọt cho tỉnh một lúc rồi mệt nhanh, lại thiếu đạm, rau.' }
              ] } ] },
          chuyen: { rounds: [
            { q: 'Xưởng chế biến thực phẩm lạnh suốt ca. Bạn thấy ít khát. Nên làm gì?',
              opts: [
                { t: 'Vẫn uống nước đều trong giờ nghỉ, uống nước ấm cũng được', ok: 1, why: 'Đúng rồi! Trời lạnh vẫn mất nước qua hơi thở, qua đi vệ sinh. Ít khát không có nghĩa là đủ nước.' },
                { t: 'Làm nơi lạnh không đổ mồ hôi nên cả ca không cần uống nước', why: 'Cơ thể vẫn mất nước dù không thấy mồ hôi.' },
                { t: 'Uống thật nhiều cà phê nóng cho người ấm và tỉnh', why: 'Cà phê nhiều làm đi vệ sinh nhiều hơn, khó ngủ sau ca.' }
              ] },
            { q: 'Tuần này ca ngày, tuần sau ca đêm. Giữ sức thế nào?',
              opts: [
                { t: 'Giữ đủ 3 bữa theo giờ của ca, ngủ đủ giờ dù ngủ ban ngày', ok: 1, why: 'Đúng rồi! Ăn, ngủ theo nhịp của ca giúp cơ thể quen nhanh hơn.' },
                { t: 'Đói lúc nào ăn lúc đó, ăn vặt khi buồn ngủ để giữ tỉnh táo', why: 'Ăn vặt liên tục làm bữa chính lộn xộn, dễ thiếu chất.' },
                { t: 'Ca đêm về là ngủ luôn, bỏ bữa, chiều dậy ăn bù', why: 'Bỏ bữa rồi ăn bù dễ đau dạ dày, mệt khi vào ca.' }
              ] } ] },
          troi: { rounds: [
            { q: '6 giờ sáng đã ra công trường. Ăn sáng thế nào?',
              opts: [
                { t: 'Ăn sáng trước khi đi: cơm nắm, trứng, chuối; mang thêm nước', ok: 1, why: 'Đúng rồi! Việc nặng từ sáng sớm cần năng lượng ngay.' },
                { t: 'Không kịp ăn sáng, đến giờ nghỉ trưa thì ăn bù một bữa thật no', why: 'Làm nặng cả buổi sáng khi bụng rỗng dễ choáng, dễ tai nạn.' },
                { t: 'Uống một lon cà phê rồi đi làm luôn', why: 'Cà phê lúc đói dễ cồn cào, không cho bạn sức làm việc.' }
              ] },
            { q: 'Mùa đông ở Nhật, làm ngoài trời rét. Bạn chú ý gì?',
              opts: [
                { t: 'Vẫn ăn đủ bữa, uống nước ấm; cơ thể cần năng lượng để giữ ấm', ok: 1, why: 'Đúng rồi! Trời lạnh cơ thể tốn năng lượng để giữ ấm, vẫn cần nước.' },
                { t: 'Trời lạnh, người không thấy khát nên cả ngày không cần uống nước lọc', why: 'Cơ thể vẫn mất nước khi làm việc nặng, cả khi trời lạnh.' },
                { t: 'Uống rượu cho ấm người trước khi ra công trường', why: 'Rượu bia làm phản xạ chậm, rất nguy hiểm khi làm việc. Không bao giờ uống trước ca.' }
              ] } ] },
          dv: { rounds: [
            { q: 'Ca sớm kaigo bắt đầu 7 giờ, phải đỡ người, đẩy xe lăn. Ăn gì trước ca?',
              opts: [
                { t: 'Ăn nhẹ có tinh bột và đạm: cơm nắm, trứng, sữa', ok: 1, why: 'Đúng rồi! Đỡ người cần sức. Bữa nhẹ đủ chất giúp bạn vững tay.' },
                { t: 'Nhịn đến giờ nghỉ cho nhẹ người, đỡ người dễ hơn', why: 'Đói khi làm việc nặng dễ choáng, nguy hiểm cho cả bạn và người được chăm sóc.' },
                { t: 'Uống một ly cà phê sữa đá lớn thay bữa sáng', why: 'Cà phê không thay được bữa ăn, lúc đói còn dễ cồn cào.' }
              ] },
            { q: 'Ca đêm kaigo, 2 giờ sáng thấy đói và buồn ngủ. Ăn gì?',
              opts: [
                { t: 'Bữa nhẹ dễ tiêu: cơm nắm, súp, sữa chua', ok: 1, why: 'Đúng rồi! Ăn nhẹ giữa đêm đỡ đói mà không nặng bụng.' },
                { t: 'Mì ly cay thật to với một lon nước tăng lực cho tỉnh hẳn', why: 'Mì cay, nhiều dầu giữa đêm dễ khó tiêu. Nước tăng lực làm khó ngủ sau ca.' },
                { t: 'Bánh kẹo ngọt suốt đêm cho đỡ buồn ngủ', why: 'Đồ ngọt cho tỉnh một lúc rồi mệt hơn, lại thiếu chất.' }
              ] } ] },
          vp: { rounds: [
            { q: 'Ngồi máy tính cả ngày, chiều hay buồn ngủ, thèm đồ ngọt. Nên làm gì?',
              opts: [
                { t: 'Đứng dậy đi lại vài phút, uống nước, ăn trái cây', ok: 1, why: 'Đúng rồi! Vận động nhẹ và uống nước giúp tỉnh lại, không thêm nhiều đường.' },
                { t: 'Ăn một gói snack và một ly trà sữa cho tỉnh táo', why: 'Đồ ngọt cho tỉnh một lúc rồi mệt hơn. Ngồi nhiều lại càng nên bớt.' },
                { t: 'Uống hai lon nước tăng lực mỗi chiều cho dễ tập trung', why: 'Nhiều đường, caffeine, tối khó ngủ, sáng lại mệt.' }
              ] },
            { q: 'Bạn làm thêm ca đêm ở konbini, 22 giờ đến 6 giờ sáng. Ăn thế nào?',
              opts: [
                { t: 'Ăn tối trước ca, giữa ca ăn nhẹ, về ăn nhẹ rồi ngủ', ok: 1, why: 'Đúng rồi! Có năng lượng suốt ca, về vẫn ngủ ngon.' },
                { t: 'Nhịn suốt ca vì bận, sáng về ăn thật no rồi ngủ ngay', why: 'Đói lâu dễ choáng; ăn no rồi ngủ ngay dễ khó tiêu.' },
                { t: 'Uống cà phê, nước tăng lực suốt ca thay bữa ăn', why: 'Chất kích thích không thay được bữa ăn, còn làm khó ngủ.' }
              ] } ] }
        } },
      { id: 'd5b', k: 'shift', t: 'Giờ ăn theo ca của mình', min: 4, xp: 10 },
      { id: 'd5c', k: 'bento', t: 'Hộp cơm mang đi', min: 4, xp: 15,
        q: 'Xếp hộp cơm mang đi cho ca của bạn.', sub: 'Mỗi ngăn chọn một món. Món chưa hợp mang đi, Shin sẽ nói vì sao.',
        slots: [
          { k: 'tb', n: 'Ngăn cơm', opts: [{ t: 'Cơm trắng' }, { t: 'Cơm nắm' }, { t: 'Khoai lang luộc' },
            { t: 'Mì gói nấu sẵn', no: 'Mì nấu sẵn để vài giờ bị nở, nhão, lại ít chất. Chọn món khác nhé.' }] },
          { k: 'dam', n: 'Ngăn đạm', opts: [{ t: 'Trứng luộc chín' }, { t: 'Thịt kho' }, { t: 'Cá chiên' },
            { t: 'Gỏi cá sống', no: 'Đồ sống để nhiều giờ rất dễ hỏng, dễ ngộ độc. Mang đi thì nấu chín.' },
            { t: 'Trứng lòng đào', no: 'Trứng chưa chín kỹ để lâu dễ hỏng. Mang đi thì luộc chín hẳn.' }] },
          { k: 'rau', n: 'Ngăn rau', opts: [{ t: 'Rau luộc để ráo nước' }, { t: 'Cà rốt, bông cải luộc' }, { t: 'Rau xào' },
            { t: 'Rau sống trộn sẵn nước sốt', no: 'Rau trộn sẵn nước sốt để lâu dễ úng, dễ hỏng. Chọn rau luộc để ráo.' }] },
          { k: 'qs', n: 'Kèm theo', opts: [{ t: 'Một quả chuối' }, { t: 'Một quả quýt' }, { t: 'Hộp sữa (để túi giữ lạnh)' },
            { t: 'Hai lon nước tăng lực', no: 'Nước tăng lực nhiều đường, caffeine. Mang bình nước lọc thay nhé.' }] }
        ],
        safe: ['Nấu chín kỹ, để nguội rồi mới đậy nắp.', 'Để nơi mát hoặc túi giữ lạnh, tránh nắng, tránh gần máy nóng.', 'Ăn trong buổi. Thấy mùi, vị lạ thì bỏ, đừng tiếc.'] }
    ],
    gtip: {
      xuong: 'Đứng máy cả ca: ăn đủ bữa trước ca, giờ nghỉ nhớ uống nước.',
      chuyen: 'Đổi ca thường xuyên: giữ giờ ăn theo ca, đừng ăn vặt thay bữa.',
      troi: 'Hộp cơm để ngoài nắng rất dễ hỏng. Dùng túi giữ lạnh, để chỗ râm.',
      dv: 'Ca kaigo sớm, ca đêm: luôn có bữa nhẹ lót dạ trước ca.',
      vp: 'Ngồi học, ngồi làm lâu: ăn đúng giờ, không ăn vặt liên tục.' } },

  { id: 'd6', t: 'An toàn thực phẩm ở ký túc xá', ic: 'fridge', sub: 'Tủ lạnh chung, hạn dùng, đau bụng sau ăn', min: 12,
    acts: [
      { id: 'd6a', k: 'spot', t: 'Tủ lạnh chung', min: 3, xp: 10,
        rounds: [
          { art: 'fridge', q: 'Tủ lạnh chung ở ký túc xá. Chạm 3 chỗ chưa ổn.',
            hs: [
              { x: 96, y: 46, r: 20, t: 'Thịt sống không bọc, để ngăn trên', why: 'Nước thịt sống dễ nhỏ xuống đồ chín bên dưới. Bọc kín, để ngăn dưới cùng.' },
              { x: 89, y: 92, r: 20, t: 'Hộp đồ ăn không tên, không ngày', why: 'Tủ chung cần ghi tên, ngày cất. Không biết để bao lâu thì đừng ăn.' },
              { x: 151, y: 132, r: 17, t: 'Bát canh không đậy', why: 'Đồ ăn không đậy dễ nhiễm mùi, nhiễm khuẩn. Đậy nắp hoặc bọc màng.' }
            ] }
        ] },
      { id: 'd6b', k: 'date', t: 'Hạn dùng: còn ăn được không?', min: 4, xp: 10,
        today: '26.11.15', todayV: '15/11/2026',
        items: [
          { j: 'お弁当', k: 'おべんとう', v: 'Cơm hộp', lab: 'shohi', d: '26.11.14', ok: 0, why: '消費期限 đã qua 1 ngày. Đây là hạn an toàn: qua ngày là không ăn.' },
          { j: 'カップラーメン', v: 'Mì ly', lab: 'shomi', d: '26.11.10', ok: 1, why: '賞味期限 là hạn ngon nhất. Chưa mở, cất đúng cách thì qua vài ngày vẫn ăn được. Đừng để quá lâu.' },
          { j: 'サンドイッチ', v: 'Bánh mì kẹp', lab: 'shohi', d: '26.11.15', ok: 1, why: 'Hôm nay là ngày cuối. Ăn trong hôm nay, nhớ để tủ lạnh.' },
          { j: '刺身', k: 'さしみ', v: 'Cá sống thái lát', lab: 'shohi', d: '26.11.16', note: 'Để ngoài tủ lạnh từ sáng đến tối', ok: 0, why: 'Còn hạn nhưng để ngoài tủ lạnh cả ngày. Hạn dùng chỉ đúng khi cất đúng cách.' },
          { j: 'ポテトチップス', v: 'Khoai tây chiên lát', lab: 'shomi', d: '27.03.20', ok: 1, why: 'Còn hạn lâu, chưa mở: ăn được. Nhưng đừng ăn thay bữa nhé.' }
        ] },
      { id: 'd6c', k: 'pick', t: 'Đau bụng sau ăn: làm gì?', min: 4, xp: 10,
        end: 'Không khỏe thì báo sớm, nói rõ. Đó là giữ an toàn cho mình và cho người làm cùng.',
        rounds: [
          { q: 'Tối qua bạn ăn hộp cơm để từ hôm kia. Sáng nay đau bụng, đi ngoài 2 lần. Việc đầu tiên?',
            opts: [
              { t: 'Uống nước từng ngụm, nghỉ, báo ngay thầy cô hoặc quản lý ký túc xá', ok: 1, why: 'Đúng rồi! Đi ngoài nhiều dễ mất nước. Báo sớm để được hướng dẫn, đưa đi khám nếu cần.' },
              { t: 'Cố đi học như thường, chờ cơn đau tự hết, không cần nói với ai cho khỏi phiền', why: 'Cố chịu một mình dễ nặng thêm. Báo sớm là để được giúp kịp.' },
              { t: 'Xin bạn cùng phòng mấy viên thuốc đau bụng để uống', why: 'Thuốc của người khác có thể không hợp với bạn. Hỏi nhân viên y tế hoặc dược sĩ.' }
            ] },
          { q: 'Ở Nhật, bạn đau bụng sau bữa ăn, không đi làm nổi. Báo cho ai?',
            opts: [
              { t: 'Người phụ trách ở công ty hoặc nghiệp đoàn, rồi đi khám theo hướng dẫn', ok: 1, why: 'Đúng rồi! Họ sắp xếp công việc, chỉ chỗ khám, giúp làm thủ tục bảo hiểm.' },
              { t: 'Chỉ nhắn cho gia đình ở Việt Nam biết, không báo công ty cho khỏi phiền ai', why: 'Gia đình ở xa không giúp kịp. Tự nghỉ không báo còn làm mất lòng tin.' },
              { t: 'Không báo ai, nằm ở phòng đến khi khỏi thì đi làm lại', why: 'Tự nghỉ không báo làm mọi người lo, mất lòng tin. Bệnh nặng thêm không ai biết.' }
            ] },
          { q: 'Dấu hiệu nào cần đi khám ngay, không chờ?',
            opts: [
              { t: 'Sốt cao, nôn liên tục, không uống được nước, đi ngoài ra máu', ok: 1, why: 'Đúng rồi! Gặp những dấu hiệu này thì đi khám ngay. Nhiều người ăn cùng món cùng bị cũng phải báo ngay.' },
              { t: 'Đau bụng nhẹ một lúc, nghỉ ngơi, uống nước ấm thì thấy đỡ dần', why: 'Đỡ dần thì theo dõi, vẫn báo người phụ trách. Đây chưa phải dấu hiệu phải đi khám ngay.' },
              { t: 'Thấy no, hơi đầy bụng sau một bữa ăn quá nhiều', why: 'Đầy bụng vì ăn nhiều thường tự hết. Lần sau ăn vừa đủ nhé.' }
            ] },
          { q: 'Nhắn cho người phụ trách thế nào là rõ nhất?',
            opts: [
              { t: '“Em đau bụng, đi ngoài 3 lần từ 6 giờ sáng. Tối qua em ăn cơm hộp để 2 ngày. Em xin nghỉ để đi khám ạ.”', ok: 1, why: 'Đúng rồi! Rõ bị gì, từ lúc nào, nghi do đâu, cần gì. Đó là Hō-Ren-Sō: báo cáo, liên lạc, bàn bạc.' },
              { t: '“Dạ em xin lỗi đã làm phiền ạ, hôm nay trong người em không được khỏe lắm, chắc em xin nghỉ một hôm, mai em đi làm lại ạ.”', why: 'Lễ phép nhưng chưa rõ: bị gì, từ khi nào, đã ăn gì. Người nghe chưa biết giúp bạn thế nào.' },
              { t: '“Em bị đau bụng ạ.”', why: 'Ngắn quá. Người nghe chưa biết bạn nặng hay nhẹ, có cần đi khám không.' }
            ] }
        ] }
    ],
    gtip: {
      xuong: 'Ký túc xá công ty thường dùng tủ lạnh chung. Ghi tên, ngày lên hộp.',
      chuyen: 'Làm xưởng thực phẩm, vệ sinh an toàn là việc hằng ngày. Ở phòng cũng vậy.',
      troi: 'Mùa hè đồ ăn hỏng rất nhanh. Về phòng là cất tủ lạnh ngay.',
      dv: 'Kaigo, nhà hàng: đau bụng có thể lây cho người khác. Báo ngay, đừng cố làm.',
      vp: 'Sống chung phòng: giữ tủ lạnh sạch là tôn trọng người cùng phòng.' } }
];

/* =========================================================
   GÓC NGHỀ (khu 'nghe') · TC01.0.5 đợt 1: n1, n3, n5 · TC01.0.8 đợt 2: n2, n4, n6 (đủ 6 bài)
   Nguồn: bài giảng lớp Kiến thức nghề (cơ khí, thực phẩm & nông nghiệp, vệ sinh tòa nhà, đóng gói – in ấn, may mặc),
   tiêu chí đo lường nhóm nghề (phần tư thế làm việc), casestudy Koka (gộp, ẩn danh),
   職場における腰痛予防対策指針 (Bộ Y tế, Lao động và Phúc lợi Nhật Bản, 2013) cho mức nâng tham khảo.
   Ranh giới: Góc nghề = phòng ngừa khi làm việc. Đã đau, ốm → Phòng y tế.
   Câu riêng theo nghề: BODY_NEED, LAD_NEED và pick.byJob dùng mã nghề (JOBS[].s); không có thì theo nhóm.
   ========================================================= */
var NGHE_TXT = {
  khuSay: 'Ở Góc nghề, Shin đội mũ bảo hộ. Giữ thân thể lành lặn là giữ được việc làm, giữ được chữ tín với công ty.',
  bodyQ: 'Ca làm của nghề bạn dùng chỗ nào nhiều nhất?', bodySub: 'Chạm 3 chỗ trên hình hoặc ở danh sách. Không có đúng sai: Shin muốn biết bạn nghĩ gì.',
  bodySee: 'Xem nghề mình hay mỏi ở đâu', bodyRes: 'Nghề của bạn hay mỏi, hay gặp vấn đề ở:', bodyMatch: 'Bạn đoán trúng [N]/3 chỗ.',
  bodyEnd: 'Biết chỗ nào làm việc nhiều thì tập cho chỗ đó khỏe trước khi bay. Đó là chuẩn bị cho nghề.',
  ladQ: 'Bạn tự xếp mình ở mức nào?', ladSub: 'Thật lòng thôi, không ai chấm điểm. Có kỷ lục ở Sàn tập thì Shin hiện ra để bạn so.',
  ladLv: ['Còn yếu', 'Tạm được', 'Khá', 'Vững'], ladSee: 'Xem nghề mình cần gì',
  ladNeed: 'Nghề của bạn cần nhất:', ladGap: 'Ưu tiên tập: [Nhóm]. Mở bài [Bài] ở Sàn tập.', ladOk: 'Nhóm cơ nghề bạn cần đã khá. Giữ nhịp tập nhé!',
  ladRec: 'Kỷ lục của bạn: ',
  kgCard: 'Mức nâng tham khảo của bạn', kgNo: 'Nhập cân nặng ở thẻ hội viên để Shin tính mức của bạn.',
  kgNam: 'Nam: khoảng 40% cân nặng.', kgNu: 'Nữ: khoảng 60% mức của nam (khoảng 24% cân nặng).',
  kgSrc: 'Nguồn: 職場における腰痛予防対策指針, Bộ Y tế, Lao động và Phúc lợi Nhật Bản (2013). Mức làm bằng tay, không có máy hỗ trợ.',
  kgRule: 'Thấy nặng quá sức thì nhờ người, dùng xe đẩy (台車). Đó là làm đúng, không phải yếu.',
  storyLab: 'Dựa trên chuyện đã từng xảy ra', storyW: 'Nếu là anh T., mình sẽ…', storySub: 'Viết từ 10 chữ trở lên được thêm Insight.',
  kwSel: 'Đã chọn [Món]. Giờ chạm chữ Nhật hợp với nó.', kwNo: 'Thử lại nhé. Đọc cách đọc nhỏ bên dưới rồi chọn lại.',
  kwEnd: 'Ở nhiều chỗ làm tại Nhật, người ta chỉ tay vào chỗ cần kiểm tra rồi nói to 「ヨシ！」. Thử làm một lần trước khi rời bàn học hôm nay.'
};
/* bản đồ cơ thể: tọa độ trên hình đứng thẳng nhìn trước (jjClose, hệ 240×180) */
var BODY_Z = [
  { k: 'mat', n: 'Mắt, tai', pts: [[120, 21]] },
  { k: 'co', n: 'Cổ, vai', pts: [[120, 41]] },
  { k: 'tay', n: 'Cổ tay, bàn tay', pts: [[101, 96], [139, 96]] },
  { k: 'lung', n: 'Lưng dưới', pts: [[120, 74]] },
  { k: 'goi', n: 'Đầu gối', pts: [[113, 125], [127, 125]] },
  { k: 'chan', n: 'Bắp chân, bàn chân', pts: [[113, 152], [127, 152]] }
];
var BODY_NEED = {
  xuong: [['lung', 'Nhấc chi tiết, cúi đặt hàng: sai tư thế lâu ngày dễ đau lưng.'], ['tay', 'Cầm dụng cụ, chi tiết cả ca: cổ tay dễ mỏi, dễ trầy vì cạnh sắc.'], ['mat', 'Phôi bắn, ánh hàn, tiếng ồn: cần kính, nút tai bảo hộ.']],
  chuyen: [['tay', 'Một động tác lặp cả ca: cổ tay dễ đau, dễ viêm gân.'], ['chan', 'Đứng 8–10 tiếng: bắp chân căng, mỏi.'], ['co', 'Cúi nhìn băng chuyền lâu: cổ, vai gáy dễ mỏi.']],
  troi: [['lung', 'Mang vác, cúi, đào: lưng chịu sức nặng nhiều nhất.'], ['goi', 'Ngồi xổm, lên xuống giàn: đầu gối làm việc nhiều.'], ['co', 'Vác vật trên vai, ngửa cổ làm trên cao: cổ vai dễ mỏi.']],
  dv: [['lung', 'Đỡ người, cúi lau, bưng bê: lưng dưới dễ đau.'], ['goi', 'Cúi, quỳ lau sàn, lên xuống cầu thang: gối làm việc nhiều.'], ['chan', 'Đi lại, đứng cả ngày: bắp chân, bàn chân mỏi.']],
  vp: [['co', 'Nhìn màn hình lâu: cổ, vai gáy mỏi.'], ['mat', 'Nhìn màn hình nhiều giờ: mắt khô, mỏi.'], ['lung', 'Ngồi lâu, ít đứng dậy: lưng dưới dễ đau.']],
  'dieu-duong': [['lung', 'Đỡ người từ giường sang xe lăn: lưng dưới chịu nhiều nhất.'], ['tay', 'Đỡ, nâng, đẩy xe lăn: cổ tay, cánh tay làm việc nhiều.'], ['chan', 'Đi lại cả ca, có ca đêm: chân mỏi.']],
  'xay-dung': [['lung', 'Mang vác vật liệu, cúi buộc thép: lưng chịu nhiều nhất.'], ['co', 'Vác vật trên vai, ngửa cổ làm trên cao: cổ vai dễ mỏi.'], ['chan', 'Đi lại trên công trường: bàn chân cần giày bảo hộ đúng chuẩn.']],
  'thuc-pham': [['chan', 'Đứng 8–10 tiếng: bắp chân căng, mỏi.'], ['tay', 'Trộn, khuấy, múc lặp lại: cổ tay dễ đau.'], ['lung', 'Bưng bột, gạo, nồi lớn: lưng dễ đau nếu sai tư thế.']],
  'o-to': [['lung', 'Bưng lốp, cúi vào khoang máy: lưng chịu nhiều.'], ['tay', 'Siết ốc, cầm dụng cụ cả ca: cổ tay dễ mỏi.'], ['co', 'Ngửa cổ làm dưới gầm xe: cổ, vai gáy mỏi.']],
  'may-mac': [['lung', 'Ngồi hoặc đứng lâu: lưng dưới dễ đau.'], ['co', 'Cúi nhìn đường may lâu: cổ, vai gáy mỏi.'], ['tay', 'Cắt, may, ủi lặp lại: cổ tay dễ đau.']],
  've-sinh-toa-nha': [['tay', 'Lau chùi lặp lại, chạm chất tẩy rửa: cổ tay, da tay dễ tổn thương.'], ['lung', 'Cúi lau, xách xô nước: lưng dưới dễ đau.'], ['goi', 'Quỳ lau, lên xuống cầu thang: gối làm việc nhiều.']]
};
/* thang tự định vị 4 nhóm cơ */
var LAD_G = [
  { k: 'nvt', n: 'Ngực – vai – tay', d: 'Bưng, đẩy, nâng', ex: 'pushup', bai: 'b2' },
  { k: 'bl', n: 'Bụng – lưng', d: 'Giữ lưng thẳng khi cúi, khi xoay', ex: 'plank', bai: 'b3' },
  { k: 'ch', n: 'Chân – hông', d: 'Đứng lâu, ngồi xuống đứng lên', ex: 'squat', bai: 'b4' },
  { k: 'tm', n: 'Sức bền', d: 'Làm hết ca không đuối', ex: 'jj', bai: 'b5' }
];
var LAD_NEED = { xuong: ['nvt', 'ch'], chuyen: ['ch', 'bl'], troi: ['nvt', 'bl'], dv: ['bl', 'ch'], vp: ['bl', 'tm'],
  'dieu-duong': ['bl', 'ch'], 'xay-dung': ['nvt', 'bl'], 'thuc-pham': ['ch', 'nvt'], 'o-to': ['nvt', 'bl'], 've-sinh-toa-nha': ['bl', 'ch'] };

/* ---------- Góc nghề đợt 2 (TC01.0.8): n2, n4, n6 ----------
   flow: tập theo Shin, đếm giờ từng động tác (EX[fx].frames, sec giây mỗi động tác)
   ca: một ca 8 giờ của nhóm (CA_DAY) + ngày học ở trường 8–17 giờ (SCHOOL_DAY, lịch tiết JPC)
   habit: chọn 1 thói quen (NHABITS) · week: lịch tập bài bổ trợ (N6_SET) */
var NGHE2_TXT = {
  flIntro: 'Đứng chỗ rộng, cách bàn ghế một sải tay. Shin đếm giờ, bạn làm theo hình.',
  flJp: 'Nhiều chỗ làm ở Nhật cho cả nhóm tập thể dục trước giờ làm. Bài này để bạn tự làm thêm, ở đâu cũng được.',
  flStart: 'Bắt đầu cùng Shin', flPause: 'Tạm dừng', flGo: 'Tiếp tục', flSkip: 'Động tác tiếp',
  flCheer: ['Nhẹ nhàng thôi, thở đều.', 'Tốt lắm, giữ nhịp nhé.', 'Chậm và đều, đừng giật.', 'Căng nhẹ là đủ.', 'Sắp xong rồi!'],
  flDone: 'Xong rồi! Người bạn thấy thế nào?',
  flFeel: ['Người ấm hơn', 'Như cũ', 'Có chỗ bị đau'],
  flSay: ['Đúng vậy. Khớp ấm, cơ mềm thì vào việc an toàn hơn.', 'Lần sau làm chậm hơn, xoay rộng hơn một chút nhé.', 'Dừng động tác làm đau. Đau không đỡ thì báo thầy cô hoặc người phụ trách.'],
  caQ: 'Một ca 8 giờ của nhóm [Nhóm]. Giờ nào bạn nghĩ hay mỏi nhất?', caSub: 'Chạm 2 mốc giờ. Không có đúng sai.',
  caSee: 'Xem giờ hay mỏi', caMatch: 'Bạn đoán trúng [N]/2.', caHot: 'Hay mỏi', caLunch: 'Nghỉ trưa',
  caNote: 'Lịch minh họa một ca ngày. Mỗi công ty có giờ làm, giờ nghỉ riêng.',
  schQ: 'Ngày học ở trường của bạn cũng từ 8 đến 17 giờ. Tiết nào bạn ngồi lâu, mỏi nhất?',
  schSay: 'Giờ ra chơi sau [Tiết], đứng dậy làm bài Giãn 2 phút. Tập từ bây giờ, sang Nhật đã thành thói quen.',
  habQ: 'Chọn 1 việc nhỏ bạn sẽ làm mỗi ngày', habOwn: 'Mình tự đặt thói quen khác',
  habSay: 'Một việc nhỏ làm mỗi ngày có ích hơn mười việc lớn làm một lần. Bắt đầu ngay ở trường hôm nay.',
  habW: 'Viết lời hẹn: “Khi …, mình sẽ …”', habSub: 'Gắn với một việc bạn làm mỗi ngày ở trường. Từ 10 chữ trở lên được thêm Insight.',
  n6Intro: 'Bài của nhóm [Nhóm]: mỗi nhóm cơ một động tác (ngực – vai – tay · bụng – lưng · chân – hông).',
  wkQ: '3 động tác bổ trợ của bạn', wkNam: '20 cái × 2 hiệp', wkNu: '15 cái × 2 hiệp', wkHold: 'giữ theo sức × 2 hiệp',
  wkKtn: 'Ở lớp Kiến thức nghề, mỗi tuần bạn quay video 3 động tác bổ trợ để nộp thầy cô. Tập trước từ bây giờ.',
  wkDays: 'Tuần này bạn tập bổ trợ vào ngày nào?', wkDaysSub: 'Chọn 2–3 ngày, xen ngày nghỉ để cơ hồi lại.', wkSan: 'Lịch Sàn tập của bạn: ',
  wkSlot: 'Giờ nào?', wkW: 'Viết lời hẹn: “Khi …, mình sẽ …”', wkSub: 'Viết cụ thể ngày, giờ, chỗ tập. Từ 10 chữ trở lên được thêm Insight.',
  wkTips: ['Khi học xong buổi chiều thứ Ba và thứ Năm, mình sẽ tập 3 động tác bổ trợ trước khi tắm']
};
/* một ca ngày 8–17 giờ, nghỉ trưa 12–13 giờ (minh họa). slots: 8, 9, 10, 11, 13, 14, 15, 16 giờ. hot[chỉ số] = [vì sao mỏi, mẹo] */
var CA_H = [8, 9, 10, 11, 13, 14, 15, 16];
var CA_DAY = {
  xuong: { s: ['Họp đầu ca, kiểm tra máy', 'Đứng máy, đưa chi tiết vào máy', 'Đứng máy, nhấc chi tiết ra kiểm tra', 'Đứng máy liền 3 tiếng', 'Vào ca chiều sau bữa trưa', 'Đứng máy, chỉnh máy', 'Xếp chi tiết vào thùng, lặp lại', 'Dọn máy, 5S cuối ca'],
    hot: { 3: ['Đứng một chỗ 3 tiếng: bắp chân, lưng dưới bắt đầu mỏi.', 'Lúc máy dừng hoặc giờ nghỉ: kiễng gót 15 lần, chống tay ưỡn nhẹ.'],
      6: ['Cuối chiều, cổ tay và vai mỏi vì lặp lại.', 'Giờ nghỉ: giãn cổ tay, kéo tay ngang ngực.'] } },
  chuyen: { s: ['Họp đầu ca, rửa tay, mặc đồ bảo hộ', 'Đứng dây chuyền, xếp hàng vào khay', 'Lặp một động tác theo nhịp băng chuyền', 'Đứng một chỗ trong xưởng lạnh', 'Vào ca chiều sau bữa trưa', 'Đứng dây chuyền, kiểm hàng', 'Cổ tay lặp động tác cả buổi', 'Vệ sinh dây chuyền cuối ca'],
    hot: { 3: ['Đứng một chỗ 3 tiếng trong xưởng lạnh: bắp chân căng, tay lạnh cứng.', 'Giờ nghỉ: kiễng gót, nắm – xòe bàn tay cho ấm.'],
      6: ['Cổ tay đã lặp một động tác rất nhiều lần.', 'Giờ nghỉ: giãn cổ tay, xoay vai 1 phút.'] } },
  troi: { s: ['Họp đầu ca, tập thể dục, kiểm tra đồ bảo hộ', 'Mang vác vật liệu', 'Cúi buộc, đào, lắp đặt', 'Làm trên giàn, ngửa cổ', 'Vào ca chiều, trời nắng nhất', 'Mang vác, cúi làm dưới nắng', 'Lắp đặt, dọn vật liệu', 'Dọn công trường, kiểm tra cuối ngày'],
    hot: { 2: ['Cúi lâu một tư thế: lưng dưới mỏi nhiều nhất.', 'Xong một đoạn việc: đứng thẳng, chống tay sau lưng, ưỡn nhẹ.'],
      5: ['Đầu giờ chiều nắng nóng: mỏi nhanh, dễ mất nước.', 'Uống nước theo giờ, nghỉ trong bóng râm theo lịch của đội.'] } },
  dv: { s: ['Họp đầu ca, nghe giao việc', 'Đi lại, đỡ người hoặc bưng bê', 'Cúi lau, dọn phòng', 'Phục vụ giờ ăn trưa', 'Vào ca chiều sau bữa trưa', 'Đi lại, chạy việc cả buổi', 'Đã đứng, đi lại 6 tiếng', 'Ghi sổ, bàn giao ca'],
    hot: { 2: ['Cúi lau, cúi dọn nhiều lần: lưng dưới và gối mỏi.', 'Hạ hông thay vì cúi gập lưng. Xong mỗi phòng, đứng thẳng ưỡn nhẹ.'],
      6: ['Đi lại, đứng cả ngày: bắp chân, bàn chân mỏi.', 'Giờ nghỉ: kiễng gót, xoay cổ chân. Tối về gác chân cao.'] } },
  vp: { s: ['Họp đầu ngày, xem việc', 'Ngồi máy tính', 'Ngồi máy tính, gõ phím liên tục', 'Ngồi 3 tiếng gần như không đứng dậy', 'Sau bữa trưa, dễ buồn ngủ', 'Họp, ngồi máy tính', 'Nhìn màn hình cả buổi chiều', 'Gửi báo cáo cuối ngày'],
    hot: { 3: ['Ngồi lâu không đứng dậy: lưng dưới, cổ vai mỏi.', 'Cứ 1 giờ đứng dậy 1–2 phút: đi lấy nước, giãn vai.'],
      6: ['Nhìn màn hình nhiều giờ: mắt khô, cổ mỏi.', 'Nhìn ra xa 20 giây, chớp mắt. Kéo màn hình ngang tầm mắt.'] } }
};
/* ngày học ở trường 8–17 giờ (lịch tiết JPC, thứ Hai – thứ Sáu) */
var SCHOOL_DAY = [['Tiết 1–2', '8:00–9:30'], ['Tiết 3–4', '10:00–11:30'], ['Tiết 5–6', '13:15–14:45'], ['Tiết 7–8', '15:15–16:45']];
/* thói quen chống mỏi: 3 chung + 1 theo nhóm */
var NHABITS = {
  all: [
    { t: 'Cứ 1 giờ, đứng dậy hoặc đổi tư thế 1–2 phút', tip: 'Khi hết một tiết học, mình sẽ đứng dậy giãn vai 1 phút trước khi ngồi lại' },
    { t: 'Giờ nghỉ: giãn cổ tay, xoay vai 1 phút', tip: 'Khi chuông giờ nghỉ reo, mình sẽ giãn cổ tay và xoay vai trước khi ra ngoài' },
    { t: 'Tối về: gác chân cao 10 phút, giãn bắp chân', tip: 'Khi tắm xong buổi tối, mình sẽ gác chân lên tường 10 phút rồi giãn bắp chân' }
  ],
  xuong: { t: 'Đứng lâu: đổi chân trụ, kiễng gót lúc máy dừng', tip: 'Khi đứng một chỗ quá 30 phút, mình sẽ đổi chân trụ và kiễng gót 10 lần lúc nghỉ tay' },
  chuyen: { t: 'Lặp động tác: nắm – xòe bàn tay mỗi giờ nghỉ', tip: 'Khi chuông giờ nghỉ reo, mình sẽ nắm – xòe bàn tay 10 lần rồi giãn cổ tay' },
  troi: { t: 'Cúi làm lâu: đứng thẳng ưỡn nhẹ sau mỗi đoạn việc', tip: 'Khi xong một đoạn việc, mình sẽ đứng thẳng, chống tay sau lưng, ưỡn nhẹ 3 lần' },
  dv: { t: 'Cúi lau: hạ hông, không cúi gập lưng', tip: 'Khi lau dọn phòng ở hay lớp học, mình sẽ hạ hông, một gối chạm sàn thay vì cúi gập lưng' },
  vp: { t: 'Ngồi máy tính: nhìn xa 20 giây mỗi giờ', tip: 'Khi làm xong một việc trên điện thoại hay máy tính, mình sẽ nhìn ra xa 20 giây và đứng dậy' }
};
/* bài bổ trợ theo nhóm: [ngực – vai – tay, bụng – lưng, chân – hông]; nữ: pushup → kneepush (engine tự đổi) */
var N6_SET = {
  xuong: ['dip', 'plank', 'squat'],
  chuyen: ['pushup', 'superman', 'sidelunge'],
  troi: ['pushup', 'superman', 'hinge'],
  dv: ['dip', 'crunch', 'sidelunge'],
  vp: ['dip', 'superman', 'squat']
};

var BAI_NGHE = [
  { id: 'n1', t: 'Cơ thể của nghề mình', ic: 'core', sub: 'Nghề mình dùng chỗ nào nhiều? Mình đang ở mức nào?', min: 11,
    acts: [
      { id: 'n1a', k: 'body', t: 'Bản đồ cơ thể', min: 3, xp: 10 },
      { id: 'n1b', k: 'ladder', t: 'Mình đang ở mức nào?', min: 4, xp: 10 },
      { id: 'n1c', k: 'write', t: 'Trước khi bay, mình cần…', min: 4, xp: 15, dyn: 'nghe',
        say: 'Nghề nào cũng cần thân thể khỏe. Biết mình thiếu gì thì mới tập đúng chỗ.',
        q: 'Trước khi bay, bạn cần khỏe thêm ở đâu? Vì sao?', sub: 'Viết cụ thể: chỗ nào, vì nghề mình phải làm gì. Từ 10 chữ trở lên được thêm Insight.',
        tips: ['Trước khi bay mình cần khỏe thêm chân và hông, vì nghề mình phải đứng cả ca'] }
    ],
    gtip: {
      xuong: 'Nhà xưởng cần tay, vai khỏe để nhấc chi tiết, và chân vững để đứng máy cả ca.',
      chuyen: 'Dây chuyền cần chân bền để đứng lâu, cổ tay dẻo để làm một động tác cả ngày.',
      troi: 'Ngoài trời cần lưng, vai khỏe để mang vác, và sức bền khi trời nóng hoặc rét.',
      dv: 'Dịch vụ cần bụng, lưng vững để đỡ người, bưng bê mà không đau lưng.',
      vp: 'Văn phòng ít vận động: cần lưng khỏe và thói quen đứng dậy giữa giờ.' } },

  { id: 'n2', t: 'Khởi động trước ca', ic: 'warm', sub: '5 động tác, 3 phút trước khi vào việc', min: 9,
    acts: [
      { id: 'n2a', k: 'how', t: 'Xem 5 động tác', min: 3, xp: 10, ex: ['preshift'] },
      { id: 'n2b', k: 'order', t: 'Xếp thứ tự', min: 2, xp: 10,
        q: 'Xếp 5 động tác khởi động trước ca theo thứ tự.', sub: 'Chạm lần lượt từ động tác làm trước đến làm sau.',
        items: ['Cổ: nghiêng, cúi, ngửa', 'Vai: xoay khuỷu tay', 'Cổ tay: xoay, nắm – xòe', 'Hông: xoay vòng', 'Gối, cổ chân: xoay nhẹ'],
        hint: 'Gợi ý: đi từ trên đầu xuống dưới chân.',
        ok: 'Đi từ trên xuống thì không bỏ sót khớp nào. Dễ nhớ, làm ở đâu cũng được.' },
      { id: 'n2c', k: 'flow', t: 'Tập theo Shin 3 phút', min: 3, xp: 15, fx: 'preshift', sec: 30 }
    ],
    gtip: {
      xuong: 'Trước khi đứng máy: khởi động kỹ cổ tay, vai. Tay ấm thì cầm dụng cụ chắc hơn.',
      chuyen: 'Dây chuyền chạy là phải làm ngay: khởi động ở phòng thay đồ trước giờ vào ca.',
      troi: 'Sáng mùa đông ở công trường rất lạnh: khởi động lâu hơn, đến khi người ấm lên.',
      dv: 'Trước ca đỡ người, bưng bê: khởi động kỹ hông, gối.',
      vp: 'Ngồi máy tính cả ngày: khởi động cổ, vai, cổ tay trước giờ làm và sau giờ nghỉ trưa.' } },

  { id: 'n3', t: 'Nâng, bưng, đẩy đúng cách', ic: 'arm', sub: 'Hạ hông, ôm sát người, nặng quá thì nhờ người', min: 12,
    acts: [
      { id: 'n3a', k: 'how', t: 'Nâng vật đúng cách', min: 3, xp: 10, ex: ['lift'] },
      { id: 'n3b', k: 'spot', t: 'Tìm điểm chưa đúng', min: 4, xp: 10,
        rounds: [
          { p: 'liftBad', mk: 'boxBad', q: 'Bạn này nhấc thùng. Chạm 3 chỗ chưa đúng.',
            hs: [
              { x: 136, y: 80, r: 16, t: 'Lưng cong gập xuống', why: 'Cúi gập lưng để nhấc là cách dễ đau lưng nhất. Hạ hông xuống, giữ lưng thẳng.' },
              { x: 118, y: 128, r: 14, t: 'Chân thẳng, không hạ hông', why: 'Sức nâng phải đến từ chân. Gập gối, hạ hông như ngồi xuống ghế.' },
              { x: 184, y: 154, r: 18, t: 'Vật ở xa người', why: 'Vật càng xa người, lưng càng phải gánh nặng. Bước lại sát vật trước khi nhấc.' }
            ] },
          { p: 'carryHigh', mk: 'boxHigh', q: 'Bạn này bê thùng đi qua xưởng. Chạm 2 chỗ chưa ổn.',
            hs: [
              { x: 147, y: 24, r: 20, t: 'Thùng cao che mắt', why: 'Không nhìn thấy đường thì dễ vấp, dễ té. Bê thấp ngang bụng hoặc chia nhỏ ra.' },
              { x: 158, y: 170, r: 15, t: 'Sàn ướt trên lối đi', why: 'Sàn ướt rất dễ trượt khi đang bê đồ. Báo lau khô hoặc đi đường khác.' }
            ] }
        ] },
      { id: 'n3c', k: 'pick', t: 'Nặng quá thì làm sao?', min: 4, xp: 10, kg: 1,
        rounds: [
          { q: 'Một thùng hàng to, bạn chưa biết nặng bao nhiêu. Làm gì trước?',
            opts: [
              { t: 'Cúi xuống nhấc mạnh lên luôn cho nhanh, thấy nặng quá thì thả xuống', why: 'Nhấc mạnh bất ngờ khi chưa biết nặng nhẹ là lúc lưng dễ bị đau nhất.' },
              { t: 'Đẩy thử một góc xem nặng không, nhìn đường đi có vướng gì không', ok: 1, why: 'Đúng rồi! Biết vật nặng cỡ nào, đường đi có trống không rồi mới nhấc.' },
              { t: 'Nhờ bạn đưa lên vai mình rồi vác một mình cho nhanh', why: 'Chưa biết nặng nhẹ mà vác lên vai một mình rất dễ mất thăng bằng.' }
            ] },
          { q: 'Thùng này nặng 30 kg. [KG] Bạn làm gì?',
            opts: [
              { t: 'Cố bê một mình, mình còn trẻ khỏe mà, đừng làm phiền ai', why: 'Cố quá sức một lần có thể đau lưng cả tháng. Lúc đó mới thật sự làm phiền mọi người.' },
              { t: 'Bê một mình nhưng đi thật nhanh cho đỡ mỏi tay', why: 'Đi nhanh khi đang bê nặng dễ vấp, dễ té.' },
              { t: 'Nhờ người khiêng cùng hoặc dùng xe đẩy (台車)', ok: 1, why: 'Đúng rồi! Thấy nặng quá sức thì nhờ người, dùng xe đẩy. Đó là làm đúng, không phải yếu.' }
            ] },
          { q: 'Thùng chi tiết kim loại có cạnh sắc, khá nặng. Bạn bê thế nào?',
            opts: [
              { t: 'Bê bằng tay không cho dễ cầm, lúc đặt xuống thì buông tay thả rơi cho nhanh', why: 'Cạnh sắc dễ làm đứt tay; thả rơi dễ làm hỏng hàng, dập chân.' },
              { t: 'Kê lên đùi rồi xoay người đặt lên kệ bên cạnh', why: 'Vặn lưng khi đang bê nặng rất dễ đau lưng. Xoay bằng bước chân.' },
              { t: 'Đeo găng tay bảo hộ, hạ hông, ôm sát người; nặng quá thì dùng xe đẩy', ok: 1, why: 'Đúng rồi! Găng tay giữ tay khỏi cạnh sắc, ôm sát người giữ lưng khỏi đau.' }
            ] }
        ],
        byGroup: {
          chuyen: { q: 'Đồ nặng trên kệ cao ở kho của dây chuyền. Lấy thế nào?',
            opts: [
              { t: 'Dùng bục hoặc thang có người giữ; đồ nặng nên xếp ở ngăn thấp', ok: 1, why: 'Đúng rồi! Đồ nặng để ngăn thấp. Lấy trên cao thì đứng vững, có người giữ thang.' },
              { t: 'Kiễng chân, với tay kéo thùng xuống cho nhanh', why: 'Kéo đồ nặng từ trên cao xuống dễ rơi trúng người.' },
              { t: 'Trèo lên kệ hàng đứng lấy cho tiện, không cần làm phiền ai giữ thang', why: 'Kệ không phải chỗ đứng. Rất dễ té, dễ đổ kệ.' }
            ] },
          troi: { q: 'Bao xi măng 25 kg trên công trường. Bạn chuyển thế nào?',
            opts: [
              { t: 'Hạ hông, ôm sát, đứng lên bằng chân; nhiều bao thì dùng xe đẩy', ok: 1, why: 'Đúng rồi! Lực từ chân, vật sát người. Nhiều bao thì để xe làm thay lưng.' },
              { t: 'Cúi lưng nhấc bao lên, vác lên vai rồi xoay người đi tiếp cho nhanh', why: 'Cúi gập lưng và vặn người khi đang vác là hai điều dễ đau lưng nhất.' },
              { t: 'Kéo lê bao trên đất bằng một tay cho nhanh', why: 'Kéo một tay làm lệch người, dễ đau vai, đau lưng; bao dễ rách.' }
            ] },
          dv: { q: 'Xô nước lau sàn đầy, bạn cần mang xuống cầu thang. Làm thế nào?',
            opts: [
              { t: 'Xách xô đầy bằng một tay, chạy thật nhanh xuống cầu thang cho kịp giờ', why: 'Xô đầy làm lệch người; chạy trên cầu thang dễ trượt, té.' },
              { t: 'Đổ bớt nước, xách sát người, tay kia vịn tay vịn cầu thang', ok: 1, why: 'Đúng rồi! Nhẹ hơn, vững hơn. Xuống cầu thang luôn giữ một tay vịn.' },
              { t: 'Ôm xô trước bụng, không vịn, bước hai bậc một lần', why: 'Ôm trước bụng che mất bậc thang dưới chân. Rất dễ hụt chân.' }
            ] },
          vp: { q: 'Làm thêm ở kho, bạn chuyển nhiều thùng giấy nặng. Làm thế nào?',
            opts: [
              { t: 'Hạ hông, ôm sát, nhìn đường đi; nhiều thùng thì dùng xe đẩy', ok: 1, why: 'Đúng rồi! Ngồi nhiều thì lưng càng cần được bảo vệ khi bê.' },
              { t: 'Chồng ba thùng lên nhau rồi bê một lần cho nhanh', why: 'Thùng cao che mắt, quá nặng. Dễ té, dễ đau lưng.' },
              { t: 'Cúi gập lưng nhấc thùng, mình ngồi cả ngày nên cần vận động', why: 'Cúi gập lưng nhấc nặng dễ đau lưng, nhất là khi ít tập.' }
            ] }
        },
        byJob: {
          'dieu-duong': { q: 'Cần đỡ cụ ông từ giường sang xe lăn. Bạn làm thế nào?',
            opts: [
              { t: 'Bế bổng cụ lên một mình cho nhanh gọn, cụ đỡ phải chờ, đỡ ngại người khác', why: 'Bế người một mình rất dễ đau lưng cho bạn và nguy hiểm cho cụ.' },
              { t: 'Cúi gập lưng kéo tay cụ dậy thật nhanh cho xong việc', why: 'Kéo tay dễ làm cụ đau, cụ ngã; cúi gập lưng làm bạn đau lưng.' },
              { t: 'Dùng dụng cụ hỗ trợ theo hướng dẫn, nhờ thêm người, không tự bế một mình', ok: 1, why: 'Đúng rồi! Hướng dẫn phòng đau lưng của Nhật khuyên không bế người chỉ bằng sức mình, mà dùng dụng cụ hỗ trợ.' }
            ] },
          'thuc-pham': { q: 'Bao bột 25 kg cần đổ vào máy trộn. Bạn làm thế nào?',
            opts: [
              { t: 'Hai người cùng nâng hoặc dùng xe đẩy, giữ lưng thẳng khi đổ', ok: 1, why: 'Đúng rồi! Bao nặng thì chia sức hai người hoặc để máy làm thay.' },
              { t: 'Một mình vác bao lên vai rồi nghiêng người đổ vào máy cho nhanh', why: 'Vác nặng một mình rồi nghiêng người là dễ đau lưng nhất.' },
              { t: 'Cúi gập lưng ôm bao lên, cố một lần là xong', why: 'Cúi gập lưng nhấc nặng dễ đau lưng. Hạ hông, hoặc nhờ người.' }
            ] },
          'o-to': { q: 'Bạn cần đưa lốp xe từ kho ra xưởng. Làm thế nào?',
            opts: [
              { t: 'Ôm lốp lên ngang ngực rồi vặn người đặt luôn lên kệ cho nhanh gọn', why: 'Vặn người khi đang ôm vật nặng rất dễ đau lưng.' },
              { t: 'Kéo lê lốp trên sàn bằng một tay cho đỡ mỏi lưng', why: 'Kéo một tay làm lệch người, dễ đau vai, đau lưng.' },
              { t: 'Lăn lốp hoặc dùng xe đẩy; khi nhấc thì hạ hông, giữ sát người', ok: 1, why: 'Đúng rồi! Lốp nặng mà tròn: lăn hoặc dùng xe là nhẹ nhất cho lưng.' }
            ] }
        } }
    ],
    gtip: {
      xuong: 'Chi tiết kim loại vừa nặng vừa sắc: găng tay, hạ hông, ôm sát người.',
      chuyen: 'Kho của dây chuyền nhiều kệ cao: đồ nặng xếp ngăn thấp.',
      troi: 'Vật liệu công trường rất nặng: dùng xe, chia sức hai người.',
      dv: 'Đỡ người, xách xô nước: lưng thẳng, nhờ thêm người, dùng dụng cụ.',
      vp: 'Ít bê vác nên càng dễ đau lưng khi bất ngờ phải bê. Học tư thế ngay từ giờ.' } },

  { id: 'n4', t: 'Đứng lâu, ngồi lâu, làm lặp lại', ic: 'timer', sub: 'Giờ nào hay mỏi, giãn 2 phút giữa ca', min: 10,
    acts: [
      { id: 'n4a', k: 'ca', t: 'Một ca của nhóm mình', min: 4, xp: 10 },
      { id: 'n4b', k: 'flow', t: 'Giãn 2 phút giữa ca', min: 3, xp: 10, fx: 'midstretch', sec: 24 },
      { id: 'n4c', k: 'habit', t: 'Chọn 1 thói quen', min: 3, xp: 15 }
    ],
    gtip: {
      xuong: 'Đứng máy cả ca: đổi chân trụ, đi giày vừa chân, giãn bắp chân giờ nghỉ.',
      chuyen: 'Lặp một động tác cả ca: cổ tay, vai cần được giãn mỗi giờ nghỉ.',
      troi: 'Cúi, đào lâu: đứng thẳng, ưỡn nhẹ sau mỗi đoạn việc.',
      dv: 'Đi lại, cúi lau cả ngày: hạ hông khi cúi, tối về gác chân cao.',
      vp: 'Ngồi lâu: cứ 1 giờ đứng dậy, nhìn xa, giãn vai.' } },

  { id: 'n5', t: 'An toàn kiểu Nhật', ic: 'helmet', sub: 'Tìm nguy hiểm, vài từ tiếng Nhật, Senpai kể', min: 12,
    acts: [
      { id: 'n5a', k: 'spot', t: 'Tìm nguy hiểm trong kho', min: 4, xp: 10,
        rounds: [
          { art: 'kho', q: 'Đây là góc kho của một xưởng. Chạm 4 chỗ có thể gây tai nạn.',
            hs: [
              { x: 66, y: 22, r: 17, t: 'Thùng nặng để trên kệ cao', why: 'Đồ nặng trên cao dễ rơi trúng người. Đồ nặng xếp ngăn thấp.' },
              { x: 150, y: 50, r: 22, t: 'Xe đẩy chất thùng quá cao', why: 'Thùng cao che mắt người đẩy, dễ đổ khi xe rung.' },
              { x: 112, y: 164, r: 17, t: 'Dây điện vắt ngang lối đi', why: 'Dễ vấp ngã. Dây điện đi sát tường hoặc có nắp che.' },
              { x: 202, y: 168, r: 17, t: 'Vũng nước trên sàn', why: 'Sàn ướt dễ trượt. Thấy thì báo, lau khô hoặc đặt biển cảnh báo.' }
            ] }
        ] },
      { id: 'n5b', k: 'match', t: 'Vài từ an toàn bằng tiếng Nhật', min: 3, xp: 10,
        q: 'Ghép nghĩa tiếng Việt với chữ Nhật.', sub: 'Chạm một nghĩa, rồi chạm chữ Nhật hợp với nó.',
        sel: 'kwSel', no: 'kwNo', end: 'kwEnd',
        pairs: [
          { v: 'Nguy hiểm!', j: '危ない！', k: 'あぶない', r: 'abunai', why: 'Thấy nguy hiểm cho người khác thì nói to ngay.' },
          { v: 'Dừng lại!', j: '止めて！', k: 'とめて', r: 'tomete', why: 'Dùng khi cần ai đó dừng máy, dừng tay ngay.' },
          { v: 'Chú ý', j: '注意', k: 'ちゅうい', r: 'chūi', why: 'Hay gặp trên biển báo trong xưởng.' },
          { v: 'Cấm vào', j: '立入禁止', k: 'たちいりきんし', r: 'tachiiri kinshi', why: 'Thấy biển này thì không bước vào, kể cả khi đi tắt.' },
          { v: 'Đã kiểm tra, an toàn', j: 'ヨシ！', r: 'yoshi', why: 'Chỉ tay vào chỗ cần kiểm tra rồi nói to 「ヨシ！」 (指差し呼称).' },
          { v: 'Suýt xảy ra tai nạn', j: 'ヒヤリハット', r: 'hiyari hatto', why: 'Chuyện suýt xảy ra cũng phải báo, để lần sau không thành tai nạn thật.' }
        ] },
      { id: 'n5c', k: 'story', t: 'Senpai kể: đôi giày bảo hộ', min: 5, xp: 15,
        story: ['Anh T. sang Nhật làm xây dựng được 3 tháng.', 'Giày bảo hộ công ty phát nặng và cứng. Anh thấy đau chân, nhưng ngại nói với ai.', 'Anh ra cửa hàng mua đôi giày thể thao nhẹ, rẻ để đi làm. Anh nghĩ: “Mình cẩn thận là được.”', 'Một chiều cuối ca, mệt và vội, anh để vật nặng rơi trúng chân. Giày thường không đỡ được. Anh phải nghỉ làm gần hai tháng.', 'Quản lý của anh cũng bị công ty nhắc nhở vì đã không kiểm tra.'],
        end: 'Đồ bảo hộ không phải để đối phó khi có người kiểm tra. Nó giữ đôi chân, đôi tay để bạn làm trọn hợp đồng và về nhà lành lặn.',
        tips: ['Nếu là anh T., mình sẽ báo người phụ trách ngay khi giày làm đau chân để được đổi cỡ', 'Nếu là anh T., mình sẽ luôn đi giày bảo hộ, kể cả khi không ai kiểm tra'],
        rounds: [
          { q: 'Vì sao chân anh T. bị thương nặng như vậy?',
            opts: [
              { t: 'Vì vật rơi quá nặng, ai đi giày gì cũng sẽ bị như vậy thôi', why: 'Giày bảo hộ được làm ra chính để đỡ những lúc như vậy.' },
              { t: 'Vì công ty phát giày nặng nên anh mới phải đổi giày', why: 'Giày nặng là thật, nhưng chọn đổi giày mà không báo là quyết định của anh.' },
              { t: 'Vì anh không đi giày bảo hộ đúng chuẩn', ok: 1, why: 'Đúng rồi! Giày bảo hộ có mũi cứng để đỡ vật rơi. Giày thường thì không.' }
            ] },
          { q: 'Vì sao anh T. bỏ giày bảo hộ?',
            opts: [
              { t: 'Vì công ty không có quy định nào bắt phải đi giày bảo hộ khi làm việc', why: 'Công ty có quy định và đã phát giày. Anh biết điều đó.' },
              { t: 'Vì thấy đau, bất tiện mà không nói với ai, tự xử lý một mình', ok: 1, why: 'Đúng rồi! Gốc của chuyện là không báo. Có báo thì đã được đổi cỡ, lót thêm.' },
              { t: 'Vì giày bảo hộ chỉ cần khi có người kiểm tra thôi', why: 'Tai nạn không chờ lúc có người kiểm tra.' }
            ] },
          { q: 'Đáng lẽ anh T. nên làm gì khi giày làm đau chân?',
            opts: [
              { t: 'Chịu đau đi tiếp, không nói gì cho khỏi bị nghĩ là mình yếu', why: 'Chịu đau lâu ngày sẽ thành chấn thương khác. Báo sớm không phải là yếu.' },
              { t: 'Đi giày thường, khi nào có người kiểm tra thì đổi lại giày bảo hộ', why: 'Đó chính là điều đã dẫn đến tai nạn của anh T.' },
              { t: 'Báo người phụ trách để đổi cỡ hoặc lót thêm, vẫn đi giày bảo hộ', ok: 1, why: 'Đúng rồi! Đó là Hō-Ren-Sō: báo sớm, bàn cách, vẫn giữ an toàn.' }
            ] }
        ] }
    ],
    gtip: {
      xuong: 'Nhà xưởng nhiều máy chạy: không đeo trang sức, tóc dài buộc gọn, đủ kính và găng tay.',
      chuyen: 'Dây chuyền chạy liên tục: tay bị kẹt thì nói ngay 「止めて！」, không tự thò tay gỡ.',
      troi: 'Công trường: mũ bảo hộ, giày bảo hộ, làm trên cao thì móc dây an toàn.',
      dv: 'Sàn nhà hàng, nhà vệ sinh hay ướt: đi chậm, đặt biển cảnh báo khi lau.',
      vp: 'Làm thêm ở kho, ở bếp: đồ bảo hộ cũng quan trọng như nhân viên chính thức.' } },

  { id: 'n6', t: 'Bài bổ trợ cho nghề', ic: 'stretch', sub: '3 động tác của lớp Kiến thức nghề, lịch tập tuần', min: 13,
    acts: [
      { id: 'n6a', k: 'how', t: '3 động tác của nhóm mình', min: 4, xp: 10, exBy: N6_SET,
        more: 'Mỗi động tác: nam 20 cái × 2 hiệp, nữ 15 cái × 2 hiệp (yêu cầu của lớp Kiến thức nghề). Plank thì giữ theo sức.' },
      { id: 'n6b', k: 'try', t: 'Tập thử, ghi số', min: 5, xp: 15, exBy: N6_SET },
      { id: 'n6c', k: 'week', t: 'Lịch tập tuần của mình', min: 4, xp: 15 }
    ],
    gtip: {
      xuong: 'Nhà xưởng: tay sau khỏe để nhấc chi tiết, chân khỏe để đứng máy cả ca.',
      chuyen: 'Dây chuyền: lưng khỏe đỡ mỏi khi đứng lâu, chân linh hoạt khi đổi tư thế.',
      troi: 'Ngoài trời: gập hông lưng thẳng là nền của mọi lần nâng vật.',
      dv: 'Dịch vụ: bước ngang giống lúc đỡ người, lau sàn; bụng khỏe đỡ cho lưng.',
      vp: 'Văn phòng: tay, lưng, chân khỏe giúp ngồi thẳng, đỡ đau lưng.' } }
];

/* ---------- bản demo giáo viên ---------- */
var DEMO = {
  mem: { job: 'co-khi', g: 'xuong', sex: 'nam', inj: 0, goal: 'Chống đẩy được 30 cái liên tục trước khi bay', h: 168, w: 60, at: 0 },
  done: ['b1a', 'b1b', 'b1c', 'b2a', 'b2b', 'b2c', 'b4a'],
  log: { pushup: [{ n: 18, f: 2 }, { n: 22, f: 2 }], squat: [{ n: 30, f: 1 }] },
  refl: { b2c: 'Lần tới mình sẽ siết bụng, siết mông từ đầu đến cuối, không để hông võng xuống.',
    d1c: 'Bữa sáng mai mình sẽ ăn thêm một quả trứng và uống sữa thay cà phê.' },
  bepDone: ['d1a', 'd1b', 'd1c', 'd2a', 'd3a', 'd5b', 'n1a', 'n1b', 'n2a', 'n4a'],
  nghe: { body: ['lung', 'tay', 'chan'], lad: { nvt: 1, bl: 2, ch: 1, tm: 2 }, ca: { g: 'xuong', sel: [3, 5], sch: 1 } },
  food: { meal: { sang: ['Bánh mì không'], trua: ['Cơm', 'Cá', 'Canh rau'], toi: ['Mì gói'], skip: {} },
    calc: { h: 168, w: 60, age: 20, sex: 'nam', lv: 2 },
    shift: { s: 8, l: 9, pre: 0 },
    commit: { h: 'Ăn sáng trước khi đến lớp', txt: 'Khi chuông báo thức reo, mình sẽ dậy sớm 10 phút để ăn sáng', ago: 4, done: [0, 1, 3] } }
};
