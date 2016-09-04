var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Waiter = require('../models/waiter');
var UserService = require('../services/user-service');

//Manager GET signup
router.get('/signup', function(req, res, next) {
    res.render('auth/waiter-signup');
});

//Manager POST signup
router.post('/signup', function (req, res, next) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var user_type = req.body.user_type;
    var waiter_id = req.body.waiter_id;
    var email = req.body.email;
    var phone = req.body.phone;
    var address1 = req.body.address1;
    var address2 = req.body.address2;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    //Express form validation
    req.checkBody('first_name', 'First Name is required').notEmpty();
    req.checkBody('last_name', 'Last Name is required').notEmpty();
    req.checkBody('user_type', 'Your role at the restaurant is required').notEmpty();
    req.checkBody('waiter_id', 'You should enter your Waiter ID').notEmpty();
    req.checkBody('waiter_id', 'Waiter ID is not valid').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email must be a valid email').isEmail();
    req.checkBody('phone', 'Phone number is required').notEmpty();
    req.checkBody('phone', 'Phone number must be a valid number').isInt().len(10);
    req.checkBody('address1', 'Address is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password must contain 6 to 12 characters').len(6,12);
    req.checkBody('password2', 'Passwords are not matching').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors){
        console.log(errors);
        res.render('auth/signup', {
            errors: errors
        });
    }else{
        var newUser = new User({
            first_name: first_name,
            last_name: last_name,
            user_type: user_type,
            email: email,
            phone: phone,
            address: [{
                address1: address1,
                address2: address2
            }],
            username: username,
            password: password
        });

        var newWaiter = new Waiter({
            first_name: first_name,
            last_name: last_name,
            waiter_id: waiter_id,
            email: email,
            phone: phone,
            address: [{
                address1: address1,
                address2: address2
            }],
            username: username,
            password: password
        });

        if (user_type == 'manager'){
            UserService.createWaiter(newUser, newWaiter, function (err, user) {
                console.log('Waiter Created');
            });
        }

        req.flash('success', 'User Created');
        res.redirect('/auth/login');
    }
});

module.exports = router;