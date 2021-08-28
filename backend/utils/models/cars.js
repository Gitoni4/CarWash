const mongoose = require('mongoose')

const carschema = new mongoose.Schema({
    name : String,
    type : String
})

const Car = mongoose.model('car', carschema)

module.exports = Car