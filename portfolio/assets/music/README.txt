Thêm nhạc nền cho trang ở đây
=============================

1. Chuẩn bị một file nhạc định dạng MP3 mà bạn có quyền sử dụng.
2. Đổi tên file thành:  theme.mp3
3. Đặt file vào đúng thư mục này (assets/music/theme.mp3).
4. Mở lại trang, bấm nút hình nốt nhạc ở góc dưới bên phải để phát/tắt.

Muốn dùng tên file khác hoặc thêm nhiều bài? Mở js/main.js, tìm dòng:
  <source src="assets/music/theme.mp3" ...>
trong file index.html và sửa lại đường dẫn cho phù hợp.

Lưu ý: hầu hết trình duyệt chặn nhạc tự phát khi mới vào trang — đây là quy
định chung để bảo vệ người dùng, không phải lỗi của trang. Vì vậy nhạc chỉ
phát sau khi người dùng bấm nút, và đó cũng là điều trang này đang làm.
