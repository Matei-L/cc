const createHandler = require("azure-function-express").createHandler;
const app = require("../utils/expressWrapper").app();
const passport = require("../utils/expressWrapper").passport();
const prefix = "/api/games";
const sensitive = require('../utils/sensitive');
const url = sensitive.databaseUrl();
const mongoClient = require("mongodb").MongoClient;

app.get(prefix + "/", async (req, res) => {
    await mongoClient.connect(url, function (err, client) {
        let db = client.db('the-boyz');
        let cursor = db.collection('games').find();
        let games = [];
        cursor.each(function (err, doc) {
            if (doc != null) {
                delete doc._id;
                games.push(doc);
            } else {
                res.send(games);
            }
        });
    });
});

const premadeGames = [
    {
        checked: false,
        iconUrl: "https://clipartart.com/images/overwatch-icon-clipart-1.png",
        name: "Overwatch"
    }, {
        checked: false,
        iconUrl: "https://i.pinimg.com/originals/0e/84/c7/0e84c721484c49eb8d73afba07081405.png",
        name: "League Of Legends"
    }, {
        checked: false,
        iconUrl: "https://www.kindpng.com/picc/m/0-2285_borderlands-3-game-icon-hd-png-download.png",
        name: "Borderlands 3"
    },
];

app.post(prefix + '/', async (req, res) => {
    await mongoClient.connect(url, function (err, client) {
        let db = client.db('the-boyz');
        premadeGames.forEach((game) => {
            db.collection('games').insertOne(game, function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(400);
                    res.send(null);
                }
            });
            console.log("All premade games inserted");
            res.send(null);
        })
    });
});

// Binds the express app to an Azure Function handler
module.exports = createHandler(app);
