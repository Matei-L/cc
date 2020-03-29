// cloud services

const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp();

const speech = require('@google-cloud/speech');
const speechClient = new speech.SpeechClient();


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sensitive = require('./sensitive.js');
const app = express();

// Automatically allow requests from our clients
const whitelist = [sensitive.localClient(), sensitive.client()];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            return callback(null, true)
        } else {
            console.log(origin + ' was blocked by cors!');
            return callback(new Error('Not allowed by CORS'))
        }
    }
};
app.use(cors(corsOptions));

// Add middleware to authenticate requests
app.use((req, res, next) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.replace('Bearer ', '');
        let result;
        let success;
        try {
            result = admin.auth().verifyIdToken(token);
        } catch (e) {
            console.log('Error: token verification failed!');
        }
        success = Boolean(result);
        if (!success) {
            res.status(401)
                .header("Access-Control-Allow-Origin", "*")
                .json("Forbidden.")
                .end();
        } else {
            /**
             * in result gasesti date despre user-ul gasit in caz ca e nevoie de modificari
             */
        }
    } else {
        res.status(401)
            .header("Access-Control-Allow-Origin", "*")
            .json("Forbidden.")
            .end();
    }
    next();
});

// for body
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// -------------------------------------------------- API --------------------------------------------------------------

// build multiple CRUD interfaces:
app.post('/speechToText', async (req, res) => {
    const audioBytes = req.body;
    res.status(201)
        .json({"transcription": audioBytes})
        .end();
    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    // const audio = {
    //     content: audioBytes,
    // };
    // const config = {
    //     encoding: 'LINEAR16',
    //     sampleRateHertz: 16000,
    //     languageCode: 'en-US',
    // };
    // const request = {
    //     audio: audio,
    //     config: config,
    // };
    //
    // // Detects speech in the audio file
    // const [response] = await speechClient.recognize(request);
    // const transcription = response.results
    //     .map(result => result.alternatives[0].transcript)
    //     .join('\n');
    // console.log(`Transcription: ${transcription}`);
    //
    // res.status(201)
    //     .json({"transcription": transcription})
    //     .end();
});

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
