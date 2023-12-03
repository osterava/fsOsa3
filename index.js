const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

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

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  
  })

  app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/api/info', (req, res) => {
    res.send(pageContent)
  })

  app.post('/api/persons', (req, res) => {
    try {
      console.log('Request body:', req.body);
  
      const body = req.body;
  
      if (!body || !body.name && !number || !body.number ) {
        throw new Error('Name or number missing');
      }

      if (persons.some(person => person.name === body.name)) {
        throw new Error('Name must be unique');
      }
  
      console.log('Creating person:', body);
  
      const person = {
        id: generateID(),
        name: body.name,
        number: body.number,
      }
  
      persons = persons.concat(person);
  
      console.log('Person added:', person);
  
      res.json(person);
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: error.message })
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)