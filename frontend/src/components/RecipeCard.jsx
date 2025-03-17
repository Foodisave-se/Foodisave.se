import React from "react";
import { Link } from "react-router-dom";

function RecipeCard({ recipe }) {
  return (
    <div className="w-full bg-white rounded-md shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105 flex flex-col h-full">
      {/* Skicka med recipe-objektet i state */}
      <Link
        to="/detailedrecipe"
        state={{ recipe }}
        className="flex flex-col h-full"
      >
        <div>
          <img
            className="w-full h-56 object-cover"
            src={recipe.images}
            alt={recipe.name}
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-lg font-semibold text-black">{recipe.name}</h2>

          <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2 text-sm text-black mt-auto">
            <span
            className="bg-black text-white px-3 py-1 rounded-sm text-xxs m-2">
              {recipe.cook_time || "Över 30 min"}</span>
            <span className="bg-green-300 text-black px-3 py-1 rounded-sm text-xxs m-2">
              {recipe.tags || "Enkel"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default RecipeCard;
