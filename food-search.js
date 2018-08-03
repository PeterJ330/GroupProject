
var foodInitial;
var food;
var newDiv;
var foodDiv;
var foodNum;
var n = "ndbno=";
var foodSearch = "";
var brandSearch = "";
var nutrientTypeDiv;
var name;
var measure;
var unit;
var id;
var dailyNutrition = {
    foodName: "",
    protein: "",
    totalFat: "",
    carbs: "",
    sugar: "",
}

$("#add").hide();
$("#save").hide();

//Function returns items and adds "data-number" attribute equal to their ndbno (database number)
function foodItemInfo() {
    var search = foodSearch;
    var limit = 15;
    var sort = {
        name: "n",
        relevance: "r",
    };

    var sr = 'Standard+Reference';
    var bp = 'Branded+Food+Products';
    var apiKey = "1iNPqKJmqxowTKpXfBBAk5BjERMSngYAtDlJxPrb";
    var queryURL = "https://api.nal.usda.gov/ndb/search/?format=json&q=" + search + "&sort=" + sort.relevance + "&max=" + limit + "&offset=0&ds=" + sr + "&&api_key=" + apiKey;
    var ndbnoArray = [];

    console.log("foodSearch: " + foodSearch);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(queryURL);
        console.log(response);

        for (var i = 0; i < limit; i++) {
            newDiv = $("<div class=foodList>");
            foodDiv = $("<div id=foodItem>");
            foodNum = $("<div id=foodInfo>")
            foodData = response.list.item[i].name;
            food = foodData.replace(/ *\([^)]*\) */g, " ");
            ndbno = response.list.item[i].ndbno;
            ndbnoArray.push(n + ndbno);
            foodDiv.attr("data-number", response.list.item[i].ndbno);
            foodDiv.attr("data-name", food);
            foodDiv.append(foodNum);
            foodDiv.append("* " + food);
            newDiv.append(foodDiv);
            $("#foodReport").append(newDiv);
        }
        console.log(ndbnoArray);
    });
    console.log("foodItem function has run");
} //closes foodItemInfo function

//========================================================================================================================

function brandedFood() {
    var search = brandSearch;
    var limit = 15;
    var sort = {
        name: "n",
        relevance: "r",
    };

    var sr = 'Standard+Reference';
    var bp = 'Branded+Food+Products';
    var apiKey = "1iNPqKJmqxowTKpXfBBAk5BjERMSngYAtDlJxPrb";
    var queryURL = "https://api.nal.usda.gov/ndb/search/?format=json&q=" + search + "&sort=" + sort.relevance + "&max=" + limit + "&offset=0&ds=" + bp + "&&api_key=" + apiKey;
    var ndbnoArray = [];
    console.log("brandSearch: " + brandSearch);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(queryURL);
        console.log(response);

        for (var i = 0; i < limit; i++) {
            newDiv = $("<div class=foodList>");
            foodDiv = $("<div id=foodItem>");
            foodNum = $("<div id=foodInfo>")
            foodData = response.list.item[i].name;
            if (foodData.includes(' UPC: ')) {
                var foodLength = foodData.length;
                console.log("Length: " + foodLength);
                var erase = foodData.indexOf(', UPC:');
                console.log("Erase: " + erase);
                var remove = foodLength - erase;
                console.log("Remove: " + remove);
                food = foodData.substring(0, erase);
            } else if (foodData.includes('GTIN:')) {
                var foodLength = foodData.length;
                console.log("Length: " + foodLength);
                var erase = foodData.indexOf(', GTIN:');
                console.log("Erase: " + erase);
                var remove = foodLength - erase;
                console.log("Remove: " + remove);
                food = foodData.substring(0, erase);
            }
            ndbno = response.list.item[i].ndbno;
            ndbnoArray.push(n + ndbno);
            foodDiv.attr("data-number", response.list.item[i].ndbno);
            foodDiv.attr("data-name", food);
            foodDiv.append(foodNum);
            foodDiv.append("* " + food);
            newDiv.append(foodDiv);
            $("#foodReport").append(newDiv);
        }
        console.log(ndbnoArray);
    });
    console.log("brandedFood function has run");
} //closes brandedFood function

//========================================================================================================================

function nutritionReport() {
    var ndbno = n + $(this).attr("data-number");
    var foodName = $(this).attr("data-name");
    var apiKey = "1iNPqKJmqxowTKpXfBBAk5BjERMSngYAtDlJxPrb";
    var queryURL = "https://api.nal.usda.gov/ndb/V2/reports?" + ndbno + "&type=b&format=json&api_key=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(queryURL);
        console.log(response);
        var nutrientArray = response.foods[0].food.nutrients
        console.log(nutrientArray);
        $("#nutrientReport").empty();
        for (i = 0; i < nutrientArray.length; i++) {
            nutrientTypeDiv = $("<div class=nutrientType>");
            id = nutrientArray[i].nutrient_id;
            name = nutrientArray[i].name;
            unit = nutrientArray[i].unit;
            measure = nutrientArray[i].measures[0].value;

            if (id == 203 || id == 204 || id == 205 || id == 269) {
                nutrientTypeDiv.append(name + " - " + measure + unit + " per 100 grams");

                if (name == "Sugars, total") {
                    nutrientTypeDiv.attr("data-sugar", measure + unit);
                    dailyNutrition.sugar = measure + unit;
                } else if (name == "Carbohydrate, by difference") {
                    nutrientTypeDiv.attr("data-carb", measure + unit);
                    dailyNutrition.carbs = measure + unit;
                } else if (name == "Total lipid (fat)") {
                    nutrientTypeDiv.attr("data-fat", measure + unit);
                    dailyNutrition.totalFat = measure + unit;
                } else if (name == 'Protein') {
                    nutrientTypeDiv.attr("data-protein", measure + unit);
                    dailyNutrition.protein = measure + unit;
                }

                $("#nutrientReport").append(nutrientTypeDiv);

                console.log(id + " " + name);
            };
        }
    })
    $("#foodName").text(foodName);
    console.log("foodReport function has run");
    console.log(ndbno);
    $("#add").show();
    $("#save").show();
}; //closes nutritionReport function

//========================================================================================================================

$("#food").on('click', function (event) {
    event.preventDefault();
    var foodItem = $("#foodInput").val().trim().toLowerCase();
    if (foodItem.includes('and')) {
        var and = /and /g;
        var newString = foodItem.replace(and, "");
        var space = / /g;
        foodSearch = newString.replace(space, "+");
    } else {
        var space = / /g;
        foodSearch = foodItem.replace(space, "+");
    }
    $("#foodInput").val("");
    $("#foodReport").empty();
    $("#foodName").empty();
    $("#nutrientReport").empty();
    $("#add").hide();
    $("#save").hide();
    foodItemInfo();
})

//========================================================================================================================

$("#brand").on('click', function (event) {
    event.preventDefault();
    var searchItem = $("#brandInput").val().trim().toLowerCase();
    if (searchItem.includes('and')) {
        var and = /and /g;
        var newString = searchItem.replace(and, "");
        var space = / /g;
        brandSearch = newString.replace(space, "+");
    } else {
        var space = / /g;
        brandSearch = searchItem.replace(space, "+");
    }
    $("#brandInput").val("");
    $("#foodReport").empty();
    $("#foodName").empty();
    $("#nutrientReport").empty();
    $("#add").hide();
    $("#save").hide();
    brandedFood();

})

//========================================================================================================================

$(document).on("click", "#foodItem", nutritionReport);

//========================================================================================================================

$("#add").on('click', function () {
    dailyNutrition.foodName = foodName.innerHTML;
    console.log(dailyNutrition);
});


