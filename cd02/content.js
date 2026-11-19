/* CD02 · Career Design 2 · Hải Đồ La Bàn · cd02/content.js · CHỮ VÀ NỘI DUNG (sửa chữ ở đây).
   Câu chuyện: Shin (gà lớn, đã xong 3 năm ở Nhật) làm thuyền trưởng dẫn đường ở CẢNG 3 NĂM.
   Học viên nhận một con thuyền nhỏ và hải đồ phủ sương mù: sương = các hướng đi chưa biết.
   Ghé bến, gặp Senpai, sương tan, đảo hiện ra. Không tuyến tính: bến trong cùng một vòng đi thứ tự nào cũng được.
   Nguyên tắc (thầy chốt 16–18/11/2026):
   - CD là Design, KHÔNG chấm đúng/sai. Mọi lựa chọn đều có thật, có cái được, cái mất. Luôn có “Chưa chắc” hoặc ô viết riêng.
   - Chữ cho điện thoại: câu ngắn, một ý một câu, không giảng giải dài.
   - Không dùng chữ “hải tặc”, không cờ đầu lâu, không lệnh truy nã. Thế giới, tàu, bản đồ là của khóa (không mượn hình truyện nào).
   - Biển và đảo hư cấu, không phải bản đồ thật.
   - Senpai: người thật, chuyện đã đăng công khai trên Tikme / esuhai.vn, JLPT N3 trở lên (2 người chưa ghi JLPT: anh Hợi, chị Kim Thanh, đã xong 3 năm).
     Câu trong ngoặc kép là nguyên văn trong bài đăng. Ba khung Khởi đầu · Bước ngoặt · Hôm nay là khóa học tóm lại, có link bài gốc.
     Không kể chi tiết chuyện buồn riêng tư của người thật.
   - Ý của thầy Lê Long Sơn nói gián tiếp: “thầy của Shin”. Không ghi tên Thầy trên giao diện CD02.
   - Không dùng từ “đơn hàng”. ES5. */
var CD2_ID = 'cd02';
var CD2_VER = 'CD02.1.1';
var CD2_XP_ACT = 30, CD2_INS_WORDS = 15, CD2_INS_FIELD = 5, CD2_XP_CARD = 2;
var CD2_TOTAL = 18; /* Xuất phát 1 + Bến 1–5 × 3 chặng + Bến 6 × 2 chặng. Cảng Khởi Hành (f1, f2) không tính. */

/* ---------- 8 ĐẢO = 8 HƯỚNG ĐI SAU 3 NĂM ----------
   side: 'jp' ở Nhật · 'vn' về Việt Nam · 'both' cả hai. x, y: vị trí trên hải đồ (hệ 360 × 460). */
var ISLES = [
  { id: 'len', n: 'Đảo Lên Nấc', ic: 'stairs', side: 'jp', x: 62, y: 62,
    sub: 'Ở lại Nhật, lên nấc mới trong nghề',
    what: 'Ở lại công ty hoặc cùng nghề. Thi chuyển diện để làm lâu hơn, nhận việc khó hơn, kèm người mới.',
    need: ['Tay nghề vững, được công ty tin', 'Tiếng Nhật đủ dùng trong công việc', 'Đậu kỳ thi tay nghề, tiếng Nhật của diện mới'],
    gain: 'Vị trí, thu nhập tăng dần. Có diện cho làm lâu dài và đưa gia đình sang (theo điều kiện từng diện).',
    cost: 'Xa quê lâu hơn. Phải tự học, tự thi liên tục.',
    who: ['sy', 'taih', 'ngat'] },
  { id: 're', n: 'Đảo Rẽ Nghề', ic: 'turn', side: 'jp', x: 182, y: 34,
    sub: 'Ở lại Nhật, rẽ sang việc khác',
    what: 'Thi chứng chỉ ngành khác, hoặc nhờ tiếng Nhật tốt mà chuyển sang việc văn phòng, thông dịch.',
    need: ['Tiếng Nhật cao hơn mức dùng ở xưởng', 'Học và thi chứng chỉ của ngành mới', 'Tìm hiểu kỹ ngành mới trước khi chọn'],
    gain: 'Thử một nghề hợp mình hơn mà vẫn ở Nhật.',
    cost: 'Bắt đầu lại ở chỗ mới. Giai đoạn đầu vất vả.',
    who: ['linh', 'long', 'ploan'] },
  { id: 'hoc', n: 'Đảo Học Tiếp', ic: 'cap', side: 'both', x: 302, y: 62,
    sub: 'Học lên: du học, liên thông, học nghề mới',
    what: 'Dùng tiếng Nhật và tiền tích lũy để học lên, rồi đi tiếp bằng con đường mới.',
    need: ['Tiếng Nhật N2 trở lên nếu học ở Nhật', 'Kế hoạch tiền học và chi tiêu', 'Biết rõ mình học để làm gì'],
    gain: 'Bằng cấp, nghề mới, mở thêm nhiều cửa.',
    cost: 'Mất thời gian. Thu nhập giảm trong lúc học.',
    who: ['tait', 'tan'] },
  { id: 'gio', n: 'Đảo Gió Hai Chiều', ic: 'wind', side: 'both', x: 312, y: 214,
    sub: 'Đi rồi về, rồi lại đi',
    what: 'Về nước một thời gian, rồi quay lại Nhật bằng diện khác, công việc khác.',
    need: ['Hồ sơ đẹp, giữ chữ tín với công ty', 'Tiếp tục học tiếng Nhật khi ở nhà', 'Tìm hiểu kỹ điều kiện của diện mới'],
    gain: 'Thử cả hai nơi. Mỗi lần đi lên thêm một nấc.',
    cost: 'Nhiều lần chia xa. Giấy tờ mỗi lần một khác.',
    who: ['dung', 'hoa'] },
  { id: 'chu', n: 'Đảo Chữ Nhật', ic: 'speech', side: 'both', x: 316, y: 382,
    sub: 'Đổi nghề nhờ tiếng Nhật',
    what: 'Tiếng Nhật thành nghề chính: giáo viên, phiên dịch, kỹ sư cầu nối, nhân sự…',
    need: ['Tiếng Nhật N2 đến N1', 'Học thêm kỹ năng của nghề mới (dạy học, lập trình…)', 'Kiên trì thi nhiều lần'],
    gain: 'Một nghề dùng chính tiếng Nhật. Giúp được nhiều người.',
    cost: 'Phải học rất bền. Thu nhập lúc đầu có thể chưa cao.',
    who: ['mai', 'xuan', 'son', 'quy', 'lich'] },
  { id: 'lap', n: 'Đảo Tự Lập', ic: 'shop', side: 'vn', x: 182, y: 416,
    sub: 'Về Việt Nam tự làm chủ',
    what: 'Mang tay nghề, cách làm việc kiểu Nhật về mở cửa hàng, xưởng, công ty riêng.',
    need: ['Tay nghề và quy trình học được ở Nhật', 'Vốn tích lũy và kế hoạch rõ ràng', 'Mối quan hệ, khách hàng đầu tiên'],
    gain: 'Tự quyết. Tạo việc làm cho người khác.',
    cost: 'Rủi ro cao. Có lúc thất bại phải làm lại.',
    who: ['hoi', 'thao', 'vinh'] },
  { id: 'cau', n: 'Đảo Cầu Nối', ic: 'bridge', side: 'vn', x: 50, y: 382,
    sub: 'Về Việt Nam làm cho công ty Nhật',
    what: 'Làm ở công ty Nhật tại Việt Nam, hoặc chi nhánh của chính công ty mình từng làm.',
    need: ['Tiếng Nhật N2 là lợi thế lớn', 'Hiểu cách làm việc kiểu Nhật', 'Giữ liên lạc tốt với công ty cũ'],
    gain: 'Vị trí tốt, có thể lên quản lý. Gần gia đình.',
    cost: 'Thu nhập lúc đầu có thể thấp hơn ở Nhật. Phải học thêm cách quản lý.',
    who: ['thuy', 'hoai', 'hien', 'hang', 'kthanh'] },
  { id: 'que', n: 'Đảo Quê Nhà', ic: 'home', side: 'vn', x: 48, y: 214,
    sub: 'Gia đình là ưu tiên',
    what: 'Chọn việc, chọn nơi sống theo điều gia đình cần nhất, ngay bây giờ hoặc sau vài năm.',
    need: ['Kế hoạch tiết kiệm rõ ràng', 'Một nghề, một kỹ năng mang về dùng được', 'Tìm hiểu việc gần nhà trước khi về'],
    gain: 'Gần người thân. Góp sức cho gia đình, cho quê.',
    cost: 'Ít cơ hội hơn thành phố lớn. Phải tự tạo cơ hội.',
    who: ['huan', 'hung'] }
];
/* nghề (mã giống CD01 · INDS) dùng khi học viên chưa học CD01 */
var INDS2 = [['co-khi', 'Cơ khí'], ['dien-tu', 'Điện tử'], ['han', 'Hàn'], ['son', 'Sơn'], ['duc-nhua', 'Đúc nhựa'], ['dong-goi-cong-nghiep', 'Đóng gói công nghiệp'],
  ['in-an', 'In ấn'], ['may-mac', 'May mặc'], ['xay-dung', 'Xây dựng'], ['o-to', 'Ô tô'], ['nong-nghiep', 'Nông nghiệp'], ['thuy-san', 'Thủy sản'],
  ['thuc-pham', 'Thực phẩm'], ['dieu-duong', 'Kaigo · Chăm sóc'], ['nha-hang', 'Nhà hàng · Khách sạn'], ['ve-sinh-toa-nha', 'Vệ sinh tòa nhà'], ['ky-su', 'Kỹ sư công nghệ']];
var ISLE_SIDE ={ jp: 'Ở Nhật', vn: 'Về Việt Nam', both: 'Ở Nhật hoặc về Việt Nam' };

/* ---------- THẺ SENPAI (người thật, chuyện đã công khai) ----------
   ind: mã ngành như CD01 (INDS) để lọc “cùng nghề”. q: câu nguyên văn trong bài (để trống nếu không trích).
   f: điểm chung (CD2_F) khóa học thấy trong bài, dùng ở Bến Senpai. */
