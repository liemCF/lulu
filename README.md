# Lulu Modern Chinese — Homepage prototype

Bản mẫu redesign trang chủ cho lulu-modern.com. Hướng thiết kế: Asian restaurant, modern, high-end, có chút clubbing.

**Stack:** Next.js 16 (App Router) · Tailwind v4 · GSAP 3.15 (ScrollTrigger, SplitText) · Lenis

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Cấu trúc

| File | Vai trò |
|---|---|
| `lib/content.ts` | Toàn bộ nội dung: link, giờ mở cửa, món, cocktail, review, gallery. Sửa nội dung ở đây. |
| `lib/gsap.ts` | Đăng ký các plugin GSAP |
| `lib/reveal.ts` | Hiệu ứng reveal dùng chung qua các thuộc tính `data-split`, `data-fade`, `data-clip` |
| `components/SmoothScroll.tsx` | Lenis chạy chung ticker với GSAP |
| `components/*.tsx` | Mỗi section là một component |
| `public/images/` | Ảnh chụp thật lấy từ site cũ, đã nén sang webp |

## Các section

1. **Preloader + Hero:** chữ 品味 và bộ đếm, rèm mở ra, ảnh vịt quay bốc lửa thu nhỏ dần, tiêu đề hiện từng dòng.
2. **Marquee:** chạy nhanh hơn và nghiêng nhẹ theo tốc độ cuộn.
3. **The Duck:** pin khi cuộn, 3 bước với ảnh hiện dần bằng clip-path (trên mobile hiển thị dạng xếp chồng).
4. **Menu:** cuộn ngang khi pin, ảnh có parallax bên trong (trên mobile là swipe có scroll-snap).
5. **After Dark:** chữ neon nhấp nháy như biển hiệu bật sáng, nền có quầng sáng trôi chậm, collage ảnh parallax, list cocktail.
6. **Story + Chef:** đoạn manifesto sáng dần theo từng chữ khi cuộn.
7. **Reviews:** quote tự động chuyển, chỉ chạy khi section đang hiển thị.
8. **Private Dining:** ảnh mở rộng từ khung ra full màn hình, kèm số liệu sức chứa.
9. **Gallery:** 2 hàng ảnh chạy ngược chiều nhau.
10. **Footer:** chữ "Reserve" lớn, giờ mở cửa (đánh dấu các đêm mở khuya), thông tin liên hệ.

**Lớp hiệu ứng cao cấp:**

- **Intro** (`Hero.tsx`): logo hiện dần từ mờ trên nền đen, có vệt sáng vàng lướt qua. Đường chỉ vàng chạy theo tiến độ tải ảnh hero. Sau đó hai cánh cửa sơn mài trượt mở. Nếu đã xem trong phiên này thì chỉ chạy đoạn mở cửa.
- **Hero WebGL** (`HeroCanvas.tsx`): shader tạo sóng nhiệt bốc từ lửa, gợn sóng theo chuột, tách màu RGB theo tốc độ cuộn. Nếu máy không hỗ trợ WebGL thì tự quay về ảnh tĩnh.
- **Con trỏ custom và nút nam châm** (`Cursor.tsx`): thêm `data-cursor="Nhãn"` vào phần tử để con trỏ hiện nhãn đó.
- **Ảnh nổi theo chuột** (`HoverPreview.tsx`): dùng ở danh sách dịp tiệc trong Private Dining.
- **Chữ vàng ánh kim** (class `.gold-foil`) và ánh lửa chập chờn ở section The Duck.
- **Trạng thái giờ mở cửa** (`OpenStatus.tsx`): tính theo giờ America/Chicago, dữ liệu lấy từ `schedule` trong `content.ts`.
- **Footer** trượt lên kiểu parallax.

Toàn bộ hiệu ứng được tắt khi người dùng bật `prefers-reduced-motion`. Con trỏ custom và ảnh hover chỉ bật trên máy có chuột.

## Trang con

| Route | Nội dung |
|---|---|
| `/menu` | Menu đầy đủ lấy từ site cũ (`lib/menu.ts`, 133 món), chia 3 tab: Kitchen, Bar, After Dark (bottle service). Có thanh danh mục dính trên đầu và tự sáng theo vị trí cuộn, nhãn cay / GF. |
| `/story` | Toàn bộ câu chuyện từ trang About cũ: hai hình tượng của Lulu, triết lý ẩm thực, lời founder Sunny Chang, phần Chef. |
| `/private-dining` | Sức chứa, 4 nhóm thông tin (Suitable For, Private Hire, F&B, Features), danh sách dịp tiệc có ảnh hover, khối liên hệ đặt tiệc. |
| `/gallery` | 27 ảnh dàn kiểu masonry, lọc theo Food / Nights / Room, lightbox điều khiển bằng bàn phím. |

**Chuyển trang** (`PageTransition.tsx`): cửa sơn mài đóng lại rồi mở ra, giống intro trang chủ. Link nội bộ dùng `TLink`; thẻ `<a href="/...">` thường cũng tự được bắt.

## Cần khách hàng xác nhận

- **Copy viết mới (DRAFT):** mô tả 3 bước của section The Duck, đoạn mở đầu After Dark ("When the dining room winds down…"), và caption ảnh Lulu. Phần còn lại lấy nguyên từ site cũ.
- **Ghép ảnh với món:** ảnh Wagyu XLB, Sichuan Pickled Fish và Beef Short Rib do mình tự chọn theo hình, cần khách xác nhận đúng món.
- **Nút Reserve** đang trỏ tới OpenTable. Site cũ còn có form đặt bàn riêng, cần thống nhất dùng một kênh.
- **Ảnh đầu bếp:** site cũ không có ảnh Chef Natalie Deprez, nên phần này đang dùng ảnh mural.
- **Logo:** đã tách nền navy từ file PNG 360px nên độ phân giải còn thấp. Cần file logo gốc (SVG hoặc AI).
- **Form đặt tiệc:** trang `/private-dining` đang trỏ tới form trên site cũ và số điện thoại, vì chưa có backend để nhận form.
- **FAQ, Catering, Happy Hour:** site cũ có các mục này nhưng trang FAQ load nội dung bằng JavaScript nên không lấy được, nên chưa dựng.
- **Copy viết mới trên trang con (DRAFT):** đoạn giới thiệu After Dark trong menu, đoạn "Let's plan your night", intro Gallery, nhãn "Tradition / Modern" ở trang Story.
- **Menu:** đã sửa vài lỗi chính tả (Heineken, Penicillin, Tito's). Bỏ "Free dessert", "1 Piece Wagyu Nigiri", Merch và VIP Ticket.
- **Ảnh không dùng:** các file kiểu `download-*.jpeg` / `images-*.jpeg` trên site cũ có vẻ tải từ internet về, nên đã loại bỏ.
