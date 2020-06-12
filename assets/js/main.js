

var response;

$(document).ready(function () {

	function getTheResults(lat,long) {
		console.log("fetching the weather results");
		var settings = {
			"url": "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=metric&appid=a4a1ce235661b8ab1818d50cbde9b7a3",
			"method": "GET"
			}
		
		$.ajax(settings).done(function (response) {
			console.log(response);
			var daystotal = response.daily;
			console.log(daystotal);
			var totalNumber = parseInt(daystotal.length);
				console.log(totalNumber);
			
				var currentTemp = response.current.temp;
				var currentHunidity = response.current.humidity;
				var currentDescription = response.current.weather[0].description;

				for (x=0; x < totalNumber; x ++) {
				var dateTime = new Date(response.daily[x].dt * 1000);
				var workedTime = dateTime.toString().substr(0,15);;
					
					
						
						var minTemp = response.daily[x].temp.min;
						var  maxTemp = response.daily[x].temp.max;
					

						console.log("Min: " + minTemp + " Max: " + maxTemp + " current temp " + currentTemp)	;
						console.log(workedTime);
						//var date = new Date(UNIX_Timestamp * 1000);

			}
		});
		}

	function getGeoLocal(searchHere) {
			
	console.log("Im searching ofr this" + 	searchHere);
		$("#imageDiv").remove();

		$.ajax({
            "url": "http://www.mapquestapi.com/geocoding/v1/address?key=6X1OoAA3I2lIVopuMM6Mp8RzTE8Ig9sq&location=" + encodeURIComponent(searchHere),
			"method": "GET",
			"success": function(response){
				console.log(response);
				var thisLat = response.results[0].locations[0].latLng.lat;
				var thisLng = response.results[0].locations[0].latLng.lng;
				console.log("lat: " + thisLat + " lng:" + thisLng);
				 getTheResults(thisLat,thisLng) 
				var theMapURL = response.results[0].locations[0].mapUrl;
				console.log (theMapURL);
				var img = document.createElement("IMG");
				img.src = theMapURL;
				img.id = "imageDiv"
				$("#theMapSRC").append(img);
				$("#imageDiv").attr({"width" : "99%"})
				 getTheResults(thisLat,thisLng);
			

				}
			});
		}
         

	function getCities(referrerVar) {
	
		
		$.ajax({
            "async": true,
            "crossDomain": true,
            "url": "https://geo-services-by-mvpc-com.p.rapidapi.com/cities/findcitiesfromtext?252Cdesc&language=en&q=" + referrerVar,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "geo-services-by-mvpc-com.p.rapidapi.com",
                "x-rapidapi-key": "1730421ec2msh67099de7682ba92p1680b6jsnbe83668d17c8"
			},
			"success": function(response){
				$(".list-group-item").remove();
			console.log(response);
			var x = parseInt(response.count);
			for (i = 0; i < x; i ++) {
					var theCityName = response.data[i].name;
					var theCountry = response.data[i].timezone;
					console.log(theCityName + " " + theCountry);
					var newListing = $("<li>");
					newListing.attr("class", "list-group-item");
					newListing.attr("style", "cursor:pointer");
					newListing.text(theCityName + " ," + theCountry);
					newListing.on("click",function() {
					
						getGeoLocal(this.innerHTML);
					})
					$("#foundCountries").append(newListing);
				}
			}
        });
    };
   
	$("#searchTitle").on("keypress", function() {
	
		var theSearch = $("#searchTitle").val();
		if (theSearch.length > 3) {
			getCities(theSearch);
		

		}
	  });

})
