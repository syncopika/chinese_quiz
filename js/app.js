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

/*
	make the character data visible to the scope defined by the div with id='searchFunction'
	this scope is not particular to any partial 
*/
app.controller('searchFunction', function($scope, $http){
	$http.get('chineseChars.json').then(function(response){
		$scope.characters = response.data;
		$scope.searchChoice = 'character';
	});
});

/*
	define the filter for finding character 
*/
app.filter('searchByChar', function(){
	// characters is the json data 
	// thingToFind is the input text
	// scope is the current page scope 
	return function(characters, thingToFind, scope){
		var results = [];
		if(thingToFind === ""){
			return;
		}
		angular.forEach(characters, function(character){
			
			if(scope.searchChoice === 'character' && character.value.indexOf(thingToFind) > -1){
				results.push(character);
			}else if(scope.searchChoice === 'definition' && character.definition.indexOf(thingToFind) > -1){
				results.push(character);
			}else if(scope.searchChoice === 'pinyin' && character.pinyin.indexOf(thingToFind) > -1){
				results.push(character);
			}
			
		});
		return results;
	}
});

