/* =========================================================
   PROSKILLS · CẤU HÌNH CHUNG
   Đây là file thầy cô sửa nhiều nhất:
   - phiên bản gói (APP_VER)
   - danh sách thầy cô (dùng chung cho mọi module)
   - danh sách module hiển thị ở trang chủ, mật khẩu từng module
   Chỉ dùng cú pháp JavaScript kiểu cũ (var, function) để chạy trên iPhone đời cũ.
   ========================================================= */
var PS_CONFIG = {
  APP: 'Proskills',
  APP_VER: 'PS1.3.3',
  ORG: 'Khoa Kỹ năng · JPC · Proskills',

  /* Mật khẩu bản demo giáo viên, dùng chung cho MỌI module (phân biệt hoa thường).
     Mở demo: thêm ?demo vào link module (ví dụ .../Proskills/tk/?demo) rồi nhập mật khẩu.
     Lưu ý: website tĩnh nên ai mở mã nguồn vẫn đọc được; đây chỉ là khóa nhẹ để học viên không vào nhầm. */
  DEMO_PASS: 'Oden@123#',

  /* Diện đi Nhật: học viên chọn và có thể đổi */
  PATHS: ['Thực tập sinh', 'Ikusei Shuro', 'Kỹ năng đặc định', 'Chưa rõ'],

  /* Thầy cô hướng dẫn: [tên hiển thị, email Teams, lời giới thiệu ngắn]
     Lưu theo email nên đổi thứ tự không ảnh hưởng bài làm. */
  TEACHERS: [
    ['Cô Long Ngân', 'longngan@proskills.ac.vn', 'Cô Ngân nhiệt tình lắm! Có khó khăn gì, bạn cứ hỏi cô nha.'],
    ['Cô Kim Dung', 'dungndlk@jpc.edu.vn', 'Có gì khó, bạn cứ hỏi cô Dung nha. Cô sẽ góp ý thực tế để mình biết nên làm gì tiếp!'],
    ['Cô Lê Uyên', 'uyenlt@proskills.ac.vn', 'Lớp cô Uyên nhiều hoạt động lắm! Nhớ ăn uống đầy đủ để tham gia hết mình nha!'],
    ['Cô Trần Thi', 'tranthi@proskills.ac.vn', 'Chuyện sao đỏ, trực 5S hay nếp sinh hoạt ở ký túc xá, bạn có thể hỏi cô Thi nha!'],
    ['Thầy Đăng Khoa', 'Dangkhoa@proskills.ac.vn', 'Học với thầy Khoa nhớ đúng giờ nha! Có việc đột xuất thì nhắn xin phép thầy trước nhé.'],
    ['Cô Quỳnh Anh', 'quynhanh@proskills.ac.vn', 'Cô Quỳnh Anh tâm lý và nhẹ nhàng lắm. Có gì cần giúp đỡ, bạn cứ hỏi cô nha.'],
    ['Cô Nguyệt Quỳnh', 'quynhntn@proskills.ac.vn', 'Cô Nguyệt Quỳnh nghiêm lắm đó! Cô không nói nhiều, nhưng câu nào cũng thấm.']
  ],

  /* Danh sách module.
     id     : tên thư mục của module, cũng là tên vùng lưu bài (ps.mod.<id>)
     state  : 'ready' (học được) · 'soon' (sắp ra mắt, chỉ hiện thẻ) · 'hidden' (không hiện, dùng để thử)
     pass   : các câu trả lời đúng ở cổng, không phân biệt hoa thường, dấu, khoảng trắng.
              Giáo viên đọc mật khẩu cho học viên khi bắt đầu module tại lớp.
     gateQ  : câu hỏi hiện ở cổng
     color  : màu chủ đạo của module (chỉ dùng cho thẻ ở trang chủ)
     total  : số hoạt động chính để tính phần trăm (module tự báo lại khi chạy)
     ver    : phiên bản riêng của module */
  MODULES: [
    { id: 'cd01', code: 'CD01', title: 'Career Design 1', sub: 'Hiểu mình, chọn nghề, kế hoạch JPC và 3 năm đầu ở Nhật',
      icon: 'rail', color: '#2F6BFF', state: 'ready', gateQ: 'Shin thích ăn món gì nhất?', pass: ['oden', 'おでん', 'オデン'], total: 19, ver: 'CD01.0.3' },
    { id: 'cd02', code: 'CD02', title: 'Career Design 2', sub: 'Sau 3–5 năm ở Nhật: hướng đi 5–10 năm',
      icon: 'compass', color: '#0F9F98', state: 'soon', gateQ: '', pass: [], total: 0, ver: '0' },
    { id: 'tk', code: 'HP05', title: 'Nhật Bản Du Ký', sub: 'Kiến thức quy định: luật Nhật, luật cư trú, luật Việt Nam',
      icon: 'scroll', color: '#2F4BD8', state: 'ready', gateQ: 'Ngộ Không thích ăn quả gì nhất?', pass: ['dao'], total: 26, ver: 'TK15' },
    { id: 'mau', code: 'MẪU', title: 'Module mẫu', sub: 'Dùng để thử khung và làm mẫu cho module mới',
      icon: 'spark', color: '#E8834A', state: 'hidden', gateQ: 'Mật khẩu thử là gì?', pass: ['mau'], total: 3, ver: '1.0.0' }
  ]
};
