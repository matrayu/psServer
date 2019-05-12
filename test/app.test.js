const app = require('../app');
const request = require('supertest');
const expect = require('chai').expect;

describe('Get /apps', () => {
    it('should return JSON data', () => {
        return request(app)
            .get('/apps') // invoke the endpoint
            .query({ }) // send the query string NOTHING
            .expect(200) //assert that you get a 200  OK status
            .expect('Content-type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array'); // make sure you get an array
                expect(res.body).to.have.lengthOf.at.least(1); //make sure array has data
                const app = res.body[0]; //set a VAR to some array data
                expect(app).to.include.all.keys('App', 'Category', 'Genres', 'Rating'); //make sure the array includes the specified keys
            });
    })

    it('should be 400 if sort is incorrect', () => {
        return request(app)
            .get('/apps') // invoke the endpoint
            .query({ sort: 'MISTAKE' }) // send the query string some bad data
            .expect(400, 'Sort must be one of App or Rating') //assert that you get a 400 status and the message defined
    })

    it('should sort by App title', () => {
        return request(app)
            .get('/apps')
            .query({sort: 'App'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let i = 0;
                let sorted = true;
                while(sorted && i < res.body.length - 1) {
                sorted = sorted && res.body[i].App < res.body[i + 1].App;
                i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it('should sort by rating', () => {
        return request(app)
            .get('/apps')
            .query({sort: 'Rating'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let i = 0;
                let sorted = true;
                while(sorted && i < res.body.length - 1) {
                    sorted = sorted && res.body[i].Rating >= res.body[i + 1].Rating;
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });
})