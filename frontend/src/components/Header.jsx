import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import black_logo from "/black_logo.png";
import white_logo from "/white_logo.png";
import LoggedinHeader from "./LoggedinHeader";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredDropdownLink, setHoveredDropdownLink] = useState(null);
  const dropdownTimeoutRef = useRef(null);
  const [userData, setUserData] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Kolla vid initial render om användardata finns i localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  // Lyssna på custom eventet "userStatusChanged" för att uppdatera användardata
  useEffect(() => {
    const handleUserStatusChange = () => {
      const storedUser = localStorage.getItem("userData");
      setUserData(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("userStatusChanged", handleUserStatusChange);
    return () =>
      window.removeEventListener("userStatusChanged", handleUserStatusChange);
  }, []);

  // Andra hooks (för menyhantering) körs alltid
  useEffect(() => {
    if (isMenuOpen) {
      setShowMenu(true);
    } else {
      const timeout = setTimeout(() => {
        setShowMenu(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isMenuOpen]);

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

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
  };

  return (
    <>
      {/* Om userData finns visas LoggedinHeader, annars gästvyn */}
      {userData ? (
        <LoggedinHeader />
      ) : (
        <>
          <header className="fixed top-0 left-0 w-full z-50 bg-transparent h-20">
            <div id="header-container" className="relative mx-auto max-w-7xl px-4 py-2">
              <div className="flex items-center justify-between h-20">
                {/* Logo */}
                <div className="flex items-center">
                  <div className="text-m sm:text-l md:text-xl font-bold">
                    <div
                      className={`flex items-center gap-1 transition-colors duration-300 ${
                        isMenuOpen ? "text-white" : "text-black"
                      }`}
                    >
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
                    className="curtain-link relative inline-block overflow-hidden px-4 py-2 rounded-sm bg-transparent"
                  >
                    <span className="normal-text block rounded-sm transition-transform duration-200 ease-in-out">
                      Vad är foodisave
                    </span>
                    <span className="hover-text absolute inset-0 flex items-center justify-center bg-black text-white w-full h-full rounded-sm transition-transform duration-500 ease-in-out">
                      Vad är foodisave
                    </span>
                  </Link>
                  <div
                    className="relative pt-2"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    <Link
                      to="/search"
                      className="curtain-link relative inline-block overflow-hidden px-4 py-2 rounded-sm bg-transparent"
                    >
                      <span className="normal-text block transition-transform duration-200 ease-in-out">
                        Recept
                      </span>
                      <span className="hover-text absolute inset-0 flex items-center justify-center rounded-sm bg-black text-white w-full h-full transition-transform duration-500 ease-in-out">
                        Recept
                      </span>
                    </Link>
                    {isDropdownOpen && (
                      <div className="absolute top-full left-[95%] transform -translate-x-1/2 mt-2 flex flex-col items-center z-40">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-b-black border-l-transparent border-r-transparent -ml-25" />
                        <div className="bg-black w-40 rounded-sm shadow-lg animate-slide-up">
                          <Link
                            to="/random"
                            onMouseEnter={() => setHoveredDropdownLink("random")}
                            onMouseLeave={() => setHoveredDropdownLink(null)}
                            onClick={() => setIsDropdownOpen(false)}
                            className={`block px-4 py-2 rounded-sm ${
                              hoveredDropdownLink === null ||
                              hoveredDropdownLink === "random"
                                ? "text-white"
                                : "text-gray-500"
                            }`}
                          >
                            Recept Roulette
                          </Link>
                          <Link
                            to="/imagerecipe"
                            onMouseEnter={() => setHoveredDropdownLink("search")}
                            onMouseLeave={() => setHoveredDropdownLink(null)}
                            onClick={() => setIsDropdownOpen(false)}
                            className={`block px-4 py-2 rounded-sm ${
                              hoveredDropdownLink === null ||
                              hoveredDropdownLink === "search"
                                ? "text-white"
                                : "text-gray-500"
                            }`}
                          >
                            Recept via Bild
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <Link
                    to="/random"
                    className="curtain-link relative inline-block overflow-hidden px-4 py-2 rounded-sm bg-transparent"
                  >
                    <span className="normal-text block transition-transform duration-200 ease-in-out">
                      Recept Roulette
                    </span>
                    <span className="hover-text absolute inset-0 flex items-center justify-center bg-black text-white w-full h-full transition-transform duration-500 ease-in-out">
                      Recept Roulette
                    </span>
                  </Link>
                </div>
                {/* Höger-del i Desktop: Logga In / Bli Medlem */}
                <div className="hidden md:flex items-center justify-center space-x-6">
                  <Link
                    to="/login"
                    className="curtain-link relative inline-block overflow-hidden px-4 py-2 rounded-sm bg-transparent"
                  >
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
                      className="relative inline-flex items-center bg-black text-white rounded-sm px-6 py-2 group overflow-hidden transition-all duration-300 ease-in-out hover:w-38"
                    >
                      <span className="mr-2 transition-transform duration-300 ease-in-out group-hover:-translate-x-2">
                        Bli Medlem
                      </span>
                      <span className="absolute right-0 inline-flex items-center justify-center w-8 h-8 bg-green-300 text-black rounded-full transform translate-x-[120%] group-hover:translate-x-0 transition-transform duration-300 mr-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                        >
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
                    className="relative flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 shadow-lg bg-black text-white rounded-sm cursor-pointer transition-transform duration-300 hover:scale-95"
                  >
                    {isMenuOpen ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-5 w-5 sm:h-6 sm:w-6"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </header>
          {/* Overlay och mobilmeny */}
          {showMenu && (
            <div className="fixed inset-0 z-40">
              <div className="absolute inset-0 bg-black bg-opacity-90 transition-opacity duration-1000"></div>
              <div
                id="sideMenu"
                className={`absolute inset-x-0 top-20 mx-auto w-4/5 sm:w-1/2 rounded-sm shadow-lg text-center p-6 ${
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
                      Recept
                    </Link>
                  </li>
                  <li>
                    <Link to="/random" onClick={toggleMenu} className="hover:underline">
                      Recept Roulette
                    </Link>
                  </li>
                  <li>
                    <Link to="/imagerecipe" onClick={toggleMenu} className="hover:underline">
                      Recept via Bild
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" onClick={toggleMenu} className="hover:underline">
                      Inställningar
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" onClick={toggleMenu} className="hover:underline">
                      Mina Recept
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
