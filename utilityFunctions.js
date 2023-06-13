const User = require('./models/userModel')

const userToID = async user => {
    const response = await User.findOne({username: user})
    if (!response){
        return
    }
   return response.id
}

module.exports = {userToID}