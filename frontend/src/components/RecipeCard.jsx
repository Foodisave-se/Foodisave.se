import React from "react";
import { Link, useLocation } from "react-router-dom";

function RecipeCard({ recipe }) {
  const location = useLocation(); // Hämta nuvarande URL

  return (
    <div className="max-w-xs bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105 flex flex-col h-full">
      <Link
        to={`/recipe/${recipe.id}?${location.search}`} // Skicka med searchParams
        className="flex flex-col h-full"
      >
        <div>
          <img className="w-full h-56 object-cover" src={recipe.images} alt={recipe.name} />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-lg font-semibold text-black">{recipe.name}</h2>

          <div className="flex items-center justify-between bg-[#c8c8c8] rounded-lg px-4 py-2 text-sm text-black mt-auto">
            <span>{recipe.cook_time || "Över 30 min"}</span>
            <span className="bg-black text-white px-3 py-1 rounded-full text-xxs m-2">
              {recipe.tags || "Enkel"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default RecipeCard;
