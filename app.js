const express = require('express');
const dotenv = require('dotenv');
const https = require('https');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 8080;
const authTwoRoutes = require('./src/routes/auth2Routes');
const mainRoutes = require('./src/routes/mainRoutes');
const app = express();
// --------------------------------------------------------- \\

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

// ROUTES
app.use(authTwoRoutes);
app.use(mainRoutes);

const server = https.createServer(options, app);
server.listen(port, () => {
	console.log(`\nServer Running on Port -> ${port}\n`);
});
