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
Route           /isbn
Description     get a specific book based on ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/

bookapi.get("/isbn/:isbn", (req, res) => {
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
Route           /category
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
Route           /books
Description     get specific books based on an author
Access          PUBLIC
Parameters      author
Method          GET
*/

bookapi.get("/books/:author", (req, res) => {
    const getSpecificAuthor = database.authors.filter(
        (author) => author.ISBN === req.params.isbn
      );
  const getSpecificBooks = database.books.filter((book) =>
    book.authorid.includes()
  );

  if (getSpecificBooks.length === 0) {
    return res.json({
      error: `No book found for the author ${req.params.author}`,
    });
  }

  return res.json({ book: getSpecificBooks });
});

/*
Route           /authors
Description     get all authors
Access          PUBLIC
Parameters      NONE
Method          GET
*/

bookapi.get("/authors", (req, res) => {
  return res.json({ authors: database.authors });
});

/*
Route           /authors
Description     get a list of authors based on a book's ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/

bookapi.get("/authors/:isbn", (req, res) => {
  const getSpecificAuthors = database.authors.filter((author) =>
    author.books.includes(req.params.isbn)
  );

  if (getSpecificAuthors.length === 0) {
    return res.json({
      error: `No author found for the book ${req.params.isbn}`,
    });
  }

  return res.json({ authors: getSpecificAuthors });
});

bookapi.listen(3000, () => console.log("Server running!"));
