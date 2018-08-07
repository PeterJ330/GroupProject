function escapeHTML(string) {
	var HTMLentities = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
		'/': '&#x2F;',
		'`': '&#x60;',
		'=': '&#x3D;'
	};
  return String(string).replace(/[&<>"'`=\/]/g, function (entity) {
    return HTMLentities[entity];
  });
  
}

function displayErrors(input, errorMsg) {
	$('#errors-display').empty();
	var errorsDiv = $('<h3>');
	errorsDiv.text('Please fix the following error:');
	errorsDiv.addClass('errors-container');
	var error = $('<p>');
	error.html('&middot; ' + errorMsg);
	error.addClass('errors');
	
	errorsDiv.append(error);
	$('#errors-display').append(errorsDiv);
	$('#errors-display').removeClass('js-hidden');
	
	$('#' + input + '-icon').removeClass('js-hidden');
	var inputs = document.getElementsByTagName('input');
	for(var i = 0; i < inputs.length; i++) {
		$('input').removeClass('error');
	}
	if(input == 'password') {
		$('#password-icon').text('!').addClass('error-icon');
	}
}

function signUp() {
	
	var email = $('#email').val().trim();
	var password = $('#password').val().trim();
	var passwordConfirm = $('#password-confirm').val().trim();
	username = $('#username').val().trim();
	var errors = false;
	
	$('#username-icon').addClass('js-hidden');
	$('#email-icon').addClass('js-hidden');
	$('#password-icon').text('?').removeClass('error-icon');
	$('#confirm-icon').addClass('js-hidden');

	//	email/password validatoins should go here
	//	Password Requirements (in order as they appear in the regex below):
	//	At least 1 capital letter
	//	At least 1 lowercase letter
	//	No whitespaces
	//	At least 1 digit
	//	At least 1 special non-alphanumeric character
	//	Minimum length 6 characters; Maximum length 15 characters
/*
	if(/(?=.*[A-Z])(?=.*[a-z])(?=^\S*$)(?=.*\d)(?=.*[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\\\|\;\:\'\"\,\.\<\>\/\?])(^.{6,15}$)/.test(password)) {
		//	Password meets all validations
		alert('Password True');
		return;
	} else {
		alert('Password False');
		return;
	}
*/
	if(username == '') {
		displayErrors ('username', 'Username required');
		errors = true;
		$('#username').focus().addClass('error');
	} else if(!/^[A-Za-z0-9_-]*$/.test(username)) {
		displayErrors ('username', 'Username can only contain letters, numbers, dashes and underscores');
		errors = true;
		$('#username').focus().addClass('error');
	} else if(!/(^.{4,25}$)/.test(username)) {
		displayErrors ('username', 'Username must be between 4 and 25 characters long');
		errors = true;
		$('#username').focus().addClass('error');
	} else

	if(email == '') {
		displayErrors ('email', 'Email is required');
		errors = true;
		$('#email').focus().addClass('error');
	} else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
		displayErrors ('email', 'Email address is not valid');
		errors = true;
		$('#email').focus().addClass('error');
	} else
	
	if(password == '') {
		displayErrors ('password', 'Password is required');
		errors = true;
		$('#password').focus().addClass('error');
	} else if(!/(?=.*[A-Z])/.test(password)) {
		displayErrors('password', 'Password requires a capital letter');
		errors = true;
		$('#password').focus().addClass('error');
	} else if(!/(?=.*[a-z])/.test(password)) {
		displayErrors('password', 'Password requires a lowercase letter');
		errors = true;
		$('#password').focus().addClass('error');
	} else if(!/(?=^\S*$)/.test(password)) {
		displayErrors('password', 'Password cannot contain any white spaces');
		errors = true;
		$('#password').focus().addClass('error');
	} else if (!/(?=.*\d)/.test(password)) {
		displayErrors('password', 'Password requires a number');
		errors = true;
		$('#password').focus().addClass('error');
	} else if(!/(?=.*[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\\\|\;\:\'\"\,\.\<\>\/\?])/.test(password)) {
		displayErrors('password', 'Password requires a non-alphanumeric character');
		errors = true;
		$('#password').focus().addClass('error');
	} else if(!/(^.{6,15}$)/.test(password)) {
		displayErrors('password', 'Password must be between 6 and 15 characters');
		errors = true;
		$('#password').focus().addClass('error');
	} else 
	
	if(passwordConfirm == '') {
		displayErrors ('confirm', 'Please confirm password');
		errors = true;
		$('#password-confirm').focus().addClass('error');
	} else if(password != passwordConfirm) {
		displayErrors('confirm', 'Passwords do not match');
		errors = true;
		$('#password-confirm').focus().addClass('error');
	}
	
	if(!errors) {
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here
			var errorCode = error.code;
			var errorMessage = error.message;
	
			if(errorCode == 'auth/weak-password') {
				displayErrors('password', 'The password is too weak.');
			} else {
				displayErrors('email', errorMessage);
			}
			console.log(error);
		});
	}
}