var TIK = 'https://tikme.com/cau-chuyen-thanh-cong/';
var ESU = 'https://esuhai.vn/news/';
var SENPAI = [
  { id: 'sy', n: 'Thân Quốc Sỹ', a: 'Anh Sỹ', jl: 'N2', job: 'Đóng gói công nghiệp', ind: 'dong-goi-cong-nghiep', from: 'Đồng Nai', jp: 'Gifu', isl: 'len',
    tag: 'TTS → Kỹ năng đặc định 1 → Kỹ năng đặc định 2, 8 năm một công ty',
    kd: 'Năm 2017, anh sang Gifu làm TTS ngành đóng gói. Những ngày đầu thấy lạc lõng, anh chọn quan sát và học từ đồng nghiệp.',
    bn: 'Trong 3 năm anh đạt N2. Hết 3 năm đúng dịp dịch bệnh, công ty tạo điều kiện cho anh thi tay nghề, lên Kỹ năng đặc định 1.',
    nay: 'Anh lên Kỹ năng đặc định 2, cả 8 năm gắn bó một công ty, hướng tới làm việc lâu dài ở Nhật.',
    q: 'Khi công ty thấy bạn thật sự cố gắng và chủ động phát triển bản thân, họ sẽ sẵn sàng tạo điều kiện để bạn tiến xa hơn.',
    url: TIK + 'than-quoc-sy', src: 'Tikme', f: ['jp', 'rel'] },
  { id: 'taih', n: 'Nguyễn Hữu Tài', a: 'Anh Hữu Tài', jl: 'N1', job: 'Hàn (đóng tàu)', ind: 'han', from: 'Vĩnh Long', jp: 'Hiroshima', isl: 'len',
    tag: 'Thợ hàn đóng tàu → Kỹ năng đặc định 2',
    kd: 'Học ở Esuhai từ 4/2018, anh sang Nhật làm hàn bán tự động trong ngành đóng tàu.',
    bn: 'Anh vừa làm vừa học tiếng Nhật đến N1, luyện tay nghề để thi lên diện cao hơn.',
    nay: 'Tháng 10/2023 anh đậu Kỹ năng đặc định 2 ngành Đóng tàu. Theo bài viết, anh là một trong 3 người nước ngoài đầu tiên đậu kỳ thi này.',
    q: 'Nhật Bản mang đến một cơ hội, Esuhai chính là một bệ phóng. Phần còn lại là sự cố gắng không ngừng của chính bản thân để biến cơ hội thành thành công.',
    url: TIK + 'nguyen-huu-tai', src: 'Tikme', f: ['jp'] },
  { id: 'ngat', n: 'Dương Thị Hồng Ngát', a: 'Chị Ngát', jl: 'N2', job: 'Thực phẩm', ind: 'thuc-pham', from: 'TP.HCM', jp: 'Nhật Bản', isl: 'len',
    tag: 'Sản xuất mì → được mời lên làm văn phòng',
    kd: 'Khi còn học Đại học Công nghiệp Thực phẩm, chị biết Esuhai và chọn sang Nhật làm việc, học tập.',
    bn: 'Chị làm ở công ty sản xuất mì cho cửa hàng tiện lợi. Nhóm 13 bạn cùng đi giúp nhau suốt chặng đường. Chị đạt N2.',
    nay: 'Gần hết hạn, công ty mời chị ở lại, chuyển lên văn phòng. Chị về nước làm thủ tục rồi quay lại ở vị trí cao hơn.',
    q: 'Kinh nghiệm của mình là hãy cố gắng tiếp xúc với người Nhật càng nhiều càng tốt, khi đó chúng ta sẽ thấy những cuộc nói chuyện có rất nhiều niềm vui, những điều thú vị chứ không phải là một cái gì đó áp lực.',
    url: ESU + '3EEF6/nghe-podcast-duong-thi-hong-ngat-minh-duoc-quay-lai-nhat-ban-o-vi-tri-cong-viec-cao-hon.html', src: 'Esuhai', f: ['jp', 'rel'] },
  { id: 'linh', n: 'Nguyễn Thị Thùy Linh', a: 'Chị Linh', jl: 'N1', job: 'Thủy sản', ind: 'thuy-san', from: 'TP.HCM', jp: 'Hokkaido', isl: 're',
    tag: 'TTS chế biến thủy sản → thông dịch viên ở nghiệp đoàn',
    kd: 'Thời đại học, chị chỉ định học thử tiếng Nhật. Năm 2017, chị sang Hokkaido làm TTS chế biến thủy sản.',
    bn: 'Dáng người nhỏ, nhiều người không tin chị làm nổi. Chị dốc sức và đạt N1 sau gần 4 năm ở Nhật.',
    nay: 'Chị được nghiệp đoàn nhận làm thông dịch viên và quản lý thực tập sinh tại Nhật.',
    q: '…dù người ta không tin vào mình thì mình cũng phải dốc toàn lực, khi ấy mình sẽ được đền đáp xứng đáng.',
    url: ESU + '3EDB6/nghe-podcast-nguyen-thi-thuy-linh-minh-may-man-dat-n1-va-duoc-nghiep-doan-nhan-vao-lam-tai-nhat.html', src: 'Esuhai', f: ['jp', 'learn', 'change'] },
  { id: 'long', n: 'Vũ Hoàng Long', a: 'Anh Long', jl: 'N1', job: 'Đóng gói công nghiệp', ind: 'dong-goi-cong-nghiep', from: 'Đồng Nai', jp: 'Shizuoka', isl: 're',
    tag: 'Bộ đội → TTS đóng gói → N1 + chứng chỉ Kaigo',
    kd: 'Tốt nghiệp cao đẳng, anh nhập ngũ 2 năm để rèn ý chí, rồi tìm đến Esuhai vì thích Nhật Bản.',
    bn: 'Ở Shizuoka, anh tự học mỗi ngày sau giờ làm, lần lượt đậu N4, N3, N2.',
    nay: 'Tháng 2/2026, xong 3 năm, anh có N1 và chứng chỉ Kỹ năng đặc định ngành Kaigo. Anh có thể về Việt Nam, hoặc quay lại Nhật làm ngành mới.',
    q: 'Nền tảng và phương pháp học từ Esuhai là bước đệm quan trọng. Nhưng để đạt được thành công cần có sự kiên trì, kỷ luật và tinh thần tự học mỗi ngày.',
    url: TIK + 'vu-hoang-long', src: 'Tikme', f: ['jp', 'learn', 'change'] },
  { id: 'ploan', n: 'Vũ Ngọc Phương Loan', a: 'Chị Phương Loan', jl: 'N2', job: 'Thực phẩm', ind: 'thuc-pham', from: '', jp: 'Tochigi', isl: 're',
    tag: 'Chọn 5 năm, rồi chuyển sang ngành Nhà hàng',
    kd: 'Được một chị Senpai giới thiệu, chị chọn Esuhai và sang Tochigi làm chế biến thực phẩm cho siêu thị.',
    bn: 'Lúc đầu tiếng Nhật đời sống khác sách vở. Chị vẫn học đến N2 và chọn ở 5 năm thay vì 3 năm.',
    nay: 'Chị đang chuyển sang Kỹ năng đặc định ngành Nhà hàng để tiếp tục phát triển ở Nhật.',
    q: 'Việc định cư ở Nhật sẽ là tùy duyên, nhưng trước mắt mình muốn sẽ tiếp tục ở Nhật để phát triển.',
    url: ESU + '3EDE1/nghe-podcast-vu-ngoc-phuong-loan-minh-chon-5-nam-thay-vi-3-nam.html', src: 'Esuhai', f: ['jp', 'change'] },
  { id: 'tait', n: 'Nguyễn Tấn Tài', a: 'Anh Tấn Tài', jl: 'N1', job: 'Sơn', ind: 'son', from: 'Vĩnh Long', jp: 'Kagawa', isl: 'hoc',
    tag: 'Đi Nhật để giỏi tiếng → N1 → dự định du học',
    kd: 'Anh học Du lịch, đi làm thấy không đúng đam mê, sang văn phòng vẫn chán. Là con một, anh thuyết phục gia đình cho sang Nhật.',
    bn: 'Biết việc ở Nhật là việc tay chân, anh dùng 3 năm để học tiếng thật giỏi và đậu N1.',
    nay: 'Anh dự định đi du học, và ấp ủ cùng bạn bè mở trung tâm tư vấn du học.',
    q: 'Khi sống và làm việc tại một đất nước mới, việc giỏi ngôn ngữ là điều bắt buộc nếu muốn tiến xa hơn.',
    url: TIK + 'nguyen-tan-tai', src: 'Tikme', f: ['jp', 'learn', 'goal', 'change'] },
  { id: 'tan', n: 'Trần Tư Tân', a: 'Anh Tân', jl: 'N2', job: 'Thủy sản', ind: 'thuy-san', from: 'Đồng Nai', jp: 'Nhật Bản', isl: 'hoc',
    tag: 'TTS thủy sản → liên thông đại học → quay lại Nhật ngành Nhà hàng',
    kd: 'Anh từng làm TTS thủy sản 3 năm ở Nhật và muốn quay lại để phát triển lâu dài.',
    bn: 'Về nước, anh học liên thông đại học tại Trường Đại học Lạc Hồng.',
    nay: 'Anh trúng tuyển chương trình Nhân sự cao cấp ngành Nhà hàng – Khách sạn, hướng tới làm việc lâu dài ở Nhật.',
    q: 'Nỗi sợ lớn nhất không phải là bắt đầu lại, mà là để cuộc đời trôi vô định. Đừng chờ cơ hội gõ cửa, hãy tự mở cánh cửa tương lai.',
    url: TIK + 'tran-tu-tan', src: 'Tikme', f: ['jp', 'change'] },
  { id: 'dung', n: 'Kim Hoàng Dũng', a: 'Anh Dũng', jl: 'N2', job: 'Hàn', ind: 'han', from: 'Đồng Tháp', jp: 'Osaka', isl: 'gio',
    tag: 'Pha chế → thợ hàn ở Osaka → về rồi định quay lại',
    kd: 'Học xong lớp 12, anh làm pha chế, thấy hoang mang vì chưa có mục tiêu. Được gia đình ủng hộ, anh quyết định đi Nhật.',
    bn: 'Anh làm hàn 3 năm ở Osaka. Anh thi N2 bốn lần mới đậu.',
    nay: 'Về nước, anh dự định quay lại Nhật thêm 3–4 năm để tích lũy, rồi học về tài chính, đầu tư.',
    q: '',
    url: TIK + 'kim-hoang-dung', src: 'Tikme', f: ['jp', 'retry', 'fam'] },
  { id: 'hoa', n: 'Hồ Vĩnh Hòa', a: 'Anh Hòa', jl: 'N3', job: 'Xây dựng', ind: 'xay-dung', from: '', jp: 'Nhật Bản', isl: 'gio',
    tag: 'Xây dựng → về nước → định quay lại làm chăm sóc',
    kd: 'Năm 2019 anh sang Nhật làm xây dựng. Lúc đầu anh còn e dè khi nói chuyện với người Nhật.',
    bn: 'Năm đầu ít việc, anh tranh thủ học sau giờ làm, học cả từ bảng thông tin ở ga tàu. Anh đạt N3.',
    nay: 'Về nước tháng 7/2022, anh định quay lại Nhật lần nữa, làm công việc chăm sóc.',
    q: 'Chỉ cần cố gắng giao tiếp hoặc bắt chuyện cùng người Nhật tại công ty, bạn sẽ cải thiện được phát âm của mình.',
    url: ESU + '3EDB7/my-way--con-duong-toi-chon-ho-vinh-hoa-hoc-tieng-nhat-tu-viec-quan-sat-thong-tin-tren-ga-tau-dien.html', src: 'Esuhai', f: ['learn', 'change'] },
  { id: 'mai', n: 'Đào Thị Mai', a: 'Chị Mai', jl: 'N1', job: 'Điện tử', ind: 'dien-tu', from: 'Quảng Ngãi', jp: 'Osaka', isl: 'chu',
    tag: 'TTS điện tử → N1 → giáo viên tiếng Nhật',
    kd: 'Chị từng sống không mục tiêu, ngày nào cũng như ngày nào. Đến Esuhai, được thầy cô động viên, chị bắt đầu trang mới.',
    bn: 'Ở Nhật, chị ôn tiếng Nhật 2 giờ mỗi sáng trước khi đi làm.',
    nay: 'Về nước với N1, chị dạy tiếng Nhật tại Esuhai.',
    q: 'Cho dù thất bại cũng được, sai cũng được, nhưng bạn đừng bỏ cuộc, hãy học tập tích cực.',
    url: TIK + 'dao-thi-mai', src: 'Tikme', f: ['jp', 'learn'] },
  { id: 'xuan', n: 'Bùi Thị Hoa Xuân', a: 'Chị Xuân', jl: 'N1', job: 'Thủy sản', ind: 'thuy-san', from: 'TP.HCM', jp: 'Hokkaido', isl: 'chu',
    tag: 'TTS thủy sản Hokkaido → giáo viên tiếng Nhật',
    kd: 'Lúc đầu chị chưa rõ sang Nhật để làm gì. Học ở Esuhai hơn 10 tháng, chị yêu tiếng Nhật hơn.',
    bn: 'Ở Hokkaido, đồng nghiệp chăm sóc khi chị ốm, an ủi lúc chị nhớ nhà. Chị đạt N1.',
    nay: 'Về nước tháng 2/2022, chị quay lại Esuhai làm giáo viên tiếng Nhật.',
    q: 'Nếu có cơ hội được chọn lại, mình vẫn chọn vùng đất Hokkaido - tuy lạnh nhưng ấm áp tình người ấy!',
    url: TIK + 'bui-thi-hoa-xuan', src: 'Tikme', f: ['jp', 'rel'] },
  { id: 'son', n: 'Nguyễn Thị Son', a: 'Chị Son', jl: 'N1', job: 'Thực phẩm', ind: 'thuc-pham', from: 'Vĩnh Long', jp: 'Ehime', isl: 'chu',
    tag: 'Đi Nhật để giúp gia đình → giáo viên',
    kd: 'Tốt nghiệp đại học, chị đổi nhiều việc mà thu nhập vẫn bấp bênh. Chị sang Nhật để phụ giúp gia đình.',
    bn: 'Ở Ehime, chị vừa làm vừa học đến N1.',
    nay: 'Từ người đi Nhật để kiếm tiền, chị trở thành giáo viên, truyền cảm hứng cho các bạn trẻ.',
    q: 'Khó khăn không phải là điểm dừng, mà là cơ hội để mỗi người khám phá sức mạnh của chính mình.',
    url: TIK + 'nguyen-thi-son', src: 'Tikme', f: ['jp', 'fam', 'change'] },
  { id: 'quy', n: 'Võ Trọng Quý', a: 'Anh Quý', jl: 'N1', job: 'In ấn', ind: 'in-an', from: 'Vĩnh Long', jp: 'Kagawa', isl: 'chu',
    tag: 'TTS in ấn → N1 → dạy tiếng Nhật online',
    kd: 'Vừa học xong cấp 3, anh mê tiếng Nhật. Thấy anh chị trong nhà đi Nhật về có việc ổn định, anh đăng ký TTS ngành In ấn.',
    bn: 'Ở Kagawa, anh học bền bỉ và đậu N1.',
    nay: 'Về nước năm 2022, anh dạy tiếng Nhật online.',
    q: 'Hơn cả 1 ngôn ngữ, tiếng Nhật chính là công việc và đam mê của mình.',
    url: TIK + 'vo-trong-quy', src: 'Tikme', f: ['jp', 'fam'] },
  { id: 'lich', n: 'Hồ Thanh Lịch', a: 'Anh Lịch', jl: 'N1', job: 'Đúc nhựa', ind: 'duc-nhua', from: '', jp: 'Nara', isl: 'chu',
    tag: 'Học tiếng Nhật từ số 0 năm 26 tuổi → N1 → lập trình viên',
    kd: 'Tốt nghiệp đại học chưa tìm được việc, năm 26 tuổi anh học tiếng Nhật từ con số 0.',
    bn: 'Ở Nara, tiếng Nhật khá lên thì anh được giao việc mới. Trượt N2 hai lần, N1 một lần, tháng 7/2021 anh đậu N1.',
    nay: 'Về nước, anh học lập trình 8 tháng để theo nghề kỹ sư cầu nối (BrSE).',
    q: 'Với mình, hành trang đến Nhật Bản mà không tốn một kilogram nào đó là tiếng Nhật và tác phong.',
    url: ESU + '3EE21/nghe-podcast-ho-thanh-lich-chang-thuc-tap-sinh-tu-so-0-den-jlpt-n1-va-tro-thanh-lap-trinh-vien.html', src: 'Esuhai', f: ['jp', 'learn', 'retry', 'change'] },
  { id: 'hoi', n: 'Nguyễn Bá Hợi', a: 'Anh Hợi', jl: '', job: 'Cơ khí', ind: 'co-khi', from: 'Nghệ An', jp: 'Tokyo', isl: 'lap',
    tag: 'TTS cơ khí → được sếp Nhật giới thiệu việc → mở công ty',
    kd: 'Muốn học đại học nhưng chưa đủ điều kiện, anh sang Nhật để vừa giúp gia đình vừa học nghề.',
    bn: 'Về nước, công ty cũ chưa có chi nhánh ở Việt Nam. Tổng Giám đốc giới thiệu anh sang công ty của một người bạn, anh làm ở đó 6–7 tháng.',
    nay: 'Anh mở công ty cơ khí theo kỹ thuật Nhật, là Giám đốc đại diện Công ty TNHH Kỹ thuật VMONO.',
    q: 'Vào Esuhai mới có cơ hội đi Nhật. Đi Nhật mới thay đổi vận mệnh của anh.',
    url: TIK + 'nguyen-ba-hoi', src: 'Tikme', f: ['rel', 'fam'] },
  { id: 'thao', n: 'Trần Thị Thu Thảo', a: 'Chị Thu Thảo', jl: 'N2', job: 'Thực phẩm (làm bánh)', ind: 'thuc-pham', from: 'Đồng Nai', jp: 'Chiba', isl: 'lap',
    tag: 'Xe bánh nhỏ → 3 năm ở Chiba → tiệm bánh của riêng mình',
    kd: 'Yêu nghề làm bánh từ gia đình, chị học nghề sớm, từng bán một xe bánh nhỏ, vẫn muốn lên tay nghề.',
    bn: 'Chị sang Chiba làm thực phẩm 3 năm, học công nghệ và hương vị bánh Nhật, đạt N2.',
    nay: 'Chị mở tiệm bánh ngọt và trà GonGon ở Đồng Nai, từ người thợ thành người quản lý đội ngũ.',
    q: 'Mỗi lựa chọn đều có những thử thách và rủi ro riêng, nhưng chính những trải nghiệm gian nan ấy mới giúp người trẻ hiểu rõ mình thực sự muốn gì.',
    url: TIK + 'tran-thi-thu-thao', src: 'Tikme', f: ['jp', 'goal'] },
  { id: 'vinh', n: 'Nguyễn Thị Cẩm Vinh', a: 'Chị Cẩm Vinh', jl: 'N2', job: 'Thực phẩm', ind: 'thuc-pham', from: 'Vĩnh Long', jp: 'Tochigi', isl: 'lap',
    tag: 'Giảng viên đại học → TTS thực phẩm → giám đốc công ty F&B',
    kd: 'Từng là giảng viên Ngôn ngữ Anh, chị bước ra khỏi vùng an toàn để học tiếng Nhật ở Esuhai.',
    bn: 'Chị làm chế biến thực phẩm ở Tochigi. Về nước, dự án đầu tay của chị dừng lại vì dịch bệnh.',
    nay: 'Chị kiên trì gần 8 năm vận hành nhà hàng chuẩn Nhật, nay là Giám đốc Công ty TNHH MTV DORIANNA.',
    q: 'Khi sang Nhật, đừng nghĩ mình chỉ đến đó để kiếm tiền, mà hãy nhớ mình đang đại diện cho hình ảnh của người trẻ Việt Nam.',
    url: TIK + 'nguyen-thi-cam-vinh', src: 'Tikme', f: ['jp', 'retry', 'change'] },
  { id: 'thuy', n: 'Trần Thị Thúy', a: 'Chị Thúy', jl: 'N2', job: 'Thủy sản', ind: 'thuy-san', from: 'Lâm Đồng', jp: 'Hokkaido', isl: 'cau',
    tag: 'Sư phạm Vật lý → TTS thủy sản → giám đốc đại diện công ty Nhật',
    kd: 'Tốt nghiệp Sư phạm Vật lý, định theo nghề giáo, chị chọn một hướng khác: sang Nhật làm việc.',
    bn: '3 năm ở Hokkaido cho chị kinh nghiệm, tiếng Nhật N2 và tác phong làm việc kiểu Nhật.',
    nay: 'Chị là Giám đốc đại diện Công ty Marukoshi Seagull Việt Nam, phụ trách nhân sự và kết nối đối tác Nhật.',
    q: 'Đi Nhật không chỉ cho mình một khoản tiền tiết kiệm, mà quan trọng hơn là cho mình một nền tảng để phát triển sự nghiệp và cuộc sống sau này.',
    url: TIK + 'tran-thi-thuy', src: 'Tikme', f: ['jp', 'change'] },
  { id: 'hoai', n: 'Phạm Ngọc Hoài', a: 'Anh Hoài', jl: 'N2', job: 'Cơ khí', ind: 'co-khi', from: 'Cà Mau', jp: 'Saitama', isl: 'cau',
    tag: 'Bỏ dở IT → TTS cơ khí → quản lý sản xuất công ty Nhật',
    kd: 'Gần 2 năm học IT ở cao đẳng mà chưa thấy hướng đi, anh tìm đường mới vì mê chất lượng hàng Nhật.',
    bn: 'Tháng 11/2016 anh xong 3 năm ở Nhật và về nước. Chỉ 2 tuần sau, anh vào làm KATZDEN Việt Nam.',
    nay: 'Anh được giao quản lý bộ phận sản xuất, vừa làm vừa học cách quản lý.',
    q: 'Đừng vội chọn việc nhẹ lương cao để tìm kiếm sự an nhàn trước mắt. Hãy tích lũy năng lực, học hỏi từ những việc nhỏ nhất và tìm thấy niềm tự hào trong từng sản phẩm mình làm ra.',
    url: TIK + 'pham-ngoc-hoai', src: 'Tikme', f: ['jp', 'rel', 'change'] },
  { id: 'hien', n: 'Ngô Thị Thu Hiền', a: 'Chị Thu Hiền', jl: 'N1', job: 'Nông nghiệp', ind: 'nong-nghiep', from: '', jp: 'Hokkaido', isl: 'cau',
    tag: 'Nông nghiệp Hokkaido → N1 → Hiệp hội Nhật Bản tại Việt Nam',
    kd: 'Thích tiếng Nhật từ nhỏ, chị bắt đầu hành trình học tiếng Nhật năm 2018.',
    bn: 'Chị làm nông nghiệp ở Hokkaido và học bền bỉ đến khi đậu N1.',
    nay: 'Chị chuyển sang làm việc tại Hiệp hội Nhật Bản ở Việt Nam.',
    q: 'Mình không tin vào thành công đến từ may mắn. Mình tin rằng mỗi trang sách đã đọc, mỗi giờ luyện nghe và mỗi lần không bỏ cuộc đều là những viên gạch nhỏ xây nên kết quả của ngày hôm nay.',
    url: TIK + 'ngo-thi-thu-hien', src: 'Tikme', f: ['jp', 'learn', 'goal'] },
  { id: 'hang', n: 'Lê Thị Lệ Hằng', a: 'Chị Lệ Hằng', jl: 'N2', job: 'Nông nghiệp', ind: 'nong-nghiep', from: 'Hà Tĩnh', jp: 'Ehime', isl: 'cau',
    tag: 'Cử nhân kế toán → 7 năm nông nghiệp ở Nhật → doanh nghiệp Nhật',
    kd: 'Tốt nghiệp Kế toán, chị muốn tìm hiểu nông nghiệp hiện đại của Nhật và lên đường năm 2018.',
    bn: 'Chị làm việc ở Nhật gần 7 năm, tiếng Nhật đạt N2.',
    nay: 'Chị về nước, làm việc tại một doanh nghiệp Nhật ở Việt Nam.',
    q: 'Ngôn ngữ là rào cản lớn nhất nhưng cũng là cơ hội lớn nhất. Khi có nền tảng tiếng Nhật tốt, bạn sẽ có nhiều cơ hội phát triển, không chỉ tại Nhật mà cả sau khi trở về Việt Nam.',
    url: TIK + 'le-thi-le-hang', src: 'Tikme', f: ['jp', 'goal', 'change'] },
  { id: 'kthanh', n: 'Nguyễn Thị Kim Thanh', a: 'Chị Kim Thanh', jl: '', job: 'Thủy sản', ind: 'thuy-san', from: '', jp: 'Hokkaido', isl: 'cau',
    tag: 'Kỹ sư thủy sản → TTS ở Hokkaido → trưởng phòng kinh doanh',
    kd: 'Tốt nghiệp ngành Thủy sản, thiếu kinh nghiệm và tiếng Anh chưa tốt, chị chọn sang Nhật làm mắt xích cho sự nghiệp trong ngành.',
    bn: 'Chị làm TTS 3 năm ở Hokkaido, học cách làm việc và tạo quan hệ với người Nhật.',
    nay: 'Chị là Trưởng phòng Kinh doanh Công ty Cổ phần Sài Gòn Food, đúng ngành mình học.',
    q: 'Thay vì chỉ đặt mục tiêu về tài chính mà hãy đặt mục tiêu dài hạn hơn, là ngoại ngữ và cơ hội nghề nghiệp sau 30 tuổi.',
    url: TIK + 'nguyen-thi-kim-thanh', src: 'Tikme', f: ['goal', 'rel'] },
  { id: 'huan', n: 'Lương Ngọc Huân', a: 'Anh Huân', jl: 'N1', job: 'Xây dựng', ind: 'xay-dung', from: '', jp: 'Nhật Bản', isl: 'que',
    tag: '30 tuổi mới sang Nhật → trượt N2 sáu lần → N1 → về gần nhà',
    kd: 'Có bằng trung cấp nông nghiệp và việc ổn định, 30 tuổi anh mới sang Nhật để lo cho con nhỏ.',
    bn: 'Anh tự hứa có N1 mới về. Trượt N2 sáu lần, lần thứ bảy anh đậu, một năm sau đậu N1.',
    nay: 'Xong 5 năm, anh về nước, tìm việc dùng tiếng Nhật gần nhà để tiện chăm con và mẹ.',
    q: '',
    url: TIK + 'luong-ngoc-huan', src: 'Tikme', f: ['jp', 'learn', 'retry', 'goal', 'fam'] },
  { id: 'hung', n: 'Tiết Quý Hưng', a: 'Chị Hưng', jl: 'N2', job: 'Thực phẩm', ind: 'thuc-pham', from: 'TP.HCM', jp: 'Saitama, Gunma', isl: 'que',
    tag: 'Văn phòng → TTS thực phẩm → ở thêm, rồi về bên gia đình',
    kd: 'Tốt nghiệp Ngôn ngữ Trung Quốc, chị làm văn phòng đúng chuyên môn, rồi muốn thử thách ở môi trường mới.',
    bn: 'Hơn 3 năm làm thực phẩm ở Saitama và Gunma, chị đạt N2.',
    nay: 'Chị muốn ở lại Nhật học hỏi, khám phá thêm, rồi mới trở về bên gia đình.',
    q: 'Khi có mục tiêu rõ ràng và không ngừng học hỏi, mỗi trải nghiệm đều sẽ giúp chúng ta trưởng thành hơn.',
    url: TIK + 'tiet-quy-hung', src: 'Tikme', f: ['jp', 'change'] }
];

