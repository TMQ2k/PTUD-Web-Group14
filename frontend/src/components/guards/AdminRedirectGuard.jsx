import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Guard component để redirect admin về /admin
 * Nếu user có role = 'admin' và đang truy cập trang không phải /admin
 * → Tự động chuyển hướng về /admin
 */
const AdminRedirectGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userData } = useSelector((state) => state.user);

  useEffect(() => {
    // Kiểm tra nếu user đã login và có role = 'admin'
    if (isLoggedIn && userData?.role === "admin") {
      // Nếu đang ở trang không phải /admin/* → redirect
      if (!location.pathname.startsWith("/admin")) {
        console.log(
          "🔒 Admin không được truy cập trang này. Redirecting to /admin..."
        );
        navigate("/admin", { replace: true });
      }
    }
  }, [isLoggedIn, userData, location.pathname, navigate]);

  // Render children bình thường
  return <>{children}</>;
};

export default AdminRedirectGuard;
