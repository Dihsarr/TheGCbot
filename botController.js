const TeleBot = require('telebot')
const bot = new TeleBot(process.env.TOKEN);

const pingEveryone = (msg) =>{
    msg.reply.text("@Dihsarr @benoji @paytoncollins @involutex @neeguss @Cranbaeri @puffpuff26 @Jayvid12 @mobu2 @p4rs33 @DimSum9000 @Yahootoyou @omegadeecee")
}

 const pinMessage = async msg => {
    try{
        if(!msg.reply_to_message){
            msg.reply.text("Use: Reply to the message you want to pin with /pin")
            return
        }
        await bot.pinChatMessage(msg.chat.id, msg.reply_to_message.message_id)
    } catch(error){
        console.log(error);
    }
 }

 const getCatFact = async msg => {
    try{
        const response = await fetch("https://meowfacts.herokuapp.com/")
        const json = await response.json()
        msg.reply.text(json.data[0])

    }catch(error){
        msg.reply.text('An Error occurred :(')
        console.log(error);
    }
 }

 const getInsult = async msg => {
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
 }



module.exports = {
    pingEveryone,
    pinMessage,
    getCatFact,
    getInsult
}