function sendEmailVerification() {
	firebase.auth().currentUser.sendEmailVerification().then(function() {
		console.log('Email verification sent');
	});
}

function signIn() {
	var errors = false;
	
	$('#email-icon').addClass('js-hidden');
	$('#password-icon').addClass('js-hidden');
	
	if(firebase.auth().currentUser) {
		//	If user is signed in, sign them out
		firebase.auth().signOut();
	} else {
		var email = $('#email').val().trim();
		var password = $('#password').val().trim();
		
		if(email == '') {
			displayErrors ('email', 'Email required');
			$('#email').focus().addClass('error');
			errors = true;
		} else if(password == '') {
			displayErrors ('password', 'Password required');
			$('#password').focus().addClass('error');
			errors = true;
		}
	
		if(!errors) {
			firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
				//	Handle errors here
				var errorCode = error.code;
				var errorMessage = error.message;
					
				if(errorCode === 'auth/wrong-password') {
					displayErrors('password', 'Incorrect password');
					$('#password').focus().addClass('error');
				} else {
					displayErrors('email', errorMessage);
					$('#email').focus().addClass('error');
				}
				console.log(error);
			});
		}
			
	}
}

function logOut() {
	
	if(firebase.auth().currentUser) {
		//	If user is signed in, sign them out
		firebase.auth().signOut();
	}
}

function resetPassword() {
	var errors = false;
	
	var email = $('#email').val().trim();
	
	$('#email-icon').addClass('js-hidden');
	
	if(email == '') {
		displayErrors('email', 'Email required');
		$('#email').focus().addClass('error');
		errors = true;
	}
	
	if(!errors) {
		firebase.auth().sendPasswordResetEmail(email).then(function() {
			alert('Password has been reset. Follow the instructions in the email sent to your inbox to change your password and login.');
			window.location.href='login.html';
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			if(errorCode == 'auth/invalid-email') {
				displayErrors('email', errorMessage);
				$('#email').focus().addClass('error');
			} else if(errorCode == 'auth/user-not-found') {
				displayErrors('email', errorMessage);
				$('#email').focus().addClass('error');
			}
			console.log(error);
		});
	}
}

