import { useState, useEffect } from "react";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import UserManagement from "../components/admin/UserManagement";
import CategoryManagement from "../components/admin/CategoryManagement";
import ProductManagement from "../components/admin/ProductManagement";
import RequestManagement from "../components/admin/RequestManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  // TODO: Fetch pending requests count when RequestManagement API is ready
  useEffect(() => {
    // Placeholder for future implementation
    // const fetchPendingRequests = async () => {
    //   try {
    //     const response = await adminApi.getPendingRequestsCount();
    //     setPendingRequestsCount(response.data.count);
    //   } catch (error) {
    //     console.error("Error fetching pending requests:", error);
    //   }
    // };
    // fetchPendingRequests();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />;
      case "categories":
        return <CategoryManagement />;
      case "products":
        return <ProductManagement />;
      case "requests":
        return <RequestManagement />;
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
