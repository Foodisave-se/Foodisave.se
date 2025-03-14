import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DetailedRecipe() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hämta ut receptet från "state"
  const { recipe } = location.state || {};

  if (!recipe) {
    return (
      <div className="pt-24">
        <p className="text-center text-red-500 mt-4">Inget recept hittades.</p>
      </div>
    );
  }

  // Anta att AI-svaret har fält som 'instructions' (array) och 'ingredients' (array)
  // Om det skiljer sig åt, anpassa nedan
  const {
    name,
    images,
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
  } = recipe;

  return (
    <div className="pt-24 container max-w-7xl mx-auto px-4">
      {/* Tillbaka-knapp */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Tillbaka
      </button>

      {/* Översta sektionen: Titel, info till vänster & bild till höger */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Vänstra kolumnen (Titel + info) */}
        <div className="flex-1 order-2 md:order-1">
          <h1 className="text-4xl font-bold mb-3 text-black">{name}</h1>
          <p className="text-gray-600 mb-4">{description || "Ingen beskrivning"}</p>

          {/* Kort info-rad: portioner, tid, kategori */}
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span>{servings || "Okänd"} portioner</span>
            <span>|</span>
            <span>{cook_time || "Okänd tid"}</span>
            <span>|</span>
            <span>{category || "Okänd kategori"}</span>
          </div>

          {/* Näringsinformation */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <div>Energi: {energy || "?"} kcal</div>
            <div>Protein: {protein || "?"} g</div>
            <div>Kolhydrater: {carbohydrates || "?"} g</div>
            <div>Fett: {fat || "?"} g</div>
          </div>
        </div>

        {/* Högra kolumnen (Bild) */}
        <div className="md:w-1/2 order-1 md:order-2">
          {images && (
            <img
              src={images}
              alt={name}
              className="w-full h-auto rounded-lg object-cover"
            />
          )}
        </div>
      </div>

      {/* Andra sektionen: Ingredienser till vänster, Instruktioner till höger */}
      <div className="flex flex-col md:flex-row gap-8 mt-10">
        {/* Vänstra kolumnen: Ingredienser */}
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

        {/* Högra kolumnen: Instruktioner */}
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

          {/* Exempel: “Klart!”-sektion med betyg */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2 text-black">Klart!</h3>
            <p className="text-gray-700">Hur blev resultatet? Sätt betyg!</p>
            <div className="flex items-center gap-1 mt-2">
              {/* Här kan du lägga stjärnor eller annat */}
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.122-6.54L.49 6.91l6.557-.95L10 .5l2.952 5.46 6.557.95-4.754 4.64 1.122 6.54z" />
              </svg>
              {/* ... fler stjärnor */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
