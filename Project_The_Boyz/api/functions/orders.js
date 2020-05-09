const {checkToken, checkAdmin} = require("./expressWrapper");
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

app.get('/reported', checkToken, checkAdmin, async (req, res) => {
    const ordersRef = admin.database().ref('orders');
    let orders = await ordersRef.once('value');
    orders = orders.val();
    let validOrders = [];
    for (const key of Object.keys(orders)) {
        let order = orders[key];
        if (order['status'] === 'finished-and-reported' || order['status'] === 'reported') {
            validOrders.push(await getReportedOrder(order, key))
        }
    }
    res.send(validOrders);
});


app.put('/updateStatus', checkToken, async (req, res) => {
    const body = req.body;
    const orderRef = admin.database().ref('orders').child(body.orderUid);
    if (body.finishedUrls) {
        await orderRef.child('finishedUrls').set(body.finishedUrls);
    }
    if (body.reportedUrls) {
        await orderRef.child('reportedUrls').set(body.reportedUrls);
    }
    if (body.finishedMessage) {
        await orderRef.child('finishedMessage').set(body.finishedMessage);
    }
    if (body.reportedMessage) {
        await orderRef.child('reportedMessage').set(body.reportedMessage);
    }
    await orderRef.child('status').set(body.status);
    res.status(200).end();
});


app.post('/', checkToken, async (req, res) => {
    console.log("Posting shit");
    const body = req.body;
    const ordersRef = admin.database().ref('orders');
    let orders = await ordersRef.once('value');
    let alreadyExists = false;
    orders = orders.val();
    if (orders) {
        for (const key of Object.keys(orders)) {
            let order = orders[key];
            if (order['buyerUid'] === body.buyerUid && order['sellerUid'] === body.sellerUid) {
                alreadyExists = true;
                const currentNrOfGames = (await admin.database().ref(`orders/${key}/nrOfGames`).once('value')).val();
                const currentStatus = (await admin.database().ref(`orders/${key}/status`).once('value')).val();
                if (currentStatus === 'ongoing') {
                    await admin.database().ref(`orders/${key}/nrOfGames`).set(parseInt(currentNrOfGames) + parseInt(body.nrOfGames));
                    await admin.database().ref(`orders/${key}/messages`).push({
                        "dateSent": admin.database.ServerValue.TIMESTAMP,
                        "fromId": body.buyerUid,
                        "message": `Hello! I would like to play ${body.nrOfGames} 
                        ${body.nrOfGames > 1 ? 'more games' : 'more game'} with you`,
                        "toId": body.sellerUid,
                        "type": 1
                    });
                } else {
                    await admin.database().ref(`orders/${key}/nrOfGames`).set(body.nrOfGames);
                    await admin.database().ref(`orders/${key}/status`).set('ongoing');
                    await admin.database().ref(`orders/${key}/messages`).set({
                        first: {
                            "dateSent": admin.database.ServerValue.TIMESTAMP,
                            "fromId": body.buyerUid,
                            "message": `Hello! I would like to play ${body.nrOfGames} 
                    ${body.nrOfGames > 1 ? 'games' : 'game'} with you`,
                            "toId": body.sellerUid,
                            "type": 1
                        }
                    });
                }
                break;
            }
        }
    }
    if (!alreadyExists) {
        const ordersRef = admin.database().ref('orders').child(body.uid);
        await ordersRef.set({
            buyerUid: body.buyerUid,
            sellerUid: body.sellerUid,
            nrOfGames: body.nrOfGames,
            messages: {
                first: {
                    "dateSent": admin.database.ServerValue.TIMESTAMP,
                    "fromId": body.buyerUid,
                    "message": `Hello! I would like to play ${body.nrOfGames} 
                    ${body.nrOfGames > 1 ? 'games' : 'game'} with you`,
                    "toId": body.sellerUid,
                    "type": 1
                }
            },
            // status can be 'ongoing', 'finished' and 'reported'
            status: body.status
        });
    }
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
                        role: (pairUserId === orders[uid].buyerUid) ? 'buyer' : 'seller',
                        orderUid: uid
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

app.get('/:uid', checkToken, checkAdmin, async (req, res) => {
    let orderUid = req.params.uid;
    let order = await admin.database().ref(`orders/${orderUid}`).once('value');
    order = order.val();
    if (!order) {
        res.status(404).send();
        return null;
    }
    res.send(await getReportedOrder(order, orderUid));
});

async function getReportedOrder(order, uid) {
    return new Promise(async resolve => {
        let buyer = admin.database().ref(`users/${order.buyerUid}`).once('value');
        let seller = admin.database().ref(`users/${order.sellerUid}`).once('value');
        await Promise.all([buyer, seller]).then((values => {
            buyer = values[0].val();
            seller = values[1].val();
            order.buyer = buyer;
            order.buyer.uid = order.buyerUid;
            order.messages = Object.values(order.messages);
            order.seller = seller;
            order.seller.uid = order.sellerUid;
            order.uid = uid;
            delete order.buyerUid;
            delete order.sellerUid;
            resolve(order);
        }));
    })
}

module.exports = app;
