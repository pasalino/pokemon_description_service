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
        beforeEach(() => {
            env = process.env
        });

        afterEach(() => {
            sinon.restore();
            process.env = env
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

        it('should return string without escape character', async () => {
            process.env.POKEMON_GAME_VERSION = 'ruby'
            const P = new Pokedex();
            sinon.stub(P, "getPokemonSpeciesByName").callsFake(() => pokemonSuccessResponse.apiResponse);
            const pokemonName = 'charizard';
            const pokemon: PokemonDescription = await getPokemonDescriptionByName(pokemonName, P);
            pokemon.description.should.not.include('\n');
            pokemon.description.should.not.include('\r');
            pokemon.description.should.not.include('\t');
            pokemon.description.should.not.include('\f');
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

        it('should return Error if the service Pokedex is down', async () => {
            const P = new Pokedex();
            sinon.stub(P, "getPokemonSpeciesByName").throws(new Error('ENOTFOUND pokeapi.co'))
            await getPokemonDescriptionByName('absol', P).should.be.rejectedWith(Error, "Error in get Pokemon Description by name");
        })

        it('should return Error "Timeout" when the api is in timeout', async () => {
            const P = new Pokedex({timeout: 1});
            sinon.stub(P, "getPokemonSpeciesByName").throws(new Error('timeout of 1ms exceeded'))
            process.env.POKEMON_GAME_VERSION = 'ruby'
            await getPokemonDescriptionByName('absol', P).should.be.rejectedWith(Error, "Get Pokemon Description service in timeout");
        })

    });
});
