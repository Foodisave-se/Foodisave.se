import React, { useState } from "react";

export default function FilterRouletteRecipe({ onFilterApply }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Single recipeType state instead of separate food type states
  const [recipeType, setRecipeType] = useState("");

  // Called when Apply button is clicked
  const handleApply = () => {
    onFilterApply({ recipeType });
    setIsOpen(false);
  };

  // Handler for selecting a recipe type
  const handleTypeSelect = (type) => {
    setRecipeType(type === recipeType ? "" : type); // Toggle selection
  };

  return (
    <div className="relative">
      {/* Button to open the filter */}
      <button
        className="bg-black text-white p-2 rounded-md hover:bg-[#888383] transition inline-flex items-center cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
        </svg>
      </button>

      {/* Slide-in from right */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-end z-50">
          {/* Dark overlay behind menu */}
          <div
            className="absolute inset-0 bg-opacity-25"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Filter menu */}
          <div className="relative w-80 bg-[#888383] h-full shadow-lg flex flex-col p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filter</h2>
              <button
                className="text-black hover:text-black"
                onClick={() => setIsOpen(false)}
                aria-label="Stäng filtermeny"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <h3 className="block font-semibold mb-3">Kategorier</h3>
              
              {/* Recipe Type Selection Buttons */}
              <div className="flex flex-col space-y-2">
                {/* Fågel */}
                <button
                  onClick={() => handleTypeSelect("Fågel")}
                  className={`px-4 py-2 rounded-md transition text-left hover:cursor-pointer ${
                    recipeType === "Fågel"
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  Fågel
                </button>
                
                {/* Kött */}
                <button
                  onClick={() => handleTypeSelect("Kött")}
                  className={`px-4 py-2 rounded-md transition text-left hover:cursor-pointer ${
                    recipeType === "Kött"
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  Kött
                </button>
                
                {/* Fisk */}
                <button
                  onClick={() => handleTypeSelect("Fisk")}
                  className={`px-4 py-2 rounded-md transition text-left hover:cursor-pointer ${
                    recipeType === "Fisk"
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  Fisk
                </button>
                
                {/* Vegetariskt */}
                <button
                  onClick={() => handleTypeSelect("Vegetariskt")}
                  className={`px-4 py-2 rounded-md transition text-left hover:cursor-pointer ${
                    recipeType === "Vegetariskt"
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  Vegetariskt
                </button>

                {/* Apply button */}
                <button
                  onClick={handleApply}
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition self-end cursor-pointer mt-auto"
                >
                  Spin
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}