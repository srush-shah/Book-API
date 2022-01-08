const mongoose = require("mongoose");

//Creating a book schema
const BookSchema = mongoose.Schema({
  ISBN: Str,
  title: "Getting started with MERN",
  authorid: [1, 2],
  language: "en",
  pubDate: "2021-07-07",
  numOfPage: 225,
  category: ["fiction", "programming", "tech", "web dev"],
  publication: 1,
});
