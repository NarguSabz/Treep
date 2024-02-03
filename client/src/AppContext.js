import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userUsername, setUserUsername] = useState('');

  return (
    <AppContext.Provider
      value={{
      isAuthenticated,
      setIsAuthenticated,
      userUsername,
      setUserUsername

      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
