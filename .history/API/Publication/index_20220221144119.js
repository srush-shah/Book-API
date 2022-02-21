//Initializing Express Router
const Router = require("express").Router();

//Database Model
const PublicationModel = require("../../database/publication");

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/

Router.get("/", async (req, res) => {
  try {
    const getAllPublications = await PublicationModel.find();
    return res.json({ publications: getAllPublications });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /publications/pubname
  Description     get a specific author by name
  Access          PUBLIC
  Parameters      pubname
  Method          GET
  */

Router.get("/pubname/:pubname", async (req, res) => {
  try {
    const getSpecificPublication = await PublicationModel.findOne({
      name: req.params.pubname,
    });
    /*const getSpecificPublication = database.publications.filter(
        (pub) => pub.name === req.params.pubname
      );*/

    if (!getSpecificPublication) {
      return res.json({
        error: `No publication found with the name ${req.params.pubname}`,
      });
    }
    return res.json({ publication: getSpecificPublication });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /publications/isbn
  Description     get a list of authors based on a book's ISBN
  Access          PUBLIC
  Parameters      isbn
  Method          GET
  */

Router.get("/isbn/:isbn", async (req, res) => {
  try {
    const getSpecificPublications = await PublicationModel.find({
      books: req.params.isbn,
    });
    /*const getSpecificPublications = database.publications.filter((pub) =>
        pub.books.includes(req.params.isbn)
      );*/

    if (!getSpecificPublications) {
      return res.json({
        error: `No publication found for the isbn ${req.params.isbn}`,
      });
    }

    return res.json({ publications: getSpecificPublications });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /publication/new
  Description     add new publication
  Access          PUBLIC
  Parameters      NONE
  Method          POST
  */

Router.post("/new", async (req, res) => {
  try {
    //We will use request body here instead of request parameter
    const { newPublication } = req.body;
    await PublicationModel.create(newPublication);
    return res.json({
      message: "The publication was added",
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /publication/update
  Description     update publication name
  Access          PUBLIC
  Parameters      name
  Method          PUT
  */

Router.put("/update/:name", async (req, res) => {
  try {
    const updatedPublication = await PublicationModel.findOneAndUpdate(
      { name: req.params.name },
      { name: req.body.name },
      { new: true }
    );
    //forEach directly modifies the array so we will use it for now
    /*database.publications.forEach((pub) => {
        if (pub.name === req.params.name) {
          pub.name = req.body.name;
        }
      });*/

    return res.json({
      publications: updatedPublication,
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /publication/book/update
  Description     update/add book for a publication
  Access          PUBLIC
  Parameters      pubid
  Method          PUT
  */

Router.put("/book/update/:pubid", async (req, res) => {
  try {
    //update the publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate(
      { pubid: parseInt(req.params.pubid) },
      {
        $addToSet: {
          books: req.body.isbn,
        },
      },
      { new: true }
    );
    /*database.publications.forEach((pub) => {
      if (pub.id === parseInt(req.params.pubid)) {
        return pub.books.push(req.body.isbn);
      }
    });*/
    //update the book database
    const updatedBook = await BookModel.findOneAndUpdate(
      { ISBN: req.body.isbn },
      { publication: parseInt(req.params.pubid) },
      { new: true }
    );
    /*database.books.forEach((book) => {
      if (book.ISBN === req.body.isbn) {
        return (book.publication = parseInt(req.params.pubid));
      }
    });*/

    return res.json({
      books: updatedBook,
      publications: updatedPublication,
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /publication/delete
  Description     delete a publication 
  Access          PUBLIC
  Parameters      name
  Method          DELETE
  */

Router.delete("/delete/:name", async (req, res) => {
  try {
    const deletedPublication = await PublicationModel.findOneAndDeleteI({
      name: req.params.name,
    });
    /* const updatedPubDatabase = database.publications.filter(
        (pub) => pub.name !== req.params.name
      );
    
      database.publications = updatedPubDatabase;*/

    return res.json({ publications: deletedPublication });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
  Route           /publication/book/delete
  Description     delete a book from a publication 
  Access          PUBLIC
  Parameters      isbn, pubid
  Method          DELETE
  */

Router.delete("/book/delete/:isbn/:pubid", async (req, res) => {
  try {
    
  } catch (error) {
    
  }
  //update publication database

  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: req.params.pubid,
    },
    {
      $pull: {
        books: req.params.isbn,
      },
    },
    { new: true }
  );
  /*database.publications.forEach((publication) => {
      if (publication.id === parseInt(req.params.pubid)) {
        const newBooksList = publication.books.filter(
          (book) => book !== req.params.isbn
        );
        publication.books = newBooksList;
        return;
      }
    });*/

  //update book database

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $set: {
        publication: null,
      },
    },
    { new: true }
  );
  /*database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
        book.publication = "None";
      }
      return;
    });*/

  return res.json({
    books: updatedBook,
    publications: updatedPublication,
  });
});

module.exports = Router;
