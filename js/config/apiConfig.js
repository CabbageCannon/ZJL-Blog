const LOCAL_API_URL = "http://localhost:3001";
const PROD_API_URL = "https://your-render-service.onrender.com";

export const API_BASE_URL = location.hostname === "localhost" || location.hostname === "127.0.0.1"
  ? LOCAL_API_URL
  : PROD_API_URL;