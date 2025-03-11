import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import black_logo from "/black_logo.png";
import white_logo from "/white_logo.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Behåll menyn i DOM:en tills animationen är klar (nu 500ms)
  useEffect(() => {
    if (isMenuOpen) {
      setShowMenu(true);
    } else {
      const timeout = setTimeout(() => {
        setShowMenu(false);
      }, 1000); // Uppdaterad till 500ms
      return () => clearTimeout(timeout);
    }
  }, [isMenuOpen]);

  // Stäng menyn vid klick utanför
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !event.target.closest("#menu-burger") &&
        !event.target.closest("#sideMenu")
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <>
      {/* Huvud-header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-transparent h-20">
        <div id="header-container" className="relative mx-auto max-w-7xl px-4 py-2">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-m sm:text-l md:text-xl font-bold">
                <div className={`flex items-center gap-1 transition-colors duration-300 ${isMenuOpen ? "text-white" : "text-black"}`}>
                  <Link to="/">
                    <img 
                      src={isMenuOpen ? white_logo : black_logo} 
                      alt="foodisave logo" 
                      className="w-8 h-8 ml-2"
                    />
                  </Link>
                  <Link to="/">foodisave</Link>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center space-x-6">
              <Link 
                to="/about" 
                className="curtain-link relative inline-block overflow-hidden px-4 py-2 rounded-full bg-transparent">
                <span className="normal-text block rounded-full transition-transform duration-200 ease-in-out">
                  Vad är foodisave
                </span>
                <span className="hover-text absolute inset-0 flex items-center justify-center bg-black text-white w-full h-full rounded-full transition-transform duration-500 ease-in-out">
                  Vad är foodisave
                </span>
              </Link>
              <Link 
                to="/search" 
                className="curtain-link relative inline-block overflow-hidden px-4 py-2 rounded-full bg-transparent">
                <span className="normal-text block transition-transform duration-200 ease-in-out">
                  Sök på Recept
                </span>
                <span className="hover-text absolute inset-0 flex items-center justify-center bg-black text-white w-full h-full transition-transform duration-500 ease-in-out">
                  Sök på Recept
                </span>
              </Link>
              <Link 
                to="/random" 
                className="curtain-link relative inline-block overflow-hidden px-4 py-2 rounded-full bg-transparent">
                <span className="normal-text block transition-transform duration-200 ease-in-out">
                  Recept Roulette
                </span>
                <span className="hover-text absolute inset-0 flex items-center justify-center bg-black text-white w-full h-full transition-transform duration-500 ease-in-out">
                  Recept Roulette
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center justify-center space-x-6">
            <Link 
                to="/login" 
                className="curtain-link relative inline-block overflow-hidden px-4 py-2 rounded-full bg-transparent">
                <span className="normal-text block transition-transform duration-200 ease-in-out">
                  Logga In
                </span>
                <span className="hover-text absolute inset-0 flex items-center justify-center bg-black text-white w-full h-full transition-transform duration-500 ease-in-out">
                Logga In
                </span>
              </Link>
              <div className="min-w-[180px]">
              <Link 
                to="/register" 
                className="relative inline-flex items-center bg-black text-white rounded-full px-6 py-2 group overflow-hidden transition-all duration-300 ease-in-out hover:w-38"
              >
                <span className="mr-2 transition-transform duration-300 ease-in-out group-hover:-translate-x-2">
                  Bli Medlem
                </span>
                <span className="absolute right-0 inline-flex items-center justify-center w-8 h-8 bg-green-300 text-black rounded-full transform translate-x-[120%] group-hover:translate-x-0 transition-transform duration-300 mr-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

            {/* Mobilmeny-knapp */}
            <div className="md:hidden flex items-center">
              <button 
                id="menu-burger"
                onClick={toggleMenu}
                className="relative flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 shadow-lg bg-black text-white rounded-full cursor-pointer transition-transform duration-300 hover:scale-95"
              >
                {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 sm:h-6 sm:w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 sm:h-6 sm:w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay och mobilmeny med gardin-effekt */}
      {showMenu && (
        <div className="fixed inset-0 z-40">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-90 transition-opacity duration-1000"></div>

          {/* Menyn med gardin-animation */}
          <div 
            id="sideMenu" 
            className={`absolute inset-x-0 top-20 mx-auto w-4/5 sm:w-1/2 rounded-lg shadow-lg text-center p-6 ${
              isMenuOpen ? "animate-slide-in-curtain" : "animate-slide-out-curtain"
            }`}
          >
            <ul className="space-y-8 text-3xl font-bold text-white">
              <li>
                <Link to="/about" onClick={toggleMenu} className="hover:underline">
                  Vad är foodisave
                </Link>
              </li>
              <li>
                <Link to="/search" onClick={toggleMenu} className="hover:underline">
                  Sök på Recept
                </Link>
              </li>
              <li>
                <Link to="/random" onClick={toggleMenu} className="hover:underline">
                  Recept Roulette
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={toggleMenu} className="hover:underline">
                  Logga In
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={toggleMenu} className="hover:underline">
                  Bli Medlem
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
