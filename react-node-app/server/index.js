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


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
