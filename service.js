"use strict";
const express = require('express')
const service = express()
const bodyParser = require('body-parser')
const config = require('config')
const morgan = require('morgan')
const mongoose = require('mongoose')

const port = process.env.REST_PORT || 3000
	// Database configuration
	// Configuracion de la base de datos
let options = {
		server: {
			socketOptions: {
				keepAlive: 1,
				connectTimeOutMS: 30000
			}
		},
		replset: {
			socketOptions: {
				keepAlive: 1,
				connectTimeOutMS: 30000
			}
		}
	}
// Default type promises
// Promesas por omision nativas
mongoose.Promise = global.Promise
// Database connection
// Conexion a la base de datos
//mongoose.connect('mongodb://localhost:27017/authentication')
const connectionString = `${config.dbhost.url}:${config.dbhost.port}/${config.dbhost.db}`
mongoose.connect(connectionString, options)
const db = mongoose.connection

db.on('connect', console.log.bind(console, `Conectado a la base de datos en: ${connectionString}`))
db.on('error', console.log.bind(console, 'Error de conexion: No se pudo conectar a : ${connectionString}'))

// Don't show log when is testing
// No mostrar la bitacora cuando se hacen las pruebas
if(config.util.getEnv('NODE_ENV') !== 'test') {
// Use morgan for the log in the command line
// Utiliza morgan para la bitacora en la linea de comandos
// Apache log style - Bitacora al estilo de Apache
	service.use(morgan('combined'))
}

service.use(bodyParser.json())
service.use(bodyParser.urlencoded({
	extended: true
}))
service.use(bodyParser.text())
service.use(bodyParser.json({
		type: 'application/json'
	}))
	// Routes
service.use('/', require('./routes/common'))
service.use('/', require('./routes/role'))
service.use('/', require('./routes/profile'))
service.use('/', require('./routes/user'))

service.listen(port, function() {
	console.log('Servicio ejecutandose en el puerto: ' + port);
})

// Exporta para ser utilizado en el testing
module.exports = service
