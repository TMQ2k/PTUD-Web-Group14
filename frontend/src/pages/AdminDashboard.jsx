import { useState, useEffect } from "react";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import UserManagement from "../components/admin/UserManagement";
import CategoryManagement from "../components/admin/CategoryManagement";
import ProductManagement from "../components/admin/ProductManagement";
import RequestManagement from "../components/admin/RequestManagement";
import { adminApi } from "../api/admin.api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  // Fetch pending requests count để hiển thị badge
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await adminApi.getUpgradeRequests();
        const pendingCount = response.data.filter(
          (req) => req.status === "pending"
        ).length;
        setPendingRequestsCount(pendingCount);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };
    fetchPendingRequests();

    // Refresh count mỗi 30 giây
    const interval = setInterval(fetchPendingRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshPendingCount = async () => {
    try {
      const response = await adminApi.getUpgradeRequests();
      const pendingCount = response.data.filter(
        (req) => req.status === "pending"
      ).length;
      setPendingRequestsCount(pendingCount);
    } catch (error) {
      console.error("Error refreshing pending requests:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />;
      case "categories":
        return <CategoryManagement />;
      case "products":
        return <ProductManagement />;
      case "requests":
        return <RequestManagement onRequestUpdated={refreshPendingCount} />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <AdminHeader />

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingRequestsCount={pendingRequestsCount}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
