import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import authStore from "../store/authStore";

function AiRecipeCard({ recipe }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = authStore((state) => state.token);
  const BASE_API_URL = import.meta.env.VITE_API_URL;

  // Hämta receptbilden från FastAPI
  useEffect(() => {
    const fetchImage = async () => {
      if (!recipe.id) return;
      setIsImageLoading(true);
      try {
        const response = await fetch(`${BASE_API_URL}/images/${recipe.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        const blob = await response.blob();
        setImageSrc(URL.createObjectURL(blob));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchImage();
  }, [recipe.id, token, BASE_API_URL]);

  // Kontrollera om receptet redan är sparat
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}/user-recipe/saved/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_recipe_id: recipe.id }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsSaved(data.isSaved);
        }
      } catch (error) {
        console.error("Error checking if AI recipe is saved:", error);
      }
    };

    if (token && recipe.id) {
      checkIfSaved();
    }
  }, [recipe.id, token, BASE_API_URL]);

  const handleSaveRecipe = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaving) return;
    setIsSaving(true);

    try {
      const response = await fetch(`${BASE_API_URL}/user-recipe/saved`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_recipe_id: recipe.id }),
      });

      if (response.ok) {
        setIsSaved(true);
        console.log("AI recept sparat!");
      }
    } catch (error) {
      console.error("Error saving AI recipe:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnsaveRecipe = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaving) return;
    setIsSaving(true);

    try {
      const response = await fetch(`${BASE_API_URL}/user-recipe/saved`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_recipe_id: recipe.id }),
      });

      if (response.ok) {
        setIsSaved(false);
        console.log("AI-recept borttaget från sparade!");
      }
    } catch (error) {
      console.error("Error unsaving AI recipe:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-md shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105 flex flex-col h-full relative">
      {/* Hjärtknapp för spara/ta bort sparat */}
      {recipe.id && (
        <button 
          onClick={isSaved ? handleUnsaveRecipe : handleSaveRecipe}
          className="absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
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
      )}

      {/* Receptkortets länk */}
      <Link to="/detailedrecipe" state={{ recipe }} className="flex flex-col h-full">
        <div className="relative w-full h-56">
          {error ? (
            <p className="text-center text-red-500 mt-4">Kunde inte ladda bilden</p>
          ) : (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="loaderimage"></div>
                </div>
              )}
              <img
                className="w-full h-56 object-cover"
                src={imageSrc || recipe.images}
                alt={recipe.title || recipe.name}
                onLoad={() => setIsImageLoading(false)}
                style={{ visibility: isImageLoading ? "hidden" : "visible" }}
              />
            </>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-lg font-semibold text-black">
            {recipe.title || recipe.name}
          </h2>

          <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2 text-sm text-black mt-auto">
            <span className="bg-black text-white px-3 py-1 rounded-sm text-xxs m-2">
              {recipe.cook_time || "Över 30 min"}
            </span>
            <span className="bg-green-300 text-black px-3 py-1 rounded-sm text-xxs m-2">
              {recipe.category || recipe.tags || "Enkel"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default AiRecipeCard;
