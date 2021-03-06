// Script.js file with jQuery code to generate a dynamically HTML and CSS pages.
var cities = []; // Creating an array to store all cities that the user searched

$(document).ready(function(){
    $("#searchButton").on("click", function(){  // Adding click event listen listener to all buttons
        if ($("#cityName").val() === ""){
            return;
        } else {
            var apiKey = "2f83f2e43f057df57403be35ef7a51f5";
            var cityvalidate = $("#cityName").val();
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+cityvalidate+"&cnt=6&appid="+apiKey; // Constructing a queryURL using the city name and api key
            $.ajax({ // Performing an AJAX request with the queryURL
              url: queryURL,
              method: "GET"
            })
            .done(function(){ // To validate if the request is successful 
                if (jQuery.inArray($("#cityName").val(), cities) === -1){
                    cities.push($("#cityName").val());
                    localStorage.setItem("Cities",JSON.stringify(cities));  // Grabbing and storing the name city from the button
                    var newCity = $("<button type='button' class='list-group-item list-group-item-action'>"); 
                    newCity.text($("#cityName").val());
                    $("#listCities").prepend(newCity);
                    clearForecast();
                    apiCallOut($("#cityName").val());
                } else {
                    clearForecast();
                    apiCallOut($("#cityName").val()); 
                }
                $("#listCities").empty();
                initStore();
                $("#listCities button").on("click", function(){  // Event listener for button, for when the button is clicked
                clearForecast();
                apiCallOut($(this).text());           
                });            
            })
            .fail(function(){ // To validate if the request is not successful 
                alert("City was not found");
                $("#cityName").val("");
            })
        }
    });    
});

function initStore() { // Getting all data from the local store to initialize the list of cities 
    // Parsing the JSON string to an object
     if (localStorage.getItem("Cities") !== null){
         var lastcity;
        cities = JSON.parse(localStorage.getItem("Cities"));
        for (i=0; i < cities.length; i++){
            var newCity = $("<button type='button' class='list-group-item list-group-item-action'>");
            newCity.text(cities[i]);
            $("#listCities").append(newCity);
        }        
     }    
 }; 


if (localStorage.getItem("Cities") !== null){ // Getting all data from the local store to initialize the list of cities 
    var lastcity;
   cities = JSON.parse(localStorage.getItem("Cities"));
   for (i=0; i < cities.length; i++){
       var newCity = $("<button type='button' class='list-group-item list-group-item-action'>");
       newCity.text(cities[i]);
       $("#listCities").append(newCity);
   }           
apiCallOut(cities[i-1]); //Loading data for the last searched city
}    

function apiCallOut(city){ // All data is being pulled correctly and propagated to the html elements in the main page. 
        console.log(city);
        var temp;
        var humidity;
        var windSpeed;
        var uvIndex;
        var lon;
        var lat;
        var iconCode;
        var apiKey = "2f83f2e43f057df57403be35ef7a51f5";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&cnt=6&appid="+apiKey; // Constructing a queryURL using the city name and api key
        $.ajax({ // Performing an AJAX request with the queryURL
          url: queryURL,
          method: "GET"
        })
  
        // call back function, what to do with the response after asynchronous call is finished
          .then(function(response) {
              temp = ((parseInt(response.main.temp) - 273.15) * 9/5 + 32);
              humidity = response.main.humidity;
              windSpeed = response.wind.speed;
              lon = response.coord.lon;
              lat = response.coord.lat;
              iconCode = response.weather[0].icon;
              var iconurl = "https://openweathermap.org/img/w/" + iconCode + ".png"; // Constucting a url to get icon from the weather web page
              var date = moment().format('dddd LL'); // Getting the current date using moment.js library
              $("#nameCity").html(`<h4 class="card-title" id="nameCity">${response.name}<img id='wiconHeader' src=${iconurl} alt='Weather icon'>${" " + date}</h4>`); 
              $("#temperature").text("Temperature: "+parseInt(temp)+ " °F");
              $("#humidity").text("Humidity: "+humidity+" %");
              $("#windSpeed").text("Wind Speed: "+windSpeed + " mph");
              $.ajax({ // Performing an AJAX request with the queryURL
                url: "https://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+lon+"&appid="+apiKey,
                method: "GET"
              })
              .then(function(responseUV) {
                uvIndex = responseUV.value;
                $("#uvIndex").text(" "+uvIndex);
                bgUvIndex(uvIndex); // Calling a function to change the background color of the Uv Index
              });
              $.ajax({
                url: "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid="+apiKey,
                method: "GET"
              })
              .then(function(responseForecast) {
                var arrayForecast = responseForecast.list; // storing the data from the AJAX request in an array 
                for (i=0; i < arrayForecast.length; i++){
                    if (i === 3 || i === 11 || i === 19 || i === 27 || i === 35){
                        // Creating and storing all element to create the forecast card
                        var card = $("<div class='card bg-primary text-white'>");
                        var cardBody = $("<div class='card-body'>");
                        var cardTitle = $("<h5 class='card-title date'>Card title</h5>");
                        var divIcon = $("<div id='icon'>");
                        var img = $("<img id='wiconHeader' src='' alt='Weather icon'>")
                        var pTemp = $("<p class='card-text temp'>");
                        var pHumidity = $("<p class='card-text humidity'>");
                        // Setting attributes of the elements to a property
                        iconForescast = arrayForecast[i].weather[0].icon;
                        var iconurlF = "https://openweathermap.org/img/w/" + iconForescast + ".png";
                        cardTitle.text((arrayForecast[i].dt_txt).substr(0,10));
                        img.attr("src",iconurlF);
                        var tempForecast = parseInt((arrayForecast[i].main.temp - 273.15) * 9/5 + 32);
                        pTemp.text("Temp: "+ tempForecast+ " °F");
                        pHumidity.text("Humidity: "+arrayForecast[i].main.humidity + " %");
                        // Appending all the tags to their parents
                        card.append(cardBody);
                        cardBody.append(cardTitle);
                        cardBody.append(divIcon);
                        divIcon.append(img);
                        cardBody.append(pTemp);
                        cardBody.append(pHumidity);
                        $(".card-deck").append(card);
                    }
                }
              });
    });
};

function bgUvIndex(uvIndex){ // To changes the background color of the Uv Index
    if (uvIndex >= 0 && uvIndex <3 ){
        $("#uvIndex").css("background-color", "lightgreen");
    } else if (uvIndex >= 3 && uvIndex < 6 ){
        $("#uvIndex").css("background-color", "yellow");
    } else if (uvIndex >= 6 && uvIndex < 8 ){
        $("#uvIndex").css("background-color", "orange");
    } else if (uvIndex >= 8 && uvIndex < 11 ){
        $("#uvIndex").css("background-color", "red");
    }else if (uvIndex >= 11){
        $("#uvIndex").css("background-color", "violet");
    }
};
function clearForecast(){ // To clear the Forecast card 
    $(".card-deck").empty();
};

$("#listCities button").on("click", function(){  // Event listener for button, for when the button is clicked
    clearForecast(); 
    apiCallOut($(this).text());        
});       