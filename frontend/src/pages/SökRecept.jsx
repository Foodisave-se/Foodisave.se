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

  const apiUrl = "http://localhost:8000/v1";

  const fetchRecept = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ query: searchTerm });
      if (carbohydrates) params.append("carbohydrates", carbohydrates);
      if (calories) params.append("calories", calories);
      if (protein) params.append("protein", protein);
      if (recipeType) params.append("recipe_type", recipeType);

      const response = await fetch(`${apiUrl}/search/recipe?${params}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Something went wrong");
      }

      const data = await response.json();
      setRecept(data);
      setSelectedRecept(null); 
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipeDetails = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/recipe/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipe details");
      }
      const data = await response.json();
      setSelectedRecept(data);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAiRecipe = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/modify-recipe/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch AI recipe");
      }
      const data = await response.json();
      setSelectedRecept(data);
    } catch (error) {
      console.error("Error fetching AI recipe:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse ingredients
  const parseIngredients = (ingredientsString) => {
    return ingredientsString.split('|').map(ingredient => {
      const [item, quantity] = ingredient.trim().split(':').map(part => part.trim());
      return { item, quantity };
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchRecept();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url('/background_foodisave.jpg')` }}>
      <div className="w-full max-w-2xl bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Sök på 1000-tals recept och bli inspirerad</h1>

        <div className="relative w-full max-w-lg mx-auto space-y-3">
          <input type="text" placeholder="Sök recept, ingrediens osv..." className="w-full p-3 rounded-lg text-gray-800 shadow focus:ring-2 focus:ring-green-300 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown} />
          <input type="text" placeholder="Kalorier" className="w-full p-3 rounded-lg text-gray-800 shadow focus:ring-2 focus:ring-green-300 outline-none" value={calories} onChange={(e) => setCalories(e.target.value)} onKeyDown={handleKeyDown} />
          <input type="text" placeholder="Kolhydrater" className="w-full p-3 rounded-lg text-gray-800 shadow focus:ring-2 focus:ring-green-300 outline-none" value={carbohydrates} onChange={(e) => setCarbohydrates(e.target.value)} onKeyDown={handleKeyDown} />
          <input type="text" placeholder="Protein" className="w-full p-3 rounded-lg text-gray-800 shadow focus:ring-2 focus:ring-green-300 outline-none" value={protein} onChange={(e) => setProtein(e.target.value)} onKeyDown={handleKeyDown} />
          <input type="text" placeholder="Typ av rätt, ex fågel, kött, fisk" className="w-full p-3 rounded-lg text-gray-800 shadow focus:ring-2 focus:ring-green-300 outline-none" value={recipeType} onChange={(e) => setRecipeType(e.target.value)} onKeyDown={handleKeyDown} />
          <button onClick={fetchRecept} className="w-full p-3 bg-green-400 text-white rounded-lg hover:bg-green-500 transition">Sök</button>
        </div>

        {loading && <p className="mt-4 text-center text-gray-600">Laddar...</p>}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}

        {recept.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Receptlista</h2>
            <ul className="space-y-2">
              {recept.map((r) => (
                <li key={r.id} className="cursor-pointer p-3 bg-gray-100 rounded-lg hover:bg-green-200 transition" onClick={() => fetchRecipeDetails(r.id)}>
                  {r.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedRecept && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md">
            <img src={selectedRecept.images} alt={selectedRecept.name} className="w-full h-40 object-cover rounded-lg mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">{selectedRecept.name}</h2>
            <p className="text-gray-700 mt-2">{selectedRecept.descriptions}</p>
            <h3 className="font-semibold mt-4">Ingredienser:</h3>
            {selectedRecept.ingredients && (
              <ul className="list-disc list-inside text-gray-600">
                {parseIngredients(selectedRecept.ingredients).map((ingredient, index) => (
                  <li key={index} className="mb-1">
                    {ingredient.item} {ingredient.quantity && `- ${ingredient.quantity}`}
                  </li>
                ))}
              </ul>
            )}
            <h3 className="font-semibold mt-4">Instruktioner:</h3>
            <p className="text-gray-600">{selectedRecept.steps}</p>
          </div>
        )}
      </div>
    </div>
  );
}
