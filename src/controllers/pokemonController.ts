import Express from 'Express';
import {StatusCodes,} from 'http-status-codes';

interface Pokemon {
    name: string,
    description: string,
}

export const getPokemon = (req: Express.Request, res: Express.Response) => {
    const {pokemonName} = req.params;
    const pokemon: Pokemon = {name: pokemonName, description: `${pokemonName} was incredible`}
    res.status(StatusCodes.OK).json(pokemon);
}
