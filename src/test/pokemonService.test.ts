import chai from 'chai';
import chaiAsPromised from "chai-as-promised";
import sinon from 'sinon';
import Pokedex from 'pokedex-promise-v2'
import {getPokemonDescriptionByName, PokemonDescription} from "../services/pokemonService";
import {pokemonSuccessResponse, pokemonWithoutDescriptionResponse} from "./pokemonServiceResponse";

chai.use(chaiAsPromised);
chai.should();

describe('Pokemon Service', () => {
    describe('getPokemonDescriptionByName', () => {
        let env;
        before(() => {
            env = process.env
        });

        it('should return Error when give a null or empty name', async () => {
            await getPokemonDescriptionByName(null).should.be.rejectedWith(Error, "pokemonName must be a valid not empty string");
            await getPokemonDescriptionByName("").should.be.rejectedWith(Error, "pokemonName must be a valid not empty string");
        })

        it('should return Pokemon Object when call with exists pokemon name', async () => {
            process.env.POKEMON_GAME_VERSION = 'ruby'
            const P = new Pokedex();
            sinon.stub(P, "getPokemonSpeciesByName").callsFake(() => pokemonSuccessResponse.apiResponse);
            const pokemonName = 'charizard';
            const pokemon: PokemonDescription = await getPokemonDescriptionByName(pokemonName, P);

            pokemon.name.should.be.to.equal(pokemonSuccessResponse.methodResponse.name);
            pokemon.gameVersion.should.be.to.equal(process.env.POKEMON_GAME_VERSION);
            pokemon.description.should.be.to.equal(pokemonSuccessResponse.methodResponse.description);
        })

        it('should return Error "Not Found" when give a non-existent Pokemon name', async () => {
            const P = new Pokedex();
            sinon.stub(P, "getPokemonSpeciesByName").throws(new Error("Not found with status code 404"));
            await getPokemonDescriptionByName('NoPokemon', P).should.be.rejectedWith(Error, "Pokemon not found");
            await getPokemonDescriptionByName('Pickachu', P).should.be.rejectedWith(Error, "Pokemon not found");
            await getPokemonDescriptionByName('blaStoise', P).should.be.rejectedWith(Error, "Pokemon not found");
        })

        it('should return Error "Not Found" when give an existent Pokemon name but not in desired version or language', async () => {
            const P = new Pokedex();
            sinon.stub(P, "getPokemonSpeciesByName").callsFake(() => pokemonWithoutDescriptionResponse.apiResponse);

            process.env.POKEMON_GAME_VERSION = 'ruby'
            await getPokemonDescriptionByName('absol', P).should.be.rejectedWith(Error, "Pokemon not found");
            process.env.POKEMON_GAME_VERSION = 'platinum'
            await getPokemonDescriptionByName('absol', P).should.be.rejectedWith(Error, "Pokemon not found");
        })

        after(() => process.env = env);
    });
});
