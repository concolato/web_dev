var myApp = angular.module("myApp", ['ngRoute']);

myApp.controller('mainController', ['$scope', '$log', function($scope,$log){ //a and b arguments are for minification
	console.log("IT Works!");

}]);