import React from "react";
import ActivationForm from "../components/ActivationForm";
import { Link } from "react-router-dom";

const ActivateAccountPage = () => {
  return (
    <div className="flex flex-col justify-center min-h-screen bg-gray-50 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
          Activate your account
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600">
          Please click the button below to activate your account.
        </p>
      </div>
      <div className="mt-8">
        <ActivationForm />
      </div>
      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Return to login
        </Link>
      </div>
    </div>
  );
};

export default ActivateAccountPage;
