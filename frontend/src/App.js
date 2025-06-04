// frontend/src/App.js
import React, { useState } from "react";
import ColorPicker from "./components/ColorPicker";
import MasterDetail from "./components/MasterDetail";
import WeatherWidget from "./components/WeatherWidget";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("ventas");
  const [city, setCity] = useState("Madrid");

  return (
    <div className="App">
      <header>
        <h1>Sistema de Ventas y Colorimetría</h1>
      </header>

      <nav>
        <button onClick={() => setActiveTab("ventas")}>Ventas</button>
        <button onClick={() => setActiveTab("colorimetria")}>Colorimetría</button>
        <div className="weather-control">
          <input 
            type="text" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            placeholder="Ciudad para clima"
          />
        </div>
      </nav>

      <main>
        {activeTab === "ventas" && <MasterDetail />}
        {activeTab === "colorimetria" && <ColorPicker />}
      </main>

      <aside>
        <WeatherWidget city={city} />
      </aside>
    </div>
  );
}

export default App;