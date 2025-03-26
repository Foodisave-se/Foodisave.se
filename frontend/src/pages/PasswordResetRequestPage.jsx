import React from "react";
import { Link } from "react-router-dom";
import PasswordResetRequestForm from "../components/PasswordResetRequestForm";

function PasswordResetRequestPage() {
  return (
    <div className="flex flex-col justify-center min-h-screen sm:px-6 lg:px-8">
      <div className="mb-20">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Återställ ditt Lösenord
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Ange din e-postadress så skickar vi en länk för att återställa ditt lösenord.
          </p>
        </div>
        <div className="mt-8">
          <PasswordResetRequestForm />
        </div>
      </div>
    </div>
  );
}

export default PasswordResetRequestPage;
