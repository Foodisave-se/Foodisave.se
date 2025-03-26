import React, { useState, useEffect } from "react";
import authStore from "../store/authStore";
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";

function RecipeCard({ recipe }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const token = authStore((state) => state.token);
  const navigate = useNavigate();


  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    return token && token !== "null" && userData && userData !== "null";
  };
  
  // Check if the recipe is already saved when component mounts
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/recipe/saved/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recipe_id: recipe.id,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsSaved(data.isSaved);
        }
      } catch (error) {
        console.error("Error checking if recipe is saved:", error);
      }
    };
    
    if (token) {
      checkIfSaved();
    }
  }, [recipe.id, token]);

  const handleButtonClick = (event) => {
    // Prevent default button behavior
    event?.preventDefault();
  
    // Check login status first
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    
    // Then perform save/unsave action
    isSaved ? handleUnsaveRecipe(event) : handleSaveRecipe(event);
  };

  const handleSaveRecipe = async (e) => {
    e.preventDefault(); // Prevent the click from navigating to the recipe URL
    e.stopPropagation(); // Prevent event bubbling
    
    if (isSaving) return; // Prevent multiple clicks
    
    setIsSaving(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/recipe/saved`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipe_id: recipe.id,
        }),
      });
      
      if (response.ok) {
        setIsSaved(true); // Update the saved state
        console.log("Recept sparat!");
      } else {
        console.log("Kunde inte spara receptet. Försök igen senare.");
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      console.log("Ett fel uppstod. Försök igen senare.");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to handle unsaving a recipe
  const handleUnsaveRecipe = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/recipe/saved`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipe_id: recipe.id,
        }),
      });
      
      if (response.ok) {
        setIsSaved(false);
        console.log("Recept borttaget från sparade!");
      } else {
        console.log("Kunde inte ta bort receptet. Försök igen senare.");
      }
    } catch (error) {
      console.error("Error unsaving recipe:", error);
      console.log("Ett fel uppstod. Försök igen senare.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-md shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105 flex flex-col h-full relative">
      {/* Heart button for saving/unsaving */}
      <button 
        onClick={handleButtonClick}
        className="absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 cursor-pointer transition"
        disabled={isSaving}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-red-500" 
          fill={isSaved ? "currentColor" : "none"} 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      </button>

      {/* Recipe Card Link */}
      <a
        href={recipe.recipe_url} 
        target="_blank"
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
              {recipe.cook_time || "Över 30 min"}
            </span>
            <StarRating rating={recipe.rating / 100 * 5} count={recipe.ratings_count} />
          </div>
        </div>
      </a>
    </div>
  );
}

export default RecipeCard;