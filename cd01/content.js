/* CD01 · Career Design 1 · cd01/content.js · CHỮ VÀ NỘI DUNG (sửa chữ ở đây, không đụng engine.js)
   Nguyên tắc của khóa: Career Design là thiết kế, không phải bài kiểm tra.
   - Không có đáp án đúng/sai. Mọi lựa chọn đều có cái được và cái mất.
   - Luôn có "Tùy hôm / Mình chưa chắc" và "Ý khác của mình".
   - Sau khi chọn: lời Senpai kể, câu hỏi tiếp, hoặc lời mời tìm hiểu thêm. Shin không khen, không chê lựa chọn.
   - [Tên] được thay bằng tên học viên (in đậm). {by} năm sinh, {y5} năm sau 5 năm, {age5} tuổi sau 5 năm.
   - Senpai có cờ draft:1 = LỜI KỂ MẪU do Claude viết, cần thay bằng chuyện thật (ẩn danh) trước khi phát hành.
   ES5. */
var CD_ID = 'cd01';
var CD_VER = 'CD01.0.1';
var CD_TOTAL = 19;            /* Xuất phát (1) + 7 ga (18 chặng) */
var CD_XP_ACT = 30, CD_XP_WARM = 10, CD_INS_WORDS = 20, CD_INS_FIELD = 5;

/* ---------- 7 ga + sân ga + Ga Ước Mơ ---------- */
var START = { id: 's0', n: 0, vn: 'Sân ga Xuất phát', k: '出発', kana: 'しゅっぱつ', ro: 'Shuppatsu · Xuất phát', lc: '#2F6BFF', ic: 'rail',
  sub: 'Hiểu chuyến tàu Career Design và viết mục tiêu của bạn', acts: ['x1'], card: 1,
  intro: 'Chào [Tên]! Trước khi tàu chạy, mình cùng xem chuyến tàu này là gì và [Tên] muốn mang về điều gì nhé.' };

var STATIONS = [
  { id: 's1', n: 1, vn: 'Ga Nhìn Xa', k: '未来', kana: 'みらい', ro: 'Mirai · Tương lai', lc: '#F07F1E', ic: 'mount', card: 2, ready: 1,
    sub: 'Nhìn mình của 5 năm sau từ những ngày bình thường', acts: ['a11', 'a13'], warm: 'w1',
    quote: { t: '5 năm là đơn vị thời gian tối thiểu cần thiết để thực hiện một việc gì đó.', by: 'Thầy Lê Long Sơn', src: 'TD – 07.01.2014' },
    intro: '5 năm nữa, [Tên] bao nhiêu tuổi, đang ở đâu, làm gì? Ở ga này không có câu trả lời đúng hay sai. Mình cùng nhìn xa một chút, bắt đầu từ chính những ngày bình thường của [Tên].',
    introShort: 'Nhìn mình của 5 năm sau',
    done: 'Bạn vừa nhìn mình xa hơn thường ngày một chút. Ô số 2 trong Bản Career Design đã có chữ của bạn.',
    word: { k: '未来', kana: 'みらい', ro: 'mirai', vn: 'tương lai' } },
  { id: 's2', n: 2, vn: 'Ga Biết Mình', k: '自分', kana: 'じぶん', ro: 'Jibun · Bản thân', lc: '#E0567F', ic: 'heart', card: 3,
    sub: 'Bạn thích gì, giỏi gì và điều gì quan trọng với bạn', acts: ['a21', 'a22', 'a23'] },
  { id: 's3', n: 3, vn: 'Ga Tính Cách', k: '性格', kana: 'せいかく', ro: 'Seikaku · Tính cách', lc: '#7A55D3', ic: 'spark', card: 4,
    sub: 'RIASEC 30 câu, trắc nghiệm ngành Tikme, chọn nghề', acts: ['a31', 'a32', 'a33'] },
  { id: 's4', n: 4, vn: 'Ga Ngành Nghề', k: '仕事', kana: 'しごと', ro: 'Shigoto · Công việc', lc: '#22A05E', ic: 'tool', card: 5,
    sub: 'Hiểu nghề bạn chọn và lộ trình của chính bạn', acts: ['a42', 'a44', 'a43'] },
  { id: 's5', n: 5, vn: 'Ga Chuyện Trò', k: '対話', kana: 'たいわ', ro: 'Taiwa · Chuyện trò', lc: '#2A74DB', ic: 'chat', card: 6,
    sub: 'Học từ Senpai đi trước, tìm người dẫn đường', acts: ['a51', 'a53'] },
  { id: 's6', n: 6, vn: 'Ga Định Hướng', k: '道のり', kana: 'みちのり', ro: 'Michinori · Chặng đường', lc: '#0F9F98', ic: 'compass', card: 7,
    sub: 'Kế hoạch ở JPC và 3–5 năm ở Nhật', acts: ['a62', 'a63'] },
  { id: 's7', n: 7, vn: 'Ga Thử Thách', k: '挑戦', kana: 'ちょうせん', ro: 'Chōsen · Thử thách', lc: '#DE3F35', ic: 'flag', card: 8,
    sub: 'Chuẩn bị cho thử thách, chọn việc khó, viết cam kết', acts: ['a71', 'a72', 'a73'] }
];
var FINAL = { id: 's8', n: 8, vn: 'Ga Ước Mơ', k: '夢', kana: 'ゆめ', ro: 'Yume · Ước mơ', lc: '#F2A20F', ic: 'star',
  sub: 'Nhận Bản Career Design 1 trang của bạn' };

