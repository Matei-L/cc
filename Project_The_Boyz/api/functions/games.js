const app = require("./expressWrapper").app();
const admin = require('firebase-admin');

app.get('/', async (req, res) => {
    const gamesRef = admin.database().ref('games');
    // only locally
    // /*
    await gamesRef.child('q1').set({
        name: "Overwatch",
        iconUrl: "https://cdn.iconscout.com/icon/free/png-512/overwatch-2-569226.png"
    });
    await gamesRef.child('q2').set({
        name: "League of Legends",
        iconUrl: "https://i.pinimg.com/originals/0e/84/c7/0e84c721484c49eb8d73afba07081405.png"
    });
    await gamesRef.child('q3').set({
        name: "Borderlands 3",
        iconUrl: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/46b63d3c-ae67-464c-9a37-670829b2a157/dd3p5k4-f0b341c8-c5ea-4b4c-8e11-1fc99bf56414.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvNDZiNjNkM2MtYWU2Ny00NjRjLTlhMzctNjcwODI5YjJhMTU3XC9kZDNwNWs0LWYwYjM0MWM4LWM1ZWEtNGI0Yy04ZTExLTFmYzk5YmY1NjQxNC5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.9Aqpe13QI-5mt154anxWnFmvPJVj7xoohmlERYUx-lQ"
    });
    // */
    let gamesList = await gamesRef.once('value');
    if (gamesList) {
        gamesList = Object.values(gamesList.val());
        res.status(200).json(gamesList).end();
    } else {
        res.status(201).json([]).end();
    }
});

module.exports = app;
