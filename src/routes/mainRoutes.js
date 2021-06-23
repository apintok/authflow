const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('index', {
		home: null
	});
});

router.get('/v1/authflow/one', (req, res) => {
	console.log('MAIN 1 >>> ', req.query);
	res.render('authOne', {
		home: 'Home',
		version: '1.0',
		code: req.query,
		oauth_token: '',
		data: ''
	});
});

router.get('/v1/authflow/two', (req, res) => {
	console.log('MAIN 2 >>> ', req.query);
	res.render('authTwo', {
		home: 'Home',
		version: '2.0',
		code: req.query,
		data: ''
	});
});

router.all('*', (req, res) => {
	res.status(404).send('Page Not Found');
});

module.exports = router;
