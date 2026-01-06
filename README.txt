================================================================================
                        BACKEND CONFIGURATION GUIDE
                           Auction Web Application
================================================================================

📋 MỤC LỤC
--------------------------------------------------------------------------------
1. Yêu cầu hệ thống
2. Cài đặt dependencies
3. Cấu hình biến môi trường (.env)
4. Cấu hình Database (PostgreSQL)
5. Cấu hình Cloudinary (Upload ảnh)
6. Cấu hình Email Service
7. Chạy ứng dụng
8. API Endpoints

================================================================================
1. YÊU CẦU HỆ THỐNG
================================================================================

- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL database (có thể dùng Supabase, Render, hoặc local)
- Tài khoản Cloudinary (để upload ảnh)
- Tài khoản Email (Gmail hoặc Resend)

================================================================================
2. CÀI ĐẶT DEPENDENCIES
================================================================================

Mở terminal tại thư mục backend và chạy:

    cd backend
    npm install

Các packages chính sẽ được cài đặt:
- express       : Web framework
- pg            : PostgreSQL client
- dotenv        : Quản lý biến môi trường
- bcrypt        : Mã hóa mật khẩu
- jsonwebtoken  : JWT authentication
- cloudinary    : Upload và quản lý ảnh
- multer        : Xử lý file upload
- cors          : Cross-Origin Resource Sharing
- helmet        : Bảo mật HTTP headers
- nodemailer    : Gửi email
- resend        : Email API service

================================================================================
3. CẤU HÌNH BIẾN MÔI TRƯỜNG (.env)
================================================================================

Tạo file .env trong thư mục backend với nội dung sau:

--------------------------------------------------------------------------------
# DATABASE CONFIGURATION
--------------------------------------------------------------------------------
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>

# Ví dụ với Supabase:
# DATABASE_URL=postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres

# Ví dụ với local PostgreSQL:
# DATABASE_URL=postgresql://postgres:123456@localhost:5432/auction_db

--------------------------------------------------------------------------------
# SERVER CONFIGURATION
--------------------------------------------------------------------------------
BACKEND_PORT=5000
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

--------------------------------------------------------------------------------
# JWT CONFIGURATION (Authentication)
--------------------------------------------------------------------------------
JWT_SECRET=your_super_secret_key_here_make_it_long_and_random
JWT_EXPIRES_IN=1d

# Lưu ý: JWT_SECRET nên là chuỗi ngẫu nhiên, dài ít nhất 32 ký tự
# Có thể generate bằng: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

--------------------------------------------------------------------------------
# CLOUDINARY CONFIGURATION (Image Upload)
--------------------------------------------------------------------------------
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_SECURE=true

--------------------------------------------------------------------------------
# EMAIL CONFIGURATION
--------------------------------------------------------------------------------
# Option 1: Sử dụng Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Option 2: Sử dụng Gmail SMTP
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Lưu ý: Với Gmail, bạn cần tạo App Password, không dùng mật khẩu thường
# Xem hướng dẫn: https://support.google.com/accounts/answer/185833

================================================================================
4. CẤU HÌNH DATABASE (PostgreSQL)
================================================================================

BƯỚC 1: Tạo database
---------------------

>>> OPTION A: Sử dụng Supabase (Khuyến nghị) <<<

A1. Đăng ký tài khoản Supabase
    - Truy cập: https://supabase.com/
    - Nhấn "Start your project" hoặc "Sign Up"
    - Đăng ký bằng GitHub, Google hoặc Email

A2. Tạo Project mới
    - Sau khi đăng nhập, nhấn "New Project"
    - Điền thông tin:
        + Name: auction-web (hoặc tên bạn muốn)
        + Database Password: Tạo mật khẩu mạnh (LƯU LẠI MẬT KHẨU NÀY!)
        + Region: Southeast Asia (Singapore) - chọn gần Việt Nam nhất
    - Nhấn "Create new project"
    - Đợi 1-2 phút để Supabase khởi tạo database

