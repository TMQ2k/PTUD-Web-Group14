# 📁 Repository Folder

## Mục đích

Thư mục `repo/` (Repository Layer) chứa các class xử lý **trực tiếp** với database operations. Repositories đóng vai trò như một abstraction layer giữa business logic (services) và database (models).

## Vai trò trong kiến trúc

```
Controller
    ↓
Service (Business Logic)
    ↓
Repository (Data Access Layer) ← BẠN Ở ĐÂY
    ↓
Model (Mongoose)
    ↓
MongoDB
```

## Tại sao cần Repository Layer?

### Lợi ích

1. **Separation of Concerns**: Tách business logic khỏi data access
2. **Reusability**: Tái sử dụng database queries
3. **Testability**: Dễ dàng mock/test
4. **Consistency**: Chuẩn hóa cách truy xuất data
5. **Flexibility**: Dễ thay đổi database implementation

## Cấu trúc

```
repo/
├── base.repo.js           # Base repository với CRUD chung
├── user.repo.js          # User-specific operations
├── product.repo.js       # Product operations
├── order.repo.js         # Order operations
├── category.repo.js      # Category operations
└── index.js              # Export tất cả repos
```

## Cách sử dụng

### 1. Base Repository (`base.repo.js`)

```javascript
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  // CREATE
  async create(data) {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      throw error;
    }
  }

  async createMany(dataArray) {
    try {
      return await this.model.insertMany(dataArray);
    } catch (error) {
      throw error;
    }
  }

  // READ
  async findById(id, options = {}) {
    try {
      let query = this.model.findById(id);

      if (options.select) {
        query = query.select(options.select);
      }

      if (options.populate) {
        query = query.populate(options.populate);
      }

      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  async findOne(conditions, options = {}) {
    try {
      let query = this.model.findOne(conditions);

      if (options.select) {
        query = query.select(options.select);
      }

      if (options.populate) {
        query = query.populate(options.populate);
      }

      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  async findAll(conditions = {}, options = {}) {
    try {
      let query = this.model.find(conditions);

      if (options.select) {
        query = query.select(options.select);
      }

      if (options.sort) {
        query = query.sort(options.sort);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.skip) {
        query = query.skip(options.skip);
      }

      if (options.populate) {
        query = query.populate(options.populate);
      }

      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  async findWithPagination(conditions = {}, options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 10;
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.findAll(conditions, { ...options, skip, limit }),
        this.count(conditions),
      ]);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async count(conditions = {}) {
    try {
      return await this.model.countDocuments(conditions);
    } catch (error) {
      throw error;
    }
  }

  async exists(conditions) {
    try {
      return await this.model.exists(conditions);
    } catch (error) {
      throw error;
    }
  }

  // UPDATE
  async updateById(id, updateData, options = {}) {
    try {
      return await this.model.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
        ...options,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateOne(conditions, updateData, options = {}) {
    try {
      return await this.model.findOneAndUpdate(conditions, updateData, {
        new: true,
        runValidators: true,
        ...options,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateMany(conditions, updateData) {
    try {
      return await this.model.updateMany(conditions, updateData);
    } catch (error) {
      throw error;
    }
  }

  // DELETE
  async deleteById(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteOne(conditions) {
    try {
      return await this.model.findOneAndDelete(conditions);
    } catch (error) {
      throw error;
    }
  }

  async deleteMany(conditions) {
    try {
      return await this.model.deleteMany(conditions);
    } catch (error) {
      throw error;
    }
  }

  // AGGREGATION
  async aggregate(pipeline) {
    try {
      return await this.model.aggregate(pipeline);
    } catch (error) {
      throw error;
    }
  }
}

export default BaseRepository;
```

### 2. User Repository (`user.repo.js`)

