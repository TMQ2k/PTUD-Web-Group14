import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/header";
import Footer from "../common/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

const MainLayouts = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ToastContainer />
    </>
  );
};

export default MainLayouts;
