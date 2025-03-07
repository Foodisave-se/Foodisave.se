// Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import ChatWidget from "../components/ChatWidget";
import Footer from "../components/Footer";
import Header from "../components/Header";

function Layout() {
  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/background_foodisave.jpg')` }}
    >
      <Header />
      <div id="main-content" className="relative flex-1">
        <Outlet />
        {/* Placera ChatWidget absolut inom innehållsdelen */}
        <div className="fixed bottom-4 right-4 z-50">
          <ChatWidget />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
