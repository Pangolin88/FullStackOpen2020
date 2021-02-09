require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms :body'))


app.get('/', (request, response) => {
    response.send('<h1>Welcome to phonebook page</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => response.json(person))
})

app.get('/info', (request, response) => {
    const date = new Date()
    Person.find({}).then(persons => {
        response.send(`<div><p>Phonebook has info for ${persons.length} people</p><p>${date}</p></div>`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person)
                response.json(person)
            else
                response.status(400).end()
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            console.log(result)
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (!body) {
        return response.status(400).json({
            error: 'The form\'s content is empty. Please fill the form with name and number'
        })
    } else if (!body.name) {
        return response.status(400).json({
            error: 'Name is empty.'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'Number is empty.'
        })
    } else {
        const person = new Person({
            'name': body.name,
            'number': body.number,
            'date': new Date()
        })
        person.save().then(savedPerson => {
            response.json(savedPerson)
        }).catch(error => next(error))
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        'name': body.name,
        'number': body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => response.json(updatedPerson))
        .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
    console.log('error: ', error.name)
    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        })
    } else if (error.name === 'MongoError' || error.name === 'ValidationError') {
        return response.status(400).json({
            error: error.message
        })
    }
    next(error)
}

app.use(errorHandler)

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})