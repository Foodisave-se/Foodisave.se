import React from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  const location = useLocation();
  // Hämta eventuell redirect-destination, defaulta till Home ("/")
  const redirectTo = location.state?.redirectTo || "/";

  return (
    <div className="min-w-w-full max-w-md mx-auto px-4 pt-24">
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
