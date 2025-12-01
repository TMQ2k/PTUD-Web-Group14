import dotenv from "dotenv";
dotenv.config();
import {
  getAllCategories as getAllCategoriesRepo,
  createCategory as createCategoryRepo,
} from "../repo/categoryRepo.js";

export const getAllCategories = async () => {
  const categories = await getAllCategoriesRepo();
  if (!categories) {
    throw new Error("No categories found");
  }
  return categories;
};

export const createCategory = async (name, parentId = null) => {
  const categoryId = await createCategoryRepo(name, parentId);
  if (!categoryId) {
    throw new Error("Failed to create category");
  }
  return categoryId;
};