function calculateDailyNutrition(uid, goal) {
	
	//	Capture Inputs
	var weight = $('#weight-input').val();
	var height = $('#height-input').val();
	var activity = $('#activity-input').val();
	var age = $('#age-input').val();
	var gender = $('#gender-input').val();
//	var goal = $('#goal-input').val();
	var calMaintLevel = 0;
	
	//	ToDO:	Validations
				
	var kg = weight/2.2046226218;
	var cm = height*2.54;
	
/*
			Mifflin - St Jeor Formula
Men
10 x weight (kg) + 6.25 x height (cm) – 5 x age (y) + 5

Women
10 x weight (kg) + 6.25 x height (cm) – 5 x age (y) – 161.

*/

	//	Avg cal burned per 45 min workout (per Harvard Study)
	var avgCalBurnedPerWkOut = 0.72 * weight * 1.5;
	//	Convert to average daily calories burned based on activity level
	var avgCalBurnedPerWeek = avgCalBurnedPerWkOut * activity;
	var avgCalBurnedPerDay = avgCalBurnedPerWeek / 7;
	
	//	Estimated Base Metabolic Rate (BMR) (calculated using the above Mifflin - St Jeor Formula)
	if(gender === 'male') {
		calMaintLevel = Math.round(10*kg+6.25*cm-5*age+5);
	} else if(gender === 'female') {
		calMaintLevel = Math.round(10*kg+6.25*cm-5*age-161);
	}
	//	Adjust BMR by miscelaneous calories burned per day (digestion, typical movement, etc)
	calMaintLevel = calMaintLevel * 1.2;
	
	//	Adjust Daily Calories by activity level
	calMaintLevel = calMaintLevel + avgCalBurnedPerDay;
	
	//	Adjust Daily Calories by goal (Gain Muscle)
	if(goal == 'gain' && gender == 'male') {
		calMaintLevel += 250;
	} else if(goal == 'gain' && gender == 'female') {
		calMaintLevel += 125;
	}
	
	//	Protein Calculations (0.9g per pound; max 215 for men and 170 for women)
	var dailyProteinGrams = 0.9 * weight;
	if(dailyProteinGrams > 215 && gender == 'male') {
		dailyProteinGrams = 215;
	} else if (dailyProteinGrams > 170 && gender == 'female') {
		dailyProteinGrams = 170;
	}
	var dailyProteinCal = dailyProteinGrams * 4;
	dailyProteinCal = Math.round(dailyProteinCal);
	dailyProteinGrams = Math.round(dailyProteinGrams);
	
	//	 Intensity Calculations (base for Maintain Weight/Gain Muscle)
	var baseNutrition = calculateNutritionIntensity(1, calMaintLevel, dailyProteinCal);
	for(var i = 0; i < baseNutrition.length; i++) {
		baseNutrition[i] = Math.round(baseNutrition[i]);
	}
	var lightNutrition = calculateNutritionIntensity(0.85, calMaintLevel, dailyProteinCal);
	for(var i = 0; i < lightNutrition.length; i++) {
		lightNutrition[i] = Math.round(lightNutrition[i]);
	}
	var moderateNutrition = calculateNutritionIntensity(0.8, calMaintLevel, dailyProteinCal);
	for(var i = 0; i < moderateNutrition.length; i++) {
		moderateNutrition[i] = Math.round(moderateNutrition[i]);
	}
	var intenseNutrition = calculateNutritionIntensity(0.75, calMaintLevel, dailyProteinCal);
	for(var i = 0; i < intenseNutrition.length; i++) {
		intenseNutrition[i] = Math.round(intenseNutrition[i]);
	}	
	
	//	Update DB
	db.ref('users/' + uid + '/userInfo/').update({
		weightLB: weight,
		weightKG: kg,
		heightIN: height,
		heightCM: cm,
		activityLevel: activity,
		age: age,
		gender: gender,
		goal: goal
	});
	
	//	Display Results
	$('#calculator').addClass('js-hidden');
	
	if(goal == 'lose') {
		$('#lt-cal-display').text(lightNutrition[0]);
		$('#lt-prot-display').text(dailyProteinGrams);
		$('#lt-fat-display').text(lightNutrition[2]);
		$('#lt-carbs-display').text(lightNutrition[7]);
		$('#light').attr({
			'data-cal': lightNutrition[0],
			'data-protCal': dailyProteinCal,
			'data-protGrams': dailyProteinGrams,
			'data-fatCal': lightNutrition[1],
			'data-fatGrams': lightNutrition[2],
			'data-satFat': lightNutrition[3],
			'data-mono': lightNutrition[4],
			'data-poly': lightNutrition[5],
			'data-carbsCal': lightNutrition[6],
			'data-carbsGrams': lightNutrition[7],
			'data-fiber': lightNutrition[8]
		});
		$('#mod-cal-display').text(moderateNutrition[0]);
		$('#mod-prot-display').text(dailyProteinGrams);
		$('#mod-fat-display').text(moderateNutrition[2]);
		$('#mod-carbs-display').text(moderateNutrition[7]);
		$('#moderate').attr({
			'data-cal': moderateNutrition[0],
			'data-protCal': dailyProteinCal,
			'data-protGrams': dailyProteinGrams,
			'data-fatCal': moderateNutrition[1],
			'data-fatGrams': moderateNutrition[2],
			'data-satFat': moderateNutrition[3],
			'data-mono': moderateNutrition[4],
			'data-poly': moderateNutrition[5],
			'data-carbsCal': moderateNutrition[6],
			'data-carbsGrams': moderateNutrition[7],
			'data-fiber': moderateNutrition[8]
		});
		$('#int-cal-display').text(intenseNutrition[0]);
		$('#int-prot-display').text(dailyProteinGrams);
		$('#int-fat-display').text(intenseNutrition[2]);
		$('#int-carbs-display').text(intenseNutrition[7]);
		$('#intense').attr({
			'data-cal': intenseNutrition[0],
			'data-protCal': dailyProteinCal,
			'data-protGrams': dailyProteinGrams,
			'data-fatCal': intenseNutrition[1],
			'data-fatGrams': intenseNutrition[2],
			'data-satFat': intenseNutrition[3],
			'data-mono': intenseNutrition[4],
			'data-poly': intenseNutrition[5],
			'data-carbsCal': intenseNutrition[6],
			'data-carbsGrams': intenseNutrition[7],
			'data-fiber': intenseNutrition[8]
		});
	} else {
		$('.card-container').empty();
		$('.results-header').text('You\'re ready to start your Journey!');
		var newCard = $('<div>').addClass('results-card');
		var cals = $('<h3>').text(baseNutrition[0] + ' cals');
		var prot = $('<p>').text(dailyProteinGrams + 'g prot');
		var fat = $('<p>').text(baseNutrition[2] + 'g fat');
		var carbs = $('<p>').text(baseNutrition[7] + 'g carbs');
		
		var newButton = $('<div>').addClass('button');
		newButton.attr('id', 'go-home').text('I\'m ready!');
		var buttonContainer = $('<div>').addClass('button-container');
		
		buttonContainer.append(newButton);
		newCard.append(cals, prot, fat, carbs);

		$('.results-text').text('Venture forth, log your nutrition/workouts and have fun!');
		$('.card-container').append(newCard);
		$('#results').append(buttonContainer);
		
		db.ref('users/' + uid + '/nutritionInfo/').update({
			calories: baseNutrition[0],
			proteinCal: dailyProteinCal,
			proteinGrams: dailyProteinGrams,
			fatCal: baseNutrition[1],
			fatGrams: baseNutrition[2],
			saturatedFat: baseNutrition[3],
			monoUnsaturatedFat: baseNutrition[4],
			polyUnsaturatedFat: baseNutrition[5],
			carbsCal: baseNutrition[6],
			carbsGrams: baseNutrition[7],
			fiber: baseNutrition[8]
		});
	}
	
	$('#results').removeClass('js-hidden');
}

