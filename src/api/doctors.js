import { api } from "./axios";

export const getDoctorsRequest = () => api.get("/doctors");
export const getDoctorRequest = (id) => api.get(`/doctors/${id}`);
export const createDoctorRequest = (data) => api.post("/doctors", data);
export const updateDoctorRequest = (id, data) => api.put(`/doctors/${id}`, data);
export const deleteDoctorRequest = (id) => api.delete(`/doctors/${id}`);
