const moreInfoBtn = document.getElementById('moreinfo');
const infoSection = document.querySelector('.container__info');
const authorize = document.getElementById('authorize');
const formStepOne = document.getElementsByTagName('form')[0];
const redirectUriPost = document.getElementById('redirect_uri_post');
let clicked = false;

formStepOne.addEventListener('submit', function (e) {
	const [...checkboxes] = document.getElementsByName('scope');
	const checked = checkboxes.some((el) => el.checked === true);
	console.log('Checked?', checked);

	const warning = document.querySelector('.warning');
	console.log(warning);
	if (!warning) return;

	if (!checked) {
		e.preventDefault();
		warning.style.display = 'block';
	} else {
		const redirectUri = document.getElementById('redirect_uri').value;
		localStorage.setItem('redirectUri', redirectUri);
	}
});

redirectUriPost.value = localStorage.getItem('redirectUri');

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
