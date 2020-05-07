const {checkToken} = require("./expressWrapper");
const app = require("./expressWrapper").app();
const admin = require('firebase-admin');

app.get('/', checkToken, async (req, res) => {
    const uid = req.uid;
    const ordersRef = admin.database().ref('orders');
    let orders = await ordersRef.once('value');
    orders = orders.val();
    let validOrders = [];
    if (orders) {
        Object.keys(orders).forEach((key) => {
            let order = orders[key];
            if (order['buyerUid'] === uid || order['sellerUid'] === uid) {
                order.key = key;
                validOrders.push(order);
            }
        });
    }
    res.send(validOrders);
});

app.post('/', checkToken, async (req, res) => {
    console.log("Posting shit");
    const body = req.body;
    console.log(body);
    const ordersRef = admin.database().ref('orders').child(body.uid);
    await ordersRef.set({
        buyerUid: body.buyerUid,
        sellerUid: body.sellerUid,
        nrOfGames: body.nrOfGames,
        messages: {first: {
            "dateSent": admin.database.ServerValue.TIMESTAMP,
            "fromId": body.buyerUid,
            "message": `Hello! I would like to play ${body.nrOfGames} games with you`,
            "toId": body.sellerUid,
            "type": 1
        }},
        // status can be 'ongoing', 'finished' and 'reported'
        status: body.status
    });
    res.status(201).end();
});

app.get('/byUser/:userId', checkToken, async (req, res) => {
    const userId = req.params.userId;
    const ordersRef = admin.database().ref('orders');
    let orders = await ordersRef.once('value');
    orders = orders.val();
    if (orders) {
        let validOrders = [];
        for (const uid of Object.keys(orders)) {
            if (orders[uid].buyerUid === userId || orders[uid].sellerUid === userId) {
                let statusId = 0;
                const pairUserId = (userId === orders[uid].sellerUid) ? orders[uid].buyerUid : orders[uid].sellerUid;
                const userRef = admin.database().ref('users').child(pairUserId);
                await userRef.once("value", (snapshot) => {
                    const pairUser = snapshot.val();
                    switch (orders[uid].status) {
                        case 'finished':
                            statusId = 3;
                            break;
                        case 'reported':
                            statusId = 1;
                            break;
                        case 'finished-and-reported':
                            statusId = 1;
                            break;
                        default:
                            statusId = 0;
                    }
                    validOrders.push({
                        participantType: 0,
                        id: pairUserId,
                        displayName: pairUser.nickname,
                        avatar: pairUser.photoUrl,
                        status: statusId,
                        statusExplained: orders[uid].status,
                        role: (pairUserId === orders[uid].buyerUid) ? 'buyer' : 'seller'
                    });
                }, (errorObject) => {
                    console.log("The read failed: " + errorObject.code);
                });
            }
        }
        res.status(200).json(validOrders).end();
    } else {
        res.status(200).json([]).end();
    }
});

module.exports = app;
