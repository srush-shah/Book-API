//Framework
const express = require("express");

//Database
const databs

//Initializing express
const bookapi = express();

//Configurations
bookapi.use(express.json());

bookapi.listen(3000, () => console.log("Server running!"));