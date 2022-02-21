const mongoose = require("mongoose");

//Creating an author schema
const AuthorSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  books: [String],
});

//Creating an author model
const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;
