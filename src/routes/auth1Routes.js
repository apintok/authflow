const express = require('express');
const axios = require('axios');
const { buildParams, buildBaseString, calcSignature } = require('../utils/helpers');
const router = express.Router();

const version = '1.0';

router.post('/v1/oauth1/obtain', async (req, res) => {
	try {
		console.log('BODY >>> ', req.body);

		const baseString = buildBaseString(req.method, process.env.OBTAIN_URL, req.body);
		console.log('\nBase String >>> ', baseString);
		const signature = calcSignature(req.body.consumersecret, '', baseString.baseString);
		console.log(signature);

		const headers = {
			Accept: '*/*',
			'Content-Type': 'application/json',
			Authorization: `OAuth realm="${req.body.realm}", oauth_consumer_key="${req.body.oauth_consumer_key}", oauth_nonce="${
				baseString.nonce
			}", oauth_timestamp="${baseString.timestamp}", oauth_signature_method="${
				req.body.oauth_signature_method
			}", oauth_version="${req.body.oauth_version}", oauth_callback="${encodeURIComponent(
				req.body.oauth_callback
			)}", oauth_signature="${signature}"`
		};

		console.log('\nHEADER >>> ', headers);

		const data = await axios
			.post(process.env.OBTAIN_URL, '', {
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

		res.render('authOne', {
			home: 'Home',
			version,
			code: '',
			access_token: data
		});
	} catch (error) {
		console.log('ERROR STEP 1 >>> ', JSON.stringify(error));
		res.status(500).end();
	}
});

module.exports = router;
