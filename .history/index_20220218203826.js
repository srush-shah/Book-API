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
//Configurations
bookapi.use(express.json());

//Establish Database Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection Established"));

//Initializing Microservices
bookapi.use("/book", Books);





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
