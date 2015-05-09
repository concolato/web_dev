var archturiaApp = angular.module("archturiaApp", ['ngRoute']); //Using the routing service

archturiaApp.config(function ($routeProvider){ //Dependency injection with the $routeProvider object or navigation
	$routeProvider.when('/', {
		templateUrl: 'main.html', //navigation to view
		controller: 'mainController' //Bind to this controller
	})
	.when('/lab', {
		templateUrl: 'lab.html',
		controller: 'labController'
	})
	.when('/public', {
		templateUrl: 'public.html',
		controller: 'publicController'
	})
	.when('/about', {
		templateUrl: 'about.html',
		controller: 'aboutController'
	})
	.when('/products', {
		templateUrl: 'products.html',
		controller: 'productsController'
	})
	.when('/contact', {
		templateUrl: 'contact.html',
		controller: 'contactController'
	});
});

archturiaApp.controller('mainController', ['$scope', '$log', function($scope,$log){ //a and b arguments are for minification
	console.log("IT Works!");
	$scope.name = "Main Page"; //Interpolation off of the scope.
	//console.log(a);
}]);

archturiaApp.controller('labController', ['$scope', '$log', '$location', function(a, b, c){
	b.info(c.path()); 
	a.name = "Lab Page";
}]);

archturiaApp.controller('publicController', ['$scope', '$log', '$location', function(a, b, c){
	b.info(c.path()); 
	a.name = "Publication Page";
}]);

archturiaApp.controller('aboutController', ['$scope', '$log', '$location', function(a, b, c){
	b.info(c.path()); 
	a.name = "About Page";
}]);

archturiaApp.controller('productsController', ['$scope', '$log', '$location', function(a, b, c){
	b.info(c.path()); 
	a.name = "Products Page";
}]);

archturiaApp.controller('contactController', ['$scope', '$log', '$location', function(a, b, c){
	b.info(c.path()); 
	a.name = "Contact Page";
}]);