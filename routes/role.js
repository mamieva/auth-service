"use strict";
const role = require('../controllers/role')
const router = require('express').Router()

//GET /roles - get all the roles
//GET /roles - obtener todos los roles
router.route('/roles')
	.get(role.getRoles)
	// POST /role - create a new role
	// POST /role - crea un nuevo rol
router.route('/role')
	.post(role.postRole)
	//GET /role/:roleId - get a role by its roleId
	//GET /role/:roleId - obtener un rol por su roleId
	//PUT /role/:roleId - update a role by its roleId
	//PUT /role/:roleId - actualizar un rol por su roleId
	//DELETE /role/:roleId - delete a role by its roleId
	//DELETE /role/:roleId - eliminar un rol por su roleId
router.route('/role/:roleId')
	.get(role.getRole)
	.put(role.updateRole)
	.delete(role.deleteRole)

module.exports = router
