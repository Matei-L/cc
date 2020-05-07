const {checkToken} = require("./expressWrapper");
const app = require("./expressWrapper").app();
const admin = require('firebase-admin');

app.get('/:uid', checkToken, async (req, res) => {
    let uid = req.uid;
    let partnerUid = req.params.uid;
    let orders = await admin.database().ref('orders').once('value');
    orders = orders.val();
    let found = false;
    if (orders) {
        Object.values(orders).forEach((order) => {
            if ((order['buyerUid'] === uid && order['sellerUid'] === partnerUid)
                || (order['buyerUid'] === partnerUid && order['sellerUid'] === uid)) {
                if (order['messages'] && !found) {
                    found = true;
                    console.log(Object.values(order['messages']));
                    res.send(Object.values(order['messages']));
                    return null;
                } else if (!found) {
                    found = true;
                    res.send([]);
                    return null;
                }
            }
        });
    }
    if (!found)
        res.send([]);
    return null;
});

app.post('/:uid', checkToken, async (req, res) => {
    console.log("POST message");
    let uid = req.uid;
    let partnerUid = req.params.uid;
    console.log(uid);
    console.log(partnerUid);
    let orders = await admin.database().ref('orders').once('value');
    let message = req.body;
    orders = orders.val();
    for (const key of Object.keys(orders)) {
        let order = orders[key];
        if ((order['buyerUid'] === uid && order['sellerUid'] === partnerUid)
            || (order['buyerUid'] === partnerUid && order['sellerUid'] === uid)) {
            console.log(key);
            await admin.database().ref(`orders/${key}/messages`).push(message);
            break;
        }
    }
    res.send();
    return null;
});

module.exports = app;
