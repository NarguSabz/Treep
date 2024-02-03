import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from './AppContext';
import "./App.css"; // Import the custom CSS file

function LoginForm() {
  const navigate = useNavigate();
  const { setIsAuthenticated,setUserUsername} = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Perform authentication logic by sending a POST request to your backend
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });

      // Assuming your backend returns some data indicating successful authentication
      if (response.data && response.data.isAuthenticated) {
        // Create a new instance of Player with the data from the response
        setIsAuthenticated(true);
        setUserUsername(username)
        navigate('/');
      } else {
        // Handle unsuccessful authentication, show error message, etc.
        console.log('Authentication failed');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      // Handle error, show error message, etc.
    }
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