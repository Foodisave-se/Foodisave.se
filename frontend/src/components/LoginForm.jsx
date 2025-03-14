import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import authStore from "../store/authStore";

export default function LoginForm() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const { setToken } = authStore();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [serverError, setServerError] = useState(""); // Ny state för serverfel

  function validateEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError("It must be a correct email");
      return false;
    } else if (!email) {
      setEmailError("Email is required");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  }

  function validatePassword() {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  }

  async function submitLogin(e) {
    e.preventDefault();
    setServerError(""); // Återställ serverfelet innan inloggningsförsöket
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      try {
        const response = await fetch(`${API_URL}/auth/token`, {
          method: "POST",
          body: formData,
        });

        if (response.status === 200) {
          const data = await response.json();
          setToken(data.access_token);
          navigate("/dashboard");
          console.log(data);
        } else if (response.status === 400 || response.status === 401) {
          const data = await response.json();
          setServerError(data.detail);
        } else {
          console.log("Login Failed");
          setServerError("An unexpected error occurred. Please try again later.");
        }
      } catch (error) {}
    } else {
      console.log("Validation errors");
    }
  }

  return (
    <div className="flex flex-col justify-center">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 sm:rounded-lg sm:px-10">
          <form onSubmit={submitLogin} className="space-y-6" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-postadress
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
                className="block w-full px-3 py-2 placeholder-white border border-black rounded-md appearance-none focus:outline-none focus:ring-[#888383] focus:border-[#888383] sm:text-sm"
              />
              {emailError && (
                <p className="mt-2 text-sm text-red-600">{emailError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Lösenord
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword}
                className="block w-full px-3 py-2 placeholder-white border border-black rounded-md appearance-none focus:outline-none focus:ring-[#888383] focus:border-[#888383] sm:text-sm"
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
              )}
              <Link to="/passwordreset">
                <p className="mt-1 text-gray-900 underline text-md">
                  Glömt ditt lösenord?
                </p>
              </Link>
            </div>
            <div className="my-2">
              {serverError && (
                <p className="mt-2 text-sm text-red-600">{serverError}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-[#888383] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#888383] cursor-pointer"
              >
                Logga In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
