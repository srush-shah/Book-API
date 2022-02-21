const { Route } = require("express");

const Router = require("express").Router;

/*
Route           /
Description     get all books
Access          PUBLIC
Parameters      NONE
Method          GET
*/

Router.get("/", async (req, res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

/*
Route           /isbn
Description     get a specific book based on ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/

bookapi.get("/isbn/:isbn", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn }); // If nothing found, this will return null.
  /*const getSpecificBook = database.books.filter(
      (book) => book.ISBN === req.params.isbn
    );*/ //This one is used without Mongoose models

  if (!getSpecificBook) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,
    });
  }

  return res.json(getSpecificBook);
});

/*
Route           /category
Description     get specific books based on a category
Access          PUBLIC
Parameters      category
Method          GET
*/

bookapi.get("/category/:category", async (req, res) => {
  const getSpecificBooks = await BookModel.find({
    category: req.params.category,
  });

  /*const getSpecificBooks = database.books.filter((book) =>
      book.category.includes(req.params.category)
    );*/

  if (!getSpecificBooks) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }

  return res.json(getSpecificBooks);
});

/*
  Route           /books
  Description     get specific books based on an author
  Access          PUBLIC
  Parameters      author
  Method          GET
  */

bookapi.get("/books/:author", async (req, res) => {
  const getSpecificAuthor = await AuthorModel.findOne({
    name: req.params.author,
  });
  /*const getSpecificAuthor = database.authors.filter(
      (author) => author.name === req.params.author
    );*/

  if (!getSpecificAuthor) {
    return res.json({
      error: `No author found with the name ${req.params.author}`,
    });
  }

  const getSpecificBooks = await BookModel.find({
    authorid: getSpecificAuthor.id,
  });

  /*const getSpecificBooks = database.books.filter((book) =>
      book.authorid.includes(getSpecificAuthor[0].id)
    );*/

  if (!getSpecificBooks) {
    return res.json({
      error: `No book found for the author ${req.params.author}`,
    });
  }

  return res.json(getSpecificBooks);
});

/*
Route           /book/new
Description     add new book
Access          PUBLIC
Parameters      NONE
Method          POST
*/

bookapi.post("/book/new", async (req, res) => {
  //We will use request body here instead of request parameter
  const { newBook } = req.body;
  await BookModel.create(newBook);
  //database.books.push(newBook);
  return res.json({ message: "The book was added" });
});



module.exports = Router;
