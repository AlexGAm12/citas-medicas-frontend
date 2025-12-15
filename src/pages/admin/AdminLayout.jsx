import { Outlet } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin";

export default function AdminLayout() {
  return (
    <>
      <NavbarAdmin />
      <Outlet />
    </>
  );
}
