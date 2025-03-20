import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadPicture from "../components/UploadPicture";
import AiRecipeCard from "../components/AiRecipeCard";
import authStore from "../store/authStore";

export default function ImageRecipe() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const token = authStore((state) => state.token);
  const setUserData = authStore((state) => state.setUserData);
  const apiUrl = "http://localhost:8000/v1/suggest-recipe-from-plateimage";
  const navigate = useNavigate();

  // Callback från UploadPicture: Om användaren inte är inloggad, omdirigera till login med state,
  // annars spara filen och skapa en förhandsvisning.
  const handleFileSelected = (file) => {
    if (!token) {
      // Användaren är inte inloggad – skicka till login med redirect tillbaka till ImageRecipe
      navigate("/login", { state: { redirectTo: "/imagerecipeplate" } });
      return;
    }
    setSelectedFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  // Funktion för att ladda upp bilden till backend (anropas från ImageRecipe-sidan)
  const uploadImage = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Fel vid uppladdning av bilden");
      }

      const data = await response.json();
      setResult(data);
      setError(null);
      
      // Efter ett lyckat anrop, hämta den uppdaterade användardatan
      const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        method: "GET",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (userResponse.ok) {
        const updatedUserData = await userResponse.json();
        setUserData(updatedUserData);
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      setResult(null);
    }
  };

  // Om vi har ett API-svar, mappa det till ett receptobjekt som RecipeCard förstår
  let recipeToDisplay = null;
  if (result && result.recipes && result.recipes.length > 0) {
    const recipeFromApi = result.recipes[0];
    recipeToDisplay = {
      ...recipeFromApi,
      name: recipeFromApi.title, // Mappa titeln från API:t till RecipeCard's name
      images: preview,           // Använd den uppladdade bilden (preview)
    };
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-24">
      <div className="mt-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-3xl font-bold text-center text-black">
            Recept via Maträtt
          </h2>
          <div className="px-4 py-8 sm:rounded-lg sm:px-10">
            {/* Använd UploadPicture-komponenten */}
            <div className="relative flex items-center">
              <UploadPicture onFileSelected={handleFileSelected} />
            </div>

            {/* Knapp för att ladda upp bilden – den används endast om användaren klickar direkt i input-fältet */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={uploadImage}
                className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-[#888383] transition cursor-pointer"
              >
                Hämta Recept
              </button>
            </div>

            {/* Förhandsvisning av vald bild */}
            {!recipeToDisplay && preview && (
              <div className="mt-4 flex justify-center">
                <img src={preview} alt="Förhandsvisning" className="max-h-64" />
              </div>
            )}

            {/* Om vi har ett recept, visa det som ett RecipeCard */}
            {recipeToDisplay && (
              <div className="mt-6">
                <AiRecipeCard recipe={recipeToDisplay} />
              </div>
            )}

            {/* Visar eventuella fel */}
            {error && (
              <div className="mt-6 p-4 bg-red-100 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-red-900">Fel</h2>
                <p className="text-red-700 mt-2">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
