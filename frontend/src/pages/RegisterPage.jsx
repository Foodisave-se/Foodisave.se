import React from "react";
import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
  return (
    <div className="w-full max-w-md mx-auto px-4 pt-24">
      <div className="mt-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-3xl font-bold text-center text-black">
            Registrera ett konto
          </h2>
          <RegisterForm></RegisterForm>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
