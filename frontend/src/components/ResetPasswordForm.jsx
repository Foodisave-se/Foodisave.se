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
        const errorData = await response.json();
        setServerError(
          errorData.detail || "Misslyckades återställa ditt Lösenord. Länken du har kan vara förbrukad."
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
    <div className="flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 sm:rounded-lg sm:px-10">
          {!token ? (
            <div className="p-4 rounded-md bg-white">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Ogiltig återställningslänk</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Denna länk för att återställa ditt lösenord är ogiltig eller har gått ut.</p>
                  </div>
                  <div className="mt-4">
                    <Link to="/passwordreset" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Begär en ny länk för att återställa ditt lösenord.
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : success ? (
            <div className="p-4 rounded-md bg-green-50">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Lyckades!</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{success}</p>
                    <p>Du kommer att omdirigeras till inloggningssidan inom kort.</p>
                  </div>
                  <div className="mt-4">
                    <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Tryck för att Logga in
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Nytt Lösenord
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validatePassword}
                  className={`block w-full px-3 py-2 placeholder-gray-400 border ${passwordError ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  disabled={isSubmitting}
                />
                {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Bekräfta Nytt Lösenord
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={validateConfirmPassword}
                  className={`block w-full px-3 py-2 placeholder-gray-400 border ${confirmPasswordError ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  disabled={isSubmitting}
                />
                {confirmPasswordError && <p className="mt-2 text-sm text-red-600">{confirmPasswordError}</p>}
              </div>
              <div className="my-2">
                {serverError && <p className="mt-2 text-sm text-red-600">{serverError}</p>}
              </div>
              <div>
                <button
                  type="submit"
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Återställer..." : "Återställer Lösenord"}
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
