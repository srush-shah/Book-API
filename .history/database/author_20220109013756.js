const mongoose = require("mongoose");

const AuthorSchema = mongoose.Schema({
    id: Number,
    name: "Srushti",
    books: ["12345ONE"],
})
