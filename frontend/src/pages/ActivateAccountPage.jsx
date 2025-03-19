import React from "react";
import ActivationForm from "../components/ActivationForm";
import { Link } from "react-router-dom";

const ActivateAccountPage = () => {
  return (
    <div className="flex flex-col justify-center min-h-screen bg-gray-50 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
          Aktivera ditt konto
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600">
          Tryck på knappen för att aktivera ditt konto.
        </p>
      </div>
      <div className="mt-8">
        <ActivationForm />
      </div>
    </div>
  );
};

export default ActivateAccountPage;
