const functions = require('firebase-functions');
const https = functions.region("europe-west1").https;

const speechToTextApi = require('./speechToText');

// Expose Express API as a single Cloud Function:
module.exports.speechToText = https.onRequest(speechToTextApi);
