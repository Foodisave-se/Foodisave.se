import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import black_logo from "/black_logo.png";
import white_logo from "/white_logo.png";
import authStore from "../store/authStore";

export default function LoggedinHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const logout = authStore((state) => state.logout);
  const userData = authStore((state) => state.userData);
  const setUserData = authStore((state) => state.setUserData);
  const token = authStore((state) => state.token);

  // Separata states för de två dropdown-menyerna
  const [isDropdownOpenRecept, setIsDropdownOpenRecept] = useState(false);
  const [isDropdownOpenReceptBild, setIsDropdownOpenReceptBild] = useState(false);

  // Deklarera timeout-refs för dropdown-hantering
  const dropdownTimeoutRefRecept = useRef(null);
  const dropdownTimeoutRefReceptBild = useRef(null);

  // Deklarera hover-states för dropdown-länkarna
  const [hoveredLinkRecept, setHoveredLinkRecept] = useState(null);
  const [hoveredLinkReceptBild, setHoveredLinkReceptBild] = useState(null);


  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userData");
    window.dispatchEvent(new Event("userStatusChanged"));
    setIsSidebarOpen(false);
    navigate("/");
  };

  // Hämta användardata från localStorage och uppdatera med data från backend via fetch
  useEffect(() => {
    // Försök först att läsa data från localStorage
    const storedUserData = JSON.parse(localStorage.getItem("userData")) || null;
    if (storedUserData) {
      setUserData(storedUserData);
    }
    // Hämta uppdaterad data från backend
    fetch(`${import.meta.env.VITE_API_URL}/me`, {
      method: "GET",
      credentials: "include", // För att skicka med cookies om så används
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nätverksfel vid hämtning av användardata");
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data);
        localStorage.setItem("userData", JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [setUserData]);

  // Hanterar öppning/stängning av mobilmenyn
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

  // Dropdown i desktopmenyn
  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  
  // Hantering av dropdown för "Recept"
  const handleReceptMouseEnter = () => {
    if (dropdownTimeoutRefRecept.current) {
      clearTimeout(dropdownTimeoutRefRecept.current);
    }
    setIsDropdownOpenRecept(true);
  };
  const handleReceptMouseLeave = () => {
    dropdownTimeoutRefRecept.current = setTimeout(() => {
      setIsDropdownOpenRecept(false);
    }, 300);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
  };

  // Hantering av dropdown för "Recept via Bild"
  const handleReceptBildMouseEnter = () => {
    if (dropdownTimeoutRefReceptBild.current) {
      clearTimeout(dropdownTimeoutRefReceptBild.current);
    }
    setIsDropdownOpenReceptBild(true);
  };
  const handleReceptBildMouseLeave = () => {
    dropdownTimeoutRefReceptBild.current = setTimeout(() => {
      setIsDropdownOpenReceptBild(false);
    }, 300);
  };

  



  

  return (
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
              Om foodisave
            </span>
            <span className="hover-text absolute inset-0 flex items-center justify-center bg-black text-white w-full h-full rounded-sm transition-transform duration-500 ease-in-out">
              Om foodisave
            </span>
          </Link>
          {/* Dropdown för "Recept" */}
          <div
            className="relative pt-2"
            onMouseEnter={handleReceptMouseEnter}
            onMouseLeave={handleReceptMouseLeave}
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
            {isDropdownOpenRecept && (
              <div className="absolute top-full left-[95%] transform -translate-x-1/2 mt-2 flex flex-col items-center z-40">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-b-black border-l-transparent border-r-transparent -ml-25" />
              <div className="bg-black w-40 rounded-sm shadow-lg animate-slide-up">
                    <Link
                    to="/random"
                    onMouseEnter={() => setHoveredLinkRecept("random")}
                    onMouseLeave={() => setHoveredLinkRecept(null)}
                    onClick={() => setIsDropdownOpenRecept(false)}
                    className={`block px-4 py-2 rounded-sm ${
                      hoveredLinkRecept === null ||
                      hoveredLinkRecept === "random"
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    Recept Roulette
                  </Link>
                  <Link
                    to="/search"
                    onMouseEnter={() => setHoveredLinkRecept("search")}
                    onMouseLeave={() => setHoveredLinkRecept(null)}
                    onClick={() => setIsDropdownOpenRecept(false)}
                    className={`block px-4 py-2 rounded-sm ${
                      hoveredLinkRecept === null ||
                      hoveredLinkRecept === "search"
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    Recept Sök
                  </Link>
                </div>
              </div>
            )}
          </div>
          {/* Dropdown för "Recept via Bild" */}
          <div
            className="relative pt-2"
            onMouseEnter={handleReceptBildMouseEnter}
            onMouseLeave={handleReceptBildMouseLeave}
          >
            <Link
              to="/imagerecipe"
              className="curtain-link relative inline-block overflow-hidden px-4 py-2 rounded-sm bg-transparent"
            >
              <span className="normal-text block transition-transform duration-200 ease-in-out">
                Recept via Bild
              </span>
              <span className="hover-text absolute inset-0 flex items-center justify-center rounded-sm bg-black text-white w-full h-full transition-transform duration-500 ease-in-out">
                Recept via Bild
              </span>
            </Link>
            {isDropdownOpenReceptBild && (
              <div className="absolute top-full left-[58%] transform -translate-x-1/2 mt-2 flex flex-col items-center z-40">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-b-black border-l-transparent border-r-transparent -ml-25" />
              <div className="bg-black w-40 rounded-sm shadow-lg animate-slide-up">
                    <Link
                    to="/imagerecipe"
                    onMouseEnter={() => setHoveredLinkReceptBild("viaIngredienser")}
                    onMouseLeave={() => setHoveredLinkReceptBild(null)}
                    onClick={() => setIsDropdownOpenReceptBild(false)}
                    className={`block px-4 py-2 rounded-sm ${
                      hoveredLinkReceptBild === null ||
                      hoveredLinkReceptBild === "viaIngredienser"
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    via Ingredienser
                  </Link>
                  <Link
                    to="/imagerecipeplate"
                    onMouseEnter={() => setHoveredLinkReceptBild("viaMatratt")}
                    onMouseLeave={() => setHoveredLinkReceptBild(null)}
                    onClick={() => setIsDropdownOpenReceptBild(false)}
                    className={`block px-4 py-2 rounded-sm ${
                      hoveredLinkReceptBild === null ||
                      hoveredLinkReceptBild === "viaMatratt"
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    via Maträtt
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
            {/* Höger-del i Desktop: Avatar, Hej Användare & Credits */}
            <div className="hidden md:flex items-center justify-center space-x-4">

              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`h-6 w-6
                    ${
                      isMenuOpen ? "text-white" : "text-black"
                    }`}
                >
                  <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875Z" />
                  <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 0 0 1.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 0 0 1.897 1.384C6.809 12.164 9.315 12.75 12 12.75Z" />
                  <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 15.914 9.315 16.5 12 16.5Z" />
                  <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 19.664 9.315 20.25 12 20.25Z" />
                </svg>
                <span className={`
                      ${
                        isMenuOpen ? "text-white" : "text-black"
                      }`}
                
                >{userData?.credits || 0}</span>
              </div>

              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="flex items-center space-x-3 bg-transparent border-none focus:outline-none rounded hover:bg-[#888383] transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-sm bg-black text-white flex items-center justify-center font-bold uppercase">
                    {userData?.first_name ? userData.first_name.charAt(0) : ""}
                    {userData?.last_name ? userData.last_name.charAt(0) : ""}
                  </div>
                  <span className="text-black">
                    Hej {userData?.first_name || "Användare"}!
                  </span>
                </button>
              </div>
            </div>

            {/* Mobilmeny-knapp */}
            <div className="md:hidden flex items-center gap-4">
            <div className="flex items-center">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`h-6 w-6
                    ${
                      isMenuOpen ? "text-white" : "text-black"
                    }`}
                >
                  <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875Z" />
                  <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 0 0 1.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 0 0 1.897 1.384C6.809 12.164 9.315 12.75 12 12.75Z" />
                  <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 15.914 9.315 16.5 12 16.5Z" />
                  <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 19.664 9.315 20.25 12 20.25Z" />
                </svg>
                <span className={`
                      ${
                        isMenuOpen ? "text-white" : "text-black"
                      }`}
              
                >{userData?.credits || 0}</span>
            </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 sm:h-12 sm:w-12 rounded-sm bg-black text-white flex items-center justify-center font-bold uppercase"
                  onClick={toggleMenu}
                >
                  {userData?.first_name ? userData.first_name.charAt(0) : ""}
                  {userData?.last_name ? userData.last_name.charAt(0) : ""}
                </div>
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
        </div>
      </header>

      {/* SIDEBAR med overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="h-full w-64 bg-[#888383] shadow-lg p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-black text-xl font-bold cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            >
              &times;
            </button>
            <div className="mt-10 flex flex-col space-y-4">
              <Link
                to="/savedrecipes"
                onClick={() => setIsSidebarOpen(false)}
                className="text-black hover:underline"
              >
                Mina Recept
              </Link>
              <Link
                to="/my-items"
                onClick={() => setIsSidebarOpen(false)}
                className="text-black hover:underline"
              >
                Mitt Kök
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsSidebarOpen(false)}
                className="text-black hover:underline"
              >
                Inställningar
              </Link>
              {userData?.is_admin && ( <Link
                to="/admin"
                onClick={() => setIsSidebarOpen(false)}
                className="text-black hover:underline"
              >
                Admin
              </Link>)}
              <button
                onClick={handleLogout}
                className="text-black hover:underline text-left cursor-pointer"
              >
                Logga ut
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Övrig mobilmeny */}
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
                <Link
                  to="/about"
                  onClick={toggleMenu}
                  className="hover:underline"
                >
                  Om foodisave
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  onClick={toggleMenu}
                  className="hover:underline"
                >
                  Recept
                </Link>
              </li>
              <li>
                <Link
                  to="/random"
                  onClick={toggleMenu}
                  className="hover:underline"
                >
                  Recept Roulette
                </Link>
              </li>
              <li>
                <Link
                  to="/imagerecipe"
                  onClick={toggleMenu}
                  className="hover:underline"
                >
                  Recept via Bild
                </Link>
              </li>
              <li>
                <Link
                  to="/myrecipes"
                  onClick={toggleMenu}
                  className="hover:underline"
                >
                  Mina Recept
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  onClick={toggleMenu}
                  className="hover:underline"
                >
                  Inställningar
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="space-y-8 text-3xl font-bold text-white"
                >
                  Logga ut
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
