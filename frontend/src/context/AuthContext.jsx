import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {

    try {

      const storedUser =
        localStorage.getItem("user");

      if (
        !storedUser ||
        storedUser === "undefined"
      ) {
        return null;
      }

      return JSON.parse(storedUser);

    } catch (error) {

      console.log(
        "Invalid localStorage user"
      );

      return null;
    }

  });

  return (

    <AuthContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>

  );
}

export function useAuth() {
  return useContext(AuthContext);
}