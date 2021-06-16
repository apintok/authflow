const express = require('express');
const axios = require('axios');
const { buildParams, doubleScope, basicAuth } = require('../utils/helpers');
const router = express.Router();

const version = '2.0';

router.get('/v1/oauth2', (req, res) => {
	try {
		const redirectURL = process.env.AUTH_URL;
		console.log(redirectURL);
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
		console.log('ERROR STEP 1 >>> ', JSON.stringify(error));
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
				console.log('RES >>> ', res);
				console.log('RES CODE >>> ', res.status);

				return res.data;
			})
			.catch((error) => {
				console.log('ERROR AXIOS >>> ', error);
			});

		console.log('DATA >>> ', data);

		res.render('authTwo', {
			home: 'Home',
			version,
			code: body.code,
			access_token: JSON.stringify(data, null, 2)
		});
	} catch (error) {
		console.log('ERROR STEP 2 >>> ', JSON.stringify(error));
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

		res.render('authTwo', {
			home: 'Home',
			version,
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
			home: 'Home',
			version,
			code: '',
			access_token: 'Token Successfully Revoked!'
		});
	} catch (error) {
		console.log('ERROR >>> ', JSON.stringify(error));
		res.status(500).end();
	}
});

module.exports = router;
