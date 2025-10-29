# 📁 Model Folder

## Mục đích

Thư mục `model/` chứa các Mongoose schemas và models định nghĩa cấu trúc dữ liệu trong MongoDB. Models đại diện cho các collections trong database và định nghĩa validation, relationships, và methods.

## Vai trò trong kiến trúc

```
Model (Schema Definition)
    ↓
Repository (Database Operations)
    ↓
Service (Business Logic)
```

## Cấu trúc

```
model/
├── user.model.js
├── product.model.js
├── order.model.js
├── category.model.js
├── review.model.js
└── index.js          # Export tất cả models
```

## Cách sử dụng

### 1. Basic Model Template (`user.model.js`)

```javascript
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // Basic fields
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Không trả về khi query
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    avatar: {
      type: String,
      default: "default-avatar.png",
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: "Vietnam",
      },
    },
    dateOfBirth: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
    // References
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ name: "text", email: "text" }); // Text search

// Virtual fields
userSchema.virtual("fullAddress").get(function () {
  if (!this.address) return "";
  return `${this.address.street}, ${this.address.city}, ${this.address.country}`;
});

userSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
});

// Pre-save middleware
userSchema.pre("save", async function (next) {
  // Hash password nếu bị thay đổi
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

userSchema.methods.generateAuthToken = function () {
  // Implement JWT token generation
};

// Static methods
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function () {
  return this.find({ isActive: true });
};

const User = mongoose.model("User", userSchema);

export default User;
```

### 2. Product Model với References (`product.model.js`)

```javascript
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    salePrice: {
      type: Number,
      min: [0, "Sale price cannot be negative"],
      validate: {
        validator: function (value) {
          return !value || value < this.price;
        },
        message: "Sale price must be less than regular price",
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    brand: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    images: [
      {
        url: String,
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    specifications: {
      type: Map,
      of: String,
    },
    tags: [String],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });

// Virtuals
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

productSchema.virtual("discountPercentage").get(function () {
  if (!this.salePrice) return 0;
  return Math.round(((this.price - this.salePrice) / this.price) * 100);
});

productSchema.virtual("inStock").get(function () {
  return this.stock > 0;
});

// Pre-save middleware
productSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }
  next();
});

// Static methods
productSchema.statics.findByCategory = function (categoryId) {
  return this.find({ category: categoryId, isActive: true });
};

productSchema.statics.findFeatured = function () {
  return this.find({ isFeatured: true, isActive: true }).limit(10);
};

const Product = mongoose.model("Product", productSchema);

export default Product;
```

### 3. Order Model với Subdocuments (`order.model.js`)

```javascript
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  name: String, // Snapshot của tên sản phẩm
  image: String, // Snapshot của ảnh
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      zipCode: String,
      country: { type: String, default: "Vietnam" },
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "paypal", "momo"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    note: String,
    cancelReason: String,
    deliveredAt: Date,
    paidAt: Date,
  },
  {
    timestamps: true,
  }
);

// Pre-save: Generate order number
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD${Date.now()}${count + 1}`;
  }
  next();
});

// Methods
orderSchema.methods.calculateTotal = function () {
  const itemsTotal = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return itemsTotal + this.shippingFee - this.discount;
};

const Order = mongoose.model("Order", orderSchema);

export default Order;
```

## Best Practices

### 1. Schema Design Principles

```javascript
// ✅ Good: Clear, validated fields
{
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator, 'Invalid email'],
  }
}

// ❌ Bad: No validation
{
  email: String
}
```

### 2. Use Appropriate Data Types

```javascript
// Strings
name: { type: String, trim: true }

// Numbers
price: { type: Number, min: 0 }

// Booleans
isActive: { type: Boolean, default: true }

// Dates
createdAt: { type: Date, default: Date.now }

// Arrays
tags: [String]
items: [itemSchema]

// Objects/Subdocuments
address: {
  street: String,
  city: String,
}

// References
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

// Mixed/Any
metadata: mongoose.Schema.Types.Mixed
```

### 3. Indexing Strategy

```javascript
// Single field index
schema.index({ email: 1 });

// Compound index
schema.index({ category: 1, price: -1 });

// Text search index
schema.index({ name: "text", description: "text" });

// Unique index
schema.index({ slug: 1 }, { unique: true });

// Sparse index (cho optional fields)
schema.index({ phone: 1 }, { sparse: true });
```

### 4. Virtual Fields

```javascript
// Don't store computed values
schema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Populate virtuals
schema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
});
```

### 5. Middleware Hooks

```javascript
// Pre-save
schema.pre("save", function (next) {
  // Runs before saving
  next();
});

// Post-save
schema.post("save", function (doc, next) {
  // Runs after saving
  next();
});

// Pre-remove
schema.pre("remove", async function (next) {
  // Cleanup related data
  await Comment.deleteMany({ post: this._id });
  next();
});
```

### 6. Methods vs Statics

```javascript
// Instance methods (cho 1 document)
schema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
// Usage: await user.comparePassword('123456');

// Static methods (cho Model)
schema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};
// Usage: await User.findByEmail('test@test.com');
```

## Common Patterns

### Soft Delete

```javascript
schema.add({
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
});

schema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Query helper
schema.query.notDeleted = function () {
  return this.where({ isDeleted: false });
};
```

### Timestamps with Custom Names

```javascript
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}
```

### Enum with Custom Messages

```javascript
role: {
  type: String,
  enum: {
    values: ['user', 'admin', 'moderator'],
    message: '{VALUE} is not a valid role'
  }
}
```

## Export Pattern

```javascript
// index.js
export { default as User } from "./user.model.js";
export { default as Product } from "./product.model.js";
export { default as Order } from "./order.model.js";
export { default as Category } from "./category.model.js";
```

## Sử dụng trong Repository

```javascript
import User from "../model/user.model.js";

class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findById(id) {
    return await User.findById(id);
  }

  async findByEmail(email) {
    return await User.findByEmail(email); // Static method
  }
}
```
