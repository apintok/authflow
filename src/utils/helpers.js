const CryptoJS = require('crypto-js');
const chalk = require('chalk'),
	log = console.log,
	msg = chalk.bold.blue,
	scs = chalk.bold.green,
	err = chalk.bold.red,
	wrn = chalk.bold.yellow;
// --------------------------------- \\

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

const calcNonce = function () {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	nonce = text;
	return nonce;
};

const calcTimestamp = function () {
	const timeStamp = Math.round(+new Date() / 1000);
	return timeStamp;
};

const calcSignature = function (consumerSecret, tokenSecret, baseString) {
	const key = consumerSecret + '&' + tokenSecret;
	const hmacsha256Data = CryptoJS.HmacSHA256(baseString, key);
	const base64EncodedData = hmacsha256Data.toString(CryptoJS.enc.Base64);
	const signature = encodeURIComponent(base64EncodedData);

	return signature;
};

const buildBaseString = function (httpAction, url, data) {
	const timestamp = calcTimestamp();
	const nonce = calcNonce();

	let info = [];
	for (const key in data) {
		if (Object.hasOwnProperty.call(data, key)) {
			console.log(wrn('\nKEY >>> '), scs(key));
			if (key !== 'realm') {
				info.push(`${key}=${data[key]}`);
			}
		}
	}

	info.push('oauth_timestamp=' + timestamp);
	info.push('oauth_nonce=' + nonce);

	// console.log(wrn('\nINFO >>> '), wrn(info));

	const infoSorted = info.sort();
	console.log(wrn('\nSORTED >>> '), infoSorted);

	let dataString = '';
	for (let i = 0; i < infoSorted.length; i++) {
		dataString += infoSorted[i] + '&';
	}
	dataString = dataString.slice(0, dataString.length - 1);

	let baseString = httpAction + '&' + encodeURIComponent(url) + '&';
	// console.log(baseString + encodeURIComponent(dataString));

	return {
		baseString: baseString + encodeURIComponent(dataString),
		timestamp,
		nonce
	};
};

module.exports = {
	buildParams,
	doubleScope,
	basicAuth,
	buildBaseString,
	calcSignature
};
