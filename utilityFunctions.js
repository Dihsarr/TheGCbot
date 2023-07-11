const User = require('./models/userModel')
const Event = require('./models/eventModel')
const Address = require('./models/addressModel')

const userToID = async user => {
    const response = await User.findOne({username: user})
    if (!response){
        return
    }
   return response.id
}


const removeAtSymbol = (username) => {
    if (username.startsWith("@")) {
      return username.substring(1);
    }
    return username;
}

const formatTime = (date) => {
    var hours = date.getUTCHours()
    var minutes = date.getMinutes()

    var suffix = ''

    if(hours > 12 ){
        hours -= 12 
        suffix = 'PM'
    } 
    else if (hours < 12){
        suffix = 'AM'
    }
    else{
        suffix = 'PM'
    }

    if(minutes < 10){
        minuteText = minutes.toString()
        minuteText = '0' + minuteText

        return `${hours}:${minuteText} ${suffix}`
    }

    return `${hours}:${minutes} ${suffix}`
}

//a function to individually send the messages with a delay between each
const sendEventWithDelay = async (msg,event) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        msg.reply.text(
          event.eventName +
          '\n' +
            '\nLocation: ' +
            event.eventLocation +
            '\n' +
            '\nDate: ' +
            event.eventDate.toDateString() +
            '\n' +
            '\nTime: ' +
            formatTime(event.eventDate) +
            '\n' +
            '\nDescription: ' +
            event.eventDescription
        );
        resolve();
      }, 15); 
    });
  }

 const findAndSendEvent = async (msg,eventName) => {
    const foundEvent = await Event.findOne({eventName})
     if(!foundEvent){
      msg.reply.text('Event not Found')
      return
     }
     sendEventWithDelay(msg,foundEvent)
 }

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
    userToID,
    removeAtSymbol,
    formatTime,
    sendEventWithDelay,
    findAndSendEvent,
    sendEveryone,
    setAddress
}