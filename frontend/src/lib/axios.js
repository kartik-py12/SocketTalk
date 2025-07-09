import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "https://sockettalk-d2fue3h3c0babxc7.westindia-01.azurewebsites.net/api",
    withCredentials:true,
});
