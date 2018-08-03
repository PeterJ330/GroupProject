
var nutrientName = "";
var nutrientId = "";
var foodItemDiv;
var holderDiv;

function nutrientList() {
    var apiKey = "1iNPqKJmqxowTKpXfBBAk5BjERMSngYAtDlJxPrb";
    var queryURL = "https://api.nal.usda.gov/ndb/list?format=json&lt=n&sort=n&max=200&api_key=" + apiKey;


    var nutrientArray = [];
    var idArray = [];

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(queryURL);
        console.log(response);
        var nutrientLog = response.list.item;

        for (var i = 0; i < 196; i++) {
            nutrientName = nutrientLog[i].name;
            nutrientArray.push(nutrientName);
            nutrientId = nutrientLog[i].id;
            idArray.push(nutrientId);

            var nutrientDiv = $("<div id=nutrients class=dropdown-item active>");
            nutrientDiv.append(nutrientArray[i]);
            nutrientDiv.attr("data-id", idArray[i]);
            $(".dropdown-menu").append(nutrientDiv);

        };
        console.log(nutrientArray);
    })
    console.log("foodList function has run");
}; // closes foodList function

function nutrientSearch() {
    $("#nutrientReport").empty();
    var nutrient = $(this).attr("data-id");
    var apiKey = "1iNPqKJmqxowTKpXfBBAk5BjERMSngYAtDlJxPrb";
    var queryURL = "http://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=" + apiKey + "&max=1500&nutrients=" + nutrient ;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log("nutrientSearch()");
        console.log(queryURL);
        console.log(response);

        var food = response.report.foods;

        for (var i = 0; i < 1500; i++) {
            foodItemDiv = $("<div>");
            holderDiv   = $("<div>");
            
            var foodItem = food[i].name;
            foodItemDiv.append(foodItem);
            holderDiv.append(foodItemDiv);
            $("#nutrientReport").append(holderDiv);

        }

    })
}; // Closes nutrientSearch function




$(document).on('click', "#nutrients" ,nutrientSearch);

nutrientList();
