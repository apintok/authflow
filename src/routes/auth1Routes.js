const express = require('express');
const axios = require('axios');
const { buildParams, buildBaseString, calcSignature } = require('../utils/helpers');
const router = express.Router();

const version = '1.0';
const protocol = 'https://';
let realm = '';
let consumerKey = '';
let consumerSecret = '';
let tokenSecret = '';

router.post('/v1/oauth1/obtain', async (req, res) => {
	try {
		console.log('OBTAIN BODY >>> ', req.body);
		realm = req.body.realm;
		consumerKey = req.body.oauth_consumer_key;
		consumerSecret = req.body.consumersecret;

		const baseStringData = {
			oauth_consumer_key: consumerKey,
			oauth_callback: encodeURIComponent('https://localhost:8080/v1/authflow/one'),
			oauth_signature_method: 'HMAC-SHA256',
			oauth_version: '1.0'
		};

		const url = protocol + realm.toLowerCase() + process.env.OBTAIN_URL;
		const baseString = buildBaseString(req.method, url, baseStringData);
		console.log('\nBase String >>> ', baseString);

		const signature = calcSignature(consumerSecret, '', baseString.baseString);
		console.log(signature);

		const headers = {
			Accept: '*/*',
			'Content-Type': 'application/json',
			Authorization: `OAuth realm="${realm}", oauth_consumer_key="${req.body.oauth_consumer_key}", oauth_nonce="${
				baseString.nonce
			}", oauth_timestamp="${baseString.timestamp}", oauth_signature_method="${
				req.body.oauth_signature_method
			}", oauth_version="${req.body.oauth_version}", oauth_callback="${encodeURIComponent(
				req.body.oauth_callback
			)}", oauth_signature="${signature}"`
		};

		console.log('\nHEADER >>> ', headers);

		const data = await axios
			.post(url, '', { headers })
			.then((res) => {
				console.log('RES CODE >>> ', res.status);

				return res.data;
			})
			.catch((error) => {
				console.log('ERROR AXIOS >>> ', error);
			});

		console.log('\nDATA >>> ', data);

		const values = data.split('&');
		console.log(values);
		const authToken = values[0].split('=');
		console.log(authToken[1]);
		const authTokenSecret = values[1].split('=');
		console.log(authTokenSecret[1]);
		tokenSecret = authTokenSecret[1];

		res.render('authOne', {
			home: 'Home',
			version,
			oauth_token: authToken[1],
			code: '',
			data: values
		});
	} catch (error) {
		console.log('ERROR STEP 1 >>> ', JSON.stringify(error));
		res.status(500).end();
	}
});

router.get('/v1/oauth1/authorize', async (req, res) => {
	try {
		console.log('QUERY >>> ', req.query);

		const redirectURL = protocol + realm.toLowerCase() + process.env.AUTH_TOKEN_URL;
		console.log('\nREDIRECT URL >>> ', redirectURL);
		const params = {
			oauth_token: req.query.oauth_token
		};
		console.log('PARAMS >>> ', params);
		const urlParams = buildParams(params);

		res.redirect(redirectURL + urlParams);
	} catch (error) {
		console.log('ERROR STEP 2 >>> ', JSON.stringify(error));
		res.status(500).end();
	}
});

router.post('/v1/oauth1/exchange', async (req, res) => {
	try {
		console.log('EXCHANGE BODY >>> ', req.body);
		req.body.oauth_consumer_key = consumerKey;

		const url = protocol + realm.toLowerCase() + process.env.EXCHGE_URL;
		const baseString = buildBaseString(req.method, url, req.body);
		console.log('\nBase String >>> ', baseString);
		const signature = calcSignature(consumerSecret, tokenSecret, baseString.baseString);
		console.log('\nSIGNATURE >>> ', signature);

		const headers = {
			Accept: '*/*',
			'Content-Type': 'application/json',
			Authorization: `OAuth realm="${realm}", oauth_token="${req.body.oauth_token}", oauth_consumer_key="${consumerKey}", oauth_nonce="${baseString.nonce}", oauth_timestamp="${baseString.timestamp}", oauth_signature_method="${req.body.oauth_signature_method}", oauth_version="${req.body.oauth_version}", oauth_verifier="${req.body.oauth_verifier}", oauth_signature="${signature}"`
		};

		console.log('\nHEADER >>> ', headers);

		const data = await axios
			.post(url, '', { headers })
			.then((res) => {
				console.log('RES CODE >>> ', res.status);

				return res.data;
			})
			.catch((error) => {
				console.log('ERROR AXIOS >>> ', error);
			});

		console.log('\nDATA >>> ', data);

		const values = data.split('&');
		console.log(values);
		const authToken = values[0].split('=');
		console.log(authToken[1]);
		const authTokenSecret = values[1].split('=');
		console.log(authTokenSecret[1]);

		res.render('authOne', {
			home: 'Home',
			version,
			oauth_token: authToken[1],
			code: '',
			data: values
		});
	} catch (error) {
		console.log('ERROR STEP 3 >>> ', JSON.stringify(error));
		res.status(500).end();
	}
});

module.exports = router;
