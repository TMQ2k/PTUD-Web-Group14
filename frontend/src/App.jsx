import { useState, useEffect } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayouts from "./components/layouts/MainLayouts";
import Home from "./pages/Home";
import LoadingScreen from "./components/layouts/LoadingScreen";
import RegisterForm from "./components/common/RegisterForm";
import LoginForm from "./components/common/LoginForm";
import UserInformation from "./pages/UserInformation";
import Admin from "./pages/AdminDashboard";
import CategoryProducts from "./pages/CategoryProducts";
import WatchList from "./pages/WatchList";
import ProductDetailPage from "./pages/ProductDetailPage";
import { useDispatch } from "react-redux";
import { authStorage } from "./utils/auth";
import { loginSuccess, logout } from "./store/userSlice";
import { userApi } from "./api/user.api";
import { productApi } from "./api/product.api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductPostingPage from "./pages/ProductPostingPage";
import ProductUpdatingPage from "./pages/ProductUpdatingPage";
import RouterListner from "./hooks/RouterListner";
import { Pen } from "lucide-react";
import AuctionManegementPage from "./pages/AuctionManagementPage";
import ProductCheckoutPage from "./pages/ProductCheckoutPage";
import SearchPage from "./pages/SearchPage";

const App = () => {
  // Mặc định hiển thị overlay nhưng vẫn render Router phía sau
  const [showLoading, setShowLoading] = useState(true);
  const [exiting, setExiting] = useState(false);
  const dispatch = useDispatch();

  const loadDuration = 700;
  const exitDuration = 7000;

  // Deactivate expired products khi app mount và định kỳ mỗi 5 phút
  useEffect(() => {
    const deactivateExpired = async () => {
      try {
        await productApi.deactivateExpiredProducts();
      } catch (error) {
        console.error("Lỗi khi deactivate expired products:", error.message);
      }
    };

    // Gọi ngay khi app load
    deactivateExpired();

    // Gọi lại mỗi 5 phút (300000ms)
    const interval = setInterval(deactivateExpired, 300000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = authStorage.getToken();

      // Không có token → Skip
      if (!token) {
        return;
      }

      try {
        // Gọi API /profile với token
        const response = await userApi.getProfile();
        const userData = response.data;

        const fullName = `${userData.first_name || ""} ${
          userData.last_name || ""
        }`.trim();
        const displayName =
          fullName ||
          userData.name ||
          userData.username ||
          userData.current.username;

        // Lưu vào Redux
        dispatch(
          loginSuccess({
            id: userData.user_id,
            name: displayName,
            username: userData.username,
            email: userData.email,
            role: userData.role,
            avatar: userData.avatar_url,
            qr_url: userData.qr_url,
            rating_percent: userData.rating_percent,
          })
        );

        // ⚠️ Nếu là admin và đang ở trang khác → redirect về /admin
        if (
          userData.role === "admin" &&
          !window.location.pathname.startsWith("/admin")
        ) {
          window.location.replace("/admin");
        }
      } catch (error) {
        console.error("❌ Token không hợp lệ:", error);

        // Token hết hạn hoặc không hợp lệ → Xóa
        authStorage.removeToken();
        dispatch(logout());
      }
    };

    initAuth();

    // Lắng nghe event logout từ http interceptor khi token hết hạn
    const handleAuthLogout = () => {
      dispatch(logout());
    };

    window.addEventListener("auth:logout", handleAuthLogout);

    return () => {
      window.removeEventListener("auth:logout", handleAuthLogout);
    };
  }, [dispatch]);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), loadDuration);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const t2 = setTimeout(() => setShowLoading(false), exitDuration);
    return () => clearTimeout(t2);
  }, [exiting]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Main Routes with Header + Footer */}
        <Route path="/" element={<MainLayouts />}>
          <Route path="register" element={<RegisterForm />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route index element={<Home />} />
          <Route path="profile" element={<UserInformation />} />
          <Route path="category/:categoryId" element={<CategoryProducts />} />
          <Route path="/watchlist" element={<WatchList />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="/productposting" element={<ProductPostingPage />} />
          <Route
            path="/productupdating/:id"
            element={<ProductUpdatingPage />}
          />
          <Route
            path="/auctionmanagement/:id"
            element={<AuctionManegementPage />}
          />
          <Route path="/productcheckout" element={<ProductCheckoutPage />} />
        </Route>

        {/* Admin Routes - Standalone (no MainLayouts) */}
        <Route path="/admin" element={<Admin />} />
      </>
    )
  );

  return (
    <>
      {/* Render nội dung chính NGAY LẬP TỨC để khi overlay fade thì UI đã sẵn sàng */}
      <RouterProvider router={router} />
      <RouterListner />
      {/* Toast notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Overlay loading nằm trên cùng, mờ dần khi exit */}
      {showLoading && (
        <LoadingScreen exiting={exiting} duration={exitDuration} />
      )}
    </>
  );
};

export default App;
