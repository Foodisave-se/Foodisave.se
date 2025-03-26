import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="py-4">
      {/* 
        text-xs på mobil, text-sm från sm: (640px) uppåt.
        Justera gärna beroende på hur litet du vill ha det. 
      */}
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 text-xs sm:text-sm">
        
        {/* flex-col på mobil, flex-row på större skärmar */}
        <div className="flex flex-col sm:flex-row items-center justify-between">
          
          {/* "Tillbaka Upp"-knapp */}
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 cursor-pointer text-black hover:text-gray-400"
          >
            {/* Ikon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path
                fillRule="evenodd"
                d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
                clipRule="evenodd"
              />
            </svg>
            <span>Tillbaka Upp</span>
          </button>

          {/* Centrera på liten skärm, men flytta till höger på större skärm */}
          <div className="mt-4 sm:mt-0 sm:ml-8 xl:ml-25">
            <h2 className="font-medium text-black">
              2025 Foodisave. All rights reserved.
            </h2>
          </div>

          {/* Länkar */}
          <div className="mt-4 sm:mt-0 flex space-x-4 sm:ml-8 md:mr-15 xl:mr-10">
            <Link to="/about" className="hover:text-gray-400 text-black">
              Om
            </Link>
            <Link to="/about" className="hover:text-gray-400 text-black">
              Kontakt
            </Link>
            <Link to="/terms-and-privacy" className="hover:text-gray-400 text-black">
              Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
