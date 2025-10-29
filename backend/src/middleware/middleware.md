# 📁 Middleware Folder

## Mục đích

Thư mục `middleware/` chứa các middleware functions xử lý requests trước khi đến controllers. Middlewares thực hiện các tác vụ như authentication, validation, logging, error handling, etc.

## Vai trò trong Request Flow

```
Client Request
    → Middleware 1 (logger)
    → Middleware 2 (auth)
    → Middleware 3 (validation)
    → Controller
    → Response
```

## Cấu trúc

```
middleware/
├── auth.middleware.js         # Authentication & Authorization
├── validation.middleware.js   # Request validation
├── error.middleware.js        # Error handling
├── upload.middleware.js       # File upload
├── rate-limit.middleware.js   # Rate limiting
├── logger.middleware.js       # Request logging
└── index.js                   # Export tất cả
```

## Các loại Middleware phổ biến

### 1. Authentication Middleware (`auth.middleware.js`)

```javascript
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";
import userRepository from "../repo/user.repo.js";

class AuthMiddleware {
  // Verify JWT token
  async authenticate(req, res, next) {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Bearer token

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No token provided",
        });
      }

      const decoded = jwt.verify(token, jwtConfig.secret);

      const user = await userRepository.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      req.user = user; // Attach user to request
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  }

  // Check user roles
  authorize(...roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions",
        });
      }

      next();
    };
  }

  // Optional authentication (không bắt buộc)
  async optionalAuth(req, res, next) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const decoded = jwt.verify(token, jwtConfig.secret);
        const user = await userRepository.findById(decoded.userId);
        if (user) {
          req.user = user;
        }
      }
    } catch (error) {
      // Ignore errors, continue without user
    }

    next();
  }
}

export default new AuthMiddleware();
```

### 2. Validation Middleware (`validation.middleware.js`)

```javascript
class ValidationMiddleware {
  // Validate request body
  validate(schema) {
    return async (req, res, next) => {
      try {
        await schema.validate(req.body, { abortEarly: false });
        next();
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      }
    };
  }

  // Validate params
  validateParams(schema) {
    return async (req, res, next) => {
      try {
        await schema.validate(req.params, { abortEarly: false });
        next();
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid parameters",
          errors: error.errors,
        });
      }
    };
  }

  // Validate query
  validateQuery(schema) {
    return async (req, res, next) => {
      try {
        await schema.validate(req.query, { abortEarly: false });
        next();
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          errors: error.errors,
        });
      }
    };
  }
}

export default new ValidationMiddleware();
```

### 3. Error Handling Middleware (`error.middleware.js`)

```javascript
class ErrorMiddleware {
  // Global error handler
  handler(err, req, res, next) {
    console.error("Error:", err);

    // Mongoose validation error
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    // Custom application errors
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }

    // Default server error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
  }

  // 404 handler
  notFound(req, res, next) {
    res.status(404).json({
      success: false,
      message: "Route not found",
      path: req.originalUrl,
    });
  }
}

export default new ErrorMiddleware();
```

### 4. File Upload Middleware (`upload.middleware.js`)

```javascript
import multer from "multer";
import path from "path";

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG and GIF are allowed."),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadSingle = upload.single("image");
export const uploadMultiple = upload.array("images", 10);
export const uploadFields = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "gallery", maxCount: 5 },
]);
```

### 5. Rate Limiting Middleware (`rate-limit.middleware.js`)

```javascript
import rateLimit from "express-rate-limit";

// General rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limiter (stricter)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true,
});

// API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: "Too many API requests",
});
```

### 6. Logger Middleware (`logger.middleware.js`)

```javascript
class LoggerMiddleware {
  request(req, res, next) {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${
          res.statusCode
        } (${duration}ms)`
      );
    });

    next();
  }

  error(err, req, res, next) {
    console.error(`[ERROR] ${new Date().toISOString()}`);
    console.error(`Route: ${req.method} ${req.originalUrl}`);
    console.error(`Message: ${err.message}`);
    console.error(`Stack: ${err.stack}`);
    next(err);
  }
}

export default new LoggerMiddleware();
```

## Best Practices

### 1. Middleware Order

```javascript
// app.js
import express from "express";
import logger from "./middleware/logger.middleware.js";
import { generalLimiter } from "./middleware/rate-limit.middleware.js";
import authMiddleware from "./middleware/auth.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

// 1. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Logger
app.use(logger.request);

// 3. Rate limiting
app.use(generalLimiter);

// 4. CORS
app.use(cors());

// 5. Routes
app.use("/api/public", publicRoutes);
app.use("/api/protected", authMiddleware.authenticate, protectedRoutes);

// 6. 404 handler
app.use(errorMiddleware.notFound);

// 7. Error handler (cuối cùng)
app.use(errorMiddleware.handler);
```

### 2. Async Middleware Wrapper

```javascript
// Wrap async middleware để catch errors
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Sử dụng
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await User.find();
    res.json(users);
  })
);
```

### 3. Chainable Middlewares

```javascript
router.post(
  "/admin/users",
  authMiddleware.authenticate,
  authMiddleware.authorize("admin"),
  validationMiddleware.validate(createUserSchema),
  userController.create
);
```

## Sử dụng trong Routes

```javascript
import authMiddleware from "../middleware/auth.middleware.js";
import validationMiddleware from "../middleware/validation.middleware.js";
import { uploadSingle } from "../middleware/upload.middleware.js";

// Public routes
router.post(
  "/register",
  validationMiddleware.validate(registerSchema),
  authController.register
);
router.post("/login", authLimiter, authController.login);

// Protected routes
router.get("/profile", authMiddleware.authenticate, userController.getProfile);
router.put(
  "/profile",
  authMiddleware.authenticate,
  uploadSingle,
  userController.updateProfile
);

// Admin only routes
router.delete(
  "/users/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize("admin"),
  userController.deleteUser
);
```

## Export Pattern

```javascript
// index.js
export { default as authMiddleware } from "./auth.middleware.js";
export { default as validationMiddleware } from "./validation.middleware.js";
export { default as errorMiddleware } from "./error.middleware.js";
export { default as loggerMiddleware } from "./logger.middleware.js";
export * from "./upload.middleware.js";
export * from "./rate-limit.middleware.js";
```
