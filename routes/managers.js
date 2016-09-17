var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var restrict = require('../services/restrict');
var multer = require('multer');
var upload = multer({ dest: 'public/images/uploads/'});

var BreakfastItem = require('../models/breakfastitem');
var LunchItem = require('../models/lunchitem');
var DinnerItem = require('../models/dinneritem');
var MenuItem = require('../models/item');

var User = require('../models/user');
var Waiter = require('../models/waiter');
var Manager = require('../models/manager');
var MenuService = require('../services/menu-service');
var UserService = require('../services/user-service');
var OrderService = require('../services/order-service');
var TableService = require('../services/table-service');
var Token = require('../models/token');

//Manager GET signup
router.get('/signup', function(req, res, next) {
    res.render('auth/manager-signup');
});

//Manager POST signup
router.post('/signup', function (req, res, next) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var user_type = req.body.user_type;
    var manager_id = req.body.manager_id;
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
    req.checkBody('manager_id', 'You should enter your Manager ID').notEmpty();
    req.checkBody('manager_id', 'Manager ID is not valid').notEmpty();
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

        var newManager = new Manager({
            first_name: first_name,
            last_name: last_name,
            manager_id: manager_id,
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
            UserService.createManager(newUser, newManager, function (err, user) {
                console.log(messages);
                console.log('Manager Created');
            });
        }

        req.flash('success', 'User Created');
        res.redirect('/auth/login');
    }
});

//Site Settings
//router.get('/settings-login', function (req, res, next) {
//    res.render('auth/settings-login');
//});
//
//router.post('/settings-login', passport.authenticate('local', {failureRedirect: '/managers/settings-login', failureFlash: 'Wrong Credentials'}), function (req, res) {
//    req.flash('success', 'You are now logged in to settings');
//    res.render('/resma/resma-settings');
//});
//
//passport.use(new LocalStrategy(
//    function(username, password, managerId, done) {
//        UserService.getUserByUsername({ username: username }, function (err, user) {
//            if (err) { return done(err); }
//            if (!user) {
//                return done(null, false, { message: 'Incorrect username' });
//            }
//
//            UserService.comparePassword(password, user.password, function (err, isMatch) {
//                if (err) return done(err);
//                if (!isMatch) {
//                    console.log('Invalid Password');
//                    //Failure Message
//                    return done(null, false, {message: 'Invalid password'});
//                }
//
//                UserService.compareManagerID(managerId, user.manager_id, function (err, isMatch) {
//                    if (!isMatch) {
//                        return done(null, user);
//                    }else{
//                        console.log('Invalid Manager ID');
//                        //Failure Message
//                        return done(null, false, {message: 'Invalid Manager ID'});
//                    }
//                });
//            });
//        });
//    }
//));

