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
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === parseInt(req.params.isbn)
  );

  if(get)
});

bookapi.listen(3000, () => console.log("Server running!"));
