var controllers = angular.module('quizletControllers', []);

/*
	for quizlet 1
*/
controllers.controller('quizlet1', ['$scope', '$http', function($scope, $http){
	
	//get JSON data
	$scope.data = [];
	$scope.randomChars = []; //this is a 2D ARRAY - so it will be easier to make rows and columns depending on num characters specified
	
	$http.get("chineseChars.json").then(function(response){
		$scope.data = response.data;
		$scope.randomChars.push([getRandomChar($scope.data)]);
	});
	
	//options for how many characters to show 
	$scope.options = ["1","2","3","4","5","6","7","8","9","10","11","12"];
	$scope.selectedOption = 1; //no 0-indexing!
	
	//default choice for quiz can be pinyin
	$scope.testChoice = "pinyin";
	
	//when a new number of characters is selected, generate a new random list of characters with a length of that new number
	$scope.getCharArray = function(){
		//clear current array
		$scope.randomChars = [];
		//reset id counter
		$scope.idCount = 0;
		var checkArray = []; //1d array to check for dupes
		
		var counter = 0; //keep track of how many characters has been added
		
		//default is 4 chars per row. change to 3 depending on screen width!
		var charLimit = 4;
		if($(window).width() <= 990 && $(window).width() >= 760){
			charLimit = 3;
		}else if($(window).width() < 760){
			charLimit = 2;
		}
		
		var rowLimit = $scope.selectedOption > charLimit ? Math.floor($scope.selectedOption / charLimit) : 1;
		for(var i = 0; i <= rowLimit; i++){
			var row = [];
			for(var j = 0; j < charLimit; j++){
				if(counter === $scope.selectedOption){
					break;
				}
				var newChar = getRandomChar($scope.data);
				//if checkArray already has newChar, keep looking for a new one
				while(checkArray.indexOf(newChar.value) >= 0){
					newChar = getRandomChar($scope.data);
				}
				checkArray.push(newChar.value);
				row.push(newChar);
				counter++;
			}
			$scope.randomChars.push(row);
		}
	}
	
	//when iterating, assign each character a new id number! this will help keep track of each char in the array 
	//($index does not help because it starts at 0 again for each row). idCount keeps track
	$scope.idCount = 0;
	$scope.keepCount = function(){
		return $scope.idCount++;
	}
	
	//show info for character on corresponding character's 'display info' button click
	$scope.showInfo = function(e){
		var characters = document.querySelectorAll("*[id^='info']");
		var id = (e.target).id;
		//console.log(characters)
		for(var i = 0; i < characters.length; i++){
			var ch = characters[i].id;
			if(ch.match(/[0-9]+/g)[0] === id.match(/[0-9]+/g)[0]){
				//when a char is shown initially, the info section is NOT SET to display: none. rather, it has nothing. 
				if(characters[i].style.display === "none" || !characters[i].style.display){
					characters[i].style.display = "block";
				}else{
					characters[i].style.display = "none";
				}
			}
		}
	}
	
	//evaluate user's input for answer for pinyin or definition
	$scope.evaluateInput = function(e){
		var answers = document.querySelectorAll("*[id^='answer']");
		var thisIdNum = (e.target.id).match(/[0-9]+/g)[0]; //just get the index num of the character clicked on
		var response = document.getElementById('userInput' + thisIdNum);
		for(var i = 0; i < answers.length; i++){
			var ch = answers[i];
			//find the answer corresponding to the current character
			if(ch.id.match(/[0-9]+/g)[0] === thisIdNum){
			
				//no entry in input field?
				if(ch.value === ""){
					return; //just don't do anything 
				}
			
				//is it pinyin or definition?
				if($scope.testChoice === 'pinyin'){
					//evaluate answer from input
					var pinyinAnswer = document.getElementById('pinyin' + thisIdNum).textContent;
					//you really shouldn't evaluate based on indexOf. needs to match exactly!!
					if(pinyinAnswer.indexOf(ch.value) >= 0){                                            
						//show "CORRECT!" in view
						response.textContent = "CORRECT! ^_^";
						response.style.color = "#23e000";
					}else{
						response.textContent = "INCORRECT";
						response.style.color = "#e60008";
					}
					response.style.display = "block";
				}else{
					//evaluate answer from input
					var defAnswer = document.getElementById('definition' + thisIdNum).textContent;
					if(defAnswer.indexOf(ch.value) >= 0){
						//show "CORRECT!" in view
						response.textContent = "CORRECT! ^_^";
						response.style.color = "#23e000";
					}else{
						response.textContent = "INCORRECT";
						response.style.color = "#e60008";
					}
					response.style.display = "block";
				}
			}
		}
	}
	
}]);


function getRandomChar(data){
	var randIndex = Math.floor(Math.random()*data.length);
	return data[randIndex];
}


