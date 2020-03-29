const app = require("./expressWrapper")();
const admin = require('firebase-admin');

app.post('/', async (req, res) => {
    const body = req.body;
    console.log(body);
    const userRef = admin.database().ref('users').child(body.uid);
    await userRef.child('email').set(body.email);
    await userRef.child('nickname').set(body.nickname);
    await userRef.child('description').set(body.description);
    await userRef.child('photoUrl').set(body.photoUrl.replace('@','%40'));
    await userRef.child('audioUrl').set(body.audioUrl.replace('@','%40'));
    res.status(201).end();
});

app.put('/', async (req, res) => {
    const body = req.body;
    console.log(body);
    const userRef = admin.database().ref('users').child(body.uid);
    if (body.email) {
        await userRef.child('email').set(body.email);
    }
    if (body.nickname) {
        await userRef.child('nickname').set(body.nickname);
    }
    if (body.description) {
        await userRef.child('description').set(body.description);
    }
    if (body.photoUrl) {
        await userRef.child('photoUrl').set(body.photoUrl.replace('@','%40'));
    }
    if (body.audioUrl) {
        await userRef.child('audioUrl').set(body.audioUrl.replace('@','%40'));
    }
    res.status(200).end();
});

app.get('/:uid', async (req, res) => {
    const uid = req.params.uid;
    console.log(uid);
    const userRef = admin.database().ref('users').child(uid);
    await userRef.once("value", (snapshot) => {
        console.log(snapshot.val());
        res.status(200).json(snapshot.val()).end();
    }, (errorObject) => {
        console.log("The read failed: " + errorObject.code);
    });
});

module.exports = app;
