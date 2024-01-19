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

  function generateID() {
    let newId

    do {
        newId = Math.floor(Math.random()*100000)
    } while (persons.some(entry => entry.id === newId)) return newId
  }

  const currentTime = new Date()
  const numberOfPeople = persons.length

  const pageContent = `
  <html>
    <head>
      <title>Phonebook Info</title>
    </head>
    <body>
     <p>Phonebook has info for ${numberOfPeople} people</p>
      <p>${currentTime}</p>
    </body>
  </html>
`;

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(req.params.id)
      .then(person => {
        if (person){
          response.json(person.toJSON())
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
})

  app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
  })
  
  app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON(), personAmount = persons.length))

    })
})

  app.get('/api/info', (req, res) => {
    res.send(pageContent)
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
  Person.findByIdAndRemove(req.params.id)
      .then(result => {
          res.status(204).end()
      })
      .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})