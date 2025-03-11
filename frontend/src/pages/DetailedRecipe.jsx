import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

export default function DetailedRecipe() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = "http://localhost:8000/v1";

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/recipe/${id}`);
        if (!response.ok) {
          throw new Error("Kunde inte hämta receptdetaljer");
        }
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500 mt-4">Laddar recept...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-24">
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* Tillbaka-knapp */}
        <button
          onClick={() => {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1); // Gå tillbaka i webbläsarhistoriken
            } else {
              navigate(`/search?${searchParams.toString()}`); // Om ingen historik finns, gå till söksidan
            }
          }}
          className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition mb-4 cursor-pointer"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Tillbaka
        </button>

        <h1 className="text-3xl font-bold text-black">{recipe.name}</h1>
        <img src={recipe.images} alt={recipe.name} className="w-xl h-64 object-cover rounded-lg mt-4" />
        
        <div className="flex flex-col md:flex-row mt-6">
          {/* Ingredienser */}
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-xl font-semibold mb-3">Ingredienser</h2>
            <ul className="list-disc list-inside text-gray-600">
              {recipe.ingredients.split("|").map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          {/* Instruktioner */}
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-xl font-semibold mb-3">Gör så här</h2>
            <p className="text-gray-600 whitespace-pre-line">{recipe.steps}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
