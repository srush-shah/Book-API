const mongoose = require("mongoose");

//Creating publication schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: ["12345ONE"],
})