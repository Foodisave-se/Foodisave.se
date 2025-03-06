import { create } from "zustand";
const API_URL = import.meta.env.VITE_API_URL;

const loadInitialState = () => {
  const token = localStorage.getItem("token") || null;
  const userData = JSON.parse(localStorage.getItem("userData")) || null;

  // Attempt to parse the user data from localStorage or set to null if not found
  return { token: token, userData };
};

const authStore = create((set, get) => ({
  ...loadInitialState(),
  setToken: (token) => {
    localStorage.setItem("token", token); // Save the token to localStorage
    set(() => ({ token }));
  },
  logout: () => {
    localStorage.removeItem("token");

    set(() => ({
      token: null,
    }));
  },
  setUserData: (userData) => {
    localStorage.setItem("userData", JSON.stringify(userData)); // Save the user data to localStorage
    set(() => ({ userData }));
  },
  fetchUser: async () => {
    const { token, logout, setUserData } = get(); // Accessing current state and actions
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const userData = await response.json();
        setUserData(userData);
        console.log(userData);
      } else if (response.status === 401) {
        logout();
        // You might need to handle navigation to /login outside this store, as Zustand doesn't manage routing
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("There was an error fetching user data:", error);
      // Handle error as needed
    }
  },
}));

export default authStore;
