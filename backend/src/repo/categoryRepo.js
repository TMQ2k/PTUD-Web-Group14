import pool from "../config/db.js";
import { Category } from "../model/categoryModel.js";

export const getAllCategories = async () => {
    const result = await pool.query("SELECT * FROM categories WHERE parent_id IS NULL");
    const categories = result.rows.map(row => new Category(row.category_id, row.name, row.parent_id));
    for (let category of categories) {
        const childResult = await pool.query("SELECT * FROM categories WHERE parent_id = $1", [category.category_id]);
        category.children = childResult.rows.map(row => new Category(row.category_id, row.name, row.parent_id));
    }
    return categories;
};




