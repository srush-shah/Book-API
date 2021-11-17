//Framework
const express = require("express");

//Database
const database = require("./database/index");

//Initializing express
const bookapi = express();

//Configurations
bookapi.use(express.json());

bookapi.get("/", (req, res) =)

bookapi.listen(3000, () => console.log("Server running!"));
