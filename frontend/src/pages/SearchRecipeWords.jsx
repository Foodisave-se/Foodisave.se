import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";

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

  const fetchRecipes = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/search/recipe?query=${query}`);
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-24">
      <div className="mt-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-3xl font-bold text-center text-black">Recept</h2>
          <div className="px-4 py-8 sm:rounded-lg sm:px-10">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Sök på recept eller ingredienser..."
                className="block w-full px-3 py-2 placeholder-black border border-black rounded-md appearance-none focus:outline-none focus:ring-[#888383] focus:border-[#888383] sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="mt-4 w-full bg-black text-white px-4 py-2 rounded-md hover:bg-[#888383] transition cursor-pointer"
            >
              Sök
            </button>

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
