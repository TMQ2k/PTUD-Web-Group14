# 📁 Controller Folder

## Mục đích

Thư mục `controller/` chứa các controller xử lý HTTP requests và responses. Controllers nhận requests từ routes, gọi services để xử lý business logic, và trả về responses.

## Vai trò trong kiến trúc

```
Route → Controller → Service → Repository → Database
                ↓
            Response
```

## Cấu trúc

```
controller/
├── user.controller.js
├── auth.controller.js
├── product.controller.js
├── order.controller.js
└── index.js          # Export tất cả controllers
```

## Cách sử dụng

### Template cơ bản

```javascript
import userService from "../service/user.service.js";
import { HTTP_STATUS } from "../config/constants.js";

class UserController {
  // GET /api/users
  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, search } = req.query;

      const result = await userService.getAllUsers({ page, limit, search });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Get users successfully",
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users/:id
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(id);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Get user successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/users
  async createUser(req, res, next) {
    try {
      const userData = req.body;

      const newUser = await userService.createUser(userData);

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/users/:id
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedUser = await userService.updateUser(id, updateData);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/users/:id
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      await userService.deleteUser(id);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
```

### Auth Controller Example

```javascript
import authService from "../service/auth.service.js";

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;

      const result = await authService.register({ email, password, name });

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const userId = req.user.id;

      await authService.logout(userId);

      return res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      const result = await authService.refreshToken(refreshToken);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
```

## Best Practices

### 1. Thin Controllers

Controllers chỉ nên:

- Nhận và validate request data
- Gọi services
- Format và trả về response
- Handle errors với `next(error)`

❌ **Không nên:**

```javascript
// Không nên có business logic trong controller
async createUser(req, res) {
  const user = new User(req.body);
  if (user.age < 18) {
    return res.status(400).json({ error: 'Too young' });
  }
  await user.save();
  // ...
}
```

✅ **Nên:**

```javascript
// Business logic trong service
async createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
}
```

### 2. Consistent Response Format

```javascript
// Success response
{
  success: true,
  message: "Operation successful",
  data: { ... },
  pagination: { ... } // nếu cần
}

// Error response (handled by error middleware)
{
  success: false,
  message: "Error message",
  error: "Error details"
}
```

### 3. Error Handling

```javascript
// Luôn sử dụng try-catch và next(error)
async someMethod(req, res, next) {
  try {
    // ... logic
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
}
```

### 4. Naming Convention

- File: `[entity].controller.js` (lowercase)
- Class: `[Entity]Controller` (PascalCase)
- Methods: HTTP verb + action (camelCase)
  - `getAllUsers`, `getUserById`, `createUser`
  - `updateUser`, `deleteUser`

### 5. RESTful Methods

```javascript
class ResourceController {
  async getAll(req, res, next) {} // GET /resources
  async getById(req, res, next) {} // GET /resources/:id
  async create(req, res, next) {} // POST /resources
  async update(req, res, next) {} // PUT /resources/:id
  async patch(req, res, next) {} // PATCH /resources/:id
  async delete(req, res, next) {} // DELETE /resources/:id
}
```

## Export Pattern

```javascript
// index.js
export { default as userController } from "./user.controller.js";
export { default as authController } from "./auth.controller.js";
export { default as productController } from "./product.controller.js";
```

## Sử dụng trong Routes

```javascript
import { userController } from "../controller/index.js";

router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
```
