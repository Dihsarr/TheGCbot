require('dotenv').config()
const mongoose = require('mongoose')
const {
    pingEveryone,
    getCatFact,
} = require("./botController")

const TeleBot = require('telebot');
const bot = new TeleBot(process.env.TOKEN);

bot.on('/everyone', pingEveryone);

 bot.on('/pin', async msg =>{
    try{
        if(!msg.reply_to_message){
            msg.reply.text("Use: Reply to the message you want to pin with /pin")
            return
        }
        await bot.pinChatMessage(msg.chat.id, msg.reply_to_message.message_id)
    } catch(error){
        console.log(error);
    }
 } )

 bot.on('/catfact', getCatFact)

 bot.on('/insult', async msg => {
    try{
        const response = await fetch("https://evilinsult.com/generate_insult.php?lang=en&type=json")
        const json = await response.json()
        if(msg.reply_to_message){
            await bot.sendMessage(msg.chat.id,json.insult, {replyToMessage: msg.reply_to_message.message_id})
            return 
        }
        msg.reply.text(json.insult)

    }catch(error){
        msg.reply.text('An Error occurred :(')
        console.log(error);
    }
 })

 //connects bot to database then listens for requests
mongoose.connect(process.env.MONGO_URI)
    .then(() =>{
        console.log('[debug] connected to db');
        bot.start();
    })
    .catch( error => console.log(error))

module.exports = bot
