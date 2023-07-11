const User = require('./models/userModel')
const Event = require('./models/eventModel')
const Address = require('./models/addressModel')

const {
    userToID,
    removeAtSymbol,
    sendEventWithDelay,
    findAndSendEvent,
} = require("./utilityFunctions")

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


const pinMessage = async (msg, bot) => {
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

const getInsult = async (msg, bot) => {
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

const getAddress = async (msg,props,bot) => {
    
    const username = removeAtSymbol(props.match[1])
    const targetUserId = await userToID(username)

    const response = await Address.findOne({setUser: msg.from.id, targetUser: targetUserId })
    if(!response){
        bot.sendMessage(msg.from.id,"Address not found, use /setaddress")
        return
    }
    bot.sendMessage(msg.from.id,`Address: ${response.address}`)
    return
}

const storeID = async msg => {
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
}

const addEvent = async (msg, props) => {
    const eventName = props.match[1]
    const eventLocation = props.match[2]
    const eventDate =  new Date(props.match[3] + ' GMT')
    const eventDescription = props.match[4]

    
    await Event.create({
        eventName,
        eventLocation,
        eventDate,
        eventDescription
    })
    .then(() => {
        msg.reply.text("Event Sucessfully added!")
        findAndSendEvent(msg,eventName)
        
    })
    .catch(error => {
        if(error.errors.eventDate.valueType === 'Date'){
            msg.reply.text('Invalid Date format: [mm/dd/yyyy hh:mm am/pm]')
        }
    })
}

const getEvents = async (msg, props) => {
    const prop = props.match[1] 
    var filterDays = 0

    //filter date will be used to set date to filter by
    switch (prop) {
        case 'all':
            filterDays = 9999999
            break;
        case 'week':
            filterDays = 7
            break;
        case 'month':
            filterDays = 30
            break;
        default:
            msg.reply.text('Invalid timescale use: all/week/month')
            return
    }
            //generates a date filterDays days away
            const endFilterDate = new Date()
            const startFilterDate = new Date()
            startFilterDate.setDate(startFilterDate.getDate() - 1)
            endFilterDate.setDate(endFilterDate.getDate() + filterDays)


            var response = await Event.find({})
            const filteredEvents = []

            //adds event to filteredEvents if it falls before the filter Date
            response.forEach((event) => {
                if((endFilterDate - event.eventDate) > 0 && (startFilterDate - event.eventDate) < 0 ){
                    filteredEvents.push(event)
                }
            })

            
            //cases for if no events are found before the filter date
            if(filteredEvents.length === 0){
               if(prop === 'all'){
                msg.reply.text('No events found :( add one with /addevent')
                return
               }https://cloud.mongodb.com/v2/6438357ca77e5427e4f1c3e2#/security/network
               msg.reply.text(`No events found for the ${prop}.`)
               return
            }

            filteredEvents.sort((a,b) => a.eventDate - b.eventDate)

        //used of instead of foreach so await could be used
        for (const event of filteredEvents) {
            await sendEventWithDelay(msg,event);
        }
}

const editEvent = async (msg, props) => {
        
    //store props
    const eventName = props.match[1]
    const fieldToEdit = props.match[2].toLowerCase()
    var editedContent = props.match[3]
    
 
    console.log(editedContent);
    var schemaToChange = ''

    //changes feildToEdit to match Event Schema 
    switch(fieldToEdit){
        case 'name':
            schemaToChange = {eventName: editedContent}
            break
        case 'location':
            schemaToChange = {eventLocation: editedContent}
            break
        case 'date':
            editedContent = new Date(editedContent + ' GMT')
            schemaToChange = {eventDate: editedContent}
            break
        case 'description':
            schemaToChange = {eventDescription: editedContent}
            break
        default :
            msg.reply.text('Must enter valid field to change name/location/date/description')
            return
    }

    //checks if document exists and updates it if it does
    const response =  await Event.findOneAndUpdate({eventName}, schemaToChange, {new: true} )
    if (!response){
        msg.reply.text('Event not found')
        return
    }
    msg.reply.text('Event updated!')
    sendEventWithDelay(msg,response)
}

const deleteEvent = async (msg, props) => {
    //assine varibles from props
    const eventToDelete = props.match[1]

    //find and delete event
    const response = await Event.findOneAndDelete({eventName: eventToDelete})
    if(!response){
        msg.reply.text('Event not found')
    }
    msg.reply.text('--- Removed Event ---')
    sendEventWithDelay(msg,response)
}

module.exports = {
    sendEveryone,
    pinMessage,
    getCatFact,
    getInsult,
    setAddress,
    getAddress,
    storeID,
    addEvent,
    getEvents,
    editEvent,
    deleteEvent
}