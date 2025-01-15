import React from "react";
import "./css/SceneList.css";

function SceneList({ scenes }) {
  return (
    <div className="scene-list">
      <h2>Wygenerowane Sceny</h2>
      {scenes.length === 0 ? (
        <p>Brak scen do wyświetlenia. Wygeneruj coś nowego!</p>
      ) : (
        scenes.map((scene, index) => (
          <div key={index} className="scene">
            <h3>Scena {index + 1}</h3>
            <p>{scene}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default SceneList;
