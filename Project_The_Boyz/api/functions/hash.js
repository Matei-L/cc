const {checkToken} = require("./expressWrapper");
const app = require("./expressWrapper").app();
const crypto = require('crypto');

app.get('/:uid1/:uid2', checkToken, async (req, res) => {
    const uid1 = req.params.uid1;
    const uid2 = req.params.uid2;
    const hash = crypto.createHash('sha256').update(uid1).update(uid2).digest('hex');
    res.status(200).json({hash: hash}).end();
});

app.get('/check/:uid1/:uid2/:hash', checkToken, async (req, res) => {
    const uid1 = req.params.uid1;
    const uid2 = req.params.uid2;
    const hash = req.params.hash;
    if (hash === crypto.createHash('sha256').update(uid1).update(uid2).digest('hex')) {
        res.status(200).json({ok: true}).end();
    } else {
        console.log(hash);
        console.log(createHash('sha256').update(uid1).update(uid2).digest('hex'));
        res.status(200).json({ok: false}).end();
    }
});

module.exports = app;
