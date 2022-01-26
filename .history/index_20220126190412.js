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
  const getSpecificBooks = await BookModel.findOne({
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

bookapi.get("/books/:author", (req, res) => {
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

  const getSpecificBook = await BookModel.findOne({
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

  return res.json({ book: getSpecificBookxs);
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

bookapi.get("/authors/author/:author", (req, res) => {
  const getSpecificAuthor = database.authors.filter(
    (author) => author.name === req.params.author
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No author found with the name ${req.params.author}`,
    });
  }
  return res.json({ author: getSpecificAuthor });
});

/*
Route           /authors/isbn
Description     get a list of authors based on a book's ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/

bookapi.get("/authors/isbn/:isbn", (req, res) => {
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

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/

bookapi.get("/publications", (req, res) => {
  return res.json({ publications: database.publications });
});

/*
Route           /publications/pubname
Description     get a specific author by name
Access          PUBLIC
Parameters      pubname
Method          GET
*/

bookapi.get("/publications/pubname/:pubname", (req, res) => {
  const getSpecificPublication = database.publications.filter(
    (pub) => pub.name === req.params.pubname
  );

  if (getSpecificPublication.length === 0) {
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

bookapi.get("/publications/isbn/:isbn", (req, res) => {
  const getSpecificPublications = database.publications.filter((pub) =>
    pub.books.includes(req.params.isbn)
  );

  if (getSpecificPublications.length === 0) {
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

bookapi.post("/publication/new", (req, res) => {
  //We will use request body here instead of request parameter
  const { newPublication } = req.body;
  database.publications.push(newPublication);
  return res.json({
    publications: database.publications,
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

bookapi.put("/book/update/:isbn", (req, res) => {
  //froEach directly modifies the array so we will use it for now
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.title = req.body.title;
    }
  });

  return res.json({
    books: database.books,
    message: "The title of the book has been updated",
  });
});

/*
Route           /book/author/update
Description     update/add  author for the book
Access          PUBLIC
Parameters      isbn
Method          PUT
*/

bookapi.put("/book/author/update/:isbn", (req, res) => {
  //update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      return book.authorid.push(req.body.authorid);
    }
  });
  //update the author database
  database.authors.forEach((author) => {
    if (author.id === req.body.authorid) {
      return author.books.push(req.params.isbn);
    }
  });

  return res.json({
    books: database.books,
    authors: database.authors,
    message: "Author updated for the book",
  });
});

/*
Route           /author/update
Description     update author name
Access          PUBLIC
Parameters      name
Method          PUT
*/

bookapi.put("/author/update/:name", (req, res) => {
  //froEach directly modifies the array so we will use it for now
  database.authors.forEach((author) => {
    if (author.name === req.params.name) {
      author.name = req.body.name;
    }
  });

  return res.json({
    authors: database.authors,
    message: "Author updated for the book",
  });
});

/*
Route           /publication/update
Description     update publication name
Access          PUBLIC
Parameters      name
Method          PUT
*/

bookapi.put("/publication/update/:name", (req, res) => {
  //froEach directly modifies the array so we will use it for now
  database.publications.forEach((pub) => {
    if (pub.name === req.params.name) {
      pub.name = req.body.name;
    }
  });

  return res.json({
    publications: database.publications,
    message: "Updated name of the publication",
  });
});

/*
Route           /publication/book/update
Description     update/add book for a publication
Access          PUBLIC
Parameters      pubid
Method          PUT
*/

bookapi.put("/publication/book/update/:pubid", (req, res) => {
  //update the publication database
  database.publications.forEach((pub) => {
    if (pub.id === parseInt(req.params.pubid)) {
      return pub.books.push(req.body.isbn);
    }
  });
  //update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.body.isbn) {
      return (book.publication = parseInt(req.params.pubid));
    }
  });

  return res.json({
    books: database.books,
    publications: database.publications,
    message: "Book updated for the publication",
  });
});

/*
Route           /book/delete
Description     delete a book 
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/

bookapi.delete("/book/delete/:isbn", (req, res) => {
  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  );

  database.books = updatedBookDatabase;

  return res.json({ books: database.books });
});

/*
Route           /book/author/delete
Description     delete an author for a book 
Access          PUBLIC
Parameters      isbn, authorid
Method          DELETE
*/

bookapi.delete("/book/author/delete/:isbn/:authorid", (req, res) => {
  //update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthorList = book.authorid.filter(
        (author) => author !== parseInt(req.params.authorid)
      );
      book.authorid = newAuthorList;
      return;
    }
  });

  //update the author database
  database.authors.forEach((author) => {
    if (author.id === parseInt(req.params.authorid)) {
      const newBooksList = author.books.filter(
        (book) => book !== req.params.isbn
      );
      author.books = newBooksList;
      return;
    }
  });

  return res.json({
    books: database.books,
    authors: database.authors,
    message: "Author was deleted for the book",
  });
});

/*
Route           /author/delete
Description     delete an author
Access          PUBLIC
Parameters      name
Method          DELETE
*/

bookapi.delete("/author/delete/:name", (req, res) => {
  const updatedAuthorDatabase = database.authors.filter(
    (author) => author.name !== req.params.name
  );

  database.authors = updatedAuthorDatabase;

  return res.json({ authors: database.authors });
});

/*
Route           /publication/delete
Description     delete a publication 
Access          PUBLIC
Parameters      name
Method          DELETE
*/

bookapi.delete("/publication/delete/:name", (req, res) => {
  const updatedPubDatabase = database.publications.filter(
    (pub) => pub.name !== req.params.name
  );

  database.publications = updatedPubDatabase;

  return res.json({ publications: database.publications });
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
  database.publications.forEach((publication) => {
    if (publication.id === parseInt(req.params.pubid)) {
      const newBooksList = publication.books.filter(
        (book) => book !== req.params.isbn
      );
      publication.books = newBooksList;
      return;
    }
  });

  //update book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = "None";
    }
    return;
  });

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
