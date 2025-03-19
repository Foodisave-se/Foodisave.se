import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ActivationForm = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/v1";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setServerError("Ogiltig aktiveringslänk.");
    }
  }, [token]);

  const handleActivate = async () => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/auth/activate/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
      });
      if (response.ok) {
        setSuccess("Lyckades aktivera ditt konto. Välkommen till foodisave");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        const errorData = await response.json();
        setServerError(errorData.detail || "Misslyckad aktivering");
      }
    } catch (error) {
      console.error("Activation error:", error);
      setServerError("Ett oväntat fel inträffade");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {serverError && <p className="text-red-600">{serverError}</p>}
      {success && <p className="text-green-600">{success}</p>}
      {!success && !serverError && (
        <button
          onClick={handleActivate}
          className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md shadow-sm hover:bg-[#888383] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#888383] cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Aktiverar..." : "Aktivera konto"}
        </button>
      )}
    </div>
  );
};

export default ActivationForm;
