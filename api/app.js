require('dotenv').config()
require('./src/config/database').connect()
const express = require('express')
const Auth = require('./src/services/auth-service')
const File = require('./src/services/file-service')

const authenticate = require('./src/middleware/auth')

const app = express()

app.use(express.json())

// Register
app.post('/register', Auth.register)

// Login
app.post('/login', Auth.login)

app.post('/file', authenticate, File.registerFile)

app.get('/file/:fileName', authenticate, File.getFileContent)

app.get('/file', authenticate, File.getAll)
app.get('/file/filtered/:fileName', authenticate, File.getAllFiltered)

app.put('/file/:id', authenticate, File.updateFile)

module.exports = app