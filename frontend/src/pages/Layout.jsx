import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center" style={{
      backgroundImage: `url('/background_foodisave.jpg')`,
    }}>
      <Header></Header>
      <div className="flex-1">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Layout;