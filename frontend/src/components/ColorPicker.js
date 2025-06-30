import React, { useState } from "react";
import { getColorInfo, saveColorAnalysis } from "../services/api";

const ColorPicker = () => {
  const [hex, setHex] = useState("ff5733");
  const [colorData, setColorData] = useState(null);
  const [clientId, setClientId] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await getColorInfo(hex);
      setColorData(data);
      setSaveStatus(null);
    } catch (error) {
      console.error("Error fetching color info:", error);
      setSaveStatus({ type: "error", message: "Error al obtener información del color" });
    }
  };

  const handleSaveAnalysis = async () => {
    if (!colorData || !clientId) {
      setSaveStatus({ type: "error", message: "ID de cliente y datos de color son requeridos" });
      return;
    }
    
    setSaving(true);
    setSaveStatus(null);
    
    try {
      const analysisData = {
        client_id: clientId,
        color_data: {
          skin_tone: skinTone,
          hair_color: hairColor,
          recommended_colors: colorData.hsl ? `H:${colorData.hsl.h}, S:${colorData.hsl.s}, L:${colorData.hsl.l}` : ""
        }
      };
      
      await saveColorAnalysis(analysisData);
      setSaveStatus({ type: "success", message: "Análisis guardado correctamente" });
    } catch (error) {
      console.error("Error saving analysis:", error);
      setSaveStatus({ type: "error", message: "Error al guardar el análisis" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="color-picker">
      <h2>Colorimetría</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Código Hex (sin #):</label>
          <input 
            value={hex} 
            onChange={(e) => setHex(e.target.value)} 
            placeholder="Ej: ff5733"
          />
        </div>
        <button type="submit">Analizar Color</button>
      </form>

      {colorData && (
        <div className="color-results">
          <div 
            className="color-display" 
            style={{ backgroundColor: `#${colorData.hex?.clean || hex}` }}
          ></div>
          
          <div className="color-info">
            <p><strong>Nombre:</strong> {colorData.name?.value || "Sin nombre"}</p>
            <p><strong>RGB:</strong> {colorData.rgb?.value || "N/A"}</p>
            <p><strong>Hex:</strong> #{colorData.hex?.clean || hex}</p>
          </div>

          <div className="client-data">
            <h3>Datos del Cliente</h3>
            <input 
              placeholder="ID del Cliente" 
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
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
            
            <button 
              onClick={handleSaveAnalysis} 
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar Análisis"}
            </button>
            
            {saveStatus && (
              <p className={saveStatus.type === "success" ? "success" : "error"}>
                {saveStatus.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;