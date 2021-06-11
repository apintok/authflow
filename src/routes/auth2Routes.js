const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/v1/oauth2', (req, res) => {
	try {
		const redirectURL = process.env.AUTH_URL;
		const params = {
			response_type: 'code',
			client_id: req.query.clientid,
			scope: doubleScope(req.query.scope),
			redirect_uri: req.query.redirect_uri,
			state: req.query.state
		};
		console.log('PARAMS >>> ', params);
		const urlParams = buildParams(params);

		res.redirect(redirectURL + urlParams);
	} catch (error) {
		console.log('ERROR >>> ', JSON.stringify(error));
		res.status(500).end();
	}
});

router.post('/v1/oauth2', async (req, res) => {
	try {
		const body = {
			code: req.body.code,
			redirect_uri: req.body.redirect_uri_post,
			grant_type: req.body.grant_type
		};
		console.log('\nPOST - BODY STEP 2 >>> ', body);

		const headers = {
			Accept: '*/*',
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: 'Basic ' + basicAuth(process.env.CLIENTID, process.env.CLIENTSECRET)
		};

		console.log(headers);

		const data = await axios
			.post(process.env.TOKEN_URL, new URLSearchParams(body), {
				headers
			})
			.then((res) => {
				console.log('RES CODE >>> ', res.status);

				return res.data;
			})
			.catch((error) => {
				console.log('ERROR AXIOS >>> ', error);
			});

		console.log('DATA >>> ', data);

		res.render('index', {
			code: body.code,
			access_token: JSON.stringify(data, null, 2)
		});
	} catch (error) {
		console.log('ERROR >>> ', JSON.stringify(error));
		res.status(500).end();
	}
});

router.post('/v1/oauth2/refresh', async (req, res) => {
	try {
		const body = {
			refresh_token: req.body.refresh,
			grant_type: req.body.grant_type
		};
		console.log('POST - BODY Refresh >>> ', body);

		const headers = {
			Accept: '*/*',
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: 'Basic ' + basicAuth(process.env.CLIENTID, process.env.CLIENTSECRET)
		};

		const data = await axios
			.post(process.env.TOKEN_URL, new URLSearchParams(body), {
				headers
			})
			.then((res) => {
				console.log('RES CODE >>> ', res.status);

				return res.data;
			})
			.catch((error) => {
				console.log('ERROR >>> ', error);
			});

		console.log('DATA >>> ', data);

		res.render('index', {
			code: '',
			access_token: JSON.stringify(data, null, 2)
		});
	} catch (error) {
		console.log('ERROR >>> ', JSON.stringify(error));
		res.status(500).end();
	}
});

router.post('/v1/oauth2/revoke', async (req, res) => {
	try {
		const body = {
			token: req.body.token
		};
		console.log('POST - BODY >>> ', body);

		const headers = {
			Accept: '*/*',
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: 'Basic ' + basicAuth(process.env.CLIENTID, process.env.CLIENTSECRET)
		};

		const data = await axios
			.post(process.env.REVOKE_URL, new URLSearchParams(body), {
				headers
			})
			.then((res) => {
				console.log('RES CODE >>> ', res.status);

				return res.data;
			})
			.catch((error) => {
				console.log('ERROR >>> ', error);
			});

		console.log('DATA >>> ', data);

		res.render('index', {
			code: '',
			access_token: 'Token Successfully Revoked!'
		});
	} catch (error) {
		console.log('ERROR >>> ', JSON.stringify(error));
		res.status(500).end();
	}
});

const buildParams = function (params) {
	const keys = Object.keys(params);
	const values = Object.entries(params);
	let str = '';

	for (let i = 0; i < values.length; i++) {
		str += keys[i] + '=' + values[i][1] + '&';
	}

	const urlParams = str.slice(0, str.length - 1);
	return urlParams;
};

const doubleScope = function (scope) {
	if (Array.isArray(scope)) {
		return `${scope[0]} ${scope[1]}`;
	}
	return scope;
};

const basicAuth = function (username, password) {
	const buff = username + ':' + password;
	return Buffer.from(buff).toString('base64');
};

module.exports = router;
