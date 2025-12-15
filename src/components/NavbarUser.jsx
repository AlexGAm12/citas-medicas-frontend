import { Fragment } from "react";
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { IoChevronDownSharp, IoLogOutOutline, IoPerson } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";

export default function NavbarUser() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const go = (path) => () => navigate(path);

  const isDoctor = user?.role === "doctor";
  const isPaciente = user?.role === "paciente";

  return (
    <nav className="bg-zinc-700 my-3 flex justify-between py-5 px-10 rounded-lg items-center">
      <h1 className="text-2xl font-bold text-white">Citas Médicas</h1>

      <ul className="flex gap-x-4 items-center">
        <li className="text-white flex items-center gap-2">
          <IoPerson /> {user?.username} ({user?.role})
        </li>

        <li>
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex w-full justify-center rounded-md bg-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-600">
              Opciones <IoChevronDownSharp className="ml-2" />
            </MenuButton>

            <Transition as={Fragment}>
              <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg focus:outline-none">
                <div className="p-1">
                  {isPaciente && (
                    <>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={go("/patient/book")}
                            className={`${active ? "bg-zinc-100" : ""} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Agendar cita
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={go("/patient/appointments")}
                            className={`${active ? "bg-zinc-100" : ""} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Mis citas
                          </button>
                        )}
                      </MenuItem>
                    </>
                  )}

                  {isDoctor && (
                    <>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={go("/doctor/appointments")}
                            className={`${active ? "bg-zinc-100" : ""} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Citas (doctor)
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={go("/doctor/availability")}
                            className={`${active ? "bg-zinc-100" : ""} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Mi disponibilidad
                          </button>
                        )}
                      </MenuItem>
                    </>
                  )}

                  <div className="border-t my-1" />

                  <MenuItem>
                    {({ active }) => (
                      <Link
                        to="/"
                        onClick={async () => {
                          await signout();
                        }}
                        className={`${active ? "bg-zinc-100" : ""} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <IoLogOutOutline className="mr-2" /> Salir
                      </Link>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        </li>
      </ul>
    </nav>
  );
}
