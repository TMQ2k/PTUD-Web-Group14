# 📁 Service Folder

## Mục đích

Thư mục `service/` chứa **business logic** của ứng dụng. Services là layer trung gian giữa Controllers và Repositories, xử lý các quy tắc nghiệp vụ, validation phức tạp, và orchestrate nhiều repository calls.

## Vai trò trong kiến trúc

```
Controller (HTTP Layer)
    ↓
Service (Business Logic Layer) ← BẠN Ở ĐÂY
    ↓
Repository (Data Access Layer)
    ↓
Model/Database
```

## Tại sao cần Service Layer?

### Lợi ích

1. **Business Logic Centralization**: Tập trung logic nghiệp vụ
2. **Reusability**: Tái sử dụng logic giữa nhiều controllers/routes
3. **Testability**: Dễ test business logic độc lập
4. **Transaction Management**: Xử lý multi-step operations
5. **Clean Controllers**: Controllers chỉ lo HTTP, không có business logic

## Cấu trúc

```
service/
├── user.service.js
├── auth.service.js
├── product.service.js
├── order.service.js
├── email.service.js
├── upload.service.js
└── index.js              # Export tất cả services
```

## Cách sử dụng

### 1. User Service (`user.service.js`)

```javascript
import userRepository from "../repo/user.repo.js";
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
} from "../utils/errors.js";

class UserService {
  // Get user by ID với error handling
  async getUserById(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  // Get all users với pagination và search
  async getAllUsers({ page = 1, limit = 10, search, role }) {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    };

    let conditions = {};

    // Search by name or email
    if (search) {
      conditions.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by role
    if (role) {
      conditions.role = role;
    }

    const result = await userRepository.findWithPagination(conditions, options);

    return {
      users: result.data,
      pagination: result.pagination,
    };
  }

  // Create new user với validation
  async createUser(userData) {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new ConflictError("Email already in use");
    }

    // Validate age if provided
    if (userData.dateOfBirth) {
      const age = this.calculateAge(userData.dateOfBirth);
      if (age < 18) {
        throw new BadRequestError("User must be at least 18 years old");
      }
    }

    // Create user
    const newUser = await userRepository.create(userData);

    // Remove sensitive data
    const userObject = newUser.toObject();
    delete userObject.password;

    return userObject;
  }

  // Update user profile
  async updateUser(userId, updateData) {
    const user = await this.getUserById(userId);

    // Prevent email change to existing email
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await userRepository.findByEmail(updateData.email);
      if (existingUser) {
        throw new ConflictError("Email already in use");
      }
    }

    // Prevent role change by regular users
    if (updateData.role && updateData.role !== user.role) {
      throw new BadRequestError("Cannot change user role");
    }

    const updatedUser = await userRepository.updateById(userId, updateData);

    return updatedUser;
  }

  // Delete user (soft delete)
  async deleteUser(userId) {
    const user = await this.getUserById(userId);

    // Prevent deleting admin
    if (user.role === "admin") {
      throw new BadRequestError("Cannot delete admin user");
    }

    await userRepository.updateById(userId, {
      isActive: false,
      deletedAt: new Date(),
    });

    return { message: "User deleted successfully" };
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findById(userId).select("+password");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new BadRequestError("Current password is incorrect");
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new BadRequestError("Password must be at least 6 characters");
    }

    // Update password
    await userRepository.changePassword(userId, newPassword);

    return { message: "Password changed successfully" };
  }

  // Get user statistics
  async getUserStats() {
    const stats = await userRepository.getUserStats();

    return {
      totalUsers: stats.reduce((sum, item) => sum + item.count, 0),
      byRole: stats,
    };
  }

  // Helper methods
  calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
}

export default new UserService();
```

### 2. Auth Service (`auth.service.js`)

