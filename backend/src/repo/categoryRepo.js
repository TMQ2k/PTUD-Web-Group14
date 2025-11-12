import pool from "../config/db.js";
import { Category } from "../model/categoryModel.js";

//Category does not have children field in database, need to query separately
export const getAllCategories = async () => {
    const result = await pool.query("SELECT * FROM categories");
    const categories = result.rows.map(row => new Category(row.category_id, row.name, row.parent_id));
    for (let category of categories) {
        const childrenResult = await pool.query("SELECT * FROM categories WHERE parent_id = $1", [category.id]);
        category.children = childrenResult.rows.map(childRow => new Category(childRow.category_id, childRow.name, childRow.parent_id));
    }
    return categories;
};



