import { api } from "./axios";

export const getPatientsRequest = () => api.get("/patients");
export const getPatientRequest = (id) => api.get(`/patients/${id}`);
export const createPatientRequest = (data) => api.post("/patients", data);
export const updatePatientRequest = (id, data) => api.put(`/patients/${id}`, data);
export const deletePatientRequest = (id) => api.delete(`/patients/${id}`);
