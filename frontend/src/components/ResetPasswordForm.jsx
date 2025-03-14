import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const ResetPasswordForm = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/v1";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setServerError("Invalid password reset link. Please request a new one.");
    }
  }, [token]);

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    setSuccess("");

    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();
    if (!isPasswordValid || !isConfirmValid || !token) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/auth/password-reset/confirm`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, new_password: password }),
      });
      if (response.ok) {
        setSuccess("Your password has been reset successfully.");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        const errorData = await response.json();
        setServerError(
          errorData.detail || "Failed to reset password. The link may have expired or been used."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setServerError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
          {!token ? (
            <div className="p-4 rounded-md bg-red-50">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Invalid Reset Link</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>This password reset link is invalid or has expired.</p>
                  </div>
                  <div className="mt-4">
                    <Link to="/passwordreset" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Request a new password reset link
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : success ? (
            <div className="p-4 rounded-md bg-green-50">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Success!</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{success}</p>
                    <p>You will be redirected to the login page shortly.</p>
                  </div>
                  <div className="mt-4">
                    <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Go to login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validatePassword}
                  className={`block w-full px-3 py-2 placeholder-gray-400 border ${passwordError ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  disabled={isSubmitting}
                />
                {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={validateConfirmPassword}
                  className={`block w-full px-3 py-2 placeholder-gray-400 border ${confirmPasswordError ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  disabled={isSubmitting}
                />
                {confirmPasswordError && <p className="mt-2 text-sm text-red-600">{confirmPasswordError}</p>}
              </div>
              <div className="my-2">
                {serverError && <p className="mt-2 text-sm text-red-600">{serverError}</p>}
              </div>
              <div>
                <button
                  type="submit"
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
