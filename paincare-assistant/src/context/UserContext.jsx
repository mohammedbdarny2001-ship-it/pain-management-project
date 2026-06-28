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

  function updateCurrentUser(updatedUser) {
    setCurrentUser(updatedUser);
  }

  return (
    <UserContext.Provider
      value={{ currentUser, login, logout, updateCurrentUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}