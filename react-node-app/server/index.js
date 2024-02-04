const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const Jimp = require("jimp");
const qrCodeReader = require('qrcode-reader');
const fs = require("fs");
const moment = require('moment');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
const { isUndefined } = require("util");
// Create an instance of OpenAIAPI
dotenv.config()
const openai = new OpenAI({
  apiKey: process.env.APIKEY // This is also the default, can be omitted
});



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
      res.json({ isAuthenticated: true, user: user });
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

app.post('/readingQrCode', (req, res) => {
  try {
    // Respond with expired or valid qr
    readQrcode(req.body.image, (result) => {
      console.log(result)
      res.json({ qrState: result });
    });
  } catch (error) {
    console.error('Error during reading the qrcode:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})
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

app.get('/generatingQuiz', async (req, res) => {
  try {
    const completion = await runPrompt();
    const quizQuestion = completion.choices?.[0]?.message?.content.trim();

    console.log(quizQuestion)
    if (!quizQuestion) {
      throw new Error("Unexpected response format from OpenAI API");
    }

    // Find the starting index of the question
    const questionStartIndex = quizQuestion.indexOf('Question');

    // Find the ending index of the question
    const questionEndIndex = quizQuestion.indexOf('Answer', questionStartIndex);

    // Extract the question substring
    const question = quizQuestion.substring(questionStartIndex, questionEndIndex).trim();

    // Find the starting index of the correct answer
    const correctAnswerStartIndex = questionEndIndex;

    // // Find the ending index of the correct answer
    // const correctAnswerEndIndex = quizQuestion.indexOf('\n', correctAnswerStartIndex);

    // Extract the correct answer substring
    const correctAnswer = quizQuestion.substring(correctAnswerStartIndex).trim();

    // Send the generated quiz question and correct answer as a response
    res.status(200).json({ quizQuestion: question, correctAnswer: correctAnswer });
  } catch (error) {
    console.error(error);
    // Handle errors and send an appropriate response
    res.status(500).json({ error: 'Internal Server Error' });
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
          user.points = userData.points;
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

const readQrcode = (base64Image, callback) => {
  const buffer = Buffer.from(base64Image, 'base64');

  // __ Parse the image using Jimp.read() __ \\
  Jimp.read(buffer, function (err, image) {
    if (err) {
      console.error(err);
    }
    // __ Creating an instance of qrcode-reader __ \\

    const qrCodeInstance = new qrCodeReader();

    qrCodeInstance.callback = function (err, value) {
      if (err) {
        console.error(err);
      }
      if (value && value.result) {
        const qrCodeData = JSON.parse(value.result);


        // Check if the "issueDate" and "timeLimit" properties exist
        if (qrCodeData && qrCodeData.issueDate && qrCodeData.timeLimit) {
          const issueDate = moment(qrCodeData.issueDate);
          const timeLimit = qrCodeData.timeLimit;

          // Calculate the expiration date based on the time limit
          const expirationDate = issueDate.clone().add(moment.duration(timeLimit));

          // Get the current date and time
          const currentDate = moment();

          // Compare the current date and time to the expiration date
          if (currentDate.isBefore(expirationDate)) {
            callback('valid'); // Call the callback with a success message
          } else {
            callback('expired'); // Call the callback with an expired message
          }
        } else {
          callback('invalid'); // Call the callback with an invalid message
        }
      } else {
        callback('invalid'); // Call the callback with an invalid message

      }

    };

    // __ Decoding the QR code __ \\
    qrCodeInstance.decode(image.bitmap);
  });
}

const runPrompt = async () => {
  return completion = await openai.chat.completions.create({
    messages: [{ "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Generate a trivia question related to sustainability, public transportation facts, or environmental initiatives for an eco-conscious mobile application. The question should have multiple-choice options (A, B, C, D). Provide only the question answer pair with no explanation.Ensure that the question is engaging and informative, suitable for a daily quiz challenge." },],
    model: "gpt-3.5-turbo",
    max_tokens: 100,
    temperature: 1,
  });

}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
