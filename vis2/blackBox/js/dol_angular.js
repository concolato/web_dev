var dolApp = angular.module("dolApp", ['ngRoute']); //Using the routing service

dolApp.config(function ($routeProvider){ //Dependency injection with the $routeProvider object or navigation
	$routeProvider.when('/', {
		templateUrl: 'main.html', //navigation to view
		controller: 'mainController' //Bind to this controller
	})
	.when('/next', {
		templateUrl: 'next.html',
		controller: 'nextController'
	});
});

dolApp.controller('mainController', ['$scope', '$log', function($scope,$log){ //a and b arguments are for minification
	console.log("IT Works!");
	$scope.name = "Main Page"; //Interpolation off of the scope.
	//console.log(a);
}]);

dolApp.controller('nextController', ['$scope', '$log', '$location', function(a, b, c){
	b.info(c.path()); 
	a.name = "Second Page";
}]);