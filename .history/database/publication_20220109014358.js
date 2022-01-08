const mongoose = require("mongoose");

//Creating publication schema
const PublicationSchema = mongoose.Schema({
    id: 1,
    name: "Chakra",
    books: ["12345ONE"],
})