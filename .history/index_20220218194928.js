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

//Microservices Routes
const Books = require("./API/Book");
//Initializing express
const bookapi = express();

//Establish Database Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection Established"));


  //Initializing Microservicesz
//Configurations
bookapi.use(express.json());

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

bookapi.get("/publications/pubname/:pubname", async (req, res) => {
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

bookapi.delete("/publication/book/delete/:isbn/:pubid", async (req, res) => {
  //update publication database

  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: req.params.pubid,
    },
    {
      $pull: {
        books: req.params.isbn,
      },
    },
    { new: true }
  );
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

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $set: {
        publication: null,
      },
    },
    { new: true }
  );
  /*database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = "None";
    }
    return;
  });*/

  return res.json({
    books: updatedBook,
    publications: updatedPublication,
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
