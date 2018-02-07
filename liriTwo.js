
// Link in Node Packages
var fs = require('fs'); 
var request = require('request'); // https://www.npmjs.com/package/request --> API request client
var spotify = require('node-spotify-api'); // https://www.npmjs.com/package/spotify --> Spotify API client library
var Twitter = require('twitter'); // https://www.npmjs.com/package/twitter --> Twitter API client library

var apiKeys = require('./keys.js');

// Twiiter content
var myTwitterUserName = "@MadisonKalivoda";

var client = new Twitter({
    consumer_key: apiKeys.twitterKeys.consumer_key,
    consumer_secret: apiKeys.twitterKeys.consumer_secret,
    access_token_key: apiKeys.twitterKeys.access_token_key,
    access_token_secret: apiKeys.twitterKeys.access_token_secret
  });

  var params = {
    screen_name: myTwitterUserName,
    count: 20
};

var spotifyClient = new spotify( {
    id: apiKeys.spotifyKeys.client_id,
    secret: apiKeys.spotifyKeys.client_secret
});

//========== Command Line content===============
var commandType = process.argv[2];


var commandString = "";
for(var i = 3; i < process.argv.length; i++){
  commandString += process.argv[i] + " ";
}

commandString = commandString.trim();

// =================================== Log all inputs the user makes ===================================

var addToLog = "node liri.js ";


for(var i = 2; i < process.argv.length; i++){
  addToLog += process.argv[i] + " ";
}
addToLog = addToLog.substring(0, addToLog.length - 1); 


fs.appendFile("log.txt", addToLog + '\n', function(err) {
  
  
  if(err){
    console.log('Error in user logging: ' + err);
  }

});


// =================================== Input Arguments ===================================


switch(commandType){

  // Case 1 - Twitter
  case 'my-tweets':
    callTwitter();
    break;

  // Case 2 - Spotify
  case 'spotify-this-song':
    callSpotify(commandString);
    break;

  // Case 3 - Request -> OMDb 
  case 'movie-this':
      callMovieRequest(commandString);
      break;


  // Case 00 - Handle Invalid Entry
  default:
    
    console.log('');

    var userPrompt = 'Please pass in a valid LIRI command type...' + '\n' + 'Ex: "my-tweets", "spotify-this-song", "movie-this", or "do-what-it-says"';
    

    console.log(userPrompt);

  
    fs.appendFile("log.txt", userPrompt + '\n\n\n', function(err) {
      if(err){
        console.log('Error in output logging: ' + err);
      }
    });


}

// FUNCTIONS TO CALL APIS 


// ================ Twitter Function ================
function callTwitter(){

    console.log('Calling Twiiter');
  
  
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      
  
      if(error) throw error;
  
      var displayTweets = "";
      for(var i = 0; i < tweets.length; i++){
        var currentTweet = "Tweet " + (i+1) + ": " + '\n' + tweets[i].text;
  
        console.log(currentTweet);
        console.log('');
        displayTweets += currentTweet + '\n';
      }
  
      fs.appendFile("log.txt", displayTweets + '\n\n', function(err) {
        if(err){
          console.log('Error in output logging: ' + err);
        }
      });
  
    });
  
  }

  // Spotify Function
function callSpotify(userInput){

    console.log('Finding song');
  
    var songName = "";


    if(userInput == ""){
      songName = "Don't Stop Believing";
    }
    else{
      songName = userInput;
    }

    spotifyClient.search({ type: 'track', query: songName, limit: 5 }, function(err, data) {
  
      if ( err ) {
        console.log('Error occurred: ' + err);
        return;
      }
      else{
  
        var displaySpotify = "";
  
        var displaySong = 'Track Name: ' + data.tracks.items[0].name;
        displaySpotify += displaySong + '\n';
  
  
       
        var artists = "";
        for(var i = 0; i < data.tracks.items[0].artists.length; i++){
          artists += data.tracks.items[0].artists[i].name + ", ";
        }
        artists = artists.substring(0,artists.length - 2); 
        var displayArtists = 'Artist Name(s): ' + artists;
        displaySpotify += displayArtists + '\n';
  
        var displayAlbum = 'Album Name: ' + data.tracks.items[0].album.name;
        displaySpotify += displayAlbum + '\n';
  
        var displayURL = 'Preview Song URL: ' + data.tracks.items[0].preview_url;
        displaySpotify += displayURL + '\n';
  
        console.log(displaySpotify);
  
  
        fs.appendFile("log.txt", displaySpotify + '\n\n', function(err) {
          if(err){
            console.log('Error in output logging: ' + err);
          }
        });
  
  
      }
  
    });
  }

  // Request Function
function callMovieRequest(userInput){


    console.log('Looking for movie');
  
    var movieName = "";

    if(userInput == ""){
      
      movieName = "The Gladiator";
    }
    else{
      movieName = userInput.replace(/ /g, "+");
    }
  
    //var queryUrl = 'http://www.omdbapi.com/?apikey=tt3896198&apikey=bca2fae5&t' + movieName +'&plot=full&tomatoes=true&r=json';
    var queryUrl = 'http://www.omdbapi.com/trilogy&t='+movieName+'&r=json';
    
    request(queryUrl, function (error, response, body) {
  
     
        if(error) {
          console.log(error);
          return;
      } 
      
      //if (response.statusCode == 200) {
        if (response) {
            console.log(response.body);
 
        var displayIMDB = "";
  
  
        var displayTitle = "Title: " + JSON.parse(response.body)["Title"];
        displayIMDB += displayTitle + '\n';
  
      
        var displayYear = "Year: " + JSON.parse(response.body)["Year"];
        displayIMDB += displayYear + '\n';
  
        
        var displayAge = "Rated: " + JSON.parse(response.body)["Rated"];
        displayIMDB += displayAge + '\n';
  
        
        var displayRating = "IMDB Rating: " + JSON.parse(response.body)["imdbRating"];
        displayIMDB += displayRating + '\n';
  
        
        var displayCountry = "Country of Production: " + JSON.parse(response.body)["Country"];
        displayIMDB += displayCountry + '\n';
  
      
        var displayLanguage = "Language: " + JSON.parse(response.body)["Language"];
        displayIMDB += displayLanguage + '\n';
  
        
        var displayPlot = "Plot: " + JSON.parse(response.body)["Plot"];
        displayIMDB += displayPlot + '\n';
  
        
        var displayActors = "Actors: " + JSON.parse(response.body)["Actors"];
        displayIMDB += displayActors + '\n';
        
  /*
        var displayTomatoCritic = "Rotten Tomatoes Rating (Critics): " + JSON.parse(response.body)["tomatoRating"];
        displayIMDB += displayTomatoCritic + '\n';
  
        
        var displayTomatoUser = "Rotten Tomatoes Rating (Users): " + JSON.parse(response.body)["tomatoUserRating"];
        displayIMDB += displayTomatoUser + '\n';
  
        
        var displayTomatoURL = "Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"];
        displayIMDB += displayTomatoURL + '\n';
  */
  
        console.log(displayIMDB);
  
  
  
        // Append to log
        fs.appendFile("log.txt", displayIMDB + '\n\n', function(err) {
          if(err){
            console.log('Error in output logging: ' + err);
          }
        });
  
  
      }
      // Unsucessful Query
      else{
        console.log('Bad Status Code occurred: ' + response.statusCode);
      }
  
    });
  
  }