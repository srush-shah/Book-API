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

Router.get("/", async (req, res) => {
  try {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /authors/author
  Description     get a specific author by name
  Access          PUBLIC
  Parameters      author
  Method          GET
  */

Router.get("/:author", async (req, res) => {
  try {
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
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /authors/isbn
  Description     get a list of authors based on a book's ISBN
  Access          PUBLIC
  Parameters      isbn
  Method          GET
  */

Router.get("/isbn/:isbn", async (req, res) => {
  try {
    const getSpecificAuthors = await AuthorModel.find({
      books: req.params.isbn,
    });

    /*const getSpecificAuthors = database.authors.filter((author) =>
      author.books.includes(req.params.isbn)
    );*/

    if (!getSpecificAuthors) {
      return res.json({
        error: `No author found for the book ${req.params.isbn}`,
      });
    }

    return res.json(getSpecificAuthors);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/

Router.post("/new", async (req, res) => {
  try {
    //We will use request body here instead of request parameter
    const { newAuthor } = req.body;
    await AuthorModel.create(newAuthor);
    return res.json({ message: "The author was added" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route           /author/update
Description     update author name
Access          PUBLIC
Parameters      name
Method          PUT
*/

Router.put("/update/:name", async (req, res) => {
  try {
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
      { name: req.params.name },
      { name: req.body.name },
      { new: true }
    );
    //forEach directly modifies the array so we will use it for now
    /*database.authors.forEach((author) => {
        if (author.name === req.params.name) {
          author.name = req.body.name;
        }
      });*/
  
    return res.json({
      authors: updatedAuthor,
    });
  } catch (error) {
    
  }
  
});

/*
Route           /author/delete
Description     delete an author
Access          PUBLIC
Parameters      name
Method          DELETE
*/

Router.delete("/delete/:name", async (req, res) => {
  const deletedAuthor = await AuthorModel.findOneAndDelete({
    name: req.params.name,
  });
  /*const updatedAuthorDatabase = database.authors.filter(
      (author) => author.name !== req.params.name
    );
  
    database.authors = updatedAuthorDatabase;*/

  return res.json({ authors: deletedAuthor });
});

module.exports = Router;
