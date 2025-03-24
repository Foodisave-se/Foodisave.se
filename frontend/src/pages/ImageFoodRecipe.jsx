import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadPicture from "../components/UploadPicture";
import AiRecipeCard from "../components/AiRecipeCard";
import authStore from "../store/authStore";

export default function ImageFoodRecipe() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State för laddning
  const token = authStore((state) => state.token);
  const setUserData = authStore((state) => state.setUserData);
  const apiUrl = "http://localhost:8000/v1/suggest-recipe-from-plateimage";
  const navigate = useNavigate();

  // Callback: Spara filen och skapa en förhandsvisning.
  const handleFileSelected = (file) => {
    if (!token) {
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

  // Funktion för att ladda upp bilden till backend.
  const uploadImage = async () => {
    if (!selectedFile) return;
    setIsLoading(true); // Starta laddningsanimeringen
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

      // Spara den ursprungliga filen för senare S3-uppladdning när receptet sparas
      if (data && data.recipes && data.recipes.length > 0) {
        data.recipes[0].originalFile = selectedFile;
      }

      setResult(data);
      setError(null);

      // Hämta uppdaterad användardata
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
    setIsLoading(false); // Avsluta laddningsanimeringen
  };

  // Mappa API-svaret till ett receptobjekt som RecipeCard förstår
  let recipeToDisplay = null;
  if (result && result.recipes && result.recipes.length > 0) {
    const recipeFromApi = result.recipes[0];
    recipeToDisplay = {
      ...recipeFromApi,
      name: recipeFromApi.title,
      images: preview,
      originalFile: recipeFromApi.originalFile
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
            {/* UploadPicture-komponenten */}
            <div className="relative flex items-center">
              <UploadPicture onFileSelected={handleFileSelected} />
            </div>

            {/* Knapp för att ladda upp bilden */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={uploadImage}
                className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-[#888383] transition cursor-pointer"
              >
                Hämta Recept
              </button>
            </div>

            {/* Visa spinner om isLoading är true, annars visa förhandsvisningsbilden */}
            {isLoading ? (
              <div className="mt-8 flex justify-center">
                <div className="loader"></div>
              </div>
            ) : (
              !recipeToDisplay &&
              preview && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={preview}
                    alt="Förhandsvisning"
                    className="max-h-64"
                  />
                </div>
              )
            )}

            {/* Visa receptet om det finns */}
            {recipeToDisplay && (
              <div className="mt-6">
                <AiRecipeCard recipe={recipeToDisplay} />
              </div>
            )}

            {/* Visa eventuella fel */}
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
