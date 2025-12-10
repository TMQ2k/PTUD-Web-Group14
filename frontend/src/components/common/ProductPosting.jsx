// import { useForm } from "react-hook-form";
// import { twMerge } from "tailwind-merge";
// import { useSelector } from "react-redux";
// import { productApi } from "../../api/product.api";
// import { useEffect, useState, useRef, useCallback } from "react";
// import { convert, parseIntFromCurrency } from "../../utils/NumberHandler";
// import { categoryApi } from "../../api/category.api";
// import { sellerApi } from "../../api/seller.api";
// import InputField from "./InputField";
// import CategorySelector from "./CategorySelector";

// // --- 1. The Reusable Multi-Select Component ---


// const ProductPosting = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     setValue,
//     trigger,
//     getValues,
//   } = useForm({
//     defaultValues: {
//       images: [],
//       categories: [],
//     },
//   });

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sellerStartTime, setSellerStartTime] = useState(null);
//   const currentDateTime = new Date(Date.now());

//   const onSubmit = (data) => {    
//     //console.log(JSON.stringify(getValues("images")));
//     const formData = FormData();
//     const product_data = {
      
//     }
//   };

//   // Watch the images field so we can show the count (e.g., "2/4")
//   const currentImages = watch("images");

//   // Local state for Preview URLs (visual only)
//   const [previews, setPreviews] = useState([]);
//   const fileInputRef = useRef(null);

//   // 1. Handle File Selection
//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;

//     // Generate Previews
//     const newPreviews = files.map((file) => ({
//       id: crypto.randomUUID(),
//       url: URL.createObjectURL(file),
//       file, // Keep original file for the form
//     }));

        
//     // Update Local State (Visuals)
//     setPreviews((prev) => [...prev, ...newPreviews]);

//     // Update Form Data (Logic)
//     const updatedFiles = [...(currentImages || []), ...files];
//     setValue("images", updatedFiles);

//     // Trigger validation immediately to remove error if they reached 4
//     trigger("images");

//     // Reset input so user can select same file again if needed
//     e.target.value = "";
//   };

//   // 2. Handle Removal
//   const removeImage = (indexToRemove) => {
//     // Revoke URL to prevent memory leak
//     URL.revokeObjectURL(previews[indexToRemove].url);

//     // Update Visuals
//     setPreviews((prev) => prev.filter((_, i) => i !== indexToRemove));

//     // Update Form Data
//     const updatedFiles = currentImages.filter((_, i) => i !== indexToRemove);
//     setValue("images", updatedFiles);

//     // Trigger validation to show error if they drop below 4
//     trigger("images");
//   };

//   // 3. Cleanup memory on unmount
//   useEffect(() => {
//     return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
//   }, [previews]);

//   useEffect(() => {
//     let isMounted = true;
//     const loadCategories = async () => {
//       setLoading(true);

//       try {
//         const response = await categoryApi.getAllCategories();
//         const sellerRespone = await sellerApi.getSellerStartTime();
//         if (isMounted) {
//           setCategories(response.data.flatMap((parent) => parent.children));
//           const rawtime = sellerRespone?.data?.fnc_get_seller_start_time;
//           const datetime = new Date(rawtime);
//           datetime.setDate(datetime.getDate() + 7);
//           setSellerStartTime(datetime);
//         }
//       } catch (error) {
//         if (isMounted) {
//           setError(error);
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     loadCategories();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Watch categories to update UI
//   const currentCategories = watch("categories");

//   // Toggle Logic: Add if missing, Remove if present
//   const handleCategoryToggle = (catId) => {
//     const current = currentCategories || [];
//     let updated;

//     if (current.includes(catId)) {
//       // Remove it
//       updated = current.filter((id) => id !== catId);
//     } else {
//       // Add it
//       updated = [...current, catId];
//     }

//     setValue("categories", updated);
//     trigger("categories"); // Force validation check
//   };

//   // Common Tailwind classes for all inputs
//   const inputClasses =
//     "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400";
//   return (
//     <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 my-10">
//       <div className="mb-6 border-b border-gray-200 pb-4 ">
//         <h2 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
//           Post new product
//         </h2>
//         <p className="text-sm text-gray-500 mt-1">
//           Fill in the details to post your product for auction.
//         </p>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
//         {/* Row 1: Product Name */}
//         <InputField
//           label="Tên sản phẩm"
//           id="product_name"
//           error={errors.productName}
//         >
//           <input
//             id="product_name"
//             type="text"
//             placeholder="e.g. Vintage Canon Camera"
//             className={inputClasses}
//             {...register("productName", {
//               required: "Product name is required",
//             })}
//           />
//         </InputField>

//         <div className="flex flex-col gap-2">
//           <label className="text-base font-semibold bg-linear-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
//             Chọn danh mục{" "}
//             <span className="text-gray-400 font-normal">(Pick at least 1)</span>
//           </label>

