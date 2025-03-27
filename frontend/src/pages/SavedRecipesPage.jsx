import React, { useState, useEffect } from 'react';
import authStore from '../store/authStore';
import RecipeCard from '../components/RecipeCard';
import AiRecipeCard from '../components/AiRecipeCard';

const SavedRecipesPage = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [savedUserRecipes, setSavedUserRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const BASE_API_URL = import.meta.env.VITE_API_URL;
  const token = authStore((state) => state.token);

  const fetchSavedRecipes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch regular saved recipes
      const recipeResponse = await fetch(`${BASE_API_URL}/saved/recipe`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let regularRecipes = [];
      if (recipeResponse.ok) {
        const recipeData = await recipeResponse.json();
        regularRecipes = recipeData || [];
        setSavedRecipes(regularRecipes);
        console.log("Regular recipes:", regularRecipes);
      } else {
        console.log("Error fetching regular recipes:", await recipeResponse.json());
        setSavedRecipes([]);
      }
      
      // Fetch saved user recipes (AI-generated recipes)
      let userRecipes = [];
      try {
        const userRecipeResponse = await fetch(`${BASE_API_URL}/saved/user-recipe`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (userRecipeResponse.ok) {
          const userRecipeData = await userRecipeResponse.json();
          // Add a flag to identify these as user recipes
          userRecipes = (userRecipeData || []).map(recipe => ({
            ...recipe,
            isUserRecipe: true,
            ingredients: recipe.ingredients 
              ? recipe.ingredients.split(',').map(ingredient => ingredient.trim())
              : [],
            instructions: recipe.instructions 
              ? recipe.instructions.split(',').map(instruction => instruction.trim())
              : []
          }));
          setSavedUserRecipes(userRecipes);
          console.log("User recipes:", userRecipes);
        } else {
          console.log("Error fetching user recipes:", await userRecipeResponse.json());
          setSavedUserRecipes([]);
        }
      } catch (userRecipeError) {
        console.error('Error fetching saved user recipes:', userRecipeError);
        setSavedUserRecipes([]);
      }
      
      // Set the combined recipes directly here
      const combined = [...regularRecipes, ...userRecipes].filter(Boolean);
      setAllRecipes(combined);
      setFilteredRecipes(combined);
      
    } catch (err) {
      console.error('Error fetching saved recipes:', err);
      setError(err.message || 'Network error. Please try again later.');
      setAllRecipes([]);
      setFilteredRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Hämta sparade recept när sidan laddas
  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  // Filtrera recepten baserat på söksträngen
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecipes(allRecipes);
    } else {
      const filtered = allRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  }, [searchQuery, allRecipes]);

  // Extra knapptryck om du vill exekvera något särskilt vid klick på "Sök"
  const handleSearch = () => {
    // För närvarande sker all filtrering redan i useEffect,
    // men här kan du lägga till extra logik om du vill.
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-24">
      {/* Översta blocket för rubrik och sökfält */}
      <div className="mt-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-3xl font-bold text-center text-black">Dina sparade recept</h2>
          <div className="px-4 py-8 sm:rounded-lg sm:px-10">
            <div className="relative w-full">
              {/* Sökfält */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Sök recept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 block px-3 py-2 placeholder-black border border-black rounded-md appearance-none focus:outline-none bg-white sm:text-sm"
                />
              </div>

              {/* Sök-knapp (valfri, om du vill klicka istället för Enter) */}
              <button
                onClick={handleSearch}
                className="mt-4 w-full bg-black text-white px-4 py-2 rounded-md hover:bg-[#888383] transition cursor-pointer"
              >
                Sök
              </button>

              {/* Laddning/felmeddelande */}
              {loading && <p className="text-center text-gray-500 mt-4">Laddar recept...</p>}
              {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Grid-lista med receptkort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto m-4">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map(recipe => (
            <div key={recipe.id} className="relative">
              {/* Optional badge for AI-generated recipes */}
              {recipe.isUserRecipe && (
                <div className="absolute top-4 left-1 bg-green-300 text-black text-xs font-bold ml-2 px-2 py-1 rounded-full z-10">
                  AI
                </div>
              )}
              {recipe.isUserRecipe ? (
                <AiRecipeCard recipe={recipe}/>
              ) : (
                <RecipeCard recipe={recipe}/>
              )}
            </div>
          ))
        ) : (
          // Om inga recept hittas och vi inte laddar längre
          !loading && <p className="text-center w-full col-span-full">Inga recept hittades.</p>
        )}
      </div>
    </div>
  );
};

export default SavedRecipesPage;