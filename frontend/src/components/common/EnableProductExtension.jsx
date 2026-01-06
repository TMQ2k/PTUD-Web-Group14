import { useState } from "react";
import { productApi } from "../../api/product.api";
import { Blocks } from "lucide-react";

const EnableProductExtension = ({ productId, onClick }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAllow = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Call the API (Assuming the method is named enableExtension)
      // If your API expects a body like { enable: true }, adjust accordingly.
      await productApi.enableProductExtension(productId);

      // 2. Close the modal or notify parent of success
      if (onClick) onClick();
      
    } catch (err) {
      console.error("Error enabling extension:", err);
      setError("Failed to enable extension. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Just close the modal without making API calls
    if (onClick) onClick();
  };

  return (
    <div className="relative bg-white mx-auto rounded-xl shadow-lg border border-gray-100 max-w-sm overflow-hidden">
      {/* Decorative Top Gradient Strip */}
      <div className="h-2 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

      <div className="p-8 text-center">
        {/* Eye-catching Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
          <Blocks />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Gia hạn sản phẩm
        </h3>
        
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          Gia hạn sản phẩm cho phép phiên đấu giá được kéo dài thêm thời gian khi thời gian đấu giá còn 5 phút và vẫn còn người đấu giá          
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {/* Cancel Button - Subtle */}
          <button
            onClick={handleCancel}
            disabled={loading}
            className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all focus:ring-2 focus:ring-offset-1 focus:ring-gray-200"
          >
            Cancel
          </button>

          {/* Allow Button - Gradient & Pop */}
          <button
            onClick={handleAllow}
            disabled={loading}
            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Yes, Enable"
            )}
          </button>
        </div>
      </div>
    </div>
  )
};

export default EnableProductExtension;