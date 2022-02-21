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
const Authors = require("./API/Author");
const Publications = require("./API/Publication");
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
bookapi.use("/author", Authors);
bookapi.use('/publication')

bookapi.listen(3000, () => console.log("Server running!"));

//Mongoose -> Talks to mongodb the way it understands -> talks to us in JavaScript

/* Why Schema? 

MongoDB is Schemaless

Mongoose helps you with validation, relationship with other data */

//Mongoose model is document model of MongoDB
//Booky - Database - Collection
//books,authors,publications - Objects - Document