function calculateNutritionIntensity(intensityLvl, baseCals, dailyProtCal) {
	var dailyNutrition = [];
	
	var dailyCalories = baseCals * intensityLvl;
		
	var dailyFatCal = 0.25 * dailyCalories;
	var dailyFatGrams = dailyFatCal / 9;
	var dailyCarbsCal = dailyCalories - dailyProtCal - dailyFatCal;
	var dailyCarbsGrams = dailyCarbsCal / 4;
	
	var dailySaturatedFat = Math.round(dailyFatGrams / 3);
	var remainingFat = dailyFatGrams - dailySaturatedFat;
	var dailyMonoUnsatFat = remainingFat * 8/9;
	var dailyPolyUnsatFat = remainingFat - dailyMonoUnsatFat;
	var dailyFiber = 15 * dailyCalories/1000;
	
	dailyNutrition.push(dailyCalories, dailyFatCal, dailyFatGrams, dailySaturatedFat, dailyMonoUnsatFat, dailyPolyUnsatFat, dailyCarbsCal, dailyCarbsGrams, dailyFiber);
	
	return dailyNutrition;
}

function progressDisplays() {
	
}

function tutorial() {
	$('#tutorial').empty();
	
	console.log('tutorial function');
	
	var container = $('<div>');
	container.attr('id', 'tutorial-container').addClass('content-container');
			
	var header = $('<h2>');
	header.text('What is the primary goal of your Journey?');
	var loseButton = $('<div>');
	loseButton.addClass('card goal-card');
	loseButton.attr('id', 'lose');
	loseButton.text('LOSE FAT');
	var maintainButton = $('<div>');
	maintainButton.addClass('card goal-card');
	maintainButton.attr('id', 'maintain');
	maintainButton.text('MAINTAIN WEIGHT');
	var gainButton = $('<div>');
	gainButton.addClass('card goal-card');
	gainButton.attr('id', 'gain');
	gainButton.text('GAIN MUSCLE');
	var buttonContainer = $('<div>').addClass('button-container');
	
	buttonContainer.append(loseButton, maintainButton, gainButton);
	container.append(header, buttonContainer);
	$('#tutorial').append(container);
					
	$('#tutorial').removeClass('js-hidden');
}

function changeMenu(menuName) {
	var dataMenus = document.getElementsByClassName('menu');
	console.log('data-menus length: ' + dataMenus.length);
	for(var i = 0; i < dataMenus.length; i++) {
		$('[data-menu="' + i + '"]').addClass('js-hidden');
	}
	$(menuName).removeClass('js-hidden');
}

function changeFoodMenu(menuName) {
	var dataMenus = document.getElementsByClassName('food-menu');
	console.log('data-menus length: ' + dataMenus.length);
	for(var i = 0; i < dataMenus.length; i++) {
		$('[data-food-menu="' + i + '"]').addClass('js-hidden');
	}
	$('#errors-display').empty();
	$(menuName).removeClass('js-hidden');
}

