const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const https = require('https');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 8080;
const app = express();
// -------------------------------------- \\

dotenv.config({ path: './config.env' });

const options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
};

const publicDir = express.static(path.join(__dirname, 'public'));
const cssDir = express.static(path.join(__dirname, 'public/css'));
const jsDir = express.static(path.join(__dirname, 'public/js'));

app.use(publicDir);
app.use(cssDir);
app.use(jsDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	console.log(req.query);
	res.render('index', {
		code: req.query,
		access_token: ''
	});
});

app.get('/v1/oauth2', (req, res) => {
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

app.post('/v1/oauth2', async (req, res) => {
	try {
		const body = {
			code: req.body.code,
			redirect_uri: req.body.redirect_uri_post,
			grant_type: 'authorization_code'
		};
		console.log('POST - BODY >>> ', body);

		const username = process.env.CLIENTID;
		const password = process.env.CLIENTSECRET;

		const buff = username + ':' + password;
		const encode = Buffer.from(buff).toString('base64');

		const headers = {
			Accept: '*/*',
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: 'Basic ' + encode
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
			code: body.code,
			access_token: JSON.stringify(data, null, 2)
		});
	} catch (error) {
		console.log('ERROR >>> ', JSON.stringify(error));
		res.status(500).end();
	}
});

app.all('*', (req, res) => {
	res.status(404).send('Page Not Found');
});

const server = https.createServer(options, app);
server.listen(port, () => {
	console.log(`\nServer Running on Port -> ${port}\n`);
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