```javascript
import jwt from "jsonwebtoken";
import userRepository from "../repo/user.repo.js";
import { jwtConfig } from "../config/jwt.js";
import {
  UnauthorizedError,
  BadRequestError,
  ConflictError,
} from "../utils/errors.js";

class AuthService {
  // User registration
  async register({ email, password, name }) {
    // Check if user exists
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    // Validate password strength
    if (password.length < 6) {
      throw new BadRequestError("Password must be at least 6 characters");
    }

    // Create user
    const user = await userRepository.create({
      email,
      password,
      name,
      role: "user",
    });

    // Generate token
    const token = this.generateToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;

    return {
      user: userObject,
      token,
      refreshToken,
    };
  }

  // User login
  async login({ email, password }) {
    // Find user with password field
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedError("Account is deactivated");
    }

    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Update last login
    await userRepository.updateLastLogin(user._id);

    // Generate tokens
    const token = this.generateToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    // Remove password
    const userObject = user.toObject();
    delete userObject.password;

    return {
      user: userObject,
      token,
      refreshToken,
    };
  }

  // Logout
  async logout(userId) {
    // Có thể implement blacklist token hoặc invalidate refresh token
    // For now, client-side will remove token

    return { message: "Logged out successfully" };
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, jwtConfig.secret);

      // Get user
      const user = await userRepository.findById(decoded.userId);

      if (!user || !user.isActive) {
        throw new UnauthorizedError("Invalid refresh token");
      }

      // Generate new access token
      const newAccessToken = this.generateToken(user._id);

      return {
        token: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedError("Invalid refresh token");
    }
  }

  // Verify email (if implementing email verification)
  async verifyEmail(token) {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret);

      const user = await userRepository.updateById(decoded.userId, {
        isEmailVerified: true,
      });

      return { message: "Email verified successfully", user };
    } catch (error) {
      throw new BadRequestError("Invalid or expired verification token");
    }
  }

  // Forgot password
  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      // Don't reveal if email exists
      return { message: "If email exists, reset link will be sent" };
    }

    // Generate reset token
    const resetToken = this.generateResetToken(user._id);

    // TODO: Send email with reset link
    // await emailService.sendPasswordResetEmail(user.email, resetToken);

    return {
      message: "Password reset link sent to email",
      resetToken, // Remove this in production, only send via email
    };
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret);

      if (newPassword.length < 6) {
        throw new BadRequestError("Password must be at least 6 characters");
      }

      await userRepository.changePassword(decoded.userId, newPassword);

      return { message: "Password reset successfully" };
    } catch (error) {
      throw new BadRequestError("Invalid or expired reset token");
    }
  }

  // Token generation helpers
  generateToken(userId) {
    return jwt.sign({ userId }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
  }

  generateRefreshToken(userId) {
    return jwt.sign({ userId, type: "refresh" }, jwtConfig.secret, {
      expiresIn: jwtConfig.refreshExpiresIn,
    });
  }

  generateResetToken(userId) {
    return jwt.sign({ userId, type: "reset" }, jwtConfig.secret, {
      expiresIn: "1h",
    });
  }

  generateEmailVerificationToken(userId) {
    return jwt.sign({ userId, type: "emailVerification" }, jwtConfig.secret, {
      expiresIn: "24h",
    });
  }
}

export default new AuthService();
```

### 3. Product Service (`product.service.js`)

