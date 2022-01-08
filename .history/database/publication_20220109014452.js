const mongoose = require("mongoose");

//Creating publication schema
const PublicationSchema = mongoose.Schema({
  id: Number,
  name: String,
  books: [String],
});

//Creating publication model
const PublicationModel = mongoose.model()