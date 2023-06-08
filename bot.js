require('dotenv').config()
const {
    pingEveryone,
    pinMessage,
    getCatFact,
    getInsult

} = require("./botController")

const TeleBot = require('telebot');
const bot = new TeleBot(process.env.TOKEN);

bot.on('/everyone', pingEveryone);

 bot.on('/pin', pinMessage)

 bot.on('/catfact', getCatFact)

 bot.on('/insult', getInsult)

bot.start();
