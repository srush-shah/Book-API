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

module.exports = Router;
