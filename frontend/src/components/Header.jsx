import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleOutsideClick = (event) => {
    if (
      !event.target.closest("#menuButton") &&
      !event.target.closest("#sideMenu")
    ) {
      setIsMenuOpen(false);
    }
  };

  document.addEventListener("click", handleOutsideClick);
  
  return (
    <header className="bg-gradient-to-b from-green-100 to-white border border-gray-100 w-full">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          {/* Vänster sida */}
          <div className="flex items-center space-x-6">
            {/* Menyknapp */}
            <button 
              id="menuButton"
              onClick={toggleMenu} 
              className="relative flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 shadow-lg bg-white text-gray-800 hover:bg-green-300 rounded-full cursor-pointer hover:scale-95 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 sm:h-6 sm:w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div 
              id="sideMenu"
              className={`fixed rounded-lg top-20 left-0 w-1/4 sm:w-1/5 h-auto w-auto bg-green-200 shadow-lg transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full hidden"
              }`}
            >
              <div
                className="p-6 relative">
                {/* Stängknapp */}
                <button
                  onClick={toggleMenu}
                  className="absolute top-4 right-4 text-xl hover:text-2xl font-bold text-gray-700 cursor-pointer"
                >
                  x
                </button>
                <ul className="space-y-4 text-lg text-green-900">
                  <li><Link to="/blimedlem" onClick={toggleMenu} className="hover:underline">Bli medlem</Link></li>
                  <li><Link to="/receptforslag" onClick={toggleMenu} className="hover:underline">Förslag på Recept</Link></li>
                  <li><Link to="/sokrecept" onClick={toggleMenu} className="hover:underline">Sök på Recept</Link></li>
                  <li><Link to="/blimedlem" onClick={toggleMenu} className="hover:underline">Vad är FoodiSave</Link></li>
                  <li><Link to="/blimedlem" onClick={toggleMenu} className="hover:underline">Kontakta oss</Link></li>
                </ul>

              </div>

            </div>

            {/* Logotyp */}
            <div className="text-m sm:text-l md:text-xl font-bold text-gray-800 hover:text-green-300 hover:scale-95 transition-all duration-300">
              <Link to="/" className="hover:underline">FoodiSave.se</Link>
            </div>
          </div>

          {/* Höger sida (knapparna) */}
          <div className="flex items-center space-x-4">
            {/* Sök-knapp */}
            <div className="relative flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 shadow-lg bg-white text-gray-800 hover:bg-green-300 rounded-full hover:scale-95 transition-all duration-300">
              <Link to="/search">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 sm:h-6 sm:w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </Link>
            </div>

            {/* Användar-knapp */}
            <button className="relative flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 shadow-lg bg-white text-gray-800 hover:bg-green-300 rounded-full hover:scale-95 transition-all duration-300">
              <Link to="/blimedlem">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 sm:h-6 sm:w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
