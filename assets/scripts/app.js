$(document).ready(function() {
	
	var today = moment().format('YYYY MM DD');
	today = today.replace(/\s/g, '_');
	console.log('Today: ' + today);
	var yesterday = moment(today, 'YYYY MM DD').subtract(1, 'days').format('YYYY MM DD');
	yesterday = yesterday.replace(/\s/g, '_');
	var day = moment().format('YYYY MM DD');
	console.log('Yesterday: ' + yesterday);
	var menu = 'home';
	var uid = '';
	var userExists = false;
	
	var calTotal = 'N/A';
	var calCurrent = 0;
	var protTotal = 'N/A';
	var protCurrent = 0;
	var fatTotal = 'N/A';
	var fatCurrent = 0;
	var carbsTotal = 'N/A';
	var carbsCurrent = 0;
	
	var goal;
	var calculator = false;
	
	var addFoodVisited = false;
	
	var brandSearch = '';
	
	firebase.auth().onAuthStateChanged(function(user) {
			
		if(user) {
			//	change user displays if user is logged in
			$('.username').text(user.displayName);
			$('.dropdown').empty();
			var logout = $('<div>');
			logout.text('Logout');
			logout.attr('id', 'logout');
			var calculator = $('<div>');
			calculator.text('Nutrition Calculator');
			calculator.attr('id', 're-calculate');
			$('.dropdown').append(logout, calculator);
			
//			$('#home-default').removeClass('js-hidden');
			
			uid = user.uid;
			userExists = true;
			
// 			console.log(db.ref('users' + user.uid).childExists('dailyLogs'));
			
			//	The below code handles updating user login data, including if they have never logged in before
			db.ref('users/' + user.uid).once("value", function(snapshot) {
				
				console.log(snapshot.child('dailyLogs').exists());
				console.log(snapshot.child('userInfo').child('lastLogin').exists());
				
				$('#home-default').removeClass('js-hidden');
				
			//	if user has logged in before, check if they have logged in today already
// 				if (snapshot.child("dailyLogs").exists()) {
				if(snapshot.child('userInfo').child('lastLogin').exists()) {
					console.log('dailyLogs exists');
					//	if today exists, user has already logged in today
					if(snapshot.child('dailyLogs').child(today).exists()) {
						
						console.log(today + ' (today) directory exists');
						console.log('Today Login: ' + snapshot.val().dailyLogs[today].login);
						//console.log(snapshot.val().dailyLogs[today]);
					} else {
						//	if today does not exist, create it and login for the day
						db.ref('users/' + user.uid + '/dailyLogs/' + today).update({
							'login': true
						});
						console.log('Logged in for the day');
						console.log('lastLogin: ' + snapshot.child('userInfo').child('lastLogin').val());

						if(snapshot.child('userInfo').child('lastLogin').val() == yesterday) {
							// if lastLogin was yesterday, increase loginStreak
							db.ref('users/' + user.uid + '/userInfo/loginStreak').transaction(function(currentStreak) {
								return currentStreak +1;
							});
						} else {
							//	reset loginStreak if user did not login the previous day
							db.ref('users/' + user.uid + '/userInfo').update({
								loginStreak: 1
							});
						}
						//	after updating the loginStreak, set the last time logged in to today
						db.ref('users/' + user.uid + '/userInfo').update({
							'lastLogin': today
						});
					}
					
				} else {
			//	if user has never logged in before, create dailyLogs and log them in for today
					console.log('dailyLogs does not exist');
					var container = $('<div>');
					container.attr('id', 'tutorial-container').addClass('content-container');
					
					var header = $('<h2>');
					header.text('Congratulations on starting your new Fitness Journey!');
					var caption = $('<div>').addClass('tutorial-text');
					caption.text('Click the button below to get your recommended nutrition numbers or skip this step and venture forth on your own!');
					var button = $('<div>');
					button.addClass('tutorial-card');
					button.attr('id', 'start-tutorial');
					button.text('GET STARTED!');
					var skip = $('<div>');
					skip.attr('id', 'skip');
					skip.text('No thanks!');
					skip.addClass('tutorial-card');
					
					$('#tutorial').removeClass('js-hidden');
					$('#welcome').addClass('js-hidden');
					$('#home-default').addClass('js-hidden');
					
					var buttonContainer = $('<div>').addClass('button-container');
					buttonContainer.append(button, skip);
					container.append(header, caption, buttonContainer);
					$('#tutorial').append(container);
					
					db.ref('users/' + user.uid + '/dailyLogs/' + today).update({
						'login': true
					});
					db.ref('users/' + user.uid + '/userInfo').update({
						'lastLogin': today,
						'loginStreak': 1
					});
				}
			});
			
			//	Update homepage Total Nutrient progress displays in real time
			db.ref('users/' + uid + '/nutritionInfo').on('value', function(snapshot) {
				if(snapshot) {
					console.log('Snapshot: ' + snapshot);
					calTotal = parseFloat(snapshot.val().calories);
					protTotal = parseFloat(snapshot.val().proteinGrams);
					fatTotal = parseFloat(snapshot.val().fatGrams);
					carbsTotal = parseFloat(snapshot.val().carbsGrams);
					
					$('#cal-current').text(calCurrent);
					$('#cal-total').text(calTotal);
					$('#prot-current').text(protCurrent);
					$('#prot-total').text(protTotal);
					$('#fat-current').text(fatCurrent);
					$('#fat-total').text(fatTotal);
					$('#carbs-current').text(carbsCurrent);
					$('#carbs-total').text(carbsTotal);
					
					var calPercent = calCurrent/calTotal*100;
					var protPercent = protCurrent/protTotal*100;
					var fatPercent = fatCurrent/fatTotal*100;
					var carbsPercent = carbsCurrent/carbsTotal*100;
					if(calPercent % 0 != 1) {
						calPercent = calPercent.toFixed(2);
					}
					if(protPercent % 0 != 1) {
						protPercent = protPercent.toFixed(2);
					}
					if(fatPercent % 0 != 1) {
						fatPercent = fatPercent.toFixed(2);
					}
					if(carbsPercent % 0 != 1) {
						carbsPercent = carbsPercent.toFixed(2);
					}
					if(calPercent > 100) {
						$('#cal-text').addClass('red');
					} else {
						$('#cal-text').removeClass('red');
					}
					if(protPercent > 100) {
						$('#prot-text').addClass('red');
					} else {
						$('#prot-text').removeClass('red');
					}
					if(fatPercent > 100) {
						$('#fat-text').addClass('red');
					} else {
						$('#fat-text').removeClass('red');
					}
					if(carbsPercent > 100) {
						$('#carbs-text').addClass('red');
					} else {
						$('#carbs-text').removeClass('red');
					}
					
					$('#cal-text').text(calPercent + ' %');
					$('#cal-prog').css('width', calPercent + '%');
					$('#prot-text').text(protPercent + ' %');
					$('#prot-prog').css('width', protPercent + '%');
					$('#fat-text').text(fatPercent + ' %');
					$('#fat-prog').css('width', fatPercent + '%');
					$('#carbs-text').text(carbsPercent + ' %');
					$('#carbs-prog').css('width', carbsPercent + '%');
				}
			}, function(error) {
				console.log('Error: ' + error.code);
			});
			
			//	Update homepage Current Nutrient progress displays in real time
			db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition').on('value', function(snapshot) {
				if(snapshot) {
					console.log('Snapshot: ' + snapshot);
					calCurrent = parseFloat(snapshot.val().caloriesToday);
					protCurrent = parseFloat(snapshot.val().proteinToday);
					fatCurrent = parseFloat(snapshot.val().fatToday);
					carbsCurrent = parseFloat(snapshot.val().carbsToday);
					
					$('#cal-current').text(calCurrent);
					$('#cal-total').text(calTotal);
					$('#prot-current').text(protCurrent);
					$('#prot-total').text(protTotal);
					$('#fat-current').text(fatCurrent);
					$('#fat-total').text(fatTotal);
					$('#carbs-current').text(carbsCurrent);
					$('#carbs-total').text(carbsTotal);
					
					var calPercent = calCurrent/calTotal*100;
					var protPercent = protCurrent/protTotal*100;
					var fatPercent = fatCurrent/fatTotal*100;
					var carbsPercent = carbsCurrent/carbsTotal*100;
					if(calPercent % 0 != 1) {
						calPercent = calPercent.toFixed(2);
					}
					if(protPercent % 0 != 1) {
						protPercent = protPercent.toFixed(2);
					}
					if(fatPercent % 0 != 1) {
						fatPercent = fatPercent.toFixed(2);
					}
					if(carbsPercent % 0 != 1) {
						carbsPercent = carbsPercent.toFixed(2);
					}
					if(calPercent > 100) {
						$('#cal-text').addClass('red');
					} else {
						$('#cal-text').removeClass('red');
					}
					if(protPercent > 100) {
						$('#prot-text').addClass('red');
					} else {
						$('#prot-text').removeClass('red');
					}
					if(fatPercent > 100) {
						$('#fat-text').addClass('red');
					} else {
						$('#fat-text').removeClass('red');
					}
					if(carbsPercent > 100) {
						$('#carbs-text').addClass('red');
					} else {
						$('#carbs-text').removeClass('red');
					}
					
					$('#cal-text').text(calPercent + ' %');
					$('#cal-prog').css('width', calPercent + '%');
					$('#prot-text').text(protPercent + ' %');
					$('#prot-prog').css('width', protPercent + '%');
					$('#fat-text').text(fatPercent + ' %');
					$('#fat-prog').css('width', fatPercent + '%');
					$('#carbs-text').text(carbsPercent + ' %');
					$('#carbs-prog').css('width', carbsPercent + '%');
				}
			}, function(error) {
				console.log('Error: ' + error.code);
			});
			
			//	Update calculator with user info, if it exists
			db.ref('users/' + uid + '/userInfo').on('value', function(snapshot) {
			if(snapshot) {
				//	if userInfo exists, fill in the calculator form with the user's previous values
				$('#weight-input').val(snapshot.val().weightLB);
				$('select [value="' + snapshot.val().heightIN + '"]').attr('selected', '');
				$('#age-input').val(snapshot.val().age);
				$('select [value="' + snapshot.val().gender + '"]').attr('selected', '');
				$('select [value="' + snapshot.val().activityLevel + '"]').attr('selected', '');
				$('select [value="' + snapshot.val().goal + '"]').attr('selected', '');
			}
			}, function(error) {
				console.log('Error: ' + error.code);
			});

		} else {
			//	change user displays if user is logged out
			$('.username').text('Begin Your Journey!');
			$('.dropdown').empty();
			var login = $('<div>');
			login.text('Log In');
			login.attr('id', 'login');
			var signup = $('<div>');
			signup.text('Sign Up');
			signup.attr('id', 'signup');
			$('.dropdown').append(login, signup);
			
			var dataMenus = document.getElementsByClassName('menu');
			console.log('data-menus length: ' + dataMenus.length);
			for(var i = 0; i < dataMenus.length; i++) {
				$('[data-menu="' + i + '"]').addClass('js-hidden');
			}
			$('#welcome').removeClass('js-hidden');
			
			userExists = false;
		}
	});

	//	ToDo??:	create links instead of divs and give absolute paths from github pages
	
	$(document).on('click', '#logout', logOut);
	$(document).on('click', '#re-calculate', function() {
		tutorial();
		changeMenu('#tutorial');
	});
	$(document).on('click', '#login', function() { window.location.href='login/login.html' });
	$(document).on('click', '#signup', function() { window.location.href='login/signup.html' });
	
	$(document).on('click', '#start-tutorial', tutorial);
	$(document).on('click', '#skip', function() {
		$('#home-default').removeClass('js-hidden');
		$('#tutorial-container').addClass('js-hidden');
	});
	
	$('.tabs').click(function() {
		if(userExists) {
			menu = $(this).attr('id');
			var tabs = document.getElementsByClassName('tabs');
			var menuIndex = $(this).attr('data-tab');
			for(var i = 0; i < tabs.length; i++) {
				if(menuIndex == i) {
					$('[data-tab="' + i + '"]').addClass('selected-tab');
				} else {
					$('[data-tab="' + i + '"]').removeClass('selected-tab');
				}
			}
			if (menuIndex == 0) {
				changeMenu('#workout-default');
			} else if (menuIndex == 1) {
				changeMenu('#home-default');
			} else if (menuIndex == 2) {
				showdDailyNutrition(uid, today);
				changeMenu('#nutrition-default');
			}
		}
	});
	
	$('.food-tabs').click(function() {
		var tabs = document.getElementsByClassName('food-tabs');
		var menuIndex = $(this).attr('data-food-tab');
		for(var i = 0; i < tabs.length; i++) {
			if(menuIndex == i) {
				$('[data-food-tab="' + i + '"]').addClass('selected-tab');
			} else {
				$('[data-food-tab="' + i + '"]').removeClass('selected-tab');
			}
		}
		if (menuIndex == 0) {
			changeFoodMenu('#search-food-menu');
		} else if (menuIndex == 1) {
			showSaved(uid);
			changeFoodMenu('#saved-food-menu');
		} else if (menuIndex == 2) {
			showRecent(uid);
			changeFoodMenu('#recent-food-menu')
		} else if(menuIndex == 3) {
			showFrequent(uid);
			changeFoodMenu('#frequent-food-menu');
		}
	});
	
	$(document).on('click', '.goal-card', function() {
		var value = $(this).attr('id');
		if(value == 'lose' || value == 'maintain' || value == 'gain') {
			goal = value;
		}
		$('#tutorial').addClass('js-hidden');
		$('#calculator').removeClass('js-hidden');
		calculator = true;
	});
	
	//	Calorie calculator Submit event listener
	$('#calculator-submit').click(function(event) {
		event.preventDefault();
		calculateDailyNutrition(uid, goal);
	});
	
	$('.nutrition-card').click(function() {
		var intensityLvl = $(this).attr('id');
		//	update DB with selected data
		db.ref('users/' + uid + '/userInfo').update({
			weightLossIntensityLvl: intensityLvl
		});
		db.ref('users/' + uid + '/nutritionInfo').update({
			calories: $(this).attr('data-cal'),
			proteinCal: $(this).attr('data-protCal'),
			proteinGrams: $(this).attr('data-protGrams'),
			fatCal: $(this).attr('data-fatCal'),
			fatGrams: $(this).attr('data-fatGrams'),
			saturatedFat: $(this).attr('data-satFat'),
			monoUnsaturatedFat: $(this).attr('data-mono'),
			polyUnsaturatedFat: $(this).attr('data-poly'),
			carbsCal: $(this).attr('data-carbsCal'),
			carbsGrams: $(this).attr('data-carbsGrams'),
			fiber: $(this).attr('data-fiber')
		});
		
		//	Change displays
		$('.card-container').empty();
		$('.results-header').text('You\'re ready to start your Journey!');
		var newCard = $('<div>').addClass('results-card');
		var cals = $('<h3>').text($(this).attr('data-cal') + ' cals');
		var prot = $('<p>').text($(this).attr('data-protGrams') + 'g prot');
		var fat = $('<p>').text($(this).attr('data-fatGrams') + 'g fat');
		var carbs = $('<p>').text($(this).attr('data-carbsGrams') + 'g carbs');
		newCard.append(cals, prot, fat, carbs);
		
		var newButton = $('<div>').addClass('button');
		newButton.attr('id', 'go-home').text('I\'m ready!');
		var buttonContainer = $('<div>').addClass('button-container');
		
		buttonContainer.append(newButton);
		
		$('.results-text').text('Venture forth, log your nutrition/workouts and have fun!');
		$('.card-container').append(newCard);
		$('#results').append(buttonContainer);
	});
	
	$(document).on('click', '#go-home', function() {
		changeMenu('#home-default');
	});
	
	$('#food-menu').click(function() {
		changeMenu('#food');
		if(!addFoodVisited) {
			changeFoodMenu('#search-food-menu');
			$('[data-food-tab="0"]').addClass('selected-tab');
			addFoodVisited = true;
		}
	});
	
	$('#search-btn').click(function(event) {
		event.preventDefault();	
		
		var errors = true;
		var searchQuery = '';
		if($('#foodInput').val() == '') {
			
			$('#append-results').empty();
			$('#errors-display').empty();
			var errorsDiv = $('<h3>');
			errorsDiv.text('Please fix the following error:');
			errorsDiv.addClass('errors-container');
			var error = $('<p>');
			error.html('&middot; Search field cannot be blank');
			error.addClass('errors');
			
			errorsDiv.append(error);
			$('#errors-display').append(errorsDiv);
			
			errors = true;
			
		} else if(!/^[A-Za-z0-9 ]*$/.test($('#foodInput').val())/*  || !/^[A-Za-z0-9 ]*$/.test($('#brandInput').val()) */) {
			
			$('#errors-display').empty();
			var errorsDiv = $('<h3>');
			errorsDiv.text('Please fix the following error:');
			errorsDiv.addClass('errors-container');
			var error = $('<p>');
			error.html('&middot; Searches must contain only letters, numbers and spaces');
			error.addClass('errors');
			
			errorsDiv.append(error);
			$('#errors-display').append(errorsDiv);
			
			errors = true;
/*
			
		} else if($('#brandInput').val() == '') {
			searchItem = $("#foodInput").val().trim().toLowerCase();
			errors = false;
*/
		} else {
			searchItem = $("#foodInput").val().trim().toLowerCase()/*  + '+' + $("#brandInput").val().trim().toLowerCase() */;
			errors = false;
		}
		
	    var space = /\s/g;
	    searchItem = searchItem.replace(space, "+");
	    
	    if(!errors) {
//		    $("#brandInput").val("");
		    $('#foodInput').val('');
			if($('#brandCheck').is(':checked')) {
		    	searchFood(searchItem, true);
		    } else {
			    searchFood(searchItem, false);
		    }
		    
		    changeFoodMenu('#food-display');
		}    
		    
	});
	
	$('#addCustomFood').click(function(event) {
		event.preventDefault();
		var food = $('#customFoodName').val().trim().toLowerCase();
		var cal = $('#customFoodCal').val();
		var prot = $('#customFoodProt').val();
		var fat = $('#customFoodFat').val();
		var carbs = $('#customFoodCarbs').val();
		var timestamp = moment().format('X');
		var errors = true;

		if(food == '') {
			
			$('#append-results').empty();
			$('#errors-display').empty();
			var errorsDiv = $('<h3>');
			errorsDiv.text('Please fix the following error:');
			errorsDiv.addClass('errors-container');
			var error = $('<p>');
			error.html('&middot; Food name cannot be blank');
			error.addClass('errors');
			
			errorsDiv.append(error);
			$('#errors-display').append(errorsDiv);
			
			errors = true;
			
		} else if(!/^[A-Za-z0-9 ]*$/.test(food)) {
			
			$('#errors-display').empty();
			var errorsDiv = $('<h3>');
			errorsDiv.text('Please fix the following error:');
			errorsDiv.addClass('errors-container');
			var error = $('<p>');
			error.html('&middot; Food name must contain only letters, numbers and spaces');
			error.addClass('errors');
			
			errorsDiv.append(error);
			$('#errors-display').append(errorsDiv);
			
			errors = true;

		} else {
			errors = false;
			food = food.replace(/\s/g, '_');
		}
		
		if(!errors) {
			db.ref('users/' + uid + '/nutritionInfo/recentFood/' + food).update({
				'timestamp': timestamp,
				'food': food,
				'servingCalories': cal,
				'servingProtein': prot,
				'servingFat': fat,
				'servingCarbs': carbs
			}, function(error) {
				if(error) {
					console.log(error.code);
				} else {
					console.log('DB saved successfully');
				}
			});
			
			db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition/food').push({
				'timestamp': timestamp,
				'food': food,
				'calories': cal,
				'protein': prot,
				'fat': fat,
				'carbs': carbs
			}, function(error) {
				if(error) {
					console.log(error.code);
				} else {
					console.log('Food added to dailyLogs');
				}
			});
			
			db.ref('users/' + uid + '/nutritionInfo/recentFood/' + food + '/foodCount').transaction(function(counter) {
				return counter + 1;
			});
			
			db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition/caloriesToday').transaction(function(counter) {
				return counter + parseFloat(cal);
			});
			
			db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition/proteinToday').transaction(function(counter) {
				return counter + parseFloat(prot);
			});
			
			db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition/fatToday').transaction(function(counter) {
				return counter + parseFloat(fat);
			});
			
			db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition/carbsToday').transaction(function(counter) {
				return counter + parseFloat(carbs);
			});
			
			$('#customFoodName').val('')
			$('#customFoodCal').val('');
			$('#customFoodProt').val('');
			$('#customFoodFat').val('');
			$('#customFoodCarbs').val('');
			
			changeFoodMenu('#search-food-menu');
			showdDailyNutrition(uid, today);
			changeMenu('#nutrition-default');
			
		}
		
	});
	
	$(document).on('click', '.confirm-food', function() {
		var foodName = $(this).find('th:first').text();
		var ndbno = $(this).attr('data-ndbno');
		
		displayQuantity(ndbno);
		displayNutrients(ndbno, 0, 1);
		$('#whole-number').val('1');
		$('#fraction').val('.0');
		$('#food-name').text(foodName);
		changeFoodMenu('#food-quantity');
	});
	
	$('#quantity-input').change(function() {
		var ndbno = $(this).find(':selected').data('nutrient-ndbno');
		var nutrientIndex = $(this).find(':selected').data('nutrient-index');
		var servingsWhole = $('#whole-number').val();
		var servingFraction = $('#fraction').val();
		var servingString = servingsWhole + servingFraction;
		console.log(servingString);
		var servings = parseInt(servingString);
//		var ndbno = $(this).attr('data-nutrient-ndbno');
//		var nutrientIndex = $(this).attr('data-nutrient-index');
		console.log('ndbno: ' + ndbno);
		console.log('index: ' + nutrientIndex);
		displayNutrients(ndbno, nutrientIndex, servingString);
	});
	
	$('#whole-number').change(function() {
		var ndbno = $('#quantity-input').find(':selected').data('nutrient-ndbno');
		var measurementIndex = $('#quantity-input').find(':selected').data('nutrient-index');
		
		var servingsWhole = $('#whole-number').val();
		var servingFraction = $('#fraction').val();
		var servingString = servingsWhole + servingFraction;
		var servings = parseInt(servingString);
		
		console.log('ndbno: ' + ndbno + '; index: ' + measurementIndex + '; servings: ' + servings);
		displayNutrients(ndbno, measurementIndex, servingString);
	});
	
	$('#fraction').change(function() {
		var ndbno = $('#quantity-input').find(':selected').data('nutrient-ndbno');
		var measurementIndex = $('#quantity-input').find(':selected').data('nutrient-index');
		
		var servingsWhole = $('#whole-number').val();
		var servingFraction = $('#fraction').val();
		var servingString = servingsWhole + servingFraction;
		var servings = parseInt(servingString);
		var wholeInt = parseInt(servingsWhole);
		var fractionInt = parseInt('0' + servingFraction);
		servings = wholeInt + fractionInt;
		
		console.log('fraction: ' + servingFraction + '; string: ' + servingString + '; servings(int): ' + servings);
		console.log('100 * string: ' + 100 * servingString);
		console.log('ndbno: ' + ndbno + '; index: ' + measurementIndex + '; servings: ' + servings);
		displayNutrients(ndbno, measurementIndex, servingString);
	});
	
	$('#log-food').click(function(event) {
		event.preventDefault();
		
		
		var food = $('#food-name').text().trim().toLowerCase();
//		food = food.replace(/\s/g, '_');
		food = food.replace(/[\.\#\$\[\]]/g, '');
		var calories = parseFloat($('#cal-display').text());
		var protein = parseFloat($('#prot-display').text());
		var fat = parseFloat($('#fat-display').text());
		var carbs = parseFloat($('#carbs-display').text());
		
		var servingSize = $('#quantity-input').find(':selected').text();
		console.log('servingSize: ' + servingSize);
		var servingsWhole = $('#whole-number').val();
		var servingFraction = $('#fraction').val();
		var servings = parseFloat(servingsWhole + servingFraction);
		console.log('servings: ' + servings);
		
		var timestamp = moment().format('X');
		
		console.log('Timestamp: ' + timestamp);
		console.log('Today: ' + today);
		console.log('Food: ' + food);
	
		db.ref('users/' + uid + '/nutritionInfo/recentFood/' + food).update({
			'timestamp': timestamp,
			'food': food,
			'servingSize': servingSize,
			'servings': servings,
			'servingCalories': calories,
			'servingProtein': protein,
			'servingFat': fat,
			'servingCarbs': carbs
		}, function(error) {
			if(error) {
				console.log(error.code);
			} else {
				console.log('DB saved successfully');
			}
		});
		
		db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition/food').push({
			'timestamp': timestamp,
			'food': food,
			'calories': calories,
			'protein': protein,
			'fat': fat,
			'carbs': carbs
		}, function(error) {
			if(error) {
				console.log(error.code);
			} else {
				console.log('Food added to dailyLogs');
			}
		});
		
		db.ref('users/' + uid + '/nutritionInfo/recentFood/' + food + '/foodCount').transaction(function(counter) {
			return counter + 1;
		});
		
		db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition/caloriesToday').transaction(function(counter) {
			return counter + parseFloat(calories);
		});
		
		db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition/proteinToday').transaction(function(counter) {
			return counter + parseFloat(protein);
		});
		
		db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition/fatToday').transaction(function(counter) {
			return counter + parseFloat(fat);
		});
		
		db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition/carbsToday').transaction(function(counter) {
			return counter + parseFloat(carbs);
		});
		
		console.log('Food Count: ' + db.ref('users/' + uid + '/nutritionInfo/recentFood' + food).child('foodCount'));
		
		changeFoodMenu('#search-food-menu');
