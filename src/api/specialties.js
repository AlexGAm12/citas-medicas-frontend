import { api } from "./axios";

export const getSpecialtiesRequest = () => api.get("/specialties");
export const createSpecialtyRequest = (data) => api.post("/specialties", data);
export const updateSpecialtyRequest = (id, data) => api.put(`/specialties/${id}`, data);
export const deleteSpecialtyRequest = (id) => api.delete(`/specialties/${id}`);
