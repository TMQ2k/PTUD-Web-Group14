import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import electronicsIm from "../../assets/electronics.jpg";

const DEFAULT_COLORS = [
  "bg-gradient-to-r from-slate-100 to-gray-200",
  "bg-gradient-to-r from-gray-100 to-gray-300",
  "bg-gradient-to-r from-stone-100 to-stone-300",
  "bg-gradient-to-r from-zinc-100 to-neutral-200",
  "bg-gradient-to-r from-amber-100 to-amber-200",
  "bg-gradient-to-r from-rose-100 to-rose-200",
  "bg-gradient-to-r from-orange-100 to-orange-200",
  "bg-gradient-to-r from-yellow-100 to-yellow-200",
  "bg-gradient-to-r from-lime-100 to-lime-200",
  "bg-gradient-to-r from-green-100 to-emerald-200",
  "bg-gradient-to-r from-cyan-100 to-sky-200",
  "bg-gradient-to-r from-blue-100 to-indigo-200",
  "bg-gradient-to-r from-indigo-100 to-violet-200",
  "bg-gradient-to-r from-purple-100 to-fuchsia-200",
  "bg-gradient-to-r from-pink-100 to-rose-200",
  "bg-gradient-to-r from-teal-100 to-emerald-200",
  "bg-gradient-to-r from-neutral-100 to-neutral-300",
  "bg-gradient-to-r from-slate-200 to-gray-300",
  "bg-gradient-to-r from-stone-200 to-gray-300",
  "bg-gradient-to-r from-zinc-200 to-neutral-300",
];

const SAMPLE_CATEGORIES = [
  {
    id: "electronics",
    name: "Điện tử",
    image: electronicsIm,
    children: [
      { id: "phones", name: "Điện thoại di động" },
      { id: "laptops", name: "Máy tính xách tay" },
    ],
  },
  {
    id: "fashion",
    name: "Thời trang",
    image: "https://via.placeholder.com/120x120.png?text=F",
    children: [
      { id: "shoes", name: "Giày" },
      { id: "watches", name: "Đồng hồ" },
    ],
  },
  {
    id: "home",
    name: "Nhà cửa & Đời sống",
    image: "https://via.placeholder.com/120x120.png?text=H",
    children: [
      { id: "furniture", name: "Nội thất" },
      { id: "kitchen", name: "Đồ bếp" },
    ],
  },
  {
    id: "sport",
    name: "Thể thao & Du lịch",
    image: "https://via.placeholder.com/120x120.png?text=S",
    children: [
      { id: "gears", name: "Dụng cụ thể thao" },
      { id: "luggage", name: "Vali - Túi du lịch" },
    ],
  },
];

const CategorySlider = ({
  data = SAMPLE_CATEGORIES,
  title = "Categories",
  onSelectCategory, // (parent, child?) => void
  onClose,
}) => {
  const [activeParent, setActiveParent] = useState(null); // id cấp 1
  const [pageIndex, setPageIndex] = useState(0); // 0: cấp 1, 1: cấp 2

  const parent = useMemo(
    () => data.find((d) => d.id === activeParent) || null,
    [activeParent, data]
  );

  const variants = {
    inLeft: { x: -24, opacity: 0 },
    center: { x: 0, opacity: 1, transition: { duration: 0.2 } },
    outRight: { x: 24, opacity: 0, transition: { duration: 0.18 } },
    inRight: { x: 24, opacity: 0 },
    outLeft: { x: -24, opacity: 0, transition: { duration: 0.18 } },
  };

  const randomColor = () => {
    return DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
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
                className="inline-flex items-center gap-1 text-sm rounded border px-2 py-1 text-white/95 border-white/40 hover:bg-white/10"
                onClick={() => setPageIndex(0)}
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại
              </button>
            )}
            <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow">
              {pageIndex === 0 ? title : parent?.name}
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
                {data.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveParent(cat.id);
                      setPageIndex(1);
                      onSelectCategory?.(cat);
                    }}
                    className={`relative flex items-center justify-between w-full h-28 rounded-xl ${randomColor()} shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/60 focus:ring-offset-transparent px-5`}
                  >
                    <span className="text-left text-lg font-semibold text-gray-900 mix-blend-multiply">
                      {cat.name}
                    </span>
                    <span className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
                      {/* hình tròn bên phải */}
                      <img
                        src={cat.image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {parent.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => onSelectCategory?.(parent, child)}
                    className={`relative flex items-center justify-between w-full h-28 rounded-xl ${randomColor()} shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/60 focus:ring-offset-transparent px-5`}
                  >
                    <span className="text-left text-lg font-semibold text-gray-900 mix-blend-multiply">
                      {child.name}
                    </span>
                    <span className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-white/70" />
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;
