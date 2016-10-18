"use strict";
const express = require('express')
const service = express()
const bodyParser = require('body-parser')
const config = require('config')
const morgan = require('morgan')
const mongoose = require('mongoose')
const routes = require('./routes/routes')

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

db.on('connect', error => {
  console.log(`Conectado a la base de datos en: ${connectionString}`)
})

db.on('error', error => {
  console.log(`Error de conexion: No se pudo conectar a: ${connectionString}`)
  // process.exit(1)
})

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
routes(service)

service.listen(port, function() {
	console.log('Servicio ejecutandose en el puerto: ' + port);
})

// process.on('uncaughtException', error => {
//     console.error('--ERROR--', error);
//     if (error.syscall !== 'listen')
//       throw error
//
//     switch (error.code) {
//       case 'EACCESS':
//         console.error('El puerto ' + port + ' no posee los permisos necesarios')
//         //process.exit(1)
//         break
//       case 'EADDRINUSE':
//         console.error('El puerto ' + port + ' ya se encuentra en uso')
//         //process.exit(1)
//         break
//       default:
//         throw error
//     }
// })
// Exporta para ser utilizado en el testing
module.exports = service
