const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/customersManageDB',{useNewUrlParser:true,useUnifiedTopology:true},
    err => {
        if (!err)
            console.log('Mongodb conneced sussessfully.')
        else
            console.log('Error while connecting MongoDB : ' + JSON.stringify(err, undefined, 2))
    })