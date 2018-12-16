var apikey = "e59e045968715255af4842819fc2ec5536ba32fc";
var baseUrl = "http://www.giantbomb.com/api";
var RATE_LIMIT_IN_MS = 1000;
var NUMBER_OF_REQUESTS_ALLOWED = 1;
var NUMBER_OF_REQUESTS = 0;

var title = document.getElementById("gameTitle");
var image = document.getElementById("gameImage");
var searchType = document.getElementsByName("searchType");
var pageNum = document.getElementById("pageCount");

var gameTest = "";

var pageBool = false;

var loadCirc = new LoadingGraphics()

var singleTitle = document.getElementById("singleGameTitle");
var arrayTitles = [];

var globalStartNum = -1;
var globalEndNum = 0;

var titleText = document.getElementById("gameTitleSearch");
var titleSubmit = document.getElementById("titleSubmit");
titleSubmit.addEventListener("mousedown", gameQuery);
titleText.addEventListener("keypress", function(e){
	var key = e.which || e.keyCode;
	if(key === 13){
		gameQuery();
	}
});

var sortBy = document.getElementById("sortList");
sortBy.addEventListener("change", function(){ if(title.innerHTML != "") { gameQuery(); }});

var platformFilter = document.getElementsByName("platforms");

//message displayed when no search found
var noResults= "No results were found. Please try a different search.";

var myTitle = "";

var requests = [];

var fetcher = new JSONFetch("input");
$(window).bind("load", function() {
  fetcher.fileInput.setAttribute('onchange', 'fetcher.processJSON((e) => searchCallback(e))');
});

setInterval(function () {
  if(requests.length > 0)
  {
    var request = requests.pop();
    if(typeof request === "function")
    {
      request();
    }
	  console.log(requests.length);
  }
  
}, RATE_LIMIT_IN_MS);

function gameQuery()
{
  pageBool = true;
  globalStartNum = -1
  title.innerHTML = "";
  loadCirc.addTo("gameTitle");
  var devSearch = $('#devCheck:checkbox:checked').length > 0;
  var GamesSearchUrl, searchUrl, sort, platform
  
  sort = '&sort=' + sortBy.value;
	
  if(platforms[0].checked) {
  	platform = ',' + platforms[0].value;
  } else if (platforms[1].checked) {
  	platform = ',' + platforms[1].value;
  } else if (platforms[2].checked) {
  	platform = ',' + platforms[2].value;
  } else if (platforms[3].checked) {
  	platform = ',' + platforms[3].value;
  } else {
	platform = "";
  }

  if (devSearch == 1) {
    GamesSearchUrl = baseUrl + '/companies/?api_key=' + apikey + '&format=jsonp';
  }
  else{
	GamesSearchUrl = baseUrl + '/games/?api_key=' + apikey + '&format=jsonp';
  }
  var query = titleText.value + platform;
  searchUrl = GamesSearchUrl + '&filter=name:'+ query + sort;
  // send off the query
  requests.push(function() {
	if(searchType[1].checked)
	  {
		$.ajax({
		  url: searchUrl,
		  type: "GET",
		  dataType: "jsonp",
		  crossDomain: true,
		  jsonp: "json_callback",
		  success: exclusiveSearchCallback	
		});
	  }
	  else
	  {
		  $.ajax({
		  url: searchUrl,
		  type: "GET",
		  dataType: "jsonp",
		  crossDomain: true,
		  jsonp: "json_callback",
		  success: searchCallback	
		});
	  }
	});
}