function searchFood(search, includeBrands) {
	console.log('Search: ' + search);
	var limit = 10;
    var sort = {
        name: "n",
        relevance: "r",
    };

    var sr = 'Standard+Reference';
    var bp = 'Branded+Food+Products';
    var reference;
    if(includeBrands) {
	    reference = '';
    } else {
	    reference = '&ds=' + sr;
    }
    var apiKey = "1iNPqKJmqxowTKpXfBBAk5BjERMSngYAtDlJxPrb";
    var queryURL = "https://api.nal.usda.gov/ndb/search/?format=json&q=" + search + reference + "&sort=" + sort.relevance + "&max=" + limit + "&offset=0" + "&api_key=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(queryURL);
        console.log('searchFood Response: ' + response);
        
        $('#append-results').empty();

        for (var i = 0; i < parseInt(limit); i++) {
           /*
 newDiv = $("<div class=foodList>");
            foodDiv = $("<div id=foodItem>");
            foodNum = $("<div id=foodInfo>");
*/
            var foodName = response.list.item[i].name;
            var unprepared = /, UNPREPARED/g;
            foodName = foodName.replace(unprepared, "");
            if (foodName.includes(' UPC: ')) {
                var erase = foodName.indexOf(', UPC:');
                foodName = foodName.substring(0, erase);
            } else if (foodName.includes('GTIN:')) {
                var erase = foodName.indexOf(', GTIN:');
                foodName = foodName.substring(0, erase);
            }
            console.log("Food Name: " + foodName);
           /*
 foodDiv.attr("data-number", response.list.item[i].ndbno);
            foodDiv.attr("data-name", food);
*/
/*
            foodDiv.append(foodNum);
            foodDiv.append("* " + food);
            newDiv.append(foodDiv);
            $("#foodReport").append(newDiv);
*/

/*
			var container = $('<div>').addClass('food-result');
			container.attr('data-ndbno', response.list.item[i].ndbno);
			var foodSpan = $('<span>').html('<b>&middot; Food</b>: ' + foodName);
			var cal = $('<span>').html(' <span id="search-display-cal-' + i + '"> </span> calories');
			var prot = $('<span>').html(' <span id="search-display-prot-' + i + '"> </span> g protein');
			var fat = $('<span>').html(' <span id="search-display-fat-' + i + '"> </span> g fat');
			var carbs = $('<span>').html(' <span id="search-display-carbs-' + i + '"> </span> g carbs');
			
			container.append(foodSpan, cal, prot, fat, carbs);
*/
			
			var row = $('<tr>');
			row.attr({
				'class': 'confirm-food',
				'data-ndbno': response.list.item[i].ndbno
			});
			var th = $('<th>').attr({'scope': 'row'}).text(foodName);
			var calTD = $('<td>').attr({'id': 'search-display-cal-' + i});
			var protTD = $('<td>').attr({'id': 'search-display-prot-' + i});
			var fatTD = $('<td>').attr({'id': 'search-display-fat-' + i});
			var carbsTD = $('<td>').attr({'id': 'search-display-carbs-' + i});
			
			row.append(th, calTD, protTD, fatTD, carbsTD);
			
			$('#append-results').append(row);
			
							/*
								<tr>
									<th scope="row">Apple</th>
									<td>80</td>
									<td>1g</td>
									<td>0g</td>
									<td>19g</td>
								</tr>
							*/
			
			getNutrition(response.list.item[i].ndbno, i);
// 			food.name = foodName;
// 			console.log('Food Object: ' + JSON.stringify(food));

        }
    });
}

