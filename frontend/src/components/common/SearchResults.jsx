import ProductCard from "./ProductCard";

const SearchResults = ({
  products,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  watchlistIds = new Set(),
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tìm kiếm...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Không tìm thấy sản phẩm
        </h3>
        <p className="text-gray-600">
          Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
        </p>
      </div>
    );
  }

  // Phân chia sản phẩm theo thời gian đăng
  const newProducts = products.filter((product) => product.isNew);
  const otherProducts = products.filter((product) => !product.isNew);

  return (
    <div className="space-y-8">
      {/* Sản phẩm mới (trong 10 phút) */}
      {newProducts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <span className="font-bold">
                Sản phẩm mới đăng (10 phút gần đây)
              </span>
            </div>
            <span className="text-gray-600 font-semibold">
              {newProducts.length} sản phẩm
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                isInWatchlist={watchlistIds.has(product.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sản phẩm còn lại */}
      {otherProducts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-400 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <span className="font-bold">Tất cả sản phẩm</span>
            </div>
            <span className="text-gray-600 font-semibold">
              {otherProducts.length} sản phẩm
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {otherProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                isInWatchlist={watchlistIds.has(product.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-purple-600 hover:bg-purple-50 shadow-md hover:shadow-lg border border-gray-200"
            }`}
          >
            ← Trước
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => {
                // Hiển thị: trang đầu, trang cuối, trang hiện tại và 1 trang xung quanh
                const showPage =
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                if (!showPage) {
                  // Hiển thị dấu ... giữa các nhóm trang
                  if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return (
                      <span key={pageNum} className="px-3 py-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      currentPage === pageNum
                        ? "bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110"
                        : "bg-white text-gray-700 hover:bg-purple-50 shadow-md hover:shadow-lg border border-gray-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-purple-600 hover:bg-purple-50 shadow-md hover:shadow-lg border border-gray-200"
            }`}
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
