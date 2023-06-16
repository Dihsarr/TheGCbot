const mongoose = require('mongoose')

const Schema = mongoose.Schema

const eventSchema = new Schema({
    eventName:{
        type: String,
        required: true
    }, 
    eventLocation:{
        type: String,
        required: true
    },
    eventDate:{
        type: Date,
        required: true
    },
    eventDescription:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('event' , eventSchema)