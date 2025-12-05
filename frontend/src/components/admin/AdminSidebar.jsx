import { Users, FolderTree, Package, FileText } from "lucide-react";

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  pendingRequestsCount = 0,
}) => {
  const menuItems = [
    {
      key: "users",
      label: "Quản lý Users",
      icon: Users,
      description: "Bidder & Seller",
    },
    {
      key: "categories",
      label: "Quản lý Categories",
      icon: FolderTree,
      description: "Danh mục sản phẩm",
    },
    {
      key: "products",
      label: "Quản lý Products",
      icon: Package,
      description: "Sản phẩm đấu giá",
    },
    {
      key: "requests",
      label: "Quản lý Requests",
      icon: FileText,
      description: "Yêu cầu nâng cấp",
      badge: pendingRequestsCount,
    },
  ];

  return (
    <aside className="w-72 bg-white shadow-lg h-full">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">
          Bảng điều khiển
        </h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-start gap-3 p-4 rounded-lg transition-all duration-200 relative ${
                  isActive
                    ? "bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mt-0.5 shrink-0 ${
                    isActive ? "text-white" : "text-gray-600"
                  }`}
                />
                <div className="text-left flex-1">
                  <p
                    className={`font-medium ${
                      isActive ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`text-xs ${
                      isActive ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
                {/* Badge for pending requests */}
                {item.badge > 0 && (
                  <span className="absolute top-2 right-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-600 rounded-full animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
