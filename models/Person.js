const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(res => {
    console.log('Connected to mongoDB')
})
.catch(err => {
    console.log('Error connecting to mongoDB')
    console.log(err)
})

const personSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true,
        minlength: 3
    },
    number: { 
        type: String,
        required: true,
        minlength: 8
    }
})

personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