//           {/* Register a hidden input so Hook Form knows this field exists */}
//           <input
//             type="hidden"
//             {...register("categories", {
//               validate: (val) =>
//                 (val && val.length > 0) ||
//                 "Please select at least one category",
//             })}
//           />

//           <CategorySelector
//             selected={currentCategories}
//             onToggle={handleCategoryToggle}
//             error={errors.categories}
//             categories={categories}
//           />
//         </div>

//         {/* Row 2: Grid for Prices (Side by Side) */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <InputField
//             label="Giá khởi điểm (đ)"
//             id="starting_price"
//             error={errors.startingPrice}
//           >
//             <input
//               id="starting_price"
//               type="text"
//               placeholder="100,000"
//               className={inputClasses}
//               {...register("startingPrice", {
//                 required: "Starting price is required",
//                 min: 1,
//                 onChange: (e) => {
//                   setValue("startingPrice", convert(e.target.value.trim()));
//                 },
//               })}
//             />
//           </InputField>

//           <InputField
//             label="Bước giá (đ)"
//             id="step_price"
//             error={errors.stepPrice}
//           >
//             <input
//               id="step_price"
//               type="text"
//               placeholder="100,000"
//               className={inputClasses}
//               {...register("stepPrice", {
//                 required: "Step price is required",
//                 min: 1,
//                 onChange: (e) => {
//                   setValue("stepPrice", convert(e.target.value.trim()));
//                 },
//               })}
//             />
//           </InputField>
//         </div>

//         {/* Row 3: Date & Category (New Grid) */}

//         {/* === THE NEW DATE FIELD === */}
//         <InputField
//           label="Ngày kết thúc"
//           id="end_date"
//           error={errors.endDate}
//         >
//           <input
//             id="end_date"
//             type="datetime-local"
//             //value={getValues("endDate")}                        
//             min={currentDateTime?.toISOString().slice(0, 16)}
//             max={sellerStartTime?.toISOString().slice(0, 16)}
//             className={twMerge(inputClasses, "text-indigo-700 font-semibold")}
//             {...register("endDate", {
//               required: "Please select an end date",
//               validate: (value) => {
//                 const selectedDate = new Date(value);
//                 const today = new Date();
//                 return selectedDate > today || "Date must be in the future";
//               },
              
//             })}
//           />
//         </InputField>

//         {/* === SECTION: IMAGE UPLOAD === */}
//         <div className="flex flex-col gap-2">
//           <div className="flex justify-between items-center">
//             <label className="text-base font-semibold bg-linear-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
//               Ảnh sản phẩm
//             </label>
//             <span
//               className={`text-xs font-medium ${
//                 currentImages?.length >= 4 ? "text-green-600" : "text-gray-400"
//               }`}
//             >
//               {currentImages?.length || 0} / 4 required
//             </span>
//           </div>

//           {/* Custom Register for Validation Only - hidden input trick */}
//           <input
//             type="hidden"
//             {...register("images", {
//               validate: (files) =>
//                 (files && files.length === 4) ||
//                 "You must upload only 4 images.",
//             })}
//           />

//           <div
//             className={`w-full border-2 border-dashed rounded-xl p-4 transition-colors ${
//               errors.images
//                 ? "border-red-300 bg-red-50"
//                 : "border-gray-300 bg-gray-50"
//             }`}
//           >
//             <div className="flex flex-wrap gap-4">
//               {/* Render Previews */}
//               {previews.map((img, index) => (
//                 <div key={img.id} className="relative w-24 h-24 group">
//                   <img
//                     src={img.url}
//                     alt="preview"
//                     className="w-full h-full object-cover rounded-lg border border-gray-200"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(index)}
//                     className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-md hover:bg-red-50 transition-all border border-gray-200"
//                   >
//                     <svg
//                       className="w-3 h-3"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="3"
//                         d="M6 18L18 6M6 6l12 12"
//                       ></path>
//                     </svg>
//                   </button>
//                 </div>
//               ))}

//               {getValues("images")?.length < 4 && (
//                 <button
//                   type="button"
//                   onClick={() => fileInputRef.current.click()}
//                   className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all gap-1"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M12 4v16m8-8H4"
//                     ></path>
//                   </svg>
//                   <span className="text-[10px] font-medium">Add Photo</span>
//                 </button>
//               )}
//             </div>

//             {/* The Real File Input (Hidden) */}
//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               className="hidden"
//               ref={fileInputRef}
//               onChange={handleImageUpload}
//             />
//           </div>
//           {/* Explicit Error Message for Images */}
//           {errors.images && (
//             <span className="text-xs text-red-500 font-medium">
//               {errors.images.message}
//             </span>
//           )}
//         </div>

//         {/* Row 3: Description */}
//         <InputField
//           label="Mô tả sản phẩm"
//           id="description"
//           error={errors.description}
//         >
//           <textarea
//             id="description"
//             rows="5"
//             placeholder="Describe the condition, features, and history of the item..."
//             // Note: Removed 'h-10' so rows="5" actually works
//             className={`${inputClasses} resize-none`}
//             {...register("description", {
//               required: false,
//             })}
//           />
//         </InputField>