function getNutrition(ndbno, index) {
    var apiKey = "1iNPqKJmqxowTKpXfBBAk5BjERMSngYAtDlJxPrb";
    var queryURL = "https://api.nal.usda.gov/ndb/V2/reports?ndbno=" + ndbno + "&type=b&format=json&api_key=" + apiKey;
    
    var food = {
	    name: '',
        calories: 0,
        calMeasures: null,
        protein: 0,
        protMeasures: null,
        fat: 0,
        fatMeasures: null,
        carbs: 0,
        carbsMeasures: null
    };
        
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log('getNutrition URL: ' + queryURL);
        console.log(response);
        var nutrientArray = response.foods[0].food.nutrients;
        
//         $("#nutrientReport").empty();

        for (var i = 0; i < nutrientArray.length; i++) {
//             nutrientTypeDiv = $("<div class=nutrientType>");
            var id = nutrientArray[i].nutrient_id;
           /*
 name = nutrientArray[i].name;
            unit = nutrientArray[i].unit;
*/
//             measure = nutrientArray[i].measures[0].value;

/*
            if (id == 203 || id == 204 || id == 205 || id == 269) {
                // nutrientTypeDiv.append(name + " - " + measure + unit + " per 100 grams");
                if (name == "Sugars, total") {
                    nutrientTypeDiv.attr("data-sugar", measure + unit);
                    dailyNutrition.sugar = measure + unit;
                    nutrientTypeDiv.append("Total Sugar" + " - " + measure + unit);
                } else if (name == "Carbohydrate, by difference") {
                    nutrientTypeDiv.attr("data-carb", measure + unit);
                    dailyNutrition.carbs = measure + unit;
                    nutrientTypeDiv.append("Carbohydrates" + " - " + measure + unit);
                } else if (name == "Total lipid (fat)") {
                    nutrientTypeDiv.attr("data-fat", measure + unit);
                    dailyNutrition.totalFat = measure + unit;
                    nutrientTypeDiv.append("Total Fat" + " - " + measure + unit);
                } else if (name == 'Protein') {
                    nutrientTypeDiv.attr("data-protein", measure + unit);
                    dailyNutrition.protein = measure + unit;
                    nutrientTypeDiv.append("Protein" + " - " + measure + unit);
                }
*/
/*
                $("#nutrientReport").append(nutrientTypeDiv);
                console.log(id + " " + name);
*/
//             }
			var measures = nutrientArray;
			if(id == 208) {
				food.calories = nutrientArray[i].value;
				food.calMeasures = nutrientArray[i].measures;
				console.log('cals: ' + food.calories);
			} else if(id == 203) {
				food.protein = nutrientArray[i].value;
				food.protMeasures = nutrientArray[i].measures;
			} else if(id == 204) {
				food.fat = nutrientArray[i].value;
				food.fatMeasures = nutrientArray[i].measures;
			} else if(id == 205) {
				food.carbs = nutrientArray[i].value;
				food.carbsMeasures = nutrientArray[i].measures;
			}
			
			$('#search-display-cal-' + index).text(food.calories);
	        $('#search-display-prot-' + index).text(food.protein + 'g');
	        $('#search-display-fat-' + index).text(food.fat + 'g');
	        $('#search-display-carbs-' + index).text(food.carbs + 'g');
        }
        
        console.log('food object from nutrition function: ' + JSON.stringify(food));
//		return food;
    });
   /*
 console.log('food object from nutrition function: ' + JSON.stringify(food));
    return food;
*/
/*
    $("#foodName").text(foodName);
    console.log("foodReport function has run");
    $("#add").show();
    $("#save").show();
*/
}

function confirmQuantity123(ndbno) {
    var apiKey = "1iNPqKJmqxowTKpXfBBAk5BjERMSngYAtDlJxPrb";
    var queryURL = "https://api.nal.usda.gov/ndb/V2/reports?ndbno=" + ndbno + "&type=b&format=json&api_key=" + apiKey;
    
    var food = {
	    name: '',
        calories: 0,
        calMeasures: null,
        protein: 0,
        protMeasures: null,
        fat: 0,
        fatMeasures: null,
        carbs: 0,
        carbsMeasures: null
    };
        
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log('getNutrition URL: ' + queryURL);
        
        var nutrientArray = response.foods[0].food.nutrients;
        
//         $("#nutrientReport").empty();

        for (var i = 0; i < nutrientArray.length; i++) {
//             nutrientTypeDiv = $("<div class=nutrientType>");
            var id = nutrientArray[i].nutrient_id;
           /*
 name = nutrientArray[i].name;
            unit = nutrientArray[i].unit;
*/
//             measure = nutrientArray[i].measures[0].value;

/*
            if (id == 203 || id == 204 || id == 205 || id == 269) {
                // nutrientTypeDiv.append(name + " - " + measure + unit + " per 100 grams");
                if (name == "Sugars, total") {
                    nutrientTypeDiv.attr("data-sugar", measure + unit);
                    dailyNutrition.sugar = measure + unit;
                    nutrientTypeDiv.append("Total Sugar" + " - " + measure + unit);
                } else if (name == "Carbohydrate, by difference") {
                    nutrientTypeDiv.attr("data-carb", measure + unit);
                    dailyNutrition.carbs = measure + unit;
                    nutrientTypeDiv.append("Carbohydrates" + " - " + measure + unit);
                } else if (name == "Total lipid (fat)") {
                    nutrientTypeDiv.attr("data-fat", measure + unit);
                    dailyNutrition.totalFat = measure + unit;
                    nutrientTypeDiv.append("Total Fat" + " - " + measure + unit);
                } else if (name == 'Protein') {
                    nutrientTypeDiv.attr("data-protein", measure + unit);
                    dailyNutrition.protein = measure + unit;
                    nutrientTypeDiv.append("Protein" + " - " + measure + unit);
                }
*/
/*
                $("#nutrientReport").append(nutrientTypeDiv);
                console.log(id + " " + name);
*/
//             }
			var measures = nutrientArray;
			if(id == 208) {
				food.calories = nutrientArray[i].value;
				food.calMeasures = nutrientArray[i].measures;
				console.log('cals: ' + food.calories);
			} else if(id == 203) {
				food.protein = nutrientArray[i].value;
				food.protMeasures = nutrientArray[i].measures;
			} else if(id == 204) {
				food.fat = nutrientArray[i].value;
				food.fatMeasures = nutrientArray[i].measures;
			} else if(id == 205) {
				food.carbs = nutrientArray[i].value;
				food.carbsMeasures = nutrientArray[i].measures;
			}
			
			console.log('Cal: ' + food.calories);
			console.log('Cal2: ' + nutrientArray[2].value);
			console.log('Measure: ' + food.calMeasures);
			console.log('Measures Length: ' + food.calMeasures.length);
			console.log('Label: ' + food.calMeasures[0].label);
			
/*
			for(var i = 0; i < food.calMeasures.length; i++) {
				
			}	
*/
			food.calMeasures.forEach(function(measurement, i) {
// 				console.log('Measurment: ' + measurement.label);
			});
        }
        
        console.log('food object from nutrition function: ' + JSON.stringify(food));
//		return food;
    });
   /*
 console.log('food object from nutrition function: ' + JSON.stringify(food));
    return food;
*/
/*
    $("#foodName").text(foodName);
    console.log("foodReport function has run");
    $("#add").show();
    $("#save").show();
*/
} // depricated

