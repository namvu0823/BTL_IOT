const mongoose = require('mongoose')

const adminScheme = mongoose.Schema({
    name : {type: String, required : true},
    password : {type: String , required : true},
    avatar: {type: String}
})

module.exports = mongoose.model('Admin', adminScheme)