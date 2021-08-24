const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny'))



// let requestLogger = (tokens, req, res) => {
//     return [
//         tokens.method(req, res),
//         tokens.url(req, res),
//         tokens.status(req, res),
//         tokens.res(req, res, 'content-length'), '-',
//         tokens['response-time'](req, res), 'ms',
//         morgan.token('body', (req, res) => JSON.stringify(req.body))
//     ].join(' ')
// }

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let phonebook = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]


app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = phonebook.find(person => person.id === id)

    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }

})

app.get('/api/info', (request, response) => {
    const entries = phonebook.length
    const date = new Date()
    response.send(`The phonebook has info for ${entries} people. <br><br> ${date}`)
})

const generateId = () => {
    const maxId = phonebook.length > 0
      ? Math.max(...phonebook.map(n => n.id))
      : 0
    return maxId + 1
  }

const nameExists = (entry) => {
    const alike = phonebook.filter(person => person.name === entry)
    if (alike.length > 0){
        return true
    }
    return false

} 
const numExists = (entry) => {
    const alike = phonebook.filter(person => person.number === entry)
    if (alike.length > 0){
        return true
    }
    return false
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if(nameExists(body.name)){
        return response.status(400).json({
            error: 'this name exists already!'
        })
    }
    if(numExists(body.number)){
        return response.status(400).json({
            error: 'this number exists already!'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
 
    phonebook = phonebook.concat(person)
    response.json(person)

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(person => person.id !== id)
  
    response.status(204).end()
  })

const PORT = 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})