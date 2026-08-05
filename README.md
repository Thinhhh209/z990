# Trang cá nhân — Phiên bản 1.0

Trang giới thiệu bản thân dạng một-trang (one-page), thuần HTML/CSS/JS —
không cần cài đặt gì, không cần database. Có kèm trang `/admin` để chỉnh sửa
thông tin mà không phải sửa code.

## Cấu trúc thư mục

```
portfolio/
├── index.html              trang cá nhân (public)
├── admin.html              trang quản trị (có mật khẩu)
├── css/
│   ├── style.css           giao diện + hiệu ứng của trang chính
│   └── admin.css           giao diện riêng cho trang admin
├── js/
│   ├── data.js             nơi DUY NHẤT đọc/ghi dữ liệu cá nhân
│   ├── main.js             hiệu ứng + hiển thị dữ liệu ở trang chính
│   └── admin.js            logic đăng nhập + form ở trang admin
├── data/
│   └── profile.json        dữ liệu mặc định — SỬA FILE NÀY để đổi thông tin
├── assets/
│   └── music/
│       └── theme.mp3       (bạn tự thêm — xem README.txt trong thư mục này)
└── README.md
```

## Chạy thử trang

Cách đơn giản nhất là chạy qua một local server (khuyến nghị, tránh lỗi tải
file JSON do trình duyệt chặn `file://`):

- **VS Code**: cài extension "Live Server" → chuột phải vào `index.html` →
  "Open with Live Server".
- **Có Python**: mở terminal tại thư mục `portfolio/`, chạy
  `python -m http.server 8000`, rồi mở `http://localhost:8000`.
- **Không có server**: vẫn có thể mở `index.html` bằng cách nhấp đúp — trang
  sẽ tự dùng dữ liệu dự phòng có sẵn trong `js/data.js` nếu không tải được
  `data/profile.json`. Trang admin vẫn hoạt động bình thường.

## Cách đổi thông tin cá nhân

**Cách 1 — sửa trực tiếp (áp dụng cho mọi người xem trang):**
Mở `data/profile.json`, sửa nội dung, lưu lại. Mọi trình duyệt mở trang đều
thấy thông tin mới.

**Cách 2 — dùng trang quản trị (không cần biết code):**
1. Mở `admin.html`.
2. Đăng nhập bằng mật khẩu mặc định: `portfolio123`
   (đổi ngay trong `js/admin.js`, dòng `const ADMIN_PASSWORD = "..."`).
3. Chỉnh sửa thông tin, bấm **Lưu thay đổi** — dữ liệu được lưu vào
   `localStorage` của trình duyệt đó, trang chính sẽ tự cập nhật.
4. Muốn thay đổi này áp dụng cho mọi trình duyệt/thiết bị? Bấm
   **Xuất file JSON**, tải về, rồi thay vào `data/profile.json`.

> ⚠️ Mật khẩu admin chỉ là lớp bảo vệ cơ bản ở phía trình duyệt (không có
> máy chủ xác thực thật). Đủ dùng cho trang cá nhân của riêng bạn, nhưng nếu
> public rộng rãi thì đừng đặt thông tin thật quá nhạy cảm ở đây.

## Ảnh đại diện / ảnh bìa

Không bắt buộc phải có ảnh — nếu để trống, trang tự tạo avatar bằng chữ cái
đầu tên bạn. Muốn dùng ảnh thật: dán link ảnh (URL) vào ô "Ảnh đại diện" /
"Ảnh bìa" trong trang admin, hoặc điền trực tiếp vào `data/profile.json`.

## Nhạc nền

Xem hướng dẫn trong `assets/music/README.txt`. Chỉ cần thêm đúng một file
`theme.mp3` vào thư mục đó là xong — không cần sửa code.

## Hiệu ứng đã có sẵn

- Menu dính trên đầu (sticky) + cuộn mượt tới từng section
- Hiệu ứng gõ chữ cho dòng "Tôi là [Tên]"
- Fade-in khi cuộn tới từng phần
- Nút bấm hover scale + đổ bóng
- Nền particle/gradient chuyển động nhẹ
- Dark/Light mode (lưu lựa chọn, tự nhớ lần sau)
- Bấm vào thẻ thông tin → hiệu ứng cánh hoa bung ra
- Màn hình loading với logo tương tác theo chuột (trên máy tính)
- Nút bật/tắt nhạc nền

## Hướng nâng cấp sau này (gợi ý)

- Thay `localStorage` bằng một API/database thật nếu muốn nhiều người quản
  lý hoặc xem dữ liệu đồng bộ trên mọi thiết bị mà không cần bấm "Xuất file".
- Thêm xác thực đăng nhập phía máy chủ cho trang admin.
- Thêm phần blog/nhật ký nhỏ, tái sử dụng cùng cấu trúc `reveal` + dữ liệu
  JSON đã có.
- Tách `profile.json` thành nhiều file nhỏ hơn (vd: `projects.json` riêng)
  nếu danh sách dự án lớn dần theo thời gian.

Vì toàn bộ giao diện đọc dữ liệu qua `js/data.js`, những nâng cấp trên đều
có thể làm dần từng phần mà không phải viết lại trang chính hay trang admin.
