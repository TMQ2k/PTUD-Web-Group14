// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userController from "./src/controller/userController.js";
import productController from "./src/controller/productController.js";
import categoryController from "./src/controller/catergoryController.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // hoặc domain frontend của bạn
  })
);

app.use(express.json());

// Test route
app.use("/api/users", userController);
app.use("/api/products", productController);
app.use("/api/categories", categoryController);
const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

//print user database connection test
import pool from "./src/config/db.js";
pool.query("SELECT * FROM users", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected:", res.rows);
  }
});
