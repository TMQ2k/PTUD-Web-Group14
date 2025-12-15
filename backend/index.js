// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userController from "./src/controller/userController.js";
import productController from "./src/controller/productController.js";
import categoryController from "./src/controller/catergoryController.js";
import bidderController from "./src/controller/bidderController.js";
import sellerController from "./src/controller/sellerController.js";
import commentController from "./src/controller/commentController.js";
import searchConroller from "./src/controller/searchController.js";

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
app.use("/api/seller", sellerController);
app.use("/api/comments", commentController);
app.use("/api/search", searchConroller);

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


//print couple products matching category name
import pool from "./src/config/db.js"; 

const printProductsByCategoryName = async () => {
  try {
    const res = await pool.query(
      `SELECT p.name AS product_name, c.name AS category_name
       FROM products p
       JOIN product_categories pc ON p.product_id = pc.product_id
        JOIN categories c ON pc.category_id = c.category_id`
    );
    console.log("Products and their categories:");
    res.rows.forEach((row) => {
      console.log(`Product: ${row.product_name}, Category: ${row.category_name}`);
    });
  } catch (err) {
    console.error("Error fetching products by category name:", err); 
  } 
};
printProductsByCategoryName();