"use strict";
// Set the enviroment variable NODE_ENV to test
//Establecemos la variable de ambiente NODE_ENV a test
process.env.NODE_ENV = 'test'

const mongoose = require('mongoose')
const Profile = require('../models/profile')
	// Development dependencies
	// Dependencias de desarrollo
const chai = require('chai')
const chaiHttp = require('chai-http')
const service = require('../service')
const should = chai.should()

chai.use(chaiHttp)
	// Main bloc of profile test
	// Bloque principal de pruebas de perfiles
describe('Profile test suite', () => {
	beforeEach(done => {
		Profile.remove({}, error => {
			done()
		})
	})

	//GET /profiles - Obtener todos los perfiles
	describe('GET /profiles', () => {
		it('should get all the profiles', done => {
			chai.request(service)
				.get('/profiles')
				.end((error, response) => {
					response.should.have.status(200)
					response.body.should.be.a('array')
					response.body.length.should.be.eql(0)
					done()
				})
		})
	})
	describe('POST /profile', () => {
		it('should create a new profile', done => {
			let profile = {
				name: 'operator',
				description: 'Un usuario con este perfil podra acceder a la configuracion del sistema',
				status: 'ACTIVO'
			}

			chai.request(service)
				.post('/profile')
				.send(profile)
				.end((error, response) => {
					response.should.have.status(200)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('Perfil creado con exito')
					done()
				})
		})

		it('should not create a profile without a name', done => {
			let profile = {
				description: 'Un usuario con este perfil podra acceder a la configuracion del sistema',
				status: 'ACTIVO'
			}

			chai.request(service)
				.post('/profile')
				.send(profile)
				.end((error, response) => {
					response.should.have.status(422)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('Debe proporcionar un nombre de perfil<br>')
					done()
				})
		})

		it('should not create a profile without description', done => {
			let profile = {
				name: 'operator',
				status: 'ACTIVO'
			}

			chai.request(service)
				.post('/profile')
				.send(profile)
				.end((error, response) => {
					response.should.have.status(422)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('Debe proporcionar una descripcion del perfil<br>')
					done()
				})
		})

		it('should not create a profile without status', done => {
			let profile = {
				name: 'operator',
				description: 'Un usuario con este perfil podra acceder a la configuracion del sistema',
			}

			chai.request(service)
				.post('/profile')
				.send(profile)
				.end((error, response) => {
					response.should.have.status(422)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('Debe definir el estado del perfil<br>')
					done()
				})
		})

		it('profile status should be ACTIVO or INACTIVO', done => {
			let profile = {
				name: 'operator',
				description: 'Un usuario con este perfil podra acceder a la configuracion del sistema',
				status: 'HABILITADO'
			}

			chai.request(service)
				.post('/profile')
				.send(profile)
				.end((error, response) => {
					response.should.have.status(422)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('El estado del perfil solo puede ser ACTIVO o INACTIVO<br>')
					done()
				})
		})

		it('should not create a profile with duplicate name', done => {
			let profile = {
				name: 'operator',
				description: 'Un usuario con este perfil podra acceder a la configuracion del sistema',
				status: 'ACTIVO'
			}

			let newProfile = new Profile(profile)
			newProfile.save()

			chai.request(service)
				.post('/profile')
				.send(profile)
				.end((error, response) => {
					response.should.have.status(422)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('El perfil ya existe')
					done()
				})
		})
	})

	describe('GET /profile/:profileId', () => {
		it('should get a profile by its profileId', done => {
			let profile = new Profile({
				name: 'operator',
				description: 'Un usuario con este perfil podra acceder a la configuracion del sistema',
				status: 'ACTIVO'
			})

			profile.save()

			chai.request(service)
				.get('/profile/' + profile._id)
				.end((error, response) => {
					response.should.have.status(200)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('Perfil obtenido con exito')
					response.body.should.have.property('profile')
					response.body.profile.should.have.property('name')
						.eql('operator')
					response.body.profile.should.have.property('description')
						.eql('Un usuario con este perfil podra acceder a la configuracion del sistema')
					response.body.profile.should.have.property('status')
						.eql('ACTIVO')
					done()
				})
		})

		it('should not get a profile with a invalid profileId', done => {
			let profile = new Profile({
				name: 'operator',
				description: 'Un usuario con este perfil podra acceder a la configuracion del sistema',
				status: 'ACTIVO'
			})

			profile.save()

			chai.request(service)
				.get('/profile/58dece08eb0548118ce31f11')
				.end((error, response) => {
					response.should.have.status(404)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('No se encontro el perfil')
					response.body.should.have.property('profile').to.be.null
					done()
				})
		})
	})

	describe('PUT /profile/:profileId', () => {
		it('should update a profile by its profileId', done => {
			let profile = new Profile({
				name: 'operator',
				description: 'Un usuario con este perfil podra acceder a la configuracion del sistema',
				status: 'ACTIVO'
			})

			profile.save()

			chai.request(service)
				.put('/profile/' + profile._id)
				.send({
					name: 'guest',
					description: 'Un usuario con este perfil solo podra acceder a las partes publicas del sistema',
					status: 'ACTIVO'
				})
				.end((error, response) => {
					response.should.have.status(200)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('Perfil actualizado con exito')
					response.body.should.have.property('profile')
					response.body.profile.should.have.property('name')
						.eql('guest')
					response.body.profile.should.have.property('description')
						.eql('Un usuario con este perfil solo podra acceder a las partes publicas del sistema')
					response.body.profile.should.have.property('status')
						.eql('ACTIVO')
					done()
				})
		})

		it('should not update a profile with a invalid profileId', done => {
			let profile = new Profile({
				name: 'operator',
				description: 'Un usuario con este perfil podra acceder a la configuracion del sistema',
				status: 'ACTIVO'
			})

			profile.save()

			chai.request(service)
				.put('/profile/58dece08eb0548118ce31f11')
				.send({
					name: 'guest',
					description: 'Un usuario con este perfil solo podra acceder a las partes publicas del sistema',
					status: 'ACTIVO'
				})
				.end((error, response) => {
					response.should.have.status(404)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('El perfil, no es un perfil valido')
					done()
				})
		})

		it('should not update a profile to a duplicate name', done => {
			let profile = new Profile({
				name: 'operator',
				description: 'Un usuario con este perfil podra acceder a la configuracion del sistema',
				status: 'ACTIVO'
			})

			profile.save()

			profile = new Profile({
				name: 'guest',
				description: 'Un usuario con este perfil solo podra acceder a las partes publicas del sistema',
				status: 'ACTIVO'
			})

			profile.save()

			chai.request(service)
				.put('/profile/' + profile._id)
				.send({
					name: 'operator',
					description: 'Un usuario con este perfil podra acceder a la configuracion del sistema',
					status: 'ACTIVO'
				})
				.end((error, response) => {
					response.should.have.status(422)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('El perfil ya existe')
					done()
				})
		})
	})

	describe('DELETE /profile/profileId', () => {
		it('should delete a profile by its profileId', done => {
			let profile = new Profile({
				name: 'operator',
				description: 'Un usuario con este perfil podra acceder a la configuracion del sistema',
				status: 'ACTIVO'
			})

			profile.save()

			chai.request(service)
				.delete('/profile/' + profile._id)
				.end((error, response) => {
					response.should.have.status(200)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('Perfil eliminado con exito')
						// response.body.result.should.have.property('ok').eql(1)
						// response.body.result.should.have.property('n').eql(1)
					done()
				})
		})

		it('should not delete a profile with a invalid profileId', done => {
			let profile = new Profile({
				name: 'operator',
				description: 'Un usuario con este perfil podra acceder a la configuracion del sistema',
				status: 'ACTIVO'
			})

			profile.save()

			chai.request(service)
				.delete('/profile/58dece08eb0548118ce31f11')
				.end((error, response) => {
					response.should.have.status(404)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('El perfil, no es un perfil valido')
					done()
				})
		})
	})
})
