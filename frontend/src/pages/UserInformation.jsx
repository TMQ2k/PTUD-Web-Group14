import React, { useState } from "react";
import Sidebar from "../components/common/SideBar";
import EditInformation from "../components/common/EditInformation";
import EditAddress from "../components/common/EditAddress";
import MyBiddingProducts from "../components/common/MyBiddingProducts";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const UserInformation = () => {
  const [activeTab, setActiveTab] = useState("account");
  const navigate = useNavigate();

  // Định nghĩa các tab
  const sidebarItems = [
    { key: "account", label: "Tài khoản" },
    { key: "addresses", label: "Địa chỉ" },
    { key: "upgrade", label: "Nâng cấp" },
    { key: "joinedAuctions", label: "Sản phẩm đã tham gia đấu giá" },
    { key: "wonAuctions", label: "Sản phẩm đã thắng đấu giá" },
    {
      key: "sellerActive",
      label: "Sản phẩm đã đăng & còn hạn",
      requiresSeller: true,
    },
    {
      key: "sellerWon",
      label: "Sản phẩm đã có người thắng đấu giá",
      requiresSeller: true,
    },
  ];

  // Badges (chấm đỏ thông báo) - có thể thay đổi động
  const badges = {
    account: false, // true để hiện chấm đỏ
    sellerWon: true,
  };

  // Render nội dung theo tab
  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <EditInformation />;

      case "addresses":
        return <EditAddress />;

      case "upgrade":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-4">Nâng cấp tài khoản</h2>
            <p className="text-gray-600 mb-4">
              Nâng cấp lên tài khoản Seller để bán hàng...
            </p>
            {userRole === "bidder" && (
              <button
                onClick={() => setUserRole("seller")}
                className="bg-linear-to-r from-blue-400 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-500 hover:to-purple-700 transition-all"
              >
                Nâng cấp thành Seller
              </button>
            )}
            {userRole === "seller" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                ✓ Bạn đã là tài khoản Seller
              </div>
            )}
          </div>
        );
      case "joinedAuctions":
        return <MyBiddingProducts />;

      case "wonAuctions":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-4">
              Sản phẩm đã thắng đấu giá
            </h2>
            <p className="text-gray-600">
              Danh sách sản phẩm bạn đã thắng đấu giá...
            </p>
            {/* TODO: Thêm danh sách sản phẩm */}
          </div>
        );

      case "sellerActive":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-4">
              Sản phẩm đã đăng & còn hạn
            </h2>
            <p className="text-gray-600">
              Danh sách sản phẩm đang trong thời gian đấu giá...
            </p>
            {/* TODO: Thêm danh sách sản phẩm */}
          </div>
        );

      case "sellerWon":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-4">
              Sản phẩm đã có người thắng đấu giá
            </h2>
            <p className="text-gray-600">
              Danh sách sản phẩm đã kết thúc đấu giá...
            </p>
            {/* TODO: Thêm danh sách sản phẩm */}
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-500">Vui lòng chọn một mục từ menu</p>
          </div>
        );
    }
  };

  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) {
      navigate("/");
    }
  }, [userData, navigate]);

  const userRole = userData?.role;

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-[64px] font-serif font-black tracking-tight text-black mx-auto max-w-6xl px-8 pt-16 pb-6 border-b border-black bg-white">
        TRANG CÁ NHÂN CỦA BẠN
      </h1>
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 px-8 pt-10 pb-20">
        <Sidebar
          role={userRole}
          items={sidebarItems}
          current={activeTab}
          onSelect={setActiveTab}
          badges={badges}
        />

        {/* Content Area */}
        <main>{renderContent()}</main>
      </div>
    </div>
  );
};

export default UserInformation;
