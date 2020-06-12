

var response;
var sendRequest;


$(document).ready(function () {

	// create function for rountine class/div cleanup

	function cleanUp() {
	
		$("#searchTitle").val("");
		$("#imageDiv").remove();
		$(".infoBox").remove();

	}

	function accessStorage(toDo,dataID) {
		var getStorage = localStorage["weatherData"];
	
		// if getStorageInfo is not empty then parse json otherwise set as empty array
		 var results = getStorage ? JSON.parse(getStorage) : [];

		 if (toDo === "load") {
			console.log("requesting load data");

			// sort array based on best scores
			var theArray = results.slice(0);
			var x = 0;

			if (theArray.length > 0) {
				theArray.forEach((text) => {
					x++;
					var searchResult = text.search;
					console.log("previous search " + searchResult);
					var newListing = $("<li>");
					newListing.attr("class", "list-group-item infoBox");
					newListing.attr("style", "cursor:pointer");
					newListing.attr("id","searchBar" + x);
					newListing.text(text.search.toUpperCase());
					newListing.on("click",function(event) {
						
						cleanUp();
						accessStorage("save",this.innerHTML);	
						getGeoLocal(this.innerHTML);
						event.stopPropagation();

					})
						$("#foundCountries").append(newListing);
					
						
	

				});
			}
		 }


		if (toDo === "save") {
			
			// get object array of matches to the existing search
			objIndex = results.findIndex((obj => obj.search == dataID.toUpperCase()));

			if (objIndex !== -1) {
				//Log object to Console.
				console.log("Before update: ", results[objIndex])
		
				//Update object's theText property to avoid duplication.
		
				results[objIndex].search = dataID;
			  } else {
				results.push({
				  search: dataID.toUpperCase()
				});
			  }
		localStorage["weatherData"] = JSON.stringify(results);
		
	}

}


	function makeInfoBox(thisID) {
			var iD = thisID;
			thisID = "w" + thisID;	
				// create divs
				var bodyCard = $("<div>");
				bodyCard.attr("class","card infoBox");
				bodyCard.attr("id","bodyCard" + thisID);
			// info boxes below need a smaller size to display correctly
			if (iD > 0) {
				bodyCard.attr("style", "width: 13rem");
			}
				$("#" + thisID).append(bodyCard);

				var cardHeader = $("<div>");
				cardHeader.attr("class","card-header infoBox");
				cardHeader.css("background-color", "#f4976a")
				cardHeader.attr("id","theTitle" + thisID);
				$("#bodyCard" + thisID).append(cardHeader);

				var cardBody = $("<div>");
				cardBody.attr("class","card-body infoBox");
				cardBody.attr("style","min-height: 220px")
				cardBody.attr("id","cardBody" + thisID);
				$("#bodyCard" + thisID).append(cardBody);

				var h5 = $("<h5>")
				h5.attr("class","card-title infoBox");
				h5.attr("id","cardtitle" + thisID);
				$("#cardBody" + thisID).append(h5);

				var peepee = $("<p>")
				peepee.attr("class","card-text infoBox");
				peepee.attr("id", "peeText" + thisID);
				$("#cardBody" + thisID).append(peepee);
}

function thisTime(thisTime) {
	
	var dateTime = new Date(thisTime * 1000);
	return (dateTime.toString().substr(0,15));

}


function searchThis(theID, description) {
theClass = undefined;
console.log("the id i have is " + theID);
console.log("the description I have is " + description);


	if  (description === "Clouds") {
		theClass = "clouds"
			};

			if  (description === "Rain") {
				theClass = "rain"
					};

					if  (description === "Clear") {
						theClass = "sunshine"
							};

							if  (description === "Thunderstorm") {
								theClass = "thunder"
									};	

									if  (description === "Fog") {
										theClass = "fog"
											};	
		

	if (theClass !== undefined) {
		$(theID).attr("class","card infoBox " + theClass);
			}

}

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
			
				//var currentTemp = response.current.temp;
				var currentHunidity = response.current.humidity;
				var currentDescription = response.current.weather[0].description;
	
				makeInfoBox(0);

				var workedTime = thisTime(new Date(response.current.dt));

				$("#theTitlew0").text(response.timezone + " current weather : " + workedTime);
			
		
			
				$("#peeTextw0").append("Current temp : " + response.current.temp + " °C <BR>");
				$("#peeTextw0").append("Feels Like: " + response.current.feels_like + " °C <BR>");
				$("#peeTextw0").append("Humidity: " + response.current.humidity + " <BR>");
				$("#peeTextw0").append("Description: " + response.current.weather[0].description + " <BR>");		
				$("#peeTextw0").append("Wind Speed: " + response.current.wind_speed + " <BR>");				
				$("#peeTextw0").append("UV: " + response.current.uvi + " <BR>");				

				searchThis("#bodyCardw0", response.current.weather[0].main);

				


				for (x=1; x < 7; x ++) {
					
						makeInfoBox(x);
						$("#theTitlew" + (x)).text(thisTime(response.daily[x].dt));
					
						$("#peeTextw" + x).append("Daily Avg : " + response.daily[x].temp.day + " °C <BR>");
						$("#peeTextw" + x).append("Max Temp : " + response.daily[x].temp.max + " °C <BR>");
						$("#peeTextw" + x).append("Min Temp : " + response.daily[x].temp.min + " °C <BR>");
						$("#peeTextw" + x).append("Forecast : " + response.daily[x].weather[0].description + "<BR>");
						$("#peeTextw" + x).append("Wind Speed : " + response.daily[x].wind_speed + "<BR>");

						var minTemp = response.daily[x].temp.min;
						var  maxTemp = response.daily[x].temp.max;
						var  averageTemp = response.daily[x].temp.day;
						var weatherDescription = response.daily[x].weather[0].description;
						searchThis("#bodyCardw" + x, response.daily[x].weather[0].main);

	
						console.log(workedTime);
						
			}
		});
		}

	function getGeoLocal(searchHere) {
			
	console.log("Im searching of this" + 	searchHere);
	
	// tidy up as this is a new search
	cleanUp();


		$.ajax({
            "url": "http://www.mapquestapi.com/geocoding/v1/address?key=6X1OoAA3I2lIVopuMM6Mp8RzTE8Ig9sq&location=" + encodeURIComponent(searchHere),
			"method": "GET",
			"success": function(response){
				console.log("Dumping getGeoLocal results");
				console.log(response);
				console.log("--END ---")
				
				if (response.count === 0)
				{
					console.log("error, no results found - returning");
					return;
				}

				// save this search because we know it is good.
				accessStorage("save", searchHere);
				var thisLat = response.results[0].locations[0].latLng.lat;
				var thisLng = response.results[0].locations[0].latLng.lng;
				console.log("lat: " + thisLat + " lng:" + thisLng);
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
						// save this record to storage
						accessStorage("save",this.innerHTML);	
						getGeoLocal(this.innerHTML);
					})
					$("#foundCountries").append(newListing);
				}
			}
        });
    };
   
				accessStorage("load",null);

			$("#searchTitle").on("click",function(){
			cleanUp();
		accessStorage("load",null);
	})

	$("#searchTitle").on("keypress", function(e) {
	

		clearTimeout(sendRequest);

			if (e.which == 13) {
				// save this information to local storage
					console.log("executing 13");
					getGeoLocal($("#searchTitle").val());
					cleanUp();
			}

			// introduced the timeout to stop multiple requests from flooding the api server
			// and because i could not get the auto complete function to work.

			sendRequest = setTimeout(function(){ 
				var theSearch = $("#searchTitle").val();
				if (theSearch.length > 3) {
					getCities(theSearch);
				}
			
		
		}, 1500);
	


		
	  });

})
