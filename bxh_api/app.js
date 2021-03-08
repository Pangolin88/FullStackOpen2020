const express = require('express')
const app = express()
const tmdlRouter = require('./tmdl/tmdl')
const jx1mRouter = require('./jx1m/jx1m')


app.use(express.json())
app.use('/tmdl', tmdlRouter)
app.use('/jx1m', jx1mRouter)

module.exports = app