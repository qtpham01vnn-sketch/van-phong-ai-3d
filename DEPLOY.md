# Bản của anh: chạy trên máy và đưa demo lên Vercel

## Chạy trên máy

Máy cần Node.js 18 trở lên. Chạy `node setup.js --yes` một lần, rồi `npm start`.
Mở `http://127.0.0.1:7788`. Trang này đọc nhật ký Claude Code/Codex trên chính máy chạy máy chủ.
`config.json` và `data/` chỉ lưu trên máy, đã được loại khỏi Git.

## Đưa bản demo lên Vercel

Đưa mã nguồn này lên một kho GitHub thuộc tài khoản của anh, rồi tại Vercel chọn **Add New → Project → Import Git Repository**. Chọn kho vừa tạo và Deploy. `vercel.json` đã đặt lệnh tạo giao diện tĩnh và thư mục đầu ra; không cần điền biến môi trường.

Bản Vercel dùng dữ liệu minh họa trong `demo/fixtures/`. Nó không đọc nhật ký trên máy anh, không nhận tin nhắn và không cần khóa truy cập. Giao diện có nhãn **BẢN DEMO**. Khi cần cập nhật dữ liệu minh họa, sửa các fixture và đẩy mã lên GitHub.

## Ranh giới dữ liệu

Không đưa `config.json`, `data/`, nhật ký trong `~/.codex` hoặc `~/.claude` lên GitHub hay Vercel. Muốn theo dõi phiên thật từ xa cần thiết kế riêng cơ chế đồng bộ và xác thực.
