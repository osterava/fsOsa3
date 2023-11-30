const express = require('express')
const app = express()

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
    }
  ]

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

  app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/api/info', (req, res) => {
    res.send(pageContent)
  })


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)