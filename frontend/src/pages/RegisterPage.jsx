import React from "react";
import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
  return (
    <div className="min-w-xl">
      <div className="mt-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Registrera ett konto
          </h2>
          <RegisterForm></RegisterForm>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
