import React, { useState } from "react";
import { MdPersonOutline } from "react-icons/md";
import { IoLogoPolymer } from "react-icons/io";
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
            <div key={index} className="relative group">
              <button
                onMouseEnter={() => setActiveMenu(index)}
                onMouseLeave={() => setActiveMenu(null)}
                className="flex items-center gap-1 font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                {cat.name}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 9l6 6 6-6"
                  />
                </svg>
              </button>
              {activeMenu === index && (
                <div className="absolute left-0 top-full mt-2 bg-white border rounded-lg shadow-lg w-56">
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
              )}
            </div>
          ))}
        </nav>

        {/* Search + Auth */}
        <div className="hidden md:flex items-center space-x-6">
          <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-gray-700"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
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
