const {checkToken} = require("./expressWrapper");
const app = require("./expressWrapper").app();
const admin = require('firebase-admin');

app.post('/', checkToken, async (req, res) => {
    console.log("Posting shit");
    const body = req.body;
    console.log(body);
    const ordersRef = admin.database().ref('orders').child(body.uid);
    await ordersRef.child('buyerUid').set(body.buyerUid);
    await ordersRef.child('sellerUid').set(body.sellerUid);
    await ordersRef.child('nrOfGames').set(body.nrOfGames);
    // status can be 'ongoing', 'finished' and 'reported'
    await ordersRef.child('status').set(body.status);
    res.status(201).end();
});

module.exports = app;
