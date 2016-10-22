"use strict";
// Set the enviroment variable NODE_ENV to test
// Establecemos la variable de ambien NODE_ENV a test
process.env.NODE_ENV = 'test'

const mongoose = require('mongoose')
const Role = require('../models/role')
	// Development dependencies
	// Dependencias de desarrollo
const chai = require('chai')
const chaiHttp = require('chai-http')
const service = require('../service')
const should = chai.should()

chai.use(chaiHttp)
	// Main block of role test
	// Bloque principal de pruebas de roles
describe('Role test suite', () => {
	beforeEach(done => {
		Role.remove({}, error => {
			done()
		})
	})

	// GET /roles - Obtener todos los roles
	describe('GET /roles', () => {
			it('should get all the users', done => {
				chai.request(service)
					.get('/roles')
					.end((error, response) => {
						response.should.have.status(200)
						response.body.should.be.a('array')
						response.body.length.should.be.eql(0)
						done()
					})
			})
		})
		// POST /role - Crea un nuevo rol
	describe('POST /role', () => {
		it('should create a new role', done => {
			let role = {
				name: 'admin_role',
				description: 'Un usuario con este rol, posee permisos de administrador',
				status: 'ACTIVO'
			}

			chai.request(service)
				.post('/role')
				.send(role)
				.end((error, response) => {
					response.should.have.status(200)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('Rol creado con exito')
					done()
				})
		})

		it('should not create a role without a name', done => {
			let role = {
				description: 'Un usuario con este rol, posee permisos de administrador',
				status: 'ACTIVO'
			}

			chai.request(service)
				.post('/role')
				.send(role)
				.end((error, response) => {
					response.should.have.status(422)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('Debe proporcionar un nombre de rol<br>')
					done()
				})
		})

		it('should not create a role without description', done => {
			let role = {
				name: 'admin_role',
				status: 'ACTIVO'
			}

			chai.request(service)
				.post('/role')
				.send(role)
				.end((error, response) => {
					response.should.have.status(422)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('Debe proporcionar una descripcion del rol<br>')
					done()
				})
		})

		it('should not create a role without status', done => {
			let role = {
				name: 'admin_role',
				description: 'Un usuario con este rol, posee permisos de administrador',
			}

			chai.request(service)
				.post('/role')
				.send(role)
				.end((error, response) => {
					response.should.have.status(422)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('Debe definir el estado del rol<br>')
					done()
				})
		})

		it('role status should be ACTIVO or INACTIVO', done => {
			let role = {
				name: 'admin_role',
				description: 'Un usuario con este rol, posee permisos de administrador',
				status: 'HABILITADO'
			}

			chai.request(service)
				.post('/role')
				.send(role)
				.end((error, response) => {
					response.should.have.status(422)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('El estado del rol solo puede ser ACTIVO o INACTIVO<br>')
					done()
				})
		})

		it('should not create a rol with duplicate name', done => {
			let role = {
				name: 'admin_role',
				description: 'Un usuario con este rol, posee permisos de administrador',
				status: 'ACTIVO'
			}

			let newRole = new Role(role)
			newRole.save()

			chai.request(service)
				.post('/role')
				.send(role)
				.end((error, response) => {
					response.should.have.status(422)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('El rol ya existe')
					done();
				})
		})
	})

	describe('GET /role/:roleId', () => {
		it('should get a user by its roleId', done => {
			let role = new Role({
				name: 'admin_role',
				description: 'Un usuario con este rol, posee permisos de administrador',
				status: 'ACTIVO'
			})

			role.save()

			chai.request(service)
				.get('/role/' + role._id)
				.end((error, response) => {
          console.log('--RESPONSE--', response.statusCode);
          console.log('--RESPONSE--', response.body);
          console.log('--RESPONSE--', response.text);
					response.should.have.status(200)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('Rol obtenido con exito')
					response.body.should.have.property('role')
					response.body.role.should.have.property('name')
						.eql('admin_role')
					response.body.role.should.have.property('description')
						.eql('Un usuario con este rol, posee permisos de administrador')
					response.body.role.should.have.property('status')
						.eql('ACTIVO')
					done()
				})
		})

		it('should not get a role with a invalid roleId', done => {
			let role = new Role({
				name: 'admin_role',
				description: 'Un usuario con este rol, posee permisos de administrador',
				status: 'ACTIVO'
			})

			role.save()

			chai.request(service)
				.get('/role/58dece08eb0548118ce31f11')
				.end((error, response) => {
					response.should.have.status(404)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('No se encontro el rol')
					response.body.should.have.property('role').to.be.null
					done()
				})
		})
	})

	describe('/PUT /role/:roleId', () => {
		it('should update a role by its roleId', done => {
			let role = new Role({
				name: 'admin_role',
				description: 'Un usuario con este rol, posee permisos de administrador',
				status: 'ACTIVO'
			})

			role.save()

			chai.request(service)
				.put('/role/' + role._id)
				.send({
					name: 'developer_role',
					description: 'Un usuario con este rol, posee permisos de desarrollador',
					status: 'INACTIVO'
				})
				.end((error, response) => {
					response.should.have.status(200)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('Rol actualizado con exito')
					response.body.should.have.property('role')
					response.body.role.should.have.property('name')
						.eql('developer_role')
					response.body.role.should.have.property('description')
						.eql('Un usuario con este rol, posee permisos de desarrollador')
					response.body.role.should.have.property('status')
						.eql('INACTIVO')
					done()
				})
		})

		it('should not update a role with a invalid roleId', done => {
			let role = new Role({
				name: 'admin_role',
				description: 'Un usuario con este rol, posee permisos de administrador',
				status: 'ACTIVO'
			})

			role.save()

			chai.request(service)
				.put('/role/58dece08eb0548118ce31f11')
				.send({
					name: 'developer_role',
					description: 'Un usuario con este rol, posee permisos de desarrollador',
					status: 'INACTIVO'
				})
				.end((error, response) => {
					response.should.have.status(404)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('El rol, no es un rol valido')
					done()
				})
		})

		it('should not update a role to a duplicate name', done => {
			let role = new Role({
				name: 'admin_role',
				description: 'Un usuario con este rol, posee permisos de administrador',
				status: 'ACTIVO'
			})

			role.save()

			role = new Role({
				name: 'developer_role',
				description: 'Un usuario con este rol, posee permisos de desarrollador',
				status: 'ACTIVO'
			})

			role.save()

			chai.request(service)
				.put('/role/' + role._id)
				.send({
					name: 'admin_role',
					description: 'Un usuario con este rol, posee permisos de desarrollador',
					status: 'INACTIVO'
				})
				.end((error, response) => {
					response.should.have.status(422)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('El rol ya existe')
					done()
				})
		})
	})

	describe('DELETE /role/:roleId', () => {
		it('should delete a role by its roleId', done => {
			let role = new Role({
				name: 'admin_role',
				description: 'Un usuario con este rol, posee permisos de administrador',
				status: 'ACTIVO'
			})

			role.save()

			chai.request(service)
				.delete('/role/' + role._id)
				.end((error, response) => {
					response.should.have.status(200)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('Rol eliminado con exito')
					done()
				})
		})

		it('should not delete a role with a invalid roleId', done => {
			let role = new Role({
				name: 'admin_role',
				description: 'Un usuario con este rol, posee permisos de administrador',
				status: 'ACTIVO'
			})

			role.save()

			chai.request(service)
				.delete('/role/58dece08eb0548118ce31f11')
				.end((error, response) => {
					response.should.have.status(404)
					response.body.should.be.a('object')
					response.body.should.have.property('message')
						.eql('El rol, no es un rol valido')
					done()
				})
		})
	})
})
