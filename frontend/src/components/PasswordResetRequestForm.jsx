import React, { useState } from "react";

const PasswordResetRequestForm = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/v1";

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [serverError, setServerError] = useState("");
  
  // Här lagrar vi eventuellt lyckat meddelande från backend
  const [successMessage, setSuccessMessage] = useState("");
  // Styr om modalen ska synas
  const [showModal, setShowModal] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stäng modal-funktion
  const closeModal = () => {
    setShowModal(false);
  };

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("E-postadress krävs");
      return false;
    } else if (!regex.test(email)) {
      setEmailError("Det måste vara en riktig E-postadress");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (!validateEmail()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/auth/password-reset/request`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // Lyckad respons – hämta meddelandet från backend
        const data = await response.json();
        // Sätt meddelandet i successMessage + visa modal
        setSuccessMessage(data.message);
        setShowModal(true);
        setEmail("");
      } else {
        const errorData = await response.json();
        setServerError(
          errorData.detail ||
            "Misslyckades med att skicka återställningslänken. Vänligen försök igen."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setServerError("Ett oväntat fel uppstod. Vänligen försök igen senare");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-postadress
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
                className="block w-full px-3 py-2 border border-black rounded-md focus:outline-none bg-white sm:text-sm"
                disabled={isSubmitting}
              />
              {emailError && (
                <p className="mt-2 text-sm text-red-600">{emailError}</p>
              )}
            </div>
            <div className="my-2">
              {serverError && (
                <p className="mt-2 text-sm text-red-600">{serverError}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md shadow-sm hover:bg-[#888383] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#888383] cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Skickar..." : "Skicka återställningslänk"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL för att visa lyckat meddelande */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-black text-white p-4 rounded-md max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stäng-knapp (X) */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white cursor-pointer hover:text-gray-300"
              aria-label="Close"
            >
              X
            </button>

            {/* Själva meddelandet */}
            <p className="pr-6">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordResetRequestForm;
