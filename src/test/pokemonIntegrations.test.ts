import request from 'supertest';
import {expect} from 'chai';
import app from '../app';


describe('Pokemon Api - Integration Tests', () => {
    describe('/pokemon/:pokemonName Get Pokemon by name', () => {

        it('with correct name should be return pokemon name and description', (done) => {
            const pokemonName = 'ditto';
            const apiResponse = {name: pokemonName, description: 'ditto was incredible'}
            const url = `/pokemon/${pokemonName}`;

            request(app)
                .get(url)
                .set('Accept', 'application/json')
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200);
                    expect(res.body).to.deep.equal(apiResponse);
                    done();
                });
        });

    })
})
