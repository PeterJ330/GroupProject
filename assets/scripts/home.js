function logOut() {

	if(firebase.auth().currentUser) {
		//	If user is signed in, sign them out
		firebase.auth().signOut();
//		window.location.href='login.html';
	}
}

firebase.auth().onAuthStateChanged(function(user) {
		
	if(user) {
		
		$('.username').text(user.displayName);
		$('.dropdown').empty();
		var logout = $('<div>');
		logout.text('Logout');
		logout.attr('id', 'logout');
		var profile = $('<div>');
		profile.text('Profile');
		$('.dropdown').append(logout, profile);
	} else {
		$('.username').text('Get Fit!');
		$('.dropdown').empty();
		var login = $('<div>');
		login.text('Log In');
		login.attr('id', 'login');
		var signup = $('<div>');
		signup.text('Sign Up');
		signup.attr('id', 'signup');
		$('.dropdown').append(login, signup);
	}
});

//	ToDo:	create links instead of divs and give absolute paths from github pages

$(document).on('click', '#logout', logOut);
$(document).on('click', '#login', function() { window.location.href='login/login.html' });
$(document).on('click', '#signup', function() { window.location.href='login/signup.html' });