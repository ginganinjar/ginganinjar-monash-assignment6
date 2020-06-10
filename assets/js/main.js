

// function for api call for weather
// https://openweathermap.org/api/one-call-api

var settings = {
	"url": "https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&appid=a4a1ce235661b8ab1818d50cbde9b7a3",
	"method": "GET"
	}

$.ajax(settings).done(function (response) {
	console.log(response);
});

// api key
// a4a1ce235661b8ab1818d50cbde9b7a3