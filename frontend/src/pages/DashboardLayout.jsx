import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatWidget from "../components/ChatWidget";

function DashboardLayout() {

  const [fadeValue, setFadeValue] = useState(0);
  
    useEffect(() => {
      const handleScroll = () => {
        // Hur snabbt overlayn ska öka
        // Exempel: vid 300px scroll = fadeValue = 1 (helt täckt)
        const maxScroll = 200;
        const scrollTop = window.scrollY;
        // Begränsa värdet mellan 0 och 1
        const newFade = Math.min(scrollTop / maxScroll, 1);
        setFadeValue(newFade);
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  
    // Här skapar vi en RGBA-gradient där alpha = fadeValue.
    // När fadeValue = 0 -> helt genomskinligt
    // När fadeValue = 1 -> ganska “blekt” (t.ex. 0.9)
    const overlayStyle = {
      background: `linear-gradient(
        to bottom, 
        rgba(200,200,200,${1 * fadeValue}) 0%, 
        transparent 100%
      )`,
    };

  return (
    <div className="relative flex h-screen">
      <Sidebar />
      <div id="main-content" className="flex-1 px-10 overflow-auto outline-none bg-[#c8c8c8] max-w-7xl">
        {/* Overlay som "bleker" innehållet när man scrollar */}
        <div 
          className="pointer-events-none fixed top-0 left-0 w-full h-20 z-40"
          style={overlayStyle}
        />
        
        <Outlet />

        {/* Placera ChatWidget absolut inom innehållsdelen */}
        <div className="fixed bottom-4 right-4 z-50">
          <ChatWidget />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
