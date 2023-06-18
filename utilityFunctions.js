const User = require('./models/userModel')

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
    var hours = date.getHours()
    const minutes = date.getMinutes()

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

    return `${hours}:${minutes} ${suffix}`
    
    
}

module.exports = {
    userToID,
    removeAtSymbol,
    formatTime
}