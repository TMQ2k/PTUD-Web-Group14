import React, { useState, useEffect } from "react";
import { Package, User, Mail } from "lucide-react";
import { userApi } from "../../api/user.api";
import { toast } from "react-toastify";

const SellerWonProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeactivatedProducts();
  }, []);

  const fetchDeactivatedProducts = async () => {
    try {
      setLoading(true);
      const response = await userApi.getSellerDeactivatedProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching deactivated products:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Sản phẩm đã có người thắng đấu giá
        </h2>
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Chưa có sản phẩm nào đã kết thúc đấu giá
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sản phẩm đã có người thắng đấu giá
        </h2>
        <p className="text-gray-600 text-sm">
          Quản lý các sản phẩm đã kết thúc đấu giá và thông tin người mua
        </p>
      </div>

      {/* Products List */}
      <div className="space-y-6">
        {products.map((product) => (
          <div
            key={product.won_id}
            className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            {/* Product Info */}
            <div className="flex gap-4 mb-4">
              <img
                src={
                  product.product_image ||
                  "/images/default/product-placeholder.png"
                }
                alt={product.product_name}
                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.product_name}
                </h3>
                <div className="flex items-center gap-1 text-green-600 mb-2">
                  <span className="font-bold text-lg">
                    {formatCurrency(product.winning_bid)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  ID đơn hàng: #{product.won_id}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Buyer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Thông tin người thắng
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-600">Tên người thắng:</p>
                    <p className="font-medium text-gray-900">
                      {product.bidder_name || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-600">Email:</p>
                    <p className="font-medium text-gray-900">
                      {product.bidder_email || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerWonProducts;
