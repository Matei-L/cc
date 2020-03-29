const app = require("./expressWrapper")();
const admin = require('firebase-admin');

app.post('/', async (req, res) => {
    const body = req.body;
    const userRef = admin.database().ref('users').child(body.uid);
    await userRef.child('email').set(body.email);
    await userRef.child('nickname').set(body.nickname);
    await userRef.child('description').set(body.description);
    await userRef.child('photoUrl').set(body.photoUrl);
    await userRef.child('audioUrl').set(body.audioUrl);
    res.status(201).end();
});

app.put('/', async (req, res) => {
    const body = req.body;
    const userRef = admin.database().ref('users').child(body.uid);
    await userRef.child('email').set(body.email);
    await userRef.child('nickname').set(body.nickname);
    await userRef.child('description').set(body.description);
    await userRef.child('photoUrl').set(body.photoUrl);
    await userRef.child('audioUrl').set(body.audioUrl);
    res.status(200).end();
});

app.get('/:uid', async (req, res) => {
    const uid = req.params.uid;
    const userRef = admin.database().ref('users').child(uid);
    userRef.on("value", (snapshot) => {
        console.log(snapshot.val());
        res.status(200).json(snapshot.val()).end();
    }, (errorObject) => {
        console.log("The read failed: " + errorObject.code);
    });
});

module.exports = app;
