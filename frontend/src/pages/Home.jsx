import React from "react";
import black_logo from "/black_logo.png";

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-[#c8c8c8] pt-18">
      {/* Logga och text bredvid varandra */}
      <div className="text-xs sm:text-s md:text-xl text-gray-700 mr-70">
        Välkommen
      </div>
      <div className="flex items-center space-x-4 mb-10 md:mr-25">
        <img 
          src={black_logo} 
          alt="foodisave logo" 
          className="w-12 sm:w-24 md:w-44 h-auto"
        />
        <h1 className="text-4xl sm:text-5xl md:text-9xl font-bold text-black">
          foodisave
        </h1>
      </div>
      
    </div>

      
  );
}
