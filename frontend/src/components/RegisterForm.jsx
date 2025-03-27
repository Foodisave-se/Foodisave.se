import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterForm() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState([]);
  
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState([]);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState([]);

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState([]);

  const [terms, setTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

  function validateEmail() {
    let emailErrors = [];
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      emailErrors.push("Måste vara en giltig e-postadress");
    }
    if (!email) {
      emailErrors.push("E-postadress krävs");
    }
    setEmailError(emailErrors);
  }

  function validatePassword() {
    let passwordErrors = [];
    const regex = /[^a-zA-Z0-9]/;
    if (password.length <= 8) {
      passwordErrors.push("Lösenorder måste vara minst 8 tecken lång");
    }
    if (!regex.test(password)) {
      passwordErrors.push("Ditt lösenord måste innehålla minst en siffra eller specialtecken");
    }
    if (!password) {
      passwordErrors.push("Lösenord krävs");
    }
    setPasswordError(passwordErrors);
  }

  function validateUserName() {
    let errors = [];
    if (!userName) {
      errors.push("Username is required");
    }
    setUserNameError(errors);
  }

  function validateFirstName() {
    let errors = [];
    if (!firstName) {
      errors.push("Ange ditt förnamn");
    }
    setFirstNameError(errors);
  }

  function validateLastName() {
    let errors = [];
    if (!lastName) {
      errors.push("Ange ditt efternamn");
    }
    setLastNameError(errors);
  }

  function validateTerms() {
    if (!terms) {
      setTermsError("Acceptera användarvillkor och personuppgiftspolicy");
    } else {
      setTermsError("");
    }
  }

  async function submitRegister(e) {
    e.preventDefault();
    // Kör alla valideringsfunktioner
    validateUserName();
    validateEmail();
    validatePassword();
    validateFirstName();
    validateLastName();
    validateTerms();

    // Om inga fel (observera att state-uppdateringar kan vara asynkrona)
    if (
      emailError.length === 0 &&
      passwordError.length === 0 &&
      firstNameError.length === 0 &&
      lastNameError.length === 0 &&
      userNameError.length === 0 &&
      !termsError
    ) {
      try {
        const response = await fetch(`${API_URL}/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: userName,
            email,
            first_name: firstName,
            last_name: lastName,
            password: password,
          }),
        });
        const data = await response.json();

        if (response.status === 201) {
          console.log("Success");
          // Vid lyckad registrering, vidarebefordra meddelandet till login-sidan
          navigate("/login", { state: { activationMessage: data.message } });
        } else {
          console.log("Something went wrong");
          console.log(data);
          throw new Error("Ett oväntat fel uppstod. Försök igen senare.");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Error in form");
    }
  }

  return (
    <>
      <div className="flex flex-col justify-center flex-1 min-h-full px-4 py-4 lg:px-8">
        <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-4 py-8 bg-[#c8c8c8] sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={submitRegister}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-postadress
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full px-3 py-2 placeholder-white border rounded-md shadow-sm focus:outline-none bg-white sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={validateEmail}
                  />
                  {emailError.map((error, index) => (
                    <p key={index} className="mt-2 text-sm text-red-600">
                      {error}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  Namn
                </label>
                <div className="mt-1">
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    required
                    className="block w-full px-3 py-2 placeholder-white border rounded-md shadow-sm focus:outline-none bg-white sm:text-sm"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={validateFirstName}
                  />
                  {firstNameError.map((error, index) => (
                    <p key={index} className="mt-2 text-sm text-red-600">
                      {error}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Efternamn
                </label>
                <div className="mt-1">
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    required
                    className="block w-full px-3 py-2 placeholder-white border rounded-md shadow-sm focus:outline-none bg-white sm:text-sm"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onBlur={validateLastName}
                  />
                  {lastNameError.map((error, index) => (
                    <p key={index} className="mt-2 text-sm text-red-600">
                      {error}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Lösenord
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full px-3 py-2 placeholder-white border rounded-md shadow-sm focus:outline-none bg-white sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={validatePassword}
                  />
                  {passwordError.map((error, index) => (
                    <p key={index} className="mt-2 text-sm text-red-600">
                      {error}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="w-4 h-4 text-[#888383] border rounded focus:ring-[#888383]"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                />
                <label htmlFor="terms" className="block ml-2 text-sm text-gray-900 pl-2">
                  Genom att bli medlem accepterar jag foodisave:s <Link className="underline" to="/terms-and-privacy">användarvillkor och personuppgiftspolicy</Link>
                </label>
              </div>
              {termsError && (
                <p className="mt-2 text-sm text-red-600">{termsError}</p>
              )}

              <div>
                <button
                  type="submit"
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-[#888383] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#888383] cursor-pointer"
                >
                  Bli Medlem
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
