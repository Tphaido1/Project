# StarShop — E-Commerce Project

## Tổng quan
StarShop là ứng dụng thương mại điện tử mẫu gồm hai phần:
- `Back-end/`: API server (Node.js + Express + MongoDB)
- `Front-end/`: SPA client (React + Vite)

Tính năng chính: đăng ký/đăng nhập, giỏ hàng, checkout, quản lý sản phẩm cho admin, tìm kiếm/lọc/sort, phân trang.

---

## Công nghệ
- Frontend: React, React Router, Vite
- Backend: Node.js, Express, Mongoose, MongoDB
- Auth: JWT
- Mật khẩu: bcryptjs
- Env: dotenv
- Upload: multer
- CORS: cors

---

## Cài đặt & chạy (tóm tắt)

1) Backend

```bash
cd "c:\Lập trình web\Đồ Án\Back-end"
npm install
# tạo file .env với MONGO_URI, JWT_SECRET, PORT (tùy chọn)
npm run dev
```

2) Frontend

```bash
cd "c:\Lập trình web\Đồ Án\Front-end"
npm install
# (tùy chọn) tạo .env: VITE_API_URL=http://localhost:5000
npm run dev
```

Mặc định backend lắng nghe `http://localhost:5000`. Frontend dev server thường ở `http://localhost:5173`.

---

## Cấu trúc dự án (tóm tắt)

- Front-end
  - `src/App.jsx` — router, state chính
  - `src/context/CartContext.jsx` — giỏ hàng
  - `src/context/ToastContext.jsx` — toast global
  - `src/components/*` — các page/component (AuthPage, CartPage, ProductDetail, OrderHistory, Profile, AdminProducts, AdminOrders, AdminUsers, OrderDetail, Toast)
  - `src/index.css` — style

- Back-end
  - `server.js` — khởi tạo Express, connect Mongo
  - `routes/*.js`, `controllers/*.js`, `models/*.js`, `middleware/*.js`
  - `routes/uploadRoutes.js` — endpoint upload ảnh
  - `uploads/` — nơi lưu file upload (served statically)

---

## API chính

### Auth
- `POST /api/auth/register` — body `{ name, email, password }` → trả token + user
- `POST /api/auth/login` — body `{ email, password }` → trả token + user
- `GET /api/auth/profile` — header `Authorization: Bearer <token>`
- `PUT /api/auth/profile` — cập nhật profile (yêu cầu token)

### Products
- `GET /api/products` — query: `search`, `category`, `sort`, `page`, `limit`
- `GET /api/products/categories`
- `GET /api/products/:id`
- `POST /api/products` — (admin) tạo sản phẩm
- `PUT /api/products/:id` — (admin) cập nhật
- `DELETE /api/products/:id` — (admin) xóa

### Orders
- `POST /api/orders` — (user) tạo đơn
- `GET /api/orders/myorders` — (user) lấy đơn của mình
- `GET /api/orders` — (admin) lấy tất cả đơn
- `GET /api/orders/:id` — (user|admin) xem chi tiết
- `PUT /api/orders/:id/status` — (admin) cập nhật trạng thái

### Upload
- `POST /api/upload` — multipart/form-data field `image` → trả `{ url: "/uploads/<filename>" }`
  - Files được lưu trong `Back-end/uploads` và phục vụ tĩnh tại `/uploads`.

---

## UI / Pages (tóm tắt)
- `/` — trang danh sách sản phẩm (search / filter / sort / pagination)
- `/product/:id` — chi tiết sản phẩm
- `/auth` — đăng ký / đăng nhập
- `/cart` — giỏ hàng + checkout
- `/orders` — lịch sử đơn hàng
- `/orders/:id` — chi tiết đơn
- `/profile` — cập nhật profile
- `/admin/products`, `/admin/orders`, `/admin/users` — trang quản trị (admin only)

---

## Upload ảnh (Admin)
- Admin có thể upload ảnh khi tạo/cập nhật sản phẩm trong `AdminProducts`.
- Frontend gửi file tới `POST /api/upload` (field `image`) và dùng `url` trả về làm `image` cho sản phẩm.
- Đảm bảo backend đang chạy khi upload.

Ví dụ curl:

```bash
curl -X POST "http://localhost:5000/api/upload" -F "image=@/path/to/file.jpg"
```

---

## Toast Notifications (Frontend)
- Hệ thống toast nhẹ được cung cấp qua `src/context/ToastContext.jsx` và component `src/components/Toast.jsx`.
- Cách dùng: import `useToast` và gọi `showToast(message, type)` (type: `info` | `success` | `error`).

---

## Kiểm tra nhanh & build
- Frontend build:

```bash
cd Front-end
npm run build
```

- Backend start (production):

```bash
cd Back-end
npm start
```

---

## Ghi chú
- Thêm file `.env.example` trước khi nộp bài để hướng dẫn cấu hình.
- Để deploy, bạn có thể build frontend (`npm run build`) rồi phục vụ folder `dist` bằng server hoặc deploy frontend trên Vercel/Netlify và backend trên Render/Heroku.

---

Nếu muốn, tôi có thể:
- thêm phần hướng dẫn triển khai chi tiết (Vercel / Render / Heroku),
- thêm preview ảnh trong modal `AdminProducts`,
- thêm progress bar cho upload ảnh.

Chọn mục bạn muốn tôi thực hiện tiếp.