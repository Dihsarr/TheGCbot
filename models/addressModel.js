const mongoose = require('mongoose')

const Schema = mongoose.Schema

const addressSchema = new Schema({
    //the User that used the command
    setUser:{
        type: Number,
        required: true
    },
    //the user of the adress that is being stored
    targetUser:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('address', addressSchema)