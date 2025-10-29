# Components - Hướng dẫn sử dụng

## Mục đích

Thư mục `components` là nơi chứa tất cả các component tái sử dụng (reusable components) trong ứng dụng portfolio. Đây là thành phần cốt lõi của kiến trúc React, giúp tổ chức code một cách có hệ thống và dễ bảo trì.

## Chức năng chính

### 1. Component UI cơ bản

- Button, Input, Card, Modal
- Typography (Heading, Text, Link)
- Icon components
- Loading spinners, Progress bars

### 2. Component nghiệp vụ

- ProjectCard - Hiển thị thông tin dự án
- SkillBadge - Hiển thị kỹ năng
- ContactForm - Form liên hệ
- Timeline - Hiển thị kinh nghiệm làm việc

### 3. Component bố cục

- Header/Navigation
- Footer
- Sidebar
- Container/Grid system

### 4. Component tương tác

- Image Gallery/Carousel
- Accordion/Tabs
- Dropdown/Select
- Search components

## Cấu trúc thường gặp

```
components/
├── ui/                 # Component UI cơ bản
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   └── Modal/
├── layout/            # Component bố cục
│   ├── Header/
│   ├── Footer/
│   └── Navigation/
├── common/            # Component dùng chung
│   ├── Loading/
│   ├── ErrorBoundary/
│   └── SEO/
└── forms/             # Component form
    ├── ContactForm/
    └── NewsletterForm/
```

## Nguyên tắc thiết kế Component

### 1. Single Responsibility

- Mỗi component chỉ làm một việc duy nhất
- Component nhỏ, dễ hiểu và dễ test

### 2. Reusability (Tái sử dụng)

- Thiết kế component có thể sử dụng ở nhiều nơi
- Sử dụng props để tùy chỉnh hành vi

### 3. Composition over Inheritance

- Kết hợp các component nhỏ để tạo component lớn
- Tránh inheritance phức tạp

### 4. Props Interface

- Định nghĩa rõ ràng interface cho props
- Sử dụng PropTypes hoặc TypeScript

## Quy tắc đặt tên

- **PascalCase**: `ProjectCard`, `SkillBadge`
- **Mô tả chức năng**: Tên component phải mô tả chức năng
- **Consistent**: Nhất quán trong cách đặt tên

## Cấu trúc file Component

```
ComponentName/
├── index.js           # Export component
├── ComponentName.jsx  # Logic component chính
├── ComponentName.css  # Styles riêng biệt
└── ComponentName.test.js # Unit tests
```

## Ví dụ Component

```jsx
// ProjectCard.jsx
import React from "react";
import "./ProjectCard.css";

const ProjectCard = ({
  title,
  description,
  image,
  technologies,
  liveUrl,
  githubUrl,
}) => {
  return (
    <div className="project-card">
      <img src={image} alt={title} className="project-image" />
      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
        <div className="project-tech">
          {technologies.map((tech) => (
            <span key={tech} className="tech-badge">
              {tech}
            </span>
          ))}
        </div>
        <div className="project-links">
          <a href={liveUrl} target="_blank" rel="noopener noreferrer">
            Live Demo
          </a>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
```

## Best Practices

### 1. Performance

- Sử dụng `React.memo()` cho component không thay đổi thường xuyên
- Lazy loading cho component lớn
- Tối ưu re-rendering

### 2. Accessibility

- Sử dụng semantic HTML
- Thêm ARIA attributes khi cần
- Đảm bảo keyboard navigation

### 3. Testing

- Viết unit test cho mỗi component
- Test các props và state
- Test user interactions

### 4. Documentation

- Comment code rõ ràng
- Tạo Storybook cho component library
- Ghi chú các props và usage

## Lưu ý quan trọng

1. **Không duplicate code**: Tạo component chung thay vì copy code
2. **Props validation**: Luôn validate props để tránh lỗi
3. **Error handling**: Xử lý lỗi gracefully trong component
4. **Responsive**: Đảm bảo component hoạt động tốt trên mọi thiết bị
5. **Bundle size**: Tránh import toàn bộ library, chỉ import những gì cần thiết
