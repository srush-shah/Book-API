const Router = require("express").Router;

/*
Route           /
Description     get all books
Access          PUBLIC
Parameters      NONE
Method          GET
*/

bookapi.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
  });