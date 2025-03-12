import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import FilterRecipe from "../components/FilterRecipe";

export default function SearchRecipeWords() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || ""); // Hämta query från URL
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = "http://localhost:8000/v1";

  useEffect(() => {
    if (searchTerm) {
      fetchRecipes(searchTerm);
    }
  }, [searchParams]); // Lyssnar på förändringar i URL

  const fetchRecipes = async (query, carbs = 0, calories = 0, protein = 0, ingredients = "") => {
    setLoading(true);
    setError(null);
  
    try {
      const params = new URLSearchParams();
      params.append("query", query);
      
      // Skicka endast filter om de är större än 0
      if (carbs > 0) params.append("carbohydrates", carbs);
      if (calories > 0) params.append("calories", calories);
      if (protein > 0) params.append("protein", protein);
      if (ingredients.trim()) params.append("ingredients", ingredients);
  
      const response = await fetch(`${apiUrl}/search/recipe?${params.toString()}`);
  
      if (!response.ok) {
        throw new Error("Inga recept hittades");
      }
  
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchParams({ query: searchTerm }); // Uppdatera URL med query-param
  };

  const handleFilterApply = ({ carbs, calories, protein, ingredients }) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("query", searchTerm);
      
      // Endast lägg till filter om de är större än 0
      if (carbs > 0) newParams.set("carbohydrates", carbs);
      if (calories > 0) newParams.set("calories", calories);
      if (protein > 0) newParams.set("protein", protein);
      if (ingredients.trim()) newParams.set("ingredients", ingredients);
  
      return newParams;
    });
  
    // Hämta recept med nya filter
    fetchRecipes(searchTerm, carbs, calories, protein, ingredients);
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-24">
      <div className="mt-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-3xl font-bold text-center text-black">Recept</h2>
          <div className="px-4 py-8 sm:rounded-lg sm:px-10">
            <div className="relative w-full">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Sök på recept eller ingredienser..."
                className="flex-1 block px-3 py-2 placeholder-black border border-black rounded-md appearance-none focus:outline-none focus:ring-[#888383] focus:border-[#888383] sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <div className="ml-2">
                <FilterRecipe onFilterApply={handleFilterApply} />
              </div>
            </div>
            
            <button
              onClick={handleSearch}
              className="mt-4 w-full bg-black text-white px-4 py-2 rounded-md hover:bg-[#888383] transition cursor-pointer"
            >
              Sök
            </button>

            
          </div>

            {loading && <p className="text-center text-gray-500 mt-4">Laddar recept...</p>}
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto m-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
