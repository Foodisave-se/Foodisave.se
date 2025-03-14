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
      setServerError("Invalid activation link.");
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
        setSuccess("Your account has been activated successfully.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        const errorData = await response.json();
        setServerError(errorData.detail || "Activation failed.");
      }
    } catch (error) {
      console.error("Activation error:", error);
      setServerError("An unexpected error occurred.");
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
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Activating..." : "Activate Account"}
        </button>
      )}
    </div>
  );
};

export default ActivationForm;
