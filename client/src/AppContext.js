import React, { createContext, useContext, useState } from "react";
import Player from "./player";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [player, setPlayer] = useState(new Player());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userUsername, setUserUsername] = useState('');
  const [minute_day, setMinute_day] = useState(0);
  const [second_day, setSecond_day] = useState(20);
  const [millisec_day, setMillisec_day] = useState(0);


  const updatePlayerHealth = (newHealth) => {
    // console.log(newHealth);
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      health: newHealth, // Update health directly with the new value
    }));
  };

  const updatePlayerLevel = (newLevel) => {
    // console.log(newHealth);
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      level: newLevel, // Update health directly with the new value
    }));
  };
  return (
    <AppContext.Provider
      value={{
        player,
        updatePlayerHealth,
        minute_day,
        setMinute_day,
        second_day,
        setSecond_day,
        millisec_day,
        setMillisec_day,
        updatePlayerLevel,
      isAuthenticated,
      setIsAuthenticated,
      setPlayer,
      userUsername,
      setUserUsername

      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
