import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

async function getPosts(_req, res) {
  try {
    const data = await knex("post");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Posts: ${err}`);
  }
}

export { getPosts };
