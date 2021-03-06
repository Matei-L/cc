const admin = require('firebase-admin');
admin.initializeApp();

const express = (requiresToken = true) => {
    const express = require("express");
    const cors = require("cors");
    const bodyParser = require('body-parser');
    const sensitive = require('./sensitive.js');


    const app = express();

    // Automatically allow requests from our clients
    const whitelist = [sensitive.localClient(), sensitive.client()];
    const corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1 || !origin) {
                return callback(null, true)
            } else {
                console.log(origin + ' was blocked by cors!');
                return callback(new Error('Not allowed by CORS'))
            }
        }
    };
    app.use(cors(corsOptions));

    // for body
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    return app;
};

const checkToken = (req, res, next) => {
    // Add middleware to authenticate requests
    if (req.headers.authorization) {
        let token = req.headers.authorization.replace('Bearer ', '');
        let result;
        let success;
        try {
            result = admin.auth().verifyIdToken(token);
        } catch (e) {
            console.log('Error: token verification failed!');
        }
        success = Boolean(result);
        if (!success) {
            res.status(401)
                .header("Access-Control-Allow-Origin", "*")
                .json("Forbidden.")
                .end();
        } else {
            /**
             * in result gasesti date despre user-ul gasit in caz ca e nevoie de modificari
             */
        }
    } else {
        res.status(401)
            .header("Access-Control-Allow-Origin", "*")
            .json("Forbidden.")
            .end();
    }
    next();
};


module.exports = {
    app: express,
    checkToken: checkToken
};
