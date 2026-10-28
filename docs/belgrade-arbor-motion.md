# Belgrade Arbor (belgradearbor.rs) — phân tích chuyển động

Đọc từ bundle production của họ (Next.js + Lenis + GSAP 3.15: ScrollTrigger, SplitText, MorphSVGPlugin), tháng 10/2026. Ghi lại **kỹ thuật**, không sao chép nội dung hay asset.

## Hệ thống chung

- **Chữ**: serif mảnh PP Editorial Old (light) + Work Sans. Thang: `huge` 20rem/1, `hero` 10rem/1, `heading-1` 6.25rem, `heading-2` 3.5rem/1.1, `heading-3` 2rem, `kicker` 1.25rem, `paragraph` 1rem/1.2. Link: gạch chân, uppercase, tracking rộng.
- **Component chữ dùng chung (AnimatedText)**: SplitText theo từ, `from {opacity:0, y:"110%"}`, `duration .9`, `power3.out`, stagger `.06` (từ) / `.025` (ký tự), bắt đầu ở `top 88%`, chạy một lần.
- **Trạng thái hiện/ẩn của phần intro**: ẩn = `{opacity:0, y:"2rem", filter:"blur(4px)"}`, hiện = `{opacity:1, y:0, filter:"blur(0)"}`, ease `power1.inOut`.

## Từng section

| Section | Kỹ thuật |
|---|---|
| Loader | Nền vanilla, logo, thanh tiến trình + %, đếm 0→100 trong 2s rồi mờ đi; Lenis dừng trong lúc loader. |
| Hero | Video full màn (hiệu ứng kính sọc nằm sẵn trong video). Khi video chạy xong: wordmark khổng lồ 10.5vw ở đáy hiện từng ký tự (`y 2rem→0`, stagger .05). |
| Intro (900vh) | Màn hình sticky. 3 cảnh text bật/tắt bằng ScrollTrigger theo % (0–22%, 33–60%, 75–100%), chạy timeline play/reverse. Hai khung ảnh SVG `clipPath` bo hữu cơ, **MorphSVG** đổi hình khung, khung đổi kích thước/vị trí, ảnh A→B crossfade, cả cụm `xPercent -100`, cuối cùng `scale 1.1 + blur 4px + opacity 0`. Thanh tiến trình + số 01/02/03 lăn (`y ±1rem`, blur). Lớp lá cây `mix-blend-multiply` đung đưa `rotate 5` yoyo. |
| Location | Toàn section mở từ phải (`clipPath inset(0 100% 0 0)→0`, 1.7s `power2.inOut`), nền `scale 1.1→1`; nền cao hơn khung 20rem, parallax `top +=20rem`; thẻ video bo góc mở sau 1.3s. |
| Options (Residences / Business / Amenities) | Split 2 cột. Timeline khi `top 70%`: ảnh `inset(0 0 100% 0)→0`, khối chữ `inset(100% 0 0 0)→0` (ngược chiều), ảnh trong `scale 1.1→1`, 1.2s `power2.inOut`. Danh sách: hover thì tên trượt lên, bản nghiêng màu nhấn trượt vào; vạch dọc chạy theo dòng; panel chi tiết crossfade 300ms. |
| Roots | Nền navy. Chữ `huge` bay vào từng ký tự `x: 100vw` (stagger .1, 1.7s). 3 ảnh dùng **SVG mask**, `maskSize 0→100%` (stagger .3, delay 2s). Ảnh trôi theo chuột (`quickTo`, cường độ .09/.06/.035). |
| Horizontal | Hai tấm che từ giữa mở ra (`width 0`), ảnh panorama pin và chạy ngang `2×` độ rộng, 3 lớp mây parallax khác tốc độ, tiêu đề hiện rồi tan theo ký tự (`scale .7`, `blur 10px`). |
| Footer | Ảnh toà nhà cắt nền `y +10rem` theo cuộn, wordmark lớn đè lên. |
