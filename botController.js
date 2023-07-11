const User = require('./models/userModel')
const Event = require('./models/eventModel')
const Address = require('./models/addressModel')

const sendEveryone = async (msg,bot) => {
    if(msg.from.id === 1835387722 ){
      msg.reply.text('Nah')
      return
    }
    if(msg.reply_to_message){
      bot.sendMessage(msg.chat.id,"@Dihsarr @benoji @paytoncollins @involutex @neeguss @Cranbaeri @puffpuff26 @Jayvid12 @mobu2 @p4rs33 @DimSum9000 @Yahootoyou @omegadeecee", {replyToMessage: msg.reply_to_message.message_id})
      return 
    }
    msg.reply.text("@Dihsarr @benoji @paytoncollins @involutex @neeguss @Cranbaeri @puffpuff26 @Jayvid12 @mobu2 @p4rs33 @DimSum9000 @Yahootoyou @omegadeecee")
    }















    
//sets a users address
const setAddress = async (msg,props,bot) => {

    const username = removeAtSymbol(props.match[1])
    //sets command to be only used in private chats
    if(msg.chat.type !== 'private'){
        bot.sendMessage(msg.from.id, 'Command must be used in my dm')
        return
    }
  
    const targetUserId = await userToID(username)
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
  }


module.exports = {
    sendEveryone,
    setAddress
}