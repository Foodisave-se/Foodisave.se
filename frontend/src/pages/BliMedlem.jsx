import React, { useState } from 'react'
import { Link } from "react-router-dom";

export default function BliMedlem() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState([]);
  const [passwordError, setPasswordError] = useState([]);
  const [termsError, setTermsError] = useState("");

  const [serverError, setServerError] = useState("");

  
  async function handleSubmit(e) {
    e.preventDefault();
  
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isTermsValid = validateTerms();

    console.log("Valideringsresultat:", {
      isFirstNameValid,
      isLastNameValid,
      isEmailValid,
      isPasswordValid,
      isTermsValid,
    });
  
    if (isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid && isTermsValid) {
      const newUserData = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password,
        terms: terms,
      };
  
      console.log("Datan som skickas till API:", JSON.stringify(newUserData, null, 2));

      try {
        const response = await fetch(`${apiUrl}/blimedlem`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUserData),
        });
  
        if (!response.ok) {
          throw new Error("Error from the server");
        }
  
        console.log("Success");
        setServerError(""); // Clear any previous server error
      } catch (error) {
        console.log(error);
        setServerError("Something went wrong. Please try again.");
      }
    } else {
      console.log("Error in form");
    }
  }
  
  function validateFirstName() {
    if (!firstName.trim()) {
      setFirstNameError("Förnamn saknas");
      return false;
    } else if (firstName.length > 100) {
      setFirstNameError("Förnamn saknas");
    } else {
      setFirstNameError("");
      return true;
    }
  }
  function validateLastName() {
    if (!lastName.trim()) {
      setLastNameError("Efternamn saknas");
      return false;
    } else if (lastName.length > 100) {
      setLastNameError("Efternamn saknas");
    } else {
      setLastNameError("");
      return true;
    }
  }
  function validateEmail() {
    let emailErrors = [];
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!Boolean(regex.test(email))) {
      emailErrors.push("E-postadressen måste vara korrekt");
    }
    if (!email) {
      emailErrors.push("E-postadress saknas");
    }
    setEmailError(emailErrors);
    return emailErrors.length === 0;
  }
  function validatePassword() {
    let passwordErrors = [];
    const regex = /[^a-zA-Z0-9]/;
    if (password.length <= 8) {
      passwordErrors.push("Lösenordet måste innehålla mer än 8 tecken");
    }
    if (!Boolean(regex.test(password))) {
      passwordErrors.push("Lösenordet måste innehålla ett specialtecken ! @ # ¤ % & / ( ) = ?");
    }
    if (!password) {
      passwordErrors.push("Lösenord saknas");
    }
    setPasswordError(passwordErrors);
    return passwordErrors.length === 0;
  }
  function validateTerms() {
    if (!terms) {
      setTermsError("Du behöver acceptera FoodiSave.se personuppgiftspolicy.");
    } else {
      setTermsError("");
      return true;
    }
  }
  
  return (
    <>
      <div className="bg-white p-4 m-4 rounded-lg shadow-lg max-w-md w-full relative mx-auto">
        <Link to="/">
          <button className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-xl hover:text-2xl cursor-pointer">
              &times;
          </button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Bli medlem</h1>
        <p className="text-gray-700 mt-2">
          Skapa ett gratiskonto
        </p>
        <p className="text-gray-700 mt-2">
          Lägg till dina livsmedel du har hemma så inspirerar vi dig att laga god & enkel mat!
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-4">
          <li>Spara dina favoritrecept.</li>
          <li>Håll ordning på dina recept genom att ha dem samlade på ett ställe.</li>
        </ul>
        <div className="mt-6">
          <form noValidate onSubmit={handleSubmit}>
            <div className="flex items-center justify-between gap-4 ">
              <label htmlFor="firstName">
                <div className="block text-gray-800 font-small">Förnamn</div>
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
              <label htmlFor="lastName">
                <div className="block text-gray-800 font-small">Efternamn</div>
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
            <div className="mt-4">
            <label htmlFor="email">
              <div className="block text-gray-800 font-small">E-postadress</div>
              <input
                name="email"
                type="email"
                placeholder="Din e-postadress: e.g example@gmail.com"
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
              />
            </label>
            {emailError.map((error) => (
              <p key={error} className="text-xs italic text-red-500">{error}</p>
            ))}
            </div>
            <div className="mt-4">
            <label htmlFor="password">
              <div className="block text-gray-800 font-small">Lösenord</div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Lösenord"
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword}
              />
            </label>
            {passwordError.map((error) => (
              <p key={error} className="text-xs italic text-red-500">{error}</p>
            ))}
            </div>
            <div className="flex items-center">
              <div className="items-center justify-between mr-4">
                <label
                  htmlFor="terms"
                  className="block text-sm font-medium leading-6 text-gray-800 p-4"
                >
                  Genom att skapa konto bekräftar du att du har tagit del av FoodiSave:s <Link to="/" className="underline">personuppgiftspolicy.</Link>
                </label>
              </div>
              <div>
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="w-6 h-6 cursor-pointer rounded border-gray-400 text-green-500 focus:ring-green-300"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                />
              </div>
            </div>
            {termsError && <p className="text-xs italic text-red-500">{termsError}</p>}
            <button 
              type="submit"
              className="w-full bg-green-300 text-white font-semibold py-3 rounded-lg mt-6 hover:bg-green-400 transition cursor-pointer">
              Skapa konto
            </button>            
          </form>
          <p className="text-center text-gray-700 mt-4">
            Har du redan ett konto? <a href="#" className="text-green-300 font-semibold hover:underline">Logga in</a>
          </p>
        </div>
      </div>
    </>
  );
}
