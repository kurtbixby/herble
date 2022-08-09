const switchers = [...document.querySelectorAll('.switcher')]

switchers.forEach(item => {
	item.addEventListener('click', function() {
		switchers.forEach(item => item.parentElement.classList.remove('is-active'))
		this.parentElement.classList.add('is-active')
	})
})



const loginFormHandler = async (event) => {
	console.log("Inside login form handler");
	event.preventDefault();
  
	// Gather the data from the form elements on the page
	const email = document.querySelector('#login-email').value.trim();
	const password = document.querySelector('#login-password').value.trim();
  
	if (email && password) {
	  // Send the e-mail and password to the server
	  const response = await fetch('/login', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
		headers: { 'Content-Type': 'application/json' },
	  });
  
	  if (response.ok) {
		document.location.replace('/');
	  } else {
		alert('Failed to log in');
	  }
	}
  };
  
  document
	.querySelector('.btn-login')
	.addEventListener('submit', loginFormHandler);

// const logout = async () => {
//   const response = await fetch('/api/users/logout', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//   });

//   if (response.ok) {
//     document.location.replace('/');
//   } else {
//     alert('Failed to log out.');
//   }
// };

// document.querySelector('#logout').addEventListener('click', logout);

