"use strict";
process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const service = require('../service')
const should = chai.should()

chai.use(chaiHttp)

// Check if service is online
// Verifica si el servicio esta en linea
describe('Test service online', () => {
	it('GET /ping should return pong', done => {
		chai.request(service)
			.get('/ping')
			.end((error, response) => {
				response.should.have.status(200)
				response.body.should.be.a('string')
				response.body.should.be.eql('pong')
				done()
			})
	})
})