A3. Lấy Connection String (DATABASE_URL)
    - Vào Project vừa tạo
    - Click "Project Settings" (biểu tượng bánh răng góc trái dưới)
    - Chọn "Database" trong menu bên trái
    - Kéo xuống phần "Connection string"
    - Chọn tab "URI"
    - Copy connection string, có dạng:
      postgresql://postgres:<password>@<host>:<port>/postgres
    
    - THAY [YOUR-PASSWORD] bằng mật khẩu bạn đã tạo ở bước A2
    
    Ví dụ sau khi thay:
    DATABASE_URL=postgresql://postgres:hcmus123@Auction@db.rkwtkfksmrphstnwuumj.supabase.co:5432/postgres

A4. Chạy SQL trong Supabase
    - Vào "SQL Editor" (menu bên trái)
    - Nhấn "New query"
    - Copy nội dung từ các file SQL và chạy theo thứ tự:
        1. schema.sql
        2. stored_procedures.sql  
        3. index.sql
    - Nhấn "Run" (Ctrl + Enter) để thực thi

>>> OPTION B: Sử dụng Local PostgreSQL <<<

B1. Cài đặt PostgreSQL
    - Download từ: https://www.postgresql.org/download/
    - Cài đặt và ghi nhớ password cho user "postgres"

B2. Tạo database
    Mở pgAdmin hoặc psql terminal và chạy:
    CREATE DATABASE auction_db;

B3. Cấu hình DATABASE_URL
    DATABASE_URL=postgresql://postgres:your_password@localhost:5432/auction_db

--------------------------------------------------------------------------------

BƯỚC 2: Chạy schema
---------------------
Mở file: backend/src/database/schema.sql
Chạy toàn bộ nội dung trong PostgreSQL client hoặc GUI tool (pgAdmin, DBeaver)

BƯỚC 3: Chạy stored procedures
----------------------------------------
Mở file: backend/src/database/stored_procedures.sql
Chạy toàn bộ nội dung

BƯỚC 4: Chạy Index
----------------------------------
Mở file: backend/src/database/index.sql

================================================================================
5. CẤU HÌNH CLOUDINARY (Upload ảnh)
================================================================================

BƯỚC 1: Đăng ký tài khoản
--------------------------
Truy cập: https://cloudinary.com/
Đăng ký tài khoản miễn phí

BƯỚC 2: Lấy thông tin API
--------------------------
Sau khi đăng nhập, vào Dashboard để lấy:
- Cloud Name
- API Key  
- API Secret

BƯỚC 3: Cập nhật .env
----------------------
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_SECURE=true

================================================================================
6. CẤU HÌNH EMAIL SERVICE
================================================================================

OPTION A: Sử dụng Resend (Khuyến nghị)
---------------------------------------
1. Đăng ký tại: https://resend.com/
2. Tạo API Key
3. Cập nhật .env:
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

OPTION B: Sử dụng Gmail SMTP
-----------------------------
1. Bật 2-Step Verification cho Gmail
2. Tạo App Password:
   - Vào Google Account > Security > 2-Step Verification > App passwords
   - Chọn "Mail" và "Windows Computer"
   - Copy password được tạo
3. Cập nhật .env:
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=xxxx_xxxx_xxxx_xxxx

================================================================================
7. CHẠY ỨNG DỤNG
================================================================================

Development mode:
-----------------
    cd backend
    npm start

Server sẽ chạy tại: http://localhost:5000

Kiểm tra kết nối:
-----------------
Nếu thành công, terminal sẽ hiển thị:
    ✅ Connected to Render PostgreSQL!
    🚀 Server running on port 5000

================================================================================
8. API ENDPOINTS
================================================================================

Base URL: http://localhost:5000/api

Users:
------
    /api/users          - Quản lý người dùng

Products:
---------
    /api/products       - Quản lý sản phẩm đấu giá

Categories:
-----------
    /api/categories     - Quản lý danh mục

Bidder:
-------
    /api/bidder         - Chức năng người đấu giá

Seller:
-------
    /api/seller         - Chức năng người bán

Comments:
---------
    /api/comments       - Quản lý bình luận/đánh giá

