const express = require('express')
const app = express()
const tmdlRouter = require('./tmdl/tmdl')


app.use(express.json())
app.use('/tmdl', tmdlRouter)

module.exports = app