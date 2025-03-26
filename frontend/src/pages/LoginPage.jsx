import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  const location = useLocation();
  // Hämtar ev. redirect-destination, default = "/"
  const redirectTo = location.state?.redirectTo || "/";
  // Hämtar ev. aktiveringsmeddelande
  const activationMessage = location.state?.activationMessage || "";

  // Lokalt state för att styra om modalen ska synas
  const [showModal, setShowModal] = useState(false);

  // När komponenten laddar, kolla om vi har ett activationMessage
  useEffect(() => {
    if (activationMessage) {
      setShowModal(true);
    }
  }, [activationMessage]);

  // Funktion för att stänga modalen
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-w-w-full max-w-md mx-auto px-4 pt-24">
      {/* Modal-overlay: visas endast om showModal är true */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={closeModal}  // Klickar man på overlay stängs modalen
        >
          <div
            className="relative bg-black text-white p-4 rounded-md max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()} 
            // stopPropagation förhindrar att klick på själva rutan
            // stänger modalen
          >
            {/* Stäng-knapp (X) */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white hover:text-gray-300 cursor-pointer"
              aria-label="Close"
            >
              X
            </button>

            {/* Själva meddelandet */}
            <p className="pr-6">
              {activationMessage}
            </p>
          </div>
        </div>
      )}

      <div className="mt-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-3xl font-bold text-center text-black">
            Logga in
          </h2>
          {/* Skicka med redirectTo till LoginForm */}
          <LoginForm redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
