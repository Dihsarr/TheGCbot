const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    //the User that used the command
    id:{
        type: Number,
        required: true,
        unique: true
    },
    //the user of the adress that is being stored
   username:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('users', userSchema)