//ajax call of the youtube channel 
var muscleGroup = ['shoulder', 'Bicep', 'Tricep', 'Forearms', 'Abs', 'Back', 'Chest', 'Cavs', 'Hamstrings', 'Quadriceps', 'Trapezius',]
var player;
function onYouTubeIframeAPIReady(idOfVideo) {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: `${idOfVideo}`,

    });
}
function displayMovieInfo() {

    var movie = $(this).attr("data-name");
    var URL =
        'https://www.googleapis.com/youtube/v3/search?key=AIzaSyCAWTgwekE8oAGTZP2mxpGnho9lCz-zUs0&channelId=UC97k3hlbE-1rVN8y56zyEEA&part=snippet,id&order=date&maxResults=20';

    $.ajax({
        url: URL,
        method: "GET",
    }).then(function (response) {

        console.log(response.items[0].snippet.thumbnails.default.url);

        console.log(response);

        // Creating a div to hold the movie
        var movieDiv = $("<div class='movie-view'>");

        // Retrieving the URL for the image
        var imgURL = response.items[0].snippet.thumbnails.default.url;

        for (var i = 0; i < response.items.length; i++) {
            var videoTitle = response.items[i].snippet.title.toLowerCase();
            var userInput = 'chest';
            // console.log(videoTitle)
            if (videoTitle.indexOf(userInput) > -1) {
                console.log(videoTitle)
            }
        }
        var vidID = response.items[0].id.videoId
        console.log(vidID);
        player.loadVideoById(vidID);
        // Creating an element to hold the image
        var image = $("<img>").attr("src", imgURL);

        // Appending the image
        movieDiv.append(image);

        // Putting the entire movie above the previous movies
        $("#movies-view").prepend(movieDiv);


    });

};

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);




// Function for displaying movie data
function renderButtons(userInput) {



    // Deleting the movies prior to adding new movies
    // (this is necessary otherwise you will have repeat buttons)
    $("#buttons-view").empty();

    // Looping through the array of movies
    for (var i = 0; i < muscleGroup.length; i++) {

        // Then dynamicaly generating buttons for each movie in the array
        // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
        var a = $("<button>");
        // Adding a class of movie-btn to our button
        a.addClass("movie-btn");
        // Adding a data-attribute
        a.attr("data-name", muscleGroup[i]);
        // Providing the initial button text
        a.text(muscleGroup[i]);
        // Adding the button to the buttons-view div
        $("#buttons-view").append(a);
    }
}
// This function handles events where a movie button is clicked
$("#add-movie").on("click", function (event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    var muscleGroup = $("#movie-input").val().trim();

    // Adding movie from the textbox to our array
    movies.push(muscleGroup);

    // Calling renderButtons which handles the processing of our movie array
    renderButtons();
});

// Adding a click event listener to all elements with a class of "movie-btn"
$(document).on("click", ".movie-btn", displayMovieInfo);

// Calling the renderButtons function to display the intial buttons
renderButtons();