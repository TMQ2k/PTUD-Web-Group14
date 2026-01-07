import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import electronicsIm from "../../assets/electronics.jpg";
import { categoryApi } from "../../api/category.api";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategories,
  setCategoriesLoading,
  setCategoriesError,
} from "../../store/categoriesSlice";

const DEFAULT_COLORS = [
  // Amber
  "bg-gradient-to-r from-amber-50 to-amber-100",
  "bg-gradient-to-r from-amber-100 to-amber-200",
  "bg-gradient-to-r from-amber-200 to-amber-300",
  "bg-gradient-to-r from-amber-50 to-amber-200",
  "bg-gradient-to-r from-amber-100 to-amber-300",

  // Yellow
  "bg-gradient-to-r from-yellow-50 to-yellow-100",
  "bg-gradient-to-r from-yellow-100 to-yellow-200",
  "bg-gradient-to-r from-yellow-200 to-yellow-300",
  "bg-gradient-to-r from-yellow-50 to-yellow-200",
  "bg-gradient-to-r from-yellow-100 to-yellow-300",

  // Orange
  "bg-gradient-to-r from-orange-50 to-orange-100",
  "bg-gradient-to-r from-orange-100 to-orange-200",
  "bg-gradient-to-r from-orange-200 to-orange-300",
  "bg-gradient-to-r from-orange-50 to-orange-200",
  "bg-gradient-to-r from-orange-100 to-orange-300",

  // Lime
  "bg-gradient-to-r from-lime-50 to-lime-100",
  "bg-gradient-to-r from-lime-100 to-lime-200",
  "bg-gradient-to-r from-lime-200 to-lime-300",
  "bg-gradient-to-r from-lime-50 to-lime-200",
  "bg-gradient-to-r from-lime-100 to-lime-300",

  // Green
  "bg-gradient-to-r from-green-50 to-green-100",
  "bg-gradient-to-r from-green-100 to-green-200",
  "bg-gradient-to-r from-green-200 to-green-300",
  "bg-gradient-to-r from-green-50 to-green-200",
  "bg-gradient-to-r from-green-100 to-green-300",

  // Emerald
  "bg-gradient-to-r from-emerald-50 to-emerald-100",
  "bg-gradient-to-r from-emerald-100 to-emerald-200",
  "bg-gradient-to-r from-emerald-200 to-emerald-300",
  "bg-gradient-to-r from-emerald-50 to-emerald-200",
  "bg-gradient-to-r from-emerald-100 to-emerald-300",

  // Teal
  "bg-gradient-to-r from-teal-50 to-teal-100",
  "bg-gradient-to-r from-teal-100 to-teal-200",
  "bg-gradient-to-r from-teal-200 to-teal-300",
  "bg-gradient-to-r from-teal-50 to-teal-200",
  "bg-gradient-to-r from-teal-100 to-teal-300",

  // Cyan
  "bg-gradient-to-r from-cyan-50 to-cyan-100",
  "bg-gradient-to-r from-cyan-100 to-cyan-200",
  "bg-gradient-to-r from-cyan-200 to-cyan-300",
  "bg-gradient-to-r from-cyan-50 to-cyan-200",
  "bg-gradient-to-r from-cyan-100 to-cyan-300",

  // Sky
  "bg-gradient-to-r from-sky-50 to-sky-100",
  "bg-gradient-to-r from-sky-100 to-sky-200",
  "bg-gradient-to-r from-sky-200 to-sky-300",
  "bg-gradient-to-r from-sky-50 to-sky-200",
  "bg-gradient-to-r from-sky-100 to-sky-300",

  // Blue
  "bg-gradient-to-r from-blue-50 to-blue-100",
  "bg-gradient-to-r from-blue-100 to-blue-200",
  "bg-gradient-to-r from-blue-200 to-blue-300",
  "bg-gradient-to-r from-blue-50 to-blue-200",
  "bg-gradient-to-r from-blue-100 to-blue-300",

  // Pink
  "bg-gradient-to-r from-pink-50 to-pink-100",
  "bg-gradient-to-r from-pink-100 to-pink-200",
  "bg-gradient-to-r from-pink-200 to-pink-300",
  "bg-gradient-to-r from-pink-50 to-pink-200",
  "bg-gradient-to-r from-pink-100 to-pink-300",

  // Rose
  "bg-gradient-to-r from-rose-50 to-rose-100",
  "bg-gradient-to-r from-rose-100 to-rose-200",
  "bg-gradient-to-r from-rose-200 to-rose-300",
  "bg-gradient-to-r from-rose-50 to-rose-200",
  "bg-gradient-to-r from-rose-100 to-rose-300",
];

