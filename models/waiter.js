var mongoose = require('mongoose');
var UserService = require('../services/user-service');


//Waiter schema
var waiterSchema = mongoose.Schema({
    first_name: {type: String, required: 'Please enter your First Name'},
    last_name: {type: String, required: 'Please enter your Last Name'},
    user_token: {type: String, required: 'Please enter your token'},
    email: {type: String, required: 'Please enter your email'},
    phone: {type: Number, required: 'Please enter your phone'},
    address: [{
        address1: {type: String},
        address2: {type: String}
    }],
    username: {type: String, required: 'Please enter a username'},
    password: {type: String, required: 'Please enter a password'}

});


waiterSchema.path('username').validate(function (value, next) {
    UserService.getUserByUsername({username: value}, function (err, user) {
        if (err){
            console.log(err);
            return next(false);
        }
        next(!user);
    });
}, 'Username is already in use');

waiterSchema.path('user_token').validate(function (value, next) {
    UserService.getUserToken({token: value}, function (err, token) {
        if (err){
            console.log(err);
            return next(false);
        }
        next(token);
    });
}, 'Your token is not valid');

var Waiter = module.exports = mongoose.model('Waiter', waiterSchema);