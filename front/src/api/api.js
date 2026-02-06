import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Optional: helpful for debugging
api.interceptors.response.use(
  res => res,
  err => {
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;







// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// export default api;
