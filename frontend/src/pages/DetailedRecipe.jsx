import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authStore from "../store/authStore";

export default function DetailedRecipe() {
  const navigate = useNavigate();
  const location = useLocation();
  const [imageSrc, setImageSrc] = useState(null);
  const [saveStatus, setSaveStatus] = useState({ saved: false, error: null, loading: false });
  const [imageUploadStatus, setImageUploadStatus] = useState({ uploading: false, error: null });
  const [error, setError] = useState(null);
  const token = authStore((state) => state.token);
  const BASE_API_URL = import.meta.env.VITE_API_URL;

  // Get the recipe from "state"
  const { recipe } = location.state || {};

  console.log(recipe)

  // Check if the recipe is already saved when component mounts
  useEffect(() => {
      const fetchImage = async () => {
        if (!recipe.id) return;
  
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
    }, [recipe.id, token]);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!recipe.id) return; // If recipe has no ID yet, it's not saved
      
      try {
        const response = await fetch(`${BASE_API_URL}/user-recipe/saved/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_recipe_id: recipe.id,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setSaveStatus(prev => ({ ...prev, saved: data.isSaved }));
        }
      } catch (error) {
        console.error("Error checking if recipe is saved:", error);
      }
    };
    
    if (token && recipe?.id) {
      checkIfSaved();
    }
  }, [recipe?.id, token, BASE_API_URL]);

  if (!recipe) {
    return (
      <div className="pt-24">
        <p className="text-center text-red-500 mt-4">Inget recept hittades.</p>
      </div>
    );
  }

  // Extract recipe data
  const {
    title,
    images,
    originalFile, // This will contain the actual file object to upload to S3
    description,
    category,
    ingredients,
    instructions,
    cook_time,
    servings,
    energy,
    protein,
    carbohydrates,
    fat,
    id: recipeId
  } = recipe;

  console.log(recipe)

  // Function to upload image to S3 after recipe creation
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
      
      return data.image_url; // Return the URL for the image
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      setImageUploadStatus({ uploading: false, error: error.message });
      return null;
    }
  };

  // Function to handle saving or unsaving the recipe
  const toggleSaveRecipe = async () => {
    // If already saving, prevent multiple clicks
    if (saveStatus.loading) return;
    
    setSaveStatus(prev => ({ ...prev, loading: true, error: null }));
    
    // If the recipe already has an ID, we can directly save/unsave it
    if (recipeId) {
      try {
        // If already saved, unsave it
        if (saveStatus.saved) {
          const response = await fetch(`${BASE_API_URL}/user-recipe/saved`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_recipe_id: recipeId,
            }),
          });
          
          if (response.ok) {
            setSaveStatus(prev => ({ ...prev, saved: false, loading: false }));
            console.log("Recept borttaget från sparade!");
          } else {
            throw new Error("Kunde inte ta bort receptet.");
          }
        } 
        // If not saved, save it
        else {
          const response = await fetch(`${BASE_API_URL}/user-recipe/saved`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_recipe_id: recipeId,
            }),
          });
          
          if (response.ok) {
            // If we have an original file, upload it to S3 after saving the recipe
            if (originalFile) {
              await uploadImageToS3(recipeId);
            }
            
            setSaveStatus(prev => ({ ...prev, saved: true, loading: false }));
            console.log("Recept sparat!");
          } else {
            throw new Error("Kunde inte spara receptet.");
          }
        }
      } catch (error) {
        console.error("Error toggling recipe save:", error);
        setSaveStatus(prev => ({ 
          ...prev, 
          error: error.message || "Ett fel uppstod. Försök igen senare.", 
          loading: false 
        }));
      }
    } 
    // If the recipe doesn't have an ID yet, we need to create it first
    else {
      try {
        // Ensure servings is an integer
        const servingsValue = typeof servings === 'string' 
          ? parseInt(servings, 10) 
          : servings;
          
        // First, create the AI recipe in the database
        const aiRecipePayload = {
          name: title,
          descriptions: description, 
          ingredients: Array.isArray(ingredients) 
              ? ingredients.join(", ") 
              : String(ingredients),
          instructions: Array.isArray(instructions) 
              ? instructions.join(", ") 
              : String(instructions),
          tags: category,
          cook_time,
          calories: energy,
          protein,
          carbohydrates,
          fat,
          is_ai: true,
          servings: servingsValue || 4 // Provide a default if missing
        };
        
        console.log('Sending payload:', aiRecipePayload);
        
        const response_1 = await fetch(`${BASE_API_URL}/ai/recipe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(aiRecipePayload)
        });
    
        
        if (!response_1.ok) {
          const errorData = await response_1.json();
          throw new Error(errorData.detail || `Error: ${response_1.status}`);
        }
        
        // Get the created recipe with its new ID
        const createdRecipe = await response_1.json();
    
        console.log('Created recipe:', createdRecipe);
        
        // Now save the recipe to the user's saved recipes using the new ID
        const response_2 = await fetch(`${BASE_API_URL}/user-recipe/saved`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ user_recipe_id: createdRecipe.id })
        });
        
        if (!response_2.ok) {
          const errorData = await response_2.json();
          throw new Error(errorData.detail || `Error: ${response_2.status}`);
        }
        
        // Update recipe with the ID for future reference
        recipe.id = createdRecipe.id;
        
        // Upload the image to S3 if we have one
        if (originalFile) {
          await uploadImageToS3(createdRecipe.id);
        }
        
        setSaveStatus({ saved: true, error: null, loading: false });
      } catch (err) {
        console.error('Error saving recipe:', err);
        setSaveStatus({ 
          saved: false, 
          error: err.message || 'Det gick inte att spara receptet.', 
          loading: false 
        });
      }
    }
  };

  return (
    <div className="pt-24 container max-w-7xl mx-auto px-4">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Tillbaka
      </button>

      {/* Top section: Title, info on left & image on right */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column (Title + info) */}
        <div className="flex-1 order-2 md:order-1">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold mb-3 text-black">{title}</h1>
            
            {/* Save/Unsave Recipe Button */}
            <button
              onClick={toggleSaveRecipe}
              disabled={saveStatus.loading || imageUploadStatus.uploading}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                saveStatus.saved 
                  ? 'bg-green-500 text-white' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {saveStatus.loading || imageUploadStatus.uploading ? (
                imageUploadStatus.uploading ? "Laddar upp bild..." : "Sparar..."
              ) : saveStatus.saved ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Sparat!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Spara recept
                </>
              )}
            </button>
          </div>
          
          {/* Error message */}
          {saveStatus.error && (
            <p className="text-red-500 mb-2">{saveStatus.error}</p>
          )}
          
          {/* Image upload error message */}
          {imageUploadStatus.error && (
            <p className="text-orange-500 mb-2">
              Receptet sparades men bilden kunde inte laddas upp: {imageUploadStatus.error}
            </p>
          )}
          
          <p className="text-gray-600 mb-4">{description || "Ingen beskrivning"}</p>

          {/* Info row: portions, time, category */}
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span>{servings || "Okänd"} portioner</span>
            <span>|</span>
            <span>{cook_time || "Okänd tid"}</span>
            <span>|</span>
            <span>{category || "Okänd kategori"}</span>
          </div>

          {/* Nutrition information */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <div>Energi: {energy || "?"}</div>
            <div>Protein: {protein || "?"} </div>
            <div>Kolhydrater: {carbohydrates || "?"} </div>
            <div>Fett: {fat || "?"} </div>
          </div>
        </div>

        {/* Right column (Image) */}
        <div className="md:w-1/2 order-1 md:order-2">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-auto rounded-lg object-cover"
            />
          ) : (
            <img
              src={images}
              alt={title}
              className="w-full h-auto rounded-lg object-cover"
            />)}
        </div>
      </div>

      {/* Second section: Ingredients on left, Instructions on right */}
      <div className="flex flex-col md:flex-row gap-8 mt-10">
        {/* Left column: Ingredients */}
        <div className="md:w-1/3">
          <h2 className="text-2xl font-semibold mb-3 text-black">Ingredienser</h2>
          {Array.isArray(ingredients) ? (
            <ul className="list-disc list-inside text-gray-800">
              {ingredients.map((ing, i) => (
                <li key={i} className="mb-1">
                  {ing}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-800">{ingredients}</p>
          )}
        </div>

        {/* Right column: Instructions */}
        <div className="md:w-2/3">
          <h2 className="text-2xl font-semibold mb-3 text-black">Gör så här</h2>
          {Array.isArray(instructions) ? (
            <ol className="list-decimal list-inside text-gray-800 space-y-2">
              {instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-800">{instructions}</p>
          )}

          {/* "Klart!"-section with rating */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2 text-black">Klart!</h3>
            <p className="text-gray-700">Hur blev resultatet? Sätt betyg!</p>
            <div className="flex items-center gap-1 mt-2">
              {/* Stars */}
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.122-6.54L.49 6.91l6.557-.95L10 .5l2.952 5.46 6.557.95-4.754 4.64 1.122 6.54z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}