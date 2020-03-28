const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp();

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

exports.getAllUsers = functions.region("europe-west1").https.onRequest(async (req, res) => {
    let ok = await checkToken(req, res);
    if (!ok) return null;
    res.send({
        success: true,
        message: "All good"
    })
});

exports.speechToText = functions.region("europe-west1").https.onRequest(async (req, res) => {
    let ok = await checkToken(req, res);
    if (!ok) return null;
    console.log(req);
    res.status(201).end();
});


async function checkToken(req, res) {
    let token = req.headers.authorization.replace('Bearer ', '');
    let result;
    let success;
    try {
        result = await admin.auth().verifyIdToken(token);
    } catch (e) {
        console.log('Error: token verification failed!');
    }
    success = Boolean(result);
    if (!success) {
        res.status(401)
            .header("Access-Control-Allow-Origin", "*")
            .json({
                success: false,
                message: "No user found"
            })
            .end();
        return false
    } else {
        /**
         * in result gasesti date despre user-ul gasit in caz ca e nevoie de modificari
         */
        return true;
    }
}
