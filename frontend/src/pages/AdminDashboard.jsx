import { useState } from "react";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import UserManagement from "../components/admin/UserManagement";
import CategoryManagement from "../components/admin/CategoryManagement";
import ProductManagement from "../components/admin/ProductManagement";
import RequestManagement from "../components/admin/RequestManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

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
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
