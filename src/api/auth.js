import { api } from "./axios";


// ejemplo:
export const loginRequest = (data) => api.post("/login", data);
export const registerRequest = (data) => api.post("/register", data);
export const profileRequest = () => api.get("/profile");
export const logoutRequest = () => api.post("/logout");
