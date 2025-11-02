import React, { useState } from "react";
import { MdPersonOutline } from "react-icons/md";
import { IoLogoPolymer } from "react-icons/io";
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Điện tử",
    children: [{ name: "Điện thoại di động" }, { name: "Máy tính xách tay" }],
  },
  {
    name: "Thời trang",
    children: [{ name: "Giày" }, { name: "Đồng hồ" }],
  },
  {
    name: "Nhà cửa & Đời sống",
    children: [{ name: "Nội thất" }, { name: "Đồ bếp" }],
  },
  {
    name: "Thể thao & Du lịch",
    children: [{ name: "Dụng cụ thể thao" }, { name: "Vali - Túi du lịch" }],
  },
];

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-8">
        {/* Logo */}
        <Link href="#" className="flex items-center space-x-3">
          <div className="flex items-center justify-center bg-linear-to-r from-blue-600 to-indigo-500 text-white p-2.5 rounded-lg shadow-md">
            <IoLogoPolymer className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-800">
            AuctionHub
          </span>
        </Link>

        {/* Menu chính */}
        <nav className="hidden md:flex items-center space-x-8">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setActiveMenu(index)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="flex items-center gap-1 font-medium text-gray-700 hover:text-blue-600 transition-colors">
                {cat.name}
                <FaChevronDown
                  className={`w-3 h-3 mt-1 transition-transform duration-300 ${
                    activeMenu === index ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {activeMenu === index && (
                <div
                  className="absolute left-0 top-full pt-2"
                  onMouseEnter={() => setActiveMenu(index)}
                >
                  <div className="bg-white border rounded-lg shadow-lg w-56">
                    <ul className="py-2">
                      {cat.children.map((sub, i) => (
                        <li key={i}>
                          <a
                            href="#"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            {sub.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Search + Auth */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-600"
            />
          </div>

          <a
            href="#"
            className="flex items-center gap-2 font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            <MdPersonOutline className="w-5 h-5" />
            Đăng nhập
          </a>
          <a
            href="#"
            className="bg-linear-to-r from-blue-600 to-indigo-500 text-white px-5 py-2 rounded-lg hover:opacity-90 text-sm font-semibold shadow-md transition-all"
          >
            Đăng ký
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
