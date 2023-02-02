import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "../utils/auth.helper";

export const AuthContext = createContext();

export const useAuth = () => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const token = getLocalStorage();
    if (token) {
      setUserToken(token);
    }
  }, []);

  const setToken = (token) => {
    setUserToken(token);
    setLocalStorage(token);
  };

  const removeToken = (navigate) => {
    setUserToken(null);
    removeLocalStorage(null);
    navigate("/");
  };

  return {
    userToken,
    setToken,
    removeToken,
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default function AuthConsumer() {
  return useContext(AuthContext);
}
