const express = require('express')
const morgan = require('morgan')

let persons = [
    {
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1
    },
    {
        name: 'Ada Lovelace',
        number: '39-44-5323523',
        id: 2
    },
    {
        name: 'Dan Abramov',
        number: '12-43-234345',
        id: 3
    },
    {
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
        id: 4
    }
]

const app = express()

app.use(express.json())

morgan.token('person', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
})

// tiny + custom person logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

const generateId = () => Math.floor(Math.random()*100000) // Dumb way to do ID generation but anyways...

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>` +
             `<p>${Date(Date.now()).toString()}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})
  
app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({ 
          error: 'name is missing' 
        })
    }
    else if (!body.number) {
        return res.status(400).json({ 
          error: 'number is missing' 
        })
    }
    else if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({ 
          error: 'name must be unique' 
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)
    res.json(person)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    if (persons.some(person => person.id === id)) {
        persons = persons.filter(person => person.id !== id)
        res.status(204).end()
    }
    else {
        res.status(404).end()
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
