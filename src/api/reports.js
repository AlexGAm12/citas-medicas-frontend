import { api } from "./axios";

export const getAppointmentsSummaryRequest = (params) =>
  api.get("/reports/appointments/summary", { params });

export const getAppointmentsByDoctorRequest = (params) =>
  api.get("/reports/appointments/by-doctor", { params });

export const getAppointmentsBySpecialtyRequest = (params) =>
  api.get("/reports/appointments/by-specialty", { params });

export const getAppointmentsDailyRequest = (params) =>
  api.get("/reports/appointments/daily", { params });
