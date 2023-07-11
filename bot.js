require('dotenv').config()
const mongoose = require('mongoose')
const Address  = require('./models/addressModel')
const User = require('./models/userModel')
const Event = require('./models/eventModel')
const {
    getCatFact,
    pinMessage,
    getInsult,
    getAddress,
    storeID,
    addEvent,
    getEvents,
    editEvent,
    deleteEvent,
} = require("./botController")
const {
    sendEveryone,
    setAddress
} = require('./botController')

const TeleBot = require('telebot');
const bot = new TeleBot(process.env.TOKEN);

//@'s every person in the telegram chat
bot.on('/everyone', async msg => {sendEveryone(msg,bot)})  

//pins a message to the currect chat
bot.on('/pin', async msg => pinMessage(msg, bot) )

 //uses Cat fact api to grab a random cat fact
bot.on('/catfact', getCatFact(msg))

 //uses insult api to grab a random insult
bot.on('/insult', async msg => getInsult(msg,bot) )

 //use to set another users address
bot.on(/^\/setaddress (\S+)\s(.+)$/i, async (msg, props) => setAddress(msg,props,bot))

//grabs a users address
bot.on(/^\/address (.+)$/, async (msg, props) => getAddress(msg,props,bot))

//stores a users id and their username
bot.on('/storeid', async msg => storeID(msg) )

//adds an event
 bot.on(/^\/addevent \[(.+)] \[(.+)] \[(.+)] (.+)$/i, async (msg, props) => addEvent(msg,props))

 // can grab created events
bot.on(/^\/events (.+)$/, async (msg,props) => getEvents(msg,props) )

//used to edit events
bot.on(/^\/editevent \[(.+)] \[(.+)] \[(.+)]/, async (msg,props) => editEvent(msg,props))

//deletes a created event
bot.on(/^\/delevent \[(.+)]/, async (msg,props) => deleteEvent(msg, props) )

 // a dev command
 bot.on('/devTest', msg => console.log(msg))


 //connects bot to database then listens for requests
mongoose.connect(process.env.MONGO_URI)
    .then(() =>{
        console.log('[debug] connected to db');
        bot.start();
    })
    .catch( error => console.log(error))