/* 		$('#search-food-menu').addClass */
		showdDailyNutrition(uid, today);
		changeMenu('#nutrition-default');

	});
	
	$(document).on('click', '.log-food', function() {
		var food = $(this).find('th:first').text();
		var cal = $(this).find('td:first').text();
		var prot = $(this).find('td:nth-child(3)').text();
		var fat = $(this).find('td:nth-child(4)').text();
		var carbs = $(this).find('td:nth-child(5)').text();
		
		var timestamp = moment().format('X');
		
		db.ref('users/' + uid + '/nutritionInfo/recentFood/' + food).update({
			'timestamp': timestamp,
			'food': food,
			'savedCalories': cal,
			'savedProtein': prot,
			'savedFat': fat,
			'savedCarbs': carbs
		}, function(error) {
			if(error) {
				console.log(error.code);
			} else {
				console.log('DB saved successfully');
			}
		});
		
		db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition/food').push({
			'timestamp': timestamp,
			'food': food,
			'calories': cal,
			'protein': prot,
			'fat': fat,
			'carbs': carbs
		}, function(error) {
			if(error) {
				console.log(error.code);
			} else {
				console.log('Food added to dailyLogs');
			}
		});
		
		db.ref('users/' + uid + '/nutritionInfo/recentFood/' + food + '/foodCount').transaction(function(counter) {
			return counter + 1;
		});
		
		db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition/caloriesToday').transaction(function(counter) {
			return counter + parseFloat(cal);
		});
		
		db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition/proteinToday').transaction(function(counter) {
			return counter + parseFloat(prot);
		});
		
		db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition/fatToday').transaction(function(counter) {
			return counter + parseFloat(fat);
		});
		
		db.ref('users/' + uid + '/dailyLogs/' + today + '/nutrition/carbsToday').transaction(function(counter) {
			return counter + parseFloat(carbs);
		});
		
		changeFoodMenu('#search-food-menu');
		showdDailyNutrition(uid, today);
		changeMenu('#nutrition-default');
		
	});
	
	$(document).on('click', '.save-food', function() {
		var food = $(this).find('th:first').text();
		db.ref('users/' + uid + '/nutritionInfo/recentFood/' + food).update({
			'saved': 'true'
		}, function(error) {
			if(error) {
				console.log(error.code);
			} else {
				console.log('Food saved to DB successfully');
			}
		});
		showSaved(uid);
		$('[data-food-tab="1"]').addClass('selected-tab');
		$('[data-food-tab="2"]').removeClass('selected-tab');
		$('[data-food-tab="3"]').removeClass('selected-tab');
		changeFoodMenu('#saved-food-menu');
	});
	
	$('#leftArrow').click(function() {
		
		day = day.replace(/_/g, ' ')
		day = moment(day, 'YYYY MM DD').subtract(1, 'days').format('YYYY MM DD');
		day = day.replace(/\s/g, '_');
		showdDailyNutrition(uid, day);
		
		if(day == today) {
			$('#dayDisplay').text('Today');
		} else if(day == yesterday) {
			$('#dayDisplay').text('Yesterday');
		} else {
			$('#dayDisplay').text(day.replace(/_/g, ' - '));
		}
		
		$('#rightArrow').removeClass('js-hidden');
	});
	
	$('#rightArrow').click(function() {
		
		day = day.replace(/_/g, ' ')
		day = moment(day, 'YYYY MM DD').add(1, 'days').format('YYYY MM DD');
		day = day.replace(/\s/g, '_');
		showdDailyNutrition(uid, day);
		
		if(day == today) {
			$('#dayDisplay').text('Today');
			$('#rightArrow').addClass('js-hidden');
		} else if(day == yesterday) {
			$('#dayDisplay').text('Yesterday');
		} else {
			$('#dayDisplay').text(day.replace(/_/g, ' - '));
		}
	});
	
});	// end of document.ready