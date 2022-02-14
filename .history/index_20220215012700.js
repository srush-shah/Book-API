//Security Configuration
require("dotenv").config();

//Framework
const express = require("express");
const mongoose = require("mongoose");

//Database
const database = require("./database/index");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");
const { get } = require("express/lib/request");
const { update } = require("./database/book");
const { resetWatchers } = require("nodemon/lib/monitor/watch");

//Initializing express
const bookapi = express();

//Establish Database Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection Established"));

//Configurations
bookapi.use(express.json());

/*
Route           /
Description     get all books
Access          PUBLIC
Parameters      NONE
Method          GET
*/

bookapi.get("/", async (req, res) => {
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

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/

bookapi.get("/publications", async (req, res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json({ publications: getAllPublications });
});

/*
Route           /publications/pubname
Description     get a specific author by name
Access          PUBLIC
Parameters      pubname
Method          GET
*/

bookapi.get("/publications/pubname/:pubname", (req, res) => {
  const getSpecificPublication = await PublicationModel.findOne({
    name: req.params.pubname,
  });
  /*const getSpecificPublication = database.publications.filter(
    (pub) => pub.name === req.params.pubname
  );*/

  if (!getSpecificPublication) {
    return res.json({
      error: `No publication found with the name ${req.params.pubname}`,
    });
  }
  return res.json({ publication: getSpecificPublication });
});

/*
Route           /publications/isbn
Description     get a list of authors based on a book's ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/

bookapi.get("/publications/isbn/:isbn", async (req, res) => {
  const getSpecificPublications = await PublicationModel.find({
    books: req.params.isbn,
  });
  /*const getSpecificPublications = database.publications.filter((pub) =>
    pub.books.includes(req.params.isbn)
  );*/

  if (!getSpecificPublications) {
    return res.json({
      error: `No publication found for the isbn ${req.params.isbn}`,
    });
  }

  return res.json({ publications: getSpecificPublications });
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

/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/

bookapi.post("/author/new", async (req, res) => {
  //We will use request body here instead of request parameter
  const { newAuthor } = req.body;
  await AuthorModel.create(newAuthor);
  return res.json({ message: "The author was added" });
});

/*
Route           /publication/new
Description     add new publication
Access          PUBLIC
Parameters      NONE
Method          POST
*/

bookapi.post("/publication/new", async (req, res) => {
  //We will use request body here instead of request parameter
  const { newPublication } = req.body;
  await PublicationModel.create(newPublication);
  return res.json({
    message: "The publication was added",
  });
});

/*
Route           /book/update
Description     update book title
Access          PUBLIC
Parameters      isbn
Method          PUT
*/

bookapi.put("/book/update/:isbn", async (req, res) => {
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

bookapi.put("/book/author/update/:isbn", async (req, res) => {
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
Route           /author/update
Description     update author name
Access          PUBLIC
Parameters      name
Method          PUT
*/

bookapi.put("/author/update/:name", async (req, res) => {
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
});

/*
Route           /publication/update
Description     update publication name
Access          PUBLIC
Parameters      name
Method          PUT
*/

bookapi.put("/publication/update/:name", async (req, res) => {
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    { name: req.params.name },
    { name: req.body.name },
    { new: true }
  );
  //forEach directly modifies the array so we will use it for now
  /*database.publications.forEach((pub) => {
    if (pub.name === req.params.name) {
      pub.name = req.body.name;
    }
  });*/

  return res.json({
    publications: updatedPublication,
  });
});

/*
Route           /publication/book/update
Description     update/add book for a publication
Access          PUBLIC
Parameters      pubid
Method          PUT
*/

bookapi.put("/publication/book/update/:pubid", async (req, res) => {
  //update the publication database
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    { pubid: parseInt(req.params.pubid) },
    {
      $addToSet: {
        books: req.body.isbn,
      },
    },
    { new: true }
  );
  /*database.publications.forEach((pub) => {
    if (pub.id === parseInt(req.params.pubid)) {
      return pub.books.push(req.body.isbn);
    }
  });*/
  //update the book database
  const updatedBook = await BookModel.findOneAndUpdate(
    { ISBN: req.body.isbn },
    { publication: parseInt(req.params.pubid) },
    { new: true }
  );
  /*database.books.forEach((book) => {
    if (book.ISBN === req.body.isbn) {
      return (book.publication = parseInt(req.params.pubid));
    }
  });*/

  return res.json({
    books: updatedBook,
    publications: updatedPublication,
  });
});

/*
Route           /book/delete
Description     delete a book 
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/

bookapi.delete("/book/delete/:isbn", async (req, res) => {
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

bookapi.delete("/book/author/delete/:isbn/:authorid", async (req, res) => {
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

/*
Route           /author/delete
Description     delete an author
Access          PUBLIC
Parameters      name
Method          DELETE
*/

bookapi.delete("/author/delete/:name", async (req, res) => {
  const deletedAuthor = await AuthorModel.findOneAndDelete({
    name: req.params.name,
  });
  /*const updatedAuthorDatabase = database.authors.filter(
    (author) => author.name !== req.params.name
  );

  database.authors = updatedAuthorDatabase;*/

  return res.json({ authors: deletedAuthor });
});

/*
Route           /publication/delete
Description     delete a publication 
Access          PUBLIC
Parameters      name
Method          DELETE
*/

bookapi.delete("/publication/delete/:name", async (req, res) => {
  const deletedPublication = await PublicationModel.findOneAndDeleteI({
    name: req.params.name,
  });
  /* const updatedPubDatabase = database.publications.filter(
    (pub) => pub.name !== req.params.name
  );

  database.publications = updatedPubDatabase;*/

  return res.json({ publications: deletedPublication });
});

/*
Route           /publication/book/delete
Description     delete a book from a publication 
Access          PUBLIC
Parameters      isbn, pubid
Method          DELETE
*/

bookapi.delete("/publication/book/delete/:isbn/:pubid", (req, res) => {
  //update publication database
  /*database.publications.forEach((publication) => {
    if (publication.id === parseInt(req.params.pubid)) {
      const newBooksList = publication.books.filter(
        (book) => book !== req.params.isbn
      );
      publication.books = newBooksList;
      return;
    }
  });*/

  //update book database
  /*database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = "None";
    }
    return;
  });*/

  return res.json({
    books: database.books,
    publications: database.publications,
    message: "The book was removed from the publication",
  });
});

bookapi.listen(3000, () => console.log("Server running!"));

//Mongoose -> Talks to mongodb the way it understands -> talks to us in JavaScript

/* Why Schema? 

MongoDB is Schemaless

Mongoose helps you with validation, relationship with other data */

//Mongoose model is document model of MongoDB
//Booky - Database - Collection
//books,authors,publications - Objects - Document