/* điểm chung khóa học tìm thấy trong các chuyện (Bến Senpai, chặng 2). rich: không ai có, để so sánh. */
var CD2_F = [
  ['jp', 'Tiếng Nhật từ N2 trở lên'],
  ['change', 'Đổi hướng ít nhất một lần'],
  ['learn', 'Tự học thêm ngoài giờ làm'],
  ['goal', 'Có mục tiêu riêng ngay từ đầu'],
  ['rel', 'Được công ty, cấp trên tin và giúp'],
  ['fam', 'Gia đình là động lực'],
  ['retry', 'Từng thất bại, thi lại nhiều lần'],
  ['rich', 'Có sẵn nhiều tiền trước khi đi']
];

/* nền chung: “Mọi hải trình đều xuất phát từ Cảng 3 Năm”. rt: thẻ Shin Routine gợi ý (PS_CONFIG.ROUTINE_LIB). */
var BASE5 = [
  { id: 'jp', n: 'Tiếng Nhật', d: 'Từ N3 lên N2 trong 3 năm', ic: 'speech', act: ['Mỗi ngày 10 từ mới', 'Nói với thầy cô người Nhật mỗi ngày 1 câu', 'Ôn 15 phút trước khi ngủ'], rt: ['5phut', 'memo'] },
  { id: 'skill', n: 'Tay nghề thật', d: 'Làm kỹ, làm đúng, làm nhanh dần', ic: 'tool', act: ['Ghi lại cách làm mỗi việc mới', 'Hỏi lại khi chưa chắc', 'Tập một kỹ năng của nghề mỗi tuần'], rt: ['memo', 'viecko'] },
  { id: 'tin', n: 'Chữ tín', d: 'Đúng giờ, giữ lời, báo cáo đều', ic: 'shield', act: ['Đến lớp sớm 5 phút', 'Hứa gì làm nấy, dù việc nhỏ', 'Có việc thì báo trước'], rt: ['som', 'horenso'] },
  { id: 'tien', n: 'Tiết kiệm có kế hoạch', d: 'Biết tiền đi đâu, để dành cho việc gì', ic: 'coin', act: ['Ghi chi tiêu mỗi ngày', 'Đặt một khoản để dành mỗi tháng', 'Viết rõ để dành cho mục tiêu nào'], rt: ['chitieu'] },
  { id: 'qh', n: 'Mối quan hệ tốt', d: 'Bạn bè, thầy cô, Senpai, cấp trên', ic: 'people', act: ['Chào hỏi, cảm ơn mỗi ngày', 'Hỏi thăm một Senpai', 'Giúp bạn cùng lớp một việc'], rt: ['chao', 'giup'] }
];

