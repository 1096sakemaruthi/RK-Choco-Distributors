import axios from "axios";

const api = axios.create({
  baseURL: "https://cdms-backend-80mn.onrender.com/api",
});

export default api;