// callback for when we get back the results
function searchCallback(data) 
{
	loadCirc.remove();
	arrayTitles = [];
	var platforms = "";
	var platformsArray = [];
	title.innerHTML = "";
	if(data.number_of_page_results === 0)
	{
		//refers to a paragraph in the html with id="output"
		document.getElementById("emptySearchOutput").innerHTML=noResults;
		pageNum.innerHTML = "";
	}
	else
	{
		document.getElementById("emptySearchOutput").innerHTML="";
		if(pageBool){
			Pages(data);
			pageBool = false;
		}
		
		var test = 0;
		data.results.forEach(function(e){
			var platforms = "";
			if(e.platforms !== null && e.platforms !== undefined){
				for(var k = 0; k < e.platforms.length; k++){
					if(k === e.platforms.length - 1){
						platforms += e.platforms[k].name;
						break;
					}
				platforms += e.platforms[k].name + ", ";
			}
			platformsArray[test] = platforms;
			test += 1;
			}
		});
		
		for(var i = globalStartNum - 1; i <= globalEndNum - 1; i++)
		{
			arrayTitles.push(data.results[i]);
			title.innerHTML += "<table><tr><th id='thumbnail' rowspan='5'><img id = " + data.results[i].id + " onclick='Checker(this)' class='pointer' src=" + data.results[i].image.medium_url + "></th><th colspan='2'><a id ='" + data.results[i].id + "' onclick='Checker(this)' class='pointer'>" + data.results[i].name + "</a></th></tr><tr><td>Release Date: "+ data.results[i].original_release_date + "</td></tr><tr><td>Platform(s): " + platformsArray[i] + "</tr></td></table><br>";
		}
	}
}

function exclusiveSearchCallback(data)
{
	loadCirc.remove();
	arrayTitles = [];
	var platforms = "";
	var platformsArray = [];
	title.innerHTML = "";
	var query= titleText.value;
	var count=0;
	if(data.number_of_page_results === 0)
	{
		document.getElementById("emptySearchOutput").innerHTML= noResults;
		pageNum.innerHTML = "";
	}
	else
	{
		document.getElementById("emptySearchOutput").innerHTML= "";
		
		if(pageBool){
			Pages(data);
			pageBool = false;
		}
		
		var test = 0;
		data.results.forEach(function(e){
			platforms = "";
			if(e.platforms !== null){
				for(var k = 0; k < e.platforms.length; k++){
					if(k === e.platforms.length - 1){
						platforms += e.platforms[k].name;
						break;
					}
				platforms += e.platforms[k].name + ", ";
			}
			platformsArray[test] = platforms;
			test += 1;
			}
		});
		
		for(var i = globalStartNum - 1; i < globalEndNum - 1; i++)
		{				
			if(data.results[i].name.toLocaleUpperCase().includes(query.toLocaleUpperCase() + " ",0) || 			 	data.results[i].name.toLocaleUpperCase() === query.toLocaleUpperCase()) 
			{
				arrayTitles.push(data.results[i]);
				title.innerHTML += "<table><tr><th id='thumbnail' rowspan='5'><img id ='image' onclick='Checker(this)' class='pointer' src=" + data.results[i].image.medium_url + "></th><th colspan='2'><a id ='" + data.results[i].id + "' onclick='Checker(this)' class='pointer'>" + data.results[i].name + "</a></th></tr><tr><td>Release Date: "+ data.results[i].original_release_date + "</td></tr><tr><td>Platform(s): " + platformsArray[i] + "</tr></td></table><br>";
						
				count++;
			}
		}
		if(count === 0)
		{
			document.getElementById("emptySearchOutput").innerHTML= noResults;
		}
	}
}

function Pages(gameCount){
	gameTest = gameCount;
	var everyTen = 10;
	var counter = 1;
	var counterString = "";
	pageNum.innerHTML = "";
	console.log(gameCount);
	if(gameCount.results.length > 10){
		for(var q = 0; q < gameCount.results.length; q++){
			if(q%everyTen === 0){
				pageNum.innerHTML += "<a id=" + counter + " onclick ='PageNumber(this.id, gameTest)' class='pointer'>" + counter + " </a>";
				counter++;
			}
		}
	}
	if(globalStartNum === -1){
		PageNumber(1, gameTest);
	}
}

