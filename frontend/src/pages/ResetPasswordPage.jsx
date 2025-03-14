import React from "react";
import { Link } from "react-router-dom";
import ResetPasswordForm from "../components/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <div className="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-sm text-center text-gray-600">
          Enter your new password below
        </p>
      </div>
      <div className="mt-8">
        <ResetPasswordForm />
      </div>
      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Return to login
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
