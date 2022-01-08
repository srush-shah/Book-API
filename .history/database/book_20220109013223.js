const mongoose = require("mongoose");

//Creating a book schema
const BookSchema = mongoose.Schema({
  ISBN: String,
  title: String,
  authorid: [Number],
  language: "en",
  pubDate: "2021-07-07",
  numOfPage: 225,
  category: ["fiction", "programming", "tech", "web dev"],
  publication: 1,
});
