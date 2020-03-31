const app = require("./expressWrapper").app();
const admin = require('firebase-admin');

app.get('/', async (req, res) => {
    const gamesRef = admin.database().ref('games');
    /*
    await gamesRef.child('q1').set({
        name: "Overwatch",
        iconUrl: "https://clipartart.com/images/overwatch-icon-clipart-1.png"
    });
    await gamesRef.child('q2').set({
        name: "League of Legends",
        iconUrl: "https://i.pinimg.com/originals/0e/84/c7/0e84c721484c49eb8d73afba07081405.png"
    });
    await gamesRef.child('q3').set({
        name: "Borderlands 3",
        iconUrl: "https://www.kindpng.com/picc/m/0-2285_borderlands-3-game-icon-hd-png-download.png"
    });
    */
    let gamesList = await gamesRef.once('value');
    if (gamesList) {
        gamesList = Object.values(gamesList.val());
        res.status(200).json(gamesList).end();
    } else {
        res.status(201).json([]).end();
    }
});

module.exports = app;
