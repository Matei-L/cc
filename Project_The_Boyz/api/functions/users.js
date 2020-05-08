const {checkToken} = require("./expressWrapper");
const app = require("./expressWrapper").app();
const admin = require('firebase-admin');

app.get('/', async (req, res) => {
    const usersRef = admin.database().ref('users');
    let users = await usersRef.once('value');
    users = users.val();
    if (users) {
        let validUsers = [];
        Object.keys(users).forEach((uid) => {
            if (users[uid].paypalEmail && users[uid].paypalEmail.length > 0 && users[uid].price && users[uid].price > 0) {
                users[uid].uid = uid;
                users[uid].games = Object.values(users[uid].games);
                validUsers.push(users[uid]);
            }
        });
        res.status(200).json(validUsers).end();
    } else {
        res.status(204).json([]).end();
    }
});

app.post('/', checkToken, async (req, res) => {
    const body = req.body;
    const userRef = admin.database().ref('users').child(body.uid);
    await userRef.child('email').set(body.email);
    await userRef.child('isAdmin').set(false);
    await userRef.child('nickname').set(body.nickname);
    if (body.price) {
        await userRef.child('price').set(body.price);
    }
    if (body.paypalEmail) {
        await userRef.child('paypalEmail').set(body.paypalEmail);
    }
    await userRef.child('description').set(body.description);
    await userRef.child('photoUrl').set(body.photoUrl.replace('@', '%40'));
    await userRef.child('audioUrl').set(body.audioUrl.replace('@', '%40'));
    res.status(201).end();
});

app.put('/', checkToken, async (req, res) => {
    const body = req.body;
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
    if (body.paypalEmail) {
        await userRef.child('paypalEmail').set(body.paypalEmail);
    }
    if (body.price) {
        await userRef.child('price').set(body.price);
    }
    if (body.photoUrl) {
        await userRef.child('photoUrl').set(body.photoUrl.replace('@', '%40'));
    }
    if (body.audioUrl) {
        await userRef.child('audioUrl').set(body.audioUrl.replace('@', '%40'));
    }
    if (body.games) {
        const userGamesRef = userRef.child('games');
        for (let i = 0; i < body.games.length; i++)
            userGamesRef.child(`q${i}`).set(body.games[i])
    }
    res.status(200).end();
});

app.get('/:uid', async (req, res) => {
    const uid = req.params.uid;
    const userRef = admin.database().ref('users').child(uid);
    await userRef.once("value", (snapshot) => {
        let user = snapshot.val();
        if (user && user.games) {
            user.games = Object.values(user.games);
        }
        if (user) {
            user.uid = uid;
        }
        res.status(200).json(user).end();
    }, (errorObject) => {
        console.log("The read failed: " + errorObject.code);
    });
});

module.exports = app;
