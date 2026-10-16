<p align="center">
  <h1 align="center">📸 PixelVault</h1>
  <p align="center">
    <strong>Hệ thống Cửa hàng Máy ảnh Kỹ thuật số</strong>
    <br />
    E-commerce chuyên nghiệp cho máy ảnh, ống kính & phụ kiện
  </p>
</p>

---

## ✨ Tính năng chính

### 🛒 Khách hàng
- **Tài khoản cá nhân** — Đăng ký, đăng nhập (Supabase Auth), quản lý hồ sơ
- **Duyệt sản phẩm** — Lọc theo danh mục, thương hiệu, khoảng giá, sắp xếp đa dạng
- **Giỏ hàng & Thanh toán** — Mã giảm giá, thanh toán QR tự động (VietQR + Sepay webhook)
- **Đánh giá sản phẩm** — Viết và đọc đánh giá thực từ cộng đồng
- **So sánh sản phẩm** — So sánh thông số chi tiết giữa nhiều sản phẩm
- **Ký gửi & Trade-in** — Gửi bán máy cũ hoặc đổi lấy máy mới
- **Cho thuê thiết bị** — Thuê máy ảnh theo ngày với quy trình tự động
- **AI Chatbot** — Trợ lý ảo tư vấn 24/7 (Google Gemini API)
- **PWA** — Cài đặt như app trên điện thoại/desktop

### 🔧 Quản trị (Admin)
- Dashboard tổng quan doanh thu, đơn hàng
- Quản lý sản phẩm, đơn hàng, khách hàng, đánh giá
- Quản lý ký gửi, thuê thiết bị, mã giảm giá
- Xác nhận thanh toán realtime

---

## 🛠️ Công nghệ

| Thành phần | Công nghệ |
|---|---|
| **Frontend** | HTML5, CSS3 (Vanilla), JavaScript ES6+ |
| **Backend** | Supabase (BaaS) – PostgreSQL, Auth, Realtime, RLS |
| **AI Chatbot** | Google Gemini API |
| **Thanh toán** | VietQR API + Sepay Webhook |
| **Email** | EmailJS |
| **PWA** | Service Worker + Web App Manifest |

---

## 🚀 Cài đặt & Chạy

### 1. Clone repository
```bash
git clone https://github.com/ducphuoc2408/website.git
cd website
```

### 2. Cấu hình Supabase
Tạo file `assets/js/config.js` từ template:

```js
// Copy nội dung này vào assets/js/config.js
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_KEY = 'your-anon-key-here';
```

> ⚠️ **Lưu ý:** File `config.js` đã được `.gitignore`. Xem `.env.example` để biết các biến cần thiết.

### 3. Khởi tạo Database
Chạy các file SQL theo thứ tự trong thư mục `database/`:
1. `database/schema/` — Tạo bảng và cấu trúc
2. `database/migrations/` — Thêm cột, sửa đổi
3. `database/triggers/` — Cài đặt trigger
4. `database/seed/` — (Tùy chọn) Thêm dữ liệu mẫu

### 4. Chạy website
Mở `index.html` trực tiếp hoặc dùng Live Server:
```bash
# Dùng VS Code Live Server extension
# Hoặc dùng Python
python -m http.server 8000

# Hoặc dùng npx
npx serve .
```

---

## 📂 Cấu trúc thư mục

```
website/
├── index.html              # Trang chủ
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── .env.example            # Template biến môi trường
│
├── pages/                  # Các trang con
│   ├── account.html        #   Tài khoản cá nhân
│   ├── checkout.html       #   Thanh toán
│   ├── compare.html        #   So sánh sản phẩm
│   ├── consignment.html    #   Ký gửi
│   ├── contact.html        #   Liên hệ
│   ├── privacy.html        #   Chính sách bảo mật
│   ├── product-detail.html #   Chi tiết sản phẩm
│   ├── products.html       #   Danh sách sản phẩm
│   ├── terms.html          #   Điều khoản sử dụng
│   └── trade-in.html       #   Đổi máy cũ
│
├── admin/                  # Trang quản trị
│   └── index.html
│
├── assets/
│   ├── css/style.css       # Stylesheet chính
│   ├── js/
│   │   ├── config.js       # ⚠️ Gitignored – chứa API keys
│   │   ├── data.js         # Supabase data layer
│   │   ├── main.js         # Logic chính
│   │   ├── mobile.js       # Responsive & mobile
│   │   └── ai-chatbot.js   # AI Chatbot (Gemini)
│   └── images/             # Hình ảnh sản phẩm
│
├── database/               # SQL scripts (Supabase/PostgreSQL)
│   ├── schema/             #   Khởi tạo bảng
│   ├── migrations/         #   Thay đổi cấu trúc
│   ├── triggers/           #   Database triggers
│   └── seed/               #   Dữ liệu mẫu
│
├── scripts/                # Development utilities
│   ├── generate_legal.py   #   Tạo trang pháp lý
│   ├── generate_tradein.py #   Tạo trang trade-in
│   ├── seed_products.js    #   Seed sản phẩm qua API
│   └── ...
│
└── docs/                   # Tài liệu dự án
    ├── Baocao_PixelVault.md
    └── ...
```

---

## 👥 Tác giả

- **Đức Phước** — [ducphuoc2408](https://github.com/ducphuoc2408)

---

## 📄 Giấy phép

Dự án này được phát triển cho mục đích học tập và nghiên cứu.
