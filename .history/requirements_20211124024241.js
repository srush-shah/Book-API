//Data Requirements

//We are a company that handles book publications

//Book(object) -> Features -> ISBN(id), Title, Author, Language, Pub Date, Pages, Category[]
//Author(object) -> Features -> Name, Id, Books[]
//Publication(object) -> Name, id, books[]

//We will build a database according to the requirements and build an API to manage the database.

//API Requirements

//Books
/* 
We need an API

GET
to get all books ✅
to get specific books ✅
to get a list of books based on category ✅
to get a list of books based on author [Task] ✅

POST
New book (using postman, database to be worked upon later) ✅

PUT
Update book details
Update/Add author for a book

DELETE
delete a book
delete an author for a book
*/

//Authors
/*
We need an API

GET
to get all authors ✅
to get a specific author [Task] ✅
to get a list of authors based on books ✅

POST
New author using postman, database to be worked upon later,book to be added using )✅

PUT
Update author details

DELETE
delete an author
*/

//Publication
/*
We need an API

GET
to get all publications ✅
to get a specific publication [Task] ✅
to get a list of publications  based on books [Task] ✅

POST
New publication

PUT
Update publication details
Update/Add book for a publication

DELETE
delete a book from publication
delete a publication
*/
