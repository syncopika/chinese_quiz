var app = angular.module('chineseQuiz', [
	'ngRoute',
	'quizletControllers'
]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider.
	when('/quizlet1', {
		templateUrl: 'partials/quizlet1.html',
		controller: 'quizlet1'
	}).
	when('/quizlet2', {
		templateUrl: 'partials/quizlet2.html',
		controller: 'quizlet2'
	}).
	otherwise({
		redirectTo: '/quizlet1'
	});
	
	$locationProvider.hashPrefix('');
}]);

