const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms :body'))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]

    app.get('/', (request, response) => {
        response.send('<h1>Welcome to phonebook page</h1>')
        })

    app.get('/api/persons', (request, response) => {
        response.json(persons)
    })

    app.get('/info', (request, response) => {
        const date = new Date()
        const num = persons.length
        response.send(`<div><p>Phonebook has info for ${num} people</p><p>${date}</p></div>`)
    })

    app.get('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        const person = persons.find(person => person.id === id)
        if (person)
            response.json(person)
        else
            response.status(400).end()
    })

    app.delete('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
    })

    app.post('/api/persons', (request, response) => {
        if (!request.body){
            return response.status(400).json({
                error: 'content missing'
            })
        } else if (!request.body.name){
            return response.status(400).json({
                error: 'name missing'
            })
        } else if (!request.body.number){
            return response.status(400).json({
                error: 'number missing'
            })
        }
        else {
            const person = persons.filter(person => person.name === request.body.name)
            console.log(person)
            if (person.length > 0){
                return response.status(400).json({
                    error: 'name must be unique'
                })
            }
        }
        const person = request.body
        person.id = Math.floor(Math.random() * 10000000)
        persons = persons.concat(person)
        response.json(person)
    })


    const PORT = 3001
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })