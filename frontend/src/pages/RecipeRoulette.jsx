import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import FilterRouletteRecipe from "../components/FilterRouletteRecipe";

export default function RecipeRoulette() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const apiUrl = "http://localhost:8000/v1";

  /**
   * Hämtar recept från backend med hjälp av eventuella filter.
   * Om inget filter skickas med (tom sträng) hämtas recept utan filter.
   */
  const spinRecipes = async (recipeType = "") => {
    setSpinning(true);
    setSelectedRecipe(null);

    try {
      const params = new URLSearchParams();
      if (recipeType) params.append("recipe_type", recipeType);

      const response = await fetch(`${apiUrl}/random/recipe?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Inga recept hittades");
      }
      const data = await response.json();
      const recipesData = Array.isArray(data) ? data : [data];
      setRecipes(recipesData);

      // Efter 3 sekunder slumpas ett recept
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * recipesData.length);
        setSelectedRecipe(recipesData[randomIndex]);
        setSpinning(false);
      }, 3000);
    } catch (error) {
      console.error("Fel vid hämtning av recept:", error);
      setSpinning(false);
    }
  };

  /**
   * Uppdaterar URL:en med filter-parametrar och startar spinningen med valt filter.
   */
  const handleFilterApply = ({ recipeType }) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      if (recipeType) newParams.set("recipe_type", recipeType);
      else newParams.delete("recipe_type");
      return newParams;
    });
    spinRecipes(recipeType);
  };

  /**
   * Direktspin utan att använda filter.
   * Först rensar vi eventuella "recipe_type"-parametrar från URL:en.
   */
  const handleSpin = () => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.delete("recipe_type");
      return newParams;
    });
    spinRecipes("");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-24">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center text-black mb-8">
          Recept Roulett
        </h2>
        <div className="w-full sm:max-w-md">
          <div className="relative flex items-center mb-4">
            <button
              onClick={handleSpin}
              className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-[#888383] transition cursor-pointer"
            >
              Spin
            </button>
            <div className="ml-2">
              <FilterRouletteRecipe onFilterApply={handleFilterApply} />
            </div>
          </div>
        </div>

        {/* Visa snurrande bilder när spinningen är igång */}
        {spinning && (
          <div className="relative w-64 h-64 mt-8">
            <div className="absolute inset-0 rounded-full animate-rotate">
              {recipes.map((recipe, index) => {
                const angle = (360 / recipes.length) * index;
                return (
                  <img
                    key={recipe.id}
                    src={recipe.images}
                    alt=""
                    className="w-16 h-16 object-cover rounded-full absolute"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${angle}deg) translate(120px) rotate(-${angle}deg)`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Visa receptkortet när spinningen är klar */}
        {!spinning && selectedRecipe && (
          <div className="items-center mt-8">
            <div className="sm:max-w-md w-full">
              <RecipeCard recipe={selectedRecipe} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
