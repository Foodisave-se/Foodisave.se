import React, { useState } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);
  const apiUrl = "http://localhost:8000/v1/chat"; // Din /chat-endpoint

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const userMsg = message.trim();

    // Här hämtar vi kontexten från ett DOM-element med id "main-content"
    const contextElement = document.getElementById("main-content");
    const context = contextElement ? contextElement.innerHTML : "";

    // Lägg till användarens meddelande i chatthistoriken
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setMessage("");

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ context, message: userMsg })
      });
      if (!response.ok) {
        throw new Error("Kunde inte skicka meddelandet.");
      }
      const data = await response.json();
      setChatHistory((prev) => [...prev, { sender: "ai", text: data.response }]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
            <span className="font-bold">Chatt</span>
            <button onClick={toggleChat} className="text-xl leading-none focus:outline-none">
              &minus;
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`mb-2 text-sm ${msg.sender === "ai" ? "text-left" : "text-right"}`}>
                <span className={`inline-block p-2 rounded ${msg.sender === "ai" ? "bg-gray-200" : "bg-blue-200"}`}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          {error && <div className="text-red-600 text-xs p-2">{error}</div>}
          <div className="p-3 border-t">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Skriv ditt meddelande..."
              className="w-full p-2 border rounded focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="mt-2 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
              Skicka
            </button>
          </div>
        </div>
      ) : (
        <button
        onClick={toggleChat}
        className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 focus:outline-none cursor-pointer"
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
            d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
        </svg>
        </button>




      )}
    </div>
  );
}
