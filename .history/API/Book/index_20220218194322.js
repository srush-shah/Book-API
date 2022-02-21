
//Init
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

Router.get("/isbn/:isbn", async (req, res) => {
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

Router.get("/category/:category", async (req, res) => {
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

Router.get("/books/:author", async (req, res) => {
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

Router.post("/book/new", async (req, res) => {
  //We will use request body here instead of request parameter
  const { newBook } = req.body;
  await BookModel.create(newBook);
  //database.books.push(newBook);
  return res.json({ message: "The book was added" });
});

/*
Route           /book/update
Description     update book title
Access          PUBLIC
Parameters      isbn
Method          PUT
*/

Router.put("/book/update/:isbn", async (req, res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    }, //how to find
    { title: req.body.title }, //what to update
    { new: true } //return updated data. If not included, then returns old data but updates the database.
  );
  //froEach directly modifies the array so we will use it for now
  /*database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
        book.title = req.body.title;
      }
    });*/

  return res.json({
    books: updatedBook,
  });
});

/*
  Route           /book/author/update
  Description     update/add  author for the book
  Access          PUBLIC
  Parameters      isbn
  Method          PUT
  */

Router.put("/book/author/update/:isbn", async (req, res) => {
  //update the book database

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: {
        authorid: parseInt(req.body.authorid),
      },
    },
    {
      new: true,
    }
  );
  /*database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
        return book.authorid.push(req.body.authorid);
      }
    });*/

  //update the author database

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    { id: parseInt(req.body.authorid) },
    {
      $addToSet: {
        books: req.params.isbn,
      },
    },
    { new: true }
  );

  /*database.authors.forEach((author) => {
      if (author.id === req.body.authorid) {
        return author.books.push(req.params.isbn);
      }
    });*/

  return res.json({
    books: updatedBook,
    authors: updatedAuthor,
  });
});

/*
Route           /book/delete
Description     delete a book 
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/

Router.delete("/book/delete/:isbn", async (req, res) => {
  const deletedBook = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn,
  });

  /*const updatedAuthor = await AuthorModel.updateMany(
      { id: { $in: deletedBook.authorid } },
      {
        $pull: {
          books: req.params.isbn,
        },
      }
    );*/ // Update author database to remove the book ISBN from the author object
  /*(const updatedBookDatabase = database.books.filter(
      (book) => book.ISBN !== req.params.isbn
    );
  
    database.books = updatedBookDatabase;*/

  return res.json({ books: deletedBook });
});

/*
  Route           /book/author/delete
  Description     delete an author for a book 
  Access          PUBLIC
  Parameters      isbn, authorid
  Method          DELETE
  */

Router.delete("/book/author/delete/:isbn/:authorid", async (req, res) => {
  //update the book database

  const updatedBook = await BookModel.findOneAndUpdate(
    { ISBN: req.params.isbn },
    {
      $pull: {
        authorid: parseInt(req.params.authorid),
      },
    },
    { new: true }
  );
  /*database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
        const newAuthorList = book.authorid.filter(
          (author) => author !== parseInt(req.params.authorid)
        );
        book.authorid = newAuthorList;
        return;
      }
    });*/

  //update the author database

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(req.params.authorid),
    },
    {
      $pull: {
        books: req.params.isbn,
      },
    },
    { new: true }
  );
  /*database.authors.forEach((author) => {
      if (author.id === parseInt(req.params.authorid)) {
        const newBooksList = author.books.filter(
          (book) => book !== req.params.isbn
        );
        author.books = newBooksList;
        return;
      }
    });*/

  return res.json({
    books: updatedBook,
    authors: updatedAuthor,
  });
});



module.exports = Router;