//Site Settings
router.get('/settings', restrict, function (req, res, next) {

    MenuService.getItems(BreakfastItem, function (err, breakfast_items) {
        if (err) {
            console.log(err);
            res.send(err);
        }else{
            MenuService.getItems(LunchItem, function (err, lunch_items) {
                if (err) {
                    console.log(err);
                    res.send(err);
                }else{
                    MenuService.getItems(DinnerItem, function (err, dinner_items) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        }else{
                            res.render('resma/resma-settings', {
                                title: 'Resma | Settings',
                                breakfast_items: breakfast_items,
                                lunch_items: lunch_items,
                                dinner_items: dinner_items
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get('/tableview', restrict, function (req, res, next) {
    OrderService.getOrders(function (err, orders) {
        if (err){
            console.log(err);
        }else{
            TableService.getTableView(function (err, tableViewMarkup) {
                if (err){
                    console.log(err);
                }else{
                    console.log(tableViewMarkup[0].table_num);
                    res.send({tableViewMarkup: tableViewMarkup[0].table_data, tableNum: tableViewMarkup[0].table_num, orders: orders});
                }
            });
        }
    });
});


////Add menu item GET
//router.get('/add-breakfast-item', function (req, res, next) {
//    var section = req.body.id;
//    res.render('/menus/add-breakfast-item');
//});

//Add token
router.post('/new-token', restrict, function (req, res, next) {
    var token_type = req.body.token_type;
    var token  = req.body.token;

    var newToken = new Token({
        token_type: token_type,
        token: token
    });

    UserService.addNewToken(newToken, function (err) {
        if (err){
            console.log(err);
            res.redirect('/managers/settings');
        }else {
            res.redirect('/managers/settings');
            console.log('Token Added');
        }
    });

});

//Add menu item POST
router.post('/add-breakfast-item', restrict, upload.any(), function (req, res, next) {

    MenuService.addMenuItem(req, BreakfastItem, function (err, item) {
        if (err) {
            console.log(err);
        }else{
            console.log('Item Added');
        }
    });

    req.flash('success', 'New Item Added');
    res.redirect('/managers/settings');
});

//Add menu item POST
router.post('/add-lunch-item', restrict, upload.any(), function (req, res, next) {

    MenuService.addMenuItem(req, LunchItem, function (err, item) {
        if (err) {
            console.log(err);
        }else{
            console.log('Item Added');
        }
    });

    req.flash('success', 'New Item Added');
    res.redirect('/managers/settings');
});

//Add menu item POST
router.post('/add-dinner-item', restrict, upload.any(), function (req, res, next) {

    MenuService.addMenuItem(req, DinnerItem, function (err, item) {
        if (err) {
            console.log(err);
        }else{
            console.log('Item Added');
        }
    });

    req.flash('success', 'New Item Added');
    res.redirect('/managers/settings');
});

//Edit item get
router.get('/items/edit/:id', restrict, function (req, res, next) {
    MenuService.getItemById(req.params.id, function (err, item) {
        console.log(req.params.id);
        if (err){
            console.log(err);
        }else{
            res.render('resma/resma-settings', {
                editableItem : item,
                layout: 'edit-item-layout.html'
            });
        }
    });
});

//Edit item post
router.post('/items/edit/:id', restrict, function (req, res, next) {

    var id = req.params.id;

    var item_id = req.body.item_id && req.body.item_id.trim();
    var item_name = req.body.item_name && req.body.item_name.trim();
    //var item_image = req.files.item_image;
    var item_disc = req.body.item_disc && req.body.item_disc.trim();
    var item_price = req.body.item_price && req.body.item_price.trim();
    //
    //
    ////Express form validation
    //req.checkBody('item_name', 'Item Name is required').notEmpty();
    //req.checkBody('item_id', 'Item ID is required').notEmpty();
    //req.checkBody('item_price', 'Price is required').notEmpty();
    //req.checkBody('item_price', 'Price is not valid').isInt();

    //var errors = req.validationErrors();

    var editedBreakfastItem = {
        item_id: item_id,
        item_name: item_name,
        item_disc: item_disc,
        item_price: item_price,
        item_type: 'breakfast'
    };

    console.log(editedBreakfastItem);

    MenuService.addEditedItem(id, editedBreakfastItem, function (err) {
        if (err) {
            console.log(err);
            res.render('resma/resma-settings', {
                layout: 'edit-item-layout.html'
            });
        }else{
            console.log('Item Added');

            req.flash('success', 'Item edited');
            res.redirect('/managers/settings');
        }
    });

});

//Delete an item
router.delete('/items/delete/:id', restrict, function (req, res, next) {
    var id = req.params.id;
    console.log(id);

    MenuService.deleteItem(id, function (err) {
        if (err){
            console.log(err);
            res.redirect('/managers/settings');
        }else{
            req.flash('success', 'Item deleted');
            res.location('/managers/settings');
            res.redirect('/managers/settings');
        }
    });
});

//Get Orders
router.get('/orders', function (req, res, next) {
    OrderService.getOrders(function (err, orders) {
        if (err){
            console.log(err);
            res.render('resma/home');
        }else{
            res.render('resma/orders', {
                orders: orders
            });
        }
    });
});

//Get table view
router.post('/table-update', restrict, function (req, res, next) {
    var tableViewMarkup = req.body.tableView;
    var tableNum = req.body.tableNo;

    var tableView = {
        modal_name: 'table_view',
        table_data: tableViewMarkup,
        table_num: tableNum
    };

    TableService.updateTableView(tableView, function (err) {
        if (err){
            console.log(err);
            res.redirect('/managers/settings');
        }else{
            res.redirect('/managers/settings');
        }
    });
});


module.exports = router;