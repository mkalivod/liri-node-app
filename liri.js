
var myTwitterUserName = ;


// Link in Node Packages
var fs = require('fs'); 
var request = require('request'); // https://www.npmjs.com/package/request --> API request client
var spotify = require('spotify'); // https://www.npmjs.com/package/spotify --> Spotify API client library
var Twitter = require('twitter'); // https://www.npmjs.com/package/twitter --> Twitter API client library


// Link in API Keys for Twitter
var apiKeys = require('./keys.js');

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


  // Case 3 - Request
  case 'movie-this':
    callMovieRequest(commandString);
    break;


  // Case 4 - FS Read
  case 'do-what-it-says':
    callWhatItSays();
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


// =================================== Functions to Call APIs ===================================


// Twitter Function
function callTwitter(){

  console.log('');


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

  console.log('');

  var songName;
  if(userInput == ""){
    songName = "Don't Stop Believing";
  }
  else{
    songName = userInput;
  }

  spotify.search({ type: 'track', query: songName }, function(err, data) {

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


// Request Function
function callMovieRequest(userInput){


  console.log('');

  var movieName;
  if(userInput == ""){
    
    movieName = "Mr.+Nobody";
  }
  else{
    movieName = userInput.replace(/ /g, "+");
  }

  var queryUrl = 'http://www.omdbapi.com/?t=' + movieName +'&plot=full&tomatoes=true&r=json';

  
  request(queryUrl, function (error, response, body) {

    
    if (!error && response.statusCode == 200) {

      
      var displayIMDB = "";


      var displayTitle = "Title: " + JSON.parse(body)["Title"];
      displayIMDB += displayTitle + '\n';

    
      var displayYear = "Year: " + JSON.parse(body)["Year"];
      displayIMDB += displayYear + '\n';

      
      var displayAge = "Rated: " + JSON.parse(body)["Rated"];
      displayIMDB += displayAge + '\n';

      
      var displayRating = "IMDB Rating: " + JSON.parse(body)["imdbRating"];
      displayIMDB += displayRating + '\n';

      
      var displayCountry = "Country of Production: " + JSON.parse(body)["Country"];
      displayIMDB += displayCountry + '\n';

    
      var displayLanguage = "Language: " + JSON.parse(body)["Language"];
      displayIMDB += displayLanguage + '\n';

      
      var displayPlot = "Plot: " + JSON.parse(body)["Plot"];
      displayIMDB += displayPlot + '\n';

      
      var displayActors = "Actors: " + JSON.parse(body)["Actors"];
      displayIMDB += displayActors + '\n';

      var displayTomatoCritic = "Rotten Tomatoes Rating (Critics): " + JSON.parse(body)["tomatoRating"];
      displayIMDB += displayTomatoCritic + '\n';

      
      var displayTomatoUser = "Rotten Tomatoes Rating (Users): " + JSON.parse(body)["tomatoUserRating"];
      displayIMDB += displayTomatoUser + '\n';

      
      var displayTomatoURL = "Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"];
      displayIMDB += displayTomatoURL + '\n';


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
      console.log('Error occurred: ' + error);
    }

  });

}

// -----------------------------------------------------------------------------------------


function callWhatItSays(){

  
  fs.readFile("random.txt", "utf8", function(error, data) {

    
    var dataArr = data.split(",")
    var randomCommandType = dataArr[0];
    var randomCommandString = dataArr[1];

    
    console.log('');
    var randomCall = 'Running Command: ' + randomCommandType + ' ' + randomCommandString;
    console.log(randomCall);

    fs.appendFile("log.txt", randomCall + '\n', function(err) {
      if(err){
        console.log('Error in output logging: ' + err);
      }
    });


    
    switch(randomCommandType){

      // Case 1 - Twitter
      case 'my-tweets':
        callTwitter();
        break;


      // Case 2 - Spotify
      case 'spotify-this-song':
        callSpotify(randomCommandString);
        break;


      // Case 3 - IMBD (Request)
      case 'movie-this':
        callMovieRequest(randomCommandString);
        break;


      default:

      var userPrompt = 'Sorry! Something is wrong with the "random.txt" file.' + '\n' + 'Use your imagination to come up with a LIRI command.';
      
      console.log('');
      console.log(userPrompt);


      fs.appendFile("log.txt", userPrompt + '\n\n\n', function(err) {
        if(err){
          console.log('Error in output logging: ' + err);
        }
      });

    }

  });

}