/* ---------- Bản Career Design: 8 ô, mỗi ga điền một ô ---------- */
var CARDS = [
  { n: 1, t: 'Mục tiêu của tôi', st: 's0' },
  { n: 2, t: 'Phiên bản tôi muốn trở thành', st: 's1' },
  { n: 3, t: 'Ba vòng tròn của tôi', st: 's2' },
  { n: 4, t: 'Tính cách và nghề tôi chọn', st: 's3' },
  { n: 5, t: 'Nghề và lộ trình của tôi', st: 's4' },
  { n: 6, t: 'Senpai và người dẫn đường', st: 's5' },
  { n: 7, t: 'Kế hoạch ở JPC và ở Nhật', st: 's6' },
  { n: 8, t: 'Việc khó và cam kết', st: 's7' }
];

/* ---------- Lời Shin ---------- */
var SHIN_NAMES = ['Shin trứng', 'Shin gà con', 'Shin gà rừng', 'Shin đại bàng'];
var TXT = {
  introTitle: 'Thiết kế hành trình nghề nghiệp của bạn',
  introKicker: 'Career Design 01',
  intro: 'Chào [Tên]! Mình là <b>Shin</b>, bạn đồng hành trên chuyến tàu Career Design. Trên chuyến tàu này không có đáp án đúng hay sai, chỉ có câu trả lời thật của [Tên]. Đi hết 7 ga, [Tên] sẽ có một <b>Bản Career Design</b> của riêng mình.',
  introBtn: 'Chào Shin! Mình bắt đầu nhé',
  gateToast: 'Chính xác! Shin mê Oden lắm. Lên tàu thôi!',
  homeHi: ['Chào [Tên]! Hôm nay mình đi tiếp một ga nhé.', 'Chào [Tên]! Mỗi ga chỉ khoảng 10 phút thôi.', 'Chào [Tên]! Bản Career Design của bạn đang lớn dần đó.'],
  homeDone1: 'Ga Nhìn Xa xong rồi! Các ga tiếp theo đang được xây, [Tên] chờ Shin một chút nhé.',
  soon: 'Ga này đang được xây dựng. Bản xem thử hiện có Sân ga Xuất phát và Ga Nhìn Xa.',
  warmT: 'Khởi động 30 giây', warmSub: 'Không bắt buộc · +10 XP',
  stampBtn: 'Đóng dấu',
  redo: 'Bạn đã hoàn thành chặng này · Làm lại để ôn',
  noScore: 'Không có đúng sai · chọn điều thật với bạn',
  senpaiDraft: 'lời kể mẫu'
};