/* ---------- CHỊ HẠNH: nhân vật của khóa, ghép từ nhiều chuyện thật (KHÔNG phải người thật) ---------- */
var HANH_NOTE = 'Chị Hạnh là nhân vật của khóa, ghép từ nhiều chuyện thật của các anh chị đi trước.';
var HANH = [
  ['Sau 3 năm, làm sao biết nên ở lại hay về?', 'Chị không chọn ngay từ đầu. Năm thứ hai chị mới ngồi viết ra: tuổi 30 mình muốn có gì, gia đình cần gì, tiếng Nhật mình tới đâu. Viết ra rồi, hướng đi rõ dần.'],
  ['Lỡ chọn sai hướng thì sao?', 'Có lúc hướng cũ không còn hợp nữa. Nhưng 3 năm ở Nhật không mất đi đâu. Tiếng Nhật, tác phong, người quen vẫn đi theo mình sang hướng mới.'],
  ['Tiếng Nhật cần tới đâu?', 'Nhiều anh chị chị biết có N2 khi về. Không phải vì tấm bằng. N2 giúp mình hiểu cấp trên, được giao việc khó hơn, và có thêm lựa chọn sau này.'],
  ['Làm sao để công ty muốn giữ mình?', 'Đúng giờ. Làm kỹ. Chưa chắc thì hỏi lại. Báo cáo đều. Mấy việc nhỏ đó làm liền 3 năm thì người ta nhớ mình.'],
  ['Về Việt Nam có khó tìm việc không?', 'Dễ hơn nhiều khi có tiếng Nhật và giữ liên lạc với công ty cũ. Có anh về 2 tuần đã có việc. Có anh được chính sếp Nhật giới thiệu chỗ làm.'],
  ['Lúc nản muốn bỏ thì làm sao?', 'Chị mở lại mục tiêu đã viết, gọi cho một bạn cùng đi. Và chị nhớ có anh trượt N2 sáu lần, lần thứ bảy mới đậu.']
];

