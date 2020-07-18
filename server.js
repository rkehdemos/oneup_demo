const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./server-config.json');
const wretch = require('wretch');

const CONFIG_PATH = './server-config.json';
const REFRESH = 'refresh_token';
const ALLOWED_HOST = 'http://localhost:3000';

const {refresh_url, patient_url} = config.urls;
const client_id = process.env.ClientId;
const client_secret = process.env.ClientSecret;

let {access_token, refresh_token} = config.tokens;
let expiration = parseInt(config.tokens.expiration, 10);

const saveToken = (access_token, refresh_token, expiration) => {
	fs.readFile(CONFIG_PATH, (err, data) => {
		if (err) {
			return;
		}
		const config = JSON.parse(data);

		config.tokens = {
			access_token,
			refresh_token,
			expiration
		}

		fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), err => {
			console.log(err);
		});
	});
}

const corsOptions = {
  origin(origin, callback) {
    if ([ALLOWED_HOST].includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const app = express();
app.use(helmet());
app.use(cors(corsOptions));

app.post('/getAuthToken', (req, res) => {
	if (req.query.expiration != expiration && Date.now() > expiration) {
		return res.send({access_token, expiration, error: false})
	}

	wretch(refresh_url)
		.polyfills({fetch: require('node-fetch')})
		.post({client_id, client_secret, refresh_token, grant_type: REFRESH})
		.json(json => {
			const {expires_in} = json;
			expiration = Date.now() + parseInt(expires_in, 10) * 1000;
			access_token = json.access_token;
			refresh_token = json.refresh_token;

			saveToken(access_token, refresh_token, expiration)
			return res.send({access_token, expiration, error: false});
		})
		.catch(e => {
			console.log(e);
			return res.send({access_token: null, expiration: Math.infinity, error: true})
		});
})

app.listen(3001);

