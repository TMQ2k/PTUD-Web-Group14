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
import { useDispatch } from "react-redux";
import { authStorage } from "./utils/auth";
import { loginSuccess, logout } from "./store/userSlice";
import { userApi } from "./api/user.api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  // Mặc định hiển thị overlay nhưng vẫn render Router phía sau
  const [showLoading, setShowLoading] = useState(true);
  const [exiting, setExiting] = useState(false);
  const dispatch = useDispatch();

  const loadDuration = 1600;
  const exitDuration = 7000;

  useEffect(() => {
    const initAuth = async () => {
      const token = authStorage.getToken();

      // Không có token → Skip
      if (!token) {
        console.log("ℹ️ Không có token, user chưa đăng nhập");
        return;
      }

      console.log("🔄 Đang khôi phục thông tin user từ token...");

      try {
        // Gọi API /profile với token
        const response = await userApi.getProfile();
        const userData = response.data;

        console.log("✅ Khôi phục thành công:", userData);

        const fullName = `${userData.first_name || ""} ${
          userData.last_name || ""
        }`.trim();
        const displayName =
          fullName ||
          userData.name ||
          userData.username ||
          user.current.username;

        // Lưu vào Redux
        dispatch(
          loginSuccess({
            id: userData.id,
            name: displayName,
            email: userData.email,
            role: userData.role,
            avatar: userData.avatar_url,
          })
        );
      } catch (error) {
        console.error("❌ Token không hợp lệ:", error);

        // Token hết hạn hoặc không hợp lệ → Xóa
        authStorage.removeToken();
        dispatch(logout());
      }
    };

    initAuth();
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
          <Route index element={<Home />} />
          <Route path="profile" element={<UserInformation />} />
          <Route path="category/:categoryId" element={<CategoryProducts />} />
          <Route path="watchlist" element={<WatchList />} />
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

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
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
