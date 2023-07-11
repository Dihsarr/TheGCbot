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
  
module.exports = {
    userToID,
    removeAtSymbol,
    formatTime,
    sendEventWithDelay,
    findAndSendEvent,
}