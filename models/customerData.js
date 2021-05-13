const mongoose = require('mongoose')

var customerData = mongoose.model('customerData',
{
    firstName:String,
    lastName:String,
    occupation:{ 
       type:String,
       enum: ["Employed","Business","Student"]
    },
    dob:Date,
    status:{ 
        type:String,
        enum: ["Active","Inactive"]
     },
    bio:String,
    file: String,
},'custumers')

module.exports = { customerData}