import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ChatWidget from "../components/ChatWidget";
import Footer from "../components/Footer";
import Header from "../components/Header";

function Layout() {
  const [fadeValue, setFadeValue] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hur snabbt overlayn ska öka
      const maxScroll = 200;
      const scrollTop = window.scrollY;
      const newFade = Math.min(scrollTop / maxScroll, 1);
      setFadeValue(newFade);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const overlayStyle = {
    background: `linear-gradient(
      to bottom, 
      rgba(200,200,200,${5 * fadeValue}) 0%, 
      transparent 100%
    )`,
  };

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center bg-[#c8c8c8] poppins-regular">
      <Header />

      <div id="main-content" className="relative flex-1">
        {/* Overlay som "bleker" innehållet vid scroll */}
        <div 
          className="pointer-events-none fixed top-0 left-0 w-full h-20 z-40"
          style={overlayStyle}
        />

        {/* Skicka ned setChatOpen via context */}
        <Outlet context={{ setChatOpen }} />

        <div className="fixed bottom-4 right-4 z-50">
          <ChatWidget isOpen={chatOpen} toggleChat={() => setChatOpen(prev => !prev)} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Layout;
