// frontend/src/services/api.js
import axios from "axios";

// Backend Flask
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// APIs externas
const COLOR_API_BASE = "https://www.thecolorapi.com/id";
const RICK_AND_MORTY_USERS = "https://rickandmortyapi.com/api";



export const getVentas = async () => {
  try {
    const res = await axios.get(`${BACKEND_BASE_URL}/api/sales`);
    
    // Verificar si la respuesta tiene la estructura esperada
    if (res.data && res.data.status === "success") {
      return res.data;
    }
    
    // Si no tiene la estructura esperada, devolver un objeto con error
    return {
      status: "error",
      message: "Formato de respuesta inesperado",
      data: res.data
    };
  } catch (error) {
    console.error("Error fetching sales:", error);
    return {
      status: "error",
      message: "Error al obtener las ventas"
    };
  }
};

export const getColorInfo = async (hex) => {
  const res = await axios.get(`${COLOR_API_BASE}?hex=${hex}`);
  return res.data;
};

export const getWeather = async (city) => {
  const res = await axios.get(`${BACKEND_BASE_URL}/api/weather?city=${city}`);
  return res.data;
};

// Nueva función para guardar análisis de color
export const saveColorAnalysis = async (analysisData) => {
  const res = await axios.post(`${BACKEND_BASE_URL}/api/color`, analysisData);
  return res.data;
};

// Función para poblar la base de datos
export const populateDatabase = async () => {
  const res = await axios.post(`${BACKEND_BASE_URL}/api/populate`);
  return res;
};