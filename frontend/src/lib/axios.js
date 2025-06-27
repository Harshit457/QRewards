import axios from "axios";
// console.log("Axios instance created with baseURL:", import.meta.env.VITE_PORT )
export const axiosInstance = axios.create({

  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});