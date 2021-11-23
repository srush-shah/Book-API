//Framework
const express = require("express");

//Database
const database = require("./database/index");

//Initializing express
const bookapi = express();

//Configurations
bookapi.use(express.json());

/*
Route           /
Description     get all books
Access          PUBLIC
Parameters      NONE
Method          GET
*/

bookapi.get("/", (req, res) => {
  return res.json({ books: database.books });
});

/*
Route           /isbn
Description     get a specific book based on ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/

bookapi.get("/isbn/:isbn", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route           /category
Description     get specific books based on a category
Access          PUBLIC
Parameters      category
Method          GET
*/

bookapi.get("/category/:category", (req, res) => {
  const getSpecificBooks = database.books.filter((book) =>
    book.category.includes(req.params.category)
  );

  if (getSpecificBooks.length === 0) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }

  return res.json({ book: getSpecificBooks });
});

/*
Route           /books
Description     get specific books based on an author
Access          PUBLIC
Parameters      author
Method          GET
*/

bookapi.get("/books/:author", (req, res) => {
  const getSpecificAuthor = database.authors.filter(
    (author) => author.name === req.params.author
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No author found with the name ${req.params.author}`,
    });
  }

  const getSpecificBooks = database.books.filter((book) =>
    book.authorid.includes(getSpecificAuthor[0].id)
  );

  if (getSpecificBooks.length === 0) {
    return res.json({
      error: `No book found for the author ${req.params.author}`,
    });
  }

  return res.json({ book: getSpecificBooks });
});

/*
Route           /authors
Description     get all authors
Access          PUBLIC
Parameters      NONE
Method          GET
*/

bookapi.get("/authors", (req, res) => {
  return res.json({ authors: database.authors });
});

/*
Route           /authors/author
Description     get a specific author by name
Access          PUBLIC
Parameters      author
Method          GET
*/

bookapi.get("/authors/author/:author", (req, res) => {
  const getSpecificAuthor = database.authors.filter(
    (author) => author.name === req.params.author
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No author found with the name ${req.params.author}`,
    });
  }
  return res.json({ author: getSpecificAuthor });
});

/*
Route           /authors/isbn
Description     get a list of authors based on a book's ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/

bookapi.get("/authors/isbn/:isbn", (req, res) => {
  const getSpecificAuthors = database.authors.filter((author) =>
    author.books.includes(req.params.isbn)
  );

  if (getSpecificAuthors.length === 0) {
    return res.json({
      error: `No author found for the book ${req.params.isbn}`,
    });
  }

  return res.json({ authors: getSpecificAuthors });
});

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/

bookapi.get("/publications", (req, res) => {
  return res.json({ publications: database.publications });
});

/*
Route           /publications/pubname
Description     get a specific author by name
Access          PUBLIC
Parameters      pubname
Method          GET
*/

bookapi.get("/publications/pubname/:pubname", (req, res) => {
  const getSpecificPublication = database.publications.filter(
    (pub) => pub.name === req.params.pubname
  );

  if (getSpecificPublication.length === 0) {
    return res.json({
      error: `No publication found with the name ${req.params.pubname}`,
    });
  }
  return res.json({ publication: getSpecificPublication });
});

/*
Route           /publications/isbn
Description     get a list of authors based on a book's ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/

bookapi.get("/publications/isbn/:isbn", (req, res) => {
  const getSpecificPublications = database.publications.filter((pub) =>
    pub.books.includes(req.params.isbn)
  );

  if (getSpecificPublications.length === 0) {
    return res.json({
      error: `No publication found for the isbn ${req.params.isbn}`,
    });
  }

  return res.json({ publications: getSpecificPublications });
});

/*
Route           /book/new
Description     add new book
Access          PUBLIC
Parameters      NONE
Method          POST
*/

bookapi.post("/book/new", (req, res) => {
  //We will use request body here instead of request parameter
  const { newBook } = req.body;
  database.books.push(newBook);
  return res.json({ books: database.books, message: "The book was added" });
});

/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/

bookapi.post("/author/new", (req, res) => {
  //We will use request body here instead of request parameter
  const { newAuthor } = req.body;
  database.authors.push(newAuthor);
  return res.json({
    authors: database.authors,
    message: "The author was added",
  });
});

/*
Route           /publication/new
Description     add new publication
Access          PUBLIC
Parameters      NONE
Method          POST
*/

bookapi.post("/publication/new", (req, res) => {
  //We will use request body here instead of request parameter
  const { newPublication } = req.body;
  database.publications.push(newPublication);
  return res.json({
    publications: database.publications,
    message: "The publication was added",
  });
});

/*
Route           /book/update
Description     update book title
Access          PUBLIC
Parameters      isbn
Method          PUT
*/

bookapi.put("/book/update/:isbn", (req, res) => {
  //froEach directly modifies the array so we will use it for now
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.title = req.body.title;
    }
  });

  return res.json({ books: database.books });
});

/*
Route           /book/author/update
Description     update/add  author for the book
Access          PUBLIC
Parameters      isbn
Method          PUT
*/

bookapi.put("/book/update/:isbn", (req, res) => {
  //update the book database
  database.books.
  //update the author database
});

bookapi.listen(3000, () => console.log("Server running!"));