function PageNumber(myPage, gameTest){
	console.log(myPage);
	
	var resultStart = myPage;
	var resultsEnd = myPage * 10;
	
	console.log("reStart: " + resultStart + "reEnd: " + resultsEnd);
	
	if(myPage > 1){
		resultStart = resultsEnd - 10 + 1;
		resultsEnd = myPage * 10 - 1;
		
		globalStartNum = resultStart;
		globalEndNum = resultsEnd;
		
		console.log("reStart: " + resultStart + "reEnd: " + resultsEnd);
	}
	else{
		globalStartNum = resultStart;
		globalEndNum = resultsEnd;
	}
	if(searchType[1].checked){
		exclusiveSearchCallback(gameTest);
	} else{
		searchCallback(gameTest);
	}
}

function gameInfoQuery(id)
{
	var GamesSearchUrl = baseUrl + '/game/' + id + '/?api_key=' + apikey + '&format=jsonp';
	requests.push(function() {
		$.ajax({
		  url: GamesSearchUrl,
		  type: "GET",
		  dataType: "jsonp",
		  crossDomain: true,
		  jsonp: "json_callback",
		  success: singleGameOutput
		});
  });
}

function similarGamesInfoQuery(id)
{
	var GamesSearchUrl = id + '/?api_key=' + apikey + '&format=jsonp';
	requests.push(function() {
		$.ajax({
		  url: GamesSearchUrl,
		  type: "GET",
		  dataType: "jsonp",
		  crossDomain: true,
		  jsonp: "json_callback",
		  success: singleGameOutput
		});
  });
}

function Checker(htmlData){
	console.log(htmlData);
	var gameId;
	for(var j = 0; j < arrayTitles.length; j++){
		if(arrayTitles[j].id.toString() === htmlData.id){
			gameId = arrayTitles[j].guid;
			break;
		}
	}
	singleTitle.innerHTML = "";
	modal.style.display = "block";
	loadCirc.addTo("singleGameTitle", true);
	gameInfoQuery(gameId);
}

function singleGameOutput(data)
{
	console.log(data);
	var genreString = "";
	if(data.results.genres !== null && data.results.genres !== undefined){
		for(var g = 0; g < data.results.genres.length; g++){
			genreString += data.results.genres[g].name + "<br>";
		}	
	}
	
	var devString = "";
	if(data.results.developers !== null && data.results.developers !== undefined){
		for(var d = 0; d < data.results.developers.length; d++){
			devString += data.results.developers[d].name + "<br>";
		}	
	}
	
	var platformString = "";
	if(data.results.platforms !== null && data.results.platforms !== undefined){
		for(var p = 0; p < data.results.platforms.length; p++){
			platformString += data.results.platforms[p].name + "<br>";
		}	
	}
	
	var similarString = "";
	if(data.results.similar_games !== null && data.results.similar_games !== undefined){
		var min = Math.min(data.results.similar_games.length, 5)
		for(var s = 0; s < min; s++){
			similarString += data.results.similar_games[s].name + "<br>";
		}	
	} else{
		similarString = "None";
	}
	
	loadCirc.remove();
	
	singleTitle.innerHTML += 
		"<table border='1' align='center' width ='100%' id='modalGameTable'><col width='200'><col width='200'><tr><th colspan='2'><h1 id ='modalName'>" + data.results.name + "</h1></th></tr>" + 
		"<tr><th rowspan='5' align='center'><img id='modalImage' src=" + data.results.image.medium_url + ">" + "<tr><th id='modalGenres'><h2 class='modalHeader'>Genre</h2>" + genreString + "</tr></th>" + "<tr><th id='modalRelease'><h2 class='modalHeader'>Release Date</h2>" + data.results.original_release_date + "</th></tr>" + "<tr><th id='modalDevelopers'><h2 class='modalHeader'>Developer</h2>" + devString + "</tr></th>" + "<tr><th id='modalPlatforms'><h2 class='modalHeader'>Platforms</h2>" + platformString + "</th></tr>" + 
		"<tr><th colspan='2' id='modalDesc'><h2 class='modalHeader'>Description</h2>" + data.results.deck + "</th></tr>" + 
		"<tr><th colspan='2' id='modalSimilar'><h2 class='modalHeader'>Similar Games</h2>" + similarString + "</th></tr>" +
		"</table><br>";
	modal.style.display = "block";
}

// Get the modal
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

