const mongoose = require("mongoose");

//Creating publication schema
const PublicationSchema = mongoose.Schema({
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

//Creating publication model
const PublicationModel = mongoose.model("publications", PublicationSchema);

module.exports = PublicationModel;
