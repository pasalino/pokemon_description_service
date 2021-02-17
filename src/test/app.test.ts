import request from 'supertest';
import {expect} from 'chai';
import app from '../app';
import {StatusCodes} from "http-status-codes";


describe('Server Test', () => {
    it('should return 404 if give invalid route', (done) => {
        request(app)
            .get('/dont_exists')
            .set('Accept', 'application/json')
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(StatusCodes.NOT_FOUND);
                expect(res.body.error).to.equal('End-point not found');
                done();
            });
    });
})
