const bot = require('./bot')


const pingEveryone = (msg) =>{
    console.log(msg)
    msg.reply.text("@Dihsarr @benoji @paytoncollins @involutex @neeguss @Cranbaeri @puffpuff26 @Jayvid12 @mobu2 @p4rs33 @DimSum9000 @Yahootoyou @omegadeecee")
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

module.exports = {
    pingEveryone,
    getCatFact
}