import { useState, useEffect } from "react";
import { IoLogoPolymer } from "react-icons/io";
import { FaSearch, FaChevronDown, FaRegHeart } from "react-icons/fa";
import { MdPersonOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CategorySlider from "./CategorySlider";

export default function Header() {
  const [showCats, setShowCats] = useState(false);

  // Đóng overlay bằng ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setShowCats(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex items-center gap-5 py-3 px-4 md:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="AuctionHub home"
        >
          <div className="flex items-center justify-center bg-linear-to-r from-blue-400 to-purple-600 text-white p-2.5 rounded-lg shadow-md">
            <IoLogoPolymer className="w-6 h-6" />
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tight text-gray-800">
            AuctionHub
          </span>
        </Link>

        {/* Categories (nút bấm mở overlay) */}
        <div className="hidden md:block">
          <button
            type="button"
            onClick={() => setShowCats(true)}
            className="flex items-center gap-2 font-medium text-gray-800 hover:text-blue-600 transition-colors px-2"
          >
            Categories
            <FaChevronDown
              className={`w-3 h-3 mt-0.5 transition-transform ${
                showCats ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 md:flex-2 lg:flex-3 max-w-[820px]">
          <div className="relative w-full bg-gray-100 rounded-md md:rounded-lg">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none w-5 h-5" />
            <input
              type="text"
              placeholder="Search for brand, model, artist..."
              className="w-full pl-10 pr-4 h-12 md:h-[52px] bg-transparent placeholder-gray-400 text-gray-800 focus:outline-blue-500 rounded-md md:rounded-lg"
            />
          </div>
        </div>

        {/* Login + Heart + Register (guest) */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Yêu thích"
          >
            <FaRegHeart className="w-5 h-5 text-blue-600" />
          </button>

          <Link
            to="/login"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            <MdPersonOutline className="w-5 h-5" />
            Đăng nhập
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium bg-linear-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-700 transition-colors"
          >
            Đăng ký
          </Link>
        </div>
      </div>

      {/* ===== Overlay CategorySlider xuất hiện khi bấm Categories ===== */}
      <AnimatePresence>
        {showCats && (
          <motion.div
            className="fixed inset-0 z-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowCats(false)}
            />

            {/* Panel (giống bố cục bạn thiết kế) */}
            <motion.div
              className="absolute inset-x-0 top-20 mx-auto w-full max-w-6xl px-4"
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ type: "tween", duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CategorySlider
                title="Categories"
                onSelectCategory={(lv1, lv2) => {
                  console.log("Selected:", lv1, lv2);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
