import React, { useState } from 'react';
import authStore from '../store/authStore';

const SaveRecipePage = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const BASE_API_URL = import.meta.env.VITE_API_URL;
  const token = authStore((state) => state.token);

  const fetchSavedRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      // Send GET request with Authorization header
      const response = await fetch(`${BASE_API_URL}/saved/recipe`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Check if response is ok (status in 200-299 range)
      if (!response.ok) {
        // Parse error response
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error: ${response.status}`);
      }
      
      // Parse the JSON data from the response
      const data = await response.json();
      setSavedRecipes(data);
      console.log(data);
    } catch (err) {
      console.error('Error fetching saved recipes:', err);
      setError(err.message || 'Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='mt-50'>
        <button className='bg-black text-white p-2 rounded' onClick={fetchSavedRecipes}>
          Fetch Saved Recipes
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      
      {error && <p className="text-red-500">{error}</p>}
      
      {savedRecipes.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Your Saved Recipes</h2>
          <ul className="mt-2">
            {savedRecipes.map(recipe => (
              <li key={recipe.id} className="mb-2">{recipe.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SaveRecipePage;