/* ---------- XUẤT PHÁT ---------- */
var FLAG_SYM = [
  ['compass', 'La bàn'], ['star', 'Ngôi sao'], ['sun', 'Mặt trời'], ['whale', 'Cá voi'],
  ['wing', 'Cánh chim'], ['flame', 'Ngọn lửa'], ['sakura', 'Hoa anh đào'], ['leaf', 'Lá non']
];
/* PS1.3.39: 6 tông dịu hợp giao diện mới (màu cũ tự đổi, xem FLAG_OLD trong art.js) */
var FLAG_COL = [['#D97757', 'Cam đất'], ['#6E9E94', 'Xanh ngọc'], ['#5E7FA8', 'Xanh biển'], ['#D9A84E', 'Vàng nắng'], ['#8C82B4', 'Tím oải hương'], ['#3D3D3A', 'Than chì']];
var MOTTO_TIPS = ['Đi chậm mà chắc', 'Học mỗi ngày một chút', 'Dám thử, dám sửa', 'Vì gia đình, vì mình', 'Không bỏ cuộc giữa biển'];
var OPEN_N = [['1', '1 hướng'], ['2', '2 hướng'], ['3', '3 hướng'], ['4', '4 hướng'], ['5', '5 hướng'], ['6', '6 hướng trở lên']];
var GOAL_TIPS = ['Biết thêm các hướng đi sau 3 năm', 'Hiểu mình hợp với hướng nào', 'Chuẩn bị từ bây giờ cho hướng mình chọn', 'Có thêm động lực học tiếng Nhật'];

/* ---------- BẾN 1 · ĐÀI VỌNG BIỂN: đoán hải trình ---------- */
var FLIP = ['thuy', 'lich', 'linh', 'hoi', 'sy', 'mai']; /* 6 thẻ lật, hải trình bất ngờ */
var FLIP_OPTS = { /* 4 đảo để đoán (đảo thật luôn có trong danh sách, máy xáo) */
  thuy: ['cau', 'chu', 'que', 'lap'], lich: ['chu', 'len', 'cau', 'lap'], linh: ['re', 'cau', 'chu', 'que'],
  hoi: ['lap', 'cau', 'len', 'gio'], sy: ['len', 'gio', 'cau', 'que'], mai: ['chu', 'cau', 'len', 're']
};
var TAG3 = [['cur', 'Tò mò', 'spark'], ['new', 'Chưa từng nghĩ', 'bulb'], ['no', 'Chưa hợp lúc này', 'clock']];

/* ---------- BẾN 3 · XƯỞNG LA BÀN ---------- */
var PAIRS = [ /* [trái, phải, mã]: cả hai bên đều tốt */
  ['Gần gia đình', 'Trải nghiệm xa nhà', 'fam'],
  ['Ổn định', 'Thử thách mới', 'stab'],
  ['Thu nhập cao', 'Thời gian tự do', 'money'],
  ['Đi sâu một nghề', 'Thử nghề mới', 'deep'],
  ['Làm cho tổ chức', 'Tự làm chủ', 'own'],
  ['Sống ở Nhật lâu', 'Về Việt Nam sớm', 'stay']
];
var WINDS = [ /* điều có thể làm đổi kế hoạch */
  'Gia đình cần mình về', 'Sức khỏe', 'Tiếng Nhật chưa đạt mục tiêu', 'Công ty thay đổi, ít việc',
  'Quy định về diện cư trú thay đổi', 'Mình đổi ý, thích nghề khác', 'Lập gia đình', 'Tiền để dành chưa đủ'
];
var WIND_TIPS = ['Mình sẽ nói chuyện thẳng thắn với gia đình', 'Mình sẽ để dành một khoản phòng thân', 'Mình sẽ học thêm một kỹ năng mang về Việt Nam dùng được', 'Mình sẽ hỏi Senpai đã gặp chuyện này'];
var LIFE = [ /* đường đời thầy của Shin hay vẽ lên bảng (ý của thầy Lê Long Sơn, nói gián tiếp) */
  [18, 22, 'Rèn sức khỏe, tinh thần'], [22, 30, 'Chọn một nghề, làm liên tục ít nhất 5 năm'], [30, 35, 'Tạo dựng sự nghiệp'], [35, 40, 'Gánh thêm trách nhiệm']
];
var WORK_TIPS = ['Với mình, đi làm là để lo cho gia đình', 'Với mình, đi làm là để giỏi một nghề', 'Với mình, đi làm là để được tôn trọng', 'Với mình, đi làm là để giúp được người khác'];
var LIFE_TIPS = ['Ở tuổi 30, một cuộc sống tốt với mình là có nghề vững', 'Ở tuổi 30, một cuộc sống tốt với mình là gần ba mẹ', 'Ở tuổi 30, một cuộc sống tốt với mình là có nhà riêng', 'Ở tuổi 30, một cuộc sống tốt với mình là được làm việc mình thích'];

/* ---------- BẾN 4 · PHÒNG HẢI ĐỒ: 3 hải trình 5 năm ----------
   Ý tưởng tham khảo: “Odyssey Plan” trong sách Designing Your Life (Burnett, Evans · Stanford). Khóa học viết lại cho học viên JPC. */
var VOY = [ /* [mã chặng, chữ, tên, câu hỏi phụ] */
  ['b41', 'A', 'Đường đang đi', 'Hướng bạn đang nghĩ tới lúc này'],
  ['b42', 'B', 'Nếu đường A đóng lại', 'Đường A không đi được nữa. Bạn sẽ đi đâu?'],
  ['b43', 'C', 'Nếu không lo tiền, không lo ai nghĩ gì', 'Bạn sẽ chọn gì?']
];
/* gợi ý mốc theo đảo (chạm để điền vào mốc còn trống, rồi sửa theo ý mình) */
var MS_TIPS = {
  len: ['Đậu kỳ thi tay nghề, lên diện mới', 'Kèm 2 bạn mới vào công ty', 'Làm tổ trưởng', 'Đón gia đình sang thăm'],
  re: ['Thi chứng chỉ ngành mới', 'Chuyển sang công ty mới', 'Làm vững việc mới', 'Lên N2 để làm văn phòng'],
  hoc: ['Để dành đủ tiền học', 'Đậu N2', 'Vào trường mình chọn', 'Ra trường, làm nghề mới'],
  gio: ['Về nhà nghỉ, học thêm', 'Quay lại Nhật bằng diện mới', 'Lên vị trí cao hơn lần trước', 'Về hẳn khi đủ vốn'],
  chu: ['Đậu N2', 'Đậu N1', 'Học nghề dạy học hoặc phiên dịch', 'Đi làm bằng tiếng Nhật'],
  lap: ['Để dành vốn đầu tiên', 'Làm thuê 1 năm để học việc', 'Mở cửa hàng, xưởng nhỏ', 'Có 3 khách hàng quen'],
  cau: ['Giữ liên lạc với công ty cũ', 'Vào công ty Nhật ở Việt Nam', 'Lên trưởng nhóm', 'Học thêm cách quản lý'],
  que: ['Về gần nhà', 'Tìm việc dùng tay nghề ở quê', 'Phụ gia đình làm ăn', 'Sửa lại nhà cho ba mẹ'],
  o: ['Học thêm một kỹ năng', 'Để dành một khoản', 'Đậu N2', 'Làm vững một nghề']
};
var JL_OPTS = [['N3', 'N3'], ['N2', 'N2'], ['N1', 'N1'], ['x', 'Không cần nhiều']];
var METERS = [ /* 4 đồng hồ tự chấm */
  ['like', 'Thích', 'Bạn thích hải trình này cỡ nào?'],
  ['conf', 'Tự tin', 'Bạn tin mình làm được cỡ nào?'],
  ['fit', 'Hợp la bàn', 'Hợp điều bạn coi trọng cỡ nào?'],
  ['feas', 'Khả thi', 'Tiền, thời gian, giấy tờ có lo được không?']
];
var TRIO_TIPS = ['Cả 3 hải trình đều cần tiếng Nhật tốt', 'Hải trình C làm mình thích nhất, nhưng còn xa', 'Mình có nhiều đường hơn mình nghĩ', 'Hải trình B cũng không tệ như mình tưởng'];

