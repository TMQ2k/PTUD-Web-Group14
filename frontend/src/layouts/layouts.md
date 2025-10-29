# Layouts - Hướng dẫn sử dụng

## Mục đích

Thư mục `layouts` được sử dụng để chứa các component layout chính của ứng dụng portfolio. Đây là nơi định nghĩa cấu trúc bố cục tổng thể cho các trang web.

## Chức năng chính

### 1. Layout tổng thể

- Định nghĩa cấu trúc chung cho toàn bộ trang web
- Bao gồm header, navigation, main content area và footer
- Đảm bảo tính nhất quán trong thiết kế

### 2. Layout responsive

- Tạo bố cục linh hoạt cho các thiết bị khác nhau
- Điều chỉnh layout phù hợp với desktop, tablet và mobile
- Tối ưu trải nghiệm người dùng trên mọi màn hình

### 3. Layout chuyên biệt

- Layout cho trang chủ với hero section
- Layout cho trang portfolio với grid system
- Layout cho trang blog/articles
- Layout cho trang contact

## Cấu trúc thường gặp

```
layouts/
├── MainLayout.jsx      # Layout chính cho toàn bộ app
├── HomeLayout.jsx      # Layout dành riêng cho trang chủ
├── PortfolioLayout.jsx # Layout cho trang portfolio
├── BlogLayout.jsx      # Layout cho trang blog
└── guide.md           # File hướng dẫn này
```

## Nguyên tắc sử dụng

1. **Tái sử dụng**: Tạo layout có thể tái sử dụng cho nhiều trang
2. **Linh hoạt**: Cho phép tùy chỉnh layout theo nhu cầu cụ thể
3. **Nhất quán**: Đảm bảo tính nhất quán trong thiết kế UI/UX
4. **Hiệu suất**: Tối ưu hiệu suất render và loading

## Ví dụ sử dụng

```jsx
// MainLayout.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
```

## Lưu ý

- Layout components nên được thiết kế đơn giản và linh hoạt
- Sử dụng props để truyền dữ liệu và tùy chỉnh layout
- Đảm bảo responsive design cho mọi layout
- Tránh logic phức tạp trong layout components
