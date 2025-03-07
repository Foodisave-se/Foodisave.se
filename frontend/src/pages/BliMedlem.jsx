import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const navigate = useNavigate();

  // State för formuläret
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState([]);
  
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState([]);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const [terms, setTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

  const [serverError, setServerError] = useState("");

  // Valideringsfunktioner
  function validateUserName() {
    let errors = [];
    if (!userName.trim()) {
      errors.push("Username is required");
    }
    setUserNameError(errors);
    return errors.length === 0;
  }

  function validateEmail() {
    let errors = [];
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      errors.push("It must be a correct email");
    }
    if (!email) {
      errors.push("Email is required");
    }
    setEmailError(errors);
    return errors.length === 0;
  }

  function validatePassword() {
    let errors = [];
    const regex = /[^a-zA-Z0-9]/;
    if (password.length <= 8) {
      errors.push("Password length must be greater than 8");
    }
    if (!regex.test(password)) {
      errors.push("Your password must contain a unique character");
    }
    if (!password) {
      errors.push("Password is required");
    }
    setPasswordError(errors);
    return errors.length === 0;
  }

  function validateFirstName() {
    if (!firstName.trim()) {
      setFirstNameError("First name is required");
      return false;
    } else {
      setFirstNameError("");
      return true;
    }
  }

  function validateLastName() {
    if (!lastName.trim()) {
      setLastNameError("Last name is required");
      return false;
    } else {
      setLastNameError("");
      return true;
    }
  }

  function validateTerms() {
    if (!terms) {
      setTermsError("You must accept our terms, OR ELSE!");
      return false;
    } else {
      setTermsError("");
      return true;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const isUserNameValid = validateUserName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isTermsValid = validateTerms();

    if (
      isUserNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isFirstNameValid &&
      isLastNameValid &&
      isTermsValid
    ) {
      const newUserData = {
        username: userName,
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
      };

      try {
        const response = await fetch(`${API_URL}/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUserData),
        });
        const data = await response.json();

        if (response.status === 201) {
          console.log("Success");
          setServerError("");
          navigate("/login");
        } else {
          console.log("Something went wrong");
          console.log(data);
          throw new Error("Error from the server");
        }
      } catch (error) {
        console.error(error);
        setServerError("Something went wrong. Please try again.");
      }
    } else {
      console.log("Error in form");
    }
  }

  return (
    <>
      <div className="bg-white p-4 m-4 rounded-lg shadow-lg max-w-md w-full relative mx-auto">
        <Link to="/">
          <button className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-xl cursor-pointer">
            &times;
          </button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Bli medlem</h1>
        <p className="text-gray-700 mt-2">Skapa ett gratiskonto</p>
        <p className="text-gray-700 mt-2">
          Lägg till dina livsmedel du har hemma så inspirerar vi dig att laga god & enkel
          mat!
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-4">
          <li>Spara dina favoritrecept.</li>
          <li>Håll ordning på dina recept genom att ha dem samlade på ett ställe.</li>
        </ul>
        <div className="mt-6">
          <form noValidate onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-800 font-small">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Ditt username"
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onBlur={validateUserName}
              />
              {userNameError.map((err, idx) => (
                <p key={idx} className="text-xs italic text-red-500">
                  {err}
                </p>
              ))}
            </div>
            {/* För- och efternamn */}
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="firstName" className="block text-gray-800 font-small">
                Förnamn
                <input
                  name="firstName"
                  type="text"
                  placeholder="Ditt förnamn"
                  className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={validateFirstName}
                />
                {firstNameError && (
                  <p className="text-xs italic text-red-500">{firstNameError}</p>
                )}
              </label>
              <label htmlFor="lastName" className="block text-gray-800 font-small">
                Efternamn
                <input
                  name="lastName"
                  type="text"
                  placeholder="Ditt efternamn"
                  className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={validateLastName}
                />
                {lastNameError && (
                  <p className="text-xs italic text-red-500">{lastNameError}</p>
                )}
              </label>
            </div>
            {/* Email */}
            <div className="mt-4">
              <label htmlFor="email" className="block text-gray-800 font-small">
                E-postadress
              </label>
              <input
                name="email"
                type="email"
                placeholder="Din e-postadress, t.ex. example@gmail.com"
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
              />
              {emailError.map((err, idx) => (
                <p key={idx} className="text-xs italic text-red-500">
                  {err}
                </p>
              ))}
            </div>
            {/* Password */}
            <div className="mt-4">
              <label htmlFor="password" className="block text-gray-800 font-small">
                Lösenord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Lösenord"
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword}
              />
              {passwordError.map((err, idx) => (
                <p key={idx} className="text-xs italic text-red-500">{err}</p>
              ))}
            </div>
            {/* Terms */}
            <div className="flex items-center mt-4">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="w-6 h-6 cursor-pointer rounded border-gray-400 text-green-500 focus:ring-green-300"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-800">
                Genom att skapa konto bekräftar du att du har tagit del av FoodiSave:s{" "}
                <Link to="/" className="underline text-green-300 font-semibold">
                  personuppgiftspolicy
                </Link>.
              </label>
            </div>
            {termsError && (
              <p className="text-xs italic text-red-500">{termsError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-green-300 text-white font-semibold py-3 rounded-lg mt-6 hover:bg-green-400 transition cursor-pointer"
            >
              Skapa konto
            </button>
          </form>
          {serverError && (
            <p className="text-center text-red-500 mt-4">{serverError}</p>
          )}
        </div>
      </div>
    </>
  );
}
