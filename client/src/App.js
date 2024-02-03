import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import User from "./user";
import axios from "axios";
import "./App.css"; // Import the custom CSS file
import { useAppContext } from "./AppContext";
import PrivateRoute from './PrivateRoute';
import LoginForm from './signin';



function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route exact path='/' element={<PrivateRoute />}>
            <Route exact path='/' element={<Home />} />
          </Route>
          <Route exact path='/login' element={<LoginForm />} />
        </Routes>
      </div>
    </Router>
  );
}
function Home() {
  return <div className="main-content">Welcome to the Single Page App!</div>;
}

export default App;
