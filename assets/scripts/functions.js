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

function displayErrors(errorMsg) {
	$('#errors-display').empty();
	var errorsDiv = $('<div>');
	errorsDiv.text('Please fix the following errors:');
	errorsDiv.addClass('errors-container');
	var error = $('<div>');
	error.text(errorMsg);
	error.addClass('errors');
	
	$('#errors-display').append(error);
	$('#errors-display').removeClass('js-hidden');
}

function signUp() {
	
	var email = $('#email').val().trim();
	var password = $('#password').val().trim();
	var passwordConfirm = $('#password-confirm').val().trim();
	username = $('#username').val().trim();
	var errors = false;

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
	if(passwordConfirm == '') {
		displayErrors ('Please confirm password');
		errors = true;
		$('#password-confirm').focus();
	}
	
	if(password == '') {
		displayErrors ('Password is required');
		errors = true;
		$('#password').focus();
	} else if(!/(?=.*[A-Z])/.test(password)) {
		displayErrors('Password requires a capital letter');
		errors = true;
		$('#password').focus();
	} else if(!/(?=.*[a-z])/.test(password)) {
		displayErrors('Password requires a lowercase letter');
		errors = true;
		$('#password').focus();
	} else if(!/(?=^\S*$)/.test(password)) {
		displayErrors('Password cannot contain any white spaces');
		errors = true;
		$('#password').focus();
	} else if (!/(?=.*\d)/.test(password)) {
		displayErrors('Password requires a number');
		errors = true;
		$('#password').focus();
	} else if(!/(?=.*[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\\\|\;\:\'\"\,\.\<\>\/\?])/.test(password)) {
		displayErrors('Password requires a non-alphanumeric character');
		errors = true;
		$('#password').focus();
	} else if(!/(^.{6,15}$)/.test(password)) {
		displayErrors('Password must be between 6 and 15 characters');
		errors = true;
		$('#password').focus();
	} else if(password != passwordConfirm) {
		displayErrors('Passwords do not match');
		errors = true;
		$('#password').focus();
	}
	
	if(email == '') {
		displayErrors ('Email is required');
		errors = true;
		$('#email').focus();
	} else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
		displayErrors ('Email address is not valid');
		errors = true;
		$('#email').focus();
	}
	
	if(username == '') {
		displayErrors ('Username required');
		errors = true;
		$('#username').focus();
	} else if(!/^[A-Za-z0-9_]*$/.test(username)) {
		displayErrors ('Username can only contain letters, numbers and underscores');
		errors = true;
		$('#username').focus();
	} else if(!/(^.{4,25}$)/.test(password)) {
		displayErrors ('Username must be between 4 and 25 characters long');
		errors = true;	
	}
	
	if(!errors) {
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here
			var errorCode = error.code;
			var errorMessage = error.message;
	
			if(errorCode == 'auth/weak-password') {
				displayErrors('The password is too weak.');
			} else {
				displayErrors(errorMessage);
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
	
	if(firebase.auth().currentUser) {
		//	If user is signed in, sign them out
		firebase.auth().signOut();
	} else {
		var email = $('#email').val().trim();
		var password = $('#password').val().trim();
		
		if(email == '') {
			displayErrors ('Email required');
			$('#email').focus();
			errors = true;
		} else if(password == '') {
			displayErrors ('Password required');
			$('#password').focus();
			errors = true;
		}
	
		if(!errors) {
			firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
				//	Handle errors here
				var errorCode = error.code;
				var errorMessage = error.message;
					
				if(errorCode === 'auth/wrong-password') {
					displayErrors('Incorrect password');
				} else {
					displayErrors(errorMessage);
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
	
	if(email == '') {
		displayErrors('Email required');
		$('#email').focus();
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
				displayErrors(errorMessage);
			} else if(errorCode == 'auth/user-not-found') {
				displayErrors(errorMessage);
			}
			console.log(error);
		});
	}
}

function calculateDailyNutrition() {
	
	//	Capture Inputs
	var weight = $('#weight-input').val();
	var height = $('#height-input').val();
	var activity = $('#activity-input').val();
	var age = $('#age-input').val();
	var gender = $('#gender-input').val();
	var goal = $('#goal-input').val();
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
	$('#calculator-form-display').addClass('js-hidden');
	
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
		$('#cal-results-display').empty();
		var newHeader = $('<h2>').text('Daily Goals');
		var newCard = $('<div>');
		var cals = $('<h3>').text(baseNutrition[0] + ' cals');
		var prot = $('<p>').text(dailyProteinGrams + 'g prot');
		var fat = $('<p>').text(baseNutrition[2] + 'g fat');
		var carbs = $('<p>').text(baseNutrition[7] + 'g carbs');
		newCard.append(cals, prot, fat, carbs);
		$('#cal-results-display').append(newHeader, newCard);
		
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
	
	$('#cal-results-display').removeClass('js-hidden');
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