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
var searchType = document.getElementsByName("searchType");
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
	console.log(requests.length)
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
  console.log(GamesSearchUrl + '&sort=name:asc' + '&filter=name:'+ query)
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
			if(e.platforms != null){
				for(var k = 0; k < e.platforms.length; k++){
					platforms += e.platforms[k].name + ", ";
				}
			}
			platformsArray[test] = platforms;
			test += 1;
		});
		
		
		
		for(var i = 0; i <  data.results.length; i++)
		{
			arrayTitles.push(data.results[i]);
			title.innerHTML += "<table><tr><th id='thumbnail' rowspan='5'><img id ='image' src=" + data.results[i].image.medium_url + "></th><th colspan='2'><a id ='" + data.results[i].id + "' onclick='Checker(this)' class='pointer'>" + data.results[i].name + "</a></th></tr><tr><td>Release Date: "+ data.results[i].original_release_date + "</td></tr><tr><td>Developer: " + data.results[i].developer + "</td></tr><tr><td>Genre: " + data.results[i].genre + 
			"</td></tr><tr><td>Platform(s): " + platformsArray[i] + "</tr></td></table><br>";
		}
	}
}

function exclusiveSearchCallback(data)
{
	loadCirc.remove();
	arrayTitles = [];
	var arrayGame = [];
	var platforms = "";
	var platformsArray = [];
	var zero = 0;
	title.innerHTML = "";
	var query= titleText.value;
	var count=0;
	if(data.number_of_page_results==0)
	{
		document.getElementById("emptySearchOutput").innerHTML= noResults;
	}
	else
	{
		document.getElementById("emptySearchOutput").innerHTML= "";
		
		var test = 0;
		data.results.forEach(function(e){
			platforms = "";
			if(e.platforms != null){
				for(var k = 0; k < e.platforms.length; k++){
					platforms += e.platforms[k].name + ", ";
				}
			}
			platformsArray[test] = platforms;
			test += 1;
		});
		
		for(var i=0; i < data.results.length; i++)
		{				
			if(data.results[i].name.toLocaleUpperCase().includes(query.toLocaleUpperCase() + " ",0) || 			 	data.results[i].name.toLocaleUpperCase() === query.toLocaleUpperCase()) 
			{
				arrayTitles.push(data.results[i]);
				title.innerHTML += "<table><tr><th id='thumbnail' rowspan='5'><img id ='image' src=" + data.results[i].image.medium_url + "></th><th colspan='2'><a id ='" + data.results[i].id + "' onclick='Checker(this)' class='pointer'>" + data.results[i].name + "</a></th></tr><tr><td>Release Date: "+ data.results[i].original_release_date + "</td></tr><tr><td>Developer: " + data.results[i].developer + "</td></tr><tr><td>Genre: " + data.results[i].genre + 
				"</td></tr><tr><td>Platform(s): " + platformsArray[i] + "</tr></td></table><br>";
						
				count++;
			}
		}
		if(count == 0)
		{
			document.getElementById("emptySearchOutput").innerHTML= noResults;
		}
	}
}

function gameInfoQuery(id)
{
	console.log(id)
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
	loadCirc.addTo("singleGameTitle", true)
	gameInfoQuery(gameId)
}

function singleGameOutput(data)
{
	console.log(data)
	loadCirc.remove()

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
