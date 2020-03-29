const functions = require('firebase-functions');
const https = functions.region("europe-west1").https;

const speechToTextApi = require('./speechToText');
const usersApi = require('./users');
const filesApi = require('./files');

// Expose Express API as a single Cloud Function:
module.exports.speechToText = https.onRequest(speechToTextApi);
module.exports.users = https.onRequest(usersApi);
module.exports.files = https.onRequest(filesApi);
