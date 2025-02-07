import knex from "knex";
import configuration from "./knexfile.js";

const db = knex(configuration);

// const author = await db("authors");
// console.log("author", author);

// const book = await db("books");
// console.log("book", book);

export default db;
