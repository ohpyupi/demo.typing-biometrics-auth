require('dotenv').load();

const _sharable = {
	NODE_ENV: process.env.NODE_ENV === 'production',
	PORT: process.env.PORT || 3000,
	KEYSTROKE_DNA_HOST: 'https://api.keystrokedna.com',
	KEYSTROKE_DNA_APP_ID: process.env.KEYSTROKE_DNA_APP_ID,
	KEYSTROKE_DNA_APP_SECRET: process.env.KEYSTROKE_DNA_APP_SECRET,
	MONGODB_URI: process.env.MONGODB_URI,
	GMAIL_EMAIL: process.env.GMAIL_EMAIL,
	BASE_URL: process.env.BASE_URL,
	JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET,
	JWT_TOKEN_ISSUER: 'SJSU_CMPE235',
	JWT_TOKEN_ALGORITHM: 'HS256',
	JWT_TOKEN_EXPIRES_IN: 1800000,
	IS_CHALLENGE_REQUIRED: false,
	LOCAL_STORAGE_KEY: 'local_storage_key',
	EMAIL_PROVIDER_HOST: process.env.EMAIL_PROVIDER_HOST,
	EMAIL_PROVIDER_PORT: process.env.EMAIL_PROVIDER_PORT,
	GOOGLE_OAUTH2_CLIENT_ID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
	GOOGLE_OAUTH2_SECRET: process.env.GOOGLE_OAUTH2_SECRET,
	GOOGLE_OAUTH2_REFRESH_TOKEN: process.env.GOOGLE_OAUTH2_REFRESH_TOKEN,
	GOOGLE_OAUTH2_REDIRECT_URL: process.env.GOOGLE_OAUTH2_REDIRECT_URL,
};

const dev = Object.assign({}, _sharable);
const prod = Object.assign({}, _sharable);

module.exports = process.env.NODE_ENV === 'production' ? prod : dev;