```javascript
import BaseRepository from "./base.repo.js";
import User from "../model/user.model.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  // Custom query methods
  async findByEmail(email) {
    try {
      return await this.model
        .findOne({
          email: email.toLowerCase(),
        })
        .select("+password"); // Include password field
    } catch (error) {
      throw error;
    }
  }

  async findActiveUsers(options = {}) {
    try {
      return await this.findAll({ isActive: true }, options);
    } catch (error) {
      throw error;
    }
  }

  async findByRole(role, options = {}) {
    try {
      return await this.findAll({ role }, options);
    } catch (error) {
      throw error;
    }
  }

  async searchUsers(searchTerm, options = {}) {
    try {
      return await this.findAll(
        {
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        },
        options
      );
    } catch (error) {
      throw error;
    }
  }

  async updateLastLogin(userId) {
    try {
      return await this.updateById(userId, {
        lastLogin: new Date(),
      });
    } catch (error) {
      throw error;
    }
  }

  async changePassword(userId, newPassword) {
    try {
      const user = await this.findById(userId);
      user.password = newPassword;
      return await user.save(); // Triggers pre-save hook to hash
    } catch (error) {
      throw error;
    }
  }

  async getUserStats() {
    try {
      return await this.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ]);
    } catch (error) {
      throw error;
    }
  }

  async getUsersWithOrders() {
    try {
      return await this.findAll(
        {},
        {
          populate: {
            path: "orders",
            select: "orderNumber totalAmount status",
          },
        }
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new UserRepository();
```

### 3. Product Repository (`product.repo.js`)

```javascript
import BaseRepository from "./base.repo.js";
import Product from "../model/product.model.js";

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  async findBySlug(slug) {
    try {
      return await this.findOne({ slug });
    } catch (error) {
      throw error;
    }
  }

  async findByCategory(categoryId, options = {}) {
    try {
      return await this.findWithPagination(
        { category: categoryId, isActive: true },
        options
      );
    } catch (error) {
      throw error;
    }
  }

  async findFeaturedProducts(limit = 10) {
    try {
      return await this.findAll(
        { isFeatured: true, isActive: true },
        { limit, sort: { createdAt: -1 } }
      );
    } catch (error) {
      throw error;
    }
  }

  async searchProducts(searchTerm, options = {}) {
    try {
      return await this.findWithPagination(
        {
          $text: { $search: searchTerm },
          isActive: true,
        },
        {
          ...options,
          select: { score: { $meta: "textScore" } },
          sort: { score: { $meta: "textScore" } },
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async filterProducts(filters, options = {}) {
    try {
      const query = { isActive: true };

      if (filters.category) {
        query.category = filters.category;
      }

      if (filters.minPrice || filters.maxPrice) {
        query.price = {};
        if (filters.minPrice) query.price.$gte = filters.minPrice;
        if (filters.maxPrice) query.price.$lte = filters.maxPrice;
      }

      if (filters.brand) {
        query.brand = filters.brand;
      }

      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }

      return await this.findWithPagination(query, options);
    } catch (error) {
      throw error;
    }
  }

  async updateStock(productId, quantity) {
    try {
      return await this.updateById(productId, {
        $inc: { stock: quantity },
      });
    } catch (error) {
      throw error;
    }
  }

  async incrementViews(productId) {
    try {
      return await this.updateById(productId, {
        $inc: { views: 1 },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateRating(productId, newRating) {
    try {
      const product = await this.findById(productId);

      const totalRating = product.rating.average * product.rating.count;
      const newCount = product.rating.count + 1;
      const newAverage = (totalRating + newRating) / newCount;

      return await this.updateById(productId, {
        "rating.average": newAverage,
        "rating.count": newCount,
      });
    } catch (error) {
      throw error;
    }
  }

  async getTopSellingProducts(limit = 10) {
    try {
      return await this.aggregate([
        {
          $lookup: {
            from: "orders",
            localField: "_id",
            foreignField: "items.product",
            as: "orders",
          },
        },
        {
          $addFields: {
            totalSold: { $size: "$orders" },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: limit },
      ]);
    } catch (error) {
      throw error;
    }
  }

  async getLowStockProducts(threshold = 10) {
    try {
      return await this.findAll({
        stock: { $lte: threshold },
        isActive: true,
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductRepository();
```