//         {/* Submit Button */}
//         <div className="mt-4 flex justify-end">
//           <button
//             type="submit"
//             className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95"
//           >
//             Post Product
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProductPosting;

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import ProductFormContext from "./ProductFormContext";
import { categoryApi } from "../../api/category.api";
import { sellerApi } from "../../api/seller.api";
import { productApi } from "../../api/product.api";
import { BlinkBlur } from "react-loading-indicators";
import { parseIntFromCurrency } from "../../utils/NumberHandler";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ProductPosting = () => {
  const [systemCategories, setSystemCategories] = useState([]);
  const [sellerExpiredDate, setSellerExpiredDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const createdDate = new Date(Date.now());

  const [posted, setPosted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const parentCategoriesRes = await categoryApi.getAllCategories();
        const sellerRes = await sellerApi.getSellerStartTime();

        if (isMounted) {
          const parentCategoriesData = parentCategoriesRes?.data;
          const sellerData = sellerRes?.data;
          //console.log(parentCategoriesRes);
          //console.log(parentCategoriesData);
          setSystemCategories(parentCategoriesData?.flatMap((parent) => parent.children));
          const rawtime = sellerData?.fnc_get_seller_start_time;
          const datetime = new Date(rawtime);
          datetime.setDate(datetime.getDate() + 7);
          setSellerExpiredDate(datetime);
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
    };

    loadData();

    return () => {
      isMounted = false;
    }
  }, [])

  const methods = useForm({
    defaultValues: {
      product_name: "",
      categories: [],
      starting_price: 0,
      step_price: 0,
      buy_now_price: null,
      end_date: null,
      images: [],
      description: "",
    },    
  });

  const onSubmit = (data) => {
    //console.log(new Date(data.end_date).toISOString());
    const formData = new FormData();
    const productPayload = {
      product_name: data.product_name,
      category_ids: data.categories,
      starting_price: parseIntFromCurrency(data.starting_price),
      step_price: parseIntFromCurrency(data.step_price),   
      buy_now_price: data.buy_now_price ? parseIntFromCurrency(data.step_price) : null,
      end_date: new Date(data.end_date).toISOString(),
      //images: data.images,
      description: data.description,
    }

    if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach((imageFile) => {
            // "images" is the key name the backend looks for (e.g. req.files['images'])
            formData.append("images", imageFile); 
        });
    }

    //console.log(formData.get("images"));
    //Array.from(formData.getAll("images")).forEach((image) => console.log(image));
    console.log(formData.getAll("images"));

    formData.append("product_payload", JSON.stringify(productPayload));
    console.log(formData.get("product_payload"));

    //productApi.postProduct(formData);
    setPosted(true);
  }

  return (
    <>
      {loading && (
      <div className="h-screen w-full flex items-center justify-center">
          <BlinkBlur color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
        </div>
      )}
      {error && <div className="text-4xl font-semibold text-red-500">{error}</div>}
      {!loading && !error && (
        posted ? (
          <div className="max-w-2xl mx-auto p-8 my-8 bg-white rounded-xl shadow-sm border border-gray-100 text-center animate-fade-in-up">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-50 p-4">
                <CheckCircle className="w-16 h-16 text-green-500" strokeWidth={1.5} />
              </div>
            </div>

            {/* Main Heading */}
            <h2 className="text-2xl font-bold text-blue-600 mb-2">
              Đăng bán thành công!
            </h2>

            {/* Subtext */}
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Sản phẩm <span className="font-semibold text-gray-700">"{methods.getValues("product_name")}"</span> của bạn đã được niêm yết và hiển thị với người mua.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {/* Primary Action: View the new product */}
              {/* <Link 
                to="/products/latest" 
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm focus:ring-4 focus:ring-blue-100"
              >
                Xem bài đăng
              </Link> */}

              {/* Secondary Action: Post another or Go Home */}
              <button
                onClick={() => {
                  setPosted(false);
                  methods.reset();
                }}
                className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-linear-to-r
                         hover:from-blue-400 hover:to-purple-600 hover:text-white 
                         text-gray-700 font-medium rounded-lg transition-all duration-400
                         hover:scale-102 active:scale-98 hover:shadow-2xl"
              >
                Đăng sản phẩm khác
              </button>
            </div>
            
            {/* Optional: Return to home link */}
            <div className="mt-6">
              <Link to="/" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
                  Về trang chủ
              </Link>
            </div>
          </div>
        ) : (
        <FormProvider {...methods}>
          <ProductFormContext 
            label="Đăng bán sản phẩm"
            buttonLabel="Đăng sản phẩm"
            onSubmit={methods.handleSubmit(onSubmit)}
            sellerExpiredTime={sellerExpiredDate}
            createdDate={createdDate}
            defaultCategories={systemCategories}
            />
        </FormProvider>
      ))}
    </>
  );
};

export default ProductPosting;