var tmkSel = document.createElement("select");
var tmkBut = document.getElementById("tmkOpen");
tmkSel.id="optionSelect";
tmkBut.onclick = function(){
	singleTitle.innerHTML = "";
	modal.style.display = "block";
	tmkSel.innerHTML = ""
	var tmkOp1 = document.createElement("option")
	tmkOp1.value = 94
	tmkOp1.innerHTML = "PC"
	tmkSel.appendChild(tmkOp1)
	var tmkOp2 = document.createElement("option")
	tmkOp2.value = 146
	tmkOp2.innerHTML = "Playstation 4"
	tmkSel.appendChild(tmkOp2)
	var tmkOp3 = document.createElement("option")
	tmkOp3.value = 157
	tmkOp3.innerHTML = "Nintendo Switch"
	tmkSel.appendChild(tmkOp3)
	var tmkOp4 = document.createElement("option")
	tmkOp4.value = 145
	tmkOp4.innerHTML = "Xbox One"
	tmkSel.appendChild(tmkOp4)
	var tmkEntr = document.createElement("button")
	tmkEntr.innerHTML = "Enter!"
	tmkEntr.setAttribute("onclick", "generateTmk(tmkSel.value)")
	singleTitle.appendChild(tmkSel)
	singleTitle.appendChild(tmkEntr)
};

var clues = [];
var gameName, clueArea, clueGuess, TYKimg;

