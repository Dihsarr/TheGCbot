const bot = require('./bot')

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
    getCatFact
}