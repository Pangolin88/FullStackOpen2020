const tmdlRouter = require('express').Router()
const { Pool } = require('pg')



const pool = new Pool({
  host: '10.50.44.99',
  port: '32120',
  database: 'tmdl',
  user: 'postgres',
  password: 'fPJYUp9np6ZZzeLFDB53',
})

tmdlRouter.get('/servers', async (request, response) => {
  pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (err, result) => {
      release()
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log(result.rows)
    })
  })
})

tmdlRouter.get('/info', (request, response) => {
  response.json({
    game: 'TMDL',
    department: 'GS9'
  })
})

module.exports = tmdlRouter
