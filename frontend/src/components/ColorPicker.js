// frontend/src/components/ColorPicker.js
import React, { useState } from "react";
import { getColorInfo, saveColorAnalysis } from "../services/api";

const ColorPicker = () => {
  const [hex, setHex] = useState("ff5733");
  const [colorData, setColorData] = useState(null);
  const [clientId, setClientId] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [hairColor, setHairColor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await getColorInfo(hex);
    setColorData(data);
  };

  const saveAnalysis = async () => {
    if (!colorData || !clientId) return;
    
    const analysisData = {
      client_id: clientId,
      color_data: {
        hex: colorData.hex.clean,
        name: colorData.name.value,
        skin_tone: skinTone,
        hair_color: hairColor,
        recommended_colors: colorData.harmonies?.complement?.colors?.map(c => c.hex.clean).join(", ")
      }
    };

    try {
      await saveColorAnalysis(analysisData);
      alert("Análisis guardado correctamente");
    } catch (error) {
      console.error("Error guardando análisis:", error);
    }
  };

  return (
    <div className="color-picker">
      <h2>Colorimetría</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Código Hex (sin #):</label>
          <input value={hex} onChange={(e) => setHex(e.target.value)} />
        </div>
        <button type="submit">Analizar Color</button>
      </form>

      {colorData && (
        <div className="color-results">
          <div 
            className="color-display" 
            style={{ backgroundColor: `#${colorData.hex.clean}` }}
          ></div>
          
          <div className="color-info">
            <p><strong>Nombre:</strong> {colorData.name.value}</p>
            <p><strong>RGB:</strong> {colorData.rgb.value}</p>
            <p><strong>Hex:</strong> #{colorData.hex.clean}</p>
          </div>

          <div className="client-data">
            <h3>Datos del Cliente</h3>
            <input 
              placeholder="ID del Cliente" 
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
            <input 
              placeholder="Tono de piel" 
              value={skinTone}
              onChange={(e) => setSkinTone(e.target.value)}
            />
            <input 
              placeholder="Color de cabello" 
              value={hairColor}
              onChange={(e) => setHairColor(e.target.value)}
            />
            <button onClick={saveAnalysis}>Guardar Análisis</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;