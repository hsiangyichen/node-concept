// import seed data files, arrays of objects
import usersData from "../seed-data/users.js";
import postsData from "../seed-data/posts.js";

export async function seed(knex) {
  await knex("post").del();
  await knex("user").del();
  await knex("user").insert(usersData);
  await knex("post").insert(postsData);
}
