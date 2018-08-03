var displayName = '';
var uid = '';
var email = '';
var currentWeight;

$(document).ready(function() {
	
	//	user login event listener
	firebase.auth().onAuthStateChanged(function(user) {
			
		if(user) {
			//	set user menu data if user is logged in
			displayName = user.displayName;
			uid = user.uid;
			email = user.email;
			
			//	update user menu displays
			$('.username').text(escapeHTML(user.displayName));
			$('.dropdown').empty();
			var logout = $('<div>');
			logout.text('Logout');
			logout.attr('id', 'logout');
			var profile = $('<div>');
			profile.text('Profile');
			$('.dropdown').append(logout, profile);	
			
			//	usersInfo event listener
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
			//	redirect to homepage if not logged in
			window.location.href='../index.html';
		}
	});
	
	//	User Menu Logout event listener
	$(document).on('click', '#logout', logOut);
	
	//	Calorie calculator Submit event listener
	$('#calculator-submit').click(function(event) {
		event.preventDefault();
		calculateDailyNutrition();
	});
	
/*
	//	Calorie calculator Goal Changed event listener
	$('#goal-input').change(function () {
		var optionSelected = $(this).find('option:selected');
		var valueSelected  = optionSelected.val();
		var textSelected = optionSelected.text();
		
		if(textSelected == 'Lose Fat') {
			var newLabel = $('<label>');
			newLabel.attr('for', 'intensity-input');
			newLabel.text('What intensity level would you prefer?');
			var newSelect = $('<select>');
			newSelect.attr('id', 'intensity-input');
			var option1 = $('<option>');
			option1.text('Light');
			option1.attr('value', 0.15);
			var option2 = $('<option>');
			option2.text('Moderate');
			option2.attr('value', 0.20);
			option2.attr('selected', '');
			var option3 = $('<option>');
			option3.text('Intense');
			option3.attr('value', 0.25);
			newSelect.append(option1, option2, option3)
			$('#intensity-container').append(newLabel, newSelect);
		} else {
			$('#intensity-container').empty();
		}
	 });
*/
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
		if(intensityLvl == 'light') {
			$('#moderate').addClass('js-hidden');
			$('#intense').addClass('js-hidden');
		} else if(intensityLvl == 'moderate') {
			$('#light').addClass('js-hidden');
			$('#intense').addClass('js-hidden');
		} else if(intensityLvl == 'intense') {
			$('#light').addClass('js-hidden');
			$('#moderate').addClass('js-hidden');
		}
	});
	 
});		//	End of document.ready()