import React, { useState } from "react";

export default function FilterRecipe({ onFilterApply }) {
  const [isOpen, setIsOpen] = useState(false);

  // State för de olika filtren
  const [carbs, setCarbs] = useState(0);
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [ingredients, setIngredients] = useState("");

  // Anropas när man klickar på Apply
  const handleApply = () => {
    onFilterApply({ carbs, calories, protein, ingredients });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Knapp för att öppna filtret */}
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

      {/* Slide-in från höger */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-end z-50">
          {/* Mörk overlay bakom menyn */}
          <div
            className="absolute inset-0 bg-opacity-25"
            onClick={() => setIsOpen(false)}
          ></div>
          

          {/* Själva filter-menyn */}
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

            {/* Kolhydrater */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Kolhydrater: {carbs}
              </label>
              <input
                type="range"
                min="0"
                max="500"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full range-black"
              />
            </div>

            {/* Kalorier */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Kalorier: {calories}
              </label>
              <input
                type="range"
                min="0"
                max="2000"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full range-black"
              />
            </div>

            {/* Protein */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Protein: {protein}
              </label>
              <input
                type="range"
                min="0"
                max="500"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full range-black"
              />
            </div>

            {/* Ingredienser */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">Ingredienser</label>
              <input
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="w-full border border-black rounded-md p-2"
                placeholder="Ex. tomat, lök..."
              />
            </div>

            {/* Apply-knapp */}
            <button
              onClick={handleApply}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition self-end cursor-pointer"
            >
              Använd filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
