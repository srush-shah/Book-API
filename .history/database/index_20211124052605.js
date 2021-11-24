const books = [
  {
    ISBN: "12345ONE",
    title: "Getting started with MERN",
    authorid: [1, 2],
    language: "en",
    pubDate: "2021-07-07",
    numOfPage: 225,
    category: ["fiction", "programming", "tech", "web dev"],
    publication: 1,
  },
  {
    ISBN: "12345TWO",
    title: "Getting started with HTML",
    authorid: [1, 3],
    language: "en",
    pubDate: "2021-07-07",
    numOfPage: 2000,
    category: ["fiction", "programming", "tech", "web dev"],
    publication: 1,
  },
];

const authors = [
  {
    id: 1,
    name: "Srushti",
    books: ["12345ONE"],
  },
  {
    id: 2,
    name: "Deepak",
    books: ["12345ONE"],
  },
  {
    id: 3,
    name: "Sakshi",
    books: [],
  },
];

const publications = [
  {
    id: 1,
    name: "Chakra",
    books: ["12345ONE"],
  },
  {
    id: 2,
    name: "React",
    books: [],
  },
];

module.exports = { books, authors, publications };
