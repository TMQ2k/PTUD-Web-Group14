import { useState, useEffect } from "react";
import { IoLogoPolymer } from "react-icons/io";
import {
  FaSearch,
  FaChevronDown,
  FaRegHeart,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdPersonOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CategorySlider from "../layouts/CategorySlider";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useDispatch, useSelector } from "react-redux";
import { logout, loginSuccess } from "../../store/userSlice";
import { authStorage } from "../../utils/auth";
import { userApi } from "../../api/user.api";
import { HandCoins, Package } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import AddProductButton from "./AddProductButton";

export default function Header() {
  const dispatch = useDispatch();
  const [showCats, setShowCats] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { isLoggedIn, userData } = useSelector((state) => state.user);

  // ✅ Restore session khi app load (check token và fetch profile)
  useEffect(() => {
    const restoreSession = async () => {
      // Nếu đã logged in trong Redux, không cần làm gì
      if (isLoggedIn) return;

      // Check có token không
      const token = authStorage.getToken();
      if (!token) return;

      try {
        console.log("🔄 Restoring session from token...");

        // Fetch user profile từ API
        const response = await userApi.getProfile();
        const userProfile = response.data;

        // Cập nhật Redux state
        dispatch(
          loginSuccess({
            id: userProfile.user_id,
            name:
              `${userProfile.first_name || ""} ${
                userProfile.last_name || ""
              }`.trim() || "User",
            email: userProfile.email,
            role: userProfile.role || "bidder",
            avatar: userProfile.avatar_url,
            qr_url: userProfile.qr_url,
          })
        );
      } catch (error) {
        console.error("❌ Failed to restore session:", error);
        // Token không hợp lệ hoặc hết hạn → xóa đi
        authStorage.removeToken();
      }
    };

    restoreSession();
  }, [isLoggedIn, dispatch]);

  // Đóng overlay bằng ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowCats(false);
        setShowUserMenu(false);
        setShowLoginModal(false);
        setShowRegisterModal(false);
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
    // Không cần xóa localStorage vì không dùng nữa
    authStorage.removeToken();
    dispatch(logout());
    setShowUserMenu(false);
    // KHÔNG cần window.location.reload() - UI tự động cập nhật
    // Optional: Redirect về trang chủ sau logout
    navigate("/");
  };

  // Handle switch between login/register modals
  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex items-center gap-5 py-3 px-4 md:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 focus:outline-none"
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
          <form
            onSubmit={handleSearch}
            className="relative w-full bg-gray-100 rounded-md md:rounded-lg"
          >
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600/75 pointer-events-none w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm đấu giá..."
              className="w-full pl-10 pr-4 h-12 md:h-[52px] bg-transparent placeholder-gray-400 text-gray-800 focus:outline-blue-500 rounded-md md:rounded-lg"
            />
          </form>
        </div>

        {/* Login + Heart + Register (guest) hoặc Avatar (logged in) */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <Link
            to="/watchlist"
            className="p-2 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all relative group"
            aria-label="Danh sách yêu thích"
            title="Danh sách yêu thích"
          >
            <FaRegHeart className="size-6 text-blue-600 group-focus:fill-red-500 group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
          </Link>
          <Link
            to="/productcheckout"
            className="p-2 rounded-lg hover:bg-green-100 focus:outline-none focus:text-green-600 focus:ring-2 focus:ring-green-500 transition-all relative group"
            aria-label="Danh sách yêu thích"
            title="Danh sách yêu thích"
          >
            <Package className="size-6 text-blue-600 group-hover:text-green-600 group-focus:text-green-600 group-active:text-green-600"/>
          </Link>

          {!isLoggedIn ? (
            // Hiển thị nút đăng nhập/đăng ký khi chưa login
            <>
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                <MdPersonOutline className="w-5 h-5" />
                Đăng nhập
              </button>

              <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium bg-linear-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-700 transition-colors"
              >
                Đăng ký
              </button>
            </>
          ) : (
            // Hiển thị giỏ hàng, avatar và dropdown khi đã login
            <>
              {userData.role === "seller" && 
                 (<AddProductButton />)                  
                //: (<Link
                //     to="/guide"
                //     className="font-medium bg-linear-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent 
                //                hover:opacity-80 transition-all text-[16px]"
                //   >
                //     Cách thao tác trên website
                //   </Link>)
              }
              
              <div className="relative user-menu-container">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="User menu"
                >
                  <img
                    src={
                      userData?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        userData?.name || "User"
                      )}&size=128&background=4F46E5&color=fff`
                    }
                    alt={userData?.name || "User"}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        userData?.name?.charAt(0) || "U"
                      )}&background=4F46E5&color=fff`;
                    }}
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
                        <p className="font-semibold text-gray-800 truncate">
                          {userData?.name || "User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {userData?.email || "user@example.com"}
                        </p>
                        {userData?.role && (
                          <p className="text-xs text-indigo-600 font-bold mt-1 capitalize">
                            {userData.role === "seller" ? (
                              <div className="flex flex-row gap-1">
                                <HandCoins className="inline-block w-4 h-4 mb-0.5" />
                                Seller
                              </div>
                            ) : (
                              <div className="flex flex-row gap-1">
                                <ShoppingCart className="inline-block w-4 h-4 mb-0.5" />
                                Bidder
                              </div>
                            )}
                          </p>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
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
                onClose={() => setShowCats(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Login Modal ===== */}
      <LoginForm
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />

      {/* ===== Register Modal ===== */}
      <RegisterForm
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </header>
  );
}
