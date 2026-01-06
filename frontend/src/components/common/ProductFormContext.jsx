import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { useEffect, useState, useRef, forwardRef } from "react";
import { convert } from "../../utils/NumberHandler";
import InputField from "./InputField";
import CategorySelector from "./CategorySelector";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { registerLocale } from "react-datepicker";

registerLocale("vi", vi);

// Custom DateTimeInput giữ nguyên UI như datetime-local
const DateTimeInput = forwardRef(
  ({ value, onClick, onChange, className, placeholder }, ref) => (
    <input
      ref={ref}
      type="text"
      value={value || ""}
      onClick={onClick}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      readOnly
    />
  )
);
DateTimeInput.displayName = "DateTimeInput";

const ProductFormContext = ({
  label,
  buttonLabel,
  onSubmit,
  sellerExpiredTime,
  createdDate,
  defaultCategories,
  setQuillContents,
}) => {
  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
    trigger,
    formState: { isSubmitting },
  } = useFormContext();

  const [descCount, setDescCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const max = 400;

  // Watch the images field so we can show the count (e.g., "2/4")
  const currentImages = watch("images");

  const datePickerRef = useRef(null);

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

  // Watch categories to update UI
  const currentCategories = getValues("categories");
  //console.log(currentCategories);

  // Toggle Logic: Add if missing, Remove if present
  const handleCategoryToggle = (catId) => {
    const current = currentCategories || [];
    let updated;

    if (current.includes(catId)) {
      // Remove it
      updated = current.filter((id) => id !== catId);
    } else {
      // Add it
      updated = [...current, catId];
    }

    setValue("categories", updated);
    trigger("categories"); // Force validation check
  };

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    //["blockquote", "code-block"],
    ["link"],
    //["link", "image", "video", "formula"],

    //[{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    //[{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large"] }], // custom dropdown
    [{ header: [4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];
  const modules = {
    toolbar: toolbarOptions,
  };
  const { quill, quillRef } = useQuill({ modules });

  useEffect(() => {
    if (quill) {
      // 1. Optional: Load initial content if you had any
      // quill.clipboard.dangerouslyPasteHTML('<h1>Initial content</h1>');

      // 2. Listen for changes
      quill.on("text-change", () => {
        // 3. Update parent state immediately
        setQuillContents(JSON.stringify(quill.getContents()));
        //setValue("description", JSON.stringify(quill.getContents()));

        // OR if you decided to switch to HTML string later:
        // setQuillContents(quill.root.innerHTML);
      });
    }
  }, [quill, setQuillContents, setValue]);

  // Common Tailwind classes for all inputs
  const inputClasses =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm placeholder-gray-400";
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 my-10">
      <div className="mb-6 border-b border-gray-200 pb-4 ">
        <h2 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
          {label}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Điền đầy đủ thông tin</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        {/* Row 1: Product Name */}
        <InputField
          label="Tên sản phẩm"
          id="product_name"
          error={errors.product_name}
          note="*"
        >
          <input
            id="product_name"
            type="text"
            placeholder="e.g. Vintage Canon Camera"
            className={inputClasses}
            {...register("product_name", {
              required: "Product name is required",
            })}
          />
        </InputField>

        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold bg-linear-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
            Chọn danh mục{" "}
            <span className="text-red-500 font-normal text-sm">
              (Chọn tối thiểu 1)
            </span>
          </label>

          {/* Register a hidden input so Hook Form knows this field exists */}
          <input
            type="hidden"
            {...register("categories", {
              validate: (val) =>
                (val && val.length > 0) ||
                "Please select at least one category",
            })}
          />

          <CategorySelector
            selected={currentCategories}
            onToggle={handleCategoryToggle}
            error={errors.categories}
            categories={defaultCategories}
          />
        </div>

        {/* Row 2: Grid for Prices (Side by Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Giá khởi điểm (đ)"
            id="starting_price"
            error={errors.starting_price}
            note="*"
          >
            <input
              id="starting_price"
              type="text"
              placeholder="100,000"
              className={inputClasses}
              {...register("starting_price", {
                required: "Starting price is required",
                min: 1,
                onChange: (e) => {
                  setValue("starting_price", convert(e.target.value.trim()));
                },
              })}
            />
          </InputField>

          <InputField
            label="Bước giá (đ)"
            id="step_price"
            error={errors.step_price}
            note="*"
          >
            <input
              id="step_price"
              type="text"
              placeholder="100,000"
              className={inputClasses}
              {...register("step_price", {
                required: "Step price is required",
                min: 1,
                onChange: (e) => {
                  setValue("step_price", convert(e.target.value.trim()));
                },
              })}
            />
          </InputField>

          <InputField
            label="Giá mua ngay (đ)"
            id="buy_now_price"
            error={errors.buy_now_price}
            className="col-span-2"
            note="(Tuỳ chọn)"
            noteClassName="text-green-500"
          >
            <input
              id="buy_now_price"
              type="text"
              placeholder="100,000"
              className={inputClasses}
              {...register("buy_now_price", {
                required: false,
                min: 1,
                // --- NEW VALIDATION LOGIC START ---
                validate: (value) => {
                  // 1. If empty (optional), skip validation
                  if (!value) return true;

                  // 2. Get current starting price
                  const startPriceVal = getValues("starting_price");

                  // 3. Helper to clean string (e.g., "100,000" -> 100000) for comparison
                  const parseNumber = (v) => {
                    if (!v) return 0;
                    if (typeof v === "number") return v;
                    return Number(v.toString().replace(/[^0-9]/g, ""));
                  };

                  const buyNow = parseNumber(value);
                  const start = parseNumber(startPriceVal);

                  // 4. Compare
                  return (
                    buyNow > start || "Giá mua ngay phải lớn hơn giá khởi điểm"
                  );
                },
                // --- NEW VALIDATION LOGIC END ---
                onChange: (e) => {
                  setValue("buy_now_price", convert(e.target.value.trim()));
                  // Optional: Trigger validation immediately when typing
                  trigger("buy_now_price");
                },
              })}
            />
          </InputField>
        </div>

        {/* Row 3: Date & Category (New Grid) */}

        {/* === THE NEW DATE FIELD === */}
        <InputField
          label="Ngày kết thúc"
          id="end_date"
          error={errors.end_date}
          note="*"
        >
          <input
            type="hidden"
            {...register("end_date", {
              required: "Please select an end date",
              validate: (value) => {
                if (!value) return "Please select an end date";
                const selectedDate = new Date(value);
                const today = new Date();
                return selectedDate > today || "Date must be in the future";
              },
            })}
          />
          <div className="relative w-full">
            <DatePicker
              locale={vi}
              ref={datePickerRef}
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                if (date) {
                  setValue("end_date", date.toISOString());
                  trigger("end_date");
                } else {
                  setValue("end_date", "");
                  trigger("end_date");
                }
              }}
              onBlur={() => trigger("end_date")}
              onInputClick={() => setIsCalendarOpen(false)}
              onClickOutside={() => setIsCalendarOpen(false)}
              open={isCalendarOpen}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              minDate={createdDate || new Date()}
              maxDate={sellerExpiredTime}
              placeholderText="dd/mm/yyyy --:--"
              wrapperClassName="w-full"
              customInput={
                <DateTimeInput
                  className={twMerge(
                    inputClasses,
                    "text-indigo-700 font-semibold pr-12"
                  )}
                />
              }
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsCalendarOpen(!isCalendarOpen);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-blue-50 rounded transition-colors z-10 pointer-events-auto"
            >
              <Calendar className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </InputField>

        {/* === SECTION: IMAGE UPLOAD === */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-base font-semibold bg-linear-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
              {"Ảnh sản phẩm" + " "}
              <span className="text-red-500">*</span>
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
                  className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex 
                             flex-col items-center justify-center text-gray-400 
                             hover:border-blue-500 hover:text-blue-500 hover:bg-linear-to-br 
                             hover:from-blue-200 hover:to-purple-200 transition-all gap-1"
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
        {/* <InputField
          label="Mô tả sản phẩm"
          id="description"
          error={errors.description}
          note="(Tuỳ chọn)"
          noteClassName="text-green-500"
        >
          <div className="text-gray-400 font-semibold">
            {descCount}/<span className="text-blue-500">{max}</span>
          </div>
          <textarea
            id="description"
            rows="5"
            placeholder="Describe the condition, features, and history of the item..."
            // Note: Removed 'h-10' so rows="5" actually works
            className={`${inputClasses} resize-none`}
            maxLength={max}
            {...register("description", {
              required: false,
              onChange: (e) => {
                const length = e.target.value.length;
                setDescCount(length);
              },
            })}
          />
        </InputField> */}

        <InputField
          label="Mô tả sản phẩm"
          id="description"
          error={errors.description}
          note="(Tuỳ chọn)"
          noteClassName="text-green-500"
        >
          <div
            id="description"
            ref={quillRef}
            style={{
              width: "100%",
              height: 200,
              border: "2px solid blue",
              borderRadius: "5px",
            }}
          ></div>
        </InputField>

        {/* Submit Button */}
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium 
                        rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95
                        disabled:bg-blue-300 disabled:cursor-not-allowed`}
          >
            {buttonLabel}
            {isSubmitting ? "..." : ""}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormContext;
