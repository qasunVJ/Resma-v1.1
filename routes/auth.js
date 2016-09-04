var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash = require('connect-flash');
var Handlebars = require('express-handlebars');

var UserService = require('../services/user-service');

//GET login

router.get('/login', function(req, res, next) {
    res.render('auth/login');
});

//GET signup
router.get('/:id/signup', function(req, res, next) {

    var userType = req.params.id;
    res.render('auth/signup', {
        signup:true,
        userType: userType,
        helpers: {
            ifCond : function(v1, v2, options) {
                if(v1 != v2) {
                    return options.fn(this);
                }
                return options.inverse(this);
            }
        }
    });
});

router.post('/:id/signup', function (req, res, next) {
    var userType = req.params.id;

    if (userType === 'manager' || userType === 'customer' || userType === 'waiter'){

        ////Express form validation
        //req.checkBody('first_name', 'First Name is required').notEmpty();
        //
        //if (userType == 'manager' || userType == 'waiter')
        //    req.checkBody('last_name', 'Last Name is required').notEmpty();
        //
        ////if (userType == 'manager' || userType == 'waiter')
        ////    req.checkBody('user_type', 'Your role at the restaurant is required').notEmpty();
        //
        //req.checkBody('email', 'Email is required').notEmpty();
        //
        //if (password != '')
        //    req.checkBody('email', 'Email must be a valid email').isEmail();
        //
        //if (userType == 'manager' || userType == 'waiter'){
        //    req.checkBody('phone', 'Phone number is required').notEmpty();
        //    req.checkBody('address1', 'Address is required').notEmpty();
        //
        //    if (user_token != ''){
        //        UserService.getUserToken(user_token, function (err, token) {
        //            if (err) throw err;
        //
        //            console.log('Token :' + token);
        //            if (token == null){
        //                req.checkBody('user_token', 'Token is not valid').notEmpty();
        //            }
        //        });
        //    }
        //
        //    if(isNaN(phone))
        //        req.checkBody('phone', 'Phone number must be a valid number').isInt().len(10);
        //
        //    if(phone != null)
        //        req.checkBody('phone', 'Phone number must be a valid number').isInt().len(10);
        //
        //}
        //req.checkBody('username', 'Username is required').notEmpty();
        //req.checkBody('password', 'Password is required').notEmpty();
        //
        //if (password != '')
        //    req.checkBody('password', 'Password must contain 6 to 12 characters').len(6,12);
        //
        //req.checkBody('password2', 'Passwords are not matching').equals(req.body.password);
        //
        //var errors = req.validationErrors();

        //Response
        UserService.createUser(req, function (err, user) {
            if (err){
                console.log(err);

                delete req.body.password;
                return res.render('auth/signup', {
                    errors: err,
                    userType: userType,
                    input: req.body,
                    helpers: {
                        ifCond : function(v1, v2, options) {
                            if(v1 != v2) {
                                return options.fn(this);
                            }
                            return options.inverse(this);
                        }
                    }
                });
            }

            console.log('User Created');

            req.flash('success', 'User Created');
            res.redirect('/auth/login',{
                user: user
            });
        });

    }else{
        res.redirect('/auth/'+userType+'/signup');
    }
});

//POST login
router.post('/login', passport.authenticate('local',{
    successRedirect: '/resma/home',
    failureRedirect: '/auth/login',
    failureFlash: 'Invalid Credentials'
}));

router.get('/logout', function (req, res) {
    req.logout();
    //Success message
    req.flash('success', "You are logged out");
    res.redirect('/');
});


module.exports = router;
