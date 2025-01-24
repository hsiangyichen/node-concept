import axios from "axios";
import fs from "fs";

const BASE_URL = "https://pokeapi.co/api/v2/";

const getPokemonByType = async (type) => {
  try {
    const response = await axios.get(`${BASE_URL}type/${type}`);
    const pokemonList = response.data.pokemon.map((item) => item.pokemon);

    // Write to JSON file
    fs.writeFileSync(
      "electric-pokemon.json",
      JSON.stringify(pokemonList, null, 2)
    );

    // console.log(
    //   `Fetched ${pokemonList.length} Pokémon and saved to electric-pokemon.json`
    // );

    return pokemonList;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

/* --------------------------------- part 1 --------------------------------- */
getPokemonByType("13");

/* --------------------------------- part 2 --------------------------------- */
// const typeFromCommandLine = process.argv[2];
// getPokemonByType(typeFromCommandLine);
