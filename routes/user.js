"use strict";
const user = require('../controllers/user')
const router = require('express').Router()

// GET /users - get all users
// GET /users - obtener todos los Usuarios
router.route('/users')
	.get(user.getUsers)
	// POST /user - create a new user
	// POST /user - crear un nuevo usuarios
router.route('/user')
	.post(user.postUser)
	// PUT /user - update a user
	// GET /user - get a user by id
	// GET /user - obtener un usuario por su id
	// PUT /user - actualizar un nuevo usuario
router.route('/user/:userId')
	.get(user.getUser)
	.put(user.updateUser)
	.delete(user.deleteUser)

router.route('/user/:userId/roles')
  .get(user.getUserRoles)

router.route('/user/:userId/role')
	.post(user.addUserRole)

router.route('/user/:userId/role/:roleId')
  .delete(user.deleteUserRole)

module.exports = router
