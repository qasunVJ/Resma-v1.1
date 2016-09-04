var Resma = angular.module('Resma', ['ngRoute'])

    .controller('OrdersController',['$scope', '$http', function($scope, $http) {
        //States
        $scope.itemNum = 0;
        $scope.itemNumUp = function () {
            this.itemNum += 1;
        };
        $scope.itemNumDown = function () {
            this.itemNum -= 1;
        };
    }]);