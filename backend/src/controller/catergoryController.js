import express from "express";
import {
  getAllCategories,
  createCategory,
  deleteCategoryById,
  updateCategoryName,
} from "../service/categoryService.js";
import { authenticate, authorize } from "../middleware/auth.js";
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const categories = await getAllCategories();
    return res.status(200).json({
      code: 200,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(404).json({
      code: 404,
      message: "Categories not found",
      data: null,
    });
  }
});

router.post("/create", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const categoryId = await createCategory(name, parentId);
    return res.status(201).json({
      code: 201,
      message: "Category created successfully",
      data: { categoryId },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(400).json({
      code: 400,
      message: "Failed to create category",
      data: null,
    });
  }
});

router.delete(
  "/delete/",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { categoryId } = req.body;
      const result = await deleteCategoryById(categoryId);
      return res.status(200).json({
        code: 200,
        message: "Category deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      return res.status(400).json({
        code: 400,
        message: "Failed to delete category",
        data: null,
      });
    }
  }
);

router.patch(
  "/update-name/",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { categoryId, newName } = req.body;
      const result = await updateCategoryName(categoryId, newName);
      return res.status(200).json({
        code: 200,
        message: "Category name updated successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error updating category name:", error);
      return res.status(400).json({
        code: 400,
        message: "Failed to update category name",
        data: null,
      });
    }
  }
);
export default router;
