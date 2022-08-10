function init() {
	const switchers = [...document.querySelectorAll('.switcher')];

	switchers.forEach(item => {
		item.addEventListener('click', function() {
			switchers.forEach(item => item.parentElement.classList.remove('is-active'));
			this.parentElement.classList.add('is-active');
		});
	});
	
	document.querySelector('.form-login')
    .addEventListener('submit', loginFormHandler);
	document.querySelector('.form-signup')
    .addEventListener('submit', signupFormHandler);
}

async function signupFormHandler(event) {
	event.preventDefault();
	// Gather the data from the form elements on the page
	const username = document.querySelector('#signup-username').value.trim();
	const email = document.querySelector('#signup-email').value.trim();
	const password = document.querySelector('#signup-password').value.trim();
	if (email && password) {
		// Send the e-mail and password to the server
		const response = await fetch('/api/users', {
			method: 'POST',
			body: JSON.stringify({ username, email, password }),
			headers: { 'Content-Type': 'application/json' },
		});

		console.log(response);
		if (response.ok) {
			document.location.replace('/');
		} else {
			alert('Failed to sign up');
		}
	}	
}

async function loginFormHandler(event) {
	event.preventDefault();
	// Gather the data from the form elements on the page
	const email = document.querySelector('#login-email').value.trim();
	const password = document.querySelector('#login-password').value.trim();
	if (email && password) {
		// Send the e-mail and password to the server
		const response = await fetch('/api/login', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
			headers: { 'Content-Type': 'application/json' },
		});

		console.log(response);
		if (response.ok) {
			document.location.replace('/');
		} else {
			alert('Failed to log in');
		}
	}	
}

init();
