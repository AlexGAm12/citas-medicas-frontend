import { createContext, useContext, useEffect, useState } from "react";
import {
  loginRequest,
  logoutRequest,
  profileRequest,
  registerRequest,
} from "../api/auth";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  const signup = async (payload) => {
    try {
      setErrors([]);
      const res = await registerRequest(payload);

      setUser(null);
      setIsAuthenticated(false);

      return res.data;
    } catch (e) {
      setIsAuthenticated(false);
      setUser(null);
      setErrors(e?.response?.data?.message || ["Error al registrar"]);
      throw e;
    }
  };

  const signin = async (payload) => {
    try {
      setErrors([]);
      const res = await loginRequest(payload);

      setUser(res.data);
      setIsAuthenticated(true);

      return res.data;
    } catch (e) {
      setIsAuthenticated(false);
      setUser(null);
      setErrors(e?.response?.data?.message || ["Error al iniciar sesión"]);
      throw e;
    }
  };

  const signout = async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    async function checkLogin() {
      try {
  
        const res = await profileRequest();

        if (res?.data) {
          setIsAuthenticated(true);
          setUser(res.data);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        errors,
        signup,
        signin,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
