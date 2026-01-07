import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

/**
 * Guard component để bảo vệ trang admin
 * - Nếu chưa login → redirect về / (trang chủ)
 * - Nếu không phải admin → redirect về /
 * - Nếu là admin → cho phép truy cập
 */
const AdminOnlyGuard = ({ children }) => {
  const navigate = useNavigate();
  const { isLoggedIn, userData } = useSelector((state) => state.user);

  useEffect(() => {
    // Chưa login → redirect về trang chủ
    if (!isLoggedIn) {
      navigate("/", { replace: true });
      return;
    }

    // Đã login nhưng không phải admin → redirect về home
    if (userData?.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }
  }, [isLoggedIn, userData, navigate]);

  // Nếu chưa login hoặc không phải admin → không render children
  if (!isLoggedIn || userData?.role !== "admin") {
    return null;
  }

  // Render children cho admin
  return <>{children}</>;
};

export default AdminOnlyGuard;
