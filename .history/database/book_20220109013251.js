const mongoose = require("mongoose");

//Creating a book schema
const BookSchema = mongoose.Schema({
  ISBN: String,
  title: String,
  authorid: [Number],
  language: String,
  pubDate: String,
  numOfPage: Number,
  category: ["fiction", "programming", "tech", "web dev"],
  publication: 1,
});