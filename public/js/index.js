const moreInfoBtn = document.getElementById('moreinfo');
const infoSection = document.querySelector('.container__info');
const authorize = document.getElementById('authorize');
const formGET = document.getElementsByTagName('form')[0];
const formPOST = document.getElementsByTagName('form')[1];
const redirectUriPost = document.getElementById('redirect_uri_post');
let clicked = false;

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

// JQUERY

$(moreInfoBtn).click(function () {
	if (clicked) {
		$(infoSection).slideUp(400, 'linear', function () {
			moreInfoBtn.textContent = 'More Info';
		});
		clicked = false;
	} else {
		$(infoSection).slideDown(500, 'linear', function () {
			moreInfoBtn.textContent = 'Less Info';
			$(this).css('display', 'flex');
		});
		clicked = true;
	}
});
