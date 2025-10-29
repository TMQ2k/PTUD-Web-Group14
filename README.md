# Bố Cục Dự Án - PTUD_Web_Group14

## 📋 Tổng Quan

Dự án này là một ứng dụng web full-stack được xây dựng với kiến trúc monorepo, bao gồm frontend React và backend (đang được phát triển).

## 🗂️ Cấu Trúc Thư Mục

```
PTUD_Web_Group14/
├── backend/                    # Backend API (Node.js + Express + PostgreSQL)
│   ├── src/                   # Source code chính
│   │   ├── config/           # Cấu hình (database, JWT, constants)
│   │   │   └── config.md     # Hướng dẫn sử dụng config
│   │   ├── controller/       # HTTP request handlers
│   │   │   └── controller.md # Hướng dẫn tạo controllers
│   │   ├── middleware/       # Express middlewares
│   │   │   └── middleware.md # Hướng dẫn authentication, validation
│   │   ├── model/            # Database models (Mongoose/Sequelize)
│   │   │   └── model.md      # Hướng dẫn định nghĩa schemas
│   │   ├── repo/             # Repository layer (data access)
│   │   │   └── repo.md       # Hướng dẫn CRUD operations
│   │   └── service/          # Business logic layer
│   │       └── service.md    # Hướng dẫn xử lý business rules
│   ├── public/               # Static files
│   ├── .gitignore            # Git ignore rules
│   ├── package.json          # Backend dependencies
│   └── .env                  # Environment variables (not in git)
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

- **Trạng thái**: Đang phát triển
- **Mục đích**: RESTful API server, xử lý business logic, database operations
- **Database**: PostgreSQL
- **Kiến trúc**: Layered Architecture (Controller → Service → Repository → Model)

#### **Backend Architecture Layers**

```
┌─────────────────────────────────────────┐
│         Client Request (HTTP)           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│    Middleware Layer                     │
│  • Authentication (JWT)                 │
│  • Validation (Request data)            │
│  • Error Handling                       │
│  • Rate Limiting                        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│    Controller Layer                     │
│  • Handle HTTP requests/responses       │
│  • Input validation                     │
│  • Call services                        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│    Service Layer                        │
│  • Business Logic                       │
│  • Transaction Management               │
│  • Data Processing                      │
│  • Call repositories                    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│    Repository Layer                     │
│  • Database Queries                     │
│  • CRUD Operations                      │
│  • Data Access Logic                    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│    Model Layer                          │
│  • Data Structure Definitions           │
│  • Schema Validation                    │
│  • Relationships                        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         PostgreSQL Database             │
└─────────────────────────────────────────┘
```

#### **src/config/**

- Chứa các file cấu hình hệ thống
- Database connection settings
- JWT configuration
- Environment variables management
- Application constants
- [📖 Chi tiết tại config.md](backend/src/config/config.md)

#### **src/controller/**

- HTTP request/response handlers
- Route handlers cho RESTful API
- Nhận input từ client, gọi services
- Format và trả về responses
- Thin controllers - không chứa business logic
- [📖 Chi tiết tại controller.md](backend/src/controller/controller.md)

#### **src/middleware/**

- Express middleware functions
- Authentication & Authorization (JWT)
- Request validation (input sanitization)
- Error handling middleware
- File upload handling
- Rate limiting & security
- [📖 Chi tiết tại middleware.md](backend/src/middleware/middleware.md)

#### **src/model/**

- Database models và schemas
- Data structure definitions
- Validation rules
- Relationships between entities
- Database indexes
- [📖 Chi tiết tại model.md](backend/src/model/model.md)

#### **src/repo/**

- Repository pattern implementation
- Direct database operations (CRUD)
- Query optimization
- Pagination & filtering
- Aggregate queries
- Data access abstraction layer
- [📖 Chi tiết tại repo.md](backend/src/repo/repo.md)

#### **src/service/**

- Business logic layer
- Complex operations & workflows
- Transaction management
- Data validation & processing
- Integration với external services
- [📖 Chi tiết tại service.md](backend/src/service/service.md)

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

### Backend

- **Runtime**: Node.js
- **Framework**: Express 5.1.0
- **Database**: PostgreSQL 8.16.3
- **Security**:
  - CORS 2.8.5 (Cross-Origin Resource Sharing)
  - JWT (JSON Web Tokens) for authentication
- **Environment**: dotenv 17.2.3
- **Architecture Pattern**: Layered Architecture
  - Controller Layer
  - Service Layer
  - Repository Layer
  - Model Layer

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

### Frontend Scripts

```bash
# Navigate to frontend
cd frontend

# Development server (port 3000)
npm run dev

# Production build
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Backend Scripts

```bash
# Navigate to backend
cd backend

# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test
```

### Monorepo Scripts (Root)

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Start both frontend and backend
npm run dev:all
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

### Full-Stack Architecture Flow

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  User Interface (Browser)                         │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       │                                  │
│  ┌────────────────────▼─────────────────────────────┐  │
│  │  Pages (React Router)                             │  │
│  │  - Home, Product, Cart, Profile, Admin...        │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       │                                  │
│  ┌────────────────────▼─────────────────────────────┐  │
│  │  Components (Reusable UI)                         │  │
│  │  - Buttons, Forms, Cards, Modals...              │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       │                                  │
│  ┌────────────────────▼─────────────────────────────┐  │
│  │  State Management                                 │  │
│  │  - Redux (Global State)                          │  │
│  │  - React Query (Server State)                    │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       │                                  │
│  ┌────────────────────▼─────────────────────────────┐  │
│  │  API Service Layer (Axios)                        │  │
│  │  - HTTP requests to backend                      │  │
│  │  - Request/Response interceptors                 │  │
│  └────────────────────┬─────────────────────────────┘  │
└───────────────────────┼─────────────────────────────────┘
                        │
                        │ HTTP/HTTPS (REST API)
                        │ Socket.io (WebSocket)
                        │