/* ---------- HOẠT ĐỘNG ---------- */
var ACTS = {
  /* ===== SÂN GA XUẤT PHÁT ===== */
  x1: { t: 'Lên tàu', mins: 5, st: 's0', d: 'Chuyến tàu này là gì, bạn đang ở đâu, bạn muốn mang về điều gì.',
    steps: [
      { k: 'say', mood: 'hi', t: 'Career Design là tự thiết kế hướng đi nghề nghiệp của chính bạn: <b>hiểu mình</b>, <b>hiểu nghề</b>, và biết <b>hôm nay bắt đầu từ đâu</b>. Không ai thiết kế thay [Tên] được.',
        rules: [
          ['check', 'Không có đúng hay sai', 'Chỉ có câu trả lời thật của bạn.'],
          ['info', '“Mình chưa chắc” cũng là một câu trả lời', 'Chưa rõ thì cứ chọn chưa rõ. Các ga sau sẽ giúp bạn nghĩ tiếp.'],
          ['people', 'Thầy cô đọc để hiểu bạn', 'Bài viết của bạn không dùng để chấm điểm.'],
          ['book', 'Đi hết 7 ga, bạn có Bản Career Design', 'Mỗi ga điền thêm một ô. Bạn xem lại trong Sổ tay bất cứ lúc nào.']
        ] },
      { k: 'pick', key: 'x1.now', scale: 1, q: 'Lúc này, khi nghĩ về nghề nghiệp sau này, bạn thấy mình thế nào?', sub: 'Chọn mức gần với bạn nhất. Cuối chuyến tàu, Shin sẽ hỏi lại câu này.',
        opts: [
          { v: '1', t: 'Chưa nghĩ tới nhiều', rep: 'Không sao cả. Nhiều anh chị cũng bắt đầu từ đây. Chuyến tàu này làm ra để giúp bạn nghĩ.' },
          { v: '2', t: 'Có vài ý, còn mơ hồ', rep: 'Vài ý là khởi đầu tốt rồi. Mình cùng xem ý nào thật sự là của bạn nhé.' },
          { v: '3', t: 'Đã có hướng, muốn rõ hơn', rep: 'Vậy các ga sau sẽ giúp hướng đó rõ ràng và cụ thể hơn.' },
          { v: '4', t: 'Đã khá rõ, muốn lập kế hoạch', rep: 'Vậy chuyến tàu này là dịp để bạn kiểm tra lại hướng đi và lập kế hoạch từng chặng.' }
        ] },
      { k: 'video', yt: 'PrgsXcJ_yGc', start: 10, url: 'https://www.youtube.com/watch?v=PrgsXcJ_yGc&t=10s', title: 'Những tấm gương anh chị học viên Esuhai',
        hint: 'Khi xem, thử để ý: họ bắt đầu từ đâu, đã chọn điều gì, và điều gì giúp họ đi xa.',
        key: 'x1.notice', q: 'Điều gì làm bạn để ý nhất?', sub: 'Chọn một hoặc vài ý.', min: 1, own: 'Điều mình để ý khác',
        opts: ['Họ bắt đầu từ hoàn cảnh giống mình', 'Họ dám chọn khác số đông', 'Họ học tiếng Nhật rất bền bỉ', 'Họ có người dẫn đường', 'Họ vượt qua lúc khó khăn', 'Mình chưa xem hết, sẽ xem lại sau'] },
      { k: 'write', q: 'Mục tiêu của bạn trên chuyến tàu này', sub: 'Viết bằng lời của bạn. Không cần hay, chỉ cần thật.',
        fields: [{ key: 'x1.goal', l: 'Sau khóa này, bạn muốn mình có được điều gì?', starter: 'Sau khóa này, mình muốn ', ph: 'Ví dụ: biết mình hợp nghề gì', min: 15, rows: 3 }],
        tips: ['Sau khóa này, mình muốn biết mình hợp với nghề nào hơn.', 'Sau khóa này, mình muốn trả lời được câu “Vì sao em chọn nghề này?” khi phỏng vấn.', 'Sau khóa này, mình muốn có kế hoạch học tiếng Nhật rõ ràng.', 'Sau khóa này, mình muốn bớt lo khi nghĩ về tương lai.'] },
      { k: 'say', mood: 'cheer', card: 1, t: 'Vé của [Tên] đã in! Ô số 1 trong <b>Bản Career Design</b> đã có chữ của bạn. Bấm <b>Đóng dấu</b> để lên tàu nhé.' }
    ] },

  /* ===== GA 1 · NHÌN XA · khởi động ===== */
  w1: { t: 'Khởi động · 5 năm nữa', mins: 1, st: 's1', warm: 1,
    steps: [
      { k: 'age', key: 'w1.where', q: 'Lúc đó, bạn đoán mình đang ở đâu?',
        opts: [
          { v: 'jp', t: 'Đang làm việc ở Nhật' },
          { v: 'vn', t: 'Đã về Việt Nam, đang đi làm' },
          { v: 'other', t: 'Ở một nơi khác' },
          { v: 'na', t: 'Mình chưa hình dung được' }
        ],
        rep: 'Nhiều anh chị đi Nhật khoảng 3–5 năm, nên 5 năm tới của bạn có thể gần trùng với chuyến đi. Dù bạn đoán thế nào, hai chặng ở ga này sẽ giúp bạn nhìn rõ hơn.' }
    ] },

  /* ===== GA 1 · CHẶNG 1 ===== */
  a11: { t: 'Mình thật sự hay làm gì?', mins: 5, st: 's1', d: '5 tình huống đời thường. Chọn điều bạn hay làm thật, không phải điều “nên” làm.',
    steps: [
      { k: 'say', mood: 'think', t: 'Ở chặng này <b>không có bên đúng, bên sai</b>. Bên nào cũng có cái được và cái mất. [Tên] chọn điều mình <b>thật sự hay làm</b> nhé. Nếu mỗi hôm mỗi khác, cứ chọn “Tùy hôm”.' },
      { k: 'dil', key: 'a11.p1', q: 'Nhận tiền lương hoặc tiền làm thêm tháng này, bạn thường…',
        a: { t: 'Mua ngay món mình thích từ lâu', get: 'Vui, tự thưởng cho công sức của mình', lose: 'Cuối tháng dễ hụt tiền' },
        b: { t: 'Chia ra: gửi nhà, để dành, rồi mới tiêu', get: 'Yên tâm hơn khi có việc gấp', lose: 'Phải chờ thêm mới mua được món thích' },
        senpai: { who: 'Anh khóa trước · ngành cơ khí', draft: 1, t: 'Tháng lương đầu ở Nhật, mình mua điện thoại mới ngay. Tháng sau mình tập chia tiền vào ba phong bì: gửi nhà, để dành, tiêu. Không cần hoàn hảo, quan trọng là mình tự quyết mỗi phong bì bao nhiêu.' } },
      { k: 'dil', key: 'a11.p2', q: 'Buổi tối rảnh sau giờ học, bạn thường…', calc: 1,
        a: { t: 'Lướt TikTok, xem phim cho đỡ mệt', get: 'Thư giãn, có khi còn học được điều hay', lose: 'Dễ quá giờ, sáng hôm sau mệt' },
        b: { t: 'Học thêm một chút rồi ngủ sớm', get: 'Mỗi ngày một ít, cộng dồn thành nhiều', lose: 'Phải cố khi đang mệt' },
        senpai: { who: 'Chị khóa trước · ngành điều dưỡng', draft: 1, t: 'Mình vẫn xem TikTok mỗi tối, nhưng hẹn giờ 20 phút. Hết giờ thì học 15 phút từ vựng. Giải trí không có lỗi, mình chỉ muốn tự chọn lúc dừng.' } },
      { k: 'dil', key: 'a11.p3', q: 'Gặp bài khó trên lớp mà chưa hiểu, bạn thường…',
        a: { t: 'Để đó, khi nào cần thì học lại', get: 'Đỡ áp lực lúc đó', lose: 'Chỗ chưa hiểu có thể lớn dần' },
        b: { t: 'Hỏi thầy cô hoặc bạn ngay', get: 'Hiểu chắc từ đầu', lose: 'Hơi ngại, sợ hỏi câu “ngốc”' },
        senpai: { who: 'Anh khóa trước · ngành xây dựng', draft: 1, t: 'Mình ngại hỏi trước lớp lắm. Mình nhắn riêng cho cô sau giờ học, đỡ ngại hơn nhiều. Sang Nhật mình cũng làm vậy: đợi lúc senpai rảnh rồi mới hỏi.' } },
      { k: 'dil', key: 'a11.p4', q: 'Sáng cuối tuần không có lịch gì, bạn thường…',
        a: { t: 'Ngủ bù cho đã', get: 'Lấy lại sức sau một tuần mệt', lose: 'Dễ lệch giờ ngủ sang thứ Hai' },
        b: { t: 'Dậy như mọi ngày, vận động, dọn phòng', get: 'Giữ nhịp, phòng gọn, đầu óc nhẹ', lose: 'Ít được nghỉ hơn' },
        senpai: { who: 'Chị khóa trước · ngành thực phẩm', draft: 1, t: 'Ca làm ở Nhật bắt đầu đúng giờ, kể cả sau cuối tuần. Mình chỉ ngủ thêm khoảng một tiếng, đỡ mệt mà thứ Hai không bị lệch giờ.' } },
      { k: 'dil', key: 'a11.p5', q: 'Bạn thân rủ nghỉ một buổi học để đi chơi, bạn thường…',
        a: { t: 'Đi luôn, lâu lâu mới có một lần', get: 'Vui, thêm gắn bó với bạn', lose: 'Lỡ bài hôm đó, có thể bị nhắc nhở' },
        b: { t: 'Hẹn bạn dịp khác', get: 'Không lỡ bài mà vẫn giữ được bạn', lose: 'Lần này không đi cùng, sợ bạn buồn' },
        senpai: { who: 'Anh khóa trước · ngành nông nghiệp', draft: 1, t: 'Mình từng đi vài lần, rồi phải chép lại bài khá vất vả. Sau đó mình rủ cả nhóm đi chơi chiều Chủ nhật. Vui như nhau mà không ai phải lo bài.' } },
      { k: 'recap', from: ['a11.p1', 'a11.p2', 'a11.p3', 'a11.p4', 'a11.p5'], labels: ['Tiền lương', 'Buổi tối', 'Bài khó', 'Cuối tuần', 'Bạn rủ đi chơi'],
        key: 'a11.try', q: 'Tuần này, bạn muốn thử làm khác đi ở tình huống nào?', keepT: 'Mình muốn giữ như hiện tại',
        fields: [{ key: 'a11.why', l: 'Vì sao bạn chọn như vậy?', ph: 'Viết thật, ngắn thôi cũng được', min: 15, rows: 3 }],
        tips: ['Mình muốn thử hẹn giờ lướt điện thoại 20 phút, vì sáng nào cũng buồn ngủ.', 'Mình giữ như hiện tại, vì mình thấy cách chi tiêu của mình đang ổn.', 'Mình muốn thử nhắn hỏi cô khi chưa hiểu, vì để lâu mình càng ngại.'] }
    ] },

  /* ===== GA 1 · CHẶNG 2 ===== */
  a13: { t: 'Hai phiên bản của tôi 5 năm sau', mins: 5, st: 's1', d: 'Bạn mong mình thành người thế nào, và những việc hằng ngày đang đưa bạn tới đâu.',
    steps: [
      { k: 'multi', key: 'a13.hope', q: '5 năm sau, bạn mong mình là người thế nào?', sub: 'Chọn tối đa 3 điều. Có thể tự thêm.', min: 1, max: 3, own: 'Điều mình mong khác',
        opts: ['Có một nghề vững tay', 'Nói tiếng Nhật tự tin', 'Khỏe mạnh, nhiều năng lượng', 'Lo được cho gia đình', 'Có một khoản để dành', 'Có bạn bè, mối quan hệ tốt', 'Dám thử việc mới', 'Được người khác tin tưởng'] },
      { k: 'multi', key: 'a13.day', q: 'Một ngày bình thường của bạn có những việc nào?', sub: 'Chọn ít nhất 3 việc, đúng như thật nhé. Không ai chấm điểm danh sách này.', min: 3, own: 'Việc khác mình hay làm',
        opts: ['Dậy trước 6 giờ', 'Thức sau 12 giờ đêm', 'Lướt mạng xã hội', 'Chơi game', 'Học tiếng Nhật ngoài giờ', 'Tập thể dục', 'Đi làm thêm', 'Nấu ăn', 'Gọi điện về nhà', 'Dọn phòng', 'Đến lớp sát giờ', 'Ăn vặt, uống trà sữa', 'Ghi chép chi tiêu', 'Đi chơi với bạn', 'Xem video học kỹ năng'] },
      { k: 'tag', key: 'a13.tag', from: 'a13.day', hope: 'a13.hope',
        q: 'Mỗi việc đang đưa bạn lại gần hay kéo ra xa điều bạn mong?',
        sub: 'Cùng một việc, mỗi người xếp khác nhau. Chơi game có thể giúp bạn thư giãn, cũng có thể lấy mất giờ ngủ. Bạn tự quyết.',
        opts: [['g', 'Lại gần'], ['x', 'Ra xa'], ['u', 'Chưa biết']] },
      { k: 'write', twin: 1, from: 'a13.tag', q: 'Hai phiên bản của bạn sau 5 năm', sub: 'Đây là cách bạn vừa xếp. Dựa vào đó, viết hai phiên bản. Viết thật, không cần đẹp.',
        fields: [
          { key: 'a13.keep', l: 'Nếu 5 năm tới mọi thứ vẫn như bây giờ', starter: 'Mình sẽ ', ph: 'Ví dụ: vẫn làm được việc, nhưng…', min: 15, rows: 3, tag: 'Giữ nguyên' },
          { key: 'a13.change', l: 'Nếu đổi được 1–2 việc nhỏ', starter: 'Mình sẽ ', ph: 'Ví dụ: nói chuyện công việc bằng tiếng Nhật…', min: 15, rows: 3, tag: 'Đổi 1–2 việc' }
        ],
        tips: ['Giữ nguyên: mình vẫn làm được việc, nhưng chắc tiếng Nhật chỉ đủ dùng hằng ngày, và hay mệt vì thức khuya.', 'Đổi 1–2 việc: mình nói chuyện công việc bằng tiếng Nhật được, khỏe hơn, có khoản để dành gửi về nhà.'] },
      { k: 'write', q: 'Phiên bản bạn muốn trở thành', sub: 'Câu này sẽ nằm ở ô số 2 trong Bản Career Design của bạn.',
        fields: [
          { key: 'a13.me', l: 'Viết một câu về con người bạn muốn trở thành', starter: '5 năm sau, mình muốn là một người ', ph: 'Ví dụ: có nghề vững tay và lo được cho ba mẹ', min: 15, rows: 2 },
          { key: 'a13.first', l: 'Việc nhỏ đầu tiên bạn muốn thử từ tuần này', ph: 'Ví dụ: tắt điện thoại lúc 23 giờ', min: 8, rows: 2, noIns: 1 }
        ],
        tips: ['5 năm sau, mình muốn là một người có tay nghề, nói tiếng Nhật tự tin và được đồng nghiệp tin tưởng.', 'Việc nhỏ đầu tiên: mỗi tối học 10 từ vựng trước khi lướt điện thoại.'] }
    ] }
};

