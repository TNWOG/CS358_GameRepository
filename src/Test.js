var apikey = ""
var baseUrl = "http://www.giantbomb.com/api";
var RATE_LIMIT_IN_MS = 10000;
var NUMBER_OF_REQUESTS_ALLOWED = 1;
var NUMBER_OF_REQUESTS = 0;

var title = document.getElementById("title")
var titleText = document.getElementById("gameTitle")
var titleSubmit = document.getElementById("titleSubmit")
titleSubmit.addEventListener("mousedown", gameQuery)

var requests = [];

setInterval(function () {
  if(requests.length > 0)
  {
    var request = requests.pop()
    if(typeof request === "function")
    {
      request()
      console.log("fart")
    }
  }
  
}, RATE_LIMIT_IN_MS);

function gameQuery()
{
  var GamesSearchUrl = baseUrl + '/games/?api_key=' + apikey + '&format=jsonp';
  console.log("memes")
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
  });



    // callback for when we get back the results
    function searchCallback(data) {
        title.innerHTML = ""
        for(var i = 0; i <  data.results.length; i++)
        {
          title.innerHTML += "<img src=" + data.results[i].image.thumb_url + "><h1><a href =\"" + data.results[i].site_detail_url + "\">" + data.results[i].name + "</a></h1>\n"
        }
        
    }
};
