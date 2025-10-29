# 📁 Config Folder

## Mục đích

Thư mục `config/` chứa tất cả các file cấu hình của ứng dụng backend, bao gồm kết nối database, biến môi trường, và các thiết lập hệ thống.

## Cấu trúc

```
config/
├── database.js         # Cấu hình kết nối database
├── redis.js           # Cấu hình Redis cache (nếu có)
├── cloudinary.js      # Cấu hình cloud storage
├── jwt.js             # Cấu hình JSON Web Token
├── mail.js            # Cấu hình email service
├── socket.js          # Cấu hình Socket.io
└── constants.js       # Các hằng số của ứng dụng
```

## Cách sử dụng

### 1. Database Configuration (`database.js`)

```javascript
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
```

### 2. JWT Configuration (`jwt.js`)

```javascript
export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: "7d",
  refreshExpiresIn: "30d",
};
```

### 3. Constants (`constants.js`)

```javascript
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
```

## Best Practices

1. **Environment Variables**: Không hardcode sensitive data, sử dụng `.env`
2. **Separation**: Tách biệt cấu hình cho từng service
3. **Validation**: Validate các biến môi trường khi app khởi động
4. **Export Clean**: Export các config dưới dạng object hoặc function
5. **Documentation**: Comment rõ ràng cho các config phức tạp

## Ví dụ file .env

```env
# Database
MONGODB_URI=mongodb://localhost:27017/myapp

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Import trong application

```javascript
import connectDB from "./config/database.js";
import { jwtConfig } from "./config/jwt.js";
import { USER_ROLES } from "./config/constants.js";

// Sử dụng
await connectDB();
const token = jwt.sign(payload, jwtConfig.secret, {
  expiresIn: jwtConfig.expiresIn,
});
```
