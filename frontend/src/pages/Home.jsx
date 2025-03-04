import React from "react";

export default function HomePage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('/background_foodisave.jpg')`,
      }}
    >
      <div className="w-full max-w-2xl text-center bg-white bg-opacity-80 p-20 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 drop-shadow-md mb-4">
          Lägg till dina livsmedel & sök på recept
        </h1>
        <div className="relative w-full max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Sök recept, ingrediens osv..."
            className="w-full p-3 pl-4 pr-14 rounded-full text-gray-800 shadow-xl focus:ring-2 focus:ring-green-300 outline-none"
          />
          <button className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-green-300 text-white p-2 rounded-full hover:bg-green-400 transition cursor-pointer">
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
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button className="bg-green-300 text-gray-800 px-4 py-2 rounded-full hover:scale-95 transition-all duration-300 text-lg shadow-md hover:bg-green-400">
            Frukt
          </button>
          <button className="bg-green-300 text-gray-800 px-4 py-2 rounded-full hover:scale-95 transition-all duration-300 text-lg shadow-md hover:bg-green-400">
            Grönsaker
          </button>
          <button className="bg-green-300 text-gray-800 px-4 py-2 rounded-full hover:scale-95 transition-all duration-300 text-lg shadow-md hover:bg-green-400">
            Kött
          </button>
          <button className="bg-green-300 text-gray-800 px-4 py-2 rounded-full hover:scale-95 transition-all duration-300 text-lg shadow-md hover:bg-green-400">
            Vego
          </button>
          <button className="bg-green-300 text-gray-800 px-4 py-2 rounded-full hover:scale-95 transition-all duration-300 text-lg shadow-md hover:bg-green-400">
            Fågel
          </button>
          <button className="bg-green-300 text-gray-800 px-4 py-2 rounded-full hover:scale-95 transition-all duration-300 text-lg shadow-md hover:bg-green-400">
            Kryddor
          </button>
          <button className="bg-green-300 text-gray-800 px-4 py-2 rounded-full hover:scale-95 transition-all duration-300 text-lg shadow-md hover:bg-green-400">
            Såser
          </button>
        </div>
      </div>
    </div>
  );
}
