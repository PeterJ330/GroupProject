function signIn() {
	
	if(firebase.auth().currentUser) {
		//	If user is signed in, sign them out
		firebase.auth().signOut();
	} else {
		var email = $('#email').val().trim();
		var password = $('#password').val().trim();
		
		//	password validations should go here
	
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

$('#login-btn').click(function(event) {
	event.preventDefault();
	signIn();
});

firebase.auth().onAuthStateChanged(function(user) {
		
	if(user) {
		window.location.href='../index.html';
	} else {
		//	User is signed out
		console.log('User is signed out');
	}
});