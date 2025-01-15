import React, { useState } from "react";
import axios from "axios";
import "./css/ChatPrompt.css";

function ChatPrompt({ onGenerateScene }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/chat/generate", {
        prompt: prompt,
      });

      onGenerateScene(response.data.choices[0].text.trim()); // Przekazujemy wygenerowany tekst jako scenę
      setPrompt("");
    } catch (error) {
      console.error("Error generating scene:", error);
      alert("Błąd podczas generowania sceny.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-prompt">
      <h2>Wygeneruj scenę z ChatGPT</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Wprowadź prompt..."
          rows="5"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generowanie..." : "Generuj"}
        </button>
      </form>
    </div>
  );
}

export default ChatPrompt;
