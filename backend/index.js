// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userController from "./src/controller/userController.js";
import productController from "./src/controller/productController.js";
import categoryController from "./src/controller/catergoryController.js";
import bidderController from "./src/controller/bidderController.js";
import commentController from "./src/controller/commentController.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

// Test route
app.use("/api/users", userController);
app.use("/api/products", productController);
app.use("/api/categories", categoryController);
app.use("/api/bidder", bidderController);
app.use("/api/comments", commentController);

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

//print product with id 20
import pool from "./src/config/db.js";
pool.query("SELECT * FROM products WHERE product_id = $1", [20]).then((res) => {
  console.log(res.rows[0]);
});