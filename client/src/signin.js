import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from './AppContext';
import "./App.css"; // Import the custom CSS file

function LoginForm() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setPlayer,player,setUserUsername} = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {

  };

  return (
<div className="login-container">
      <h1>Login</h1>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button onClick={handleLogin}>Log In</button>
    </div>
    )
}

export default LoginForm;