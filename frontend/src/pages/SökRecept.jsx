import React, { useState } from "react";

export default function SökRecept() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recept, setRecept] = useState([]);
  const [selectedRecept, setSelectedRecept] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [calories, setCalories] = useState("");
  const [carbohydrates, setCarbohydrates] = useState("");
  const [protein, setProtein] = useState("");
  const [recipeType, setRecipeType] = useState("");

  const apiUrl = "http://localhost:8000/v1/search/recipe"; 

  // Funktion för att söka recept
  const fetchRecept = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build the query parameters according to the schema
      const params = new URLSearchParams({
        query: searchTerm,
      });
      
      // Add optional filters if they have values
      if (carbohydrates) params.append('carbohydrates', carbohydrates);
      if (calories) params.append('calories', calories);
      if (protein) params.append('protein', protein);
      if (recipeType) params.append('recipe_type', recipeType);

      const response = await fetch(`${apiUrl}?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Something went wrong");
      }
      
      const data = await response.json();
      setRecept(data);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Funktion för att hämta detaljer om ett specifikt recept
  const fetchReceptDetail = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/${id}`);
      if (!response.ok) {
        throw new Error("Receptet hittades inte");
      }
      const data = await response.json();
      setSelectedRecept(data);
    } catch (error) {
      console.error("Fel:", error);
    }
  };

  // Funktion för att hantera "Enter" i input
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchRecept();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url('/background_foodisave.jpg')` }}
    >
      <div className="w-full max-w-2xl bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Sök på 1000-tals recept och bli inspirerad</h1>

        {/* Sökfält */}
        <div className="relative w-full max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Sök recept, ingrediens osv..."
            className="w-full p-3 pl-4 pr-14 rounded-full text-gray-800 shadow-xl focus:ring-2 focus:ring-green-300 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            type="text"
            placeholder="calories"
            className="w-full p-3 pl-4 pr-14 rounded-full text-gray-800 shadow-xl focus:ring-2 focus:ring-green-300 outline-none"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            type="text"
            placeholder="carbohydrates"
            className="w-full p-3 pl-4 pr-14 rounded-full text-gray-800 shadow-xl focus:ring-2 focus:ring-green-300 outline-none"
            value={carbohydrates}
            onChange={(e) => setCarbohydrates(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            type="text"
            placeholder="protein"
            className="w-full p-3 pl-4 pr-14 rounded-full text-gray-800 shadow-xl focus:ring-2 focus:ring-green-300 outline-none"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            type="text"
            placeholder="typ av rätt, ex, fågel, kött, fisk"
            className="w-full p-3 pl-4 pr-14 rounded-full text-gray-800 shadow-xl focus:ring-2 focus:ring-green-300 outline-none"
            value={recipeType}
            onChange={(e) => setRecipeType(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={fetchRecept}
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

        {/* Visning av receptlista */}
        {recept.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Receptlista</h2>
            <ul className="space-y-2">
              {recept.map((r) => (
                <li
                  key={r.id}
                  className="cursor-pointer p-3 bg-gray-100 rounded-lg hover:bg-green-200 transition"
                  onClick={() => fetchReceptDetail(r.id)}
                >
                  {r.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Visning av valt recept */}
        {selectedRecept && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">{selectedRecept.name}</h2>
            <p className="text-gray-700 mt-2">{selectedRecept.description}</p>

            <h3 className="font-semibold mt-4">Ingredienser:</h3>
            <ul className="list-disc list-inside text-gray-600">
              {selectedRecept.ingredients.map((ing, index) => (
                <li key={index}>{ing}</li>
              ))}
            </ul>

            <h3 className="font-semibold mt-4">Instruktioner:</h3>
            <ul className="list-decimal list-inside text-gray-600">
              {selectedRecept.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