┌───────────────────────▼─────────────────────────────────┐
│                  BACKEND (Node.js + Express)            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                 │  │
│  │  - CORS, Auth (JWT), Validation, Error Handler   │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       │                                  │
│  ┌────────────────────▼─────────────────────────────┐  │
│  │  Controller Layer                                 │  │
│  │  - userController, productController...          │  │
│  │  - Handle HTTP requests/responses                │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       │                                  │
│  ┌────────────────────▼─────────────────────────────┐  │
│  │  Service Layer (Business Logic)                   │  │
│  │  - userService, authService, orderService...     │  │
│  │  - Complex operations, validations               │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       │                                  │
│  ┌────────────────────▼─────────────────────────────┐  │
│  │  Repository Layer (Data Access)                   │  │
│  │  - userRepo, productRepo, orderRepo...           │  │
│  │  - CRUD operations, queries                      │  │
│  └────────────────────┬─────────────────────────────┘  │
│                       │                                  │
│  ┌────────────────────▼─────────────────────────────┐  │
│  │  Model Layer (Data Structure)                     │  │
│  │  - User, Product, Order models                   │  │
│  │  - Schema definitions, validations               │  │
│  └────────────────────┬─────────────────────────────┘  │
└───────────────────────┼─────────────────────────────────┘
                        │
                        │ SQL Queries
                        │
┌───────────────────────▼─────────────────────────────────┐
│                PostgreSQL Database                       │
│  - Users, Products, Orders, Categories...               │
│  - Relationships, Indexes, Constraints                  │
└─────────────────────────────────────────────────────────┘
```

### API Communication Pattern

```
Frontend (React)  ←──HTTP REST API──→  Backend (Express)
     │                                       │
     │ GET /api/users                       │
     │─────────────────────────────────────▶│
     │                                       │ Controller
     │                                       │ Service
     │                                       │ Repository
     │                                       │ Database Query
     │                                       │
     │ { users: [...], pagination: {...} }  │
     │◀─────────────────────────────────────│
     │                                       │
     │ POST /api/auth/login                 │
     │ { email, password }                  │
     │─────────────────────────────────────▶│
     │                                       │ Validate
     │                                       │ Check credentials
     │                                       │ Generate JWT
     │                                       │
     │ { user: {...}, token: "..." }        │
     │◀─────────────────────────────────────│
```

## 🎨 Design System

Dự án sử dụng nhiều UI libraries để tạo design system linh hoạt:

- **Radix UI**: Unstyled, accessible components
- **Tailwind CSS**: Utility-first CSS framework
- **Material-UI**: Complete component library
- **Ant Design**: Enterprise-level UI components

## 📚 Tài Liệu Tham Khảo

### Backend Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/) - JSON Web Tokens
- [REST API Best Practices](https://restfulapi.net/)

### Frontend Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Query](https://tanstack.com/query/latest)
- [React Router](https://reactrouter.com)

### Design & UI

- [Radix UI](https://www.radix-ui.com/)
- [Material-UI](https://mui.com/)
- [Ant Design](https://ant.design/)
- [Lucide Icons](https://lucide.dev/)

## � Getting Started

### Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm hoặc yarn

### Installation

1. **Clone repository**

```bash
git clone https://github.com/TMQ2k/PTUD-Web-Group14.git
cd PTUD-Web-Group14
```

2. **Setup Backend**

```bash
cd backend
npm install

# Tạo file .env
cp .env.example .env
# Cấu hình database và các biến môi trường

# Chạy migrations (nếu có)
npm run migrate

# Start backend server
npm run dev
```

3. **Setup Frontend**

```bash
cd ../frontend
npm install

# Start frontend development server
npm run dev
```

4. **Truy cập ứng dụng**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000 (hoặc port đã cấu hình)

## 📁 Hướng Dẫn Chi Tiết

Để hiểu rõ hơn về cách sử dụng từng layer trong backend:

1. **[Config Layer](backend/src/config/config.md)** - Cấu hình hệ thống
2. **[Controller Layer](backend/src/controller/controller.md)** - HTTP handlers
3. **[Middleware Layer](backend/src/middleware/middleware.md)** - Auth, validation, errors
4. **[Model Layer](backend/src/model/model.md)** - Database schemas
5. **[Repository Layer](backend/src/repo/repo.md)** - Data access operations
6. **[Service Layer](backend/src/service/service.md)** - Business logic

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 Git Workflow

```bash
# Cập nhật code mới nhất
git pull origin dev

# Tạo branch mới cho feature
git checkout -b feature/ten-feature

# Làm việc và commit
git add .
git commit -m "feat: mô tả feature"

# Push và tạo PR
git push origin feature/ten-feature
```

### Commit Message Convention

- `feat:` - Thêm feature mới
- `fix:` - Sửa bug
- `docs:` - Cập nhật documentation
- `style:` - Format code, không ảnh hưởng logic
- `refactor:` - Refactor code
- `test:` - Thêm hoặc sửa tests
- `chore:` - Cập nhật dependencies, config

## �👥 Nhóm Phát Triển

**Group 14** - Phát Triển Ứng Dụng Web
