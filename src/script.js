var apikey = "e59e045968715255af4842819fc2ec5536ba32fc";
var baseUrl = "http://www.giantbomb.com/api";
var RATE_LIMIT_IN_MS = 1000;
var NUMBER_OF_REQUESTS_ALLOWED = 1;
var NUMBER_OF_REQUESTS = 0;

var title = document.getElementById("gameTitle");
var image = document.getElementById("gameImage");

var loadCirc = new LoadingGraphics()

var singleTitle = document.getElementById("singleGameTitle");
var arrayTitles = [];

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
  var GamesSearchUrl = baseUrl + '/games/?api_key=' + apikey + '&format=jsonp';
  var query = titleText.value;
  // send off the query
  requests.push(function() {
		$.ajax({
		  url: GamesSearchUrl + '&sort=name:asc' + '&filter=name:'+ query,
		  type: "GET",
		  dataType: "jsonp",
		  crossDomain: true,
		  jsonp: "json_callback",
		  success: searchCallback
		});
  });
}

// callback for when we get back the results
function searchCallback(data) 
{
	loadCirc.remove();
	arrayTitles = [];
	var arrayGame = [];
	var platforms = "";
	var platformsArray = [];
	var zero = 0;
	title.innerHTML = "";
	if(data.number_of_page_results==0)
	{
		//refers to a paragraph in the html with id="output"
		document.getElementById("emptySearchOutput").innerHTML=noResults;
	}
	else
	{
		document.getElementById("emptySearchOutput").innerHTML="";
		
		var test = 0;
		data.results.forEach(function(e){
			platforms = "";
				if(e.platforms !== null){
					for(var k = 0; k < e.platforms.length; k++){
					platforms += e.platforms[k].name + ", ";
				}
				platformsArray[test] = platforms;
				test += 1;
			}

		});
		
		
		
		for(var i = 0; i <  data.results.length; i++)
		{
			arrayTitles.push(data.results[i]);
			title.innerHTML += "<table><tr><th id='thumbnail' rowspan='5'><img id ='image' src=" + data.results[i].image.medium_url + "></th><th colspan='2'><a id ='" + data.results[i].id + "' onclick='Checker(this)' class='pointer'>" + data.results[i].name + "</a></th></tr><tr><td>Release Date: "+ data.results[i].original_release_date + "</td></tr><tr><td>Developer: " + data.results[i].developer + "</td></tr><tr><td>Genre: " + data.results[i].genre + 
			"</td></tr><tr><td>Platform(s): " + platformsArray[i] + "</tr></td></table><br>";
		}
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
	var gameId;
	for(var j = 0; j < arrayTitles.length; j++){
		if(arrayTitles[j].id.toString() === htmlData.id){
			gameId = arrayTitles[j].guid;
			break;
		}
	}
	singleTitle.innerHTML = "";
	modal.style.display = "block";
	loadCirc.addTo("singleGameTitle")
	gameInfoQuery(gameId)
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
	} else{
		similarString = "None";
	}
	
	loadCirc.remove();
	
	singleTitle.innerHTML += "<table><tr><th id='modalTableName' rowspan='5'><td><h1><p id='modalName'>" + data.results.name + "</td></h1></tr></th>" + "<th colspan='2'><tr><td><img id='modalImage' src=" + data.results.image.medium_url + "></td>" + "<td><p id='modalDesc'>" + data.results.deck + "</td></tr></th>" + "<th colspan='2'><tr><td><p id='modalGenres'>" + genreString + "</td></tr>" + "<tr><td><p id='modalRelease'>" + data.results.original_release_date + "</td></tr></th>" + "<th colspan='2'><tr><td><p id='modalDevelopers'>" + devString + "</td></tr>" + "<tr><td><p id='modalPlatforms'>" + platformString + "</td></tr></th>" + "</table><br>";
	
//	singleTitle.innerHTML += "<img id='modalImage' src=" + data.results.image.medium_url + "></p>";
//	singleTitle.innerHTML += "<h1><p id='modalName'>" + data.results.name + "</p></h1>\n";
//	singleTitle.innerHTML += "<p id='modalDesc'>" + data.results.deck + "</p>\n";
//	singleTitle.innerHTML += "<p id='modalGenres'>" + genreString + "</p>\n";
//	singleTitle.innerHTML += "<p id='modalRelease'>" + data.results.original_release_date + "</p>\n";
//	singleTitle.innerHTML += "<p id='modalDevelopers'>" + devString + "</p>\n";
//	singleTitle.innerHTML += "<p id='modalPlatforms'>" + platformString + "</p>\n";
//	singleTitle.innerHTML += "<p id='modalSimilar'>" + similarString + "</p>\n"; 
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
