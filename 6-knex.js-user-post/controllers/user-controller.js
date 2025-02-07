import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

async function getUsers(_req, res) {
  try {
    const data = await knex("user");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving Users: ${err}`);
  }
}

export { getUsers };
