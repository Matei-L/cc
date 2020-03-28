const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.region('europe-west1').https.onRequest((req, res) => {
    res.status(200)
        .header("Access-Control-Allow-Origin", "*")
        .json({
            "message": "Hello ;)",
            "origin": "/example"
        })
        .end();
});