/* ---------- BẾN 5 · VỊNH NGÃ RẼ ---------- */
var WEIGHT = [['1', 'Nhẹ'], ['2', 'Vừa'], ['3', 'Nặng']];
var FEEL3 = [['same', 'Giống'], ['diff', 'Khác'], ['unsure', 'Phân vân']];
var WHY3 = ['Ở cách làm của mình', 'Ở thông tin mình còn thiếu', 'Ở người giúp, mối quan hệ', 'Ở hoàn cảnh bên ngoài'];
/* Khi đường bị chặn: tình huống lấy từ chuyện thật đã công khai (sp: mã Senpai, engine hiện khung Bước ngoặt + Hôm nay) */
var BLOCKS = [
  { id: 'n2', ic: 'speech', t: 'Thi N2 trượt lần thứ ba', ctx: 'Bạn ôn rất nhiều. Lần thứ ba vẫn chưa đậu. Mục tiêu N2 trước khi hết 3 năm có vẻ xa.',
    w1: ['Phần nghe còn yếu', 'Học dồn sát ngày thi', 'Đi làm về mệt, học không đều', 'Chưa biết mình hổng phần nào'],
    w2: ['Chưa có giờ học cố định mỗi ngày', 'Học một mình, không ai nhắc', 'Chưa xem lại bài thi cũ', 'Ngại hỏi người đã đậu'],
    ways: ['Học 20 phút mỗi sáng trước giờ làm', 'Rủ một bạn cùng học, nhắc nhau mỗi tối', 'Nghe tiếng Nhật trên đường đi làm', 'Hỏi Senpai đã đậu cách ôn', 'Đăng ký kỳ thi sau ngay, đặt mốc rõ', 'Mỗi ngày nói chuyện với đồng nghiệp người Nhật'],
    sp: ['huan', 'dung'] },
  { id: 'chi', ic: 'bridge', t: 'Về nước, công ty cũ chưa có chi nhánh ở Việt Nam', ctx: 'Bạn định về làm cho chính công ty mình. Nhưng công ty chưa mở chi nhánh ở Việt Nam.',
    w1: ['Mình chỉ tính một đường là công ty cũ', 'Chưa tìm hiểu công ty Nhật nào ở Việt Nam', 'Chưa hỏi cấp trên có quen ai không', 'Chưa ghi lại mình làm được gì'],
    w2: ['Chưa có kế hoạch B', 'Ít quen biết ngoài công ty', 'Ngại nhờ người khác', 'Chưa biết cách giới thiệu bản thân'],
    ways: ['Xin cấp trên lời giới thiệu trước khi về', 'Lập danh sách công ty Nhật cùng ngành ở Việt Nam', 'Ghi lại các việc mình làm giỏi ở Nhật', 'Hỏi thầy cô JPC, Senpai đã về nước', 'Giữ liên lạc với công ty cũ sau khi về', 'Học lên N2 để có thêm lựa chọn'],
    sp: ['hoi', 'hoai'] },
  { id: 'dich', ic: 'wave', t: 'Hết hạn đúng lúc có dịch bệnh', ctx: 'Chuyện lớn xảy ra ngoài ý muốn. Kế hoạch về nước, thi cử, công việc đều đảo lộn.',
    w1: ['Không về nước được như dự định', 'Công ty ít việc hơn', 'Kỳ thi bị hoãn', 'Gia đình ở nhà lo lắng'],
    w2: ['Chuyện lớn, ngoài sức mình', 'Chưa có kế hoạch dự phòng', 'Chưa có khoản tiền phòng thân', 'Chưa biết hỏi ai về giấy tờ'],
    ways: ['Hỏi công ty có cách nào để làm tiếp', 'Dùng thời gian này học tiếng Nhật, thi tay nghề', 'Để dành một khoản phòng thân', 'Gọi về nhà đều để gia đình yên tâm', 'Hỏi tổ chức hỗ trợ về giấy tờ', 'Viết lại kế hoạch: lùi mốc, không bỏ mục tiêu'],
    sp: ['sy', 'vinh'] },
  { id: 'nha', ic: 'home', t: 'Gia đình cần bạn ở gần', ctx: 'Gia đình cần bạn về gần hơn, sớm hơn bạn tính.',
    w1: ['Ba mẹ lớn tuổi, cần người bên cạnh', 'Có con nhỏ cần chăm', 'Nhà cần người phụ việc', 'Ba mẹ nhớ, muốn mình về'],
    w2: ['Chưa nói rõ kế hoạch với gia đình', 'Chưa biết việc gần nhà dùng được tay nghề', 'Chưa có nghề mang về dùng được', 'Chưa tính chuyện tiền lúc mới về'],
    ways: ['Nói chuyện thẳng thắn với gia đình về mốc thời gian', 'Tìm việc gần nhà dùng tiếng Nhật, tay nghề', 'Học thêm một kỹ năng mang về dùng được', 'Để dành một khoản cho lúc mới về', 'Gọi video về nhà mỗi tuần', 'Hỏi Senpai đã về quê làm gì'],
    sp: ['huan', 'hung'] }
];
var TRIALS = ['Hỏi 1 anh chị đi trước về hải trình này', 'Đọc 2 chuyện trên Tikme về hướng này', 'Học thêm 15 phút tiếng Nhật mỗi tối', 'Ghi chi tiêu mỗi ngày', 'Nói chuyện với gia đình về hải trình mình nghiêng', 'Hỏi thầy cô JPC: hướng này cần chuẩn bị gì'];
var TRY_ISLE = { len: 'Tìm hiểu kỳ thi tay nghề của nghề [Nghề]', re: 'Tìm hiểu 1 ngành khác ở Nhật mình thấy thích', hoc: 'Tìm hiểu 1 trường, 1 chương trình học lên',
  gio: 'Tìm hiểu điều kiện quay lại Nhật bằng diện khác', chu: 'Mỗi ngày học 5 từ chuyên ngành, tập dịch 1 câu', lap: 'Mỗi ngày ghi 1 điều về cách một cửa hàng, xưởng nhỏ làm ăn',
  cau: 'Lập danh sách 5 công ty Nhật cùng nghề ở Việt Nam', que: 'Hỏi gia đình: ở quê có việc gì cần tiếng Nhật, tay nghề' };
var WHEN3 = [['0', 'Hôm nay'], ['1', 'Ngày mai'], ['7', 'Thứ Hai tới']];
var WITH3 = [['me', 'Một mình'], ['ban', 'Rủ một bạn cùng lớp'], ['gv', 'Báo thầy cô để được nhắc']];
var LEARN_TIPS = ['Hướng này có hợp với mình không', 'Mình có giữ được thói quen không', 'Mình cần chuẩn bị thêm gì', 'Gia đình nghĩ sao về hướng này'];

/* ---------- BẾN 6 · NGỌN HẢI ĐĂNG ---------- */
var RING_P = [['fam', 'Gia đình', 'home'], ['ban', 'Bạn cùng lớp', 'people'], ['gv', 'Thầy cô JPC', 'cap'], ['sp', 'Senpai đi trước', 'card'],
  ['boss', 'Cấp trên người Nhật', 'shield'], ['dn', 'Đồng nghiệp ở Nhật', 'tool'], ['cd', 'Bạn bè người Việt ở Nhật', 'speech'], ['tc', 'Nghiệp đoàn, tổ chức hỗ trợ', 'anchor']];
var RING_L = [['1', 'Đã gần'], ['2', 'Có quen'], ['3', 'Cần tìm']];
var RING_STORY = [['hoi', 'Tổng Giám đốc giới thiệu anh Hợi sang công ty của một người bạn.'], ['ngat', 'Công ty mời chị Ngát ở lại, chuyển lên văn phòng.'], ['linh', 'Nghiệp đoàn nhận chị Linh làm thông dịch viên.']];
var MSG_TO = ['Anh chị Senpai', 'Thầy cô chủ nhiệm', 'Một người quen đã đi Nhật'];
var MSG_Q = ['Anh chị chuẩn bị gì từ năm đầu để sau 3 năm có nhiều lựa chọn?', 'Lúc muốn bỏ cuộc, anh chị làm gì?', 'Hướng này cần tiếng Nhật tới đâu ạ?'];
var WORKS = [ /* 3 tình huống ở chỗ làm. Không có đáp án sai: mỗi cách có cái được và một lưu ý. */
  { t: 'Cấp trên chỉ việc rất nhanh. Bạn chưa hiểu hết.', ic: 'speech', opts: [
    ['Hỏi lại ngay, nhắc lại để xác nhận', 'Hiểu đúng từ đầu, cấp trên thấy bạn cẩn thận.', 'Hỏi ngắn, đúng chỗ chưa rõ.'],
    ['Ghi vào sổ, hết giờ hỏi lại', 'Không làm gián đoạn, có sổ để ôn.', 'Việc gấp thì nên hỏi ngay.'],
    ['Nhìn người bên cạnh rồi làm theo', 'Học được cách làm thật ngoài xưởng.', 'Người bên cạnh cũng có thể làm sai.'],
    ['Cứ làm thử, sai thì sửa', 'Dám làm, học nhanh từ việc.', 'Có việc sai một lần là tốn nhiều. Hỏi trước an toàn hơn.']] },
  { t: 'Có anh đồng nghiệp làm nhanh và đẹp hơn hẳn mọi người.', ic: 'tool', opts: [
    ['Quan sát kỹ tay anh ấy làm', 'Thấy được mẹo mà sách không có.', 'Quan sát xong nhớ ghi lại.'],
    ['Xin anh ấy chỉ một mẹo', 'Học nhanh, lại có thêm người quen tốt.', 'Chọn lúc anh ấy rảnh, nhớ cảm ơn.'],
    ['Ghi các bước anh ấy làm vào sổ', 'Có bản để tập lại nhiều lần.', 'Ghi xong thì phải tập mới lên tay.'],
    ['Tự tập thêm lúc rảnh', 'Tay nghề lên dần, tự tin hơn.', 'Tập sai cách thì khó sửa. Hỏi trước một lần.']] },
  { t: 'Bạn bị nhắc lỗi trước mọi người.', ic: 'shield', opts: [
    ['Xin lỗi, hỏi cách làm đúng', 'Biết ngay cách sửa, giữ được chữ tín.', 'Nói ngắn, không cần giải thích dài.'],
    ['Ghi lỗi vào sổ để không lặp lại', 'Lần sau tránh được, người ta thấy bạn tiến bộ.', 'Nên hỏi lại nếu chưa rõ vì sao sai.'],
    ['Im lặng làm tiếp cho xong việc', 'Giữ bình tĩnh, không cãi lại.', 'Im lặng mà chưa hiểu thì dễ sai lại.'],
    ['Sửa xong thì báo lại cấp trên', 'Cấp trên yên tâm, bạn được tin hơn.', 'Báo ngắn: đã sửa gì, khi nào.']] }
];
var WORK_STORY = [['sy', 'Những ngày đầu thấy lạc lõng, anh Sỹ chọn quan sát và học từ đồng nghiệp.'], ['hoai', 'Anh Hoài: “Hãy tích lũy năng lực, học hỏi từ những việc nhỏ nhất.”'], ['lich', 'Tiếng Nhật khá lên, anh Lịch được giao việc mới.']];
var LEARN_H = ['Hỏi lại và nhắc lại để xác nhận', 'Ghi sổ mỗi việc mới', 'Quan sát người giỏi rồi làm theo', 'Làm xong thì báo cáo'];
var HOW_TIPS = ['Mỗi buổi học kỹ năng, mình ghi 3 điều mới vào sổ', 'Chưa hiểu bài, mình hỏi lại thầy cô ngay trong giờ', 'Mỗi ngày mình báo cáo nhóm trưởng việc đã xong'];

/* ---------- CẢNG KHỞI HÀNH ---------- */
var CHANGE_TIPS = ['Mình biết thêm nhiều hướng mình chưa từng nghĩ', 'Mình chắc hơn về hướng mình đang đi', 'Mình bớt chắc, nhưng mình biết phải tìm hiểu gì', 'Mình thấy 3 năm sắp tới quan trọng hơn'];
var TIKME_HOME = 'https://tikme.com/cau-chuyen-thanh-cong/danh-sach';

/* ---------- BẾN, VÒNG, CHẶNG ----------
   r: vòng (1 Khám phá: đi thứ tự tùy ý · 2 Thiết kế: lần lượt · 3 Ra khơi: tùy ý). ready: đã mở trong bản này. */
var PORT = { id: 'p0', n: 'Cảng 3 Năm', ic: 'anchor', x: 180, y: 232, acts: ['x1'],
  intro: 'Chào [Tên]! Đây là Cảng 3 Năm. Mọi hải trình đều bắt đầu từ đây.' };
