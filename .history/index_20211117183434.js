//Framework
const express = require("express");

//Database
const database = require("./database/index");

//Initializing express
const bookapi = express();

//Configurations
bookapi.use(express.json());

bookapi.get("/", (req, res) => {
  return res.json({ books: database.books });
});

bookapi.get("/:isbn", (req, res) => {
    return res.json({ books: database.books });
  });
bookapi.listen(3000, () => console.log("Server running!"));
