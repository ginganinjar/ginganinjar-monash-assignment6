


// function for api call for weather
// https://openweathermap.org/api/one-call-api
function getTheResults(lat,long) {
    var settings = {
        "url": "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&appid=a4a1ce235661b8ab1818d50cbde9b7a3",
        "method": "GET"
        }
    
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
    }
    
    // get the lat and long for selected location.
    
    function getGeoLocal(searchHere) {
        var settings = {
            "url": "http://www.mapquestapi.com/geocoding/v1/address?key=6X1OoAA3I2lIVopuMM6Mp8RzTE8Ig9sq&location=" + searchHere,
            "method": "GET"
            }
        
        $.ajax(settings).done(function (response) {
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
        });
        }
    
        function getCities(referrerVar) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://geo-services-by-mvpc-com.p.rapidapi.com/cities/findcitiesfromtext?252Cdesc&language=en&q=melbourne",
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "geo-services-by-mvpc-com.p.rapidapi.com",
                "x-rapidapi-key": "1730421ec2msh67099de7682ba92p1680b6jsnbe83668d17c8"
            }
        }
        
        $.ajax(settings).done(function (response) {
            console.log(response);
        });
        }
    
        $("#searchTitle").on("click",function() {
    console.log("here");
    
    
            if ($("#findThisPlace").val() > 3) {
            console.log($("#findThisPlace").val());
            //	getCities($("findThisPlace").val());
    
            }
    
        })
    