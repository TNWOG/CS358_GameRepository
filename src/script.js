var apikey = "e59e045968715255af4842819fc2ec5536ba32fc";
var baseUrl = "http://www.giantbomb.com/api";
var RATE_LIMIT_IN_MS = 1000;
var NUMBER_OF_REQUESTS_ALLOWED = 1;
var NUMBER_OF_REQUESTS = 0;

var title = document.getElementById("gameTitle");
var image = document.getElementById("gameImage");
var searchType = document.getElementsByName("searchType");
var pageNum = document.getElementById("pageCount");

var loadCirc = new LoadingGraphics()

var singleTitle = document.getElementById("singleGameTitle");
var arrayTitles = [];

var globalStartNum = 0;
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
  }
  
}, RATE_LIMIT_IN_MS);

function gameQuery()
{
  title.innerHTML = "";
  loadCirc.addTo("gameTitle");
  var devSearch = $('#devCheck:checkbox:checked').length > 0;
  var GamesSearchUrl = baseUrl + '/games/?api_key=' + apikey + '&format=jsonp';
  if (devSearch == 1) {
    GamesSearchUrl = baseUrl + '/companies/?api_key=' + apikey + '&format=jsonp';
  }
  query = titleText.value
  var searchUrl = GamesSearchUrl + '&filter=name:'+ query + '&sort=original_release_date:desc';
  if (devSearch == 1) {
    searchUrl = GamesSearchUrl + '&filter=name:'+ query + '&sort=original_release_date:desc';
  }
  var query = titleText.value;
  // send off the query
  requests.push(function() {
	if(searchType[1].checked)
	  {
		$.ajax({
		  url: GamesSearchUrl + '&sort=name:asc' + '&filter=name:'+ query,
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
		  url: GamesSearchUrl + '&sort=name:asc' + '&filter=name:'+ query,
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
	}
	else
	{
		document.getElementById("emptySearchOutput").innerHTML="";
		
		Pages(data);
		
		var test = 0;
		data.results.forEach(function(e){
			var platforms = "";
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
		
		for(var i = globalStartNum - 1; i <= globalEndNum - 1; i++)
		{
			arrayTitles.push(data.results[i]);
			title.innerHTML += "<table><tr><th id='thumbnail' rowspan='5'><img id ='image' onclick='Checker(this)' class='pointer' src=" + data.results[i].image.medium_url + "></th><th colspan='2'><a id ='" + data.results[i].id + "' onclick='Checker(this)' class='pointer'>" + data.results[i].name + "</a></th></tr><tr><td>Release Date: "+ data.results[i].original_release_date + "</td></tr><tr><td>Platform(s): " + platformsArray[i] + "</tr></td></table><br>";
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
	}
	else
	{
		document.getElementById("emptySearchOutput").innerHTML= "";
		
		Pages(data);
		
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
	var gameTest = gameCount;
	var everyTen = 10;
	var counter = 1;
	var counterString = "";
	pageNum.innerHTML = "";
	if(gameCount.results.length > 10){
		for(var q = 0; q < gameCount.results.length; q++){
			if(q%everyTen === 0){
				pageNum.innerHTML += "<a id=" + counter + " onclick ='PageNumber(this.id)' class='pointer'>" + counter + " </a>";
				counter++;
			}
		}
	}
}

function PageNumber(myPage){
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
	
	gameQuery();
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
	loadCirc.addTo("singleGameTitle");
	gameInfoQuery(gameId);
}

function singleGameOutput(data)
{
	console.log(data);
	var genreString = "";
	if(data.results.genres.length !== null){
		for(var g = 0; g < data.results.genres.length; g++){
			genreString += data.results.genres[g].name + "<br>";
		}	
	}
	
	var devString = "";
	if(data.results.developers.length !== null){
		for(var d = 0; d < data.results.developers.length; d++){
			devString += data.results.developers[d].name + "<br>";
		}	
	}
	
	var platformString = "";
	if(data.results.platforms.length !== null){
		for(var p = 0; p < data.results.platforms.length; p++){
			platformString += data.results.platforms[p].name + "<br>";
		}	
	}
	
	var similarString = "";
	if(data.results.similar_games.length !== null){
		for(var s = 0; s < data.results.similar_games.length; s++){
			similarString += data.results.similar_games[s].name + "<br>";
		}	
	}
	
//	for(var i = 0; i <  data.results.length; i++)
//		{
//			arrayTitles.push(data.results[i]);
//			singleTitle.innerHTML += "<table><tr><th id='modalImage' rowspan='5'>" + data.results.image.medium_url + "</th><th colspan='2'>";
//			singleTitle.innerHTML += "<td><h1><p id='modalName'>" + data.results.name + "</td></table><br>";
//		}
	
	loadCirc.remove();
	singleTitle.innerHTML += "<img id='modalImage' src=" + data.results.image.medium_url + "></p>";
	singleTitle.innerHTML += "<h1><p id='modalName'>" + data.results.name + "</p></h1>\n";
	singleTitle.innerHTML += "<p id='modalDesc'>" + data.results.deck + "</p>\n";
	singleTitle.innerHTML += "<p id='modalGenres'>" + genreString + "</p>\n";
	singleTitle.innerHTML += "<p id='modalRelease'>" + data.results.original_release_date + "</p>\n";
	singleTitle.innerHTML += "<p id='modalDevelopers'>" + devString + "</p>\n";
	singleTitle.innerHTML += "<p id='modalPlatforms'>" + platformString + "</p>\n";
	singleTitle.innerHTML += "<p id='modalSimilar'>" + similarString + "</p>\n"; 
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
