require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./Models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('postData', (req) => JSON.stringify(req.body)); 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

let amoutOfPeople = 0

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelance",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendick",
      number: "39-23-6423122"
    },
    {
      id: 5,
      name: "Mary",
      number: "39-23-6423122"
    }
  ]

  app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

  app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
  })
  
  app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON(), amoutOfPeople = persons.length))

    })
})

app.get('/api/info', (req, res) => {
  const requestDate = new Date()
  res.send(`<div><p>Phonebook has info for ${amoutOfPeople} people</p>
  <p>${requestDate}</p></div>`)
})

  app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    console.log(person)

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
      .then(result => {
          res.status(204).end()
      })
      .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
      name: body.name,
      number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
      .then(updatedPerson => {
          res.json(updatedPerson.toJSON())
      })
      .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
  console.log(error)

  if (error.name === 'CastError' && error.kind == 'ObjectID') {
      return res.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})