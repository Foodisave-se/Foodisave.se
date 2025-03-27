import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const ResetPasswordForm = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/v1";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setServerError("Ogiltig länk för återställning av lösenord. Vänligen begär en ny.");
    }
  }, [token]);

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Lösenord Krävs");
      return false;
    } else if (password.length < 8) {
      setPasswordError("Lösenordet måste innehålla minst 8 tecken");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError("Bekräfta ditt Lösenord");
      return false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Lösenorden matchar inte");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    setSuccess("");

    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();
    if (!isPasswordValid || !isConfirmValid || !token) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/auth/password-reset/confirm`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, new_password: password }),
      });
      if (response.ok) {
        setSuccess("Ändring av ditt Lösenord har genomförts");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        
        setServerError(
          "Misslyckades återställa ditt Lösenord. Länken du har kan vara förbrukad."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setServerError("Ett oväntat fel inträffade. Vänligen försök igen");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-lg px-8 pt-6 pb-8">
          {!token ? (
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-4">Ogiltig återställningslänk</h3>
              <p className="text-red-700 mb-6">
                Denna länk för att återställa ditt lösenord är ogiltig eller har gått ut.
              </p>
              <Link 
                to="/passwordreset" 
                className="inline-block w-full px-4 py-2 bg-black text-white rounded-md hover:bg-[#888383] transition-colors duration-300"
              >
                Begär en ny återställningslänk
              </Link>
            </div>
          ) : success ? (
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Lyckades!</h3>
              <p className="text-green-700 mb-4">{success}</p>
              <p className="text-green-700 mb-6">Du kommer att omdirigeras till inloggningssidan inom kort.</p>
              <Link 
                to="/login" 
                className="inline-block w-full px-4 py-2 bg-black text-white rounded-md hover:bg-[#888383] transition-colors duration-300"
              >
                Tryck för att Logga in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Nytt Lösenord
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validatePassword}
                  className="block w-full px-3 py-2 border border-black rounded-md focus:outline-none bg-white sm:text-sm"
                  disabled={isSubmitting}
                />
                {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Bekräfta Nytt Lösenord
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={validateConfirmPassword}
                  className="block w-full px-3 py-2 border border-black rounded-md focus:outline-none bg-white sm:text-sm"
                  disabled={isSubmitting}
                />
                {confirmPasswordError && <p className="mt-2 text-sm text-red-600">{confirmPasswordError}</p>}
              </div>
              <div>
                {serverError && <p className="text-sm text-red-600 mb-4">{serverError}</p>}
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-[#888383] transition-colors duration-300 cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Återställer..." : "Återställt Lösenord"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;