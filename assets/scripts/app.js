var displayName = '';
var uid = '';
var email = '';

function logOut() {
	
	if(firebase.auth().currentUser) {
		//	If user is signed in, sign them out
		firebase.auth().signOut();
	}
}

function calculateCalMaint() {
	
	//	Capture Inputs
	var weight = $('#weight-input').val();
	var height = $('#height-input').val();
	var activity = $('#activity-input').val();
	var age = $('#age-input').val();
	var gender = $('#gender-input').val();
	
	//	ToDO:	Validations
				
	var kg = weight/2.2046226218;
	var cm = height*2.54;
	
	var calMaintLevel = 0;
	
/*
			Mifflin - St Jeor Formula
Men
10 x weight (kg) + 6.25 x height (cm) – 5 x age (y) + 5

Women
10 x weight (kg) + 6.25 x height (cm) – 5 x age (y) – 161.

*/

	if(gender === 'male') {
		calMaintLevel = Math.round(10*kg+6.25*cm-5*age+5);
	} else if(gender === 'female') {
		calMaintLevel = Math.round(10*kg+6.25*cm-5*age-161);
	}
	
	//	Update DB
	db.ref('users/' + uid).update({
		weightLB: weight,
		weightKG: kg,
		heightIN: height,
		heightCM: cm,
		activity: activity,
		age: age,
		gender: gender,
		calMaintLevel: calMaintLevel
	});
	
	//	Update Displays
	$('#calculator-form-display').addClass('js-hidden');
	$('#cal-maint-display').text(calMaintLevel);
	$('#cal-results-display').removeClass('js-hidden');
}

$(document).ready(function() {
	firebase.auth().onAuthStateChanged(function(user) {
			
		if(user) {
			displayName = user.displayName;
			uid = user.uid;
			email = user.email;
			
			$('.username').text(user.displayName);
			$('.dropdown').empty();
			var logout = $('<div>');
			logout.text('Logout');
			logout.attr('id', 'logout');
			var profile = $('<div>');
			profile.text('Profile');
			$('.dropdown').append(logout, profile);
			
		} else {
			//	redirect to homepage if not logged in
			window.location.href='index.html';
		}
	});
	
	//	User Menu event listeners
	$(document).on('click', '#logout', logOut);
	
	//	Calorie calculator event listener
	$('#calculator-submit').click(function(event) {
		event.preventDefault();
		calculateCalMaint();
	});
	
	
});