```javascript
import productRepository from "../repo/product.repo.js";
import categoryRepository from "../repo/category.repo.js";
import { NotFoundError, BadRequestError } from "../utils/errors.js";

class ProductService {
  async getAllProducts({
    page,
    limit,
    search,
    category,
    minPrice,
    maxPrice,
    sort,
  }) {
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    };

    // Sorting
    if (sort === "price-asc") {
      options.sort = { price: 1 };
    } else if (sort === "price-desc") {
      options.sort = { price: -1 };
    } else if (sort === "newest") {
      options.sort = { createdAt: -1 };
    } else if (sort === "popular") {
      options.sort = { views: -1 };
    }

    // Search
    if (search) {
      return await productRepository.searchProducts(search, options);
    }

    // Filter
    const filters = {};
    if (category) filters.category = category;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);

    return await productRepository.filterProducts(filters, options);
  }

  async getProductById(productId) {
    const product = await productRepository.findById(productId, {
      populate: [
        { path: "category", select: "name slug" },
        { path: "reviews", options: { limit: 5, sort: { createdAt: -1 } } },
      ],
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    // Increment views
    await productRepository.incrementViews(productId);

    return product;
  }

  async createProduct(productData, userId) {
    // Validate category
    const category = await categoryRepository.findById(productData.category);
    if (!category) {
      throw new BadRequestError("Invalid category");
    }

    // Add creator
    productData.createdBy = userId;

    const product = await productRepository.create(productData);

    return product;
  }

  async updateProduct(productId, updateData) {
    const product = await productRepository.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    // Validate category if changed
    if (updateData.category) {
      const category = await categoryRepository.findById(updateData.category);
      if (!category) {
        throw new BadRequestError("Invalid category");
      }
    }

    const updatedProduct = await productRepository.updateById(
      productId,
      updateData
    );

    return updatedProduct;
  }

  async deleteProduct(productId) {
    const product = await productRepository.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    // Soft delete
    await productRepository.updateById(productId, {
      isActive: false,
    });

    return { message: "Product deleted successfully" };
  }

  async getFeaturedProducts() {
    return await productRepository.findFeaturedProducts();
  }

  async getTopSellingProducts(limit = 10) {
    return await productRepository.getTopSellingProducts(limit);
  }

  async checkStockAvailability(productId, quantity) {
    const product = await productRepository.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (product.stock < quantity) {
      throw new BadRequestError(
        `Only ${product.stock} items available in stock`
      );
    }

    return { available: true };
  }

  async updateStock(productId, quantity, operation = "decrease") {
    const product = await productRepository.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const change = operation === "decrease" ? -quantity : quantity;

    if (operation === "decrease" && product.stock < quantity) {
      throw new BadRequestError("Insufficient stock");
    }

    return await productRepository.updateStock(productId, change);
  }
}

export default new ProductService();
```

### 4. Order Service (`order.service.js`)

