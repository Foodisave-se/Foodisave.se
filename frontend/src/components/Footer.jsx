import React from "react";

export default function Footer() {
  // 1. Skapa en funktion för att scrolla till toppen
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="py-8">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* 2. Här lägger vi en "Tillbaka Upp"-knapp i vänsterkanten */}
          <div className="flex justify-start mt-8">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-black hover:text-gray-400"
            >
              <span className="text-xl">^</span>
              <span>Tillbaka Upp</span>
            </button>
          </div>
          <div>
            <h2 className="text-xl text-black font-bold">foodisave.se</h2>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-gray-400 text-black">
              Om
            </a>
            <a href="#" className="hover:text-gray-400 text-black">
              Kontakt
            </a>
            <a href="#" className="hover:text-gray-400 text-black">
              Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
