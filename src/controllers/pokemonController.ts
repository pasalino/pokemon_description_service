import Express from 'Express';
import {StatusCodes,} from 'http-status-codes';
import {getPokemonDescriptionByName} from "../services/pokemonService";
import {translateInShakespearean} from "../services/translationService";
import logger from "../helpers/logger";

interface Pokemon {
    name: string,
    description: string,
}

const GENERIC_ERROR_MESSAGE_LOG = "Error in getPokemon API";
const GENERIC_ERROR_MESSAGE = "Error in retrieve pokemon information";

export const getPokemon = async (req: Express.Request, res: Express.Response) => {
    const {pokemonName} = req.params;

    let pokemonDescription;
    try {
        pokemonDescription = await getPokemonDescriptionByName(pokemonName);
    } catch (e) {
        let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        let message = GENERIC_ERROR_MESSAGE;
        if (e.message && e.message.includes('not found')) {
            statusCode = StatusCodes.NOT_FOUND;
            message = 'Pokemon not found'
        } else if (e.message && e.message.includes('timeout')) {
            statusCode = StatusCodes.REQUEST_TIMEOUT;
            message = 'Request timeout';
        }
        logger.error(GENERIC_ERROR_MESSAGE_LOG, e);
        return res.status(statusCode).json({error: message});
    }

    let translate;
    try {
        translate = await translateInShakespearean(pokemonDescription.description);
    } catch (e) {
        let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        let message = GENERIC_ERROR_MESSAGE;
        if (e.message && e.message.includes('Translation service in timeout')) {
            statusCode = StatusCodes.REQUEST_TIMEOUT;
            message = 'Request timeout';
        }
        logger.error(GENERIC_ERROR_MESSAGE_LOG, e);
        return res.status(statusCode).json({error: message});
    }
    const pokemon: Pokemon = {name: pokemonDescription.name, description: translate};
    res.status(StatusCodes.OK).json(pokemon);
}
