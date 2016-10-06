"use strict";
const Role = require('../models/role')

// Get all roles
// Obtener todos los roles
function getRoles(request, response) {
	Role.find({})
		.then(role => {
			response.send(role)
			response.end()
		})
		.catch(error => {
			response.send(error)
			response.end()
		})
}
// Creates a new Role
// Crea un nuevo Rol
function postRole(request, response) {
	// Create a role instance with the parameters
	let newRole = new Role(request.body)

	newRole.save()
		.then(role => {
			response.json({ message: 'Rol creado con exito' })
			response.end()
		})
		.catch(error => {
			let message = ''
			if(error.code === 11000) {
				message = 'El rol ya existe'
			} else {
				for(let property in error.errors) {
					if(error.errors.hasOwnProperty(property)) {
						message += error.errors[property].message + '<br>'
					}
				}
			}
			response.status(422).send({ message: message.replace(/(^,)|(,$)/g, "") })
			response.end()
		})
}
// Get a role
// Obtener un rol
function findRole(roleId) {
	return Role.findById({ _id: roleId })
}
// Get a role by its roleId
// Obtener un rol por su roleId
function getRole(request, response) {
	findRole(request.params.roleId)
		.then(role => {
			if(role) {
				response.json({ message: 'Rol obtenido con exito', role })
			} else {
				response.status(404).json({ message: 'No se encontro el rol', role })
			}
		})
		.catch(error => {
			response.send(error)
			response.end()
		})
}
// Assign the new data to the role
// Asigna el nuevo dato al rol
function assignRole(oldValue, newValue) {
	return Object.assign(oldValue, newValue).save()
}
// Update a role by its roleId
// Actualizar un rol por su roleId
function updateRole(request, response) {
	findRole(request.params.roleId)
		.then(role => {
			if(role) {
				assignRole(role, request.body)
					.then(role => {
						response.json({ message: 'Rol actualizado con exito', role })
					})
					.catch(error => {
						if(error.code === 11000) {
							response.status(422).send({ message: 'El rol ya existe' })
						} else {
							response.send(error)
							response.end()
						}
					})
			} else {
				response.status(404)
					.send({ message: 'El rol, no es un rol valido' })
			}
		})
		.catch(error => {
			response.send(error)
			response.end()
		})
}

function deleteRole(request, response) {
	findRole(request.params.roleId)
		.then(role => {
			if(role) {
				Role.remove({ _id: role.id })
					.then(role => {
						response.json({ message: 'Rol eliminado con exito' })
					})
					.catch(error => {
						response.send(error)
						response.end()
					})
			} else {
				response.status(404).json({ message: 'El rol, no es un rol valido' })
			}
		})
		.catch(error => {
			response.send(error)
			response.end()
		})
}

module.exports = {
	getRoles,
	postRole,
	getRole,
	updateRole,
	deleteRole
}