### 4. Order Repository (`order.repo.js`)

```javascript
import BaseRepository from "./base.repo.js";
import Order from "../model/order.model.js";

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  async findByOrderNumber(orderNumber) {
    try {
      return await this.findOne({ orderNumber })
        .populate("user", "name email")
        .populate("items.product", "name price images");
    } catch (error) {
      throw error;
    }
  }

  async findByUser(userId, options = {}) {
    try {
      return await this.findWithPagination(
        { user: userId },
        {
          ...options,
          sort: { createdAt: -1 },
          populate: "items.product",
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async findByStatus(status, options = {}) {
    try {
      return await this.findWithPagination({ orderStatus: status }, options);
    } catch (error) {
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const updateData = { orderStatus: status };

      if (status === "delivered") {
        updateData.deliveredAt = new Date();
      }

      return await this.updateById(orderId, updateData);
    } catch (error) {
      throw error;
    }
  }

  async updatePaymentStatus(orderId, status) {
    try {
      const updateData = { paymentStatus: status };

      if (status === "paid") {
        updateData.paidAt = new Date();
      }

      return await this.updateById(orderId, updateData);
    } catch (error) {
      throw error;
    }
  }

  async getTotalRevenue(startDate, endDate) {
    try {
      const result = await this.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 },
          },
        },
      ]);

      return result[0] || { totalRevenue: 0, orderCount: 0 };
    } catch (error) {
      throw error;
    }
  }

  async getOrderStatsByStatus() {
    try {
      return await this.aggregate([
        {
          $group: {
            _id: "$orderStatus",
            count: { $sum: 1 },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
      ]);
    } catch (error) {
      throw error;
    }
  }

  async getRecentOrders(limit = 10) {
    try {
      return await this.findAll(
        {},
        {
          limit,
          sort: { createdAt: -1 },
          populate: [
            { path: "user", select: "name email" },
            { path: "items.product", select: "name price" },
          ],
        }
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new OrderRepository();
```

## Best Practices

### 1. Single Responsibility

```javascript
// ✅ Good: Repo chỉ lo database operations
async findByEmail(email) {
  return await this.model.findOne({ email });
}

// ❌ Bad: Business logic trong repo
async findByEmail(email) {
  const user = await this.model.findOne({ email });
  if (!user) throw new Error('User not found'); // Nên ở service
  return user;
}
```

### 2. Error Handling

```javascript
// Repository throw errors, Service handle chúng
async findById(id) {
  try {
    return await this.model.findById(id);
  } catch (error) {
    throw error; // Let service handle
  }
}
```

### 3. Query Optimization

```javascript
// Sử dụng select để chọn fields cần thiết
async findUserBasicInfo(id) {
  return await this.findById(id, {
    select: 'name email avatar',
  });
}

// Sử dụng lean() cho read-only
async getAllProducts() {
  return await this.model.find().lean();
}
```

### 4. Reusable Queries

```javascript
// Tạo helper methods cho queries phổ biến
async findActive(conditions = {}) {
  return await this.findAll({
    ...conditions,
    isActive: true,
  });
}
```

## Export Pattern

```javascript
// index.js
export { default as userRepository } from "./user.repo.js";
export { default as productRepository } from "./product.repo.js";
export { default as orderRepository } from "./order.repo.js";
export { default as categoryRepository } from "./category.repo.js";
```

## Sử dụng trong Service

```javascript
import userRepository from "../repo/user.repo.js";

class UserService {
  async getUserById(id) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async createUser(userData) {
    // Check if email exists
    const existingUser = await userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new ConflictError("Email already in use");
    }

    return await userRepository.create(userData);
  }
}
```

## Testing Repositories

```javascript
// Mock repository trong tests
jest.mock("../repo/user.repo.js");

userRepository.findById.mockResolvedValue(mockUser);
```
