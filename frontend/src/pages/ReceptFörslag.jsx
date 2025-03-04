import React, { useState } from "react";

export default function ReceptFörslag() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = "http://localhost:8000/v1/suggest_recipes";

  // Funktion för att hämta receptförslag
  const fetchRecipes = async () => {
    if (!ingredients.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}?ingredients=${encodeURIComponent(ingredients)}`);
      if (!response.ok) {
        throw new Error("Något gick fel vid hämtning av receptförslag");
      }
      const data = await response.json();
      setRecipes(data.suggested_recipes || []);
    } catch (error) {
      console.error("Fel:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Funktion för att hantera Enter-tangenten
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchRecipes();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url('/background_foodisave.jpg')` }}
    >
      <div className="w-full max-w-2xl bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Lägg till dina ingredienser och får förslag på recept</h1>

        {/* Inputfält för ingredienser */}
        <div className="relative w-full max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Ange ingredienser (t.ex. kyckling, pasta, tomat)..."
            className="w-full p-3 pl-4 pr-14 rounded-full text-gray-800 shadow-xl focus:ring-2 focus:ring-green-300 outline-none"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={fetchRecipes}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-green-300 text-white p-2 rounded-full hover:bg-green-400 transition cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5 sm:h-6 sm:w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </div>

        {/* Visar en laddningsindikator */}
        {loading && (
          <div className="mx-auto w-full max-w-sm rounded-md p-4 m-4">
            <div className="flex animate-pulse space-x-4">
              <div className="size-10 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 rounded bg-gray-200"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                    <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                  </div>
                  <div className="h-2 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Visar eventuella felmeddelanden */}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {/* Visning av receptförslag */}
        {recipes.length > 0 && !loading && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Receptförslag</h2>
            <ul className="space-y-4">
              {recipes.map((recipe, index) => (
                
                <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold">{recipe.title}</h3>
                  <p className="text-sm text-gray-700">{recipe.description}</p>

                  <h4 className="font-semibold mt-2">Tillagningstid:</h4>
                  <p>{recipe.time} - Svårighetsgrad: {recipe.difficulty}</p>

                  <h4 className="font-semibold mt-2">Ingredienser:</h4>
                  <ul className="list-disc pl-5 text-gray-600">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i}>
                        {ing.amount} {ing.unit} {ing.name}
                      </li>
                    ))}
                  </ul>

                  <h4 className="font-semibold mt-2">Instruktioner:</h4>
                  <ol className="list-decimal pl-5 text-gray-600">
                    {recipe.instructions.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}