function generateTmk(val){
  singleTitle.innerHTML = "";
  tmkSel.innerHTML = ""
  loadCirc.addTo("singleGameTitle", true)
  var GamesSearchUrl = baseUrl + '/games/?api_key=' + apikey + '&format=jsonp';
  // send off the query
	requests.push(function() {
			$.ajax({
			url: GamesSearchUrl + '&sort=name:asc' + '&filter=platforms:'+ val,
			type: "GET",
			dataType: "jsonp",
			crossDomain: true,
			jsonp: "json_callback",
			success: calculatePageNum
			});

	});
	function calculatePageNum(data)
	{
		console.log(data)
		var pageNum = data.number_of_total_results/data.number_of_page_results;
		var randPageIt = Math.ceil(Math.random()*pageNum)
		console.log(randPageIt)
		requests.push(function() {
			$.ajax({
			url: GamesSearchUrl + '&sort=name:asc' + '&filter=platforms:'+ val + '&offset=' + randPageIt*100,
			type: "GET",
			dataType: "jsonp",
			crossDomain: true,
			jsonp: "json_callback",
			success: generateGame
			});
		});
	}
	function generateGame(data)
	{
		console.log(data)
		var num = Math.floor(Math.random()*100)
		console.log(num)
		var game = data.results[num]
		var gameId = game.id;
		var GamesSearchUrl = baseUrl + '/game/' + gameId + '/?api_key=' + apikey + '&format=jsonp';
		requests.push(function() {
			$.ajax({
			url: GamesSearchUrl,
			type: "GET",
			dataType: "jsonp",
			crossDomain: true,
			jsonp: "json_callback",
			success: setupGame
			});
		});
	}

	function setupGame(data)
	{
		loadCirc.remove()
		singleTitle.innerHTML = "";
		console.log(data)
		gameName = data.results.name
		var gameDescription = data.results.deck
		var gameDev = data.results.developers
		var gameConcepts = data.results.concepts
		var gameCharacters = data.results.characters
		var gameFranchise = data.results.franchises
		var gameLocations = data.results.locations
		var gameGenres = data.results.genres
		var gameObjects = data.results.objects
		var gameDate = data.results.original_release_date
		var gameThemes = data.results.themes
		var gamePublishers = data.results.publishers

		TYKimg = data.results.image.medium_url 
		clues = []
		//clues.push("This game is described as: " + gameDescription)
		if(gameDev){
			gameDev.forEach(function(e){
				clues.push("This game was developed by: " + e.name)
			})
		}
		if(gameConcepts){
			gameConcepts.forEach(function(e){
				clues.push("This game includes the concept of: " + e.name)
			})
		}
		if(gameCharacters){
			gameCharacters.forEach(function(e){
				clues.push("This game includes the character: " + e.name)
			})
		}
		if(gameFranchise){
			gameFranchise.forEach(function(e){
				clues.push("This game is from the franchise: " + e.name)
			})
		}
		if(gameLocations){
			gameLocations.forEach(function(e){
				clues.push("This game takes place in: " + e.name)
			})
		}
		if(gameGenres){
			gameGenres.forEach(function(e){
				clues.push("This game has the genre: " + e.name)
			})
		}
		if(gameObjects){	
			gameObjects.forEach(function(e){
				clues.push("This game includes the object: " + e.name)
			})
		}
		if(gameDate){
		clues.push("This game was released on: " + gameDate)
		}
		if(gameThemes){
			gameThemes.forEach(function(e){
				clues.push("This game has the theme: " + e.name)
			})
		}
		if(gamePublishers){
			gamePublishers.forEach(function(e){
				clues.push("This game was published by: " + e.name)
			})
		}
		clueArea = document.createElement("div")
		clueArea.id = "clueArea"
		singleTitle.appendChild(clueArea)
		clueGuess = document.createElement("input")
		clueGuess.type = "text"
		clueGuess.id = "clueGuess"
		clueGuess.placeholder = "Enter guess..."
		singleTitle.appendChild(clueGuess)
		clueSet = document.createElement("button")
		clueSet.innerHTML = "Enter"
		clueSet.setAttribute("onclick", "updateGuess()")
		singleTitle.appendChild(clueSet)
		clueSet.click()
	}
};
function updateScroll()
{
	var element = document.getElementById("clueArea");
    element.scrollTop = element.scrollHeight;
}
function updateGuess()
{
	var numOfClues = clues.length
	var answerPercent = similarity(gameName, clueGuess.value)
	console.log(answerPercent)
	if(answerPercent<0.75){
		if(numOfClues>0)
		{
			var thisClueNum = Math.floor(Math.random()*numOfClues) 
			var thisClue = clues[thisClueNum]
			clues.splice(thisClueNum, 1)
			console.log(clues)

			clueArea.innerHTML += "<p id='clue" + /* thisClueNum */ + "'>You are " + answerPercent + "% correct. \n" + thisClue +"</p>"
			clueArea.innerHTML += "<p id='clue" + thisClueNum + "'>You are " + answerPercent.toFixed(2)*100 + "% correct. \n" + thisClue +"</p>"
			updateScroll();

		}
		else{
			singleTitle.removeChild(clueSet)
			singleTitle.removeChild(clueGuess)
			clueArea.innerHTML += "<p id = 'wrongAnswer'>The correct answer is " + gameName + "! You Lose!</p>"
			clueArea.innerHTML += "<p><img id='TYKimg' src=" + TYKimg + "></p>";
		}
	
	}
	else
	{
		singleTitle.removeChild(clueSet)
		singleTitle.removeChild(clueGuess)
		clueArea.innerHTML += "<p id = 'rightAnswer'>The answer is "+ gameName+"! You win!</p>"
		clueArea.innerHTML += "<p><img id='TYKimg' src=" + TYKimg + "></p>";
	}
}

function similarity(s1, s2) {
	var longer = s1;
	var shorter = s2;
	if (s1.length < s2.length) {
	  longer = s2;
	  shorter = s1;
	}
	var longerLength = longer.length;
	if (longerLength == 0) {
	  return 1.0;
	}
	return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }

  function editDistance(s1, s2) {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();
  
	var costs = new Array();
	for (var i = 0; i <= s1.length; i++) {
	  var lastValue = i;
	  for (var j = 0; j <= s2.length; j++) {
		if (i == 0)
		  costs[j] = j;
		else {
		  if (j > 0) {
			var newValue = costs[j - 1];
			if (s1.charAt(i - 1) != s2.charAt(j - 1))
			  newValue = Math.min(Math.min(newValue, lastValue),
				costs[j]) + 1;
			costs[j - 1] = lastValue;
			lastValue = newValue;
		  }
		}
	  }
	  if (i > 0)
		costs[s2.length] = lastValue;
	}
	return costs[s2.length];
  }