Search:
-------
    /api/search         - Tìm kiếm sản phẩm

================================================================================
                        FRONTEND CONFIGURATION GUIDE
                           Auction Web Application
================================================================================

📋 MỤC LỤC
--------------------------------------------------------------------------------
1. Yêu cầu hệ thống
2. Cài đặt dependencies
3. Cấu hình biến môi trường (.env)
4. Cấu trúc thư mục quan trọng
5. Cấu hình Redux Store
6. Chạy ứng dụng
7. Kiểm tra kết nối
8. Cấu hình CORS (Backend)
9. Routing & Navigation
10. API Endpoints được sử dụng
11. Xử lý lỗi thường gặp
12. Ghi chú quan trọng

================================================================================
1. YÊU CẦU HỆ THỐNG
================================================================================

- Node.js >= 18.x
- npm >= 9.x
- Backend đã chạy tại http://localhost:5000

================================================================================
2. CÀI ĐẶT DEPENDENCIES
================================================================================

Mở terminal tại thư mục frontend và chạy:

    cd frontend
    npm install

Các packages chính sẽ được cài đặt:
- react                 : UI Framework (^19.1.0)
- vite                  : Build tool & Dev server (^6.3.5)
- @reduxjs/toolkit      : State management (^2.8.2)
- react-router-dom      : Routing (^7.9.4)
- axios                 : HTTP client (^1.13.2)
- tailwindcss           : CSS framework (^4.1.16)
- react-toastify        : Toast notifications (^11.0.5)
- lucide-react          : Icons (^0.525.0)
- @radix-ui/*           : UI components
- react-hook-form       : Form validation (^7.67.0)
- date-fns              : Date utilities (^4.1.0)

================================================================================
3. CẤU HÌNH BIẾN MÔI TRƯỜNG (.env)
================================================================================

Tạo file .env trong thư mục frontend với nội dung sau:

--------------------------------------------------------------------------------
# API CONFIGURATION
--------------------------------------------------------------------------------
VITE_API_BASE_URL=http://localhost:5000/api

# Lưu ý: Đây là URL của backend API. Nếu backend chạy port khác, thay đổi cho phù hợp

--------------------------------------------------------------------------------
# WEBSITE BASE URL
--------------------------------------------------------------------------------
VITE_WEBSITE_BASE_URL=http://localhost:3000

# Dùng cho share links, comments, email notifications

--------------------------------------------------------------------------------
# GOOGLE RECAPTCHA (Optional)
--------------------------------------------------------------------------------
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here

# Lấy từ: https://www.google.com/recaptcha/admin
# Chọn reCAPTCHA v2 "I'm not a robot"
# Thêm domain: localhost
# Copy Site Key và paste vào đây

Lưu ý về biến môi trường Vite:
-------------------------------
- Tất cả biến môi trường phải bắt đầu bằng VITE_
- Sau khi thay đổi .env, cần restart dev server (Ctrl+C rồi npm run dev lại)
- Không commit .env vào git (đã có trong .gitignore)

================================================================================
4. CẤU TRÚC THƯ MỤC QUAN TRỌNG
================================================================================

frontend/
├── src/
│   ├── api/              # API calls (user.api.js, product.api.js...)
│   │   ├── admin.api.js
│   │   ├── category.api.js
│   │   ├── comment.api.js
│   │   ├── product.api.js
│   │   ├── seller.api.js
│   │   ├── user.api.js
│   │   └── watchlist.api.js
│   │
│   ├── components/       # React components
│   │   ├── common/      # Shared components (ProductCard, BiddingForm...)
│   │   ├── admin/       # Admin components (UserManagement, CategoryManagement...)
│   │   ├── layouts/     # Layout components (Header, Footer...)
│   │
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CategoryProducts.jsx
│   │   ├── UserInformation.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── ...
│   │
│   ├── store/           # Redux store & slices
│   │   ├── index.js          # Store configuration + Redux Persist
│   │   ├── userSlice.js      # User authentication & profile
│   │   └── categoriesSlice.js # Categories list
│   │
│   ├── utils/           # Utilities
│   │   ├── auth.js           # Auth helpers (getToken, isAuthenticated...)
│   │   ├── http.js           # Axios instance với interceptors
│   │   ├── DateTimeCalculation.js
│   │   └── NumberHandler.js
│   │
│   ├── hooks/           # Custom hooks
│   │   └── RouterListner.jsx
│   │
│   ├── context/         # React Context
│   │   └── ProductDetailsContext.jsx
│   │
│   ├── App.jsx          # Main app component (Routes)
│   ├── main.jsx         # Entry point (ReactDOM.render)
│   └── index.css        # Global CSS + Tailwind directives
│
├── public/              # Static assets
│   └── images/         # Product images
│       ├── default/
│       └── product_details/
│
├── .env                 # Environment variables (CẦN TẠO)
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── eslint.config.js    # ESLint configuration
├── package.json        # Dependencies
└── index.html          # HTML template

================================================================================
5. CẤU HÌNH REDUX STORE
================================================================================

Redux đã được setup với:
- Redux Toolkit: Quản lý state
- Redux Persist: Lưu state vào localStorage

Các Slices:
-----------
1. userSlice (src/store/userSlice.js)
   - State: user info, authentication status
   - Actions: loginSuccess, registerSuccess, updateUserInfo, logout
   - Persist: Có (lưu vào localStorage key: 'user')

2. categoriesSlice (src/store/categoriesSlice.js)
   - State: danh sách categories
   - Actions: setCategories
   - Persist: Có (lưu vào localStorage key: 'categories')

Cách sử dụng:
-------------
import { useSelector, useDispatch } from 'react-redux';

// Lấy state
const user = useSelector(state => state.user.user);

// Dispatch action
const dispatch = useDispatch();
dispatch(loginSuccess(userData));

Xóa Redux Persist (nếu cần reset):
-----------------------------------
// Trong browser console
localStorage.removeItem('persist:root');
window.location.reload();

================================================================================
6. CHẠY ỨNG DỤNG
================================================================================

Development Mode:
-----------------
    cd frontend
    npm run dev

Server sẽ chạy tại: http://localhost:3000

Vite sẽ tự động:
- Hot Module Replacement (HMR) - tự động reload khi code thay đổi
- Fast refresh cho React components
- Optimize imports

================================================================================
7. KIỂM TRA KẾT NỐI
================================================================================

Sau khi chạy npm run dev, thực hiện các bước sau:

BƯỚC 1: Kiểm tra Console
-------------------------
- Mở DevTools (F12) → Tab Console
- Không có lỗi màu đỏ
- Không có CORS errors
- Không có Network errors

BƯỚC 2: Test API Connection
----------------------------
Mở Console (F12) và chạy:

    fetch('http://localhost:5000/api/categories')
      .then(r => r.json())
      .then(console.log)

Nếu thấy dữ liệu categories trả về → Backend kết nối OK

BƯỚC 3: Test Login
-------------------
1. Truy cập: http://localhost:3000
2. Click "Đăng nhập"
3. Nhập thông tin test account
4. Kiểm tra Redux DevTools (nếu có extension)
5. Sau login, user data xuất hiện trong Redux state

BƯỚC 4: Test Navigation
------------------------
- Click các menu items (Trang chủ, Danh mục, Tìm kiếm)
- Kiểm tra URL thay đổi đúng
- Page load không có lỗi

================================================================================
8. CẤU HÌNH CORS (Backend)
================================================================================

Đảm bảo backend cho phép frontend truy cập:

File: backend/index.js
----------------------
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',  // Frontend URL
  credentials: true,                // Cho phép cookies/headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

Nếu deploy production:
-----------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

Test CORS:
----------
Nếu gặp lỗi:
"Access to fetch at 'http://localhost:5000' has been blocked by CORS policy"

→ Kiểm tra backend đã cấu hình CORS chưa
→ Restart backend sau khi thay đổi

================================================================================
9. ROUTING & NAVIGATION
================================================================================

Ứng dụng sử dụng React Router v7

Public Routes (không cần đăng nhập):
-------------------------------------
/                           - Trang chủ (Home)
/products/:id               - Chi tiết sản phẩm (ProductDetailPage)
/category/:categoryId       - Sản phẩm theo danh mục (CategoryProducts)
/search                     - Tìm kiếm sản phẩm (SearchPage)

Protected Routes (cần đăng nhập):
----------------------------------
/watchlist                  - Danh sách theo dõi (WatchList)
/user-info                  - Thông tin cá nhân (UserInformation)
/product-posting            - Đăng sản phẩm mới (ProductPostingPage) [Seller]
/product-updating/:id       - Chỉnh sửa sản phẩm (ProductUpdatingPage) [Seller]

Admin Routes (role = 'admin'):
-------------------------------
/admin                      - Admin Dashboard
/admin/users                - Quản lý users
/admin/products             - Quản lý products
/admin/categories           - Quản lý categories
/admin/requests             - Quản lý seller upgrade requests

Navigation Guards:
------------------
- Protected routes redirect về "/" nếu chưa login
- Admin routes redirect về "/" nếu không phải admin
- Seller routes redirect về "/" nếu không phải seller

================================================================================
10. API ENDPOINTS ĐƯỢC SỬ DỤNG
================================================================================

Base URL: http://localhost:5000/api

Authentication & User Management:
----------------------------------
POST   /users/login                 - Đăng nhập
POST   /users/register              - Đăng ký
POST   /users/verify-otp            - Xác thực OTP
GET    /users/profile               - Lấy thông tin user
PUT    /users/profile               - Cập nhật profile
POST   /users/change-password       - Đổi mật khẩu
POST   /users/forgot-password       - Quên mật khẩu
GET    /users/bidded-products       - Sản phẩm đã đấu giá

Products:
---------
GET    /products                    - Danh sách sản phẩm
GET    /products/:id                - Chi tiết sản phẩm
POST   /products                    - Tạo sản phẩm mới [Seller]
PUT    /products/:id                - Cập nhật sản phẩm [Seller]
DELETE /products/:id                - Xóa sản phẩm [Seller/Admin]
GET    /products/category/:id       - Sản phẩm theo danh mục

Categories:
-----------
GET    /categories                  - Danh sách danh mục
POST   /categories                  - Tạo danh mục [Admin]
PUT    /categories/:id              - Cập nhật danh mục [Admin]
DELETE /categories/:id              - Xóa danh mục [Admin]

Search:
-------
GET    /search/products             - Tìm kiếm sản phẩm
       Query params: ?q=keyword&category=id&minPrice=0&maxPrice=1000000&limit=8&page=1

Bidder:
-------
POST   /bidder/auto-bid             - Đặt auto bid
GET    /bidder/watchlist            - Lấy watchlist
POST   /bidder/watchlist            - Thêm vào watchlist
DELETE /bidder/watchlist/:id        - Xóa khỏi watchlist

Seller:
-------
GET    /seller/products             - Sản phẩm của seller
GET    /seller/requests             - Yêu cầu upgrade seller
POST   /seller/request              - Gửi yêu cầu upgrade

Comments:
---------
GET    /comments/product/:id        - Comments của sản phẩm
POST   /comments                    - Tạo comment
PUT    /comments/:id                - Cập nhật comment
DELETE /comments/:id                - Xóa comment

Admin:
------
GET    /admin/users                 - Danh sách users
DELETE /admin/users/:id             - Xóa user
POST   /admin/users/:id/reset-password - Reset password user
GET    /admin/requests              - Yêu cầu upgrade seller
PUT    /admin/requests/:id          - Duyệt/từ chối request

Xem chi tiết implementation: frontend/src/api/

================================================================================
11. XỬ LÝ LỖI THƯỜNG GẶP
================================================================================

Lỗi 1: CORS Error
------------------
Hiện tượng:
    Access to fetch at 'http://localhost:5000' has been blocked by CORS policy

Nguyên nhân:
    - Backend chưa cấu hình CORS
    - Backend chưa chạy
    - Sai origin trong CORS config

Fix:
    1. Kiểm tra backend có chạy không: http://localhost:5000/api/categories
    2. Kiểm tra CORS config trong backend/index.js
    3. Restart backend sau khi thay đổi

--------------------------------------------------------------------------------

Lỗi 2: Network Error / ERR_CONNECTION_REFUSED
----------------------------------------------
Hiện tượng:
    Error: Network Error
    ERR_CONNECTION_REFUSED

Nguyên nhân:
    - Backend chưa chạy
    - Sai URL trong VITE_API_BASE_URL

Fix:
    1. Chạy backend: cd backend && npm start
    2. Kiểm tra .env: VITE_API_BASE_URL=http://localhost:5000/api
    3. Restart frontend dev server

--------------------------------------------------------------------------------

Lỗi 3: 401 Unauthorized
------------------------
Hiện tượng:
    Error: Request failed with status code 401

Nguyên nhân:
    - Token hết hạn
    - Token không hợp lệ
    - Chưa đăng nhập

Fix:
    1. Logout và login lại
    2. Xóa Redux Persist: localStorage.removeItem('persist:root')
    3. Clear cookies và reload page

--------------------------------------------------------------------------------

Lỗi 4: Cannot read properties of undefined
-------------------------------------------
Hiện tượng:
    TypeError: Cannot read properties of undefined (reading 'split')
    TypeError: Cannot read properties of undefined (reading 'map')

Nguyên nhân:
    - Data từ API thiếu field
    - Component render trước khi data load xong

Fix:
    1. Thêm optional chaining: data?.field?.split()
    2. Thêm default value: data?.field || []
    3. Thêm loading state và check data trước khi render

--------------------------------------------------------------------------------

Lỗi 5: Module not found
------------------------
Hiện tượng:
    Error: Cannot find module '@/components/ui/button'

Nguyên nhân:
    - Import sai path
    - File không tồn tại
    - Chưa cài package

Fix:
    1. Kiểm tra path import đúng không
    2. Kiểm tra file tồn tại trong thư mục
    3. npm install nếu thiếu package

================================================================================
12. GHI CHÚ QUAN TRỌNG
================================================================================

1. ⚠️ Đảm bảo backend chạy TRƯỚC khi start frontend
   - Backend phải online tại http://localhost:5000
   - Test: curl http://localhost:5000/api/categories

2. 🔄 Redux Persist lưu user data vào localStorage
   - Data vẫn còn sau khi reload page
   - Logout nếu cần reset state
   - Debug: Xem trong DevTools → Application → Local Storage

3. 🚪 Port 3000 phải available
   - Nếu bị chiếm, Vite sẽ tự động chọn port khác (3001, 3002...)
   - Hoặc đổi trong vite.config.js: server: { port: 3001 }

4. 📸 Images upload lên Cloudinary
   - Không lưu local trong frontend
   - Backend xử lý upload và trả về URL
   - ProductCard nhận URL từ API

5. 🔐 JWT Token trong Redux + localStorage
   - Token tự động gửi trong mọi request (axios interceptor)
   - Token expire: 1 day (cấu hình backend)
   - Auto-logout khi token expired

6. 🎨 Tailwind CSS v4
   - Sử dụng @tailwindcss/vite plugin
   - Config trong tailwind.config.js
   - Custom colors, fonts trong config

7. 🔍 SEO & Meta Tags
    - Cập nhật trong index.html và React Helmet (nếu có)
    - Quan trọng khi deploy production


================================================================================
                            KẾT THÚC HƯỚNG DẪN
================================================================================

Nếu gặp vấn đề:
---------------
1. Kiểm tra Console (F12) xem có lỗi gì
2. Kiểm tra Network tab để xem request/response
3. Kiểm tra Redux DevTools (nếu có extension)
4. Restart cả backend và frontend
5. Xóa node_modules và npm install lại
6. Xóa localStorage
7. Check GitHub Issues của project

Contact Support:
----------------
- GitHub: [Link repository]
- Email: [Team email]
- Documentation: [Link docs]

Happy Coding! 🚀
