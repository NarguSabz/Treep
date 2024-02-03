import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import User from "./user";
import axios from "axios";
import "./App.css"; // Import the custom CSS file
import { useAppContext } from "./AppContext";
import PrivateRoute from './PrivateRoute';
import LoginForm from './signin';
import RewardPlayer from './rewardPlayer'



function App() {
  const {
    isAuthenticated,
    user,
    setIsAuthenticated,
  } = useAppContext();
  // Create a new Signout component
const handleSignOut = async () => {
  try {
    // Call the backend sign-out route and send player data
    const response = await axios.post('http://localhost:3001/signout', {
      userData: user
    });

    // Update the authentication state in your context
    setIsAuthenticated(false);

    // Redirect to the login page or any other page
    window.location.href = '/login'; // Use window.location for redirection
  } catch (error) {
    console.error('Error during sign-out:', error);
  }
};
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route exact path='/' element={<PrivateRoute />}>
            <Route exact path='/' element={<RewardPlayer />} />
          </Route>
          <Route exact path='/login' element={<LoginForm />} />
        </Routes>
        {isAuthenticated && <button onClick={handleSignOut}>Sign Out</button>}
      </div>
    </Router>
  );
}


export default App;
