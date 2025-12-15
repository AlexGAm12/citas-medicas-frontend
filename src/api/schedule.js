import { api } from "./axios";

export const getSpecialtiesRequest = () =>
  api.get("/specialties");

export const getDoctorsBySpecialtyRequest = (specialtyId) =>
  api.get(`/doctors?specialty=${specialtyId}`);

export const getAvailabilityByDoctorRequest = (doctorId) =>
  api.get(`/availability/doctor/${doctorId}`);

export const createAppointmentRequest = (data) =>
  api.post("/appointments", data);
