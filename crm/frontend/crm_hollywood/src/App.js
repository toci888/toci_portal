import React, { useState } from "react";
import ChatPrompt from "./ChatPrompt";
import SceneList from "./SceneList";
import "./App.css";

function App() {
  const [scenes, setScenes] = useState([]); // Przechowuje wygenerowane sceny

  const handleGenerateScene = (newScene) => {
    setScenes((prevScenes) => [newScene, ...prevScenes]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Autobiografia CRM</h1>
      </header>
      <main>
        <ChatPrompt onGenerateScene={handleGenerateScene} />
        <SceneList scenes={scenes} />
      </main>
    </div>
  );
}

export default App;