/* Thứ tự học (chặng chính). Ga chưa có hoạt động (ready:0) hiện "đang xây dựng". */
var ORDER = ['x1', 'a11', 'a13'];

/* ---------- Bản demo giáo viên: một học viên giả đã xong Xuất phát + Ga 1 ---------- */
var DEMO_DATA = {
  prof: { name: 'Nguyễn Văn An', by: '2005', sid: 'HV2026-0123', cls: 'E696', path: 'Ikusei Shuro' },
  intro: 1,
  done: { x1: 1763260000000, w1: 1763260000000, a11: 1763260000000, a13: 1763260000000 },
  d: {
    'x1.now': '2', 'x1.notice': ['Họ bắt đầu từ hoàn cảnh giống mình', 'Họ học tiếng Nhật rất bền bỉ'],
    'x1.goal': 'Sau khóa này, mình muốn biết mình hợp với nghề cơ khí hay nghề hàn hơn, và có kế hoạch học tiếng Nhật rõ ràng.',
    'w1.where': 'jp',
    'a11.p1': 'b', 'a11.p2': 'a', 'a11.p3': 'm', 'a11.p4': 'a', 'a11.p5': 'b', 'a11.mins': 15,
    'a11.try': 'a11.p2', 'a11.why': 'Mình muốn thử hẹn giờ lướt điện thoại 20 phút, vì sáng nào lên lớp mình cũng buồn ngủ.',
    'a13.hope': ['Có một nghề vững tay', 'Lo được cho gia đình', 'Nói tiếng Nhật tự tin'],
    'a13.day': ['Thức sau 12 giờ đêm', 'Lướt mạng xã hội', 'Đi làm thêm', 'Gọi điện về nhà', 'Học tiếng Nhật ngoài giờ'],
    'a13.tag': { 'Thức sau 12 giờ đêm': 'x', 'Lướt mạng xã hội': 'u', 'Đi làm thêm': 'g', 'Gọi điện về nhà': 'g', 'Học tiếng Nhật ngoài giờ': 'g' },
    'a13.keep': 'Mình sẽ vẫn làm được việc, nhưng chắc tiếng Nhật chỉ đủ dùng hằng ngày và hay mệt vì thức khuya.',
    'a13.change': 'Mình sẽ nói chuyện công việc bằng tiếng Nhật, khỏe hơn và có khoản để dành sửa nhà cho ba mẹ.',
    'a13.me': '5 năm sau, mình muốn là một người thợ cơ khí vững tay, nói tiếng Nhật tự tin và lo được cho ba mẹ.',
    'a13.first': 'Tắt điện thoại lúc 23 giờ, trước đó học 10 từ vựng.'
  }
};
