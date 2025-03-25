import React, { useState, useEffect } from "react";
import authStore from "../store/authStore";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    credits: 0,
    is_admin: false
  });

  const token = authStore((state) => state.token);
  const BASE_API_URL = import.meta.env.VITE_API_URL;

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_API_URL}/user`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token, BASE_API_URL]);

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      credits: user.credits || 0,
      is_admin: user.is_admin || false
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Update user profile
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_API_URL}/admin/profile/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          credits: formData.credits,
          is_admin: formData.is_admin
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update user");
      }

      const updatedUser = await response.json();
      
      // Update users list
      setUsers(prev => 
        prev.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        )
      );

      // Reset selection
      setSelectedUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Error Handling */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="flex">
        {/* User List */}
        <div className="w-1/3 pr-4 overflow-y-auto max-h-[600px]">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <ul className="space-y-2">
              {users.map((user) => (
                <li 
                  key={user.id} 
                  onClick={() => handleUserSelect(user)}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    selectedUser?.id === user.id 
                      ? "bg-blue-100 border-l-4 border-blue-500" 
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{user.first_name} {user.last_name}</span>
                    {user.is_admin && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* User Edit Form */}
        <div className="w-2/3 pl-4 border-l">
          <h2 className="text-xl font-semibold mb-4">
            {selectedUser ? `Edit User: ${selectedUser.first_name} ${selectedUser.last_name}` : "Select a User"}
          </h2>
          
          {selectedUser && (
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
              </div>

              <div>
                <label htmlFor="credits" className="block text-sm font-medium text-gray-700">
                  Credits
                </label>
                <input
                  type="number"
                  id="credits"
                  name="credits"
                  value={formData.credits}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_admin"
                  name="is_admin"
                  checked={formData.is_admin}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-900">
                  Admin User
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Update User"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}