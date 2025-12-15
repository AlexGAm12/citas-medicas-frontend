import { api } from "./axios";

export const getMyAvailabilityRequest = () => api.get("/availability/my");
export const getAvailabilityByDoctorRequest = (doctorId) =>
  api.get(`/availability/doctor/${doctorId}`);

export const createAvailabilityRequest = (data) => api.post("/availability", data);
export const updateAvailabilityRequest = (id, data) =>
  api.put(`/availability/${id}`, data);
export const deleteAvailabilityRequest = (id) =>
  api.delete(`/availability/${id}`);
