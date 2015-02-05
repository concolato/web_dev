var dolApp = angular.module("dolApp", ['ngRoute']);

dolApp.config(function ($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'main.html',
		controller: 'mainController'
	})
	.when('/next', {
		templateUrl: 'next.html',
		controller: 'nextController'
	});
});

dolApp.controller('mainController', ['$scope', '$log', function(a,b){
	console.log("IT Works!");
	console.log(a);
}]);

dolApp.controller('nextController', ['$scope', '$log', function(a,b){
	
}]);