import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadPicture({ onFileSelected }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Referenser till fil-input för "Ladda upp" respektive "Ta bild"
  const uploadFileRef = useRef(null);
  const takePhotoRef = useRef(null);

  // Öppnar dropdownen omedelbart och rensar eventuell nedstängningstimer
  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  // Fördröjer stängningen av dropdownen med 300 ms
  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
  };

  // Toggle för dropdown – fungerar även för mobiler (click)
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Kontrollera om användaren är inloggad (vi kollar på "token" och "userData")
  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    return token && token !== "null" && userData && userData !== "null";
  };

  // Öppnar filväljaren för "Ladda upp bild"
  const handleUploadClick = () => {
    if (uploadFileRef.current) {
      uploadFileRef.current.click();
    }
  };

  // Öppnar filväljaren för "Ta bild" (kamera)
  const handleTakePhotoClick = () => {
    if (takePhotoRef.current) {
      takePhotoRef.current.click();
    }
  };

  // Hantera vald fil om man klickar direkt i input-fältet
  const handleDirectFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelected) {
      onFileSelected(file);
    }
  };

  // Hantera vald fil för "Ladda upp bild" (dropdown)
  const handleUploadFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelected) {
      onFileSelected(file);
    }
  };

  // Hantera vald fil för "Ta bild" (dropdown)
  const handleTakePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelected) {
      onFileSelected(file);
    }
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={handleDropdownMouseEnter}
      onMouseLeave={handleDropdownMouseLeave}
    >
      <div className="relative flex items-center">
        <input
          type="file"
          placeholder="Välj bild..."
          accept="image/*"
          onChange={handleDirectFileChange}
          className="
            flex-1 
            w-full
            cursor-pointer 
            block 
            px-3 
            py-2 
            placeholder-black 
            border 
            border-black 
            rounded-md 
            appearance-none 
            focus:outline-none 
            bg-white
            sm:text-sm
          "
        />
        <button
          type="button"
          onClick={toggleDropdown}
          className="
            ml-2
            p-2 
            rounded-md 
            bg-black 
            text-white 
            hover:bg-[#888383] 
            transition 
            cursor-pointer
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 cursor-pointer"
          >
            <path
              fillRule="evenodd"
              d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {isDropdownOpen && (
        <div className="
            absolute
            top-full
            right-0
            mt-2
            flex
            flex-col
            items-center
            z-40
            transform
            animate-slide-up
          ">
          <div className="
              w-0
              h-0
              border-l-4
              border-r-4
              border-b-4
              border-b-black
              border-l-transparent
              border-r-transparent
              mb-[-1px]
              ml-20
            "/>
          <div className="bg-black min-w-max rounded-md shadow-lg">
            {/* Dropdown-knapp för "Ladda upp bild" */}
            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn()) {
                  // Om användaren inte är inloggad, skicka med redirect-parametern
                  navigate("/login");
                } else {
                  handleUploadClick();
                }
              }}
              className="
                flex 
                items-center 
                w-full 
                px-4 
                py-2 
                hover:bg-[#888383] 
                cursor-pointer 
                whitespace-nowrap 
                rounded-md
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-white cursor-pointer"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2 text-white cursor-pointer">
                Välj bild
              </span>
            </button>

            {/* Dold fil-input för "Ladda upp bild" */}
            <input
              type="file"
              accept="image/*"
              ref={uploadFileRef}
              className="hidden"
              onChange={handleUploadFileChange}
            />

            {/* Dropdown-knapp för "Ta bild" */}
            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn()) {
                  navigate("/login?redirect=/imagerecipe");
                } else {
                  handleTakePhotoClick();
                }
              }}
              className="
                flex 
                items-center 
                w-full 
                px-4 
                py-2 
                hover:bg-[#888383] 
                cursor-pointer 
                whitespace-nowrap 
                rounded-md
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-white cursor-pointer"
              >
                <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                <path
                  fillRule="evenodd"
                  d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2 text-white cursor-pointer">
                Ta bild
              </span>
            </button>

            {/* Dold fil-input för "Ta bild" (kamera) */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={takePhotoRef}
              className="hidden"
              onChange={handleTakePhotoChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
