import Pokedex from 'pokedex-promise-v2'
import logger from "../helpers/logger";

const options = {
    timeout: process.env.EXTERNAL_API_TIMEOUT
}
const P = new Pokedex(options);

export interface PokemonDescription {
    name: string,
    gameVersion: string,
    description: string,
}

export const getPokemonDescriptionByName = async (pokemonName: string, pokedex: Pokedex = P): Promise<PokemonDescription> => {
    if (pokemonName === null || pokemonName.length === 0) throw new Error("pokemonName must be a valid not empty string");
    try {
        const pokemonSpecies = await pokedex.getPokemonSpeciesByName(pokemonName);
        const {name, flavor_text_entries} = pokemonSpecies;

        const flavor = flavor_text_entries.find(f => f.language.name === 'en' && f.version.name === process.env.POKEMON_GAME_VERSION);
        if (!flavor) throw new Error("Pokemon not found");

        const description = flavor.flavor_text.replace(/(\r\n|\n|\r|\f|\t)/gm, " ");
        return {name, gameVersion: flavor.version.name, description};
    } catch (e) {
        logger.debug("Error in getPokemonDescriptionByName", e);
        if (e.message && e.message.includes('Pokemon not found')) throw e;
        if (e.message && e.message.includes('status code 404')) throw new Error("Pokemon not found");
        throw new Error("Error in get Pokemon Description by name");
    }
}
