import { useState, useEffect } from "react";
import { IoLogoPolymer } from "react-icons/io";
import {
  FaSearch,
  FaChevronDown,
  FaRegHeart,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdPersonOutline, MdOutlineShoppingCart } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CategorySlider from "../layouts/CategorySlider";
import { Navigate } from "react-router-dom";

export default function Header() {
  const [showCats, setShowCats] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  // TODO: Thay thế bằng Redux/Context API của bạn
  // Ví dụ giả lập user đã đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Giả lập user data - Thay bằng logic thực tế từ Redux/Context
  useEffect(() => {
    // Kiểm tra localStorage hoặc Redux store
    const userData = localStorage.getItem("user");
    if (userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Đóng overlay bằng ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowCats(false);
        setShowUserMenu(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Đóng user menu khi click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserMenu && !e.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setShowUserMenu(false);
    navigate("/login");
    // TODO: Thêm logic logout (clear Redux store, redirect, etc.)
  };

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
            className="flex items-center gap-2 font-medium text-indigo-600/80 hover:text-blue-600 transition-colors px-2"
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
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600/75 pointer-events-none w-5 h-5" />
            <input
              type="text"
              placeholder="Search for brand, model, artist..."
              className="w-full pl-10 pr-4 h-12 md:h-[52px] bg-transparent placeholder-gray-400 text-gray-800 focus:outline-blue-500 rounded-md md:rounded-lg"
            />
          </div>
        </div>

        {/* Login + Heart + Register (guest) hoặc Avatar (logged in) */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Yêu thích"
          >
            <FaRegHeart className="w-5 h-5 text-blue-600" />
          </button>

          {!isLoggedIn ? (
            // Hiển thị nút đăng nhập/đăng ký khi chưa login
            <>
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
            </>
          ) : (
            // Hiển thị giỏ hàng, avatar và dropdown khi đã login
            <>
              <Link
                to="/cart"
                className="relative p-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                aria-label="Giỏ hàng"
              >
                <MdOutlineShoppingCart className="w-6 h-6 text-blue-600" />
                {/* Badge số lượng sản phẩm (optional) */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Link>

              <div className="relative user-menu-container">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="User menu"
                >
                  <img
                    src={
                      user?.avatar ||
                      "https://ui-avatars.com/api/?name=" +
                        (user?.name || "User")
                    }
                    alt={user?.name || "User"}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                  <FaChevronDown
                    className={`w-3 h-3 text-gray-600 transition-transform duration-200 ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">
                          {user?.name || "User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <FaUser className="w-4 h-4 text-blue-600" />
                          <span>Trang cá nhân</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FaSignOutAlt className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
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
