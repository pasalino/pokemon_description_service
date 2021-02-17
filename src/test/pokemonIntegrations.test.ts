import request from 'supertest';
import {expect} from 'chai';
import sinon from 'sinon';
import async from 'async';
import app from '../app';
import {PokemonDescription} from "../services/pokemonService";
import {StatusCodes} from "http-status-codes";

const PokemonService = require("../services/pokemonService");
const TranslationService = require("../services/translationService");


describe('Pokemon Api - Integration Tests', () => {
    describe('/pokemon/:pokemonName Get Pokemon by name', () => {

        const getApiUrl = (pokemonName) => `/pokemon/${pokemonName}`;
        const pokemonDescription: PokemonDescription = {
            name: 'Charizard',
            gameVersion: 'ruby',
            description: "CHARIZARD flies around the sky in search of powerful opponents. It breathes fire of such great heat that it melts anything. However, it never turns its fiery breath on any opponent weaker than itself."
        }

        afterEach(() => {
            sinon.restore();
        })
        it('should return name and description when give existent pokemon name', (done) => {
            const translate = 'Charizard flies \'round the sky in search of powerful opponents. \'t breathes fire of such most wondrous heat yond \'t melts aught. However, \'t nev\'r turns its fiery breath on any opponent weaker than itself.';
            sinon.stub(PokemonService, 'getPokemonDescriptionByName').callsFake(() => pokemonDescription);
            sinon.stub(TranslationService, 'translateInShakespearean').callsFake(() => translate);
            request(app)
                .get(getApiUrl('charizard'))
                .set('Accept', 'application/json')
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(StatusCodes.OK);
                    expect(res.body.name).to.equal(pokemonDescription.name);
                    expect(res.body.description).to.equal(translate);
                    done();
                });
        });

        it('should return Not Found if pokemon doesn\'t exists', (done) => {
            sinon.stub(PokemonService, 'getPokemonDescriptionByName').throws(new Error('Pokemon not found'));
            request(app)
                .get(getApiUrl('mickeymouse'))
                .set('Accept', 'application/json')
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(StatusCodes.NOT_FOUND);
                    expect(res.body.error).to.equal("Pokemon not found");
                    done();
                });
        });

        it('should return Timeout if pokemon request is too long', (done) => {
            sinon.stub(PokemonService, 'getPokemonDescriptionByName').throws(new Error('Get Pokemon Description service in timeout'));
            request(app)
                .get(getApiUrl('charizard'))
                .set('Accept', 'application/json')
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(StatusCodes.REQUEST_TIMEOUT);
                    expect(res.body.error).to.equal("Request timeout");
                    done();
                });
        });

        it('should return generic server error if pokemon request provide generic', (done) => {
            sinon.stub(PokemonService, 'getPokemonDescriptionByName').throws(new Error('Error in get Pokemon Description by name'));
            request(app)
                .get(getApiUrl('charizard'))
                .set('Accept', 'application/json')
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(StatusCodes.INTERNAL_SERVER_ERROR);
                    expect(res.body.error).to.equal("Error in retrieve pokemon information");
                    done();
                });
        });

        it('should return generic server error if translate service provide generic, max quota reached or multiple translation errors', (done) => {
            const url = getApiUrl('charizard');

            const generic = (cb) => {
                sinon.stub(TranslationService, 'translateInShakespearean').throws(new Error('Error translate in shakespearean'));
                sinon.stub(PokemonService, 'getPokemonDescriptionByName').callsFake(() => pokemonDescription);
                request(app)
                    .get(url)
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        expect(res.statusCode).to.be.equal(StatusCodes.INTERNAL_SERVER_ERROR);
                        expect(res.body.error).to.equal("Error in retrieve pokemon information");
                        sinon.restore();
                        cb();
                    });
            }

            const quotaReached = (cb) => {
                sinon.stub(PokemonService, 'getPokemonDescriptionByName').callsFake(() => pokemonDescription);
                sinon.stub(TranslationService, 'translateInShakespearean').throws(new Error('Maximus quota reached in translate service'));
                request(app)
                    .get(url)
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        expect(res.statusCode).to.be.equal(StatusCodes.INTERNAL_SERVER_ERROR);
                        expect(res.body.error).to.equal("Error in retrieve pokemon information");
                        sinon.restore();
                        cb();
                    });
            }

            const notUnique = (cb) => {
                sinon.stub(PokemonService, 'getPokemonDescriptionByName').callsFake(() => pokemonDescription);
                sinon.stub(TranslationService, 'translateInShakespearean').throws(new Error("Error in translation. Translation is not unique or is null"));
                request(app)
                    .get(url)
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        expect(res.statusCode).to.be.equal(StatusCodes.INTERNAL_SERVER_ERROR);
                        expect(res.body.error).to.equal("Error in retrieve pokemon information");
                        sinon.restore();
                        cb();
                    });
            }
            async.series([
                generic,
                quotaReached,
                notUnique,
            ], done)
        });

        it('should return Timeout if translate request is too long', (done) => {
            sinon.stub(PokemonService, 'getPokemonDescriptionByName').callsFake(() => pokemonDescription);
            sinon.stub(TranslationService, 'translateInShakespearean').throws(new Error("Translation service in timeout"));

            request(app)
                .get(getApiUrl('charizard'))
                .set('Accept', 'application/json')
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(StatusCodes.REQUEST_TIMEOUT);
                    expect(res.body.error).to.equal("Request timeout");
                    done();
                });
        });
    })
})
