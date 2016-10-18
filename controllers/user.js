"use strict";
const Role = require('../models/role')
const User = require('../models/user')
	// Get all the Users
function getUsers(request, response) {
	User.find({})
		.then(user => {
			response.send(user)
			response.end()
		})
		.catch(error => {
			response.send(error)
			response.end()
		})
}

// Creates a new User
function postUser(request, response) {
	// create a user instance with the parameters
	let newUser = new User(request.body)

	newUser.save()
		.then(user => {
			response.json({
				message: 'Usuario creado con exito'
			})
			response.end()
		})
		.catch(error => {
			let message = ''
			if(error.code === 11000) {
				message = 'El nombre de usuario ya existe'
			} else {
				for(let property in error.errors) {
					if(error.errors.hasOwnProperty(property)) {
						message += error.errors[property].message + ','
					}
				}
			}
			response.status(422).send({ message: message.replace(/(^,)|(,$)/g, "") })
			response.end()
		})
}
// Get a user
// Obtener un usuario
function findUser(userId) {
	return User.findById({ _id: userId })
}
// Get a user by userId
function getUser(request, response) {
	findUser(request.params.userId)
		.then(user => {
			if(user) {
				response.json({ message: 'Usuario obtenido con exito', user })
			} else {
				response.status(404).json({ message: 'No se encontro el usuario', user })
			}
		})
		.catch(error => {
			response.send(error)
			response.end()
		})
}
// Assign the new data to the user
// Asigna el nuevo dato a el usuario
function assignUser(oldValue, newValue) {
	return Object.assign(oldValue, newValue).save()
}

// Update a user by userId
// Actualiza un usuario por su userId
function updateUser(request, response) {
	findUser(request.params.userId)
		.then(user => {
			if(user) {
				assignUser(user, request.body)
					.then(user => {
						response.json({ message: 'Usuario actualizado con exito', user })
					})
					.catch(error => {
						if(error.code === 11000) {
							response.status(422).send({ message: 'El usuario ya existe' })
						}
						response.send(error)
						response.end()
					})
			} else {
				response.status(404)
					.send({ message: 'El usuario, no es un usuario valido' })
			}
		})
		.catch(error => {
			response.send(error)
			response.end()
		})
}

function deleteUser(request, response) {
	findUser(request.params.userId)
		.then(user => {
			if(user) {
				User.remove({ _id: user.id })
					.then(user => {
						response.json({ message: 'Usuario eliminado con exito' })
					})
					.catch(error => {
						response.send(error)
						response.end()
					})
			} else {
				response.status(404).json({ message: 'El usuario, no es un usuario valido' })
			}
		})
		.catch(error => {
			response.send(error)
			response.end()
		})
}

function findRole(roleId) {
	return Role.findById({ _id: roleId })
}

function addRole(request, response) {
	function respondOk(message) {
		response.json({ message: 'El rol se añadio con exito' })
		response.end()
	}

	function handleError(error, status, message) {
		if(error) {
			response.send(error)
			response.end()
		} else {
			response.status(status).json({ message })
			response.end()
		}
	}

	findUser(request.params.userId)
		.then(user => {
			if(user) {
				let roleId = request.body.roleId
				if(roleId) {
					findRole(roleId)
						.then(role => {
							if(role) {
								let isIncluded = user.roles
									.map(currentRole => currentRole.toString())
									.includes(roleId)

								if(isIncluded) {
									handleError(null, 422, 'El rol ya se encuentra asociado al usuario')
								} else {
									user.roles.push(roleId)
									user.save()
										.then(user => {
											respondOk('El rol se añadio con exito')
										})
										.catch(handleError)
								}
							} else {
								handleError(null, 422, 'El rol, no es un rol valido')
							}
						})
						.catch(handleError)
				} else {
					handleError(null, 422, 'El rol, no es un rol valido')
				}
			} else {
				handleError(null, 404, 'El usuario, no es un usuario valido')
			}
		})
		.catch(handleError)
}

function getUserRoles(request, response) {
	function respondOk(roles) {
		response.json(roles)
		response.end()
	}

	function handleError(error, status, message) {
		if(error) {
			response.send(error)
			response.end()
		} else {
			response.status(status).json({ message })
			response.end()
		}
	}

	// findUser(request.params.userId)
	//   .populate('roles')
	//   .exec((error, role) => {
	//     console.log('--ROLE--', role)
	//   })
	//   .then(user => {
	//     if (user) {
	//       respondOk(user.roles)
	//     } else {
	//       handleError(null, 404, 'El usuario no es un usuario valido')
	//     }
	//   })
	//   .catch(handleError)

	findUser(request.params.userId)
		.then(user => {
			// console.log('ANTES', user);
			Role.populate(user, { path: 'roles' })
				.then(user => {
					// console.log('++USER++', user)
					if(user) {
						respondOk(user.roles)
					} else {
						handleError(null, 404, 'El usuario no es un usuario valido')
					}
				})
				.catch(handleError)
		})
		.catch(handleError)
}

module.exports = {
	getUsers,
	postUser,
	getUser,
	updateUser,
	deleteUser,
	addRole,
	getUserRoles
}
