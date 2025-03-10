import React, { useState } from "react";

export default function ImageRecipe() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const apiUrl = "http://localhost:8000/v1/suggest_recipe_from_image";

  // Hantera filval och skapa en förhandsvisning
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  // Funktion för att ladda upp bilden
  const uploadImage = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Fel vid uppladdning av bilden");
      }

      const data = await response.json();
      setResult(data);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6 pt-24"
    >
      <div className="w-full max-w-2xl bg-opacity-90 p-8 rounded-2xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Föreslår recept baserat på ingredienserna i bilden
        </h1>

        {/* Filuppladdningsfält */}
        <div className="relative w-full max-w-lg mx-auto">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border rounded-md"
          />
        </div>

        {/* Förhandsvisning av vald bild */}
        {preview && (
          <div className="mt-4 flex justify-center">
            <img src={preview} alt="Förhandsvisning" className="max-h-64" />
          </div>
        )}

        {/* Knapp för att ladda upp bilden */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={uploadImage}
            className="bg-black text-white p-2 rounded-full hover:bg-[#888383] transition cursor-pointer"
          >
            Ladda upp bild
          </button>
        </div>

        {/* Visar receptförslag */}
        {result && (
          <div className="mt-6 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">Receptförslag</h2>
            <pre className="text-gray-700 mt-2">
              {JSON.stringify(result, null, 2)}
            </pre>
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
  );
}
