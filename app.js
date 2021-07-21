// jfhint esversion:6

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

// allows us to pass the information that we get sent from the post request in the HTML
app.use(bodyParser.urlencoded({extended: true}));

// Route to Homepage
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});


app.post("/", function(req, res) {

  const query = req.body.cityName;
  const apiKey = "1ba811d271f53437fdf274ab6ea1d377";
  const units = "imperial";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;

  // Makes a get request to an external server in order to get the waether data
  // The GET method is used to retrieve information from the given server using a
  // given URI. Requests using GET should only retrieve data and should have no other
  // effect on the data.
  https.get(url, function(response) { // fetches the data from the external server (url)
    console.log(response.statusCode);

    // This function gets a hold of the  data from the "response"
    // "on()" method taps into the response from the "get()" method, and searches in it for some "data"
    // This will correspond to the data that the weatherOpenMap has sent us.
    response.on("data", function(data) {
      // JSON ==> converts the data from Hexadecimal code (string format) to JavaScript object
      // Passes the hexadicamal data that we get, into a JavaScript object.
      const weatherData = JSON.parse(data);
      // Digs through the converted JavaScript object, to get specific pieces of data that we are interested in (easily using the chrome extension)
      const temp = weatherData.main.temp; // Get the paths (main.temp) using ""JSON viewer Pro: Chrome Extension""
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      console.log(temp, weatherDescription);

      // "stringify(object)" will do the opposite. Will turn a JavaScript Object into a string (For example: HexaDecimel)
      // const ... = JSON.stringify(object);

      //** We can only have **ONE** "res.send()" in an "app.get()" method. Otherwise the server will crash.
      // BUT we can have multiple "res.write()"
      res.write("<h1>The Temperature in " + query + " is " + temp + " degrees Celcius.</h1>");
      res.write("<h2>The Weather is currently: " + weatherDescription + ".</h2>");
      res.write("<img src=" + imageURL + ">");
      res.send();
    });
  });
});



// *********
// Setup Port
app.listen(3000, function() {
  console.log("Server is running on port 3000")
});
