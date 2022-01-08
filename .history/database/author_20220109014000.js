const mongoose = require("mongoose");

//Creating an author 
const AuthorSchema = mongoose.Schema({
  id: Number,
  name: String,
  books: [String],
});

const AuthorModel = mongoose.model(AuthorSchema);

module.exports = AuthorModel;