var BEN = [
  { id: 'b1', n: 'Đài Vọng Biển', ic: 'scope', r: 1, x: 96, y: 150, ready: 1, acts: ['b11', 'b12', 'b13'],
    sub: 'Sau 3 năm có những hướng nào?', intro: 'Lên đài nhìn ra biển nhé [Tên]. Sương còn dày lắm. Mỗi hải trình bạn đoán được, một vùng sương sẽ tan.' },
  { id: 'b2', n: 'Bến Senpai', ic: 'people', r: 1, x: 266, y: 150, ready: 1, acts: ['b21', 'b22', 'b23'],
    sub: 'Nghe thuyền trưởng đi trước kể chuyện', intro: 'Bến này là nơi các thuyền trưởng đi trước ghé lại. Họ là người thật, chuyện thật. Nghe xong, bạn tự rút ra điều cho mình.' },
  { id: 'b3', n: 'Xưởng La Bàn', ic: 'compass', r: 2, x: 104, y: 312, ready: 1, acts: ['b31', 'b32', 'b33'],
    sub: 'Điều gì quan trọng với mình?', intro: 'Biển nào cũng có gió. Muốn đi đúng hướng của mình, phải chỉnh la bàn của chính mình trước.' },
  { id: 'b4', n: 'Phòng Hải Đồ', ic: 'map', r: 2, x: 256, y: 312, ready: 1, acts: ['b41', 'b42', 'b43'], sub: 'Vẽ 3 hải trình 5 năm',
    intro: 'Thuyền trưởng giỏi không chỉ vẽ một hải trình. Ở phòng này, bạn vẽ 3 hải trình 5 năm. Chưa cần chọn, cứ vẽ cả ba.' },
  { id: 'b5', n: 'Vịnh Ngã Rẽ', ic: 'wave', r: 3, x: 116, y: 392, ready: 1, acts: ['b51', 'b52', 'b53'], sub: 'Cân nhắc, vượt biển động, thử nhỏ',
    intro: 'Vịnh này nhiều ngã rẽ, có lúc biển động. Ở đây bạn tập cân nhắc, tập xử lý khi đường bị chặn, và thử một đoạn ngắn trước.' },
  { id: 'b6', n: 'Ngọn Hải Đăng', ic: 'light', r: 3, x: 244, y: 392, ready: 1, acts: ['b61', 'b62'], sub: 'Người soi đường, học từ công việc',
    intro: 'Không thuyền trưởng nào đi một mình. Ngọn hải đăng là những người soi đường cho bạn, và cả công việc mỗi ngày.' }
];
/* Cảng Khởi Hành: mở khi đủ 6 con dấu bến. Không tính vào CD2_TOTAL (giống Ga Ước Mơ của CD01). */
var GOAL_PORT = { id: 'fin', n: 'Cảng Khởi Hành', ic: 'flag', ready: 1, acts: ['f1', 'f2'], sub: 'Nhận Bằng Thuyền Trưởng',
  intro: 'Thuyền của bạn đã ghé đủ 6 bến. Trước khi ra khơi, mình nhìn lại cả hải trình và nhận Bằng Thuyền Trưởng nhé!' };
var ROUNDS = { 1: 'Vòng Khám phá · đi bến nào trước cũng được', 2: 'Vòng Thiết kế · đi lần lượt', 3: 'Vòng Ra khơi · đi bến nào trước cũng được' };

