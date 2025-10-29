# Bố Cục Dự Án - PTUD_Web_Group14

## 📋 Tổng Quan

Dự án này là một ứng dụng web full-stack được xây dựng với kiến trúc monorepo, bao gồm frontend React và backend (đang được phát triển).

## 🗂️ Cấu Trúc Thư Mục

```
PTUD_Web_Group14/
├── backend/                    # Backend API (đang phát triển)
│   └── (chưa có file)
│
└── frontend/                   # Frontend React Application
    ├── public/                 # Static assets công khai
    ├── src/                    # Source code chính
    │   ├── api/               # API service layer (gọi backend)
    │   ├── assets/            # Assets (images, icons, etc.)
    │   │   └── react.svg      # React logo
    │   ├── components/        # React components tái sử dụng
    │   ├── pages/             # Page components (routing)
    │   ├── App.jsx            # Root component
    │   ├── main.jsx           # Entry point
    │   └── index.css          # Global styles
    │
    ├── eslint.config.js       # ESLint configuration
    ├── index.html             # HTML template
    ├── package.json           # Dependencies và scripts
    ├── vite.config.js         # Vite configuration
    └── README.md              # Frontend documentation
```

## 🎯 Chi Tiết Các Thư Mục

### 📁 Backend

- **Mục đích**: Xử lý API, business logic, database operations
- **Dự kiến**: PostgreSQL/MongoDB

### 📁 Frontend

#### **src/api/**

- Chứa các service functions để gọi API backend
- Quản lý HTTP requests (sử dụng Axios)
- Centralized API endpoint configuration

#### **src/assets/**

- Lưu trữ static files: images, icons, fonts
- Files media được import trong components
- Hiện tại: `react.svg`

#### **src/components/**

- React components tái sử dụng
- UI components được chia nhỏ và modular
- Có thể bao gồm: buttons, forms, modals, cards, etc.

#### **src/pages/**

- Page-level components tương ứng với routes
- Mỗi page tương ứng với một URL trong ứng dụng
- Kết hợp nhiều components nhỏ hơn

#### **src/App.jsx**

- Root component của ứng dụng
- Quản lý routing (với React Router)
- Layout chính và navigation

#### **src/main.jsx**

- Entry point của React application
- Mount React app vào DOM
- Setup providers (Redux, React Query, etc.)

#### **src/index.css**

- Global CSS styles
- Tailwind CSS directives
- Base styles và reset CSS

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Styling**:
  - Tailwind CSS 4.1.16
  - Material-UI (MUI) 7.1.2
  - Ant Design 5.26.6
  - Emotion (CSS-in-JS)
- **State Management**:
  - Redux Toolkit 2.8.2
  - React Redux 9.2.0
- **Data Fetching**:
  - TanStack React Query 5.83.0
  - Axios 1.10.0
- **Routing**: React Router DOM 7.6.2
- **Form Management**:
  - React Hook Form 7.60.0
  - Yup 1.6.1 (validation)
- **UI Components**:
  - Radix UI (headless components)
  - Lucide React (icons)
  - Tabler Icons
  - Ant Design Icons
- **Data Visualization**: Recharts 3.1.0
- **Real-time**: Socket.io Client 4.8.1
- **Table**: TanStack React Table 8.21.3
- **Notifications**: React Toastify 11.0.5
- **Date Handling**:
  - date-fns 4.1.0
  - React Day Picker 9.8.0

### Development Tools

- **Linting**: ESLint 9.25.0
- **Hot Module Replacement**: Vite HMR

## 🚀 Scripts

```bash
# Development server (port 3000)
npm run dev

# Production build
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## 📝 Quy Ước Đặt Tên

### Files

- **Components**: PascalCase (VD: `UserProfile.jsx`, `NavBar.jsx`)
- **Utilities**: camelCase (VD: `apiHelper.js`, `formatDate.js`)
- **Styles**: kebab-case hoặc camelCase (VD: `button-styles.css`)

### Folders

- **lowercase**: Tất cả folders sử dụng lowercase
- **Descriptive**: Tên mô tả rõ ràng mục đích

## 🔧 Configuration Files

### vite.config.js

- Cấu hình Vite build tool
- React plugin setup
- Tailwind CSS plugin
- Server port: 3000

### eslint.config.js

- ESLint rules cho code quality
- React-specific linting rules
- Code style enforcement

### package.json

- Dependencies management
- NPM scripts
- Project metadata

## 📦 Mô Hình Kiến Trúc

```
User Request
    ↓
[Pages] - Page components với routing
    ↓
[Components] - Reusable UI components
    ↓
[API Services] - HTTP requests layer
    ↓
[Backend API] - (Đang phát triển)
    ↓
[Database]
```

## 🎨 Design System

Dự án sử dụng nhiều UI libraries để tạo design system linh hoạt:

- **Radix UI**: Unstyled, accessible components
- **Tailwind CSS**: Utility-first CSS framework
- **Material-UI**: Complete component library
- **Ant Design**: Enterprise-level UI components

## 📚 Tài Liệu Tham Khảo

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com)

## 👥 Nhóm Phát Triển

**Group 14** - Phát Triển Ứng Dụng Web
