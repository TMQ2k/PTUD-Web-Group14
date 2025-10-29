# Pages - Hướng dẫn sử dụng

## Mục đích

Thư mục `pages` chứa tất cả các trang (page components) chính của ứng dụng portfolio. Đây là nơi định nghĩa các route/trang mà người dùng có thể truy cập trực tiếp thông qua URL.

## Chức năng chính

### 1. Trang chính của Portfolio

- **Home/Landing Page**: Trang chủ giới thiệu tổng quan
- **About**: Trang giới thiệu bản thân, kinh nghiệm
- **Portfolio/Projects**: Trang hiển thị các dự án đã thực hiện
- **Skills**: Trang thể hiện kỹ năng, công nghệ
- **Experience**: Trang kinh nghiệm làm việc, học tập
- **Contact**: Trang thông tin liên hệ

### 2. Trang phụ trợ

- **Blog**: Trang danh sách bài viết (nếu có)
- **Resume**: Trang CV online
- **404**: Trang lỗi không tìm thấy
- **Loading**: Trang loading state

## Cấu trúc thường gặp

```
pages/
├── Home/
│   ├── index.js
│   ├── Home.jsx
│   └── Home.css
├── About/
│   ├── index.js
│   ├── About.jsx
│   └── About.css
├── Portfolio/
│   ├── index.js
│   ├── Portfolio.jsx
│   └── Portfolio.css
├── Skills/
│   ├── index.js
│   ├── Skills.jsx
│   └── Skills.css
├── Experience/
│   ├── index.js
│   ├── Experience.jsx
│   └── Experience.css
├── Contact/
│   ├── index.js
│   ├── Contact.jsx
│   └── Contact.css
├── Blog/
│   ├── index.js
│   ├── Blog.jsx
│   └── Blog.css
└── NotFound/
    ├── index.js
    ├── NotFound.jsx
    └── NotFound.css
```

## Đặc điểm của Page Components

### 1. Route-based Components

- Mỗi page tương ứng với một route trong ứng dụng
- Được load thông qua React Router hoặc routing system
- Có thể nhận params từ URL

### 2. Container Components

- Thường là container components, tập hợp nhiều components nhỏ
- Quản lý state cho toàn bộ trang
- Xử lý data fetching nếu cần

### 3. SEO Friendly

- Có title, meta description riêng
- Structured data cho từng trang
- Open Graph tags cho social sharing

## Ví dụ Page Component

```jsx
// Home.jsx
import React, { useEffect } from "react";
import HeroSection from "../../components/HeroSection";
import AboutPreview from "../../components/AboutPreview";
import ProjectsPreview from "../../components/ProjectsPreview";
import ContactCTA from "../../components/ContactCTA";
import SEO from "../../components/common/SEO";
import "./Home.css";

const Home = () => {
  useEffect(() => {
    // Analytics tracking
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page">
      <SEO
        title="Trang chủ - Portfolio của [Tên]"
        description="Portfolio cá nhân showcasing các dự án và kỹ năng lập trình"
        keywords="portfolio, web developer, react, javascript"
      />

      <HeroSection />
      <AboutPreview />
      <ProjectsPreview />
      <ContactCTA />
    </div>
  );
};

export default Home;
```

## Routing Integration

```jsx
// App.jsx hoặc Router setup
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
```

## Nguyên tắc thiết kế Pages

### 1. Clear Purpose

- Mỗi trang có mục đích rõ ràng
- Nội dung tập trung vào chủ đề chính
- Tránh quá tải thông tin

### 2. User Experience

- Navigation rõ ràng giữa các trang
- Loading states khi cần thiết
- Error handling graceful

### 3. Performance

- Code splitting cho từng trang
- Lazy loading các trang không critical
- Optimize images và assets

### 4. Responsive Design

- Mobile-first approach
- Breakpoints phù hợp
- Touch-friendly trên mobile

## SEO và Metadata

```jsx
// SEO cho từng trang
const pageConfigs = {
  home: {
    title: "Portfolio - [Tên của bạn]",
    description: "Portfolio cá nhân showcasing projects và skills",
    keywords: "portfolio, developer, react, javascript",
  },
  about: {
    title: "Giới thiệu - [Tên của bạn]",
    description: "Tìm hiểu về background, kinh nghiệm và passion",
    keywords: "about, experience, skills, background",
  },
  portfolio: {
    title: "Dự án - Portfolio",
    description: "Khám phá các dự án đã thực hiện và công nghệ sử dụng",
    keywords: "projects, portfolio, web development, apps",
  },
};
```

## Data Management

### 1. Static Data

- Thông tin cá nhân, skills, experience
- Lưu trong JSON files hoặc constants
- Easy to update và maintain

### 2. Dynamic Data

- Blog posts, comments
- Project details từ API
- Contact form submissions

### 3. State Management

- Local state cho UI interactions
- Global state cho shared data
- Context API hoặc Redux

## Performance Best Practices

### 1. Code Splitting

```jsx
// Lazy loading pages
const About = lazy(() => import("./pages/About"));
const Portfolio = lazy(() => import("./pages/Portfolio"));

// Wrap với Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/about" element={<About />} />
    <Route path="/portfolio" element={<Portfolio />} />
  </Routes>
</Suspense>;
```

### 2. Preloading

- Preload critical pages
- Prefetch khi hover navigation
- Service worker cho offline support

## Analytics và Tracking

```jsx
// Track page views
useEffect(() => {
  // Google Analytics
  gtag("config", "GA_TRACKING_ID", {
    page_title: document.title,
    page_location: window.location.href,
  });
}, []);
```

## Lưu ý quan trọng

1. **URL Structure**: Thiết kế URL clean và SEO friendly
2. **Back Button**: Đảm bảo browser back button hoạt động đúng
3. **Deep Linking**: Support direct access via URL
4. **Loading States**: Hiển thị loading khi navigate
5. **Error Boundaries**: Catch và handle errors gracefully
6. **Accessibility**: Semantic HTML và ARIA labels
7. **Social Sharing**: Open Graph và Twitter Cards
8. **Mobile Navigation**: Hamburger menu, touch gestures

## Testing Pages

```jsx
// Example test cho page component
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "./Home";

test("renders hero section", () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

  expect(screen.getByRole("banner")).toBeInTheDocument();
});
```
