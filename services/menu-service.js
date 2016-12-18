var BreakfastItem = require('../models/breakfastitem');
var LunchItem = require('../models/lunchitem');
var DinnerItem = require('../models/dinneritem');
var multer = require('multer');
var upload = multer({ dest: 'public/images/uploads/'});

//Get Item by ID
module.exports.getItemById = function (id, type, callback) {
    var query = {_id: id};
    if(type == 'breakfast'){
        BreakfastItem.findOne(query, callback);
    }else if(type == 'lunch'){
        LunchItem.findOne(query, callback);
    }else if(type == 'dinner'){
        DinnerItem.findOne(query, callback);
    }
};

//Get Item by ID
module.exports.getItemToCartById = function (Section, id, callback) {
    console.log("Section" + Section);
    var query = {_id: id};
    Section.findOne(query, callback);
};

//Get Breakfast Items
module.exports.getItems = function (whatToGet, callback) {
    whatToGet.find(callback);
};

///POST ITEMS///
//Add menu item
module.exports.addMenuItem = function (req, Menu, callback) {
    var item_id = req.body.item_id && req.body.item_id.trim();
    var item_name = req.body.item_name && req.body.item_name.trim();
    var item_disc = req.body.item_disc && req.body.item_disc.trim();
    var item_price = req.body.item_price && req.body.item_price.trim();
    var item_type;
    var item_image_name;

    if (req.files[0]){
        item_image_name = req.files[0].filename;
        console.log(req.files[0].filename);
    }else{
        item_image_name = "noimage.jpg";
    }

    if(Menu == 'BreakfastItem'){
        var newItem = new BreakfastItem({
            item_id : item_id,
            item_name: item_name,
            item_disc: item_disc,
            item_price: item_price,
            item_type: 'breakfast',
            item_image: item_image_name
        });

        newItem.save(callback);
    }else if(Menu == 'LunchItem'){
        var newItem = new LunchItem({
            item_id : item_id,
            item_name: item_name,
            item_disc: item_disc,
            item_price: item_price,
            item_type: 'lunch',
            item_image: item_image_name
        });

        newItem.save(callback);
    }else if(Menu == 'DinnerItem'){
        var newItem = new DinnerItem({
            item_id : item_id,
            item_name: item_name,
            item_disc: item_disc,
            item_price: item_price,
            item_type: 'dinner',
            item_image: item_image_name
        });

        newItem.save(callback);
    }

};

//Add breakfast item
module.exports.addBreakfastItem = function (newItem, newBrakfastItem, callback) {
    console.log('New item has been added');
    async.parallel([newItem.save, newBrakfastItem.save], callback);
};

//Add edited item
module.exports.addEditedItem = function (id, editedBreakfastItem, callback) {
    var query = {_id: id};
    BreakfastItem.findByIdAndUpdate(id, editedBreakfastItem, callback);
};

//Delete item
module.exports.deleteItem = function (id, type, callback) {
    var query = {_id: id};
    if(type=='breakfast'){
        BreakfastItem.findOneAndRemove(query, callback);
    }else if(type=='lunch'){
        LunchItem.findOneAndRemove(query, callback);
    }else{
        DinnerItem.findOneAndRemove(query, callback);
    }
};