/* Chặng: k = dạng bước (xem engine.js). Mỗi chặng 3–5 phút. */
var ACTS = {
  x1: { st: 'p0', t: 'Nhận thuyền', d: 'Cờ của bạn, Sổ Thuyền Trưởng, điểm xuất phát', mins: 5, btn: 'Nhổ neo!',
    steps: [
      { k: 'say', mood: 'welcome', t: 'Chào [Tên]! Shin vừa xong 3 năm ở Nhật. Giờ Shin làm thuyền trưởng dẫn đường cho bạn.', t2: 'Ngoài kia là biển rộng. Sương mù che những hướng đi mình chưa biết. Ghé bến, gặp các anh chị đi trước, sương sẽ tan dần.' },
      { k: 'from' },
      { k: 'flag', q: 'Mỗi thuyền trưởng có một lá cờ. Thiết kế cờ của bạn nhé!' },
      { k: 'open1', q: 'Theo bạn, sau 3 năm ở Nhật, người ta thường đi mấy hướng?', q2: 'Hướng đi sau 3 năm của bạn đã rõ mấy phần?', q3: 'Lúc này, bạn nghĩ sau 3 năm mình sẽ…', ph: 'Ví dụ: mình sẽ ở lại thêm 2 năm rồi về quê mở xưởng. Hoặc: mình chưa nghĩ tới.' },
      { k: 'write', key: 'x1.goal', q: 'Học xong CD02, bạn muốn mình có được điều gì?', ph: 'Ví dụ: mình muốn biết hướng nào hợp với mình.', tips: GOAL_TIPS },
      { k: 'card', t: 'Đây là Sổ Thuyền Trưởng của bạn. Mỗi bến ghé qua sẽ có một con dấu.' }
    ] },
  b11: { st: 'b1', t: 'Đoán hải trình', d: 'Lật 6 thẻ: họ đã đi đâu sau 3 năm?', mins: 4,
    steps: [
      { k: 'say', mood: 'curious', t: '6 anh chị dưới đây đều từng là học viên như bạn. Đọc khởi đầu của họ, đoán xem sau 3 năm họ đi đâu.', t2: 'Đoán trúng hay trật đều được. Chỗ bất ngờ mới là chỗ thú vị.' },
      { k: 'flip' },
      { k: 'flipsum' }
    ] },
  b12: { st: 'b1', t: 'Bản đồ 8 đảo', d: 'Mỗi đảo một hướng đi. Bạn thấy sao?', mins: 5,
    steps: [
      { k: 'say', mood: 'think', t: 'Hải đồ có 8 đảo, là 8 hướng đi các anh chị đã chọn sau 3 năm.', t2: 'Chạm từng đảo xem: ai đã đi, cần gì, được gì, đánh đổi gì. Rồi gắn nhãn theo cảm nhận của bạn.' },
      { k: 'isles' }
    ] },
  b13: { st: 'b1', t: 'Đảo làm bạn tò mò', d: 'Chọn 1 đảo và nói vì sao', mins: 3,
    steps: [
      { k: 'pickisle', key: 'b13.isl', q: 'Đảo nào làm bạn tò mò nhất lúc này?', sub: 'Không phải đảo bạn sẽ chọn. Chỉ là đảo bạn muốn hiểu thêm.' },
      { k: 'write', key: 'b13.why', q: 'Vì sao đảo [Đảo] làm bạn tò mò?', ph: 'Ví dụ: mình chưa biết đi TTS về lại có thể làm giáo viên.', tips: ['Mình chưa từng nghe tới hướng này', 'Mình muốn biết họ làm thế nào', 'Hướng này giống điều mình thích', 'Gia đình mình cần hướng như vậy'] },
      { k: 'say', mood: 'cheer', t: 'Hay lắm. Ở Bến Senpai, bạn có thể tìm người đã đi đúng hướng này để nghe kỹ hơn.' }
    ] },
  b21: { st: 'b2', t: 'Mượn 2 cuốn sách người', d: '1 người cùng nghề, 1 người khác hẳn', mins: 5,
    steps: [
      { k: 'say', mood: 'hi', t: 'Bến này có một thư viện đặc biệt: mỗi cuốn sách là một người thật.', t2: 'Bạn mượn 2 cuốn. Một người cùng nghề với bạn, một người đi con đường khác hẳn.' },
      { k: 'book', n: 1, same: 1, q: 'Cuốn 1 · Người cùng nghề [Nghề]' },
      { k: 'book', n: 2, same: 0, q: 'Cuốn 2 · Người đi đường khác' },
      { k: 'write', key: 'b21.take', q: 'Từ 2 cuốn sách này, bạn muốn mang theo điều gì?', ph: 'Ví dụ: mình học được là tiếng Nhật giỏi thì có thêm lựa chọn.', tips: ['Mình muốn học tiếng Nhật đều như anh chị ấy', 'Mình thấy đổi hướng cũng không sao', 'Mình muốn giữ quan hệ tốt với công ty', 'Mình thấy thất bại vài lần là bình thường'] }
    ] },
  b22: { st: 'b2', t: 'Tìm điểm chung', d: 'Điều gì lặp lại trong nhiều hải trình?', mins: 4,
    steps: [
      { k: 'say', mood: 'think', t: 'Các anh chị đi 8 hướng khác nhau. Vậy họ có gì giống nhau không?', t2: 'Bạn đoán trước, rồi xem Shin đếm từ các chuyện trong khóa.' },
      { k: 'common' },
      { k: 'base' }
    ] },
  b23: { st: 'b2', t: 'Hỏi chị Hạnh', d: 'Hỏi điều bạn tò mò, viết câu hỏi của riêng bạn', mins: 4,
    steps: [
      { k: 'chat' },
      { k: 'write', key: 'b23.q', min: 8, q: 'Nếu được gặp một anh chị đi trước thật, bạn sẽ hỏi câu gì?', sub: 'Thầy cô gom câu hỏi của lớp để mời anh chị cựu học viên trả lời trong buổi giao lưu.', ph: 'Ví dụ: Anh chị học tiếng Nhật thế nào sau giờ làm mệt?', tips: ['Anh chị chuẩn bị gì từ năm đầu để về có việc tốt?', 'Lúc muốn bỏ cuộc, anh chị làm gì?', 'Anh chị chọn ở lại hay về vì điều gì?'] }
    ] },
  b31: { st: 'b3', t: 'Cán cân', d: '6 cặp đều tốt: bạn nghiêng về đâu?', mins: 4,
    steps: [
      { k: 'say', mood: 'think', t: 'Mỗi cặp dưới đây, hai bên đều tốt. Không có bên đúng.', t2: 'Kéo về phía bạn coi trọng hơn lúc này. Chưa chắc thì để ở giữa.' },
      { k: 'pairs' },
      { k: 'write', key: 'b31.why', q: 'La bàn của bạn nghiêng rõ nhất về “[Lệch]”. Vì sao?', ph: 'Ví dụ: vì ba mẹ mình lớn tuổi rồi.', tips: ['Vì gia đình mình cần như vậy', 'Vì mình từng thử và thấy hợp', 'Vì mình muốn khác với trước đây', 'Mình chưa chắc, mình muốn nghĩ thêm'] }
    ] },
  b32: { st: 'b3', t: 'Gió ngoài khơi', d: 'Điều có thể làm đổi kế hoạch', mins: 4,
    steps: [
      { k: 'say', mood: 'worry', t: 'Ra khơi thì có lúc gió đổi chiều. Kế hoạch 5 năm cũng vậy.', t2: 'Xếp từng cơn gió: điều mình tác động được, hay điều khó tác động.' },
      { k: 'winds' },
      { k: 'write', key: 'b32.hard', q: 'Nếu “[Gió]” xảy ra, bạn sẽ làm gì?', ph: 'Ví dụ: mình sẽ nói chuyện với gia đình và hỏi Senpai đã gặp chuyện này.', tips: WIND_TIPS },
      { k: 'write', key: 'b32.can', q: 'Với “[Gió2]”, từ bây giờ bạn làm được gì?', ph: 'Ví dụ: mình ôn 10 từ mới mỗi tối.', tips: ['Mình sẽ học đều mỗi ngày', 'Mình sẽ ghi chi tiêu', 'Mình sẽ hỏi thầy cô khi chưa rõ'] }
    ] },
  b33: { st: 'b3', t: 'Shin nhớ thầy dặn', d: 'Một đường đời, nhiều cách đi', mins: 4,
    steps: [
      { k: 'life' },
      { k: 'write', key: 'b33.work', q: 'Với bạn, đi làm là để…', ph: 'Viết tiếp câu này theo cách của bạn.', tips: WORK_TIPS },
      { k: 'write', key: 'b33.life', q: 'Ở tuổi 30, một cuộc sống tốt với bạn là…', ph: 'Viết tiếp câu này theo cách của bạn.', tips: LIFE_TIPS },
      { k: 'compass' }
    ] },
  b41: { st: 'b4', t: 'Hải trình A · Đường đang đi', d: 'Hướng bạn đang nghĩ tới', mins: 4,
    steps: [
      { k: 'say', mood: 'think', t: 'Hải trình A là hướng bạn đang nghĩ tới lúc này. Chưa chắc cũng được, cứ vẽ ra.', t2: 'Mỗi hải trình dài 5 năm, tính từ lúc bạn xong 3 năm ở Nhật.' },
      { k: 'voy', v: 'b41' },
      { k: 'tline', v: 'b41' },
      { k: 'meters', v: 'b41' }
    ] },
  b42: { st: 'b4', t: 'Hải trình B · Nếu đường A đóng lại', d: 'Đường A không đi được nữa thì sao?', mins: 4,
    steps: [
      { k: 'say', mood: 'worry', t: 'Giả sử đường A đóng lại. Ví dụ: “[Gió]”. Bạn không đi tiếp đường A được nữa.', t2: 'Bạn sẽ đi đâu? Hải trình B không phải đường xấu hơn. Chỉ là một đường khác.' },
      { k: 'voy', v: 'b42' },
      { k: 'tline', v: 'b42' },
      { k: 'meters', v: 'b42' }
    ] },
  b43: { st: 'b4', t: 'Hải trình C · Nếu không lo tiền, không lo ai nghĩ gì', d: 'Hải trình của ước mơ, rồi đặt 3 hải trình cạnh nhau', mins: 5,
    steps: [
      { k: 'say', mood: 'wink', t: 'Giờ thử tưởng tượng: tiền không phải lo, không ai chê cười. Bạn muốn đi đâu?', t2: 'Có thể là đảo bạn từng gắn nhãn “Chưa hợp lúc này”. Cứ mơ thoải mái.' },
      { k: 'voy', v: 'b43' },
      { k: 'tline', v: 'b43' },
      { k: 'meters', v: 'b43' },
      { k: 'trio' },
      { k: 'write', key: 'b43.see', q: 'Đặt 3 hải trình cạnh nhau, bạn thấy điều gì?', ph: 'Ví dụ: cả 3 đường đều cần mình giỏi tiếng Nhật.', tips: TRIO_TIPS }
    ] },
  b51: { st: 'b5', t: 'Bàn cân nhắc', d: 'Cân 3 hải trình theo điều bạn coi trọng', mins: 4,
    steps: [
      { k: 'say', mood: 'think', t: 'Mình cân 3 hải trình nhé. Bạn chọn điều nào nặng, điều nào nhẹ với bạn.', t2: 'Kết quả cân chỉ là gợi ý. Thấy không giống cảm giác của mình cũng là một điều đáng biết.' },
      { k: 'weigh' },
      { k: 'leanpick' },
      { k: 'write', key: 'b51.why', q: 'Điều gì làm bạn nghiêng như vậy?', ph: 'Ví dụ: hải trình A gần gia đình, mà mình thấy làm được.', tips: ['Vì gia đình mình cần như vậy', 'Vì mình thấy làm được', 'Vì mình thích nhất', 'Mình cần tìm hiểu thêm rồi mới nghiêng'] }
    ] },
  b52: { st: 'b5', t: 'Khi đường bị chặn', d: 'Tách vấn đề, hỏi vì sao, nghĩ nhiều cách', mins: 5,
    steps: [
      { k: 'block' },
      { k: 'why3' },
      { k: 'ways' },
      { k: 'real' }
    ] },
  b53: { st: 'b5', t: 'Thử nhỏ 2 tuần', d: 'Một việc nhỏ để thử hải trình bạn nghiêng', mins: 3,
    steps: [
      { k: 'say', mood: 'curious', t: 'Thuyền trưởng giỏi không lao ngay ra biển lớn. Họ thử một đoạn ngắn trước.', t2: 'Chọn một việc nhỏ làm trong 2 tuần ở JPC. Làm xong, bạn sẽ hiểu hải trình của mình hơn.' },
      { k: 'trial' },
      { k: 'write', key: 'b53.learn', q: 'Sau 2 tuần thử, bạn muốn biết điều gì?', ph: 'Ví dụ: mình muốn biết mình có giữ được việc học mỗi tối không.', tips: LEARN_TIPS }
    ] },
  b61: { st: 'b6', t: 'Ngọn hải đăng của bạn', d: 'Ai soi đường cho bạn? Soạn một tin xin lời khuyên', mins: 5,
    steps: [
      { k: 'say', mood: 'hi', t: 'Nhiều anh chị có bước ngoặt nhờ một người soi đường: cấp trên, đồng nghiệp, Senpai, thầy cô.', t2: 'Mình vẽ ngọn hải đăng của bạn: những ai đang ở gần, ai cần tìm thêm.' },
      { k: 'ring' },
      { k: 'msg' }
    ] },
  b62: { st: 'b6', t: 'Học từ công việc', d: '3 tình huống ở chỗ làm, chọn cách bạn học', mins: 4,
    steps: [
      { k: 'say', mood: 'focused', t: 'Ở Nhật, chỗ làm là lớp học lớn nhất. Người lên nhanh là người biết học từ việc, từ cấp trên, từ đồng nghiệp.', t2: 'Mỗi tình huống có nhiều cách. Cách nào cũng có cái được và một lưu ý.' },
      { k: 'work' },
      { k: 'habit' },
      { k: 'write', key: 'b62.how', q: 'Tuần này ở JPC, bạn tập cách học đó thế nào?', ph: 'Ví dụ: mỗi buổi học kỹ năng, mình ghi 3 điều mới vào sổ.', tips: HOW_TIPS }
    ] },
  f1: { st: 'fin', t: 'Nhìn lại hải trình', d: 'Đo độ mở lần 2, so với lúc nhận thuyền', mins: 3,
    steps: [
      { k: 'say', mood: 'moved', t: 'Thuyền của [Tên] đã ghé đủ 6 bến! Shin hỏi lại 2 câu lúc nhận thuyền nhé.', t2: 'Rõ hơn hay bớt chắc đều tốt. Nghĩa là bạn đã nghĩ kỹ hơn.' },
      { k: 'open2' },
      { k: 'write', key: 'f1.change', q: 'So với lúc nhận thuyền, bạn thấy mình khác đi điều gì?', ph: 'Ví dụ: mình biết thêm 3 hướng mình chưa từng nghe.', tips: CHANGE_TIPS }
    ] },
  f2: { st: 'fin', t: 'Hải trình của tôi', d: 'Bản 1 trang, báo thầy cô, nhận Bằng Thuyền Trưởng', mins: 4, btn: 'Nhận Bằng Thuyền Trưởng',
    steps: [
      { k: 'sheet' },
      { k: 'send' },
      { k: 'cert' }
    ] }
};
var ORDER = ['x1', 'b11', 'b12', 'b13', 'b21', 'b22', 'b23', 'b31', 'b32', 'b33', 'b41', 'b42', 'b43', 'b51', 'b52', 'b53', 'b61', 'b62'];
var FIN_ORDER = ['f1', 'f2'];

/* ---------- CHỮ CHUNG ---------- */
var SHIN_TALK = {
  home: ['Biển hôm nay lặng. Đi tiếp một chặng nhé [Tên]!', 'Mỗi bến ghé qua, hải đồ của bạn rõ thêm một chút.', 'Đi chậm mà chắc. Shin ở đây với bạn.'],
  homeNew: 'Chào [Tên]! Shin là thuyền trưởng dẫn đường. Nhận thuyền ở Cảng 3 Năm rồi mình ra khơi nhé!',
  homeWait: 'Bạn đã đi hết các bến đang mở. Các bến sau đang được dựng, sắp mở rồi!',
  homeFin: 'Bạn đã nhận Bằng Thuyền Trưởng! Hải đồ vẫn ở đây, ghé lại đảo và Senpai lúc nào cũng được.',
  lockFin6: 'Ghé đủ 6 bến (có đủ 6 con dấu) để tới Cảng Khởi Hành.',
  bottle: 'Thư trong chai hôm nay',
  bottleSub: 'Một câu của anh chị đi trước trôi vào bờ',
  fogT: 'Sương đã tan',
  stampT: 'Con dấu bến',
  doneAct: 'Xong chặng!',
  soon: 'Bến này đang được dựng. Sắp mở!',
  lockR2: 'Ghé đủ 2 bến của Vòng Khám phá để mở bến này.',
  lockR2b: 'Xong Xưởng La Bàn để mở bến này.',
  lockR3: 'Xong Vòng Thiết kế để mở bến này.',
  lockFin: 'Ghé đủ 6 bến để tới Cảng Khởi Hành.',
  lockP: 'Nhận thuyền ở Cảng 3 Năm trước nhé.',
  redo: 'Bạn đã xong chặng này. Xem lại hoặc sửa thoải mái, bài cũ vẫn giữ.',
  cardNew: 'Thẻ Senpai mới',
  insT: 'Viết thật, viết đủ ý thì được Insight'
};
