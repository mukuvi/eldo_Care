import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "x-role": "NGO"
  }
});

// Optional but recommended
API.interceptors.response.use(
  response => response,
  error => {
    console.error("NGO API error:", error);
    return Promise.reject(error);
  }
);

export const fetchSummary = () => API.get("/insights/summary");
export const fetchHeatmapData = () => API.get("/insights/heatmap");

export default API;
