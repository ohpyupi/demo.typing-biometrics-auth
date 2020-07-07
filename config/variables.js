require('dotenv').load();

const _sharable = {
	NODE_ENV: process.env.NODE_ENV === 'production',
	PORT: process.env.PORT || 3000,
	KEYSTROKE_DNA_HOST: 'https://api.keystrokedna.com',
	KEYSTROKE_DNA_APP_ID: process.env.KEYSTROKE_DNA_APP_ID,
	KEYSTROKE_DNA_APP_SECRET: process.env.KEYSTROKE_DNA_APP_SECRET,
	MONGODB_URI: process.env.MONGODB_URI,
};

const dev = Object.assign({}, _sharable);
const prod = Object.assign({}, _sharable);

module.exports = process.env.NODE_ENV === 'production' ? prod : dev;
