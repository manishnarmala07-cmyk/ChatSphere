import {
  createContext,
  useContext,
  useState,
} from "react";
import {
  disconnectSocket,
} from "../socket";

const AuthContext = createContext();

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] = useState(
    JSON.parse(
      localStorage.getItem("user")
    ) || null
  );

  const login = (
    userData,
    token
  ) => {
    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const logout = () => {
  disconnectSocket();

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setUser(null);
};

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);