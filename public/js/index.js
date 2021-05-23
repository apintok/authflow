const authorize = document.getElementById('authorize');
const formGET = document.getElementsByTagName('form')[0];
const formPOST = document.getElementsByTagName('form')[1];
const redirectUriPost = document.getElementById('redirect_uri_post');

formGET.addEventListener('submit', function (e) {
	const [...checkboxes] = document.getElementsByName('scope');
	const checked = checkboxes.some((el) => el.checked === true);
	console.log('Checked?', checked);

	if (!checked) {
		e.preventDefault();
		const warning = document.querySelector('.warning');
		console.log(warning);
		warning.style.display = 'block';
	} else {
		const clientId = document.getElementById('clientid').value;
		const redirectUri = document.getElementById('redirect_uri').value;
		localStorage.setItem('redirectUri', redirectUri);
	}
});

redirectUriPost.value = localStorage.getItem('redirectUri');

const validateCheckboxes = () => {};
