// Example from Brad Dayley
// https://github.com/bwdbooks/nodejs-mongodb-angularjs-web-development

var http = require('http');
var url = require('url');
var qstring = require('querystring');
function sendResponse(weatherData, res){
  var page = '<html><head><title>External Example</title></head>' +
    '<body>' +
    '<form method="post">' +
    'City: <input name="city"><br>' +
    '<input type="submit" value="Weather">' +
    '</form>';
  if(weatherData){
    weatherData = JSON.parse(weatherData);
    console.log(weatherData);
    page += '<h1>Weather Info</h1>' +
      '<h3>City: ' + weatherData.name + '</h3>' +
      '<p>Current Temperature: ' + weatherData.main.temp + '</p>' +
      '<p>Main Weather Description: ' + weatherData.weather[0].main + '</p>' +
      '<p>Expanded Weather Description: ' + weatherData.weather[0].description + '</p>';

  }
  page += '</body></html>';    
  res.end(page);
}
function sendError(res){
  var page = '<html><head><title>External Example</title></head>' +
    '<body>' +
    '<form method="post">' +
    'City: <input name="city"><br>' +
    '<input type="submit" value="Weather">' +
    '</form>' +
    '<h1>Method Not Allowed</h1>' +
    '</body>' +
    '</html>'; 

    res.end(page);
}
function parseWeather(weatherResponse, res) {
  var weatherData = '';
  weatherResponse.on('data', function (chunk) {
    weatherData += chunk;
  });
  weatherResponse.on('end', function () {
    sendResponse(weatherData, res);
  });
}
// You will need to go get your own free API key to get this to work
function getWeather(city, res){
  var options = {
    host: 'api.openweathermap.org',
    path: '/data/2.5/weather?q=' + city + "&APPID=f9cd3610e9144f965638b5be216a0b1d"
  };
  http.request(options, function(weatherResponse){
    parseWeather(weatherResponse, res);
  }).end();
}
http.createServer(function (req, res) {
  console.log(req.method);
  if (req.method == "POST"){
    var reqData = '';
    req.on('data', function (chunk) {
      reqData += chunk;
    });
    req.on('end', function() {
      var postParams = qstring.parse(reqData);
      getWeather(postParams.city, res);
    });
  } else if (req.method == "GET"){
    sendResponse(null, res);
  } else{
    sendError(res);
  }
}).listen(8080);