function displayQuantity(ndbno) {
    var apiKey = "1iNPqKJmqxowTKpXfBBAk5BjERMSngYAtDlJxPrb";
    var queryURL = "https://api.nal.usda.gov/ndb/V2/reports?ndbno=" + ndbno + "&type=b&format=json&api_key=" + apiKey;
            
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log('getNutrition URL: ' + queryURL);
        var nutrientArray = response.foods[0].food.nutrients;
        var calIndex;
        var protIndex;
        var fatIndex;
        var carbsIndex;
        
        $('#quantity-input').empty();
        
        for(var i = 0; i < nutrientArray.length; i++) {
	        if(nutrientArray[i].nutrient_id == 208) {
		        calIndex = i;
	        } else if(nutrientArray[i].nutrient_id == 203) {
		        protIndex = i;
	        } else if(nutrientArray[i].nutrient_id == 204) {
		        fatIndex = i;
	        } else if(nutrientArray[i].nutrient_id == 205) {
		        carbsIndex = i;
	        }
        }
        
        var calories = nutrientArray[calIndex];
        var protein = nutrientArray[protIndex];
        var fat = nutrientArray[fatIndex];
        var carbs = nutrientArray[carbsIndex];
        
        console.log(calories);
        console.log(protein);
        console.log(fat);
        console.log(carbs);
        
        console.log('Measurements: ' + calories.measures);
        
        var measurementsCount = 0;
        for(var i = 0; i < calories.measures.length; i++) {
	        var option = $('<option>').text(calories.measures[i].qty + ' ' + calories.measures[i].label);
	        option.attr({
		        'data-nutrient-index': i,
		        'data-nutrient-ndbno': ndbno,
		        'value': ndbno
		    });
	        $('#quantity-input').append(option);
        }
        
    });
}

function displayNutrients(ndbno, nutrientIndex, servings) {
	var apiKey = "1iNPqKJmqxowTKpXfBBAk5BjERMSngYAtDlJxPrb";
    var queryURL = "https://api.nal.usda.gov/ndb/V2/reports?ndbno=" + ndbno + "&type=b&format=json&api_key=" + apiKey;
            
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log('getNutrition URL: ' + queryURL);
        var nutrientArray = response.foods[0].food.nutrients;
        var calIndex;
        var protIndex;
        var fatIndex;
        var carbsIndex;
        
        for(var i = 0; i < nutrientArray.length; i++) {
	        if(nutrientArray[i].nutrient_id == 208) {
		        calIndex = i;
	        } else if(nutrientArray[i].nutrient_id == 203) {
		        protIndex = i;
	        } else if(nutrientArray[i].nutrient_id == 204) {
		        fatIndex = i;
	        } else if(nutrientArray[i].nutrient_id == 205) {
		        carbsIndex = i;
	        }
        }
        
        var calories = nutrientArray[calIndex];
        var protein = nutrientArray[protIndex];
        var fat = nutrientArray[fatIndex];
        var carbs = nutrientArray[carbsIndex];
        
        $('#cal-display').text(parseInt(calories.measures[nutrientIndex].value) * servings);
        $('#prot-display').text(parseInt(protein.measures[nutrientIndex].value) * servings);
        $('#fat-display').text(parseInt(fat.measures[nutrientIndex].value) * servings);
        $('#carbs-display').text(parseInt(carbs.measures[nutrientIndex].value) * servings);
    });
}

