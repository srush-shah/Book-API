//Initializing Express Router
const Router = require("express").Router();

//Database Model
const AuthorModel = require("../../database/author");


/*
Route           /authors
Description     get all authors
Access          PUBLIC
Parameters      NONE
Method          GET
*/

bookapi.get("/authors", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
  });
  
  /*
  Route           /authors/author
  Description     get a specific author by name
  Access          PUBLIC
  Parameters      author
  Method          GET
  */
  
  bookapi.get("/authors/author/:author", async (req, res) => {
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
    return res.json(getSpecificAuthor);
  });
  
  /*
  Route           /authors/isbn
  Description     get a list of authors based on a book's ISBN
  Access          PUBLIC
  Parameters      isbn
  Method          GET
  */
  
  bookapi.get("/authors/isbn/:isbn", async (req, res) => {
    const getSpecificAuthors = await AuthorModel.find({ books: req.params.isbn });
  
    /*const getSpecificAuthors = database.authors.filter((author) =>
      author.books.includes(req.params.isbn)
    );*/
  
    if (!getSpecificAuthors) {
      return res.json({
        error: `No author found for the book ${req.params.isbn}`,
      });
    }
  
    return res.json(getSpecificAuthors);
  });