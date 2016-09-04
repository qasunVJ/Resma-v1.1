var BreakfastItem = require('../models/breakfastitem');

////GET ITEMS/////
//Get Item
module.exports.getItem = function (callback) {
    BreakfastItem.find(callback);
};

//Get Item by ID
module.exports.getItemById = function (id, callback) {
    var query = {_id: id};
    BreakfastItem.findOne(query, callback);
};

//Get Breakfast Items
module.exports.getBrakfastItems = function (callback) {
    BreakfastItem.find(callback);
};

///POST ITEMS///
//Add menu item
module.exports.addMenuItem = function (newItem, newCategoryItem, callback) {
    console.log('New item been added');
    async.parallel([newItem.save, newCategoryItem.save], callback);
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
module.exports.deleteItem = function (id, callback) {
    var query = {_id: id};
    BreakfastItem.findOneAndRemove(query, callback);
};
