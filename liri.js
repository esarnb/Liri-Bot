require("dotenv").config();

/*
    Packages
*/
var axios = require("axios");

/*
    Global Variables
*/

var keys = require("./keys.js")
var spotify = new Spotify(keys.spotify)

/*
    Functions
*/

function convertProcess(unedited) { 
    var args = unedited.slice(2); 
    if (!args.length) return console.log("Not enough arguments! Put a number"); 
    for (var i = 0; i < args.length; i++) { 
        if (!isNaN(args[i])) { 
            args[i] = parseFloat(args[i]); 
            /*console.log(args[i])*/ 
        }
    }; 
    return args; 
}

function concertThis() {

}

function spotifyThis() {

}

function movieThis() {

}

function dwis() {

}

var args = convertProcess(process.argv);
if (!args) return console.log("You need to specify an action!");



switch(args[0]) {
    case "concert-this":
        concertThis()
    break;

    case "spotify-this-song":
        spotifyThis()
    break;

    case "movie-this": 
        movieThis()
    break;

    case "do-what-it-says":
        dwis()
    break;

    default: console.log("Could not understand the action.");
    
}