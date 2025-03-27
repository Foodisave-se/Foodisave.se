import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import FilterRecipe from "../components/FilterRecipe";

export default function SearchRecipeWords() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Current filters state
  const [currentFilters, setCurrentFilters] = useState({
    carbs: searchParams.get("carbohydrates") ? Number(searchParams.get("carbohydrates")) : 0,
    calories: searchParams.get("calories") ? Number(searchParams.get("calories")) : 0,
    protein: searchParams.get("protein") ? Number(searchParams.get("protein")) : 0,
    ingredients: searchParams.get("ingredients") || ""
  });

  useEffect(() => {
    if (searchTerm) {
      // Reset recipes and page when query changes
      setRecipes([]);
      setPage(0);
      setHasMore(true);
      fetchRecipes(searchTerm, currentFilters.carbs, currentFilters.calories, 
                   currentFilters.protein, currentFilters.ingredients, 0, true);
    }
  }, [searchParams]); // Listen for URL changes

  const fetchRecipes = async (query, carbs = 0, calories = 0, protein = 0, 
                             ingredients = "", pageNum = 0, replace = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
  
    try {
      const params = new URLSearchParams();
      params.append("query", query);
      
      // Only send filters if they're greater than 0
      if (carbs > 0) params.append("carbohydrates", carbs);
      if (calories > 0) params.append("calories", calories);
      if (protein > 0) params.append("protein", protein);
      if (ingredients.trim()) params.append("ingredients", ingredients);
      
      // Add pagination parameters
      params.append("page", pageNum);
      params.append("page_size", 20);
  
      const response = await fetch(`${apiUrl}/search/recipe?${params.toString()}`);
  
      if (!response.ok) {
        if (response.status === 404) {
          setHasMore(false);
          if (pageNum === 0) {
            throw new Error("Inga recept hittades");
          } else {
            // No more recipes, but we've loaded some already
            return;
          }
        }
        throw new Error("Något gick fel vid hämtning av recept");
      }
  
      const data = await response.json();
      console.log(data)
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        if (replace) {
          setRecipes(data);
        } else {
          setRecipes(prevRecipes => [...prevRecipes, ...data]);
        }
        setPage(pageNum + 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Update URL with query param
    setSearchParams({ query: searchTerm });
  };

  const handleFilterApply = ({ carbs, calories, protein, ingredients }) => {
    // Update current filters
    setCurrentFilters({ carbs, calories, protein, ingredients });
    
    // Update URL parameters
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("query", searchTerm);
      
      // Only add filters if they're greater than 0
      if (carbs > 0) newParams.set("carbohydrates", carbs);
      else newParams.delete("carbohydrates");
      
      if (calories > 0) newParams.set("calories", calories);
      else newParams.delete("calories");
      
      if (protein > 0) newParams.set("protein", protein);
      else newParams.delete("protein");
      
      if (ingredients.trim()) newParams.set("ingredients", ingredients);
      else newParams.delete("ingredients");
  
      return newParams;
    });
  
    // Reset pagination and fetch with new filters
    setRecipes([]);
    setPage(0);
    setHasMore(true);
    fetchRecipes(searchTerm, carbs, calories, protein, ingredients, 0, true);
  };

  // Setup intersection observer for infinite scrolling
  const lastRecipeElementRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchRecipes(
          searchTerm, 
          currentFilters.carbs, 
          currentFilters.calories, 
          currentFilters.protein, 
          currentFilters.ingredients,
          page
        );
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, searchTerm, currentFilters, page]);

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
                  placeholder="Sök på recept..."
                  className="flex-1 block px-3 py-2 placeholder-black border border-black rounded-md appearance-none focus:outline-none bg-white sm:text-sm"
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

            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto m-4">
        {recipes.map((recipe, index) => {
          if (recipes.length === index + 1) {
            // Add ref to last element for intersection observer
            return (
              <div ref={lastRecipeElementRef} key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </div>
            );
          } else {
            return <RecipeCard key={recipe.id} recipe={recipe} />;
          }
        })}
      </div>
      
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-500">Laddar fler recept...</p>
        </div>
      )}
      
      {!hasMore && recipes.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500">Inga fler recept att visa</p>
        </div>
      )}
    </div>
  );
}