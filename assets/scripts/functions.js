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
		newCard.append(cals, prot, fat, carbs);

		$('.results-text').text('Venture forth, log your nutrition/workouts and have fun!');
		$('.card-container').append(newCard);
		
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