import { createContext, useState, useContext } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  function login(user) {
    setCurrentUser(user);
  }

  function logout() {
    setCurrentUser(null);
  }

  return (
    <UserContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
