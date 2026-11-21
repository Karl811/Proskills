# CD02 · TIẾP TỤC (điểm vào khi thầy nói “Làm tiếp CD02”)
Cập nhật 21/11/2026. Đọc file này, rồi `cd02-ban3-de-xuat.md` (kế hoạch bản 3, 5 đợt: đã xong cả 5), `cd02-nguon-tu-lieu.md`.
Mã: `Claude-Workspace/01-Dang-lam/PS1.3.48` trên máy thầy (Mac: thư mục Google Drive `…/My Drive/Work/Claude-Workspace`, device_bash `$HOME/mnt/Claude-Workspace`); AGENTS.md mục “Module cd02” (đoạn “Từ PS1.3.48”), CHANGELOG.
Cách làm hiệu quả: `cp -rn` bản trước sang thư mục bản mới ngay trên máy thầy, stage các tệp cần chạy cd02 (config, manifest, sw, index.html, core/*, hub/*, icons, cd02/* kèm phông Lora) vào mây để sửa + kiểm bằng Playwright (`cd02/?demo=<DEMO_PASS>`). Muốn mở hết bến: mở ?demo, chờ ~1,5 giây cho bản demo lưu xong, rồi `addInitScript` (chạy 1 lần nhờ cờ sessionStorage) sửa `ps.demo.cd02` đánh dấu done mọi chặng + stamp mọi bến, rồi `goto` lại KHÔNG kèm ?demo. Nhảy tới chặng bằng `history.pushState` + `PopStateEvent` {cd2:1, v:'act', id, step}. Commit lại đúng tệp đã đổi; ?v=, APP_VER, VERSION, ver CD02 trong config.js sửa bằng sed trên máy thầy (không sed toàn bộ “PS1.3.xx” trong js).

## Bản hiện tại: PS1.3.48 · CD02.3.4 (bản 3 · đợt 5 xong = xong bản 3)
Đợt 1–4 (PS1.3.44–47): sửa nhanh giao diện; giới thiệu bến, con dấu, Hướng đi đủ mảnh, b22, b32, b71, RIASEC; Phòng Tuyển Dụng; clip MyRoad, ba anh em, nối Shin routine.
Đợt 5 (PS1.3.48): hình 26 thẻ Senpai (`SP_ART`: cảnh hôm nay + đồ vật khởi đầu; thẻ nhỏ + banner “Khởi đầu → Hôm nay”) · Bảng ước mơ 10 năm nữa 3×3 (f2 bước đầu, 27 sticker, Shin gợi ý ≤4 ô, cần ≥6/8; có trong bản Hướng đi, ảnh lưu, Sổ tay, tin nhắn, báo cáo) · rương kho báu ở banner Đảo Kho Báu · kiểm trọn khóa 390/1280. Thầy bỏ checklist THT.

## Việc tiếp theo (chờ thầy)
- Thầy thử trên điện thoại thật, góp ý bản 3.
- Hỏi thầy: có cần file Excel duyệt chữ bản cuối không (thầy nói chỉ làm khi thầy yêu cầu ở bản cuối).

## Cần thầy thử trên điện thoại thật (PS1.3.48)
Thẻ Senpai: hình rõ không, có ai thấy hình chưa hợp nghề/hướng của anh chị đó (sửa nhanh ở `SP_ART`) · Bảng ước mơ: chạm ô, chọn hình, ghi chú, “Bỏ hình ô này”, nút Xong; Lưu ảnh có lưới 3×3 và cờ ở giữa · iPhone đời cũ: ô lưới vuông có bị méo không.
Còn tồn: clip MyRoad, thẻ Shin routine (PS1.3.47); b61 tờ báo, b62, b63 (PS1.3.46); popup con dấu, b32, b71, ảnh Hướng đi (PS1.3.45).

## Cần thầy kiểm tra
- 6 clip: em chọn “đoạn đáng xem” và viết 3 ý từ transcript tự động (có chỗ máy nghe sai) → thầy nghe lại đoạn, sửa ý nếu lệch. Không dùng câu trích nguyên văn từ clip; câu của Thầy Sơn trong clip chị Cẩm Vinh chỉ kể gián tiếp “thầy ở trường cũ”.
- Anh Thiệu: chưa rõ JLPT, chưa rõ tên công ty → chỉ ghi “Phó Giám đốc một công ty cơ khí”, không làm thẻ Senpai. Anh Hợi: thẻ cũ chưa có JLPT.
- Ba anh em: trang Tikme ghi N1 ở phần tổng hợp, không ghi riêng từng người → thẻ ghi N1, thầy duyệt.
- Chị Son: clip có chuyện gia đình nhạy cảm (đoạn 0:00–9:00); khóa học chỉ mở từ 9:13 và không kể lại phần đó.
- Lương ở Nhật diện số 2 / Kaigo (từ PS1.3.46) vẫn là ước tính.
