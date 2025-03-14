import React from "react";
import { Link } from "react-router-dom";
import PasswordResetRequestForm from "../components/PasswordResetRequestForm";

function PasswordResetRequestPage() {
  return (
    <div className="flex flex-col justify-center min-h-screen bg-gray-50 sm:px-6 lg:px-8">
      <div className="mb-20">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        <div className="mt-8">
          <PasswordResetRequestForm />
        </div>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-indigo-600 transition-colors duration-200 hover:text-indigo-500">
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetRequestPage;
