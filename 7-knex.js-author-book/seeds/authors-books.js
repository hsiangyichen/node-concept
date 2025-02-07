import authorsData from "../seed-data/authors-data.js";
import booksData from "../seed-data/books-data.js";

export async function seed(knex) {
  // Delete previous table data, then insert seed data
  await knex("authors").del();
  await knex("authors").insert(authorsData);
  await knex("books").del();
  await knex("books").insert(booksData);
}
