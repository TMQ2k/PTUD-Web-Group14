import dotenv from "dotenv";
dotenv.config();
import { 
    getAllCategories as getAllCategoriesRepo
}  from "../repo/categoryRepo.js";

export const getAllCategories = async () => {
    const categories = await getAllCategoriesRepo();
    if (!categories) {
        throw new Error('No categories found');
    }
    return categories;
};