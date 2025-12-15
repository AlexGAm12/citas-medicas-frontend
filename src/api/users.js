import { api } from "./axios";

export const getUsersRequest = () => api.get("/users");
