import React, { createContext, useContext, useState } from "react";
import User from "./user";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(new User());


  const updateUserPoints = (newPoint) => {
    setUser((prevUser) => ({
      ...prevUser,
      points: newPoint, // Update health directly with the new value
    }));
  };
  return (
    <AppContext.Provider
      value={{
      isAuthenticated,
      setIsAuthenticated,
      updateUserPoints,
      user,
      setUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
