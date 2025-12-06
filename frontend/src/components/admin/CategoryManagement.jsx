import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FolderTree } from "lucide-react";
import { adminApi } from "../../api/admin.api";
import { categoryApi } from "../../api/category.api";
import { toast } from "react-toastify";

const CategoryManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    parent_id: null,
  });

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getAllCategories();

      // Transform backend data to match component structure
      const transformedData = response.data.map((cat) => ({
        id: cat.category_id,
        name: cat.name,
        parent_id: null, // Level 1 categories have no parent
        children: cat.children.map((child) => ({
          id: child.category_id,
          name: child.name,
          parent_id: cat.category_id,
          children: [],
        })),
      }));

      setCategories(transformedData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải danh sách categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingCategory) {
        // Update category name
        await adminApi.updateCategoryName(editingCategory.id, formData.name);
        toast.success("Cập nhật category thành công!");
      } else {
        // Create new category
        await adminApi.createCategory({
          name: formData.name,
          parentId: formData.parent_id,
        });
        toast.success("Tạo category mới thành công!");
      }

      // Refresh categories list
      await fetchCategories();
      resetForm();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(
        error.response?.data?.message ||
          (editingCategory
            ? "Cập nhật category thất bại"
            : "Tạo category thất bại")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      parent_id: category.parent_id,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (
      !window.confirm(
        "Bạn có chắc muốn xóa category này? Không thể xóa nếu có sản phẩm hoặc category con."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await adminApi.deleteCategory(categoryId);
      toast.success("Xóa category thành công!");

      // Refresh categories list
      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(
        error.response?.data?.message ||
          "Xóa category thất bại. Category có thể có sản phẩm hoặc category con."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", parent_id: null });
    setEditingCategory(null);
    setShowAddModal(false);
  };

  const getParentCategories = () => {
    return categories.filter((cat) => cat.parent_id === null);
  };

  const getCategoryTree = () => {
    return categories;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Quản lý Categories
          </h2>
          <p className="text-gray-600">
            Quản lý danh mục sản phẩm và cấu trúc phân cấp
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Thêm category
        </button>
      </div>

      {/* Category Tree */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-2">Đang tải...</p>
          </div>
        )}

        {!loading && (
          <div className="space-y-4">
            {getCategoryTree().map((parent) => (
              <div
                key={parent.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                {/* Parent Category */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FolderTree className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {parent.name}
                      </p>
                      <p className="text-xs text-gray-500">ID: #{parent.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(parent)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(parent.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Child Categories */}
                {parent.children.length > 0 && (
                  <div className="ml-8 space-y-2 border-l-2 border-gray-200 pl-4">
                    {parent.children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                      >
                        <div>
                          <p className="font-medium text-gray-700">
                            {child.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: #{child.id}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(child)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(child.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {getCategoryTree().length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Chưa có category nào. Nhấn "Thêm category" để bắt đầu.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingCategory ? "Chỉnh sửa category" : "Thêm category mới"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên category
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Nhập tên category"
                  required
                />
              </div>

              {/* Parent Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category cha (tùy chọn)
                </label>
                <select
                  value={formData.parent_id || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      parent_id: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">-- Không có (category gốc) --</option>
                  {getParentCategories().map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Đang xử lý..."
                    : editingCategory
                    ? "Cập nhật"
                    : "Thêm mới"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
