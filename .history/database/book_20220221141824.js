const mongoose = require("mongoose");

//Creating a book schema
const BookSchema = mongoose.Schema({
  ISBN: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 10,
  }, // mongoose validation of required
  title: {}
  type: String,
  required: true,
  minLength: 8,
  maxLength: 10,
},
  authorid: [Number],
  language: String,
  pubDate: String,
  numOfPage: Number,
  category: [String],
  publication: Number,
});

//Create a book model
const BookModel = mongoose.model("books", BookSchema); //books is the name of MongoDB document

module.exports = BookModel;
