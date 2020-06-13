

var response;
var sendRequest;


$(document).ready(function () {

	// create function for rountine class/div cleanup

	function cleanUp() {

		$("#searchTitle").val("");
		$("#imageDiv").remove();
		$(".infoBox").remove();

	}

	// all requests to and from localstorage occur in this routine
	// todo is option of save or load
	// dataid is the search string used to locate
	// data on appropriate fields.

	function accessStorage(toDo, dataID) {
		if (dataID !== null) {
			if (dataID == dataID.toString().toUpperCase());

		}


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
					newListing.attr("id", "searchBar" + x);
					newListing.text(text.search.toUpperCase());
					newListing.on("click", function (event) {
						$("#CSSLoader").css("display", "block");
						cleanUp();
						accessStorage("save", this.innerHTML);
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

	// this routine creates the card file infomration boxes.

	function makeInfoBox(thisID) {
		var iD = thisID;
		thisID = "w" + thisID;
		// create divs
		var bodyCard = $("<div>");
		bodyCard.attr("class", "card infoBox");
		bodyCard.attr("id", "bodyCard" + thisID);
		// info boxes below need a smaller size to display correctly
		if (iD > 0) {
			bodyCard.attr("style", "width: 11rem;min-height: 400px;");
		}
		$("#" + thisID).append(bodyCard);

		var cardHeader = $("<div>");
		cardHeader.attr("class", "card-header infoBox");
		cardHeader.css("background-color", "#f4976a")
		cardHeader.attr("id", "theTitle" + thisID);
		$("#bodyCard" + thisID).append(cardHeader);

		var cardBody = $("<div>");
		cardBody.attr("class", "card-body infoBox");
		cardBody.attr("style", "min-height: 220px;padding-left:2%;")
		cardBody.attr("id", "cardBody" + thisID);
		$("#bodyCard" + thisID).append(cardBody);

		var h5 = $("<h5>")
		h5.attr("class", "card-title infoBox");
		h5.attr("id", "cardtitle" + thisID);
		$("#cardBody" + thisID).append(h5);

		var peepee = $("<p>")
		peepee.attr("class", "card-text infoBox");
		peepee.attr("id", "peeText" + thisID);
		$("#cardBody" + thisID).append(peepee);
	}
	// function used to create date used for presentation on web page

	function thisTime(thisTime) {

		var dateTime = new Date(thisTime * 1000);
		return (dateTime.toString().substr(0, 15));

	}


	function searchThis(theID, description) {
		theClass = undefined;


		console.log("the id i have is " + theID);
		console.log("the description I have is " + description);


		if (description === "Clouds") {
			theClass = "clouds"
		};

		if (description === "Rain") {
			theClass = "rain"
		};

		if (description === "Clear") {
			theClass = "sunshine"
		};

		if (description === "Thunderstorm") {
			theClass = "thunder"
		};

		if (description === "Fog") {
			theClass = "fog"
		};


		if (theClass !== undefined) {
			$(theID).attr("class", "card infoBox " + theClass);
		}

	}

	// based on geolocation, this result fetches weather information. a lat and long
	// variable are provided in order for it to work correctly.

	function getTheResults(lat, long) {
		console.log("fetching the weather results");
		var settings = {
			"url": "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=metric&appid=a4a1ce235661b8ab1818d50cbde9b7a3",
			"method": "GET"
		}

		$.ajax(settings).done(function (response) {
			$("#CSSLoader").css("display", "none");
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

			// the top information casrd provide weather provided by reponse for today

			$("#theTitlew0").text(response.timezone + " current weather : " + workedTime);
			var searchStringImg = "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png";
			console.log("title top box image: " + searchStringImg);
			
			var $addImg = $("<img>");
				$addImg.attr("src",searchStringImg);
				$addImg.attr("css","float:right;width:100px;height:300px;");
				$("#theTitlew0").append($addImg);	

			$("#peeTextw0").append("Current temp : " + Math.round(parseInt(response.current.temp)) + " °C <BR>");

			$("#peeTextw0").append("Todays Top : " + Math.round(parseInt(response.current.temp)) + " °C <BR>");
		
			$("#peeTextw0").append("Feels Like: " + Math.round(parseInt(response.current.feels_like)) + " °C <BR>");
			$("#peeTextw0").append("Humidity: " + response.current.humidity + " <BR>");
			$("#peeTextw0").append("Description: " + response.current.weather[0].description + " <BR>");
			$("#peeTextw0").append("Wind Speed: " + response.current.wind_speed + " <BR>");
			//$("#peeTextw0").append("UV: " + response.current.uvi + " <BR>");
		
		
		

			// get the pure uv score for image information
			let theUVScore = response.current.uvi;

			// lets see what the UV score is and provide info accordingly.
			if (theUVScore < 3) { theUVpath = "./assets/imgs/UV-Index-1.png"; }
			if ((theUVScore > 2) && (theUVScore < 8)) { theUVpath = "./assets/imgs/UV-Index-2.png"; }
			if (theUVScore > 7) { theUVpath = "./assets/imgs/UV-Index-3.png"; }

			console.log("appending UV Image");
			let theUVIMG = $("<img>");
			theUVIMG.attr("src", theUVpath);
			theUVIMG.attr("id","theUVIMG");
			theUVIMG.attr("class", "uv");
			theUVIMG.attr("style", "cursor:pointer;width:200px;height:205px;margin-left:60%;display:none;");
			theUVIMG.attr("title", "View more information about UV risks and dangers");

			theUVIMG.on("click",function(){
				window.location.href='https://www.uvdaily.com.au/working-outdoors/uv-risk/#:~:text=Exposure%20to%20UV%20radiation%20from,risk%20of%20developing%20skin%20cancer.&text=UV%20%E2%80%93%20thats%20ultraviolet%20radiation%20%E2%80%93%20damage,in%20your%20skin%20over%20time';
			

			})

			$("#cardBodyw0").append(theUVIMG);

			var uvScore = $("<div>");
			uvScore.text("UV Score :" + response.current.uvi);
			uvScore.css("text-decoration", "underline");
			uvScore.css("cursor", "pointer");	
			uvScore.on("mouseover",function() {
				$("#theUVIMG").css("display","block");
			})
			uvScore.on("mouseleave",function() {
				$("#theUVIMG").css("display","none");
			})

			$("#peeTextw0").append(uvScore);

			searchThis("#cardBodyw0", response.current.weather[0].main);


			for (x = 1; x < 7; x++) {

				makeInfoBox(x);
				$("#theTitlew" + (x)).text(thisTime(response.daily[x].dt));

				$("#peeTextw" + x).append("Daily Avg : " + Math.round(parseInt(response.daily[x].temp.day)) + " °C <BR>");
				$("#peeTextw" + x).append("Max Temp : " + Math.round(parseInt(response.daily[x].temp.max)) + " °C <BR><BR>");
				$("#peeTextw" + x).append("Min Temp : " + Math.round(parseInt(response.daily[x].temp.min)) + " °C <BR>");
				$("#peeTextw" + x).append("Forecast : " + response.daily[x].weather[0].description + "<BR>");
				$("#peeTextw" + x).append("Wind : " + response.daily[x].wind_speed + "<BR>");
			
				$("#peeTextw" + x).append("UV Score : " + response.daily[x].uvi)

	


				var theIcon = response.daily[x].weather[0].icon;
				var searchStringImg = "http://openweathermap.org/img/wn/" + response.daily[x].weather[0].icon + "@2x.png";
				console.log(searchStringImg);
				var $addImg = $("<img>");
					$addImg.attr("src",searchStringImg);
					$addImg.attr("css","float:right");
					$("#theTitlew" + (x)).append($addImg);	
				


				searchThis("#bodyCardw" + x, response.daily[x].weather[0].main);
				console.log(workedTime);

			}
		});
	}

	function getGeoLocal(searchHere) {

		// convert string to uppercase

	searchHere = searchHere.toUpperCase();
		console.log("Im searching for this" + searchHere);


		// tidy up as this is a new search
		cleanUp();


		$.ajax({
			"url": "https://www.mapquestapi.com/geocoding/v1/address?key=6X1OoAA3I2lIVopuMM6Mp8RzTE8Ig9sq&location=" + encodeURIComponent(searchHere),
			"method": "GET",
			"success": function (response) {
				console.log("Dumping getGeoLocal results");
				console.log(response);
				console.log("--END ---")

				if (response.count === 0) {
					console.log("error, no results found - returning");
					return;
				}

				// save this search because we know it is good.
				accessStorage("save", searchHere);
				var thisLat = response.results[0].locations[0].latLng.lat;
				var thisLng = response.results[0].locations[0].latLng.lng;
				console.log("lat: " + thisLat + " lng:" + thisLng);
				var theMapURL = response.results[0].locations[0].mapUrl;
				console.log(theMapURL);
				var img = document.createElement("IMG");
				img.src = theMapURL;
				img.id = "imageDiv"
				$("#theMapSRC").append(img);
				$("#imageDiv").attr({ "width": "99%" })
				getTheResults(thisLat, thisLng);


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
			"success": function (response) {
				$(".list-group-item").remove();
				console.log(response);
				var x = parseInt(response.count);
				for (i = 0; i < x; i++) {
					var theCityName = response.data[i].name;
					var theCountry = response.data[i].timezone;
					console.log(theCityName + " " + theCountry);
					var newListing = $("<li>");
					newListing.attr("class", "list-group-item");
					newListing.attr("style", "cursor:pointer");
					newListing.text(theCityName + " ," + theCountry);
					newListing.on("click", function () {
						// save this record to storage
						$("#CSSLoader").css("display", "block");
						accessStorage("save", this.innerHTML);
						getGeoLocal(this.innerHTML);
					})
					$("#foundCountries").append(newListing);
				}
			}
		});
	};

	accessStorage("load", null);

	$("#searchTitle").on("click", function () {
		cleanUp();
		accessStorage("load", null);
	})

	$("#searchTitle").on("keypress", function (e) {


		clearTimeout(sendRequest);

		if (e.which == 13) {
			// save this information to local storage
			console.log("executing 13");
			$("#CSSLoader").css("display", "block");
			getGeoLocal($("#searchTitle").val().toUpperCase());
			cleanUp();

			//searchHere = searchHere.toUpperCase();
		}

		// introduced the timeout to stop multiple requests from flooding the api server
		// and because i could not get the auto complete function to work.

		sendRequest = setTimeout(function () {
			var theSearch = $("#searchTitle").val();
			if (theSearch.length > 3) {
				getCities(theSearch);
			}


		}, 1500);




	});

})
