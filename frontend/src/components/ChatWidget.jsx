import React, { useState, useEffect, useRef } from "react";
import authStore from "../store/authStore";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);

  const token = authStore((state) => state.token);
  const userData = authStore((state) => state.userData);
  const setUserData = authStore((state) => state.setUserData); // Lägger till setUserData här
  const apiUrl = "http://localhost:8000/v1/chat"; // Din /chat-endpoint

  // Refs för att hantera klick utanför och automatisk scroll
  const chatRef = useRef(null);
  const chatHistoryRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Uppdatera välkomstmeddelandet när chatten är öppen samt när token/userData ändras
  useEffect(() => {
    if (isOpen) {
      let newWelcome = "";
      if (token && userData) {
        // Använd first_name och last_name från userData, annars fallback till username
        const fullName =
          userData.first_name && userData.last_name
            ? `${userData.first_name} ${userData.last_name}`
            : userData.username || "Användare";
        newWelcome = `Hej ${fullName}! Hur kan jag hjälpa dig?`;
      } else {
        newWelcome =
          "Hej och välkommen till foodisave! Mig kan du använda för att få tips och ideér med din matlagning. Men kom ihåg att bli medlem och logga in innan du använder mig! Ser framemot att laga god mat tillsammans med dig!";
      }
      setChatHistory((prev) => {
        if (prev.length > 0 && prev[0].sender === "ai") {
          // Uppdatera det första meddelandet med rätt välkomsttext
          return [{ ...prev[0], text: newWelcome }, ...prev.slice(1)];
        }
        return [{ sender: "ai", text: newWelcome }, ...prev];
      });
    }
  }, [token, userData, isOpen]);

  // Stäng chatten vid klick utanför
  useEffect(() => {
    function handleClickOutside(e) {
      if (chatRef.current && !chatRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Scrolla automatiskt till botten när chatHistory uppdateras
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (!token) {
      setError("För att använda chattfunktionen, vänligen logga in.");
      return;
    }
    const userMsg = message.trim();
    const contextElement = document.getElementById("main-content");
    const context = contextElement ? contextElement.innerHTML : "";

    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setMessage("");

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ context, message: userMsg }),
      });
      if (!response.ok) {
        throw new Error("Kunde inte skicka meddelandet.");
      }
      const data = await response.json();
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: data.response },
      ]);

      // Uppdatera användardata (och därmed credits) efter chatt-anropet
      const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (userResponse.ok) {
        const updatedUserData = await userResponse.json();
        setUserData(updatedUserData);
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div ref={chatRef} className="w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
          <div className="bg-black text-white p-3 flex justify-between items-center rounded-t-lg">
            <span className="font-bold">Chat</span>
            <button onClick={toggleChat} className="text-xl leading-none focus:outline-none cursor-pointer">
              &minus;
            </button>
          </div>
          <div ref={chatHistoryRef} className="flex-1 p-3 overflow-y-auto">
            {chatHistory.map((msg, idx) => {
              if (msg.sender === "ai") {
                return (
                  <div key={idx} className="mb-2 text-sm flex items-start">
                    <img
                      src="/Esther_chat.jpg"
                      alt="Kock"
                      className="w-8 h-8 mr-2 rounded"
                      style={{ backgroundColor: "white" }}
                    />
                    <span className="inline-block p-2 bg-gray-200 rounded">
                      {msg.text}
                    </span>
                  </div>
                );
              } else {
                return (
                  <div key={idx} className="mb-2 text-sm text-right">
                    <span className="inline-block p-2 bg-blue-200 rounded">
                      {msg.text}
                    </span>
                  </div>
                );
              }
            })}
          </div>
          {error && <div className="text-red-600 text-xs p-2">{error}</div>}
          <div className="p-3 border-t flex flex-col gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Skriv ditt meddelande..."
              disabled={!token}
              className={`w-full p-2 border rounded focus:outline-none ${
                !token ? "bg-gray-200 opacity-50 cursor-not-allowed" : ""
              }`}
            />
            <button
              onClick={handleSendMessage}
              className="w-full bg-black text-white p-2 rounded hover:bg-[#888383] transition cursor-pointer"
            >
              Skicka
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-[#888383] transition focus:outline-none cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 9.75a.375.375 0 1 1-.75 0 
              .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 
              .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 
              .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 
              1.123 2.994 2.707 3.227 1.087.16 2.185.283 
              3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 
              .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 
              2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995
              -2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744
              .175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
