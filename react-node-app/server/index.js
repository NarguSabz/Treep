const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const fs = require("fs");
// create our express app
const app = express();
const usersFilePath = path.join(__dirname, "/database/account.json");

app.use(cors());

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint for handling login requests
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Load user data from the JSON file
    const users = await loadUsers();

    // Find the user with the provided username
    const user = users.find((u) => u.username === username);

    // Check if the password matches
    if (user && user.password === password) {
      // Authentication successful
      res.json({ isAuthenticated: true, player: user.player });
    } else {
      // Authentication failed
      res.json({ isAuthenticated: false, error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Load user data from the JSON file

const loadUsers = async () => {
  try {
    const data = await fs.promises.readFile(usersFilePath, "utf8");
    const users = JSON.parse(data);
    return users;
  } catch (error) {
    console.error('Error reading users.json:', error);
    return { users: [] };
  }
};

// server/index.js
app.post('/signout', (req, res) => {
  try {
    const userData = req.body.userData;

    // Save player data to JSON file
    saveuserData(userData);

    // Respond with success message
    res.json({ success: true });
  } catch (error) {
    console.error('Error during signout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to save player data to JSON file
const saveuserData = (userData) => {

  // Read existing users data
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the users file:', err);
      return;
    }

    try {
      const users = JSON.parse(data);

      // Find and update the player data based on your data structure
      const updatedUsers = users.map((user) => {
        if (user.username === userData.username) {
          user.player = userData.player;  
        }
          return user;

      });

      // Write the updated users data back to the JSON file
      fs.writeFile(usersFilePath, JSON.stringify(updatedUsers, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error writing the users file:', writeErr);
        }
      });
    } catch (parseError) {
      console.error('Error parsing users.json:', parseError);
    }
  });
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
