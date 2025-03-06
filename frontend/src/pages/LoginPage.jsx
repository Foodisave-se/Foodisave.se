import React from "react";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  return (
    <div className="min-w-xl">
      <div className="mt-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Logga in
          </h2>
          <LoginForm></LoginForm>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
