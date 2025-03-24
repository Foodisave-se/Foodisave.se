import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authStore from "../store/authStore";

export default function DetailedRecipe() {
  const navigate = useNavigate();
  const location = useLocation();
  const [imageSrc, setImageSrc] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState({ saved: false, error: null, loading: false });
  const [imageUploadStatus, setImageUploadStatus] = useState({ uploading: false, error: null });
  const [error, setError] = useState(null);

  const token = authStore((state) => state.token);
  const BASE_API_URL = import.meta.env.VITE_API_URL;

  // Hämta receptet från "state"
  const { recipe } = location.state || {};

  if (!recipe) {
    return (
      <div className="pt-24">
        <p className="text-center text-red-500 mt-4">Inget recept hittades.</p>
      </div>
    );
  }

  // Extract recipe data
  const {
    name,
    images,
    originalFile, // Den ursprungliga filen för senare S3-uppladdning
    descriptions,
    category,
    ingredients,
    instructions,
    cook_time,
    servings,
    calories,
    protein,
    carbohydrates,
    fat,
    id: recipeId
  } = recipe;

  // Hämta receptbilden endast om vi inte redan har en bild
  useEffect(() => {
    if (imageSrc || !recipe.id) return;
    setIsImageLoading(true);
    const fetchImage = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}/images/${recipe.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Misslyckad hämtning utav bild");
        }
        const blob = await response.blob();
        setImageSrc(URL.createObjectURL(blob));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsImageLoading(false);
      }
    };

    fetchImage();
  }, [recipe.id, token, BASE_API_URL, imageSrc]);

  // Kontrollera om receptet redan är sparat
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!recipe.id) return;
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
          setSaveStatus((prev) => ({ ...prev, saved: data.isSaved }));
        }
      } catch (error) {
        console.error("Error checking if recipe is saved:", error);
      }
    };

    if (token && recipe?.id) {
      checkIfSaved();
    }
  }, [recipe?.id, token, BASE_API_URL]);

  // Funktion för att ladda upp bilden till S3 efter receptet är skapat
  const uploadImageToS3 = async (recipeId) => {
    if (!originalFile) return null;
    setImageUploadStatus({ uploading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("file", originalFile);
      formData.append("user_recipe_id", recipeId);
      const response = await fetch(`${BASE_API_URL}/upload-image/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Kunde inte ladda upp bilden till S3");
      }
      const data = await response.json();
      setImageUploadStatus({ uploading: false, error: null });
      return data.image_url;
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      setImageUploadStatus({ uploading: false, error: error.message });
      return null;
    }
  };

  // Funktion för att spara/ta bort sparat recept
  const toggleSaveRecipe = async () => {
    if (saveStatus.loading) return;
    setSaveStatus((prev) => ({ ...prev, loading: true, error: null }));

    if (recipeId) {
      try {
        if (saveStatus.saved) {
          const response = await fetch(`${BASE_API_URL}/user-recipe/saved`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_recipe_id: recipeId }),
          });
          if (response.ok) {
            setSaveStatus((prev) => ({ ...prev, saved: false, loading: false }));
            console.log("Recept borttaget från sparade!");
          } else {
            throw new Error("Kunde inte ta bort receptet.");
          }
        } else {
          const response = await fetch(`${BASE_API_URL}/user-recipe/saved`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_recipe_id: recipeId }),
          });
          if (response.ok) {
            if (originalFile) {
              await uploadImageToS3(recipeId);
            }
            setSaveStatus((prev) => ({ ...prev, saved: true, loading: false }));
            console.log("Recept sparat!");
          } else {
            throw new Error("Kunde inte spara receptet.");
          }
        }
      } catch (error) {
        console.error("Error toggling recipe save:", error);
        setSaveStatus((prev) => ({
          ...prev,
          error: error.message || "Ett fel uppstod. Försök igen senare.",
          loading: false,
        }));
      }
    } else {
      // Om receptet inte har något ID skapar vi det först
      try {
        const servingsValue = typeof servings === "string" ? parseInt(servings, 10) : servings;
        const aiRecipePayload = {
          name: name,
          descriptions: descriptions,
          ingredients: Array.isArray(ingredients) ? ingredients.join(", ") : String(ingredients),
          instructions: Array.isArray(instructions) ? instructions.join(", ") : String(instructions),
          category: category,
          cook_time,
          calories: calories,
          protein,
          carbohydrates,
          fat,
          is_ai: true,
          servings: servingsValue || 4,
        };

        const response_1 = await fetch(`${BASE_API_URL}/ai/recipe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(aiRecipePayload),
        });

        if (!response_1.ok) {
          const errorData = await response_1.json();
          throw new Error(errorData.detail || `Error: ${response_1.status}`);
        }

        const createdRecipe = await response_1.json();
        const response_2 = await fetch(`${BASE_API_URL}/user-recipe/saved`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_recipe_id: createdRecipe.id }),
        });

        if (!response_2.ok) {
          const errorData = await response_2.json();
          throw new Error(errorData.detail || `Error: ${response_2.status}`);
        }

        // Tilldela receptet ett ID lokalt
        recipe.id = createdRecipe.id;

        // Ladda upp bilden om originalFile finns
        if (originalFile) {
          await uploadImageToS3(createdRecipe.id);
        }

        setSaveStatus({ saved: true, error: null, loading: false });
      } catch (err) {
        console.error("Error saving recipe:", err);
        setSaveStatus({
          saved: false,
          error: err.message || "Det gick inte att spara receptet.",
          loading: false,
        });
      }
    }
  };

  return (
    <div className="pt-24 container max-w-7xl mx-auto px-4">
      {/* Bakåtpil */}
      <div className="flex items-center justify-between mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Tillbaka
        </button>
        <button
          onClick={toggleSaveRecipe}
          disabled={saveStatus.loading || imageUploadStatus.uploading}
          className={` mb-6 flex items-center px-4 py-2 rounded-lg transition cursor-pointer ${
            saveStatus.saved
              ? "bg-green-500 text-white"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {saveStatus.loading || imageUploadStatus.uploading ? (
            imageUploadStatus.uploading ? "Laddar upp bild..." : "Sparar..."
          ) : saveStatus.saved ? (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Sparat!
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Spara recept
            </>
          )}
        </button>
      </div>

      {/* Ny layout: Title/Description/Info (vänster) + Bild (höger) */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {/* Info till vänster */}
        <div className="md:w-1/2 flex flex-col">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-black">{name}</h1>
              {/* Save/Unsave Recipe Button */}
              
            </div>

            {/* Felmeddelanden för spara-funktionen */}
            {saveStatus.error && <p className="text-red-500 mt-2">{saveStatus.error}</p>}
            {imageUploadStatus.error && (
              <p className="text-orange-500 mt-2">
                Receptet sparades men bilden kunde inte laddas upp: {imageUploadStatus.error}
              </p>
            )}

            {/* Beskrivning / text */}
            <p className="mt-4 text-gray-600">{descriptions || "Ingen beskrivning"}</p>

            {/* Extrainfo: portioner, tid, kategori */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700 mt-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{servings || "Okänd"}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{cook_time || "Okänd tid"}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{category || "Okänd kategori"}</span>
              </div>
            </div>
          </div>

          {/* Näringsinfo utan ikoner */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <span className="text-xs text-gray-500">Energi</span>
              <div className="font-medium">{calories || "?"} kcal</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <span className="text-xs text-gray-500">Protein</span>
              <div className="font-medium">{protein || "?"} g</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <span className="text-xs text-gray-500">Kolhydrater</span>
              <div className="font-medium">{carbohydrates || "?"} g</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <span className="text-xs text-gray-500">Fett</span>
              <div className="font-medium">{fat || "?"} g</div>
            </div>
          </div>
        </div>

        {/* Bilden till höger med begränsad höjd */}
        <div className="relative md:w-1/2">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="loaderimage"></div>
            </div>
          )}
          <img
            src={imageSrc || images}
            alt={name}
            className="w-full h-64 md:h-80 rounded-lg object-cover shadow-lg"
            onLoad={() => setIsImageLoading(false)}
            style={{ visibility: isImageLoading ? "hidden" : "visible" }}
          />
        </div>
      </div>

      {/* Sektion för Ingredienser (vänster) och instruktioner (höger) */}
      <div className="flex flex-col md:flex-row gap-8 mt-10">
        {/* Ingredienser (vänster) */}
        <div className="md:w-1/3 order-2 md:order-1">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm h-full">
            <h2 className="text-2xl font-semibold mb-4 text-black flex items-center">
              <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Ingredienser
            </h2>
            {Array.isArray(ingredients) ? (
              <ul className="space-y-3">
                {ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2">
                    {/* Checkbox för varje ingrediens */}
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <span className="text-gray-800">{ing}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-800">{ingredients}</p>
            )}
          </div>
        </div>

        {/* Gör så här (höger) */}
        <div className="md:w-2/3 order-1 md:order-2">
          <div className="bg-white border border-gray-100 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-black flex items-center">
              <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Gör så här
            </h2>
            {Array.isArray(instructions) ? (
              <ol className="space-y-4 list-decimal list-inside">
                {instructions.map((step, i) => (
                  <li key={i} className="flex items-start">
                    <div className="inline-flex items-start">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 text-black border-gray-300 rounded focus:ring-black mr-2"
                      />
                      <span className="text-gray-800 leading-relaxed">{step}</span>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-800">{instructions}</p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}