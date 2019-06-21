require("dotenv").config();

/*
    Packages
*/

var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var inquirer = require('inquirer');

/*
    Global Variables
*/

var keys = require("./keys.js")
var spotify = new Spotify(keys.spotify)

/*
    Functions
*/

/**
 * 
 * @param {String} artist is the artist or band the user inputs.
 * 
 * Function makes an api call to bandsintown, appends all info available to a string, then logs the string to console and txt file.
 * 
 */
function concertThis(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then((response) => {
        console.log("----------------------------------------------------------------");
        var finalAnswer = "";
        if (!response.data.length) return console.log("There are no venues available");
        
        for (resp of response.data) {
            var theLocation = "";
            var theVenue = resp.venue.name;
            var theDate = moment(resp.datetime).format("LLLL");

            //If one of these exist, add it to the location string
            resp.venue.region ? theLocation += `Region: ${resp.venue.region}\n` : null
            resp.venue.country ? theLocation += `Country: ${resp.venue.country}\n` : null
            resp.venue.city ? theLocation += `City: ${resp.venue.city}\n` : null
            finalAnswer += `\n\nVenue: ${theVenue}\n${theLocation}Date: ${theDate}`;
            console.log(finalAnswer)
        }
        logTxt("concert-this", finalAnswer)
    })
}

/**
 * 
 * @param {String} song  is the song inputted by the user to search on spotify.
 * 
 * Function makes an api call to spotify, appends all info available to a string, then logs the string to console and txt file.  
 */
function spotifyThis(song) {
    song ? null : song = "The Sign Ace of Base" //"The Sign" by Ace of Base
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) return console.log(err);
        console.log("----------------------------------------------------------------");
        console.log();//spacer
        var finalAnswer = "";
        if (!data.tracks.items) return console.log("Could not find a song!");
        
        for (var i = 0; i < data.tracks.items.length; i++) {
            var name = data.tracks.items[i].name
            var album = data.tracks.items[i].album.name;
            var preview = data.tracks.items[i].preview_url;
            var artists = data.tracks.items[i].album.artists[0].name

            //If any of these exist, add it to the response;
            var resp = "";
            name ? resp+=`Song: ${name}\n`:null;
            artists ? resp += `Artist(s): ${artists}\n`:null;
            album ? resp+=`Album: ${album}\n`:null;
            preview ? resp+=`Link: ${preview}\n`:null;
            console.log(resp,"\n");
            finalAnswer += (resp+"\n")
        }
        logTxt("spotify-this-song", finalAnswer)
    });

}

/**
 * 
 * @param {String} title is the movie title the user inputs to be searched on omdb.
 * 
 * Function makes an api call to omdb, appends all info available to a string, then logs the string to console and txt file.  
 */
function movieThis(title) {
    title ? null : title = "Mr. Nobody" //If no title, use "Mr. Nobody"
    var queryURL = "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
    axios.get(queryURL).then(function(response) {
        if (!response.data) return console.log("Could not find the movie!");
        
        console.log("----------------------------------------------------------------");  
        var resp = "";
        var plot = response.data.Plot;
        var title = response.data.Title;
        var actors = response.data.Actors;
        var country = response.data.Country;
        var language = response.data.Language;
        var released = response.data.Released;
        var imdbRating = response.data.imdbRating
        var rating = response.data.Ratings.find(obj => obj.Source === "Rotten Tomatoes").Value;

        //Conditionals to check for validity on each property asked for; concat all available info.
        title ? resp+= `Title: ${title}\n` : null;
        released ? resp+= `Released: ${released}\n` : null;
        imdbRating ? resp+= `IMDB Rating: ${imdbRating}\n` : null;
        rating ? resp+= `Rotten Tomato Rating: ${rating}\n` : null;
        country ? resp+= `Country: ${country}\n` : null;
        language ? resp+= `Language: ${language}\n` : null;
        actors ? resp+= `Actors: ${actors}\n` : null;
        plot ? resp+= `\nPlot: ${plot}\n` : null;
        console.log();//Spacer        
        console.log(resp);
        logTxt("movie-this", resp)
    })
}

/**
 * Function reads from random.txt and runs each command available.
 */
function dwis() {
    fs.readFile("random.txt", "utf8", function(err, response) {
        if (err) return console.log(err);
        var perCmd = response.split(" | ");

        //Literally the only way this recursion can work is if there no quotes, afaik.
        //It tries to search with quotes which errors concert-this. 
        var list = perCmd.map(x => x.replace('"',"").replace('"',"").split(","));
        for(each of list) {
            runCmds(each[0], each[1])
        }
    })
}

/**
 * 
 * @param {String} cmd is the executed command the user put as the first argument.
 * @param {String} data is the response based on the executed command; each function has one response string.
 */
function logTxt(cmd, data) {
    var logData = {
        timestamp: moment().format("LLLL"),
        command: cmd,
        data: data 
    }
    fs.appendFile("log.txt", JSON.stringify(logData)+"\n", function(err) {
        if (err) return console.log(err);
    })
}

/**
 * 
 * @param {String} input is the command ran by user or by the random.txt file.
 * @param {String} value is the value to be inserted to one of the functions to search with.
 * 
 * Function uses a switch case on the command to pick which api to use. 
 * If the do-what-it-says is chosen, then all available commands in the random.txt file is ran one by one.
 */
function runCmds(input, value){
    switch(input) {

        case "concert-this":
            if (!value) return console.log("You need to specify a band!");
            else {
                concertThis(value);
            }
        break;

        case "spotify-this-song":
            //if no args => default to 'The Sign'
            spotifyThis(value)
        break;

        case "movie-this": 
            //if no args => default to "Mr.Nobody"
            movieThis(value)
        break;

        case "do-what-it-says":
            dwis();
        break;

        default: console.log("Could not understand the action.");
        break;
    }
}

/*
     Beginning of work below
 */


var lookForBand = 'Search an artist/band on bandsintown to see venues.';
var lookForSong = 'Look for a song on spotify to see info for song/album/artists.';
var lookForMovie = 'Look for a movie on omdb to see a detailed description. ';

console.clear(); //Clears console for better readability

inquirer
  .prompt([
    {
      type: 'list',
      name: 'command',
      message: 'What do you want to do?',
      choices: [
        lookForBand,
        lookForSong,
        lookForMovie,
        new inquirer.Separator(),
        'Read from random.txt to choose for you.',
      ]
    }
  ])
  .then(answers => {
    // console.log(JSON.stringify(answers, null, '  '));
    if (answers.command !== 'Read from random.txt to choose for you.') {
        var questions = [
            {
                type: 'input',
                name: 'search',
                message: "What would you like to search?"
            }
        ];
        
        inquirer.prompt(questions).then(answers2 => {
            console.clear(); //Clears console for better readability
            // console.log(JSON.stringify(answers2, null, '  '));
            switch(answers.command) {
                case lookForBand:
                    if (!answers2.search) return console.log("You did not reply with anything!");
                    concertThis(answers2.search);                
                break;

                case lookForSong:
                    spotifyThis(answers2.search);                
                break;

                case lookForMovie:
                    movieThis(answers2.search);
                break;
                
                default: console.log("Could not understand the action.");
                break;
            }
        });
    }
    else {
        dwis()
    }
  });

  