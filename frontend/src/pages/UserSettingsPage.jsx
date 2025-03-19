import React, { useEffect, useState } from "react";
import authStore from "../store/authStore";

function UserSettingsPage() {
  const BASE_API_URL = import.meta.env.VITE_API_URL;
  const token = authStore((state) => state.token);
  const userData = authStore((state) => state.userData);
  const fetchUser = authStore((state) => state.fetchUser);
  const setUserData = authStore((state) => state.setUserData);

  // Profile form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Password change form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Load user data
  useEffect(() => {
    fetchUser();
    setFirstName(userData.first_name || "");
    setLastName(userData.last_name || "");
    setEmail(userData.email || "");
  }, []);

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${BASE_API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Misslyckades uppdatera profil!");
      }

      // Update local state with new data
      setUserData(data);
      setProfileMessage({
        type: "success",
        text: "Profilen lyckades uppdateras!",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setProfileMessage({
        type: "error",
        text: error.message || "An error occurred",
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Lösenorden matchar inte" });
      return;
    }

    setIsPasswordLoading(true);
    setPasswordMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${BASE_API_URL}/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Misslyckades att uppdatera lösenordet");
      }

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage({
        type: "success",
        text: "Lösenordet har ändrats!",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordMessage({
        type: "error",
        text: error.message || "An error occurred",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto mt-20">
        {/* Profile Information Form */}
        <div className="rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Profil Information
          </h2>

          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="firstName"
                >
                  Förnamn
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-black rounded-md focus:outline-none bg-white"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="lastName"
                >
                  Efternamn
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-black rounded-md focus:outline-none bg-white"
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="email"
              >
                E-postadress
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-black rounded-md focus:outline-none bg-white"
              />
            </div>

            {profileMessage.text && (
              <div
                className={`p-4 mb-6 rounded-md ${
                  profileMessage.type === "success"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {profileMessage.text}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isProfileLoading}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-[#888383] transition cursor-pointer"
              >
                {isProfileLoading ? "Sparar..." : "Spara Ändringar"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Byt Lösenord
          </h2>

          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-6">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="currentPassword"
              >
                Nuvarande Lösenord
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-black rounded-md focus:outline-none bg-white"
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="newPassword"
              >
                Nytt Lösenord
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-black rounded-md focus:outline-none bg-white"
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="confirmPassword"
              >
                Bekräfta Nytt Lösenord
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-black rounded-md focus:outline-none bg-white"
              />
            </div>

            {passwordMessage.text && (
              <div
                className={`p-4 mb-6 rounded-md ${
                  passwordMessage.type === "success"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {passwordMessage.text}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPasswordLoading}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-[#888383] transition cursor-pointer"
              >
                {isPasswordLoading ? "Byter..." : "Byt Lösenord"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserSettingsPage;
