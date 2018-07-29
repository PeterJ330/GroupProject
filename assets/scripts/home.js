console.log('home.js loaded');
function logOut() {

	if(firebase.auth().currentUser) {
		//	If user is signed in, sign them out
		firebase.auth().signOut();
//		window.location.href='login.html';
	}
}
function signIn() {
	
	if(firebase.auth().currentUser) {
		//	If user is signed in, sign them out
		firebase.auth().signOut();
	} else {
		var email = $('#email').val().trim();
		var password = $('#password').val().trim();
		
		//	password validations would go here
	
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			//	Handle errors here
			var errorCode = error.code;
			var errorMessage = error.message;
				
			if(errorCode === 'auth/wrong-password') {
				alert('Wrong password');
			} else {
				alert(errorMessage);
			}
			console.log(error);
		});
			
	}
}
console.log(window.document.href());

firebase.auth().onAuthStateChanged(function(user) {
		
// 	if(user && window.document.href() != 'index.html') {
		
/* 	} else */ if(user) {
		
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

