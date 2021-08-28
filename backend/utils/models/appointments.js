const mongoose = require('mongoose')
const Car = require('./cars')

const appointmentschema = new mongoose.Schema({
    date : String,
    time : String,
    duration : Number,
    price : Number,
    username : String,
    levelOfDirt : String,
    washType : String,
    carName : String,
    carType : String
})

const Appointment = mongoose.model('appointment', appointmentschema)

module.exports = Appointment