/*
	for quizlet 2
*/
controllers.controller('quizlet2', ['$scope', '$http', function($scope, $http){
	
	//http://stackoverflow.com/questions/17139818/detecting-what-jquery-uis-draggable-function-is-hovering-over
	//http://stackoverflow.com/questions/32635483/jquery-ui-draggable-helper-clone
	//http://jsfiddle.net/tuM2M/3/
	
	//get JSON data
	$scope.data = [];
	$scope.randomChars = []; 
	$scope.randomCharsInfo = [];
	$scope.pairs = []; //this is a 2D array!!
	
	$http.get("chineseChars.json").then(function(response){
		$scope.data = response.data;
		//add 2 random chars inititally
		$scope.randomChars.push(getRandomChar($scope.data));
		$scope.randomChars.push(getRandomChar($scope.data));
		$scope.getCharArrayRandomize();
	});
	
	//when a new number of characters is selected, generate a new random list of characters with a length of that new number
	//this function is different from getCharArray, in that this one will populate a definition or pinyin array in a random order, not corresponding to 
	//$scope.randomChars
	$scope.getCharArrayRandomize = function(){
		//clear current array
		$scope.randomChars = [];
		$scope.pairs = [];
		$scope.randomCharsInfo = [];
		
		//reset id counter
		$scope.idCount = 0;
		var checkArray = []; //1d array to check for dupes
		
		//var counter = 0; //keep track of how many characters has been added
		for(var i = 0; i <= $scope.selectedOption; i++){
				var newChar = getRandomChar($scope.data);
				//if checkArray already has newChar, keep looking for a new one
				while(checkArray.indexOf(newChar.value) >= 0){
					newChar = getRandomChar($scope.data);
				}
				checkArray.push(newChar.value);
			
				//edit randomCharsInfo so that for definitions, semicolons are replaced with commas and a space.
				//this will allow for text wrapping. use regex to replace all
				newChar.definition = newChar.definition.replace(/;/g, ", ").trim();
				
				$scope.randomChars.push(newChar);
				$scope.randomCharsInfo.push(newChar);
		}	
		shuffle($scope.randomCharsInfo);
		
		$scope.setPairs($scope.randomChars, $scope.randomCharsInfo);
		
		//console.log($scope.randomCharsInfo);
		//every time a new option for number of characters to be shown changes,
		//this makes sure characters are draggable
		//interactive handling
		$(function(){
			$('.char').draggable({
				revert: true
				//helper: "clone"
			});
			
			$('.info').droppable({
				accept: ".char",
				//hoverClass: 'dragHover',
				tolerance: "touch",
				drop: function(event, ui){
					
					var selectedChar = ui.draggable[0].childNodes[1].textContent.trim();
					var selectedInfo = this.childNodes[1].textContent.split("|")[0].trim();
					
					for(var i = 0; i < $scope.randomCharsInfo.length; i++){

						if(selectedChar === $scope.randomCharsInfo[i].value){	
							if($scope.testChoice === "pinyin"){
								if($scope.randomCharsInfo[i].pinyin === selectedInfo){
									$(this).parent().css('border', '2px solid #22D900');
									ui.draggable[0].style.border = '2px solid #22D900';
									//append that character to the droppable textContent
									this.childNodes[1].textContent = selectedInfo + " | " + selectedChar;
								}
							}else{
								if($scope.randomCharsInfo[i].definition === selectedInfo){
									$(this).parent().css('border', '2px solid #22D900');
									ui.draggable[0].style.border = '2px solid #22D900';
									this.childNodes[1].textContent = selectedInfo + " | " + selectedChar;
								}
							}
						}else{
							//if a proper match has not yet been found for a droppable, make it red-bordered
							if($(this).parent().css("border-left-color") !== 'rgb(34, 217, 0)'){
								$(this).parent().css('border', '2px solid #B40210');
							}
						}
					}
				}
			});	
		});

	}
	
	
	$scope.setPairs = function(array1, array2){
		var row = [];
		for(var i = 0; i < array1.length; i++){
			row.push(array1[i]);
			row.push(array2[i]);
			$scope.pairs.push(row);
			row = [];
		}
	}
	
	//options for how many characters to show 
	$scope.options = ["2","3","4","5","6","7","8"]; //change limit to 2-8
	$scope.selectedOption = 1; //no 0-indexing!
	
	//default choice for quiz can be pinyin
	$scope.testChoice = "pinyin";
	
}]);

//Fisher-Yates in-place shuffle 
function shuffle(array){

	var counter = array.length - 1;
	var temp;
	var randIndex;
	
	while(counter > 0){
	
		randIndex = Math.floor(Math.random() * counter);
		
		//swap
		temp = array[counter];
		array[counter] = array[randIndex];
		array[randIndex] = temp;
		
		counter--;
	}
	return array; //is this needed?
}




