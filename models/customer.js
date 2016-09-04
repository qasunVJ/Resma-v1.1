var mongoose = require('mongoose');

//Customer schema
var customerSchema = mongoose.Schema({
    first_name: {type: String, required: 'Please enter your First Name'},
    last_name: {type: String},
    email: {type: String, required: 'Please enter your email'},
    phone: {type: Number},
    username: {type: String, required: 'Please enter a username'},
    password: {type: String, required: 'Please enter password'}

});

var Customer = module.exports = mongoose.model('Customer', customerSchema);