const createHandler = require("azure-function-express").createHandler;
const app = require("../utils/expressWrapper").app();
const passport = require("../utils/expressWrapper").passport();
const prefix = "/api/users";
const sensitive = require('../utils/sensitive');
const url = sensitive.databaseUrl();
const mongoClient = require("mongodb").MongoClient;


app.get(prefix + "/", async(req, res) => {
    await mongoClient.connect(url, function(err, client) {
        let db = client.db('the-boyz');
        let cursor = db.collection('users').find();
        let users = [];
        cursor.each(function(err, doc) {
            if (doc != null && doc.description) {
                delete doc._id;
                users.push(doc);
            } else {
                res.send(users);
            }
        });
    });
});

app.post(prefix + '/', passport.authenticate('oauth-bearer', { session: false }), async(req, res) => {
    let body = req.body;
    if (!body) {
        res.status(400);
        res.send(null);
    }
    console.log("----------------------------------------------------------------------------");
    console.log("POST");
    console.log(req);
    console.log("----------------------------------------------------------------------------");

    await mongoClient.connect(url, function(err, client) {
        let db = client.db('the-boyz');
        db.collection('users').insertOne({
            uid: body.uid,
            email: body.email,
            nickname: body.nickname,
            description: body.description,
            photoUrl: body.photoUrl ? body.photoUrl.replace('@', '%40') : undefined,
            audioUrl: body.audioUrl ? body.audioUrl.replace('@', '%40') : undefined,
            games: []
        }, function(err, result) {
            if (err) {
                console.log(err);
                res.status(400);
                res.send(null);
            } else {
                console.log("Inserted a new user in the db");
                res.status(200);
                res.send(null);
            }
        });
    });
});
app.put(prefix + '/',  passport.authenticate('oauth-bearer', { session: false }), async(req, res) => {
    console.log("----------------------------------------------------------------------------");
    console.log("PUT USER");
    console.log(req);
    console.log("----------------------------------------------------------------------------");
    const body = req.body;
    let updatedUser = {};
    if (body.email) {
        updatedUser.email = body.email;
    }
    if (body.nickname) {
        updatedUser.nickname = body.nickname;
    }
    if (body.description) {
        updatedUser.description = body.description;
    }
    if (body.photoUrl) {
        updatedUser.photoUrl = body.photoUrl;
    }
    if (body.audioUrl) {
        updatedUser.audioUrl = body.audioUrl;
    }
    if (body.games) {
        updatedUser.games = body.games;
    }
    await mongoClient.connect(url, function(err, client) {
        let db = client.db('the-boyz');
        db.collection('users').updateOne({ "uid": body.uid }, {
            $set: updatedUser
        }, function(err, results) {
            console.log(results);
        });
        res.send(null);
    });
});

app.get(prefix + '/:uid', async(req, res) => {
    console.log("----------------------------------------------------------------------------");
    console.log("GET BY UID");
    console.log("----------------------------------------------------------------------------");
    await mongoClient.connect(url, function(err, client) {
        let db = client.db('the-boyz');
        let cursor = db.collection('users').find({ uid: req.params.uid });
        cursor.each(function(err, doc) {
            if (doc != null) {
                delete doc._id;
                res.send(doc);
                res.end();
            } else {
                res.send({}).end();
            }
        });
    });
});
// Binds the express app to an Azure Function handler
module.exports = createHandler(app);