var Resma = angular.module('Resma', ['ngRoute'])

    .controller('menuItemController',['$scope', '$http', function($scope, $http) {
        //States
        $scope.addBreakfastItemForm = false;
        $scope.addLunchItemForm = false;
        $scope.addDinnerItemForm = false;
        $scope.isEditable = false;
    }]);

//Resma.config(function ($routeProvider, $locationProvider) {
//    $routeProvider
//        .when('/managers/settings',{
//            templateUrl: '../views/resma/resma-settings.html',
//            controller: 'menuItemController'
//        });
//
//    // use the HTML5 History API
//    $locationProvider.html5Mode(true);
//});

//Resma.directive('editItem', function () {
//    return {
//        template:
//        '<div id="myModal" class="modal fade" role="dialog">' +
//        '<div class="modal-dialog">' +
//        '<div class="modal-content">' +
//        '<div class="modal-header">' +
//        '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
//        '<h4 class="modal-title">Modal Header</h4>' +
//        '</div>' +
//        '<div class="modal-body">' +
//        '<p>Some text in the modal.</p>' +
//        '</div>' +
//        '<div class="modal-footer">' +
//        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
//        '</div>' +
//        '</div> ' +
//        '</div>' +
//        '</div>',
//        replace:true
//    }
//});

Resma.directive('breakfastItem', function () {
    return {
        template:
        '<div class="add-item-form">' +
        '<h5>Please provide new item details below</h5> ' +
        '<form action="/managers/add-breakfast-item" method="post" enctype="multipart/form-data"> ' +
        '<input type="text" placeholder="Item Name" name="item_name"> ' +
        '<input type="text" placeholder="Item ID" name="item_id"> ' +
        '<textarea placeholder="Item Discription" name="item_disc"></textarea> ' +
        '<input type="text" placeholder="Item Price" name="item_price"> ' +
        '<label>Item Image</label><input type="file" placeholder="Item Image" name="item_image"> ' +
        '<div class="clearfix set-btn-group text-right">' +
        '<button type="submit" id="save_breakfast_item" class="btn btn-success" >Save</button> ' +
        '<a href="" class="btn btn-default" ng-click="addBreakfastItemForm = false">Cancel</a>' +
        '</div>' +
        '</form> ' +
        '</div>',
        replace:true
    }
});

Resma.directive('lunchItem', function () {
    return {
        template:
        '<div class="add-item-form">' +
        '<h5>Please provide new item details below</h5> ' +
        '<form action="/managers/add-lunch-item" method="post" enctype="multipart/form-data"> ' +
        '<input type="text" placeholder="Item Name" name="item_name"> ' +
        '<input type="text" placeholder="Item ID" name="item_id"> ' +
        '<textarea placeholder="Item Discription" name="item_disc"></textarea> ' +
        '<input type="text" placeholder="Item Price" name="item_price"> ' +
        '<label>Item Image</label><input type="file" placeholder="Item Image" name="item_image"> ' +
        '<div class="clearfix set-btn-group text-right">' +
        '<button type="submit" id="save_breakfast_item" class="btn btn-success" >Save</button> ' +
        '<a href="" class="btn btn-default" ng-click="addLunchItemForm = false">Cancel</a>' +
        '</div>' +
        '</form> ' +
        '</div>',
        replace:true
    }
});

Resma.directive('dinnerItem', function () {
    return {
        template:
        '<div class="add-item-form">' +
        '<h5>Please provide new item details below</h5> ' +
        '<form action="/managers/add-dinner-item" method="post" enctype="multipart/form-data"> ' +
        '<input type="text" placeholder="Item Name" name="item_name"> ' +
        '<input type="text" placeholder="Item ID" name="item_id"> ' +
        '<textarea placeholder="Item Discription" name="item_disc"></textarea> ' +
        '<input type="text" placeholder="Item Price" name="item_price"> ' +
        '<label>Item Image</label><input type="file" placeholder="Item Image" name="item_image"> ' +
        '<div class="clearfix set-btn-group text-right">' +
        '<button type="submit" id="save_breakfast_item" class="btn btn-success" >Save</button> ' +
        '<a href="" class="btn btn-default" ng-click="addDinnerItemForm = false">Cancel</a>' +
        '</div>' +
        '</form> ' +
        '</div>',
        replace:true
    }
});

Resma.directive('orderItem', function () {
    return {
        template:
        '<div class="add-item-form">' +
        '<h5>Please provide new item details below</h5> ' +
        '<form action="/managers/add-breakfast-item" method="post" enctype="multipart/form-data"> ' +
        '<input type="text" placeholder="Item Name" name="item_name"> ' +
        '<input type="text" placeholder="Item ID" name="item_id"> ' +
        '<textarea placeholder="Item Discription" name="item_disc"></textarea> ' +
        '<input type="text" placeholder="Item Price" name="item_price"> ' +
        '<label>Item Image</label><input type="file" placeholder="Item Image" name="item_image"> ' +
        '<div class="clearfix set-btn-group text-right">' +
        '<button type="submit" id="save_breakfast_item" ng-show="addItemForm" class="btn btn-success" >Save</button> ' +
        '<a href="" class="btn btn-default" ng-show="addItemForm" ng-click="addItemForm = false">Cancel</a>' +
        '</div>' +
        '</form> ' +
        '</div>',
        replace:true
    }
});