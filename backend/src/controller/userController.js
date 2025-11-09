import express from "express";
import { register, login, getUserProfile } from "../service/userService.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    const msg = await register(username, password, email, role);

    res.status(201).json({
      code: 201,
      message: "User registered successfully",
      data: { username, email, role, note: msg },
    });
  } catch (err) {
    console.error("❌ Error in /register route:", err);

    res.status(400).json({
      code: 400,
      message: err.message || "Registration failed",
      data: null,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("📥 Login request received:", { username });

    const { token } = await login(username, password);

    console.log("✅ Login success for:", username);

    res.status(200).json({
      code: 200,
      message: "Login successful",
      data: { token }, // gồm { token, user }
    });
  } catch (err) {
    console.error("❌ Error in /login route:", err);

    res.status(401).json({
      code: 401,
      message: err.message || "Login failed",
      data: null,
    });
  }
});

export default router;

router.get("/profile", authenticate, async (req, res) => {
  try {
    console.log("📥 /profile request received for user ID:", req.user.id);

    const user = await getUserProfile(req.user.id); // req.user.id từ JWT

    console.log("✅ User profile retrieved:", user);

    res.status(200).json({
      code: 200,
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (err) {
    console.error("❌ Error in /profile route:", err);

    res.status(404).json({
      code: 404,
      message: err.message || "User not found",
      data: null,
    });
  }
});
