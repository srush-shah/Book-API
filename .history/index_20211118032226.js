//Framework
const express = require("express");

//Database
const database = require("./database/index");

//Initializing express
const bookapi = express();

//Configurations
bookapi.use(express.json());

/*
Route           /
Description     get all books
Access          PUBLIC
Parameters      NONE
Method          GET
*/

bookapi.get("/", (req, res) => {
  return res.json({ books: database.books });
});

/*
Route           /
Description     get a specific book based on ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/

bookapi.get("/:isbn", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route           /category/
Description     get specific books based on a category
Access          PUBLIC
Parameters      category
Method          GET
*/

bookapi.get("/category/:category", (req, res) => {
  const getSpecificBooks = database.books.filter((book) =>
    book.category.includes(req.params.category)
  );

  if (getSpecificBooks.length === 0) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }

  return res.json({ book: getSpecificBooks });
});

/*
Route           /authors/
Description     get specific books based on an author
Access          PUBLIC
Parameters      aid
Method          GET
*/

bookapi.get("/authors/:author", (req, res) => {
  const getSpecificAuthor = database.authors.filter(
    (author) => author.name === req.params.author
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No author found with the name of ${req.params.author}`,
    });
  }

  const checkAuthor = (authid) => {
      if(authid === )
  }

  const getSpecificBooks = database.books.filter((book) => {
      book.authorid.forEach()
  })

  return res.json({ book: getSpecificBooks });
});

bookapi.listen(3000, () => console.log("Server running!"));
