import express from 'express';
import { getPokemon } from "./controllers/pokemonController";

const POKEMON_RESOURCE_PREFIX = 'pokemon'

const router = express.Router()

router.get(`/${POKEMON_RESOURCE_PREFIX}/:pokemonName`, getPokemon)

export default router;
