require('dotenv').config()
const mongoose = require('mongoose')
const Address  = require('./models/addressModel')
const User = require('./models/userModel')
const Event = require('./models/eventModel')
const {
    getCatFact,
} = require("./botController")
const {
    userToID,
    removeAtSymbol,
    sendEventWithDelay,
    findAndSendEvent,
} = require("./utilityFunctions")
const {
    sendEveryone,
    setAddress
} = require('./botController')

const TeleBot = require('telebot');
const bot = new TeleBot(process.env.TOKEN);

//@'s every person in the telegram chat
bot.on('/everyone', async msg => {sendEveryone(msg,bot)})  


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
bot.on(/^\/setaddress (\S+)\s(.+)$/i, async (msg, props) => setAddress(msg,props,bot))

  bot.on(/^\/address (.+)$/, async (msg, props) =>{

    const username = removeAtSymbol(props.match[1])
    const targetUserId = await userToID(username)

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

 bot.on(/^\/addevent \[(.+)] \[(.+)] \[(.+)] (.+)$/i, async (msg, props) => {
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
})

bot.on(/^\/events (.+)$/, async (msg,props) => {
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
      
)


bot.on(/^\/editevent \[(.+)] \[(.+)] \[(.+)]/, async (msg,props) => {

    
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

})

bot.on(/^\/delevent \[(.+)]/, async (msg,props) => {
    //assine varibles from props
    const eventToDelete = props.match[1]

    //find and delete event
    const response = await Event.findOneAndDelete({eventName: eventToDelete})
    if(!response){
        msg.reply.text('Event not found')
    }
    msg.reply.text('--- Removed Event ---')
    sendEventWithDelay(msg,response)

    
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




