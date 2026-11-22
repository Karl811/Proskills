# CD02 · TIẾP TỤC (điểm vào khi thầy nói “Làm tiếp CD02”)
Cập nhật 22/11/2026 (khuya, sau PS1.3.52). Đọc file này, rồi `cd02-ban4-de-xuat.md` (bản 4, 4 đợt), `cd02-nguon-tu-lieu.md`.
**Bản 4 đã xong cả 4 đợt.** Việc tiếp theo: chờ thầy thử trên điện thoại + trả lời 3 câu ở mục “Chờ thầy trả lời”, rồi gom góp ý thành bản 5.

Mã: `Claude-Workspace/01-Dang-lam/PS1.3.52` trên máy thầy (device_bash `$HOME/mnt/Claude-Workspace`); AGENTS.md mục “Module cd02” (đoạn “Từ PS1.3.51”, “Từ PS1.3.52”), CHANGELOG.
Cách làm: `mkdir PSnew && cp -rn PSold/. PSnew/` trên máy thầy, sửa thẳng trên máy thầy bằng python (đọc–sửa–ghi); stage config, manifest, sw, index.html, offline.html, core/*, hub/*, icons/logo.svg + app-192.png, cd02/* + fonts/Lora-Variable.ttf vào mây chỉ để kiểm; `setsid python3 -m http.server 8765` ở thư mục cha của PSx. Kiểm bằng Playwright: lấy trạng thái demo (`?demo=<mật khẩu>` rồi đọc `localStorage['ps.demo.cd02']`), sửa done/stamp, `addInitScript` ghi lại, rồi mở link **không** có `?demo` (có `?demo=` thì demo bị nạp lại từ đầu); nhảy bằng `history.pushState` + `PopStateEvent` {cd2:1, v:'act', id, step} hoặc {cd2:1, v:'ben', st}; bấm nút bằng `$eval(sel, e => e.click())`. Demo có sẵn dấu p0, b1–b3; b63 demo thiếu bài nên không bấm xong được. Đổi số phiên bản: config APP_VER + ver CD02, sw VERSION, content CD2_VER, ?v= mọi trang html.

## Đã xong (bản 4)
- PS1.3.49 · CD02.3.5 (đợt 1): hải đồ vòng quanh, popup con dấu, nút đi tiếp, b32, la bàn, Sao chép link Tikme.
- PS1.3.50 · CD02.3.6 (đợt 2): 20 chặng, b33 dây ảnh, b53 ngã rẽ, b72, b73, Nhiệm vụ lên bờ.
- PS1.3.51 · CD02.3.7 (đợt 3): Rương kho báu, Bảng ước mơ thêm hình, Thư trong chai 7 bến, Thư gửi thuyền trưởng tương lai.
- **PS1.3.52 · CD02.3.8 (đợt 4)**: thuyền nâng cấp theo bến (`shipSVG2`, 9 mốc đã duyệt) ở mọi nơi; popup con dấu lần đầu: thuyền cũ → món mới hiện dần, lấp lánh, “Thuyền vừa có thêm: …” + 1 dòng ý nghĩa; Sổ tay › Bài làm: “Thuyền của bạn · cấp x/8”, món chưa có vẽ mờ + danh sách 8 món. Vệt nước dưới thuyền bo tròn (viewBox 160×108).

## Chờ thầy trả lời
1. Thẻ “Thư trong chai hôm nay” ở cuối trang chủ khóa trùng tên với Thư trong chai 7 bến. Đề xuất đổi thành “Lời anh chị hôm nay”. Chưa đổi.
2. Toast “Bằng Thuyền Trưởng Vững Vàng! +30 XP” che nút “Để sau” và nay che cả dòng “Thuyền vừa có thêm…” trong popup bằng. Đề xuất bỏ toast, ghi điểm trong popup như popup con dấu. Chưa đổi.
3. Ý nghĩa 8 món thuyền (SHIP_ITEM) do em viết, thầy duyệt chữ.

## Tikme và tư liệu
22/11 tikme.com lỗi 522. Vào Tikme không được thì dùng `03-Project-materials/CD02 materials`. Khi Tikme chạy lại: rà 22 link.

## Cần thầy thử trên điện thoại thật
PS1.3.52: xong bến mới → popup con dấu (thuyền hiện món mới, lấp lánh), hải đồ (thuyền đủ rõ không), Sổ tay › Bài làm (thuyền mờ, danh sách món), máy bật giảm chuyển động. Còn tồn: PS1.3.51 (rương, thư trong chai, thư tương lai), PS1.3.50 (b33, b53, b72, b73, Nhiệm vụ lên bờ), PS1.3.49, PS1.3.48, PS1.3.47 (clip MyRoad).

## Cần thầy kiểm tra
- Số liệu ngã rẽ (28/25 man, 15 triệu, 22 man) là minh họa; “Tổ trưởng Tanaka” là nhân vật giả định.
- 6 clip MyRoad: ý chính từ transcript tự động → thầy nghe lại.
- 7 câu Thư trong chai lấy nguyên văn từ thẻ Senpai trong khóa (nguồn Tikme/Myway); khi Tikme chạy lại nên đối chiếu.
