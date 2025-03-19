import React, { useState, useEffect } from "react";
import UploadPicture from "../components/UploadPicture";
import authStore from "../store/authStore";

export default function GroceryItems() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [items, setItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editFormData, setEditFormData] = useState({ item: "", size: "" });
  
  const token = authStore((state) => state.token);
  const setUserData = authStore((state) => state.setUserData);
  const apiUrl = "http://localhost:8000/v1/save-bought-items";
  
  // Fetch saved items on component mount
  useEffect(() => {
    fetchSavedItems();
  }, []);

  // Fetch saved items from the API
  const fetchSavedItems = async () => {
    try {
      const response = await fetch("http://localhost:8000/v1/saved-items", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // It's okay if there are no saved items
          setSavedItems([]);
          return;
        }
        throw new Error("Failed to fetch saved items");
      }

      const data = await response.json();
      setSavedItems(data);
    } catch (err) {
      console.error("Error fetching saved items:", err);
      setError(err.message);
    }
  };

  // Handle file selection from UploadPicture component
  const handleFileSelected = (file) => {
    setSelectedFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  // Upload image to backend
  const uploadImage = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setError(null);
    
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
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setItems(data.items || []);
      
      // Update user data after successful upload
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
    } finally {
      setIsLoading(false);
    }
  };

  // Save item to database
  const saveItem = async (item) => {
    try {
      const response = await fetch("http://localhost:8000/v1/saved-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item: item.name,
          size: item.size
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save item");
      }

      const savedItem = await response.json();
      setSavedItems([...savedItems, savedItem]);
      
      // Remove the item from the detected items list
      setItems(items.filter(i => i.name !== item.name));
    } catch (err) {
      console.error("Error saving item:", err);
      setError(err.message);
    }
  };

  // Delete item from database
  const deleteItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:8000/v1/saved-items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      // Remove the item from the saved items list
      setSavedItems(savedItems.filter(item => item.id !== itemId));
    } catch (err) {
      console.error("Error deleting item:", err);
      setError(err.message);
    }
  };

  // Handle edit form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Start editing an item
  const startEdit = (item) => {
    setEditItem(item.id);
    setEditFormData({
      item: item.item,
      size: item.size
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditItem(null);
    setEditFormData({ item: "", size: "" });
  };

  // Update item in database
  const updateItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:8000/v1/saved-items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      const updatedItem = await response.json();
      
      // Update the saved items list
      setSavedItems(savedItems.map(item => 
        item.id === itemId ? updatedItem : item
      ));
      
      // Reset edit mode
      setEditItem(null);
      setEditFormData({ item: "", size: "" });
    } catch (err) {
      console.error("Error updating item:", err);
      setError(err.message);
    }
  };

  // Clear all detected items
  const clearDetectedItems = () => {
    setItems([]);
    setPreview(null);
    setSelectedFile(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-24">
      <div className="mt-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
          <h2 className="text-3xl font-bold text-center text-black mb-6">
            Mina Inköp
          </h2>
          
          {/* Upload section */}
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 mb-8">
            <h3 className="text-xl font-semibold mb-4">Lägg till nya varor</h3>
            <div className="relative flex items-center">
              <UploadPicture onFileSelected={handleFileSelected} />
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={uploadImage}
                disabled={!selectedFile || isLoading}
                className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-[#888383] transition cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isLoading ? "Laddar..." : "Hämta Råvaror"}
              </button>
            </div>

            {/* Preview of selected image */}
            {preview && (
              <div className="mt-4 flex justify-center">
                <img src={preview} alt="Förhandsvisning" className="max-h-64" />
              </div>
            )}
          </div>

          {/* Detected items section */}
          {items.length > 0 && (
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Identifierade varor</h3>
                <button
                  onClick={clearDetectedItems}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Rensa alla
                </button>
              </div>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.size}</p>
                    </div>
                    <button
                      onClick={() => saveItem(item)}
                      className="bg-black text-white px-3 py-1 rounded-md hover:bg-[#888383] transition text-sm"
                    >
                      Spara
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved items section */}
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <h3 className="text-xl font-semibold mb-4">Sparade varor</h3>
            
            {savedItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Inga sparade varor ännu</p>
            ) : (
              <div className="space-y-3">
                {savedItems.map((item) => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-md">
                    {editItem === item.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          name="item"
                          value={editFormData.item}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded-md"
                          placeholder="Vara"
                        />
                        <input
                          type="text"
                          name="size"
                          value={editFormData.size}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded-md"
                          placeholder="Storlek"
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                          >
                            Avbryt
                          </button>
                          <button
                            onClick={() => updateItem(item.id)}
                            className="px-3 py-1 text-sm bg-black text-white rounded-md hover:bg-[#888383]"
                          >
                            Spara
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.item}</p>
                          <p className="text-sm text-gray-500">{item.size}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEdit(item)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            Redigera
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Ta bort
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error display */}
          {error && (
            <div className="mt-6 p-4 bg-red-100 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-red-900">Fel</h2>
              <p className="text-red-700 mt-2">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}