```javascript
import orderRepository from "../repo/order.repo.js";
import productRepository from "../repo/product.repo.js";
import userRepository from "../repo/user.repo.js";
import { NotFoundError, BadRequestError } from "../utils/errors.js";

class OrderService {
  async createOrder(userId, orderData) {
    // Validate user
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Validate and prepare order items
    const items = [];
    let totalAmount = 0;

    for (const item of orderData.items) {
      const product = await productRepository.findById(item.product);

      if (!product) {
        throw new NotFoundError(`Product ${item.product} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestError(`Insufficient stock for ${product.name}`);
      }

      items.push({
        product: product._id,
        quantity: item.quantity,
        price: product.salePrice || product.price,
        name: product.name,
        image: product.images[0]?.url,
      });

      totalAmount += (product.salePrice || product.price) * item.quantity;
    }

    // Add shipping fee and discount
    totalAmount += orderData.shippingFee || 0;
    totalAmount -= orderData.discount || 0;

    // Create order
    const order = await orderRepository.create({
      user: userId,
      items,
      totalAmount,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      shippingFee: orderData.shippingFee || 0,
      discount: orderData.discount || 0,
      note: orderData.note,
    });

    // Update product stock
    for (const item of items) {
      await productRepository.updateStock(item.product, -item.quantity);
    }

    return order;
  }

  async getOrderById(orderId, userId, userRole) {
    const order = await orderRepository.findById(orderId, {
      populate: [
        { path: "user", select: "name email" },
        { path: "items.product", select: "name price images" },
      ],
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Check permissions
    if (userRole !== "admin" && order.user._id.toString() !== userId) {
      throw new BadRequestError("Not authorized to view this order");
    }

    return order;
  }

  async getUserOrders(userId, { page, limit }) {
    return await orderRepository.findByUser(userId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });
  }

  async updateOrderStatus(orderId, status, userId, userRole) {
    const order = await orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Only admin can update order status
    if (userRole !== "admin") {
      throw new BadRequestError("Not authorized to update order status");
    }

    // Validate status transition
    const validTransitions = {
      pending: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    if (!validTransitions[order.orderStatus].includes(status)) {
      throw new BadRequestError(
        `Cannot change status from ${order.orderStatus} to ${status}`
      );
    }

    return await orderRepository.updateOrderStatus(orderId, status);
  }

  async cancelOrder(orderId, userId, userRole) {
    const order = await orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Check permissions
    if (userRole !== "admin" && order.user.toString() !== userId) {
      throw new BadRequestError("Not authorized to cancel this order");
    }

    // Can only cancel if not shipped/delivered
    if (["shipped", "delivered"].includes(order.orderStatus)) {
      throw new BadRequestError(
        "Cannot cancel order that is already shipped or delivered"
      );
    }

    // Restore product stock
    for (const item of order.items) {
      await productRepository.updateStock(item.product, item.quantity);
    }

    return await orderRepository.updateOrderStatus(orderId, "cancelled");
  }

  async getOrderStatistics(startDate, endDate) {
    const revenue = await orderRepository.getTotalRevenue(
      new Date(startDate),
      new Date(endDate)
    );

    const statusStats = await orderRepository.getOrderStatsByStatus();

    return {
      revenue,
      statusStats,
    };
  }
}

export default new OrderService();
```

### 5. Email Service (`email.service.js`)

```javascript
import nodemailer from "nodemailer";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail({ to, subject, html, text }) {
    try {
      const mailOptions = {
        from: `"Your App" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);

      console.log("Email sent:", info.messageId);

      return info;
    } catch (error) {
      console.error("Email send error:", error);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    const html = `
      <h1>Welcome ${user.name}!</h1>
      <p>Thank you for registering.</p>
    `;

    return await this.sendEmail({
      to: user.email,
      subject: "Welcome to Our App",
      html,
    });
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `;

    return await this.sendEmail({
      to: email,
      subject: "Password Reset",
      html,
    });
  }

  async sendOrderConfirmation(user, order) {
    const html = `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order, ${user.name}!</p>
      <p>Order Number: ${order.orderNumber}</p>
      <p>Total: $${order.totalAmount}</p>
    `;

    return await this.sendEmail({
      to: user.email,
      subject: "Order Confirmation",
      html,
    });
  }
}

export default new EmailService();
```

## Best Practices

### 1. Single Responsibility Principle

```javascript
// ✅ Good: Service chỉ lo business logic
class UserService {
  async createUser(userData) {
    // Validation
    // Business rules
    // Call repository
    return await userRepository.create(userData);
  }
}

// ❌ Bad: Service làm quá nhiều việc
class UserService {
  async createUser(req, res) {
    // Don't handle HTTP
    // Don't write SQL queries directly
    // Don't handle response formatting
  }
}
```

### 2. Error Handling

```javascript
// Throw custom errors, let error middleware handle
if (!user) {
  throw new NotFoundError("User not found");
}

// Use try-catch trong controller, không trong service
```

### 3. Transaction Handling

```javascript
async createOrder(orderData) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Multiple operations
    const order = await orderRepository.create(orderData, { session });
    await productRepository.updateStock(productId, -quantity, { session });

    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
```

### 4. Input Validation

```javascript
async createUser(userData) {
  // Validate inputs
  if (!userData.email || !this.isValidEmail(userData.email)) {
    throw new BadRequestError('Invalid email');
  }

  // Continue with business logic
}
```

## Export Pattern

```javascript
// index.js
export { default as userService } from "./user.service.js";
export { default as authService } from "./auth.service.js";
export { default as productService } from "./product.service.js";
export { default as orderService } from "./order.service.js";
export { default as emailService } from "./email.service.js";
```

## Sử dụng trong Controller

```javascript
import userService from "../service/user.service.js";

class UserController {
  async getUser(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}
```
