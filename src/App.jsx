import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";

import NotFound from "./pages/NotFound";

import SpecialtiesPage from "./pages/admin/SpecialtiesPage";
import DoctorsPage from "./pages/admin/DoctorsPage";
import PatientsPage from "./pages/admin/PatientsPage";
import DoctorAvailabilityPage from "./pages/doctor/DoctorAvailabilityPage";
import DoctorAvailabilityAdminPage from "./pages/admin/DoctorAvailabilityAdminPage";
import DoctorAppointmentsPage from "./pages/doctor/DoctorAppointmentsPage";
import AdminAppointmentsPage from "./pages/admin/AdminAppointmentsPage";
import ScheduleAppointmentPage from "./pages/patient/ScheduleAppointmentPage";
import PatientAppointmentsPage from "./pages/patient/PatientAppointmentsPage";
import PatientHistoryPage from "./pages/patient/PatientHistoryPage";
import ReportsPage from "./pages/admin/ReportsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/patient" element={<PatientDashboard />} />

            <Route path="/admin/specialties" element={<SpecialtiesPage />} />
            <Route path="/admin/doctors" element={<DoctorsPage />} />
            <Route path="/admin/patients" element={<PatientsPage />} />
            <Route path="/admin/availability" element={<DoctorAvailabilityAdminPage />} />
            <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
            <Route path="/admin/reportes" element={<ReportsPage />} />

            <Route path="/doctor/availability" element={<DoctorAvailabilityPage />} />
            <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />

            <Route path="/patient/schedule" element={<ScheduleAppointmentPage />} />
            <Route path="/patient/appointments" element={<PatientAppointmentsPage />} />
            <Route path="/patient/history" element={<PatientHistoryPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