function logFood() {
	var food = $('#food-name').text();
	var calories = parseFloat($('#cal-display').text());
	var protein = parseFloat($('#prot-display').text());
	var fat = parseFloat($('#fat-display').text());
	var carbs = parseFloat($('#carbs-display').text());
	alert(food + '; ' + calories + '; ' + protein + '; ' + fat + '; ' + carbs);
}	//	depricated

function showRecent(uid) {
	
	$('#recent-results').empty();

	db.ref('users/' + uid + '/nutritionInfo/recentFood/').orderByChild('timestamp').limitToLast(10).on('child_added', function(snap) {

		console.log(snap.val());
		var newRow = $('<tr>').addClass('save-food'); //.text(snap.val().food);
		var foodTH = $('<th>').attr({'scope': 'row'}).text(snap.val().food);
		var calTD = $('<td>').text(snap.val().servingCalories);
		var protTD = $('<td>').text(snap.val().servingProtein);
		var fatTD = $('<td>').text(snap.val().servingFat);
		var carbsTD = $('<td>').text(snap.val().servingCarbs);

		newRow.append(foodTH, calTD, protTD, fatTD, carbsTD);
		$('#recent-results').append(newRow);

		db.ref('users/' + uid + '/nutritionInfo/recentFood/').off();
	});
				
}

function showFrequent(uid) {
	
	$('#frequent-results').empty();

	db.ref('users/' + uid + '/nutritionInfo/recentFood/').orderByChild('foodCount').limitToLast(10).on('child_added', function(snap) {
		console.log(snap.val());
		var newRow = $('<tr>').addClass('save-food'); //.text(snap.val().food);
		var foodTH = $('<th>').attr({'scope': 'row'}).text(snap.val().food);
		var calTD = $('<td>').text(snap.val().servingCalories);
		var protTD = $('<td>').text(snap.val().servingProtein);
		var fatTD = $('<td>').text(snap.val().servingFat);
		var carbsTD = $('<td>').text(snap.val().servingCarbs);

		newRow.append(foodTH, calTD, protTD, fatTD, carbsTD);
		$('#frequent-results').append(newRow);

		db.ref('users/' + uid + '/nutritionInfo/recentFood/').off();
	});
				
}

function showSaved(uid) {
	
	$('#saved-results').empty();

	db.ref('users/' + uid + '/nutritionInfo/recentFood/').orderByChild('saved').equalTo('true').on('child_added', function(snap) {
		console.log(snap.val());
		var newRow = $('<tr>').addClass('log-food'); //.text(snap.val().food);
		var foodTH = $('<th>').attr({'scope': 'row'}).text(snap.val().food);
		var calTD = $('<td>').text(snap.val().servingCalories);
		var protTD = $('<td>').text(snap.val().servingProtein);
		var fatTD = $('<td>').text(snap.val().servingFat);
		var carbsTD = $('<td>').text(snap.val().servingCarbs);

		newRow.append(foodTH, calTD, protTD, fatTD, carbsTD);
		$('#saved-results').append(newRow);

		db.ref('users/' + uid + '/nutritionInfo/recentFood/').off();
	});
				
}

function showdDailyNutrition(uid, day) {
	
	$('#daily-nutrition').empty();

	db.ref('users/' + uid + '/dailyLogs/' + day + '/nutrition/food').orderByChild('timestamp').on('child_added', function(snap) {
		console.log(snap.val());
		var newRow = $('<tr>').addClass('save-food'); //.text(snap.val().food);
		var foodTH = $('<th>').attr({'scope': 'row'}).text(snap.val().food);
		var calTD = $('<td>').text(snap.val().calories);
		var protTD = $('<td>').text(snap.val().protein);
		var fatTD = $('<td>').text(snap.val().fat);
		var carbsTD = $('<td>').text(snap.val().carbs);

		newRow.append(foodTH, calTD, protTD, fatTD, carbsTD);
		$('#daily-nutrition').append(newRow);

//		db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition/').off();
	});
				
}