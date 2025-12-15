import { api } from "./axios";

export const getAllAppointmentsRequest = () => api.get("/appointments");

export const getMyAppointmentsRequest = () => api.get("/appointments/my");

export const getMyDoctorAppointmentsRequest = () => api.get("/appointments/my");
export const getMyPatientAppointmentsRequest = () => api.get("/appointments/my");

export const updateAppointmentStatusRequest = (id, status) =>
  api.patch(`/appointments/${id}/status`, { status });

export const getAvailableSlotsRequest = ({ doctorId, date }) =>
  api.get("/appointments/available-slots", { params: { doctorId, date } });

export const createAppointmentRequest = (data) => api.post("/appointments", data);
