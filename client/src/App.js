import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import User from "./user";
import axios from "axios";
import "./App.css"; // Import the custom CSS file
import { useAppContext } from "./AppContext";
import PrivateRoute from './PrivateRoute';



function App() {
return (
    <div className="app-container">
    </div>
);
}

export default App;
