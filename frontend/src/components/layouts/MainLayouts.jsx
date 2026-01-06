import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import MiniBar from "../common/MiniBar";
import AdminRedirectGuard from "../guards/AdminRedirectGuard";

const MainLayouts = () => {
  return (
    <AdminRedirectGuard>
      <Header />
      <Outlet />
      <MiniBar />
      <Footer />
      <ToastContainer />
    </AdminRedirectGuard>
  );
};

export default MainLayouts;
