const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    name : String,
    email : String,
    phone : String,
    password : String
})

const User = mongoose.model('user', userschema)

module.exports = User