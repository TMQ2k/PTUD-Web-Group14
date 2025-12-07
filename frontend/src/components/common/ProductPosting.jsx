import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { productApi } from "../../api/product.api";
import { useEffect, useState, useRef } from "react";
import { convert, parseIntFromCurrency } from "../../utils/NumberHandler";
import { categoryApi } from "../../api/category.api";

// --- 1. The Reusable Multi-Select Component ---
const CategorySelector = ({ selected, onToggle, error, categories }) => {  

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => {
          // Check if this specific category is currently chosen
          const isActive = selected.includes(cat.category_id);
          
          return (
            <button
              key={cat.category_id}
              type="button" // Important: Prevents form submission
              onClick={() => onToggle(cat.category_id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all border duration-400
                ${isActive 
                  ? 'bg-blue-500 border-blue-500 scale:102 text-white shadow-lg scale-105 ' 
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 duration-900'
                }
              `}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
      {error && <span className="text-xs text-red-500 font-medium">{error.message}</span>}
    </div>
  );
};

// 1. Reusable Component to reduce clutter and ensure consistent styling
const InputField = ({ label, id, error, children }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label htmlFor={id} className="text-sm font-semibold text-blue-500">
      {label}
    </label>
    {children}
    {/* Display Error Message if it exists */}
    {error && (
      <span className="text-xs text-red-500 font-medium">{error.message}</span>
    )}
  </div>
);

const ProductPosting = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    getValues
  } = useForm({
    defaultValues: {
      images: [],
      categories: []
    },
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
  };

  // Watch the images field so we can show the count (e.g., "2/4")
  const currentImages = watch("images");

  // Local state for Preview URLs (visual only)
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  // 1. Handle File Selection
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Generate Previews
    const newPreviews = files.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file, // Keep original file for the form
    }));

    // Update Local State (Visuals)
    setPreviews((prev) => [...prev, ...newPreviews]);

    // Update Form Data (Logic)
    const updatedFiles = [...(currentImages || []), ...files];
    setValue("images", updatedFiles);

    // Trigger validation immediately to remove error if they reached 4
    trigger("images");

    // Reset input so user can select same file again if needed
    e.target.value = "";
  };

  // 2. Handle Removal
  const removeImage = (indexToRemove) => {
    // Revoke URL to prevent memory leak
    URL.revokeObjectURL(previews[indexToRemove].url);

    // Update Visuals
    setPreviews((prev) => prev.filter((_, i) => i !== indexToRemove));

    // Update Form Data
    const updatedFiles = currentImages.filter((_, i) => i !== indexToRemove);
    setValue("images", updatedFiles);

    // Trigger validation to show error if they drop below 4
    trigger("images");
  };

  // 3. Cleanup memory on unmount
  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      setLoading(true);

      try {
        const response = await categoryApi.getAllCategories();        
        if (isMounted) {
          setCategories(response.data.flatMap(parent => parent.children));
        }
      }
      catch (error) {
        if (isMounted) {
          setError(error);
        }
      }
      finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
    }
  }, [])

  // Watch categories to update UI
  const currentCategories = watch("categories");

  // Toggle Logic: Add if missing, Remove if present
  const handleCategoryToggle = (catId) => {
    const current = currentCategories || [];
    let updated;

    if (current.includes(catId)) {
      // Remove it
      updated = current.filter(id => id !== catId);
    } else {
      // Add it
      updated = [...current, catId];
    }

    setValue("categories", updated);
    trigger("categories"); // Force validation check
  };

  // Common Tailwind classes for all inputs
  const inputClasses =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400";

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 my-10">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-blue-600">Post new product</h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details to post your product for auction.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Row 1: Product Name */}
        <InputField
          label="Tên sản phẩm"
          id="product_name"
          error={errors.productName}
        >
          <input
            id="product_name"
            type="text"
            placeholder="e.g. Vintage Canon Camera"
            className={inputClasses}
            {...register("productName", {
              required: "Product name is required",
            })}
          />
        </InputField>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Select Categories <span className="text-gray-400 font-normal">(Pick at least 1)</span>
          </label>
          
          {/* Register a hidden input so Hook Form knows this field exists */}
          <input 
            type="hidden" 
            {...register("categories", { 
              validate: (val) => val && val.length > 0 || "Please select at least one category" 
            })} 
          />

          <CategorySelector 
            selected={currentCategories} 
            onToggle={handleCategoryToggle} 
            error={errors.categories}
            categories={categories}
          />
        </div>

        {/* Row 2: Grid for Prices (Side by Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Giá khởi điểm (đ)"
            id="starting_price"
            error={errors.startingPrice}
          >
              <input
              id="starting_price"
              type="text"
              placeholder="100,000"
              className={inputClasses}
              {...register("startingPrice", {
                required: "Starting price is required",
                min: 1,
                onChange: (e) => {
                  setValue("startingPrice", convert(e.target.value.trim()))
                }
              })}
            />
          </InputField>

          <InputField
            label="Bước giá (đ)"
            id="step_price"
            error={errors.stepPrice}
          >
            <input
              id="step_price"
              type="text"
              placeholder="100,000"
              className={inputClasses}
              {...register("stepPrice", {
                required: "Step price is required",
                min: 1,
                onChange: (e) => {
                  setValue("stepPrice", convert(e.target.value.trim()))
                }
              })}
            />
          </InputField>
        </div>

        {/* Row 3: Date & Category (New Grid) */}
        
          {/* === THE NEW DATE FIELD === */}
        <InputField
          label="Auction End Date"
          id="end_date"
          error={errors.endDate}
        >
          <input
            id="end_date"
            type="datetime-local"
            min={new Date(Date.now())}              
            className={inputClasses}
            // Set min to today's date to prevent past dates
            {...register("endDate", {
              required: "Please select an end date",
              validate: (value) => {
                const selectedDate = new Date(value);
                const today = new Date();
                return selectedDate > today || "Date must be in the future";
              },
            })}
          />
        </InputField>          
        

        {/* === SECTION: IMAGE UPLOAD === */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-blue-500">
              Product Images           
            </label>            
            <span
              className={`text-xs font-medium ${
                currentImages?.length >= 4 ? "text-green-600" : "text-gray-400"
              }`}
            >
              {currentImages?.length || 0} / 4 required
            </span>
          </div>

          {/* Custom Register for Validation Only - hidden input trick */}
          <input
            type="hidden"
            {...register("images", {
              validate: (files) =>
                (files && files.length === 4) ||
                "You must upload only 4 images.",
            })}
          />

          <div
            className={`w-full border-2 border-dashed rounded-xl p-4 transition-colors ${
              errors.images
                ? "border-red-300 bg-red-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <div className="flex flex-wrap gap-4">
              {/* Render Previews */}
              {previews.map((img, index) => (
                <div key={img.id} className="relative w-24 h-24 group">
                  <img
                    src={img.url}
                    alt="preview"
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-md hover:bg-red-50 transition-all border border-gray-200"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
              ))}

              {getValues("images")?.length < 4 && (                
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all gap-1"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  <span className="text-[10px] font-medium">Add Photo</span>
                </button>
              )}
            </div>

            {/* The Real File Input (Hidden) */}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>
          {/* Explicit Error Message for Images */}
          {errors.images && (
            <span className="text-xs text-red-500 font-medium">
              {errors.images.message}
            </span>
          )}
        </div>

        {/* Row 3: Description */}
        <InputField
          label="Mô tả sản phẩm"
          id="description"
          error={errors.description}
        >
          <textarea
            id="description"
            rows="5"
            placeholder="Describe the condition, features, and history of the item..."
            // Note: Removed 'h-10' so rows="5" actually works
            className={`${inputClasses} resize-none`}
            {...register("description", {
              required: false,
            })}
          />
        </InputField>

        {/* Submit Button */}
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            Post Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductPosting;
