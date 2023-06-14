require('dotenv').config()
const mongoose = require('mongoose')
const Address  = require('./models/addressModel')
const User = require('./models/userModel')
const {
    getCatFact,
} = require("./botController")
const {
    userToID
} = require("./utilityFunctions")
const TeleBot = require('telebot');
const bot = new TeleBot(process.env.TOKEN);

//@'s every person in the telegram chat
bot.on('/everyone', (msg) =>{
    if(msg.reply_to_message){
        bot.sendMessage(msg.chat.id,"@Dihsarr @benoji @paytoncollins @involutex @neeguss @Cranbaeri @puffpuff26 @Jayvid12 @mobu2 @p4rs33 @DimSum9000 @Yahootoyou @omegadeecee", {replyToMessage: msg.reply_to_message.message_id})
        return 
    }
    msg.reply.text("@Dihsarr @benoji @paytoncollins @involutex @neeguss @Cranbaeri @puffpuff26 @Jayvid12 @mobu2 @p4rs33 @DimSum9000 @Yahootoyou @omegadeecee")
})

//pins a message to the currect chat
 bot.on('/pin', async msg =>{
    //if message is not sent as reply give error
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

 //uses Cat fact api to grab a random cat fact
 bot.on('/catfact', getCatFact)

 //uses insult api to grab a random insult
 bot.on('/insult', async msg => {
    try{
        const response = await fetch("https://evilinsult.com/generate_insult.php?lang=en&type=json")
        const json = await response.json()
        //if command is sent as reply the insult is sent as a reply to the original message
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

 //use to set another users address
bot.on(/^\/setaddress (\S+)\s(.+)$/i, async (msg,props) => {

    //sets command to be only used in private chats
    if(msg.chat.type !== 'private'){
        bot.sendMessage(msg.from.id, 'Command must be used in my dm')
        return
    }

    const targetUserId = await userToID(props.match[1])
    const response = await Address.findOne({setUser: msg.from.id, targetUser: targetUserId })

    //if targetuser and the setting user are the same updates address
     if(response){
        await Address.updateOne(
            {
                setUser: msg.from.id,
                targetUser: targetUserId
            },
            {
                address: props.match[2]
            }
        )
        .then(() => {
            msg.reply.text('Address Updated!')
        })
        .catch((error) => {
            msg.reply.text("An Error occured")
            console.log(error);
        })
        return
     }
     await Address.create({
         setUser: msg.from.id,
         targetUser: targetUserId,
         address: props.match[2]
     })
     .then(() => {
        console.log('address set')
        msg.reply.text('Address sucessfully saved!')
        return
    })
     .catch((error) => console.log(error._message))
  })

  bot.on(/^\/address (.+)$/, async (msg, props) =>{
    const targetUserId = await userToID(props.match[1])
    const response = await Address.findOne({setUser: msg.from.id, targetUser: targetUserId })
    if(!response){
        bot.sendMessage(msg.from.id,"Address not found, use /setaddress")
        return
    }
    bot.sendMessage(msg.from.id,`Address: ${response.address}`)
    return
  })

  bot.on('/storeid', async msg => {
    const fromUser = msg.from.id
    const user = await User.findOne({id: fromUser})
    if(user){
        console.log(user);
        msg.reply.text('User already stored')
        return
    }
    await User.create({
       id: fromUser,
       username: msg.from.username
    })
    .then(() => {
       console.log('User set')
       msg.reply.text('User sucessfully set')
   })
    .catch((error) => console.log(error._message))
 })

 // a dev command
 bot.on('/devTest', msg => console.log(msg))


 //connects bot to database then listens for requests
mongoose.connect(process.env.MONGO_URI)
    .then(() =>{
        console.log('[debug] connected to db');
        bot.start();
    })
    .catch( error => console.log(error))

module.exports = bot
