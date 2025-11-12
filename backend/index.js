// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userController from "./src/controller/userController.js";
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

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
