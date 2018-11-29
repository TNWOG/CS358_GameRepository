
var apikey = ""
var baseUrl = "http://www.giantbomb.com/api";
var RATE_LIMIT_IN_MS = 1000;
var NUMBER_OF_REQUESTS_ALLOWED = 1;
var NUMBER_OF_REQUESTS = 0;

var title = document.getElementById("title")
var titleText = document.getElementById("gameTitle")
var titleSubmit = document.getElementById("titleSubmit")
titleSubmit.addEventListener("mousedown", gameQuery)

var fetcher = new JSONFetch("input");
$(window).bind("load", function() {
  fetcher.fileInput.setAttribute('onchange', 'fetcher.processJSON((e) => searchCallback(e))');
});

var requests = [];

setInterval(function () {
  if(requests.length > 0)
  {
    var request = requests.pop()
    if(typeof request === "function")
    {
      request()
    }
  }
  
}, RATE_LIMIT_IN_MS);

function searchCallback(data) {
  title.innerHTML = ""
  for(var i = 0; i <  data.results.length; i++)
  {
    title.innerHTML += "<img src=" + data.results[i].image.thumb_url + "><h1><a href =\"" + data.results[i].site_detail_url + "\">" + data.results[i].name + "</a></h1>\n"
  }
  
}

function gameQuery()
{
  fetcher.selectJSON();
  /*
  var GamesSearchUrl = baseUrl + '/games/?api_key=' + apikey + '&format=jsonp';
  query = titleText.value
  // send off the query
  requests.push(function() {
    $.ajax({
      url: GamesSearchUrl + '&filter=name:'+ query + '&sort=original_release_date:desc',
      type: "GET",
      dataType: "jsonp",
      crossDomain: true,
      jsonp: "json_callback",
      success: searchCallback
    });
  });*/


};