const CategorySlider = ({
  title = "Categories",
  onSelectCategory, // (parent, child?) => void
  onClose,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0); // 0: level 1, 1: level 2
  const [activeParent, setActiveParent] = useState(null); // id của danh mục cha đang chọn

  // ✅ Lấy categories từ Redux store
  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );

  // ✅ Reset state khi mở lại CategorySlider
  useEffect(() => {
    // Reset về trang level 1 mỗi khi component mount
    setPageIndex(0);
    setActiveParent(null);
  }, []); // Chạy một lần khi mount

  // ✅ Fetch categories khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      // Nếu đã có categories trong store, không fetch lại
      if (categories.length > 0) {
        return;
      }

      try {
        dispatch(setCategoriesLoading());

        const response = await categoryApi.getAllCategories();

        // Backend trả về: { code: 200, message: "...", data: [...] }
        const apiCategories = response.data;

        // ✅ Map category_id thành id để phù hợp với frontend
        const mappedCategories = apiCategories.map((cat) => ({
          id: cat.category_id,
          name: cat.name,
          children: cat.children.map((child) => ({
            id: child.category_id,
            name: child.name,
          })),
        }));

        dispatch(setCategories(mappedCategories));
      } catch (error) {
        console.error("❌ Lỗi khi fetch categories:", error);
        dispatch(setCategoriesError(error.message));
      }
    };

    fetchCategories();
  }, [dispatch, categories.length]);

  // ✅ Tìm parent category hiện tại
  const parent = useMemo(
    () => categories.find((cat) => cat.id === activeParent),
    [categories, activeParent]
  );

  // ✅ Random color cho mỗi category
  const randomColor = () => {
    return DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
  };

  // ✅ Animation variants
  const variants = {
    inLeft: { x: -300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    outRight: { x: 300, opacity: 0 },
    inRight: { x: 300, opacity: 0 },
    outLeft: { x: -300, opacity: 0 },
  };

  return (
    <section className="relative w-full">
      {/* Background gradient + soft texture */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.12),transparent_45%),radial-gradient(circle_at_30%_80%,rgba(0,0,0,0.08),transparent_40%)]" />
      </div>

      {/* Content container */}
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {pageIndex === 1 && (
              <button
                className="inline-flex items-center gap-2 text-sm font-medium rounded-lg px-4 py-2 text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => setPageIndex(0)}
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại
              </button>
            )}
            <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow">
              {pageIndex === 0
                ? title
                : categories.find((cat) => cat.id === activeParent)?.name}
            </h2>
          </div>
          {onClose && (
            <button
              aria-label="Đóng"
              onClick={onClose}
              className="text-white/90 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body: thẻ màu giống thiết kế */}
        <div className="relative overflow-hidden">
          {/* Loading state */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
              <p className="text-white mt-4">Đang tải danh mục...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-200 text-lg">❌ Lỗi: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Categories content */}
          {!loading && !error && (
            <AnimatePresence initial={false} mode="wait">
              {/* Level 1 */}
              {pageIndex === 0 && (
                <motion.div
                  key="lv1"
                  initial="inLeft"
                  animate="center"
                  exit="outRight"
                  variants={variants}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        // Luôn slide sang Level 2 (dù có children hay không)
                        setActiveParent(category.id);
                        setPageIndex(1);
                        onSelectCategory?.(category);
                      }}
                      className={`relative flex items-center justify-center w-full h-28 rounded-xl ${randomColor()} shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/60 focus:ring-offset-transparent px-5`}
                    >
                      <span className="text-center text-2xl font-bold text-gray-900 mix-blend-multiply">
                        {category.name}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Level 2 */}
              {pageIndex === 1 && parent && (
                <motion.div
                  key="lv2"
                  initial="inRight"
                  animate="center"
                  exit="outLeft"
                  variants={variants}
                >
                  {/* Kiểm tra nếu không có children → Hiển thị COMING SOON */}
                  {!parent.children || parent.children.length === 0 ? (
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 text-center">
                      <h3 className="text-2xl font-bold text-white">
                        COMING SOON
                      </h3>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {parent.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => {
                            // Navigate đến trang CategoryProducts với categoryId của child
                            navigate(`/category/${child.id}`);
                            onSelectCategory?.(parent, child);
                            // Reset state trước khi đóng
                            setPageIndex(0);
                            setActiveParent(null);
                            onClose?.(); // Đóng CategorySlider sau khi chọn
                          }}
                          className={`relative flex items-center justify-center w-full h-28 rounded-xl ${randomColor()} shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/60 focus:ring-offset-transparent px-5`}
                        >
                          <span className="text-center text-2xl font-bold text-gray-900 mix-blend-multiply">
                            {child.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;
