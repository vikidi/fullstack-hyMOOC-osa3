require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/Person')

const app = express()

app.use(cors())
app.use(express.json())

// For react frontend
app.use(express.static('build'))

// Custom person logging
morgan.token('person', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
})

// tiny + custom person logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.get('/info', (req, res, next) => {
    Person.countDocuments({})
    .then(count => {
        res.send(`<p>Phonebook has info for ${count} people</p>` +
                 `<p>${Date(Date.now()).toString()}</p>`)
    })
    .catch(err => next(err))
})

app.get('/api/persons', (req, res, next) => {
    Person.find({})
    .then(persons => {
        res.json(persons)
    })
    .catch(err => next(err))
})
  
app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
    .then(newPerson => {
        res.json(newPerson)
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then(person => {
        if (person) {
            res.json(person)
        }
        else {
            res.status(404).end()
        }
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
        res.json(updatedPerson)
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = Number(req.params.id)

    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(err => next(err))
})

// Unknown endpoint
app.use((req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
})

// Error handler
app.use((err, req, res, next) => {
    console.error(err.name)
    console.log(err.message);

    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    else if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
    }

    next(err)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
