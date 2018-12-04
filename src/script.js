var apikey = "e59e045968715255af4842819fc2ec5536ba32fc";
var baseUrl = "http://www.giantbomb.com/api";
var RATE_LIMIT_IN_MS = 1000;
var NUMBER_OF_REQUESTS_ALLOWED = 1;
var NUMBER_OF_REQUESTS = 0;

var title = document.getElementById("gameTitle");
var image = document.getElementById("gameImage");

var singleTitle = document.getElementById("singleGameTitle");
var arrayTitles = [];
var arrayPics = [];

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
	arrayTitles = [];
	title.innerHTML = "";
	if(data.number_of_page_results==0)
	{
		//refers to a paragraph in the html with id="output"
		document.getElementById("emptySearchOutput").innerHTML=noResults;
	}
	else
	{
		document.getElementById("emptySearchOutput").innerHTML="";
		for(var i = 0; i <  data.results.length; i++)
		{
			arrayTitles.push(data.results[i]);
			title.innerHTML += "<img id ='" + arrayTitles[i].name + "' src=" + data.results[i].image.thumb_url + "><h1><p id ='" + arrayTitles[i].name + "' onclick='Checker(this)' class='pointer'>" + data.results[i].name + "</p></h1>\n";
		}
	}
}

function Checker(htmlData){
	console.log(htmlData.id);
	console.log(document.getElementById(htmlData.id).src);
	var deck = "";
	for(var j = 0; j < arrayTitles.length; j++){
		if(htmlData.id === arrayTitles[j].name){
			deck = arrayTitles[j].deck;
			break;
		}
	}
	singleTitle.innerHTML = "";
	singleTitle.innerHTML += "<img src=" + document.getElementById(htmlData.id).src + ">";
	singleTitle.innerHTML += "<h1><p>" + htmlData.id + "</p></h1>\n";
	singleTitle.innerHTML += "<p>" + deck + "</p>\n";
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

/*
function NextScreenPic(){
	console.log("Gamers Rise Up Pics Only");
	window.open;
}
function NextScreenText(){
	console.log("Gamers Rise Up Text Only");
	var newQueryString = "?para1=" + myTitle;
	var myWindowString = "file:///D:/Web%20&%20Internet%20Code/CS358_GameRepository_Theo/src/GamePage.html" + newQueryString;
	window.location.href = myWindowString;
	singleTitle.innerHTML += "<h1><p>" + myTitle + "</p></h1>\n";
	
}*/